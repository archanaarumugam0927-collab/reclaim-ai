import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  Clock3,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

type MetricTone = "success" | "warning" | "danger" | "neutral";

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  description: string;
  tone?: MetricTone;
  icon: "revenue" | "recovered" | "risk" | "cases";
}

const iconMap = {
  revenue: CircleDollarSign,
  recovered: Sparkles,
  risk: ShieldAlert,
  cases: Clock3,
};

const toneStyles: Record<
  MetricTone,
  {
    icon: string;
    change: string;
    dot: string;
  }
> = {
  success: {
    icon: "bg-emerald-400/10 text-emerald-400",
    change: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  warning: {
    icon: "bg-amber-400/10 text-amber-400",
    change: "text-amber-400",
    dot: "bg-amber-400",
  },
  danger: {
    icon: "bg-red-400/10 text-red-400",
    change: "text-red-400",
    dot: "bg-red-400",
  },
  neutral: {
    icon: "bg-white/[0.06] text-foreground",
    change: "text-zinc-400",
    dot: "bg-zinc-400",
  },
};

export function MetricCard({
  label,
  value,
  change,
  description,
  tone = "neutral",
  icon,
}: MetricCardProps) {
  const Icon = iconMap[icon];
  const styles = toneStyles[tone];

  const positive =
    change.startsWith("+") || change.toLowerCase().includes("up");

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-ui bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-ui">
      <div
        className={`absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${styles.dot}`}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
            {value}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${styles.icon}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {positive ? (
            <ArrowUpRight className={`h-3.5 w-3.5 ${styles.change}`} />
          ) : (
            <ArrowDownRight className={`h-3.5 w-3.5 ${styles.change}`} />
          )}

          <span className={`text-xs font-medium ${styles.change}`}>
            {change}
          </span>
        </div>

        <p className="text-[10px] text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}