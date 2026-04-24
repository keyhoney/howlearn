# HowLearn (Astro)

Cloudflare 배포용 Astro 6 프로젝트입니다.

## 요구 사항

- Node.js 22.12+

## 로컬

```bash
npm install
cp .env.example .env   # TinaCloud 값 입력
npm run dev
```

Tina 에디터: `npm run tina:dev` 후 `/admin`.

## 빌드

- 사이트만: `npm run build`
- Tina + 사이트(배포·CI): `TINA_*` 환경 변수 설정 후 `npm run tina:build`

## 배포

- `wrangler.jsonc` 기준 Wrangler / Cloudflare Pages 출력은 `dist`입니다.
- Pages 빌드 명령 예: `npm run tina:build` (또는 `npm run build` — Tina 미사용 시)

자세한 편집 절차는 `docs/cms-editing-guide.md`를 참고하세요.
