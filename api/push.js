const fetch = global.fetch || ((...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args)));

export default async function handler(req, res) {
  const { code } = req.body || {};

  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  console.log('Received code:', code);

  return res.status(200).json({ status: 'success', received: code.length + ' chars' });
}
