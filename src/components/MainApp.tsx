"use client";

import { useState, ReactNode } from "react";
import MealTab from "./tabs/MealTab";
import TimetableTab from "./tabs/TimetableTab";
import ScheduleTab from "./tabs/ScheduleTab";
import TasksTab from "./tabs/TasksTab";
import SettingsTab from "./tabs/SettingsTab";
import { UtensilsCrossed, Clock, CalendarDays, CheckSquare, Settings } from "lucide-react";

const tabs: { id: string; label: string; icon: ReactNode }[] = [
  { id: "meal", label: "급식", icon: <UtensilsCrossed size={20} strokeWidth={1.8} /> },
  { id: "timetable", label: "시간표", icon: <Clock size={20} strokeWidth={1.8} /> },
  { id: "schedule", label: "학사일정", icon: <CalendarDays size={20} strokeWidth={1.8} /> },
  { id: "tasks", label: "할 일", icon: <CheckSquare size={20} strokeWidth={1.8} /> },
  { id: "settings", label: "설정", icon: <Settings size={20} strokeWidth={1.8} /> },
];

type TabId = "meal" | "timetable" | "schedule" | "tasks" | "settings";

export default function MainApp() {
  const [activeTab, setActiveTab] = useState<TabId>("meal");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Content */}
      <main className="flex-1 pb-20 max-w-lg mx-auto w-full">
        {activeTab === "meal" && <MealTab />}
        {activeTab === "timetable" && <TimetableTab />}
        {activeTab === "schedule" && <ScheduleTab />}
        {activeTab === "tasks" && <TasksTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>

      {/* Bottom Tab Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around px-4 pt-2 pb-6"
        style={{ background: "var(--card)", borderTop: "1px solid var(--divider)" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabId)}
            className="flex flex-col items-center gap-1 min-w-[56px] transition-all"
          >
            <span
              className="px-3 py-1.5 rounded-xl transition-all flex items-center justify-center"
              style={{
                background: activeTab === tab.id ? "var(--primary-light)" : "transparent",
                color: activeTab === tab.id ? "var(--primary)" : "var(--text-tertiary)",
              }}
            >
              {tab.icon}
            </span>
            <span
              className="text-[10px] font-medium"
              style={{ color: activeTab === tab.id ? "var(--primary)" : "var(--text-tertiary)" }}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
