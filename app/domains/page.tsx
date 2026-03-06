import { getArchiveByCategory } from "@/lib/content";
import { LEARNING_SCIENCE_DOMAINS } from "@/lib/learning-science-domains";
import { SectionHeader } from "@/components/SectionHeader";
import Link from "next/link";

export const metadata = {
  title: "주제별 보기",
  description:
    "학습과학 5가지 영역(인지심리학, 신경과학, 교육심리학, 발달심리학, 동기·정서심리학)별 글 목록입니다.",
};

export default function DomainsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <SectionHeader
        eyebrow="학습과학"
        title="5가지 영역"
        description="인지심리학, 신경과학(뇌과학), 교육심리학, 발달심리학, 동기·정서심리학으로 주제별로 탐색할 수 있습니다."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LEARNING_SCIENCE_DOMAINS.map((domain) => {
          const count = getArchiveByCategory(domain.label).length;
          return (
            <Link
              key={domain.id}
              href={`/c/${encodeURIComponent(domain.label)}`}
              className="group block rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
            >
              <h2
                className="font-semibold text-foreground group-hover:text-[var(--brand-500)]"
                style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}
              >
                {domain.label}
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{domain.description}</p>
              <p className="mt-4 text-xs text-[var(--muted)]">
                {count > 0 ? `${count}개 글` : "아직 글이 없습니다"}
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
