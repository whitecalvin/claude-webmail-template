// Mock data for shared mailboxes, scheduled sends, and mail templates.
export const SHARED_BOXES = [
  { name: "인사팀 문의", addr: "hr@gxsoft.co.kr", initials: "인사", role: "전체 관리", unread: 14 },
  { name: "채용 지원 접수", addr: "recruit@gxsoft.co.kr", initials: "채용", role: "읽기 · 답장", unread: 36 },
  { name: "글로벌 고객지원", addr: "support@gxsoft.com", initials: "지원", role: "읽기 · 답장", unread: 82 },
  { name: "홍보 · 언론", addr: "press@gxsoft.co.kr", initials: "홍보", role: "읽기 전용", unread: 5 },
  { name: "대표이사 비서", addr: "ceo-office@gxsoft.co.kr", initials: "비서", role: "위임 발신", unread: 3 },
  { name: "세금계산서 접수", addr: "invoice@gxsoft.co.kr", initials: "세금", role: "읽기 전용", unread: 21 },
];

export const DELEGATE_NOTE = "한지우 (대리: 인사팀 문의)";

export const SCHEDULED_MAILS = [
  { when: "오늘 18:00", subject: "[전사] 9월 소방 훈련 안내", to: "all@gxsoft.co.kr · 1,284명", state: "조정 대기", tone: "warning" as const },
  { when: "9월 5일 09:00", subject: "RE: 인프라 증설 예산 최종 회신", to: "박서준, 재무팀 (12)", state: "예약됨", tone: "info" as const },
  { when: "9월 8일 08:30", subject: "주간 업무 계획 (9월 2주)", to: "전략기획팀 (14)", state: "매주 월요일", tone: "success" as const },
  { when: "9월 14일 10:00", subject: "휴가 인수인계 안내", to: "강태윤, 최민서", state: "예약됨", tone: "info" as const },
];

export const MAIL_TEMPLATES = [
  { name: "결재 반려 안내", scope: "공용", uses: 184, edited: "8월 21일" },
  { name: "외부 견적 요청", scope: "공용", uses: 96, edited: "7월 30일" },
  { name: "부재중 자동응답 (국문)", scope: "개인", uses: 42, edited: "9월 1일" },
  { name: "Out of office (EN)", scope: "개인", uses: 18, edited: "9월 1일" },
  { name: "회의 일정 조율", scope: "개인", uses: 231, edited: "6월 12일" },
];
