import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "쿠키 정책",
  description: "본 사이트의 쿠키 및 유사 기술 사용, 동의, 관리 방법에 대한 안내입니다.",
  noindex: true,
});

export default function CookiesPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        쿠키 정책
      </h1>

      <div className="prose prose-slate prose-lg max-w-none dark:prose-invert">
        <p className="text-slate-600 dark:text-slate-400">최종 수정: 2026년 3월</p>

        <p className="text-slate-600 dark:text-slate-300">
          본 쿠키 정책은 본 사이트가 쿠키 및 이와 유사한 기술을 어떻게 사용하는지, 이용자가 이를 어떻게 관리할 수 있는지 설명합니다.
          본 사이트를 계속 이용하는 경우, 관련 법령이 요구하는 범위 내에서 본 정책이 적용됩니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">1. 쿠키란 무엇인가</h2>
        <p className="text-slate-600 dark:text-slate-300">
          쿠키는 웹사이트가 이용자의 브라우저 또는 기기에 저장하는 작은 텍스트 파일입니다.
          본 사이트에서는 사이트의 기본 기능 유지, 이용 환경 개선(예: 테마 저장), 방문 통계 분석(예: Google Analytics), 그리고 광고·동의 관리를 도입한 경우 해당 목적으로 사용될 수 있습니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          본 정책에서 "쿠키"에는 문맥상 필요한 경우 localStorage, 픽셀, 태그, SDK 등 이와 유사한 기술이 포함될 수 있습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">2. 본 사이트가 사용하는 쿠키의 유형</h2>

        <h3 className="text-slate-900 dark:text-slate-100">2.1 필수 쿠키</h3>
        <p className="text-slate-600 dark:text-slate-300">
          필수 쿠키는 사이트의 핵심 기능 제공, 보안 유지, 네트워크 관리, 트래픽 라우팅, 동의 설정 저장 등 서비스 운영에 필요합니다.
          이러한 쿠키는 일반적으로 이용자의 별도 요청에 따라 제공되는 기능을 가능하게 하기 위해 사용되며, 비활성화할 경우 사이트의 일부 기능이 정상적으로 동작하지 않을 수 있습니다.
        </p>

        <h3 className="text-slate-900 dark:text-slate-100">2.2 기능/선호 쿠키</h3>
        <p className="text-slate-600 dark:text-slate-300">
          기능 또는 선호 쿠키는 언어, 화면 설정, 테마, 팝업 닫기 상태 등 이용자의 선택 사항을 기억하여 보다 일관된 이용 경험을 제공하기 위해 사용될 수 있습니다.
        </p>

        <h3 className="text-slate-900 dark:text-slate-100">2.3 분석 쿠키</h3>
        <p className="text-slate-600 dark:text-slate-300">
          분석 쿠키는 방문 수, 유입 경로, 페이지 체류, 이용 패턴 등 통계 정보를 수집하여 사이트 성능을 측정하고 콘텐츠를 개선하는 데 사용됩니다.
          본 사이트는 이러한 목적을 위해 Google Analytics 등 제3자 분석 도구를 사용할 수 있습니다.
        </p>

        <h3 className="text-slate-900 dark:text-slate-100">2.4 광고 및 타기팅 쿠키</h3>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 현재 방문 통계 분석을 주로 사용하며, 광고를 도입하는 경우 일부 지역·페이지에서 광고 제공, 성과 측정, 맞춤형 노출 등을 위해 광고·타기팅 쿠키를 사용할 수 있습니다.
          해당 쿠키는 적용 법령상 필요한 경우 사전 동의를 받은 후에만 활성화됩니다.
        </p>

        <h3 className="text-slate-900 dark:text-slate-100">2.5 동의 관리용 쿠키</h3>
        <p className="text-slate-600 dark:text-slate-300">
          광고·분석 등 선택적 쿠키를 사용하는 경우, 이용자의 쿠키 선택 상태를 저장하고 이후 방문 시 반영하기 위해 동의 관리 플랫폼(CMP) 관련 쿠키를 사용할 수 있습니다.
          이러한 쿠키는 이용자의 선택 기록 및 동의 철회 여부를 관리하기 위한 것입니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">3. 제3자 쿠키</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 방문 통계 분석(예: Google Analytics)을 사용하며, 광고·동의 관리를 도입하는 경우 해당 제3자 서비스를 사용할 수 있습니다.
          이 경우 Google Analytics, 호스팅·CDN(예: Vercel, Cloudflare), 광고 사업자, 동의 관리(CMP) 제공자 등 해당 제3자 서비스 제공자가 이용자의 기기에 직접 쿠키를 설정하거나 유사 기술을 사용할 수 있습니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          제3자 쿠키의 수집·이용 방식, 보관기간 및 처리 기준은 각 제3자 제공자의 정책에 따르며, 본 사이트는 제3자 시스템의 운영을 직접 통제하지 않습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">4. 쿠키 사용의 법적 근거 및 동의</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 관련 법령이 요구하는 경우, 필수 쿠키를 제외한 분석, 기능, 광고 및 타기팅 쿠키를 설정하기 전에 이용자의 동의를 받습니다.
          법령상 동의가 요구되지 않거나 예외가 인정되는 범위에서는 서비스 제공, 보안, 사기 방지, 설정 저장 등 정당한 운영 목적에 따라 일부 기술이 사용될 수 있습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">5. 쿠키 보관기간</h2>
        <p className="text-slate-600 dark:text-slate-300">
          쿠키는 브라우저가 종료되면 삭제되는 세션 쿠키와, 정해진 기간 동안 기기에 남는 영속 쿠키로 구분될 수 있습니다.
          각 쿠키의 구체적 만료기간은 브라우저 및 제공자 설정에 따라 달라질 수 있으며, 관련 서비스 제공자의 정책을 참고하시기 바랍니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">6. 쿠키 설정 및 철회 방법</h2>
        <p className="text-slate-600 dark:text-slate-300">
          이용자는 사이트 내 동의 배너·쿠키 설정 페이지에서 선택을 변경하거나, 브라우저 설정에서 쿠키를 허용·거부·삭제할 수 있습니다.
          브라우저에서의 쿠키 차단과 사이트 내 동의 설정은 서로 별개로 동작할 수 있으므로, 원하시는 수준에 맞게 둘 다 확인하시는 것이 좋습니다.
          이미 부여한 동의는 언제든지 철회하거나 변경할 수 있습니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          다만 필수 쿠키를 차단하거나 브라우저 수준에서 모든 쿠키를 비활성화하는 경우, 설정 저장, 동의 기록, 테마 등 선호 설정, 일부 콘텐츠 표시 등 사이트의 일부 기능이 제한될 수 있습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">7. 브라우저를 통한 관리</h2>
        <p className="text-slate-600 dark:text-slate-300">
          대부분의 브라우저는 쿠키 저장 여부를 확인하거나, 기존 쿠키를 삭제하거나, 특정 사이트의 쿠키를 차단할 수 있는 설정을 제공합니다.
          구체적인 방법은 이용 중인 브라우저 또는 기기 제조사의 안내를 확인하시기 바랍니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">8. 정책의 변경</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 법령, 서비스 구성, 사용 기술 또는 운영상 필요에 따라 본 쿠키 정책을 변경할 수 있습니다.
          중요한 변경이 있는 경우 본 페이지의 최종 수정일을 갱신하고, 필요한 경우 별도의 고지 방법을 사용할 수 있습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">9. 문의</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 쿠키 정책 또는 쿠키 사용에 관한 문의는{" "}
          <a
            href="/contact"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            문의하기
          </a>{" "}
          페이지를 이용해 주세요.
        </p>
      </div>
    </main>
  );
}
