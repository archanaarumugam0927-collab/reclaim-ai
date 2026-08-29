"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CreditCard,
  Search,
  Sparkles,
  Activity,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

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

function formatText(value?: string | null) {
  if (!value) return "—";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusClass(status?: string) {
  const value = (status || "").toLowerCase();

  if (
    value.includes("recover") ||
    value.includes("success") ||
    value.includes("complete")
  ) {
    return "border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-400";
  }

  if (value.includes("fail") || value.includes("risk")) {
    return "border-red-400/20 bg-red-400/[0.05] text-red-400";
  }

  return "border-amber-400/20 bg-amber-400/[0.05] text-amber-400";
}

function getRiskClass(risk?: string) {
  const value = (risk || "").toLowerCase();

  if (value === "critical" || value === "high") {
    return "border-red-400/20 bg-red-400/[0.05] text-red-400";
  }

  if (value === "medium") {
    return "border-amber-400/20 bg-amber-400/[0.05] text-amber-400";
  }

  return "border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-400";
}

function getRiskDot(risk?: string) {
  const value = (risk || "").toLowerCase();

  if (value === "critical" || value === "high") {
    return "bg-red-400";
  }

  if (value === "medium") {
    return "bg-amber-400";
  }

  return "bg-emerald-400";
}

export default function TransactionsPage() {
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
          setError(err instanceof Error ? err.message : String(err));
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

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return cases;
    }

    return cases.filter((item) =>
      [
        item.transaction_id,
        item.customer_name,
        item.customer_id,
        item.failure_reason,
        item.status,
        item.risk_level,
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
            <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-emerald-400/[0.025] blur-3xl animate-[transactionGlow_10s_ease-in-out_infinite]" />

            <div className="absolute -right-40 top-[35%] h-[380px] w-[380px] rounded-full bg-cyan-400/[0.018] blur-3xl animate-[transactionGlow_12s_ease-in-out_infinite_reverse]" />
          </div>

          <div className="relative z-10 p-5 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[1600px]">
              {/* =================================================
                  HEADER
              ================================================== */}

              <section className="mb-8 animate-[transactionHeader_650ms_cubic-bezier(0.22,1,0.36,1)_both]">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>

                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                        Payment intelligence
                      </p>
                    </div>

                    <h1 className="mt-2 text-4xl font-bold tracking-[-0.045em] text-foreground sm:text-5xl">
                      Transactions
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                      Monitor payment transactions, failure reasons,
                      risk levels, and recovery outcomes.
                    </p>
                  </div>

                  {/* Live count */}
                  <div className="group flex items-center gap-3 self-start rounded-2xl border border-ui bg-card px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/20 hover:shadow-[0_12px_35px_rgba(52,211,153,0.06)] md:self-auto">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                      <CreditCard className="h-5 w-5" />

                      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        Transactions
                      </p>

                      <p className="mt-0.5 text-lg font-semibold text-foreground">
                        {cases.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 h-px origin-left bg-gradient-to-r from-emerald-400/20 via-white/[0.06] to-transparent animate-[transactionDivider_900ms_ease-out_300ms_both]" />
              </section>

              {/* =================================================
                  SEARCH
              ================================================== */}

              <section className="group relative mb-5 overflow-hidden rounded-2xl border border-ui bg-card p-4 animate-[transactionPanel_650ms_cubic-bezier(0.22,1,0.36,1)_200ms_both]">
                <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent opacity-0 transition-opacity duration-500 group-focus-within:opacity-100" />

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-300 peer-focus:text-emerald-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search transaction ID, customer, failure reason..."
                    className="peer w-full rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 pl-10 pr-28 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-emerald-400/30 focus:bg-emerald-400/[0.015] focus:shadow-[0_0_25px_rgba(52,211,153,0.04)]"
                  />

                  {search.length > 0 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-emerald-400/10 px-2 py-1 text-[9px] font-medium text-emerald-400 animate-[transactionMatch_250ms_ease-out_both]">
                      {filteredTransactions.length} match
                      {filteredTransactions.length === 1 ? "" : "es"}
                    </span>
                  )}
                </div>
              </section>

              {/* =================================================
                  TRANSACTION TABLE
              ================================================== */}

              <section className="group relative overflow-hidden rounded-2xl border border-ui bg-card animate-[transactionPanel_700ms_cubic-bezier(0.22,1,0.36,1)_300ms_both]">
                {/* Moving scan line */}
                <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-px overflow-hidden bg-white/[0.04]">
                  <div className="h-full w-1/4 bg-emerald-400/60 animate-[transactionScan_5s_ease-in-out_infinite]" />
                </div>

                {/* Table header */}
                <div className="border-b border-white/[0.06] px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold text-foreground">
                          Transaction activity
                        </h2>

                        <Activity className="h-3.5 w-3.5 text-emerald-400/60" />
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {filteredTransactions.length} transactions shown
                      </p>
                    </div>

                    <div className="hidden items-center gap-1.5 sm:flex">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/70" />

                      <span className="text-[9px] text-muted-foreground">
                        Payment intelligence active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Loading */}
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04]">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400" />
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground">
                      Loading transaction intelligence…
                    </p>

                    <div className="mx-auto mt-3 h-1 w-36 overflow-hidden rounded-full bg-white/[0.05]">
                      <div className="h-full w-1/2 rounded-full bg-emerald-400/50 animate-[transactionLoading_1.4s_ease-in-out_infinite]" />
                    </div>
                  </div>
                ) : error ? (
                  <div className="p-12 text-center">
                    <p className="text-sm text-red-400">
                      Unable to load transactions
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {error}
                    </p>
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="p-12 text-center animate-[transactionEmpty_400ms_ease-out_both]">
                    <Search className="mx-auto h-5 w-5 text-muted-foreground/50" />

                    <p className="mt-3 text-sm text-muted-foreground">
                      No transactions found.
                    </p>

                    {search && (
                      <p className="mt-1 text-[10px] text-muted-foreground/60">
                        Try another search term.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                      <thead>
                        <tr className="border-b border-white/[0.05] text-left">
                          <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                            Transaction
                          </th>

                          <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                            Customer
                          </th>

                          <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                            Amount
                          </th>

                          <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                            Failure
                          </th>

                          <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                            Risk
                          </th>

                          <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                            Status
                          </th>

                          <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredTransactions.map(
                          (transaction, index) => {
                            const risk = (
                              transaction.risk_level || "low"
                            ).toLowerCase();

                            const riskDot = getRiskDot(
                              transaction.risk_level
                            );

                            return (
                              <tr
                                key={transaction.id}
                                style={{
                                  animationDelay: `${Math.min(
                                    index * 70,
                                    700
                                  )}ms`,
                                }}
                                className="group/row relative border-b border-white/[0.05] opacity-0 animate-[transactionRow_600ms_cubic-bezier(0.22,1,0.36,1)_forwards] transition-all duration-300 hover:bg-white/[0.025] last:border-b-0"
                              >
                                {/* Transaction */}
                                <td className="relative px-5 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-muted-foreground transition-all duration-300 group-hover/row:scale-105 group-hover/row:bg-emerald-400/[0.07] group-hover/row:text-emerald-400">
                                      <CreditCard className="h-3.5 w-3.5" />
                                    </div>

                                    <div>
                                      <p className="text-xs font-medium text-foreground transition-colors duration-300 group-hover/row:text-emerald-400">
                                        {transaction.transaction_id}
                                      </p>

                                      <p className="mt-1 text-[10px] text-muted-foreground">
                                        {transaction.customer_id}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                {/* Customer */}
                                <td className="px-5 py-4">
                                  <p className="text-xs text-foreground transition-transform duration-300 group-hover/row:translate-x-0.5">
                                    {transaction.customer_name}
                                  </p>
                                </td>

                                {/* Amount */}
                                <td className="px-5 py-4">
                                  <p className="text-xs font-semibold text-foreground transition-colors duration-300 group-hover/row:text-emerald-400">
                                    {formatAmount(
                                      transaction.amount,
                                      transaction.currency
                                    )}
                                  </p>
                                </td>

                                {/* Failure */}
                                <td className="px-5 py-4">
                                  <span className="text-xs text-zinc-400">
                                    {formatText(
                                      transaction.failure_reason
                                    )}
                                  </span>
                                </td>

                                {/* Risk */}
                                <td className="px-5 py-4">
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] capitalize transition-all duration-300 group-hover/row:scale-105 ${getRiskClass(
                                      transaction.risk_level
                                    )}`}
                                  >
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${riskDot} ${
                                        risk === "critical" ||
                                        risk === "high"
                                          ? "animate-pulse"
                                          : ""
                                      }`}
                                    />

                                    {formatText(
                                      transaction.risk_level
                                    )}
                                  </span>
                                </td>

                                {/* Status */}
                                <td className="px-5 py-4">
                                  <span
                                    className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] transition-all duration-300 group-hover/row:scale-105 ${getStatusClass(
                                      transaction.status
                                    )}`}
                                  >
                                    {formatText(
                                      transaction.status
                                    )}
                                  </span>
                                </td>

                                {/* Action */}
                                <td className="px-5 py-4">
                                  <Link
                                    href={`/dashboard?case=${encodeURIComponent(
                                      transaction.id
                                    )}`}
                                    className="group/action inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[10px] text-zinc-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/20 hover:bg-emerald-400/[0.04] hover:text-foreground hover:shadow-[0_8px_25px_rgba(52,211,153,0.05)]"
                                  >
                                    View case

                                    <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover/action:-translate-y-0.5 group-hover/action:translate-x-0.5" />
                                  </Link>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* Bottom intelligence status */}
              <div className="mt-6 flex items-center justify-center gap-2 animate-[transactionFooter_700ms_ease-out_700ms_both]">
                <Sparkles className="h-3 w-3 text-emerald-400/50" />

                <span className="text-[9px] tracking-wide text-muted-foreground/50">
                  Transaction intelligence layer active
                </span>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes transactionHeader {
              from {
                opacity: 0;
                transform: translateY(18px);
              }

              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes transactionPanel {
              from {
                opacity: 0;
                transform: translateY(16px) scale(0.99);
              }

              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }

            @keyframes transactionRow {
              from {
                opacity: 0;
                transform: translateY(12px);
              }

              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes transactionDivider {
              from {
                opacity: 0;
                transform: scaleX(0);
              }

              to {
                opacity: 1;
                transform: scaleX(1);
              }
            }

            @keyframes transactionScan {
              0% {
                transform: translateX(-160%);
              }

              45%,
              100% {
                transform: translateX(520%);
              }
            }

            @keyframes transactionGlow {
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

            @keyframes transactionLoading {
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

            @keyframes transactionMatch {
              from {
                opacity: 0;
                transform: translateY(-50%) scale(0.9);
              }

              to {
                opacity: 1;
                transform: translateY(-50%) scale(1);
              }
            }

            @keyframes transactionEmpty {
              from {
                opacity: 0;
                transform: translateY(8px);
              }

              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes transactionFooter {
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
      </AuthGuard>
    </DashboardShell>
  );
}