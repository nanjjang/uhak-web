"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchWeekTimetable, TimetableEntry } from "@/lib/neis";

const DAY_LABELS = ["월", "화", "수", "목", "금"];

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

function fmt(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

const subjectColors: Record<string, string> = {
  "국어": "#007AFF", "수학": "#FF3B30", "영어": "#34C759",
  "과학": "#FF9500", "사회": "#AF52DE", "역사": "#A2845E",
  "도덕": "#FF2D92", "음악": "#32ADE6", "미술": "#FFD60A",
  "체육": "#00C7BE", "기술가정": "#5856D6", "정보": "#30B0C7",
  "프로그래밍": "#30B0C7",
};

function getSubjectColor(subject: string): string {
  for (const [key, color] of Object.entries(subjectColors)) {
    if (subject.includes(key)) return color;
  }
  return "#4363E9";
}

export default function TimetableTab() {
  const { appUser } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const monday = getMonday(currentWeek);
  const weekDates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const friday = weekDates[4];
  const weekLabel = `${monday.getMonth() + 1}월 ${monday.getDate()}일 ~ ${friday.getMonth() + 1}월 ${friday.getDate()}일`;

  const entriesByDate: Record<string, TimetableEntry[]> = {};
  entries.forEach((e) => {
    if (!entriesByDate[e.date]) entriesByDate[e.date] = [];
    entriesByDate[e.date].push(e);
  });

  const maxPeriod = Math.max(7, ...entries.map((e) => parseInt(e.period) || 0));

  useEffect(() => {
    if (!appUser?.school || !appUser.grade || !appUser.classNumber) return;
    setLoading(true);
    fetchWeekTimetable(appUser.school, appUser.grade, appUser.classNumber, fmt(monday), fmt(friday))
      .then(setEntries)
      .finally(() => setLoading(false));
  }, [monday.getTime(), appUser?.school?.SD_SCHUL_CODE, appUser?.grade, appUser?.classNumber]);

  const moveWeek = (offset: number) => {
    const d = new Date(currentWeek);
    d.setDate(d.getDate() + offset * 7);
    setCurrentWeek(d);
  };

  const isCurrentWeek = fmt(getMonday(new Date())) === fmt(monday);

  return (
    <div>
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>시간표</h1>
      </div>

      {/* Week nav */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--divider)" }}>
        <button onClick={() => moveWeek(-1)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--primary-light)" }}>
          <span style={{ color: "var(--primary)" }}>‹</span>
        </button>
        <div className="text-center">
          <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{weekLabel}</div>
          {isCurrentWeek && <div className="text-[10px] font-medium" style={{ color: "var(--primary)" }}>이번 주</div>}
        </div>
        <button onClick={() => moveWeek(1)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--primary-light)" }}>
          <span style={{ color: "var(--primary)" }}>›</span>
        </button>
      </div>

      {/* Grid */}
      <div className="p-3">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: "var(--card)" }} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            {/* Header */}
            <div className="grid grid-cols-[36px_repeat(5,1fr)]">
              <div />
              {weekDates.map((d, i) => {
                const isToday = fmt(d) === fmt(new Date());
                return (
                  <div key={i} className="text-center py-2" style={{ background: isToday ? "var(--primary-light)" : "transparent" }}>
                    <div className="text-[10px] font-semibold" style={{ color: isToday ? "var(--primary)" : "var(--text-secondary)" }}>
                      {DAY_LABELS[i]}
                    </div>
                    <div className="text-xs font-medium" style={{ color: isToday ? "var(--primary)" : "var(--text-tertiary)" }}>
                      {d.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rows */}
            {Array.from({ length: maxPeriod }, (_, p) => p + 1).map((period) => (
              <div key={period} className="grid grid-cols-[36px_repeat(5,1fr)]" style={{ borderTop: "1px solid var(--divider)" }}>
                <div className="flex items-center justify-center text-xs font-bold" style={{ color: "var(--text-secondary)", minHeight: 56 }}>
                  {period}
                </div>
                {weekDates.map((d, i) => {
                  const dateStr = fmt(d);
                  const entry = entriesByDate[dateStr]?.find((e) => parseInt(e.period) === period);
                  const isToday = dateStr === fmt(new Date());
                  const color = entry ? getSubjectColor(entry.subject) : "transparent";

                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-center p-1"
                      style={{
                        minHeight: 56,
                        background: isToday ? "rgba(67,99,233,0.03)" : "transparent",
                      }}
                    >
                      {entry && (
                        <div
                          className="w-full rounded-lg p-1.5 text-center"
                          style={{ background: color + "12" }}
                        >
                          <div className="text-[11px] font-semibold leading-tight" style={{ color }}>
                            {entry.subject}
                          </div>
                          {entry.teacher && (
                            <div className="text-[9px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                              {entry.teacher}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
