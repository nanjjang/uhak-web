"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  deleteUser,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// iOS와 동일한 Firestore 필드명 사용
export interface School {
  SD_SCHUL_CODE: string;   // schoolCode
  SCHUL_NM: string;        // schoolName
  ORG_RDNZC: string;       // orgCode
  ATPT_OFCDC_SC_CODE: string; // eduOfficeCode
  SCHUL_KND_SC_NM: string; // schoolType: "MIDD" | "HIGH"
  ORG_RDNMA: string;       // address
  ATPT_OFCDC_SC_NM: string; // region
}

// Helper functions to read School fields
export function schoolName(s?: School): string { return s?.SCHUL_NM ?? ""; }
export function schoolCode(s?: School): string { return s?.SD_SCHUL_CODE ?? ""; }
export function eduOfficeCode(s?: School): string { return s?.ATPT_OFCDC_SC_CODE ?? ""; }
export function schoolRegion(s?: School): string { return s?.ATPT_OFCDC_SC_NM ?? ""; }
export function schoolAddress(s?: School): string { return s?.ORG_RDNMA ?? ""; }
export function schoolType(s?: School): "MIDD" | "HIGH" {
  return (s?.SCHUL_KND_SC_NM as "MIDD" | "HIGH") ?? "HIGH";
}
export function schoolTypeDisplay(s?: School): string {
  return schoolType(s) === "HIGH" ? "고등학교" : "중학교";
}

// iOS AppUser와 동일한 구조
export interface AppUser {
  id: string;
  name: string;
  email: string;
  profileImageURL?: string;
  authProvider: "google" | "email";
  school?: School;
  grade?: number;
  classNumber?: number;
  birthYear: number;
  joinedYear: number;
  schoolEntryYear: number;
  lastGradeUpdateYear: number;
  isGraduated: boolean;
  themeMode: string;
  periodSchedule: unknown[];
}

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateAppUser: (data: Partial<AppUser>) => Promise<void>;
  setTheme: (mode: string) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function applyTheme(mode: string) {
  if (mode === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", mode);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as AppUser;
          setAppUser(data);
          applyTheme(data.themeMode || "system");
        }
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const registerWithEmail = async (email: string, password: string, name: string) => {
    const currentYear = new Date().getFullYear();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const newUser: AppUser = {
      id: cred.user.uid,
      name,
      email,
      authProvider: "email",
      birthYear: 0,
      joinedYear: currentYear,
      schoolEntryYear: currentYear,
      lastGradeUpdateYear: 0,
      isGraduated: false,
      themeMode: "system",
      periodSchedule: [],
    };
    await setDoc(doc(db, "users", cred.user.uid), newUser);
    setAppUser(newUser);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const docRef = doc(db, "users", cred.user.uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      const currentYear = new Date().getFullYear();
      const newUser: AppUser = {
        id: cred.user.uid,
        name: cred.user.displayName || "",
        email: cred.user.email || "",
        authProvider: "google",
        birthYear: 0,
        joinedYear: currentYear,
        schoolEntryYear: currentYear,
        lastGradeUpdateYear: 0,
        isGraduated: false,
        themeMode: "system",
        periodSchedule: [],
      };
      await setDoc(docRef, newUser);
      setAppUser(newUser);
    } else {
      const data = snap.data() as AppUser;
      setAppUser(data);
      applyTheme(data.themeMode || "system");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setAppUser(null);
    applyTheme("system");
    window.location.href = "/";
  };

  const deleteAccount = async () => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid));
    await deleteUser(user);
    setAppUser(null);
    applyTheme("system");
    window.location.href = "/";
  };

  const updateAppUser = async (data: Partial<AppUser>) => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), data, { merge: true });
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      const updated = snap.data() as AppUser;
      setAppUser(updated);
      if (data.themeMode) applyTheme(data.themeMode);
    }
  };

  const setTheme = (mode: string) => {
    applyTheme(mode);
    updateAppUser({ themeMode: mode });
  };

  return (
    <AuthContext.Provider
      value={{ user, appUser, loading, loginWithEmail, registerWithEmail, loginWithGoogle, logout, deleteAccount, updateAppUser, setTheme }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
