import type { UserSettings } from "@/types/user-settings";
import { CURRENT_USER } from "./current-user";

export const USER_SETTINGS_STORAGE_KEY = "gxmail:user-settings:v1";

export const DEFAULT_USER_SETTINGS: UserSettings = {
  version: 1,
  locale: { timezone: "Asia/Seoul", dateFormat: "locale", timeFormat: "24", weekStart: "monday" },
  accessibility: { fontScale: "100", highContrast: false, reduceMotion: false, enhancedFocus: false, screenReaderDetails: true, keyboardNavigation: true },
  compose: {
    senderName: CURRENT_USER.name,
    senderAddress: CURRENT_USER.email,
    font: "sans",
    defaultSignatureId: "signature-ko",
    signatureOnNew: true,
    signatureOnReply: true,
    undoSeconds: "10",
    signatures: [
      { id: "signature-ko", name: "Korean", content: `${CURRENT_USER.name}\nGXSOFT Strategy Team\nT. 02-1234-5678` },
      { id: "signature-en", name: "English", content: `Jiwoo Han\nGXSOFT Strategy Team\nT. +82 2-1234-5678` },
    ],
  },
  inbox: { density: "comfortable", previewPane: "right", conversationView: true, markRead: "2seconds", remoteImages: "contacts", pageSize: "50", dateFormat: "relative", unreadStyle: "bold" },
  sending: { defaultReply: "replyAll", quoteStyle: "below", requestReceipt: false, scheduleDefault: "off", autosaveSeconds: "30", defaultCc: "", defaultBcc: "", composeMode: "html" },
  away: { enabled: false, startDate: "2026-09-14", endDate: "2026-09-18", subject: "Out of office", internalMessage: "I am away from the office and will reply when I return.", externalMessage: "Thank you for your message. I will reply after I return.", contactsOnly: false },
  notifications: { browser: true, email: false, sound: true, weekends: false, quietStart: "22:00", quietEnd: "07:00", modes: { important: "instant", general: "digest", approval: "instant", mention: "instant", shared: "digest" } },
  labels: [
    { id: "label-atlas", name: "Project Atlas", color: "#2b4bf2", count: 18, visible: true },
    { id: "label-finance", name: "Finance", color: "#2e8b5b", count: 9, visible: true },
    { id: "label-partner", name: "External partners", color: "#e0ac4a", count: 24, visible: true },
  ],
  filters: [
    { id: "filter-jira", name: "Jira notifications", enabled: true, field: "from", value: "jira@", action: "label", actionValue: "Project Atlas" },
    { id: "filter-approval", name: "Approval requests", enabled: true, field: "subject", value: "[Approval]", action: "move", actionValue: "Inbox" },
  ],
  blockedSenders: [
    { id: "blocked-1", value: "marketing.example", type: "domain" },
    { id: "blocked-2", value: "newsletter@example.net", type: "email" },
  ],
  account: { displayName: CURRENT_USER.name, primaryEmail: CURRENT_USER.email, replyTo: CURRENT_USER.email, aliases: ["team@gxsoft.co.kr"] },
  security: { twoFactor: true, backupCodes: 7, passwordChangedAt: "2026-05-04T09:30:00+09:00", sessions: [
    { id: "session-current", device: "Windows · Chrome", location: "Seoul", current: true, lastActive: "2026-09-13T10:20:00+09:00" },
    { id: "session-phone", device: "iPhone 16 · Safari", location: "Seoul", current: false, lastActive: "2026-09-13T08:12:00+09:00" },
    { id: "session-mac", device: "MacBook Pro · Chrome", location: "Seongnam", current: false, lastActive: "2026-09-11T18:45:00+09:00" },
  ] },
  integrations: [
    { id: "calendar", connected: true, autoSync: true, lastSync: "2026-09-13T08:30:00+09:00", status: "ok" },
    { id: "approval", connected: true, autoSync: true, lastSync: "2026-09-13T08:15:00+09:00", status: "error" },
    { id: "slack", connected: false, autoSync: false, lastSync: "", status: "ok" },
    { id: "drive", connected: false, autoSync: false, lastSync: "", status: "ok" },
  ],
  shortcuts: { enabled: true, bindings: { compose: "C", search: "/", inbox: "G I", archive: "E", delete: "#", reply: "R", forward: "F" } },
};

export function mergeStoredSettings(value: unknown): UserSettings {
  if (!value || typeof value !== "object") return structuredClone(DEFAULT_USER_SETTINGS);
  const stored = value as Partial<UserSettings>;
  if (stored.version !== 1) return structuredClone(DEFAULT_USER_SETTINGS);
  return {
    ...structuredClone(DEFAULT_USER_SETTINGS),
    ...stored,
    locale: { ...DEFAULT_USER_SETTINGS.locale, ...stored.locale },
    accessibility: { ...DEFAULT_USER_SETTINGS.accessibility, ...stored.accessibility },
    compose: { ...DEFAULT_USER_SETTINGS.compose, ...stored.compose },
    inbox: { ...DEFAULT_USER_SETTINGS.inbox, ...stored.inbox },
    sending: { ...DEFAULT_USER_SETTINGS.sending, ...stored.sending },
    away: { ...DEFAULT_USER_SETTINGS.away, ...stored.away },
    notifications: { ...DEFAULT_USER_SETTINGS.notifications, ...stored.notifications, modes: { ...DEFAULT_USER_SETTINGS.notifications.modes, ...stored.notifications?.modes } },
    account: { ...DEFAULT_USER_SETTINGS.account, ...stored.account },
    security: {
      ...DEFAULT_USER_SETTINGS.security,
      ...stored.security,
      sessions: (stored.security?.sessions ?? DEFAULT_USER_SETTINGS.security.sessions).map((session) => ({
        ...session,
        lastActive: session.lastActive || DEFAULT_USER_SETTINGS.security.sessions.find((item) => item.id === session.id)?.lastActive || new Date(0).toISOString(),
      })),
    },
    integrations: (stored.integrations ?? DEFAULT_USER_SETTINGS.integrations).map((integration) => ({
      ...integration,
      status: integration.status ?? "ok",
    })),
    shortcuts: { ...DEFAULT_USER_SETTINGS.shortcuts, ...stored.shortcuts, bindings: { ...DEFAULT_USER_SETTINGS.shortcuts.bindings, ...stored.shortcuts?.bindings } },
  };
}
