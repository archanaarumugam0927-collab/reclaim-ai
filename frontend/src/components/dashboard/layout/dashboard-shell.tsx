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
    <div className="flex min-h-screen bg-surface text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          showCopilot={showCopilot}
          onCopilotToggle={() =>
            setShowCopilot((value) => !value)
          }
        />

        <div className="flex min-h-0 min-w-0 flex-1">
          <main className="min-w-0 flex-1 overflow-y-auto">
            {children}
          </main>

          {showCopilot && (
            <aside className="flex w-[380px] shrink-0 border-l border-ui bg-card">
              <CopilotPanel
                onClose={() => setShowCopilot(false)}
              />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}