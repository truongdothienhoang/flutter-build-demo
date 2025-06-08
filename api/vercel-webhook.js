import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.VERCEL_WEBHOOK_SECRET;
  const signature = req.headers['x-vercel-signature'];

  if (!signature) {
    return res.status(401).json({ error: 'No signature provided' });
  }

  const payload = JSON.stringify(req.body);
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const digest = hmac.digest('hex');

  if (signature !== digest) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Signature verified; process the deployment payload
  const deploymentUrl = req.body.url;

  // TODO: Store deploymentUrl or notify ChatGPT plugin here

  res.status(200).json({ message: 'Webhook received', url: deploymentUrl });
}
