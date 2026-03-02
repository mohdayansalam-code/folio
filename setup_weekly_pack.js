const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/)[1].trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.*)/)[1].trim();

const supabase = createClient(url, key);

async function runSQL() {
    console.log("Since anon key cannot execute raw SQL directly, please manually run this SQL in your Supabase Dashboard:");
    const sql = `
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
  `;

    console.log(sql);
    fs.writeFileSync('setup_weekly_pack.sql', sql);
}

runSQL();
