import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { token } = req.query;

    if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid token' });
    }

    // Since this endpoint is unauthenticated, we need to bypass RLS to read the draft
    // Using the service_role key if available, otherwise fallback to standard client.
    // In production, you would instantiate a supabaseAdmin client here.
    const adminSupabase = process.env.SUPABASE_SERVICE_ROLE_KEY
        ? require('@supabase/supabase-js').createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        )
        : supabase;

    // Validate token
    const { data: tokenData, error: tokenError } = await adminSupabase
        .from('review_tokens')
        .select('draft_id')
        .eq('token', token)
        .single();

    if (tokenError || !tokenData) {
        return res.status(404).json({ error: 'Invalid or expired review token' });
    }

    const draftId = tokenData.draft_id;

    // Fetch draft title, content, status
    const { data: draft, error: fetchError } = await adminSupabase
        .from('drafts')
        .select('title, content, status')
        .eq('id', draftId)
        .single();

    if (fetchError || !draft) {
        return res.status(404).json({ error: 'Draft not found' });
    }

    return res.status(200).json({ draft });
}
