from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class RecoveryStatus(str, Enum):
    DETECTED = "detected"
    ANALYZING = "analyzing"
    ACTION_REQUIRED = "action_required"
    INTERVENTION_SENT = "intervention_sent"
    RECOVERED = "recovered"
    FAILED = "failed"


class PaymentFailureReason(str, Enum):
    INSUFFICIENT_FUNDS = "insufficient_funds"
    CARD_DECLINED = "card_declined"
    EXPIRED_CARD = "expired_card"
    NETWORK_ERROR = "network_error"
    AUTHENTICATION_FAILED = "authentication_failed"
    BANK_DECLINED = "bank_declined"
    UNKNOWN = "unknown"


# ============================================================
# CREATE RECOVERY CASE
# ============================================================

class RecoveryCaseCreate(BaseModel):
    customer_id: str
    customer_name: str
    transaction_id: str

    amount: float = Field(
        ...,
        gt=0,
    )

    currency: str = "INR"

    failure_reason: PaymentFailureReason

    previous_failures: int = Field(
        default=0,
        ge=0,
    )

    customer_recovery_rate: float = Field(
        default=0.5,
        ge=0,
        le=1,
    )


# ============================================================
# RECOVERY CASE
# ============================================================

class RecoveryCase(BaseModel):
    id: str

    customer_id: str
    customer_name: str
    transaction_id: str

    amount: float = Field(
        ...,
        gt=0,
    )

    currency: str = "INR"

    failure_reason: PaymentFailureReason

    # Historical customer behavior
    previous_failures: int = Field(
        default=0,
        ge=0,
    )

    customer_recovery_rate: float = Field(
        default=0.5,
        ge=0,
        le=1,
    )

    # AI risk analysis
    risk_score: float = Field(
        ...,
        ge=0,
        le=1,
    )

    risk_level: RiskLevel

    risk_reasons: list[str] = Field(
        default_factory=list
    )

    # Recovery lifecycle
    status: RecoveryStatus = (
        RecoveryStatus.DETECTED
    )

    # AI explanation
    ai_diagnosis: Optional[str] = None

    recommended_action: Optional[str] = None

    decision_priority: Optional[str] = None

    decision_reasoning: Optional[str] = None

    # Recovery execution
    action_taken: Optional[str] = None

    recovered_amount: float = Field(
        default=0,
        ge=0,
    )

    created_at: str
    updated_at: str