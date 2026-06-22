import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const columnsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/content/columns');
let fixed = 0;

for (const f of fs.readdirSync(columnsDir).filter((x) => x.endsWith('.mdx'))) {
  const fp = path.join(columnsDir, f);
  let s = fs.readFileSync(fp, 'utf8').replace(/^\uFEFF/, '');
  if (!s.includes("\\'")) continue;
  const ns = s.replace(/\\'/g, '"');
  if (ns !== s) {
    fs.writeFileSync(fp, ns, 'utf8');
    fixed++;
  }
}

console.log(`Fixed ${fixed} files`);
