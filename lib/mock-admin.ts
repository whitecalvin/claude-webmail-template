import type { AdminNavItem } from "@/types/admin";

// Mock data for the Admin Console (/admin) — one section per sidebar tab,
// in the same order as ADMIN_NAV. Grouped with a comment banner per tab below.
export const ADMIN_NAV: AdminNavItem[] = [
  { id: "dash", name: "개요", dot: "#2B4BF2" },
  { id: "users", name: "계정 · 사용자", dot: "#B9C6FA" },
  { id: "policy", name: "도메인 · 정책", dot: "#E0AC4A" },
  { id: "security", name: "보안 · 스팸", dot: "#C0433B", badge: "3" },
  { id: "flow", name: "메일 흐름 규칙", dot: "#6B5CA8" },
  { id: "groups", name: "그룹 · 메일링리스트", dot: "#E3B5B0", badge: "3" },
  { id: "audit", name: "감사 로그", dot: "#3B7A94" },
  { id: "backup", name: "백업 · 보관", dot: "#2E8B5B" },
  { id: "reports", name: "리포트 · 내보내기", dot: "#3B7A94" },
  { id: "migration", name: "메일함 이전", dot: "#E0AC4A" },
  { id: "brand", name: "브랜딩", dot: "#8E7CC3" },
  { id: "api", name: "API · 웹훅", dot: "#3B7A94" },
  { id: "billing", name: "요금 · 라이선스", dot: "#D4D4CE" },
];

export const ADMIN_HEADS: Record<
  string,
  { title: string; sub: string; cta: string }
> = {
  dash: { title: "개요", sub: "조직 전체 메일 처리 현황", cta: "리포트 내보내기" },
  users: { title: "계정 · 사용자", sub: "1,284개 계정 관리", cta: "계정 추가" },
  policy: { title: "도메인 · 정책", sub: "발신 도메인과 보안 정책", cta: "정책 저장" },
  security: { title: "보안 · 스팸", sub: "차단 · 격리 로그 및 탐지 현황", cta: "규칙 추가" },
  flow: { title: "메일 흐름 규칙", sub: "조직 전체에 적용되는 자동 처리 규칙", cta: "규칙 추가" },
  groups: { title: "그룹 · 메일링리스트", sub: "배포 리스트와 공유 메일함", cta: "그룹 만들기" },
  audit: { title: "감사 로그", sub: "모든 관리 작업의 변경 불가 기록", cta: "CSV 내보내기" },
  backup: { title: "백업 · 보관", sub: "스냅샷과 법적 보존 현황", cta: "지금 백업" },
  reports: { title: "리포트 · 내보내기", sub: "사용자 정의 리포트 생성", cta: "새 리포트" },
  migration: { title: "메일함 이전", sub: "다른 메일 시스템에서 이관 진행 현황", cta: "배치 추가" },
  brand: { title: "브랜딩", sub: "조직 아이덴티티와 로그인 화면", cta: "게시" },
  api: { title: "API · 웹훅", sub: "외부 연동 키와 이벤트 구독", cta: "키 발급" },
  billing: { title: "요금 · 라이선스", sub: "구독 및 결제 관리", cta: "청구서 보기" },
};

// ── 개요 (Dashboard) ──────────────────────────────────────────
export const KPIS = [
  { label: "오늘 처리 메일", value: "118,402", delta: "+6.2%", deltaUp: true, bars: [40, 55, 48, 62, 58, 70, 66, 74, 69, 80, 76, 88] },
  { label: "활성 계정", value: "1,272", delta: "+14", deltaUp: true, bars: [60, 61, 62, 63, 63, 64, 65, 66, 66, 67, 68, 68] },
  { label: "스팸 차단율", value: "99.1%", delta: "+0.3%", deltaUp: true, bars: [90, 91, 92, 90, 93, 94, 92, 95, 94, 96, 95, 97] },
  { label: "평균 전달 지연", value: "0.4s", delta: "-0.1s", deltaUp: true, bars: [70, 68, 65, 66, 60, 58, 55, 52, 50, 48, 45, 42] },
];

