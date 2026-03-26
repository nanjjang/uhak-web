"use client";

import { useAuth } from "@/lib/auth-context";
import UhakLogo from "./UhakLogo";
import { UtensilsCrossed, CalendarDays, Clock, Users, ChevronRight, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

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
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: "var(--bg)", borderBottom: "1px solid var(--divider)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between px-5 h-14">
          <a href="/" className="flex items-center gap-2.5">
            <div style={{ color: "var(--primary)" }}>
              <UhakLogo size={18} />
            </div>
            <span className="text-base font-bold" style={{ color: "var(--text-primary)" }}>우학</span>
          </a>
          <div className="flex items-center gap-2">
            <a
              href="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              로그인
            </a>
            <a
              href="/login?mode=register"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: "var(--primary)" }}
            >
              시작하기
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <p
            className="text-sm font-medium mb-5"
            style={{ color: "var(--primary)" }}
          >
            학교 생활을 더 편리하게
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold leading-tight"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            급식, 시간표, 일정을
            <br />
            한 곳에서 확인하세요
          </h1>
          <p
            className="mt-5 text-base sm:text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            같은 반 친구들과 수행평가, 과제 일정을 공유하고
            <br className="hidden sm:block" />
            학교 생활에 필요한 정보를 빠르게 확인할 수 있어요.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
              style={{ background: "var(--primary)" }}
            >
              무료로 시작하기
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold text-center mb-4"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            주요 기능
          </h2>
          <p className="text-center text-sm mb-12" style={{ color: "var(--text-secondary)" }}>
            학교 생활에 꼭 필요한 것만 담았어요
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: <UtensilsCrossed size={20} />,
                title: "급식",
                desc: "주간 급식 메뉴를 한눈에 확인할 수 있어요.",
                color: "#FF9500",
              },
              {
                icon: <Clock size={20} />,
                title: "시간표",
                desc: "주 단위 시간표를 깔끔하게 볼 수 있어요.",
                color: "#4363E9",
              },
              {
                icon: <CalendarDays size={20} />,
                title: "학사일정",
                desc: "시험, 방학, 행사 등 학교 일정을 확인하세요.",
                color: "#34C759",
              },
              {
                icon: <Users size={20} />,
                title: "할 일 공유",
                desc: "수행평가, 과제를 같은 반과 함께 관리하세요.",
                color: "#AF52DE",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-5 rounded-2xl"
                style={{ background: "var(--card)", border: "1px solid var(--divider)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: f.color + "14", color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 px-5" style={{ background: "var(--card)", borderTop: "1px solid var(--divider)", borderBottom: "1px solid var(--divider)" }}>
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold text-center mb-12"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            시작하는 방법
          </h2>

          <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-8">
            {[
              { num: "1", title: "회원가입", desc: "이메일 또는 Google 계정으로 가입하세요." },
              { num: "2", title: "학교 설정", desc: "학교를 검색하고 학년, 반을 선택하세요." },
              { num: "3", title: "바로 시작", desc: "급식, 시간표, 할 일을 확인하세요." },
            ].map((s, i) => (
              <div key={s.num} className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-3 sm:text-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: "var(--primary)", color: "#fff" }}
                >
                  {s.num}
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shared feature */}
      <section className="py-16 sm:py-24 px-5">
        <div className="max-w-xl mx-auto text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "var(--primary-light)", color: "var(--primary)" }}
          >
            <Users size={22} />
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            같은 반 친구들과
            <br />함께 사용하세요
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            한 명이 등록하면 같은 학교·학년·반의
            <br />모든 친구가 실시간으로 확인할 수 있어요.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 sm:py-20 px-5"
        style={{ background: "var(--card)", borderTop: "1px solid var(--divider)" }}
      >
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            지금 바로 시작해보세요
          </h2>
          <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
            무료로 이용할 수 있어요.
          </p>
          <button
            onClick={handleStart}
            className="mt-6 px-6 py-3 rounded-xl text-white font-semibold text-sm inline-flex items-center gap-2"
            style={{ background: "var(--primary)" }}
          >
            우학 시작하기
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--divider)" }}>
        <div className="max-w-5xl mx-auto px-5 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div style={{ color: "var(--text-secondary)" }}>
                  <UhakLogo size={14} />
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>우학</span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                학교 생활을 더 편리하게
              </p>
            </div>
            <div className="flex flex-col sm:items-end gap-1">
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                교육정보 출처: NEIS 교육정보 개방 포털
              </p>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                &copy; {new Date().getFullYear()} 우학. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
