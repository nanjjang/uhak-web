"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user, loading } = useAuth();

  const handleStart = () => {
    if (user) {
      window.location.href = "/app";
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "var(--bg)", borderBottom: "1px solid var(--divider)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <span className="text-white text-sm font-bold">우</span>
          </div>
          <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>우학</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ color: "var(--text-primary)" }}
          >
            로그인
          </a>
          <a
            href="/login?mode=register"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "var(--primary)" }}
          >
            회원가입
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <div className="text-center max-w-2xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{ background: "var(--primary-light)", color: "var(--primary)" }}
          >
            학교 생활의 모든 것
          </div>
          <h1
            className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            학교 생활,
            <br />
            <span style={{ color: "var(--primary)" }}>한 곳에서</span> 관리하세요
          </h1>
          <p
            className="mt-6 text-lg leading-relaxed max-w-lg mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            급식, 시간표, 학사일정, 수행평가까지.
            <br />
            같은 반 친구들과 함께 확인하고 공유하세요.
          </p>
          <button
            onClick={handleStart}
            className="mt-10 px-8 py-4 rounded-2xl text-white font-semibold text-base transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--primary)", boxShadow: "0 4px 24px rgba(67,99,233,0.3)" }}
          >
            지금 시작하기
          </button>
          <p className="mt-4 text-sm" style={{ color: "var(--text-tertiary)" }}>
            무료로 이용할 수 있어요
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
              이런 기능이 있어요
            </h2>
            <p className="mt-4 text-base" style={{ color: "var(--text-secondary)" }}>
              학교 생활에 필요한 핵심 기능만 담았어요
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: "🍽️",
                title: "급식",
                desc: "오늘 뭐 먹지? 주간 급식 메뉴를 한눈에 확인하세요.",
                color: "#FF9500",
              },
              {
                icon: "📋",
                title: "시간표",
                desc: "이번 주 시간표를 깔끔한 표로 확인하세요.",
                color: "#4363E9",
              },
              {
                icon: "📅",
                title: "학사일정",
                desc: "시험, 방학, 행사 일정을 캘린더로 확인하세요.",
                color: "#34C759",
              },
              {
                icon: "✅",
                title: "할 일 공유",
                desc: "수행평가, 과제를 같은 반 친구들과 함께 관리하세요.",
                color: "#AF52DE",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl transition-all hover:scale-[1.02]"
                style={{ background: "var(--card)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
                  style={{ background: f.color + "1a" }}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6" style={{ background: "var(--card)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
              3단계로 시작하세요
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "회원가입", desc: "이메일 또는 Google 계정으로 간편하게 가입" },
              { step: "2", title: "학교 설정", desc: "학교를 검색하고 학년, 반을 선택" },
              { step: "3", title: "시작!", desc: "급식, 시간표, 할 일을 바로 확인" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 text-white"
                  style={{ background: "var(--primary)" }}
                >
                  {s.step}
                </div>
                <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shared */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-6">👥</div>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
            같은 반 친구들과
            <br />함께 사용하세요
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            수행평가, 과제, 시험 일정을 한 명이 등록하면
            <br />같은 학교 · 학년 · 반의 모든 친구가 실시간으로 확인할 수 있어요.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6" style={{ background: "var(--card)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
            지금 바로 시작해보세요
          </h2>
          <p className="mt-4 text-base" style={{ color: "var(--text-secondary)" }}>
            완전 무료, 가입만 하면 바로 사용할 수 있어요.
          </p>
          <button
            onClick={handleStart}
            className="mt-8 px-8 py-4 rounded-2xl text-white font-semibold text-base transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--primary)", boxShadow: "0 4px 24px rgba(67,99,233,0.3)" }}
          >
            우학 이용해보기
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6" style={{ borderTop: "1px solid var(--divider)" }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "var(--primary)" }}>
              <span className="text-white text-[10px] font-bold">우</span>
            </div>
            <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>우학</span>
          </div>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            교육정보 출처: NEIS 교육정보 개방 포털
          </span>
        </div>
      </footer>
    </div>
  );
}
