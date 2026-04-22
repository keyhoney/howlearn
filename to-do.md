# HowLearn 블로그 배포 — 내가 할 일 (초심자용)

이 문서는 **GitHub에 코드를 올린 뒤, Cloudflare에 사이트를 띄우는 과정**을 처음부터 순서대로 적어 두었습니다. 한 단계씩 끝내고 다음으로 넘어가면 됩니다.

**지금 구조:** 블로그 앱은 저장소 안의 **`blog` 폴더**에 있습니다. Cloudflare 설정에서도 항상 **`blog`를 루트**로 지정해야 합니다.

---

## 시작하기 전에 준비할 것

1. **GitHub 계정** — 저장소: [keyhoney/howlearn](https://github.com/keyhoney/howlearn) (또는 본인이 쓰는 주소)
2. **Cloudflare 계정** — 무료로 가입 가능 ([cloudflare.com](https://www.cloudflare.com))
3. **도메인 `howlearn.kr`** — DNS를 Cloudflare에서 관리하도록 옮길 계획이면, 가비아·후이즈 등에서 **네임서버를 Cloudflare가 알려 주는 값으로 변경**하는 단계가 나중에 필요합니다. (아직 도메인만 있고 DNS는 예전 호스팅이면, 배포 후에 천천히 옮겨도 됩니다.)
4. **로컬 PC** — Node.js가 설치되어 있으면 좋습니다. (버전은 가능하면 **20 이상** 권장)

---

## 1단계: 내 컴퓨터에서 저장소 맞추기

### 1.1 최신 코드 받기

터미널(또는 PowerShell)에서:

```bash
cd 원하는폴더
git clone https://github.com/keyhoney/howlearn.git
cd howlearn
```

이미 `howlearn` 폴더가 있다면:

```bash
cd howlearn
git pull
```

### 1.2 블로그 폴더로 들어가서 패키지 설치

```bash
cd blog
npm install
```

### 1.3 로컬용 설정 파일 만들기 (한 번만)

`blog` 폴더 안에 **`.dev.vars`** 파일이 필요합니다. 저장소에는 올라가지 않고, 본인 PC에만 둡니다.

- `blog` 폴더에 있는 **`.dev.vars.example`** 파일을 복사해서 이름을 **`.dev.vars`** 로 바꿉니다.
- 내용은 예시 그대로면 됩니다. (`NEXTJS_ENV=development`)

### 1.4 로컬에서 잘 도는지 확인 (선택이지만 추천)

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 이 뜨면 성공입니다. 끌 때는 터미널에서 `Ctrl + C`.

> **참고:** Windows에서는 나중에 `opennextjs-cloudflare build` 같은 명령이 불안정할 수 있습니다. 그럴 때는 **Cloudflare가 빌드**하게 두거나, **WSL(리눅스)** 을 쓰는 방법이 있습니다. 지금은 건너뛰어도 됩니다.

---

## 2단계: GitHub에 내 변경사항 올리기 (수정한 것이 있을 때만)

코드를 고쳤다면:

```bash
cd howlearn
git status
git add .
git commit -m "설명을 적는 메시지"
git push origin master
```

브랜치 이름이 `main`이면 `master` 대신 `main`을 씁니다.

**절대 올리면 안 되는 것:** `.env`, `.env.local`, 비밀번호·API 키가 들어 있는 파일. (이미 `.gitignore`로 막혀 있는 경우가 많습니다.)

---

## 3단계: Cloudflare에 프로젝트 연결하기

Cloudflare에는 **Pages** 또는 **Workers**로 Next.js를 올리는 방법이 있습니다. 이 프로젝트는 **OpenNext** 설정이 되어 있으므로, 대시보드에서 **“Next.js + next-on-pages + `.vercel/output/static`”** 같은 **옛날 권장 프리셋은 쓰지 마세요.**

아래는 **GitHub와 연동해서 빌드**하는 일반적인 흐름입니다. 화면 이름은 Cloudflare 업데이트에 따라 조금 다를 수 있습니다.

### 3.1 Cloudflare 로그인

1. [Cloudflare 대시보드](https://dash.cloudflare.com)에 로그인합니다.

### 3.2 Workers / Pages에서 새 프로젝트 만들기

1. 왼쪽 메뉴에서 **Workers & Pages** (또는 **Workers**)를 찾습니다.
2. **Create** / **Create application** 같은 버튼을 누릅니다.
3. **Connect to Git** / GitHub 연결을 선택합니다.
4. GitHub 권한을 허용하고, 저장소 **howlearn** 을 선택합니다.

### 3.3 빌드 설정 (가장 중요)

반드시 다음을 맞춥니다.

| 항목 | 넣을 값 |
|------|---------|
| **Root directory** | `blog` |
| **Framework preset** | **Next.js 기본 프리셋(next-on-pages) 사용 안 함** — “None” 또는 사용자 지정에 가깝게 |
| **Build command** | `npm run cf:build` (`npx opennextjs-cloudflare build` 는 CI에서 *could not determine executable to run* 으로 실패할 수 있음) |
| **Node version** | 가능하면 **20** 이상 (프로젝트 설정에 있다면) |

**Build output directory** 는 제품마다 다를 수 있습니다. Cloudflare가 OpenNext/Workers용으로 안내하는 최신 문서를 한 번 확인하세요. 헷갈리면 **로컬에서 `npm run deploy`** 로 배포하는 방식(3.5)도 있습니다.

### 3.4 환경 변수 넣기

Cloudflare 프로젝트 **Settings → Environment variables** (또는 Variables)에서, 예전 Vercel에 넣었던 값과 같이 넣습니다.

**꼭 넣는 것을 권장:**

| 변수 이름 | 예시 값 | 설명 |
|-----------|---------|------|
| `NEXT_PUBLIC_SITE_URL` | `https://www.howlearn.kr` | 주소·RSS·sitemap·검색엔진에 쓰임 |

**있으면 그대로 옮기기:**

- `NEXT_PUBLIC_GA_ID` (Google Analytics)
- `NEXT_PUBLIC_FIREBASE_API_KEY` 등 Firebase 관련 (`blog/.env.example` 참고)
- `NEXT_PUBLIC_IMAGE_BASE_URL` (이미지가 다른 도메인에 있을 때만)
- 기타 `blog/.env.example` 에 적힌 `NEXT_PUBLIC_*` 들

**Production** 과 **Preview**(미리보기) 둘 다에 필요한 변수가 있으면 둘 다 추가합니다.

### 3.5 (대안) 터미널에서 배포하기

Git 연동 대신, 로컬에서:

```bash
cd blog
npx wrangler login
npm run deploy
```

브라우저에서 Cloudflare 로그인이 뜨면 허용합니다. 처음 한 번은 이 방법이 오히려 이해하기 쉬울 수 있습니다. 이후에는 Git push만으로 자동 배포되게 설정할 수 있습니다.

---

## 4단계: 도메인 연결 (www.howlearn.kr)

1. Cloudflare에서 **도메인을 추가**하고, DNS가 Cloudflare를 가리키게 합니다 (네임서버 변경).
2. Workers/Pages 프로젝트 설정에서 **Custom domains** 에 `www.howlearn.kr` (필요하면 `howlearn.kr`도) 추가합니다.
3. SSL은 보통 **Full (strict)** 를 권장합니다.

**주의:** 이 사이트 코드에는 **비-www → www 로 보내는 규칙**이 이미 들어 있습니다. Cloudflare에서 **같은 리다이렉트를 두 번** 걸면 무한 리다이렉트가 날 수 있으니, 한쪽만 쓰거나 규칙을 단순하게 유지하세요.

---

## 5단계: 예전 호스팅(Vercel) 정리

1. 도메인 DNS를 Cloudflare로 옮긴 **후**에, Vercel 대시보드에서 해당 프로젝트의 **도메인 연결을 해제**하거나 프로젝트를 비활성화합니다.
2. **Google Search Console** 에서 사이트 주소가 `https://www.howlearn.kr` 기준인지, **사이트맵 URL**이 맞는지 확인합니다.

---

## 6단계: 배포가 끝난 뒤 확인할 것 (체크리스트)

브라우저나 터미널에서 하나씩 확인합니다.

- [ ] `https://www.howlearn.kr/` — 메인이 뜨는지
- [ ] `https://www.howlearn.kr/rss.xml` — XML이 보이는지, 링크 주소가 본인 도메인인지
- [ ] `https://www.howlearn.kr/feed.xml` — `rss.xml` 로 리다이렉트되는지 (주소창이 바뀌면 정상에 가깝습니다)
- [ ] `https://www.howlearn.kr/sitemap.xml` , `/robots.txt`
- [ ] 아무 가이드 글 하나, 개념 글 하나, `/search` 페이지
- [ ] 댓글(Firebase), 문의 폼 — 예전과 같이 동작하는지
- [ ] `https://howlearn.kr` 만 쳤을 때 `www` 로 한 번만 넘어가는지

---

## 막혔을 때

1. **빌드 로그** — Cloudflare 화면에서 실패한 빌드의 로그를 끝까지 읽습니다. `Error`, `failed` 근처에 이유가 나옵니다.
2. **Root directory** — `blog` 가 아니면 거의 항상 실패합니다.
3. **환경 변수** — `NEXT_PUBLIC_SITE_URL` 이 비어 있으면 주소가 이상하게 나올 수 있습니다.
4. **더 자세한 배포 설명** — 저장소의 [`blog/DEPLOY-CLOUDFLARE.md`](blog/DEPLOY-CLOUDFLARE.md) 와 [OpenNext Cloudflare 시작하기](https://opennext.js.org/cloudflare/get-started) 를 봅니다.

---

## 한 줄 요약

1. `blog` 에서 `npm install`, `.dev.vars` 만들기  
2. GitHub에 푸시  
3. Cloudflare에서 저장소 연결, **Root = `blog`**, **Build = `npm run cf:build`**, 환경 변수 설정  
4. 도메인·SSL 연결 후 위 체크리스트로 확인  

순서대로 하면 됩니다.
