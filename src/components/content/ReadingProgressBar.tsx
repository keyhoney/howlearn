import { useEffect, useState } from 'react';

type ReadingProgressBarProps = {
  rootSelector?: string;
};

function computeProgress(root: Element): number | null {
  const rect = root.getBoundingClientRect();
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const rootTop = scrollY + rect.top;
  const rootHeight = root.scrollHeight;
  const scrollable = rootHeight - viewportHeight;

  if (scrollable <= 0) return null;

  const traveled = scrollY - rootTop;
  const ratio = traveled / scrollable;
  return Math.min(100, Math.max(0, Math.round(ratio * 100)));
}

export function ReadingProgressBar({
  rootSelector = 'article[data-reading-progress-root]',
}: ReadingProgressBarProps) {
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    const update = () => {
      setProgress(computeProgress(root));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [rootSelector]);

  if (progress == null || progress <= 0) return null;

  return (
    <div
      className="hl-reading-progress"
      data-visible={progress > 0 && progress < 100 ? 'true' : 'false'}
    >
      <span className="hl-reading-progress__label" aria-live="polite">
        {progress}%
      </span>
      <div
        className="hl-reading-progress__track"
        role="progressbar"
        aria-label="읽기 진행률"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <span
          className="hl-reading-progress__fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
