"use client";

import { useState, useEffect } from "react";
import { useAuth, School, schoolName, schoolRegion, schoolAddress } from "@/lib/auth-context";
import { searchSchools } from "@/lib/neis";

export default function SchoolSetup() {
  const { appUser, updateAppUser, logout } = useAuth();
  const [step, setStep] = useState<"school" | "grade">(appUser?.school ? "grade" : "school");
  const [keyword, setKeyword] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | undefined>(appUser?.school);
  const [grade, setGrade] = useState<number | undefined>(appUser?.grade);
  const [classNum, setClassNum] = useState<number | undefined>(appUser?.classNumber);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (keyword.length < 2) { setSchools([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      const results = await searchSchools(keyword);
      setSchools(results);
      setSearching(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [keyword]);

  const selectSchool = (school: School) => {
    setSelectedSchool(school);
    setStep("grade");
  };

  const complete = async () => {
    if (!selectedSchool || !grade || !classNum) return;
    await updateAppUser({
      school: selectedSchool,
      grade,
      classNumber: classNum,
      schoolEntryYear: appUser?.schoolEntryYear || new Date().getFullYear(),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {step === "school" ? "학교 선택" : "학년·반 선택"}
          </h1>
          <button onClick={logout} className="text-sm" style={{ color: "var(--text-secondary)" }}>로그아웃</button>
        </div>

        {step === "school" ? (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="학교 이름을 검색하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              autoFocus
              className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
              style={{ background: "var(--card)", border: "1px solid var(--divider)", color: "var(--text-primary)" }}
            />
            {searching && <p className="text-sm px-1" style={{ color: "var(--text-secondary)" }}>검색 중...</p>}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {schools.map((s) => (
                <button
                  key={s.SD_SCHUL_CODE}
                  onClick={() => selectSchool(s)}
                  className="w-full text-left p-4 rounded-xl transition-all hover:scale-[0.99] active:scale-[0.97]"
                  style={{ background: "var(--card)", border: "1px solid var(--divider)" }}
                >
                  <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{schoolName(s)}</div>
                  <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{schoolRegion(s)} · {schoolAddress(s)}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--divider)" }}>
              <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{schoolName(selectedSchool)}</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{schoolRegion(selectedSchool)}</div>
              <button onClick={() => setStep("school")} className="text-xs mt-2" style={{ color: "var(--primary)" }}>변경</button>
            </div>

            <div>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>학년</p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className="py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: grade === g ? "var(--primary)" : "var(--card)",
                      color: grade === g ? "#fff" : "var(--text-primary)",
                      border: `1px solid ${grade === g ? "var(--primary)" : "var(--divider)"}`,
                    }}
                  >
                    {g}학년
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>반</p>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 15 }, (_, i) => i + 1).map((c) => (
                  <button
                    key={c}
                    onClick={() => setClassNum(c)}
                    className="py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: classNum === c ? "var(--primary)" : "var(--card)",
                      color: classNum === c ? "#fff" : "var(--text-primary)",
                      border: `1px solid ${classNum === c ? "var(--primary)" : "var(--divider)"}`,
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={complete}
              disabled={!grade || !classNum}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-transform active:scale-[0.98]"
              style={{ background: "var(--primary)", opacity: grade && classNum ? 1 : 0.4 }}
            >
              완료
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
