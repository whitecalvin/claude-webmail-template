"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_USER_SETTINGS, mergeStoredSettings, USER_SETTINGS_STORAGE_KEY } from "@/lib/user-settings";
import type { UserSettings } from "@/types/user-settings";

interface SettingsContextValue {
  saved: UserSettings;
  draft: UserSettings;
  hydrated: boolean;
  isDirty: boolean;
  updateSection: <K extends keyof UserSettings>(section: K, patch: Partial<UserSettings[K]>) => void;
  replaceSection: <K extends keyof UserSettings>(section: K, value: UserSettings[K]) => void;
  save: () => void;
  discard: () => void;
  reset: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function applyAccessibility(settings: UserSettings["accessibility"]) {
  const root = document.documentElement;
  root.style.setProperty("--user-font-scale", `${Number(settings.fontScale) / 100}`);
  root.dataset.highContrast = String(settings.highContrast);
  root.dataset.reduceMotion = String(settings.reduceMotion);
  root.dataset.enhancedFocus = String(settings.enhancedFocus);
  root.dataset.screenReaderDetails = String(settings.screenReaderDetails);
  root.dataset.keyboardNavigation = String(settings.keyboardNavigation);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [draft, setDraft] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let next = structuredClone(DEFAULT_USER_SETTINGS);
    try { next = mergeStoredSettings(JSON.parse(window.localStorage.getItem(USER_SETTINGS_STORAGE_KEY) ?? "null")); } catch {}
    setSaved(next); setDraft(next); setHydrated(true); applyAccessibility(next.accessibility);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => { if (hydrated) applyAccessibility(draft.accessibility); }, [draft.accessibility, hydrated]);
  useEffect(() => {
    if (!hydrated) return;
    const warn = (event: BeforeUnloadEvent) => { if (JSON.stringify(draft) !== JSON.stringify(saved)) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [draft, saved, hydrated]);

  const updateSection = useCallback(<K extends keyof UserSettings>(section: K, patch: Partial<UserSettings[K]>) => setDraft((current) => ({ ...current, [section]: Object.assign({}, current[section], patch) })), []);
  const replaceSection = useCallback(<K extends keyof UserSettings>(section: K, value: UserSettings[K]) => setDraft((current) => ({ ...current, [section]: value })), []);
  const save = useCallback(() => { setSaved(draft); try { window.localStorage.setItem(USER_SETTINGS_STORAGE_KEY, JSON.stringify(draft)); } catch {} }, [draft]);
  const discard = useCallback(() => setDraft(saved), [saved]);
  const reset = useCallback(() => setDraft(structuredClone(DEFAULT_USER_SETTINGS)), []);
  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);
  const value = useMemo(() => ({ saved, draft, hydrated, isDirty, updateSection, replaceSection, save, discard, reset }), [saved, draft, hydrated, isDirty, updateSection, replaceSection, save, discard, reset]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
}
