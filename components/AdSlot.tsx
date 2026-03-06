"use client";

/**
 * 애드센스 광고 슬롯. 글 본문 내 "첫 H2 이후 / 중간 / 하단" 등에 삽입.
 * data-ad-slot은 애드센스에서 발급한 슬롯 ID로 교체.
 */
export function AdSlot({ slotId, format = "auto", className }: { slotId?: string; format?: "auto" | "rectangle" | "horizontal" | "vertical"; className?: string }) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!clientId) return null;

  return (
    <div className={`my-8 min-h-[100px] ${className ?? ""}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId ?? ""}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
