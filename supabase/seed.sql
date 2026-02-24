-- Inject demo user into Auth Service
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES
('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo@folio.com', crypt('password123', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{}', NOW(), NOW(), '', '', '', '')
ON CONFLICT DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES
('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', format('{"sub":"%s","email":"%s"}', '00000000-0000-0000-0000-000000000000', 'demo@folio.com')::jsonb, 'email', '00000000-0000-0000-0000-000000000000', NOW(), NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Seed Folio Setup Data
INSERT INTO public.workspaces (id, name, slug, owner_id)
VALUES ('11111111-1111-1111-1111-111111111111', 'Folio HQ', 'folio-hq', '00000000-0000-0000-0000-000000000000')
ON CONFLICT DO NOTHING;

-- Seed Workspace Members for safe cascade
INSERT INTO public.workspace_members (workspace_id, user_id, role)
VALUES ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'owner')
ON CONFLICT DO NOTHING;

-- Seed Clients
INSERT INTO public.clients (id, workspace_id, name, niche, linkedin_url, status)
VALUES 
('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Ollie Henderson', 'B2B SaaS Founders', 'https://linkedin.com/in/ollie', 'active'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Tran Mau Tri Tam', 'UI/UX Design Mentors', 'https://linkedin.com/in/tran', 'active')
ON CONFLICT DO NOTHING;

-- Seed Client Brain logic
INSERT INTO public.client_brain (client_id, voice_tone, ai_status)
VALUES 
('22222222-2222-2222-2222-222222222221', 'Analytical, authoritative, data-driven', 'ready'),
('22222222-2222-2222-2222-222222222222', 'Inspirational, warm, encouraging', 'idle')
ON CONFLICT DO NOTHING;
