// Mock data for the self-hosted mail server "first run" setup wizard (/setup).
export const SETUP_STEPS = [
  { name: "라이선스 · 관리자 계정", desc: "좌석 1,400 · 관리자 1명 등록" },
  { name: "데이터베이스 연결", desc: "PostgreSQL 16 · 스키마 42개" },
  { name: "조직 · 도메인 등록", desc: "gxsoft.co.kr · 부서 42개 가져옴" },
  { name: "도메인 · DNS 확인", desc: "MX · SPF · DKIM · DMARC" },
  { name: "메일 저장소 · 백업", desc: "저장 경로 · 일 1회 백업" },
  { name: "보안 정책", desc: "스팸 · DLP · 2단계 인증" },
  { name: "사용자 초대", desc: "초대 메일 발송 · 첫 로그인" },
];

export const DB_CHECKS = [
  { name: "연결", detail: "12ms · TLS 1.3", state: "통과" as const },
  { name: "버전", detail: "PostgreSQL 16.2 · 최소 14 이상", state: "통과" as const },
  { name: "권한", detail: "CREATE · ALTER · INDEX 확인", state: "통과" as const },
  { name: "문자셋 · 정렬", detail: "UTF8 · C.UTF-8", state: "통과" as const },
  { name: "타임존", detail: "Asia/Seoul · UTC 권장", state: "주의" as const },
];

export const SETUP_DNS_RECORDS = [
  { type: "MX", host: "@", value: "10 mail.gxsoft.co.kr", state: "확인됨" as const },
  { type: "TXT · SPF", host: "@", value: "v=spf1 include:mail.gxsoft.co.kr ~all", state: "확인됨" as const },
  { type: "CNAME · DKIM", host: "mw1._domainkey", value: "mw1.dkim.gxsoft.co.kr", state: "전파 중" as const },
  { type: "TXT · DMARC", host: "_dmarc", value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@gxsoft.co.kr", state: "미설정" as const },
];
