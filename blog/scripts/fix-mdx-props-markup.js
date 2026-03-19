#!/usr/bin/env node
/**
 * MDX "prop 문제" 일괄 정리 스크립트
 *
 * 대상: blog/content/concepts, blog/content/guides
 * 범위: 컴포넌트 props의 값(따옴표로 감싼 문자열) 내부에서
 *   - **bold** 마크다운 기호를 제거
 *   - [text](/concepts/slug) 형태의 링크를 text로 치환(슬러그 URL 노출 방지)
 *
 * 안전장치:
 * - 기본은 dry-run(변경 파일 목록/카운트만 출력)
 * - --write 주면 실제로 파일을 수정
 * - --backup 주면 원본에 .bak 파일을 남김
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");
const TARGET_DIRS = ["content/concepts", "content/guides"].map((p) => path.join(ROOT_DIR, p));

const writeMode = process.argv.includes("--write");
const backupMode = process.argv.includes("--backup");

function collectMdxFiles(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...collectMdxFiles(full));
    else if (e.isFile() && full.toLowerCase().endsWith(".mdx")) out.push(full);
  }
  return out;
}

function transformPropValue(rawValue) {
  let value = rawValue;

  // 1) [text](/concepts/slug) -> text
  // - props 안에 마크다운 링크가 "그대로" 렌더링되는 케이스에서 슬러그(URL)가 노출됨
  value = value.replace(/\[([\s\S]*?)\]\(\s*\/concepts\/[^)]+\)/g, "$1");

  // 2) ( /concepts/slug ) 형태가 남아있는 경우도 방어적으로 제거
  value = value.replace(/\(\s*\/concepts\/[^)]+\)/g, "");

  // 3) **bold** -> bold 텍스트만 남김
  value = value.replace(/\*\*([\s\S]*?)\*\*/g, "$1");

  return value;
}

function fixFileText(text) {
  let changed = false;
  let out = "";

  const len = text.length;
  let i = 0;

  while (i < len) {
    const eq = text.indexOf("=", i);
    if (eq === -1) {
      out += text.slice(i);
      break;
    }

    out += text.slice(i, eq);

    // '=' 뒤에서 공백 스킵 후 따옴표 시작 여부 확인
    let j = eq + 1;
    while (j < len && /\s/.test(text[j])) j++;
    const quote = text[j];

    if (quote !== '"' && quote !== "'") {
      out += "=";
      i = eq + 1;
      continue;
    }

    // 따옴표 시작 전까지(= 포함) 그대로 유지
    out += "=" + text.slice(eq + 1, j + 1); // '=' + 공백 + quote

    const valueStart = j + 1;
    let k = valueStart;

    // closing quote 찾기 (간단 escape 처리)
    while (k < len) {
      const ch = text[k];
      if (ch === "\\") {
        k += 2;
        continue;
      }
      if (ch === quote) break;
      k++;
    }

    if (k >= len) {
      // 닫는 따옴표 못 찾으면 그대로 복사
      out += text.slice(valueStart);
      break;
    }

    const rawValue = text.slice(valueStart, k);

    // 변경 대상은 "마커"가 실제로 포함된 경우만 (false positive 방지)
    const needsFix =
      rawValue.includes("**") || rawValue.includes("/concepts/") || rawValue.includes("concepts/");

    const nextValue = needsFix ? transformPropValue(rawValue) : rawValue;

    if (nextValue !== rawValue) changed = true;

    out += nextValue + quote;

    i = k + 1;
  }

  return { changed, text: out };
}

function main() {
  let files = [];
  for (const d of TARGET_DIRS) {
    if (!fs.existsSync(d)) continue;
    files.push(...collectMdxFiles(d));
  }

  const results = [];
  for (const filePath of files) {
    const original = fs.readFileSync(filePath, "utf8");
    const { changed, text } = fixFileText(original);
    if (!changed) continue;

    results.push(filePath);
    if (!writeMode) continue;

    if (backupMode) {
      const backupPath = filePath + `.bak`;
      fs.writeFileSync(backupPath, original, "utf8");
    }
    fs.writeFileSync(filePath, text, "utf8");
  }

  console.log(`Target files scanned: ${files.length}`);
  console.log(`Files changed: ${results.length}`);
  for (const p of results) console.log(`- ${path.relative(ROOT_DIR, p)}`);

  if (!writeMode) {
    console.log(`(dry-run) Use --write to apply changes${backupMode ? " with --backup" : ""}.`);
  }
}

main();

