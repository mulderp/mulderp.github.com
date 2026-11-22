import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const postsDir = path.join(rootDir, '_posts');

const THINKING_MARVELS_SLUGS = new Set([
  'marvin-minsky-passed-away',
  'yasiv-book-graph',
  'book-progress',
  'visual-languages',
  'the-value-of-iteration',
  'on-education-innovation',
  'push-conference',
  'software-categories',
  'ruby-and-patterns',
  'on-innovation-communities',
  'usability-is-everywhere'
]);

const PHYSICAL_SOFTWARE_SLUGS = new Set([
  'i-broke-the-3d-printer',
  'learning-c-for-javascripters',
  'eclipses-and-programming',
  'design-ofmodular-hardware',
  'learning-about-biohacking',
  'building-digital-hardware',
  'exploring-noble-and-blueiot',
  'hardware-cost-reductions',
  'espruino-javascript-on-bare-metal',
  'single-board-computers',
  'push-state-from-an-embedded-device',
  'an-arduino-sketch-from-scratch',
  'serial-input-with-streams',
  'serial-communication-with-nodejs',
  'digital-and-analog',
  're-entering-hardware'
]);

const CULTURE_CHESS_SLUGS = new Set([
  'voyage-en-france',
  'need-writing-again',
  'beethoven-on-coursera',
  'modern-arts-in-houston',
  'end-of-industrialisation',
  'some-thoughts-about-writing',
  'book-review-python-for-finances',
  'switching-blogs',
  'tweaking-images',
  'learning-from-cinema-websites',
  'writing-on-ruby-and-backbone',
  'writing-a-book',
  'new-kid-on-the-blog'
]);

export function classifyPlanet(slug, tags = [], explicitPlanet = '') {
  if (explicitPlanet) return explicitPlanet;
  const s = slug.toLowerCase();
  if (THINKING_MARVELS_SLUGS.has(s)) return 'thinking-marvels';
  if (PHYSICAL_SOFTWARE_SLUGS.has(s)) return 'physical-software';
  if (CULTURE_CHESS_SLUGS.has(s)) return 'culture-chess';

  const lowerTags = tags.map(t => t.toLowerCase());
  if (lowerTags.some(t => ['ai', 'mind', 'thinking', 'models', 'cognition', 'agents', 'llm'].includes(t))) {
    return 'thinking-marvels';
  }
  if (lowerTags.some(t => ['hardware', 'arduino', 'embedded', 'c', 'iot', '3d', 'robotics'].includes(t))) {
    return 'physical-software';
  }
  if (lowerTags.some(t => ['chess', 'lichess', 'music', 'art', 'arts', 'travel', 'culture'].includes(t))) {
    return 'culture-chess';
  }
  return 'munich-lab';
}

