// Keyboard shortcut reference data shown on the Shortcuts help page.
export interface ShortcutGroup {
  name: string;
  items: { label: string; keys: string[] }[];
}

export const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    name: "이동",
    items: [
      { label: "받은편지함", keys: ["G", "I"] },
      { label: "보낸편지함", keys: ["G", "T"] },
      { label: "임시보관", keys: ["G", "D"] },
      { label: "결재 대기", keys: ["G", "A"] },
      { label: "캘린더", keys: ["G", "C"] },
      { label: "주소록", keys: ["G", "P"] },
    ],
  },
  {
    name: "전역",
    items: [
      { label: "검색 · 명령 팔레트", keys: ["⌘", "K"] },
      { label: "새 메일 쓰기", keys: ["C"] },
      { label: "알림 센터", keys: ["⌘", "⇧", "N"] },
      { label: "단축키 도움말", keys: ["?"] },
      { label: "설정", keys: ["⌘", ","] },
      { label: "사이드바 접기", keys: ["⌘", "\\"] },
    ],
  },
  {
    name: "목록",
    items: [
      { label: "다음 · 이전", keys: ["J", "K"] },
      { label: "열기", keys: ["↵"] },
      { label: "선택", keys: ["X"] },
      { label: "전체 선택", keys: ["⌘", "A"] },
      { label: "읽음 · 안 읽음", keys: ["⇧", "U"] },
      { label: "중요 표시", keys: ["S"] },
    ],
  },
  {
    name: "메일 처리",
    items: [
      { label: "보관", keys: ["E"] },
      { label: "삭제", keys: ["#"] },
      { label: "스팸 신고", keys: ["!"] },
      { label: "나중에 알림", keys: ["H"] },
      { label: "라벨 붙이기", keys: ["L"] },
      { label: "다른 함으로", keys: ["V"] },
    ],
  },
  {
    name: "작성",
    items: [
      { label: "보내기", keys: ["⌘", "↵"] },
      { label: "임시 저장", keys: ["⌘", "S"] },
      { label: "예약 발송", keys: ["⌘", "⇧", "↵"] },
      { label: "첨부 추가", keys: ["⌘", "⇧", "A"] },
      { label: "받는 사람 추가", keys: ["⌘", "⇧", "T"] },
      { label: "창 닫기", keys: ["Esc"] },
    ],
  },
  {
    name: "답장",
    items: [
      { label: "답장", keys: ["R"] },
      { label: "전체 답장", keys: ["A"] },
      { label: "전달", keys: ["F"] },
      { label: "인용 접기", keys: ["⇧", "Q"] },
      { label: "원문 보기", keys: ["⇧", "O"] },
    ],
  },
  {
    name: "검색",
    items: [
      { label: "검색창 열기", keys: ["/"] },
      { label: "문법 도움말", keys: ["?"] },
      { label: "결과 안에서 재검색", keys: ["⌘", "F"] },
      { label: "필터 초기화", keys: ["⇧", "Esc"] },
    ],
  },
  {
    name: "관리자",
    items: [
      { label: "탭 이동", keys: ["⌥", "1–9"] },
      { label: "표 검색", keys: ["⌘", "F"] },
      { label: "선택 항목 내보내기", keys: ["⌘", "E"] },
      { label: "새로고침", keys: ["⌘", "R"] },
    ],
  },
];
