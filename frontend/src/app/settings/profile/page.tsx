export default function ProfileSettingsPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Merchant Profile
          </p>

          <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-foreground">
            Profile
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your merchant profile information.
          </p>
        </div>

        {/* Profile Card */}
        <section className="rounded-2xl border border-ui bg-card p-6">
          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 text-xl font-semibold text-emerald-500 ring-1 ring-emerald-400/20">
              AC
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Acme Commerce
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Merchant workspace
              </p>

              <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Active account
              </div>
            </div>

          </div>
        </section>

        {/* Personal Information */}
        <section className="mt-5 rounded-2xl border border-ui bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Profile Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Information associated with this merchant profile.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Display Name
              </label>

              <input
                type="text"
                defaultValue="Acme Commerce"
                className="mt-2 w-full rounded-xl border border-ui bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-emerald-400/50"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Account Role
              </label>

              <input
                type="text"
                defaultValue="Merchant"
                disabled
                className="mt-2 w-full cursor-not-allowed rounded-xl border border-ui bg-muted px-4 py-3 text-sm text-muted-foreground outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Email
              </label>

              <input
                type="email"
                defaultValue="demo@reclaim.ai"
                className="mt-2 w-full rounded-xl border border-ui bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-emerald-400/50"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Workspace
              </label>

              <input
                type="text"
                defaultValue="Acme Commerce"
                disabled
                className="mt-2 w-full cursor-not-allowed rounded-xl border border-ui bg-muted px-4 py-3 text-sm text-muted-foreground outline-none"
              />
            </div>

          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-medium text-black transition-all hover:bg-emerald-300 hover:shadow-[0_0_20px_rgba(52,211,153,0.18)]"
            >
              Save changes
            </button>
          </div>
        </section>

        {/* Account Status */}
        <section className="mt-5 rounded-2xl border border-ui bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Account Status
          </h2>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4">

            <div>
              <p className="text-sm font-medium text-foreground">
                Merchant account active
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Your profile is connected to the Reclaim recovery engine.
              </p>
            </div>

            <span className="rounded-lg bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-500">
              Active
            </span>

          </div>
        </section>

      </div>
    </main>
  );
}