/**
 * AdSense 재신청 전 기술·운영 체크리스트를 출력한다.
 * 사용: npm run verify:reapply
 */
const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://www.howlearn.kr').replace(/\/+$/, '');

const CHECKS = [
  `신청 URL: ${SITE_URL} (apex 아님)`,
  `Search Console: 도메인 속성 howlearn.kr 등록 + sitemap ${SITE_URL}/sitemap-index.xml 제출`,
  `배포 확인: npm run verify:live (/guides Astro·canonical·ads.txt·404·redirects)`,
  `ads.txt: ${SITE_URL}/ads.txt → text/plain 200 (HTML이 아님)`,
  `소프트 404 없음: 존재하지 않는 URL → HTTP 404 (홈페이지 200 아님)`,
  `구 라우트: /domains → /concepts/, /toolkit → /guides/ 301`,
  `Cloudflare: /guides/* 캐시 퍼지, 구 learninsight Pages 프로젝트 분리`,
  `빌드 산출물: dist/404.html, dist/_redirects, dist/ads.txt 존재`,
  `애드센스: PUBLIC_ADSENSE_PUBLISHER_ID 설정 + BaseHead AdSense 스니펫 배포`,
  `대기: Phase 1~2 배포 후 최소 2~4주 인덱싱·트래픽 축적`,
  `math.howlearn.kr: 이번 AdSense 신청에 포함하지 않음`,
] as const;

console.log('AdSense 재신청 전 체크리스트\n');
for (const [index, item] of CHECKS.entries()) {
  console.log(`${index + 1}. [ ] ${item}`);
}
console.log('\n위 항목을 모두 확인한 뒤 www.howlearn.kr로 재신청하세요.');