export const THROUGHPUT_CHART = [
  { day: "월", a: 62, b: 30, c: 8 },
  { day: "화", a: 70, b: 34, c: 6 },
  { day: "수", a: 58, b: 28, c: 10 },
  { day: "목", a: 74, b: 36, c: 7 },
  { day: "금", a: 80, b: 40, c: 9 },
  { day: "토", a: 34, b: 16, c: 4 },
  { day: "일", a: 28, b: 14, c: 3 },
];

export const AUTH_ROWS = [
  { name: "SPF", pct: 100, color: "#2E8B5B", status: "정상" },
  { name: "DKIM", pct: 100, color: "#2E8B5B", status: "정상" },
  { name: "DMARC", pct: 66, color: "#E0AC4A", status: "격리 정책" },
  { name: "MTA-STS", pct: 33, color: "#C0433B", status: "미적용" },
];

export const DASH_ALERTS = [
  { color: "#C0433B", title: "MTA-STS 정책 미적용", desc: "sub.gxsoft.co.kr 도메인에 TLS 강제 정책이 없습니다." },
  { color: "#E0AC4A", title: "용량 임계 계정 8건", desc: "90% 초과 계정에 자동 알림이 발송되었습니다." },
];

export const FUNNEL = [
  { name: "수신 시도", value: "249,180", pct: "100%", tone: "neutral" as const },
  { name: "스팸 · 악성 차단", value: "24,918", pct: "10.0%", tone: "danger" as const },
  { name: "격리 보류", value: "312", pct: "0.1%", tone: "warning" as const },
  { name: "정상 배달", value: "223,950", pct: "89.9%", tone: "success" as const },
  { name: "반송 · 실패", value: "1,842", pct: "0.7%", tone: "neutral" as const },
];

export const REPUTATION = [
  { domain: "gxsoft.co.kr", score: 96, spam: "0.02%", bounce: "0.4%", trend: "▲2", trendUp: true },
  { domain: "gxsoft.com", score: 91, spam: "0.05%", bounce: "0.6%", trend: "—0", trendUp: null },
  { domain: "mail.gxsoft.co.kr", score: 78, spam: "0.4%", bounce: "1.8%", trend: "▼7", trendUp: false },
];

export const QUEUE_STATS = [
  { label: "대기 중", value: "1,204" },
  { label: "재시도", value: "18" },
  { label: "실패", value: "3" },
];

export const QUEUE_ROWS = [
  { time: "15:20", what: "전사 공지 · 소방 훈련 안내 (1,284)", state: "발송 중", tone: "info" as const },
  { time: "15:12", what: "결제 청구서 배치 (312)", state: "완료", tone: "success" as const },
  { time: "14:58", what: "뉴스레터 · 9월호 (2,940)", state: "대기", tone: "neutral" as const },
];

// ── 계정 · 사용자 (Users) ──────────────────────────────────────
export const USER_FILTERS = ["부서 전체 ▾", "권한 전체 ▾", "상태: 활성 ▾"];

export const ADMIN_USERS = [
  { name: "한지우", email: "jiwoo.han@gxsoft.co.kr", dept: "전략기획팀 · 차장", role: "부서관리자", quota: "18.2 / 50 GB", pct: 36, last: "방금 전", status: "활성", initials: "한", bg: "#E4EAFE", fg: "#2B4BF2" },
  { name: "박서준", email: "seojun.park@gxsoft.co.kr", dept: "인프라팀 · 책임", role: "최고관리자", quota: "44.8 / 50 GB", pct: 90, last: "12분 전", status: "용량초과", initials: "박", bg: "#E9F3EC", fg: "#2E8B5B" },
  { name: "이수민", email: "sumin.lee@gxsoft.co.kr", dept: "재무팀 · 팀장", role: "일반", quota: "12.1 / 50 GB", pct: 24, last: "1시간 전", status: "활성", initials: "이", bg: "#FBEAE8", fg: "#C0433B" },
  { name: "최민서", email: "minseo.choi@gxsoft.co.kr", dept: "플랫폼개발팀 · 수석", role: "감사", quota: "31.0 / 50 GB", pct: 62, last: "3시간 전", status: "활성", initials: "최", bg: "#EDEBF7", fg: "#6B5CA8" },
  { name: "강태윤", email: "taeyun.kang@gxsoft.co.kr", dept: "QA팀 · 책임", role: "일반", quota: "8.4 / 50 GB", pct: 17, last: "어제", status: "정지", initials: "강", bg: "#F0F0EC", fg: "#5C6068" },
  { name: "backup-svc", email: "backup-svc@gxsoft.co.kr", dept: "시스템 · 서비스 계정", role: "API", quota: "2.0 / 50 GB", pct: 4, last: "5분 전", status: "활성", initials: "AP", bg: "#F0F0EC", fg: "#5C6068" },
];

