// Mock data for the admin "system mail / print / error page" screen
// (transactional email templates, print preview, and error-page previews).
export const SYS_TEMPLATES = [
  { name: "비밀번호 재설정", active: true, dot: "#2E8B5B" },
  { name: "신규 계정 초대", active: false, dot: "#2E8B5B" },
  { name: "2단계 인증 코드", active: false, dot: "#2E8B5B" },
  { name: "새 기기 로그인 알림", active: false, dot: "#2E8B5B" },
  { name: "격리 메일 요약 (일간)", active: false, dot: "#2E8B5B" },
  { name: "용량 임계 경고", active: false, dot: "#E0AC4A" },
  { name: "결재 요청 알림", active: false, dot: "#2E8B5B" },
  { name: "부재중 자동응답 안내", active: false, dot: "#9A9EA5" },
  { name: "대용량 링크 만료 예고", active: false, dot: "#E0AC4A" },
  { name: "계정 정지 통보", active: false, dot: "#E0AC4A" },
  { name: "마이그레이션 완료", active: false, dot: "#2E8B5B" },
  { name: "서비스 점검 공지", active: false, dot: "#9A9EA5" },
];

export const SYS_VARS = [
  "{{이름}}", "{{이메일}}", "{{조직명}}", "{{링크}}",
  "{{만료시각}}", "{{요청위치}}", "{{브라우저}}", "{{지원연락처}}",
];

export const PRINT_META = [
  { k: "보낸사람", v: "박서준 <seojun.park@gxsoft.co.kr>" },
  { k: "받은사람", v: "한지우, 강태윤 외 3명" },
  { k: "날짜", v: "2026-09-01 17:22" },
  { k: "스레드", v: "메시지 4개" },
];

export const PRINT_BODY = [
  { who: "박서준", when: "09-01 17:22", text: "2026 상반기 클라우드 인프라 증설 예산 검토를 요청드립니다." },
  { who: "강태윤", when: "09-01 18:40", text: "3분기 4대 우선 도입 조건으로 검토 승인합니다." },
  { who: "이수민", when: "09-02 08:12", text: "예비비는 집행 전 별도 결재가 필요합니다." },
];

export const PRINT_OPTIONS = [
  { name: "헤더 · 페이지 번호", desc: "인쇄물 상단에 발신 정보 표시", on: true },
  { name: "메타 정보", desc: "보낸사람 · 받는사람 · 날짜 포함", on: true },
  { name: "인용문 펼치기", desc: "이전 답장 내용을 모두 인쇄", on: false },
  { name: "첨부 목록", desc: "첨부 파일명과 크기 표시", on: true },
  { name: "원격 이미지", desc: "외부 이미지를 인쇄에 포함", on: false },
  { name: "기밀 표기", desc: "'사내 기밀' 워터마크 추가", on: true },
];

export interface ErrorPageSpec {
  code: string;
  label: string;
  url: string;
  glyph: string;
  title: string;
  body: string;
  meta?: string;
  action: string;
  alt: string;
  foot: string;
  tone: "neutral" | "danger" | "warning";
}

export const ERROR_PAGES: ErrorPageSpec[] = [
  {
    code: "404",
    label: "찾을 수 없음",
    url: "/mail/thread/8f2a",
    glyph: "◇",
    title: "이 메일을 찾을 수 없습니다",
    body: "삭제되었거나 다른 메일함으로 옮겨졌을 수 있습니다. 휴지통에는 30일간 보관됩니다.",
    action: "받은편지함으로",
    alt: "휴지통 검색",
    foot: "문제가 계속되면 IT 운영팀에 문의하세요.",
    tone: "neutral",
  },
  {
    code: "403",
    label: "권한 없음",
    url: "/admin/billing",
    glyph: "⛨",
    title: "이 화면에 접근할 권한이 없습니다",
    body: "관리자 콘솔의 요금 · 계약 영역은 조직 관리자만 볼 수 있습니다. 필요하다면 권한을 요청하세요.",
    meta: "요청 로그 ID: acl-7741-b2",
    action: "권한 요청",
    alt: "돌아가기",
    foot: "요청은 조직 관리자 2명에게 전달됩니다.",
    tone: "danger",
  },
  {
    code: "503",
    label: "점검 중",
    url: "status.gxsoft.co.kr",
    glyph: "⏻",
    title: "정기 점검을 진행하고 있습니다",
    body: "메일 수신은 정상적으로 계속되며, 점검이 끝나면 모두 배달됩니다. 웹 접속만 일시 중단됩니다.",
    meta: "예상 완료 2026-09-05 02:00 KST",
    action: "상태 페이지",
    alt: "알림 받기",
    foot: "긴급 문의 02-2000-1000 (24시간)",
    tone: "warning",
  },
];
