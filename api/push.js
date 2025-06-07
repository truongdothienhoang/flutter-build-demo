const fetch = global.fetch || ((...args) => import('node-fetch').then(({ default: f }) => f(...args)));


const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // or hardcode for testing
const REPO_OWNER = 'telberiarbeit';
const REPO_NAME = 'flutter-build-demo';
const BRANCH = 'main';
const FILE_PATH = 'lib/main.dart';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Missing Flutter code' });
  }

  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json'
  };

  // Get current file SHA (if exists)
  const fileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
  let sha = null;

  try {
    const fileRes = await fetch(fileUrl, { headers });
    if (fileRes.ok) {
      const fileJson = await fileRes.json();
      sha = fileJson.sha;
    }
  } catch (err) {
    console.error('Could not get file SHA:', err.message);
  }

  // Prepare request to GitHub API
  const updateRes = await fetch(fileUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: 'Update main.dart via API',
      content: Buffer.from(code).toString('base64'),
      branch: BRANCH,
      ...(sha && { sha })
    })
  });

  const data = await updateRes.json();

  if (updateRes.status === 200 || updateRes.status === 201) {
    return res.status(200).json({ status: 'success', url: data.content.html_url });
  } else {
    console.error(data);
    return res.status(500).json({ error: 'GitHub push failed', details: data });
  }
}
