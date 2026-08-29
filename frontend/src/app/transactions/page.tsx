"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CreditCard,
  Search,
} from "lucide-react";

import Link from "next/link";

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

function formatText(value?: string | null) {
  if (!value) return "—";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
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

  if (
    value.includes("fail") ||
    value.includes("risk")
  ) {
    return "border-red-400/20 bg-red-400/[0.05] text-red-400";
  }

  return "border-amber-400/20 bg-amber-400/[0.05] text-amber-400";
}

export default function TransactionsPage() {
  const [cases, setCases] = useState<RecoveryCase[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

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

  const filteredTransactions = useMemo(() => {
    const query =
      search.trim().toLowerCase();

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
          String(value)
            .toLowerCase()
            .includes(query)
        )
    );
  }, [cases, search]);

  return (
    <DashboardShell>
      <AuthGuard>
        <div className="min-h-full p-5 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1600px]">

            {/* Header */}
            <section className="mb-8">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                    Payment intelligence
                  </p>

                  <h1 className="mt-2 text-4xl font-bold tracking-[-0.045em] text-foreground sm:text-5xl">
                    Transactions
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Monitor payment transactions,
                    failure reasons, risk levels,
                    and recovery outcomes.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                    <CreditCard className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      Transactions
                    </p>

                    <p className="text-sm font-semibold text-foreground">
                      {cases.length}
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* Search */}
            <section className="mb-5 rounded-2xl border border-white/[0.06] bg-card p-4">
              <div className="relative">

                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search transaction ID, customer, failure reason..."
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-emerald-400/30"
                />

              </div>
            </section>

            {/* Transaction table */}
            <section className="overflow-hidden rounded-2xl border border-white/[0.06] bg-card">

              <div className="border-b border-white/[0.06] px-5 py-4">
                <h2 className="text-sm font-semibold text-foreground">
                  Transaction activity
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {filteredTransactions.length} transactions shown
                </p>
              </div>

              {loading ? (

                <div className="p-10 text-center text-sm text-muted-foreground">
                  Loading transactions…
                </div>

              ) : error ? (

                <div className="p-10 text-center text-sm text-red-400">
                  Unable to load transactions: {error}
                </div>

              ) : filteredTransactions.length === 0 ? (

                <div className="p-10 text-center text-sm text-muted-foreground">
                  No transactions found.
                </div>

              ) : (

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[900px]">

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
                        (transaction) => {

                          const risk =
                            (
                              transaction.risk_level ||
                              "low"
                            ).toLowerCase();

                          return (
                            <tr
                              key={transaction.id}
                              className="border-b border-white/[0.05] transition-colors hover:bg-white/[0.02]"
                            >

                              {/* Transaction */}
                              <td className="px-5 py-4">

                                <p className="text-xs font-medium text-foreground">
                                  {
                                    transaction.transaction_id
                                  }
                                </p>

                                <p className="mt-1 text-[10px] text-muted-foreground">
                                  {
                                    transaction.customer_id
                                  }
                                </p>

                              </td>

                              {/* Customer */}
                              <td className="px-5 py-4">

                                <p className="text-xs text-foreground">
                                  {
                                    transaction.customer_name
                                  }
                                </p>

                              </td>

                              {/* Amount */}
                              <td className="px-5 py-4">

                                <p className="text-xs font-semibold text-foreground">
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
                                  className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] capitalize ${
                                    risk === "critical" ||
                                    risk === "high"
                                      ? "border-red-400/20 bg-red-400/[0.05] text-red-400"
                                      : risk === "medium"
                                        ? "border-amber-400/20 bg-amber-400/[0.05] text-amber-400"
                                        : "border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-400"
                                  }`}
                                >
                                  {formatText(
                                    transaction.risk_level
                                  )}
                                </span>

                              </td>

                              {/* Status */}
                              <td className="px-5 py-4">

                                <span
                                  className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] ${getStatusClass(
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
                                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[10px] text-zinc-400 transition hover:bg-white/[0.05] hover:text-foreground"
                                >
                                  View case
                                  <ArrowUpRight className="h-3 w-3" />
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

          </div>
        </div>
      </AuthGuard>
    </DashboardShell>
  );
}
