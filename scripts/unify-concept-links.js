/**
 * [**개념명(영문명)/슬러그**](/concepts/slug) → [**개념명(영문명)**](/concepts/slug)
 * 링크 텍스트에서 /슬러그 제거하여 다른 문서와 통일
 */
const fs = require("fs");
const path = require("path");

const blogRoot = path.join(__dirname, "..");
const contentDir = path.join(blogRoot, "blog", "content");
const devNoteDir = path.join(blogRoot, "개발 노트");

function getAllMdxFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) getAllMdxFiles(full, files);
    else if (e.name.endsWith(".mdx")) files.push(full);
  }
  return files;
}

// )[**...**]( 에서 )/slug**]( 부분을 )**]( 로
const re = /\)\/([a-z0-9]+(?:-[a-z0-9]+)*)\*\*\]\(/g;

let totalReplaced = 0;
const dirs = [contentDir, devNoteDir];
for (const dir of dirs) {
  const files = getAllMdxFiles(dir);
  for (const file of files) {
    let s = fs.readFileSync(file, "utf8");
    const before = s;
    s = s.replace(re, ")**](");
    if (s !== before) {
      const count = (before.match(re) || []).length;
      totalReplaced += count;
      fs.writeFileSync(file, s);
      console.log(path.relative(blogRoot, file), count);
    }
  }
}
console.log("Total replacements:", totalReplaced);
