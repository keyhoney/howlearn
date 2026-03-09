# SEO 최적화 MDX frontmatter 가이드

모든 콘텐츠 타입(블로그, 가이드, 개념, 툴킷, 전자책)에서 사용하는 frontmatter 표준입니다. `lib/content.ts`의 `buildContentFromMdx`가 파싱하며, 검색 결과·OG·JSON-LD·RSS·사이트맵·목록 필터에 반영됩니다.

**분류 규칙:** 카테고리는 **카테고리_태그_분류.md**의 **카테고리** 열 값만 사용하고, 태그는 **상위 태그** 열 값만 사용합니다. 허용 목록은 `lib/content-taxonomy.ts`에 정의되어 있습니다.

---

## 공통 템플릿 (모든 타입)

```yaml
---
# 필수
title: "글 제목"
description: "1~2문장 요약. 검색 결과·OG·JSON-LD·RSS에 그대로 사용됩니다. summary와 동일하게 인식됩니다."

# 날짜 (권장: ISO 8601 YYYY-MM-DD)
datePublished: "2026-03-06"   # 최초 공개일. date로 써도 인식됩니다.
dateModified: "2026-03-06"    # 마지막 실질 수정일. 없으면 datePublished 사용.
dateReviewed: "2026-03-06"    # (선택) 마지막 검토일. 상세 페이지에 "검토 yyyy.MM.dd"로 표시.

# 분류 (아래 허용 카테고리·태그만 사용)
category: "인지심리학"        # 1개(문자열) 또는 여러 개(배열)
tags: ["작업기억", "인지부하"]

# URL·노출
slug: "working-memory-cognitive-load"   # 없으면 파일명(확장자 제외)이 슬러그. 영문/숫자/하이픈 권장.
status: "published"          # published | draft. draft는 목록·RSS·사이트맵에서 제외.

# 공유/미리보기
coverImage: "/blog/문서명/cover.webp"    # 표지·대표 이미지. ogImage 없으면 이 값 사용.
ogImage: "/og/working-memory.png"       # OG 전용 이미지. coverImage보다 우선.

# 관련·참고
related:                      # 또는 relatedContentIds. 수동 관련 콘텐츠.
  - "guide:math-anxiety"
  - "concept:working-memory"
  - "blog:welcome"
references:                   # 참고 문헌. 상세 페이지 하단·JSON-LD에 사용.
  - title: "논문 제목"
    url: "https://..."

# 선택
featured: false               # true면 홈 "추천 지식 노드"에 노출.
author: "howlearn"              # 없으면 사이트 기본 저자. JSON-LD·상세 페이지에 표시.
lang: "ko"                    # 문서 언어. 메타·JSON-LD inLanguage에 사용.
---
```

**날짜 필드 별칭:** `date` → datePublished, `updated` → dateModified로 인식됩니다. 새로 쓸 때는 `datePublished` / `dateModified` 사용을 권장합니다.

**Canonical URL:** 페이지별 canonical은 앱에서 `constructMetadata({ path: "/blog/slug" })`로 자동 설정되므로, frontmatter에 `canonical`을 넣지 않아도 됩니다.

---

## 필드 설명 (공통)

### 필수

| 필드 | 설명 |
|------|------|
| `title` | 글 제목. 검색 결과·OG·JSON-LD·RSS·목록에 사용. 한글 가능. |
| `description` | 1~2문장 요약. `summary`로 써도 동일 인식. meta description·OG·JSON-LD·RSS에 사용. |

### 날짜

| 필드 | 설명 |
|------|------|
| `datePublished` | 최초 공개일. `date`로 써도 인식됨. |
| `dateModified` | 마지막 실질 수정일. 없으면 datePublished 사용. |
| `dateReviewed` | (선택) 마지막 검토일. 상세 페이지에 "검토 yyyy.MM.dd" 표시. |

### 분류·노출

