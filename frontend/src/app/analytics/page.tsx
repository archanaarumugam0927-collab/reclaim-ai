"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import AuthGuard from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";

import {
  getRecoveryCases,
  type RecoveryCase,
} from "@/lib/api/recovery";

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

function percentage(value: number, total: number) {
  if (!total) return "0%";

  return `${Math.round((value / total) * 100)}%`;
}

function formatText(value?: string | null) {
  if (!value) return "Unknown";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AnalyticsPage() {
  const [cases, setCases] = useState<RecoveryCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
    }, 80);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let active = true;

    getRecoveryCases()
      .then((data) => {
        if (active) {
          setCases(data);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : String(err)
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const analytics = useMemo(() => {
    const totalCases = cases.length;

    const totalAtRisk = cases.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );

    const totalRecovered = cases.reduce(
      (sum, item) => sum + (item.recovered_amount || 0),
      0
    );

    const recoveredCases = cases.filter(
      (item) => (item.recovered_amount || 0) > 0
    ).length;

    const highRiskCases = cases.filter((item) => {
      const risk = item.risk_level?.toLowerCase();

      return risk === "high" || risk === "critical";
    }).length;

    const mediumRiskCases = cases.filter(
      (item) => item.risk_level?.toLowerCase() === "medium"
    ).length;

    const lowRiskCases = cases.filter(
      (item) => item.risk_level?.toLowerCase() === "low"
    ).length;

    const recoveryRate =
      totalAtRisk > 0
        ? Math.round((totalRecovered / totalAtRisk) * 100)
        : 0;

    const failureReasons = cases.reduce(
      (acc, item) => {
        const reason = formatText(item.failure_reason);

        acc[reason] = (acc[reason] || 0) + 1;

        return acc;
      },
      {} as Record<string, number>
    );

    const topFailureReasons = Object.entries(failureReasons)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      totalCases,
      totalAtRisk,
      totalRecovered,
      recoveredCases,
      highRiskCases,
      mediumRiskCases,
      lowRiskCases,
      recoveryRate,
      topFailureReasons,
    };
  }, [cases]);

  const kpis = [
    {
      label: "Revenue at risk",
      value: formatAmount(analytics.totalAtRisk),
      description: `Across ${analytics.totalCases} recovery cases`,
      icon: CircleDollarSign,
      iconClass: "bg-amber-400/10 text-amber-400",
      valueClass: "text-foreground",
    },
    {
      label: "Recovered revenue",
      value: formatAmount(analytics.totalRecovered),
      description: `${analytics.recoveredCases} recovered cases`,
      icon: TrendingUp,
      iconClass: "bg-emerald-400/10 text-emerald-400",
      valueClass: "text-emerald-400",
    },
    {
      label: "Recovery rate",
      value: `${analytics.recoveryRate}%`,
      description: "Revenue successfully recovered",
      icon: Activity,
      iconClass: "bg-cyan-400/10 text-cyan-400",
      valueClass: "text-foreground",
    },
    {
      label: "High risk cases",
      value: String(analytics.highRiskCases),
      description: "High and critical risk customers",
      icon: AlertTriangle,
      iconClass: "bg-red-400/10 text-red-400",
      valueClass: "text-foreground",
    },
  ];

  return (
    <DashboardShell>
      <AuthGuard>
        <main className="relative min-h-full overflow-hidden bg-background">
          {/* =====================================================
              AMBIENT BACKGROUND
          ====================================================== */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-emerald-400/[0.025] blur-3xl animate-[analyticsGlow_10s_ease-in-out_infinite]" />

            <div className="absolute -right-40 top-[30%] h-[400px] w-[400px] rounded-full bg-cyan-400/[0.018] blur-3xl animate-[analyticsGlow_12s_ease-in-out_infinite_reverse]" />
          </div>

          <div className="relative z-10 p-5 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[1600px]">
              {/* =================================================
                  HEADER
              ================================================== */}

              <section
                className={`mb-8 transition-all duration-700 ease-out ${
                  mounted
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0"
                }`}
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>

                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                        Revenue intelligence
                      </p>
                    </div>

                    <h1 className="mt-2 text-4xl font-bold tracking-[-0.045em] text-foreground sm:text-5xl">
                      Analytics
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                      Understand recovery performance, revenue exposure,
                      customer risk, and payment failure patterns.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start rounded-full border border-emerald-400/10 bg-emerald-400/[0.035] px-3 py-2 md:self-auto">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                      <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                    </span>

                    <Activity className="h-3 w-3 text-emerald-400" />

                    <span className="text-[10px] font-medium text-emerald-400">
                      Live recovery analytics
                    </span>
                  </div>
                </div>

                <div
                  className={`mt-7 h-px origin-left bg-gradient-to-r from-emerald-400/20 via-white/[0.06] to-transparent transition-transform duration-1000 ${
                    mounted ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </section>

              {/* =================================================
                  LOADING
              ================================================== */}

              {loading ? (
                <section className="rounded-2xl border border-ui bg-card p-12 text-center animate-[analyticsPanel_600ms_ease-out_both]">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04]">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400" />
                  </div>

                  <p className="mt-4 text-sm text-muted-foreground">
                    Loading analytics intelligence…
                  </p>

                  <div className="mx-auto mt-3 h-1 w-36 overflow-hidden rounded-full bg-white/[0.05]">
                    <div className="h-full w-1/2 rounded-full bg-emerald-400/50 animate-[analyticsLoading_1.4s_ease-in-out_infinite]" />
                  </div>
                </section>
              ) : error ? (
                <section className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-10 text-center animate-[analyticsPanel_600ms_ease-out_both]">
                  <AlertTriangle className="mx-auto h-5 w-5 text-red-400" />

                  <p className="mt-3 text-sm text-red-400">
                    Unable to load analytics
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {error}
                  </p>
                </section>
              ) : (
                <>
                  {/* =================================================
                      KPI CARDS
                  ================================================== */}

                  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {kpis.map((kpi, index) => {
                      const Icon = kpi.icon;

                      return (
                        <div
                          key={kpi.label}
                          style={{
                            animationDelay: `${index * 90}ms`,
                          }}
                          className="group relative overflow-hidden rounded-2xl border border-ui bg-card p-5 opacity-0 animate-[analyticsCard_650ms_cubic-bezier(0.22,1,0.36,1)_forwards] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
                        >
                          <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                              {kpi.label}
                            </p>

                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${kpi.iconClass}`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                          </div>

                          <p
                            className={`mt-4 text-2xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-0.5 ${kpi.valueClass}`}
                          >
                            {kpi.value}
                          </p>

                          <p className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                            {kpi.label === "Recovered revenue" && (
                              <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                            )}

                            {kpi.description}
                          </p>
                        </div>
                      );
                    })}
                  </section>

                  {/* =================================================
                      RISK + FAILURE ANALYSIS
                  ================================================== */}

                  <section className="mt-5 grid gap-5 lg:grid-cols-2">
                    {/* Risk distribution */}
                    <div className="group relative overflow-hidden rounded-2xl border border-ui bg-card p-5 sm:p-6 animate-[analyticsPanel_700ms_cubic-bezier(0.22,1,0.36,1)_300ms_both]">
                      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-400/[0.025] blur-3xl transition-all duration-500 group-hover:bg-red-400/[0.045]" />

                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                            Risk distribution
                          </p>

                          <h2 className="mt-2 text-lg font-semibold text-foreground">
                            Customer risk profile
                          </h2>
                        </div>

                        <Activity className="h-4 w-4 text-muted-foreground transition-transform duration-500 group-hover:rotate-180" />
                      </div>

                      <div className="relative mt-6 space-y-5">
                        {[
                          {
                            label: "High / Critical",
                            value: analytics.highRiskCases,
                            color: "bg-red-400",
                            text: "text-red-400",
                          },
                          {
                            label: "Medium",
                            value: analytics.mediumRiskCases,
                            color: "bg-amber-400",
                            text: "text-amber-400",
                          },
                          {
                            label: "Low",
                            value: analytics.lowRiskCases,
                            color: "bg-emerald-400",
                            text: "text-emerald-400",
                          },
                        ].map((item, index) => (
                          <div
                            key={item.label}
                            className="animate-[analyticsBarRow_500ms_ease-out_both]"
                            style={{
                              animationDelay: `${450 + index * 100}ms`,
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {item.label}
                              </span>

                              <span
                                className={`text-xs font-medium ${item.text}`}
                              >
                                {item.value}
                              </span>
                            </div>

                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full ${item.color} origin-left animate-[analyticsBar_1000ms_cubic-bezier(0.22,1,0.36,1)_forwards]`}
                                style={{
                                  width: percentage(
                                    item.value,
                                    analytics.totalCases
                                  ),
                                  animationDelay: `${550 + index * 120}ms`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Failure analysis */}
                    <div className="group relative overflow-hidden rounded-2xl border border-ui bg-card p-5 sm:p-6 animate-[analyticsPanel_700ms_cubic-bezier(0.22,1,0.36,1)_400ms_both]">
                      <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-amber-400/[0.02] blur-3xl" />

                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                            Failure analysis
                          </p>

                          <h2 className="mt-2 text-lg font-semibold text-foreground">
                            Top payment issues
                          </h2>
                        </div>

                        <AlertTriangle className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:scale-110" />
                      </div>

                      <div className="relative mt-5 space-y-3">
                        {analytics.topFailureReasons.length === 0 ? (
                          <p className="py-6 text-center text-xs text-muted-foreground">
                            No failure data available.
                          </p>
                        ) : (
                          analytics.topFailureReasons.map(
                            ([reason, count], index) => (
                              <div
                                key={reason}
                                style={{
                                  animationDelay: `${500 + index * 80}ms`,
                                }}
                                className="group/failure flex items-center justify-between rounded-xl border border-ui bg-muted/40 px-4 py-3 opacity-0 animate-[analyticsFailure_500ms_cubic-bezier(0.22,1,0.36,1)_forwards] transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/60"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400 transition-transform duration-300 group-hover/failure:scale-110 group-hover/failure:rotate-3">
                                    <AlertTriangle className="h-3.5 w-3.5" />
                                  </div>

                                  <span className="text-xs text-foreground">
                                    {reason}
                                  </span>
                                </div>

                                <span className="rounded-md bg-white/[0.04] px-2 py-1 text-xs font-semibold text-foreground transition-colors duration-300 group-hover/failure:text-amber-400">
                                  {count}
                                </span>
                              </div>
                            )
                          )
                        )}
                      </div>
                    </div>
                  </section>

                  {/* =================================================
                      RECOVERY SUMMARY
                  ================================================== */}

                  <section className="group relative mt-5 overflow-hidden rounded-2xl border border-ui bg-card p-5 sm:p-6 animate-[analyticsPanel_700ms_cubic-bezier(0.22,1,0.36,1)_500ms_both]">
                    <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-emerald-400/[0.025] blur-3xl transition-all duration-700 group-hover:bg-emerald-400/[0.05]" />

                    <div className="relative flex items-center gap-3">
                      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />

                        <span className="absolute inset-0 rounded-xl border border-emerald-400/10 animate-[analyticsPulse_2.5s_ease-in-out_infinite]" />
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                          Recovery performance
                        </p>

                        <h2 className="mt-1 text-lg font-semibold text-foreground">
                          Revenue recovery summary
                        </h2>
                      </div>
                    </div>

                    <div className="relative mt-6 grid gap-4 sm:grid-cols-3">
                      {[
                        {
                          label: "At risk",
                          value: analytics.totalAtRisk,
                          className: "text-foreground",
                        },
                        {
                          label: "Recovered",
                          value: analytics.totalRecovered,
                          className: "text-emerald-400",
                        },
                        {
                          label: "Unrecovered",
                          value: Math.max(
                            0,
                            analytics.totalAtRisk -
                              analytics.totalRecovered
                          ),
                          className: "text-foreground",
                        },
                      ].map((item, index) => (
                        <div
                          key={item.label}
                          style={{
                            animationDelay: `${650 + index * 100}ms`,
                          }}
                          className="group/summary rounded-xl border border-ui bg-muted/40 p-4 opacity-0 animate-[analyticsSummary_550ms_cubic-bezier(0.22,1,0.36,1)_forwards] transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/60"
                        >
                          <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                            {item.label}
                          </p>

                          <p
                            className={`mt-2 text-lg font-semibold transition-transform duration-300 group-hover/summary:translate-x-0.5 ${item.className}`}
                          >
                            {formatAmount(item.value)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="relative mt-5 flex items-center justify-center gap-2">
                      <Sparkles className="h-3 w-3 text-emerald-400/50" />

                      <span className="text-[9px] tracking-wide text-muted-foreground/50">
                        Recovery intelligence continuously analyzing payment
                        outcomes
                      </span>
                    </div>
                  </section>
                </>
              )}

              {/* Footer */}
              <div className="mt-6 flex items-center justify-center gap-2">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/[0.06]" />

                <span className="text-[9px] text-muted-foreground/40">
                  Reclaim Analytics Engine
                </span>

                <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/[0.06]" />
              </div>
            </div>
          </div>
        </main>

        <style jsx>{`
          @keyframes analyticsGlow {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
              opacity: 0.65;
            }

            50% {
              transform: translate3d(18px, -12px, 0) scale(1.08);
              opacity: 1;
            }
          }

          @keyframes analyticsCard {
            from {
              opacity: 0;
              transform: translateY(18px) scale(0.97);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes analyticsPanel {
            from {
              opacity: 0;
              transform: translateY(16px) scale(0.99);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes analyticsBarRow {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes analyticsBar {
            from {
              transform: scaleX(0);
            }

            to {
              transform: scaleX(1);
            }
          }

          @keyframes analyticsFailure {
            from {
              opacity: 0;
              transform: translateX(12px);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes analyticsSummary {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes analyticsLoading {
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

          @keyframes analyticsPulse {
            0%,
            100% {
              opacity: 0.2;
              transform: scale(1);
            }

            50% {
              opacity: 0.8;
              transform: scale(1.08);
            }
          }
        `}</style>
      </AuthGuard>
    </DashboardShell>
  );
}