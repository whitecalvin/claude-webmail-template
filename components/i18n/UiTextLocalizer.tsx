"use client";

import { useLayoutEffect } from "react";
import { useMessages } from "next-intl";

const ATTRIBUTES = ["aria-label", "placeholder", "title"] as const;

// Localizes fixed prototype UI and bundled mock copy that has not yet been
// migrated to named next-intl keys. Runtime user input is left alone unless it
// exactly matches an extracted catalog entry.
export function UiTextLocalizer({
  locale,
}: {
  locale: string;
}) {
  const allMessages = useMessages() as { _ui?: Record<string, string> };

  useLayoutEffect(() => {
    const messages = allMessages._ui ?? {};
    if (locale === "ko" || Object.keys(messages).length === 0) return;

    const decodedMessages = new Map<string, string>();
    for (const [source, target] of Object.entries(messages)) {
      decodedMessages.set(source, target);
      decodedMessages.set(source.replaceAll("&quot;", '"').replaceAll("&amp;", "&"), target);
    }
    const replacements = [...decodedMessages.entries()]
      .filter(([source, target]) => source !== target && source.length > 1)
      .sort(([a], [b]) => b.length - a.length);
    const initials: Record<string, string> = {
      김: "K", 박: "P", 서: "S", 신: "S", 이: "L", 장: "J",
      정: "J", 최: "C", 한: "H", 황: "H", 윤: "Y",
    };

    const translate = (original: string) => {
      const compact = original.trim().replace(/\s+/g, " ");
      let translated = decodedMessages.get(compact);

      const monthDay = compact.match(/^(\d{1,2})월 (\d{1,2})일$/);
      if (!translated && monthDay) {
        translated = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" })
          .format(new Date(2000, Number(monthDay[1]) - 1, Number(monthDay[2])));
      }
      const yearMonth = compact.match(/^(\d{4})년 (\d{1,2})월$/);
      if (!translated && yearMonth) {
        translated = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" })
          .format(new Date(Number(yearMonth[1]), Number(yearMonth[2]) - 1, 1));
      }
      if (!translated && initials[compact]) translated = initials[compact];

      if (!translated && /[가-힣]/.test(compact)) {
        let composite = compact;
        for (const [source, target] of replacements) {
          if (composite.includes(source)) composite = composite.replaceAll(source, target);
        }
        if (composite !== compact) translated = composite;
      }

      return translated ? original.replace(original.trim(), translated) : original;
    };

    const localize = (root: ParentNode) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        const parent = node.parentElement;
        if (parent && !parent.closest("script, style")) {
          const original = node.textContent ?? "";
          const translated = translate(original);
          if (translated !== original) node.textContent = translated;
        }
        node = walker.nextNode();
      }

      const elements = root instanceof Element ? [root, ...root.querySelectorAll("*")] : root.querySelectorAll("*");
      for (const element of elements) {
        for (const attribute of ATTRIBUTES) {
          const original = element.getAttribute(attribute);
          if (original) element.setAttribute(attribute, translate(original));
        }
      }
    };

    localize(document.body);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData" && record.target.parentNode) localize(record.target.parentNode);
        for (const node of record.addedNodes) if (node instanceof Element) localize(node);
      }
    });
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [allMessages, locale]);

  return null;
}