| 필드 | 설명 |
|------|------|
| `category` | 카테고리 1개(문자열) 또는 여러 개(배열). **아래 5대 영역**만 사용. 학문별 페이지·필터에 사용. |
| `tags` | 태그 배열. **허용 상위 태그**만 사용. `/t/[tag]`, 관련글·필터에 사용. |
| `slug` | URL 슬러그. 영문·숫자·하이픈 권장. 없으면 **파일명**(확장자 제외)이 슬러그. |
| `status` | `published`(기본) 또는 `draft`. draft는 목록·RSS·사이트맵·빌드에서 제외. |
| `featured` | `true`면 홈 "추천 지식 노드"에 노출. 기본 false. |

### 이미지

| 필드 | 설명 |
|------|------|
| `coverImage` | 표지·대표 이미지. 사이트 기준 경로(`/blog/문서명/01.webp`) 또는 절대 URL. |
| `ogImage` | OG·미리보기용 이미지. 없으면 coverImage 사용. 전자책·가이드에서 표지와 다르게 둘 때 사용. |

### 관련·참고

| 필드 | 설명 |
|------|------|
| `related` / `relatedContentIds` | 수동 관련 콘텐츠. `"타입:슬러그"` 형식 배열(예: `guide:math-anxiety`, `concept:working-memory`). 있으면 관련글 추천 시 우선 사용, 부족분은 태그·도메인으로 자동 보강. |
| `references` | 참고 문헌. `[{ title?: "제목", url: "https://..." }]`. 상세 페이지 하단·JSON-LD에 표시. |

### 기타

| 필드 | 설명 |
|------|------|
| `author` | 저자명(문자열). 없으면 `lib/site.ts` 기본 저자. JSON-LD·상세 페이지에 표시. |
| `lang` | 문서 언어(예: `ko`, `ko-KR`). `constructMetadata`에 전달되어 메타·OG locale에 사용. |

---

## 타입별 frontmatter (추가 필드)

| 타입 | 추가 필드 | 설명 |
|------|-----------|------|
| **guide** | `intro` | 가이드 서두 문단(목록·상단 요약에 사용). |
| **guide** | `keyTakeaways` | 핵심 요약 문자열 배열. `KeyTakeaways` 컴포넌트와 연동 가능. |
| **concept** | `shortDefinition` | 한 줄 정의. 없으면 description 사용. JSON-LD DefinedTerm에 사용. |
| **concept** | `englishName` | 개념 영문명(선택). |
| **toolkit** | `format` | `checklist` \| `template` \| `worksheet`. |
| **toolkit** | `estimatedTime` | 예상 소요 시간(문자열, 예: "10분"). |
| **book** | `subtitle` | 부제. |
| **book** | `coverImage` | 표지 이미지. ogImage 없으면 OG에도 사용. |
| **book** | `purchaseLinks` | `[{ label: "리디북스", href: "https://..." }]` 구매 링크 배열. |

---

## 메타데이터가 SEO에 쓰이는 방식

- **Canonical:** 앱에서 `path`(예: `/blog/slug`, `/guides/slug`)로 자동 생성. frontmatter에 `canonical` 불필요.
- **OG / Twitter:** `constructMetadata`에 `title`, `description`, `image`(ogImage → coverImage 순), `type`(article/book 등), `lang` 전달.
- **JSON-LD:** `lib/schema.ts`가 `title`, `summary`, `publishedAt`, `updatedAt`, 저자·URL 등으로 Article / DefinedTerm / Book 스키마 생성. 개념은 `shortDefinition` 사용.
- **RSS·사이트맵:** `publishedAt`, `status`(draft 제외) 기준. 목록·필터는 `category`→domains, `tags` 사용.

---

## 허용 카테고리 (카테고리_태그_분류.md 기준)

**이 5가지만 사용합니다.** 주제별 페이지·목록 필터에 동일한 순서로 노출됩니다.

| 카테고리 값 | 설명 |
|------------|------|
| `인지심리학` | 주의, 기억, 인지부하 등 인지 과정 |
| `신경과학` | 뇌 구조·기능과 학습·발달 |
| `교육심리학` | 교수·학습 설계, 평가, 동기화 |
| `발달심리학` | 연령별 발달과 학습 시기 |
| `동기·정서심리학` | 학습 동기, 불안, 흥미, 자기조절 |

