import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
      <main className="mx-auto max-w-md text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">404</h1>
        <p className="mb-8 text-[var(--muted)]">
          요청한 페이지를 찾을 수 없습니다.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-[var(--brand-500)] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[var(--brand-600)]"
        >
          홈으로
        </Link>
        <p className="mt-6">
          <Link href="/blog" className="text-sm font-medium text-[var(--brand-500)] underline underline-offset-2 hover:no-underline">
            블로그 목록
          </Link>
        </p>
      </main>
    </div>
  );
}
