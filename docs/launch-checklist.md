# 런치 체크리스트 (Step 10)

## 1) 빌드/배포 전 확인

- [ ] `npm run build` 성공
- [ ] `npm run smoke:check` 성공
- [ ] `/search`, `/robots.txt`, `/rss.xml`, `/sitemap-index.xml` 정상 노출
- [ ] Tina 스키마 변경 시 `tina/tina-lock.json` 최신 상태

## 2) 수동 회귀 시나리오

- [ ] 콘텐츠 라우트: `guides/concepts/books/columns` 목록+상세 정상
- [ ] 문제 라우트: `problems/essay-problems` 목록+상세 정상
- [ ] 필터: 문제/논술 목록 필터+페이지네이션 동작
- [ ] 로컬 상태: 정답 체크/오답노트/스크랩/집중모드 상태 유지
- [ ] 검색: 키워드 입력 시 결과 노출

## 3) 접근성/반응형 점검

- [ ] 키보드만으로 헤더 네비/검색/버튼 조작 가능
- [ ] 포커스 링 시각적으로 확인 가능
- [ ] 360 / 768 / 1024 / 1440 폭에서 레이아웃 깨짐 없음

## 4) 배포 승인 기준

- [ ] 크리티컬 이슈 0건
- [ ] 최근 3회 배포 빌드 성공
- [ ] 운영자 단독으로 발행/검수/롤백 수행 가능

## 5) 운영 문서 참조

- Cloudflare 배포 설정: `docs/deploy-cloudflare-pages.md`
- 장애 대응: `docs/incident-response.md`
- 롤백 절차: `docs/rollback-guide.md`
