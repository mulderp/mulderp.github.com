import { loadEnv } from './check-status.mjs';

loadEnv();

const TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_OWNER || 'mulderp';
const REPO = process.env.GITHUB_REPO || 'mulderp.github.com';
const DOMAIN = process.env.BLOG_DOMAIN || 'thinkingonthinking.com';

async function ghRequest(endpoint, options = {}) {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'thinkingonthinking-ops',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(options.headers || {})
  };
  if (TOKEN) {
    headers['Authorization'] = `Bearer ${TOKEN}`;
  }
  const res = await fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function inspectPages() {
  const repo = await ghRequest(`/repos/${OWNER}/${REPO}`);
  console.log(`Repo: ${repo.full_name} (default_branch: ${repo.default_branch}, has_pages: ${repo.has_pages})`);
  if (!TOKEN) {
    console.log('Note: Set GITHUB_TOKEN in .env to view or update detailed GitHub Pages settings.');
    return;
  }
  const pages = await ghRequest(`/repos/${OWNER}/${REPO}/pages`);
  console.log('GitHub Pages settings:', JSON.stringify(pages, null, 2));
}

async function updatePages({ cname = DOMAIN, https_enforced = true } = {}) {
  if (!TOKEN) throw new Error('GITHUB_TOKEN is required in .env to update GitHub Pages configuration');
  await ghRequest(`/repos/${OWNER}/${REPO}/pages`, {
    method: 'PUT',
    body: JSON.stringify({
      cname,
      https_enforced,
      source: {
        branch: 'master',
        path: '/'
      }
    })
  });
  console.log(`Updated GitHub Pages settings for ${OWNER}/${REPO} (cname=${cname}, https_enforced=${https_enforced})`);
}

const action = process.argv[2] || 'inspect';
if (action === 'inspect') {
  await inspectPages();
} else if (action === 'configure') {
  await updatePages();
} else {
  console.log('Usage: node github-api.mjs [inspect|configure]');
}
