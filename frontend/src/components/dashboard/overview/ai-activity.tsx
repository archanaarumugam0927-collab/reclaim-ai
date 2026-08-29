"use client";

import { useState } from "react";

import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock3,
  Sparkles,
  X,
  Activity,
  BrainCircuit,
  Zap,
} from "lucide-react";

import type { RecoveryCase } from "@/lib/api/recovery";

interface AiActivityProps {
  cases: RecoveryCase[];
}

function formatAmount(amount: number, currency = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
}

function formatAction(value?: string | null) {
  if (!value) return "Recovery action";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getTimeAgo(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const diff = Date.now() - date.getTime();

  const minutes = Math.max(0, Math.floor(diff / 60000));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function AiActivity({ cases }: AiActivityProps) {
  const [showAgentActivity, setShowAgentActivity] = useState(false);

  const activities = [...cases]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
    )
    .slice(0, 6)
    .map((recoveryCase) => {
      const recovered =
        (recoveryCase.recovered_amount || 0) > 0;

      if (recovered) {
        return {
          id: recoveryCase.id,
          icon: CheckCircle2,
          title: "Recovery action completed",
          description:
            `${recoveryCase.customer_name} · ` +
            `${formatAmount(
              recoveryCase.recovered_amount,
              recoveryCase.currency
            )} Recovered`,
          time: getTimeAgo(recoveryCase.updated_at),
          type: "recovery" as const,
          customer: recoveryCase.customer_name,
          amount: recoveryCase.recovered_amount,
          action:
            recoveryCase.action_taken ||
            recoveryCase.recommended_action,
          risk: recoveryCase.risk_level,
          reason: recoveryCase.decision_reasoning,
        };
      }

      return {
        id: recoveryCase.id,
        icon: Sparkles,
        title: "Customer intent analyzed",
        description:
          `${recoveryCase.customer_name} · ` +
          `${formatAction(recoveryCase.risk_level)} Risk · ` +
          `${formatAction(recoveryCase.recommended_action)}`,
        time: getTimeAgo(recoveryCase.updated_at),
        type: "analysis" as const,
        customer: recoveryCase.customer_name,
        amount: recoveryCase.amount,
        action: recoveryCase.recommended_action,
        risk: recoveryCase.risk_level,
        reason: recoveryCase.decision_reasoning,
      };
    });

  return (
    <>
      {/* ======================================================
          MAIN AI ACTIVITY CARD
      ======================================================= */}

      <section className="group relative overflow-hidden rounded-2xl border border-border bg-white p-5 text-zinc-900 shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/[0.06] dark:bg-[#0b0f10] dark:text-white dark:shadow-none sm:p-6">

        {/* Ambient AI glow */}

        <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-emerald-400/[0.06] blur-3xl transition-all duration-700 group-hover:bg-emerald-400/[0.11]" />

        <div className="pointer-events-none absolute -bottom-24 -left-24 h-40 w-40 rounded-full bg-cyan-400/[0.03] blur-3xl" />

        {/* Animated top line */}

        <div className="pointer-events-none absolute left-0 right-0 top-0 h-px overflow-hidden bg-white/[0.04] dark:bg-white/[0.04]">
          <div className="h-full w-1/3 animate-[aiScan_3s_ease-in-out_infinite] bg-emerald-400/70" />
        </div>

        {/* HEADER */}

        <div className="relative flex items-start justify-between">

          <div>

            <div className="flex items-center gap-2">

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                AI operations
              </p>

              {/* LIVE INDICATOR */}

              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] font-medium text-emerald-600 dark:border-emerald-400/10 dark:bg-emerald-400/[0.05] dark:text-emerald-400">

                <span className="relative flex h-1.5 w-1.5">

                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />

                </span>

                Live

              </span>

            </div>

            <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-zinc-900 dark:text-white">
              Recovery activity
            </h3>

            <div className="mt-1 flex items-center gap-2">

              <Activity className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />

              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                AI engine monitoring recovery signals
              </p>

            </div>

          </div>

          {/* BOT ICON */}

          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/10 bg-emerald-500/10 text-emerald-600 transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(52,211,153,0.12)] dark:border-emerald-400/10 dark:bg-emerald-400/10 dark:text-emerald-400">

            <div className="absolute inset-0 animate-pulse rounded-xl bg-emerald-400/5" />

            <Bot className="relative h-4 w-4" />

          </div>

        </div>

        {/* ACTIVITY LIST */}

        <div className="relative mt-6">

          {activities.length === 0 ? (

            <div className="rounded-xl border border-dashed border-zinc-200 py-10 text-center dark:border-white/[0.06]">

              <BrainCircuit className="mx-auto h-5 w-5 text-zinc-400" />

              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                No recovery activity yet.
              </p>

            </div>

          ) : (

            activities.map((activity, index) => {

              const Icon = activity.icon;

              return (
                <div
                  key={`${activity.id}-${index}`}
                  className={`group/activity relative flex gap-3 py-4 transition-all duration-300 hover:translate-x-1 ${
                    index !== activities.length - 1
                      ? "border-b border-zinc-200 dark:border-white/[0.05]"
                      : ""
                  }`}
                >

                  {/* TIMELINE */}

                  {index !== activities.length - 1 && (
                    <span className="absolute left-[15px] top-12 h-[calc(100%-24px)] w-px bg-zinc-200 transition-colors duration-300 group-hover/activity:bg-emerald-400/20 dark:bg-white/[0.06]" />
                  )}

                  {/* ICON */}

                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 group-hover/activity:scale-110 ${
                      activity.type === "recovery"
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/10 dark:bg-emerald-400/10 dark:text-emerald-400"
                        : "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-white/[0.06] dark:bg-[#101416] dark:text-zinc-400"
                    }`}
                  >

                    <Icon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/activity:scale-110" />

                    {/* ACTIVE PULSE */}

                    {index === 0 && (
                      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-3">

                      <p
                        className={`text-xs font-medium transition-colors ${
                          activity.type === "recovery"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {activity.title}
                      </p>

                      <span className="flex shrink-0 items-center gap-1 text-[9px] text-zinc-500 dark:text-zinc-400">

                        <Clock3 className="h-2.5 w-2.5" />

                        {activity.time}

                      </span>

                    </div>

                    <p className="mt-1 text-[10px] leading-5 text-zinc-600 dark:text-zinc-400">
                      {activity.description}
                    </p>

                    {/* MINI STATUS */}

                    <div className="mt-2 flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover/activity:opacity-100">

                      <span className="h-1 w-1 rounded-full bg-emerald-400" />

                      <span className="text-[9px] text-emerald-500 dark:text-emerald-400">
                        AI decision processed
                      </span>

                    </div>

                  </div>

                </div>
              );
            })

          )}

        </div>

        {/* FOOTER ACTION */}

        <button
          type="button"
          onClick={() => setShowAgentActivity(true)}
          className="group/button relative mt-4 flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 text-[10px] font-medium text-zinc-600 transition-all duration-300 hover:border-emerald-400/20 hover:bg-emerald-400/[0.04] hover:text-zinc-900 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-zinc-400 dark:hover:bg-emerald-400/[0.04] dark:hover:text-white"
        >

          <span className="absolute inset-y-0 -left-full w-1/3 skew-x-12 bg-white/10 transition-all duration-700 group-hover/button:left-[130%]" />

          <span className="relative">
            View agent activity
          </span>

          <ArrowUpRight className="relative h-3 w-3 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />

        </button>

      </section>

      {/* ======================================================
          AI AGENT ACTIVITY MODAL
      ======================================================= */}

      {showAgentActivity && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md animate-[modalFade_200ms_ease-out] dark:bg-black/75"
          onClick={() => setShowAgentActivity(false)}
        >

          <div
            className="relative max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-2xl animate-[modalEnter_300ms_cubic-bezier(0.22,1,0.36,1)] dark:border-white/[0.08] dark:bg-[#0b0f10] dark:text-white"
            onClick={(event) => event.stopPropagation()}
          >

            {/* MODAL GLOW */}

            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

            {/* MODAL HEADER */}

            <div className="relative flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-white/[0.06]">

              <div className="flex items-center gap-3">

                <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">

                  <Bot className="relative h-4 w-4" />

                  <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                </div>

                <div>

                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    AI Agent Activity
                  </h3>

                  <div className="mt-0.5 flex items-center gap-1.5">

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />

                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      Agent is live
                    </span>

                  </div>

                </div>

              </div>

              <button
                type="button"
                onClick={() => setShowAgentActivity(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-all duration-200 hover:rotate-90 hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/[0.06] dark:hover:bg-white/[0.05] dark:hover:text-white"
                aria-label="Close agent activity"
              >
                <X className="h-4 w-4" />
              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="max-h-[calc(85vh-80px)] overflow-y-auto p-5">

              {/* COPILOT STATUS */}

              <div className="relative mb-5 overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 dark:border-emerald-400/10 dark:bg-emerald-400/[0.03]">

                <div className="absolute right-0 top-0 h-full w-1/3 bg-emerald-400/[0.03] blur-2xl" />

                <div className="relative flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">

                    <BrainCircuit className="h-4 w-4 animate-pulse" />

                  </div>

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400">
                      Reclaim Copilot
                    </p>

                    <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-white">
                      Monitoring payment failures, analyzing customer recovery intent, and selecting the highest-value recovery action.
                    </p>

                    <div className="mt-3 flex items-center gap-2">

                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                      <span className="text-[9px] text-emerald-500 dark:text-emerald-400">
                        Decision engine active
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              {/* ACTIVITIES */}

              <div className="space-y-3">

                {activities.length === 0 ? (

                  <div className="rounded-xl border border-zinc-200 p-8 text-center text-sm text-zinc-500 dark:border-white/[0.05] dark:text-zinc-400">
                    No agent activity available.
                  </div>

                ) : (

                  activities.map((activity, index) => {

                    const Icon = activity.icon;

                    return (
                      <div
                        key={`agent-${activity.id}`}
                        className="group/modal relative rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/20 hover:shadow-lg dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:bg-emerald-400/[0.02]"
                      >

                        {/* NUMBER */}

                        <div className="absolute right-4 top-4 text-[9px] font-medium text-zinc-300 dark:text-white/[0.15]">
                          #{String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="flex items-start gap-3">

                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover/modal:scale-110 ${
                              activity.type === "recovery"
                                ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                                : "bg-zinc-100 text-zinc-500 dark:bg-white/[0.04] dark:text-zinc-400"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-3 pr-8">

                              <div>

                                <p
                                  className={`text-sm font-medium ${
                                    activity.type === "recovery"
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : "text-zinc-900 dark:text-white"
                                  }`}
                                >
                                  {activity.title}
                                </p>

                                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                                  {activity.customer}
                                </p>

                              </div>

                              <span className="flex shrink-0 items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400">

                                <Clock3 className="h-3 w-3" />

                                {activity.time}

                              </span>

                            </div>

                            {/* DETAILS */}

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">

                              <div className="rounded-lg bg-black/[0.02] p-2.5 dark:bg-white/[0.02]">

                                <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                                  Risk
                                </p>

                                <p className="mt-1 text-xs capitalize text-zinc-900 dark:text-white">
                                  {formatAction(activity.risk)}
                                </p>

                              </div>

                              <div className="rounded-lg bg-black/[0.02] p-2.5 dark:bg-white/[0.02]">

                                <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                                  Recovery action
                                </p>

                                <p className="mt-1 text-xs capitalize text-emerald-600 dark:text-emerald-400">
                                  {formatAction(activity.action)}
                                </p>

                              </div>

                              <div className="rounded-lg bg-black/[0.02] p-2.5 dark:bg-white/[0.02]">

                                <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                                  Amount
                                </p>

                                <p className="mt-1 text-xs text-zinc-900 dark:text-white">
                                  {formatAmount(
                                    activity.amount
                                  )}
                                </p>

                              </div>

                              <div className="rounded-lg bg-black/[0.02] p-2.5 dark:bg-white/[0.02]">

                                <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                                  Status
                                </p>

                                <div className="mt-1 flex items-center gap-1.5">

                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                                  <p className="text-xs text-zinc-900 dark:text-white">
                                    {activity.type === "recovery"
                                      ? "Completed"
                                      : "Analyzed"}
                                  </p>

                                </div>

                              </div>

                            </div>

                            {/* REASONING */}

                            {activity.reason ? (

                              <div className="mt-4 border-t border-zinc-200 pt-3 dark:border-white/[0.05]">

                                <div className="flex items-center gap-2">

                                  <Zap className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />

                                  <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                                    Agent reasoning
                                  </p>

                                </div>

                                <p className="mt-2 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                                  {activity.reason}
                                </p>

                              </div>

                            ) : null}

                          </div>

                        </div>

                      </div>
                    );
                  })

                )}

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ======================================================
          ANIMATION KEYFRAMES
      ======================================================= */}

      <style jsx>{`
        @keyframes aiScan {
          0% {
            transform: translateX(-140%);
          }

          50% {
            transform: translateX(320%);
          }

          100% {
            transform: translateX(320%);
          }
        }

        @keyframes modalFade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}

export default AiActivity;