function parsePost(filePath, fileName) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const m = fileName.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.(md|markdown)$/);
  const year = m ? m[1] : 'draft';
  const date = m ? `${m[1]}-${m[2]}-${m[3]}` : 'draft';
  const slug = m ? m[4] : fileName;

  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const data = {};
  let body = raw;
  if (fmMatch) {
    body = fmMatch[2];
    for (const line of fmMatch[1].split(/\r?\n/)) {
      const idx = line.indexOf(':');
      if (idx !== -1) {
        data[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      }
    }
  }

  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const paragraphs = body.trim().split(/\r?\n\r?\n+/).filter(Boolean);
  const headings = (body.match(/^#{1,4}\s+.+$/gm) || []);
  const links = (body.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length;
  const codeBlocks = (body.match(/```[\s\S]*?```/g) || []).length + (body.match(/^(?: {4}|\t).+$/gm) || []).length;
  const images = (body.match(/!\[([^\]]*)\]\(([^)]+)\)|<img\s/gi) || []).length;
  const questions = (body.match(/\?/g) || []).length;
  const tags = (data.tags || '').replace(/[\[\],]/g, ' ').split(/\s+/).filter(Boolean);
  const planet = classifyPlanet(slug, tags, data.planet);

  const avgParagraphWords = paragraphs.length ? Math.round(words / paragraphs.length) : words;
  const firstParagraph = paragraphs[0] || '';
  const lastParagraph = paragraphs[paragraphs.length - 1] || '';

  const diagnostics = [];
  if (words > 450 && headings.length === 0) {
    diagnostics.push('WALL-OF-TEXT RISK: Over 450 words with 0 subheadings. Break into 2-4 signposted sections.');
  }
  if (avgParagraphWords > 90) {
    diagnostics.push(`DENSE PARAGRAPHS: Average paragraph is ${avgParagraphWords} words. Aim for 40-75 words.`);
  }
  if (firstParagraph.split(/\s+/).length > 100) {
    diagnostics.push('SLOW HOOK: Opening paragraph is over 100 words. Surface the core question or tension in sentence 1-2.');
  }
  if (links === 0 && codeBlocks === 0 && images === 0) {
    diagnostics.push('NO CONCRETE ANCHORS: No links, code snippets, or diagrams. Add at least 1 concrete artifact or reference.');
  }
  if (diagnostics.length === 0) {
    diagnostics.push('CLEAR STRUCTURE: Good balance of length, paragraph pacing, signposting, and concrete anchors.');
  }

  return {
    file: fileName,
    date,
    year,
    slug,
    title: data.title || slug,
    tags,
    planet,
    words,
    paragraphCount: paragraphs.length,
    avgParagraphWords,
    headings,
    links,
    codeBlocks,
    images,
    questions,
    firstParagraph,
    lastParagraph,
    diagnostics
  };
}

const targetArg = process.argv[2];

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (targetArg) {
    let targetPath = path.resolve(process.cwd(), targetArg);
    if (!fs.existsSync(targetPath)) {
      const candidates = fs.readdirSync(postsDir).filter(f => f.toLowerCase().includes(targetArg.toLowerCase()));
      if (candidates.length === 0) {
        console.error(`No post found matching: ${targetArg}`);
        process.exit(1);
      }
      targetPath = path.join(postsDir, candidates[candidates.length - 1]);
    }
    const p = parsePost(targetPath, path.basename(targetPath));
    console.log(`\n=== FIRST-PASS SCAN: "${p.title}" (${p.file}) ===`);
    console.log(`Date: ${p.date} | Planet: ${p.planet} | Tags: ${p.tags.join(', ') || 'none'}`);
    console.log(`Words: ${p.words} | Paragraphs: ${p.paragraphCount} (avg ${p.avgParagraphWords}w)`);
    console.log(`Headings: ${p.headings.length} | Links: ${p.links} | Code lines/blocks: ${p.codeBlocks} | Questions: ${p.questions}`);
    if (p.headings.length) {
      console.log(`Outline:\n  ${p.headings.join('\n  ')}`);
    }
    console.log(`\nOpening Hook:\n  "${p.firstParagraph.replace(/\r?\n/g, ' ').slice(0, 220)}..."`);
    console.log(`\nClosing Takeaway:\n  "${p.lastParagraph.replace(/\r?\n/g, ' ').slice(0, 220)}..."`);
    console.log(`\nDiagnostics:`);
    for (const d of p.diagnostics) {
      console.log(`  - ${d}`);
    }
  } else {
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md') || f.endsWith('.markdown'));
    const posts = files.map(f => parsePost(path.join(postsDir, f), f)).sort((a, b) => a.date.localeCompare(b.date));

    const byYear = {};
    const byPlanet = {};
    const tagCounts = {};
    for (const p of posts) {
      byYear[p.year] = (byYear[p.year] || 0) + 1;
      byPlanet[p.planet] = (byPlanet[p.planet] || 0) + 1;
      for (const t of p.tags) {
        const lt = t.toLowerCase();
        tagCounts[lt] = (tagCounts[lt] || 0) + 1;
      }
    }

    const totalWords = posts.reduce((s, p) => s + p.words, 0);
    const avgWords = Math.round(totalWords / posts.length);
    const shortPosts = posts.filter(p => p.words < 200);
    const mediumPosts = posts.filter(p => p.words >= 200 && p.words <= 600);
    const longPosts = posts.filter(p => p.words > 600);
    const postsWithoutHeadingsLong = posts.filter(p => p.words > 450 && p.headings.length === 0);

    console.log(`=== THINKINGONTHINKING.COM BLOG PULSE (${posts.length} POSTS) ===`);
    console.log(`Total Posts: ${posts.length} | Total Words: ${totalWords} | Avg Words/Post: ${avgWords}`);
    console.log('4-Planet Orbits:', JSON.stringify(byPlanet));
    console.log('Posts by Year:', JSON.stringify(byYear));
    console.log(
      'Top Tags:',
      Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([t, c]) => `${t} (${c})`)
        .join(', ')
    );
    console.log(`Length Distribution: Short (<200w): ${shortPosts.length} | Sweet Spot (200-600w): ${mediumPosts.length} | Deep Dive (>600w): ${longPosts.length}`);
    console.log(`Longer posts (>450w) with 0 subheadings (wall-of-text risk): ${postsWithoutHeadingsLong.length}`);
    console.log(`\nTip: Run "node ops/blog-pulse.mjs <keyword-or-filename>" to scan any specific post or draft.`);
  }
}
