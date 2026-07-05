import fs from 'node:fs/promises';
import path from 'node:path';

const OUTPUT = path.join(process.cwd(), 'public', 'ads.txt');

async function main() {
  const publisherId = String(process.env.PUBLIC_ADSENSE_PUBLISHER_ID || '').trim();
  const isPagesBuild = process.env.CF_PAGES === '1';

  if (!publisherId) {
    if (isPagesBuild) {
      console.error('sync-ads-txt failed: PUBLIC_ADSENSE_PUBLISHER_ID is required on Cloudflare Pages');
      process.exit(1);
    }
    console.log('sync-ads-txt skipped: PUBLIC_ADSENSE_PUBLISHER_ID not set (local build)');
    return;
  }
  if (!/^pub-\d+$/i.test(publisherId)) {
    console.error('sync-ads-txt failed: PUBLIC_ADSENSE_PUBLISHER_ID must look like pub-XXXXXXXXXXXXXXXX');
    process.exit(1);
  }

  const body = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;
  await fs.writeFile(OUTPUT, body, 'utf8');
  console.log(`ads.txt synced: ${OUTPUT}`);
}

main().catch((error) => {
  console.error('sync-ads-txt failed');
  console.error(error);
  process.exit(1);
});
