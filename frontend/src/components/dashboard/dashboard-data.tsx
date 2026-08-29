"use client";

import {
  useEffect,
  useState,
} from "react";

import { MetricCard } from "@/components/dashboard/overview/metric-card";
import { RevenueOverview } from "@/components/dashboard/overview/revenue-overview";
import { AiActivity } from "@/components/dashboard/overview/ai-activity";
import { RiskQueue } from "@/components/dashboard/risk/risk-queue";

import {
  getRecoveryCases,
  getRecoveryInterventions,
  createIntervention,
  simulateFailure,
  type RecoveryCase as ApiRecoveryCase,
  type Intervention as ApiIntervention,
} from "@/lib/api/recovery";

// ============================================================
// HELPERS
// ============================================================

function formatLakh(amount: number) {
  const lakhs = amount / 100000;

  if (lakhs >= 0.1) {
    return `₹${lakhs.toFixed(1)}L`;
  }

  return formatCurrency(amount);
}

function formatCurrency(
  amount: number,
  currency = "INR"
) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
}

function formatText(value?: string | null) {
  if (!value) return "—";

  return value.replaceAll("_", " ");
}

// ============================================================
// CASE DETAILS
// ============================================================

function RecoveryCaseDetails({
  selectedCase,
  cases,
  interventions,
  detailLoading,
  detailError,
  createLoading,
  createError,
  createdInterventionId,
  onBack,
  onPrevious,
  onNext,
  onExecute,
  hasPrevious,
  hasNext,
}: {
  selectedCase: ApiRecoveryCase;
  cases: ApiRecoveryCase[];
  interventions: ApiIntervention[] | null;
  detailLoading: boolean;
  detailError: string | null;
  createLoading: boolean;
  createError: string | null;
  createdInterventionId: string | null;
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onExecute: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}) {
  const currentIndex = cases.findIndex(
    (item) => item.id === selectedCase.id
  );

  return (
    <section className="relative z-10 rounded-2xl border border-ui bg-card p-5 sm:p-6">

      {/* BACK */}

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onBack();
        }}
        className="relative z-50 mb-6 flex w-fit cursor-pointer items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
      >
        ← Back to Risk Queue
      </button>

      {/* HEADER */}

      <div className="flex flex-col gap-5">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
              Recovery case
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-foreground">
              {selectedCase.customer_name}
            </h2>

          </div>

          <div className="rounded-full border border-ui bg-muted px-4 py-2 text-xs capitalize text-muted-foreground">
            {formatText(selectedCase.status)}
          </div>

        </div>

        {/* CUSTOMER NAVIGATION */}

        <div className="flex items-center justify-between border-b border-ui pb-5">

          <button
            type="button"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="cursor-pointer rounded-xl border border-ui bg-muted px-4 py-2.5 text-sm text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
          >
            ← Previous
          </button>

          <span className="text-xs text-muted-foreground">
            Case {currentIndex + 1} of {cases.length}
          </span>

          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            className="cursor-pointer rounded-xl border border-ui bg-muted px-4 py-2.5 text-sm text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next →
          </button>

        </div>

      </div>

      {/* CASE INFORMATION */}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">

        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Customer ID
          </p>

          <p className="mt-1 text-sm text-foreground">
            {selectedCase.customer_id}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Transaction
          </p>

          <p className="mt-1 text-sm text-foreground">
            {selectedCase.transaction_id}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Amount
          </p>

          <p className="mt-1 text-base font-semibold text-foreground">
            {formatCurrency(
              selectedCase.amount,
              selectedCase.currency
            )}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Failure Reason
          </p>

          <p className="mt-1 text-sm capitalize text-foreground">
            {formatText(selectedCase.failure_reason)}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Risk
          </p>

          <p className="mt-1 text-sm capitalize text-foreground">
            {formatText(selectedCase.risk_level)}{" "}
            ({selectedCase.risk_score})
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Recommended Action
          </p>

          <p className="mt-1 text-sm capitalize text-emerald-400">
            {formatText(selectedCase.recommended_action)}
          </p>
        </div>

      </div>

      {/* AI DIAGNOSIS */}

      <div className="mt-7 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.03] p-5">

        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
          AI Diagnosis
        </p>

        <p className="mt-2 text-sm leading-6 text-foreground">
          {selectedCase.ai_diagnosis ??
            "No AI diagnosis available."}
        </p>

      </div>

      {/* DECISION REASONING */}

      <div className="mt-6">

        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Decision Reasoning
        </h3>

        <p className="mt-2 text-sm leading-6 text-foreground">
          {selectedCase.decision_reasoning ??
            "No decision reasoning available."}
        </p>

      </div>

      {/* RISK REASONS */}

      <div className="mt-6">

        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Risk Reasons
        </h3>

        {selectedCase.risk_reasons &&
        selectedCase.risk_reasons.length > 0 ? (

          <ul className="mt-3 space-y-2">

            {selectedCase.risk_reasons.map(
              (reason, index) => (

                <li
                  key={`${reason}-${index}`}
                  className="flex gap-2 text-sm text-foreground"
                >

                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />

                  <span>{reason}</span>

                </li>

              )
            )}

          </ul>

        ) : (

          <p className="mt-3 text-sm text-muted-foreground">
            No risk reasons provided.
          </p>

        )}

      </div>

      {/* RECOVERY INTERVENTION */}

      <div className="mt-7 border-t border-ui pt-6">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Recovery Intervention
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Execute the AI-recommended recovery action.
            </p>

          </div>

          <button
            type="button"
            onClick={onExecute}
            disabled={
              createLoading ||
              !!createdInterventionId ||
              selectedCase.status?.toLowerCase() ===
                "recovered"
            }
            className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-medium text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {createLoading
              ? "Executing…"
              : selectedCase.status?.toLowerCase() ===
                  "recovered"
                ? "Recovery Successful"
                : createdInterventionId
                  ? "Action Executed"
                  : "Execute Recovery Action"}

          </button>

        </div>

        {createError ? (

          <div className="mt-4 rounded-xl border border-red-400/10 bg-red-400/[0.04] p-4 text-sm text-red-400">
            {createError}
          </div>

        ) : null}

        {createdInterventionId ? (

          <div className="mt-4 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4 text-sm text-emerald-300">

            Recovery intervention created successfully.

            <div className="mt-1 text-xs text-emerald-400/70">
              ID: {createdInterventionId}
            </div>

          </div>

        ) : null}

        {detailLoading ? (

          <div className="mt-5 text-sm text-muted-foreground">
            Loading intervention history…
          </div>

        ) : null}

        {detailError ? (

          <div className="mt-5 text-sm text-red-400">
            {detailError}
          </div>

        ) : null}

        {/* INTERVENTION HISTORY */}

        {interventions &&
        interventions.length > 0 ? (

          <div className="mt-5">

            <p className="mb-3 text-xs font-medium text-muted-foreground">
              Intervention history
            </p>

            <ul className="space-y-3">

              {interventions.map(
                (intervention) => (

                  <li
                    key={intervention.id}
                    className="rounded-xl border border-ui bg-muted p-4"
                  >

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="text-xs font-medium capitalize text-foreground">
                        {formatText(
                          intervention.intervention_type
                        )}
                      </span>

                      <span className="text-muted-foreground">
                        ·
                      </span>

                      <span className="text-xs capitalize text-muted-foreground">
                        {formatText(
                          intervention.priority
                        )}
                      </span>

                      <span
                        className={`ml-auto rounded-full border px-2.5 py-1 text-[9px] capitalize ${
                          intervention.status ===
                          "success"
                            ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-400"
                            : intervention.status ===
                              "failed"
                              ? "border-red-400/20 bg-red-400/[0.06] text-red-400"
                              : "border-ui text-muted-foreground"
                        }`}
                      >
                        {formatText(
                          intervention.status
                        )}
                      </span>

                    </div>

                    <p className="mt-3 text-sm leading-6 text-foreground">
                      {intervention.reasoning}
                    </p>

                    {intervention.execution_message ? (

                      <p className="mt-3 text-xs leading-5 text-emerald-400/80">
                        {intervention.execution_message}
                      </p>

                    ) : null}

                    <div className="mt-3 text-[11px] text-muted-foreground">
                      Recovered:{" "}
                      {formatCurrency(
                        intervention.recovered_amount,
                        selectedCase.currency
                      )}
                    </div>

                  </li>

                )
              )}

            </ul>

          </div>

        ) : !detailLoading ? (

          <p className="mt-5 text-sm text-muted-foreground">
            No interventions yet.
          </p>

        ) : null}

      </div>

      {/* BOTTOM NAVIGATION */}

      <div className="mt-7 flex items-center justify-between border-t border-ui pt-5">

        <button
          type="button"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="cursor-pointer rounded-xl border border-ui bg-muted px-4 py-2.5 text-sm text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Previous Customer
        </button>

        <span className="text-xs text-muted-foreground">
          Case {currentIndex + 1} of {cases.length}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className="cursor-pointer rounded-xl border border-ui bg-muted px-4 py-2.5 text-sm text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next Customer →
        </button>

      </div>

    </section>
  );
}

