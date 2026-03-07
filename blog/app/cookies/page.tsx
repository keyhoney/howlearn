import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Cookie Policy",
  description: "How this site uses cookies and consent management.",
});

export default function CookiesPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900">
        Cookie Policy
      </h1>
      <div className="prose prose-slate prose-lg max-w-none">
        <p className="text-slate-600">Last updated: March 2025</p>
        <h2 className="text-slate-900">1. Use of Cookies</h2>
        <p className="text-slate-600">
          This site may use cookies for analytics (e.g. Google Analytics),
          service convenience, and where applicable, consent management (CMP)
          for personalized advertising in certain regions.
        </p>
        <h2 className="text-slate-900">2. Consent</h2>
        <p className="text-slate-600">
          In some regions (e.g. EEA/UK), we may use a consent banner to let you
          choose between essential-only and full cookie acceptance. You can
          change your preference later via the Cookie Policy or settings page.
        </p>
        <h2 className="text-slate-900">3. Managing Cookies</h2>
        <p className="text-slate-600">
          You can disable or limit cookies in your browser settings; some
          features may not work if you do.
        </p>
        <h2 className="text-slate-900">4. Contact</h2>
        <p className="text-slate-600">
          For questions about this policy, please use the Contact page.
        </p>
      </div>
    </main>
  );
}
