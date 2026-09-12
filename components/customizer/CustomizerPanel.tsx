"use client";

import { Check, RotateCcw, X } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import {
  ACCENT_COLOR_OPTIONS,
  FONT_OPTIONS,
  PRIMARY_COLOR_OPTIONS,
} from "@/lib/theme-presets";
import { CustomizerSection } from "./CustomizerSection";
import { ThemePresetGallery } from "./ThemePresetGallery";
import { ColorSwatchPicker } from "./ColorSwatchPicker";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
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
        className={`fixed right-0 top-0 z-50 flex h-full w-90 max-w-[90vw] flex-col bg-background shadow-2xl transition-transform duration-300 ${
          isCustomizerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isCustomizerOpen}
        inert={!isCustomizerOpen}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-(--border-app) px-4 py-3">
          <h2 className="text-base font-semibold">테마 사용자 정의</h2>
          <IconButton
            icon={<X size={18} />}
            label="닫기"
            compact
            onClick={() => closeCustomizer({ discard: true })}
          />
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
              <ColorSwatchPicker
                label="기본 색상"
                options={PRIMARY_COLOR_OPTIONS}
                value={draft.primaryColor}
                onSelect={(v) => updateDraft({ primaryColor: v })}
              />
            </div>
            <div>
              <p className="mb-2 text-xs text-(--text-muted)">강조 색상</p>
              <ColorSwatchPicker
                label="강조 색상"
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
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToDefaults}
            leadingIcon={<RotateCcw size={14} />}
            className="text-(--text-muted)"
          >
            기본값
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => closeCustomizer({ discard: true })}
            className="ml-auto"
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!isDirty}
            onClick={() => {
              publish();
              closeCustomizer();
            }}
          >
            게시
          </Button>
        </div>
      </aside>
    </>
  );
}
