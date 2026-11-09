import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactElement } from "react";
import type { ViewId } from "@/data/types";
import { useSimulation, type Simulation } from "@/state/useSimulation";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSkin } from "@/hooks/useSkin";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { TopBar } from "./TopBar";
import { SidebarNav } from "./SidebarNav";
import { CommandBar } from "./CommandBar";
import { TracePanel } from "./TracePanel";
import { ScenarioPicker } from "./ScenarioPicker";
import { HelpDialog } from "./HelpDialog";
import { Overview } from "@/views/Overview";
import { LiveMonitoring } from "@/views/LiveMonitoring";
import { RiskEvaluation } from "@/views/RiskEvaluation";
import { Alerts } from "@/views/Alerts";
import { Response } from "@/views/Response";
import { History } from "@/views/History";
import { cn } from "@/lib/utils";

const VIEWS: Record<ViewId, (sim: Simulation) => ReactElement> = {
  overview: (sim) => <Overview sim={sim} />,
  monitoring: (sim) => <LiveMonitoring sim={sim} />,
  evaluation: (sim) => <RiskEvaluation sim={sim} />,
  alerts: (sim) => <Alerts sim={sim} />,
  response: (sim) => <Response sim={sim} />,
  history: (sim) => <History sim={sim} />,
};

export function AppShell() {
  const sim = useSimulation("vandalism");
  const { state, actions } = sim;
  const reduced = useReducedMotion();
  const { skin, setSkin, skins } = useSkin();

  const [scenariosOpen, setScenariosOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [traceOpen, setTraceOpen] = useState(false);

  const openScenarios = useCallback(() => setScenariosOpen(true), []);
  const openHelp = useCallback(() => setHelpOpen(true), []);
  const openNav = useCallback(() => setNavOpen(true), []);
  const openTrace = useCallback(() => setTraceOpen(true), []);

  useKeyboardShortcuts({
    onTogglePlay: actions.togglePlay,
    onNextStep: actions.nextStep,
    onReset: actions.reset,
    onView: actions.setView,
    onHelp: openHelp,
  });


  const renderView = VIEWS[state.view] ?? VIEWS.overview;

  return (
    <div className="min-h-screen">
      <TopBar
        sim={sim}
        skins={skins}
        skin={skin}
        onSelectSkin={setSkin}
        onOpenScenarios={openScenarios}
        onOpenHelp={openHelp}
        onOpenNav={openNav}
        onOpenTrace={openTrace}
      />

      <div className="mx-auto flex w-full max-w-[1760px] gap-5 px-3 py-4 sm:px-5">
        <div className="sticky top-[72px] hidden h-[calc(100vh-96px)] w-[280px] shrink-0 lg:block">
          <SidebarNav sim={sim} onOpenScenarios={openScenarios} onOpenHelp={openHelp} />
        </div>

        <main className={cn("min-w-0 flex-1 pb-8", state.presentation && "text-[1.02rem]")}>
          <CommandBar sim={sim} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={state.view}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduced ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderView(sim)}
            </motion.div>
          </AnimatePresence>
        </main>

        {!state.presentation ? (
          <div className="sticky top-[72px] hidden h-[calc(100vh-96px)] w-[336px] shrink-0 2xl:block">
            <TracePanel sim={sim} />
          </div>
        ) : null}
      </div>

      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent
          side="left"
          className="w-[88vw] max-w-sm border-0 bg-transparent p-0 [&>button]:text-ink-foreground"
        >
          <SheetTitle className="sr-only">Πλοήγηση</SheetTitle>
          <SheetDescription className="sr-only">
            Σενάριο, όψεις και ρυθμίσεις της επίδειξης
          </SheetDescription>
          <SidebarNav
            sim={sim}
            className="h-full rounded-none"
            onOpenScenarios={() => {
              setNavOpen(false);
              setScenariosOpen(true);
            }}
            onOpenHelp={() => {
              setNavOpen(false);
              setHelpOpen(true);
            }}
          />
        </SheetContent>
      </Sheet>

      <Sheet open={traceOpen} onOpenChange={setTraceOpen}>
        <SheetContent
          side="right"
          className="w-[92vw] max-w-sm border-0 bg-transparent p-0 [&>button]:text-ink-foreground"
        >
          <SheetTitle className="sr-only">Ιχνηλάτηση οντολογίας</SheetTitle>
          <SheetDescription className="sr-only">
            Τα βήματα του εννοιολογικού μοντέλου και η κατάστασή τους
          </SheetDescription>
          <TracePanel sim={sim} className="h-full rounded-none" />
        </SheetContent>
      </Sheet>

      <ScenarioPicker
        open={scenariosOpen}
        onOpenChange={setScenariosOpen}
        currentId={state.scenarioId}
        onSelect={actions.selectScenario}
      />
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}