// ── 도메인 · 정책 (Policy) ─────────────────────────────────────
export const DOMAINS = [
  { name: "gxsoft.co.kr", tag: "기본", ok: true, meta: "계정 1,180 · MX 정상 · 2023.04 등록", checks: ["SPF", "DKIM", "DMARC", "STS"] },
  { name: "gxsoft.com", tag: "별칭", ok: true, meta: "계정 92 · 글로벌 발신 전용", checks: ["SPF", "DKIM", "DMARC", "STS"] },
  { name: "sub.gxsoft.co.kr", tag: "확인 필요", ok: false, meta: "계정 12 · MTA-STS 정책 없음", checks: ["SPF", "DMARC"], failing: ["DKIM", "STS"] },
];

export const POLICY_TOGGLES = [
  { key: "spf", name: "외부 발신 도메인 인증 강제", desc: "SPF·DKIM 실패 메일을 수신 거부합니다.", on: true },
  { key: "ext", name: "외부 메일 경고 배너", desc: "조직 외부에서 온 메일 본문 상단에 배너를 표시합니다.", on: true },
  { key: "dlp", name: "기밀 문서 외부 전송 차단 (DLP)", desc: "'기밀' 라벨이 붙은 첨부의 외부 발송을 차단합니다.", on: true },
  { key: "retain", name: "메일 보관 3년 · 삭제 후 30일 복구", desc: "공공기관 기록물 관리 지침에 맞춘 보존 기간입니다.", on: true },
  { key: "sandbox", name: "첨부 파일 샌드박스 검사", desc: "실행 파일·매크로 문서를 격리 환경에서 먼저 실행합니다.", on: false },
];

export const SEND_LIMITS = [
  { name: "1인 시간당 발신", value: "500통" },
  { name: "1회 첨부 용량", value: "25 MB" },
  { name: "대용량 링크 보관", value: "14일" },
];

export const AI_ROLLOUT = [
  { name: "기술본부", count: "212명", state: "전체 배포", tone: "success" as const },
  { name: "전략기획 · 재무", count: "86명", state: "베타", tone: "info" as const },
  { name: "그 외 전사", count: "986명", state: "대기", tone: "neutral" as const },
];

// ── 보안 · 스팸 (Security) ─────────────────────────────────────
export const SEC_KPIS = [
  { icon: "⛨", value: "24,918", label: "차단 (7일)", bg: "#FBEAE8", fg: "#C0433B" },
  { icon: "◫", value: "312", label: "격리 대기", bg: "#FDF0E4", fg: "#B4740F" },
  { icon: "◎", value: "48", label: "피싱 판정", bg: "#EDEBF7", fg: "#6B5CA8" },
  { icon: "✓", value: "99.1%", label: "탐지 정확도", bg: "#E9F3EC", fg: "#2E8B5B" },
];

export const LOG_FILTERS = ["전체", "스팸", "피싱", "멀웨어"];

export const SEC_LOGS = [
  { time: "15:41:02", from: "billing@paypa1-secure.com", subject: "결제 정보 확인 필요 (피싱 의심 도메인 유사)", to: "finance-all@", score: 98, action: "차단", tone: "danger" as const, kind: "피싱" as const },
  { time: "15:22:19", from: "backup@vault-restore.ru", subject: "송장.exe 첨부 (실행파일 탐지)", to: "박서준", score: 95, action: "차단", tone: "danger" as const, kind: "멀웨어" as const },
  { time: "14:58:44", from: "notice@gxsoft-portal.net", subject: "계정 잠금 해제 요청 (스푸핑 도메인)", to: "전사", score: 88, action: "격리", tone: "warning" as const, kind: "피싱" as const },
  { time: "14:30:10", from: "partner@hanbit-tech.kr", subject: "견적서 재전송", to: "구매팀", score: 12, action: "해제", tone: "info" as const, kind: "스팸" as const },
  { time: "13:55:37", from: "news@marketing-blast.com", subject: "9월 프로모션 안내", to: "다수", score: 42, action: "통과", tone: "success" as const, kind: "스팸" as const },
];

