function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function fmt(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const ss = String(totalSec % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function applyFocusUi(active: boolean): void {
  document.body.classList.toggle('focus-mode', active);
  document.body.style.overflow = active ? 'hidden' : '';
  const problemCard = document.querySelector<HTMLElement>('[data-problem-card-root]');
  if (active && problemCard) {
    problemCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

document.querySelectorAll<HTMLElement>('[data-focus-toolbar]').forEach((root) => {
  const focusKey = root.getAttribute('data-focus-key') || 'howlearn-focus-state';
  const bookmarkKey = root.getAttribute('data-bookmark-key') || 'howlearn-bookmark';
  const problemId = root.getAttribute('data-problem-id') || '';
  const timerEl = root.querySelector<HTMLElement>('[data-focus-timer]');
  const bookmarkBtn = root.querySelector<HTMLButtonElement>('[data-bookmark-toggle]');
  const statusEl = root.querySelector<HTMLElement>('[data-focus-status]');
  const startBtn = root.querySelector<HTMLButtonElement>('[data-focus-start]');
  const pauseBtn = root.querySelector<HTMLButtonElement>('[data-focus-pause]');
  const resumeBtn = root.querySelector<HTMLButtonElement>('[data-focus-resume]');
  const stopBtn = root.querySelector<HTMLButtonElement>('[data-focus-stop]');

  const getState = () =>
    parse(localStorage.getItem(focusKey), {
      v: 1,
      status: 'idle',
      elapsedMs: 0,
      startedAt: null,
      targetMs: null,
    });

  const saveState = (state: Record<string, unknown>) => {
    localStorage.setItem(focusKey, JSON.stringify({ ...state, v: 1 }));
    const s = getState();
    applyFocusUi(s.status === 'running' || s.status === 'paused');
  };

  const getElapsed = (state: { status: string; elapsedMs?: number; startedAt?: number | null }) => {
    if (state.status === 'running' && state.startedAt) {
      return (state.elapsedMs || 0) + (Date.now() - state.startedAt);
    }
    return state.elapsedMs || 0;
  };

  const refreshBookmark = () => {
    const bookmarks = parse(localStorage.getItem(bookmarkKey), { v: 1, byId: {} as Record<string, unknown> });
    const active = Boolean(bookmarks.byId?.[problemId]);
    if (bookmarkBtn) {
      bookmarkBtn.textContent = active ? '스크랩 해제' : '스크랩';
      bookmarkBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  };

  const refreshToolbarState = () => {
    const state = getState();
    const status = state.status || 'idle';
    if (statusEl) {
      const statusText =
        status === 'running' ? '진행 중' : status === 'paused' ? '일시정지' : status === 'finished' ? '완료' : '대기';
      statusEl.textContent = statusText;
      statusEl.className =
        status === 'running'
          ? 'app-badge app-badge-success ml-auto'
          : status === 'paused'
            ? 'app-badge app-badge-warning ml-auto'
            : status === 'finished'
              ? 'app-badge app-badge-info ml-auto'
              : 'app-badge app-badge-neutral ml-auto';
    }
    startBtn?.toggleAttribute('disabled', status === 'running' || status === 'paused');
    pauseBtn?.toggleAttribute('disabled', status !== 'running');
    resumeBtn?.toggleAttribute('disabled', status !== 'paused');
    stopBtn?.toggleAttribute('disabled', status === 'idle');
  };

  startBtn?.addEventListener('click', () => {
    saveState({ status: 'running', elapsedMs: 0, startedAt: Date.now(), targetMs: null });
    refreshToolbarState();
  });

  pauseBtn?.addEventListener('click', () => {
    const state = getState();
    if (state.status !== 'running' || !state.startedAt) return;
    saveState({ ...state, status: 'paused', elapsedMs: getElapsed(state), startedAt: null });
    refreshToolbarState();
  });

  resumeBtn?.addEventListener('click', () => {
    const state = getState();
    if (state.status !== 'paused') return;
    saveState({ ...state, status: 'running', startedAt: Date.now() });
    refreshToolbarState();
  });

  stopBtn?.addEventListener('click', () => {
    saveState({ status: 'finished', elapsedMs: 0, startedAt: null, targetMs: null });
    refreshToolbarState();
  });

  bookmarkBtn?.addEventListener('click', () => {
    const bookmarks = parse(localStorage.getItem(bookmarkKey), { v: 1, byId: {} as Record<string, { ts: number }> });
    bookmarks.byId = bookmarks.byId || {};
    if (bookmarks.byId[problemId]) delete bookmarks.byId[problemId];
    else bookmarks.byId[problemId] = { ts: Date.now() };
    localStorage.setItem(bookmarkKey, JSON.stringify({ v: 1, byId: bookmarks.byId }));
    refreshBookmark();
  });

  refreshBookmark();
  const state = getState();
  applyFocusUi(state.status === 'running' || state.status === 'paused');
  refreshToolbarState();
  setInterval(() => {
    const current = getState();
    if (timerEl) timerEl.textContent = fmt(getElapsed(current));
    if (current.status === 'running' || current.status === 'paused') refreshToolbarState();
  }, 500);
});
