// ---------------------------------------------------------------------------
// Domain types for the Heritage Digital Twin risk & alerting demo.
// Terminology follows the supplied conceptual model (RHDTO v1.2 + CRMdig + CIDOC-CRM).
// ---------------------------------------------------------------------------

export type RiskLevel = "NORMAL" | "MEDIUM" | "HIGH" | "CRITICAL";

export type HazardKind = "anthropogenic" | "natural";

export type ViewId =
  | "overview"
  | "monitoring"
  | "evaluation"
  | "alerts"
  | "response"
  | "history";

/** One field of the incoming digital monitoring data (D9 Data Object). */
export interface MonitoringField {
  label: string;
  value: string;
}

/** A single processing-log line shown in Live Monitoring. */
export interface LogLine {
  t: string; // clock time, e.g. "22:31:14"
  text: string;
}

/** E54 Dimension values produced during evaluation. */
export interface EvaluationDimensions {
  indicatorLabel: string; // name of the processed indicator (e.g. vandalism_probability)
  indicator: number; // 0..1
  threshold: number; // 0..1
  probability: number; // 0..1
  confidence: number; // 0..1
  riskScore: number; // 0..10
}

export interface ResponseAction {
  label: string;
  detail: string;
}

/** HC11 Digital Twin snapshot (updated Heritage Digital Twin). */
export interface Snapshot {
  id: string;
  title: string;
  baseline?: boolean;
  riskState: RiskLevel;
  incident?: string;
  managementAction?: string;
  damageState?: string;
  info?: string;
  timestamp?: string;
}

export interface Scenario {
  id: string;
  name: string;
  hazardType: HazardKind;
  hazardLabel: string; // e.g. "Anthropogenic / Vandalism"
  heritageEntity: string; // "Parthenon"
  monitoringSource: string;
  clockStart: string; // "22:31:14"

  incomingData: MonitoringField[];
  processedIndicators: MonitoringField[];
  dimensions: EvaluationDimensions;

  resultingRisk: RiskLevel; // HIGH or CRITICAL
  alertMessage: string;

  automatedActions: ResponseAction[];
  managementActions: ResponseAction[];

  damageState?: string; // set for earthquake
  baselineSnapshot: Snapshot;
  incidentSnapshot: Snapshot;
}

// --- ontology trace ---------------------------------------------------------

export type OntoLayer = "CRMdig" | "CIDOC" | "RHDTO" | "local";
export type OntoStatus = "done" | "current" | "pending";

export interface OntoStep {
  id: string;
  /** Short concept label shown in the trace, e.g. "D9 Incoming Monitoring Data". */
  label: string;
  /** The upstream class it specialises, for the tooltip / secondary line. */
  clazz: string;
  layer: OntoLayer;
  /** Which view this ontology step belongs to (drives navigation + highlight). */
  view: ViewId;
}

// --- runtime simulation types ----------------------------------------------

export type Phase = "idle" | "running" | "gate" | "closed";

export type Speed = 0.5 | 1 | 2;

export type ToastKind = "info" | "success" | "warning" | "danger";

export type TimelineKind = "info" | "risk" | "alert" | "response" | "twin";

export interface TimelineEvent {
  id: number;
  time: string;
  text: string;
  kind: TimelineKind;
}

export type AlertStatus = "ACTIVE" | "ACKNOWLEDGED" | "IN RESPONSE" | "CLOSED";

export interface AlertRecord {
  severity: RiskLevel;
  timestamp: string;
  entity: string;
  hazard: string;
  riskScore: number;
  message: string;
  status: AlertStatus;
}

/**
 * The single guided next action the operator should take. Drives the primary
 * button of the command bar so the user never has to hunt for the next step.
 */
export type NextActionKind =
  | "start"
  | "resume"
  | "pause"
  | "trigger"
  | "mitigate"
  | "close"
  | "done";

export interface NextAction {
  kind: NextActionKind;
  label: string;
  hint: string;
}

/** A declared step of the event-driven scenario timeline. */
export interface SimulationStep {
  id: string;
  /** Short human label used by the in-view stepper. */
  label: string;
  view: ViewId;
  /** Seconds offset on the mock clock, used for log / timeline timestamps. */
  at: number;
  narration: string;
  log?: string;
  timeline?: { text: string; kind: TimelineKind };
  toast?: { kind: ToastKind; text: string };
  /** Ontology step that becomes "current". */
  mark?: string;
  /** Ontology steps that become "done". */
  complete?: string[];
  patch?: (sc: Scenario) => Partial<SimState>;
  /** When true the timeline stops here and waits for an operator action. */
  gate?: boolean;
  /** Milliseconds to wait after this step before the next one (at 1x). */
  delay: number;
}

export interface SimState {
  scenarioId: string;
  view: ViewId;
  phase: Phase;
  playing: boolean;
  speed: Speed;
  /** Index of the last applied timeline step (-1 = not started). */
  stepIndex: number;
  narration: string;
  riskState: RiskLevel;
  riskChanged: boolean;
  /** Ontology step ids already completed. */
  doneSteps: string[];
  /** Ontology step id currently in progress. */
  currentStep: string | null;
  logs: LogLine[];
  monitoringRevealed: boolean;
  processedRevealed: boolean;
  evaluationRevealed: boolean;
  thresholdChecked: boolean;
  alert: AlertRecord | null;
  timeline: TimelineEvent[];
  automatedTriggered: boolean;
  mitigationApplied: boolean;
  incidentClosed: boolean;
  snapshots: Snapshot[];
  presentation: boolean;
  soundOn: boolean;
}
