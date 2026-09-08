"use client";

import { SECURITY_DEVICES, SECURITY_METHODS } from "@/lib/mock-security";
import type { SecurityDevice } from "@/lib/mock-security";
import { useToast } from "@/context/toast-context";

// Read-only-ish mobile security summary (score, auth methods, signed-in
// devices) reached from Settings > 계정 보안. The full interactive version
// with revoke/reissue actions lives at app/security/page.tsx.

const TONE_STYLE: Record<SecurityDevice["tone"], string> = {
  success: "bg-(--status-success-bg) text-(--status-success)",
  warning: "bg-(--status-warning-bg) text-(--status-warning)",
  danger: "bg-(--status-danger-bg) text-(--status-danger)",
  neutral: "bg-black/[.06] text-(--text-muted) dark:bg-white/[.08]",
};

function DeviceRow({ device }: { device: SecurityDevice }) {
  return (
    <div
      className="flex items-center gap-3 rounded-[11px] border px-3.5 py-3"
      style={{
        borderColor: device.highlighted ? "var(--status-danger)" : "var(--border-app)",
        backgroundColor: device.highlighted ? "var(--status-danger-bg)" : "transparent",
      }}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{device.name}</p>
        <p className="truncate text-xs text-(--text-muted)">{device.desc}</p>
      </div>
      {device.tag && (
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${TONE_STYLE[device.tone]}`}
        >
          {device.tag}
        </span>
      )}
    </div>
  );
}

export function SecurityMobileView() {
  const toast = useToast();
  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
      <div className="rounded-[12px] border border-(--border-app) p-4">
        <p className="text-xs font-semibold text-(--text-muted)">보안 점수</p>
        <p className="mt-1 text-2xl font-bold">72 / 100</p>
        <p className="mt-1 text-xs text-(--text-muted)">개선 가능한 항목 3건</p>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold text-(--text-muted)">인증 수단</p>
        <div className="flex flex-col gap-2">
          {SECURITY_METHODS.map((m) => (
            <DeviceRow key={m.name} device={m} />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold text-(--text-muted)">로그인된 기기</p>
        <div className="flex flex-col gap-2">
          {SECURITY_DEVICES.map((d) => (
            <DeviceRow key={d.name} device={d} />
          ))}
        </div>
      </div>

      <div className="mt-auto flex items-center gap-3 rounded-[11px] bg-black/[.03] p-3.5 dark:bg-white/[.04]">
        <p className="flex-1 text-xs leading-relaxed text-(--text-muted)">
          비밀번호 변경 132일 전 · 180일마다 필요
        </p>
        <button
          type="button"
          onClick={() => toast.info("비밀번호 변경 화면을 엽니다")}
          className="h-9 shrink-0 rounded-[9px] bg-(--text-app) px-3.5 text-xs font-semibold text-(--surface-app)"
        >
          변경
        </button>
      </div>
    </div>
  );
}
