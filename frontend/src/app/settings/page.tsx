export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Workspace
          </p>

          <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-foreground">
            Settings
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your Reclaim workspace and merchant preferences.
          </p>
        </div>

        {/* Workspace */}
        <section className="rounded-2xl border border-ui bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Workspace
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Current merchant workspace information.
              </p>
            </div>

            <div className="rounded-lg bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-500">
              Active
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <div className="rounded-xl border border-ui bg-background p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Merchant
              </p>

              <p className="mt-2 text-sm font-medium text-foreground">
                Acme Commerce
              </p>
            </div>

            <div className="rounded-xl border border-ui bg-background p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Environment
              </p>

              <p className="mt-2 text-sm font-medium text-foreground">
                Razorpay Test Mode
              </p>
            </div>

          </div>
        </section>

        {/* Recovery */}
        <section className="mt-5 rounded-2xl border border-ui bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Recovery Engine
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Current recovery system status.
          </p>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4">

            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>

            <div>
              <p className="text-sm font-medium text-foreground">
                Recovery engine active
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                AI recovery workflows are ready.
              </p>
            </div>

          </div>
        </section>

        {/* Account */}
        <section className="mt-5 rounded-2xl border border-ui bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Account
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Merchant account currently signed in.
          </p>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-ui bg-background p-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-sm font-semibold text-emerald-500">
              AC
            </div>

            <div>
              <p className="text-sm font-medium text-foreground">
                Acme Commerce
              </p>

              <p className="text-xs text-muted-foreground">
                Merchant workspace
              </p>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}