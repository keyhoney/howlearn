import Link from "next/link";
import { domainInfo } from "@/lib/domains";
import { DomainSlug } from "@/lib/types";
import { ArrowRight } from "lucide-react";

export function DomainGrid() {
  const domains = Object.entries(domainInfo) as [DomainSlug, typeof domainInfo[DomainSlug]][];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {domains.map(([slug, info]) => (
        <Link 
          key={slug} 
          href={`/domains/${slug}`}
          className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500"
        >
          <div>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border mb-4 ${info.color}`}>
              Domain
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {info.name}
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {info.description}
            </p>
          </div>
          <div className="mt-6 flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
            탐색하기
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      ))}
    </div>
  );
}
