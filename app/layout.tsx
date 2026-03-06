import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_KR } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { NavLinks } from "@/components/NavLinks";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "학습과학 지식 브랜드",
    template: "%s | 학습과학 지식 브랜드",
  },
  description:
    "학습 과학: 인지심리학·신경과학·교육심리학·발달심리학·동기·정서심리학. 가이드, 개념 사전, 툴킷, 블로그, 전자책.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} ${notoSerifKr.variable}`}>
      <body className="min-h-screen antialiased bg-[var(--background)] text-foreground">
        {/* 브랜드 프레임: Base(은은한 그라데이션) + 1~2% 얇은 그리드 */}
        <div
          className="relative min-h-screen"
          style={{
            background: "linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, var(--border) 0 1px, transparent 1px 80px), repeating-linear-gradient(90deg, var(--border) 0 1px, transparent 1px 80px)",
              backgroundSize: "80px 80px",
            }}
            aria-hidden
          />
          <div className="relative">
            <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-sm">
              <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                <Link href="/" className="flex min-w-0 flex-shrink-0 flex-col gap-0.5 transition hover:opacity-90">
                  <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                    Learning Science for Parents
                  </span>
                  <span
                    className="text-xl font-semibold tracking-tight text-foreground"
                    style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}
                  >
                    학습과학 지식 브랜드
                  </span>
                </Link>
                <NavLinks />
              </nav>
            </header>
            <main className="min-h-[70vh]">{children}</main>
        <ScrollDepthTracker />
        <CookieConsentBanner />
        <footer className="mt-24 border-t border-[var(--border)] bg-[var(--surface-2)]">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="space-y-3">
                <p
                  className="text-lg font-semibold text-foreground"
                  style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}
                >
                  학습과학 지식 브랜드
                </p>
                <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)]">
                  인지심리·뇌과학 연구를 바탕으로 학부모와 교육자를 위한 가이드, 개념 사전, 툴킷, 블로그를 제공합니다.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">주요 섹션</p>
                <ul className="flex flex-col gap-2 text-sm">
                  <li><Link href="/guides" className="text-foreground no-underline hover:text-[var(--brand-500)]">가이드</Link></li>
                  <li><Link href="/concepts" className="text-foreground no-underline hover:text-[var(--brand-500)]">개념 사전</Link></li>
                  <li><Link href="/toolkit" className="text-foreground no-underline hover:text-[var(--brand-500)]">툴킷</Link></li>
                  <li><Link href="/blog" className="text-foreground no-underline hover:text-[var(--brand-500)]">블로그</Link></li>
                  <li><Link href="/books" className="text-foreground no-underline hover:text-[var(--brand-500)]">전자책</Link></li>
                  <li><Link href="/search" className="text-foreground no-underline hover:text-[var(--brand-500)]">검색</Link></li>
                </ul>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">정책·연락처</p>
                <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--muted)]">
                  <li><Link href="/privacy" className="hover:text-foreground">개인정보 처리방침</Link></li>
                  <li><Link href="/cookies" className="hover:text-foreground">쿠키</Link></li>
                  <li><Link href="/terms" className="hover:text-foreground">이용약관</Link></li>
                  <li><Link href="/contact" className="hover:text-foreground">연락처</Link></li>
                  <li><Link href="/disclaimer" className="hover:text-foreground">고지</Link></li>
                  <li>
                    <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">RSS</a>
                  </li>
                </ul>
                <p className="pt-2 text-xs text-[var(--muted)]">
                  © 학습과학 지식 브랜드. 인지심리·뇌과학 기반 교육 콘텐츠.
                </p>
              </div>
            </div>
          </div>
        </footer>
          </div>
        </div>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
        )}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
