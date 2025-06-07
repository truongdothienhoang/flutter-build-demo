export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { code } = req.body || {};

  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  return res.status(200).json({
    status: 'success',
    message: 'Flutter code received',
    length: code.length
  });
}
