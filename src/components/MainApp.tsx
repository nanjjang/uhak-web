"use client";

import { useState, ReactNode } from "react";
import MealTab from "./tabs/MealTab";
import TimetableTab from "./tabs/TimetableTab";
import ScheduleTab from "./tabs/ScheduleTab";
import TasksTab from "./tabs/TasksTab";
import SettingsTab from "./tabs/SettingsTab";
import UhakLogo from "./UhakLogo";
import { UtensilsCrossed, Clock, CalendarDays, CheckSquare, Settings } from "lucide-react";

const tabs: { id: string; label: string; icon: ReactNode }[] = [
  { id: "meal", label: "급식", icon: <UtensilsCrossed size={22} strokeWidth={1.7} /> },
  { id: "timetable", label: "시간표", icon: <Clock size={22} strokeWidth={1.7} /> },
  { id: "schedule", label: "학사일정", icon: <CalendarDays size={22} strokeWidth={1.7} /> },
  { id: "tasks", label: "할 일", icon: <CheckSquare size={22} strokeWidth={1.7} /> },
  { id: "settings", label: "설정", icon: <Settings size={22} strokeWidth={1.7} /> },
];

type TabId = "meal" | "timetable" | "schedule" | "tasks" | "settings";

export default function MainApp() {
  const [activeTab, setActiveTab] = useState<TabId>("meal");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center px-5 h-12"
        style={{ background: "var(--bg)", borderBottom: "1px solid var(--divider)" }}
      >
        <div className="max-w-2xl mx-auto w-full flex items-center gap-2">
          <div style={{ color: "var(--primary)" }}>
            <UhakLogo size={14} />
          </div>
          <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>우학</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pt-12 pb-20 max-w-2xl mx-auto w-full">
        <div style={{ display: activeTab === "meal" ? "block" : "none" }}><MealTab /></div>
        <div style={{ display: activeTab === "timetable" ? "block" : "none" }}><TimetableTab /></div>
        <div style={{ display: activeTab === "schedule" ? "block" : "none" }}><ScheduleTab /></div>
        <div style={{ display: activeTab === "tasks" ? "block" : "none" }}><TasksTab /></div>
        <div style={{ display: activeTab === "settings" ? "block" : "none" }}><SettingsTab /></div>
      </main>

      {/* Bottom Tab Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{ background: "var(--card)", borderTop: "1px solid var(--divider)" }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-around px-2 pt-1.5 pb-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className="flex flex-col items-center gap-0.5 flex-1 py-1 transition-all"
            >
              <span
                className="flex items-center justify-center w-10 h-8 rounded-2xl transition-all"
                style={{
                  background: activeTab === tab.id ? "var(--primary-light)" : "transparent",
                  color: activeTab === tab.id ? "var(--primary)" : "var(--text-tertiary)",
                }}
              >
                {tab.icon}
              </span>
              <span
                className="text-[11px] font-medium"
                style={{ color: activeTab === tab.id ? "var(--primary)" : "var(--text-tertiary)" }}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
