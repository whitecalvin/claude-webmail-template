import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { localizeSettingsMessages } from "@/lib/settings-messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const [messages, uiMessages] = await Promise.all([
    import(`../messages/${locale}.json`).then((module) => module.default),
    import(`./ui-messages/${locale}.json`).then((module) => module.default as Record<string, string>),
  ]);
  return {
    locale,
    messages: { ...messages, settingsSystem: localizeSettingsMessages(uiMessages) },
  };
});
