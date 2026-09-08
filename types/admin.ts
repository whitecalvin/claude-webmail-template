// Shared shapes for the Admin Console (nav items, status "Tone" colors,
// dashboard cards, and the mobile screen variant).
export type AdminTabId =
  | "dash"
  | "users"
  | "policy"
  | "security"
  | "flow"
  | "groups"
  | "audit"
  | "backup"
  | "reports"
  | "migration"
  | "brand"
  | "api"
  | "billing";

export interface AdminNavItem {
  id: AdminTabId;
  name: string;
  dot: string;
  badge?: string;
}

export type Tone = "success" | "warning" | "danger" | "info" | "violet" | "teal" | "neutral";

export interface Pill {
  label: string;
  tone: Tone;
}

export interface KpiCardData {
  label: string;
  value: string;
  delta: string;
  deltaUp: boolean;
  bars: number[];
}

export interface SparkBar {
  value: number;
  highlight?: boolean;
}

export interface AdminMobileRow {
  tone: Tone;
  avatar?: string;
  name: string;
  meta?: string;
  line2?: string;
  line3?: string;
  tag?: string;
  tagTone?: Tone;
  on?: boolean;
}

export interface AdminMobileScreen {
  id: string;
  navLabel: string;
  navDot: string;
  title: string;
  sub: string;
  caption: string;
  actionLabel?: string;
  chips?: string[];
  rows: AdminMobileRow[];
  footerText?: string;
  footerBtn?: string;
}
