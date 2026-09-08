// Mock data for the user's personal 2FA/MFA method list (mobile security view).
export interface MfaMethod {
  name: string;
  desc: string;
  state: string;
  tone: "success" | "warning" | "neutral";
  badge?: string;
  action: string;
}

export const MFA_METHODS: MfaMethod[] = [
  { name: "인증 앱 (TOTP)", desc: "Google Authenticator · 등록 2025-03-11", state: "사용 중", tone: "success", badge: "기본", action: "재설정" },
  { name: "보안 키 (FIDO2)", desc: "YubiKey 5C · 지문 없이 탭", state: "사용 중", tone: "success", badge: "기본", action: "관리" },
  { name: "SMS 문자", desc: "010-****-4821", state: "백업용", tone: "warning", action: "변경" },
  { name: "이메일 코드", desc: "개인 메일 j***@naver.com", state: "미사용", tone: "neutral", action: "설정" },
];

export interface AuthMethod {
  name: string;
  desc: string;
  state: string;
  tone: "success" | "warning" | "danger";
  action: string;
}

export const AUTH_METHODS: AuthMethod[] = [
  { name: "비밀번호", desc: "132일 전 변경 · 정책상 180일마다 변경 필요", state: "주의", tone: "warning", action: "변경" },
  { name: "SSO (Azure AD)", desc: "회사 계정으로 로그인 · 자동 프로비저닝", state: "연결됨", tone: "success", action: "보기" },
  { name: "앱 비밀번호", desc: "IMAP 클라이언트 2개에서 사용 중", state: "검토 필요", tone: "danger", action: "관리" },
];

export interface SessionRow {
  device: string;
  meta: string;
  badge?: string;
  badgeTone?: "danger" | "info";
  when: string;
  highlighted?: boolean;
}

export const SESSIONS: SessionRow[] = [
  { device: "MacBook Pro · Chrome 141", meta: "서울 · 121.135.xx.xx · 사내망", badge: "현재 기기", badgeTone: "info", when: "활성" },
  { device: "iPhone 16 Pro · Mailwave 앱", meta: "서울 · LTE", when: "12분 전" },
  { device: "Windows 11 · Edge", meta: "성남 · 사무실 PC", when: "어제 18:22" },
  { device: "iPad Air · Safari", meta: "서울 · 자택 Wi-Fi", when: "3일 전" },
  { device: "Outlook (IMAP)", meta: "서울 · 앱 비밀번호", badge: "앱 비밀번호", badgeTone: "info", when: "6일 전" },
  { device: "Ubuntu · Firefox", meta: "오사카, 일본 · 처음 보는 위치", badge: "확인 필요", badgeTone: "danger", when: "8일 전", highlighted: true },
];

export const SECURITY_EVENTS = [
  { text: "오사카에서 새 기기 로그인 성공", tone: "danger" as const, when: "8일 전" },
  { text: "보안 키 등록됨 (YubiKey 5C)", tone: "success" as const, when: "3주 전" },
  { text: "백업 코드 3개 사용됨", tone: "warning" as const, when: "1개월 전" },
];
