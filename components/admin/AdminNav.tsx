"use client";

import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { ADMIN_NAV } from "@/lib/mock-admin";
import { useToast } from "@/context/toast-context";
import { useUiText } from "@/components/i18n/useUiText";
import type { AdminTabId } from "@/types/admin";

// Desktop sidebar for the Admin Console (/admin). `active` is null on the
// two standalone sub-routes (/admin/system, /admin/onboarding) since they
// aren't part of the ADMIN_NAV tab set.
export function AdminNav({
  active,
  onSelect,
}: {
  active: AdminTabId | null;
  onSelect: (id: AdminTabId) => void;
}) {
  const toast = useToast();
  const ui = useUiText();
  return (
    <nav
      className="flex h-full w-58 shrink-0 flex-col gap-4 p-3"
      style={{ backgroundColor: "#17181B" }}
    >
      <Link
        href="/"
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-white/50 hover:bg-white/6 hover:text-white/80"
      >
        <ArrowLeft size={13} />
        {ui("메일로 돌아가기")}
      </Link>

      <div className="flex items-center gap-2 px-1">
        <span className="flex h-6.5 w-6.5 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ backgroundColor: "#2B4BF2" }}>
          M
        </span>
        <span className="text-[13px] font-bold tracking-tight text-white">
          Admin Console
        </span>
      </div>

      <button
        type="button"
        onClick={() => toast.info(ui("이 조직은 gxsoft.co.kr 테넌트 하나뿐입니다"))}
        className="rounded-[10px] border border-white/9 bg-white/6 px-3 py-2.5 text-left hover:bg-white/9"
      >
        <p className="text-[10px] text-white/55">{ui("테넌트")}</p>
        <p className="text-[13px] font-semibold text-white">gxsoft.co.kr ▾</p>
      </button>

      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {ADMIN_NAV.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className="flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-left text-[12.5px] transition"
              style={{
                backgroundColor: isActive ? "rgba(255,255,255,.1)" : "transparent",
                color: isActive ? "#fff" : "#9A9EA5",
                fontWeight: isActive ? 600 : 500,
              }}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                style={{ backgroundColor: item.dot }}
              />
              <span className="min-w-0 flex-1 truncate">{ui(item.name)}</span>
              {item.badge && (
                <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: "#2B4BF2" }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-0.5 border-t border-white/8 pt-2">
        <Link
          href="/admin/system"
          className="rounded-[9px] px-2.5 py-2 text-[12px] text-white/55 hover:bg-white/6 hover:text-white/85"
        >
          {ui("시스템 메일 · 인쇄 · 오류")}
        </Link>
        <Link
          href="/admin/onboarding"
          className="rounded-[9px] px-2.5 py-2 text-[12px] text-white/55 hover:bg-white/6 hover:text-white/85"
        >
          {ui("조직 설치 마법사")}
        </Link>
      </div>

      <div className="mt-auto rounded-[10px] bg-white/5 p-3">
        <p className="text-[11px] text-white/55">{ui("시스템 상태")}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-white">
          <span className="h-1.75 w-1.75 rounded-full" style={{ backgroundColor: "#3FBF7F" }} />
          {ui("모든 서비스 정상")}
        </p>
        <p className="mt-1 text-[11px] text-white/40">{ui("MTA 큐 지연 0.4s · 마지막 점검 2분 전")}</p>
      </div>
    </nav>
  );
}
