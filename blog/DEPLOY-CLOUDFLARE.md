# Cloudflare 배포 참고 (HowLearn 블로그)

모노레포에서 이 앱만 배포할 때 **Root directory는 `blog`** 입니다.

이 프로젝트는 **`@opennextjs/cloudflare`(OpenNext)** 로 마이그레이션된 상태입니다. **`@cloudflare/next-on-pages`** 와 **`.vercel/output/static`** 프리셋은 사용하지 않습니다.

## 로컬 명령

| 명령 | 설명 |
|------|------|
| `npm run dev` | Next.js 개발 서버 (`initOpenNextCloudflareForDev` 적용) |
| `npm run build` | `generate-rss` → `next build` (순수 Next 산출물) |
| `npm run preview` | OpenNext 빌드 후 Workers 런타임에 가깝게 로컬 프리뷰 |
| `npm run deploy` | OpenNext 빌드 후 Cloudflare에 배포 (**`wrangler login` 필요**) |

`opennextjs-cloudflare build`는 내부에서 **`npm run build`** 를 호출하므로 RSS 생성(`public/rss.xml`)이 포함됩니다.

### Windows 참고

OpenNext CLI는 **Windows에서 비공식 지원**이며, `opennextjs-cloudflare build` 가 종료 코드 없이 실패(접근 위반 등)할 수 있습니다. 이 경우 **WSL2** 또는 **Cloudflare/GitHub CI(Linux)** 에서 빌드·배포하는 것을 권장합니다.

## 설정 파일

- **`wrangler.jsonc`** — Worker 진입점 `.open-next/worker.js`, 정적 자산 `.open-next/assets`, `nodejs_compat` 등
- **`open-next.config.ts`** — OpenNext Cloudflare 설정(필요 시 [R2 캐시](https://opennext.js.org/cloudflare/caching) 등 확장)
- **`public/_headers`** — `/_next/static/*` 장기 캐시
- **`.dev.vars`** — 로컬 전용(`NEXTJS_ENV` 등). **`.dev.vars.example`** 을 복사해 만들고, 비밀 값은 커밋하지 마세요.

마이그레이션 시 **Wrangler OAuth 타임아웃**이 나면 `wrangler login` 을 로컬에서 한 뒤 `npm run deploy` 를 다시 시도하면 됩니다. **R2 캐시**는 자동 생성에 실패했을 수 있어, 필요하면 위 캐시 문서를 따라 `wrangler.jsonc` / `open-next.config.ts` 를 손봅니다.

## Cloudflare 대시보드 (Git 연동)

**Framework preset:** `Next.js` + **next-on-pages** 가 아닌, **None**(또는 Workers용 안내)에 가깝게 두고 빌드만 맞춥니다.

- **Root directory:** `blog`
- **Build command:** `npx opennextjs-cloudflare build`  
  (또는 `npm run build`만으로는 `.open-next` Worker 번들이 나오지 않으므로 **배포용은 OpenNext 빌드**가 필요합니다.)
- **Build output directory:** Git 기반 Workers 배포 UI는 제품 업데이트에 따라 다를 수 있습니다. 최신 [OpenNext Cloudflare](https://opennext.js.org/cloudflare/get-started) · [Workers CI/CD](https://developers.cloudflare.com/workers/ci-cd/) 를 확인하세요.

CLI 배포: 연결 후 `npm run deploy` (저장소 루트가 `blog`인 터미널에서).

## 환경 변수

Cloudflare(또는 `.dev.vars` / Pages 설정)에 기존과 동일하게 설정합니다.

| 변수 | 용도 |
|------|------|
| `NEXT_PUBLIC_SITE_URL` | 프로덕션 권장: `https://www.howlearn.kr` |
| `NEXT_PUBLIC_IMAGE_BASE_URL` | 이미지 베이스(다른 호스트일 때) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | AdSense(사용 시) |
| `NEXT_PUBLIC_FIREBASE_*` | 댓글(Firestore) |

`CF_PAGES_URL` / `CF_PAGES_BRANCH_URL` 은 `lib/site.ts` 폴백에 포함되어 있습니다.

## `next/image` / Cloudflare Images

`wrangler.jsonc` 에 **`images.binding: "IMAGES"`** 가 있습니다. 계정·플랜에 따라 [이미지 최적화](https://opennext.js.org/cloudflare/howtos/image) 설정이 필요할 수 있습니다. 빌드·배포 오류가 나면 공식 how-to를 확인하세요.

## 배포 후 점검

- `/rss.xml`, `/feed.xml`(→ `/rss.xml` 리다이렉트)
- `/sitemap.xml`, `/robots.txt`
- 임의 가이드·개념 페이지, `/search`
- `howlearn.kr` → `www` 리다이렉트(`middleware.ts`)와 DNS·SSL 규칙이 루프를 만들지 않는지

## RSS

- `blog/public/rss.xml` 은 빌드 시 생성되며 `.gitignore`에 있습니다.
