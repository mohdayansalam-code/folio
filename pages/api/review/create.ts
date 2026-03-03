import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabase';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { draft_id, user_id } = req.body;

    if (!draft_id || !user_id) {
        return res.status(400).json({ error: 'Missing draft_id or user_id' });
    }

    // Validate ownership
    const { data: draft, error: fetchError } = await supabase
        .from('drafts')
        .select('id')
        .eq('id', draft_id)
        .eq('user_id', user_id)
        .single();

    if (fetchError || !draft) {
        return res.status(403).json({ error: 'Unauthorized or draft not found' });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Store token + draft_id (assume table is review_tokens)
    const { error: insertError } = await supabase
        .from('review_tokens')
        .insert({
            draft_id,
            token
        });

    if (insertError) {
        // Fallback: mostly handling cases if table is named review_links
        console.error("Token insert error:", insertError);
        return res.status(500).json({ error: insertError.message });
    }

    // Update draft status
    const { error: updateError } = await supabase
        .from('drafts')
        .update({ status: 'awaiting_approval' })
        .eq('id', draft_id);

    // No .select() after update per rules

    if (updateError) {
        return res.status(500).json({ error: 'Failed to update draft status' });
    }

    const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/review/${token}`;

    return res.status(200).json({ reviewUrl });
}
