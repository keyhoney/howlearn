import { getContentByType } from "@/lib/content";
import { ContentHub } from "@/components/shared/ContentHub";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "가이드",
  description: "학습과학의 핵심 개념을 체계적으로 정리한 에버그린 문서입니다.",
});

export default async function GuidesPage() {
  const content = await getContentByType("guide");
  return (
    <ContentHub 
      title="가이드" 
      description="학습과학의 핵심 개념을 체계적으로 정리한 에버그린 문서입니다." 
      content={content} 
      type="guide" 
    />
  );
}
