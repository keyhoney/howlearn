"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const TRUST_PANEL_ITEMS = [
  { title: "전자책 2권 출간", desc: "인지심리·뇌과학 기반 학습법을 전자책으로도 정리했습니다." },
  { title: "근거 기반 설명", desc: "과장된 뇌과학이 아니라, 학습과 행동을 설명하는 연구 기반 프레임을 사용합니다." },
  { title: "학부모 적용 중심", desc: "이론 소개에 그치지 않고, 가정에서 바로 적용할 수 있는 방식으로 설명합니다." },
  { title: "지식 구조형 아카이브", desc: "가이드, 개념, 툴킷, 블로그가 분리되지 않고 서로 연결되도록 설계했습니다." },
];

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <div
        className="pointer-events-none absolute -top-10 left-0 right-0 h-48 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,var(--brand-500)_0%,transparent_60%)] opacity-[0.06]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-0 right-0 h-64 w-64 bg-[radial-gradient(circle_at_100%_0%,var(--brand-500)_0%,transparent_55%)] opacity-[0.04]"
        aria-hidden
      />
      <div className="relative grid gap-12 md:grid-cols-[1.4fr,1fr] lg:grid-cols-[7fr,5fr] md:items-start">
        <div className="text-left">
          <p
            className={`text-xs font-medium uppercase tracking-wider text-[var(--muted)] transition-all duration-300 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            LEARNING SCIENCE FOR PARENTS
          </p>
          <h1
            className={`mt-2 text-3xl font-semibold tracking-tight text-foreground transition-all duration-500 sm:text-4xl md:text-[2.5rem] ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif", transitionDelay: "100ms" }}
          >
            학습과학 기반 부모 교육
          </h1>
          <p
            className={`mt-4 max-w-xl text-[15.5px] leading-7 text-[var(--muted)] transition-all duration-500 md:text-[17px] md:leading-8 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            인지심리·뇌과학 연구를 바탕으로,
            <br />
            아이가 공부를 포기하는 이유와 가정에서의 적용법을 설명합니다.
          </p>
          <p
            className={`mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]/90 transition-all duration-500 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: "250ms" }}
          >
            이 사이트는 수학 포기, 학습 동기, 집중력, 공부 습관, 부모의 개입 방식까지 학습 실패의 원인과 해결을 구조적으로 다룹니다.
          </p>
          <div
            className={`mt-8 flex flex-wrap gap-3 transition-all duration-500 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: "350ms" }}
          >
            <Link
              href="/guides"
              className="rounded-xl bg-[var(--brand-500)] px-6 py-3 text-sm font-medium text-white no-underline shadow-sm transition hover:bg-[var(--brand-600)]"
            >
              가이드 보기
            </Link>
            <Link
              href="/concepts"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-medium text-foreground no-underline transition hover:border-[var(--border-strong)]"
            >
              개념 사전 보기
            </Link>
          </div>
        </div>
        <div
          className={`rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6 shadow-sm transition-all duration-500 md:p-7 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <p className="text-sm font-semibold text-foreground">
            이 사이트는 이렇게 구성되어 있습니다
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            핵심 가이드, 학습과학 개념 사전, 부모 적용 툴킷, 문제 상황형 블로그 글, 전자책까지 하나의 지식 구조로 연결합니다.
          </p>
          <ul className="mt-5 space-y-4">
            {TRUST_PANEL_ITEMS.map((item, i) => (
              <li key={item.title} className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">{item.title}</span>
                <span className="text-xs leading-relaxed text-[var(--muted)]">{item.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
