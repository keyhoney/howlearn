import fs from 'node:fs/promises';
import path from 'node:path';
import { validateLegacyMathRedirects } from './validate-legacy-math-redirects';

const REDIRECTS_PATH = path.join(process.cwd(), 'public', '_redirects');

/** learninsight(구 Next.js) nav가 링크하던 경로 — SPA fallback(홈 200) 방지 */
const REQUIRED_LEARNINSIGHT_RULE_MARKERS = [
  '/domains https://www.howlearn.kr/concepts/ 301',
  '/domains/* https://www.howlearn.kr/concepts/:splat 301',
  '/toolkit https://www.howlearn.kr/guides/ 301',
  '/toolkit/* https://www.howlearn.kr/guides/:splat 301',
] as const;

export async function validateLearninsightRedirects(filePath = REDIRECTS_PATH): Promise<void> {
  const raw = await fs.readFile(filePath, 'utf8');
  const missing = REQUIRED_LEARNINSIGHT_RULE_MARKERS.filter((line) => !raw.includes(line));
  if (missing.length > 0) {
    throw new Error(
      `learninsight legacy redirects incomplete in ${filePath}:\n${missing.map((l) => `- ${l}`).join('\n')}`,
    );
  }
}

export async function validateAllLegacyRedirects(filePath = REDIRECTS_PATH): Promise<void> {
  await validateLegacyMathRedirects(filePath);
  await validateLearninsightRedirects(filePath);
}

await validateAllLegacyRedirects();
console.log('legacy redirect rules OK (math + learninsight)');
