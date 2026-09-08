// Types and mock data for the notification bell popover in the top bar.
export type NotificationKind = "결재" | "멘션" | "메일" | "시스템";

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  unread: boolean;
  avatar: string;
  avatarBg: string;
  avatarFg: string;
  title: string;
  body: string;
  time: string;
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    kind: "결재",
    unread: true,
    avatar: "박",
    avatarBg: "#ECEFFE",
    avatarFg: "#2B4BF2",
    title: "결재 요청 · 박서준",
    body: "2026 상반기 클라우드 인프라 증설 예산 검토 — 내 차례입니다",
    time: "방금",
  },
  {
    id: "n2",
    kind: "멘션",
    unread: true,
    avatar: "최",
    avatarBg: "#EDEBF7",
    avatarFg: "#6B5CA8",
    title: "멘션 · 최민서",
    body: "아틀라스 3차 스프린트 리뷰 회의록에서 회원님을 언급했습니다",
    time: "12분 전",
  },
  {
    id: "n3",
    kind: "결재",
    unread: true,
    avatar: "이",
    avatarBg: "#ECEFFE",
    avatarFg: "#2B4BF2",
    title: "결재 승인됨 · 이수민",
    body: "9월 정기 워크샵 예산안이 승인되었습니다",
    time: "38분 전",
  },
  {
    id: "n4",
    kind: "메일",
    unread: false,
    avatar: "G",
    avatarBg: "#F0F0EC",
    avatarFg: "#5C6068",
    title: "새 메일 3통",
    body: "이수민, Jira, 최민서로부터 새 메일이 도착했습니다",
    time: "1시간 전",
  },
  {
    id: "n5",
    kind: "시스템",
    unread: false,
    avatar: "!",
    avatarBg: "#FDF0E4",
    avatarFg: "#B4740F",
    title: "저장 공간 82% 사용 중",
    body: "18.2GB / 50GB · 대용량 첨부파일을 정리해 보세요",
    time: "3시간 전",
  },
  {
    id: "n6",
    kind: "멘션",
    unread: false,
    avatar: "강",
    avatarBg: "#EDEBF7",
    avatarFg: "#6B5CA8",
    title: "멘션 · 강태윤",
    body: "QA 체크리스트 댓글에서 회원님을 언급했습니다",
    time: "어제",
  },
];
