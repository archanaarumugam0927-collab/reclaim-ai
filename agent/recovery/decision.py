from dataclasses import dataclass


@dataclass
class RecoveryDecision:
    action: str
    priority: str
    reasoning: str


def decide_recovery_action(
    risk_level: str,
    failure_reason: str,
    amount: float,
    previous_failures: int = 0,
    customer_recovery_rate: float = 0.5,
) -> RecoveryDecision:
    """
    Decide the most appropriate recovery intervention
    based on transaction and customer signals.
    """

    # Critical cases need human attention first.
    if risk_level == "critical":
        return RecoveryDecision(
            action="human_escalation",
            priority="urgent",
            reasoning=(
                "Critical revenue risk detected. "
                "The case should be reviewed before automated intervention."
            ),
        )

    # Authentication failures require the customer to complete verification.
    if failure_reason == "authentication_failed":
        return RecoveryDecision(
            action="authentication_recovery",
            priority="high",
            reasoning=(
                "The payment failed during authentication. "
                "Guide the customer through a secure authentication retry."
            ),
        )

    # Expired cards require a card update rather than another blind retry.
    if failure_reason == "expired_card":
        return RecoveryDecision(
            action="request_payment_method_update",
            priority="high",
            reasoning=(
                "The payment method has expired. "
                "Request an updated payment method before retrying."
            ),
        )

    # Network failures are usually suitable for delayed automatic retry.
    if failure_reason == "network_error":
        return RecoveryDecision(
            action="delayed_smart_retry",
            priority="medium",
            reasoning=(
                "The failure appears transient. "
                "A delayed retry is preferable to immediate customer outreach."
            ),
        )

    # Repeated insufficient-funds failures should avoid aggressive retries.
    if failure_reason == "insufficient_funds":
        return RecoveryDecision(
            action="payment_reminder",
            priority="medium",
            reasoning=(
                "The customer may not currently have sufficient funds. "
                "A payment reminder is more appropriate than repeated retries."
            ),
        )

    # Repeated failures on a valuable transaction deserve escalation.
    if amount >= 50000 and previous_failures >= 2:
        return RecoveryDecision(
            action="high_value_recovery",
            priority="urgent",
            reasoning=(
                "A high-value transaction has failed multiple times. "
                "Use a high-touch recovery workflow."
            ),
        )

    # Card declines are usually recoverable with a smart retry.
    if failure_reason == "card_declined":
        if customer_recovery_rate >= 0.5:
            return RecoveryDecision(
                action="smart_retry",
                priority="high",
                reasoning=(
                    "The card was declined, but the customer has a healthy "
                    "historical recovery rate. A smart retry has strong recovery potential."
                ),
            )

        return RecoveryDecision(
            action="smart_retry_with_reminder",
            priority="high",
            reasoning=(
                "The card was declined and historical recovery is moderate or low. "
                "Combine a smart retry with customer follow-up."
            ),
        )

    # Fallback strategy.
    return RecoveryDecision(
        action="review_and_retry",
        priority="medium",
        reasoning=(
            "The failure pattern is not strongly classified. "
            "Use a cautious retry workflow with monitoring."
        ),
    )