type TopicIntroProps = {
  title: string;
  description: string;
};

export function TopicIntro({ title, description }: TopicIntroProps) {
  return (
    <aside
      className="my-8 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/80 p-5 md:p-6"
      aria-label="주제 소개"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">주제 소개</p>
      <h3 className="mt-1 text-xl font-semibold text-[var(--ink)] md:text-2xl" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
        {title}
      </h3>
      <p className="mt-2 text-[15.5px] leading-7 text-[var(--ink)] md:text-[17px] md:leading-8">
        {description}
      </p>
    </aside>
  );
}
