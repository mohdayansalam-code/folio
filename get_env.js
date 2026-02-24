const cp = require('child_process');
const fs = require('fs');

try {
    console.log('Running npx supabase status...');
    const out = cp.execSync('npx supabase status', { encoding: 'utf8' });

    const urlMatch = out.match(/API URL:\s*(http[^\s]+)/);
    const anonMatch = out.match(/anon key:\s*([a-zA-Z0-9_.\-]+)/);

    if (urlMatch && anonMatch) {
        fs.writeFileSync('.env.local', `NEXT_PUBLIC_SUPABASE_URL=${urlMatch[1]}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${anonMatch[1]}\n`);
        console.log('Successfully wrote .env.local!');
    } else {
        console.error('Failed to parse status output. Regex did not match.');
        console.log('OUTPUT WAS:', out);
    }
} catch (e) {
    console.error('Execute failed:', e.message);
}
