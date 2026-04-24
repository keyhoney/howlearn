import type { MiddlewareHandler } from 'astro';

const REQUIRED_CLOUDFLARE_BINDINGS = ['IMAGES', 'SESSION'] as const;

export const onRequest: MiddlewareHandler = async (context, next) => {
  const runtimeEnv = (
    context.locals as {
      runtime?: { env?: Record<string, unknown> };
    }
  ).runtime?.env;

  if (!runtimeEnv) {
    return next();
  }

  const missing = REQUIRED_CLOUDFLARE_BINDINGS.filter((name) => !(name in runtimeEnv));
  if (missing.length === 0) {
    return next();
  }

  return new Response(
    `Cloudflare binding missing: ${missing.join(', ')}. Check Pages project bindings.`,
    {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    },
  );
};