// ── 메일 흐름 규칙 (Flow) ──────────────────────────────────────
export const FLOW_RULES = [
  { order: 1, name: "임원 메일 우선 전달", cond: "받는사람 = 임원 그룹", act: "즉시 전달 + 중요 표시", hits: 428, on: true },
  { order: 2, name: "외부→기밀 라벨 첨부 차단", cond: "라벨 = 기밀, 수신자 외부", act: "발송 차단", hits: 6, on: true },
  { order: 3, name: "대용량 첨부 링크 전환", cond: "첨부 > 10MB", act: "드라이브 링크로 전환", hits: 214, on: true },
  { order: 4, name: "채용 메일 인사팀 참조 추가", cond: "제목에 [채용] 포함", act: "인사팀 참조 추가", hits: 32, on: true },
  { order: 5, name: "해외 IP 발신 격리", cond: "발신 IP 국가 ≠ KR", act: "격리 검사", hits: 89, on: true },
  { order: 6, name: "퇴직자 메일 전달", cond: "수신자 = 퇴직 계정", act: "후임자에게 전달", hits: 5, on: false },
  { order: 7, name: "뉴스레터 벌크 분류", cond: "벌크 발신 헤더 감지", act: "'뉴스레터' 라벨", hits: 1204, on: true },
];

// ── 그룹 · 메일링리스트 (Groups) ────────────────────────────────
export const GROUPS = [
  { addr: "all@gxsoft.co.kr", name: "전사 공지", type: "배포 리스트", owner: "관리팀", members: 1284, ext: "차단", mod: "조정 필수" },
  { addr: "finance@gxsoft.co.kr", name: "재무팀", type: "배포 리스트", owner: "이수민", members: 12, ext: "허용", mod: "없음" },
  { addr: "hr@gxsoft.co.kr", name: "인사팀", type: "배포 리스트", owner: "황도윤", members: 8, ext: "허용", mod: "없음" },
  { addr: "tech-all@gxsoft.co.kr", name: "기술본부 전체", type: "배포 리스트", owner: "박서준", members: 212, ext: "차단", mod: "없음" },
  { addr: "security-alert@gxsoft.co.kr", name: "보안 경보", type: "보안 그룹", owner: "관리팀", members: 6, ext: "차단", mod: "없음" },
  { addr: "press@gxsoft.co.kr", name: "대외 홍보", type: "공유 메일함", owner: "관리팀", members: 4, ext: "허용", mod: "자동 회신" },
  { addr: "support@gxsoft.co.kr", name: "고객 지원", type: "공유 메일함", owner: "관리팀", members: 9, ext: "허용", mod: "자동 회신" },
  { addr: "exec@gxsoft.co.kr", name: "임원진", type: "보안 그룹", owner: "관리팀", members: 7, ext: "차단", mod: "없음" },
  { addr: "newsletter@gxsoft.co.kr", name: "뉴스레터 구독자", type: "배포 리스트", owner: "마케팅팀", members: 2940, ext: "차단", mod: "조정 필수" },
];

export const MODERATION_QUEUE = [
  { subject: "언론 배포용 보도자료 v2", meta: "press@ · 5분 전 · 발신: 마케팅팀" },
  { subject: "전사 인사이동 안내", meta: "all@ · 22분 전 · 발신: 인사팀" },
  { subject: "9월 뉴스레터 초안", meta: "newsletter@ · 1시간 전 · 발신: 마케팅팀" },
];

// ── 감사 로그 (Audit) ──────────────────────────────────────────
export const AUDIT_FILTERS = ["관리자 전체 ▾", "액션 전체 ▾", "최근 30일 ▾"];

