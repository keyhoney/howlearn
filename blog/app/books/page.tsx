import { getContentByType } from "@/lib/content";
import { ContentHub } from "@/components/shared/ContentHub";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "전자책",
  description: "특정 주제를 깊이 있게 다루는 종합 가이드북과 전자책입니다.",
  path: "/books",
});

export default async function BooksPage() {
  const content = await getContentByType("book");
  return (
    <ContentHub 
      title="전자책" 
      description="특정 주제를 깊이 있게 다루는 종합 가이드북과 전자책입니다." 
      content={content} 
      type="book" 
    />
  );
}
