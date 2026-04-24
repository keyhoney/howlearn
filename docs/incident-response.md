# 장애 대응 체크리스트

## 1) 초기 대응 (5분 내)

1. 사용자 영향 범위 확인 (전체/일부 라우트, 관리자 페이지 포함 여부)
2. 최근 변경 확인 (최근 커밋, 배포 시각, Tina 스키마 변경 여부)
3. 임시 우회 공지 (필요 시 공지 배너/커뮤니케이션 채널 공지)

## 2) 원인 분류

- **빌드 실패형**: CI 로그에서 `quality:gate`, `astro build`, `pagefind` 실패 지점 확인
- **런타임 실패형**: 특정 라우트 404/500, 콘솔 에러, Cloudflare 로그 확인
- **콘텐츠 실패형**: frontmatter 누락, 참조 무결성 깨짐, Tina 인덱싱 지연

## 3) 즉시 복구 순서

1. 로컬 재현: `npm run build` + `npm run smoke:check`
2. 콘텐츠 무결성 확인: `npm run quality:gate`
3. 배포 이슈면 마지막 정상 커밋으로 롤백 배포
4. 복구 후 `/search`, `/rss.xml`, `/sitemap-index.xml` 재확인

## 4) 사후 조치

- 장애 원인/영향/조치/재발 방지안 기록
- 필요 시 `launch-checklist.md` 항목 보강
- 운영 문서(`cms-editing-guide.md`)에 교훈 반영
