import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { ArrowLeft, Server as ServerIcon, Code2, BarChart3, Loader2 } from "lucide-react";
import ServersManager from "@/components/admin/ServersManager";
import ProjectsManager from "@/components/admin/ProjectsManager";
import MetricsManager from "@/components/admin/MetricsManager";

const ALLOWED_EMAIL = "kurtys.capron67@gmail.com";

const TABS = [
  { id: "servers", label: "Servers", icon: ServerIcon },
  { id: "projects", label: "Projects", icon: Code2 },
  { id: "metrics", label: "Metrics", icon: BarChart3 },
];

export default function ManageServers() {
  const { user, isLoadingAuth } = useAuth();
  const [tab, setTab] = useState("servers");

  // Gate: only the owner's email may reach the admin tool. Hooks above; early
  // returns below are fine because no more hooks run in this wrapper.
  if (isLoadingAuth || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <Loader2 className="h-6 w-6 animate-spin text-redstone" />
      </div>
    );
  }
  if (user.email !== ALLOWED_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen bg-void pb-24">
      {/* top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-void/90 px-6 py-4 backdrop-blur-md md:px-12">
        <div className="flex items-center gap-4">
          <Link to="/" className="focus-ring flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-tungsten transition-colors hover:text-redstone">
            <ArrowLeft className="h-4 w-4" /> codex
          </Link>
          <span className="hidden h-4 w-px bg-border sm:inline-block" />
          <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-tungsten sm:inline">admin // control panel</span>
        </div>
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-tungsten">
          <span className="h-2 w-2 bg-redstone animate-torch" /> session.live
        </span>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10 md:px-12">
        {/* tabs */}
        <div className="mb-10 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`focus-ring flex items-center gap-2 rounded-sm border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                  active
                    ? "border-redstone bg-redstone text-void"
                    : "border-border bg-transparent text-tungsten hover:border-redstone/60 hover:text-iron"
                }`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === "servers" && <ServersManager />}
        {tab === "projects" && <ProjectsManager />}
        {tab === "metrics" && <MetricsManager />}
      </div>
    </main>
  );
}