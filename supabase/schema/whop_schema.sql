-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    email TEXT PRIMARY KEY,
    current_plan TEXT DEFAULT 'free',
    plan_status TEXT DEFAULT 'active',
    plan_expiry TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS but allow service role bypass
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create subscriptions table for history
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT REFERENCES public.users(email),
    membership_id TEXT,
    product_id TEXT,
    plan_id TEXT,
    plan_name TEXT,
    status TEXT,
    start_date TIMESTAMPTZ,
    expiry_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Helper to update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
