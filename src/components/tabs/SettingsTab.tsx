"use client";

import { useState, useEffect } from "react";
import { useAuth, AppUser, School, schoolName, schoolRegion, schoolTypeDisplay, schoolAddress } from "@/lib/auth-context";
import { searchSchools } from "@/lib/neis";

export default function SettingsTab() {
  const { appUser, logout, deleteAccount, updateAppUser, setTheme } = useAuth();
  const [showChangeInfo, setShowChangeInfo] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currentTheme = appUser?.themeMode || "system";

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
    } catch {
      alert("계정 삭제에 실패했습니다. 다시 로그인 후 시도해주세요.");
    }
  };

  return (
    <div>
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>설정</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile */}
        <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "var(--card)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
            {appUser?.name?.charAt(0) || "U"}
          </div>
          <div>
            <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{appUser?.name}</div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{appUser?.email}</div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block" style={{
              background: appUser?.authProvider === "google" ? "rgba(66,133,244,0.1)" : "var(--primary-light)",
              color: appUser?.authProvider === "google" ? "#4285F4" : "var(--primary)"
            }}>
              {appUser?.authProvider === "google" ? "Google" : "Email"}
            </span>
          </div>
        </div>

        {/* School Info */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="px-4 py-2">
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>학교 정보</span>
          </div>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--divider)" }}>
            <span className="text-sm" style={{ color: "var(--text-primary)" }}>{schoolName(appUser?.school)}</span>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{schoolTypeDisplay(appUser?.school)}</span>
          </div>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--divider)" }}>
            <span className="text-sm" style={{ color: "var(--text-primary)" }}>지역</span>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{schoolRegion(appUser?.school)}</span>
          </div>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--divider)" }}>
            <span className="text-sm" style={{ color: "var(--text-primary)" }}>학년·반</span>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{appUser?.grade}학년 {appUser?.classNumber}반</span>
          </div>
          <button
            onClick={() => setShowChangeInfo(true)}
            className="w-full px-4 py-3 flex items-center justify-between"
            style={{ borderTop: "1px solid var(--divider)" }}
          >
            <span className="text-sm font-medium" style={{ color: "var(--primary)" }}>학교/학년/반 변경</span>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>›</span>
          </button>
        </div>

        {/* Theme */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="px-4 py-2">
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>테마</span>
          </div>
          <div className="px-4 py-3 flex gap-2" style={{ borderTop: "1px solid var(--divider)" }}>
            {[
              { value: "system", label: "시스템" },
              { value: "light", label: "라이트" },
              { value: "dark", label: "다크" },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: currentTheme === t.value ? "var(--primary)" : "transparent",
                  color: currentTheme === t.value ? "#fff" : "var(--text-secondary)",
                  border: `1px solid ${currentTheme === t.value ? "var(--primary)" : "var(--divider)"}`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* App Info */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="px-4 py-2">
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>앱 정보</span>
          </div>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--divider)" }}>
            <span className="text-sm" style={{ color: "var(--text-primary)" }}>버전</span>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>1.0.0 (웹)</span>
          </div>
          <a
            href="https://open.neis.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 flex items-center justify-between"
            style={{ borderTop: "1px solid var(--divider)" }}
          >
            <span className="text-sm" style={{ color: "var(--text-primary)" }}>NEIS 교육정보 출처</span>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>↗</span>
          </a>
        </div>

        {/* Account */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <button onClick={logout} className="w-full px-4 py-3.5 text-left text-sm font-semibold" style={{ color: "var(--error)" }}>
            로그아웃
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full px-4 py-3.5 text-left text-sm"
            style={{ color: "var(--text-secondary)", borderTop: "1px solid var(--divider)" }}
          >
            계정 탈퇴
          </button>
        </div>
      </div>

      {/* Change Info Modal */}
      {showChangeInfo && (
        <ChangeInfoModal onClose={() => setShowChangeInfo(false)} />
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: "var(--card)" }}>
            <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>계정 탈퇴</h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: "var(--divider)", color: "var(--text-primary)" }}
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: "var(--error)" }}
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChangeInfoModal({ onClose }: { onClose: () => void }) {
  const { appUser, updateAppUser } = useAuth();
  const [mode, setMode] = useState<"select" | "school" | "grade">("select");
  const [keyword, setKeyword] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | undefined>(appUser?.school);
  const [grade, setGrade] = useState<number | undefined>(appUser?.grade);
  const [classNum, setClassNum] = useState<number | undefined>(appUser?.classNumber);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const saveChanges = async () => {
    setSaving(true);
    const data: Record<string, unknown> = {};
    if (selectedSchool && selectedSchool.SD_SCHUL_CODE !== appUser?.school?.SD_SCHUL_CODE) {
      data.school = selectedSchool;
    }
    if (grade && grade !== appUser?.grade) data.grade = grade;
    if (classNum && classNum !== appUser?.classNumber) data.classNumber = classNum;
    if (Object.keys(data).length > 0) {
      await updateAppUser(data as Partial<AppUser>);
    }
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-6 max-h-[85vh] overflow-y-auto" style={{ background: "var(--card)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            {mode === "select" ? "정보 변경" : mode === "school" ? "학교 검색" : "학년·반 선택"}
          </h2>
          <button onClick={onClose} className="text-sm" style={{ color: "var(--text-secondary)" }}>닫기</button>
        </div>

        {mode === "select" && (
          <div className="space-y-3">
            <button
              onClick={() => setMode("school")}
              className="w-full p-4 rounded-xl text-left flex items-center justify-between"
              style={{ background: "var(--bg)", border: "1px solid var(--divider)" }}
            >
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>학교 변경</div>
                <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{schoolName(selectedSchool)}</div>
              </div>
              <span style={{ color: "var(--text-tertiary)" }}>›</span>
            </button>

            <button
              onClick={() => setMode("grade")}
              className="w-full p-4 rounded-xl text-left flex items-center justify-between"
              style={{ background: "var(--bg)", border: "1px solid var(--divider)" }}
            >
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>학년·반 변경</div>
                <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{grade}학년 {classNum}반</div>
              </div>
              <span style={{ color: "var(--text-tertiary)" }}>›</span>
            </button>

            <button
              onClick={saveChanges}
              disabled={saving}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm mt-4"
              style={{ background: "var(--primary)", opacity: saving ? 0.6 : 1 }}
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        )}

        {mode === "school" && (
          <div className="space-y-3">
            <button onClick={() => setMode("select")} className="text-sm mb-2" style={{ color: "var(--primary)" }}>← 뒤로</button>
            <input
              type="text"
              placeholder="학교 이름을 검색하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              autoFocus
              className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--divider)", color: "var(--text-primary)" }}
            />
            {searching && <p className="text-sm px-1" style={{ color: "var(--text-secondary)" }}>검색 중...</p>}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {schools.map((s) => (
                <button
                  key={s.SD_SCHUL_CODE}
                  onClick={() => { setSelectedSchool(s); setMode("select"); }}
                  className="w-full text-left p-4 rounded-xl transition-all"
                  style={{
                    background: selectedSchool?.SD_SCHUL_CODE === s.SD_SCHUL_CODE ? "var(--primary-light)" : "var(--bg)",
                    border: `1px solid ${selectedSchool?.SD_SCHUL_CODE === s.SD_SCHUL_CODE ? "var(--primary)" : "var(--divider)"}`,
                  }}
                >
                  <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{schoolName(s)}</div>
                  <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{schoolRegion(s)} · {schoolAddress(s)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === "grade" && (
          <div className="space-y-5">
            <button onClick={() => setMode("select")} className="text-sm mb-2" style={{ color: "var(--primary)" }}>← 뒤로</button>

            <div>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>학년</p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className="py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: grade === g ? "var(--primary)" : "var(--bg)",
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
                      background: classNum === c ? "var(--primary)" : "var(--bg)",
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
              onClick={() => setMode("select")}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: "var(--primary)" }}
            >
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
