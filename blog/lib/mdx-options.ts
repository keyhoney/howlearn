import { remarkTransformImgUrl } from "@/lib/remark-transform-img-url";

/**
 * next-mdx-remote/rsc용 공통 mdxOptions.
 * 이미지 URL을 NEXT_PUBLIC_IMAGE_BASE_URL과 결합하기 위해 remark 플러그인을 사용합니다.
 */
export const sharedMdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkTransformImgUrl],
  },
};