export const AUDIT_LOGS = [
  { time: "15:41", admin: "박서준", action: "정책 변경", target: "sub.gxsoft.co.kr · MTA-STS 활성화", ip: "175.223.1.4", result: "성공", tone: "warning" as const, resultTone: "success" as const },
  { time: "15:20", admin: "한지우", action: "계정 정지", target: "강태윤 (QA팀)", ip: "121.66.9.201", result: "성공", tone: "danger" as const, resultTone: "success" as const },
  { time: "14:55", admin: "최민서", action: "로그 조회", target: "감사 로그 · 최근 7일", ip: "175.223.1.9", result: "성공", tone: "neutral" as const, resultTone: "success" as const },
  { time: "14:40", admin: "박서준", action: "용량 변경", target: "박서준 본인 · 50GB → 100GB", ip: "175.223.1.4", result: "성공", tone: "info" as const, resultTone: "success" as const },
  { time: "14:10", admin: "system", action: "조직도 동기화", target: "HR 시스템 → 1,284명", ip: "internal", result: "성공", tone: "teal" as const, resultTone: "success" as const },
  { time: "13:58", admin: "unknown", action: "관리자 로그인", target: "admin@gxsoft.co.kr", ip: "203.0.113.9", result: "차단", tone: "danger" as const, resultTone: "danger" as const },
  { time: "13:30", admin: "한지우", action: "도메인 추가", target: "sub.gxsoft.co.kr", ip: "175.223.1.4", result: "성공", tone: "violet" as const, resultTone: "success" as const },
  { time: "12:44", admin: "황도윤", action: "계정 생성", target: "신입사원 5명 일괄 생성", ip: "121.66.9.15", result: "성공", tone: "success" as const, resultTone: "success" as const },
  { time: "12:02", admin: "박서준", action: "격리 해제", target: "메일 4건 · finance-all@", ip: "175.223.1.4", result: "성공", tone: "info" as const, resultTone: "success" as const },
  { time: "11:38", admin: "한지우", action: "권한 변경", target: "최민서 → 감사 권한 부여", ip: "175.223.1.4", result: "성공", tone: "warning" as const, resultTone: "success" as const },
  { time: "10:55", admin: "박서준", action: "백업 복구", target: "이수민 메일함 · 9월 1일 스냅샷", ip: "175.223.1.4", result: "실패", tone: "teal" as const, resultTone: "warning" as const },
];

// ── 백업 · 보관 (Backup) ───────────────────────────────────────
export const BACKUP_KPIS = [
  { label: "최근 백업", value: "오늘 04:10", note: "소요 22분 · 성공" },
  { label: "보관 용량", value: "8.4 TB", note: "전월 대비 +312 GB" },
  { label: "복구 가능 시점", value: "1,095일", note: "일 1회 스냅샷 · 3년" },
  { label: "진행 중 복구", value: "2건", note: "예상 완료 11:40" },
];

export const RETENTION_POLICIES = [
  { name: "전사 기본 보관", scope: "전 직원", period: "3년", mode: "자동 삭제" },
  { name: "임원 · 결재 문서", scope: "임원진", period: "10년", mode: "삭제 불가" },
  { name: "공공 계약 기록물", scope: "계약 관련 라벨", period: "5년", mode: "변경 불가 보관" },
  { name: "퇴직자 메일박스", scope: "퇴직 계정", period: "1년", mode: "관리자 열람" },
];

export const RESTORE_JOBS = [
  { name: "이수민 메일함 · 9월 1일", state: "복구 중", pct: 68, tone: "info" as const, meta: "예상 완료 11:40" },
  { name: "재무팀 공유함 · 8월 28일", state: "완료", pct: 100, tone: "success" as const, meta: "3분 전 완료" },
  { name: "박서준 메일함 · 9월 3일", state: "대기", pct: 0, tone: "neutral" as const, meta: "대기열 2번째" },
  { name: "강태윤 메일함 · 8월 30일", state: "실패", pct: 24, tone: "danger" as const, meta: "저장소 인증 오류 · 재시도 필요" },
];

