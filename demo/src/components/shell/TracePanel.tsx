import { Check, ChevronRight, ListTree } from "lucide-react";
import { ONTOLOGY_STEPS } from "@/ontology/trace";
import type { Simulation } from "@/state/useSimulation";
import { cn } from "@/lib/utils";

const LAYER_DOT: Record<string, string> = {
  CRMdig: "bg-onto-crmdig",
  CIDOC: "bg-onto-cidoc",
  RHDTO: "bg-onto-rhdto",
  local: "bg-primary",
};

export function TracePanel({ sim, className }: { sim: Simulation; className?: string }) {
  const { state, actions, progress } = sim;

  return (
    <aside
      className={cn(
        "deep-panel slim-scroll flex h-full w-full flex-col overflow-y-auto rounded-2xl p-4",
        className
      )}
      aria-label="Ιχνηλάτηση οντολογίας"
    >
      <div className="flex items-center gap-2">
        <ListTree className="size-4 text-ink-muted" />
        <h4 className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink-foreground">
          Ιχνηλάτηση οντολογίας
        </h4>
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-ink-muted">
        Σημασιολογική εκτέλεση πάνω στο εννοιολογικό μοντέλο (RHDTO v1.2 · CRMdig · CIDOC-CRM)
      </p>

      <div className="mt-3 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-foreground/15">
          <div
            className="h-full rounded-full bg-rail transition-[width] duration-500"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
        <span className="font-mono text-[11px] text-ink-muted tabular">
          {progress.done}/{progress.total}
        </span>
      </div>

      <ol className="mt-4 flex flex-col">
        {ONTOLOGY_STEPS.map((step, i) => {
          const isCurrent = state.currentStep === step.id;
          const isDone = state.doneSteps.includes(step.id) && !isCurrent;
          const status = isDone ? "done" : isCurrent ? "current" : "pending";
          return (
            <li key={step.id}>
              {i > 0 ? (
                <div
                  className={cn(
                    "ml-[15px] h-3 w-[2px]",
                    isDone || isCurrent ? "bg-onto-crmdig/80" : "bg-ink-foreground/15"
                  )}
                />
              ) : null}
              <button
                type="button"
                onClick={() => actions.setView(step.view)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl px-2 py-2 text-left transition-colors",
                  isCurrent ? "bg-ink-foreground/12" : "hover:bg-ink-foreground/8"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-[22px] shrink-0 place-items-center rounded-full border text-[10px] font-bold",
                    status === "done" &&
                      "border-transparent bg-gradient-to-br from-risk-normal to-onto-crmdig text-primary-foreground",
                    status === "current" &&
                      "border-risk-medium text-risk-medium ring-4 ring-risk-medium/25",
                    status === "pending" && "border-ink-foreground/25 text-ink-muted"
                  )}
                >
                  {status === "done" ? (
                    <Check className="size-3" />
                  ) : status === "current" ? (
                    <ChevronRight className="size-3" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-[12.5px] font-bold leading-snug",
                      status === "pending" ? "text-ink-muted" : "text-ink-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 font-mono text-[10.5px] text-ink-muted">
                    <span className={cn("size-1.5 rounded-full", LAYER_DOT[step.layer])} />
                    {step.clazz}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-ink-foreground/15 pt-3 font-mono text-[10.5px] text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-risk-normal" /> ολοκληρώθηκε
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-risk-medium" /> τρέχον
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-ink-foreground/25" /> εκκρεμεί
        </span>
      </div>
    </aside>
  );
}
