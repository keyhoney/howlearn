type SectionHeaderProps = {
  title: string;
  description: string;
  /** 작은 라벨(예: CONCEPTS) — 왼쪽에 rule line과 함께 표시 */
  eyebrow?: string;
  /** 배지 1~2개 (예: 업데이트 기준, 참고문헌) */
  badges?: string[];
  badge?: string;
  icon?: React.ReactNode;
  /** 우측에 보조 정보(배지·수치·링크) 배치 */
  layout?: "default" | "twoCol";
  /** twoCol일 때 우측 영역 */
  secondary?: React.ReactNode;
};

export function SectionHeader({
  title,
  description,
  eyebrow,
  badges,
  badge,
  icon,
  layout = "default",
  secondary,
}: SectionHeaderProps) {
  const allBadges = badges?.length ? badges.slice(0, 2) : badge ? [badge] : [];

  const headerContent = (
    <>
      <div className="flex flex-wrap items-center gap-2 gap-y-1">
        {eyebrow && (
          <span className="border-l-2 border-[var(--border-strong)] pl-3 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            {eyebrow}
          </span>
        )}
        {icon && (
          <span className="text-[var(--muted)]" aria-hidden>
            {icon}
          </span>
        )}
        {allBadges.map((b) => (
          <span
            key={b}
            className="rounded-full border border-[var(--border)] bg-[var(--inset)]/60 px-3 py-1 text-xs font-medium text-[var(--muted)]"
          >
            {b}
          </span>
        ))}
      </div>
      <h1
        className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
        style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}
      >
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-[15.5px] leading-7 text-[var(--muted)] md:text-[17px] md:leading-8">
        {description}
      </p>
    </>
  );

  if (layout === "twoCol" && secondary) {
    return (
      <header className="mb-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="min-w-0 flex-1">{headerContent}</div>
          <div className="shrink-0 md:pt-10">{secondary}</div>
        </div>
      </header>
    );
  }

  return <header className="mb-10">{headerContent}</header>;
}
