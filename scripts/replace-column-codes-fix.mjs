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

function withParticle(label, particle) {
  const topic = label.endsWith('함') || label.endsWith('음') ? `${label} 글` : label;
  if (['은', '는', '이', '가'].includes(particle)) return `${topic}${particle}`;
  if (['과', '와'].includes(particle)) return `${topic}${particle}`;
  if (particle === '처럼') return `${topic}처럼`;
  if (particle === '부터') return `${topic}부터`;
  if (particle === '에서') return `${topic}에서`;
  if (particle === '으로' || particle === '로') return `${topic}으로`;
  if (particle === '의') return `${topic}의`;
  if (particle === '도') return `${topic}도`;
  if (particle === '만') return `${topic}만`;
  if (particle === '을' || particle === '를') return `${topic}${particle}`;
  return `${topic}${particle}`;
}

function fixPass(content) {
  let s = content;

  // Fix broken grammar from first pass
  const grammarFixes = [
    ['왜 틀렸는지 모름는', '왜 틀렸는지 모름 글은'],
    ['수업 직후 함정는', '수업 직후 함정 글은'],
    ['자기주도 복습 루프은', '자기주도 복습 루프 글은'],
    ['계산 실수은', '계산 실수 글은'],
    ['풀이 중 자기 확인는', '풀이 중 자기 확인 글은'],
    ['맞혔는데 설명 못 함는', '맞혔는데 설명 못 함 글은'],
    ['첫 3분는', '공부 시작 첫 3분 글은'],
    ['읽기 3단계은', '문제 읽기 3단계 글은'],
    ['오답 1줄 규칙 오답 1줄 규칙', '오답 1줄 규칙'],
    ['문장제 구조 읽기 긴 문장제', '문장제 구조 읽기와 긴 문장제'],
    ['C01 읽기 → C02 확인 → C03 계산', '문제 읽기 → 성길한 풀이 확인 → 계산 실수'],
    ['읽기(C01)·성길한 풀이(수학 암기 3원칙)', '문제 읽기·성길한 풀이 확인'],
    ['읽기(C01)·계산(C03)', '문제 읽기·계산 실수'],
    ['시작 포기(C06)', '시작 포기(수학 포기 충동)'],
    ['난이도 선택(도전 1문제 룰)', '난이도 선택(도전 1문제 룰)'],
    ['인강·영상 뒤 출력(C09)', '인강·영상 뒤 5분'],
    ['수업 직후 3문장(수업 직후 함정)', '수업 직후 3문장'],
    ['(C04)', ''],
    ['(C09)', ''],
  ];
  for (const [from, to] of grammarFixes) {
    s = s.split(from).join(to);
  }

  // C03은, C08의, etc.
  s = s.replace(/C(\d{1,2})([은는이가을를와과도의로부터에서처럼만])/g, (_, n, p) =>
    withParticle(L(parseInt(n, 10)), p)
  );

  // Remaining C## before space, punctuation, or end
  for (let n = 45; n >= 1; n--) {
    s = s.replace(new RegExp(`C${n}(?=\\s|[^a-zA-Z0-9]|$)`, 'g'), L(n));
  }

  // Cleanup
  s = s.replace(/  +/g, ' ');
  s = s.replace(/글 글/g, '글');

  return s;
}

const files = fs.readdirSync(columnsDir).filter((f) => f.endsWith('.mdx'));
let changed = 0;
const leftovers = [];

for (const file of files) {
  const fp = path.join(columnsDir, file);
  const original = fs.readFileSync(fp, 'utf8');
  const updated = fixPass(original);
  if (updated !== original) {
    fs.writeFileSync(fp, updated, 'utf8');
    changed++;
  }
  const m = updated.match(/C\d{1,2}/g);
  if (m) leftovers.push({ file, codes: [...new Set(m)] });
}

console.log(`Fixed ${changed} files`);
if (leftovers.length) console.log(JSON.stringify(leftovers, null, 2));
else console.log('No C-codes remaining');
