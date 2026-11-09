import { History as HistoryIcon, ListOrdered } from "lucide-react";
import type { Simulation } from "@/state/useSimulation";
import { Panel, PanelGrid } from "@/components/domain/Panel";
import { SnapshotChain, TimelineList } from "@/components/domain/lists";
import { EmptyState, Explain, NextActionHint, OntoTag, PageHead } from "@/components/domain/primitives";

export function History({ sim }: { sim: Simulation }) {
  const { state, nextAction } = sim;
  const guided = nextAction.kind === "close";

  return (
    <div>
      <PageHead
        eyebrow="Ιστορικό διδύμου"
        title="Στιγμιότυπα & συντήρηση"
        description={
          <>
            Μετά την παρέμβαση, η Λειτουργία Ενημέρωσης Διδύμου συντηρεί το{" "}
            <OntoTag layer="RHDTO">HC2 Heritage Digital Twin</OntoTag> και καταγράφει νέο στιγμιότυπο.
          </>
        }
      />

      <Explain title="Τι συμβαίνει εδώ" className="mb-5">
        Κάθε περιστατικό αφήνει μόνιμη εγγραφή. Το δίδυμο «θυμάται» αποθηκεύοντας νέο{" "}
        <b>στιγμιότυπο</b> — την κατάσταση πριν και μετά το συμβάν — ώστε το ιστορικό του μνημείου
        να είναι πάντα ιχνηλάσιμο.
      </Explain>

      {guided ? (
        <NextActionHint label={nextAction.label} hint={nextAction.hint} className="mb-5" />
      ) : null}

      <PanelGrid cols={2}>
        <Panel title="Αλυσίδα στιγμιότυπων" icon={<HistoryIcon className="size-4" />} tone="rose">
          <SnapshotChain snapshots={state.snapshots} highlightLatest={state.incidentClosed} />
        </Panel>

        <Panel title="Χρονολόγιο περιστατικού" icon={<ListOrdered className="size-4" />} tone="teal">
          {state.timeline.length ? (
            <TimelineList events={state.timeline} />
          ) : (
            <EmptyState>Κανένα συμβάν ακόμη.</EmptyState>
          )}
        </Panel>
      </PanelGrid>
    </div>
  );
}
