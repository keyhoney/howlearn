import { getContentByType } from "@/lib/content";
import { ContentHub } from "@/components/shared/ContentHub";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "블로그",
  description: "학습과학 연구를 일상과 교육 현장에 적용하는 인사이트 칼럼입니다.",
});

export default async function BlogPage() {
  const content = await getContentByType("blog");
  return (
    <ContentHub 
      title="블로그" 
      description="학습과학 연구를 일상과 교육 현장에 적용하는 인사이트 칼럼입니다." 
      content={content} 
      type="blog" 
    />
  );
}
