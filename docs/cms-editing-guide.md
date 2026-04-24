# HowLearn 콘텐츠 편집 가이드 (Tina CMS)

## 개요

HowLearn의 콘텐츠(가이드/개념/도서/칼럼)는 **Tina CMS**를 통해 비개발자도 비주얼 에디터에서 편집할 수 있습니다.
Tina는 Git 기반 CMS로, 에디터에서 저장하면 GitHub의 MDX 파일이 직접 수정됩니다.

---

## 1. 로컬 개발 환경 실행

```bash
# 의존성 설치 (최초 1회)
npm install

# Tina + Astro 동시 실행
npm run tina:dev
```

- Astro 개발 서버: `http://localhost:4321`
- Tina 에디터 UI: `http://localhost:4321/admin`

### TinaCloud용 `tina/tina-lock.json`

TinaCloud가 저장소 브랜치에서 스키마를 인덱싱하려면 **`tina/tina-lock.json`이 Git에 올라가 있어야** 합니다. ([공식 안내: 업그레이드 후 dev로 lock 갱신·커밋](https://tina.io/docs/guides/upgrade-to-latest-version))

- 이미 `tina/config.ts`가 있으면 `tinacms init`은 생략해도 됩니다.
- lock만 갱신할 때(예: Astro만 띄우기 싫을 때):

```bash
npx tinacms dev --no-server --datalayer-port 9010
```

(`9000` 포트가 다른 Tina 프로세스에 잡혀 있으면 `--datalayer-port`를 바꿉니다.)

`tina/config.ts`를 수정한 뒤에는 위 명령으로 lock을 다시 만들고, **변경분을 커밋·푸시**하세요.

---

## 2. 콘텐츠 편집 흐름

```
작성 (draft) → 검수 → 발행 (published)
```

### 2-1. 신규 콘텐츠 작성

1. `http://localhost:4321/admin` 접속
2. 왼쪽 패널에서 컬렉션 선택 (가이드 / 개념 / 도서 / 칼럼)
3. 우상단 **[+ 새 문서]** 클릭
4. 발행 상태를 **초안(draft)** 으로 두고 작성 시작
5. 저장하면 `src/content/{collection}/` 에 MDX 파일 생성

### 2-2. 검수 및 발행

1. 에디터에서 문서 열기
2. 발행 상태 → **발행(published)** 으로 변경
3. **[저장]** → GitHub 커밋 자동 생성
4. main 브랜치에 병합되면 Cloudflare Pages가 자동 빌드/배포

### 2-3. 수정

1. 에디터에서 기존 문서 열기
2. 내용 수정 후 저장
3. PR/직접 커밋 방식 모두 지원 (TinaCloud 설정에 따름)

---

## 3. 발행/초안 정책

| 상태 | 동작 |
|---|---|
| `published` | 사이트 목록/상세에 노출, 빌드에 포함 |
| `draft` | 사이트에 **노출 안 됨**, Tina 에디터 내에서만 접근 가능 |

초안은 `src/lib/content-utils.ts`의 `getPublished*()` 함수에서 자동 필터링됩니다.

```typescript
// 예시: 가이드 목록 라우트
const guides = await getPublishedGuides(); // draft 제외
```

---

## 4. 컬렉션별 필수 필드 요약

### 가이드 (`src/content/guides/`)

| 필드 | 필수 | 설명 |
|---|---|---|
| title | ✅ | 제목 |
| summary | ✅ | 요약 (카드/OG에 사용) |
| status | ✅ | draft \| published |
| publishedAt | 권장 | 발행일 (정렬에 사용) |
| domains | 권장 | 학문 분류 |
| tags | 권장 | 검색/필터 태그 |
| faq | 선택 | FAQ (구조화 데이터 JSON-LD에 활용) |

### 개념 (`src/content/concepts/`)

| 필드 | 필수 | 설명 |
|---|---|---|
| title | ✅ | 제목 |
| **shortDefinition** | ✅ | 짧은 정의 (tooltip/카드용) |
| summary | ✅ | 요약 |
| status | ✅ | draft \| published |
| englishName | 선택 | 영문명 |

### 도서 (`src/content/books/`)

| 필드 | 필수 | 설명 |
|---|---|---|
| title | ✅ | 도서 제목 |
| summary | ✅ | 요약 |
| status | ✅ | draft \| published |
| subtitle | 선택 | 부제 |
| purchaseLinks | 선택 | 구매 링크 배열 |

### 칼럼 (`src/content/columns/`)

| 필드 | 필수 | 설명 |
|---|---|---|
| title | ✅ | 제목 |
| summary | ✅ | 요약 |
| status | ✅ | draft \| published |

---

## 5. TinaCloud 배포 설정 (운영 환경)

운영 서버에서 Tina 에디터를 사용하려면 TinaCloud 연동이 필요합니다.

1. [app.tina.io](https://app.tina.io) 에서 프로젝트 생성
2. GitHub 저장소 연결
3. `.env` 파일에 아래 값 추가:

```env
TINA_CLIENT_ID=your-client-id
TINA_TOKEN=your-token
TINA_BRANCH=main
```

4. Cloudflare Pages 환경 변수에도 동일하게 추가

---

## 6. 자주 하는 질문

**Q. 에디터에서 저장해도 사이트에 반영이 안 됩니다.**
A. draft 상태인지 확인하세요. published 로 변경 후 저장하면 배포 파이프라인이 자동 실행됩니다.

**Q. 이미지는 어떻게 업로드하나요?**
A. Tina 에디터 내 이미지 필드에서 업로드 → `public/uploads/`에 저장됩니다.

**Q. 새 컬렉션을 추가하고 싶어요.**
A. `tina/config.ts`에 새 컬렉션 블록을 추가하고 `src/content.config.ts`에도 동일하게 컬렉션을 정의하세요.
