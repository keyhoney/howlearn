import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Contact",
  description: "문의하기",
  noindex: true,
});

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-8">Contact</h1>
      <div className="prose prose-slate prose-lg max-w-none dark:prose-invert">
        <p className="text-slate-600 dark:text-slate-300">
          서비스 이용 중 궁금한 점이나 제안사항이 있으시다면 아래로 연락해 주세요.
        </p>
        <ul className="list-none pl-0 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>이메일:</strong>{" "}
            <a href="mailto:hi_math_edu@naver.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              hi_math_edu@naver.com
            </a>
          </li>
          <li>
            <strong>카카오톡 ID:</strong> ip9mong
          </li>
        </ul>
      </div>
    </div>
  );
}
