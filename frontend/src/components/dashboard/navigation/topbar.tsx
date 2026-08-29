"use client";

import {
  Bell,
  ChevronDown,
  Command,
  CreditCard,
  HelpCircle,
  Search,
  Sparkles,
  User,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [showNotifications, setShowNotifications] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [cases, setCases] =
    useState<RecoveryCase[]>([]);

  const [searchResults, setSearchResults] =
    useState<RecoveryCase[]>([]);

  const [searchLoading, setSearchLoading] =
    useState(false);

  const [searchError, setSearchError] =
    useState(false);

  const [showSearchResults, setShowSearchResults] =
    useState(false);

  // ============================================================
  // LOAD SEARCH DATA FROM EXISTING API
  // ============================================================

  useEffect(() => {
    let mounted = true;

    async function loadCases() {
      try {
        setSearchLoading(true);
        setSearchError(false);

        const data = await getRecoveryCases();

        if (mounted) {
          setCases(data);
        }
      } catch (error) {
        console.error(
          "Failed to load recovery cases:",
          error
        );

        if (mounted) {
          setSearchError(true);
        }
      } finally {
        if (mounted) {
          setSearchLoading(false);
        }
      }
    }

    loadCases();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================================
  // SEARCH RECOVERY CASES
  // ============================================================

  useEffect(() => {
    const query =
      searchQuery.trim().toLowerCase();

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

    setSearchResults(
      results.slice(0, 8)
    );

    setShowSearchResults(true);
  }, [searchQuery, cases]);

  // ============================================================
  // CTRL + K / CMD + K
  // ============================================================

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        const input =
          document.getElementById(
            "global-search"
          ) as HTMLInputElement | null;

        input?.focus();
      }

      if (event.key === "Escape") {
        setShowSearchResults(false);

        const input =
          document.getElementById(
            "global-search"
          ) as HTMLInputElement | null;

        input?.blur();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  return (
    <header className="relative z-50 flex h-20 shrink-0 items-center justify-between border-b border-ui bg-card px-6 backdrop-blur-xl">

      {/* ======================================================
          LEFT
      ====================================================== */}

      <div className="flex items-center gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Revenue recovery
          </p>

          <h1 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
            Command Center
          </h1>
        </div>
      </div>

      {/* ======================================================
          SEARCH
      ====================================================== */}

      <div className="relative hidden w-full max-w-md px-8 lg:block">

        <div
          className={`group flex h-10 w-full items-center gap-3 rounded-xl border px-3.5 transition-all ${
            searchQuery
              ? "border-emerald-400/40 bg-background shadow-[0_0_0_3px_rgba(52,211,153,0.06)]"
              : "border-ui bg-background hover:border-emerald-400/30"
          }`}
        >

          <Search
            className={`h-4 w-4 shrink-0 ${
              searchQuery
                ? "text-emerald-400"
                : "text-muted-foreground"
            }`}
          />

          <input
            id="global-search"
            type="text"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value
              )
            }
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
    console.error(
      "Failed to refresh recovery cases:",
      error
    );
    setSearchError(true);
  } finally {
    setSearchLoading(false);
  }
}}
            placeholder="Search transactions, customers, recovery cases..."
            autoComplete="off"
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />

          <div className="flex shrink-0 items-center gap-1 rounded-md border border-ui bg-muted px-1.5 py-1 text-[9px] text-muted-foreground">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>

        </div>

        {/* ====================================================
            SEARCH DROPDOWN
        ==================================================== */}

        {showSearchResults && (
          <div className="absolute left-8 right-8 top-12 z-[300] overflow-hidden rounded-2xl border border-ui bg-card shadow-2xl">

            {/* Loading */}

            {searchLoading && (
              <div className="flex items-center justify-center px-6 py-10">

                <div className="flex items-center gap-3 text-sm text-muted-foreground">

                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-emerald-400" />

                  Searching...

                </div>

              </div>
            )}

            {/* Error */}

            {!searchLoading &&
              searchError && (
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

            {/* No results */}

            {!searchLoading &&
              !searchError &&
              searchResults.length === 0 && (
                <div className="px-6 py-9 text-center">

                  <Search className="mx-auto h-7 w-7 text-muted-foreground" />

                  <p className="mt-3 text-sm font-medium text-foreground">
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Try a customer name, transaction ID,
                    or recovery action.
                  </p>

                </div>
              )}

            {/* Results */}

            {!searchLoading &&
              !searchError &&
              searchResults.length > 0 && (
                <div className="max-h-[420px] overflow-y-auto p-2">

                  <div className="px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Recovery Cases
                    </p>
                  </div>

                  {searchResults.map(
                    (item) => (
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
  className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted"
>

                        {/* Icon */}

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">

                          {item.transaction_id
                            ?.toLowerCase()
                            .includes(
                              searchQuery.toLowerCase()
                            ) ? (
                            <CreditCard className="h-4 w-4" />
                          ) : (
                            <User className="h-4 w-4" />
                          )}

                        </div>

                        {/* Details */}

                        <div className="min-w-0 flex-1">

                          <div className="flex items-center gap-2">

                            <p className="truncate text-sm font-medium text-foreground">
                              {item.customer_name}
                            </p>

                            <span
                              className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-medium ${
                                item.risk_level
                                  ?.toLowerCase()
                                  .includes("critical") ||
                                item.risk_level
                                  ?.toLowerCase()
                                  .includes("high")
                                  ? "bg-red-400/10 text-red-400"
                                  : item.risk_level
                                      ?.toLowerCase()
                                      .includes("medium")
                                    ? "bg-yellow-400/10 text-yellow-500"
                                    : "bg-emerald-400/10 text-emerald-400"
                              }`}
                            >
                              {item.risk_level}
                            </span>

                          </div>

                          <div className="mt-1 flex min-w-0 items-center gap-2">

                            <p className="truncate text-[11px] text-muted-foreground">
                              {item.transaction_id}
                            </p>

                            <span className="text-muted-foreground">
                              ·
                            </span>

                            <p className="truncate text-[11px] text-muted-foreground">
                              {item.failure_reason}
                            </p>

                          </div>

                        </div>

                        {/* Amount */}

                        <div className="shrink-0 text-right">

                          <p className="text-xs font-semibold text-foreground">
                            ₹
                            {Number(
                              item.amount
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>

                          <p className="mt-1 text-[10px] text-muted-foreground">
                            View case
                          </p>

                        </div>

                      </Link>
                    )
                  )}

                </div>
              )}

          </div>
        )}

      </div>

      {/* ======================================================
          RIGHT SIDE
      ====================================================== */}

      <div className="relative flex items-center gap-2">

        {/* AI COPILOT */}

        <button
          type="button"
          onClick={onCopilotToggle}
          aria-expanded={showCopilot}
          className="hidden items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06] px-3 py-2 text-xs font-medium text-emerald-400 transition-all hover:border-emerald-400/20 hover:bg-emerald-400/[0.1] sm:flex"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Reclaim Copilot
        </button>

        {/* HELP */}

        <button
          type="button"
          aria-label="Help"
          onClick={() =>
            setShowHelp(
              (value) => !value
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <HelpCircle className="h-[17px] w-[17px]" />
        </button>

        {/* NOTIFICATIONS */}

        <button
          type="button"
          aria-label="Notifications"
          onClick={() =>
            setShowNotifications(
              (value) => !value
            )
          }
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-[17px] w-[17px]" />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
        </button>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* THEME */}

        <ThemeToggle />

        {/* MERCHANT */}

        <button
          type="button"
          className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-muted"
        >

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-[10px] font-semibold text-emerald-400 ring-1 ring-border">
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

          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />

        </button>

        {/* ====================================================
            HELP POPUP
        ==================================================== */}

        {showHelp && (
          <div className="absolute right-24 top-12 z-[200] w-72 rounded-2xl border border-ui bg-card p-4 shadow-2xl">

            <h3 className="font-heading text-base font-bold text-foreground">
              Reclaim AI Help
            </h3>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Use the dashboard to monitor revenue at risk,
              review recovery cases, ask Reclaim Copilot
              questions, and execute recovery actions.
            </p>

          </div>
        )}

        {/* ====================================================
            NOTIFICATION POPUP
        ==================================================== */}

        {showNotifications && (
          <div className="absolute right-14 top-12 z-[200] w-72 rounded-2xl border border-ui bg-card p-4 shadow-2xl">

            <h3 className="font-heading text-base font-bold text-foreground">
              Notifications
            </h3>

            <div className="mt-3 rounded-xl border border-ui p-3">

              <p className="text-xs font-medium text-foreground">
                Recovery engine active
              </p>

              <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                Your recovery cases are being monitored.
              </p>

            </div>

          </div>
        )}

      </div>

    </header>
  );
}