// ============================================================
// MAIN DASHBOARD
// ============================================================

export function DashboardData() {

  const [cases, setCases] =
    useState<ApiRecoveryCase[] | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [selectedCase, setSelectedCase] =
    useState<ApiRecoveryCase | null>(null);

  const [interventions, setInterventions] =
    useState<ApiIntervention[] | null>(null);

  const [detailError, setDetailError] =
    useState<string | null>(null);

  const [detailLoading, setDetailLoading] =
    useState(false);

  const [createLoading, setCreateLoading] =
    useState(false);

  const [createError, setCreateError] =
    useState<string | null>(null);

  const [createdInterventionId, setCreatedInterventionId] =
    useState<string | null>(null);

  const [simulateLoading, setSimulateLoading] =
    useState(false);

  const [simulateError, setSimulateError] =
    useState<string | null>(null);

  const [simulateSuccess, setSimulateSuccess] =
    useState<string | null>(null);

  // ==========================================================
  // LOAD CASES
  // ==========================================================

  const refreshCases = async () => {

    const data =
      await getRecoveryCases();

    setCases(data);

    return data;
  };

  useEffect(() => {

    let mounted = true;

    refreshCases()
      .catch((err: unknown) => {

        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : String(err)
        );

        setCases([]);

      })
      .finally(() => {

        if (mounted) {
          setLoading(false);
        }

      });

    return () => {
      mounted = false;
    };

  }, []);

  // ==========================================================
  // SIMULATE FAILURE
  // ==========================================================

  const onSimulateFailure = async () => {

    if (simulateLoading) {
      return;
    }

    setSimulateLoading(true);
    setSimulateError(null);
    setSimulateSuccess(null);

    try {

      const newCase =
        await simulateFailure(1500);

      const refreshedCases =
        await getRecoveryCases();

      setCases(refreshedCases);

      setSelectedCase(newCase);

      setInterventions([]);

      setDetailError(null);

      setCreateError(null);

      setCreatedInterventionId(null);

      setSimulateSuccess(
        `Payment failure simulated successfully for ${newCase.customer_name}.`
      );

      try {

        const interventionList =
          await getRecoveryInterventions(
            newCase.id
          );

        setInterventions(
          interventionList
        );

      } catch {

        setInterventions([]);

      }

    } catch (err: unknown) {

      setSimulateError(
        err instanceof Error
          ? err.message
          : String(err)
      );

    } finally {

      setSimulateLoading(false);

    }

  };

  // ==========================================================
  // SELECT CASE
  // ==========================================================

  const onSelectCase = async (
    caseId: string
  ) => {

    if (!caseId) {
      return;
    }

    const localCase =
      cases?.find(
        (item) =>
          item.id === caseId
      );

    if (!localCase) {

      setDetailError(
        "Recovery case could not be found."
      );

      return;
    }

    setSelectedCase(localCase);

    setInterventions(null);

    setDetailError(null);

    setCreateError(null);

    setCreatedInterventionId(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setDetailLoading(true);

    try {

      const interventionList =
        await getRecoveryInterventions(
          caseId
        );

      setInterventions(
        interventionList
      );

      const latestIntervention =
        interventionList.length > 0
          ? interventionList[
              interventionList.length - 1
            ]
          : null;

      if (latestIntervention) {

        setCreatedInterventionId(
          latestIntervention.id
        );

      }

    } catch (err: unknown) {

      setDetailError(
        err instanceof Error
          ? err.message
          : String(err)
      );

    } finally {

      setDetailLoading(false);

    }

  };

  // ==========================================================
  // GLOBAL SEARCH → SELECT CASE
  // ==========================================================

  useEffect(() => {
  const handleSearchCase = (event: Event) => {
    const customEvent =
      event as CustomEvent<{ caseId?: string }>;

    const caseId = customEvent.detail?.caseId;

    if (!caseId) {
      return;
    }

    onSelectCase(caseId);
  };

  window.addEventListener(
    "reclaim:select-case",
    handleSearchCase
  );

  return () => {
    window.removeEventListener(
      "reclaim:select-case",
      handleSearchCase
    );
  };
}, [cases, onSelectCase]);
  // ==========================================================
  // CASE NAVIGATION
  // ==========================================================

  const currentCaseIndex =
    selectedCase
      ? (cases ?? []).findIndex(
          (item) =>
            item.id ===
            selectedCase.id
        )
      : -1;

  const previousCase =
    currentCaseIndex > 0
      ? cases?.[
          currentCaseIndex - 1
        ]
      : null;

  const nextCase =
    currentCaseIndex >= 0 &&
    currentCaseIndex <
      (cases?.length ?? 0) - 1
      ? cases?.[
          currentCaseIndex + 1
        ]
      : null;

  const goToPreviousCase = () => {

    if (previousCase) {

      onSelectCase(
        previousCase.id
      );

    }

  };

  const goToNextCase = () => {

    if (nextCase) {

      onSelectCase(
        nextCase.id
      );

    }

  };

  // ==========================================================
  // BACK TO QUEUE
  // ==========================================================

  const goBackToQueue = () => {

    setSelectedCase(null);

    setInterventions(null);

    setDetailError(null);

    setCreateError(null);

    setCreatedInterventionId(null);

    setSimulateSuccess(null);

    setSimulateError(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };

  // ==========================================================
  // EXECUTE RECOVERY
  // ==========================================================

  const onExecuteAction = async () => {

    if (
      !selectedCase ||
      createLoading
    ) {
      return;
    }

    setCreateError(null);

    setCreateLoading(true);

    try {

      const created =
        await createIntervention(
          selectedCase.id
        );

      const refreshedCases =
        await getRecoveryCases();

      setCases(
        refreshedCases
      );

      const updatedCase =
        refreshedCases.find(
          (item) =>
            item.id ===
            selectedCase.id
        );

      if (updatedCase) {

        setSelectedCase(
          updatedCase
        );

      }

      const refreshedInterventions =
        await getRecoveryInterventions(
          selectedCase.id
        );

      setInterventions(
        refreshedInterventions
      );

      setCreatedInterventionId(
        created.id
      );

    } catch (err: unknown) {

      setCreateError(
        err instanceof Error
          ? err.message
          : String(err)
      );

    } finally {

      setCreateLoading(false);

    }

  };

  // ==========================================================
  // METRICS
  // ==========================================================

  const activeCaseList =
    (cases ?? []).filter(
      (c) =>
        (c.status ?? "")
          .toLowerCase() !==
        "recovered"
    );

  const revenueAtRisk =
    activeCaseList.reduce(
      (sum, c) =>
        sum + (c.amount || 0),
      0
    );

  const totalTransactionValue =
    (cases ?? []).reduce(
      (sum, c) =>
        sum + (c.amount || 0),
      0
    );

  const recovered =
    (cases ?? []).reduce(
      (sum, c) =>
        sum +
        (c.recovered_amount || 0),
      0
    );

  const activeCases =
    activeCaseList.length;

  // ==========================================================
  // TOP RISK
  // ==========================================================

  const severityRank: Record<
    string,
    number
  > = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const topRisk =
    (cases ?? []).reduce(
      (best, c) => {

        const level =
          (
            c.risk_level ||
            "low"
          ).toLowerCase();

        return severityRank[level] >
          severityRank[best]
          ? level
          : best;

      },
      "low"
    );

  // ==========================================================
  // RECOVERY RATE
  // ==========================================================

  const recoveryRate =
    totalTransactionValue > 0
      ? (
          recovered /
          totalTransactionValue
        ) * 100
      : 0;

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <div className="rounded-2xl border border-ui bg-card p-5 text-sm text-muted-foreground">
        Loading dashboard…
      </div>
    );

  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {

    return (
      <div className="rounded-2xl border border-ui bg-card p-5 text-sm text-red-400">
        Unable to load dashboard:{" "}
        {error}
      </div>
    );

  }

  // ==========================================================
  // SELECTED CASE
  // ==========================================================

  if (selectedCase) {

    return (
      <div className="relative z-10">

        <RecoveryCaseDetails
          selectedCase={selectedCase}
          cases={cases ?? []}
          interventions={interventions}
          detailLoading={detailLoading}
          detailError={detailError}
          createLoading={createLoading}
          createError={createError}
          createdInterventionId={
            createdInterventionId
          }
          onBack={goBackToQueue}
          onPrevious={goToPreviousCase}
          onNext={goToNextCase}
          onExecute={onExecuteAction}
          hasPrevious={!!previousCase}
          hasNext={!!nextCase}
        />

      </div>
    );

  }

  // ==========================================================
  // NORMAL DASHBOARD
  // ==========================================================

  return (
    <div>

      {/* SIMULATE PAYMENT FAILURE */}

      <section className="mb-4 rounded-2xl border border-emerald-400/10 bg-card p-5">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
              Buildathon demo
            </p>

            <h3 className="mt-1 text-lg font-semibold text-foreground">
              Simulate payment failure
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Create a synthetic payment failure
              and send it through the Reclaim AI
              recovery pipeline.
            </p>

          </div>

          <button
            type="button"
            onClick={onSimulateFailure}
            disabled={simulateLoading}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-medium text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {simulateLoading
              ? "Simulating…"
              : "Simulate Failure"}
          </button>

        </div>

        {simulateSuccess ? (

          <div className="mt-4 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-3 text-sm text-emerald-400">
            {simulateSuccess}
          </div>

        ) : null}

        {simulateError ? (

          <div className="mt-4 rounded-xl border border-red-400/10 bg-red-400/[0.04] p-3 text-sm text-red-400">
            {simulateError}
          </div>

        ) : null}

      </section>

      {/* CLICKABLE METRICS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* REVENUE AT RISK */}

        <div
          role="button"
          tabIndex={0}
          onClick={() => {

            document
              .getElementById("risk-queue")
              ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });

          }}
          onKeyDown={(event) => {

            if (
              event.key === "Enter" ||
              event.key === " "
            ) {

              event.preventDefault();

              document
                .getElementById("risk-queue")
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });

            }

          }}
          className="cursor-pointer rounded-2xl transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        >

          <MetricCard
            label="Revenue at Risk"
            value={formatLakh(revenueAtRisk)}
            change=""
            description="current active cases"
            tone="danger"
            icon="risk"
          />

        </div>

        {/* RECOVERED REVENUE */}

        <div
          role="button"
          tabIndex={0}
          onClick={() => {

            document
              .getElementById(
                "recovery-performance"
              )
              ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });

          }}
          onKeyDown={(event) => {

            if (
              event.key === "Enter" ||
              event.key === " "
            ) {

              event.preventDefault();

              document
                .getElementById(
                  "recovery-performance"
                )
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });

            }

          }}
          className="cursor-pointer rounded-2xl transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        >

          <MetricCard
            label="Recovered Revenue"
            value={formatLakh(recovered)}
            change=""
            description="so far"
            tone="success"
            icon="recovered"
          />

        </div>

        {/* RECOVERY RATE */}

        <div
          role="button"
          tabIndex={0}
          onClick={() => {

            document
              .getElementById(
                "recovery-performance"
              )
              ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });

          }}
          onKeyDown={(event) => {

            if (
              event.key === "Enter" ||
              event.key === " "
            ) {

              event.preventDefault();

              document
                .getElementById(
                  "recovery-performance"
                )
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });

            }

          }}
          className="cursor-pointer rounded-2xl transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        >

          <MetricCard
            label="Recovery Rate"
            value={`${recoveryRate.toFixed(1)}%`}
            change=""
            description="overall"
            tone="success"
            icon="revenue"
          />

        </div>

        {/* ACTIVE CASES */}

        <div
          role="button"
          tabIndex={0}
          onClick={() => {

            document
              .getElementById("risk-queue")
              ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });

          }}
          onKeyDown={(event) => {

            if (
              event.key === "Enter" ||
              event.key === " "
            ) {

              event.preventDefault();

              document
                .getElementById("risk-queue")
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });

            }

          }}
          className="cursor-pointer rounded-2xl transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        >

          <MetricCard
            label="Active Cases"
            value={`${activeCases}`}
            change=""
            description="requiring attention"
            tone="warning"
            icon="cases"
          />

        </div>

      </div>

      {/* TOP RISK */}

      <div className="mt-3 text-sm text-muted-foreground">

        Top risk:{" "}

        <span className="text-foreground">
          {topRisk}
        </span>

      </div>

      {/* ANALYTICS */}

      <section
        id="recovery-performance"
        className="mt-4 scroll-mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]"
      >

        <RevenueOverview />

        <AiActivity
          cases={cases ?? []}
        />

      </section>

      {/* RISK QUEUE */}

      <section
        id="risk-queue"
        className="mt-4 scroll-mt-6"
      >

        <RiskQueue
          initialCases={
            activeCaseList.map(
              (recoveryCase) => {

                const riskLevel =
                  (
                    recoveryCase.risk_level ||
                    "low"
                  ).toLowerCase();

                return {

                  id:
                    recoveryCase.id,

                  customer:
                    recoveryCase.customer_name,

                  initials:
                    recoveryCase.customer_name
                      .split(" ")
                      .map(
                        (part) =>
                          part[0] ?? ""
                      )
                      .slice(0, 2)
                      .join("")
                      .toUpperCase(),

                  issue:
                    (
                      recoveryCase.failure_reason ||
                      "payment_failed"
                    ).replaceAll(
                      "_",
                      " "
                    ),

                  amount:
                    formatCurrency(
                      recoveryCase.amount,
                      recoveryCase.currency
                    ),

                  risk:
                    riskLevel === "high" ||
                    riskLevel === "critical"
                      ? "High"
                      : riskLevel === "medium"
                        ? "Medium"
                        : "Low",

                  action:
                    recoveryCase.recommended_action
                      ? recoveryCase.recommended_action.replaceAll(
                          "_",
                          " "
                        )
                      : "—",

                  icon: "payment",

                };

              }
            )
          }

          onSelectCase={onSelectCase}
        />

      </section>

    </div>
  );
}

export default DashboardData;