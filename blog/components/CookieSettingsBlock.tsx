"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent, type ConsentState } from "@/lib/consent";

const ID_SETTINGS = "settings";

export function CookieSettingsBlock() {
  const [state, setState] = useState<ConsentState>({ analytics: false, advertising: false });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const c = getConsent();
    const next = c ?? { analytics: false, advertising: false };
    const id = setTimeout(() => setState(next), 0);
    return () => clearTimeout(id);
  }, []);

  const handleSave = () => {
    setConsent(state);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    if (typeof window !== "undefined" && state.analytics) {
      window.dispatchEvent(new CustomEvent("consent-update", { detail: { analytics: true } }));
    }
  };

  return (
    <section id={ID_SETTINGS} className="scroll-mt-6 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
        쿠키 설정 (선택 사항)
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        아래에서 분석·광고용 쿠키 사용 여부를 선택할 수 있습니다. 필수 쿠키는 서비스 제공에 필요하여 비활성화할 수 없습니다.
      </p>

      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={state.analytics}
            onChange={(e) => setState((s) => ({ ...s, analytics: e.target.checked }))}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            <strong>분석 쿠키</strong> — 방문 통계, 이용 패턴 분석(예: Google Analytics)에 사용됩니다. 비활성화해도 사이트 이용에는 지장이 없습니다.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={state.advertising}
            onChange={(e) => setState((s) => ({ ...s, advertising: e.target.checked }))}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            <strong>광고 쿠키</strong> — 맞춤형 광고 표시·성과 측정에 사용됩니다. Google AdSense 게재 시 적용되며, EEA·영국·스위스 등 법령상 동의가 필요한 지역에서는 이 선택에 따라 맞춤형 광고가 표시됩니다.
          </span>
        </label>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          선택 저장
        </button>
        {saved && (
          <span className="text-sm text-green-600 dark:text-green-400" role="status">
            저장되었습니다. 변경 사항이 반영됩니다.
          </span>
        )}
      </div>
    </section>
  );
}
