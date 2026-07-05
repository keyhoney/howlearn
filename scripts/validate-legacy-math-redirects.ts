import fs from 'node:fs/promises';
import path from 'node:path';

const REDIRECTS_PATH = path.join(process.cwd(), 'public', '_redirects');

/** www → math 301 규칙이 빠지면 통합 앱 시절 URL이 soft 404(홈 200)로 떨어진다. */
const REQUIRED_RULE_MARKERS = [
  '/problems/* https://math.howlearn.kr/problems/:splat 301',
  '/essay-problems/* https://math.howlearn.kr/essay-problems/:splat 301',
  '/dashboard https://math.howlearn.kr/dashboard/ 301',
] as const;

export async function validateLegacyMathRedirects(filePath = REDIRECTS_PATH): Promise<void> {
  const raw = await fs.readFile(filePath, 'utf8');
  const missing = REQUIRED_RULE_MARKERS.filter((line) => !raw.includes(line));
  if (missing.length > 0) {
    throw new Error(
      `legacy math redirects incomplete in ${filePath}:\n${missing.map((l) => `- ${l}`).join('\n')}`,
    );
  }
}
