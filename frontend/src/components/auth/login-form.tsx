"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Demo account
  const DEMO_EMAIL = "demo@reclaim.ai";
  const DEMO_PASSWORD = "demo123";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (email !== DEMO_EMAIL) {
      setError("Account not found");
      return;
    }

    if (password !== DEMO_PASSWORD) {
      setError("Incorrect password");
      return;
    }

    // Successful login
    try {
      localStorage.setItem(
        "reclaim_user",
        JSON.stringify({ email })
      );
    } catch {
      // Ignore storage errors
    }

    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-ui bg-card p-6"
    >
      {/* Heading */}
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          Sign in to Reclaim
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Access your revenue recovery workspace
        </p>
      </div>

      {/* Email */}
      <div className="mt-6">
        <label
          htmlFor="reclaim-email"
          className="block text-xs font-medium text-muted-foreground"
        >
          Email
        </label>

        <input
          id="reclaim-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) {
              setError(null);
            }
          }}
          placeholder="Enter your email"
          autoComplete="email"
          className="mt-2 h-11 w-full rounded-xl border border-ui bg-background px-3.5 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground/50 hover:border-emerald-400/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
        />
      </div>

      {/* Password */}
      <div className="mt-5">
        <label
          htmlFor="reclaim-password"
          className="block text-xs font-medium text-muted-foreground"
        >
          Password
        </label>

        <input
          id="reclaim-password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) {
              setError(null);
            }
          }}
          placeholder="Enter your password"
          autoComplete="current-password"
          className="mt-2 h-11 w-full rounded-xl border border-ui bg-background px-3.5 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground/50 hover:border-emerald-400/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
        />
      </div>

      {/* Error */}
      {error ? (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-3 py-2.5 text-sm text-red-400"
        >
          {error}
        </div>
      ) : null}

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-4">
        <button
          type="submit"
          className="h-11 w-full rounded-xl bg-emerald-400 px-4 text-sm font-semibold text-black shadow-[0_8px_24px_rgba(52,211,153,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-[0_12px_30px_rgba(52,211,153,0.18)] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
        >
          Sign in
        </button>

        <div className="text-center text-[11px] leading-5 text-muted-foreground">
          Demo:{" "}
          <span className="text-foreground/70">demo@reclaim.ai</span>{" "}
          /{" "}
          <span className="text-foreground/70">demo123</span>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;