예: `category: "인지심리학"` 또는 `category: ["인지심리학", "교육심리학"]`

---

## 허용 태그 (상위 태그만 사용)

**세부 태그는 사용하지 않고, 아래 상위 태그만 사용합니다.** (`lib/content-taxonomy.ts`와 동기화)

주의집중, 기억과 복습, 작업기억, 메타인지, 인지부하, 이해와 전이, 문제해결, 수면, 스트레스, 실행기능, 뇌가소성, 자기효능감, 자기조절학습, 피드백, 평가, 목표설정, 부모개입, 인지발달, 자율성발달, 사춘기, 또래관계, 학년전환기, 학습동기, 자기결정성, 시험불안, 회복탄력성, 자존감, 무기력, 완벽주의

예: `tags: ["작업기억", "인지부하", "자기효능감"]`

---

## 슬러그 규칙

- **URL 슬러그** = frontmatter `slug`가 있으면 해당 값, 없으면 **파일명**(확장자 제외).
- 예: `working-memory.mdx` → `/concepts/working-memory`. 한글 파일명 가능하지만 URL 인코딩·공유를 위해 **영문 슬러그** 권장.

---

## 가이드 본문: 강조 블록

가이드·블로그 MDX에서 **핵심 요약**, **오해 방지**, **적용 포인트**를 강조할 때는 아래 MDX 컴포넌트를 조합해 사용하세요.

- **핵심 요약** → `<KeyTakeaways>`, `<WhyItMatters>`, `<TheoryBox>`
- **오해 방지** → `<CommonMisconception>`
- **적용 포인트** → `<ActionChecklist>`, `<ForParents>`

---

## MDX 컴포넌트 레퍼런스

아래 컴포넌트는 `lib/mdx-components.tsx`에 등록되어 있어 MDX 본문에서 바로 사용할 수 있습니다. 배열·객체 props는 **쉼표 구분 문자열** 또는 **JSON**으로 넘길 수 있으며, `lib/mdx-props.ts`에서 배열/객체로 정규화됩니다.

### 기본 요소 (자동 적용)

| 요소 | 설명 |
|------|------|
| `h2`, `h3` | 제목에 자동으로 `id`가 부여되어 앵커·목차에 사용됩니다. |
| `img` | `src`가 `/`로 시작하면 `NEXT_PUBLIC_IMAGE_BASE_URL`과 결합해 절대 URL로 변환됩니다. `alt`가 비면 장식 이미지로 처리됩니다. |

---

### TheoryBox

이론·개념을 한 블록으로 정리할 때 사용합니다. 인디고 왼쪽 테두리.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | string | | 이론 제목 |
| `summary` | string | | 요약 설명 |
| `whyItMatters` | string | | "Why it matters" 한 줄 |
| `keywords` | string[] \| string | | 키워드(쉼표 구분 문자열 또는 배열). 뱃지로 표시 |

```mdx
<TheoryBox
  title="작업기억"
  summary="동시에 머릿속에 유지하고 조작하는 정보의 양입니다."
  whyItMatters="수학 문제 해결과 직결됩니다."
  keywords={["인지부하", "청킹"]}
/>
```

---

### TeacherNote

교사·전문가 관점의 관찰·해석·주의사항을 적을 때 사용합니다. 앰버 왼쪽 테두리.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `context` | string | | 맥락 설명 |
| `observation` | string | ✓ | 관찰 내용 |
| `interpretation` | string | | 해석 |
| `caution` | string | | 주의사항(⚠ 표시) |

```mdx
<TeacherNote
  context="초등 고학년 수학 수업"
  observation="문제를 읽자마자 손을 떼는 아이가 많았습니다."
  interpretation="작업기억 부담이 크면 시도 자체를 포기할 수 있습니다."
  caution="능력 부족으로 단정하지 마세요."
/>
```

---

### KeyTakeaways

