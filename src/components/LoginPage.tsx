"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import UhakLogo from "./UhakLogo";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, user } = useAuth();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">(
    searchParams.get("mode") === "register" ? "register" : "login"
  );

  useEffect(() => {
    if (user) window.location.href = "/app";
  }, [user]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      if (password.length < 6) {
        setError("비밀번호는 6자 이상이어야 합니다.");
        return;
      }
      if (password !== passwordConfirm) {
        setError("비밀번호가 일치하지 않습니다.");
        return;
      }
      if (!agreed) {
        setError("서비스 이용약관에 동의해주세요.");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, name);
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      const messages: Record<string, string> = {
        "auth/email-already-in-use": "이미 사용 중인 이메일입니다.",
        "auth/invalid-email": "올바른 이메일 형식이 아닙니다.",
        "auth/wrong-password": "비밀번호가 올바르지 않습니다.",
        "auth/user-not-found": "등록되지 않은 이메일입니다.",
        "auth/invalid-credential": "이메일 또는 비밀번호를 확인해주세요.",
        "auth/too-many-requests": "잠시 후 다시 시도해주세요.",
      };
      setError(messages[code] || "오류가 발생했습니다. 다시 시도해주세요.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-14">
        <a href="/" className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          ← 홈
        </a>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 pb-10">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block mb-3" style={{ color: "var(--primary)" }}>
              <UhakLogo size={28} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {mode === "login" ? "로그인" : "회원가입"}
            </h1>
            <p className="mt-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
              {mode === "login" ? "우학에 오신 것을 환영합니다" : "계정을 만들고 시작하세요"}
            </p>
          </div>

          {/* Google */}
          <button
            onClick={loginWithGoogle}
            className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2.5"
            style={{ background: "var(--card)", border: "1px solid var(--divider)", color: "var(--text-primary)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google로 계속하기
          </button>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 h-px" style={{ background: "var(--divider)" }} />
            <span className="px-3 text-xs" style={{ color: "var(--text-tertiary)" }}>또는</span>
            <div className="flex-1 h-px" style={{ background: "var(--divider)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>이름</label>
                <input
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: "var(--card)", border: "1px solid var(--divider)", color: "var(--text-primary)" }}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>이메일</label>
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: "var(--card)", border: "1px solid var(--divider)", color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>비밀번호</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "register" ? "6자 이상 입력하세요" : "비밀번호를 입력하세요"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none pr-10"
                  style={{ background: "var(--card)", border: "1px solid var(--divider)", color: "var(--text-primary)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>비밀번호 확인</label>
                  <input
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: "var(--card)", border: "1px solid var(--divider)", color: "var(--text-primary)" }}
                  />
                </div>

                <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-[var(--primary)]"
                  />
                  <span className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    <a href="#" className="underline" style={{ color: "var(--primary)" }}>서비스 이용약관</a> 및{" "}
                    <a href="#" className="underline" style={{ color: "var(--primary)" }}>개인정보 처리방침</a>에 동의합니다.
                  </span>
                </label>
              </>
            )}

            {error && (
              <div className="px-3 py-2.5 rounded-lg text-sm" style={{ background: "rgba(255,59,48,0.08)", color: "var(--error)" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm"
              style={{ background: "var(--primary)", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "처리 중..." : mode === "login" ? "로그인" : "가입하기"}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-sm mt-6" style={{ color: "var(--text-secondary)" }}>
            {mode === "login" ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="font-semibold"
              style={{ color: "var(--primary)" }}
            >
              {mode === "login" ? "회원가입" : "로그인"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div style={{ color: "var(--primary)" }}>
          <UhakLogo size={28} />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
