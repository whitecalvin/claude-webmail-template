// Types and mock data for the Approvals (결재) inbox.
export type ApprovalType = "예산" | "계약" | "구매" | "인사" | "지출" | "규정";

export interface ApprovalItem {
  id: string;
  type: ApprovalType;
  no: string;
  title: string;
  author: string;
  amount: string;
  due: string;
}

export const APPROVAL_TABS = ["내 차례", "기안함", "진행 중", "완료"] as const;

export const TYPE_STYLE: Record<ApprovalType, string> = {
  예산: "bg-[#ECEFFE] text-[#2B4BF2]",
  계약: "bg-[#EDEBF7] text-[#6B5CA8]",
  구매: "bg-[#E8F1F5] text-[#3B7A94]",
  인사: "bg-[#E9F3EC] text-[#2E8B5B]",
  지출: "bg-[#FDF0E4] text-[#B4740F]",
  규정: "bg-black/6 text-(--text-muted) dark:bg-white/8",
};

export const APPROVALS: ApprovalItem[] = [
  {
    id: "a1",
    type: "예산",
    no: "GX-2026-0912",
    title: "2026 상반기 클라우드 인프라 증설 예산 승인 요청",
    author: "박서준",
    amount: "420,000,000원",
    due: "오늘 마감",
  },
  {
    id: "a2",
    type: "계약",
    no: "GX-2026-0908",
    title: "광주 지역 총판 계약 체결 승인 (법무 검토 완료)",
    author: "윤재호",
    amount: "연 1.8억",
    due: "D-2",
  },
  {
    id: "a3",
    type: "구매",
    no: "GX-2026-0903",
    title: "보안 관제 솔루션 라이선스 갱신 (연간)",
    author: "정우진",
    amount: "36,000,000원",
    due: "D-3",
  },
  {
    id: "a4",
    type: "인사",
    no: "GX-2026-0899",
    title: "백엔드 개발자 2명 채용 TO 승인",
    author: "김하늘",
    amount: "—",
    due: "D-5",
  },
  {
    id: "a5",
    type: "지출",
    no: "GX-2026-0891",
    title: "8월 부서 운영비 정산 (전략기획팀)",
    author: "오세린",
    amount: "4,120,000원",
    due: "진행 중",
  },
  {
    id: "a6",
    type: "예산",
    no: "GX-2026-0884",
    title: "하반기 마케팅 캠페인 집행 예산",
    author: "배수아",
    amount: "95,000,000원",
    due: "진행 중",
  },
  {
    id: "a7",
    type: "규정",
    no: "GX-2026-0877",
    title: "재택근무 지침 개정안 (v3.1)",
    author: "김하늘",
    amount: "—",
    due: "완료",
  },
];

export interface ChainNode {
  initials: string;
  name: string;
  role: string;
  state: "완료" | "대기" | "예정";
  detail: string;
  isNow?: boolean;
}

export const APPROVAL_CHAIN: ChainNode[] = [
  { initials: "박", name: "박서준", role: "기안 · CTO", state: "완료", detail: "완료" },
  { initials: "강", name: "강태윤", role: "검토 · 팀장", state: "완료", detail: "승인 09-01" },
  { initials: "이", name: "이수민", role: "협조 · 재무팀장", state: "완료", detail: "승인 09-02" },
  { initials: "한", name: "한지우", role: "결재 · 나", state: "대기", detail: "대기 중", isNow: true },
  { initials: "김", name: "김대표", role: "최종 승인", state: "예정", detail: "예정" },
];

export const APPROVAL_LINE_ITEMS = [
  { name: "GPU 노드 (A100 80GB) 6대", note: "", amount: "312,000,000원" },
  { name: "네트워크 스위치 증설 2식", note: "", amount: "68,000,000원" },
  { name: "3년 유지보수 계약", note: "", amount: "34,000,000원" },
  { name: "예비비 (환율 변동)", note: "", amount: "6,000,000원" },
];

export const APPROVAL_COMMENTS = [
  {
    initials: "강",
    name: "강태윤 팀장",
    time: "09-01 18:40",
    body: "3분기 4대 우선 도입 조건으로 검토 승인합니다.",
  },
  {
    initials: "이",
    name: "이수민 재무팀장",
    time: "09-02 08:12",
    body: "예비비는 집행 전 별도 결재가 필요합니다.",
  },
  {
    initials: "AI",
    name: "자동 점검",
    time: "09-02 08:13",
    body: "첨부 제안서와 요청 내역 금액이 일치합니다. 예산 코드 IT-CAPEX-26H1 잔액 충분.",
  },
];
