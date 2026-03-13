# 개념 슬러그 라벨 데이터

슬러그 → 한글 태그명/영문 매핑용 데이터입니다.  
`blog/lib/concept-tag-label.ts`에서 참조하며, 스크립트·기타 기능에서 사용할 수 있습니다.

## 방법 A — 원본 JSON 복사 (권장)

개발 노트의 **`1. 하우런_태그체계표.json`** 을 그대로 복사해 아래에 둡니다.

```text
blog/data/1. 하우런_태그체계표.json
```

- 태그표를 고칠 때마다 **이 파일만 다시 복사**하면 됩니다.
- `concept-tag-label.ts`가 `rows`를 읽어 슬러그 → 태그명/영문을 씁니다.
- 별도 생성 스크립트 없이 운영 가능합니다.

## 방법 B — 경량 맵만 커밋

원본이 크거나 커밋하고 싶지 않을 때:

```bash
node scripts/generate-concept-slug-labels.js
```

→ `concept-slug-labels.json` 생성 후 커밋.  
원본 JSON 경로를 인자로 줄 수도 있습니다.

## 우선순위

1. `1. 하우런_태그체계표.json` 이 있으면 **이걸 사용**
2. 없으면 `concept-slug-labels.json`
3. 둘 다 없으면 슬러그 휴먼라이즈로 폴백
