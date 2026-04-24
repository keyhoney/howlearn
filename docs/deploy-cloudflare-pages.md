# Cloudflare Pages 배포 설정 가이드

이 문서는 9단계 요구사항인 "main push -> build/deploy 자동화"를 운영자가 직접 점검할 수 있도록 정리한 체크 가이드입니다.

## 1) GitHub 연동

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** 선택
2. GitHub 저장소 연결 후 대상 저장소를 `howlearn-astro`로 지정
3. Production branch를 `main`으로 설정

## 2) 빌드 설정

- **Build command**
  - Tina 미사용: `npm run build`
  - Tina 포함 운영: `npm run tina:build`
- **Build output directory**
  - `dist/client`
- **Node 버전**
  - 22.x 이상 (프로젝트 `package.json` engines와 일치)

## 3) 환경 변수

Tina를 사용하는 경우 아래 변수를 Pages 환경 변수에 등록합니다.

- `TINA_CLIENT_ID`
- `TINA_TOKEN`
- `TINA_BRANCH` (`main`)

## 4) 첫 배포 후 확인

- `https://<project>.pages.dev/` 접속 확인
- `/search`, `/rss.xml`, `/robots.txt`, `/sitemap-index.xml` 응답 확인
- 최신 커밋이 Deployments 목록에 반영되었는지 확인

## 5) 자동 배포 검증

1. `main`에 작은 문서 변경 커밋 푸시
2. Pages Deployments에서 자동 빌드 시작 확인
3. 배포 완료 후 변경 반영 확인
