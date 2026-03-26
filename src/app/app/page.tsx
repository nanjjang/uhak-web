"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import SchoolSetup from "@/components/SchoolSetup";
import MainApp from "@/components/MainApp";

export default function AppRoute() {
  const { user, appUser, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      window.location.href = "/login";
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-4xl font-bold" style={{ color: "var(--primary)" }}>우학</div>
      </div>
    );
  }

  if (!appUser?.school || !appUser?.grade || !appUser?.classNumber) {
    return <SchoolSetup />;
  }

  return <MainApp />;
}
