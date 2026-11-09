import { ArrowRightCircle, BellRing, Check } from "lucide-react";
import type { Simulation } from "@/state/useSimulation";
import { alertKindFor } from "@/data/labels";
import { Panel, PanelGrid } from "@/components/domain/Panel";
import { FlowArrow, FlowNode, FlowStack } from "@/components/domain/Flow";
import {
  EmptyState,
  Explain,
  KV,
  NextActionHint,
  OntoTag,
  PageHead,
  RiskBadge,
  StatusPill,
} from "@/components/domain/primitives";
import { Button } from "@/components/ui/button";

export function Alerts({ sim }: { sim: Simulation }) {
  const { state, scenario, actions, nextAction } = sim;
  const alert = state.alert;
  const kind = alertKindFor(scenario.resultingRisk);
  const acknowledged = alert ? alert.status !== "ACTIVE" : false;

  return (
    <div>
      <PageHead
        eyebrow="Ειδοποιήσεις"
        title="Δημιουργία μηνύματος ειδοποίησης"
        description={`Ο μηχανισμός ειδοποίησης αντιδρά όταν η Κατάσταση Κινδύνου φύγει από το ΚΑΝΟΝΙΚΟ. Σε αυτό το σενάριο: ${kind.label}.`}
      />

      <Explain title="Τι συμβαίνει εδώ" className="mb-5">
        Ο κίνδυνος άλλαξε κατάσταση, οπότε το σύστημα κατέγραψε επίσημο <b>Μήνυμα Ειδοποίησης</b>.
        Το <b>Επιβεβαίωση</b> λέει απλώς «το είδα» — τίποτα άλλο δεν αλλάζει. Το <b>Απόφαση</b>{" "}
        είναι η επιλογή σου να δράσεις και ανοίγει την οθόνη απόκρισης.
      </Explain>

      {!alert ? (
        <Panel tone="plain">
          <EmptyState>
            Καμία ειδοποίηση ακόμη. Δημιουργείται μετά τη μεταβολή της Κατάστασης Κινδύνου.
          </EmptyState>
          <NextActionHint
            label={nextAction.label}
            hint={nextAction.hint}
            className="mx-auto mt-2 max-w-xl"
          />
        </Panel>
      ) : (
        <PanelGrid cols={2}>
          <Panel title="Ειδοποίηση" sub={alert.timestamp} icon={<BellRing className="size-4" />} tone="amber">
            <dl>
              <KV k="Σοβαρότητα" v={<RiskBadge level={alert.severity} />} />
              <KV k="Μνημείο" v={alert.entity} />
              <KV k="Κίνδυνος" v={alert.hazard} />
              <KV k="Βαθμός κινδύνου" v={`${alert.riskScore.toFixed(1)} / 10`} mono />
              <KV k="Κατάσταση" v={<StatusPill status={alert.status} />} />
            </dl>
            <p className="mt-3 rounded-xl bg-risk-critical-soft p-3 text-sm font-semibold text-risk-critical">
              {alert.message}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant={acknowledged ? "done" : "outline"} onClick={actions.acknowledgeAlert}>
                <Check />
                {acknowledged ? "Επιβεβαιώθηκε" : "Επιβεβαίωση"}
              </Button>
              <Button variant="hero" onClick={actions.openDecision}>
                <ArrowRightCircle />
                Απόφαση
              </Button>
            </div>
          </Panel>

          <Panel title="Σημασιολογικό μοτίβο" sub="πώς δημιουργείται η ειδοποίηση" tone="rose">
            <FlowStack>
              <FlowNode
                title="Δραστηριότητα ειδοποίησης"
                sub="⊑ E7 Activity"
                hot={state.currentStep === "alerting"}
                tag={<OntoTag layer="CIDOC">E7</OntoTag>}
              />
              <FlowArrow label="P9 consists of" />
              <FlowNode
                title="Συμβάν ενεργοποίησης (HC14)"
                sub="⊑ E5 Event"
                hot={state.currentStep === "activation"}
                tag={<OntoTag layer="RHDTO">HC14</OntoTag>}
              />
              <FlowArrow label="P94 has created" />
              <FlowNode
                title="Μήνυμα ειδοποίησης"
                sub="⊑ D1 Digital Object"
                tag={<OntoTag layer="CRMdig">D1</OntoTag>}
              />
            </FlowStack>
            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
              <li>
                Η επιβεβαίωση ενημερώνει μόνο την κατάσταση της ειδοποίησης — δεν αλλάζει όψη. Η
                «Απόφαση» είναι ρητή επιλογή ροής και ανοίγει την οθόνη απόκρισης.
              </li>
              <li>
                Σύνδεση έγκαιρης προειδοποίησης (ανθρωπογενές): <b>P120 / P183 ends before the start
                of</b> το συμβάν —{" "}
                {scenario.hazardType === "anthropogenic"
                  ? "ισχύει εδώ."
                  : "δεν χρησιμοποιείται για αυτόν τον φυσικό κίνδυνο."}
              </li>
            </ul>
          </Panel>
        </PanelGrid>
      )}
    </div>
  );
}
