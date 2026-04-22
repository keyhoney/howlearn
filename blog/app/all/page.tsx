import Link from "next/link";
import { getContentByType } from "@/lib/content";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "전체 목록 (가이드·개념)",
  description: "가이드와 개념 글 전체 목록입니다. 검색엔진이 콘텐츠 구조를 파악할 수 있도록 제공합니다.",
  path: "/all",
});

export default async function AllContentPage() {
  const [guides, concepts] = await Promise.all([
    getContentByType("guide"),
    getContentByType("concept"),
  ]);

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        전체 목록
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-10">
        가이드와 개념 글 전체 목록입니다. <Link href="/guides" prefetch={false} className="text-indigo-600 dark:text-indigo-400 underline">가이드</Link>,{" "}
        <Link href="/concepts" prefetch={false} className="text-indigo-600 dark:text-indigo-400 underline">개념 사전</Link>에서 필터와 함께 볼 수 있습니다.
      </p>

      <section className="mb-12" aria-labelledby="guides-heading">
        <h2 id="guides-heading" className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          가이드 ({guides.length}개)
        </h2>
        <ul className="list-none pl-0 space-y-2">
          {guides.map((g) => (
            <li key={g.id}>
              <Link
                href={`/guides/${encodeURIComponent(g.slug)}`}
                prefetch={false}
                className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
              >
                {g.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="concepts-heading">
        <h2 id="concepts-heading" className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          개념 ({concepts.length}개)
        </h2>
        <ul className="list-none pl-0 space-y-2">
          {concepts.map((c) => (
            <li key={c.id}>
              <Link
                href={`/concepts/${encodeURIComponent(c.slug)}`}
                prefetch={false}
                className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
              >
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
