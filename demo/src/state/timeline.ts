import type { Scenario, SimulationStep, Snapshot } from "../data/types";
import { ALERT_KIND } from "../data/labels";
import { addSeconds } from "./clock";

/**
 * The alerting mechanism fires whenever the risk state leaves NORMAL.
 * `>=` is intentional: a value exactly on the threshold counts as exceeded.
 */
export function thresholdExceeded(sc: Scenario) {
  return sc.dimensions.indicator >= sc.dimensions.threshold;
}

/** Clock offsets (seconds) for the operator-driven steps of the model. */
export const MANUAL_AT = { acknowledge: 15, decide: 16, trigger: 20, mitigate: 40, close: 55 };

/**
 * The event-driven timeline of one scenario: the same conceptual flow for every
 * hazard, only the instances (data, values, actions) differ. The timeline stops
 * at `gate` — everything after that point is an explicit operator decision.
 */
export function buildSteps(sc: Scenario): SimulationStep[] {
  const d = sc.dimensions;
  const level = sc.resultingRisk;
  const kind = ALERT_KIND[level === "NORMAL" ? "MEDIUM" : level];
  const exceeded = thresholdExceeded(sc);
  const prob = d.probability.toFixed(2);
  const thr = d.threshold.toFixed(2);

  return [
    {
      id: "incoming",
      label: "Λήψη δεδομένων",
      view: "monitoring",
      at: 0,
      delay: 1500,
      mark: "incoming",
      narration: `Μόλις έφτασαν νέα δεδομένα παρακολούθησης για το «${sc.heritageEntity}». Το σύστημα αρχίζει να τα διαβάζει.`,
      log: "Λήφθηκαν εισερχόμενα δεδομένα (D9)",
      timeline: { text: "Λήφθηκαν εισερχόμενα δεδομένα παρακολούθησης", kind: "info" },
      toast: { kind: "info", text: "Λήφθηκαν δεδομένα παρακολούθησης" },
      patch: () => ({ view: "monitoring", monitoringRevealed: true }),
    },
    {
      id: "processing",
      label: "Επεξεργασία",
      view: "monitoring",
      at: 2,
      delay: 1600,
      mark: "processing",
      complete: ["incoming"],
      narration:
        "Μια ψηφιακή λειτουργία επεξεργάζεται τα ακατέργαστα δεδομένα για να υπολογίσει έναν δείκτη κινδύνου.",
      log: "Ξεκίνησε η επεξεργασία δεδομένων (HC22 · L10 had input)",
    },
    {
      id: "processed",
      label: "Δείκτης έτοιμος",
      view: "monitoring",
      at: 4,
      delay: 1500,
      mark: "processed",
      complete: ["processing"],
      narration: `Έτοιμο. Ο δείκτης «${d.indicatorLabel}» = ${d.indicator.toFixed(2)}.`,
      log: "Υπολογίστηκε ο δείκτης (L11 had output → Processed Indicator Data)",
      timeline: { text: "Παρήχθη ο επεξεργασμένος δείκτης", kind: "info" },
      toast: { kind: "info", text: "Υπολογίστηκε ο δείκτης" },
      patch: () => ({ processedRevealed: true }),
    },
    {
      id: "evaluation",
      label: "Έλεγχος κανόνα",
      view: "evaluation",
      at: 5,
      delay: 1600,
      mark: "evaluation",
      complete: ["processed"],
      narration:
        "Τώρα η μηχανή ελέγχει τον δείκτη ως προς το όριο ασφαλείας — αυτός είναι ο έλεγχος κανόνα, όχι ακόμη σημασιολογική απόδοση.",
      log: "Ζητήθηκε Αξιολόγηση Κινδύνου (HC22 · έλεγχος κανόνα)",
      patch: () => ({ view: "evaluation", evaluationRevealed: true }),
    },
    {
      id: "threshold",
      label: "Αποτέλεσμα ορίου",
      view: "evaluation",
      at: 6,
      delay: 1500,
      narration: exceeded
        ? `Η τιμή ${prob} είναι πάνω από το όριο (${thr}). Πρόκειται για πραγματικό κίνδυνο.`
        : `Η τιμή ${prob} είναι κάτω από το όριο (${thr}). Καταγράφεται ως ενημερωτικό συμβάν και δεν ενεργοποιεί συναγερμό.`,
      timeline: exceeded
        ? { text: "Ξεπεράστηκε το όριο — θετικός έλεγχος κανόνα", kind: "risk" }
        : { text: "Δεν ξεπεράστηκε το όριο — ενημερωτική καταγραφή", kind: "info" },
      toast: exceeded
        ? { kind: "warning", text: "Ξεπεράστηκε το όριο κινδύνου" }
        : { kind: "info", text: "Εντός ορίου — ενημερωτική καταγραφή" },
      patch: () => ({ thresholdChecked: true }),
    },
    {
      id: "assessment",
      label: "Σημασιολογική απόδοση",
      view: "evaluation",
      at: 8,
      delay: 1500,
      mark: "assessment",
      complete: ["evaluation"],
      narration:
        "Η Εκτίμηση Κινδύνου δίνει τώρα νόημα στα δεδομένα: αποδίδει Κατάσταση Κινδύνου στο μνημείο (E13 Attribute Assignment).",
    },
    {
      id: "riskstate",
      label: "Κατάσταση κινδύνου",
      view: "evaluation",
      at: 9,
      delay: 3400,
      mark: "riskstate",
      complete: ["assessment"],
      narration: `Άλλαξε η Κατάσταση Κινδύνου: NORMAL → ${level}. Το μνημείο επισημαίνεται.`,
      timeline: { text: `Αποδόθηκε Κατάσταση Κινδύνου: NORMAL → ${level}`, kind: "risk" },
      toast: {
        kind: level === "CRITICAL" ? "danger" : "warning",
        text: `Κατάσταση Κινδύνου: ${level}`,
      },
      patch: () => ({ riskState: level, riskChanged: true }),
    },
    {
      id: "alerting",
      label: "Ειδοποίηση",
      view: "alerts",
      at: 12,
      delay: 1600,
      mark: "alerting",
      complete: ["riskstate"],
      narration: `Ο κίνδυνος είναι ${level}. ${kind.verb.charAt(0).toUpperCase() + kind.verb.slice(1)} ${kind.label} με Μήνυμα Ειδοποίησης.`,
      timeline: { text: "Δραστηριότητα Ειδοποίησης → δημιουργήθηκε Μήνυμα Ειδοποίησης", kind: "alert" },
      toast: { kind: kind.toast, text: "Δημιουργήθηκε ειδοποίηση" },
      patch: () => ({
        view: "alerts",
        alert: {
          severity: level,
          timestamp: addSeconds(sc.clockStart, 12),
          entity: sc.heritageEntity,
          hazard: sc.hazardLabel,
          riskScore: d.riskScore,
          message: sc.alertMessage,
          status: "ACTIVE",
        },
      }),
    },
    {
      id: "activation",
      label: "Συμβάν ενεργοποίησης",
      view: "alerts",
      at: 13,
      delay: 4200,
      mark: "activation",
      complete: ["alerting"],
      narration:
        "Το Συμβάν Ενεργοποίησης (HC14) ενεργοποιεί τους μηχανισμούς. Από εδώ και πέρα η ροή περιμένει ανθρώπινη απόφαση.",
    },
    {
      id: "await",
      label: "Απόφαση χειριστή",
      view: "response",
      at: 17,
      delay: 0,
      complete: ["activation"],
      gate: true,
      narration:
        "Σειρά σου: ενεργοποίησε την αυτόματη απόκριση, άσε την ομάδα να εφαρμόσει μέτρα και κλείσε το περιστατικό.",
      timeline: { text: "Αναμονή απόφασης χειριστή", kind: "info" },
      toast: { kind: "info", text: "Η ροή περιμένει την απόφασή σου" },
      patch: () => ({ view: "response" }),
    },
  ];
}

/** Snapshot written to the digital twin when the incident is closed. */
export function incidentSnapshotFor(sc: Scenario): Snapshot {
  return { ...sc.incidentSnapshot, timestamp: addSeconds(sc.clockStart, MANUAL_AT.close) };
}
