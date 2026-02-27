-- Create users table (Simplified for soft-login tracking)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Helper to update last_login_at
CREATE OR REPLACE FUNCTION public.handle_last_login()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_login_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER set_last_login
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_last_login();
