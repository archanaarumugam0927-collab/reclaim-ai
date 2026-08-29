from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class InterventionType(str, Enum):
    SMART_RETRY = "smart_retry"
    SMART_RETRY_WITH_REMINDER = "smart_retry_with_reminder"
    PAYMENT_REMINDER = "payment_reminder"
    REQUEST_PAYMENT_METHOD_UPDATE = "request_payment_method_update"
    AUTHENTICATION_RECOVERY = "authentication_recovery"
    DELAYED_SMART_RETRY = "delayed_smart_retry"
    HIGH_VALUE_RECOVERY = "high_value_recovery"
    HUMAN_ESCALATION = "human_escalation"
    REVIEW_AND_RETRY = "review_and_retry"


class InterventionStatus(str, Enum):
    PENDING = "pending"
    EXECUTING = "executing"
    EXECUTED = "executed"
    SUCCESS = "success"
    FAILED = "failed"


class Intervention(BaseModel):
    id: str

    recovery_case_id: str

    intervention_type: InterventionType

    status: InterventionStatus = InterventionStatus.PENDING

    priority: str

    reasoning: str

    execution_message: Optional[str] = None

    recovered_amount: float = Field(default=0, ge=0)

    created_at: str
    updated_at: str