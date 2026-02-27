const crypto = require('crypto');
const axios = require('axios');

/**
 * SIMULATE WHOP WEBHOOK
 * Run this script to test your webhook endpoint locally.
 * Usage: node scripts/simulate_whop_webhook.js <email> <plan_name> <status>
 */

const WHOP_WEBHOOK_SECRET = 'your_test_secret'; // Must match .env.local
const WEBHOOK_URL = 'http://localhost:3000/api/webhooks/whop';

const email = process.argv[2] || 'test_user@example.com';
const planName = process.argv[3] || 'Pro';
const status = process.argv[4] || 'active';

const payload = {
    action: 'membership.created',
    data: {
        id: 'mem_123456',
        email: email,
        product_id: 'prod_123',
        plan_id: 'plan_123',
        status: status,
        product: {
            name: planName
        },
        payout_start_date: new Date().toISOString(),
        expiration_date: null
    }
};

const body = JSON.stringify(payload);
const signature = crypto
    .createHmac('sha256', WHOP_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

console.log(`Sending webhook for ${email} (${planName}) status: ${status}...`);

axios.post(WEBHOOK_URL, payload, {
    headers: {
        'Content-Type': 'application/json',
        'x-whop-signature': signature
    }
})
    .then(res => {
        console.log('SUCCESS:', res.data);
    })
    .catch(err => {
        console.error('FAILED:', err.response ? err.response.data : err.message);
    });
