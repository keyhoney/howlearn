import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const columnsDir = path.join(__dirname, '../src/content/columns');

const LABELS = {
  1: '문제 읽기 3단계',
  2: '성길한 풀이 확인',
  3: '계산 실수·작업 기억',
  4: '공식 암기와 변형',
  5: '응용 문제 연습',
  6: '수학 포기 충동',
  7: '혼자 풀기 훈련',
  8: '해설 보기 전 5분',
  9: '인강·영상 뒤 5분',
  10: '익숙한 풀이 방식',
  11: '수학 암기 3원칙',
  12: '시험 전 인출 복습',
  13: '잠과 수학 기억',
  14: '외웠다와 안다',
  15: '수업 직후 함정',
  16: '문제집 의미 있는 반복',
  17: '교차 학습',
  18: "'이건 알아' 넘기기",
  19: '맞혔는데 설명 못 함',
  20: '교과서 3분 자기 설명',
  21: '문장제 구조 읽기',
  22: '공부 시작 첫 3분',
  23: '시험 범위 계획',
  24: '10분 집중 블록',
  25: '작업 기억 지키기',
  26: '쇼츠 휴식 함정',
  27: '수학 전 5분 움직임',
  28: '같은 1시간 피로',
  29: '수학 이해 속도',
  30: '고학년 수학 부담',
  31: '수학 고정 마인드셋',
  32: '도전 1문제 룰',
  33: '열심히 했는데 점수',
  34: '자기동기 전략 일지',
  35: '선행학습 멈춤 신호',
  36: '자기주도 복습 루프',
  37: '시험장 뇌 차이',
  38: '시험 전날 뇌 관리',
  39: '시험 앞 미루기',
  40: '시험 후 복기',
  41: '오답 정서',
  42: '오답 학습 데이터',
  43: '오답 1줄 규칙',
  44: '왜 틀렸는지 모름',
  45: '풀이 중 자기 확인',
};

function L(n) {
  return LABELS[n];
}

function expandChain(match, sep) {
  const nums = match.match(/\d{1,2}/g).map((x) => parseInt(x, 10));
  return nums.map(L).join(sep);
}

function transform(content) {
  let s = content;

  // Link suffix: ](/columns/foo)(C08)
  s = s.replace(/\]\([^)]+\)\(C\d{1,2}\)/g, (m) => m.replace(/\(C\d{1,2}\)$/, ''));

  // 이 글(C21), 칼럼(C08), 글(C38)
  s = s.replace(/(이 글|칼럼|글)\(C\d{1,2}\)/g, '$1');

  // C41–C44, C41-C44 ranges
  s = s.replace(/C(\d{1,2})[–-]C(\d{1,2})/g, (_, a, b) => {
    const start = parseInt(a, 10);
    const end = parseInt(b, 10);
    const parts = [];
    for (let i = start; i <= end; i++) parts.push(L(i));
    return parts.join(' → ');
  });

  // C41·C42·C43 chains
  s = s.replace(/C\d{1,2}(?:·C\d{1,2})+/g, (m) => expandChain(m, '·'));

  // C41/C42/C43 chains
  s = s.replace(/C\d{1,2}(?:\/C\d{1,2})+/g, (m) => expandChain(m, '/'));

  // C22=..., C38=... mappings
  s = s.replace(/C(\d{1,2})=([^,·/"\]]+)/g, (_, n, rest) => `${L(parseInt(n, 10))}=${rest.trim()}`);

  // C{n}(parenthetical)
  s = s.replace(/C(\d{1,2})\(([^)]+)\)/g, (_, n, inner) => {
    if (/^이 글/.test(inner)) return '이 글';
    return inner;
  });

  // **C42 (이 글)**
  s = s.replace(/\*\*C\d{1,2}\s*\(이 글\)\*\*/g, '**이 글**');
  s = s.replace(/\*\*C(\d{1,2})\*\*/g, (_, n) => `**${L(parseInt(n, 10))}**`);

  // Remaining single codes (45 → 1)
  for (let n = 45; n >= 1; n--) {
    s = s.replace(new RegExp(`\\bC${n}\\b`, 'g'), L(n));
  }

  // Light cleanup
  s = s.replace(/글은 글은/g, '글은');
  s = s.replace(/칼럼은 칼럼은/g, '칼럼은');

  return s;
}

const files = fs.readdirSync(columnsDir).filter((f) => f.endsWith('.mdx'));
let changed = 0;

for (const file of files) {
  const fp = path.join(columnsDir, file);
  const original = fs.readFileSync(fp, 'utf8');
  const updated = transform(original);
  if (updated !== original) {
    fs.writeFileSync(fp, updated, 'utf8');
    changed++;
  }
}

const leftovers = [];
for (const file of files) {
  const content = fs.readFileSync(path.join(columnsDir, file), 'utf8');
  const m = content.match(/\bC\d{1,2}\b/g);
  if (m) leftovers.push({ file, codes: [...new Set(m)] });
}

console.log(`Updated ${changed} files`);
if (leftovers.length) {
  console.log('Remaining:', JSON.stringify(leftovers, null, 2));
} else {
  console.log('No C-codes remaining');
}
