const fetch = global.fetch || ((...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args)));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'telberiaarbeit';
const REPO_NAME = 'flutter-build-demo';
const BRANCH = 'web-build';
const FILE_PATH = 'lib/main.dart';

const HEADERS = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json'
};

const getFileUrl = () =>
  `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`;

// Fetch the current file SHA from GitHub
async function fetchCurrentSha() {
  const res = await fetch(getFileUrl(), { headers: HEADERS });
  if (res.status === 404) return null; // New file
  if (!res.ok) throw new Error('Failed to get current file SHA');
  const data = await res.json();
  return data.sha;
}

// Push (create or update) the file to GitHub
async function pushToGitHub(code, sha = null) {
  const body = {
    message: 'Update main.dart via API',
    content: Buffer.from(code).toString('base64'),
    branch: BRANCH,
    ...(sha && { sha })
  };

  const res = await fetch(getFileUrl(), {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(body)
  });

  const json = await res.json();
  return { status: res.status, json };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' });
  }

  const { code } = req.body || {};
  if (!code) {
    return res.status(400).json({ error: 'Missing Flutter code' });
  }

  try {
    // First attempt
    let sha = await fetchCurrentSha();
    let { status, json } = await pushToGitHub(code, sha);

    // If there's a conflict or sha issue, retry once with latest sha
    if (
      (status === 422 || status === 409) &&
      json.message?.includes('sha') &&
      !req.retry
    ) {
      console.warn('Conflict detected. Retrying with latest SHA...');
      sha = await fetchCurrentSha(); // re-fetch
      ({ status, json } = await pushToGitHub(code, sha));
    }

    if (status === 200 || status === 201) {
      return res.status(200).json({ status: 'success', github_url: json.content.html_url });
    } else {
      return res.status(500).json({ error: 'GitHub push failed', details: json });
    }
  } catch (err) {
    console.error('Unhandled error:', err);
    return res.status(500).json({ error: 'Unexpected server error', message: err.message });
  }
}
