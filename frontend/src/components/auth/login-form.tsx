"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Demo account (development only)
  const DEMO_EMAIL = "demo@reclaim.ai";
  const DEMO_PASSWORD = "demo123";

  const handleSubmit = (e: React.FormEvent) => {
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

    // Successful login — set demo auth token in localStorage
    try {
      localStorage.setItem("reclaim_user", JSON.stringify({ email }));
    } catch {
      // ignore storage errors
    }

    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md rounded-2xl border border-ui bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground">Sign in to Reclaim</h3>

      <div className="mt-4">
        <label className="text-xs text-zinc-400">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md bg-card px-3 py-2 text-sm text-foreground outline-none" />
      </div>

      <div className="mt-4">
        <label className="text-xs text-zinc-400">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-md bg-card px-3 py-2 text-sm text-foreground outline-none" />
      </div>

      {error ? <div className="mt-3 text-sm text-red-400">{error}</div> : null}

      <div className="mt-4 flex items-center justify-between">
        <button type="submit" className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-medium text-black">Sign in</button>
        <div className="text-xs text-muted-foreground">Demo: demo@reclaim.ai / demo123</div>
      </div>
    </form>
  );
}

export default LoginForm;
