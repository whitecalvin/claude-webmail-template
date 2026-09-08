"use client";

import { X, Check, RotateCcw } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import {
  ACCENT_COLOR_OPTIONS,
  FONT_OPTIONS,
  PRIMARY_COLOR_OPTIONS,
} from "@/lib/theme-presets";
import { CustomizerSection } from "./CustomizerSection";
import { ThemePresetGallery } from "./ThemePresetGallery";
import type {
  ColorScheme,
  Density,
  Radius,
  SidebarPosition,
} from "@/types/theme";

// Right-edge slide-over for live-editing the theme (context/theme-context).
// Every control here edits `draft`, which is applied to the DOM immediately;
// "게시" (publish) is what actually persists it, "취소"/backdrop click
// discards the draft back to the last published settings.

function SwatchGrid({
  options,
  value,
  onSelect,
}: {
  options: { label: string; value: string }[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          title={opt.label}
          onClick={() => onSelect(opt.value)}
          className="flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 ring-offset-(--surface-app) transition"
          style={{
            backgroundColor: opt.value,
            boxShadow: value === opt.value ? "0 0 0 2px var(--surface-app), 0 0 0 4px currentColor" : undefined,
            color: opt.value,
          }}
        >
          {value === opt.value && <Check size={14} className="text-white" />}
        </button>
      ))}
    </div>
  );
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-(--radius-app) border border-(--border-app) p-1 text-xs">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-[calc(var(--radius-app)-2px)] px-2 py-1.5 font-medium transition ${
            value === opt.value
              ? "bg-(--color-primary) text-white"
              : "text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/10"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function CustomizerPanel() {
  const { draft, updateDraft, isCustomizerOpen, closeCustomizer, publish, resetToDefaults, isDirty } =
    useTheme();

  return (
    <>
      {isCustomizerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => closeCustomizer({ discard: true })}
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[360px] max-w-[90vw] flex-col bg-(--surface-app) shadow-2xl transition-transform duration-300 ${
          isCustomizerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isCustomizerOpen}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-(--border-app) px-4 py-3">
          <h2 className="text-base font-semibold">테마 사용자 정의</h2>
          <button
            type="button"
            onClick={() => closeCustomizer({ discard: true })}
            className="rounded-(--radius-app) p-1.5 hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <CustomizerSection title="디자인 테마" defaultOpen>
            <ThemePresetGallery
              draft={draft}
              onSelect={(settings) => updateDraft(settings)}
            />
          </CustomizerSection>

          <CustomizerSection title="색상">
            <div>
              <p className="mb-2 text-xs text-(--text-muted)">기본 색상</p>
              <SwatchGrid
                options={PRIMARY_COLOR_OPTIONS}
                value={draft.primaryColor}
                onSelect={(v) => updateDraft({ primaryColor: v })}
              />
            </div>
            <div>
              <p className="mb-2 text-xs text-(--text-muted)">강조 색상</p>
              <SwatchGrid
                options={ACCENT_COLOR_OPTIONS}
                value={draft.accentColor}
                onSelect={(v) => updateDraft({ accentColor: v })}
              />
            </div>
          </CustomizerSection>

          <CustomizerSection title="화면 모드">
            <SegmentedControl<ColorScheme>
              options={[
                { label: "라이트", value: "light" },
                { label: "다크", value: "dark" },
                { label: "시스템", value: "system" },
              ]}
              value={draft.colorScheme}
              onChange={(v) => updateDraft({ colorScheme: v })}
            />
          </CustomizerSection>

          <CustomizerSection title="타이포그래피">
            <div className="space-y-2">
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => updateDraft({ fontFamily: font.value })}
                  className={`flex w-full items-center justify-between rounded-(--radius-app) border px-3 py-2 text-left text-sm transition ${
                    draft.fontFamily === font.value
                      ? "border-(--color-primary) bg-(--color-primary)/5"
                      : "border-(--border-app) hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                  style={{ fontFamily: font.stack }}
                >
                  {font.label}
                  {draft.fontFamily === font.value && (
                    <Check size={16} className="text-(--color-primary)" />
                  )}
                </button>
              ))}
            </div>
          </CustomizerSection>

          <CustomizerSection title="레이아웃">
            <div>
              <p className="mb-2 text-xs text-(--text-muted)">
                목록 밀도
              </p>
              <SegmentedControl<Density>
                options={[
                  { label: "여유롭게", value: "comfortable" },
                  { label: "압축", value: "compact" },
                ]}
                value={draft.density}
                onChange={(v) => updateDraft({ density: v })}
              />
            </div>
            <div>
              <p className="mb-2 text-xs text-(--text-muted)">
                사이드바 위치
              </p>
              <SegmentedControl<SidebarPosition>
                options={[
                  { label: "왼쪽", value: "left" },
                  { label: "오른쪽", value: "right" },
                ]}
                value={draft.sidebarPosition}
                onChange={(v) => updateDraft({ sidebarPosition: v })}
              />
            </div>
            <div>
              <p className="mb-2 text-xs text-(--text-muted)">모서리</p>
              <SegmentedControl<Radius>
                options={[
                  { label: "각짐", value: "sharp" },
                  { label: "둥글게", value: "rounded" },
                  { label: "알약형", value: "pill" },
                ]}
                value={draft.radius}
                onChange={(v) => updateDraft({ radius: v })}
              />
            </div>
          </CustomizerSection>
        </div>

        <div className="flex shrink-0 items-center gap-2 border-t border-(--border-app) p-3">
          <button
            type="button"
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 rounded-(--radius-app) px-3 py-2 text-sm text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/10"
          >
            <RotateCcw size={14} />
            기본값
          </button>
          <button
            type="button"
            onClick={() => closeCustomizer({ discard: true })}
            className="ml-auto rounded-(--radius-app) px-4 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
          >
            취소
          </button>
          <button
            type="button"
            disabled={!isDirty}
            onClick={() => {
              publish();
              closeCustomizer();
            }}
            className="rounded-(--radius-app) px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-40"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            게시
          </button>
        </div>
      </aside>
    </>
  );
}
