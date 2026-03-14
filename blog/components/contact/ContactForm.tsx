"use client";

import { useForm, ValidationError } from "@formspree/react";

const FORM_ID = "xkoqbyvv";

export function ContactForm() {
  const [state, handleSubmit] = useForm(FORM_ID);

  if (state.succeeded) {
    return (
      <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/20 p-6 sm:p-8 text-center">
        <p className="text-lg font-medium text-indigo-800 dark:text-indigo-200">
          문의가 접수되었습니다.
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          확인 후 이메일로 답변 드리겠습니다.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-6 sm:p-8"
    >
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          이메일
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-colors"
          placeholder="답변 받으실 이메일 주소"
        />
        <span className="mt-1 block text-sm text-red-600 dark:text-red-400">
          <ValidationError prefix="이메일" field="email" errors={state.errors} />
        </span>
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          문의 내용
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-colors resize-y min-h-[120px]"
          placeholder="문의하실 내용을 입력해 주세요."
        />
        <span className="mt-1 block text-sm text-red-600 dark:text-red-400">
          <ValidationError prefix="문의 내용" field="message" errors={state.errors} />
        </span>
      </div>
      <button
        type="submit"
        disabled={state.submitting}
        className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none transition-colors"
      >
        {state.submitting ? "전송 중…" : "전송"}
      </button>
    </form>
  );
}
