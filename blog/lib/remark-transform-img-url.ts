import { toImageUrl } from "@/lib/image-url";
import { visit } from "unist-util-visit";

/**
 * remark 플러그인: 마크다운 이미지 노드의 url을 toImageUrl()로 변환합니다.
 * NEXT_PUBLIC_IMAGE_BASE_URL과 결합해 CDN/별도 호스팅 경로로 요청되도록 합니다.
 * (next-mdx-remote에서 마크다운 이미지에 커스텀 img 컴포넌트가 적용되지 않는 경우 대비)
 */
export function remarkTransformImgUrl() {
  return (tree: Parameters<typeof visit>[0]) => {
    visit(tree, "image", (node: { url?: string }) => {
      if (typeof node.url === "string") {
        node.url = toImageUrl(node.url);
      }
    });
  };
}
