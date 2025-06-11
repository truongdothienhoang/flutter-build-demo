const fetch = global.fetch || ((...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args)));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'telberiaarbeit';
const REPO_NAME = 'flutter-build-demo';
const BRANCH = 'main';
const FILE_PATH = 'lib/main.dart';

const HEADERS = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'Cache-Control': 'no-cache'
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
    // 🧠 Step 1: Force fetch latest SHA (disable caching)
    const shaRes = await fetch(FILE_URL + `&t=${Date.now()}`, { headers: HEADERS });
    let sha = null;

    if (shaRes.ok) {
      const data = await shaRes.json();
      sha = data.sha;
    } else if (shaRes.status !== 404) {
      const err = await shaRes.text();
      return res.status(500).json({ error: 'Failed to fetch file SHA', details: err });
    }

    // 🧠 Step 2: Build push payload
    const body = {
      message: 'Force update lib/main.dart',
      content: Buffer.from(code).toString('base64'),
      branch: BRANCH,
      ...(sha ? { sha } : {}) // only include sha if we found it
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
    return res.status(500).json({
      error: 'Unexpected server error',
      message: err.message
    });
  }
}
