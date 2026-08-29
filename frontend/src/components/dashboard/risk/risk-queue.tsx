"use client";

import {
  ArrowUpRight,
  CreditCard,
  Receipt,
  Users,
} from "lucide-react";

type RiskLevel = "High" | "Medium" | "Low";

interface RiskCase {
  customer: string;
  initials: string;
  issue: string;
  amount: string;
  risk: RiskLevel;
  action: string;
  id?: string;
  icon: "payment" | "checkout" | "invoice" | "customer";
}

const iconMap = {
  payment: CreditCard,
  checkout: Users,
  invoice: Receipt,
  customer: CreditCard,
};

const riskStyles: Record<
  RiskLevel,
  {
    badge: string;
    dot: string;
  }
> = {
  High: {
    badge:
      "border-red-400/10 bg-red-400/[0.06] text-red-400",
    dot: "bg-red-400",
  },

  Medium: {
    badge:
      "border-amber-400/10 bg-amber-400/[0.06] text-amber-400",
    dot: "bg-amber-400",
  },

  Low: {
    badge:
      "border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-400",
    dot: "bg-emerald-400",
  },
};

export function RiskQueue({
  initialCases,
  onSelectCase,
}: {
  initialCases?: RiskCase[] | null;
  onSelectCase?: (caseId: string) => void;
}) {
  /*
   * DashboardData owns the real cases state.
   * Whenever a new simulated payment failure is created,
   * DashboardData updates initialCases and this component
   * immediately receives the newest list.
   */

  const cases = initialCases ?? [];

  const handleSelect = (caseId?: string) => {
    if (!caseId) return;

    onSelectCase?.(caseId);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-ui bg-card">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-4 border-b border-ui p-5 sm:flex-row sm:items-center sm:p-6">

        <div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Revenue intelligence
          </p>

          <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-foreground">
            Revenue risk queue
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Revenue opportunities requiring intelligent intervention.
          </p>

        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 self-start rounded-xl border border-ui bg-card px-3 py-2 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          View all cases

          <ArrowUpRight className="h-3 w-3" />
        </button>

      </div>


      {/* =====================================================
          DESKTOP
      ====================================================== */}

      <div className="hidden md:block">

        {cases.length === 0 ? (

          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            No active recovery cases.
          </div>

        ) : (

          cases.map((item) => {

            const styles = riskStyles[item.risk];

            const Icon = iconMap[item.icon];

            return (
              <button
                type="button"
                key={
                  item.id ??
                  `${item.customer}-${item.amount}`
                }
                onClick={() =>
                  handleSelect(item.id)
                }
                className="group block w-full border-b border-ui text-left transition-colors last:border-b-0 hover:bg-accent focus:outline-none focus:ring-1 focus:ring-emerald-400/30"
              >

                <div className="grid grid-cols-[minmax(0,1fr)_180px] gap-6 p-5 sm:p-6">

                  {/* CUSTOMER */}

                  <div className="min-w-0">

                    <div className="flex items-start gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ui bg-muted text-[10px] font-semibold text-muted-foreground">
                        {item.initials}
                      </div>

                      <div className="min-w-0">

                        <div className="flex items-center gap-2">

                          <p className="truncate text-sm font-medium text-foreground">
                            {item.customer}
                          </p>

                          <span
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-medium ${styles.badge}`}
                          >

                            <span
                              className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
                            />

                            {item.risk}

                          </span>

                        </div>

                        <p className="mt-1 text-[10px] capitalize text-muted-foreground">
                          {item.issue}
                        </p>

                      </div>

                    </div>


                    {/* REVENUE */}

                    <div className="mt-5">

                      <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                        Revenue
                      </p>

                      <p className="mt-1 text-base font-semibold text-foreground">
                        {item.amount}
                      </p>

                    </div>

                  </div>


                  {/* ACTION */}

                  <div className="flex flex-col items-end justify-between">

                    <div className="text-right">

                      <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                        Suggested action
                      </p>

                      <p className="mt-2 text-xs capitalize text-emerald-400">
                        {item.action}
                      </p>

                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground transition-colors group-hover:text-foreground">

                      View case details

                      <ArrowUpRight className="h-3 w-3" />

                    </div>

                  </div>

                </div>

              </button>
            );
          })

        )}

      </div>


      {/* =====================================================
          MOBILE
      ====================================================== */}

      <div className="divide-y divide-border md:hidden">

        {cases.length === 0 ? (

          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            No active recovery cases.
          </div>

        ) : (

          cases.map((item) => {

            const styles = riskStyles[item.risk];

            return (
              <button
                type="button"
                key={
                  item.id ??
                  `${item.customer}-${item.amount}`
                }
                onClick={() =>
                  handleSelect(item.id)
                }
                className="block w-full cursor-pointer p-4 text-left transition-colors hover:bg-accent focus:outline-none focus:ring-1 focus:ring-emerald-400/30"
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ui bg-muted text-[9px] font-semibold text-muted-foreground">
                      {item.initials}
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-xs font-medium text-foreground">
                        {item.customer}
                      </p>

                      <p className="mt-1 capitalize text-[10px] text-muted-foreground">
                        {item.issue}
                      </p>

                    </div>

                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] font-medium ${styles.badge}`}
                  >

                    <span
                      className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
                    />

                    {item.risk}

                  </span>

                </div>


                <div className="mt-4 flex items-end justify-between">

                  <div>

                    <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                      Revenue
                    </p>

                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {item.amount}
                    </p>

                  </div>

                  <div className="max-w-[55%] text-right">

                    <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                      Suggested action
                    </p>

                    <p className="mt-1 truncate text-xs capitalize text-emerald-400">
                      {item.action}
                    </p>

                  </div>

                </div>


                <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">

                  View case details

                  <ArrowUpRight className="h-3 w-3" />

                </div>

              </button>
            );
          })

        )}

      </div>

    </section>
  );
}

export default RiskQueue;