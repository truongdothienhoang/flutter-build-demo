const fetch = global.fetch || ((...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args)));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Or hardcode for now
const REPO_OWNER = 'telberiaarbeit';
const REPO_NAME = 'flutter-build-demo';
const BRANCH = 'web-build';
const FILE_PATH = 'lib/main.dart';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { code } = req.body || {};
  if (!code) {
    return res.status(400).json({ error: 'Missing Flutter code' });
  }

  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json'
  };

  const fileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
  let sha = null;

  try {
    const r = await fetch(fileUrl, { headers });
    if (r.ok) {
      const data = await r.json();
      sha = data.sha;
    }
  } catch (err) {
    console.error('SHA check failed:', err.message);
  }

  const body = {
    message: 'Update main.dart via API',
    content: Buffer.from(code).toString('base64'),
    branch: BRANCH,
    ...(sha && { sha })
  };

  const update = await fetch(fileUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body)
  });

  const json = await update.json();

  if (update.status === 200 || update.status === 201) {
    return res.status(200).json({ status: 'success', github_url: json.content.html_url });
  } else {
    console.error('GitHub error:', json);
    return res.status(500).json({ error: 'GitHub push failed', details: json });
  }
}
