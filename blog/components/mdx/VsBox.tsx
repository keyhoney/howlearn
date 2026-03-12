type VsBoxProps = {
  titleA: string;
  titleB: string;
  descA: string;
  descB: string;
};

/**
 * 양열 비교 박스 — A: 옅은 붉은 톤, B: 옅은 푸른 톤
 */
export function VsBox({ titleA, titleB, descA, descB }: VsBoxProps) {
  return (
    <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* A: 옅은 붉은색 */}
      <div className="rounded-2xl border border-rose-100 bg-rose-50/90 p-6 dark:border-rose-900/45 dark:bg-rose-950/35">
        <h4 className="mb-2 mt-0 text-lg font-bold text-rose-900 dark:text-rose-100">
          {titleA}
        </h4>
        <p className="m-0 text-sm leading-relaxed text-rose-800 dark:text-rose-200/95">
          {descA}
        </p>
      </div>
      {/* B: 옅은 푸른색 */}
      <div className="rounded-2xl border border-sky-100 bg-sky-50/90 p-6 dark:border-sky-900/45 dark:bg-sky-950/35">
        <h4 className="mb-2 mt-0 text-lg font-bold text-sky-900 dark:text-sky-100">
          {titleB}
        </h4>
        <p className="m-0 text-sm leading-relaxed text-sky-800 dark:text-sky-200/95">
          {descB}
        </p>
      </div>
    </div>
  );
}
