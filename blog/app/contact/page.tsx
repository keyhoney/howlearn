import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Contact",
  description: "문의하기",
});

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-8">Contact</h1>
      <div className="prose prose-slate prose-lg max-w-none">
        <p>서비스 이용 중 궁금한 점이나 제안사항이 있으시다면 아래 이메일로 연락해 주세요.</p>
        <p>
          <strong>Email:</strong> contact@learningscience.archive
        </p>
      </div>
    </div>
  );
}
