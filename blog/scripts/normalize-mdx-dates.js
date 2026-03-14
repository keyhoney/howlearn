/**
 * concepts + guides MDX: (1) remove "date" from frontmatter,
 * (2) set datePublished / dateModified / dateReviewed to fixed values.
 */
const fs = require("fs");
const path = require("path");

const CONCEPTS_DIR = path.join(__dirname, "../content/concepts");
const GUIDES_DIR = path.join(__dirname, "../content/guides");

const DATE_PUBLISHED = "2023-10-20";
const DATE_MODIFIED = "2026-03-12";
const DATE_REVIEWED = "2026-03-14";

const DATE_KEYS = ["date", "datePublished", "dateModified", "dateReviewed"];

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { changed: false };

  const [, frontmatter, body] = match;
  const lines = frontmatter.split(/\r?\n/);
  const newLines = [];
  let inserted = false;

  for (const line of lines) {
    const key = line.replace(/^(\w+):.*/, "$1").trim();
    if (DATE_KEYS.includes(key)) continue;
    newLines.push(line);
    if (!inserted && (key === "slug" || key === "status")) {
      newLines.push(`datePublished: ${DATE_PUBLISHED}`);
      newLines.push(`dateModified: ${DATE_MODIFIED}`);
      newLines.push(`dateReviewed: ${DATE_REVIEWED}`);
      inserted = true;
    }
  }

  if (!inserted) {
    newLines.unshift(`datePublished: ${DATE_PUBLISHED}`);
    newLines.unshift(`dateModified: ${DATE_MODIFIED}`);
    newLines.unshift(`dateReviewed: ${DATE_REVIEWED}`);
  }

  const newFront = newLines.join("\n");
  const newRaw = `---\n${newFront}\n---\n${body}`;
  if (newRaw === raw) return { changed: false };

  fs.writeFileSync(filePath, newRaw, "utf8");
  return { changed: true };
}

function run(dir, label) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  let changed = 0;
  for (const f of files) {
    const result = processFile(path.join(dir, f));
    if (result.changed) {
      changed++;
      console.log(`  ${label}/${f}`);
    }
  }
  return changed;
}

let total = 0;
total += run(CONCEPTS_DIR, "concepts");
total += run(GUIDES_DIR, "guides");
console.log(`Done. Updated ${total} files.`);
