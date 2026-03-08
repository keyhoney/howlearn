import Link from "next/link";

export function Disclaimer() {
  return (
    <aside className="mt-14 border-t border-slate-200 dark:border-slate-700 pt-8" aria-label="면책 및 이용 안내">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
        면책 및 이용 안내
      </p>
      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        본 문서의 내용은 <strong>참고용 정보</strong>이며, 전문가의 진단·상담·치료를 대체하지 않습니다.
        학습·행동·정서에 관한 구체적인 우려가 있으시면 자격을 갖춘 전문가와 상담하시기 바랍니다.
      </p>
    </aside>
  );
}
