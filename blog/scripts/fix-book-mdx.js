const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../content/books/smart-kids-home-environment.mdx");
let s = fs.readFileSync(filePath, "utf8");

// Fix: line starting with "- " and containing 어떻게 해야 하나요
s = s.replace(
  /^- .*어떻게 해야 하나요.*라고 물을 때마다 답이 하나로 정리되지 않아 답답한 부모\s*$/m,
  '    "어떻게 해야 하나요?라고 물을 때마다 답이 하나로 정리되지 않아 답답한 부모",'
);

// Fix: line with 공부를 and 시키는 and 지쳐서
s = s.replace(
  /^- .*공부를.*시키는.*데 지쳐서, 스스로 굴러가게 하고 싶은 부모\s*$/m,
  '    "공부를 시키는 데 지쳐서, 스스로 굴러가게 하고 싶은 부모",'
);

const newCore = `<MdxH2 icon="lightbulb" badge="핵심">이 책의 핵심 메시지</MdxH2>

<MidSummaryBox
  title="이 책의 핵심 메시지"
  points={[
    "관리형이 아니라 시스템형 — 매번 지시하기보다 규칙과 루틴이 있어 공부가 자동으로 굴러가는 집의 차이를 다룹합니다.",
    "성적보다 감정과 리듬이 먼저 — 불안·수치심·분노를 어떻게 읽고, 회복 가능한 환경을 어떻게 만드는지 정리합니다.",
    "말이 아니라 구조 — 비교·낙인·예언의 말버릇을 줄이는 것만으로는 부족하고, 말을 바꾸기 전에 구조를 바꾸는 3단계를 제안합니다.",
    "통제에서 코칭으로 — 공부를 시키는 집이 무너지는 이유와, 자기주도성이 자라도록 넘어가는 방법을 구체적으로 다룹합니다.",
    "답을 주기보다 곁에 서기 — 이 책은 해답 나열이 아니라, 이미 오래 해온 시간과 흔들려온 마음을 먼저 존중하는 자리를 만들기 위해 썼습니다.",
  ]}
/>`;

// Replace 핵심 메시지 block (match from MdxH2 through last bullet)
const coreStart = s.indexOf("<MdxH2 icon=\"lightbulb\" badge=\"핵심\">이 책의 핵심 메시지</MdxH2>");
const coreEnd = s.indexOf("<MdxH2 icon=\"messageCircle\" badge=\"저자\">저자 소개</MdxH2>");
if (coreStart !== -1 && coreEnd !== -1) {
  s = s.slice(0, coreStart) + newCore + "\n\n" + s.slice(coreEnd);
}

// 저자 소개: replace paragraph with TopicIntro
const authorStart = s.indexOf("<MdxH2 icon=\"messageCircle\" badge=\"저자\">저자 소개</MdxH2>");
const authorParaEnd = s.indexOf("<MdxH2 icon=\"bookOpen\" badge=\"소개\">책 소개</MdxH2>");
if (authorStart !== -1 && authorParaEnd !== -1) {
  const authorBlock = s.slice(authorStart, authorParaEnd);
  const topicIntro = `<MdxH2 icon="messageCircle" badge="저자">저자 소개</MdxH2>

<TopicIntro
  title="저자"
  description="수학교사 10여 년, 진학지도 10여 년. 교실에서 수백 명의 학생을 만나고 상담실에서 수백 가정의 이야기를 들어온 교사이자, 두 아이 앞에서 매일 흔들리는 아버지입니다. 같은 교실에서도 아이마다 다르게 흔들리고 버티는 모습을 보며, 성적 차이의 원인이 아이의 능력보다 집의 작동 방식에 있음을 깨달았고, 그 관점을 학부모가 적용할 수 있도록 이 책에 담았습니다."
/>`;
  s = s.slice(0, authorStart) + topicIntro + "\n\n" + s.slice(authorParaEnd);
}

// Insert ConclusionHero before 내용 구성
const insertPoint = s.indexOf("<MdxH2 icon=\"compass\" badge=\"목차\">내용 구성</MdxH2>");
if (insertPoint !== -1) {
  const hero = `

<ConclusionHero
  leadLabel="이 책이 독자에게"
  line1="해답이 아니라"
  line2="잠시 멈춰 서는 자리"
  principle="이 책이 독자에게 드리는 말"
/>

`;
  s = s.slice(0, insertPoint) + hero + s.slice(insertPoint);
}

// Wrap 목차 in BookToc: from "프롤로그" to end of file
const prologStart = s.indexOf("프롤로그. 답을 주기보다는, 곁에 서기 위해");
const tocMdxEnd = s.indexOf("<MdxH2 icon=\"compass\" badge=\"목차\">내용 구성</MdxH2>") + 55;
if (prologStart !== -1 && tocMdxEnd !== -1) {
  s = s.slice(0, tocMdxEnd) + "\n\n<BookToc>\n\n" + s.slice(prologStart);
  s = s + "\n</BookToc>";
}

fs.writeFileSync(filePath, s, "utf8");
console.log("Done.");
