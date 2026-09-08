"use client";

// Admin Console > API & Webhooks tab: API key management, webhook delivery
// status, usage graph, and OAuth-connected third-party apps.
import { useState } from "react";
import { API_KEYS, API_USAGE, CONNECTED_APPS, WEBHOOKS } from "@/lib/mock-admin";
import { AdminCard, Pill, Sparkline } from "../primitives";
import { useToast } from "@/context/toast-context";
import type { Tone } from "@/types/admin";

const API_BARS = Array.from({ length: 30 }, (_, i) => 30 + Math.round(Math.abs(Math.sin(i / 3)) * 60));

interface ApiKeyRow {
  name: string;
  owner: string;
  key: string;
  scopes: string[];
  used: string;
  state: string;
  tone: Tone;
  stale?: boolean;
}

export function ApiTab() {
  const toast = useToast();
  const [keys, setKeys] = useState<ApiKeyRow[]>(API_KEYS);
  const [apps, setApps] = useState(CONNECTED_APPS);

  const issueKey = () => {
    const suffix = Math.random().toString(16).slice(2, 6);
    setKeys((prev) => [
      { name: "새 API 키", owner: "나", key: `mw_live_${suffix}…${suffix}`, scopes: ["mail.read"], used: "-", state: "활성", tone: "success" },
      ...prev,
    ]);
    toast.success("API 키를 발급했습니다", { sub: `mw_live_${suffix}…${suffix}` });
  };

  const rotateStaleKey = () => {
    setKeys((prev) =>
      prev.map((k) => (k.stale ? { ...k, used: "방금 전", state: "활성", tone: "success", stale: false } : k))
    );
    toast.success("키를 회전했습니다", { sub: "레거시 ERP 연동" });
  };

  const disconnectApp = (name: string) => {
    setApps((prev) => prev.filter((a) => a.name !== name));
    toast.success("연동을 해제했습니다", { sub: name });
  };

  return (
    <div className="grid flex-1 grid-cols-[1.3fr_1fr] gap-4 overflow-y-auto p-7">
      <div className="flex flex-col gap-4">
        <AdminCard
          title="API 키"
          action={
            <button
              type="button"
              onClick={issueKey}
              className="text-[11px] font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              키 발급
            </button>
          }
        >
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_1fr_1fr_70px_54px] gap-2 text-[10px] font-bold uppercase text-(--text-muted)">
              <span>이름</span>
              <span>키</span>
              <span>권한</span>
              <span>마지막 사용</span>
              <span>상태</span>
            </div>
            {keys.map((k) => (
              <div key={k.name} className="grid grid-cols-[1fr_1fr_1fr_70px_54px] items-center gap-2 border-t border-(--border-app) pt-2 text-[11px]">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{k.name}</p>
                  <p className="truncate text-[10px] text-(--text-muted)">{k.owner}</p>
                </div>
                <span className="truncate font-mono text-[10.5px] text-(--text-muted)">{k.key}</span>
                <div className="flex flex-wrap gap-1">
                  {k.scopes.map((s) => (
                    <span key={s} className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-[9.5px] dark:bg-white/10">
                      {s}
                    </span>
                  ))}
                </div>
                <span className="text-(--text-muted)">{k.used}</span>
                <Pill label={k.state} tone={k.tone} />
              </div>
            ))}
          </div>

          {keys.some((k) => k.stale) && (
            <div className="mt-3 rounded-lg border border-[#F0DAD6] bg-[#FFFBFA] px-3 py-2 text-[11px] text-[#8E3B33]">
              &apos;레거시 ERP 연동&apos; 키가 90일 이상 회전되지 않았습니다.{" "}
              <button type="button" onClick={rotateStaleKey} className="font-bold underline">
                지금 회전
              </button>
            </div>
          )}
        </AdminCard>

        <AdminCard title="웹훅">
          <div className="flex flex-col gap-2">
            {WEBHOOKS.map((w) => (
              <div key={w.url} className="flex items-center gap-2 border-t border-(--border-app) pt-2 text-xs first:border-t-0 first:pt-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-[11px]">{w.url}</p>
                  <p className="text-[10.5px] text-(--text-muted)">{w.event}</p>
                </div>
                <span className="shrink-0 text-[11px] text-(--text-muted)">{w.rate}</span>
                <Pill label={w.state} tone={w.tone} />
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <div className="flex flex-col gap-4">
        <AdminCard title="사용량 (30일)">
          <div className="mb-3 grid grid-cols-3 gap-2 text-center">
            {API_USAGE.map((u) => (
              <div key={u.label}>
                <p className="text-sm font-bold">{u.value}</p>
                <p className="text-[10px] text-(--text-muted)">{u.label}</p>
              </div>
            ))}
          </div>
          <Sparkline bars={API_BARS} height={50} />
          <p className="mt-2 text-[10.5px] text-(--text-muted)">한도 500만 호출 / 월 · 초과 시 429 응답</p>
        </AdminCard>

        <AdminCard title="승인된 앱">
          {apps.length === 0 ? (
            <p className="text-xs text-(--text-muted)">연동된 앱이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {apps.map((a) => (
                <div key={a.name} className="rounded-lg border border-(--border-app) p-2.5">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-white"
                    style={{ backgroundColor: a.color }}
                  >
                    {a.icon}
                  </span>
                  <p className="mt-1.5 text-xs font-semibold">{a.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[10.5px] text-(--text-muted)">{a.users}명</p>
                    <button
                      type="button"
                      onClick={() => disconnectApp(a.name)}
                      className="text-[10.5px] font-semibold text-[#C0433B]"
                    >
                      해제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
