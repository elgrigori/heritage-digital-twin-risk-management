import type { OntoStep } from "../data/types";

// ---------------------------------------------------------------------------
// Η ιχνηλάτηση = η εννοιολογική ροή του Model.drawio, σε σειρά εκτέλεσης.
// Κάθε βήμα αντιστοιχεί σε κλάση του μοντέλου και στην όψη όπου εμφανίζεται.
// (Οι κωδικοί/κλάσεις παραμένουν όπως στο μοντέλο.)
// ---------------------------------------------------------------------------

export const ONTOLOGY_STEPS: OntoStep[] = [
  { id: "incoming", label: "Εισερχόμενα Δεδομένα Παρακολούθησης", clazz: "⊑ D9 Data Object (CRMdig)", layer: "CRMdig", view: "monitoring" },
  { id: "processing", label: "Επεξεργασία Δεδομένων", clazz: "⊑ HC22 Digital Operation", layer: "RHDTO", view: "monitoring" },
  { id: "processed", label: "Επεξεργασμένα Δεδομένα Δείκτη", clazz: "⊑ D9 Data Object (CRMdig)", layer: "CRMdig", view: "monitoring" },
  { id: "evaluation", label: "Αξιολόγηση Κινδύνου", clazz: "⊑ HC22 Digital Operation · έλεγχος κανόνα", layer: "RHDTO", view: "evaluation" },
  { id: "assessment", label: "Εκτίμηση Κινδύνου", clazz: "⊑ E13 Attribute Assignment", layer: "CIDOC", view: "evaluation" },
  { id: "riskstate", label: "Κατάσταση Κινδύνου (Risk State)", clazz: "⊑ E3 Condition State", layer: "CIDOC", view: "evaluation" },
  { id: "alerting", label: "Δραστηριότητα Ειδοποίησης", clazz: "⊑ E7 Activity", layer: "CIDOC", view: "alerts" },
  { id: "activation", label: "Συμβάν Ενεργοποίησης (HC14)", clazz: "⊑ E5 Event (RHDTO)", layer: "RHDTO", view: "alerts" },
  { id: "actuator", label: "Ενεργοποιητής (HC11 Actuator)", clazz: "⊑ D8 Digital Device (RHDTO)", layer: "RHDTO", view: "response" },
  { id: "management", label: "Δραστηριότητα Διαχείρισης Κινδύνου", clazz: "⊑ E7 Activity", layer: "CIDOC", view: "response" },
  { id: "action", label: "Ενέργεια Διαχείρισης", clazz: "⊑ E7 Activity", layer: "CIDOC", view: "response" },
  { id: "update", label: "Λειτουργία Ενημέρωσης Διδύμου", clazz: "⊑ HC22 Digital Operation", layer: "RHDTO", view: "history" },
  { id: "twin", label: "Ψηφιακό Δίδυμο Μνημείου (HC2)", clazz: "⊑ E89 Propositional Object (RHDTO)", layer: "RHDTO", view: "history" },
];

export const stepIndex = (id: string) =>
  ONTOLOGY_STEPS.findIndex((s) => s.id === id);
