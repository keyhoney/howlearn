import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = constructMetadata({
  title: "소개",
  description: `${site.name} 소개. ${site.description}`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-8">
        {site.name} 소개
      </h1>
      <div className="prose prose-slate prose-lg max-w-none dark:prose-invert">
        <p className="lead text-slate-600 dark:text-slate-300">
          {site.name}은 인지심리학, 신경과학, 교육심리학, 발달심리학, 동기·정서심리학 연구를 바탕으로 한 부모 교육 가이드와 실천 도구를 제공합니다.
          단편적인 정보가 아닌 연결된 지식망을 통해, 부모와 교육자가 학습의 본질을 이해하고 실제 교육 현장에 적용할 수 있도록 돕습니다.
        </p>

        <section id="purpose" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
            운영 목적
          </h2>
          <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-300">
            <li>학습과학 연구를 부모·교육자에게 접근 가능한 형태로 정리합니다.</li>
            <li>검증 가능한 개념과 실천 도구를 연결해, 일상과 교육 현장에서 활용할 수 있도록 합니다.</li>
            <li>단편 팁이 아닌, 근거와 맥락이 있는 지식 구조를 제공합니다.</li>
          </ul>
        </section>

        <section id="author" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
            운영자·저자
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            {site.name} 콘텐츠는 학습과학·수학교육 분야에서 현장 경험과 연구를 연결해 온 현직 수학 교사가 집필합니다.
          </p>

          <h3 className="mt-6 text-lg font-semibold text-slate-800 dark:text-slate-200">학력·자격</h3>
          <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
            <li>한국교원대학교 수학교육과 졸업</li>
            <li>2014년부터 현직 수학 교사</li>
            <li>중등학교 1급 정교사(수학)</li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-800 dark:text-slate-200">상담 경험</h3>
          <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
            <li>학생 대상 수학 불안·학습 상담 다수 진행</li>
            <li>학부모 대상 가정에서의 학습, 부모의 태도에 대한 상담 다수 진행</li>
            <li>진로·진학 상담 경력 보유 (대구진학지도협의회 소속)</li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-800 dark:text-slate-200">집필·유통</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {site.name}에서 정리한 내용을 바탕으로 집필한 전자책이 리디, 알라딘, Yes24, 교보문고 등에 출간되어 있습니다.
          </p>

          <h3 className="mt-6 text-lg font-semibold text-slate-800 dark:text-slate-200">출간 도서</h3>
          <ul className="mt-2 space-y-4 text-slate-600 dark:text-slate-300 list-none pl-0">
            <li>
              <span className="font-medium text-slate-800 dark:text-slate-200">수학 공부의 뇌</span>
              <span className="block text-sm mt-0.5 text-slate-500 dark:text-slate-400">뇌과학과 심리학이 밝혀낸 수학 공부 최적화 기술</span>
              <span className="block text-sm mt-1">ISBN 9791142194719</span>
              <p className="mt-1.5 text-slate-600 dark:text-slate-300">
                수학 학습과 뇌·인지 연구를 연결해, 효과적인 연습·복습·불안 조절 방법을 다룹니다.
              </p>
            </li>
            <li>
              <span className="font-medium text-slate-800 dark:text-slate-200">공부를 잘하는 아이는 집에서 무엇이 다를까</span>
              <span className="block text-sm mt-0.5 text-slate-500 dark:text-slate-400">통제가 아닌 구조, 관리가 아닌 시스템</span>
              <span className="block text-sm mt-1">ISBN 9791142193170</span>
              <p className="mt-1.5 text-slate-600 dark:text-slate-300">
                가정 환경, 부모의 역할, 학습 습관 형성 연구를 바탕으로 가정에서의 학습 지원 방식을 정리한 책입니다.
              </p>
            </li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-800 dark:text-slate-200">{site.name}을 시작하게 된 이유</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            학생들이 수학을 왜 어려워하는지 고민하다 보니, 아이들의 생각과 불안에 대해 많이 알게 되었습니다.
            그걸 도와줄 방법을 찾다가 여러 논문을 읽었고, 학부모 상담에서도 도움을 주고자 관련 논문을 찾아 읽었습니다.
          </p>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            그동안 읽었던 논문들을 하나둘 정리하기 시작한 것은, 두 아이가 태어나 키우면서 “내 아이를 어떻게 잘 키울 수 있을까”를 진지하게 고민하게 되었기 때문입니다.
            그 정리의 결과가 {site.name}의 출발점입니다.
          </p>

          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            문의·협력 제안: <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">Contact</Link>
          </p>
        </section>

        <section id="review-policy" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
            콘텐츠 검토 원칙
          </h2>
          <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-300">
            <li><strong className="text-slate-800 dark:text-slate-200">출처 명시:</strong> 연구·정책·가이드 인용 시 가능한 한 원문·기관 링크를 둡니다.</li>
            <li><strong className="text-slate-800 dark:text-slate-200">정기 검토:</strong> 중요 문서는 게시일·마지막 검토일을 표시하고, 시기적절한 경우 내용을 갱신합니다.</li>
            <li><strong className="text-slate-800 dark:text-slate-200">범위 명확화:</strong> 교육·심리 정보는 참고용이며, 진단·치료·상담을 대체하지 않습니다. 해당 내용은 각 문서와 <Link href="/disclaimer" className="text-indigo-600 dark:text-indigo-400 hover:underline">면책 조항</Link>에 안내합니다.</li>
          </ul>
        </section>

        <section id="references-policy" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
            참고 문헌 기준
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            가이드·개념 문서에서는 인용한 연구, 공식 가이드, 정책 자료를 <strong className="text-slate-800 dark:text-slate-200">참고 문헌(References)</strong>으로 문서 하단에 나열합니다.
            가능한 경우 저자·연도·제목·출처(학술지·기관명 등)·링크를 함께 적어, 독자가 원문을 확인할 수 있도록 합니다.
            학술 논문은 피인용이 많은 원논문·메타분석·공식 가이드라인을 우선 참고합니다.
          </p>
        </section>

        <section id="legal" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
            이용 안내
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            본 사이트의 콘텐츠는 정보 제공 목적이며, 전문가의 진단·상담·치료를 대체하지 않습니다.
            자세한 내용은 <Link href="/disclaimer" className="text-indigo-600 dark:text-indigo-400 hover:underline">면책 조항</Link>,{" "}
            <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">이용약관</Link>,{" "}
            <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">개인정보처리방침</Link>을 참고해 주세요.
            질문·오류 제보·협력 제안은 <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">문의하기</Link>를 이용해 주시면 됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}
