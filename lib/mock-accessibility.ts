// Mock data for the Accessibility (KWCAG 2.2) compliance page.
export const A11Y_ROWS = [
  { name: "키보드만으로 전체 조작", how: "2.1.1", state: "통과" },
  { name: "포커스 표시", how: "2.4.7", state: "통과" },
  { name: "본문 명암비 4.5:1 이상", how: "1.4.3", state: "통과" },
  { name: "색만으로 정보 전달 금지", how: "1.4.1", state: "통과" },
  { name: "대체 텍스트", how: "1.1.1", state: "통과" },
  { name: "표 구조 · 헤더 연결", how: "1.3.1", state: "통과" },
  { name: "오류 안내 · 복구", how: "3.3.1", state: "통과" },
  { name: "텍스트 200% 확대", how: "1.4.4", state: "보완 중" },
  { name: "동작 시간 조절", how: "2.2.1", state: "보완 중" },
];

export const CONTRAST_ROWS = [
  { pair: "본문 #17181B / 배경 #FFFFFF", ratio: "15.9:1", state: "AAA", fg: "#17181B" },
  { pair: "보조 #6B6F77 / 배경 #FFFFFF", ratio: "5.1:1", state: "AA", fg: "#6B6F77" },
  { pair: "액센트 #2B4BF2 / 배경 #FFFFFF", ratio: "6.4:1", state: "AA", fg: "#2B4BF2" },
  { pair: "보조 #9A9EA5 / 배경 #FFFFFF", ratio: "2.6:1", state: "대형만", fg: "#9A9EA5", fail: true },
];