// ── 리포트 · 내보내기 (Reports) ─────────────────────────────────
export const REPORT_COLUMNS = [
  { name: "보낸사람", active: true },
  { name: "받는사람", active: true },
  { name: "제목", active: true },
  { name: "시각", active: true },
  { name: "크기", active: false },
  { name: "첨부 수", active: false },
  { name: "배달 상태", active: true },
  { name: "필터 판정", active: false },
  { name: "IP", active: false },
];

export const EXPORT_ROWS = [
  { name: "9월 발송 리포트", range: "9/1 – 9/7", by: "한지우", size: "4.2 MB", when: "5분 전", state: "완료", tone: "success" as const },
  { name: "보안 감사용 전체 로그", range: "8/1 – 8/31", by: "박서준", size: "생성 중", when: "-", state: "생성 중", tone: "info" as const },
  { name: "재무팀 메일 리포트", range: "7/1 – 7/31", by: "이수민", size: "1.8 MB", when: "지난주", state: "만료됨", tone: "neutral" as const },
  { name: "전사 감사 로그 (행 초과)", range: "1/1 – 8/31", by: "최민서", size: "-", when: "-", state: "실패", tone: "danger" as const },
];

export const REPORT_SCHEDULES = [
  { name: "월간 발송 리포트", cadence: "매월 1일 06:00", to: "경영지원팀 (4)", on: true },
  { name: "주간 보안 요약", cadence: "매주 월 08:00", to: "박서준", on: true },
  { name: "분기 감사 백업", cadence: "분기 첫날 03:00", to: "감사팀 (2)", on: true },
  { name: "일간 격리 현황", cadence: "매일 07:00", to: "박서준", on: false },
  { name: "요금 사용량 리포트", cadence: "매월 25일", to: "경영지원팀 (4)", on: true },
];

export const EXPORT_POLICY = [
  "내보내기는 메타데이터만 포함하며 본문은 포함되지 않습니다.",
  "모든 내보내기는 감사 로그에 기록되고 관리자 승인이 필요합니다.",
  "생성된 파일은 7일 후 자동으로 삭제됩니다.",
  "100만 행을 초과하면 자동으로 여러 파일로 분할됩니다.",
];

// ── 메일함 이전 (Migration) ─────────────────────────────────────
export const MIG_KPIS = [
  { label: "이관 완료 계정", value: "842 / 1,284", note: "65.6%" },
  { label: "이관 메일", value: "1,982만 통", note: "+184만 (24h)" },
  { label: "평균 속도", value: "1,840 통/분", note: "SLA 1,200 이상" },
  { label: "실패 · 보류", value: "1,204 통", note: "0.006%" },
];

export const MIG_BATCHES = [
  { name: "배치 1", src: "Exchange 2016", accounts: 320, pct: 100, eta: "완료", state: "완료", tone: "success" as const },
  { name: "배치 2", src: "Exchange 2016", accounts: 280, pct: 100, eta: "완료", state: "완료", tone: "success" as const },
  { name: "배치 3", src: "Google Workspace", accounts: 210, pct: 74, eta: "18분", state: "진행 중", tone: "info" as const },
  { name: "배치 4", src: "Google Workspace", accounts: 190, pct: 41, eta: "52분", state: "진행 중", tone: "info" as const },
  { name: "배치 5", src: "IMAP 기타", accounts: 140, pct: 0, eta: "대기", state: "대기", tone: "neutral" as const },
  { name: "배치 6", src: "혼합", accounts: 88, pct: 12, eta: "재시도 중", state: "재시도", tone: "warning" as const },
  { name: "배치 7", src: "IMAP 기타", accounts: 56, pct: 0, eta: "대기", state: "대기", tone: "neutral" as const },
];

export const MIG_ERRORS = [
  { reason: "사서함 용량 초과", detail: "대상 계정 저장 공간 부족", count: 412, tone: "danger" as const },
  { reason: "원본 항목 손상", detail: "읽을 수 없는 메일 항목", count: 318, tone: "warning" as const },
  { reason: "지원하지 않는 첨부", detail: "형식 변환 실패", count: 224, tone: "warning" as const },
  { reason: "중복 감지", detail: "이미 이관된 항목 건너뜀", count: 186, tone: "neutral" as const },
  { reason: "권한 거부", detail: "원본 서버 접근 권한 없음", count: 64, tone: "danger" as const },
];

