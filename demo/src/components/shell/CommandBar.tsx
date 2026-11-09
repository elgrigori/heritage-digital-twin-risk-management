import { motion, useReducedMotion } from "framer-motion";
import {
  CheckCheck,
  CircleDot,
  Gauge,
  Info,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  SkipForward,
  Wrench,
  Zap,
} from "lucide-react";
import type { NextActionKind, Phase } from "@/data/types";
import type { Simulation } from "@/state/useSimulation";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const PHASE_META: Record<Phase, { label: string; chip: string; icon: typeof Gauge }> = {
  idle: { label: "Έτοιμο", chip: "bg-muted text-muted-foreground", icon: CircleDot },
  running: { label: "Εκτελείται", chip: "bg-primary/12 text-primary", icon: Loader2 },
  gate: { label: "Απαιτείται απόφαση", chip: "bg-risk-medium-soft text-risk-medium", icon: ShieldCheck },
  closed: { label: "Ολοκληρώθηκε", chip: "bg-risk-normal-soft text-risk-normal", icon: CheckCheck },
};

const PHASE_EDGE: Record<Phase, string> = {
  idle: "before:bg-edge-plain",
  running: "before:bg-edge-brand",
  gate: "before:bg-edge-amber",
  closed: "before:bg-edge-teal",
};

const CTA_VARIANT: Record<NextActionKind, "hero" | "warn" | "go" | "secondary" | "done"> = {
  start: "hero",
  resume: "hero",
  pause: "secondary",
  trigger: "warn",
  mitigate: "go",
  close: "go",
  done: "done",
};

const CTA_ICON: Record<NextActionKind, typeof Play> = {
  start: Play,
  resume: Play,
  pause: Pause,
  trigger: Zap,
  mitigate: Wrench,
  close: CheckCheck,
  done: CheckCheck,
};

export function CommandBar({ sim, className }: { sim: Simulation; className?: string }) {
  const { state, actions, nextAction, progress, steps } = sim;
  const reduced = useReducedMotion();
  const meta = PHASE_META[state.phase];
  const PhaseIcon = meta.icon;
  const CtaIcon = CTA_ICON[nextAction.kind];
  const currentStep = state.stepIndex >= 0 ? steps[state.stepIndex] : undefined;

  return (
    <section
      className={cn(
        "sticky top-[60px] z-30 mb-5 overflow-hidden rounded-2xl border border-border bg-card/95 p-3.5 shadow-elegant backdrop-blur-xl before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:content-['']",
        PHASE_EDGE[state.phase],
        className
      )}
      aria-label="Ροή εκτέλεσης"
    >
      <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className={cn("grid size-10 shrink-0 place-items-center rounded-xl", meta.chip)}>
            <PhaseIcon className={cn("size-5", state.playing && "animate-spin")} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.08em]">
              <span className={cn("rounded-full px-2 py-0.5", meta.chip)}>{meta.label}</span>
              {currentStep ? (
                <span className="font-mono text-[11px] font-semibold normal-case tracking-normal text-muted-foreground">
                  {currentStep.label}
                </span>
              ) : null}
            </div>
            <p
              aria-live="polite"
              className="mt-1 text-sm font-semibold leading-snug sm:text-[15px]"
            >
              {state.narration}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={CTA_VARIANT[nextAction.kind]}
            size="lg"
            className="flex-1 2xl:flex-none"
            onClick={actions.runNextAction}
            disabled={nextAction.kind === "done"}
          >
            <CtaIcon />
            {nextAction.label}
          </Button>

          <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={actions.togglePlay}
                  aria-label={state.playing ? "Παύση" : "Έναρξη / συνέχεια"}
                  disabled={state.phase === "gate" || state.phase === "closed"}
                >
                  {state.playing ? <Pause /> : <Play />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{state.playing ? "Παύση" : "Έναρξη / συνέχεια"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={actions.nextStep}
                  aria-label="Επόμενο βήμα"
                  disabled={state.phase === "gate" || state.phase === "closed"}
                >
                  <SkipForward />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Επόμενο βήμα (→)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={actions.reset}
                  aria-label="Επαναφορά"
                >
                  <RotateCcw />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Επαναφορά (R)</TooltipContent>
            </Tooltip>
          </div>

          <ToggleGroup
            type="single"
            value={String(state.speed)}
            onValueChange={(value) => {
              if (value) actions.setSpeed(Number(value) as 0.5 | 1 | 2);
            }}
            className="rounded-xl border border-border bg-muted/40 p-1"
            aria-label="Ταχύτητα ροής"
          >
            {[0.5, 1, 2].map((s) => (
              <ToggleGroupItem
                key={s}
                value={String(s)}
                className="h-8 rounded-lg px-2.5 font-mono text-xs data-[state=on]:bg-card data-[state=on]:text-primary data-[state=on]:shadow-sm"
                aria-label={`Ταχύτητα ${s}x`}
              >
                {s}x
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      {(nextAction.kind === "trigger" ||
        nextAction.kind === "mitigate" ||
        nextAction.kind === "close") && (
        <p className="mt-2.5 flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
          {nextAction.hint}
        </p>
      )}

      <div className="mt-3 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-rail"
            initial={reduced ? false : { width: 0 }}
            animate={{ width: `${progress.pct}%` }}
            transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular">
          {progress.done}/{progress.total} βήματα οντολογίας
        </span>
      </div>
    </section>
  );
}
