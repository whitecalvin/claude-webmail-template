import type {
  Integration,
  LabelRow,
  LocaleField,
  NotifPref,
  SecurityRow,
  SendDefault,
  UserRule,
  UserToggle,
} from "@/types/settings";

// Navigation and mock data shared across the Settings pages. Some entries
// route to /settings?tab=... (rendered inline) and some to dedicated pages
// (e.g. /rules, /security) — see SettingsNav for how `href` is consumed.
export const SETTINGS_NAV = [
  { key: "signature", name: "메일 · 서명", href: "/settings?tab=signature" },
  { key: "inbox-display", name: "받은편지함 표시", href: "/settings?tab=inbox-display" },
  { key: "filters", name: "필터 · 자동 분류", href: "/rules" },
  { key: "labels", name: "라벨 관리", href: "/settings?tab=labels" },
  { key: "notifications", name: "알림", href: "/settings?tab=notifications" },
  { key: "security", name: "보안 · 로그인 기록", href: "/security" },
  { key: "integrations", name: "연동 (캘린더 · 결재)", href: "/settings?tab=integrations" },
  { key: "locale", name: "언어 · 시간대", href: "/settings?tab=locale" },
  { key: "shortcuts", name: "단축키", href: "/shortcuts" },
  { key: "accessibility", name: "접근성", href: "/accessibility" },
] as const;

export type SettingsNavKey = (typeof SETTINGS_NAV)[number]["key"];

export const SEND_DEFAULTS: SendDefault[] = [
  { name: "보내는 이름", value: "한지우" },
  { name: "기본 발신 주소", value: "jiwoo.han@gxsoft.co.kr" },
  { name: "글꼴", value: "Pretendard 14" },
  { name: "답장 방식", value: "전체 답장" },
];

export const DEFAULT_TOGGLES: UserToggle[] = [
  {
    key: "undo",
    name: "전송 취소 (10초)",
    desc: "보내기 후 10초 안에 취소할 수 있습니다.",
    on: true,
  },
  {
    key: "away",
    name: "부재중 자동응답",
    desc: "휴가 기간에 자동으로 회신합니다. 9/14–9/18 예약됨.",
    on: false,
  },
  {
    key: "preview",
    name: "미리보기 창 사용",
    desc: "3분할 레이아웃으로 목록과 본문을 함께 봅니다.",
    on: true,
  },
  {
    key: "remote",
    name: "외부 이미지 자동 표시",
    desc: "끄면 발신자 추적을 차단합니다.",
    on: false,
  },
  {
    key: "aiSummary",
    name: "AI 요약 자동 실행",
    desc: "스레드 3개 이상일 때 자동으로 요약합니다.",
    on: true,
  },
];

export const USER_RULES: UserRule[] = [
  { name: "발신자: Jira, Notion", action: "'알림' 라벨 + 건너뛰기" },
  { name: "제목에 [승인요청] 포함", action: "'결재 대기' 폴더 + 중요 표시" },
  { name: "외부 도메인 + 첨부 있음", action: "격리 검사 후 수신" },
];

export const SECURITY_ROWS: SecurityRow[] = [
  {
    name: "2단계 인증",
    desc: "OTP 앱 · 백업 코드 8개 남음",
    state: "사용 중",
    tone: "success",
  },
  {
    name: "로그인된 기기",
    desc: "MacBook Pro · iPhone 16 · Windows",
    state: "3대",
    tone: "neutral",
  },
  {
    name: "최근 로그인 기록",
    desc: "9월 2일 09:02 · 서울 (사내망)",
    state: "정상",
    tone: "info",
  },
];

export const LABEL_ROWS: LabelRow[] = [
  { name: "프로젝트 아틀라스", color: "#2b4bf2", count: 18, visibility: "목록 표시" },
  { name: "예산 · 재무", color: "#2e8b5b", count: 9, visibility: "목록 표시" },
  { name: "외부 파트너", color: "#e0ac4a", count: 24, visibility: "목록 표시" },
  { name: "채용", color: "#6b5ca8", count: 5, visibility: "숨김" },
  { name: "기밀", color: "#c0433b", count: 3, visibility: "DLP 연동" },
];

export const NOTIF_PREFS: NotifPref[] = [
  { name: "중요 메일", desc: "임원 · 결재 · 내가 멘션된 메일", mode: "즉시 알림" },
  { name: "결재 차례", desc: "내 결재 순서가 되었을 때", mode: "즉시 알림" },
  { name: "일반 메일", desc: "그 외 모든 수신 메일", mode: "1시간 요약" },
  { name: "공용 메일함", desc: "담당 메일함의 신규 문의", mode: "1시간 요약" },
  { name: "뉴스레터", desc: "벌크 발신으로 분류된 메일", mode: "알림 없음" },
];

export const INTEGRATIONS: Integration[] = [
  {
    name: "사내 캘린더",
    scope: "일정 읽기 · 쓰기 · 회의실 예약",
    color: "#2b4bf2",
    state: "연결됨",
    action: "해제",
  },
  {
    name: "결재 시스템 (그로우)",
    scope: "기안 상태 동기화 · 승인 처리",
    color: "#2e8b5b",
    state: "연결됨",
    action: "해제",
  },
  {
    name: "HR 조직도",
    scope: "주소록 자동 갱신 (매일 03:00)",
    color: "#6b5ca8",
    state: "연결됨",
    action: "설정",
  },
  {
    name: "Slack",
    scope: "중요 메일 DM 전달",
    color: "#a9762a",
    state: "미연결",
    action: "연결",
  },
  {
    name: "Google Drive",
    scope: "첨부를 드라이브 링크로 발송",
    color: "#3b7a94",
    state: "미연결",
    action: "연결",
  },
];

export const LOCALE_FIELDS: LocaleField[] = [
  { label: "표시 언어", value: "한국어" },
  { label: "보조 언어", value: "English" },
  { label: "시간대", value: "(GMT+9) 서울" },
  { label: "주 시작일", value: "월요일" },
];
