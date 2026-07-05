/** pub-XXXXXXXX → ca-pub-XXXXXXXX (AdSense 스크립트 client 파라미터) */
export function toAdSenseClientId(publisherId: string): string | null {
  const id = publisherId.trim();
  if (!id) return null;
  if (/^ca-pub-\d+$/i.test(id)) return id;
  if (/^pub-\d+$/i.test(id)) return `ca-${id}`;
  return null;
}

export function getAdSenseClientIdFromEnv(): string | null {
  return toAdSenseClientId(String(import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID || ''));
}
