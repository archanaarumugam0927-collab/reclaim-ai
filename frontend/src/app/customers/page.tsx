"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Search,
  Users,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import Link from "next/link";

import AuthGuard from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";

import {
  getRecoveryCases,
  type RecoveryCase,
} from "@/lib/api/recovery";

function formatCurrency(amount: number, currency = "INR") {
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

function formatText(value?: string | null) {
  if (!value) return "—";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function CustomersPage() {
  const [cases, setCases] = useState<RecoveryCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

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
            err instanceof Error ? err.message : String(err)
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

  const filteredCases = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return cases;
    }

    return cases.filter((item) =>
      [
        item.customer_name,
        item.customer_id,
        item.failure_reason,
        item.risk_level,
        item.status,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [cases, search]);

  return (
    <DashboardShell>
      <AuthGuard>
        <main className="relative min-h-full overflow-hidden bg-background">
          {/* Ambient background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-emerald-400/[0.025] blur-3xl animate-[customerGlow_10s_ease-in-out_infinite]" />

            <div className="absolute -right-40 top-[30%] h-[360px] w-[360px] rounded-full bg-cyan-400/[0.018] blur-3xl animate-[customerGlow_12s_ease-in-out_infinite_reverse]" />
          </div>

          <div className="relative z-10 min-h-full p-5 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[1600px]">
              {/* =================================================
                  HEADER
              ================================================== */}

              <section className="mb-8 animate-[customerHeader_650ms_cubic-bezier(0.22,1,0.36,1)_both]">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>

                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                        Customer intelligence
                      </p>
                    </div>

                    <h1 className="mt-2 text-4xl font-bold tracking-[-0.045em] text-foreground sm:text-5xl">
                      Customers
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                      Monitor customers connected to payment failures
                      and recovery workflows.
                    </p>
                  </div>

                  {/* Customer count */}
                  <div className="group flex items-center gap-3 self-start rounded-2xl border border-ui bg-card px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/20 hover:shadow-[0_12px_35px_rgba(52,211,153,0.06)] md:self-auto">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                      <Users className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        Total customers
                      </p>

                      <p className="mt-0.5 text-lg font-semibold text-foreground">
                        {cases.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 h-px origin-left bg-gradient-to-r from-emerald-400/20 via-white/[0.06] to-transparent animate-[customerDivider_900ms_ease-out_300ms_both]" />
              </section>

              {/* =================================================
                  SEARCH
              ================================================== */}

              <section className="group relative mb-5 overflow-hidden rounded-2xl border border-ui bg-card p-4 animate-[customerPanel_650ms_cubic-bezier(0.22,1,0.36,1)_250ms_both]">
                <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent opacity-0 transition-opacity duration-500 group-focus-within:opacity-100" />

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-300 peer-focus:text-emerald-400" />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search customers, IDs, failure reasons..."
                    className="peer w-full rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 pl-10 pr-4 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-emerald-400/30 focus:bg-emerald-400/[0.015] focus:shadow-[0_0_25px_rgba(52,211,153,0.04)]"
                  />

                  {search.length > 0 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-[searchIndicator_250ms_ease-out_both]">
                      <span className="rounded-md bg-emerald-400/10 px-2 py-1 text-[9px] font-medium text-emerald-400">
                        {filteredCases.length} match
                        {filteredCases.length === 1 ? "" : "es"}
                      </span>
                    </div>
                  )}
                </div>
              </section>

              {/* =================================================
                  CUSTOMER LIST
              ================================================== */}

              <section className="group relative overflow-hidden rounded-2xl border border-ui bg-card animate-[customerPanel_700ms_cubic-bezier(0.22,1,0.36,1)_350ms_both]">
                {/* Top scan line */}
                <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-px overflow-hidden bg-white/[0.04]">
                  <div className="h-full w-1/4 bg-emerald-400/60 animate-[customerScan_5s_ease-in-out_infinite]" />
                </div>

                <div className="border-b border-white/[0.06] px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold text-foreground">
                          Customer accounts
                        </h2>

                        <Sparkles className="h-3.5 w-3.5 text-emerald-400/60" />
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {filteredCases.length} customers shown
                      </p>
                    </div>

                    <div className="hidden items-center gap-1.5 sm:flex">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/70" />

                      <span className="text-[9px] text-muted-foreground">
                        Recovery intelligence active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Loading */}
                {loading ? (
                  <div className="p-10">
                    <div className="mx-auto max-w-xs text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04]">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400" />
                      </div>

                      <p className="mt-4 text-sm text-muted-foreground">
                        Loading customer intelligence…
                      </p>

                      <div className="mx-auto mt-3 h-1 w-32 overflow-hidden rounded-full bg-white/[0.05]">
                        <div className="h-full w-1/2 animate-[customerLoading_1.4s_ease-in-out_infinite] rounded-full bg-emerald-400/40" />
                      </div>
                    </div>
                  </div>
                ) : error ? (
                  <div className="p-10 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/[0.06] text-red-400">
                      <ShieldCheck className="h-4 w-4" />
                    </div>

                    <p className="mt-4 text-sm text-red-400">
                      Unable to load customers
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {error}
                    </p>
                  </div>
                ) : filteredCases.length === 0 ? (
                  <div className="p-10 text-center animate-[customerEmpty_400ms_ease-out_both]">
                    <Search className="mx-auto h-5 w-5 text-muted-foreground/50" />

                    <p className="mt-3 text-sm text-muted-foreground">
                      No customers found.
                    </p>

                    {search && (
                      <p className="mt-1 text-[10px] text-muted-foreground/60">
                        Try another search term.
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    {filteredCases.map((customer, index) => {
                      const risk = (
                        customer.risk_level || "low"
                      ).toLowerCase();

                      const initials = customer.customer_name
                        .split(" ")
                        .map((part) => part[0] ?? "")
                        .slice(0, 2)
                        .join("")
                        .toUpperCase();

                      const riskClass =
                        risk === "critical" || risk === "high"
                          ? "border-red-400/20 bg-red-400/[0.05] text-red-400"
                          : risk === "medium"
                            ? "border-amber-400/20 bg-amber-400/[0.05] text-amber-400"
                            : "border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-400";

                      const riskDot =
                        risk === "critical" || risk === "high"
                          ? "bg-red-400"
                          : risk === "medium"
                            ? "bg-amber-400"
                            : "bg-emerald-400";

                      return (
                        <div
                          key={customer.id}
                          style={{
                            animationDelay: `${Math.min(index * 70, 700)}ms`,
                          }}
                          className="group/customer relative overflow-hidden border-b border-white/[0.05] p-5 opacity-0 animate-[customerRow_600ms_cubic-bezier(0.22,1,0.36,1)_forwards] last:border-b-0 transition-all duration-300 hover:bg-white/[0.02]"
                        >
                          {/* Hover shimmer */}
                          <div className="pointer-events-none absolute inset-y-0 -left-full w-1/4 skew-x-12 bg-white/[0.025] transition-all duration-700 group-hover/customer:left-[130%]" />

                          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center">
                            {/* Customer */}
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-xs font-semibold text-foreground transition-all duration-300 group-hover/customer:scale-105 group-hover/customer:bg-emerald-400/[0.07]">
                                {initials}

                                <span
                                  className={`absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ${riskDot} ${
                                    risk === "critical" || risk === "high"
                                      ? "animate-pulse"
                                      : ""
                                  }`}
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-foreground transition-transform duration-300 group-hover/customer:translate-x-0.5">
                                  {customer.customer_name}
                                </p>

                                <p className="mt-1 truncate text-[11px] text-muted-foreground">
                                  {customer.customer_id}
                                </p>
                              </div>
                            </div>

                            {/* Amount */}
                            <div className="min-w-[130px]">
                              <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                                Revenue
                              </p>

                              <p className="mt-1 text-sm font-semibold text-foreground transition-colors duration-300 group-hover/customer:text-emerald-400">
                                {formatCurrency(
                                  customer.amount,
                                  customer.currency
                                )}
                              </p>
                            </div>

                            {/* Risk */}
                            <div className="min-w-[100px]">
                              <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                                Risk
                              </p>

                              <span
                                className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] capitalize transition-all duration-300 group-hover/customer:scale-105 ${riskClass}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${riskDot}`}
                                />

                                {formatText(customer.risk_level)}
                              </span>
                            </div>

                            {/* Failure */}
                            <div className="min-w-[150px]">
                              <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                                Issue
                              </p>

                              <p className="mt-1 text-xs capitalize text-zinc-400">
                                {formatText(customer.failure_reason)}
                              </p>
                            </div>

                            {/* Recovery */}
                            <div className="min-w-[110px]">
                              <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                                Recovery
                              </p>

                              <div className="mt-1 flex items-center gap-2">
                                <p className="text-xs text-zinc-400">
                                  {customer.customer_recovery_rate != null
                                    ? `${(
                                        customer.customer_recovery_rate * 100
                                      ).toFixed(0)}%`
                                    : "—"}
                                </p>

                                {customer.customer_recovery_rate != null && (
                                  <div className="h-1 w-12 overflow-hidden rounded-full bg-white/[0.06]">
                                    <div
                                      className="h-full rounded-full bg-emerald-400/60 transition-all duration-700"
                                      style={{
                                        width: `${Math.min(
                                          customer.customer_recovery_rate * 100,
                                          100
                                        )}%`,
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action */}
                            <div className="flex shrink-0">
                              <Link
                                href={`/dashboard?case=${encodeURIComponent(
                                  customer.id
                                )}`}
                                className="group/action inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-zinc-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/20 hover:bg-emerald-400/[0.04] hover:text-foreground hover:shadow-[0_8px_25px_rgba(52,211,153,0.05)]"
                              >
                                View case

                                <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover/action:-translate-y-0.5 group-hover/action:translate-x-0.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* Bottom status */}
          <div className="relative z-10 mx-auto mt-6 flex max-w-[1600px] items-center justify-center gap-2 animate-[customerFooter_700ms_ease-out_700ms_both]">
            <Sparkles className="h-3 w-3 text-emerald-400/50" />

            <span className="text-[9px] tracking-wide text-muted-foreground/50">
              Customer recovery intelligence active
            </span>
          </div>
        </main>

        <style jsx>{`
          @keyframes customerHeader {
            from {
              opacity: 0;
              transform: translateY(18px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes customerPanel {
            from {
              opacity: 0;
              transform: translateY(16px) scale(0.99);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes customerRow {
            from {
              opacity: 0;
              transform: translateY(14px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes customerDivider {
            from {
              transform: scaleX(0);
              opacity: 0;
            }

            to {
              transform: scaleX(1);
              opacity: 1;
            }
          }

          @keyframes customerScan {
            0% {
              transform: translateX(-160%);
            }

            45%,
            100% {
              transform: translateX(520%);
            }
          }

          @keyframes customerGlow {
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

          @keyframes customerLoading {
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

          @keyframes searchIndicator {
            from {
              opacity: 0;
              transform: translateY(-50%) scale(0.9);
            }

            to {
              opacity: 1;
              transform: translateY(-50%) scale(1);
            }
          }

          @keyframes customerEmpty {
            from {
              opacity: 0;
              transform: translateY(8px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes customerFooter {
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
      </AuthGuard>
    </DashboardShell>
  );
}