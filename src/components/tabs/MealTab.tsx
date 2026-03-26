"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchMeals, MealInfo } from "@/lib/neis";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function getWeekDates(date: Date): Date[] {
  const d = new Date(date);
  const day = d.getDay();
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(start);
    dd.setDate(start.getDate() + i);
    return dd;
  });
}

function fmt(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

function fmtMonth(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const mealColors: Record<string, string> = {
  "조식": "#FF9500",
  "중식": "#4363E9",
  "석식": "#AF52DE",
};

export default function MealTab() {
  const { appUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState<MealInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedMonth, setLoadedMonth] = useState("");

  const weekDates = getWeekDates(selectedDate);
  const todayStr = fmt(selectedDate);
  const todayMeals = meals.filter((m) => m.mealDate === todayStr);

  const schoolId = appUser?.school?.SD_SCHUL_CODE;

  useEffect(() => {
    setLoadedMonth("");
    setMeals([]);
  }, [schoolId]);

  useEffect(() => {
    const month = fmtMonth(selectedDate);
    if (month === loadedMonth || !appUser?.school) return;
    setLoadedMonth(month);
    setLoading(true);
    fetchMeals(appUser.school, month).then((data) => {
      setMeals(data);
      setLoading(false);
    });
  }, [selectedDate, appUser?.school, loadedMonth]);

  const moveWeek = (offset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset * 7);
    setSelectedDate(d);
  };

  return (
    <div>
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>급식</h1>
      </div>

      {/* Week Strip */}
      <div className="px-4 py-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--divider)" }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => moveWeek(-1)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--primary-light)" }}>
            <span style={{ color: "var(--primary)" }}>‹</span>
          </button>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
          </span>
          <button onClick={() => moveWeek(1)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--primary-light)" }}>
            <span style={{ color: "var(--primary)" }}>›</span>
          </button>
        </div>
        <div className="flex gap-1">
          {weekDates.map((d, i) => {
            const isSelected = fmt(d) === fmt(selectedDate);
            const isToday = fmt(d) === fmt(new Date());
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(d)}
                className="flex-1 flex flex-col items-center py-2 rounded-xl transition-all"
                style={{
                  background: isSelected ? "var(--primary)" : isToday ? "var(--primary-light)" : "transparent",
                }}
              >
                <span className="text-[10px] font-medium" style={{
                  color: isSelected ? "#fff" : i === 0 ? "var(--error)" : "var(--text-secondary)"
                }}>
                  {DAY_LABELS[i]}
                </span>
                <span className="text-sm font-semibold mt-0.5" style={{
                  color: isSelected ? "#fff" : isToday ? "var(--primary)" : "var(--text-primary)"
                }}>
                  {d.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Meals */}
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-36 rounded-2xl animate-pulse" style={{ background: "var(--card)" }} />
            ))}
          </div>
        ) : todayMeals.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>급식 정보가 없어요</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>오늘은 급식이 없는 날이에요</p>
          </div>
        ) : (
          todayMeals.map((meal, i) => (
            <div key={i} className="p-4 rounded-2xl" style={{ background: "var(--card)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: (mealColors[meal.mealTypeName] || "var(--primary)") + "1a" }}>
                    <span className="text-sm">🍽️</span>
                  </div>
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{meal.mealTypeName}</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                  {meal.calInfo}
                </span>
              </div>
              <div className="h-px mb-3" style={{ background: "var(--divider)" }} />
              <div className="space-y-1.5">
                {meal.dishes.map((dish, j) => (
                  <div key={j} className="flex items-center gap-2.5">
                    <div className="w-1 h-1 rounded-full" style={{ background: "var(--primary)" }} />
                    <span className="text-sm" style={{ color: "var(--text-primary)" }}>{dish}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
