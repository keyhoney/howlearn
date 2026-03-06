"use client";

import type { MDXComponents } from "mdx/types";
import { mdxServerComponents } from "@/lib/mdx-components";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxServerComponents,
    ...components,
  };
}
