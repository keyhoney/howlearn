type TopicIntroProps = {
  title?: string;
  description?: string;
  label?: string;
};

export function TopicIntro({
  title = '',
  description = '',
  label = '주제 소개',
}: TopicIntroProps) {
  if (!title && !description) return null;
  return (
    <aside
      className="app-mdx-card-muted my-8 p-5 md:p-6"
      aria-label={label || title || '소개'}
    >
      {label ? (
        <p className="app-mdx-kicker">{label}</p>
      ) : null}
      <h3 className={`app-mdx-title text-xl md:text-2xl ${label ? 'mt-2' : ''}`}>
        {title}
      </h3>
      <p className="app-mdx-body mt-2 text-[15.5px] leading-7 md:text-[17px] md:leading-8">{description}</p>
    </aside>
  );
}
