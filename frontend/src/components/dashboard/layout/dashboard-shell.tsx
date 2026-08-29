"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/navigation/sidebar";
import { Topbar } from "@/components/dashboard/navigation/topbar";
import CopilotPanel from "@/components/dashboard/copilot-panel";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({
  children,
}: DashboardShellProps) {
  const [showCopilot, setShowCopilot] = useState(false);

  return (
    <div className="flex min-h-screen overflow-hidden bg-surface text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          showCopilot={showCopilot}
          onCopilotToggle={() =>
            setShowCopilot((value) => !value)
          }
        />

        <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
          <main className="min-w-0 flex-1 overflow-y-auto scroll-smooth">
            <div className="animate-[shellPageIn_500ms_cubic-bezier(0.22,1,0.36,1)_both]">
              {children}
            </div>
          </main>

          {showCopilot && (
            <aside className="relative z-40 hidden w-[380px] shrink-0 overflow-hidden border-l border-ui bg-card shadow-[-20px_0_60px_rgba(0,0,0,0.12)] lg:flex animate-[copilotIn_450ms_cubic-bezier(0.22,1,0.36,1)_both]">
              <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

              <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-400/[0.025] blur-3xl" />

              <div className="relative z-20 flex min-h-0 flex-1">
                <CopilotPanel
                  onClose={() => setShowCopilot(false)}
                />
              </div>
            </aside>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shellPageIn {
          from {
            opacity: 0.92;
            transform: translateY(4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes copilotIn {
          from {
            opacity: 0;
            transform: translateX(24px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}