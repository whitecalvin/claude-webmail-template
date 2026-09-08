// Mock data for the user-level mail filtering rules list (app/rules).
export interface MyRule {
  name: string;
  logic: string;
  hits: number;
  on: boolean;
}

export const MY_RULES: MyRule[] = [
  { name: "임원 메일 즉시 알림", logic: "보낸사람이 임원 그룹 → 중요 표시 + 즉시 알림", hits: 18, on: true },
  { name: "프로젝트 아틀라스 분류", logic: "제목에 '아틀라스' 포함 → 라벨 적용 + 받은편지함 유지", hits: 42, on: true },
  { name: "뉴스레터 자동 보관", logic: "목록 해제 헤더 있음 → 읽음 표시 + 보관", hits: 96, on: true },
  { name: "세금계산서 전달", logic: "보낸사람 invoice@ → 재무팀 전달 + 라벨", hits: 21, on: true },
  { name: "외부 대용량 첨부 경고", logic: "외부 발신 + 50MB 초과 → 상단 배너 표시", hits: 7, on: true },
  { name: "휴가 신청 회신 정리", logic: "제목 'RE: 휴가' → 인사 라벨 + 3개월 후 삭제", hits: 30, on: false },
];

export const BUILDER_ROWS = [
  { kind: "조건", field: "보낸사람", op: "포함", value: "@hanbit-tech.kr" },
  { kind: "조건", field: "첨부", op: "있음", value: "—" },
  { kind: "동작", field: "라벨", op: "적용", value: "외부 파트너" },
  { kind: "동작", field: "알림", op: "보내기", value: "즉시" },
];

export const SIGNATURE_TABS = ["기본 (국문)", "영문", "간단 서명"];
