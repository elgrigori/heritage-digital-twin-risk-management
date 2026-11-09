import { Cpu, Database, Radio } from "lucide-react";
import type { Simulation } from "@/state/useSimulation";
import { Panel, PanelGrid } from "@/components/domain/Panel";
import { FlowArrow, FlowNode, FlowStack } from "@/components/domain/Flow";
import { ProcessingLog } from "@/components/domain/lists";
import { EmptyState, Explain, KV, OntoTag, PageHead } from "@/components/domain/primitives";

export function LiveMonitoring({ sim }: { sim: Simulation }) {
  const { state, scenario } = sim;
  const processing = state.monitoringRevealed && !state.processedRevealed;

  return (
    <div>
      <PageHead
        eyebrow="Ζωντανή παρακολούθηση"
        title="Εισερχόμενα δεδομένα & ψηφιακή επεξεργασία"
        description="Ο μηχανισμός ξεκινά από τα εισερχόμενα ψηφιακά δεδομένα — όχι από τον φυσικό αισθητήρα."
      />

      <Explain title="Τι συμβαίνει εδώ" className="mb-5">
        Οι ακατέργαστες μετρήσεις φτάνουν αριστερά. Μια ψηφιακή λειτουργία τις μετατρέπει σε έναν
        μοναδικό, ουσιαστικό <b>δείκτη</b> δεξιά (π.χ. μια πιθανότητα). Σαν να μετατρέπεις τα
        «θορυβώδη» δεδομένα αισθητήρων σε έναν αριθμό που το σύστημα μπορεί να επεξεργαστεί.
      </Explain>

      <PanelGrid cols={2} className="mb-4">
        <Panel
          title="Εισερχόμενα δεδομένα παρακολούθησης"
          sub="⊑ D9 Data Object (CRMdig)"
          icon={<Radio className="size-4" />}
          tone="teal"
        >
          {state.monitoringRevealed ? (
            <dl>
              {scenario.incomingData.map((f) => (
                <KV key={f.label} k={f.label} v={f.value} mono />
              ))}
            </dl>
          ) : (
            <EmptyState>Αναμονή εισερχόμενων δεδομένων…</EmptyState>
          )}
        </Panel>

        <Panel
          title="Επεξεργασμένα δεδομένα δείκτη"
          sub="⊑ D9 Data Object (CRMdig)"
          icon={<Database className="size-4" />}
          tone="brand"
        >
          {state.processedRevealed ? (
            <dl>
              {scenario.processedIndicators.map((f) => (
                <KV key={f.label} k={f.label} v={f.value} mono />
              ))}
            </dl>
          ) : processing ? (
            <EmptyState className="text-primary">
              <span className="inline-flex items-center gap-2 animate-soft-pulse">
                <Cpu className="size-4" /> Επεξεργασία δεδομένων…
              </span>
            </EmptyState>
          ) : (
            <EmptyState>Δεν έχει υπολογιστεί ακόμη δείκτης.</EmptyState>
          )}
        </Panel>
      </PanelGrid>

      <PanelGrid cols={2}>
        <Panel title="Εννοιολογική ροή" sub="ψηφιακή λειτουργία CRMdig" tone="amber">
          <FlowStack>
            <FlowNode
              title="Εισερχόμενα δεδομένα παρακολούθησης"
              sub="⊑ D9 Data Object"
              hot={state.currentStep === "incoming"}
              tag={<OntoTag layer="CRMdig">D9</OntoTag>}
            />
            <FlowArrow label="L10 had input" />
            <FlowNode
              title="Επεξεργασία δεδομένων"
              sub="⊑ HC22 Digital Operation"
              hot={state.currentStep === "processing"}
              tag={<OntoTag layer="RHDTO">HC22</OntoTag>}
            />
            <FlowArrow label="L11 had output" />
            <FlowNode
              title="Επεξεργασμένα δεδομένα δείκτη"
              sub="⊑ D9 Data Object"
              hot={state.currentStep === "processed"}
              tag={<OntoTag layer="CRMdig">D9</OntoTag>}
            />
          </FlowStack>
        </Panel>

        <Panel title="Αρχείο επεξεργασίας" sub="ψηφιακές λειτουργίες σε χρόνο εκτέλεσης" tone="plain">
          <ProcessingLog logs={state.logs} />
        </Panel>
      </PanelGrid>
    </div>
  );
}
