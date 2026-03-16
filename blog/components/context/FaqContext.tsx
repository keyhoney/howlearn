"use client";

import { createContext, useContext } from "react";
import type { FaqItem } from "@/lib/types";

const FaqContext = createContext<FaqItem[] | null>(null);

export function FaqProvider({
  faq,
  children,
}: {
  faq: FaqItem[] | null | undefined;
  children: React.ReactNode;
}) {
  return (
    <FaqContext.Provider value={faq ?? null}>
      {children}
    </FaqContext.Provider>
  );
}

export function useFaqFromContext(): FaqItem[] | null {
  return useContext(FaqContext);
}
