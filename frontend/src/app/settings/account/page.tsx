export default function AccountSettingsPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Account
          </p>

          <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-foreground">
            Account Settings
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your merchant account and billing preferences.
          </p>
        </div>

        <section className="rounded-2xl border border-ui bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Account Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Details associated with your Reclaim merchant account.
          </p>

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
                Account Type
              </p>

              <p className="mt-2 text-sm font-medium text-foreground">
                Merchant
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

            <div className="rounded-xl border border-ui bg-background p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Account Status
              </p>

              <p className="mt-2 text-sm font-medium text-emerald-500">
                Active
              </p>
            </div>

          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-ui bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Billing
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage billing and payment preferences for your account.
          </p>

          <div className="mt-5 rounded-xl border border-ui bg-background p-4">
            <p className="text-sm font-medium text-foreground">
              Test Mode Account
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Billing controls are currently disabled while using
              Razorpay Test Mode.
            </p>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-ui bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Security
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Account security and session information.
          </p>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-ui bg-background p-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Current session
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Your Reclaim merchant session is active.
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