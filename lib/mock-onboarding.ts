// Mock data for the org-admin onboarding wizard (/admin/onboarding) — this is
// distinct from /setup, which is the initial server install wizard.
export type StepStatus = "done" | "now" | "todo";

export const ONBOARD_STEPS: { name: string; desc: string; status: StepStatus }[] = [
  { name: "조직 정보", desc: "회사명 · 대표 도메인 · 담당자", status: "done" },
  { name: "도메인 연결", desc: "MX · SPF · DKIM 레코드 등록", status: "now" },
  { name: "계정 만들기", desc: "CSV 일괄 등록 · HR 조직도 연동", status: "todo" },
  { name: "메일 마이그레이션", desc: "기존 서버에서 메일 이관", status: "todo" },
  { name: "정책 적용", desc: "보안 · 보존 · DLP 기본값", status: "todo" },
  { name: "전환 · 검수", desc: "MX 최종 전환 및 발송 테스트", status: "todo" },
];

export const DNS_RECORDS = [
  { type: "MX", host: "@", value: "mx1.mailwave.kr", prio: "10", state: "확인됨", tone: "success" as const },
  { type: "MX", host: "@", value: "mx2.mailwave.kr", prio: "20", state: "확인됨", tone: "success" as const },
  { type: "TXT", host: "@", value: "v=spf1 include:spf.mailwave.kr ~all", prio: "—", state: "확인됨", tone: "success" as const },
  { type: "TXT", host: "mw._domainkey", value: "v=DKIM1; k=rsa; p=MIIBIjANBg…", prio: "—", state: "대기 중", tone: "warning" as const },
  { type: "TXT", host: "_dmarc", value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@…", prio: "—", state: "미등록", tone: "neutral" as const },
];

export const MIGRATIONS = [
  { source: "Exchange 2016", percent: 72, note: "14.2만 / 19.7만" },
  { source: "Google Workspace", percent: 38, note: "6.1만 / 16.0만" },
  { source: "IMAP 기타", percent: 0, note: "대기 중" },
];
