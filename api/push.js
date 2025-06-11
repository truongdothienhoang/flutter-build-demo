const fetch = global.fetch || ((...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args)));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Make sure this is set in Vercel
const REPO_OWNER = 'telberiaarbeit';
const REPO_NAME = 'flutter-build-demo';
const BRANCH = 'web-build';
const FILE_PATH = 'lib/main.dart';

const HEADERS = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json'
};

const FILE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { code } = req.body || {};
  if (!code) {
    return res.status(400).json({ error: 'Missing Flutter code' });
  }

  try {
    // Step 1: Get latest SHA
    let sha = null;
    const shaRes = await fetch(FILE_URL, { headers: HEADERS });
    if (shaRes.ok) {
      const data = await shaRes.json();
      sha = data.sha;
    }

    // Step 2: Push new code (force overwrite)
    const body = {
      message: 'Update main.dart',
      content: Buffer.from(code).toString('base64'),
      branch: BRANCH,
      ...(sha ? { sha } : {}) // Only include sha if found
    };

    const pushRes = await fetch(FILE_URL, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(body)
    });

    const json = await pushRes.json();

    if (pushRes.status === 200 || pushRes.status === 201) {
      return res.status(200).json({
        status: 'success',
        github_url: json.content.html_url
      });
    } else {
      return res.status(500).json({
        error: 'GitHub push failed',
        details: json
      });
    }
  } catch (err) {
    console.error('Push failed:', err);
    return res.status(500).json({
      error: 'Server error',
      message: err.message
    });
  }
}
