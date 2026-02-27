import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/utils/supabase';
import crypto from 'crypto';

// Disable body parsing to verify the raw signature
export const config = {
    api: {
        bodyParser: false,
    },
};

async function getRawBody(readable: any): Promise<Buffer> {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const signature = req.headers['x-whop-signature'] as string;
    const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
        console.error('Missing signature or webhook secret');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const rawBody = await getRawBody(req);

    // Validate signature
    const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

    if (signature !== expectedSignature) {
        console.error('Invalid signature match');
        return res.status(401).json({ error: 'Invalid signature' });
    }

    let payload;
    try {
        payload = JSON.parse(rawBody.toString());
    } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON' });
    }

    const event = payload.action;
    const data = payload.data;

    // We only care about membership events
    if (!event.startsWith('membership.')) {
        return res.status(200).json({ received: true, ignored: true });
    }

    const email = data.email || data.user?.email;
    if (!email) {
        console.error('No email found in webhook payload', payload);
        return res.status(200).json({ received: true, error: 'No email' });
    }

    const membershipId = data.id;
    const productId = data.product_id;
    const planId = data.plan_id;
    const productName = data.product?.name || 'free';
    const status = data.status || 'inactive';
    const startDate = data.payout_start_date || data.created_at;
    const expiryDate = data.expiration_date;

    // Normalize plan name
    const planName = productName.toLowerCase();

    try {
        // 1. Upsert User
        const { error: userError } = await supabaseAdmin
            .from('users')
            .upsert({
                email,
                current_plan: planName,
                plan_status: status === 'active' ? 'active' : 'inactive',
                plan_expiry: expiryDate,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'email' });

        if (userError) throw userError;

        // 2. Insert Subscription History
        const { error: subError } = await supabaseAdmin
            .from('subscriptions')
            .insert({
                email,
                membership_id: membershipId,
                product_id: productId,
                plan_id: planId,
                plan_name: planName,
                status,
                start_date: startDate,
                expiry_date: expiryDate,
            });

        if (subError) throw subError;

        return res.status(200).json({ success: true });
    } catch (error: any) {
        console.error('Error processing Whop webhook:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
