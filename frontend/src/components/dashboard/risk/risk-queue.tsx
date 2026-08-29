"use client";

import {
  ArrowUpRight,
  CreditCard,
  Receipt,
  Users,
  ShieldAlert,
  Sparkles,
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
    glow: string;
  }
> = {
  High: {
    badge: "border-red-400/10 bg-red-400/[0.06] text-red-400",
    dot: "bg-red-400",
    glow: "group-hover:shadow-[inset_3px_0_0_rgba(248,113,113,0.7)]",
  },

  Medium: {
    badge: "border-amber-400/10 bg-amber-400/[0.06] text-amber-400",
    dot: "bg-amber-400",
    glow: "group-hover:shadow-[inset_3px_0_0_rgba(251,191,36,0.7)]",
  },

  Low: {
    badge: "border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-400",
    dot: "bg-emerald-400",
    glow: "group-hover:shadow-[inset_3px_0_0_rgba(52,211,153,0.7)]",
  },
};

export function RiskQueue({
  initialCases,
  onSelectCase,
}: {
  initialCases?: RiskCase[] | null;
  onSelectCase?: (caseId: string) => void;
}) {
  const cases = initialCases ?? [];

  const handleSelect = (caseId?: string) => {
    if (!caseId) return;

    onSelectCase?.(caseId);
  };

  return (
    <>
      <section className="group relative overflow-hidden rounded-2xl border border-ui bg-card">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-red-400/[0.025] blur-3xl transition-all duration-700 group-hover:bg-red-400/[0.05]" />

        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-emerald-400/[0.025] blur-3xl" />

        {/* Animated scan line */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-px overflow-hidden bg-white/[0.04]">
          <div className="h-full w-1/4 animate-[riskScan_4s_ease-in-out_infinite] bg-emerald-400/60" />
        </div>

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="relative flex flex-col justify-between gap-4 border-b border-ui p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="animate-[riskHeader_500ms_ease-out_both]">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Revenue intelligence
              </p>

              <span className="flex items-center gap-1.5 rounded-full border border-red-400/10 bg-red-400/[0.04] px-2 py-1 text-[9px] font-medium text-red-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-red-400 opacity-50" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-red-400" />
                </span>
                Attention
              </span>
            </div>

            <h3 className="mt-2 flex items-center gap-2 text-xl font-semibold tracking-[-0.025em] text-foreground">
              Revenue risk queue
              <ShieldAlert className="h-4 w-4 text-amber-400 transition-transform duration-500 group-hover:rotate-6" />
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Revenue opportunities requiring intelligent intervention.
            </p>
          </div>

          <button
            type="button"
            className="group/view relative flex items-center gap-1.5 self-start overflow-hidden rounded-xl border border-ui bg-card px-3 py-2 text-[10px] font-medium text-muted-foreground transition-all duration-300 hover:border-emerald-400/20 hover:bg-emerald-400/[0.04] hover:text-foreground"
          >
            <span className="absolute inset-y-0 -left-full w-1/3 skew-x-12 bg-white/10 transition-all duration-700 group-hover/view:left-[130%]" />

            <span className="relative">
              View all cases
            </span>

            <ArrowUpRight className="relative h-3 w-3 transition-transform duration-300 group-hover/view:-translate-y-0.5 group-hover/view:translate-x-0.5" />
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
            cases.map((item, index) => {
              const styles = riskStyles[item.risk];
              const Icon = iconMap[item.icon];

              return (
                <button
                  type="button"
                  key={item.id ?? `${item.customer}-${item.amount}`}
                  onClick={() => handleSelect(item.id)}
                  style={{
                    animationDelay: `${index * 90}ms`,
                  }}
                  className={`group relative block w-full overflow-hidden border-b border-ui text-left opacity-0 animate-[riskRow_550ms_cubic-bezier(0.22,1,0.36,1)_forwards] transition-all duration-300 last:border-b-0 hover:bg-accent ${styles.glow} focus:outline-none focus:ring-1 focus:ring-emerald-400/30`}
                >
                  {/* Hover shimmer */}
                  <span className="pointer-events-none absolute inset-y-0 -left-full w-1/4 skew-x-12 bg-white/[0.025] transition-all duration-700 group-hover:left-[130%]" />

                  <div className="relative grid grid-cols-[minmax(0,1fr)_180px] gap-6 p-5 sm:p-6">
                    {/* CUSTOMER */}
                    <div className="min-w-0">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ui bg-muted text-[10px] font-semibold text-muted-foreground transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-400/20 group-hover:text-foreground">
                          {item.initials}

                          <span
                            className={`absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ${styles.dot} ${
                              item.risk === "High"
                                ? "animate-pulse"
                                : ""
                            }`}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-foreground transition-transform duration-300 group-hover:translate-x-0.5">
                              {item.customer}
                            </p>

                            <span
                              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-medium transition-all duration-300 group-hover:scale-105 ${styles.badge}`}
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

                        <p className="mt-1 text-base font-semibold text-foreground transition-all duration-300 group-hover:text-emerald-400">
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

                        <div className="mt-2 flex items-center justify-end gap-1.5">
                          <Sparkles className="h-3 w-3 text-emerald-400 opacity-60 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:opacity-100" />

                          <p className="text-xs capitalize text-emerald-400">
                            {item.action}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground">
                        View case details

                        <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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
            cases.map((item, index) => {
              const styles = riskStyles[item.risk];

              return (
                <button
                  type="button"
                  key={item.id ?? `${item.customer}-${item.amount}`}
                  onClick={() => handleSelect(item.id)}
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                  className={`group relative block w-full cursor-pointer overflow-hidden p-4 text-left opacity-0 animate-[riskRow_500ms_cubic-bezier(0.22,1,0.36,1)_forwards] transition-all duration-300 hover:bg-accent ${styles.glow} focus:outline-none focus:ring-1 focus:ring-emerald-400/30`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ui bg-muted text-[9px] font-semibold text-muted-foreground transition-all duration-300 group-hover:scale-105">
                        {item.initials}

                        <span
                          className={`absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full ${styles.dot} ${
                            item.risk === "High"
                              ? "animate-pulse"
                              : ""
                          }`}
                        />
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
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] font-medium transition-transform duration-300 group-hover:scale-105 ${styles.badge}`}
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

                      <p className="mt-1 text-sm font-semibold text-foreground transition-colors duration-300 group-hover:text-emerald-400">
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

                  <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground">
                    View case details

                    <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </section>

      <style jsx>{`
        @keyframes riskScan {
          0% {
            transform: translateX(-150%);
          }

          45% {
            transform: translateX(520%);
          }

          100% {
            transform: translateX(520%);
          }
        }

        @keyframes riskHeader {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes riskRow {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

export default RiskQueue;