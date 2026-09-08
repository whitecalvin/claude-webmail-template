// Reference data for the search syntax help panel (operators and examples).
export const SYN_PEOPLE = [
  { op: "from:박서준", desc: "특정 사람이 보낸 메일" },
  { op: "to:재무팀", desc: "특정 수신자에게 간 메일" },
  { op: "cc: / bcc:", desc: "참조 · 숨은참조 대상" },
  { op: "list:newsletter", desc: "특정 메일링 리스트" },
  { op: "me", desc: "나를 포함한 메일" },
  { op: "domain:hanbit-tech.kr", desc: "특정 도메인에서 온 메일" },
  { op: "is:external", desc: "조직 외부에서 온 메일" },
];

export const SYN_CONTENT = [
  { op: "subject:예산", desc: "제목에 포함된 단어" },
  { op: '"인프라 증설"', desc: "정확한 문구 검색" },
  { op: "has:attachment", desc: "첨부 파일이 있는 메일" },
  { op: "filename:pdf", desc: "특정 확장자의 첨부" },
  { op: "larger:10mb", desc: "특정 크기 이상의 메일" },
  { op: "is:unread / is:starred", desc: "안 읽음 · 중요 표시" },
  { op: "label:아틀라스", desc: "특정 라벨이 붙은 메일" },
  { op: "in:격리함", desc: "특정 폴더 안에서 검색" },
  { op: "after:2026-06-01", desc: "특정 날짜 이후" },
  { op: "older_than:1y", desc: "특정 기간보다 오래된 메일" },
];

export const SYNTAX_RULES = [
  "여러 조건을 나열하면 기본적으로 AND로 결합됩니다. OR을 명시하면 둘 중 하나만 만족해도 됩니다.",
  "조건 앞에 - 를 붙이면 제외됩니다 (예: -label:뉴스레터).",
  "괄호로 조건을 묶어 우선순위를 정할 수 있습니다.",
  "한글 검색은 조사(을/를/이/가)에 관계없이 어근을 인식합니다.",
];

export const SYNTAX_RECIPES = [
  { q: "from:박서준 has:attachment larger:5mb", desc: "박서준이 보낸 큰 첨부" },
  { q: "is:unread -list:newsletter", desc: "뉴스레터를 뺀 안 읽은 메일" },
  { q: "label:아틀라스 after:2026-07-01", desc: "3분기 이후 프로젝트 메일" },
  { q: "is:external has:attachment filename:xlsx", desc: "사외에서 온 스프레드시트" },
  { q: "to:me is:starred older_than:3m", desc: "묵혀둔 중요 메일 정리" },
];
