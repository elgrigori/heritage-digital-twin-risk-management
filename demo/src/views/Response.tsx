import { Check, CheckCircle2, Users, Wrench, Zap } from "lucide-react";
import type { ResponseAction } from "@/data/types";
import type { Simulation } from "@/state/useSimulation";
import { Panel, PanelGrid } from "@/components/domain/Panel";
import { Explain, NextActionHint, OntoTag, PageHead } from "@/components/domain/primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ActionRow({ action, done }: { action: ResponseAction; done: boolean }) {
  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors",
        done ? "border-risk-normal/40 bg-risk-normal-soft/50" : "border-border bg-muted/30"
      )}
    >
      <span
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-md border",
          done
            ? "border-transparent bg-gradient-to-br from-risk-normal to-onto-crmdig text-primary-foreground"
            : "border-border"
        )}
      >
        {done ? <Check className="size-3" /> : null}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold">{action.label}</span>
        <span className="block font-mono text-[11px] text-muted-foreground">{action.detail}</span>
      </span>
    </li>
  );
}

export function Response({ sim }: { sim: Simulation }) {
  const { state, scenario, flags, actions, nextAction } = sim;
  const guided = ["trigger", "mitigate", "close"].includes(nextAction.kind);

  return (
    <div>
      <PageHead
        eyebrow="Απόκριση & διαχείριση κινδύνου"
        title="Αυτόματη απόκριση και ανθρώπινη διαχείριση — διακριτές"
        description="Η αυτόματη απόκριση είναι ψηφιακή λειτουργία CRMdig· η διαχείριση κινδύνου είναι ανθρώπινη δραστηριότητα E7. Οι αποφάσεις του χειριστή είναι πάντα χειροκίνητες."
      />

      <Explain title="Κάνε αυτά, με τη σειρά" className="mb-5">
        <b>1.</b> Ενεργοποίησε την <b>αυτόματη απόκριση</b> — οι μηχανισμοί δρουν άμεσα (συναγερμός,
        πύλη). <b>2.</b> Άσε την <b>ομάδα να εφαρμόσει μέτρα</b> — η ανθρώπινη πλευρά. <b>3.</b>{" "}
        <b>Κλείσε το περιστατικό</b> για να γραφτεί νέο στιγμιότυπο του διδύμου. Οι δύο πλευρές είναι
        σκόπιμα χωριστές: η μία αυτόματη, η άλλη χρειάζεται ανθρώπους.
      </Explain>

      {guided ? (
        <NextActionHint label={nextAction.label} hint={nextAction.hint} className="mb-5" />
      ) : null}

      <PanelGrid cols={2} className="mb-4">
        <Panel
          title="Αυτόματη απόκριση"
          sub="HC14 Activation Event → HP15 activated → HC11 Actuator"
          icon={<Zap className="size-4" />}
          tone="amber"
        >
          <ul className="mb-4 space-y-2">
            {scenario.automatedActions.map((action) => (
              <ActionRow key={action.label} action={action} done={state.automatedTriggered} />
            ))}
          </ul>
          <Button
            variant={state.automatedTriggered ? "done" : "warn"}
            className="h-auto w-full whitespace-normal py-2.5 text-center leading-tight sm:w-auto"
            disabled={!flags.canTrigger}
            onClick={actions.triggerAutomated}
          >
            <Zap />
            {state.automatedTriggered
              ? "Η αυτόματη απόκριση εκτελέστηκε"
              : "Ενεργοποίηση αυτόματης απόκρισης"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Ο <OntoTag layer="RHDTO">HC11 Actuator</OntoTag> λαμβάνει την ειδοποίηση ως ψηφιακή
            είσοδο (L10 had input → Alert Message).
          </p>
        </Panel>

        <Panel
          title="Ανθρώπινη / διαχειριστική απόκριση"
          sub="Risk Management Activity ⊑ E7 · Management Action ⊑ E7"
          icon={<Users className="size-4" />}
          tone="brand"
        >
          <ul className="mb-4 space-y-2">
            {scenario.managementActions.map((action) => (
              <ActionRow key={action.label} action={action} done={state.mitigationApplied} />
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={state.mitigationApplied ? "done" : "go"}
              className="h-auto whitespace-normal py-2.5 text-center leading-tight"
              disabled={!flags.canMitigate}
              onClick={actions.applyMitigation}
            >
              <Wrench />
              {state.mitigationApplied ? "Τα μέτρα εφαρμόστηκαν" : "Εφαρμογή μέτρων μετριασμού"}
            </Button>
            <Button
              variant={state.incidentClosed ? "done" : "hero"}
              className="h-auto whitespace-normal py-2.5 text-center leading-tight"
              disabled={!flags.canClose}
              onClick={actions.closeIncident}
            >
              <CheckCircle2 />
              {state.incidentClosed ? "Το περιστατικό έκλεισε" : "Κλείσιμο περιστατικού"}
            </Button>
          </div>
          {!flags.canClose && !state.incidentClosed ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Το κλείσιμο ενεργοποιείται μετά από αυτόματη απόκριση ή εφαρμογή μέτρων — το δίδυμο
              ενημερώνεται μόνο μετά από παρέμβαση.
            </p>
          ) : null}
        </Panel>
      </PanelGrid>

      <Panel title="Γιατί είναι χωριστές" tone="plain">
        <div className="grid gap-5 lg:grid-cols-2">
          <p className="text-sm text-muted-foreground">
            <b>Αυτόματη απόκριση</b> — εκτέλεση μηχανής (HC14 → HC11 Actuator). Άμεση,
            ντετερμινιστική, χωρίς ανθρώπινη απόφαση.
          </p>
          <p className="text-sm text-muted-foreground">
            <b>Ανθρώπινη διαχείριση κινδύνου</b> — δραστηριότητα E7 που εκτελείται από την ομάδα
            (E74 Group). Οι αποφάσεις και τα μέτρα γίνονται από ανθρώπους· το κλείσιμο του
            περιστατικού ενεργοποιεί τη συντήρηση του διδύμου.
          </p>
        </div>
      </Panel>
    </div>
  );
}
