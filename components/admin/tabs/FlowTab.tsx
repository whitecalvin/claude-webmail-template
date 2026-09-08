"use client";

// Admin Console > Mail Flow Rules tab: an ordered list of org-wide automatic
// mail processing rules (IF/THEN), each independently toggleable.
import { useState } from "react";
import { FLOW_RULES } from "@/lib/mock-admin";
import { AdminCard, AdminSwitch } from "../primitives";
import { useToast } from "@/context/toast-context";

export function FlowTab() {
  const toast = useToast();
  const [rules, setRules] = useState(FLOW_RULES);
  const activeCount = rules.filter((r) => r.on).length;

  const toggle = (order: number) =>
    setRules((prev) => prev.map((r) => (r.order === order ? { ...r, on: !r.on } : r)));

  const addRule = () => {
    const nextOrder = rules.length > 0 ? Math.max(...rules.map((r) => r.order)) + 1 : 1;
    setRules((prev) => [
      ...prev,
      {
        order: nextOrder,
        name: "새 규칙",
        cond: "발신자 도메인 = ...",
        act: "라벨 지정",
        hits: 0,
        on: true,
      },
    ]);
    toast.success("규칙을 추가했습니다", { sub: `${nextOrder}번째 규칙` });
  };

  return (
    <div className="grid flex-1 grid-cols-[1fr_340px] gap-4 overflow-y-auto p-7">
      <AdminCard
        title="규칙"
        action={
          <button
            type="button"
            onClick={() => toast.info("규칙 순서 변경 모드로 전환합니다")}
            className="text-[11px] font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            순서 변경
          </button>
        }
      >
        <p className="mb-3 -mt-2 text-[11px] text-(--text-muted)">
          위에서 아래 순서로 평가 · {activeCount}건 활성
        </p>
        <div className="flex flex-col gap-2">
          {rules.map((r) => (
            <div key={r.order} className="flex items-center gap-3 rounded-lg border border-(--border-app) p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/5 text-[11px] font-bold dark:bg-white/10">
                {r.order}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{r.name}</p>
                <p className="mt-1 flex flex-wrap items-center gap-1 text-[11px] text-(--text-muted)">
                  <span className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">IF {r.cond}</span>
                  →
                  <span className="rounded bg-(--color-primary)/10 px-1.5 py-0.5 text-(--color-primary)">
                    {r.act}
                  </span>
                </p>
              </div>
              <span className="shrink-0 text-[11px] text-(--text-muted)">
                {r.hits.toLocaleString()}건
              </span>
              <AdminSwitch on={r.on} onToggle={() => toggle(r.order)} />
            </div>
          ))}
        </div>
      </AdminCard>

      <div className="flex flex-col gap-4">
        <AdminCard title="규칙 만들기">
          <div className="flex flex-col gap-2.5">
            {[
              { label: "적용 대상", value: "전체 조직" },
              { label: "조건 (IF)", value: "발신자 도메인 = ..." },
              { label: "동작 (THEN)", value: "라벨 지정" },
            ].map((f) => (
              <label key={f.label} className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-(--text-muted)">{f.label}</span>
                <div className="flex h-9 items-center justify-between rounded-lg border border-(--border-app) px-2.5 text-xs">
                  {f.value}
                  <span className="text-[9px] text-(--text-muted)">▾</span>
                </div>
              </label>
            ))}
            <button
              type="button"
              onClick={addRule}
              className="mt-1 h-9 rounded-lg text-xs font-semibold text-white transition hover:brightness-110"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              규칙 추가
            </button>
          </div>
        </AdminCard>

        <AdminCard className="bg-[#FBF9F4]! border-[#EBE4D6]!">
          <p className="text-xs leading-relaxed">
            최근 7일 트래픽에 새 규칙을 적용해 영향 범위를 미리 확인합니다. 적용 대상{" "}
            <strong>1,204건</strong> · 오탐 예상 <strong>3건</strong>.
          </p>
          <button
            type="button"
            onClick={() => toast.success("시뮬레이션을 완료했습니다", { sub: "적용 대상 1,204건 · 오탐 예상 3건" })}
            className="mt-2 h-9 w-full rounded-lg border border-[#DDD3B8] bg-white text-xs font-semibold"
          >
            시뮬레이션 실행
          </button>
        </AdminCard>
      </div>
    </div>
  );
}