핵심 요약을 불릿 리스트로 강조합니다. 인디고 배경.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `items` | string[] \| string | ✓ | 요약 문장. 쉼표 구분 문자열 또는 배열 |

```mdx
<KeyTakeaways items={[
  "작업기억은 동시에 유지·조작하는 정보량과 관련된다.",
  "인지부하를 줄이면 학습 전이가 잘 일어날 수 있다."
]} />
```

---

### CommonMisconception

흔한 오해와 실제를 대비해 적을 때 사용합니다. 오해 문장은 취소선.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `myth` | string | | 흔한 오해 문장 |
| `reality` | string | | 실제("Actually: ..."로 표시) |

```mdx
<CommonMisconception
  myth="수학을 못하는 건 머리가 나빠서다."
  reality="반복된 실패 경험과 자기효능감, 인지부하 등이 복합적으로 작용할 수 있다."
/>
```

---

### WhyItMatters

"왜 중요한지"를 자유 문단으로 강조합니다. **자식(children)**으로 내용을 넣습니다. 인디고 왼쪽 테두리.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| (children) | ReactNode | ✓ | 본문. MDX 문단·리스트 등 |

```mdx
<WhyItMatters>

이론만 소개하지 않고, **가정에서 바로 적용**할 수 있는 방식으로 설명합니다.
부모가 아이와 대화할 때 참고할 수 있는 말투와 예시를 함께 둡니다.

</WhyItMatters>
```

---

### ForStudents

학생 대상 안내(목표·단계·예시·오늘 시도할 것)를 한 블록으로 넣을 때 사용합니다.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `goal` | string | | 목표 한 줄 |
| `steps` | string[] \| string | | 단계(숫자 목록). 쉼표 구분 가능 |
| `example` | string | | 예시("e.g. ...") |
| `tryThisToday` | string | | "Try today: ..." 강조 문장 |

```mdx
<ForStudents
  goal="한 번에 한 단계만 바꿔 보기"
  steps={["오늘 할 일을 3개만 정한다", "가장 쉬운 것부터 한다"]}
  example="수학 문제 1개만 풀고 쉬기"
  tryThisToday="30분만 타이머 맞추고 공부해 보기"
/>
```

---

### ForParents

부모 대상 안내(상황·말하기·행동·피할 것)를 한 블록으로 넣을 때 사용합니다. 시안 왼쪽 테두리.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `situation` | string | | 상황 설명 |
| `whatToSay` | string | | 시도해 볼 말("Try saying: ...") |
| `whatToDo` | string[] \| string | | 할 일 목록(불릿). 쉼표 구분 가능 |
| `avoid` | string[] \| string | | 피할 것. 쉼표 구분 시 " · "로 표시 |

```mdx
<ForParents
  situation="아이가 문제를 읽다가 포기할 때"
  whatToSay="한 문장만 읽어 보자. 나머지는 엄마가 읽어 줄게."
  whatToDo={["한 문장씩 나눠 읽기", "그림만 먼저 보기"]}
  avoid="재촉하기, 왜 못 하냐고 묻기"
/>
```

---

### Sources / SourceNote

참고 문헌 목록을 표시합니다. `SourceNote`는 `Sources`의 별칭입니다.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `items` | SourceItem[] \| string | ✓ | 출처 목록. 각 항목: `author`, `year`, `title`, `source`(선택), `note`(선택), `href`(선택) |

`items`는 JSON 문자열 또는 객체/배열로 넘깁니다.

```mdx
<Sources items={[
  { author: "Sweller", year: "1988", title: "Cognitive load during problem solving", source: "Cog. Sci.", href: "https://..." },
  { author: "Paas", year: "1992", title: "Training strategies for attaining transfer", source: "J. Ed. Psych.", note: "인지부하 측정" }
]} />
```

---

### ActionChecklist

"오늘 해볼 것" 같은 실행 목록을 번호로 표시합니다. 시안 왼쪽 테두리.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | string | | 블록 제목. 기본값 "Things to try today" |
| `items` | string[] \| string | ✓ | 항목. 쉼표 구분 문자열 또는 배열 |

