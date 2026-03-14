import type {NextConfig} from 'next';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // 크리티컬 요청 체인 완화: CSS를 HTML에 인라인해 별도 CSS 요청/워터폴 제거 → FCP·LCP 개선 (Tailwind 등 원자적 CSS에 적합)
    inlineCss: true,
  },
  // turbopack 비활성: dev 중 Flight chunk.reason.enqueueModel 등 RSC 디코딩 이슈 완화
  // 필요 시 next dev --turbo 로만 터보팩 사용
  // URL 변경 시 영구 이동은 301(permanent: true)로 설정하세요. 302는 임시 이동입니다.
  async redirects() {
    return [
      { source: "/feed.xml", destination: "/rss.xml", permanent: true },
      // 예전 /blog URL 북마크·검색 유입 대응 (콘텐츠는 가이드 등으로 통합됨)
      { source: "/blog", destination: "/guides", permanent: true },
      { source: "/blog/:slug*", destination: "/guides", permanent: true },
      // { source: '/old-path', destination: '/new-path', permanent: true },
    ];
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // 정적 자산 브라우저 캐시: 초기 로드 후 재방문 시 캐시 활용
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*.ico',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      {
        source: '/favicon.png',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      // 보안 헤더 (CSP는 GA/인라인 스크립트와 충돌 가능해 별도 단계에서 도입)
      {
        source: '/:path*',
        headers: [
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
      {
        protocol: 'https',
        hostname: 'learninsight.pages.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify -- file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
