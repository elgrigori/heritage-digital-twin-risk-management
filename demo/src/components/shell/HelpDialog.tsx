import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SHORTCUTS } from "@/hooks/useKeyboardShortcuts";
import { OntoTag } from "@/components/domain/primitives";

const FLOW = [
  "Εισερχόμενα δεδομένα παρακολούθησης (D9)",
  "Επεξεργασία δεδομένων (HC22) → δείκτης",
  "Αξιολόγηση κινδύνου — έλεγχος κανόνα",
  "Εκτίμηση κινδύνου (E13) → Κατάσταση Κινδύνου (E3)",
  "Ειδοποίηση (E7) → Συμβάν ενεργοποίησης (HC14) → Μήνυμα (D1)",
  "Αυτόματη απόκριση (HC11 Actuator) | Ανθρώπινη διαχείριση (E7)",
  "Ενημέρωση διδύμου (HC22) → νέο στιγμιότυπο (HC2)",
];

export function HelpDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Πώς λειτουργεί η επίδειξη</DialogTitle>
          <DialogDescription>
            Μία ροή, δύο ρόλοι: το σύστημα δρα αυτόματα, ο άνθρωπος αποφασίζει. Η ιχνηλάτηση δεξιά
            δείχνει σε ποιο σημείο του εννοιολογικού μοντέλου βρίσκεσαι.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <section>
            <h3 className="mb-2 text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
              Συντομεύσεις πληκτρολογίου
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {SHORTCUTS.map((s) => (
                <li key={s.keys} className="flex items-center gap-3 text-sm">
                  <kbd className="min-w-14 rounded-md border border-border bg-muted px-2 py-1 text-center font-mono text-[11px] font-bold">
                    {s.keys}
                  </kbd>
                  <span className="text-muted-foreground">{s.label}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
              Εννοιολογική ροή
            </h3>
            <ol className="space-y-1.5 text-sm text-muted-foreground">
              {FLOW.map((line, i) => (
                <li key={line} className="flex gap-2">
                  <span className="font-mono text-[11px] text-primary">{i + 1}.</span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
              Επίπεδα οντολογίας
            </h3>
            <div className="flex flex-wrap gap-2">
              <OntoTag layer="CRMdig">D9 · D1 · D8 — CRMdig</OntoTag>
              <OntoTag layer="CIDOC">E3 · E5 · E7 · E13 — CIDOC-CRM</OntoTag>
              <OntoTag layer="RHDTO">HC2 · HC11 · HC14 · HC22 — RHDTO v1.2</OntoTag>
            </div>
          </section>

          <p className="rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            Όλα τα δεδομένα είναι προσομοιωμένα για την παρουσίαση της διπλωματικής. Οι αποφάσεις
            (επιβεβαίωση, ενεργοποίηση, μέτρα, κλείσιμο) γίνονται πάντα χειροκίνητα.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
