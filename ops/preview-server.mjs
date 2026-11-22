import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyPlanet } from './blog-pulse.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 4000);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.eot': 'font/vnd.ms-fontobject'
};

function parseFrontMatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    data[key] = val;
  }
  return { data, content: match[2] };
}

function simpleMarkdown(md) {
  let html = md
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');

  return html
    .split(/\r?\n\r?\n/)
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<(h[1-6]|ul|ol|pre|blockquote|div|img|p|iframe)/i.test(trimmed)) return trimmed;
      if (/^    /.test(block)) {
        return `<pre><code>${block.replace(/^    /gm, '')}</code></pre>`;
      }
      return `<p>${trimmed.replace(/\r?\n/g, '<br/>')}</p>`;
    })
    .join('\n');
}

function loadPosts() {
  const postsDir = path.join(rootDir, '_posts');
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md') || f.endsWith('.markdown'));
  const posts = [];
  for (const file of files) {
    const m = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.(md|markdown)$/);
    if (!m) continue;
    const [, dateStr, slug] = m;
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
    const { data, content } = parseFrontMatter(raw);
    const date = new Date(`${dateStr}T00:00:00Z`);
    const monthYear = date.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
    const tags = (data.tags || '').replace(/[\[\],]/g, ' ').toLowerCase().split(/\s+/).filter(Boolean);
    const planet = classifyPlanet(slug, tags, data.planet);
    posts.push({
      slug,
      url: `/${slug}/`,
      title: data.title || slug,
      date,
      monthYear,
      tags,
      planet,
      contentHtml: simpleMarkdown(content)
    });
  }
  return posts.sort((a, b) => b.date - a.date);
}

function renderDefaultLayout(title, bodyHtml, totalPosts = 91) {
  const tpl = fs.readFileSync(path.join(rootDir, '_layouts', 'default.html'), 'utf8');
  const { content } = parseFrontMatter(tpl);
  const pageTitle = title && title !== 'thinking_on thinking'
    ? `${title} — thinking_on thinking`
    : 'thinking_on thinking — Patrick Mulder';
  return content
    .replace(/\{%\s*assign\s+description\s*=\s*"([^"]+)"\s*%\}/g, '')
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${pageTitle}</title>`)
    .replace(/\{\{\s*description\s*\}\}/g, 'physical software & thinking marvels')
    .replace(/\{\{\s*site\.posts\s*\|\s*size\s*\}\}/g, String(totalPosts))
    .replace(/\{\{\s*content\s*\}\}/g, bodyHtml);
}

function renderIndex(posts) {
  const rawIndex = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const { content } = parseFrontMatter(rawIndex);

  const renderPlanetList = planetId =>
    posts
      .filter(p => p.planet === planetId)
      .map(
        p => `              <li>
                <a href="${p.url}">${p.title}</a>
                <span class="planet-post-date">${p.monthYear}</span>
              </li>`
      )
      .join('\n');

  const dotClass = {
    'thinking-marvels': 'dot-marvels',
    'physical-software': 'dot-hardware',
    'culture-chess': 'dot-culture',
    'munich-lab': 'dot-munich'
  };

  const allRowsHtml = posts
    .map(p => {
      const tagPills = p.tags
        .map(t => `<a class="tag-pill" href="#tag-${t}" data-tag-filter="${t}">#${t}</a>`)
        .join('\n                  ');
      return `        <li class="post-index-row" data-planet="${p.planet}" data-tags="${p.tags.join(' ')}">
          <div class="post-index-main">
            <span class="orbit-dot ${dotClass[p.planet] || 'dot-munich'}" title="Orbit: ${p.planet}"></span>
            <a class="post-index-title" href="${p.url}">${p.title}</a>
            ${p.tags.length ? `<span class="post-index-tags">${tagPills}</span>` : ''}
          </div>
          <span class="post-index-date">${p.monthYear}</span>
        </li>`;
    })
    .join('\n');

  let rendered = content.replace(/\{\{\s*site\.posts\s*\|\s*size\s*\}\}/g, String(posts.length));

  // Replace the 4 planet Liquid loops
  for (const planetId of ['thinking-marvels', 'physical-software', 'culture-chess', 'munich-lab']) {
    const loopRe = new RegExp(
      `\\{%\\s*for\\s+post\\s+in\\s+site\\.posts\\s*%\\}[\\s\\S]*?post_planet\\s*==\\s*"${planetId}"[\\s\\S]*?\\{%\\s*endfor\\s*%\\}`
    );
    rendered = rendered.replace(loopRe, renderPlanetList(planetId));
  }

  // Replace the full index Liquid loop
  const fullIndexRe = /<ul id="posts" class="indexed-posts-list">[\s\S]*?<\/ul>/;
  rendered = rendered.replace(fullIndexRe, `<ul id="posts" class="indexed-posts-list">\n${allRowsHtml}\n    </ul>`);

  return renderDefaultLayout('thinking_on thinking', rendered, posts.length);
}

function renderPost(post, totalPosts) {
  const tagLinks = post.tags
    .map(t => `<a class="tag-pill" href="/#tag-${t}" title="View posts tagged with &quot;${t}&quot;">#${t}</a>`)
    .join(' ');
  const articleHtml = `
<article class='ten columns offset-by-four' id="article-content">
  <header class="ten columns" id="article-header">
    <h1>${post.title}</h1>
    <div class="post-tags-bar"><i class="icon-tags"></i> ${tagLinks}</div>
  </header>
  <div class='ten columns gray' id="date-header">
    <p>${post.monthYear}</p>
  </div>
  <div class="ten columns" id="article-body">
    ${post.contentHtml}
  </div>
  <footer class="ten columns post-footer">
    <p>
      <a class="button" href="/#all-posts">&larr; Back to Orbits &amp; Tagged Index</a>
      <a class="button" href="https://github.com/mulderp/mulderp.github.com/issues/new" target="_blank" rel="noopener"><i class="icon-comment"></i> Leave feedback on GitHub</a>
    </p>
  </footer>
</article>`;
  return renderDefaultLayout(post.title, articleHtml, totalPosts);
}

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = decodeURIComponent(reqUrl.pathname);

  if (pathname.startsWith('/static/')) {
    const filePath = path.join(rootDir, pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  const posts = loadPosts();
  if (pathname === '/' || pathname === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderIndex(posts));
    return;
  }

  const cleanSlug = pathname.replace(/^\/+|\/+$/g, '');
  const post = posts.find(p => p.slug.toLowerCase() === cleanSlug.toLowerCase());
  if (post) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderPost(post, posts.length));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

export { loadPosts, renderIndex, renderPost };

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => {
    console.log(`Local blog preview running at http://localhost:${PORT}`);
  });
}
