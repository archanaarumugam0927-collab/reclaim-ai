"use client";

import { useState } from "react";

import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock3,
  Sparkles,
  X,
} from "lucide-react";

import type { RecoveryCase } from "@/lib/api/recovery";

interface AiActivityProps {
  cases: RecoveryCase[];
}

function formatAmount(
  amount: number,
  currency = "INR"
) {
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
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

function getTimeAgo(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const diff =
    Date.now() - date.getTime();

  const minutes = Math.max(
    0,
    Math.floor(diff / 60000)
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function AiActivity({
  cases,
}: AiActivityProps) {
  const [showAgentActivity, setShowAgentActivity] =
    useState(false);

  const activities = [...cases]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
    )
    .slice(0, 6)
    .map((recoveryCase) => {
      const recovered =
        (recoveryCase.recovered_amount || 0) >
        0;

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
          time: getTimeAgo(
            recoveryCase.updated_at
          ),
          type: "recovery" as const,
          customer:
            recoveryCase.customer_name,
          amount:
            recoveryCase.recovered_amount,
          action:
            recoveryCase.action_taken ||
            recoveryCase.recommended_action,
          risk:
            recoveryCase.risk_level,
          reason:
            recoveryCase.decision_reasoning,
        };
      }

      return {
        id: recoveryCase.id,
        icon: Sparkles,
        title: "Customer intent analyzed",
        description:
          `${recoveryCase.customer_name} · ` +
          `${formatAction(
            recoveryCase.risk_level
          )} Risk · ` +
          `${formatAction(
            recoveryCase.recommended_action
          )}`,
        time: getTimeAgo(
          recoveryCase.updated_at
        ),
        type: "analysis" as const,
        customer:
          recoveryCase.customer_name,
        amount:
          recoveryCase.amount,
        action:
          recoveryCase.recommended_action,
        risk:
          recoveryCase.risk_level,
        reason:
          recoveryCase.decision_reasoning,
      };
    });

  return (
    <>
      {/* ======================================================
          MAIN ACTIVITY CARD
      ======================================================= */}

      <section
        className="
          rounded-2xl
          border
          border-border
          bg-white
          p-5
          text-zinc-900
          shadow-sm
          dark:border-white/[0.06]
          dark:bg-[#0b0f10]
          dark:text-white
          dark:shadow-none
          sm:p-6
        "
      >

        {/* Header */}

        <div className="flex items-start justify-between">

          <div>

            <div className="flex items-center gap-2">

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                AI operations
              </p>

              <span
                className="
                  flex items-center gap-1.5
                  rounded-full
                  border
                  border-emerald-500/20
                  bg-emerald-500/10
                  px-2 py-1
                  text-[9px]
                  font-medium
                  text-emerald-600
                  dark:border-emerald-400/10
                  dark:bg-emerald-400/[0.05]
                  dark:text-emerald-400
                "
              >

                <span
                  className="
                    h-1.5 w-1.5 rounded-full
                    bg-emerald-500
                    shadow-[0_0_7px_rgba(52,211,153,0.8)]
                    dark:bg-emerald-400
                  "
                />

                Live

              </span>

            </div>

            <h3
              className="
                mt-2
                text-xl
                font-semibold
                tracking-[-0.025em]
                text-zinc-900
                dark:text-white
              "
            >
              Recovery activity
            </h3>

          </div>

          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              bg-emerald-500/10
              text-emerald-600
              dark:bg-emerald-400/10
              dark:text-emerald-400
            "
          >
            <Bot className="h-4 w-4" />
          </div>

        </div>

        {/* Activity list */}

        <div className="mt-6">

          {activities.length === 0 ? (

            <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No recovery activity yet.
            </div>

          ) : (

            activities.map(
              (activity, index) => {

                const Icon =
                  activity.icon;

                return (
                  <div
                    key={`${activity.id}-${index}`}
                    className={`
                      group relative flex gap-3 py-4
                      ${
                        index !==
                        activities.length - 1
                          ? "border-b border-zinc-200 dark:border-white/[0.05]"
                          : ""
                      }
                    `}
                  >

                    {/* Timeline */}

                    {index !==
                      activities.length - 1 && (
                      <span
                        className="
                          absolute
                          left-[15px]
                          top-12
                          h-[calc(100%-24px)]
                          w-px
                          bg-zinc-200
                          dark:bg-white/[0.06]
                        "
                      />
                    )}

                    {/* Icon */}

                    <div
                      className="
                        relative z-10
                        flex h-8 w-8 shrink-0
                        items-center justify-center
                        rounded-lg
                        border
                        border-zinc-200
                        bg-zinc-50
                        text-zinc-500
                        transition-colors
                        group-hover:text-emerald-500
                        dark:border-white/[0.06]
                        dark:bg-[#101416]
                        dark:text-zinc-400
                        dark:group-hover:text-emerald-400
                      "
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-3">

                        <p
                          className={`
                            text-xs font-medium
                            ${
                              activity.type ===
                              "recovery"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-zinc-900 dark:text-zinc-100"
                            }
                          `}
                        >
                          {activity.title}
                        </p>

                        <span
                          className="
                            flex shrink-0
                            items-center gap-1
                            text-[9px]
                            text-zinc-500
                            dark:text-zinc-400
                          "
                        >

                          <Clock3 className="h-2.5 w-2.5" />

                          {activity.time}

                        </span>

                      </div>

                      <p
                        className="
                          mt-1
                          text-[10px]
                          leading-5
                          text-zinc-600
                          dark:text-zinc-400
                        "
                      >
                        {activity.description}
                      </p>

                    </div>

                  </div>
                );
              }
            )

          )}

        </div>

        {/* View Agent Activity */}

        <button
          type="button"
          onClick={() =>
            setShowAgentActivity(true)
          }
          className="
            mt-4
            flex w-full
            items-center justify-center
            gap-1.5
            rounded-xl
            border
            border-zinc-200
            bg-zinc-50
            py-2.5
            text-[10px]
            font-medium
            text-zinc-600
            transition-colors
            hover:bg-zinc-100
            hover:text-zinc-900
            dark:border-white/[0.06]
            dark:bg-white/[0.02]
            dark:text-zinc-400
            dark:hover:bg-white/[0.04]
            dark:hover:text-white
          "
        >
          View agent activity

          <ArrowUpRight className="h-3 w-3" />

        </button>

      </section>

      {/* ======================================================
          AI AGENT ACTIVITY MODAL
      ======================================================= */}

      {showAgentActivity && (

        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/40
            p-4
            backdrop-blur-sm
            dark:bg-black/70
          "
          onClick={() =>
            setShowAgentActivity(false)
          }
        >

          <div
            className="
              max-h-[85vh]
              w-full
              max-w-2xl
              overflow-hidden
              rounded-2xl
              border
              border-zinc-200
              bg-white
              text-zinc-900
              shadow-2xl
              dark:border-white/[0.08]
              dark:bg-[#0b0f10]
              dark:text-white
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div
              className="
                flex items-center justify-between
                border-b
                border-zinc-200
                px-5 py-4
                dark:border-white/[0.06]
              "
            >

              <div>

                <div className="flex items-center gap-2">

                  <div
                    className="
                      flex h-8 w-8
                      items-center justify-center
                      rounded-lg
                      bg-emerald-500/10
                      text-emerald-600
                      dark:bg-emerald-400/10
                      dark:text-emerald-400
                    "
                  >
                    <Bot className="h-4 w-4" />
                  </div>

                  <div>

                    <h3
                      className="
                        text-sm
                        font-semibold
                        text-zinc-900
                        dark:text-white
                      "
                    >
                      AI Agent Activity
                    </h3>

                    <div className="mt-0.5 flex items-center gap-1.5">

                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />

                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        Agent is live
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAgentActivity(false)
                }
                className="
                  flex h-8 w-8
                  items-center justify-center
                  rounded-lg
                  border
                  border-zinc-200
                  text-zinc-500
                  transition
                  hover:bg-zinc-100
                  hover:text-zinc-900
                  dark:border-white/[0.06]
                  dark:hover:bg-white/[0.05]
                  dark:hover:text-white
                "
                aria-label="Close agent activity"
              >
                <X className="h-4 w-4" />
              </button>

            </div>

            {/* Modal Content */}

            <div className="max-h-[calc(85vh-80px)] overflow-y-auto p-5">

              <div
                className="
                  mb-5
                  rounded-xl
                  border
                  border-emerald-500/20
                  bg-emerald-500/5
                  p-4
                  dark:border-emerald-400/10
                  dark:bg-emerald-400/[0.03]
                "
              >

                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400">
                  Reclaim Copilot
                </p>

                <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-white">
                  Monitoring payment failures,
                  analyzing customer recovery
                  intent, and selecting the
                  highest-value recovery action.
                </p>

              </div>

              <div className="space-y-3">

                {activities.length === 0 ? (

                  <div
                    className="
                      rounded-xl
                      border
                      border-zinc-200
                      p-8
                      text-center
                      text-sm
                      text-zinc-500
                      dark:border-white/[0.05]
                      dark:text-zinc-400
                    "
                  >
                    No agent activity available.
                  </div>

                ) : (

                  activities.map(
                    (activity) => {

                      const Icon =
                        activity.icon;

                      return (
                        <div
                          key={`agent-${activity.id}`}
                          className="
                            rounded-xl
                            border
                            border-zinc-200
                            bg-zinc-50
                            p-4
                            dark:border-white/[0.06]
                            dark:bg-white/[0.02]
                          "
                        >

                          <div className="flex items-start gap-3">

                            <div
                              className={`
                                flex h-9 w-9
                                shrink-0
                                items-center justify-center
                                rounded-lg
                                ${
                                  activity.type ===
                                  "recovery"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                                    : "bg-zinc-100 text-zinc-500 dark:bg-white/[0.04] dark:text-zinc-400"
                                }
                              `}
                            >
                              <Icon className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-3">

                                <div>

                                  <p
                                    className={`
                                      text-sm
                                      font-medium
                                      ${
                                        activity.type ===
                                        "recovery"
                                          ? "text-emerald-600 dark:text-emerald-400"
                                          : "text-zinc-900 dark:text-white"
                                      }
                                    `}
                                  >
                                    {activity.title}
                                  </p>

                                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                                    {activity.customer}
                                  </p>

                                </div>

                                <span
                                  className="
                                    flex shrink-0
                                    items-center gap-1
                                    text-[10px]
                                    text-zinc-500
                                    dark:text-zinc-400
                                  "
                                >

                                  <Clock3 className="h-3 w-3" />

                                  {activity.time}

                                </span>

                              </div>

                              {/* Details */}

                              <div className="mt-4 grid gap-3 sm:grid-cols-2">

                                <div>

                                  <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                                    Risk
                                  </p>

                                  <p className="mt-1 text-xs capitalize text-zinc-900 dark:text-white">
                                    {formatAction(
                                      activity.risk
                                    )}
                                  </p>

                                </div>

                                <div>

                                  <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                                    Recovery action
                                  </p>

                                  <p className="mt-1 text-xs capitalize text-emerald-600 dark:text-emerald-400">
                                    {formatAction(
                                      activity.action
                                    )}
                                  </p>

                                </div>

                                <div>

                                  <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                                    Amount
                                  </p>

                                  <p className="mt-1 text-xs text-zinc-900 dark:text-white">
                                    {formatAmount(
                                      activity.amount
                                    )}
                                  </p>

                                </div>

                                <div>

                                  <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                                    Status
                                  </p>

                                  <p className="mt-1 text-xs text-zinc-900 dark:text-white">
                                    {activity.type ===
                                    "recovery"
                                      ? "Completed"
                                      : "Analyzed"}
                                  </p>

                                </div>

                              </div>

                              {/* AI Reasoning */}

                              {activity.reason ? (

                                <div
                                  className="
                                    mt-4
                                    border-t
                                    border-zinc-200
                                    pt-3
                                    dark:border-white/[0.05]
                                  "
                                >

                                  <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                                    Agent reasoning
                                  </p>

                                  <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                                    {activity.reason}
                                  </p>

                                </div>

                              ) : null}

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )

                )}

              </div>

            </div>

          </div>

        </div>

      )}

    </>
  );
}