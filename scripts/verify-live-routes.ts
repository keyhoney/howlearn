/**
 * 배포 후 운영 URL이 Astro 빌드(현행)인지, 구 learninsight Next.js 잔존이 아닌지 검증한다.
 * 사용: npm run verify:live
 */
const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://www.howlearn.kr').replace(/\/+$/, '');
const MATH_SITE_URL = (process.env.PUBLIC_MATH_SITE_URL || 'https://math.howlearn.kr').replace(
  /\/+$/,
  '',
);

const ROUTES = ['/guides/', '/guides', '/columns/', '/concepts/', '/'] as const;

const STALE_MARKERS = ['learninsight.pages.dev', 'meta-next-size-adjust', '학문별', '툴킷'] as const;

const REQUIRED_MARKERS = ['Astro', '학부모 가이드', 'rel="canonical"'] as const;

type CheckResult = { name: string; ok: boolean; errors: string[] };

async function checkRoute(pathname: string): Promise<CheckResult> {
  const url = `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
  const errors: string[] = [];

  let html: string;
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'HowLearn-deploy-verify/1.0' },
    });
    if (!response.ok) {
      errors.push(`HTTP ${response.status}`);
      return { name: `route ${pathname}`, ok: false, errors };
    }
    html = await response.text();
  } catch (error) {
    errors.push(`fetch failed: ${error instanceof Error ? error.message : String(error)}`);
    return { name: `route ${pathname}`, ok: false, errors };
  }

  for (const marker of STALE_MARKERS) {
    if (html.includes(marker)) {
      errors.push(`stale marker found: ${marker}`);
    }
  }

  if (pathname.includes('guides')) {
    for (const marker of REQUIRED_MARKERS) {
      if (!html.includes(marker)) {
        errors.push(`missing required marker: ${marker}`);
      }
    }
  }

  return { name: `route ${pathname}`, ok: errors.length === 0, errors };
}

async function checkAdsTxt(): Promise<CheckResult> {
  const url = `${SITE_URL}/ads.txt`;
  const errors: string[] = [];

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'HowLearn-deploy-verify/1.0' },
    });
    if (!response.ok) {
      errors.push(`HTTP ${response.status}`);
      return { name: 'ads.txt', ok: false, errors };
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/plain')) {
      errors.push(`expected text/plain, got ${contentType || '(none)'}`);
    }

    const body = (await response.text()).trim();
    if (!body.includes('google.com')) {
      errors.push('body missing google.com');
    }
    if (!/pub-\d+/i.test(body)) {
      errors.push('body missing publisher id');
    }
    if (body.includes('<html') || body.includes('<!DOCTYPE')) {
      errors.push('body looks like HTML (soft 404 / SPA fallback)');
    }
  } catch (error) {
    errors.push(`fetch failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  return { name: 'ads.txt', ok: errors.length === 0, errors };
}

async function checkSoft404(): Promise<CheckResult> {
  const url = `${SITE_URL}/__howlearn-verify-missing-${Date.now()}`;
  const errors: string[] = [];

  try {
    const response = await fetch(url, {
      redirect: 'manual',
      headers: { 'User-Agent': 'HowLearn-deploy-verify/1.0' },
    });
    if (response.status !== 404) {
      errors.push(`expected HTTP 404, got ${response.status}`);
    }

    const body = await response.text();
    if (body.includes('수학, 어떻게 공부해야 할까요') && !body.includes('페이지를 찾을 수 없습니다')) {
      errors.push('missing URL returned homepage HTML (soft 404)');
    }
  } catch (error) {
    errors.push(`fetch failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  return { name: 'soft 404', ok: errors.length === 0, errors };
}

async function checkRedirect(
  pathname: string,
  expectedLocation: string | RegExp,
): Promise<CheckResult> {
  const url = `${SITE_URL}${pathname}`;
  const errors: string[] = [];

  try {
    const response = await fetch(url, {
      redirect: 'manual',
      headers: { 'User-Agent': 'HowLearn-deploy-verify/1.0' },
    });
    if (![301, 302, 307, 308].includes(response.status)) {
      errors.push(`expected redirect, got HTTP ${response.status}`);
      return { name: `redirect ${pathname}`, ok: false, errors };
    }

    const location = response.headers.get('location') || '';
    const matches =
      typeof expectedLocation === 'string'
        ? location.includes(expectedLocation)
        : expectedLocation.test(location);
    if (!matches) {
      errors.push(`Location mismatch: ${location || '(empty)'}`);
    }
  } catch (error) {
    errors.push(`fetch failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  return { name: `redirect ${pathname}`, ok: errors.length === 0, errors };
}

function printResult(result: CheckResult) {
  const status = result.ok ? 'OK' : 'FAIL';
  console.log(`[${status}] ${result.name}`);
  for (const err of result.errors) {
    console.log(`  - ${err}`);
  }
}

async function main() {
  const results = await Promise.all([
    ...ROUTES.map((route) => checkRoute(route)),
    checkAdsTxt(),
    checkSoft404(),
    checkRedirect('/toolkit', '/guides'),
    checkRedirect('/domains', '/concepts'),
    checkRedirect('/problems', MATH_SITE_URL),
  ]);
  const failed = results.filter((r) => !r.ok);

  for (const result of results) {
    printResult(result);
  }

  if (failed.length > 0) {
    console.error(`\nverify-live-routes failed: ${failed.length}/${results.length} checks`);
    console.error('Cloudflare 캐시 퍼지 및 Pages 프로덕션 배포를 확인하세요.');
    process.exit(1);
  }

  console.log(`\nverify-live-routes passed: ${results.length} checks`);
}

main().catch((error) => {
  console.error('verify-live-routes failed unexpectedly');
  console.error(error);
  process.exit(1);
});
