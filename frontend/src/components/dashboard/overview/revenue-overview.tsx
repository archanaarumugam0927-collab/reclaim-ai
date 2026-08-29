"use client";

import { useState } from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Aug 01", atRisk: 8.2, recovered: 4.1 },
  { day: "Aug 04", atRisk: 9.4, recovered: 4.8 },
  { day: "Aug 07", atRisk: 10.1, recovered: 5.2 },
  { day: "Aug 10", atRisk: 9.6, recovered: 5.7 },
  { day: "Aug 13", atRisk: 11.2, recovered: 6.1 },
  { day: "Aug 16", atRisk: 10.8, recovered: 6.5 },
  { day: "Aug 19", atRisk: 12.1, recovered: 7.1 },
  { day: "Aug 22", atRisk: 12.4, recovered: 7.8 },
];

type Period = "7D" | "30D" | "90D";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
  }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#101416] px-4 py-3 shadow-2xl backdrop-blur-xl">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>

      {payload.map((item) => (
        <div
          key={item.name}
          className="flex items-center justify-between gap-8 py-0.5"
        >
          <span className="text-xs text-zinc-400">
            {item.name === "recovered" ? "Recovered" : "At risk"}
          </span>

          <span className="text-xs font-semibold text-foreground">
            ₹{item.value.toFixed(1)}L
          </span>
        </div>
      ))}
    </div>
  );
}

export function RevenueOverview() {
  const [period, setPeriod] = useState<Period>("30D");

  return (
    <>
      <section className="group relative overflow-hidden rounded-2xl border border-ui bg-card p-5 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-2xl sm:p-6">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-emerald-400/[0.035] blur-3xl transition-all duration-700 group-hover:bg-emerald-400/[0.07]" />

        {/* Animated top scan */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-px overflow-hidden bg-white/[0.04]">
          <div className="h-full w-1/4 animate-[chartScan_4s_ease-in-out_infinite] bg-emerald-400/70" />
        </div>

        {/* Header */}
        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="animate-[chartHeader_600ms_ease-out_both]">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Recovery performance
              </p>

              <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-2 py-1 text-[9px] font-medium text-emerald-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Live
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-3">
              <h3 className="text-2xl font-semibold tracking-[-0.03em] text-foreground transition-transform duration-300 group-hover:translate-x-0.5">
                ₹7.8L
              </h3>

              <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                +14.2%
              </span>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              recovered in the selected period
            </p>
          </div>

          {/* Period selector */}
          <div className="relative flex items-center gap-1 rounded-xl border border-ui bg-card p-1 shadow-sm">
            {(["7D", "30D", "90D"] as Period[]).map((item) => {
              const active = period === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPeriod(item)}
                  className={`relative rounded-lg px-3 py-1.5 text-[10px] font-medium transition-all duration-300 ${
                    active
                      ? "bg-emerald-400/10 text-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.06)]"
                      : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-lg border border-emerald-400/10 animate-[periodPulse_2s_ease-in-out_infinite]" />
                  )}

                  <span className="relative">{item}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart */}
        <div className="relative mt-7 h-[280px] w-full animate-[chartReveal_900ms_ease-out_150ms_both]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 5,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="recoveredGradientAnimated"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#34d399"
                    stopOpacity={0.22}
                  />

                  <stop
                    offset="100%"
                    stopColor="#34d399"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="riskGradientAnimated"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#f59e0b"
                    stopOpacity={0.09}
                  />

                  <stop
                    offset="100%"
                    stopColor="#f59e0b"
                    stopOpacity={0}
                  />
                </linearGradient>

                <filter
                  id="recoveryGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur
                    stdDeviation="3"
                    result="blur"
                  />

                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <CartesianGrid
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#52525b",
                  fontSize: 10,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#52525b",
                  fontSize: 10,
                }}
                tickFormatter={(value) => `₹${value}L`}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "rgba(52,211,153,0.18)",
                  strokeWidth: 1,
                }}
              />

              <Area
                type="monotone"
                dataKey="atRisk"
                name="atRisk"
                stroke="#f59e0b"
                strokeWidth={1.5}
                fill="url(#riskGradientAnimated)"
                fillOpacity={1}
                animationDuration={1400}
                animationEasing="ease-out"
              />

              <Area
                type="monotone"
                dataKey="recovered"
                name="recovered"
                stroke="#34d399"
                strokeWidth={2.2}
                fill="url(#recoveredGradientAnimated)"
                fillOpacity={1}
                filter="url(#recoveryGlow)"
                animationDuration={1800}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Floating live indicator */}
          <div className="pointer-events-none absolute right-2 top-2 flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-2.5 py-1.5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[9px] text-emerald-400">
              Tracking live
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-5 border-t border-white/[0.05] pt-4">
          <div className="group/legend flex cursor-default items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[10px] text-muted-foreground transition-colors duration-200 group-hover/legend:text-foreground">
              Recovered
            </span>
          </div>

          <div className="group/legend flex cursor-default items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />

            <span className="text-[10px] text-muted-foreground transition-colors duration-200 group-hover/legend:text-foreground">
              Revenue at risk
            </span>
          </div>

          <div className="ml-auto hidden items-center gap-1.5 sm:flex">
            <span className="text-[9px] text-muted-foreground">
              Period
            </span>

            <span className="text-[9px] font-medium text-foreground">
              {period}
            </span>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes chartScan {
          0% {
            transform: translateX(-150%);
          }

          45% {
            transform: translateX(500%);
          }

          100% {
            transform: translateX(500%);
          }
        }

        @keyframes chartReveal {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes chartHeader {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes periodPulse {
          0%,
          100% {
            opacity: 0.4;
          }

          50% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

export default RevenueOverview;