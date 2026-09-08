// Types and mock data for the spam/phishing/malware quarantine page.
export type QuarantineKind = "스팸" | "피싱" | "멀웨어";

export interface QuarantineMail {
  id: string;
  kind: QuarantineKind;
  from: string;
  subject: string;
  reason: string;
  score: number;
  time: string;
}

export const QUARANTINE_TABS = ["전체", "스팸", "피싱", "멀웨어"] as const;

export const QUARANTINE_MAILS: QuarantineMail[] = [
  {
    id: "q1",
    kind: "피싱",
    from: "hr-notice@gxsoft-kr.net",
    subject: "2026 연봉계약서 서명 요청 (기한 임박)",
    reason: "유사 도메인 · 외부 로그인 링크",
    score: 96,
    time: "09:38",
  },
  {
    id: "q2",
    kind: "스팸",
    from: "trend@marketing-daily.io",
    subject: "9월 마케팅 트렌드 리포트",
    reason: "벌크 발신 · 목록 해제 없음",
    score: 62,
    time: "08:52",
  },
  {
    id: "q3",
    kind: "멀웨어",
    from: "billing@invoice-cloud.ru",
    subject: "Invoice #99213 overdue",
    reason: "실행 파일 첨부 탐지",
    score: 91,
    time: "어제",
  },
  {
    id: "q4",
    kind: "피싱",
    from: "support@dropb0x-share.com",
    subject: "파일 공유 링크가 도착했습니다",
    reason: "유사 도메인 · 자격증명 요청",
    score: 95,
    time: "어제",
  },
  {
    id: "q5",
    kind: "스팸",
    from: "jobs@career-connect.biz",
    subject: "채용 제안 (재직자 대상)",
    reason: "벌크 발신 패턴",
    score: 55,
    time: "9월 3일",
  },
  {
    id: "q6",
    kind: "스팸",
    from: "expo@cloud-events.net",
    subject: "2026 클라우드 엑스포 사전등록 안내",
    reason: "SPF 실패",
    score: 41,
    time: "9월 3일",
  },
  {
    id: "q7",
    kind: "피싱",
    from: "billing@paypa1-secure.com",
    subject: "[긴급] 결제 정보 확인 필요",
    reason: "유사 도메인 · 결제 정보 요청",
    score: 98,
    time: "9월 2일",
  },
  {
    id: "q8",
    kind: "스팸",
    from: "deals@office-supply-mart.com",
    subject: "사무용품 대량구매 할인",
    reason: "벌크 발신 패턴",
    score: 38,
    time: "9월 2일",
  },
];

export interface QuarantineCheck {
  ok: "fail" | "warn" | "pass";
  name: string;
  detail: string;
}

export const QUARANTINE_DETAIL_CHECKS: QuarantineCheck[] = [
  { ok: "fail", name: "발신 도메인 인증", detail: "SPF 실패 · DKIM 서명 없음 · DMARC reject 대상" },
  { ok: "fail", name: "유사 도메인 (typosquatting)", detail: "gxsoft-kr.net — 편집거리 1" },
  { ok: "fail", name: "본문 링크", detail: "외부 로그인 페이지 1건 · 신고 이력 있는 호스팅" },
  { ok: "warn", name: "발신 패턴", detail: "동일 본문 14개 계정 동시 발송" },
  { ok: "pass", name: "첨부 파일", detail: "첨부 없음" },
];
