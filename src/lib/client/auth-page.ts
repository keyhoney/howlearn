import {
  consumeGoogleRedirectResult,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  watchAuthState,
} from './firebase-auth';

function setMessage(root: HTMLElement, message: string, tone: 'info' | 'error' | 'success' = 'info'): void {
  const el = root.querySelector<HTMLElement>('[data-auth-message]');
  if (!el) return;
  el.textContent = message;
  el.className =
    tone === 'error'
      ? 'app-feedback app-feedback-danger mt-3'
      : tone === 'success'
        ? 'app-feedback app-feedback-success mt-3'
        : 'app-feedback app-feedback-info mt-3';
}

function setBusy(root: HTMLElement, busy: boolean): void {
  root.querySelectorAll<HTMLButtonElement>('button').forEach((btn) => {
    btn.disabled = busy;
  });
}

function normalizeError(error: unknown): string {
  const code = String((error as { code?: string })?.code || '');
  const message = String((error as { message?: string })?.message || '');
  if (message.includes('auth/not-configured')) {
    return 'Firebase 인증 설정이 비어 있습니다. `.env`에 PUBLIC_FIREBASE_* 값을 채워주세요.';
  }
  if (code.includes('operation-not-allowed')) {
    return 'Firebase Console에서 해당 로그인 방식이 비활성화되어 있습니다.';
  }
  if (code.includes('popup-blocked')) {
    return '브라우저 팝업 차단으로 구글 로그인이 중단되었습니다. 팝업 허용 후 다시 시도해 주세요.';
  }
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
    return '이메일 또는 비밀번호를 확인해 주세요.';
  }
  if (code.includes('email-already-in-use')) {
    return '이미 사용 중인 이메일입니다.';
  }
  if (code.includes('weak-password')) {
    return '비밀번호는 6자 이상으로 입력해 주세요.';
  }
  if (code.includes('popup-closed-by-user')) {
    return '구글 로그인 창이 닫혔습니다. 다시 시도해 주세요.';
  }
  return '로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
}

function initAuthPage(root: HTMLElement): void {
  const mode = root.getAttribute('data-auth-mode') === 'signup' ? 'signup' : 'login';
  const emailInput = root.querySelector<HTMLInputElement>('[data-auth-email]');
  const passwordInput = root.querySelector<HTMLInputElement>('[data-auth-password]');
  const passwordConfirmInput = root.querySelector<HTMLInputElement>('[data-auth-password-confirm]');
  const emailBtn = root.querySelector<HTMLButtonElement>('[data-auth-email-submit]');
  const googleBtn = root.querySelector<HTMLButtonElement>('[data-auth-google]');

  watchAuthState((user) => {
    if (!user) return;
    setMessage(
      root,
      `로그인 상태: ${user.email || user.displayName || '계정 사용자'}`,
      'success',
    );
  });

  void consumeGoogleRedirectResult()
    .then((user) => {
      if (!user) return;
      setMessage(root, '구글 계정으로 로그인되었습니다.', 'success');
      window.setTimeout(() => {
        window.location.href = '/dashboard';
      }, 250);
    })
    .catch(() => {});

  emailBtn?.addEventListener('click', async () => {
    const email = String(emailInput?.value || '').trim();
    const password = String(passwordInput?.value || '');
    const passwordConfirm = String(passwordConfirmInput?.value || '');
    if (!email || !password) {
      setMessage(root, '이메일과 비밀번호를 입력해 주세요.', 'error');
      return;
    }
    if (mode === 'signup' && password !== passwordConfirm) {
      setMessage(root, '비밀번호와 비밀번호 확인이 일치하지 않습니다.', 'error');
      return;
    }
    setBusy(root, true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password);
        setMessage(root, '회원가입이 완료되었습니다. 로그인 상태로 전환되었습니다.', 'success');
      } else {
        await signInWithEmail(email, password);
        setMessage(root, '로그인되었습니다.', 'success');
      }
      window.setTimeout(() => {
        window.location.href = '/dashboard';
      }, 350);
    } catch (error) {
      setMessage(root, normalizeError(error), 'error');
    } finally {
      setBusy(root, false);
    }
  });

  googleBtn?.addEventListener('click', async () => {
    setBusy(root, true);
    try {
      await signInWithGoogle();
      setMessage(root, '구글 계정으로 로그인되었습니다.', 'success');
      window.setTimeout(() => {
        window.location.href = '/dashboard';
      }, 250);
    } catch (error) {
      setMessage(root, normalizeError(error), 'error');
    } finally {
      setBusy(root, false);
    }
  });

}

document.querySelectorAll<HTMLElement>('[data-auth-page]').forEach((root) => {
  initAuthPage(root);
});
