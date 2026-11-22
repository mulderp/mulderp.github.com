import { loadEnv } from './check-status.mjs';

loadEnv();

const TOKEN = process.env.DNSIMPLE_TOKEN;
const DOMAIN = process.env.BLOG_DOMAIN || 'thinkingonthinking.com';
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'mulderp';

const GITHUB_PAGES_A_IPS = [
  '185.199.108.153',
  '185.199.109.153',
  '185.199.110.153',
  '185.199.111.153'
];

const GITHUB_PAGES_AAAA_IPS = [
  '2606:50c0:8000::153',
  '2606:50c0:8001::153',
  '2606:50c0:8002::153',
  '2606:50c0:8003::153'
];

async function dnsimpleRequest(endpoint, options = {}) {
  if (!TOKEN) {
    throw new Error('DNSIMPLE_TOKEN is not set in .env');
  }
  const res = await fetch(`https://api.dnsimple.com/v2${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`DNSimple API ${res.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function getAccountId() {
  if (process.env.DNSIMPLE_ACCOUNT_ID) return process.env.DNSIMPLE_ACCOUNT_ID;
  const whoami = await dnsimpleRequest('/whoami');
  if (whoami.data?.account) return whoami.data.account.id;
  const accounts = await dnsimpleRequest('/accounts');
  if (accounts.data?.length) return accounts.data[0].id;
  throw new Error('Could not resolve DNSimple account ID');
}

async function inspectZone() {
  const accountId = await getAccountId();
  console.log(`Account ID: ${accountId}`);

  const domainInfo = await dnsimpleRequest(`/${accountId}/domains/${DOMAIN}`).catch(e => ({ error: e.message }));
  console.log('Domain info:', JSON.stringify(domainInfo, null, 2));

  const zoneInfo = await dnsimpleRequest(`/${accountId}/zones/${DOMAIN}`).catch(e => ({ error: e.message }));
  console.log('Zone info:', JSON.stringify(zoneInfo, null, 2));

  const records = await dnsimpleRequest(`/${accountId}/zones/${DOMAIN}/records`).catch(e => ({ error: e.message }));
  console.log('Zone records:', JSON.stringify(records, null, 2));
}

async function configureGitHubPagesRecords() {
  const accountId = await getAccountId();
  console.log(`Configuring GitHub Pages DNS records for ${DOMAIN} on account ${accountId}...`);

  const existing = await dnsimpleRequest(`/${accountId}/zones/${DOMAIN}/records`);
  const records = existing.data || [];

  for (const ip of GITHUB_PAGES_A_IPS) {
    const hasRecord = records.some(r => r.name === '' && r.type === 'A' && r.content === ip);
    if (!hasRecord) {
      const created = await dnsimpleRequest(`/${accountId}/zones/${DOMAIN}/records`, {
        method: 'POST',
        body: JSON.stringify({ name: '', type: 'A', content: ip, ttl: 3600 })
      });
      console.log(`Created A record -> ${ip}:`, created.data?.id);
    } else {
      console.log(`A record -> ${ip} already exists`);
    }
  }

  for (const ip of GITHUB_PAGES_AAAA_IPS) {
    const hasRecord = records.some(r => r.name === '' && r.type === 'AAAA' && r.content === ip);
    if (!hasRecord) {
      const created = await dnsimpleRequest(`/${accountId}/zones/${DOMAIN}/records`, {
        method: 'POST',
        body: JSON.stringify({ name: '', type: 'AAAA', content: ip, ttl: 3600 })
      });
      console.log(`Created AAAA record -> ${ip}:`, created.data?.id);
    } else {
      console.log(`AAAA record -> ${ip} already exists`);
    }
  }

  const targetCname = `${GITHUB_OWNER}.github.io`;
  const hasWww = records.some(r => r.name === 'www' && r.type === 'CNAME' && r.content === targetCname);
  if (!hasWww) {
    const created = await dnsimpleRequest(`/${accountId}/zones/${DOMAIN}/records`, {
      method: 'POST',
      body: JSON.stringify({ name: 'www', type: 'CNAME', content: targetCname, ttl: 3600 })
    });
    console.log(`Created www CNAME -> ${targetCname}:`, created.data?.id);
  } else {
    console.log(`www CNAME -> ${targetCname} already exists`);
  }
}

const action = process.argv[2] || 'inspect';
if (action === 'inspect') {
  await inspectZone();
} else if (action === 'apply-github-pages') {
  await configureGitHubPagesRecords();
} else {
  console.log('Usage: node dnsimple-api.mjs [inspect|apply-github-pages]');
}
