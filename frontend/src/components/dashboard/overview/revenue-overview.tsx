"use client";

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
    <div className="rounded-xl border border-white/[0.08] bg-[#101416] px-4 py-3 shadow-2xl">
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
  return (
    <section className="rounded-2xl border border-ui bg-card p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Recovery performance
          </p>

          <div className="mt-2 flex items-baseline gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
              ₹7.8L
            </h3>

            <span className="text-xs font-medium text-emerald-400">
              +14.2%
            </span>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            recovered in the selected period
          </p>
        </div>

          <div className="flex items-center gap-1 rounded-xl border border-ui bg-card p-1">
          {["7D", "30D", "90D"].map((period) => (
            <button
              key={period}
              className={`rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors ${
                period === "30D"
                  ? "bg-emerald-400/10 text-emerald-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 h-[280px] w-full">
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
                id="recoveredGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#34d399"
                  stopOpacity={0.18}
                />
                <stop
                  offset="100%"
                  stopColor="#34d399"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient
                id="riskGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#f59e0b"
                  stopOpacity={0.08}
                />
                <stop
                  offset="100%"
                  stopColor="#f59e0b"
                  stopOpacity={0}
                />
              </linearGradient>
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
                stroke: "rgba(255,255,255,0.12)",
              }}
            />

            <Area
              type="monotone"
              dataKey="atRisk"
              name="atRisk"
              stroke="#f59e0b"
              strokeWidth={1.5}
              fill="url(#riskGradient)"
              fillOpacity={1}
            />

            <Area
              type="monotone"
              dataKey="recovered"
              name="recovered"
              stroke="#34d399"
              strokeWidth={2}
              fill="url(#recoveredGradient)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center gap-5 border-t border-white/[0.05] pt-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-muted-foreground">
            Recovered
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span className="text-[10px] text-muted-foreground">
            Revenue at risk
          </span>
        </div>
      </div>
    </section>
  );
}