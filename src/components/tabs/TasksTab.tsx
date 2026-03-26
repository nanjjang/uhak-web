"use client";

import { useState, useEffect } from "react";
import { useAuth, schoolCode } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";

interface ExamSchedule {
  id: string;
  subject: string;
  examType: string;
  description: string;
  examDate: Date;
  createdBy: string;
  createdAt: Date;
}

const examTypes = ["수행평가", "중간고사", "기말고사", "과제", "발표", "쪽지시험", "기타"];

const typeColors: Record<string, string> = {
  "수행평가": "#4363E9", "중간고사": "#FF3B30", "기말고사": "#FF3B30",
  "과제": "#34C759", "발표": "#FF9500", "쪽지시험": "#AF52DE", "기타": "#8E8E93",
};

function fmt(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

// 학년도 계산: 3월 4일 이전이면 전년도
function getAcademicYear(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  if (month < 3 || (month === 3 && day < 4)) return year - 1;
  return year;
}

function getDaysInMonth(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const offset = firstDay.getDay();
  const daysCount = new Date(year, month + 1, 0).getDate();
  const days: (Date | null)[] = Array(offset).fill(null);
  for (let i = 1; i <= daysCount; i++) days.push(new Date(year, month, i));
  return days;
}

export default function TasksTab() {
  const { appUser, user } = useAuth();
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAdd, setShowAdd] = useState(false);
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState("수행평가");
  const [description, setDescription] = useState("");
  const [examDate, setExamDate] = useState("");

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const days = getDaysInMonth(year, month);

  const groupId = appUser?.school
    ? `${schoolCode(appUser.school)}_${appUser.grade}_${appUser.classNumber}_${getAcademicYear()}`
    : null;

  useEffect(() => {
    if (!groupId) return;
    const q = query(collection(db, "examGroups", groupId, "exams"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id,
          subject: raw.subject,
          examType: raw.examType,
          description: raw.description,
          examDate: raw.examDate instanceof Timestamp ? raw.examDate.toDate() : new Date(raw.examDate),
          createdBy: raw.createdBy,
          createdAt: raw.createdAt instanceof Timestamp ? raw.createdAt.toDate() : new Date(raw.createdAt),
        } as ExamSchedule;
      });
      setExams(data);
    });
    return unsub;
  }, [groupId]);

  const examsByDate: Record<string, ExamSchedule[]> = {};
  exams.forEach((e) => {
    const key = fmt(e.examDate);
    if (!examsByDate[key]) examsByDate[key] = [];
    examsByDate[key].push(e);
  });

  const selectedExams = examsByDate[fmt(selectedDate)] || [];

  const addExam = async () => {
    if (!groupId || !subject || !examDate || !user) return;
    await addDoc(collection(db, "examGroups", groupId, "exams"), {
      subject,
      examType,
      description,
      examDate: new Date(examDate),
      createdBy: user.uid,
      createdAt: new Date(),
    });
    setSubject("");
    setDescription("");
    setShowAdd(false);
  };

  const removeExam = async (examId: string) => {
    if (!groupId) return;
    await deleteDoc(doc(db, "examGroups", groupId, "exams", examId));
  };

  return (
    <div>
      <div className="px-4 pt-6 pb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>할 일</h1>
        <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
          {appUser?.grade}학년 {appUser?.classNumber}반 공유
        </span>
      </div>

      {/* Calendar */}
      <div className="mx-4 rounded-2xl" style={{ background: "var(--card)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => { const d = new Date(currentMonth); d.setMonth(d.getMonth() - 1); setCurrentMonth(d); }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--primary-light)" }}>
            <span style={{ color: "var(--primary)" }}>‹</span>
          </button>
          <div className="text-center">
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{year}</div>
            <div className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{month + 1}월</div>
          </div>
          <button onClick={() => { const d = new Date(currentMonth); d.setMonth(d.getMonth() + 1); setCurrentMonth(d); }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--primary-light)" }}>
            <span style={{ color: "var(--primary)" }}>›</span>
          </button>
        </div>

        <div className="grid grid-cols-7 px-2">
          {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <div key={d} className="text-center text-[11px] font-semibold py-1" style={{
              color: i === 0 ? "var(--error)" : i === 6 ? "#4363E9" : "var(--text-secondary)"
            }}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 px-2 pb-3">
          {days.map((d, i) => {
            if (!d) return <div key={`e-${i}`} className="h-11" />;
            const ds = fmt(d);
            const isSelected = ds === fmt(selectedDate);
            const hasExam = !!examsByDate[ds];
            return (
              <button key={ds} onClick={() => setSelectedDate(d)} className="flex flex-col items-center justify-center h-11 rounded-xl"
                style={{ background: isSelected ? "var(--primary)" : "transparent" }}>
                <span className="text-[13px] font-medium" style={{
                  color: isSelected ? "#fff" : ds === fmt(new Date()) ? "var(--primary)" : "var(--text-primary)"
                }}>{d.getDate()}</span>
                {hasExam && <div className="w-1 h-1 rounded-full mt-0.5" style={{ background: isSelected ? "#fff" : "var(--primary)" }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day tasks */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
            {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일의 할 일
          </span>
          {selectedExams.length > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
              {selectedExams.length}건
            </span>
          )}
        </div>

        {selectedExams.length === 0 ? (
          <div className="flex items-center gap-2 p-4 rounded-xl" style={{ background: "var(--card)" }}>
            <span style={{ color: "var(--success)" }}>✓</span>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>이 날은 등록된 일정이 없어요</span>
          </div>
        ) : (
          selectedExams.map((exam) => (
            <div key={exam.id} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "var(--card)", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: (typeColors[exam.examType] || "#8E8E93") + "1a" }}>
                <span className="text-sm">📝</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{
                    background: (typeColors[exam.examType] || "#8E8E93") + "1a",
                    color: typeColors[exam.examType] || "#8E8E93"
                  }}>{exam.examType}</span>
                  <span className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{exam.subject}</span>
                </div>
                {exam.description && (
                  <p className="text-xs mt-1 truncate" style={{ color: "var(--text-secondary)" }}>{exam.description}</p>
                )}
              </div>
              <button onClick={() => removeExam(exam.id)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--divider)" }}>
                <span className="text-xs">🗑️</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => { setShowAdd(true); setExamDate(selectedDate.toISOString().split("T")[0]); }}
        className="fixed bottom-24 right-4 px-5 py-3 rounded-full text-white font-semibold text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
        style={{ background: "var(--primary)" }}
      >
        + 일정 추가
      </button>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="w-full max-w-lg rounded-t-3xl p-6 space-y-4" style={{ background: "var(--card)" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>일정 추가</h2>
              <button onClick={() => setShowAdd(false)} className="text-sm" style={{ color: "var(--text-secondary)" }}>취소</button>
            </div>

            <input
              type="text" placeholder="과목명 (예: 국어)" value={subject} onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--divider)", color: "var(--text-primary)" }}
            />

            <select
              value={examType} onChange={(e) => setExamType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--divider)", color: "var(--text-primary)" }}
            >
              {examTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            <input
              type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--divider)", color: "var(--text-primary)" }}
            />

            <textarea
              placeholder="내용·범위 (선택)" value={description} onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: "var(--bg)", border: "1px solid var(--divider)", color: "var(--text-primary)" }}
            />

            <button
              onClick={addExam}
              disabled={!subject}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: "var(--primary)", opacity: subject ? 1 : 0.4 }}
            >
              추가하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
