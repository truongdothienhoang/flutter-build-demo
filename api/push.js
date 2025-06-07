export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  // You would place your GitHub push logic here...
  console.log('Received code:', code);

  return res.status(200).json({ status: 'success' });
}
