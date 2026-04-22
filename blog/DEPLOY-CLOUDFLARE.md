# Cloudflare 배포 참고 (HowLearn 블로그)

모노레포에서 이 앱만 배포할 때 **Cloudflare Pages / Workers 연동의 Root directory는 `blog`** 로 두세요.

## 빌드와 RSS

- `npm run build`는 **`generate-rss` 후 `next build`** 순서입니다. RSS는 `public/rss.xml`로 생성되며, 런타임에 `content/`를 읽지 않습니다(Edge/Workers 안전).
- `blog/public/rss.xml`은 생성물이라 저장소에는 올리지 않습니다(루트 `.gitignore`에 포함).

## 환경 변수

Cloudflare Pages 프로젝트 설정에 기존 Vercel과 동일하게 이식하세요.

| 변수 | 용도 |
|------|------|
| `NEXT_PUBLIC_SITE_URL` | 프로덕션 권장: `https://www.howlearn.kr` (canonical·OG·RSS·sitemap) |
| `NEXT_PUBLIC_IMAGE_BASE_URL` | 이미지 베이스(다른 호스트일 때) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | AdSense(사용 시) |
| `NEXT_PUBLIC_FIREBASE_*` | 댓글(Firestore) |

Cloudflare가 주입하는 **`CF_PAGES_URL`**, **`CF_PAGES_BRANCH_URL`** 은 `lib/site.ts`의 `getSiteUrl()` 폴백에 포함되어 있습니다. 프로덕션에서는 `NEXT_PUBLIC_SITE_URL`을 반드시 두는 것이 좋습니다.

## OpenNext + Wrangler (Next.js 15 권장 경로)

공식 가이드: [OpenNext — Cloudflare — Get Started](https://opennext.js.org/cloudflare/get-started)

요약:

1. `npx @opennextjs/cloudflare migrate` 로 초기 설정을 자동화하거나, 문서의 수동 단계를 따릅니다.
2. `wrangler.jsonc`(또는 `wrangler.toml`)와 `open-next.config.ts`는 마이그레이션/빌드 시 생성될 수 있습니다. **`nodejs_compat`** 등 호환 플래그는 문서대로 유지하세요.
3. `package.json`의 **`build`는 `next build`를 호출**해야 합니다. 이 프로젝트는 이미 `npm run generate-rss && next build`이므로, OpenNext CLI가 `npm run build`를 실행하면 RSS 생성이 함께 돌아갑니다.
4. 로컬에서 Workers 런타임에 가깝게 보려면 문서의 `preview` / `deploy` 스크립트를 추가합니다.
5. 개발 시 `next.config.ts`에 `initOpenNextCloudflareForDev()` 를 붙이는 것이 권장됩니다(문서 예시 참고).

## GitHub 연동 시

- **Root directory:** `blog`
- **Build command:** `npm run build`(또는 `pnpm build` / `yarn build`)
- **Output directory:** OpenNext 사용 시 대시보드/문서에 따름(보통 Wrangler가 `.open-next` 산출물을 사용).

## 배포 후 점검

- `/rss.xml`, `/feed.xml`(→ `/rss.xml` 리다이렉트)
- `/sitemap.xml`, `/robots.txt`
- 임의 가이드·개념 페이지, `/search`
- `howlearn.kr` → `www` 리다이렉트(`middleware.ts`)와 DNS·SSL 규칙이 루프를 만들지 않는지
