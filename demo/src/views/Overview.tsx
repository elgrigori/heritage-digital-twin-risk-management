import { Activity, BellRing, Camera, Wrench } from "lucide-react";
import type { Simulation } from "@/state/useSimulation";
import { RISK_SHORT, STATUS_LABEL_SHORT } from "@/data/labels";
import { Panel, PanelGrid } from "@/components/domain/Panel";
import { RiskHero } from "@/components/domain/RiskHero";
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

export function Overview({ sim }: { sim: Simulation }) {
  const { state, scenario, nextAction } = sim;
  const lastSnap = state.snapshots[state.snapshots.length - 1];
  const indicator = scenario.processedIndicators[0];
  const guided = ["trigger", "mitigate", "close"].includes(nextAction.kind);

  return (
    <div>
      <PageHead
        eyebrow="Επισκόπηση ψηφιακού διδύμου"
        title={`${scenario.heritageEntity} — ψηφιακό δίδυμο μνημείου`}
        description={`Συνοπτική εικόνα της κατάστασης του διδύμου. Πλαίσιο κινδύνου: ${scenario.hazardLabel}.`}
      />

      <Explain title="Τι βλέπεις εδώ" className="mb-5">
        Αυτό είναι το ζωντανό «ψηφιακό αντίγραφο» του {scenario.heritageEntity}. Δείχνει πάντα ένα
        πράγμα με μια ματιά — <b>πόσο ασφαλές είναι το μνημείο τώρα</b>. Πάτησε{" "}
        <b>Εκτέλεση σεναρίου</b> και δες την κατάσταση να αλλάζει καθώς τα δεδομένα περνούν από τον
        μηχανισμό.
      </Explain>

      {guided ? (
        <NextActionHint label={nextAction.label} hint={nextAction.hint} className="mb-5" />
      ) : null}

      <div className="mb-4 grid gap-4 lg:grid-cols-2 2xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <RiskHero
          level={state.riskState}
          entity={scenario.heritageEntity}
          hazard={scenario.hazardLabel}
          changed={state.riskChanged}
          className="lg:row-span-2 2xl:row-span-1"
        />

        <Panel title="Τρέχων κίνδυνος" sub="πλαίσιο απειλής" icon={<Activity className="size-4" />} tone="teal">
          <dl>
            <KV k="Τύπος κινδύνου" v={scenario.hazardLabel} />
            <KV k="Πηγή παρακολούθησης" v={scenario.monitoringSource} />
            <KV k="Κλάση μοντέλου" v={<OntoTag layer="RHDTO">HC2 Heritage Digital Twin</OntoTag>} />
          </dl>
        </Panel>

        <Panel
          title="Ενεργή ειδοποίηση"
          sub={state.alert ? state.alert.timestamp : "δεν έχει εκδοθεί"}
          icon={<BellRing className="size-4" />}
          tone="amber"
        >
          {state.alert ? (
            <dl>
              <KV k="Σοβαρότητα" v={<RiskBadge level={state.alert.severity} />} />
              <KV k="Κατάσταση" v={<StatusPill status={state.alert.status} />} />
              <KV
                k="Βαθμός κινδύνου"
                v={`${state.alert.riskScore.toFixed(1)} / 10`}
                mono
              />
            </dl>
          ) : (
            <EmptyState>
              Καμία ενεργή ειδοποίηση. Εκτέλεσε το σενάριο για να ξεκινήσει ο μηχανισμός.
            </EmptyState>
          )}
        </Panel>
      </div>

      <PanelGrid cols={2}>
        <Panel title="Παρακολούθηση & δείκτης" icon={<Camera className="size-4" />} tone="brand">
          <dl>
            <KV
              k="Τελευταία εισερχόμενη τιμή"
              v={
                state.monitoringRevealed
                  ? `${scenario.incomingData[0].label}: ${scenario.incomingData[0].value}`
                  : "—"
              }
            />
            <KV
              k="Τελευταίος δείκτης"
              v={state.processedRevealed ? `${indicator.label} = ${indicator.value}` : "—"}
              mono
            />
            <KV
              k="Βεβαιότητα εντοπισμού"
              v={`${(scenario.dimensions.confidence * 100).toFixed(0)}%`}
            />
          </dl>
        </Panel>

        <Panel title="Στιγμιότυπο διδύμου" icon={<Wrench className="size-4" />} tone="rose">
          <dl>
            <KV k="Τελευταίο στιγμιότυπο" v={lastSnap.id} mono />
            <KV k="Κατάσταση στιγμιότυπου" v={<RiskBadge level={lastSnap.riskState} />} />
            <KV
              k="Τελευταία ενημέρωση"
              v={state.incidentClosed ? lastSnap.timestamp ?? "μόλις τώρα" : "αρχική κατάσταση"}
            />
            <KV k="Αναμενόμενη κατάσταση" v={RISK_SHORT[scenario.resultingRisk]} />
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            Κατάσταση ειδοποίησης: {state.alert ? STATUS_LABEL_SHORT[state.alert.status] : "—"}
          </p>
        </Panel>
      </PanelGrid>
    </div>
  );
}
