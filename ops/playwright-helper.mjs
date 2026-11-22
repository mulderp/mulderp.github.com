import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './check-status.mjs';

loadEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userDataDir = path.join(__dirname, '.auth', 'browser-profile');
const DOMAIN = process.env.BLOG_DOMAIN || 'thinkingonthinking.com';
const GITHUB_PAGES_IP = '185.199.108.153';

async function launchBrowser(options = {}) {
  for (const channel of ['chrome', 'msedge', undefined]) {
    try {
      return await chromium.launch({ ...options, ...(channel ? { channel } : {}) });
    } catch {
      // try next channel
    }
  }
  throw new Error('Could not launch browser. Run: npx playwright install chromium');
}

async function previewOrigin() {
  console.log(`Launching Playwright with host resolver mapping ${DOMAIN} -> ${GITHUB_PAGES_IP}...`);
  const browser = await launchBrowser({
    headless: true,
    args: [`--host-resolver-rules=MAP ${DOMAIN} ${GITHUB_PAGES_IP}`]
  });
  const page = await browser.newPage();
  await page.goto(`https://${DOMAIN}/`, { waitUntil: 'domcontentloaded' });
  const title = await page.title();
  const postCount = await page.locator('#posts li').count();
  const screenshotPath = path.join(__dirname, 'origin-preview.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Rendered live GitHub Pages site for https://${DOMAIN}/!`);
  console.log(`Page Title: ${title}`);
  console.log(`Posts listed on homepage: ${postCount}`);
  console.log(`Screenshot saved to: ${screenshotPath}`);
  await browser.close();
}

async function interactiveSession(targetUrl) {
  fs.mkdirSync(userDataDir, { recursive: true });
  console.log(`Launching persistent Chromium session at ${targetUrl}`);
  console.log(`Profile saved in: ${userDataDir}`);
  let context;
  for (const channel of ['chrome', 'msedge', undefined]) {
    try {
      context = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        viewport: { width: 1280, height: 850 },
        args: ['--remote-debugging-port=9222'],
        ...(channel ? { channel } : {})
      });
      break;
    } catch {
      // try next channel
    }
  }
  if (!context) throw new Error('Could not launch persistent browser context.');
  const page = context.pages()[0] || await context.newPage();
  await page.goto(targetUrl);
  await page.bringToFront();
  console.log('Browser window is open (CDP enabled on http://127.0.0.1:9222).');
  await new Promise(resolve => {
    context.on('close', resolve);
    page.on('close', () => {
      if (context.pages().length === 0) resolve();
    });
  });
  await context.close().catch(() => {});
}

async function inspectCdp() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const contexts = browser.contexts();
  console.log(`Connected to CDP on 9222. Contexts: ${contexts.length}`);
  for (const ctx of contexts) {
    for (const p of ctx.pages()) {
      console.log(`Page URL: ${p.url()} | Title: ${await p.title()}`);
      const text = await p.locator('body').innerText().catch(() => '');
      console.log(`Page text snippet:\n${text.slice(0, 600)}\n---`);
      await p.screenshot({ path: path.join(__dirname, 'dd24-state.png') });
    }
  }
  await browser.close();
}

async function openLive() {
  console.log(`Opening visible browser for https://${DOMAIN}/ (mapped to ${GITHUB_PAGES_IP})...`);
  const browser = await launchBrowser({
    headless: false,
    args: [
      `--host-resolver-rules=MAP ${DOMAIN} ${GITHUB_PAGES_IP}, MAP www.${DOMAIN} ${GITHUB_PAGES_IP}`
    ]
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 850 } });
  const page = await context.newPage();
  await page.goto(`https://${DOMAIN}/`);
  await page.bringToFront();
  console.log(`Live site open at https://${DOMAIN}/! Close the browser window when done.`);
  await new Promise(resolve => {
    page.on('close', resolve);
    browser.on('disconnected', resolve);
  });
  await browser.close().catch(() => {});
}

const cmd = process.argv[2] || 'preview-origin';
if (cmd === 'preview-origin') {
  await previewOrigin();
} else if (cmd === 'open-live') {
  await openLive();
} else if (cmd === 'inspect-cdp') {
  await inspectCdp();
} else if (cmd === 'login-dd24') {
  await interactiveSession('https://login.domaindiscount24.com/login');
} else if (cmd === 'login-dnsimple') {
  await interactiveSession('https://dnsimple.com/a');
} else if (cmd === 'login-github') {
  await interactiveSession('https://github.com/mulderp/mulderp.github.com/settings/pages');
} else {
  console.log('Usage: node playwright-helper.mjs [preview-origin|login-dd24|login-dnsimple|login-github]');
}
