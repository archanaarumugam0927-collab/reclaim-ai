import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";
import DashboardData from "@/components/dashboard/dashboard-data";
import AuthGuard from "@/components/auth/auth-guard";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="p-5 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px]">
          {/* Page heading */}
          <section className="mb-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Revenue intelligence
                </p>

                <h2 className="mt-2 text-4xl font-bold tracking-[-0.045em] text-foreground sm:text-5xl">
                  Command Center
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Monitor revenue at risk, understand why payments are
                  slipping, and let Reclaim recover what can still be saved.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

                <span className="text-xs font-medium text-zinc-400">
                  Recovery engine active
                </span>
              </div>
            </div>
          </section>

          <AuthGuard>
            <DashboardData />
          </AuthGuard>
        </div>
      </div>
    </DashboardShell>
  );
}