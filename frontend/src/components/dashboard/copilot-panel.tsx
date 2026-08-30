"use client";

import { useState } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";
import {
  getRecoveryCases,
  getRecoveryInterventions,
} from "@/lib/api/recovery";

type Message = {
  role: "user" | "assistant";
  text: string;
};

type RecoveryCase = {
  id: string;
  customer_name?: string;
  amount?: number;
  risk_score?: number;
  status?: string;
  recommended_action?: string;
  risk_reasons?: string[];
  reason?: string;
  failure_reason?: string;
};

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function CopilotPanel({
  onClose,
}: {
  onClose: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text:
        "Hi — I'm Reclaim Copilot. Ask me about revenue, customers, risks, recovery actions, or interventions.",
    },
  ]);

  /*
   * ---------------------------------------------------------
   * SUGGESTED QUESTIONS
   * ---------------------------------------------------------
   */

  const initialSuggestions = [
    "Where can I see recovery?",
    "What is revenue at risk?",
    "How much recovered?",
    "Recovery rate",
  ];

  const [suggestions, setSuggestions] = useState(
    initialSuggestions
  );

  const setSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const pushMessage = (message: Message) => {
    setMessages((current) => [...current, message]);
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  /*
   * ---------------------------------------------------------
   * CASE SEARCH
   * ---------------------------------------------------------
   */

  const findCaseById = (
    cases: RecoveryCase[],
    question: string
  ) => {
    const idMatch = question.match(/REC_[A-Z0-9_-]+/i);

    if (!idMatch) {
      return null;
    }

    return (
      cases.find(
        (item) =>
          item.id?.toLowerCase() ===
          idMatch[0].toLowerCase()
      ) ?? null
    );
  };

  /*
   * ---------------------------------------------------------
   * CHANGE SUGGESTIONS
   * ---------------------------------------------------------
   */

  const updateSuggestions = (
    question: string,
    foundCustomer = false
  ) => {
    const lc = question.toLowerCase();

    if (
      lc.includes("customer") ||
      lc.includes("priya") ||
      foundCustomer
    ) {
      setSuggestions([
        "What action is recommended?",
        "Why is this case high risk?",
        "Show high risk cases",
        "Where can I see recovery?",
      ]);

      return;
    }

    if (
      lc.includes("risk") ||
      lc.includes("highest")
    ) {
      setSuggestions([
        "Show me high risk cases",
        "What action is recommended?",
        "How many active cases?",
        "Pending interventions",
      ]);

      return;
    }

    if (
      lc.includes("recovery") ||
      lc.includes("recovered")
    ) {
      setSuggestions([
        "What is the recovery rate?",
        "How many active cases?",
        "Show me high risk cases",
        "Where can I see recovery?",
      ]);

      return;
    }

    if (
      lc.includes("intervention")
    ) {
      setSuggestions([
        "Show me high risk cases",
        "What action is recommended?",
        "How much recovered?",
        "Recovery activity",
      ]);

      return;
    }

    setSuggestions([
      "What is revenue at risk?",
      "How much recovered?",
      "How many active cases?",
      "Who is the highest risk customer?",
    ]);
  };

  /*
   * ---------------------------------------------------------
   * SUBMIT
   * ---------------------------------------------------------
   */

  const handleSubmit = async (
    e?: React.FormEvent<HTMLFormElement>
  ) => {
    e?.preventDefault();

    const question = input.trim();

    if (!question || loading) {
      return;
    }

    pushMessage({
      role: "user",
      text: question,
    });

    setInput("");
    setLoading(true);

    try {
      const lc = question.toLowerCase();

      /*
       * -------------------------------------------------------
       * BASIC CONVERSATION
       * -------------------------------------------------------
       */

      if (
        lc === "hi" ||
        lc === "hello" ||
        lc === "hey" ||
        lc === "hey reclaim" ||
        lc.includes("good morning") ||
        lc.includes("good evening")
      ) {
        pushMessage({
          role: "assistant",
          text:
            "Hi! 👋 I'm Reclaim Copilot. I can help you understand revenue at risk, recovery performance, customers, high-risk cases, and recommended recovery actions.",
        });

        updateSuggestions(question);
        return;
      }

      if (
        lc === "thanks" ||
        lc === "thank you" ||
        lc === "thx"
      ) {
        pushMessage({
          role: "assistant",
          text:
            "You're welcome. I'm here whenever you need a recovery insight.",
        });

        updateSuggestions(question);
        return;
      }

      /*
       * -------------------------------------------------------
       * HELP
       * -------------------------------------------------------
       */

      if (
        lc === "help" ||
        lc.includes("what can you do") ||
        lc.includes("what do you do")
      ) {
        pushMessage({
          role: "assistant",
          text:
            "I can help with:\n\n" +
            "• Revenue at risk\n" +
            "• Recovered revenue\n" +
            "• Recovery rate\n" +
            "• Active cases\n" +
            "• Highest-risk customers\n" +
            "• Customer lookup\n" +
            "• Recommended actions\n" +
            "• Pending interventions\n" +
            "• Recovery activity\n" +
            "• Case ID lookup",
        });

        setSuggestions([
          "What is revenue at risk?",
          "Who is the highest risk customer?",
          "Show me high risk cases",
          "Pending interventions",
        ]);

        return;
      }

      /*
       * -------------------------------------------------------
       * GET DATA
       * -------------------------------------------------------
       */

      const cases: RecoveryCase[] =
        await getRecoveryCases();

      const activeCases = cases.filter(
        (item) =>
          (item.status || "").toLowerCase() !==
          "recovered"
      );

      const recoveredCases = cases.filter(
        (item) =>
          (item.status || "").toLowerCase() ===
          "recovered"
      );

      /*
       * -------------------------------------------------------
       * WHERE RECOVERY
       * -------------------------------------------------------
       */

      if (
        lc.includes("where can i see recovery") ||
        lc.includes("where is recovery") ||
        lc.includes("where can i find recovery") ||
        lc.includes("see recovery") ||
        lc.includes("recovery page")
      ) {
        pushMessage({
          role: "assistant",
          text:
            "You can see recovery in the Dashboard Command Center.\n\n" +
            "• Recovery Performance → recovered revenue and trends\n" +
            "• AI Operations → live recovery activity\n" +
            "• Revenue Risk → cases requiring attention\n" +
            "• Audit Trail → completed recovery actions\n\n" +
            "For the overall recovery picture, start from the Dashboard.",
        });

        updateSuggestions(question);
        return;
      }

      /*
       * -------------------------------------------------------
       * REVENUE AT RISK
       * -------------------------------------------------------
       */

      if (
        lc.includes("revenue at risk") ||
        lc.includes("at risk revenue") ||
        lc.includes("how much is at risk") ||
        lc.includes("risk revenue")
      ) {
        const totalRisk = activeCases.reduce(
          (total, item) =>
            total + Number(item.amount || 0),
          0
        );

        pushMessage({
          role: "assistant",
          text:
            `${formatCurrency(totalRisk)} is currently at risk across ` +
            `${activeCases.length} active recovery case(s).`,
        });

        updateSuggestions(question);
        return;
      }

      /*
       * -------------------------------------------------------
       * RECOVERED REVENUE
       * -------------------------------------------------------
       */

      if (
        lc.includes("recovered revenue") ||
        lc.includes("how much recovered") ||
        lc.includes("how much have we recovered") ||
        lc.includes("recovery amount")
      ) {
        const recoveredAmount =
          recoveredCases.reduce(
            (total, item) =>
              total + Number(item.amount || 0),
            0
          );

        pushMessage({
          role: "assistant",
          text:
            `${formatCurrency(recoveredAmount)} has been recovered ` +
            `across ${recoveredCases.length} recovered case(s).`,
        });

        updateSuggestions(question);
        return;
      }

      /*
       * -------------------------------------------------------
       * RECOVERY RATE
       * -------------------------------------------------------
       */

      if (
        lc.includes("recovery rate") ||
        lc.includes("what is our recovery rate") ||
        lc.includes("current recovery rate")
      ) {
        const totalAmount = cases.reduce(
          (total, item) =>
            total + Number(item.amount || 0),
          0
        );

        const recoveredAmount =
          recoveredCases.reduce(
            (total, item) =>
              total + Number(item.amount || 0),
            0
          );

        const rate =
          totalAmount > 0
            ? (
                (recoveredAmount / totalAmount) *
                100
              ).toFixed(1)
            : "0.0";

        pushMessage({
          role: "assistant",
          text:
            `The current recovery rate from the available recovery cases is ${rate}%.`,
        });

        updateSuggestions(question);
        return;
      }

      /*
       * -------------------------------------------------------
       * ACTIVE CASES
       * -------------------------------------------------------
       */

      if (
        lc.includes("active cases") ||
        lc.includes("how many cases") ||
        lc.includes("number of cases") ||
        lc.includes("cases are active")
      ) {
        pushMessage({
          role: "assistant",
          text:
            `There are ${activeCases.length} active recovery case(s) currently requiring attention.`,
        });

        updateSuggestions(question);
        return;
      }

      /*
       * -------------------------------------------------------
       * HIGH RISK CASES
       * -------------------------------------------------------
       */

      if (
        lc.includes("high risk cases") ||
        lc.includes("highest risk cases") ||
        lc.includes("show high risk") ||
        lc.includes("risky customers")
      ) {
        const highRiskCases = activeCases
          .filter(
            (item) =>
              Number(item.risk_score || 0) >= 70
          )
          .sort(
            (a, b) =>
              Number(b.risk_score || 0) -
              Number(a.risk_score || 0)
          );

        if (highRiskCases.length === 0) {
          pushMessage({
            role: "assistant",
            text:
              "There are no high-risk active cases in the current recovery data.",
          });

          updateSuggestions(question);
          return;
        }

        const list = highRiskCases
          .slice(0, 5)
          .map(
            (item) =>
              `${item.customer_name} — ${formatCurrency(
                Number(item.amount || 0)
              )} — risk ${item.risk_score}`
          )
          .join("\n");

        pushMessage({
          role: "assistant",
          text:
            `I found ${highRiskCases.length} high-risk active case(s):\n\n${list}`,
        });

        updateSuggestions(question);
        return;
      }

      /*
       * -------------------------------------------------------
       * HIGHEST RISK
       * -------------------------------------------------------
       */

      if (
        lc.includes("highest risk") ||
        lc.includes("most risky") ||
        lc.includes("worst case") ||
        lc.includes("top risk")
      ) {
        if (activeCases.length === 0) {
          pushMessage({
            role: "assistant",
            text:
              "There are no active recovery cases right now.",
          });

          updateSuggestions(question);
          return;
        }

        const highestRisk = activeCases.reduce(
          (a, b) =>
            Number(a.risk_score || 0) >
            Number(b.risk_score || 0)
              ? a
              : b
        );

        pushMessage({
          role: "assistant",
          text:
            `Highest-risk case:\n\n` +
            `${highestRisk.customer_name}\n` +
            `Revenue: ${formatCurrency(
              Number(highestRisk.amount || 0)
            )}\n` +
            `Risk score: ${highestRisk.risk_score}\n` +
            `Reason: ${
              highestRisk.reason ||
              highestRisk.failure_reason ||
              highestRisk.risk_reasons?.join(", ") ||
              "Risk details available in the case."
            }\n` +
            `Recommended action: ${
              highestRisk.recommended_action ||
              "Review case"
            }`,
        });

        updateSuggestions(question);
        return;
      }

      /*
       * -------------------------------------------------------
       * CUSTOMER SEARCH
       * -------------------------------------------------------
       */

      const possibleCustomer =
        lc
          .replace("who is ", "")
          .replace("find ", "")
          .replace("show ", "")
          .replace("customer ", "")
          .trim();

      const customerMatches = cases.filter(
        (item) =>
          String(item.customer_name || "")
            .toLowerCase()
            .includes(possibleCustomer)
      );

      if (
        lc.startsWith("who is ") ||
        lc.startsWith("find ") ||
        lc.startsWith("show ") ||
        lc.includes("customer ")
      ) {
        if (customerMatches.length > 0) {
          const customer = customerMatches[0];

          pushMessage({
            role: "assistant",
            text:
              `${customer.customer_name}\n\n` +
              `Case: ${customer.id}\n` +
              `Revenue: ${formatCurrency(
                Number(customer.amount || 0)
              )}\n` +
              `Risk score: ${
                customer.risk_score ?? "—"
              }\n` +
              `Status: ${customer.status ?? "—"}\n` +
              `Recommended action: ${
                customer.recommended_action ||
                "Review case"
              }`,
          });

          updateSuggestions(question, true);
          return;
        }
      }

      /*
       * -------------------------------------------------------
       * CASE ID
       * -------------------------------------------------------
       */

      const matchedCase = findCaseById(
        cases,
        question
      );

      if (matchedCase) {
        pushMessage({
          role: "assistant",
          text:
            `${matchedCase.customer_name}\n\n` +
            `Case: ${matchedCase.id}\n` +
            `Revenue: ${formatCurrency(
              Number(matchedCase.amount || 0)
            )}\n` +
            `Risk score: ${
              matchedCase.risk_score ?? "—"
            }\n` +
            `Status: ${
              matchedCase.status ?? "—"
            }\n` +
            `Recommended action: ${
              matchedCase.recommended_action ||
              "Review case"
            }`,
        });

        updateSuggestions(question, true);
        return;
      }

      /*
       * -------------------------------------------------------
       * WHY HIGH RISK
       * -------------------------------------------------------
       */

      if (
        lc.includes("why") &&
        (lc.includes("risk") ||
          lc.includes("case"))
      ) {
        const recoveryCase =
          matchedCase ||
          activeCases.reduce((a, b) =>
            Number(a.risk_score || 0) >
            Number(b.risk_score || 0)
              ? a
              : b
          );

        if (!recoveryCase) {
          pushMessage({
            role: "assistant",
            text:
              "I couldn't find a recovery case to analyze.",
          });

          updateSuggestions(question);
          return;
        }

        const reasons =
          recoveryCase.risk_reasons &&
          recoveryCase.risk_reasons.length > 0
            ? recoveryCase.risk_reasons.join("; ")
            : recoveryCase.reason ||
              recoveryCase.failure_reason ||
              "No detailed risk reason is available.";

        pushMessage({
          role: "assistant",
          text:
            `${recoveryCase.customer_name}'s case is considered risky because:\n\n${reasons}`,
        });

        updateSuggestions(question, true);
        return;
      }

      /*
       * -------------------------------------------------------
       * RECOMMENDED ACTION
       * -------------------------------------------------------
       */

      if (
        lc.includes("recommended action") ||
        lc.includes("what action") ||
        lc.includes("what should we do") ||
        lc.includes("what should i do") ||
        lc.includes("next action")
      ) {
        const recoveryCase =
          matchedCase ||
          activeCases.reduce((a, b) =>
            Number(a.risk_score || 0) >
            Number(b.risk_score || 0)
              ? a
              : b
          );

        if (!recoveryCase) {
          pushMessage({
            role: "assistant",
            text:
              "There are no active cases requiring a recommended action.",
          });

          updateSuggestions(question);
          return;
        }

        pushMessage({
          role: "assistant",
          text:
            `Recommended action for ${recoveryCase.customer_name}:\n\n` +
            `${recoveryCase.recommended_action || "Review the case manually."}`,
        });

        updateSuggestions(question, true);
        return;
      }

      /*
       * -------------------------------------------------------
       * PENDING INTERVENTIONS
       * -------------------------------------------------------
       */

      if (
        lc.includes("pending intervention") ||
        lc.includes("pending interventions") ||
        lc.includes("interventions pending")
      ) {
        const pending: string[] = [];

        for (const recoveryCase of cases) {
          const interventions =
            await getRecoveryInterventions(
              recoveryCase.id
            );

          interventions
            .filter(
              (intervention) =>
                String(
                  intervention.status || ""
                ).toLowerCase() === "pending"
            )
            .forEach((intervention) => {
              pending.push(
                `${intervention.intervention_type} — ${recoveryCase.customer_name}`
              );
            });
        }

        if (pending.length === 0) {
          pushMessage({
            role: "assistant",
            text:
              "There are currently no pending recovery interventions.",
          });

          updateSuggestions(question);
          return;
        }

        pushMessage({
          role: "assistant",
          text:
            `I found ${pending.length} pending intervention(s):\n\n` +
            pending.slice(0, 8).join("\n"),
        });

        updateSuggestions(question);
        return;
      }

      /*
       * -------------------------------------------------------
       * RECOVERY ACTIVITY
       * -------------------------------------------------------
       */

      if (
        lc.includes("recovery activity") ||
        lc.includes("recent recovery") ||
        lc.includes("recovery actions") ||
        lc.includes("what happened")
      ) {
        const recent = cases
          .filter(
            (item) =>
              (item.status || "").toLowerCase() ===
              "recovered"
          )
          .slice(0, 5);

        if (recent.length === 0) {
          pushMessage({
            role: "assistant",
            text:
              "I don't have any completed recovery activity in the current data.",
          });

          updateSuggestions(question);
          return;
        }

        const list = recent
          .map(
            (item) =>
              `${item.customer_name} — ${formatCurrency(
                Number(item.amount || 0)
              )} — ${
                item.recommended_action ||
                "Recovery action"
              }`
          )
          .join("\n");

        pushMessage({
          role: "assistant",
          text:
            `Recent recovered activity:\n\n${list}`,
        });

        updateSuggestions(question);
        return;
      }

      /*
       * -------------------------------------------------------
       * CUSTOMER NAME SEARCH ANYWHERE
       * -------------------------------------------------------
       */

      const searchableCases = cases.filter(
        (item) =>
          item.customer_name &&
          lc.includes(
            item.customer_name.toLowerCase()
          )
      );

      if (searchableCases.length > 0) {
        const customer = searchableCases[0];

        pushMessage({
          role: "assistant",
          text:
            `I found a recovery case for ${customer.customer_name}.\n\n` +
            `Revenue: ${formatCurrency(
              Number(customer.amount || 0)
            )}\n` +
            `Risk score: ${
              customer.risk_score ?? "—"
            }\n` +
            `Status: ${
              customer.status ?? "—"
            }\n` +
            `Recommended action: ${
              customer.recommended_action ||
              "Review case"
            }`,
        });

        updateSuggestions(question, true);
        return;
      }

      /*
       * -------------------------------------------------------
       * SMART FALLBACK
       * -------------------------------------------------------
       */

      pushMessage({
        role: "assistant",
        text:
          `I couldn't find a direct answer for "${question}".\n\n` +
          `Try one of the suggested questions below, or ask me about revenue, recovery, customers, risks, or interventions.`,
      });

      updateSuggestions(question);
    } catch (error: unknown) {
      pushMessage({
        role: "assistant",
        text:
          "I couldn't retrieve the recovery data right now. " +
          (error instanceof Error
            ? error.message
            : "Please try again."),
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="sticky top-24 flex h-[560px] max-h-[calc(100vh-120px)] w-full flex-col self-start overflow-hidden rounded-2xl border border-ui bg-card shadow-sm">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex shrink-0 items-center justify-between border-b border-ui px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
            <Bot className="h-4 w-4" />
          </div>

          <div className="min-w-0">

            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-foreground">
                Reclaim Copilot
              </p>

              <Sparkles className="h-3 w-3 text-emerald-400" />
            </div>

            <p className="truncate text-xs text-muted-foreground">
              Revenue intelligence assistant
            </p>

          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close Reclaim Copilot"
          className="shrink-0 rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* =====================================================
          CHAT MESSAGES
      ====================================================== */}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">

        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`mb-3 ${
              message.role === "assistant"
                ? "text-muted-foreground"
                : "text-foreground"
            }`}
          >
            <div className="whitespace-pre-wrap text-[12px] leading-5">
              {message.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Reclaim is analyzing recovery data...
          </div>
        )}
      </div>

      {/* =====================================================
          SUGGESTED QUESTIONS
      ====================================================== */}

      <div className="shrink-0 border-t border-ui bg-card px-3 pt-3">

        <div className="mb-2 flex items-center gap-1.5 px-1">
          <Sparkles className="h-3 w-3 text-emerald-400" />

          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Suggested questions
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {suggestions.slice(0, 4).map((question) => (
            <button
              key={question}
              type="button"
              onClick={() =>
                setSuggestedQuestion(question)
              }
              disabled={loading}
              className="
                rounded-full
                border
                border-ui
                bg-background
                px-2.5
                py-1.5
                text-[10px]
                text-muted-foreground
                transition-all
                duration-200
                hover:border-emerald-400/40
                hover:bg-emerald-400/[0.06]
                hover:text-emerald-400
                active:scale-[0.97]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================
          INPUT
      ====================================================== */}

      <form
        onSubmit={handleSubmit}
        className="shrink-0 bg-card p-3"
      >
        <div className="flex gap-2">

          <input
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            placeholder="Ask Reclaim Copilot..."
            disabled={loading}
            className="
              min-w-0
              flex-1
              rounded-lg
              border
              border-ui
              bg-background
              px-3
              py-2
              text-sm
              text-foreground
              outline-none
              placeholder:text-muted-foreground
              focus:border-emerald-400
              focus:ring-2
              focus:ring-emerald-400/10
            "
          />

          <button
            type="submit"
            disabled={
              loading || !input.trim()
            }
            aria-label="Send message"
            className="
              inline-flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-emerald-400
              text-black
              transition-all
              duration-200
              hover:bg-emerald-300
              hover:shadow-[0_0_20px_rgba(52,211,153,0.18)]
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Send className="h-4 w-4" />
          </button>

        </div>
      </form>
    </div>
  );
}

export default CopilotPanel;