// ── 브랜딩 (Brand) ─────────────────────────────────────────────
export const BRAND_FIELDS = [
  { label: "조직 표시명", value: "지엑스소프트 메일" },
  { label: "메일 발신자 표기", value: "지엑스소프트 <no-reply@gxsoft.co.kr>" },
  { label: "지원 연락처", value: "help@gxsoft.co.kr · 02-2000-1000" },
];

export const BRAND_COLORS = ["#2B4BF2", "#17181B", "#2E8B5B", "#E0AC4A", "#C0433B"];

export const BRAND_TOGGLES = [
  { key: "sig", name: "전 직원 서명 강제", on: true },
  { key: "disclaimer", name: "외부 메일에 면책 문구 추가", on: true },
  { key: "logo", name: "로고를 서명에 포함", on: false },
];

// ── API · 웹훅 (Api) ───────────────────────────────────────────
export const API_KEYS = [
  { name: "레거시 ERP 연동", owner: "박서준", key: "mw_live_8f2a…c41d", scopes: ["mail.read", "users.write"], used: "3일 전", state: "검토 필요", tone: "warning" as const, stale: true },
  { name: "결재 시스템 (그로우)", owner: "system", key: "mw_live_2c91…9a03", scopes: ["mail.read", "mail.send"], used: "방금 전", state: "활성", tone: "success" as const },
  { name: "리포트 자동화", owner: "최민서", key: "mw_live_a410…7fe2", scopes: ["export"], used: "1시간 전", state: "활성", tone: "success" as const },
  { name: "구 모바일 앱", owner: "-", key: "mw_live_00b1…de44", scopes: ["mail.read"], used: "6개월 전", state: "비활성", tone: "neutral" as const },
];

export const WEBHOOKS = [
  { url: "https://hooks.gxsoft.co.kr/mail-events", event: "mail.received", rate: "99.8%", state: "정상", tone: "success" as const },
  { url: "https://grow.gxsoft.co.kr/api/approvals", event: "approval.updated", rate: "99.9%", state: "정상", tone: "success" as const },
  { url: "https://legacy.gxsoft.co.kr/sync", event: "user.updated", rate: "82.1%", state: "재시도 중", tone: "warning" as const },
  { url: "https://old-crm.example.com/hook", event: "mail.sent", rate: "12.4%", state: "실패 다발", tone: "danger" as const },
];

export const API_USAGE = [
  { label: "호출 (30일)", value: "3.2M" },
  { label: "오류율", value: "0.4%" },
  { label: "p95 지연", value: "118ms" },
];

export const CONNECTED_APPS = [
  { name: "Slack", icon: "◆", users: 212, color: "#611f69" },
  { name: "Zoom", icon: "◉", users: 96, color: "#2d8cff" },
  { name: "Salesforce", icon: "☁", users: 44, color: "#00a1e0" },
  { name: "Notion", icon: "▦", users: 128, color: "#17181B" },
];

// ── 요금 · 라이선스 (Billing) ───────────────────────────────────
export const LICENSES = [
  { name: "Enterprise 메일 (50 GB)", note: "기본 요금제", seats: 1284, price: "₩11,000/월" },
  { name: "AI 요약 · 작성 도움", note: "부가 기능", seats: 298, price: "₩4,000/월" },
  { name: "아카이브 · eDiscovery", note: "부가 기능", seats: 1284, price: "₩2,000/월" },
  { name: "대용량 첨부 (2 GB)", note: "포함", seats: 1284, price: "—" },
];

export const INVOICES = [
  { no: "INV-2026-0301", date: "2026-03-01", amount: "₩18,420,000", state: "예정", tone: "neutral" as const },
  { no: "INV-2026-0201", date: "2026-02-01", amount: "₩18,180,000", state: "결제 완료", tone: "success" as const },
  { no: "INV-2026-0101", date: "2026-01-01", amount: "₩17,960,000", state: "결제 완료", tone: "success" as const },
  { no: "INV-2025-1201", date: "2025-12-01", amount: "₩17,820,000", state: "검토 중", tone: "warning" as const },
];
