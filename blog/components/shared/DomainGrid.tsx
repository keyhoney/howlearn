import Link from "next/link";
import { domainInfo } from "@/lib/domains";
import { DomainSlug } from "@/lib/types";
import { ArrowRight } from "lucide-react";

export function DomainGrid() {
  const domains = Object.entries(domainInfo) as [DomainSlug, typeof domainInfo[DomainSlug]][];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {domains.map(([slug, info]) => (
        <Link
          key={slug}
          href={`/domains/${slug}`}
          className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-5 sm:p-6 shadow-sm transition-all duration-200 ease-out hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-500 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md active:scale-[0.99]"
        >
          <div>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border mb-4 transition-colors duration-200 ${info.color} group-hover:border-indigo-300 dark:group-hover:border-indigo-500`}>
              Domain
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
              {info.name}
            </h3>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 sm:text-sm leading-relaxed">
              {info.description}
            </p>
          </div>
          <div className="mt-5 sm:mt-6 flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-200">
            탐색하기
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" aria-hidden />
          </div>
        </Link>
      ))}
    </div>
  );
}
