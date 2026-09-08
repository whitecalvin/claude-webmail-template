// Mock data for the personal security page (auth methods and signed-in devices).
export interface SecurityDevice {
  name: string;
  desc: string;
  tag: string;
  tone: "success" | "warning" | "danger" | "neutral";
  highlighted?: boolean;
}

export const SECURITY_METHODS: SecurityDevice[] = [
  {
    name: "인증 앱 (TOTP)",
    desc: "Google Authenticator",
    tag: "기본",
    tone: "neutral",
  },
  {
    name: "보안 키",
    desc: "YubiKey 5C",
    tag: "사용 중",
    tone: "success",
  },
  {
    name: "SMS 문자",
    desc: "010-****-4821",
    tag: "백업",
    tone: "warning",
  },
];

export const SECURITY_DEVICES: SecurityDevice[] = [
  {
    name: "MacBook Pro · Chrome",
    desc: "서울 · 사내망",
    tag: "현재",
    tone: "success",
  },
  {
    name: "iPhone 16 Pro",
    desc: "서울 · LTE · 12분 전",
    tag: "",
    tone: "neutral",
  },
  {
    name: "Ubuntu · Firefox",
    desc: "오사카, 일본 · 처음 보는 위치",
    tag: "확인",
    tone: "danger",
    highlighted: true,
  },
];
