"use client";

// Admin Console > Billing & Licensing tab: current plan, seat usage,
// license breakdown, and invoice history.
import { INVOICES, LICENSES } from "@/lib/mock-admin";
import { AdminCard, Pill, ProgressBar } from "../primitives";
import { useToast } from "@/context/toast-context";

export function BillingTab() {
  const toast = useToast();
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-7">
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4 text-white" style={{ backgroundColor: "#17181B" }}>
          <p className="text-xs text-white/55">현재 요금제</p>
          <p className="mt-1 text-lg font-bold">Enterprise 연간</p>
          <p className="mt-1 text-[11px] text-white/50">2026-04-01 ~ 2027-03-31 · 자동 갱신</p>
          <button
            type="button"
            onClick={() => toast.info("요금제 변경 화면으로 이동합니다")}
            className="mt-3 h-8 w-full rounded-lg bg-white/10 text-xs font-semibold"
          >
            요금제 변경
          </button>
        </div>

        <AdminCard>
          <p className="text-xs text-(--text-muted)">좌석 사용</p>
          <p className="mt-1 text-lg font-bold">1,284 / 1,400석</p>
          <div className="mt-2">
            <ProgressBar pct={(1284 / 1400) * 100} color="#E0AC4A" />
          </div>
          <p className="mt-1.5 text-[11px] text-(--text-muted)">잔여 116석 · 3개월 내 소진 예상</p>
        </AdminCard>

        <AdminCard>
          <p className="text-xs text-(--text-muted)">다음 청구</p>
          <p className="mt-1 text-lg font-bold">₩18,420,000</p>
          <p className="mt-1 text-[11px] text-(--text-muted)">2027-03-01 청구 예정 · 세금계산서 발행</p>
          <button
            type="button"
            onClick={() => toast.info("결제 수단 관리 화면으로 이동합니다")}
            className="mt-2 text-[11px] font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            결제 수단 관리
          </button>
        </AdminCard>
      </div>

      <AdminCard title="라이선스 구성">
        <div className="flex flex-col gap-2">
          {LICENSES.map((l) => (
            <div key={l.name} className="flex items-center justify-between border-t border-(--border-app) pt-2 text-xs first:border-t-0 first:pt-0">
              <div>
                <p className="font-semibold">{l.name}</p>
                <p className="text-[10.5px] text-(--text-muted)">{l.note}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{l.seats.toLocaleString()}석</p>
                <p className="text-[10.5px] text-(--text-muted)">{l.price}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 rounded-lg bg-[#FBF9F4] px-3 py-2 text-[11px] text-(--text-muted)">
          공공기관 조달 계약(제3자 단가) 적용 중 · 계약번호 G2B-2026-11847
        </p>
      </AdminCard>

      <AdminCard title="청구 내역">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[1fr_100px_120px_90px] gap-2 text-[10px] font-bold uppercase text-(--text-muted)">
            <span>번호</span>
            <span>날짜</span>
            <span>금액</span>
            <span>상태</span>
          </div>
          {INVOICES.map((iv) => (
            <div key={iv.no} className="grid grid-cols-[1fr_100px_120px_90px] items-center gap-2 border-t border-(--border-app) pt-2 text-xs">
              <span className="font-mono">{iv.no}</span>
              <span className="text-(--text-muted)">{iv.date}</span>
              <span className="font-semibold">{iv.amount}</span>
              <Pill label={iv.state} tone={iv.tone} />
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
