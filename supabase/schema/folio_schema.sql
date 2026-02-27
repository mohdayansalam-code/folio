-- Run this in your Supabase SQL Editor to ensure tables match the requirements

-- Clients Table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client Brain Table
CREATE TABLE IF NOT EXISTS public.client_brain (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    voice_tone TEXT DEFAULT '',
    positioning TEXT DEFAULT '',
    signature_stories TEXT DEFAULT '',
    proof_results TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(client_id) -- One brain per client
);

-- Drafts Table
CREATE TABLE IF NOT EXISTS public.drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    content TEXT DEFAULT '',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Table
CREATE TABLE IF NOT EXISTS public.performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    impressions INT DEFAULT 0,
    comments INT DEFAULT 0,
    meetings INT DEFAULT 0,
    date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Setup basic RLS (Assume open for now as UI filters by email)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_brain ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance ENABLE ROW LEVEL SECURITY;

-- Optional: Create permissive policies since the app uses anon key
CREATE POLICY "Enable all for anon" ON public.clients FOR ALL USING (true);
CREATE POLICY "Enable all for anon" ON public.client_brain FOR ALL USING (true);
CREATE POLICY "Enable all for anon" ON public.drafts FOR ALL USING (true);
CREATE POLICY "Enable all for anon" ON public.performance FOR ALL USING (true);
