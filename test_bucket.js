const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/)[1].trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.*)/)[1].trim();

const supabase = createClient(url, key);

async function ensureBucket() {
    const { data, error } = await supabase.storage.getBucket('client-assets');
    if (error) {
        console.log("Bucket not found or error:", error.message);
        console.log("Attempting to create bucket 'client-assets'...");
        const { data: createData, error: createError } = await supabase.storage.createBucket('client-assets', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
        });
        if (createError) {
            console.log("Failed to create bucket:", createError);
        } else {
            console.log("Bucket created successfully!");
        }
    } else {
        console.log("Bucket 'client-assets' exists.");
    }
}

ensureBucket();
