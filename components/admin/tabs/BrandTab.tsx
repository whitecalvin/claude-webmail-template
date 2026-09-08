"use client";

// Admin Console > Branding tab: org identity, brand color, signature
// template toggles, and a live login-screen preview.
import { useState } from "react";
import { Check, Upload } from "lucide-react";
import { BRAND_COLORS, BRAND_FIELDS, BRAND_TOGGLES } from "@/lib/mock-admin";
import { AdminCard, AdminSwitch } from "../primitives";
import { useToast } from "@/context/toast-context";

export function BrandTab() {
  const toast = useToast();
  const [selectedColor, setSelectedColor] = useState(BRAND_COLORS[0]);
  const [toggles, setToggles] = useState(BRAND_TOGGLES);

  const toggle = (key: string) =>
    setToggles((prev) => prev.map((t) => (t.key === key ? { ...t, on: !t.on } : t)));

  return (
    <div className="grid flex-1 grid-cols-2 gap-4 overflow-y-auto p-7">
      <div className="flex flex-col gap-4">
        <AdminCard title="조직 아이덴티티">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toast.info("로고 파일 선택 창을 엽니다")}
              className="flex h-[88px] w-[88px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-(--border-app) text-(--text-muted) transition hover:bg-black/[.02] dark:hover:bg-white/[.03]"
            >
              <Upload size={18} />
              <span className="text-[10px] font-semibold">교체</span>
            </button>
            <div className="flex flex-1 flex-col gap-2.5">
              {BRAND_FIELDS.map((f) => (
                <label key={f.label} className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-(--text-muted)">{f.label}</span>
                  <div className="flex h-8 items-center rounded-lg border border-(--border-app) px-2.5 text-xs">
                    {f.value}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <p className="mb-1.5 mt-3 text-[11px] font-semibold text-(--text-muted)">브랜드 색</p>
          <div className="flex gap-2">
            {BRAND_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(c)}
                className="flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 ring-offset-(--surface-app)"
                style={{
                  backgroundColor: c,
                  boxShadow: selectedColor === c ? "0 0 0 2px var(--surface-app), 0 0 0 4px currentColor" : undefined,
                  color: c,
                }}
              >
                {selectedColor === c && <Check size={14} className="text-white" />}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[10.5px] text-(--text-muted)">로그인 화면 · 시스템 메일에 적용</p>
        </AdminCard>

        <AdminCard title="전사 서명 템플릿">
          <div className="rounded-lg border border-(--border-app) bg-black/[.015] p-3 text-xs leading-relaxed dark:bg-white/[.02]">
            <p>{"{이름} · {부서} {직급}"}</p>
            <p className="text-(--text-muted)">지엑스소프트 주식회사</p>
            <p className="text-(--text-muted)">{"{이메일} · {전화}"}</p>
            <p style={{ color: "var(--color-primary)" }}>gxsoft.co.kr</p>
          </div>
          <div className="mt-3 flex flex-col gap-2.5">
            {toggles.map((t) => (
              <div key={t.key} className="flex items-center justify-between">
                <span className="text-xs font-semibold">{t.name}</span>
                <AdminSwitch on={t.on} onToggle={() => toggle(t.key)} />
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <AdminCard title="로그인 화면 미리보기">
        <p className="mb-2 -mt-2 text-[11px] text-(--text-muted)">mail.gxsoft.co.kr</p>
        <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-(--border-app)">
          <div className="flex flex-col gap-2.5 bg-white p-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-(--text-muted)">회사 이메일</span>
              <div className="h-7 rounded border border-(--border-app)" />
            </div>
            <div
              className="flex h-7 items-center justify-center rounded text-[11px] font-semibold text-white"
              style={{ backgroundColor: selectedColor }}
            >
              계속
            </div>
            <p className="text-center text-[10px] text-(--text-muted)">회사 계정(SSO)으로 로그인</p>
            <p className="mt-2 border-t border-(--border-app) pt-2 text-[9px] text-(--text-muted)">
              사내 시스템입니다. 승인된 사용자만 접근할 수 있습니다.
            </p>
          </div>
          <div
            className="flex flex-col justify-center gap-1 p-4 text-white"
            style={{ background: `linear-gradient(160deg, ${selectedColor}, #1E38C4)` }}
          >
            <p className="text-sm font-bold leading-snug">일하는 방식을 바꾸는 메일</p>
            <p className="text-[10px] text-white/70">
              배경 이미지와 문구는 조직별로 교체할 수 있습니다.
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => toast.info("배경 이미지 선택 창을 엽니다")}
            className="h-8 rounded-lg border border-(--border-app) px-3 text-xs font-semibold"
          >
            배경 교체
          </button>
          <button
            type="button"
            onClick={() => toast.info("문구 편집 화면을 엽니다")}
            className="h-8 rounded-lg border border-(--border-app) px-3 text-xs font-semibold"
          >
            문구 편집
          </button>
          <button
            type="button"
            onClick={() => toast.success("브랜딩 변경사항을 게시했습니다", { sub: "mail.gxsoft.co.kr" })}
            className="ml-auto h-8 rounded-lg px-4 text-xs font-semibold text-white"
            style={{ backgroundColor: "#17181B" }}
          >
            게시
          </button>
        </div>
      </AdminCard>
    </div>
  );
}
