"use client";

import LoginForm from "@/components/auth/login-form";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Main glow */}
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.055] blur-3xl animate-[pulse_5s_ease-in-out_infinite]" />

        {/* Top-left glow */}
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-emerald-400/[0.045] blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />

        {/* Bottom-right glow */}
        <div className="absolute -bottom-40 -right-40 h-[460px] w-[460px] rounded-full bg-cyan-400/[0.035] blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* Floating particles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <span className="absolute left-[18%] top-[25%] h-1 w-1 rounded-full bg-emerald-400/40 animate-[float_6s_ease-in-out_infinite]" />

        <span className="absolute right-[22%] top-[30%] h-1.5 w-1.5 rounded-full bg-emerald-400/30 animate-[float_8s_ease-in-out_infinite]" />

        <span className="absolute bottom-[25%] left-[25%] h-1 w-1 rounded-full bg-cyan-400/30 animate-[float_7s_ease-in-out_infinite]" />

        <span className="absolute bottom-[30%] right-[18%] h-1.5 w-1.5 rounded-full bg-emerald-400/30 animate-[float_9s_ease-in-out_infinite]" />
      </div>

      {/* Login content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <div
          className={`w-full max-w-md transition-all duration-1000 ease-out ${
            mounted
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >
          {/* Login card */}
          <div className="rounded-3xl border border-ui bg-card/90 p-2 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
            <div className="rounded-[1.35rem] px-5 py-7 sm:px-7 sm:py-8">
              {/* Brand */}
              <div
                className={`mb-7 text-center transition-all delay-150 duration-700 ${
                  mounted
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0"
                }`}
              >
                {/* Logo */}
                <div className="group mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400 text-black shadow-[0_0_35px_rgba(52,211,153,0.25)] transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-[0_0_45px_rgba(52,211,153,0.4)]">
                  <span className="text-xl font-bold transition-transform duration-500 group-hover:scale-110">
                    R
                  </span>
                </div>

                <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight text-foreground">
                  RECLAIM
                </h1>

                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-500">
                  AI Revenue Recovery
                </p>
              </div>

              {/* Login form */}
              <div
                className={`transition-all delay-300 duration-700 ${
                  mounted
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0"
                }`}
              >
                <LoginForm />
              </div>

              {/* Status */}
              <div
                className={`mt-6 flex items-center justify-center gap-2 transition-all delay-500 duration-700 ${
                  mounted
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>

                <span className="text-[10px] font-medium text-muted-foreground">
                  Revenue recovery engine active
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p
            className={`mt-5 text-center text-[10px] text-muted-foreground/60 transition-all delay-700 duration-700 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            }`}
          >
            Secure merchant recovery workspace
          </p>
        </div>
      </div>

      {/* Animation */}
    </main>
  );
}