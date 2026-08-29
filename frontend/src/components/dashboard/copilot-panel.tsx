"use client";

import { useState } from "react";
import { Bot, X, Send } from "lucide-react";
import {
  getRecoveryCases,
  getRecoveryInterventions,
} from "@/lib/api/recovery";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export function CopilotPanel({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(true);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi — I'm Reclaim Copilot. Ask about revenue, cases, risks or interventions.",
    },
  ]);

  const pushMessage = (message: Message) => {
    setMessages((current) => [...current, message]);
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const q = input.trim();

    if (!q || loading) {
      return;
    }

    pushMessage({
      role: "user",
      text: q,
    });

    setInput("");
    setLoading(true);

    try {
      const cases = await getRecoveryCases();
      const lc = q.toLowerCase();

      const activeCases = cases.filter(
        (c) => (c.status || "").toLowerCase() !== "recovered"
      );

      if (
        lc.includes("revenue at risk") ||
        lc.includes("what revenue is at risk")
      ) {
        const sum = activeCases.reduce(
          (total, c) => total + (c.amount || 0),
          0
        );

        pushMessage({
          role: "assistant",
          text: `Revenue at risk: ₹${sum} across ${activeCases.length} active case(s).`,
        });
      } else if (lc.includes("which cases need attention")) {
        if (activeCases.length === 0) {
          pushMessage({
            role: "assistant",
            text: "No active recovery cases need attention.",
          });
        } else {
          const list = activeCases
            .map(
              (c) =>
                `${c.id} — ${c.customer_name} — ₹${c.amount}`
            )
            .join("\n");

          pushMessage({
            role: "assistant",
            text: `Cases needing attention:\n${list}`,
          });
        }
      } else if (
        lc.includes("which case is highest risk") ||
        lc.includes("highest risk")
      ) {
        if (cases.length === 0) {
          pushMessage({
            role: "assistant",
            text: "No cases available.",
          });
        } else {
          const highestRisk = cases.reduce((a, b) =>
            (a.risk_score || 0) > (b.risk_score || 0) ? a : b
          );

          pushMessage({
            role: "assistant",
            text:
              `Highest risk: ${highestRisk.id} ` +
              `(${highestRisk.customer_name}), ` +
              `risk score=${highestRisk.risk_score}, ` +
              `recommended action=${highestRisk.recommended_action}`,
          });
        }
      } else if (
        lc.includes("why is this case high risk") ||
        lc.includes("why is case")
      ) {
        const idMatch = q.match(/REC_[A-Z0-9]{8}/i);

        if (idMatch) {
          const id = idMatch[0];

          const recoveryCase = cases.find(
            (c) => c.id.toLowerCase() === id.toLowerCase()
          );

          if (!recoveryCase) {
            pushMessage({
              role: "assistant",
              text: `No case found with id ${id}.`,
            });
          } else {
            const reasons =
              recoveryCase.risk_reasons &&
              recoveryCase.risk_reasons.length > 0
                ? recoveryCase.risk_reasons.join("; ")
                : "No detailed risk reasons provided.";

            pushMessage({
              role: "assistant",
              text:
                `Case ${recoveryCase.id} is high risk because: ${reasons}`,
            });
          }
        } else {
          pushMessage({
            role: "assistant",
            text:
              "Please include the case id " +
              "(for example REC_XXXXXXXX) to explain why that case is high risk.",
          });
        }
      } else if (lc.includes("what action is recommended")) {
        const idMatch = q.match(/REC_[A-Z0-9]{8}/i);

        if (idMatch) {
          const id = idMatch[0];

          const recoveryCase = cases.find(
            (c) => c.id.toLowerCase() === id.toLowerCase()
          );

          if (!recoveryCase) {
            pushMessage({
              role: "assistant",
              text: `No case found with id ${id}.`,
            });
          } else {
            pushMessage({
              role: "assistant",
              text:
                `Recommended action for ${recoveryCase.id}: ` +
                `${recoveryCase.recommended_action ?? "—"}`,
            });
          }
        } else {
          pushMessage({
            role: "assistant",
            text:
              `There are ${activeCases.length} active case(s). ` +
              "Please include a specific case id (REC_...) for a recommendation.",
          });
        }
      } else if (
        lc.includes("how many active cases") ||
        lc.includes("how many cases")
      ) {
        pushMessage({
          role: "assistant",
          text: `There are ${activeCases.length} active recovery case(s).`,
        });
      } else if (lc.includes("what interventions are pending")) {
        const pending: string[] = [];

        for (const recoveryCase of cases) {
          const interventions = await getRecoveryInterventions(
            recoveryCase.id
          );

          interventions
            .filter(
              (intervention) =>
                (intervention.status || "").toLowerCase() === "pending"
            )
            .forEach((intervention) => {
              pending.push(
                `${intervention.id} for ${recoveryCase.id}: ${intervention.intervention_type}`
              );
            });
        }

        if (pending.length === 0) {
          pushMessage({
            role: "assistant",
            text: "No pending interventions.",
          });
        } else {
          pushMessage({
            role: "assistant",
            text:
              `Pending interventions:\n${pending.join("\n")}`,
          });
        }
      } else {
        pushMessage({
          role: "assistant",
          text:
            "I can answer questions about revenue at risk, active cases, " +
            "highest risk case, why a case is high risk, recommended action, " +
            "and pending interventions. Please rephrase your question.",
        });
      }
    } catch (error: unknown) {
      pushMessage({
        role: "assistant",
        text:
          `Error fetching data: ${
            error instanceof Error ? error.message : String(error)
          }`,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        sticky
        top-24
        flex
        h-[560px]
        max-h-[calc(100vh-120px)]
        w-full
        flex-col
        self-start
        overflow-hidden
        rounded-2xl
        border
        border-ui
        bg-card
        shadow-sm
      "
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-ui px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
            <Bot className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Reclaim Copilot
            </p>

            <p className="truncate text-xs text-muted-foreground">
              Ask about cases, risks, and interventions
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close Reclaim Copilot"
          className="
            shrink-0
            rounded-md
            p-1.5
            text-muted-foreground
            transition
            hover:bg-muted
            hover:text-foreground
          "
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overscroll-contain
          px-4
          py-3
        "
      >
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
          <div className="text-xs text-muted-foreground">
            Reclaim is checking the recovery data...
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-ui bg-card p-3"
      >
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
            "
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
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
              transition
              hover:bg-emerald-300
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