```mdx
<ActionChecklist
  title="이번 주에 해볼 것"
  items={["아이와 함께 30분 타이머 맞추기", "한 문제만 풀고 피드백 주기"]}
/>
```

---

### RelatedConcepts

관련 **개념** 문서로 가는 링크를 슬러그로 나열합니다. `/concepts/{slug}`로 연결됩니다.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `slugs` | string[] \| string | ✓ | 개념 슬러그. 쉼표 구분 가능 |

```mdx
<RelatedConcepts slugs={["working-memory", "cognitive-load"]} />
```

---

### RelatedGuides

관련 **가이드** 문서로 가는 링크를 슬러그로 나열합니다. `/guides/{slug}`로 연결됩니다.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `slugs` | string[] \| string | ✓ | 가이드 슬러그. 쉼표 구분 가능 |

```mdx
<RelatedGuides slugs="math-anxiety-guide, parent-talk" />
```

---

### RelatedCards

본문 중간에 **관련 지식 카드**(가이드·블로그·개념·툴킷·전자책)를 삽입할 때 사용합니다. `getContentByRefs`로 콘텐츠를 가져와 카드 그리드로 렌더링합니다.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `items` | string[] \| string | ✓ | 콘텐츠 참조. `"타입:슬러그"` 또는 `"타입-슬러그"`. 쉼표 구분 문자열 또는 배열 |

```mdx
<RelatedCards items="guide:math-anxiety, concept:working-memory, blog:welcome" />
```

---

### ReflectionPrompt

생각해 볼 질문 목록을 표시합니다. 인디고 왼쪽 테두리.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | string | | 블록 제목. 기본값 "Reflect" |
| `questions` | string[] \| string | ✓ | 질문 문장. 쉼표 구분 가능 |

```mdx
<ReflectionPrompt
  title="읽고 나서"
  questions={["우리 아이에게 어떤 부분이 가장 맞을까?", "한 가지만 바꾼다면 무엇부터 할까?"]}
/>
```

---

### WhenToUse

"언제 사용하면 좋은지" 상황 목록을 체크 리스트처럼 표시합니다. 시안 왼쪽 테두리.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `situations` | string[] \| string | ✓ | 상황 설명. 쉼표 구분 가능 |

```mdx
<WhenToUse situations={[
  "아이가 문제를 읽다가 포기할 때",
  "시험 전 불안을 말할 때"
]} />
```

---

### Troubleshooting

자주 나오는 문제와 해결을 짝으로 나열합니다. `problem` / `solution` 쌍.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `items` | TroubleshootingItem[] \| string | ✓ | 항목: `{ problem: string, solution: string }`. JSON 문자열 또는 배열 |

```mdx
<Troubleshooting items={[
  { problem: "아이가 손을 안 댐", solution: "한 문장만 읽고 그림만 보기로 낮춤" },
  { problem: "시간만 끌다 끝남", solution: "타이머 10분으로 짧게 설정 후 성공 경험 주기" }
]} />
```

---

### PrintableBlock

인쇄 시 함께 출력하고 싶은 블록(체크리스트·워크시트 등)에 사용합니다. 점선 테두리, 인쇄 시 테두리 유지.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | string | | 블록 제목. 기본값 "Printable" |
| (children) | ReactNode | ✓ | 본문 |

```mdx
<PrintableBlock title="이번 주 체크리스트">

- [ ] 30분 타이머로 공부해 보기
- [ ] 한 문제만 풀고 피드백 주기

</PrintableBlock>
```

---

### BookOverview

전자책·가이드북 소개 블록입니다. "About this book" 스타일.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | string | | 소제목. 기본값 "About this book" |
| (children) | ReactNode | ✓ | 본문 |

```mdx
<BookOverview title="이 책에 대하여">

이 전자책은 학습과학 연구를 바탕으로, 부모가 아이와 수학을 대할 때
실제로 쓸 수 있는 말과 행동을 정리한 것입니다.

</BookOverview>
```

---

### WhoThisIsFor

