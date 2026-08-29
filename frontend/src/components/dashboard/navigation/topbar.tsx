"use client";

import {
  Bell,
  ChevronDown,
  Command,
  CreditCard,
  HelpCircle,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import ThemeToggle from "@/components/ui/theme-toggle";
import {
  getRecoveryCases,
  type RecoveryCase,
} from "@/lib/api/recovery";

interface TopbarProps {
  showCopilot: boolean;
  onCopilotToggle: () => void;
}

export function Topbar({
  showCopilot,
  onCopilotToggle,
}: TopbarProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMerchantMenu, setShowMerchantMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [cases, setCases] = useState<RecoveryCase[]>([]);
  const [searchResults, setSearchResults] = useState<RecoveryCase[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mounted, setMounted] = useState(false);

  const merchantMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadCases() {
      try {
        setSearchLoading(true);
        setSearchError(false);

        const data = await getRecoveryCases();

        if (active) {
          setCases(data);
        }
      } catch (error) {
        console.error("Failed to load recovery cases:", error);

        if (active) {
          setSearchError(true);
        }
      } finally {
        if (active) {
          setSearchLoading(false);
        }
      }
    }

    loadCases();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = cases.filter((item) => {
      const searchableText = [
        item.customer_name,
        item.customer_id,
        item.transaction_id,
        item.failure_reason,
        item.risk_level,
        item.status,
        item.recommended_action,
        item.ai_diagnosis,
        item.decision_priority,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });

    setSearchResults(results.slice(0, 8));
    setShowSearchResults(true);
  }, [searchQuery, cases]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        const input = document.getElementById(
          "global-search"
        ) as HTMLInputElement | null;

        input?.focus();
      }

      if (event.key === "Escape") {
        setShowSearchResults(false);
        setShowMerchantMenu(false);
        setShowHelp(false);
        setShowNotifications(false);

        const input = document.getElementById(
          "global-search"
        ) as HTMLInputElement | null;

        input?.blur();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        merchantMenuRef.current &&
        !merchantMenuRef.current.contains(event.target as Node)
      ) {
        setShowMerchantMenu(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSignOut = () => {
    try {
      localStorage.removeItem("reclaim_user");
    } catch {
      // Ignore storage errors.
    }

    window.location.href = "/login";
  };

  const closePanels = () => {
    setShowHelp(false);
    setShowNotifications(false);
  };

  return (
    <header className={`relative z-50 flex h-20 shrink-0 items-center justify-between border-b border-ui bg-card/95 px-6 backdrop-blur-xl transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent" />

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div className="group">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 group-hover:text-emerald-400/80">
            Revenue recovery
          </p>

          <h1 className="mt-1 text-lg font-semibold tracking-tight text-foreground transition-transform duration-300 group-hover:translate-x-0.5">
            Command Center
          </h1>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative hidden w-full max-w-md px-8 lg:block">
        <div className={`group flex h-10 w-full items-center gap-3 rounded-xl border px-3.5 transition-all duration-300 ${searchQuery ? "border-emerald-400/40 bg-background shadow-[0_0_0_3px_rgba(52,211,153,0.06)]" : "border-ui bg-background hover:-translate-y-0.5 hover:border-emerald-400/30 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]"}`}>
          <Search className={`h-4 w-4 shrink-0 transition-all duration-300 ${searchQuery ? "scale-110 text-emerald-400" : "text-muted-foreground group-hover:text-foreground"}`} />

          <input
            id="global-search"
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onFocus={async () => {
              try {
                setSearchLoading(true);
                setSearchError(false);

                const data = await getRecoveryCases();

                setCases(data);

                if (searchQuery.trim()) {
                  setShowSearchResults(true);
                }
              } catch (error) {
                console.error("Failed to refresh recovery cases:", error);
                setSearchError(true);
              } finally {
                setSearchLoading(false);
              }
            }}
            placeholder="Search transactions, customers, recovery cases..."
            autoComplete="off"
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />

          <div className="flex shrink-0 items-center gap-1 rounded-md border border-ui bg-muted px-1.5 py-1 text-[9px] text-muted-foreground transition-all duration-300 group-focus-within:border-emerald-400/20 group-focus-within:text-emerald-400">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>

        {showSearchResults && (
          <div className="absolute left-8 right-8 top-12 z-[300] overflow-hidden rounded-2xl border border-ui bg-card shadow-2xl animate-[topbarDropdown_250ms_cubic-bezier(0.22,1,0.36,1)_both]">
            {searchLoading && (
              <div className="flex items-center justify-center px-6 py-10">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-emerald-400" />
                  Searching...
                </div>
              </div>
            )}

            {!searchLoading && searchError && (
              <div className="px-6 py-9 text-center">
                <Search className="mx-auto h-7 w-7 text-red-400" />

                <p className="mt-3 text-sm font-medium text-foreground">
                  Unable to search
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Make sure the recovery backend is running.
                </p>
              </div>
            )}

            {!searchLoading && !searchError && searchResults.length === 0 && (
              <div className="px-6 py-9 text-center">
                <Search className="mx-auto h-7 w-7 text-muted-foreground" />

                <p className="mt-3 text-sm font-medium text-foreground">
                  No results found
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Try a customer name, transaction ID, or recovery action.
                </p>
              </div>
            )}

            {!searchLoading && !searchError && searchResults.length > 0 && (
              <div className="max-h-[420px] overflow-y-auto p-2">
                <div className="px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Recovery Cases
                  </p>
                </div>

                {searchResults.map((item, index) => (
                  <Link
                    key={item.id}
                    href="/dashboard"
                    onClick={(event) => {
                      event.preventDefault();

                      window.dispatchEvent(
                        new CustomEvent("reclaim:select-case", {
                          detail: {
                            caseId: item.id,
                          },
                        })
                      );

                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                    style={{
                      animationDelay: `${index * 35}ms`,
                    }}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 opacity-0 animate-[searchResultIn_350ms_cubic-bezier(0.22,1,0.36,1)_forwards] transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400 transition-transform duration-300 group-hover:scale-105">
                      {item.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase()) ? (
                        <CreditCard className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-foreground">
                          {item.customer_name}
                        </p>

                        <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-medium ${item.risk_level?.toLowerCase().includes("critical") || item.risk_level?.toLowerCase().includes("high") ? "bg-red-400/10 text-red-400" : item.risk_level?.toLowerCase().includes("medium") ? "bg-yellow-400/10 text-yellow-500" : "bg-emerald-400/10 text-emerald-400"}`}>
                          {item.risk_level}
                        </span>
                      </div>

                      <div className="mt-1 flex min-w-0 items-center gap-2">
                        <p className="truncate text-[11px] text-muted-foreground">
                          {item.transaction_id}
                        </p>

                        <span className="text-muted-foreground">·</span>

                        <p className="truncate text-[11px] text-muted-foreground">
                          {item.failure_reason}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-xs font-semibold text-foreground">
                        ₹{Number(item.amount).toLocaleString("en-IN")}
                      </p>

                      <p className="mt-1 text-[10px] text-muted-foreground">
                        View case
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="relative flex items-center gap-2">
        {/* AI COPILOT */}
        <button
          type="button"
          onClick={onCopilotToggle}
          aria-expanded={showCopilot}
          className={`group relative hidden items-center gap-2 overflow-hidden rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-300 sm:flex ${showCopilot ? "border-emerald-400/30 bg-emerald-400/[0.12] text-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.08)]" : "border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-400 hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-emerald-400/[0.1]"}`}
        >
          <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[400%]" />

          <Sparkles className={`relative h-3.5 w-3.5 transition-transform duration-500 ${showCopilot ? "rotate-12 scale-110" : "group-hover:rotate-12 group-hover:scale-110"}`} />

          <span className="relative">
            Reclaim Copilot
          </span>

          <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
        </button>

        {/* HELP */}
        <button
          type="button"
          aria-label="Help"
          onClick={() => {
            setShowHelp((value) => !value);
            setShowNotifications(false);
          }}
          className={`flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted hover:text-foreground ${showHelp ? "bg-muted text-foreground" : ""}`}
        >
          <HelpCircle className="h-[17px] w-[17px] transition-transform duration-300 hover:scale-110" />
        </button>

        {/* NOTIFICATIONS */}
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => {
            setShowNotifications((value) => !value);
            setShowHelp(false);
          }}
          className={`relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted hover:text-foreground ${showNotifications ? "bg-muted text-foreground" : ""}`}
        >
          <Bell className="h-[17px] w-[17px] transition-transform duration-300 hover:rotate-6" />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)] animate-pulse" />
        </button>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* THEME */}
        <div className="transition-transform duration-300 hover:scale-105">
          <ThemeToggle />
        </div>

        {/* MERCHANT */}
        <div ref={merchantMenuRef} className="relative">
          <button
            type="button"
            aria-expanded={showMerchantMenu}
            aria-haspopup="menu"
            onClick={() => {
              setShowMerchantMenu((value) => !value);
              closePanels();
            }}
            className={`group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted ${showMerchantMenu ? "bg-muted" : ""}`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-[10px] font-semibold text-emerald-400 ring-1 ring-border transition-all duration-300 group-hover:scale-105 group-hover:ring-emerald-400/20">
              AC
            </div>

            <div className="hidden text-left md:block">
              <p className="text-xs font-medium text-foreground">
                Acme Commerce
              </p>

              <p className="text-[10px] text-muted-foreground">
                Merchant
              </p>
            </div>

            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-all duration-300 group-hover:text-foreground ${showMerchantMenu ? "rotate-180 text-foreground" : ""}`} />
          </button>

          {showMerchantMenu && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+10px)] z-[400] w-72 overflow-hidden rounded-2xl border border-ui bg-card shadow-2xl animate-[topbarDropdown_250ms_cubic-bezier(0.22,1,0.36,1)_both]"
            >
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

              <div className="border-b border-ui px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-sm font-semibold text-emerald-400 transition-transform duration-300 hover:scale-105">
                    AC
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      Acme Commerce
                    </p>

                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Merchant workspace
                    </p>
                  </div>

                  <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)] animate-pulse" />
                </div>
              </div>

              <div className="p-1.5">
                <p className="px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Workspace
                </p>

                <Link
                  href="/settings"
                  role="menuitem"
                  onClick={() => setShowMerchantMenu(false)}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:translate-x-0.5 hover:bg-muted hover:text-foreground"
                >
                  <Settings className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">
                      Workspace settings
                    </p>

                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Manage workspace
                    </p>
                  </div>
                </Link>

                <Link
                  href="/settings/account"
                  role="menuitem"
                  onClick={() => setShowMerchantMenu(false)}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:translate-x-0.5 hover:bg-muted hover:text-foreground"
                >
                  <CreditCard className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">
                      Account settings
                    </p>

                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Billing and account
                    </p>
                  </div>
                </Link>

                <div className="my-1 border-t border-ui" />

                <Link
                  href="/settings/profile"
                  role="menuitem"
                  onClick={() => setShowMerchantMenu(false)}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:translate-x-0.5 hover:bg-muted hover:text-foreground"
                >
                  <User className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">
                      Profile
                    </p>

                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Merchant profile
                    </p>
                  </div>
                </Link>

                <div className="my-1 border-t border-ui" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleSignOut}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-400 transition-all duration-200 hover:translate-x-0.5 hover:bg-red-400/[0.06]"
                >
                  <span className="flex h-4 w-4 items-center justify-center text-xs transition-transform duration-300 group-hover:translate-x-0.5">
                    ↪
                  </span>

                  <div>
                    <p className="text-xs font-medium">
                      Sign out
                    </p>

                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      End this session
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* HELP POPUP */}
        {showHelp && (
          <div className="absolute right-24 top-12 z-[200] w-72 rounded-2xl border border-ui bg-card p-4 shadow-2xl animate-[topbarDropdown_250ms_cubic-bezier(0.22,1,0.36,1)_both]">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                <HelpCircle className="h-4 w-4" />
              </div>

              <h3 className="font-heading text-base font-bold text-foreground">
                Reclaim AI Help
              </h3>
            </div>

            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Use the dashboard to monitor revenue at risk, review recovery
              cases, ask Reclaim Copilot questions, and execute recovery
              actions.
            </p>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {showNotifications && (
          <div className="absolute right-14 top-12 z-[200] w-72 rounded-2xl border border-ui bg-card p-4 shadow-2xl animate-[topbarDropdown_250ms_cubic-bezier(0.22,1,0.36,1)_both]">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                <Bell className="h-4 w-4" />
              </div>

              <h3 className="font-heading text-base font-bold text-foreground">
                Notifications
              </h3>
            </div>

            <div className="mt-4 rounded-xl border border-ui p-3 transition-all duration-300 hover:border-emerald-400/20 hover:bg-emerald-400/[0.02]">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)] animate-pulse" />

                <p className="text-xs font-medium text-foreground">
                  Recovery engine active
                </p>
              </div>

              <p className="mt-1 pl-3.5 text-[11px] leading-4 text-muted-foreground">
                Your recovery cases are being monitored.
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes topbarDropdown {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes searchResultIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}