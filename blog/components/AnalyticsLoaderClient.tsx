"use client";

import dynamic from "next/dynamic";

const AnalyticsLoader = dynamic(
  () => import("@/components/AnalyticsLoader").then((m) => ({ default: m.AnalyticsLoader })),
  { ssr: false }
);

export function AnalyticsLoaderClient() {
  return <AnalyticsLoader />;
}
