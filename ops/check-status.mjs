import dns from 'node:dns/promises';
import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

export function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const DOMAIN = process.env.BLOG_DOMAIN || 'thinkingonthinking.com';
const GITHUB_PAGES_IP = '185.199.108.153';
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'mulderp';
const GITHUB_REPO = process.env.GITHUB_REPO || 'mulderp.github.com';

async function checkRdap() {
  console.log(`\n=== 1. Domain Registration & Nameservers (RDAP: ${DOMAIN}) ===`);
  try {
    const res = await fetch(`https://rdap.verisign.com/com/v1/domain/${DOMAIN}`);
    if (!res.ok) {
      console.log(`RDAP lookup returned HTTP ${res.status}`);
      return;
    }
    const data = await res.json();
    const events = Object.fromEntries((data.events || []).map(e => [e.eventAction, e.eventDate]));
    const nameservers = (data.nameservers || []).map(ns => ns.ldhName);
    console.log(`Status:      ${(data.status || []).join(', ')}`);
    console.log(`Registered:  ${events.registration || 'unknown'}`);
    console.log(`Last Change: ${events['last changed'] || 'unknown'}`);
    console.log(`Expires:     ${events.expiration || 'unknown'}`);
    console.log(`Nameservers: ${nameservers.join(', ')}`);
    return { nameservers, status: data.status };
  } catch (err) {
    console.error(`RDAP check failed: ${err.message}`);
  }
}

async function checkDns() {
  console.log(`\n=== 2. Public DNS Resolution (${DOMAIN}) ===`);
  const publicResolver = new dns.Resolver();
  publicResolver.setServers(['1.1.1.1', '8.8.8.8']);

  try {
    const aRecords = await publicResolver.resolve4(DOMAIN);
    console.log(`A records (1.1.1.1/8.8.8.8): ${aRecords.join(', ')}`);
  } catch (err) {
    console.log(`A records (1.1.1.1/8.8.8.8): FAILED (${err.code || err.message})`);
  }

  try {
    const cname = await publicResolver.resolveCname(`www.${DOMAIN}`);
    console.log(`www CNAME (1.1.1.1/8.8.8.8): ${cname.join(', ')}`);
  } catch (err) {
    console.log(`www CNAME (1.1.1.1/8.8.8.8): FAILED (${err.code || err.message})`);
  }

  try {
    const sysA = await dns.resolve4(DOMAIN);
    console.log(`A records (system DNS):      ${sysA.join(', ')}`);
  } catch (err) {
    console.log(`A records (system DNS):      FAILED (${err.code || err.message})`);
  }
}

async function checkGitHubPagesOrigin() {
  console.log(`\n=== 3. GitHub Pages Origin Status ===`);
  try {
    const ghIoRes = await fetch(`https://${GITHUB_OWNER}.github.io/`, { redirect: 'manual' });
    console.log(`https://${GITHUB_OWNER}.github.io/ -> HTTP ${ghIoRes.status} (Location: ${ghIoRes.headers.get('location') || 'none'})`);
  } catch (err) {
    console.log(`https://${GITHUB_OWNER}.github.io/ -> FAILED (${err.message})`);
  }

  try {
    const originRes = await new Promise((resolve, reject) => {
      const req = http.request(
        {
          host: GITHUB_PAGES_IP,
          port: 80,
          path: '/',
          method: 'GET',
          headers: { Host: DOMAIN, 'User-Agent': 'thinkingonthinking-ops' }
        },
        res => {
          let body = '';
          res.setEncoding('utf8');
          res.on('data', chunk => (body += chunk));
          res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
        }
      );
      req.on('error', reject);
      req.end();
    });
    const titleMatch = originRes.body.match(/<title>(.*?)<\/title>/i);
    console.log(`http://${GITHUB_PAGES_IP}/ (Host: ${DOMAIN}) -> HTTP ${originRes.status} (Last-Modified: ${originRes.headers['last-modified'] || 'n/a'})`);
    console.log(`Origin Page Title: ${titleMatch ? titleMatch[1] : 'unknown'} (${originRes.body.length} bytes)`);
  } catch (err) {
    console.log(`Direct GitHub Pages HTTP origin check failed: ${err.message}`);
  }

  try {
    const httpsRes = await new Promise((resolve, reject) => {
      const req = https.request(
        {
          host: GITHUB_PAGES_IP,
          port: 443,
          path: '/',
          method: 'GET',
          servername: DOMAIN,
          rejectUnauthorized: false,
          headers: { Host: DOMAIN, 'User-Agent': 'thinkingonthinking-ops' }
        },
        res => {
          const cert = res.socket.getPeerCertificate();
          const authorized = res.socket.authorized;
          const authErr = res.socket.authorizationError;
          res.resume();
          resolve({
            status: res.statusCode,
            location: res.headers.location,
            authorized,
            authErr,
            subject: cert?.subject,
            valid_to: cert?.valid_to,
            subjectaltname: cert?.subjectaltname
          });
        }
      );
      req.on('error', reject);
      req.end();
    });
    console.log(`https://${GITHUB_PAGES_IP}/ (SNI: ${DOMAIN}) -> HTTP ${httpsRes.status} | TLS Valid: ${httpsRes.authorized} (${httpsRes.authErr || 'OK'})`);
    console.log(`TLS Cert SANs: ${httpsRes.subjectaltname || 'none'} (Valid until: ${httpsRes.valid_to || 'n/a'})`);
  } catch (err) {
    console.log(`Direct GitHub Pages HTTPS origin check failed: ${err.message}`);
  }
}

async function checkGitHubApi() {
  console.log(`\n=== 4. GitHub API (${GITHUB_OWNER}/${GITHUB_REPO}) ===`);
  const headers = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'thinkingonthinking-ops'
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const repoRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`, { headers });
    const repo = await repoRes.json();
    console.log(`Repository:   ${repo.full_name} (default_branch: ${repo.default_branch}, has_pages: ${repo.has_pages})`);

    if (process.env.GITHUB_TOKEN) {
      const pagesRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pages`, { headers });
      if (pagesRes.ok) {
        const pages = await pagesRes.json();
        console.log(`Pages Status: ${pages.status || 'built'}, CNAME: ${pages.cname}, HTTPS Enforced: ${pages.https_enforced}`);
      } else {
        console.log(`Pages API:    HTTP ${pagesRes.status}`);
      }
    } else {
      console.log(`Pages API:    Skipped (set GITHUB_TOKEN in .env to inspect/update Pages config via API)`);
    }
  } catch (err) {
    console.log(`GitHub API check failed: ${err.message}`);
  }
}

async function checkDnsimpleApi() {
  console.log(`\n=== 5. DNSimple API ===`);
  if (!process.env.DNSIMPLE_TOKEN) {
    console.log(`Skipped (set DNSIMPLE_TOKEN in .env to query/configure DNSimple via API)`);
    return;
  }
  const headers = {
    'Authorization': `Bearer ${process.env.DNSIMPLE_TOKEN}`,
    'Accept': 'application/json'
  };
  try {
    const whoRes = await fetch('https://api.dnsimple.com/v2/whoami', { headers });
    const who = await whoRes.json();
    console.log(`Authenticated as:`, JSON.stringify(who.data));
  } catch (err) {
    console.log(`DNSimple API check failed: ${err.message}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await checkRdap();
  await checkDns();
  await checkGitHubPagesOrigin();
  await checkGitHubApi();
  await checkDnsimpleApi();
}
