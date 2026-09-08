"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Check, ShieldCheck } from "lucide-react";
import { CURRENT_USER } from "@/lib/current-user";
import { useToast } from "@/context/toast-context";
import { localeNames, type Locale } from "@/i18n/routing";

// Mocked login screen: any non-empty email/password combination succeeds
// after a fake delay and sets a localStorage flag AppShell checks to run its
// session-expiry countdown — there's no real authentication.
export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const locale = useLocale() as Locale;
  const [email, setEmail] = useState(CURRENT_USER.email);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    window.setTimeout(() => {
      try {
        window.localStorage.setItem("gxmail:session", remember ? "persistent" : "session");
      } catch {
        // localStorage unavailable; proceed without persisting the session flag
      }
      router.push("/");
    }, 500);
  };

  return (
    <div className="min-h-dvh w-full bg-background xl:grid xl:grid-cols-[minmax(32rem,0.9fr)_minmax(40rem,1.1fr)]">
      <main className="flex min-h-dvh w-full flex-col px-6 py-6 sm:px-10 sm:py-8 lg:px-12 xl:px-16 2xl:py-12">
        <div className="mx-auto flex w-full max-w-md items-center gap-3">
          <span
            className="flex size-8 items-center justify-center rounded-[10px] text-sm font-bold text-white shadow-[0_8px_24px_color-mix(in_srgb,var(--color-primary)_24%,transparent)]"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            G
          </span>
          <span className="text-[17px] font-bold tracking-tight text-foreground">
            GXWebMail
          </span>
        </div>

        <div className="flex flex-1 items-center py-8 sm:py-10 2xl:py-12">
          <div className="mx-auto w-full max-w-md">
          <h1 className="text-[32px] font-bold leading-[1.15] tracking-[-0.035em] text-foreground sm:text-[36px]">
            다시 만나 반갑습니다
          </h1>
          <p className="mt-3 max-w-[38ch] break-keep text-sm leading-6 text-(--text-muted)">
            회사 계정으로 로그인하세요. SSO를 사용하는 조직은 아래 버튼으로
            바로 접속할 수 있습니다.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-(--text-muted)">
                이메일 주소
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jiwoo.han@gxsoft.co.kr"
                className="h-12 rounded-[10px] border border-(--border-app) bg-black/1.5 px-3.5 text-sm text-foreground outline-none transition duration-200 focus:border-(--color-primary) focus:bg-transparent focus:ring-3 focus:ring-blue-500/10 dark:bg-white/3"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-(--text-muted)">
                비밀번호
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="h-12 rounded-[10px] border border-(--border-app) bg-black/1.5 px-3.5 text-sm text-foreground outline-none transition duration-200 focus:border-(--color-primary) focus:bg-transparent focus:ring-3 focus:ring-blue-500/10 dark:bg-white/3"
              />
            </label>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setRemember((v) => !v)}
                role="checkbox"
                aria-checked={remember}
                className="flex items-center gap-2 rounded-md text-[13px] font-medium text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2"
              >
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-[5px]"
                  style={{
                    backgroundColor: remember ? "var(--color-primary)" : "transparent",
                    border: remember ? "none" : "1px solid var(--border-app)",
                  }}
                >
                  {remember && <Check size={10} strokeWidth={3} className="text-white" />}
                </span>
                로그인 상태 유지
              </button>
              <Link
                href="#reset"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("비밀번호 재설정 메일을 보냅니다", { sub: email || "이메일을 먼저 입력하세요" });
                }}
                className="rounded text-[13px] font-medium text-(--text-muted) outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2"
              >
                비밀번호 찾기
              </Link>
            </div>

            {error && (
              <p role="alert" className="text-xs font-medium text-(--status-danger)">
                {error}
              </p>
            )}

            <div className="mt-1 flex flex-col gap-2.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 items-center justify-center rounded-[10px] text-sm font-semibold text-white shadow-[0_10px_28px_color-mix(in_srgb,var(--color-primary)_22%,transparent)] outline-none transition duration-200 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 disabled:translate-y-0 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {isSubmitting ? "로그인 중..." : "로그인"}
              </button>
              <button
                type="button"
                onClick={() => toast.info("SAML SSO 로그인 화면으로 이동합니다", { sub: "조직 관리자에게 문의하세요" })}
                className="flex h-11 items-center justify-center gap-2 rounded-[10px] border border-(--border-app) bg-background text-[13px] font-semibold text-(--text-muted) outline-none transition duration-200 hover:border-(--text-muted) hover:text-foreground active:translate-y-px focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2 dark:hover:bg-white/3"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-(--text-app) text-[9px] font-extrabold text-(--surface-app)">
                  S
                </span>
                조직 계정 (SAML) 으로 계속
              </button>
            </div>
          </form>

          <div className="mt-6 flex items-start gap-3 border-l-2 border-(--color-primary) bg-black/2.5 px-3.5 py-3 dark:bg-white/4">
            <span
              className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-primary) 15%, transparent)",
                color: "var(--color-primary)",
              }}
            >
              <ShieldCheck size={14} />
            </span>
            <p className="text-xs leading-relaxed text-(--text-muted)">
              2단계 인증이 활성화된 계정입니다. 로그인 후 OTP 6자리를 입력하세요.
            </p>
          </div>
          <p className="mt-7 text-sm text-(--text-muted) xl:hidden">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="rounded font-semibold text-(--color-primary) outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2">
              회원가입
            </Link>
          </p>
          </div>
        </div>

        <footer className="mx-auto flex w-full max-w-md flex-col gap-3 border-t border-(--border-app) pt-5 text-[11px] text-(--text-muted) sm:flex-row sm:items-center sm:justify-between sm:border-0 sm:pt-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                toast.info("이용약관을 엽니다");
              }}
              className="rounded outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-(--color-primary)"
            >
              이용약관
            </Link>
            <Link
              href="#privacy"
              onClick={(e) => {
                e.preventDefault();
                toast.info("개인정보 처리방침을 엽니다");
              }}
              className="rounded outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-(--color-primary)"
            >
              개인정보 처리방침
            </Link>
          </div>
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <span>{localeNames[locale]}</span>
            <Link href="/setup" className="rounded font-medium outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-(--color-primary)">
              서버 설치 마법사
            </Link>
          </div>
        </footer>
      </main>

      <aside className="relative hidden min-h-dvh overflow-hidden bg-[#17181B] xl:flex">
        <div
          className="pointer-events-none absolute"
          style={{
            inset: "auto -140px -220px auto",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 0%, transparent) 70%)",
            opacity: 0.42,
          }}
        />

        <div className="relative mx-auto flex w-full max-w-2xl flex-col px-16 py-12 2xl:px-20 2xl:py-16">
          <div className="my-auto py-12">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-white/50">
              Enterprise mail platform
            </p>
            <h2 className="mt-4 max-w-[14ch] text-balance break-keep text-[42px] font-bold leading-[1.12] tracking-[-0.04em] text-white 2xl:text-[48px]">
              하루 12만 통의 메일을 흔들림 없이 처리합니다
            </h2>

            <div className="mt-10 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center border-y border-white/10 py-6">
            {[
              { value: "99.99%", label: "가동률 SLA" },
              { value: "2 GB", label: "대용량 첨부" },
              { value: "ISMS-P", label: "인증 획득" },
            ].flatMap((stat, index) => [
              <div key={stat.label} className={index === 1 ? "px-5" : index === 2 ? "pl-5" : "pr-5"}>
                <p className="text-xl font-semibold tracking-tight text-white tabular-nums">{stat.value}</p>
                <p className="mt-1.5 text-[11px] text-white/50">{stat.label}</p>
              </div>,
              ...(index < 2 ? [<span key={`${stat.label}-divider`} className="h-10 w-px bg-white/10" />] : []),
            ])}
            </div>

            <p className="mt-8 text-sm text-white/75">
              계정이 없으신가요?{" "}
              <Link href="/signup" className="rounded font-semibold text-white underline decoration-white/40 underline-offset-4 outline-none transition hover:decoration-white focus-visible:ring-2 focus-visible:ring-white">
                회원가입
              </Link>
            </p>
          </div>

          <p className="text-xs text-white/40">
            © 2026 GXWebMail. 공공·교육기관 조달 등록 제품.
          </p>
        </div>
      </aside>
    </div>
  );
}
