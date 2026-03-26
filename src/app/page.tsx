"use client";

import { useAuth } from "@/lib/auth-context";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  const { user, appUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <div className="text-4xl font-bold" style={{ color: "var(--primary)" }}>우학</div>
          <div className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>우리학교</div>
        </div>
      </div>
    );
  }

  return <LandingPage />;
}
