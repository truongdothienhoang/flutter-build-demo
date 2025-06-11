const fetch = global.fetch || ((...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args)));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'telberiaarbeit';
const REPO_NAME = 'flutter-build-demo';
const BRANCH = 'web-build';
const FILE_PATH = 'lib/main.dart';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' });
  }

  const { code } = req.body || {};
  if (!code) {
    return res.status(400).json({ error: 'Missing Flutter code' });
  }

  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json'
  };

  const fileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`;
  let sha = null;

  try {
    const getResp = await fetch(fileUrl, { method: 'GET', headers });

    if (getResp.ok) {
      const fileData = await getResp.json();
      sha = fileData.sha;
    } else if (getResp.status === 404) {
      // File doesn't exist yet
      console.log('File does not exist. Creating new one.');
    } else {
      const errorData = await getResp.json();
      console.error('Error fetching current file state:', errorData);
      return res.status(500).json({ error: 'Failed to get current file state', details: errorData });
    }
  } catch (err) {
    console.error('Fetch SHA error:', err.message);
    return res.status(500).json({ error: 'Internal error fetching file SHA' });
  }

  const updateBody = {
    message: 'Update main.dart via API',
    content: Buffer.from(code).toString('base64'),
    branch: BRANCH,
    ...(sha ? { sha } : {}) // Include sha only if file exists
  };

  try {
    const updateResp = await fetch(fileUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateBody)
    });

    const json = await updateResp.json();

    if (updateResp.ok) {
      return res.status(200).json({ status: 'success', github_url: json.content.html_url });
    } else {
      console.error('GitHub push failed:', json);
      if (json.message && json.message.includes('sha')) {
        return res.status(409).json({
          error: 'Conflict detected: file was updated externally. Please try again.',
          details: json
        });
      }
      return res.status(500).json({ error: 'GitHub push failed', details: json });
    }
  } catch (err) {
    console.error('Unexpected push error:', err.message);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
