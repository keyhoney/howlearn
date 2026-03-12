"use client";

import { SlugRouteError } from "@/components/shared/SlugRouteError";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SlugRouteError reset={reset} />;
}
