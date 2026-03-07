import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "About Us",
  description: "학습과학 기반 지식 아카이브에 대한 소개입니다.",
});

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-8">About Us</h1>
      <div className="prose prose-slate prose-lg max-w-none">
        <p>
          학습과학 기반 지식 아카이브는 인지심리학, 신경과학, 교육심리학 연구를 바탕으로 한 부모 교육 가이드와 실천 도구를 제공합니다.
        </p>
        <p>
          단편적인 정보가 아닌 연결된 지식망을 통해, 부모와 교육자가 학습의 본질을 이해하고 실제 교육 현장에 적용할 수 있도록 돕습니다.
        </p>
      </div>
    </div>
  );
}
