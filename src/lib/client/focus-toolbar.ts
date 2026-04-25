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
  document.body.style.overflow = '';
}

document.querySelectorAll<HTMLElement>('[data-focus-toolbar]').forEach((root) => {
  const focusKey = root.getAttribute('data-focus-key') || 'howlearn-focus-state';
  const focusHistoryKey = root.getAttribute('data-focus-history-key') || 'howlearn-focus-history';
  const bookmarkKey = root.getAttribute('data-bookmark-key') || 'howlearn-bookmark';
  const problemId = root.getAttribute('data-problem-id') || '';
  const timerEl = root.querySelector<HTMLElement>('[data-focus-timer]');
  const bookmarkBtn = root.querySelector<HTMLButtonElement>('[data-bookmark-toggle]');
  const toggleBtn = root.querySelector<HTMLButtonElement>('[data-focus-toggle]');
  const toggleLabel = root.querySelector<HTMLElement>('[data-focus-toggle-label]');
  const statusEl = root.querySelector<HTMLElement>('[data-focus-status]');
  const optionalEls = Array.from(root.querySelectorAll<HTMLElement>('.exam-focus-optional'));
  const idleOnlyEls = Array.from(root.querySelectorAll<HTMLElement>('.exam-focus-idle-only'));
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

  const toDateKey = (ts: number) => {
    const d = new Date(ts);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const pushFocusHistory = (deltaMs: number) => {
    if (!Number.isFinite(deltaMs) || deltaMs <= 0) return;
    const safeDelta = Math.max(0, Math.floor(deltaMs));
    const raw = parse(localStorage.getItem(focusHistoryKey), { v: 1, byDate: {} as Record<string, number> });
    const byDate = raw.byDate || {};
    const key = toDateKey(Date.now());
    byDate[key] = (byDate[key] || 0) + safeDelta;
    localStorage.setItem(focusHistoryKey, JSON.stringify({ v: 1, byDate }));
  };

  const refreshBookmark = () => {
    const bookmarks = parse(localStorage.getItem(bookmarkKey), { v: 1, byId: {} as Record<string, unknown> });
    const active = Boolean(bookmarks.byId?.[problemId]);
    if (bookmarkBtn) {
      const text = bookmarkBtn.querySelector('span');
      if (text) text.textContent = active ? '스크랩됨' : '스크랩';
      bookmarkBtn.classList.toggle('is-active', active);
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
      statusEl.className = 'exam-focus-status';
    }
    startBtn?.toggleAttribute('disabled', status === 'running' || status === 'paused');
    pauseBtn?.toggleAttribute('disabled', status !== 'running');
    resumeBtn?.toggleAttribute('disabled', status !== 'paused');
    stopBtn?.toggleAttribute('disabled', status === 'idle');
    pauseBtn?.classList.toggle('is-visible', status === 'running');
    resumeBtn?.classList.toggle('is-visible', status === 'paused');
    stopBtn?.classList.toggle('is-visible', status === 'running' || status === 'paused');
    const active = status === 'running' || status === 'paused';
    idleOnlyEls.forEach((el) => el.classList.toggle('is-hidden', active));
    optionalEls.forEach((el) => {
      const isToggleButton =
        el.hasAttribute('data-focus-pause') || el.hasAttribute('data-focus-resume') || el.hasAttribute('data-focus-stop');
      if (isToggleButton) return;
      el.classList.toggle('is-visible', active);
    });
    if (toggleBtn) {
      if (toggleLabel) toggleLabel.textContent = active ? '집중 모드 켜짐' : '집중 모드 켜기';
      toggleBtn.classList.toggle('is-active', active);
    }
  };

  startBtn?.addEventListener('click', () => {
    saveState({ status: 'running', elapsedMs: 0, startedAt: Date.now(), targetMs: null });
    refreshToolbarState();
  });

  pauseBtn?.addEventListener('click', () => {
    const state = getState();
    if (state.status !== 'running' || !state.startedAt) return;
    const elapsed = getElapsed(state);
    pushFocusHistory(elapsed - (state.elapsedMs || 0));
    saveState({ ...state, status: 'paused', elapsedMs: elapsed, startedAt: null });
    refreshToolbarState();
  });

  resumeBtn?.addEventListener('click', () => {
    const state = getState();
    if (state.status !== 'paused') return;
    saveState({ ...state, status: 'running', startedAt: Date.now() });
    refreshToolbarState();
  });

  stopBtn?.addEventListener('click', () => {
    const state = getState();
    if (state.status === 'running' && state.startedAt) {
      pushFocusHistory(getElapsed(state) - (state.elapsedMs || 0));
    }
    saveState({ status: 'finished', elapsedMs: 0, startedAt: null, targetMs: null });
    refreshToolbarState();
  });
  toggleBtn?.addEventListener('click', () => {
    const state = getState();
    const active = state.status === 'running' || state.status === 'paused';
    if (active) {
      if (state.status === 'running' && state.startedAt) {
        pushFocusHistory(getElapsed(state) - (state.elapsedMs || 0));
      }
      saveState({ status: 'finished', elapsedMs: 0, startedAt: null, targetMs: null });
    } else {
      saveState({ status: 'running', elapsedMs: 0, startedAt: Date.now(), targetMs: null });
    }
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
