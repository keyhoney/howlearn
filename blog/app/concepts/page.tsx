import { getContentByType } from "@/lib/content";
import { ContentHub } from "@/components/shared/ContentHub";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "개념 사전",
  description: "학습과학과 심리학에서 자주 쓰이는 핵심 용어들의 명확한 정의와 맥락을 제공합니다.",
});

export default async function ConceptsPage() {
  const content = await getContentByType("concept");
  return (
    <ContentHub 
      title="개념 사전" 
      description="학습과학과 심리학에서 자주 쓰이는 핵심 용어들의 명확한 정의와 맥락을 제공합니다." 
      content={content} 
      type="concept" 
    />
  );
}
