import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "이용약관",
  description: "HowLearn 서비스 이용 조건, 권리, 의무 및 책임에 관한 안내입니다.",
  noindex: true,
});

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        이용약관
      </h1>

      <div className="prose prose-slate prose-lg max-w-none dark:prose-invert">
        <p className="text-slate-600 dark:text-slate-400">최종 수정: 2026년 3월</p>

        <p className="text-slate-600 dark:text-slate-300">
          본 이용약관은 HowLearn(이하 &quot;본 사이트&quot;)가 제공하는 콘텐츠 및 관련 서비스의 이용과 관련하여,
          본 사이트와 이용자 간의 권리, 의무 및 책임사항을 규정합니다.
          이용자는 본 사이트를 이용함으로써 본 약관에 동의한 것으로 봅니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">1. 서비스의 성격</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 학습과학, 인지심리, 교육이론, 학습전략 및 관련 주제에 관한 정보와 해설을 제공하는 지식 아카이브입니다.
          본 사이트의 콘텐츠는 일반적인 정보 제공 및 교육적 이해를 돕기 위한 것이며,
          개별적인 교육, 의료, 심리, 상담 또는 법률 자문을 제공하기 위한 서비스가 아닙니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">2. 서비스의 제공 및 변경</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 이용자에게 콘텐츠 열람, 자료 탐색 및 관련 정보 제공 서비스를 제공합니다.
          본 사이트는 운영상, 기술상 또는 정책상 필요에 따라 서비스의 전부 또는 일부를 추가, 변경, 중단할 수 있습니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 서비스 내용, 제공 방식, 디자인, URL 구조, 기능, 게시물 구성 등을 사전 예고 없이 조정할 수 있습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">3. 이용자의 이용 원칙</h2>
        <p className="text-slate-600 dark:text-slate-300">
          이용자는 관련 법령, 본 약관, 사이트에 게시된 정책 및 공지사항을 준수하여 본 사이트를 이용해야 합니다.
          이용자는 본 사이트의 정상적인 운영을 방해하거나 제3자의 권리를 침해하는 방식으로 서비스를 이용해서는 안 됩니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">4. 금지행위</h2>
        <p className="text-slate-600 dark:text-slate-300">
          이용자는 다음 각 호의 행위를 하여서는 안 됩니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트 또는 제3자의 권리 침해 행위, 콘텐츠의 무단 복제·배포·전송·공중송신·상업적 이용,
          자동화된 수단을 통한 과도한 수집 또는 크롤링, 서비스의 보안 우회 또는 취약점 악용,
          허위 정보 입력, 악성 코드 유포, 불법적 또는 부당한 목적의 이용, 기타 관련 법령에 위반되는 행위가 이에 포함됩니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">5. 지식재산권</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트에 게시된 텍스트, 문서, 구조, 편집물, 디자인, 로고, 상표, 이미지 및 기타 콘텐츠에 관한 권리는
          별도의 표시가 없는 한 본 사이트 또는 정당한 권리자에게 귀속됩니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          이용자는 관련 법령상 허용되거나 본 사이트가 명시적으로 허용한 범위를 제외하고,
          본 사이트의 콘텐츠를 사전 승인 없이 복제, 배포, 수정, 2차적 저작물 작성, 출판, 판매 또는 상업적으로 이용할 수 없습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">6. 콘텐츠 이용에 관한 제한</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트의 콘텐츠는 개인적·비상업적 참고를 위한 용도로 제공됩니다.
          이용자는 콘텐츠를 인용할 경우 출처를 명확히 표시하고, 저작권 및 관련 법령을 준수해야 합니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          별도의 허락 없이 본 사이트 콘텐츠를 데이터셋화하거나, 대량 수집하여 별도 서비스나 모델 학습,
          상업적 콘텐츠 재가공, 유료 자료 제작 등에 이용하는 행위는 금지될 수 있습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">7. 정보의 정확성 및 보증의 한계</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 콘텐츠의 정확성, 유용성 및 이해 가능성을 높이기 위해 노력하지만,
          제공되는 모든 정보의 완전성, 최신성, 특정 목적 적합성 또는 무오류를 명시적 또는 묵시적으로 보증하지 않습니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          특히 학습과학, 심리학, 교육 관련 정보는 연구 설계, 표본, 해석, 후속 연구 및 개별 상황에 따라 적용 가능성이 달라질 수 있습니다.
          이용자는 본 사이트의 콘텐츠를 자신의 책임과 판단에 따라 참고하여야 합니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">8. 전문적 자문과의 구분</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트의 콘텐츠는 일반적인 정보 제공을 목적으로 하며,
          의료, 심리상담, 정신건강, 교육평가, 진단, 치료, 처방 또는 기타 전문적 자문을 대체하지 않습니다.
          이용자는 자신의 구체적인 상황에 대해 필요할 경우 자격을 갖춘 전문가의 조언을 받아야 합니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">9. 외부 링크 및 제3자 서비스</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 참고 자료, 인용, 외부 문서, 영상, 도구 또는 기타 사이트로 연결되는 링크를 포함할 수 있습니다.
          이러한 외부 서비스 또는 웹페이지는 본 사이트의 통제 범위를 벗어나며,
          그 내용, 정확성, 가용성, 보안성 또는 개인정보 처리에 대하여 본 사이트가 보증하거나 책임지지 않습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">10. 서비스 이용 제한</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 이용자가 본 약관 또는 관련 법령을 위반하거나,
          서비스의 안정성 및 다른 이용자의 권익을 해칠 우려가 있다고 합리적으로 판단되는 경우,
          사전 통지 없이 서비스 이용을 제한하거나 접근을 차단할 수 있습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">11. 면책</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 천재지변, 통신장애, 시스템 장애, 제3자 서비스 장애, 불가항력적 사유 또는 합리적으로 통제할 수 없는 사정으로 인해
          서비스를 제공할 수 없는 경우 책임을 지지 않습니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          또한 이용자가 본 사이트의 콘텐츠 또는 외부 링크 정보를 신뢰하거나 이용함으로써 발생한 직접적 또는 간접적 손해에 대하여,
          관련 법령이 허용하는 범위 내에서 책임을 제한합니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">12. 개인정보 보호</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트의 개인정보 처리에 관한 사항은 별도의{" "}
          <a href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">개인정보처리방침</a>
          {" "}및{" "}
          <a href="/cookies" className="text-indigo-600 dark:text-indigo-400 hover:underline">쿠키 정책</a>
          에 따릅니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">13. 약관의 변경</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 법령, 서비스 내용 또는 운영상 필요에 따라 본 약관을 변경할 수 있습니다.
          중요한 변경이 있는 경우 본 페이지의 최종 수정일을 갱신하고, 필요한 경우 적절한 방법으로 고지할 수 있습니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">14. 준거 및 해석</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 약관은 관련 법령에 따라 해석되며, 본 사이트와 이용자 간 분쟁이 발생하는 경우 적용 법령에 따른 절차와 기준에 따릅니다.
        </p>

        <h2 className="text-slate-900 dark:text-slate-100">15. 문의</h2>
        <p className="text-slate-600 dark:text-slate-300">
          본 약관에 관한 문의는{" "}
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
