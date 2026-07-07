/**
 * MDX 콘텐츠 텍스트 중심 정리 스크립트
 * FaqSection, BottomSummary, Citation만 유지하고 나머지 UI 컴포넌트를 본문으로 흡수합니다.
 *
 * Usage: node scripts/simplify-mdx-content.mjs [columns|guides|concepts|all]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { glob } from 'node:fs/promises';

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content');
const KEEP_COMPONENTS = new Set(['FaqSection', 'BottomSummary', 'Citation']);

const SKIP_FILES = new Set([
  'columns/after-class-illusion.mdx',
  'columns/wrong-answers-best-data.mdx',
  'columns/hard-work-no-score.mdx',
  'columns/retrieval-before-reread.mdx',
]);

function parseAttrs(tagBody) {
  const attrs = {};
  const re = /(\w+)=(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/g;
  let m;
  while ((m = re.exec(tagBody)) !== null) {
    attrs[m[1]] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return attrs;
}

function parseJsonArray(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw.replace(/'/g, '"'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function extractTag(content, tagName) {
  const re = new RegExp(`<${tagName}\\b[\\s\\S]*?\\/>`, 'g');
  return content.replace(re, (match) => {
    const inner = match.slice(tagName.length + 1, -2);
    return transformComponent(tagName, inner, match);
  });
}

function extractTagWithChildren(content, tagName) {
  const re = new RegExp(`<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`, 'g');
  return content.replace(re, (match) => {
    const openEnd = match.indexOf('>');
    const inner = match.slice(openEnd + 1, match.lastIndexOf(`</${tagName}>`));
    const openTag = match.slice(0, openEnd + 1);
    const attrsPart = openTag.slice(tagName.length + 1, -1);
    return transformComponent(tagName, attrsPart + '\n' + inner, match);
  });
}

function transformComponent(name, raw, original) {
  const attrs = parseAttrs(raw);
  const childText = raw.includes('\n')
    ? raw
        .split('\n')
        .slice(1)
        .join('\n')
        .trim()
    : '';

  switch (name) {
    case 'ConclusionHero': {
      const lines = [attrs.line1, attrs.line2, attrs.line3, attrs.line4].filter(Boolean);
      const principle = attrs.principle ? `\n\n${attrs.principle}` : '';
      return `${lines.join(' ')}${principle}\n\n`;
    }
    case 'TopicIntro':
      return `## ${attrs.title}\n\n${attrs.description}\n\n`;
    case 'MdxH2': {
      const title = childText.trim() || attrs.title || '';
      return `## ${title}\n\n`;
    }
    case 'VsBox':
      return `**${attrs.titleA}:** ${attrs.descA}\n\n**${attrs.titleB}:** ${attrs.descB}\n\n`;
    case 'AnalogyBlock': {
      const parts = [
        attrs.concept ? `**${attrs.concept}**` : '',
        attrs.explanation,
        attrs.wrapUp,
      ].filter(Boolean);
      return `${parts.join(' ')}\n\n`;
    }
    case 'TrustModule': {
      const parts = [attrs.finding, attrs.implication].filter(Boolean);
      return `${parts.join(' ')}\n\n`;
    }
    case 'Callout': {
      const title = attrs.title ? `**${attrs.title}** ` : '';
      return `> ${title}${attrs.body}\n\n`;
    }
    case 'CaseModule': {
      return [
        attrs.title ? `**${attrs.title}**` : '',
        attrs.before,
        attrs.intervention ? `조정: ${attrs.intervention}` : '',
        attrs.after,
      ]
        .filter(Boolean)
        .join('\n\n') + '\n\n';
    }
    case 'MidSummaryBox': {
      const points = parseJsonArray(attrs.points);
      const highlight = attrs.highlight ? `\n\n${attrs.highlight}` : '';
      if (points.length === 0) return highlight ? `${highlight}\n\n` : '';
      return `${points.map((p) => `- ${p}`).join('\n')}${highlight}\n\n`;
    }
    case 'CheckboxChecklist': {
      const items = parseJsonArray(attrs.items);
      const title = attrs.title ? `## ${attrs.title}\n\n` : '';
      return `${title}${items.map((item) => `- ${item}`).join('\n')}\n\n`;
    }
    case 'Troubleshooting': {
      const items = parseJsonArray(attrs.items);
      const lines = items.flatMap((item) => [
        `**${item.problem}**`,
        item.solution,
        '',
      ]);
      return `## 자주 막히는 점\n\n${lines.join('\n')}\n`;
    }
    case 'OxQuiz': {
      const answer = attrs.correctIsO === 'true' ? 'O' : 'X';
      return `**오해 교정:** ${attrs.question} (정답: ${answer}) ${attrs.explanation}\n\n`;
    }
    case 'RelatedConcepts':
      return '';
    default:
      if (KEEP_COMPONENTS.has(name)) return original;
      return '';
  }
}

function simplifyBody(body) {
  let result = body;

  const tagFns = [
    (c) => extractTagWithChildren(c, 'MdxH2'),
    (c) => extractTag(c, 'ConclusionHero'),
    (c) => extractTag(c, 'TopicIntro'),
    (c) => extractTag(c, 'VsBox'),
    (c) => extractTag(c, 'AnalogyBlock'),
    (c) => extractTag(c, 'TrustModule'),
    (c) => extractTag(c, 'Callout'),
    (c) => extractTag(c, 'CaseModule'),
    (c) => extractTag(c, 'MidSummaryBox'),
    (c) => extractTag(c, 'CheckboxChecklist'),
    (c) => extractTag(c, 'Troubleshooting'),
    (c) => extractTag(c, 'OxQuiz'),
    (c) => extractTag(c, 'RelatedConcepts'),
  ];

  for (const fn of tagFns) {
    result = fn(result);
  }

  // Remove any remaining disallowed self-closing components
  result = result.replace(
    /<(?!FaqSection|BottomSummary|Citation)\w+[^>]*\/>/g,
    '',
  );

  // Collapse excessive blank lines
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trimEnd() + '\n';
}

function hasFaqInFrontmatter(frontmatter) {
  return /^faq:\s*$/m.test(frontmatter) || /^faq:\s*\n\s*-/m.test(frontmatter);
}

function ensureFaqSection(body, frontmatter) {
  if (body.includes('<FaqSection')) return body;
  if (!hasFaqInFrontmatter(frontmatter)) return body;

  if (body.includes('<BottomSummary')) {
    return body.replace('<BottomSummary', '<FaqSection />\n\n<BottomSummary');
  }
  return `${body.trimEnd()}\n\n<FaqSection />\n`;
}

async function processFile(relPath) {
  if (SKIP_FILES.has(relPath.replace(/\\/g, '/'))) {
    return { relPath, status: 'skipped' };
  }

  const fullPath = path.join(CONTENT_ROOT, relPath);
  const raw = await fs.readFile(fullPath, 'utf8');
  const normalized = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const fmMatch = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) return { relPath, status: 'no-frontmatter' };

  const [, frontmatter, body] = fmMatch;
  const hasHeavy =
    /<(ConclusionHero|TopicIntro|TrustModule|AnalogyBlock|Callout|VsBox|CaseModule|MidSummaryBox|CheckboxChecklist|Troubleshooting|OxQuiz|RelatedConcepts|MdxH2)\b/.test(
      body,
    );

  const needsLightTouch =
    /<(AnalogyBlock|Callout|VsBox|RelatedConcepts|MdxH2)\b/.test(body);

  if (!hasHeavy && !needsLightTouch) {
    return { relPath, status: 'unchanged' };
  }

  if (!hasHeavy && needsLightTouch) {
    let lightBody = body;
    lightBody = extractTagWithChildren(lightBody, 'MdxH2');
    lightBody = extractTag(lightBody, 'AnalogyBlock');
    lightBody = extractTag(lightBody, 'Callout');
    lightBody = extractTag(lightBody, 'VsBox');
    lightBody = extractTag(lightBody, 'RelatedConcepts');
    lightBody = lightBody.replace(/\n{3,}/g, '\n\n');
    lightBody = ensureFaqSection(lightBody, frontmatter);
    if (lightBody !== body) {
      const output = `---\n${frontmatter}\n---\n${lightBody}`;
      await fs.writeFile(fullPath, output.replace(/\n/g, '\r\n'), 'utf8');
      return { relPath, status: 'light-touch' };
    }
    return { relPath, status: 'unchanged' };
  }

  let newBody = simplifyBody(body);
  newBody = ensureFaqSection(newBody, frontmatter);

  const output = `---\n${frontmatter}\n---\n${newBody}`;
  await fs.writeFile(fullPath, output.replace(/\n/g, '\r\n'), 'utf8');
  return { relPath, status: 'converted' };
}

async function main() {
  const target = process.argv[2] ?? 'all';
  const dirs =
    target === 'all'
      ? ['columns', 'guides', 'concepts']
      : [target];

  const results = { converted: 0, 'light-touch': 0, skipped: 0, unchanged: 0, errors: [] };

  for (const dir of dirs) {
    for await (const entry of glob('**/*.mdx', { cwd: path.join(CONTENT_ROOT, dir) })) {
      const relPath = `${dir}/${entry}`;
      try {
        const result = await processFile(relPath);
        results[result.status] = (results[result.status] ?? 0) + 1;
        if (result.status === 'converted' || result.status === 'light-touch') {
          console.log(`${result.status}: ${relPath}`);
        }
      } catch (err) {
        results.errors.push({ relPath, error: String(err) });
        console.error(`error: ${relPath}`, err);
      }
    }
  }

  console.log('\nSummary:', results);
  if (results.errors.length > 0) process.exit(1);
}

main();
