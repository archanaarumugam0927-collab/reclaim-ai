import json
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4
from typing import List

from fastapi import APIRouter, HTTPException

from agent.recovery.decision import decide_recovery_action

from backend.models.intervention import (
    Intervention,
    InterventionStatus,
    InterventionType,
)

from backend.models.recovery import (
    RecoveryCase,
    RecoveryCaseCreate,
    RecoveryStatus,
    RiskLevel,
    PaymentFailureReason,
)

from ml.risk.engine import calculate_risk


router = APIRouter(
    prefix="/api/recovery",
    tags=["Recovery"],
)


# ============================================================
# IN-MEMORY STORES
# ============================================================

recovery_cases: dict[str, RecoveryCase] = {}
interventions: dict[str, Intervention] = {}


# ============================================================
# BUILD RECOVERY CASE
# ============================================================

def build_recovery_case(
    customer_id: str,
    customer_name: str,
    transaction_id: str,
    amount: float,
    currency: str,
    failure_reason: PaymentFailureReason,
    previous_failures: int,
    customer_recovery_rate: float,
    case_id: str | None = None,
) -> RecoveryCase:
    """
    Run a payment failure through Reclaim's
    risk engine and recovery decision engine.
    """

    risk = calculate_risk(
        amount=amount,
        failure_reason=failure_reason.value,
        previous_failures=previous_failures,
        customer_recovery_rate=customer_recovery_rate,
    )

    decision = decide_recovery_action(
        risk_level=risk.level,
        failure_reason=failure_reason.value,
        amount=amount,
        previous_failures=previous_failures,
        customer_recovery_rate=customer_recovery_rate,
    )

    now = datetime.now(
        timezone.utc
    ).isoformat()

    return RecoveryCase(
        id=case_id or f"REC_{uuid4().hex[:8].upper()}",

        customer_id=customer_id,

        customer_name=customer_name,

        transaction_id=transaction_id,

        amount=amount,

        currency=currency,

        failure_reason=failure_reason,

        previous_failures=previous_failures,

        customer_recovery_rate=customer_recovery_rate,

        risk_score=risk.score,

        risk_level=RiskLevel(
            risk.level
        ),

        risk_reasons=risk.reasons,

        status=RecoveryStatus.ACTION_REQUIRED,

        ai_diagnosis=(
            f"Reclaim identified "
            f"{risk.level} revenue risk "
            f"with a {risk.score:.2f} risk score."
        ),

        recommended_action=decision.action,

        decision_priority=decision.priority,

        decision_reasoning=decision.reasoning,

        action_taken=None,

        recovered_amount=0,

        created_at=now,

        updated_at=now,
    )


# ============================================================
# LOAD SYNTHETIC DATA
# ============================================================

def load_synthetic_cases() -> None:
    """
    Load synthetic payment failures and process them
    through Reclaim's risk and decision engines.

    No real payment data is used.
    """

    data_path = (
        Path(__file__).resolve().parents[1]
        / "data"
        / "synthetic_transactions.json"
    )

    if not data_path.exists():
        raise FileNotFoundError(
            f"Synthetic dataset not found at: {data_path}"
        )

    with data_path.open(
        "r",
        encoding="utf-8",
    ) as file:

        transactions = json.load(file)

    for transaction in transactions:

        case_id = (
            f"REC_SYN_{transaction['transaction_id']}"
        )

        recovery_case = build_recovery_case(
            customer_id=transaction[
                "customer_id"
            ],

            customer_name=transaction[
                "customer_name"
            ],

            transaction_id=transaction[
                "transaction_id"
            ],

            amount=float(
                transaction["amount"]
            ),

            currency=transaction[
                "currency"
            ],

            failure_reason=PaymentFailureReason(
                transaction[
                    "failure_reason"
                ]
            ),

            previous_failures=int(
                transaction[
                    "previous_failures"
                ]
            ),

            customer_recovery_rate=float(
                transaction[
                    "customer_recovery_rate"
                ]
            ),

            case_id=case_id,
        )

        recovery_cases[
            recovery_case.id
        ] = recovery_case


# ============================================================
# LOAD DATA WHEN API STARTS
# ============================================================

load_synthetic_cases()


# ============================================================
# GET ALL CASES
# ============================================================

@router.get(
    "/cases",
    response_model=List[RecoveryCase],
)
def list_recovery_cases():
    """
    Return all recovery cases.
    """

    return list(
        recovery_cases.values()
    )


# ============================================================
# GET ONE CASE
# ============================================================

@router.get(
    "/cases/{case_id}",
    response_model=RecoveryCase,
)
def get_recovery_case(
    case_id: str,
):
    """
    Return a single recovery case.
    """

    recovery_case = recovery_cases.get(
        case_id
    )

    if recovery_case is None:
        raise HTTPException(
            status_code=404,
            detail="Recovery case not found",
        )

    return recovery_case


# ============================================================
# GET INTERVENTIONS
# ============================================================

