// Mock data for the global Search page (/search): a pre-baked result set for
// SEARCH_QUERY, plus the facet/filter sidebar options.
export interface SearchResultItem {
  sender: string;
  folder: string;
  date: string;
  subject: string;
  hitPrefix: string;
  hit: string;
  hitSuffix: string;
  initials: string;
  bg: string;
  fg: string;
  file?: { type: string; name: string };
}

export interface SearchGroup {
  name: string;
  items: SearchResultItem[];
}

export const SEARCH_QUERY = "인프라 예산 has:attachment from:박서준";

export const SEARCH_CHIPS = [
  { label: "박서준", active: true },
  { label: "첨부 있음", active: true },
  { label: "최근 6개월", active: true },
  { label: "전체 폴더", active: false },
];

export const SEARCH_GROUPS: SearchGroup[] = [
  {
    name: "메일 · 12건",
    items: [
      {
        sender: "박서준",
        folder: "받은편지함",
        date: "9월 1일",
        subject: "[승인요청] 2026 상반기 클라우드 인프라 증설 예산 검토",
        hitPrefix: "이번 분기 ",
        hit: "인프라 예산",
        hitSuffix: "은 전분기 대비 8% 증가한 수준으로...",
        initials: "박",
        bg: "#E9F3EC",
        fg: "#2E8B5B",
        file: { type: "PDF", name: "인프라_증설_제안서_v4.pdf" },
      },
      {
        sender: "박서준",
        folder: "보낸편지함",
        date: "8월 28일",
        subject: "RE: 3분기 트래픽 예측 자료 공유",
        hitPrefix: "말씀하신 ",
        hit: "인프라 예산",
        hitSuffix: " 시뮬레이션 결과를 첨부합니다.",
        initials: "박",
        bg: "#E9F3EC",
        fg: "#2E8B5B",
      },
      {
        sender: "이수민",
        folder: "받은편지함",
        date: "8월 20일",
        subject: "예산 이연안 초안 (재무팀 검토본)",
        hitPrefix: "박서준님이 제출한 ",
        hit: "인프라 예산",
        hitSuffix: " 항목 중 일부를 다음 분기로 이연하는 안입니다.",
        initials: "이",
        bg: "#FBEAE8",
        fg: "#C0433B",
      },
    ],
  },
  {
    name: "첨부 파일 · 19건",
    items: [
      {
        sender: "박서준",
        folder: "받은편지함",
        date: "9월 1일",
        subject: "인프라_증설_제안서_v4.pdf",
        hitPrefix: "",
        hit: "인프라 예산",
        hitSuffix: " 섹션 3페이지",
        initials: "박",
        bg: "#E9F3EC",
        fg: "#2E8B5B",
        file: { type: "PDF", name: "인프라_증설_제안서_v4.pdf" },
      },
      {
        sender: "최민서",
        folder: "받은편지함",
        date: "8월 29일",
        subject: "주간회의록_0828.docx",
        hitPrefix: "",
        hit: "인프라 예산",
        hitSuffix: " 관련 논의 사항 요약",
        initials: "최",
        bg: "#EDEBF7",
        fg: "#6B5CA8",
        file: { type: "DOC", name: "주간회의록_0828.docx" },
      },
    ],
  },
  {
    name: "사람 · 2명",
    items: [
      {
        sender: "박서준",
        folder: "인프라팀 · 책임",
        date: "",
        subject: "seojun.park@gxsoft.co.kr",
        hitPrefix: "",
        hit: "",
        hitSuffix: "",
        initials: "박",
        bg: "#E9F3EC",
        fg: "#2E8B5B",
      },
    ],
  },
];

export interface FacetRow {
  label: string;
  count: number;
  checked: boolean;
}
export interface FacetGroup {
  name: string;
  rows: FacetRow[];
}

export const SEARCH_FACETS: FacetGroup[] = [
  {
    name: "기간",
    rows: [
      { label: "오늘", count: 0, checked: false },
      { label: "최근 7일", count: 2, checked: false },
      { label: "최근 6개월", count: 38, checked: true },
      { label: "전체", count: 214, checked: false },
    ],
  },
  {
    name: "폴더",
    rows: [
      { label: "받은편지함", count: 24, checked: true },
      { label: "보낸편지함", count: 9, checked: false },
      { label: "결재 대기", count: 3, checked: false },
      { label: "보관", count: 2, checked: false },
    ],
  },
  {
    name: "첨부 유형",
    rows: [
      { label: "PDF", count: 8, checked: true },
      { label: "엑셀", count: 5, checked: false },
      { label: "문서", count: 4, checked: false },
      { label: "이미지", count: 2, checked: false },
    ],
  },
  {
    name: "라벨",
    rows: [
      { label: "예산 · 재무", count: 12, checked: false },
      { label: "프로젝트 아틀라스", count: 6, checked: false },
      { label: "기밀", count: 1, checked: false },
    ],
  },
];

export const SAVED_SEARCHES = ["결재 대기 · 내 차례", "첨부 100MB 이상", "외부 도메인 · 기밀 라벨"];
