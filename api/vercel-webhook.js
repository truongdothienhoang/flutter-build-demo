export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const payload = req.body;

  // Extract the deployment URL from Vercel webhook payload
  const deploymentUrl = payload?.url;

  // TODO: Store deploymentUrl somewhere (in-memory, database, or trigger ChatGPT plugin response)

  // Respond quickly to acknowledge
  res.status(200).json({ received: true, url: deploymentUrl });

  // Optionally, trigger ChatGPT notification here (call OpenAI API or your plugin logic)
}
