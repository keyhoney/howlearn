/**
 * 모든 글(guides + concepts)에서 본문 내 <FAQ items={...} /> 또는 <FAQ items='...' />를 찾아
 * frontmatter faq로 옮기고 본문에서는 해당 블록을 제거합니다.
 * 실행: node scripts/move-faq-to-frontmatter.js
 * 옵션: --dry-run 으로 실제 쓰기 없이 변경 대상만 출력
 */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const CONTENT_DIR = path.join(__dirname, "../content");
const DRY_RUN = process.argv.includes("--dry-run");

/**
 * content에서 <FAQ ... items=... /> 블록을 찾아 { faqArray, blockStart, blockEnd } 반환.
 * blockStart/blockEnd는 제거할 범위(앞의 MdxH2 "자주 묻는 질문" 포함).
 */
function extractFaqBlock(content) {
  const faqStart = content.indexOf("<FAQ");
  if (faqStart === -1) return null;

  const afterFaqOpen = content.slice(faqStart);
  const itemsMatch = afterFaqOpen.match(/\bitems\s*=\s*([\'\{])/);
  if (!itemsMatch) return null;

  const quote = itemsMatch[1];
  const valueStart = itemsMatch.index + itemsMatch[0].length;

  let valueEnd;
  let rawValue;

  if (quote === "'" || quote === '"') {
    const q = quote;
    const rest = afterFaqOpen.slice(valueStart);
    const endMatch = rest.match(/\]\s*[\'"]\s*\//);
    if (endMatch) {
      const valueLen = endMatch.index + 1;
      valueEnd = valueStart + valueLen - 1;
      const raw = rest.slice(0, valueLen);
      rawValue = raw.replace(/\\'/g, "'").replace(/\\"/g, '"').trim();
    } else {
      let i = valueStart;
      while (i < afterFaqOpen.length) {
        if (afterFaqOpen[i] === "\\") {
          i += 2;
          continue;
        }
        if (afterFaqOpen[i] === q) {
          valueEnd = i;
          break;
        }
        i++;
      }
      if (valueEnd == null) return null;
      rawValue = afterFaqOpen.slice(valueStart, valueEnd).replace(/\\'/g, "'").replace(/\\"/g, '"').trim();
    }
  } else {
    let depth = 1;
    let i = valueStart;
    let inString = null;
    let escape = false;
    while (i < afterFaqOpen.length && depth > 0) {
      const c = afterFaqOpen[i];
      if (escape) {
        escape = false;
        i++;
        continue;
      }
      if (inString) {
        if (c === "\\") escape = true;
        else if (c === inString) inString = null;
        i++;
        continue;
      }
      if (c === '"' || c === "'") {
        inString = c;
        i++;
        continue;
      }
      if (c === "{") depth++;
      else if (c === "}") depth--;
      i++;
    }
    valueEnd = i - 1;
    rawValue = afterFaqOpen.slice(valueStart, valueEnd).trim();
  }

  let faqArray;
  try {
    let normalizedValue = rawValue.trim();
    normalizedValue = normalizedValue.replace(/,\s*]/g, "]").replace(/,\s*}/g, "}");
    const quoteKeys = (s) => s.replace(/([,{\[])\s*(question|answer)(\s*):/g, '$1"$2"$3:');
    if (normalizedValue.startsWith("[")) {
      const jsonStr = quoteKeys(normalizedValue);
      faqArray = JSON.parse(jsonStr);
    } else {
      const jsToJson = quoteKeys(normalizedValue);
      faqArray = JSON.parse(jsToJson.startsWith("[") ? jsToJson : "[" + jsToJson + "]");
    }
  } catch (e) {
    if (process.argv.includes("--dry-run") || process.env.DEBUG_FAQ) {
      console.warn("  parse faq value failed:", e.message);
    }
    return null;
  }

  if (!Array.isArray(faqArray)) faqArray = [faqArray];
  const normalized = faqArray
    .filter((x) => x && (x.question != null || x.answer != null))
    .map((x) => ({
      question: String(x.question ?? "").trim(),
      answer: String(x.answer ?? "").trim(),
    }))
    .filter((x) => x.question || x.answer);

  if (normalized.length === 0) return null;

  const afterValue = afterFaqOpen.slice(valueEnd + 1);
  const closeTag = afterValue.search(/\/\s*>/);
  if (closeTag === -1) return null;

  const blockEndInAfter = valueEnd + 1 + closeTag + 2;
  const blockEnd = faqStart + blockEndInAfter;

  let blockStart = faqStart;
  const beforeFaq = content.slice(0, faqStart);
  const mdxH2Match = beforeFaq.match(/\n\s*<MdxH2[^>]*>\s*자주\s*묻는\s*질문\s*<\/MdxH2>\s*$/);
  if (mdxH2Match) {
    blockStart = Math.max(0, beforeFaq.indexOf(mdxH2Match[0]));
  }

  return { faqArray: normalized, blockStart, blockEnd };
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const { data: fm, content } = parsed;

  if (content.indexOf("<FAQ") === -1) return { changed: false };

  const extracted = extractFaqBlock(content);
  if (!extracted) return { changed: false };

  const { faqArray, blockStart, blockEnd } = extracted;

  const newContent = content.slice(0, blockStart).replace(/\n{3,}/g, "\n\n").trimEnd() + "\n\n" + content.slice(blockEnd).replace(/^\n+/, "\n");
  const newFm = { ...fm, faq: faqArray };
  const newRaw = matter.stringify(newContent, newFm, { lineWidth: -1 });

  return { changed: true, newRaw, filePath };
}

function main() {
  const dirs = [
    path.join(CONTENT_DIR, "guides"),
    path.join(CONTENT_DIR, "concepts"),
  ];

  let total = 0;
  let changed = 0;

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
    for (const f of files) {
      const filePath = path.join(dir, f);
      total++;
      const result = processFile(filePath);
      if (result.changed) {
        changed++;
        console.log(result.filePath);
        if (!DRY_RUN) {
          fs.writeFileSync(result.filePath, result.newRaw, "utf8");
        }
      }
    }
  }

  console.log("");
  console.log(`Scanned ${total} files, ${changed} files ${DRY_RUN ? "would be" : ""} updated.`);
  if (DRY_RUN && changed > 0) {
    console.log("Run without --dry-run to apply changes.");
  }
}

main();
