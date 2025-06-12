const fetch = global.fetch || ((...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args)));

const VERCEL_TOKEN = process.env.VERCEL_TOKEN; // Your Vercel personal token
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID; // Your Vercel project ID

export default async function handler(req, res) {
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
      return res.status(404).json({ error: 'No deployments found' });
    }

    const latestDeployment = data.deployments[0];

    res.status(200).json({
      status: latestDeployment.state,
      deploymentUrl: `https://${latestDeployment.url}`,
    });
  } catch (error) {
    console.error('Vercel API error:', error);
    res.status(500).json({ error: 'Failed to fetch deployment status' });
  }
}
