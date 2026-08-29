"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";

import AuthGuard from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";

import {
  getRecoveryCases,
  type RecoveryCase,
} from "@/lib/api/recovery";

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

function percentage(
  value: number,
  total: number
) {
  if (!total) return "0%";

  return `${Math.round(
    (value / total) * 100
  )}%`;
}

function formatText(
  value?: string | null
) {
  if (!value) return "Unknown";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

export default function AnalyticsPage() {
  const [cases, setCases] = useState<
    RecoveryCase[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    getRecoveryCases()
      .then((data) => {
        if (mounted) {
          setCases(data);
        }
      })
      .catch((err: unknown) => {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : String(err)
          );
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const analytics = useMemo(() => {
    const totalCases = cases.length;

    const totalAtRisk = cases.reduce(
      (sum, item) =>
        sum + (item.amount || 0),
      0
    );

    const totalRecovered = cases.reduce(
      (sum, item) =>
        sum +
        (item.recovered_amount || 0),
      0
    );

    const recoveredCases =
      cases.filter(
        (item) =>
          (item.recovered_amount || 0) > 0
      ).length;

    const highRiskCases =
      cases.filter((item) => {
        const risk =
          item.risk_level?.toLowerCase();

        return (
          risk === "high" ||
          risk === "critical"
        );
      }).length;

    const mediumRiskCases =
      cases.filter(
        (item) =>
          item.risk_level?.toLowerCase() ===
          "medium"
      ).length;

    const lowRiskCases =
      cases.filter(
        (item) =>
          item.risk_level?.toLowerCase() ===
          "low"
      ).length;

    const recoveryRate =
      totalAtRisk > 0
        ? Math.round(
            (totalRecovered /
              totalAtRisk) *
              100
          )
        : 0;

    const failureReasons =
      cases.reduce(
        (acc, item) => {
          const reason = formatText(
            item.failure_reason
          );

          acc[reason] =
            (acc[reason] || 0) + 1;

          return acc;
        },
        {} as Record<string, number>
      );

    const topFailureReasons =
      Object.entries(failureReasons)
        .sort(
          ([, a], [, b]) => b - a
        )
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

  return (
    <DashboardShell>
      <AuthGuard>
        <div className="min-h-full p-5 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1600px]">

            {/* Header */}
            <section className="mb-8">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-500">
                    Revenue intelligence
                  </p>

                  <h1 className="mt-2 text-4xl font-bold tracking-[-0.045em] text-foreground sm:text-5xl">
                    Analytics
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Understand recovery performance,
                    revenue exposure, customer risk,
                    and payment failure patterns.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

                  <span className="text-xs font-medium text-muted-foreground">
                    Live recovery analytics
                  </span>
                </div>

              </div>
            </section>

            {/* Loading */}
            {loading ? (
              <div className="rounded-2xl border border-ui bg-card p-10 text-center text-sm text-muted-foreground">
                Loading analytics…
              </div>
            ) : error ? (

              /* Error */
              <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-10 text-center text-sm text-red-500">
                Unable to load analytics: {error}
              </div>

            ) : (

              <>
                {/* KPI Cards */}
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                  {/* Revenue at Risk */}
                  <div className="rounded-2xl border border-ui bg-card p-5 transition-colors">

                    <div className="flex items-center justify-between">

                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        Revenue at risk
                      </p>

                      <CircleDollarSign className="h-4 w-4 text-emerald-500" />

                    </div>

                    <p className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                      {formatAmount(
                        analytics.totalAtRisk
                      )}
                    </p>

                    <p className="mt-2 text-[10px] text-muted-foreground">
                      Across {analytics.totalCases} recovery cases
                    </p>

                  </div>


                  {/* Recovered Revenue */}
                  <div className="rounded-2xl border border-ui bg-card p-5 transition-colors">

                    <div className="flex items-center justify-between">

                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        Recovered revenue
                      </p>

                      <TrendingUp className="h-4 w-4 text-emerald-500" />

                    </div>

                    <p className="mt-4 text-2xl font-semibold tracking-tight text-emerald-500">
                      {formatAmount(
                        analytics.totalRecovered
                      )}
                    </p>

                    <p className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">

                      <ArrowUpRight className="h-3 w-3 text-emerald-500" />

                      {analytics.recoveredCases} recovered cases

                    </p>

                  </div>


                  {/* Recovery Rate */}
                  <div className="rounded-2xl border border-ui bg-card p-5 transition-colors">

                    <div className="flex items-center justify-between">

                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        Recovery rate
                      </p>

                      <Activity className="h-4 w-4 text-emerald-500" />

                    </div>

                    <p className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                      {analytics.recoveryRate}%
                    </p>

                    <p className="mt-2 text-[10px] text-muted-foreground">
                      Revenue successfully recovered
                    </p>

                  </div>


                  {/* High Risk */}
                  <div className="rounded-2xl border border-ui bg-card p-5 transition-colors">

                    <div className="flex items-center justify-between">

                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        High risk cases
                      </p>

                      <AlertTriangle className="h-4 w-4 text-amber-500" />

                    </div>

                    <p className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                      {analytics.highRiskCases}
                    </p>

                    <p className="mt-2 text-[10px] text-muted-foreground">
                      High and critical risk customers
                    </p>

                  </div>

                </section>


                {/* Risk + Failure Analysis */}
                <section className="mt-5 grid gap-5 lg:grid-cols-2">

                  {/* Risk Distribution */}
                  <div className="rounded-2xl border border-ui bg-card p-5 sm:p-6">

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                          Risk distribution
                        </p>

                        <h2 className="mt-2 text-lg font-semibold text-foreground">
                          Customer risk profile
                        </h2>
                      </div>

                      <Activity className="h-4 w-4 text-muted-foreground" />

                    </div>


                    <div className="mt-6 space-y-5">

                      {/* High */}
                      <div>

                        <div className="flex items-center justify-between">

                          <span className="text-xs text-muted-foreground">
                            High / Critical
                          </span>

                          <span className="text-xs font-medium text-red-500">
                            {analytics.highRiskCases}
                          </span>

                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">

                          <div
                            className="h-full rounded-full bg-red-400"
                            style={{
                              width: percentage(
                                analytics.highRiskCases,
                                analytics.totalCases
                              ),
                            }}
                          />

                        </div>

                      </div>


                      {/* Medium */}
                      <div>

                        <div className="flex items-center justify-between">

                          <span className="text-xs text-muted-foreground">
                            Medium
                          </span>

                          <span className="text-xs font-medium text-amber-500">
                            {analytics.mediumRiskCases}
                          </span>

                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">

                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{
                              width: percentage(
                                analytics.mediumRiskCases,
                                analytics.totalCases
                              ),
                            }}
                          />

                        </div>

                      </div>


                      {/* Low */}
                      <div>

                        <div className="flex items-center justify-between">

                          <span className="text-xs text-muted-foreground">
                            Low
                          </span>

                          <span className="text-xs font-medium text-emerald-500">
                            {analytics.lowRiskCases}
                          </span>

                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">

                          <div
                            className="h-full rounded-full bg-emerald-400"
                            style={{
                              width: percentage(
                                analytics.lowRiskCases,
                                analytics.totalCases
                              ),
                            }}
                          />

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* Failure Analysis */}
                  <div className="rounded-2xl border border-ui bg-card p-5 sm:p-6">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                          Failure analysis
                        </p>

                        <h2 className="mt-2 text-lg font-semibold text-foreground">
                          Top payment issues
                        </h2>

                      </div>

                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />

                    </div>


                    <div className="mt-5 space-y-3">

                      {analytics.topFailureReasons.length === 0 ? (

                        <p className="py-6 text-center text-xs text-muted-foreground">
                          No failure data available.
                        </p>

                      ) : (

                        analytics.topFailureReasons.map(
                          ([reason, count]) => (

                            <div
                              key={reason}
                              className="flex items-center justify-between rounded-xl border border-ui bg-muted/40 px-4 py-3"
                            >

                              <div className="flex items-center gap-3">

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-500">

                                  <AlertTriangle className="h-3.5 w-3.5" />

                                </div>

                                <span className="text-xs text-foreground">
                                  {reason}
                                </span>

                              </div>

                              <span className="text-xs font-semibold text-foreground">
                                {count}
                              </span>

                            </div>

                          )
                        )

                      )}

                    </div>

                  </div>

                </section>


                {/* Recovery Summary */}
                <section className="mt-5 rounded-2xl border border-ui bg-card p-5 sm:p-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-500">

                      <CheckCircle2 className="h-4 w-4" />

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


                  <div className="mt-6 grid gap-4 sm:grid-cols-3">

                    {/* At Risk */}
                    <div className="rounded-xl border border-ui bg-muted/40 p-4">

                      <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                        At risk
                      </p>

                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {formatAmount(
                          analytics.totalAtRisk
                        )}
                      </p>

                    </div>


                    {/* Recovered */}
                    <div className="rounded-xl border border-ui bg-muted/40 p-4">

                      <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                        Recovered
                      </p>

                      <p className="mt-2 text-lg font-semibold text-emerald-500">
                        {formatAmount(
                          analytics.totalRecovered
                        )}
                      </p>

                    </div>


                    {/* Unrecovered */}
                    <div className="rounded-xl border border-ui bg-muted/40 p-4">

                      <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                        Unrecovered
                      </p>

                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {formatAmount(
                          Math.max(
                            0,
                            analytics.totalAtRisk -
                              analytics.totalRecovered
                          )
                        )}
                      </p>

                    </div>

                  </div>

                </section>

              </>
            )}

          </div>
        </div>
      </AuthGuard>
    </DashboardShell>
  );
}