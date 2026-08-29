"use client";

import { useEffect, useState } from "react";

import { Activity, Sparkles } from "lucide-react";

import DashboardData from "@/components/dashboard/dashboard-data";
import AuthGuard from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
    }, 80);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <DashboardShell>
      <main className="relative min-h-full overflow-hidden bg-background">
        {/* =====================================================
            AMBIENT DASHBOARD BACKGROUND
        ====================================================== */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute left-[35%] top-[-180px] h-[520px] w-[520px] rounded-full bg-emerald-400/[0.025] blur-3xl animate-[dashboardGlow_9s_ease-in-out_infinite]" />

          <div className="absolute right-[-160px] top-[20%] h-[380px] w-[380px] rounded-full bg-cyan-400/[0.018] blur-3xl animate-[dashboardGlow_12s_ease-in-out_infinite_reverse]" />

          <div className="absolute bottom-[-180px] left-[20%] h-[420px] w-[420px] rounded-full bg-emerald-400/[0.018] blur-3xl animate-[dashboardGlow_11s_ease-in-out_infinite]" />
        </div>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="relative z-10 p-5 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1600px]">
            {/* =================================================
                COMMAND CENTER HEADER
            ================================================= */}

            <section
              className={`mb-8 transition-all duration-700 ease-out ${
                mounted
                  ? "translate-y-0 opacity-100"
                  : "translate-y-5 opacity-0"
              }`}
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                {/* Heading */}
                <div>
                  <div
                    className={`flex items-center gap-2 transition-all duration-500 ${
                      mounted
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-3 opacity-0"
                    }`}
                  >
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                      Revenue intelligence
                    </p>
                  </div>

                  <h2
                    className={`mt-2 text-4xl font-bold tracking-[-0.045em] text-foreground transition-all delay-100 duration-700 sm:text-5xl ${
                      mounted
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    }`}
                  >
                    Command Center
                  </h2>

                  <p
                    className={`mt-3 max-w-2xl text-sm leading-6 text-muted-foreground transition-all delay-200 duration-700 ${
                      mounted
                        ? "translate-y-0 opacity-100"
                        : "translate-y-3 opacity-0"
                    }`}
                  >
                    Monitor revenue at risk, understand why payments are
                    slipping, and let Reclaim recover what can still be saved.
                  </p>
                </div>

                {/* Recovery engine status */}
                <div
                  className={`flex items-center gap-3 transition-all delay-300 duration-700 ${
                    mounted
                      ? "translate-x-0 opacity-100"
                      : "translate-x-4 opacity-0"
                  }`}
                >
                  <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.035] px-3 py-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                      <span className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
                    </span>

                    <Activity className="h-3 w-3 text-emerald-400" />

                    <span className="text-[10px] font-medium text-emerald-400">
                      Recovery engine active
                    </span>
                  </div>
                </div>
              </div>

              {/* Animated divider */}
              <div
                className={`mt-7 h-px origin-left bg-gradient-to-r from-emerald-400/20 via-white/[0.06] to-transparent transition-transform duration-1000 ${
                  mounted ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </section>

            {/* =================================================
                DASHBOARD CONTENT
            ================================================= */}

            <div
              className={`transition-all delay-300 duration-1000 ease-out ${
                mounted
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              <AuthGuard>
                <DashboardData />
              </AuthGuard>
            </div>

            {/* =================================================
                BOTTOM STATUS
            ================================================= */}

            <div
              className={`mt-6 flex items-center justify-center gap-2 transition-all delay-700 duration-700 ${
                mounted
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              }`}
            >
              <Sparkles className="h-3 w-3 text-emerald-400/60" />

              <span className="text-[9px] tracking-wide text-muted-foreground/60">
                Reclaim intelligence layer active
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* =====================================================
          DASHBOARD ANIMATIONS
      ====================================================== */}

      <style jsx>{`
        @keyframes dashboardGlow {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.7;
          }

          50% {
            transform: translate3d(18px, -14px, 0) scale(1.08);
            opacity: 1;
          }
        }
      `}</style>
    </DashboardShell>
  );
}