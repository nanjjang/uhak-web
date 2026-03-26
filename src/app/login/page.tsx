"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import LoginPage from "@/components/LoginPage";

export default function LoginRoute() {
  const { user, appUser, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user && appUser?.school && appUser?.grade && appUser?.classNumber) {
      window.location.href = "/app";
    }
  }, [user, appUser, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-4xl font-bold" style={{ color: "var(--primary)" }}>우학</div>
      </div>
    );
  }

  return <LoginPage />;
}
