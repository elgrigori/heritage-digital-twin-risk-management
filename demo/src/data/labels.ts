import type { AlertStatus, HazardKind, RiskLevel, ToastKind } from "./types";

export const RISK_LABEL: Record<RiskLevel, string> = {
  NORMAL: "ΚΑΝΟΝΙΚΟ",
  MEDIUM: "ΜΕΤΡΙΟ",
  HIGH: "ΥΨΗΛΟ",
  CRITICAL: "ΚΡΙΣΙΜΟ",
};

export const RISK_SHORT: Record<RiskLevel, string> = {
  NORMAL: "Κανονικό",
  MEDIUM: "Μέτριο",
  HIGH: "Υψηλό",
  CRITICAL: "Κρίσιμο",
};

export const STATUS_LABEL: Record<AlertStatus, string> = {
  ACTIVE: "ΕΝΕΡΓΗ",
  ACKNOWLEDGED: "ΕΠΙΒΕΒΑΙΩΜΕΝΗ",
  "IN RESPONSE": "ΣΕ ΑΠΟΚΡΙΣΗ",
  CLOSED: "ΕΚΛΕΙΣΕ",
};

export const STATUS_LABEL_SHORT: Record<AlertStatus, string> = {
  ACTIVE: "Ενεργή",
  ACKNOWLEDGED: "Επιβεβαιωμένη",
  "IN RESPONSE": "Σε απόκριση",
  CLOSED: "Έκλεισε",
};

export const HAZARD_LABEL: Record<HazardKind, string> = {
  anthropogenic: "Ανθρωπογενής",
  natural: "Φυσικός",
};

/**
 * The alerting mechanism reacts to MEDIUM / HIGH / CRITICAL risk states.
 * The wording follows the severity so the message stays factually correct.
 */
export const ALERT_KIND: Record<
  Exclude<RiskLevel, "NORMAL">,
  { label: string; verb: string; toast: ToastKind }
> = {
  MEDIUM: { label: "ενημερωτική ειδοποίηση", verb: "καταγράφεται", toast: "info" },
  HIGH: { label: "προειδοποίηση", verb: "εκδίδεται", toast: "warning" },
  CRITICAL: { label: "συναγερμός", verb: "εκδίδεται", toast: "danger" },
};

export const alertKindFor = (level: RiskLevel) =>
  level === "NORMAL" ? ALERT_KIND.MEDIUM : ALERT_KIND[level];
