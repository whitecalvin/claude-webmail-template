import type {
  ColorOption,
  FontOption,
  ThemePreset,
  ThemeSettings,
} from "@/types/theme";

// Default theme values and preset options for the appearance customizer
// (components/customizer). Persisted to localStorage by ThemeProvider.
export const DEFAULT_THEME: ThemeSettings = {
  layoutStyle: "classic",
  primaryColor: "#2b4bf2",
  accentColor: "#f97316",
  fontFamily: "sans",
  density: "comfortable",
  sidebarPosition: "left",
  radius: "rounded",
  colorScheme: "light",
};

// Tokens pulled directly from the six design-system bundles in the source
// canvas (Webmail Suite {Variant}.dc.html / _ds/*/styles.css) — the "기본안"
// baseline itself is DEFAULT_THEME above, not one of these alternates.
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "broadsheet",
    label: "Broadsheet",
    description: "신문 조판 감성의 세리프, 시안·마젠타 프로세스 컬러",
    settings: {
      layoutStyle: "minimal",
      primaryColor: "#0088b0",
      accentColor: "#d6006c",
      radius: "sharp",
      density: "comfortable",
      fontFamily: "serif",
      colorScheme: "light",
    },
  },
  {
    id: "classical",
    label: "Classical",
    description: "고전적인 세리프와 브론즈 톤의 우아한 스타일",
    settings: {
      layoutStyle: "minimal",
      primaryColor: "#b68235",
      accentColor: "#ac803e",
      radius: "sharp",
      density: "comfortable",
      fontFamily: "serif",
      colorScheme: "light",
    },
  },
  {
    id: "industry",
    label: "Industry",
    description: "스틸 블루 톤의 절제된 유틸리티 스타일",
    settings: {
      layoutStyle: "classic",
      primaryColor: "#5980a6",
      accentColor: "#728fab",
      radius: "sharp",
      density: "compact",
      fontFamily: "sans",
      colorScheme: "light",
    },
  },
  {
    id: "modernist",
    label: "Modernist",
    description: "바우하우스풍 각진 그리드와 강렬한 레드-오렌지",
    settings: {
      layoutStyle: "classic",
      primaryColor: "#ec3013",
      accentColor: "#e15b47",
      radius: "sharp",
      density: "compact",
      fontFamily: "sans",
      colorScheme: "light",
    },
  },
  {
    id: "nocturne",
    label: "Nocturne",
    description: "블루퍼플 액센트의 다크 모드 앱 스타일",
    settings: {
      layoutStyle: "card",
      primaryColor: "#9184d9",
      accentColor: "#a7a1db",
      radius: "rounded",
      density: "comfortable",
      fontFamily: "sans",
      colorScheme: "dark",
    },
  },
  {
    id: "organic",
    label: "Organic",
    description: "따뜻한 테라코타·세이지 톤의 부드럽고 둥근 스타일",
    settings: {
      layoutStyle: "card",
      primaryColor: "#c67139",
      accentColor: "#7a8a5e",
      radius: "pill",
      density: "comfortable",
      fontFamily: "rounded",
      colorScheme: "light",
    },
  },
];

export const PRIMARY_COLOR_OPTIONS: ColorOption[] = [
  { label: "블루", value: "#2563eb" },
  { label: "인디고", value: "#4f46e5" },
  { label: "틸", value: "#0d9488" },
  { label: "그린", value: "#16a34a" },
  { label: "로즈", value: "#e11d48" },
  { label: "퍼플", value: "#9333ea" },
];

export const ACCENT_COLOR_OPTIONS: ColorOption[] = [
  { label: "오렌지", value: "#f97316" },
  { label: "옐로", value: "#eab308" },
  { label: "핑크", value: "#ec4899" },
  { label: "시안", value: "#06b6d4" },
  { label: "라임", value: "#84cc16" },
  { label: "그레이", value: "#64748b" },
];

export const FONT_OPTIONS: FontOption[] = [
  {
    label: "기본 (Sans)",
    value: "sans",
    stack:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Pretendard', Roboto, sans-serif",
  },
  {
    label: "세리프",
    value: "serif",
    stack: "'Noto Serif KR', Georgia, 'Times New Roman', serif",
  },
  {
    label: "모노스페이스",
    value: "mono",
    stack: "'JetBrains Mono', 'Courier New', monospace",
  },
  {
    label: "라운드",
    value: "rounded",
    stack: "'Poppins', 'Nunito', 'Segoe UI', sans-serif",
  },
];

export const RADIUS_MAP: Record<ThemeSettings["radius"], string> = {
  sharp: "0.125rem",
  rounded: "0.75rem",
  pill: "1.5rem",
};

export const DENSITY_MAP: Record<ThemeSettings["density"], string> = {
  comfortable: "1",
  compact: "0.7",
};
