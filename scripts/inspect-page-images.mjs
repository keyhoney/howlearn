import fs from 'node:fs';
import path from 'node:path';

const target = process.argv[2] ?? 'dist/columns/day-before-test-brain-care/index.html';
const resolved = path.resolve(target);
const html = fs.readFileSync(resolved, 'utf8');
const headEnd = html.indexOf('</head>');
const head = html.slice(0, headEnd);
const body = html.slice(headEnd);

function pick(re, text) {
  const m = text.match(re);
  return m ? m[1] : null;
}

console.log('FILE:', target);
console.log('HEAD og:image:', pick(/property="og:image" content="([^"]+)"/, head));
console.log('HEAD itemprop image:', pick(/itemprop="image" content="([^"]+)"/, head));
const jsonLdImages = [...html.matchAll(/"image":"([^"]+)"/g)].map((m) => m[1]);
console.log('JSON-LD image:', jsonLdImages[0] ?? '(none)');

const bodyImgs = [...body.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
const faviconImgs = bodyImgs.filter((img) => /favicon\.(png|svg)/i.test(img));
console.log('\nBODY <img> count:', bodyImgs.length);
console.log('BODY favicon <img> count:', faviconImgs.length);
for (const [i, img] of bodyImgs.entries()) {
  const src = pick(/src="([^"]+)"/, img) ?? pick(/src='([^']+)'/, img);
  const cls = pick(/class="([^"]+)"/, img);
  const w = pick(/width="([^"]+)"/, img);
  const h = pick(/height="([^"]+)"/, img);
  const itemprop = img.includes('itemprop');
  console.log(`${i + 1}. src=${src} ${w}x${h} itemprop=${itemprop} class=${cls?.slice(0, 60)}`);
}

if (target.endsWith('.xml')) {
  const firstItem = pick(/<item>[\s\S]*?<\/item>/, html);
  const mediaContent = pick(/<media:content[^>]*url="([^"]+)"[^>]*>/, firstItem ?? html);
  console.log('\nRSS first item media:content url:', mediaContent ?? '(none)');
  const snippet = firstItem?.slice(0, 600) ?? html.slice(0, 600);
  console.log('\nRSS first item snippet:\n', snippet);
}
