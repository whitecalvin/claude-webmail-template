"use client";

import { useState, type FormEvent } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { Check } from "lucide-react";
import { useToast } from "@/context/toast-context";

// Mocked signup screen — validates the form client-side only, then redirects
// to /login after a fake delay. No account is actually created anywhere.
export default function SignupPage() {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("모든 필수 항목을 입력해 주세요.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!agreed) {
      setError("이용약관 및 개인정보 처리방침에 동의해 주세요.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    window.setTimeout(() => {
      router.push("/login");
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
            계정을 만들어 보세요
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-(--text-muted)">
            조직 이메일로 가입하면 관리자가 승인 후 계정을 활성화합니다.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-(--text-muted)">
                이름
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="h-[46px] rounded-[10px] border border-(--border-app) bg-black/[.015] px-3.5 text-sm text-(--text-app) outline-none transition focus:border-(--color-primary) focus:bg-transparent dark:bg-white/[.03]"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-(--text-muted)">
                이메일 주소
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gxsoft.co.kr"
                className="h-[46px] rounded-[10px] border border-(--border-app) bg-black/[.015] px-3.5 text-sm text-(--text-app) outline-none transition focus:border-(--color-primary) focus:bg-transparent dark:bg-white/[.03]"
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
                placeholder="8자 이상 입력하세요"
                className="h-[46px] rounded-[10px] border border-(--border-app) bg-black/[.015] px-3.5 text-sm text-(--text-app) outline-none transition focus:border-(--color-primary) focus:bg-transparent dark:bg-white/[.03]"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-(--text-muted)">
                비밀번호 확인
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 한 번 더 입력하세요"
                className="h-[46px] rounded-[10px] border border-(--border-app) bg-black/[.015] px-3.5 text-sm text-(--text-app) outline-none transition focus:border-(--color-primary) focus:bg-transparent dark:bg-white/[.03]"
              />
            </label>

            <button
              type="button"
              onClick={() => setAgreed((v) => !v)}
              className="mt-1 flex items-start gap-2 text-left text-[13px] text-(--text-app)"
            >
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px]"
                style={{
                  backgroundColor: agreed ? "var(--color-primary)" : "transparent",
                  border: agreed ? "none" : "1px solid var(--border-app)",
                }}
              >
                {agreed && <Check size={10} strokeWidth={3} className="text-white" />}
              </span>
              <span className="text-(--text-muted)">
                <Link
                  href="#terms"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toast.info("이용약관을 엽니다");
                  }}
                  className="font-medium text-(--text-app)"
                >
                  이용약관
                </Link>{" "}
                및{" "}
                <Link
                  href="#privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toast.info("개인정보 처리방침을 엽니다");
                  }}
                  className="font-medium text-(--text-app)"
                >
                  개인정보 처리방침
                </Link>
                에 동의합니다
              </span>
            </button>

            {error && (
              <p className="text-xs font-medium text-(--status-danger)">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 flex h-12 items-center justify-center rounded-[10px] text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {isSubmitting ? "가입 처리 중..." : "가입하기"}
            </button>
          </form>

          <p className="mt-6 text-sm text-(--text-muted)">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="font-semibold text-(--color-primary)">
              로그인
            </Link>
          </p>
        </div>
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
            팀 전체가 하나의
            <br />
            받은편지함으로 일합니다
          </h2>
          <ul className="mt-8 flex flex-col gap-3 text-sm text-white/80">
            {[
              "테마 커스터마이징으로 우리 조직만의 룩앤필",
              "캘린더 · 주소록 · 결재까지 하나의 워크스페이스",
              "ISMS-P 인증을 획득한 보안 기준",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <span
                  className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-white/45">
          © 2026 GXWebMail. 공공·교육기관 조달 등록 제품.
        </p>
      </div>
    </div>
  );
}
