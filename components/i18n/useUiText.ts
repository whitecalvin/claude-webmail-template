"use client";

import { useCallback } from "react";
import { useUiMessages } from "./UiMessagesProvider";

// Translates bundled mock-data fields at React render time. Static interface
// copy should use named next-intl keys; this helper is only for data-shaped
// prototype content whose Korean source value is the catalog lookup key.
export function useUiText() {
  const catalog = useUiMessages();

  return useCallback((source: string) => catalog[source] || source, [catalog]);
}
