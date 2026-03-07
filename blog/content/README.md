# SEO 최적화 MDX frontmatter 템플릿

모든 콘텐츠 타입(블로그, 가이드, 개념, 툴킷, 전자책)에서 사용할 수 있는 frontmatter 표준입니다. 검색 결과·OG·JSON-LD·RSS·사이트맵에 반영됩니다.

**분류 규칙:** 카테고리는 **카테고리_태그_분류.md**의 **카테고리** 열 값만 사용하고, 태그는 **상위 태그** 열 값만 사용합니다. 허용 목록은 `lib/content-taxonomy.ts`에 정의되어 있습니다.

---

## 템플릿

```yaml
---
# 필수
title: "글 제목"
description: "1~2문장 요약. 검색 결과/OG/JSON-LD/RSS에 그대로 쓰일 문장으로."
date: "2026-03-06"          # 최초 공개일(=발행일) 권장
updated: "2026-03-06"       # 마지막 실질 수정일(내용 변경 시만 갱신 권장)
category: "인지심리학"      # 아래 허용 카테고리만 사용. 또는 ["인지심리학","교육심리학"]

# 권장(SEO/탐색/내비게이션)
tags: ["작업기억","인지부하"]   # 아래 허용 상위 태그만 사용 (세부 태그 사용 안 함)
slug: "working-memory-cognitive-load"   # 영문/숫자/하이픈 권장(퍼머링크 안정화). 없으면 파일명이 슬러그.
canonical: "https://example.com/blog/working-memory-cognitive-load"  # 가능하면 명시
lang: "ko-KR"                 # 다국어/검색엔진 언어 힌트
status: "published"           # draft | published (draft는 빌드/피드/사이트맵에서 제외)

# 공유/미리보기
ogImage: "/og/working-memory.png"       # 사이트 기준 경로 OK (절대 URL이면 더 좋음)
ogImageAlt: "작업기억과 인지부하를 설명하는 도식"
ogType: "article"             # 보통 article
twitterCard: "summary_large_image"

# 구조화 데이터 품질(선택이지만 강력 추천)
author: "홍길동"              # 또는 ["홍길동","김철수"]. 없으면 사이트 기본 저자 사용
readingTime: 7                # 분 단위. 없으면 본문 기준으로 빌드에서 계산
keywords: ["학습","인지","교육"]         # tags와 별개로, 메타 키워드용(선택)
series: "인지과학으로 보는 공부"        # 시리즈가 있으면 내부링킹에 도움
references: []                # 참고 문헌. [{ title: "논문 제목", url: "https://..." }]
---
```

---

## 필드 설명

### 필수

| 필드 | 설명 |
|------|------|
| `title` | 글 제목. 검색 결과·OG·JSON-LD·RSS에 사용. 한글 가능. |
| `description` | 1~2문장 요약. meta description·OG description·JSON-LD·RSS에 그대로 사용. |
| `date` | 최초 공개일. ISO 8601 권장(`YYYY-MM-DD`). `datePublished`로도 인식. |
| `updated` | 마지막 실질 수정일. 없으면 `date` 사용. `dateModified`로도 인식. |
| `category` | 카테고리 1개(문자열) 또는 여러 개(배열). 아카이브 `/c/[category]`에 사용. **권장:** 아래 학습과학 5대 영역 중 하나 이상 지정 시 주제별·홈·필터에서 일관 노출. |

### 권장(SEO/탐색)

| 필드 | 설명 |
|------|------|
| `tags` | 태그 배열. 아카이브 `/t/[tag]`, 관련글·필터에 사용. |
| `slug` | URL 슬러그. **영문·숫자·하이픈** 권장(퍼머링크 안정). 미설정 시 **파일명**이 슬러그가 됨. |
| `canonical` | 정규 URL. 있으면 메타 canonical·JSON-LD에 사용. |
| `lang` | 문서 언어(예: `ko-KR`). 메타·JSON-LD `inLanguage`에 사용. |
| `status` | `published`(기본) 또는 `draft`. `draft`인 글은 목록·RSS·사이트맵·빌드 노출에서 제외. |

### 공유/미리보기

| 필드 | 설명 |
|------|------|
| `ogImage` | OG 이미지. 사이트 기준 경로(`/og/xxx.png`) 또는 절대 URL. |
| `ogImageAlt` | OG 이미지 대체 텍스트(접근성·SEO). |
| `ogType` | Open Graph type. 보통 `article`. |
| `twitterCard` | Twitter 카드 타입. 예: `summary_large_image`. |

### 구조화 데이터/기타

| 필드 | 설명 |
|------|------|
| `author` | 저자명(문자열 또는 배열). 없으면 `lib/site.ts`의 기본 저자 사용. JSON-LD에 반영. |
| `readingTime` | 예상 읽는 시간(분). 없으면 본문 글자 수로 자동 계산. |
| `keywords` | 메타 키워드·JSON-LD keywords용. `tags`와 별도로 지정 가능. |
| `series` | 시리즈명. 내부 링킹·구조화 데이터 확장용. |
| `references` | 참고 문헌 배열. `[{ title: "제목", url: "https://..." }]`. 상세 페이지 하단에 표시. |
| `ogImage` | 전자책·가이드 등은 `coverImage`도 사용 가능(표지 이미지). |

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

## 가이드 본문: Callout 사용

가이드·블로그 MDX에서 **핵심 요약**, **오해 방지**, **적용 포인트**를 강조할 때 `<Callout>` 컴포넌트를 쓰면 출판물 편집감이 높아집니다.

```mdx
<Callout title="핵심">
이론 소개에 그치지 않고, 가정에서 바로 적용할 수 있는 방식으로 설명합니다.
</Callout>

<Callout title="오해 방지">
수학 포기는 능력 부족이 아니라, 반복된 실패 경험과 자기효능감이 겹친 결과일 수 있습니다.
</Callout>

<Callout title="적용 포인트">
부모는 아이가 작은 성공을 경험하도록 난이도를 나눠 주는 것이 도움이 됩니다.
</Callout>
```

`title`을 생략하면 기본값 "핵심"이 사용됩니다.

---

## 타입별 참고

- **books**: `audience`, `stores`(리디/교보/예스24/알라딘 URL), `coverImage` 추가.
- **guides/concepts/toolkit**: `references`로 참고 문헌 3~5개 권장.
