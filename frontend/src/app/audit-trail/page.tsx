"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Clock3,
  FileClock,
  RefreshCw,
  ShieldCheck,
  User,
} from "lucide-react";

import {
  getRecoveryCases,
  getRecoveryInterventions,
  type RecoveryCase,
  type Intervention,
} from "@/lib/api/recovery";

type AuditEvent = {
  id: string;
  type: "case" | "intervention";
  title: string;
  description: string;
  customer: string;
  transaction: string;
  status: string;
  timestamp: string;
  amount?: number;
};

function formatAmount(amount?: number) {
  if (amount === undefined) return "—";

  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusClass(status: string) {
  const value = status.toLowerCase();

  if (
    value.includes("success") ||
    value.includes("recovered") ||
    value.includes("completed")
  ) {
    return "bg-emerald-400/10 text-emerald-500 border-emerald-400/20";
  }

  if (
    value.includes("pending") ||
    value.includes("processing")
  ) {
    return "bg-amber-400/10 text-amber-500 border-amber-400/20";
  }

  if (
    value.includes("failed") ||
    value.includes("error")
  ) {
    return "bg-red-400/10 text-red-500 border-red-400/20";
  }

  return "bg-muted text-muted-foreground border-ui";
}

export default function AuditTrailPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAuditTrail = async () => {
    try {
      setError("");

      const cases = await getRecoveryCases();

      const auditEvents: AuditEvent[] = [];

      for (const recoveryCase of cases) {
        auditEvents.push({
          id: `case-${recoveryCase.id}`,
          type: "case",
          title: "Recovery case created",
          description:
            recoveryCase.ai_diagnosis ||
            `Recovery case created for ${recoveryCase.failure_reason}.`,
          customer: recoveryCase.customer_name,
          transaction: recoveryCase.transaction_id,
          status: recoveryCase.status || "Active",
          timestamp: recoveryCase.created_at,
          amount: recoveryCase.amount,
        });

        if (
          recoveryCase.action_taken ||
          recoveryCase.recommended_action
        ) {
          auditEvents.push({
            id: `action-${recoveryCase.id}`,
            type: "case",
            title: "Recovery action recorded",
            description:
              recoveryCase.action_taken ||
              `Recommended action: ${
                recoveryCase.recommended_action || "—"
              }`,
            customer: recoveryCase.customer_name,
            transaction: recoveryCase.transaction_id,
            status: recoveryCase.status || "Action Required",
            timestamp:
              recoveryCase.updated_at ||
              recoveryCase.created_at,
            amount: recoveryCase.recovered_amount,
          });
        }

        try {
          const interventions =
            await getRecoveryInterventions(
              recoveryCase.id
            );

          interventions.forEach(
            (intervention: Intervention) => {
              auditEvents.push({
                id: `intervention-${intervention.id}`,
                type: "intervention",
                title:
                  "Recovery intervention executed",
                description:
                  intervention.execution_message ||
                  intervention.reasoning ||
                  intervention.intervention_type,
                customer:
                  recoveryCase.customer_name,
                transaction:
                  recoveryCase.transaction_id,
                status:
                  intervention.status || "Unknown",
                timestamp:
                  intervention.updated_at ||
                  intervention.created_at,
                amount:
                  intervention.recovered_amount,
              });
            }
          );
        } catch {
          // An individual case having no interventions
          // should not break the complete audit trail.
        }
      }

      auditEvents.sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();

        return dateB - dateA;
      });

      setEvents(auditEvents);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load audit trail."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAuditTrail();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAuditTrail();
  };

  const successfulEvents = events.filter((event) => {
    const status = event.status.toLowerCase();

    return (
      status.includes("success") ||
      status.includes("recovered") ||
      status.includes("completed")
    );
  }).length;

  const interventionEvents = events.filter(
    (event) => event.type === "intervention"
  ).length;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-ui bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-500">
              <FileClock className="h-4 w-4" />
              Revenue Intelligence
            </div>

            <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
              Audit Trail
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              A complete history of recovery cases, AI decisions,
              interventions, and recovery outcomes.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-ui
              bg-card
              px-4
              py-2.5
              text-sm
              font-medium
              text-foreground
              transition
              hover:bg-muted
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-ui bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Total Events
              </span>

              <Activity className="h-5 w-5 text-emerald-500" />
            </div>

            <p className="mt-4 text-3xl font-semibold">
              {events.length}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Recorded recovery activity
            </p>
          </div>

          <div className="rounded-2xl border border-ui bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Successful
              </span>

              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>

            <p className="mt-4 text-3xl font-semibold">
              {successfulEvents}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Completed or recovered actions
            </p>
          </div>

          <div className="rounded-2xl border border-ui bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Interventions
              </span>

              <ShieldCheck className="h-5 w-5 text-emerald-500" />
            </div>

            <p className="mt-4 text-3xl font-semibold">
              {interventionEvents}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Recovery interventions recorded
            </p>
          </div>
        </div>

        {/* Error */}
        {error ? (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/5 p-5">
            <p className="text-sm font-medium text-red-500">
              Unable to load audit trail
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {error}
            </p>
          </div>
        ) : null}

        {/* Timeline */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-ui bg-card">
          <div className="border-b border-ui px-6 py-5">
            <h2 className="font-heading text-xl font-semibold">
              Recovery activity
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Every important recovery event is recorded here.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Loading audit trail...
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <FileClock className="h-5 w-5 text-muted-foreground" />
              </div>

              <h3 className="mt-4 text-sm font-semibold">
                No audit events yet
              </h3>

              <p className="mt-1 max-w-md text-xs text-muted-foreground">
                Recovery activity will appear here when cases
                and interventions are created.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-ui">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="relative px-6 py-5 transition-colors hover:bg-muted/30"
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="relative shrink-0">
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-emerald-400/20
                          bg-emerald-400/10
                          text-emerald-500
                        "
                      >
                        {event.type === "intervention" ? (
                          <ShieldCheck className="h-4 w-4" />
                        ) : (
                          <Activity className="h-4 w-4" />
                        )}
                      </div>
                    </div>

                    {/* Event */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">
                            {event.title}
                          </h3>

                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {event.description}
                          </p>
                        </div>

                        <span
                          className={`
                            inline-flex
                            w-fit
                            shrink-0
                            items-center
                            rounded-full
                            border
                            px-2.5
                            py-1
                            text-[10px]
                            font-medium
                            ${getStatusClass(event.status)}
                          `}
                        >
                          {event.status}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />

                          <div>
                            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                              Customer
                            </p>

                            <p className="mt-0.5 font-medium text-foreground">
                              {event.customer}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Transaction
                          </p>

                          <p className="mt-0.5 font-medium text-foreground">
                            {event.transaction}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Amount
                          </p>

                          <p className="mt-0.5 font-medium text-foreground">
                            {formatAmount(event.amount)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />

                          <div>
                            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                              Timestamp
                            </p>

                            <p className="mt-0.5 font-medium text-foreground">
                              {formatDate(event.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}