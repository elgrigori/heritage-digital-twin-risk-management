import { ArrowRight, Gauge } from "lucide-react";
import type { Simulation } from "@/state/useSimulation";
import { thresholdExceeded } from "@/state/timeline";
import { Panel, PanelGrid } from "@/components/domain/Panel";
import { Meter, ThresholdVerdict } from "@/components/domain/Meter";
import { FlowNode, FlowStack } from "@/components/domain/Flow";
import { EmptyState, Explain, KV, MiniLabel, OntoTag, PageHead, RiskBadge } from "@/components/domain/primitives";

export function RiskEvaluation({ sim }: { sim: Simulation }) {
  const { state, scenario } = sim;
  const d = scenario.dimensions;
  const exceeded = thresholdExceeded(scenario);
  const assessed =
    state.doneSteps.includes("assessment") ||
    state.currentStep === "riskstate" ||
    state.riskChanged;

  return (
    <div>
      <PageHead
        eyebrow="Αξιολόγηση κινδύνου"
        title="Πρώτα ο έλεγχος κανόνα, μετά η σημασιολογική απόδοση"
        description={
          <>
            Η <b>Αξιολόγηση Κινδύνου</b> κάνει τον ψηφιακό έλεγχο κανόνα. Η <b>Εκτίμηση Κινδύνου</b>{" "}
            κάνει τη σημασιολογική απόδοση της Κατάστασης Κινδύνου — παραμένουν διακριτές.
          </>
        }
      />

      <Explain title="Η βασική ιδέα αυτής της οθόνης" className="mb-5">
        Δύο διαφορετικές δουλειές, σκόπιμα. <b>Αριστερά:</b> μια μηχανή απλώς ρωτά «ξεπέρασε ο
        αριθμός το όριο;». <b>Δεξιά:</b> μόλις το αποτέλεσμα κριθεί σημαντικό, το σύστημα{" "}
        <b>αποφασίζει τι σημαίνει</b> και αποδίδει στο μνημείο μια Κατάσταση Κινδύνου. Στο μοντέλο
        είναι δύο ξεχωριστά πράγματα.
      </Explain>

      <PanelGrid cols={2} className="mb-4">
        <Panel
          title="Αξιολόγηση κινδύνου"
          sub="⊑ HC22 Digital Operation · έλεγχος κανόνα"
          icon={<Gauge className="size-4" />}
          tone="teal"
        >
          {state.evaluationRevealed ? (
            <div className="space-y-4">
              <div>
                <MiniLabel className="mb-2">Δείκτης: {d.indicatorLabel}</MiniLabel>
                <Meter value={d.indicator} threshold={d.threshold} exceeded={exceeded} />
              </div>
              <dl>
                <KV k="Βεβαιότητα" v={d.confidence.toFixed(2)} mono />
                <KV k="Βαθμός κινδύνου" v={`${d.riskScore.toFixed(1)} / 10`} mono />
              </dl>
              <div>
                {state.thresholdChecked ? (
                  <ThresholdVerdict exceeded={exceeded} />
                ) : (
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground animate-soft-pulse">
                    Έλεγχος δείκτη ως προς το όριο…
                  </span>
                )}
              </div>
            </div>
          ) : (
            <EmptyState>Αναμονή επεξεργασμένου δείκτη.</EmptyState>
          )}
        </Panel>

        <Panel
          title="Εκτίμηση κινδύνου"
          sub="⊑ E13 Attribute Assignment"
          icon={<ArrowRight className="size-4" />}
          tone="rose"
        >
          {assessed ? (
            <div className="space-y-4">
              <FlowStack>
                <FlowNode
                  title="Εκτίμηση κινδύνου"
                  sub="σημασιολογική απόδοση (E13)"
                  hot
                  tag={<OntoTag layer="CIDOC">E13</OntoTag>}
                />
              </FlowStack>
              <dl>
                <KV k="P140 assigned attribute to" v={scenario.heritageEntity} />
                <KV k="P141 assigned" v={<RiskBadge level={scenario.resultingRisk} />} />
                <KV k="P141 assigned (βαθμός)" v={d.riskScore.toFixed(1)} mono />
              </dl>
            </div>
          ) : (
            <EmptyState>
              Η Εκτίμηση Κινδύνου εκτελείται αφού ολοκληρωθεί ο έλεγχος κανόνα.
            </EmptyState>
          )}
        </Panel>
      </PanelGrid>

      <Panel title="Η διάκριση διατηρείται" tone="plain">
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <MiniLabel className="mb-1.5">Έλεγχος κανόνα (υπολογιστικός)</MiniLabel>
            <p className="text-sm text-muted-foreground">
              Η Αξιολόγηση Κινδύνου είναι <OntoTag layer="RHDTO">HC22 Digital Operation</OntoTag> —
              υπολογίζει αν ο δείκτης ξεπερνά το όριο. Δεν αποδίδεται σημασιολογία ακόμη.
            </p>
          </div>
          <div>
            <MiniLabel className="mb-1.5">Σημασιολογική απόδοση</MiniLabel>
            <p className="text-sm text-muted-foreground">
              Η Εκτίμηση Κινδύνου είναι <OntoTag layer="CIDOC">E13 Attribute Assignment</OntoTag> —
              αποδίδει νέα <b>Κατάσταση Κινδύνου</b> (⊑ E3 Condition State) στο μνημείο.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
