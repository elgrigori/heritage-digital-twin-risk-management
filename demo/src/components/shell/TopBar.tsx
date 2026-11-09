import {
  BellRing,
  CircleHelp,
  ListTree,
  Menu,
  Presentation,
  Shuffle,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { Simulation } from "@/state/useSimulation";
import { RISK_SHORT } from "@/data/labels";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RiskBadge } from "@/components/domain/primitives";
import { SkinSwitcher } from "./SkinSwitcher";
import type { Skin, SkinId } from "@/theme/skins";
import { cn } from "@/lib/utils";

function IconAction({
  label,
  onClick,
  children,
  active,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={active ? "soft" : "ghost"}
          size="icon-sm"
          onClick={onClick}
          aria-label={label}
          className="text-muted-foreground hover:text-foreground"
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

const RISK_ACCENT: Record<string, string> = {
  NORMAL: "from-risk-normal via-onto-crmdig to-onto-cidoc",
  MEDIUM: "from-risk-medium via-risk-high to-risk-medium",
  HIGH: "from-risk-medium via-risk-high to-risk-critical",
  CRITICAL: "from-risk-critical via-onto-rhdto to-risk-critical",
};

export function TopBar({
  sim,
  skins,
  skin,
  onSelectSkin,
  onOpenScenarios,
  onOpenHelp,
  onOpenNav,
  onOpenTrace,
  className,
}: {
  sim: Simulation;
  skins: Skin[];
  skin: SkinId;
  onSelectSkin: (id: SkinId) => void;
  onOpenScenarios: () => void;
  onOpenHelp: () => void;
  onOpenNav: () => void;
  onOpenTrace: () => void;
  className?: string;
}) {
  const { state, scenario, actions, progress } = sim;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl",
        className
      )}
    >
      <div
        className={cn(
          "h-[3px] w-full bg-gradient-to-r transition-[background-image] duration-700",
          RISK_ACCENT[state.riskState]
        )}
      />
      <div className="mx-auto flex w-full max-w-[1760px] items-center gap-3 px-3 py-2.5 sm:px-5">
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={onOpenNav}
          aria-label="Άνοιγμα πλοήγησης"
        >
          <Menu />
        </Button>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="hidden min-w-0 lg:block">
            <div className="truncate text-sm font-bold">{scenario.heritageEntity}</div>
            <div className="truncate text-[11px] text-muted-foreground">{scenario.name}</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="max-w-[46vw] truncate border-primary/25 bg-brand-soft hover:border-primary/50 hover:text-primary lg:max-w-none"
            onClick={onOpenScenarios}
          >
            <Shuffle />
            <span className="truncate">{scenario.name}</span>
          </Button>
          <RiskBadge
            level={state.riskState}
            label={RISK_SHORT[state.riskState]}
            className="hidden sm:inline-flex"
          />
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs md:flex">
          <BellRing className="size-3.5 text-primary" />
          <span className="font-semibold tabular">
            {progress.done}/{progress.total}
          </span>
          <span className="text-muted-foreground">βήματα οντολογίας</span>
        </div>

        <div className="flex items-center gap-0.5">
          <SkinSwitcher skins={skins} skin={skin} onSelect={onSelectSkin} />
          <IconAction
            label={state.soundOn ? "Σίγαση ηχητικών σημάτων" : "Ενεργοποίηση ηχητικών σημάτων"}
            onClick={actions.toggleSound}
            active={state.soundOn}
          >
            {state.soundOn ? <Volume2 /> : <VolumeX />}
          </IconAction>
          <IconAction
            label="Λειτουργία παρουσίασης"
            onClick={actions.togglePresentation}
            active={state.presentation}
          >
            <Presentation />
          </IconAction>
          <IconAction label="Ιχνηλάτηση οντολογίας" onClick={onOpenTrace}>
            <ListTree />
          </IconAction>
          <IconAction label="Βοήθεια & συντομεύσεις" onClick={onOpenHelp}>
            <CircleHelp />
          </IconAction>
        </div>
      </div>
    </header>
  );
}
