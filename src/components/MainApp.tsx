"use client";

import { useState } from "react";
import MealTab from "./tabs/MealTab";
import TimetableTab from "./tabs/TimetableTab";
import ScheduleTab from "./tabs/ScheduleTab";
import TasksTab from "./tabs/TasksTab";
import SettingsTab from "./tabs/SettingsTab";

const tabs = [
  { id: "meal", label: "급식", icon: "🍽️" },
  { id: "timetable", label: "시간표", icon: "📋" },
  { id: "schedule", label: "학사일정", icon: "📅" },
  { id: "tasks", label: "할 일", icon: "✅" },
  { id: "settings", label: "설정", icon: "⚙️" },
] as const;

type TabId = (typeof tabs)[number]["id"];

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
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center gap-0.5 min-w-[56px] transition-all"
          >
            <span
              className="text-lg px-3 py-1 rounded-xl transition-all"
              style={{
                background: activeTab === tab.id ? "var(--primary-light)" : "transparent",
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
