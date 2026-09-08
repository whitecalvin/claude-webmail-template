// Step content for the first-run product tour overlay (components/tour).
export interface TourStep {
  title: string;
  body: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    title: "편지쓰기부터 시작해 보세요",
    body: "왼쪽 위 편지쓰기 버튼으로 새 메일을 작성할 수 있습니다.",
  },
  {
    title: "검색은 어디서든",
    body: "메일 · 사람 · 첨부를 한 곳에서 찾습니다. from:박서준 처럼 조건을 붙일 수도 있습니다.",
  },
  {
    title: "테마를 자유롭게 바꿔보세요",
    body: "테마 커스터마이징에서 색상, 폰트, 레이아웃을 조직에 맞게 바꿀 수 있습니다.",
  },
  {
    title: "캘린더 · 주소록 · 결재",
    body: "왼쪽 아이콘 레일에서 캘린더, 주소록, 결재 문서함으로 바로 이동할 수 있습니다.",
  },
  {
    title: "격리함도 확인하세요",
    body: "의심스러운 메일은 자동으로 격리되며, 안전 미리보기로 내용을 확인할 수 있습니다.",
  },
  {
    title: "준비되셨습니다",
    body: "설정에서 서명, 자동응답, 단축키를 마저 설정하면 끝입니다.",
  },
];

export interface ChecklistItem {
  label: string;
  done: boolean;
  time?: string;
}

export const TOUR_CHECKLIST: ChecklistItem[] = [
  { label: "프로필 사진 등록", done: true },
  { label: "서명 만들기", done: true },
  { label: "2단계 인증 켜기", done: false, time: "2분" },
  { label: "모바일 앱 설치", done: false, time: "1분" },
  { label: "기존 메일 가져오기", done: false, time: "5분" },
];
