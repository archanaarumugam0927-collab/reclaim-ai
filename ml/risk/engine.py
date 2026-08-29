from dataclasses import dataclass


@dataclass
class RiskResult:
    score: float
    level: str
    reasons: list[str]


FAILURE_WEIGHTS = {
    "insufficient_funds": 0.25,
    "card_declined": 0.30,
    "expired_card": 0.20,
    "network_error": 0.10,
    "authentication_failed": 0.35,
    "unknown": 0.15,
}


def calculate_risk(
    amount: float,
    failure_reason: str,
    previous_failures: int = 0,
    customer_recovery_rate: float = 0.5,
) -> RiskResult:
    """
    Calculate an explainable revenue-recovery risk score.

    Score range:
        0.0 → low risk
        1.0 → critical risk
    """

    score = 0.0
    reasons: list[str] = []

    # 1. Payment failure reason
    failure_weight = FAILURE_WEIGHTS.get(failure_reason, 0.15)
    score += failure_weight

    reasons.append(
        f"Payment failure reason: {failure_reason}"
    )

    # 2. Transaction value
    if amount >= 50000:
        score += 0.25
        reasons.append("High-value transaction")

    elif amount >= 20000:
        score += 0.15
        reasons.append("Medium-high transaction value")

    elif amount >= 10000:
        score += 0.10
        reasons.append("Material transaction value")

    # 3. Previous payment failures
    if previous_failures >= 3:
        score += 0.20
        reasons.append("Multiple previous payment failures")

    elif previous_failures >= 1:
        score += 0.10
        reasons.append("Previous payment failure detected")

    # 4. Historical recovery behavior
    if customer_recovery_rate < 0.25:
        score += 0.20
        reasons.append("Low historical recovery rate")

    elif customer_recovery_rate < 0.50:
        score += 0.10
        reasons.append("Moderate historical recovery rate")

    else:
        reasons.append("Healthy historical recovery behavior")

    # Keep score within [0, 1]
    score = min(max(score, 0.0), 1.0)

    # Risk classification
    if score >= 0.80:
        level = "critical"
    elif score >= 0.60:
        level = "high"
    elif score >= 0.35:
        level = "medium"
    else:
        level = "low"

    return RiskResult(
        score=round(score, 2),
        level=level,
        reasons=reasons,
    )