@router.get(
    "/cases/{case_id}/interventions",
    response_model=List[Intervention],
)
def get_recovery_interventions(
    case_id: str,
):
    """
    Return all interventions for a recovery case.
    """

    recovery_case = recovery_cases.get(
        case_id
    )

    if recovery_case is None:
        raise HTTPException(
            status_code=404,
            detail="Recovery case not found",
        )

    return [
        intervention
        for intervention in interventions.values()
        if intervention.recovery_case_id == case_id
    ]


# ============================================================
# CREATE NEW RECOVERY CASE
# ============================================================

@router.post(
    "/cases",
    response_model=RecoveryCase,
)
def create_recovery_case(
    case: RecoveryCaseCreate,
):
    """
    Create a new recovery case from
    a synthetic payment failure.
    """

    recovery_case = build_recovery_case(
        customer_id=case.customer_id,

        customer_name=case.customer_name,

        transaction_id=case.transaction_id,

        amount=case.amount,

        currency=case.currency,

        failure_reason=case.failure_reason,

        previous_failures=case.previous_failures,

        customer_recovery_rate=(
            case.customer_recovery_rate
        ),
    )

    recovery_cases[
        recovery_case.id
    ] = recovery_case

    return recovery_case


# ============================================================
# EXECUTE RECOVERY ACTION
# ============================================================

@router.post(
    "/cases/{case_id}/interventions",
    response_model=Intervention,
)
def create_intervention(
    case_id: str,
):
    """
    Execute the AI-recommended recovery action.

    This is a Buildathon simulation.
    No real payment is processed.

    The customer's historical recovery rate
    is used to simulate the recovery outcome.
    """

    # --------------------------------------------------------
    # Find recovery case
    # --------------------------------------------------------

    recovery_case = recovery_cases.get(
        case_id
    )

    if recovery_case is None:
        raise HTTPException(
            status_code=404,
            detail="Recovery case not found",
        )

    # --------------------------------------------------------
    # Check recommendation
    # --------------------------------------------------------

    if recovery_case.recommended_action is None:
        raise HTTPException(
            status_code=400,
            detail=(
                "Recovery case does not have "
                "a recommended action"
            ),
        )

    # --------------------------------------------------------
    # Prevent duplicate execution
    # --------------------------------------------------------

    existing_intervention = next(
        (
            intervention
            for intervention in interventions.values()
            if intervention.recovery_case_id == case_id
        ),
        None,
    )

    if existing_intervention is not None:
        return existing_intervention

    # --------------------------------------------------------
    # Current timestamp
    # --------------------------------------------------------

    now = datetime.now(
        timezone.utc
    ).isoformat()

    # ========================================================
    # SIMULATE CUSTOMER RESPONSE
    # ========================================================
    #
    # This is NOT a real payment.
    #
    # Historical recovery rate is used to simulate
    # a believable Buildathon recovery outcome.
    #
    # >= 50%  -> SUCCESS
    # <  50%  -> FAILED
    #
    # This keeps the demo deterministic and predictable.
    # ========================================================

    recovery_probability = (
        recovery_case.customer_recovery_rate
    )

    recovery_success = (
        recovery_probability >= 0.50
    )

    # ========================================================
    # SUCCESS
    # ========================================================

    if recovery_success:

        intervention_status = (
            InterventionStatus.SUCCESS
        )

        new_case_status = (
            RecoveryStatus.RECOVERED
        )

        recovered_amount = float(
            recovery_case.amount
        )

        execution_message = (
            "Recovery action executed successfully. "
            "Synthetic customer response indicates "
            "that the payment was recovered."
        )

    # ========================================================
    # FAILURE
    # ========================================================

    else:

        intervention_status = (
            InterventionStatus.FAILED
        )

        new_case_status = (
            RecoveryStatus.FAILED
        )

        recovered_amount = 0.0

        execution_message = (
            "Recovery action was executed, but the "
            "synthetic customer response indicates "
            "that the payment could not be recovered."
        )

    # ========================================================
    # UPDATE RECOVERY CASE
    # ========================================================

    recovery_case.status = (
        new_case_status
    )

    recovery_case.action_taken = (
        recovery_case.recommended_action
    )

    recovery_case.recovered_amount = (
        recovered_amount
    )

    recovery_case.updated_at = now

    recovery_cases[
        recovery_case.id
    ] = recovery_case

    # ========================================================
    # CREATE INTERVENTION
    # ========================================================

    intervention = Intervention(
        id=f"INT_{uuid4().hex[:8].upper()}",

        recovery_case_id=(
            recovery_case.id
        ),

        intervention_type=InterventionType(
            recovery_case.recommended_action
        ),

        status=intervention_status,

        priority=(
            recovery_case.decision_priority
            or "medium"
        ),

        reasoning=(
            recovery_case.decision_reasoning
            or ""
        ),

        execution_message=(
            execution_message
        ),

        recovered_amount=(
            recovered_amount
        ),

        created_at=now,

        updated_at=now,
    )

    # --------------------------------------------------------
    # Store intervention
    # --------------------------------------------------------

    interventions[
        intervention.id
    ] = intervention

    # --------------------------------------------------------
    # Return intervention
    # --------------------------------------------------------

    return intervention