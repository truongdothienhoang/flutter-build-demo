const fetch = global.fetch || ((...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args)));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'telberiaarbeit';
const REPO_NAME = 'flutter-build-demo';
const BRANCH = 'web-build';
const FILE_PATH = 'lib/main.dart';
const FILE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Missing Flutter code' });
  }

  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Cache-Control': 'no-cache'
  };

  let sha = null;

  // Step 1: Always get the latest SHA first
  try {
    const shaRes = await fetch(`${FILE_URL}?ref=${BRANCH}`, { headers });
    if (shaRes.ok) {
      const data = await shaRes.json();
      sha = data.sha;
    }
  } catch (err) {
    console.error('SHA fetch failed:', err.message);
  }

  // Step 2: Push code using that SHA (or create new if no SHA found)
  const body = {
    message: 'Update lib/main.dart via API',
    content: Buffer.from(code).toString('base64'),
    branch: BRANCH,
    ...(sha ? { sha } : {})
  };

  try {
    const pushRes = await fetch(`${FILE_URL}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });

    const json = await pushRes.json();

    if (pushRes.status === 200 || pushRes.status === 201) {
      return res.status(200).json({ status: 'success', github_url: json.content.html_url });
    } else {
      console.error('GitHub push failed:', json);
      return res.status(500).json({ error: 'GitHub push failed', details: json });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error', message: err.message });
  }
}
