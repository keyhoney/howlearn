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
  hintEls.forEach((el, idx) => {
    const content = el.querySelector<HTMLElement>('[data-hint-content]');
    const visible = idx < revealedHintCount;
    if (content) content.classList.toggle('hidden', !visible);
  });
  const showResult = (message: string, tone: 'warning' | 'success' | 'danger') => {
    if (!resultEl) return;
    resultEl.classList.remove('hidden');
    resultEl.textContent = message;
    resultEl.className = `app-feedback app-feedback-${tone} motion-fade-in`;
  };

  const revealNextHint = () => {
    if (revealedHintCount >= hintEls.length) return;
    const target = hintEls.find((el) => {
      const content = el.querySelector<HTMLElement>('[data-hint-content]');
      return Boolean(content?.classList.contains('hidden'));
    });
    if (!target) return;
    const content = target?.querySelector<HTMLElement>('[data-hint-content]');
    if (content) {
      content.classList.remove('hidden');
      content.classList.add('motion-hint-expand');
    }
    revealedHintCount += 1;
    persist({ status: 'progress' });
    if (revealHintBtn && revealedHintCount >= hintEls.length) {
      revealHintBtn.disabled = true;
      revealHintBtn.textContent = '힌트 모두 공개됨';
    }
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
    });

    if (!isCorrect) {
      appendWrongEntry(
        wrongKey,
        problemId,
        answerType === 'mcq' ? { t: 'mcq', choice: Number(userValue) || 0, ts: Date.now() } : { t: 'short', value: userValue, ts: Date.now() },
      );
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
  revealSolutionBtn?.addEventListener('click', () => {
    if (!solutionEl) return;
    const isHidden = solutionEl.classList.contains('hidden');
    if (isHidden) {
      solutionEl.classList.remove('hidden');
      solutionEl.classList.add('motion-block-reveal');
      revealSolutionBtn.textContent = '풀이 닫기';
      persist({ status: 'done' });
      return;
    }

    solutionEl.classList.add('hidden');
    revealSolutionBtn.textContent = '풀이 공개';
  });

  if (revealHintBtn && hintEls.length === 0) {
    revealHintBtn.disabled = true;
  }

}

document.querySelectorAll('[data-problem-interaction]').forEach((root) => {
  initProblemInteraction(root);
});
