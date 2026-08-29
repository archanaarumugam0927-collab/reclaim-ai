"use client";

import {
  Activity,
  BarChart3,
  Bot,
  ChevronDown,
  CircleDollarSign,
  FileClock,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Revenue Risk",
    icon: Activity,
    href: "/dashboard#risk-queue",
  },
  {
    label: "AI Recovery",
    icon: Bot,
    href: "/dashboard#recovery-performance",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/customers",
  },
  {
    label: "Transactions",
    icon: CircleDollarSign,
    href: "/transactions",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
  {
    label: "Audit Trail",
    icon: FileClock,
    href: "/audit-trail",
  },
];

const bottomNavigation = [
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-ui bg-sidebar lg:flex lg:flex-col">

      {/* Brand */}
      <div className="flex h-20 items-center border-b border-ui px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-black shadow-[0_0_24px_rgba(52,211,153,0.18)]">
            <Zap className="h-4 w-4 fill-current" />
          </div>

          <div>
            <div className="text-[15px] font-semibold tracking-tight text-foreground">
              RECLAIM
            </div>

            <div className="text-[10px] font-medium tracking-[0.2em] text-emerald-500">
              AI
            </div>
          </div>
        </Link>
      </div>

      {/* Workspace */}
      <div className="px-4 pt-5">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-ui bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-foreground">
              AC
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-foreground">
                Acme Commerce
              </p>

              <p className="text-[10px] text-muted-foreground">
                Test workspace
              </p>
            </div>

          </div>

          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">

        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Workspace
        </p>

        <div className="space-y-1">

          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive =
  item.label === "Customers"
    ? pathname === "/customers" ||
      pathname.startsWith("/customers/")
    : item.label === "Transactions"
      ? pathname === "/transactions" ||
        pathname.startsWith("/transactions/")
      : item.label === "Analytics"
        ? pathname === "/analytics"
        : item.label === "Audit Trail"
          ? pathname === "/audit-trail"
          : item.label === "Overview"
            ? pathname === "/dashboard"
            : false;

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={
                  isActive ? "page" : undefined
                }
                className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  isActive
                    ? "bg-emerald-400/[0.09] text-emerald-500"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >

                <Icon
                  className={`h-[17px] w-[17px] transition-colors ${
                    isActive
                      ? "text-emerald-500"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />

                <span>
                  {item.label}
                </span>

                {item.label === "AI Recovery" && (
                  <span className="ml-auto rounded-md bg-emerald-400/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-500">
                    AI
                  </span>
                )}

              </Link>
            );
          })}

        </div>
      </nav>

      {/* Trust Indicator */}
      <div className="px-4 pb-4">

        <div className="rounded-xl border border-ui bg-card p-3">

          <div className="flex items-center gap-2">

            <ShieldCheck className="h-4 w-4 text-emerald-500" />

            <span className="text-xs font-medium text-foreground">
              Razorpay Test Mode
            </span>

            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

          </div>

          <p className="mt-1.5 pl-6 text-[10px] leading-relaxed text-muted-foreground">
            Connected and ready for recovery workflows.
          </p>

        </div>

      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-ui px-4 py-4">

        {bottomNavigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={
                isActive ? "page" : undefined
              }
              className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                isActive
                  ? "bg-emerald-400/[0.09] text-emerald-500"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >

              <Icon
                className={`h-[17px] w-[17px] ${
                  isActive
                    ? "text-emerald-500"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              />

              <span>
                {item.label}
              </span>

            </Link>
          );
        })}

      </div>

    </aside>
  );
}