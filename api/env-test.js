export default function handler(req, res) {
  res.status(200).json({
    VERCEL_TOKEN: process.env.VERCEL_TOKEN ? 'set' : 'missing',
    VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID || 'missing'
  });
}
