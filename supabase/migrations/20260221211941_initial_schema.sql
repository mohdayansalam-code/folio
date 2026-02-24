-- Folio Supabase MVP Schema & Security Architecture

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. GLOBAL TRIGGER FUNCTIONS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. TABLES

-- workspaces: Billing and ownership boundary
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_id UUID REFERENCES auth.users(id) NOT NULL,
    plan TEXT CHECK (plan IN ('free', 'pro', 'agency')) DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- workspace_members: Agencies and collaborators
CREATE TABLE workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    role TEXT CHECK (role IN ('owner', 'editor', 'viewer')) DEFAULT 'owner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

-- clients: Top-level record for ghostwriting target
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    niche TEXT,
    linkedin_url TEXT,
    status TEXT CHECK (status IN ('active', 'paused')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- client_brain: Voice memory and core moat
CREATE TABLE client_brain (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE UNIQUE NOT NULL,
    voice_tone TEXT,
    signature_stories TEXT,
    offer_positioning TEXT,
    proof_results TEXT,
    ai_status TEXT CHECK (ai_status IN ('idle', 'processing', 'ready', 'failed')) DEFAULT 'idle',
    last_processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- content_packs: Weekly generation unit
CREATE TABLE content_packs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
    week_start_date DATE NOT NULL,
    ai_status TEXT CHECK (ai_status IN ('idle', 'processing', 'ready', 'failed')) DEFAULT 'idle',
    generated_ideas_count INT DEFAULT 0,
    generated_drafts_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_id, week_start_date)
);

-- posts: The drafting, approval, and scheduling pipeline
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
    content_pack_id UUID REFERENCES content_packs(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    body TEXT,
    status TEXT CHECK (status IN ('idea', 'draft', 'approved', 'scheduled', 'posted')) DEFAULT 'idea',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- performance_metrics: MVP-light ROI proof
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
    week_start_date DATE NOT NULL,
    impressions INT DEFAULT 0,
    replies INT DEFAULT 0,
    calls INT DEFAULT 0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, week_start_date)
);

-- 4. ATTACH TRIGGERS

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_client_brain_updated_at BEFORE UPDATE ON client_brain FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_content_packs_updated_at BEFORE UPDATE ON content_packs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 5. PERFORMANCE INDEXES

CREATE INDEX idx_clients_workspace ON clients(workspace_id);
CREATE INDEX idx_posts_client ON posts(client_id);
CREATE INDEX idx_posts_scheduled ON posts(scheduled_at);
CREATE INDEX idx_contentpacks_client ON content_packs(client_id);
CREATE INDEX idx_metrics_post ON performance_metrics(post_id);

-- 6. ROW LEVEL SECURITY (RLS) setup

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_brain ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- 1. workspaces RLS: owners & members
CREATE POLICY "Workspaces flow" ON workspaces FOR SELECT USING (
    auth.uid() = owner_id OR id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
);
CREATE POLICY "Workspaces insert" ON workspaces FOR INSERT WITH CHECK (
    auth.uid() = owner_id
);

-- 2. workspace_members RLS: Terminal Check
CREATE POLICY "Members viewable self" ON workspace_members FOR SELECT USING (
    user_id = auth.uid()
);

-- 3. clients RLS: Inherit via workspace_members
CREATE POLICY "Clients flow" ON clients FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
);

-- 4. client_brain RLS: Inherit via clients
CREATE POLICY "Client Brain flow" ON client_brain FOR ALL USING (
    client_id IN (
        SELECT id FROM clients WHERE workspace_id IN (
            SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
        )
    )
);

-- 5. content_packs RLS
CREATE POLICY "Content Packs flow" ON content_packs FOR ALL USING (
    client_id IN (
        SELECT id FROM clients WHERE workspace_id IN (
            SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
        )
    )
);

-- 6. posts RLS
CREATE POLICY "Posts flow" ON posts FOR ALL USING (
    client_id IN (
        SELECT id FROM clients WHERE workspace_id IN (
            SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
        )
    )
);

-- 7. performance_metrics RLS
CREATE POLICY "Metrics flow" ON performance_metrics FOR ALL USING (
    post_id IN (
        SELECT id FROM posts WHERE client_id IN (
            SELECT id FROM clients WHERE workspace_id IN (
                SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
            )
        )
    )
);

-- 8. AUTO-WORKSPACE TRIGGER for Onboarding
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_workspace_id uuid;
BEGIN
  -- Insert a default workspace for the new user
  INSERT INTO public.workspaces (name, slug, owner_id, plan)
  VALUES ('My Workspace', NEW.email || '-' || gen_random_uuid(), NEW.id, 'free')
  RETURNING id INTO new_workspace_id;

  -- Add the user to workspace_members as owner
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run handle_new_user when a new row is added to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
