import { SearchClient } from "./SearchClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "검색",
  description: "사이트 내 콘텐츠를 검색합니다.",
};

export default function SearchPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
        사이트 내 검색
      </p>
      <h1 className="mb-10 text-3xl font-bold tracking-tight text-foreground">
        검색
      </h1>
      <SearchClient />
    </main>
  );
}
