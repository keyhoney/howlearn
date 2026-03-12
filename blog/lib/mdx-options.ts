import remarkGfm from "remark-gfm";
import { remarkTransformImgUrl } from "@/lib/remark-transform-img-url";

/**
 * next-mdx-remote/rsc용 공통 mdxOptions.
 * - remark-gfm: 표·취소선 등 GFM (MarkdownRenderer와 정합)
 * - remarkTransformImgUrl: CDN/베이스 URL 결합
 * h2/h3 id는 mdx-components의 createHeading에서 부여하므로 rehype-slug와 중복하지 않음.
 */
export const sharedMdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkTransformImgUrl],
  },
};
