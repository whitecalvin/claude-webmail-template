import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/context/theme-context";
import { MailProvider } from "@/context/mail-context";
import { ToastProvider } from "@/context/toast-context";
import { ToastStack } from "@/components/toast/ToastStack";
import { UiTextLocalizer } from "@/components/i18n/UiTextLocalizer";

// Root layout: resolves/validates the `[locale]` segment, wires up the
// three global context providers (theme, mail state, toasts), and mounts
// the toast stack once for the whole app.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

// Pre-render a static shell for every supported locale.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Makes the resolved locale available to server components (e.g. getTranslations)
  // rendered further down the tree without re-reading the route param.
  setRequestLocale(locale);
  const messages = await getMessages();
  const uiMessages = (await import(`../../i18n/ui-messages/${locale}.json`)).default as Record<string, string>;

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="h-full">
        <NextIntlClientProvider messages={{ ...messages, _ui: uiMessages }}>
          <ThemeProvider>
            <MailProvider>
              <ToastProvider>
                {children}
                <ToastStack />
                <UiTextLocalizer locale={locale} />
              </ToastProvider>
            </MailProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
