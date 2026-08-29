"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Search,
  Users,
} from "lucide-react";

import Link from "next/link";

import AuthGuard from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";

import {
  getRecoveryCases,
  type RecoveryCase,
} from "@/lib/api/recovery";

function formatCurrency(
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

export default function CustomersPage() {
  const [cases, setCases] = useState<
    RecoveryCase[]
  >([]);

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

  const filteredCases = useMemo(() => {
    const query =
      search.trim().toLowerCase();

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
                    Customer intelligence
                  </p>

                  <h1 className="mt-2 text-4xl font-bold tracking-[-0.045em] text-foreground sm:text-5xl">
                    Customers
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Monitor customers connected to
                    payment failures and recovery
                    workflows.
                  </p>

                </div>


                <div className="flex items-center gap-2">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">

                    <Users className="h-5 w-5" />

                  </div>

                  <div>

                    <p className="text-xs text-muted-foreground">
                      Total customers
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
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search customers, IDs, failure reasons..."
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-emerald-400/30"
                />

              </div>

            </section>


            {/* Customer List */}

            <section className="overflow-hidden rounded-2xl border border-white/[0.06] bg-card">

              <div className="border-b border-white/[0.06] px-5 py-4">

                <h2 className="text-sm font-semibold text-foreground">
                  Customer accounts
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {filteredCases.length} customers
                  shown
                </p>

              </div>


              {loading ? (

                <div className="p-8 text-center text-sm text-muted-foreground">
                  Loading customers…
                </div>

              ) : error ? (

                <div className="p-8 text-center text-sm text-red-400">
                  Unable to load customers:{" "}
                  {error}
                </div>

              ) : filteredCases.length === 0 ? (

                <div className="p-8 text-center text-sm text-muted-foreground">
                  No customers found.
                </div>

              ) : (

                <div>

                  {filteredCases.map(
                    (customer) => {

                      const risk =
                        (
                          customer.risk_level ||
                          "low"
                        ).toLowerCase();

                      const initials =
                        customer.customer_name
                          .split(" ")
                          .map(
                            (part) =>
                              part[0] ?? ""
                          )
                          .slice(0, 2)
                          .join("")
                          .toUpperCase();

                      return (

                        <div
                          key={customer.id}
                          className="border-b border-white/[0.05] p-5 last:border-b-0 transition-colors hover:bg-white/[0.02]"
                        >

                          <div className="flex flex-col gap-5 xl:flex-row xl:items-center">

                            {/* Customer */}

                            <div className="flex min-w-0 flex-1 items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-xs font-semibold text-foreground">
                                {initials}
                              </div>

                              <div className="min-w-0">

                                <p className="truncate text-sm font-medium text-foreground">
                                  {
                                    customer.customer_name
                                  }
                                </p>

                                <p className="mt-1 truncate text-[11px] text-muted-foreground">
                                  {
                                    customer.customer_id
                                  }
                                </p>

                              </div>

                            </div>


                            {/* Amount */}

                            <div className="min-w-[130px]">

                              <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                                Revenue
                              </p>

                              <p className="mt-1 text-sm font-semibold text-foreground">
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
                                className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-[9px] capitalize ${
                                  risk ===
                                    "critical" ||
                                  risk === "high"
                                    ? "border-red-400/20 bg-red-400/[0.05] text-red-400"
                                    : risk ===
                                        "medium"
                                      ? "border-amber-400/20 bg-amber-400/[0.05] text-amber-400"
                                      : "border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-400"
                                }`}
                              >
                                {formatText(
                                  customer.risk_level
                                )}
                              </span>

                            </div>


                            {/* Failure */}

                            <div className="min-w-[150px]">

                              <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                                Issue
                              </p>

                              <p className="mt-1 text-xs capitalize text-zinc-400">
                                {formatText(
                                  customer.failure_reason
                                )}
                              </p>

                            </div>


                            {/* Recovery */}

                            <div className="min-w-[110px]">

                              <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                                Recovery
                              </p>

                              <p className="mt-1 text-xs text-zinc-400">
                                {customer.customer_recovery_rate !=
                                null
                                  ? `${(
                                      customer.customer_recovery_rate *
                                      100
                                    ).toFixed(0)}%`
                                  : "—"}
                              </p>

                            </div>


                            {/* Action */}

                            <div className="flex shrink-0">

                              <Link
                                href={`/dashboard?case=${encodeURIComponent(
                                  customer.id
                                )}`}
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-zinc-400 transition hover:bg-white/[0.05] hover:text-foreground"
                              >

                                View case

                                <ArrowUpRight className="h-3 w-3" />

                              </Link>

                            </div>

                          </div>

                        </div>

                      );
                    }
                  )}

                </div>

              )}

            </section>

          </div>

        </div>
      </AuthGuard>
    </DashboardShell>
  );
}