import { SearchClient } from "./SearchClient";
import { getAllContent } from "@/lib/content";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "지식 검색",
  description: "가이드, 개념, 블로그, 툴킷, 전자책 등 모든 지식 노드를 검색하세요.",
  noindex: true,
});

export default async function SearchPage() {
  const allContent = await getAllContent();

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">지식 검색</h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-2">
          가이드, 개념, 블로그, 툴킷, 전자책 등 모든 지식 노드를 검색하세요.
        </p>
      </div>
      
      <SearchClient initialData={allContent} />
    </div>
  );
}
