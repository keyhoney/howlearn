"use client";

import { useEffect, useState } from "react";

type ProofItem = {
  label: string;
  value: string;
  description: string;
};

type ProofStripSectionProps = {
  items: ProofItem[];
};

function CountUp({ value, duration = 600 }: { value: string; duration?: number }) {
  const num = parseInt(value, 10);
  const isNumeric = !Number.isNaN(num) && num >= 0 && num < 1000;
  const [count, setCount] = useState(isNumeric ? 0 : value);

  useEffect(() => {
    if (!isNumeric) {
      setCount(value);
      return;
    }
    let start = 0;
    const step = Math.max(1, Math.ceil(num / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [num, isNumeric, value, duration]);

  return <span>{isNumeric ? count : value}</span>;
}

export function ProofStripSection({ items }: ProofStripSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-14">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--inset)]/60 py-8">
        <p className="px-6 text-center text-sm font-semibold text-foreground">
          이 사이트는 축적되는 지식 구조를 지향합니다
        </p>
        <p className="mt-1 px-6 text-center text-xs text-[var(--muted)]">
          한 편의 글보다, 서로 연결되는 지식 아카이브가 더 큰 힘을 만듭니다.
        </p>
        <div className="mt-8 grid gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center">
              <span className="text-2xl font-semibold text-foreground">
                <CountUp value={item.value} />
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">{item.label}</span>
              <span className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{item.description}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
