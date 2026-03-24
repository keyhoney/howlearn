import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageTransition } from "@/components/layout/PageTransition";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";
import { AnalyticsLoaderClient } from "@/components/AnalyticsLoaderClient";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const defaultOgImage = "https://learninsight.pages.dev/ogprofile/opimage.png";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  description: site.description,
  icons: {
    icon: ["/favicon.ico", "/favicon.png"],
  },
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: [defaultOgImage],
  },
};

const themeScript = `
(function() {
  const key = 'theme';
  const stored = localStorage.getItem(key);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = stored === 'dark' || (!stored && prefersDark);
  if (dark) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
})();
`;

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* GA만 사용 시 preconnect(폰트는 next/font로 셀프호스팅해 gstatic 미사용) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        )}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="" />
        {/* 명시적 파비콘/매니페스트(검색/브라우저 초기 수집 안정화) */}
        <link rel="icon" href={`${site.url}/favicon.ico`} sizes="any" />
        <link rel="icon" href={`${site.url}/favicon.png`} type="image/png" />
        <link rel="manifest" href={`${site.url}/site.webmanifest`} />
        <meta name="application-name" content={site.name} />
      </head>
      <body
        className="min-h-screen flex flex-col font-sans text-slate-900 bg-white dark:bg-slate-900 dark:text-slate-100 transition-colors"
        suppressHydrationWarning
      >
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-[200%] rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:focus:ring-offset-slate-900"
        >
          본문으로 건너뛰기
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1 flex flex-col" tabIndex={-1}>
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
        {process.env.NEXT_PUBLIC_GA_ID && <ScrollDepthTracker />}
        <CookieConsentBanner />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}`,
              }}
            />
            <AnalyticsLoaderClient />
          </>
        )}
        {/* AdSense: window load 이후 로드해 초기 페인트·메인 스레드 경쟁 완화 (자동 광고 동일) */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7303610171129084"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
