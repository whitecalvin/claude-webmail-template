export const SETTINGS_MESSAGES_KO = {
  title: "설정",
  navigationLabel: "설정 메뉴",
  groups: { general: "일반", mail: "메일", management: "메일 관리", account: "계정" },
  nav: {
    locale: "언어 및 지역", theme: "테마 및 화면", accessibility: "접근성",
    signature: "작성 및 서명", "inbox-display": "받은편지함 및 읽기", sending: "보내기 및 답장", away: "부재중 자동응답", notifications: "알림",
    labels: "라벨", filters: "필터 및 자동 분류", "blocked-senders": "차단된 발신자",
    account: "계정 및 발신 주소", security: "보안 및 로그인", integrations: "연동 서비스", shortcuts: "단축키",
  },
  unsaved: { title: "저장하지 않은 변경 사항이 있습니다", description: "이 페이지를 나가면 변경 사항이 사라집니다.", leave: "변경 사항 버리기", stay: "계속 편집" },
  common: {
    save: "저장", cancel: "취소", reset: "기본값 복원", saved: "저장됨", unsaved: "저장하지 않은 변경 사항", savedToast: "설정을 저장했습니다",
    all: "전체", edit: "수정", delete: "삭제", preview: "미리보기", done: "완료", settings: "설정", current: "현재 기기", connected: "연결됨", disconnected: "연결 안 됨", syncFailed: "동기화 실패",
    neverSynced: "동기화 기록 없음", lastSync: "마지막 동기화: {value}", lastActive: "마지막 활동: {value}", passwordChanged: "마지막 변경: {value}", messageCount: "메일 {count}개", remainingCount: "{count}개 남음",
  },
  empty: { items: "표시할 항목이 없습니다" },
  descriptions: {
    locale: "메일에 표시되는 언어, 날짜, 시간대 형식을 관리합니다.", theme: "업무 화면의 디자인 테마와 레이아웃을 설정합니다.", accessibility: "읽기 편의와 키보드·보조 기술 사용 환경을 조정합니다.",
    signature: "발신 정보와 메일 서명, 작성 기본값을 관리합니다.", signatureList: "새 메일과 답장에 사용할 서명을 선택합니다.", inbox: "메일 목록과 읽기 화면의 표시 방식을 설정합니다.", sending: "답장, 인용, 자동 저장과 발송 기본값을 설정합니다.", away: "지정된 기간에 자동으로 보낼 응답을 설정합니다.", notifications: "메일 종류와 채널별 알림 방식을 설정합니다.",
    labels: "메일 분류에 사용하는 라벨을 만들고 순서를 관리합니다.", filters: "조건에 맞는 메일을 자동으로 분류하고 처리합니다.", blockedSenders: "수신을 차단할 이메일 주소와 도메인을 관리합니다.", account: "표시 이름, 회신 주소와 발신 별칭을 관리합니다.", security: "2단계 인증과 로그인된 기기를 관리합니다.", twoFactor: "로그인 시 추가 인증 단계로 계정을 보호합니다.", integrations: "캘린더, 결재와 외부 서비스 연결을 관리합니다.", shortcuts: "키보드 단축키를 활성화하고 원하는 키로 변경합니다.",
  },
  sections: {
    languageRegion: "언어 및 지역 형식", themePreset: "디자인 테마", appearance: "화면 모양", readability: "읽기 및 탐색",
    senderDefaults: "발신 기본값", signatures: "서명", inboxLayout: "목록 및 읽기 화면", replyDefaults: "작성 및 답장 기본값", awaySchedule: "자동응답 일정과 메시지",
    notificationChannels: "알림 채널", notificationRules: "메일 종류별 알림", quietHours: "방해 금지 시간",
    labels: "라벨 목록", filters: "필터 규칙", blockedSenders: "차단 목록", accountIdentity: "계정 정보", aliases: "발신 별칭",
    authentication: "인증", sessions: "로그인된 기기", recentActivity: "최근 로그인 활동", integrations: "연동 목록", shortcuts: "단축키 목록",
  },
  fields: {
    displayLanguage: "표시 언어", timezone: "시간대", dateFormat: "날짜 형식", timeFormat: "시간 형식", weekStart: "주 시작일",
    colorScheme: "화면 모드", density: "목록 밀도", radius: "모서리 스타일", sidebarPosition: "사이드바 위치", sidebarCollapsed: "사이드바를 접힌 상태로 시작",
    fontScale: "글자 크기", highContrast: "고대비 모드", reduceMotion: "모션 효과 줄이기", enhancedFocus: "포커스 표시 강화", screenReaderDetails: "스크린 리더 상세 설명", keyboardNavigation: "키보드 탐색 보조",
    senderName: "보내는 이름", senderAddress: "기본 발신 주소", defaultFont: "기본 글꼴", undoSend: "전송 취소 시간", defaultSignature: "기본 서명", signatureOnNew: "새 메일에 서명 사용", signatureOnReply: "답장과 전달에 서명 사용", signatureName: "서명 이름", signatureContent: "서명 내용",
    previewPane: "미리보기 창", conversationView: "대화형 보기", markRead: "읽음 처리 시점", remoteImages: "외부 이미지", pageSize: "페이지당 메일 수", mailDateFormat: "메일 날짜 표시", unreadStyle: "읽지 않은 메일 강조",
    defaultReply: "기본 답장 방식", quoteStyle: "원문 포함 방식", requestReceipt: "수신 확인 요청", scheduleDefault: "예약 발송 기본값", autosaveSeconds: "자동 저장 주기", composeMode: "작성 형식", defaultCc: "기본 참조", defaultBcc: "기본 숨은 참조",
    awayEnabled: "부재중 자동응답 사용", startDate: "시작일", endDate: "종료일", subject: "제목", internalMessage: "내부 사용자 메시지", externalMessage: "외부 사용자 메시지", contactsOnly: "연락처에만 외부 응답",
    browserNotifications: "브라우저 알림", emailNotifications: "이메일 요약 알림", notificationSound: "알림 소리", quietStart: "시작 시간", quietEnd: "종료 시간", weekendNotifications: "주말에도 알림",
    labelVisible: "메일 목록에 표시", labelName: "라벨 이름", labelColor: "라벨 색상", filterEnabled: "필터 활성화", filterName: "필터 이름", condition: "조건", conditionValue: "조건 값", action: "동작", actionValue: "동작 값",
    senderOrDomain: "이메일 주소 또는 도메인", displayName: "표시 이름", primaryEmail: "기본 이메일", replyTo: "회신 주소", newAlias: "새 발신 별칭",
    twoFactor: "2단계 인증", backupCodes: "백업 코드", password: "비밀번호", currentPassword: "현재 비밀번호", newPassword: "새 비밀번호", confirmPassword: "새 비밀번호 확인", autoSync: "자동 동기화", shortcutsEnabled: "키보드 단축키 사용",
  },
  options: {
    timezones: { Asia_Seoul: "서울 (GMT+9)", Asia_Tokyo: "도쿄 (GMT+9)", Asia_Shanghai: "상하이 (GMT+8)", Europe_London: "런던", America_New_York: "뉴욕", America_Los_Angeles: "로스앤젤레스" },
    dateFormat: { locale: "지역 형식", iso: "연-월-일", long: "전체 날짜" }, timeFormat: { "12": "12시간", "24": "24시간" }, weekStart: { sunday: "일요일", monday: "월요일" },
    colorScheme: { light: "라이트", dark: "다크", system: "시스템" }, density: { comfortable: "여유롭게", compact: "압축" }, radius: { sharp: "각지게", rounded: "둥글게", pill: "알약형" }, sidebarPosition: { left: "왼쪽", right: "오른쪽" }, font: { sans: "산세리프", serif: "세리프", mono: "고정폭" }, seconds: "{value}초",
    previewPane: { right: "오른쪽", bottom: "아래", off: "사용 안 함" }, markRead: { immediate: "즉시", "2seconds": "2초 후", manual: "직접 처리" }, remoteImages: { always: "항상 표시", contacts: "연락처만 표시", never: "표시 안 함" }, pageSize: { "25": "25개", "50": "50개", "100": "100개" }, mailDateFormat: { relative: "상대 날짜", short: "간단한 날짜", full: "전체 날짜" }, unreadStyle: { bold: "굵게", highlight: "배경 강조", dot: "표시점" },
    defaultReply: { reply: "답장", replyAll: "전체 답장" }, quoteStyle: { inline: "인라인 인용", below: "답장 아래에 원문", none: "원문 제외" }, scheduleDefault: { off: "사용 안 함", nextMorning: "다음 날 오전", custom: "마지막 설정 유지" }, autosaveSeconds: { "15": "15초", "30": "30초", "60": "1분" }, composeMode: { html: "서식 있는 메일", plain: "일반 텍스트" },
    notificationMode: { instant: "즉시 알림", digest: "1시간 요약", off: "알림 없음" },
    filterField: { from: "보낸 사람", to: "받는 사람", subject: "제목", body: "본문", attachment: "첨부 파일", size: "메일 크기" }, filterAction: { move: "폴더로 이동", label: "라벨 적용", star: "중요 표시", read: "읽음 처리", forward: "전달", delete: "삭제" }, senderType: { email: "이메일", domain: "도메인" },
  },
  notificationTypes: { important: "중요 메일", general: "일반 메일", approval: "결재 요청", mention: "멘션", shared: "공용 편지함" },
  actions: {
    addSignature: "서명 추가", editSignature: "서명 수정", addLabel: "라벨 추가", editLabel: "라벨 수정", moveUp: "위로 이동", moveDown: "아래로 이동",
    addFilter: "필터 추가", editFilter: "필터 수정", test: "테스트", search: "검색", block: "차단", unblock: "차단 해제", add: "추가",
    regenerate: "재발급", changePassword: "비밀번호 변경", logoutOthers: "다른 기기 모두 로그아웃", logout: "로그아웃", sync: "동기화", connect: "연결", disconnect: "연결 해제", testNotification: "테스트 알림", viewShortcutReference: "전체 단축키 보기",
  },
  errors: {
    dateRange: "종료일은 시작일 이후여야 합니다.", duplicateLabel: "같은 이름의 라벨이 이미 있습니다.", invalidSender: "올바른 이메일 주소 또는 도메인을 입력하세요.", duplicateSender: "이미 차단된 주소입니다.", invalidEmail: "올바른 이메일 주소를 입력하세요.", requiredName: "표시 이름을 입력하세요.", duplicateAlias: "이미 등록된 발신 주소입니다.", shortcutConflict: "{action} 단축키와 충돌합니다.", passwordRequired: "현재 비밀번호를 입력하세요.", passwordLength: "새 비밀번호는 8자 이상이어야 합니다.", passwordMismatch: "새 비밀번호가 일치하지 않습니다.",
  },
  preview: { unreadSubject: "읽지 않은 메일 제목", unreadBody: "목록 표시 설정을 여기에서 미리 확인할 수 있습니다.", conversationCount: "대화에 메일 {count}개" },
  confirm: {
    deleteSignature: "이 서명을 삭제할까요?", deleteLabel: "이 라벨을 삭제할까요?", deleteFilter: "이 필터를 삭제할까요?", deleteAlias: "이 발신 별칭을 삭제할까요?", unblockSender: "차단을 해제할까요?", disconnect: "서비스 연결을 해제할까요?",
    codes: "백업 코드를 다시 발급할까요?", all: "다른 모든 기기에서 로그아웃할까요?", session: "이 기기에서 로그아웃할까요?",
  },
  toast: {
    labelDeleted: "라벨을 삭제했습니다", filterDeleted: "필터를 삭제했습니다", filterMatched: "테스트 메일이 필터 조건과 일치합니다", aliasDeleted: "발신 별칭을 삭제했습니다", senderBlocked: "발신자를 차단 목록에 추가했습니다", senderUnblocked: "발신자 차단을 해제했습니다", codesRegenerated: "백업 코드를 재발급했습니다", sessionsRevoked: "다른 기기에서 모두 로그아웃했습니다", sessionRevoked: "기기에서 로그아웃했습니다", passwordChanged: "비밀번호를 변경했습니다", syncComplete: "동기화를 완료했습니다", integrationConnected: "서비스를 연결했습니다", integrationDisconnected: "서비스 연결을 해제했습니다", testNotification: "GXWebMail 테스트 알림입니다",
  },
  integrations: {
    names: { calendar: "회사 캘린더", approval: "전자결재", slack: "Slack", drive: "Google Drive" },
    scopes: { calendar: "일정 읽기 및 쓰기", approval: "결재 요청 동기화 및 처리", slack: "중요 메일 알림 전송", drive: "첨부 파일을 링크로 전송" },
  },
  shortcutActions: { compose: "새 메일 작성", search: "메일 검색", inbox: "받은편지함으로 이동", archive: "보관", delete: "삭제", reply: "답장", forward: "전달" },
} as const;

export function localizeSettingsMessages(catalog: Record<string, string>) {
  const localize = (value: unknown): unknown => {
    if (typeof value === "string") return catalog[value] ?? value;
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localize(item)]));
    return value;
  };
  return localize(SETTINGS_MESSAGES_KO);
}
