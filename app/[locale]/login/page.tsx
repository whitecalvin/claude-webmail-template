"use client";

import { useState, type FormEvent } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { Check, ShieldCheck } from "lucide-react";
import { CURRENT_USER } from "@/lib/current-user";
import { useToast } from "@/context/toast-context";

// Mocked login screen: any non-empty email/password combination succeeds
// after a fake delay and sets a localStorage flag AppShell checks to run its
// session-expiry countdown — there's no real authentication.
export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
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
    <div className="flex min-h-dvh w-full lg:grid lg:grid-cols-2">
      <div className="flex w-full flex-col px-6 py-10 sm:px-12 lg:px-[72px] lg:py-16">
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-[10px] text-sm font-bold text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            G
          </span>
          <span className="text-[17px] font-bold tracking-tight text-(--text-app)">
            GXWebMail
          </span>
        </div>

        <div className="my-auto w-full max-w-[392px] py-10">
          <h1 className="text-[32px] font-bold leading-[1.2] tracking-tight text-(--text-app)">
            다시 만나 반갑습니다
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-(--text-muted)">
            회사 계정으로 로그인하세요. SSO를 사용하는 조직은 아래 버튼으로
            바로 접속할 수 있습니다.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-(--text-muted)">
                이메일 주소
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jiwoo.han@gxsoft.co.kr"
                className="h-[46px] rounded-[10px] border border-(--border-app) bg-black/[.015] px-3.5 text-sm text-(--text-app) outline-none transition focus:border-(--color-primary) focus:bg-transparent focus:shadow-[0_0_0_3px_var(--color-primary)/15] dark:bg-white/[.03]"
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
                className="h-[46px] rounded-[10px] border border-(--border-app) bg-black/[.015] px-3.5 text-sm text-(--text-app) outline-none transition focus:border-(--color-primary) focus:bg-transparent dark:bg-white/[.03]"
              />
            </label>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setRemember((v) => !v)}
                className="flex items-center gap-2 text-[13px] font-medium text-(--text-app)"
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
                className="text-[13px] font-medium text-(--text-muted) hover:text-(--text-app)"
              >
                비밀번호 찾기
              </Link>
            </div>

            {error && (
              <p className="text-xs font-medium text-(--status-danger)">
                {error}
              </p>
            )}

            <div className="mt-1 flex flex-col gap-2.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 items-center justify-center rounded-[10px] text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {isSubmitting ? "로그인 중..." : "로그인"}
              </button>
              <button
                type="button"
                onClick={() => toast.info("SAML SSO 로그인 화면으로 이동합니다", { sub: "조직 관리자에게 문의하세요" })}
                className="flex h-12 items-center justify-center gap-2 rounded-[10px] border border-(--border-app) bg-(--surface-app) text-sm font-semibold text-(--text-app) transition hover:bg-black/[.03] dark:hover:bg-white/[.05]"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-[4px] bg-(--text-app) text-[9px] font-extrabold text-(--surface-app)">
                  S
                </span>
                조직 계정 (SAML) 으로 계속
              </button>
            </div>
          </form>

          <div className="mt-5 flex items-center gap-2.5 rounded-[10px] bg-black/[.03] p-3.5 dark:bg-white/[.04]">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-[13px] font-bold"
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
        </div>

        <div className="flex items-center gap-4 text-xs text-(--text-muted)">
          <Link
            href="#terms"
            onClick={(e) => {
              e.preventDefault();
              toast.info("이용약관을 엽니다");
            }}
            className="hover:text-(--text-app)"
          >
            이용약관
          </Link>
          <Link
            href="#privacy"
            onClick={(e) => {
              e.preventDefault();
              toast.info("개인정보 처리방침을 엽니다");
            }}
            className="hover:text-(--text-app)"
          >
            개인정보 처리방침
          </Link>
          <span className="ml-auto">KR · EN</span>
        </div>

        <p className="text-center text-xs text-(--text-muted)">
          관리자이신가요?{" "}
          <Link href="/setup" className="font-medium hover:text-(--text-app)">
            서버 설치 마법사
          </Link>
        </p>

        <p className="mt-6 text-sm text-(--text-muted) lg:hidden">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="font-semibold text-(--color-primary)">
            회원가입
          </Link>
        </p>
      </div>

      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#17181B] px-[72px] py-16 lg:flex">
        <div
          className="pointer-events-none absolute"
          style={{
            inset: "auto -140px -220px auto",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 0%, transparent) 70%)",
            opacity: 0.5,
          }}
        />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[.12em] text-white/55">
            Enterprise mail platform
          </p>
          <h2 className="mt-2.5 text-[40px] font-bold leading-[1.22] tracking-tight text-white">
            하루 12만 통의 메일을
            <br />
            흔들림 없이 처리합니다
          </h2>

          <div className="mt-8 grid grid-cols-3 gap-3.5">
            {[
              { value: "99.99%", label: "가동률 SLA" },
              { value: "2 GB", label: "대용량 첨부" },
              { value: "ISMS-P", label: "인증 획득" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/[.06] p-4"
              >
                <p className="text-[22px] font-bold tracking-tight text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] text-white/55">{stat.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-white/85 lg:mt-10">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="font-semibold text-white underline">
              회원가입
            </Link>
          </p>
        </div>

        <p className="relative text-xs text-white/45">
          © 2026 GXWebMail. 공공·교육기관 조달 등록 제품.
        </p>
      </div>
    </div>
  );
}
