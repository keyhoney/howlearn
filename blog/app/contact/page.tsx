import { constructMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = constructMetadata({
  title: "Contact",
  description: "문의하기",
  path: "/contact",
  noindex: true,
});

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-8">문의하기</h1>
      <div className="prose prose-slate prose-lg max-w-none dark:prose-invert">
        <p className="text-slate-600 dark:text-slate-300">
          서비스 이용 중 궁금한 점이나 제안사항이 있으시다면 아래 문의 폼을 사용하시거나, 카카오톡으로 연락해 주세요.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">문의 폼</h2>
        <ContactForm />

        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-4">직접 연락</h2>
        <ul className="list-none pl-0 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>카카오톡 ID:</strong> ip9mong
          </li>
        </ul>
      </div>
    </div>
  );
}
