import {
  appendWrongEntry,
  getProgressDetail,
  readProgressStore,
  writeProgressStore,
} from './problem-state';

function initProblemInteraction(root: Element): void {
  const problemId = root.getAttribute('data-problem-id') || '';
  const answerType = root.getAttribute('data-answer-type') || 'short';
  const answer = root.getAttribute('data-answer') || '';
  const progressKey = root.getAttribute('data-progress-key') || 'howlearn-problem-progress';
  const wrongKey = root.getAttribute('data-wrong-note-key') || 'howlearn-wrong-note';

  const resultEl = root.querySelector<HTMLElement>('[data-answer-result]');
  const wrongNoteLink = root.querySelector<HTMLElement>('[data-go-wrong-note]');
  const revealHintBtn = root.querySelector<HTMLButtonElement>('[data-reveal-hint]');
  const revealSolutionBtn = root.querySelector<HTMLButtonElement>('[data-reveal-solution]');
  const solutionEl = root.querySelector<HTMLElement>('[data-solution]');
  const hintEls = Array.from(root.querySelectorAll<HTMLElement>('[data-hint-step]'));
  const mcqRadios = Array.from(root.querySelectorAll<HTMLInputElement>('input[data-answer-choice]'));

  const persist = (
    patch: Partial<{
      status: 'none' | 'progress' | 'done';
      hintRevealedCount: number;
      solutionRevealed: boolean;
      lastAnswer: string;
      attemptCount: number;
      lastSeenAt: number;
    }>,
  ) => {
    const store = readProgressStore(progressKey);
    const prev = getProgressDetail(store, problemId);
    store.byId[problemId] = {
      ...prev,
      ...patch,
      lastSeenAt: patch.lastSeenAt ?? Date.now(),
    };
    writeProgressStore(progressKey, store);
  };

  let revealedHintCount = 0;
  const restore = getProgressDetail(readProgressStore(progressKey), problemId);
  const initialHintCount = Math.max(restore.hintRevealedCount || 0, 0);
  revealedHintCount = Math.min(initialHintCount, hintEls.length);
  hintEls.forEach((el, idx) => {
    const content = el.querySelector<HTMLElement>('[data-hint-content]');
    const label = el.querySelector<HTMLElement>('[data-hint-toggle] span');
    const visible = idx < revealedHintCount;
    el.classList.toggle('hidden', !visible);
    if (content) content.classList.toggle('hidden', !visible);
    if (label) label.textContent = visible ? '접기' : '펼치기';
  });
  const showResult = (message: string, tone: 'warning' | 'success' | 'danger') => {
    if (!resultEl) return;
    resultEl.classList.remove('hidden');
    resultEl.textContent = message;
    resultEl.className = `app-feedback app-feedback-${tone} motion-fade-in`;
  };

  const revealNextHint = () => {
    if (revealedHintCount >= hintEls.length) return;
    const target = hintEls[revealedHintCount];
    target?.classList.remove('hidden');
    const content = target?.querySelector<HTMLElement>('[data-hint-content]');
    if (content) {
      content.classList.remove('hidden');
      content.classList.add('motion-hint-expand');
    }
    const toggleLabel = target?.querySelector<HTMLElement>('[data-hint-toggle] span');
    if (toggleLabel) toggleLabel.textContent = '접기';
    revealedHintCount += 1;
    persist({ hintRevealedCount: revealedHintCount, status: 'progress' });
  };

  const checkAnswer = (userValue: string) => {
    if (!userValue) {
      showResult('답을 입력(선택)해 주세요.', 'warning');
      return;
    }

    const isCorrect = String(Number(userValue)) === String(Number(answer));
    showResult(isCorrect ? '정답입니다.' : '오답입니다. 힌트를 확인해 보세요.', isCorrect ? 'success' : 'danger');
    wrongNoteLink?.classList.toggle('hidden', isCorrect);
    const latest = getProgressDetail(readProgressStore(progressKey), problemId);
    persist({
      status: isCorrect ? 'done' : 'progress',
      lastAnswer: userValue,
      attemptCount: latest.attemptCount + 1,
      hintRevealedCount: revealedHintCount,
    });

    if (!isCorrect) {
      appendWrongEntry(
        wrongKey,
        problemId,
        answerType === 'mcq' ? { t: 'mcq', choice: Number(userValue) || 0, ts: Date.now() } : { t: 'short', value: userValue, ts: Date.now() },
      );
      revealNextHint();
    }
  };

  mcqRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      root.querySelectorAll('.choice-item').forEach((item) => item.classList.remove('app-choice-active'));
      radio.closest('.choice-item')?.classList.add('app-choice-active');
      checkAnswer(radio.value);
    });
  });

  root.querySelector('[data-check-answer]')?.addEventListener('click', () => {
    if (answerType === 'mcq') return;
    const userValue = (root.querySelector<HTMLInputElement>('[data-answer-short]')?.value || '').trim();
    checkAnswer(userValue);
  });

  revealHintBtn?.addEventListener('click', revealNextHint);
  root.querySelectorAll<HTMLElement>('[data-hint-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('[data-hint-step]');
      const content = item?.querySelector<HTMLElement>('[data-hint-content]');
      if (!content) return;
      const willHide = !content.classList.contains('hidden');
      content.classList.toggle('hidden');
      if (!willHide) content.classList.add('motion-hint-expand');
      const label = btn.querySelector('span');
      if (label) label.textContent = content.classList.contains('hidden') ? '펼치기' : '접기';
    });
  });

  revealSolutionBtn?.addEventListener('click', () => {
    if (!solutionEl) return;
    const isHidden = solutionEl.classList.contains('hidden');
    if (isHidden) {
      solutionEl.classList.remove('hidden');
      solutionEl.classList.add('motion-block-reveal');
      revealSolutionBtn.textContent = '풀이 닫기';
      persist({ status: 'done', hintRevealedCount: revealedHintCount });
      return;
    }

    solutionEl.classList.add('hidden');
    revealSolutionBtn.textContent = '풀이 공개';
  });

  persist({ hintRevealedCount: revealedHintCount });
}

document.querySelectorAll('[data-problem-interaction]').forEach((root) => {
  initProblemInteraction(root);
});
