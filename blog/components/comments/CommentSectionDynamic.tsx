"use client";

import dynamic from "next/dynamic";

const CommentSection = dynamic(
  () => import("./CommentSection").then((m) => ({ default: m.CommentSection })),
  { ssr: false }
);

interface CommentSectionDynamicProps {
  path: string;
}

export function CommentSectionDynamic({ path }: CommentSectionDynamicProps) {
  return <CommentSection path={path} />;
}
