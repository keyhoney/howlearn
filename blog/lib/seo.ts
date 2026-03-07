import { Metadata } from "next";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "book";
  lang?: string;
}

const siteName = "Learning Science Knowledge Archive";
const defaultDescription = "A knowledge archive for learning science-based parenting education, featuring guides, concepts, toolkits, blogs, and books.";

export function constructMetadata({
  title,
  description = defaultDescription,
  image = "https://picsum.photos/seed/learning/1200/630",
  url = process.env.APP_URL || "http://localhost:3000",
  type = "website",
  lang,
}: SeoProps = {}): Metadata {
  return {
    title: title ? `${title} | ${siteName}` : siteName,
    description,
    ...(lang && { other: { "content-language": lang } }),
    openGraph: {
      title: title ? `${title} | ${siteName}` : siteName,
      description,
      type,
      url,
      ...(lang && { locale: lang }),
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${siteName}` : siteName,
      description,
      images: [image],
    },
    metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  };
}
