export interface RecoveryCase {
  id: string;
  customer_id: string;
  customer_name: string;
  transaction_id: string;
  amount: number;
  currency: string;
  failure_reason: string;
  previous_failures: number;
  customer_recovery_rate: number;
  risk_score: number;
  risk_level: string;
  risk_reasons: string[];
  status: string;
  ai_diagnosis?: string;
  recommended_action?: string;
  decision_priority?: string;
  decision_reasoning?: string;
  action_taken?: string;
  recovered_amount: number;
  created_at: string;
  updated_at: string;
}

const BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

// ============================================================
// GET ALL RECOVERY CASES
// ============================================================

export async function getRecoveryCases(): Promise<
  RecoveryCase[]
> {
  const res = await fetch(
    `${BASE}/api/recovery/cases`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      `API error: ${res.status}`
    );
  }

  return (await res.json()) as RecoveryCase[];
}

// ============================================================
// GET ONE RECOVERY CASE
// ============================================================

export async function getRecoveryCase(
  caseId: string
): Promise<RecoveryCase> {
  const res = await fetch(
    `${BASE}/api/recovery/cases/${encodeURIComponent(
      caseId
    )}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      `API error: ${res.status}`
    );
  }

  return (await res.json()) as RecoveryCase;
}

// ============================================================
// INTERVENTION
// ============================================================

export interface Intervention {
  id: string;
  recovery_case_id: string;
  intervention_type: string;
  status: string;
  priority: string;
  reasoning: string;
  execution_message?: string | null;
  recovered_amount: number;
  created_at: string;
  updated_at: string;
}

// ============================================================
// GET INTERVENTIONS
// ============================================================

export async function getRecoveryInterventions(
  caseId: string
): Promise<Intervention[]> {
  const res = await fetch(
    `${BASE}/api/recovery/cases/${encodeURIComponent(
      caseId
    )}/interventions`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      `API error: ${res.status}`
    );
  }

  return (await res.json()) as Intervention[];
}

// ============================================================
// CREATE / EXECUTE INTERVENTION
// ============================================================

export async function createIntervention(
  caseId: string
): Promise<Intervention> {
  const res = await fetch(
    `${BASE}/api/recovery/cases/${encodeURIComponent(
      caseId
    )}/interventions`,
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    let message = `API error: ${res.status}`;

    try {
      const data = await res.json();

      if (data?.detail) {
        message = data.detail;
      }
    } catch {
      // Ignore JSON parsing failure.
    }

    throw new Error(message);
  }

  return (await res.json()) as Intervention;
}

// ============================================================
// CREATE RECOVERY CASE
// ============================================================

export interface CreateRecoveryCasePayload {
  customer_id: string;
  customer_name: string;
  transaction_id: string;
  amount: number;
  currency?: string;
  failure_reason: string;
  previous_failures?: number;
  customer_recovery_rate?: number;
}

export async function createRecoveryCase(
  payload: CreateRecoveryCasePayload
): Promise<RecoveryCase> {
  const res = await fetch(
    `${BASE}/api/recovery/cases`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: payload.customer_id,
        customer_name: payload.customer_name,
        transaction_id: payload.transaction_id,
        amount: payload.amount,
        currency: payload.currency ?? "INR",
        failure_reason: payload.failure_reason,
        previous_failures:
          payload.previous_failures ?? 0,
        customer_recovery_rate:
          payload.customer_recovery_rate ?? 0.75,
      }),
    }
  );

  if (!res.ok) {
    let message = `API error: ${res.status}`;

    try {
      const data = await res.json();

      if (data?.detail) {
        message = data.detail;
      }
    } catch {
      // Ignore JSON parsing failure.
    }

    throw new Error(message);
  }

  return (await res.json()) as RecoveryCase;
}

// ============================================================
// SIMULATE PAYMENT FAILURE
// ============================================================

export async function simulateFailure(
  amount = 1500
): Promise<RecoveryCase> {
  const timestamp = Date.now();

  return createRecoveryCase({
    customer_id: `DEMO_${timestamp}`,
    customer_name: "Demo User",
    transaction_id: `DEMO_TXN_${timestamp}`,
    amount,
    currency: "INR",
    failure_reason: "insufficient_funds",
    previous_failures: 1,
    customer_recovery_rate: 0.75,
  });
}

// ============================================================
// ALIAS
// ============================================================

export const simulatePaymentFailure =
  simulateFailure;