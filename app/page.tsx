import { getAllByType, getBySlug, getArchiveByCategory } from "@/lib/content";
import { fullPath } from "@/lib/content-path";
import { getReadingTimeMinutes } from "@/lib/reading-time";
import {
  HeroSection,
  KnowledgeMapSection,
  type KnowledgeMapCard,
  ProofStripSection,
  FeaturedGuideSection,
  ConceptsIndexSection,
  LatestEssaysSection,
  BooksShowcaseSection,
  DomainsStrip,
} from "@/components/home";
import type { ContentType } from "@/lib/content";

const CATEGORY_CONFIG: {
  type: ContentType;
  title: string;
  description: string;
  href: string;
  metaLabel: string;
}[] = [
  { type: "guides", title: "가이드", description: "주제별 핵심 문서를 먼저 읽고, 학습 실패의 구조를 큰 그림으로 이해할 수 있습니다.", href: "/guides", metaLabel: "핵심 문서부터 읽기" },
  { type: "concepts", title: "개념 사전", description: "작업기억, 인지부하, 회상연습처럼 학습과학의 핵심 개념을 짧고 정확하게 정리했습니다.", href: "/concepts", metaLabel: "용어와 이론 빠르게 이해하기" },
  { type: "toolkit", title: "툴킷", description: "체크리스트, 루틴, 실천 자료를 통해 부모가 가정에서 바로 적용할 수 있는 형태로 제공합니다.", href: "/toolkit", metaLabel: "읽고 끝나지 않는 실천 자료" },
  { type: "blog", title: "블로그", description: "아이의 학습 실패, 공부 습관, 부모의 개입에 관한 질문형 글과 에세이를 모았습니다.", href: "/blog", metaLabel: "문제 상황에서 출발하는 글" },
  { type: "books", title: "전자책", description: "사이트에서 다루는 핵심 내용을 더 길고 체계적으로 읽을 수 있도록 전자책으로 정리했습니다.", href: "/books", metaLabel: "서점에서 보기" },
];

export default function Home() {
  const guidesRaw = getAllByType("guides");
  const conceptsRaw = getAllByType("concepts").slice(0, 8);
  const blogRaw = getAllByType("blog").slice(0, 6);
  const toolkitRaw = getAllByType("toolkit");
  const booksRaw = getAllByType("books");

  const knowledgeMapCards: KnowledgeMapCard[] = CATEGORY_CONFIG.map((c) => {
    const list =
      c.type === "guides"
        ? guidesRaw
        : c.type === "concepts"
          ? getAllByType("concepts")
          : c.type === "toolkit"
            ? toolkitRaw
            : c.type === "blog"
              ? getAllByType("blog")
              : booksRaw;
    const examples = list.slice(0, 2).map(({ slug, frontmatter }) => ({
      title: (frontmatter.title as string) || slug,
      href: fullPath(c.type, slug),
    }));
    return {
      type: c.type,
      title: c.title,
      description: c.description,
      href: c.href,
      examples,
      count: list.length,
      metaLabel: c.metaLabel,
    };
  });

  const proofItems = [
    { label: "전자책", value: String(booksRaw.length), description: "핵심 주제를 더 길고 체계적으로 정리한 전자책" },
    { label: "핵심 가이드", value: String(guidesRaw.length), description: "주제별로 먼저 읽어야 할 문서 중심 구조" },
    { label: "개념 사전", value: String(getAllByType("concepts").length), description: "학습과학 용어를 짧고 명료하게 설명하는 지식 인덱스" },
    { label: "부모 적용 자료", value: String(toolkitRaw.length), description: "실천 가능한 루틴과 체크리스트 제공" },
  ];

  const featuredGuides = guidesRaw.slice(0, 6).map(({ slug, frontmatter }) => {
    const { content } = getBySlug("guides", slug);
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
    return {
      slug,
      title: (frontmatter.title as string) || slug,
      description: (frontmatter.description as string) || "",
      href: fullPath("guides", slug),
      readingTimeMinutes: getReadingTimeMinutes(content),
      conceptTags: tags.slice(0, 5) as string[],
    };
  });
  const featuredGuide = featuredGuides[0] ?? null;
  const otherGuides = featuredGuides.slice(1);

  const conceptsForIndex = conceptsRaw.map(({ slug, frontmatter }) => ({
    slug,
    title: (frontmatter.title as string) || slug,
    description: (frontmatter.description as string) || "",
  }));

  const latestEssays = blogRaw.map(({ slug, frontmatter }) => {
    const { content } = getBySlug("blog", slug);
    return {
      slug,
      title: (frontmatter.title as string) || slug,
      description: (frontmatter.description as string) || "",
      href: fullPath("blog", slug),
      date: (frontmatter.datePublished ?? frontmatter.date) as string | undefined,
      readingTimeMinutes: getReadingTimeMinutes(content),
    };
  });

  const booksForShowcase = booksRaw.map(({ slug, frontmatter }) => ({
    slug,
    title: (frontmatter.title as string) || slug,
    description: (frontmatter.description as string) || "",
    audience: (frontmatter.audience as string) || "",
    coverImage: (frontmatter.coverImage as string) || undefined,
    stores: frontmatter.stores as Record<string, string> | undefined,
  }));

  return (
    <div className="px-6">
      <main className="mx-auto max-w-6xl space-y-0">
        <HeroSection />
        <KnowledgeMapSection cards={knowledgeMapCards} />
        <ProofStripSection items={proofItems} />
        <DomainsStrip getCount={(label) => getArchiveByCategory(label).length} />
        <FeaturedGuideSection featured={featuredGuide} others={otherGuides} />
        <ConceptsIndexSection concepts={conceptsForIndex} />
        <LatestEssaysSection essays={latestEssays} />
        <BooksShowcaseSection books={booksForShowcase} />
      </main>
    </div>
  );
}
