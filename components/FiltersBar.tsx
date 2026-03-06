"use client";

export type SortOption = "latest" | "readingTime";

const GRADE_OPTIONS = [
  { value: "", label: "전체 학년" },
  { value: "초등", label: "초등" },
  { value: "중등", label: "중등" },
  { value: "고등", label: "고등" },
  { value: "공통", label: "공통" },
];

type FiltersBarProps = {
  type: "guides" | "blog" | "toolkit";
  searchPlaceholder?: string;
  categories: string[];
  tags: string[];
  search: string;
  grade: string;
  category: string;
  tag: string;
  onSearchChange: (q: string) => void;
  onGradeChange: (grade: string) => void;
  onCategoryChange: (category: string) => void;
  onTagChange: (tag: string) => void;
  onSortChange: (sort: SortOption) => void;
  sortValue: SortOption;
};

export function FiltersBar({
  type,
  searchPlaceholder = "제목, 설명, 태그로 검색…",
  categories,
  tags,
  search,
  grade,
  category,
  tag,
  onSearchChange,
  onGradeChange,
  onCategoryChange,
  onTagChange,
  onSortChange,
  sortValue,
}: FiltersBarProps) {
  return (
    <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)]/30 px-4 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="min-w-[200px] flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-foreground placeholder:text-[var(--muted)] focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)]"
          aria-label="검색"
        />
        <select
          value={grade}
          onChange={(e) => onGradeChange(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-foreground focus:border-[var(--brand-500)] focus:outline-none"
          aria-label="학년"
        >
          {GRADE_OPTIONS.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {categories.length > 0 && (
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-foreground focus:border-[var(--brand-500)] focus:outline-none"
            aria-label="카테고리"
          >
            <option value="">전체 카테고리</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
        {tags.length > 0 && (
          <select
            value={tag}
            onChange={(e) => onTagChange(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-foreground focus:border-[var(--brand-500)] focus:outline-none"
            aria-label="태그"
          >
            <option value="">전체 태그</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                #{t}
              </option>
            ))}
          </select>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSortChange("latest")}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
              sortValue === "latest"
                ? "border-[var(--brand-500)] bg-[var(--brand-500)]/10 text-[var(--brand-500)]"
                : "border-[var(--border)] bg-[var(--background)] text-foreground hover:border-[var(--brand-500)]/50"
            }`}
          >
            최신순
          </button>
          <button
            type="button"
            onClick={() => onSortChange("readingTime")}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
              sortValue === "readingTime"
                ? "border-[var(--brand-500)] bg-[var(--brand-500)]/10 text-[var(--brand-500)]"
                : "border-[var(--border)] bg-[var(--background)] text-foreground hover:border-[var(--brand-500)]/50"
            }`}
          >
            읽는 시간
          </button>
        </div>
      </div>
    </div>
  );
}
