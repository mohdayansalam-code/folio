const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/)[1].trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.*)/)[1].trim();

const supabase = createClient(url, key);

async function test() {
    const { data: clients, error: errC } = await supabase.from('clients').select('id').limit(1);
    const clientId = clients[0].id;
    console.log("Client ID:", clientId);

    const { data, error } = await supabase.from('client_brain').select('*').eq('client_id', clientId).single();
    console.log("Select Result:", data);
    console.log("Select Error:", error);

    const { error: errI } = await supabase.from('client_brain').upsert({
        client_id: clientId,
        voice_tone: "Testing from script",
        signature_stories: "",
        positioning: "",
        proof_results: ""
    }, { onConflict: 'client_id' });
    console.log("Upsert Error:", errI);

    const { data: d2, error: e2 } = await supabase.from('client_brain').select('*').eq('client_id', clientId).single();
    console.log("Re-Select Result:", d2);
    console.log("Re-Select Error:", e2);
}

test();
