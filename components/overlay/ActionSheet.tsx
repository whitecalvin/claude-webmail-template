"use client";

import { useTranslations } from "next-intl";

// Mobile-only (see `lg:hidden`) bottom action sheet — the small-screen
// equivalent of a right-click / "..." context menu on desktop.
export interface ActionSheetItem {
  label: string;
  destructive?: boolean;
  onClick: () => void;
}

export function ActionSheet({
  context,
  items,
  onClose,
}: {
  context?: string;
  items: ActionSheetItem[];
  onClose: () => void;
}) {
  const t = useTranslations("common");
  return (
    <div
      className="fixed inset-0 z-80 flex items-end justify-center p-2.5 pb-[max(10px,env(safe-area-inset-bottom))] lg:hidden"
      style={{ backgroundColor: "rgba(20,22,30,.42)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-md flex-col gap-2"
      >
        <div className="overflow-hidden rounded-[13px] bg-background text-foreground">
          {context && (
            <p className="border-b border-(--border-app) px-3.5 py-2.5 text-center text-[11.5px] leading-relaxed text-(--text-muted)">
              {context}
            </p>
          )}
          {items.map((item, i) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className={`flex min-h-11 w-full items-center justify-center text-[14px] font-semibold ${
                i < items.length - 1 ? "border-b border-(--border-app)" : ""
              }`}
              style={{ color: item.destructive ? "#C0433B" : "var(--color-primary)" }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex min-h-11 w-full items-center justify-center rounded-[13px] bg-background text-[14px] font-bold text-foreground"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}
