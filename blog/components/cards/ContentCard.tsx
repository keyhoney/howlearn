import Link from "next/link";
import { AnyContent, ContentType } from "@/lib/types";
import { DomainBadge, TagList } from "@/components/ui/badges";
import { ConceptLink } from "@/components/ConceptLink";
import { ArrowRight, Book, BookOpen, FileText, Lightbulb, Wrench } from "lucide-react";
import { format } from "date-fns";

const typeIcons: Record<ContentType, React.ReactNode> = {
  guide: <BookOpen className="w-4 h-4" aria-hidden />,
  blog: <FileText className="w-4 h-4" aria-hidden />,
  concept: <Lightbulb className="w-4 h-4" aria-hidden />,
  toolkit: <Wrench className="w-4 h-4" aria-hidden />,
  book: <Book className="w-4 h-4" aria-hidden />
};

const typeLabels: Record<ContentType, string> = {
  guide: "가이드",
  blog: "블로그",
  concept: "개념",
  toolkit: "툴킷",
  book: "전자책"
};

const typeColors: Record<ContentType, string> = {
  guide: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700",
  blog: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
  concept: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
  toolkit: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700",
  book: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700"
};

const typeLinks: Record<ContentType, string> = {
  guide: "/guides",
  blog: "/blog",
  concept: "/concepts",
  toolkit: "/toolkit",
  book: "/books"
};

function CardLink({
  content,
  children,
}: {
  content: AnyContent;
  children: React.ReactNode;
}) {
  const href = `${typeLinks[content.type]}/${content.slug}`;
  if (content.type === "concept") {
    return (
      <ConceptLink conceptSlug={content.slug} className="block mt-2 no-underline">
        {children}
      </ConceptLink>
    );
  }
  return <Link href={href} className="block mt-2 no-underline">{children}</Link>;
}

function CardFooterLink({
  content,
  children,
}: {
  content: AnyContent;
  children: React.ReactNode;
}) {
  const href = `${typeLinks[content.type]}/${content.slug}`;
  if (content.type === "concept") {
    return (
      <ConceptLink conceptSlug={content.slug} className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors no-underline">
        {children}
      </ConceptLink>
    );
  }
  return (
    <Link href={href} className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors no-underline">
      {children}
    </Link>
  );
}

export function ContentCard({ content }: { content: AnyContent }) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5 sm:p-6 shadow-sm transition-all duration-200 ease-out hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800/60 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md active:scale-[0.99]">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${typeColors[content.type]}`}>
            {typeIcons[content.type]}
            {typeLabels[content.type]}
          </span>
          {content.publishedAt && (
            <time className="text-xs text-slate-400 dark:text-slate-400 font-mono shrink-0">
              {format(new Date(content.publishedAt), 'yyyy-MM-dd')}
            </time>
          )}
        </div>

        <CardLink content={content}>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg lg:text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2">
            {content.title}
          </h3>
          {content.type === 'concept' && content.englishName && (
            <p className="text-sm font-mono text-slate-500 dark:text-slate-400 mt-1">{content.englishName}</p>
          )}
          <p className="mt-2 sm:mt-3 text-base text-slate-600 dark:text-slate-300 sm:text-sm line-clamp-3 leading-relaxed">
            {content.type === 'concept' ? content.shortDefinition : content.summary}
          </p>
        </CardLink>
      </div>

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-100 dark:border-slate-700">
        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
          {content.domains.slice(0, 2).map(domain => (
            <DomainBadge key={domain} domain={domain} />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TagList tags={content.tags.slice(0, 3)} />
          <CardFooterLink content={content}>
            <span className="sr-only">Read more about {content.title}</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" aria-hidden />
          </CardFooterLink>
        </div>
      </div>
    </div>
  );
}
