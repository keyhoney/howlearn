type VsBoxProps = {
  titleA: string;
  titleB: string;
  descA: string;
  descB: string;
};

export function VsBox({ titleA, titleB, descA, descB }: VsBoxProps) {
  return (
    <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="app-mdx-card p-6">
        <span className="app-badge app-badge-warning">A 관점</span>
        <h4 className="app-mdx-title mb-2 mt-3 text-lg">{titleA}</h4>
        <p className="app-mdx-body m-0 text-sm leading-relaxed">{descA}</p>
      </div>
      <div className="app-mdx-card p-6">
        <span className="app-badge app-badge-info">B 관점</span>
        <h4 className="app-mdx-title mb-2 mt-3 text-lg">{titleB}</h4>
        <p className="app-mdx-body m-0 text-sm leading-relaxed">{descB}</p>
      </div>
    </div>
  );
}
