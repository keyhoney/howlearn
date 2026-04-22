# GitHub · Cloudflare 배포 체크리스트 (HowLearn 블로그)

저장소 구조: 앱은 **`blog/`** 폴더에 있음. 아래 단계에서 **루트 디렉터리**를 `blog`로 두는 설정이 반복됩니다.

---

## 1. GitHub에서 할 일

### 1.1 저장소 준비

- [ ] 로컬 변경사항 커밋·푸시 (`.env*`·비밀 값은 **커밋하지 않기**).
- [ ] `blog/.env.example`만 참고용으로 유지하고, 실제 키는 GitHub Secrets나 Cloudflare 환경 변수에만 둠.

### 1.2 브랜치 정책

- [ ] **프로덕션 배포에 쓸 브랜치** 결정 (예: `main`). Cloudflare Pages의 “Production branch”와 동일하게 맞춤.
- [ ] (선택) PR 프리뷰를 쓸 경우 브랜치 보호 규칙·필수 리뷰 등 정책 정리.

### 1.3 Cloudflare와 연동

- [ ] Cloudflare 대시보드에서 GitHub 저장소 연결 시, 저장소·조직 접근 권한 승인.
- [ ] 모노레포이므로 Pages 프로젝트 설정에서 **Root directory = `blog`** 인지 확인 (누락 시 빌드가 루트에서 실패함).

### 1.4 (선택) GitHub Actions

- [ ] Cloudflare Pages가 **자체 빌드**를 수행한다면 별도 Actions는 필수 아님.
- [ ] CI에서 `blog`로 들어가 `npm ci` → `npm run lint` → `npm run build`만 검증하고 싶다면 워크플로 추가 가능.

---

## 2. Cloudflare에서 할 일

### 2.1 Pages 프로젝트 생성·연결

- [ ] **Workers & Pages** → **Create** → **Pages** → **Connect to Git** 으로 GitHub 저장소 선택.
- [ ] **Production branch**를 실제 운영 브랜치와 일치.
- [ ] **Build configuration**
  - **Root directory:** `blog`
  - **Build command:** `npm run build` (또는 저장소에서 쓰는 패키지 매니저에 맞게 `pnpm build` 등)
  - **Build output directory:** Next.js를 **OpenNext for Cloudflare**로 배포하는 경우, Cloudflare/OpenNext 문서에 안내된 출력 경로를 사용 (보통 Wrangler·`.open-next` 기반; 대시보드에 “Framework preset”이 있다면 문서와 맞는지 확인).

### 2.2 OpenNext + Wrangler (Next.js 15 권장)

로컬 `blog`에서 한 번 설정하고 커밋하는 흐름이 일반적입니다.

- [ ] 공식 가이드: [OpenNext — Cloudflare — Get Started](https://opennext.js.org/cloudflare/get-started)
- [ ] `blog` 폴더에서 `npx @opennextjs/cloudflare migrate` 실행(또는 문서의 수동 단계).
- [ ] 생성·수정된 파일 예: `wrangler.jsonc`, `open-next.config.ts`, `package.json`의 `preview` / `deploy` 스크립트 등 → **저장소에 커밋**.
- [ ] `next.config.ts`에 문서대로 `initOpenNextCloudflareForDev()` 추가 여부 검토(로컬 개발·바인딩용).
- [ ] **Wrangler 3.99.0 이상** 사용.
- [ ] `.open-next`는 빌드 산출물이므로 **Git에 올리지 않음** (이미 `.gitignore`에 포함된 경우 유지).

> 참고: 현재 `npm run build`는 **`generate-rss` 후 `next build`** 이므로, OpenNext가 `npm run build`를 호출하면 RSS 정적 파일 생성까지 함께 수행됩니다.

### 2.3 환경 변수 (Pages → Settings → Environment variables)

**Production**(및 필요 시 Preview)에 아래를 이전 호스팅(Vercel 등)과 동일하게 설정.

| 이름 | 설명 |
|------|------|
| `NEXT_PUBLIC_SITE_URL` | **필수 권장:** `https://www.howlearn.kr` — canonical, OG, RSS, sitemap, 미들웨어 정책과 일치 |
| `NEXT_PUBLIC_IMAGE_BASE_URL` | 이미지가 웹앱과 다른 도메인일 때만 |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 측정 ID |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | AdSense 사용 시 |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase (댓글) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | 동일 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | 동일 |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | 동일 |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | 동일 |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | 동일 |

- [ ] **Preview 배포**에서도 동작 확인이 필요하면 Preview 환경에 최소한의 `NEXT_PUBLIC_*` 복사 또는 오버라이드.
- [ ] `CF_PAGES_URL` / `CF_PAGES_BRANCH_URL`은 Cloudflare가 주입하는 경우가 많음. 프로덕션 도메인은 **`NEXT_PUBLIC_SITE_URL`로 고정**하는 것이 안전함.

### 2.4 커스텀 도메인·DNS·SSL

- [ ] Pages 프로젝트에 **커스텀 도메인** 추가: `www.howlearn.kr` (및 필요 시 apex `howlearn.kr`).
- [ ] DNS: Cloudflare가 안내하는 **CNAME 또는 A/AAAA** 레코드 적용.
- [ ] SSL/TLS: **Full (strict)** 등 권장 모드로 인증서 활성화.
- [ ] 앱의 [`blog/middleware.ts`](blog/middleware.ts)는 `howlearn.kr` → `https://www.howlearn.kr` 로 **301** 리다이렉트함. Cloudflare **Page Rules / Redirect Rules**에서 동일 apex→www를 **이중으로 걸지 않도록** 정리(루프·과다 리다이렉트 방지).

### 2.5 이전 호스팅(Vercel) 정리

- [ ] 도메인 DNS를 Cloudflare로 옮긴 뒤 Vercel 프로젝트 비활성화 또는 도메인 연결 해제(충돌 방지).
- [ ] Search Console·사이트맵 URL이 `https://www.howlearn.kr` 기준인지 확인.

---

## 3. 배포 후 확인 (수동)

- [ ] `https://www.howlearn.kr/rss.xml` — XML, 가이드 개수·링크 도메인 정상.
- [ ] `https://www.howlearn.kr/feed.xml` — `/rss.xml`로 **301** 리다이렉트.
- [ ] `/sitemap.xml`, `/robots.txt`
- [ ] 임의 가이드·개념 상세, `/search`, 댓글, 문의 폼
- [ ] 비-www 접속 시 www로 한 번만 리다이렉트되는지

---

## 4. 코드베이스 참고 문서

- 상세 배포 메모: [`blog/DEPLOY-CLOUDFLARE.md`](blog/DEPLOY-CLOUDFLARE.md)
- 환경 변수 예시: [`blog/.env.example`](blog/.env.example)
