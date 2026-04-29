import { ensureAnonymousUid } from './firebase-auth';

function parseAllowlist(value: string): string[] {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

async function initFooterAdminLinks(): Promise<void> {
  const footer = document.querySelector<HTMLElement>('#app-site-footer');
  if (!footer) return;
  const allowlist = parseAllowlist(footer.dataset.adminUidAllowlist || '');
  const adminOnlyEls = Array.from(document.querySelectorAll<HTMLElement>('[data-admin-only-link]'));
  if (allowlist.length === 0 || adminOnlyEls.length === 0) return;
  try {
    const uid = await ensureAnonymousUid();
    const allowed = Boolean(uid) && allowlist.includes(uid);
    adminOnlyEls.forEach((el) => el.classList.toggle('hidden', !allowed));
  } catch {
    adminOnlyEls.forEach((el) => el.classList.add('hidden'));
  }
}

void initFooterAdminLinks();
