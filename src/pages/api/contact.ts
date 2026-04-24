import type { APIRoute } from 'astro';

interface ContactPayload {
  type?: string;
  email?: string;
  message?: string;
}

export const POST: APIRoute = async ({ request }) => {
  const formId = String(import.meta.env.FORMSPREE_FORM_ID || '').trim();
  if (!formId) {
    return new Response(
      JSON.stringify({ ok: false, error: '서버 설정이 누락되었습니다. 관리자에게 문의해 주세요.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    const body = (await request.json()) as ContactPayload;
    const type = String(body.type || '').trim();
    const email = String(body.email || '').trim();
    const message = String(body.message || '').trim();

    if (!type || !email || !message) {
      return new Response(
        JSON.stringify({ ok: false, error: '필수 항목을 모두 입력해 주세요.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (!email.includes('@')) {
      return new Response(
        JSON.stringify({ ok: false, error: '이메일 형식이 올바르지 않습니다.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (message.length < 10) {
      return new Response(
        JSON.stringify({ ok: false, error: '문의 내용은 10자 이상 입력해 주세요.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ type, email, message }),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ ok: false, error: '문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: '서버 처리 중 오류가 발생했습니다.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
