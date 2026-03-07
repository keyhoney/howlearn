import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Disclaimer",
  description: "Nature and limitations of the content on this site.",
});

export default function DisclaimerPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900">
        Disclaimer
      </h1>
      <div className="prose prose-slate prose-lg max-w-none">
        <p className="text-slate-600">
          This site provides <strong>educational and psychology-related
          information</strong> for general guidance. It does not replace
          professional diagnosis, treatment, or counseling.
        </p>
        <p className="text-slate-600">
          If you have specific concerns about learning, behavior, or
          well-being, please consult a qualified professional when
          appropriate.
        </p>
        <p className="text-slate-500">
          Content on this site is for reference only; applicability may vary
          by situation.
        </p>
      </div>
    </main>
  );
}
