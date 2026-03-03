import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
    const schema = {};

    const { data: users, error: e1 } = await supabase.from('users').select('*').limit(1);
    schema.users = { data: users ? Object.keys(users[0] || {}) : null, error: e1?.message };

    const { data: workspaces, error: e2 } = await supabase.from('workspaces').select('*').limit(1);
    schema.workspaces = { data: workspaces ? Object.keys(workspaces[0] || {}) : null, error: e2?.message };

    const { data: profiles, error: e3 } = await supabase.from('profiles').select('*').limit(1);
    schema.profiles = { data: profiles ? Object.keys(profiles[0] || {}) : null, error: e3?.message };

    fs.writeFileSync('schema_out.json', JSON.stringify(schema, null, 2));
}

inspectSchema();
