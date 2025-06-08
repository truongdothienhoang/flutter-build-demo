const fetch = global.fetch || ((...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args)));

const VERCEL_TOKEN = process.env.VERCEL_TOKEN; // Your Vercel personal token
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID; // Your Vercel project ID

export default async function handler(req, res) {
  console.log('VERCEL_TOKEN:', VERCEL_TOKEN ? 'set' : 'missing');
  console.log('VERCEL_PROJECT_ID:', VERCEL_PROJECT_ID || 'missing');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' });
  }

  const url = `https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    });
    const data = await response.json();

    if (!data.deployments || data.deployments.length === 0) {
      return res.status(200).json({
        status: 'NO_DEPLOYMENT',
        message: "There's still no active deployment found yet. It might be that the deployment hasn't started or hasn't been registered. If you'd like, I can try to re-trigger the deployment or assist in another way. Let me know how you'd like to proceed!",
      });
    }

    const latestDeployment = data.deployments[0];

    if (latestDeployment.state === 'READY') {
      return res.status(200).json({
        status: 'READY',
        deploymentUrl: `https://${latestDeployment.url}`,
      });
    } else {
      return res.status(200).json({
        status: latestDeployment.state,
        message: "There's still no active deployment found yet. It might be that the deployment hasn't started or hasn't been registered. If you'd like, I can try to re-trigger the deployment or assist in another way. Let me know how you'd like to proceed!",
      });
    }
  } catch (error) {
    console.error('Vercel API error:', error);
    res.status(500).json({ error: 'Failed to fetch deployment status' });
  }
}
