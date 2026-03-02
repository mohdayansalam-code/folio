import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Missing token' });
    }

    // Validate token
    const { data: tokenData, error: tokenError } = await supabase
        .from('review_tokens')
        .select('draft_id')
        .eq('token', token)
        .single();

    if (tokenError || !tokenData) {
        return res.status(404).json({ error: 'Invalid or expired review token' });
    }

    const draftId = tokenData.draft_id;

    // Reject draft back to authors
    const { error: updateError } = await supabase
        .from('drafts')
        .update({ status: 'draft' }) // Demote back to draft
        .eq('id', draftId);

    if (updateError) {
        return res.status(500).json({ error: 'Failed to request changes' });
    }

    // Invalidate token so it can't be reused
    await supabase
        .from('review_tokens')
        .delete()
        .eq('token', token);

    return res.status(200).json({ success: true });
}
