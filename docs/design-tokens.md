# HowLearn 디자인 기준 메모 (Phase 1)

> 기준 소스: `howlearn/blog` (Next.js 14 + Tailwind 4 + shadcn/ui)
> 적용 대상: 본 Astro 프로젝트 (`howlearn-astro`)
> 규칙: `math_howlearn`의 화면/스타일은 복제하지 않으며, 기능만 이식해 본 기준에 맞춰 재구성한다.

---

## 1. 컬러 팔레트

| 역할           | Light              | Dark                |
| -------------- | ------------------ | ------------------- |
| 본문 배경      | `#ffffff`          | `slate-900 #0f172a` |
| 본문 텍스트    | `slate-900 #0f172a`| `slate-100 #f1f5f9` |
| 보조 텍스트    | `slate-600 #475569`| `slate-400 #94a3b8` |
| 테두리/구분선  | `slate-200 #e2e8f0`| `slate-700 #334155` |
| 브랜드 액센트  | `indigo-600 #4f46e5`| `indigo-400 #818cf8`|
| 액센트 hover   | `indigo-700 #4338ca`| `indigo-300 #a5b4fc`|

참조 코드: `howlearn/blog/components/layout/SiteHeader.tsx`
- 헤더: `bg-white/80 backdrop-blur-md dark:bg-slate-900/80`
- 네비 링크 hover: `hover:text-indigo-600 dark:hover:text-indigo-400`

---

## 2. 타이포그래피

- Sans: Pretendard → fallback Apple SD Gothic Neo, Noto Sans KR, Segoe UI, Roboto
- Mono: SFMono-Regular, Menlo, Consolas
- 본문 기본 line-height: 1.7 (학습 콘텐츠 가독성)
- 한글 단어 분리 방지: `word-break: keep-all`
- 긴 글 본문: Tailwind Typography (`prose prose-slate dark:prose-invert`)
  - `max-width: 72ch` 기준

스케일 기준:
- h1 랜딩 hero: `text-4xl sm:text-5xl font-bold tracking-tight`
- h2 섹션 헤딩: `text-2xl font-bold tracking-tight`
- 본문 보조/메타: `text-sm font-medium`

---

## 3. 레이아웃 및 간격

참조 코드: `howlearn/blog/app/layout.tsx`

- 최대폭 컨테이너: `max-w-7xl` (≈ 1280px)
- 페이지 좌우 패딩: `px-4 sm:px-6 lg:px-8`
- 섹션 상/하 패딩: `pt-16 sm:pt-24 pb-24`
- 카드 내부 패딩: `p-5`
- 카드 간격: `gap-4`
- 그리드: `grid sm:grid-cols-2 lg:grid-cols-3`

---

## 4. 헤더 패턴

참조: `howlearn/blog/components/layout/SiteHeader.tsx`

- `sticky top-0 z-50` + `backdrop-blur-md`
- 높이: `h-14 sm:h-16`
- 좌측: 로고 + 주 네비 (데스크톱 `md:flex`)
- 우측: 검색 링크 + (이후) 테마 토글 + 모바일 드로어
- 네비 항목은 학문/가이드/개념/툴킷/도서 + HowLearn 확장: 칼럼/문제/논술

HowLearn 1차 네비 구성(본 프로젝트 기준):
- 가이드 / 개념 / 도서 / 칼럼 / 문제 / 논술

---

## 5. 컴포넌트 톤

- 카드: `rounded-xl border border-slate-200 bg-white hover:border-indigo-600 hover:shadow-sm`
- 주요 버튼(Primary): `rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-semibold`
- 보조 버튼(Outline): `rounded-lg border border-slate-300 bg-white text-slate-700 hover:border-indigo-600 hover:text-indigo-600`
- 링크(텍스트): `text-indigo-600 hover:text-indigo-700`
- 포커스 링: `focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`

---

## 6. 접근성 기준(기본)

- 한국어 우선: `<html lang="ko">`
- Skip link: 첫 포커스 시 본문 건너뛰기 링크 표시
- 모든 버튼/링크 최소 터치 영역: 40×40px
- 포커스 가시성: `ring-2 ring-indigo-500`
- 명도 대비: 본문 텍스트 `slate-900 on white`, 보조 `slate-600 on white` (AA 통과)

---

## 7. 다크 모드 전략

- Tailwind `dark:` variant 사용
- 초기 버전은 시스템 테마 자동 추종 + (이후) 수동 토글 추가
- CSS 변수로도 `--bg / --fg / --fg-muted / --border / --accent` 노출

---

## 8. 융합 규칙 (math_howlearn 기능 이식 시)

- `math_howlearn`의 문제 카드/버튼/토크박스 스타일을 그대로 복사 금지
- 기능(정답 체크, 힌트 STEP, 오답 노트, 집중 모드 타이머)만 이식
- 해당 기능의 UI는 반드시 위 §5 컴포넌트 톤, §3 레이아웃 규칙을 적용해 재작성
- 사용 컬러: 본 문서의 §1 팔레트 우선, 상태 색상(성공/오답/경고)이 추가로 필요할 경우 이 문서에 먼저 정의한 뒤 반영

---

## 9. 현재 적용 상태(Phase 1 기준)

- 글로벌 토큰: `src/styles/global.css` `@theme` + `:root` CSS 변수
- 레이아웃: `src/layouts/BaseLayout.astro`
- 헤더/푸터: `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`
- 홈: `src/pages/index.astro`

이후 단계에서 이 문서를 기준으로 컴포넌트/라우트 UI를 작성한다.
