"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchSchedules, SchoolSchedule } from "@/lib/neis";

function fmt(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

function getDaysInMonth(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const offset = firstDay.getDay();
  const daysCount = new Date(year, month + 1, 0).getDate();
  const days: (Date | null)[] = Array(offset).fill(null);
  for (let i = 1; i <= daysCount; i++) {
    days.push(new Date(year, month, i));
  }
  return days;
}

export default function ScheduleTab() {
  const { appUser } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [schedules, setSchedules] = useState<SchoolSchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [loadedYear, setLoadedYear] = useState(0);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const days = getDaysInMonth(year, month);

  const scheduleMap: Record<string, SchoolSchedule[]> = {};
  schedules.forEach((s) => {
    if (!scheduleMap[s.date]) scheduleMap[s.date] = [];
    scheduleMap[s.date].push(s);
  });

  const selectedDateStr = fmt(selectedDate);
  const selectedSchedules = scheduleMap[selectedDateStr] || [];

  const schoolId = appUser?.school?.SD_SCHUL_CODE;

  useEffect(() => {
    setLoadedYear(0);
    setSchedules([]);
  }, [schoolId]);

  useEffect(() => {
    if (!appUser?.school || year === loadedYear) return;
    setLoadedYear(year);
    setLoading(true);
    fetchSchedules(appUser.school, year)
      .then(setSchedules)
      .finally(() => setLoading(false));
  }, [year, schoolId]);

  const moveMonth = (offset: number) => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + offset);
    setCurrentMonth(d);
  };

  return (
    <div>
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>학사일정</h1>
      </div>

      {/* Calendar */}
      <div className="mx-4 rounded-2xl" style={{ background: "var(--card)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        {/* Month nav */}
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => moveMonth(-1)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--primary-light)" }}>
            <span style={{ color: "var(--primary)" }}>‹</span>
          </button>
          <div className="text-center">
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{year}</div>
            <div className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{month + 1}월</div>
          </div>
          <button onClick={() => moveMonth(1)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--primary-light)" }}>
            <span style={{ color: "var(--primary)" }}>›</span>
          </button>
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 px-2">
          {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <div key={d} className="text-center text-[11px] font-semibold py-1" style={{
              color: i === 0 ? "var(--error)" : i === 6 ? "#4363E9" : "var(--text-secondary)"
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 px-2 pb-3">
          {days.map((d, i) => {
            if (!d) return <div key={`empty-${i}`} className="h-11" />;
            const dateStr = fmt(d);
            const hasEvent = !!scheduleMap[dateStr];
            const isSelected = dateStr === selectedDateStr;
            const isToday = dateStr === fmt(new Date());
            const weekday = d.getDay();
            const isHoliday = scheduleMap[dateStr]?.some((s) => s.isHoliday);

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(d)}
                className="flex flex-col items-center justify-center h-11 rounded-xl transition-all"
                style={{
                  background: isSelected ? "var(--primary)" : "transparent",
                }}
              >
                <span className="text-[13px] font-medium" style={{
                  color: isSelected ? "#fff" :
                    isToday ? "var(--primary)" :
                    weekday === 0 || isHoliday ? "var(--error)" :
                    weekday === 6 ? "#4363E9" :
                    "var(--text-primary)"
                }}>
                  {d.getDate()}
                </span>
                {hasEvent && (
                  <div className="w-1 h-1 rounded-full mt-0.5" style={{
                    background: isSelected ? "#fff" : "var(--primary)"
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day schedules */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
            {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일의 일정
          </span>
          {selectedSchedules.length > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
              {selectedSchedules.length}건
            </span>
          )}
        </div>

        {loading ? (
          <div className="h-16 rounded-xl animate-pulse" style={{ background: "var(--card)" }} />
        ) : selectedSchedules.length === 0 ? (
          <div className="flex items-center gap-2 p-4 rounded-xl" style={{ background: "var(--card)" }}>
            <span style={{ color: "var(--success)" }}>✓</span>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>특별한 일정이 없는 날이에요</span>
          </div>
        ) : (
          selectedSchedules.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "var(--card)", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
              <div className="w-1 h-8 rounded-full" style={{ background: s.isHoliday ? "var(--error)" : "var(--primary)" }} />
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{s.eventName}</div>
                {s.isHoliday && s.holidayType && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded mt-1 inline-block" style={{ background: "rgba(255,59,48,0.1)", color: "var(--error)" }}>
                    {s.holidayType}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
