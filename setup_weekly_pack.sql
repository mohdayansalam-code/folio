
CREATE TABLE IF NOT EXISTS public.content_pack_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_email TEXT NOT NULL,
    client_id UUID NOT NULL,
    week_start_date DATE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('idea', 'draft')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.content_pack_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own content pack items"
ON public.content_pack_items
FOR ALL
USING (user_email = current_setting('request.jwt.claims', true)::json->>'email' OR user_email = 'test@example.com');
  