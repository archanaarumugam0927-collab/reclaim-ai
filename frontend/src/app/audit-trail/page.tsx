"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Clock3,
  FileClock,
  RefreshCw,
  ShieldCheck,
  User,
  Sparkles,
  Zap,
} from "lucide-react";

import {
  getRecoveryCases,
  getRecoveryInterventions,
  type RecoveryCase,
  type Intervention,
} from "@/lib/api/recovery";

type AuditEvent = {
  id: string;
  type: "case" | "intervention";
  title: string;
  description: string;
  customer: string;
  transaction: string;
  status: string;
  timestamp: string;
  amount?: number;
};

function formatAmount(amount?: number) {
  if (amount === undefined) return "—";

  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusClass(status: string) {
  const value = status.toLowerCase();

  if (
    value.includes("success") ||
    value.includes("recovered") ||
    value.includes("completed")
  ) {
    return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
  }

  if (
    value.includes("pending") ||
    value.includes("processing")
  ) {
    return "bg-amber-400/10 text-amber-400 border-amber-400/20";
  }

  if (
    value.includes("failed") ||
    value.includes("error")
  ) {
    return "bg-red-400/10 text-red-400 border-red-400/20";
  }

  return "bg-muted text-muted-foreground border-ui";
}

export default function AuditTrailPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const loadAuditTrail = async () => {
    try {
      setError("");

      const cases = await getRecoveryCases();

      const auditEvents: AuditEvent[] = [];

      for (const recoveryCase of cases) {
        auditEvents.push({
          id: `case-${recoveryCase.id}`,
          type: "case",
          title: "Recovery case created",
          description:
            recoveryCase.ai_diagnosis ||
            `Recovery case created for ${recoveryCase.failure_reason}.`,
          customer: recoveryCase.customer_name,
          transaction: recoveryCase.transaction_id,
          status: recoveryCase.status || "Active",
          timestamp: recoveryCase.created_at,
          amount: recoveryCase.amount,
        });

        if (
          recoveryCase.action_taken ||
          recoveryCase.recommended_action
        ) {
          auditEvents.push({
            id: `action-${recoveryCase.id}`,
            type: "case",
            title: "Recovery action recorded",
            description:
              recoveryCase.action_taken ||
              `Recommended action: ${
                recoveryCase.recommended_action || "—"
              }`,
            customer: recoveryCase.customer_name,
            transaction: recoveryCase.transaction_id,
            status: recoveryCase.status || "Action Required",
            timestamp:
              recoveryCase.updated_at ||
              recoveryCase.created_at,
            amount: recoveryCase.recovered_amount,
          });
        }

        try {
          const interventions =
            await getRecoveryInterventions(
              recoveryCase.id
            );

          interventions.forEach(
            (intervention: Intervention) => {
              auditEvents.push({
                id: `intervention-${intervention.id}`,
                type: "intervention",
                title: "Recovery intervention executed",
                description:
                  intervention.execution_message ||
                  intervention.reasoning ||
                  intervention.intervention_type,
                customer:
                  recoveryCase.customer_name,
                transaction:
                  recoveryCase.transaction_id,
                status:
                  intervention.status || "Unknown",
                timestamp:
                  intervention.updated_at ||
                  intervention.created_at,
                amount:
                  intervention.recovered_amount,
              });
            }
          );
        } catch {
          // Individual cases without interventions
          // should not break the audit trail.
        }
      }

      auditEvents.sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();

        return dateB - dateA;
      });

      setEvents(auditEvents);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load audit trail."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadAuditTrail();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAuditTrail();
  };

  const successfulEvents = events.filter((event) => {
    const status = event.status.toLowerCase();

    return (
      status.includes("success") ||
      status.includes("recovered") ||
      status.includes("completed")
    );
  }).length;

  const interventionEvents = events.filter(
    (event) => event.type === "intervention"
  ).length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-emerald-400/[0.025] blur-3xl animate-[auditGlow_10s_ease-in-out_infinite]" />

        <div className="absolute -right-40 top-[35%] h-[380px] w-[380px] rounded-full bg-cyan-400/[0.018] blur-3xl animate-[auditGlow_12s_ease-in-out_infinite_reverse]" />

        <div className="absolute inset-0 opacity-[0.018] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:56px_56px]" />
      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="relative z-10 border-b border-ui bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-6 py-6 sm:flex-row sm:items-center lg:px-8">
          <div
            className={`transition-all duration-700 ease-out ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              <FileClock className="h-3.5 w-3.5" />

              Revenue Intelligence
            </div>

            <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
              Audit Trail
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              A complete history of recovery cases, AI decisions,
              interventions, and recovery outcomes.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="group inline-flex items-center gap-2 self-start rounded-xl border border-ui bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/20 hover:bg-emerald-400/[0.03] hover:shadow-[0_10px_30px_rgba(52,211,153,0.05)] disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              className={`h-4 w-4 transition-transform duration-500 ${
                refreshing
                  ? "animate-spin"
                  : "group-hover:rotate-180"
              }`}
            />

            Refresh
          </button>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* =================================================
            SUMMARY CARDS
        ================================================== */}

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Total Events",
              value: events.length,
              description: "Recorded recovery activity",
              icon: Activity,
              iconClass: "bg-emerald-400/10 text-emerald-400",
            },
            {
              label: "Successful",
              value: successfulEvents,
              description: "Completed or recovered actions",
              icon: CheckCircle2,
              iconClass: "bg-emerald-400/10 text-emerald-400",
            },
            {
              label: "Interventions",
              value: interventionEvents,
              description: "Recovery interventions recorded",
              icon: ShieldCheck,
              iconClass: "bg-cyan-400/10 text-cyan-400",
            },
          ].map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                style={{
                  animationDelay: `${index * 90}ms`,
                }}
                className="group relative overflow-hidden rounded-2xl border border-ui bg-card p-5 opacity-0 animate-[auditCard_650ms_cubic-bezier(0.22,1,0.36,1)_forwards] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.16)]"
              >
                <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {card.label}
                  </span>

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${card.iconClass}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground transition-transform duration-300 group-hover:translate-x-0.5">
                  {card.value}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* =================================================
            ERROR
        ================================================== */}

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-5 animate-[auditPanel_500ms_ease-out_both]">
            <div className="flex items-start gap-3">
              <Activity className="mt-0.5 h-4 w-4 text-red-400" />

              <div>
                <p className="text-sm font-medium text-red-400">
                  Unable to load audit trail
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* =================================================
            TIMELINE
        ================================================== */}

        <section className="group relative mt-8 overflow-hidden rounded-2xl border border-ui bg-card animate-[auditPanel_700ms_cubic-bezier(0.22,1,0.36,1)_250ms_both]">
          {/* Animated scan line */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-px overflow-hidden bg-white/[0.04]">
            <div className="h-full w-1/4 bg-emerald-400/60 animate-[auditScan_5s_ease-in-out_infinite]" />
          </div>

          <div className="border-b border-ui px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-xl font-semibold">
                    Recovery activity
                  </h2>

                  <Sparkles className="h-4 w-4 text-emerald-400/60" />
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  Every important recovery event is recorded here.
                </p>
              </div>

              <div className="hidden items-center gap-1.5 sm:flex">
                <Zap className="h-3.5 w-3.5 text-emerald-400/60" />

                <span className="text-[9px] text-muted-foreground">
                  Immutable activity log
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04]">
                <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                Loading audit intelligence…
              </p>

              <div className="mt-3 h-1 w-36 overflow-hidden rounded-full bg-white/[0.05]">
                <div className="h-full w-1/2 rounded-full bg-emerald-400/50 animate-[auditLoading_1.4s_ease-in-out_infinite]" />
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <FileClock className="h-5 w-5 text-muted-foreground" />
              </div>

              <h3 className="mt-4 text-sm font-semibold">
                No audit events yet
              </h3>

              <p className="mt-1 max-w-md text-xs text-muted-foreground">
                Recovery activity will appear here when cases
                and interventions are created.
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline rail */}
              <div className="pointer-events-none absolute bottom-0 left-[45px] top-0 w-px bg-gradient-to-b from-emerald-400/30 via-white/[0.06] to-transparent" />

              <div className="divide-y divide-ui">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    style={{
                      animationDelay: `${Math.min(
                        index * 70,
                        900
                      )}ms`,
                    }}
                    className="group/event relative px-6 py-5 opacity-0 animate-[auditEvent_600ms_cubic-bezier(0.22,1,0.36,1)_forwards] transition-colors duration-300 hover:bg-white/[0.018]"
                  >
                    <div className="flex gap-4">
                      {/* Timeline icon */}
                      <div className="relative z-10 shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-400 transition-all duration-300 group-hover/event:scale-110 group-hover/event:border-emerald-400/30 group-hover/event:bg-emerald-400/[0.1]">
                          {event.type === "intervention" ? (
                            <ShieldCheck className="h-4 w-4" />
                          ) : (
                            <Activity className="h-4 w-4" />
                          )}
                        </div>

                        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-emerald-400 opacity-0 shadow-[0_0_10px_rgba(52,211,153,0.6)] transition-opacity duration-300 group-hover/event:opacity-100" />
                      </div>

                      {/* Event body */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-semibold text-foreground transition-colors duration-300 group-hover/event:text-emerald-400">
                                {event.title}
                              </h3>

                              <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[8px] uppercase tracking-wider text-muted-foreground">
                                {event.type}
                              </span>
                            </div>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                              {event.description}
                            </p>
                          </div>

                          <span
                            className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2.5 py-1 text-[10px] font-medium transition-transform duration-300 group-hover/event:scale-105 ${getStatusClass(
                              event.status
                            )}`}
                          >
                            {event.status}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

                            <div className="min-w-0">
                              <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
                                Customer
                              </p>

                              <p className="mt-0.5 truncate font-medium text-foreground">
                                {event.customer}
                              </p>
                            </div>
                          </div>

                          <div className="min-w-0">
                            <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
                              Transaction
                            </p>

                            <p className="mt-0.5 truncate font-medium text-foreground">
                              {event.transaction}
                            </p>
                          </div>

                          <div>
                            <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
                              Amount
                            </p>

                            <p className="mt-0.5 font-medium text-foreground">
                              {formatAmount(event.amount)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock3 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

                            <div>
                              <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
                                Timestamp
                              </p>

                              <p className="mt-0.5 whitespace-nowrap font-medium text-foreground">
                                {formatDate(event.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Bottom status */}
        <div className="mt-6 flex items-center justify-center gap-2 animate-[auditFooter_700ms_ease-out_900ms_both]">
          <Sparkles className="h-3 w-3 text-emerald-400/50" />

          <span className="text-[9px] tracking-wide text-muted-foreground/50">
            Reclaim audit intelligence layer active
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes auditGlow {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.6;
          }

          50% {
            transform: translate3d(18px, -12px, 0) scale(1.08);
            opacity: 1;
          }
        }

        @keyframes auditCard {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes auditPanel {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.99);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes auditEvent {
          from {
            opacity: 0;
            transform: translateX(16px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes auditScan {
          0% {
            transform: translateX(-160%);
          }

          45%,
          100% {
            transform: translateX(520%);
          }
        }

        @keyframes auditLoading {
          0% {
            transform: translateX(-120%);
          }

          50% {
            transform: translateX(120%);
          }

          100% {
            transform: translateX(240%);
          }
        }

        @keyframes auditFooter {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}