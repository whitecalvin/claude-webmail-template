"use client";

import { useCallback } from "react";
import { useMessages } from "next-intl";

type UiCatalogMessages = {
  _ui?: Record<string, string>;
};

// Translates bundled mock-data fields at React render time. Static interface
// copy should use named next-intl keys; this helper is only for data-shaped
// prototype content whose Korean source value is the catalog lookup key.
export function useUiText() {
  const messages = useMessages() as UiCatalogMessages;
  const catalog = messages._ui;

  return useCallback((source: string) => catalog?.[source] || source, [catalog]);
}