"이 글/책이 필요한 독자" 목록을 불릿으로 표시합니다.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `items` | string[] \| string | ✓ | 대상 설명. 쉼표 구분 가능 |

```mdx
<WhoThisIsFor items={[
  "수학 불안을 줄이고 싶은 학부모",
  "아이의 학습 동기를 살리고 싶은 교사"
]} />
```

---

### WhatYouWillLearn

"이 글에서 배울 것" 목록을 번호로 표시합니다. 인디고 왼쪽 테두리.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `items` | string[] \| string | ✓ | 학습 목표 문장. 쉼표 구분 가능 |

```mdx
<WhatYouWillLearn items={[
  "수학 불안이 생기는 심리·인지 원리",
  "부모가 할 수 있는 말과 행동"
]} />
```

---

### TopicIntro

주제 소개 한 블록(제목 + 설명). 목차 앞이나 섹션 시작에 둘 때 유용합니다.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | string | | 소제목 |
| `description` | string | | 설명 문단 |

```mdx
<TopicIntro
  title="수학 불안이란"
  description="수학 상황에서 불안을 느끼고, 그 결과 수행이 떨어지는 현상을 말합니다. 능력 부족이 아니라 반복된 경험이 쌓인 결과일 수 있습니다."
/>
```

---

## props 정규화 규칙

- **문자열 배열** (`items`, `steps`, `slugs`, `questions` 등): MDX에서는 `"a, b, c"`처럼 쉼표 구분 문자열로 넘기거나, `items={["a","b","c"]}`처럼 배열로 넘길 수 있습니다. `lib/mdx-props.ts`의 `toStringArray`가 빈 값·null을 걸러 배열로 맞춥니다.
- **객체 배열** (`Sources`의 `items`, `Troubleshooting`의 `items`): JSON 문자열 `items="[{...},{...}]"` 또는 JS 객체 배열로 넘깁니다. `toSourceItemsArray`, `toTroubleshootingItemsArray`가 정규화합니다.

---

## 타입별 참고

- **books**: `coverImage`, `purchaseLinks`(선택). 서점 링크는 본문에 직접 작성.
- **guides/concepts/blog**: `references`로 참고 문헌 3~5개 권장.

---

## MDX 렌더링 점검 (개발자용)

실제 페이지와 MDX 원문이 다르게 보일 때 아래를 순서대로 확인하세요.

| 현상 | 확인할 곳 |
|------|-----------|
| **이미지/링크 안내 문구·코드 블록이 원문과 다름** | 배포에 반영된 MDX가 최신인지 확인. 빌드 캐시 제거 후 재배포. |
| **이미지가 안 뜸** | `.env`에 `NEXT_PUBLIC_IMAGE_BASE_URL`(이미지 호스팅 도메인) 설정. `lib/image-url.ts`의 `toImageUrl` + `lib/remark-transform-img-url.ts`(remark 플러그인) + `lib/mdx-components.tsx`의 `img` 매핑이 모두 적용되는지 확인. |
| **MDX 컴포넌트가 제목만 보이고 내용이 비어 있음** | `lib/mdx-components.tsx`에 해당 컴포넌트가 등록돼 있는지, `components/mdx/*.tsx`에서 배열/객체 props(`items`, `steps`, `questions` 등)를 실제로 렌더링하는지 확인. `lib/mdx-props.ts`의 `toStringArray`, `toSourceItemsArray`, `toTroubleshootingItemsArray`로 정규화 후 사용. |
| **본문 중간 RelatedCards와 하단 추천이 둘 다 보임** | 본문의 `<RelatedCards items="..." />`와 페이지의 `relatedContent`(frontmatter `related` + `getRelatedContent`)는 별개입니다. 의도된 동작. |

**이미지 경로 규칙:** MDX에서는 슬래시로 시작하는 경로(예: `/blog/문서명/01.webp`)로 쓰고, remark 플러그인이 `NEXT_PUBLIC_IMAGE_BASE_URL`과 결합해 절대 URL로 변환합니다. 배포 환경에 해당 환경변수를 설정해야 이미지가 로드됩니다.
