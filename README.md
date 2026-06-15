# HowLearn Content

HowLearn 콘텐츠 블로그입니다. Astro 정적 사이트, MDX 콘텐츠, TinaCMS, Pagefind 검색을 사용합니다.

## Requirements

- Node.js 22.12.0+
- npm

## Environment

로컬 설정은 `.env.example`을 복사해 `.env`로 만듭니다.

```powershell
Copy-Item .env.example .env
```

필수 배포 변수:

- `PUBLIC_SITE_URL`: 운영 사이트 URL
- `PUBLIC_MATH_SITE_URL`: 수학 문제 풀이 사이트 URL
- `FORMSPREE_FORM_ID`: Cloudflare Pages 빌드 검증용 문의 폼 ID

Firebase 로그인 기능은 `PUBLIC_FIREBASE_*` 값이 있을 때만 활성화됩니다.

## Development

기본 개발 서버:

```powershell
npm install
npm run dev
```

검색(Pagefind)을 포함해 확인하려면 먼저 빌드 산출물과 검색 인덱스를 준비해야 합니다.

```powershell
npm run build:local
npm run dev:search
```

Windows에서는 `run-dev.bat`을 실행하면 `dist/`가 없을 때 `build:local`을 먼저 실행하고, 검색 인덱스를 동기화한 뒤 `http://localhost:4322`에서 개발 서버를 시작합니다.

## Content Workflow

콘텐츠는 Astro Content Collection으로 관리합니다.

- 가이드: `src/content/guides/`
- 개념: `src/content/concepts/`
- 도서: `src/content/books/`
- 칼럼: `src/content/columns/`

MDX frontmatter를 수정한 뒤에는 CMS 파생 데이터를 갱신합니다.

```powershell
npm run cms:sync
npm run content:validate
```

### Draft Policy

`status: draft` 콘텐츠는 운영 빌드에서 목록과 상세 라우트에 노출하지 않습니다. 개발 서버에서는 Tina 편집과 직접 확인을 위해 slug 라우트가 생성될 수 있지만, `content-utils.ts`의 published 조회 함수는 항상 발행 콘텐츠만 반환합니다.

현재 draft 개념:

- `src/content/concepts/autonomy.mdx`
- `src/content/concepts/goal-commitment.mdx`
- `src/content/concepts/problem-solving.mdx`

발행할 때는 `status: published`로 바꾼 뒤 `npm run cms:sync`와 `npm run content:validate`를 실행합니다.

TinaCMS를 사용할 때:

```powershell
npm run tina:dev
```

## Validation

배포 전 권장 순서:

```powershell
npm run check
npm run content:validate
npm run redirects:validate
npm run test:unit
npm run build
```

`npm run build`는 `prebuild`에서 배포 환경, 콘텐츠 인덱스, 레거시 수학 URL 리다이렉트를 검증하고 `postbuild`에서 Pagefind 인덱싱과 smoke check를 실행합니다.

## Deployment

Cloudflare Pages 정적 배포를 기준으로 합니다. 빌드 명령은 다음과 같습니다.

```powershell
npm run build
```

빌드 출력은 `dist/`입니다.

