import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "개인정보처리방침",
  description: "HowLearn의 개인정보 수집·이용, 보관, 보호 및 이용자 권리에 관한 안내입니다.",
  path: "/privacy",
  noindex: true,
});

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        개인정보처리방침
      </h1>

      <div className="prose prose-slate prose-lg max-w-none dark:prose-invert">
        <p className="text-slate-600 dark:text-slate-400">최종 수정: 2026년 3월</p>

        <p className="text-slate-600 dark:text-slate-300">
          HowLearn(이하 &quot;본 사이트&quot;)는 이용자의 개인정보를 중요하게 생각하며,
          관련 법령에 따라 개인정보를 적법하고 투명하게 처리하기 위해 본 개인정보처리방침을 마련합니다.
          본 방침은 본 사이트가 어떤 정보를 수집하고, 어떠한 목적으로 이용하며, 어떻게 보관·보호하고, 이용자가 어떤 권리를 가지는지 설명합니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">1. 수집하는 개인정보 항목</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 회원가입·로그인 기능을 제공하지 않으며, 계정 관련 개인정보를 수집하지 않습니다.
          서비스 제공 과정에서 다음과 같은 정보가 수집될 수 있습니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          첫째, 이용자가 사이트에 접속하거나 콘텐츠를 열람하는 과정에서 자동으로 생성·수집되는 정보가 있습니다.
          여기에는 IP 주소, 브라우저 유형, 운영체제, 접속 일시, 방문 페이지, 리퍼러, 이용 기록, 기기 정보, 쿠키 또는 유사 기술을 통해 수집되는 정보가 포함될 수 있습니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          둘째, 이용자가 문의 시 이메일·메신저 등으로 직접 전달해 주시는 정보(이메일 주소, 이름, 문의 내용 등)는 해당 연락 과정에서 수집될 수 있습니다.
          본 사이트에는 문의를 위한 온라인 입력 폼이 없으며, 문의하기 페이지에 안내된 이메일·카카오톡 등으로 연락하시는 과정에서만 위 정보가 수집될 수 있습니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          셋째, 방문 통계 분석(예: Google Analytics), 호스팅·배포·CDN(예: Vercel, Cloudflare)의 로그·분석, 그리고 광고·동의 관리 서비스를 사용하는 경우 해당 제3자 제공자가 관련 정보를 수집할 수 있습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">2. 개인정보의 수집 및 이용 목적</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 수집한 정보를 다음 목적 범위 내에서 이용합니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          서비스 제공 및 운영, 사이트 안정성 및 보안 유지, 방문 통계 분석(예: Google Analytics), 콘텐츠 품질 개선,
          이용자 문의 응답, 법령 준수, 부정 이용 또는 비정상 접근 방지가 이에 포함됩니다.
          광고 또는 동의 관리 서비스를 사용하는 경우에는 적용 법령에 따라 동의를 받은 뒤 해당 목적로 이용할 수 있습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">3. 개인정보 처리의 법적 근거</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 적용되는 개인정보 보호 관련 법령에 따라 개인정보를 처리합니다.
          처리의 법적 근거는 서비스 제공을 위한 필요, 이용자의 동의, 정당한 운영 목적,
          법적 의무 준수 등 관계 법령이 허용하는 범위에 따릅니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">4. 개인정보의 보유 및 이용 기간</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 개인정보를 수집·이용 목적이 달성될 때까지 보유하며,
          목적 달성 후에는 지체 없이 파기하는 것을 원칙으로 합니다.
          다만 관계 법령에 따라 일정 기간 보관이 필요한 경우에는 해당 기간 동안 보관할 수 있습니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          자동 수집 정보, 로그, 쿠키 및 분석 정보의 보관기간은 사용되는 서비스, 브라우저 설정,
          관련 법령 및 기술적 운영 정책에 따라 달라질 수 있습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">5. 쿠키 및 유사 기술의 사용</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 서비스 운영, 이용 환경 개선, 방문 통계 분석(예: Google Analytics), 이용자 설정(예: 테마) 저장 등을 위해 쿠키 및 유사 기술을 사용할 수 있으며,
          광고·동의 관리를 사용하는 경우 적용 법령에 따라 동의를 받은 뒤 사용합니다.
          이에 관한 자세한 내용은 별도의{" "}
          <a href="/cookies" className="text-indigo-600 dark:text-indigo-400 hover:underline">쿠키 정책</a>
          에서 확인할 수 있습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">6. 개인정보의 제3자 제공</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 원칙적으로 이용자의 개인정보를 외부에 판매하지 않으며,
          법령에 근거가 있거나 이용자의 동의가 있는 경우를 제외하고 제3자에게 제공하지 않습니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          다만 방문 통계 분석(예: Google Analytics), 호스팅·배포·CDN(예: Vercel, Cloudflare), 보안, 그리고 광고·동의 관리를 사용하는 경우 해당 제3자 제공자가 관련 정보를 처리할 수 있으며, 이 경우 해당 처리는 각 제공자의 정책 및 계약 관계에 따릅니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">7. 개인정보 처리의 위탁</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 원활한 서비스 운영을 위해 일부 업무를 외부 서비스 제공자에게 위탁할 수 있습니다.
          예를 들어 웹 호스팅·배포·CDN(예: Vercel, Cloudflare), 분석 서비스(예: Google Analytics), 동의 관리 도구 등이 이에 해당할 수 있습니다.
          위탁이 이루어지는 경우 관련 법령에 따라 필요한 사항을 검토하고 관리합니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">8. 국외 이전 가능성</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트가 이용하는 서비스 중 Google Analytics, 호스팅·배포·CDN(예: Vercel, Cloudflare) 등은 해외에 서버를 두고 있을 수 있어, 해당 경로로 접속·이용 정보가 전송·처리될 수 있습니다.
          광고·동의 관리 서비스를 사용하는 경우 해당 제공자도 해외에서 데이터를 처리할 수 있습니다.
          본 사이트는 관련 법령이 요구하는 경우 필요한 보호조치를 검토합니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">9. 이용자의 권리</h2>
        <p className="text-slate-600 dark:text-slate-300">
          이용자는 관계 법령이 정하는 범위 내에서 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지 요청을 할 수 있으며,
          동의에 기반한 처리의 경우 동의를 철회할 수 있습니다.
          쿠키와 관련된 선택은 동의 배너, 설정 페이지 또는 브라우저 설정을 통해 변경할 수 있습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">10. 개인정보의 파기</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 개인정보의 보유기간이 경과하거나 처리 목적이 달성된 경우,
          복구 또는 재생이 어렵도록 합리적인 방법으로 해당 정보를 삭제 또는 파기합니다.
          다만 법령상 별도의 보관 의무가 있는 경우에는 예외로 합니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">11. 개인정보 보호를 위한 조치</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 개인정보의 분실, 도난, 유출, 위조·변조 또는 훼손을 방지하기 위해
          합리적인 기술적·관리적 보호조치를 적용하기 위해 노력합니다.
          다만 인터넷 환경의 특성상 모든 전송 또는 저장 방식의 절대적 안전성을 보장할 수는 없습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">12. 아동의 개인정보</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 법령상 필요한 경우를 제외하고 아동의 개인정보를 고의로 수집할 의도로 운영되지 않습니다.
          아동의 개인정보가 적절한 동의 없이 수집된 사실을 알게 되는 경우, 합리적인 범위 내에서 해당 정보를 삭제하기 위해 노력할 수 있습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">13. 외부 링크</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트에는 외부 사이트 또는 서비스로 연결되는 링크가 포함될 수 있습니다.
          외부 사이트의 개인정보 처리 방식은 본 방침이 아니라 해당 사이트의 정책에 따르므로,
          이용자는 방문하는 외부 서비스의 정책을 별도로 확인할 필요가 있습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">14. 개인정보처리방침의 변경</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 법령, 서비스 내용 또는 운영상 필요에 따라 본 개인정보처리방침을 변경할 수 있습니다.
          중요한 변경이 있는 경우 본 페이지의 최종 수정일을 갱신하고, 필요한 경우 별도의 방법으로 고지할 수 있습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">15. 문의</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 개인정보처리방침 또는 개인정보 처리에 관한 문의는{" "}
          <a
            href="/contact"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            문의하기
          </a>{" "}
          페이지를 통해 해주시기 바랍니다.
        </p>
      </div>
    </main>
  );
}
