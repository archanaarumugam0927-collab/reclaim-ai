import LoginForm from "@/components/auth/login-form";
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";

export default function LoginPage() {
  return (
    <DashboardShell>
      <div className="p-8">
        <div className="mx-auto max-w-md">
          <LoginForm />
        </div>
      </div>
    </DashboardShell>
  );
}
