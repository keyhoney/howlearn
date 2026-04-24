# 배포 롤백 가이드

운영 장애가 발생했을 때 가장 빠르게 서비스 안정 상태로 되돌리기 위한 절차입니다.

## 1) 롤백 판단 기준

- 핵심 라우트(홈/콘텐츠/문제)가 500 또는 대량 404
- 검색/SEO 핵심 엔드포인트(`/search`, `/rss.xml`, `/robots.txt`) 비정상
- 운영자가 즉시 복구 가능한 핫픽스가 15분 내 불가능

## 2) Git 기반 롤백(권장)

1. 마지막 정상 커밋 SHA 확인
2. 새 롤백 커밋 생성 (revert)
3. `main`에 푸시하여 Pages 자동 배포 트리거
4. 배포 완료 후 핵심 라우트 스모크 점검

## 3) Cloudflare Pages 대시보드 롤백(긴급)

1. Deployments에서 마지막 정상 배포 선택
2. **Retry deployment** 또는 **Set as production**(UI 제공 시) 실행
3. 트래픽이 정상 배포로 전환되었는지 확인

## 4) 롤백 후 필수 점검

- `npm run build`
- `npm run smoke:check`
- `/search`, `/rss.xml`, `/sitemap-index.xml` 재확인
- 장애 원인 분석 및 재발 방지 항목 문서화
