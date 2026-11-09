import {
  BellRing,
  Boxes,
  Gauge,
  History,
  Keyboard,
  LayoutDashboard,
  Pause,
  Play,
  Presentation,
  Radio,
  RotateCcw,
  ShieldCheck,
  Shuffle,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { ViewId } from "@/data/types";
import { RISK_SHORT } from "@/data/labels";
import type { Simulation } from "@/state/useSimulation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RiskBadge } from "@/components/domain/primitives";
import { cn } from "@/lib/utils";

const NAV: { id: ViewId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Επισκόπηση διδύμου", icon: LayoutDashboard },
  { id: "monitoring", label: "Παρακολούθηση", icon: Radio },
  { id: "evaluation", label: "Αξιολόγηση κινδύνου", icon: Gauge },
  { id: "alerts", label: "Ειδοποιήσεις", icon: BellRing },
  { id: "response", label: "Απόκριση & διαχείριση", icon: ShieldCheck },
  { id: "history", label: "Ιστορικό διδύμου", icon: History },
];

export function SidebarNav({
  sim,
  onOpenScenarios,
  onOpenHelp,
  className,
}: {
  sim: Simulation;
  onOpenScenarios: () => void;
  onOpenHelp: () => void;
  className?: string;
}) {
  const { state, scenario, actions } = sim;

  const viewHasContent: Record<ViewId, boolean> = {
    overview: true,
    monitoring: state.monitoringRevealed,
    evaluation: state.evaluationRevealed,
    alerts: Boolean(state.alert),
    response: state.phase === "gate" || state.phase === "closed",
    history: state.snapshots.length > 1,
  };

  return (
    <aside
      className={cn(
        "deep-panel slim-scroll flex h-full w-full flex-col gap-5 overflow-y-auto rounded-2xl p-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand shadow-glow ring-1 ring-inset ring-primary-foreground/25">
          <Boxes className="size-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold leading-tight text-ink-foreground">
            Ψηφιακό Δίδυμο Μνημείου
          </h1>
          <p className="text-[11px] text-ink-muted">Μηχανισμός Κινδύνου & Ειδοποιήσεων</p>
        </div>
      </div>

      <div className="rounded-xl border border-ink-foreground/12 bg-ink-foreground/8 p-3.5 backdrop-blur-sm">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink-muted">
          Ενεργό σενάριο
        </div>
        <div className="mt-1.5 text-sm font-bold text-ink-foreground">{scenario.name}</div>
        <div className="text-[11px] text-ink-muted">{scenario.hazardLabel}</div>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <RiskBadge level={scenario.resultingRisk} label={`Αναμενόμενο: ${RISK_SHORT[scenario.resultingRisk]}`} />
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            variant="hero"
            size="sm"
            className="flex-1"
            onClick={actions.togglePlay}
            disabled={state.phase === "gate" || state.phase === "closed"}
          >
            {state.playing ? <Pause /> : <Play />}
            {state.playing ? "Σε εξέλιξη" : "Εκτέλεση"}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="border border-ink-foreground/20 text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
            onClick={actions.reset}
            aria-label="Επαναφορά σεναρίου"
          >
            <RotateCcw />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full border border-ink-foreground/20 text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
          onClick={onOpenScenarios}
        >
          <Shuffle /> Αλλαγή σεναρίου
        </Button>
      </div>

      <nav className="flex flex-col gap-1" aria-label="Όψεις">
        {NAV.map((item, i) => {
          const active = state.view === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => actions.setView(item.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium leading-snug transition-colors",
                active
                  ? "bg-gradient-to-r from-primary to-onto-rhdto text-primary-foreground shadow-glow"
                  : "text-ink-foreground/85 hover:bg-ink-foreground/10 hover:text-ink-foreground"
              )}
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-md text-[10px] font-bold",
                  active
                    ? "bg-primary-foreground/25 text-primary-foreground"
                    : "bg-ink-foreground/15 text-ink-foreground"
                )}
              >
                {i + 1}
              </span>
              <Icon className="size-4 shrink-0" />
              <span className="min-w-0 flex-1">{item.label}</span>
              {viewHasContent[item.id] ? (
                <span
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    active ? "bg-primary" : "bg-onto-crmdig"
                  )}
                />
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 pt-4 before:mb-4 before:block before:h-px before:w-full before:bg-gradient-to-r before:from-transparent before:via-ink-foreground/25 before:to-transparent before:content-['']">
        <label className="flex items-center justify-between gap-3 text-xs text-ink-foreground/90">
          <span className="flex items-center gap-2">
            <Presentation className="size-3.5" />
            Λειτουργία παρουσίασης
          </span>
          <Switch
            checked={state.presentation}
            onCheckedChange={actions.togglePresentation}
            aria-label="Εναλλαγή λειτουργίας παρουσίασης"
          />
        </label>
        <label className="flex items-center justify-between gap-3 text-xs text-ink-foreground/90">
          <span className="flex items-center gap-2">
            {state.soundOn ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
            Ηχητικά σήματα
          </span>
          <Switch
            checked={state.soundOn}
            onCheckedChange={actions.toggleSound}
            aria-label="Εναλλαγή ηχητικών σημάτων"
          />
        </label>
        <Button
          variant="ghost"
          size="sm"
          className="w-full border border-ink-foreground/20 text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
          onClick={onOpenHelp}
        >
          <Keyboard /> Συντομεύσεις & βοήθεια
        </Button>
      </div>
    </aside>
  );
}
