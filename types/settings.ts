// Shared shapes for the Settings pages (signature, labels, notifications,
// integrations, locale).
export interface SendDefault {
  name: string;
  value: string;
}

export interface UserToggle {
  key: string;
  name: string;
  desc: string;
  on: boolean;
}

export interface UserRule {
  name: string;
  action: string;
}

export interface SecurityRow {
  name: string;
  desc: string;
  state: string;
  tone: "success" | "neutral" | "info";
}

export interface LabelRow {
  name: string;
  color: string;
  count: number;
  visibility: "목록 표시" | "숨김" | "DLP 연동";
}

export interface NotifPref {
  name: string;
  desc: string;
  mode: "즉시 알림" | "1시간 요약" | "알림 없음";
}

export interface Integration {
  name: string;
  scope: string;
  color: string;
  state: "연결됨" | "미연결";
  action: "해제" | "설정" | "연결";
}

export interface LocaleField {
  label: string;
  value: string;
}
