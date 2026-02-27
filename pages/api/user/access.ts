import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/utils/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();

        if (error || !user) {
            return res.status(200).json({
                access: false,
                error: 'No active plan found. Please purchase a plan on Whop.'
            });
        }

        // Access is granted if status is 'active' and not expired
        const now = new Date();
        const expiryDate = user.plan_expiry ? new Date(user.plan_expiry) : null;
        const isExpired = expiryDate ? now > expiryDate : false;

        const access = user.plan_status === 'active' && !isExpired;

        return res.status(200).json({
            access,
            email: user.email,
            plan: user.current_plan,
            status: user.plan_status,
            expiry: user.plan_expiry,
            error: access ? null : 'Your subscription has expired or is inactive.'
        });
    } catch (error: any) {
        console.error('Error checking user access:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
