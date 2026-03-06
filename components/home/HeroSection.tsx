"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const TRUST_PANEL_ITEMS = [
  { title: "전자책 2권 출간", desc: "인지심리·뇌과학 기반 학습법을 전자책으로도 정리했습니다." },
  { title: "근거 기반 설명", desc: "과장된 뇌과학이 아니라, 학습과 행동을 설명하는 연구 기반 프레임을 사용합니다." },
  { title: "학부모 적용 중심", desc: "이론 소개에 그치지 않고, 가정에서 바로 적용할 수 있는 방식으로 설명합니다." },
  { title: "지식 구조형 아카이브", desc: "가이드, 개념, 툴킷, 블로그가 분리되지 않고 서로 연결되도록 설계했습니다." },
];

const HERO_CITATION = {
  quote: "작업기억 용량의 차이가 수학 성취도 차이의 56%를 설명한다.",
  source: "Gathercole et al., 2004",
};

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-24 bg-[var(--background)]">
      <div className="relative grid gap-12 md:grid-cols-[1.4fr,1fr] lg:grid-cols-[7fr,5fr] md:items-start">
        <div className="text-left">
          <p
            className={`section-label text-[var(--muted)] transition-all duration-300 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            LEARNING SCIENCE FOR PARENTS
          </p>
          <h1
            className={`mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)] transition-all duration-500 sm:text-3xl md:text-4xl lg:text-[3.5rem] ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif", letterSpacing: "-0.02em", transitionDelay: "100ms" }}
          >
            학습과학 기반 부모 교육
          </h1>
          <p
            className={`mt-3 max-w-xl text-sm leading-7 text-[var(--muted)] transition-all duration-500 sm:text-[15.5px] md:text-[17px] md:leading-8 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            인지심리·뇌과학 연구를 바탕으로,
            <br />
            아이가 공부를 포기하는 이유와 가정에서의 적용법을 설명합니다.
          </p>
          <p
            className={`mt-3 max-w-xl text-sm leading-6 text-[var(--muted)] transition-all duration-500 ${
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
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-5 py-3 text-sm font-medium text-[var(--foreground)] no-underline shadow-sm transition hover:border-[var(--border-strong)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] min-h-[44px] inline-flex items-center justify-center sm:min-h-0"
            >
              가이드 보기
            </Link>
            <Link
              href="/concepts"
              className="rounded-xl border border-[var(--border)] bg-transparent px-5 py-3 text-sm font-medium text-[var(--foreground)] no-underline transition hover:bg-[var(--inset)] min-h-[44px] inline-flex items-center justify-center sm:min-h-0"
            >
              개념 사전 보기
            </Link>
          </div>
        </div>
        <div
          className={`card-elevated rounded-xl p-4 transition-all duration-500 sm:p-6 md:p-7 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <p className="text-sm font-semibold text-[var(--foreground)]">
            이 사이트는 이렇게 구성되어 있습니다
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            핵심 가이드, 학습과학 개념 사전, 부모 적용 툴킷, 문제 상황형 블로그 글, 전자책까지 하나의 지식 구조로 연결합니다.
          </p>
          <ul className="mt-5 space-y-4">
            {TRUST_PANEL_ITEMS.map((item) => (
              <li key={item.title} className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-[var(--foreground)]">{item.title}</span>
                <span className="text-xs leading-relaxed text-[var(--muted)]">{item.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* 인용 블록: 얇은 테두리 + 크림 배경 */}
      <blockquote
        className={`relative mx-auto mt-12 max-w-3xl border-l-4 border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-4 text-left sm:mt-16 sm:px-6 sm:py-5 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        style={{ transition: "opacity 0.5s ease 450ms", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
      >
        <p className="text-[15.5px] font-medium italic leading-relaxed text-[var(--ink)] sm:text-base">
          &ldquo;{HERO_CITATION.quote}&rdquo;
        </p>
        <cite className="mt-2 block text-sm not-italic text-[var(--muted)]">
          — {HERO_CITATION.source}
        </cite>
      </blockquote>
    </section>
  );
}
