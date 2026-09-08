import { defineRouting } from 'next-intl/routing';

// The 10 locales supported by GXWebMail. Keep this list aligned with messages/*.
export const locales = ['ko', 'en', 'de', 'es', 'fr', 'it', 'pt', 'ja', 'zh', 'zh-hant'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ko';

export const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  pt: 'Português',
  ja: '日本語',
  zh: '简体中文',
  'zh-hant': '繁體中文',
};

export const routing = defineRouting({
  locales,
  defaultLocale,
});
