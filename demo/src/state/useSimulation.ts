import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  NextAction,
  Scenario,
  SimState,
  Speed,
  TimelineKind,
} from "../data/types";
import { SCENARIOS } from "../data/scenarios";
import { ONTOLOGY_STEPS } from "../ontology/trace";
import { completeOntology, markOntology } from "../ontology/ops";
import { notify } from "../lib/notify";
import { useAlertSound } from "../hooks/useAlertSound";
import { addSeconds } from "./clock";
import { buildSteps, incidentSnapshotFor, MANUAL_AT } from "./timeline";

/** Beat before the first step, so the operator sees the scenario start. */
const LEAD_IN = 800;

const IDLE_NARRATION =
  "Διάλεξε σενάριο και πάτησε «Εκτέλεση» για να δεις τον μηχανισμό να αντιδρά.";

const initialFor = (scenarioId: string, prev?: SimState): SimState => {
  const sc = SCENARIOS[scenarioId] ?? SCENARIOS.vandalism;
  return {
    scenarioId: sc.id,
    view: "overview",
    phase: "idle",
    playing: false,
    speed: prev?.speed ?? 1,
    stepIndex: -1,
    narration: IDLE_NARRATION,
    riskState: "NORMAL",
    riskChanged: false,
    doneSteps: [],
    currentStep: null,
    logs: [],
    monitoringRevealed: false,
    processedRevealed: false,
    evaluationRevealed: false,
    thresholdChecked: false,
    alert: null,
    timeline: [
      { id: 1, time: sc.clockStart, text: "Ψηφιακό δίδυμο σε ονομαστική κατάσταση", kind: "info" },
    ],
    automatedTriggered: false,
    mitigationApplied: false,
    incidentClosed: false,
    snapshots: [sc.baselineSnapshot],
    presentation: prev?.presentation ?? false,
    soundOn: prev?.soundOn ?? true,
  };
};

export function useSimulation(initialScenario = "vandalism") {
  const [state, setState] = useState<SimState>(() => initialFor(initialScenario));

  // Actions read the live state through refs, so they stay correct even when a
  // caller holds an action across renders (keyboard handlers, timers, tests).
  const stateRef = useRef(state);
  stateRef.current = state;

  const nextActionRef = useRef<NextAction>({ kind: "start", label: "", hint: "" });

  const timerRef = useRef<number | null>(null);
  const pendingRef = useRef<number | null>(null); // index of the step waiting to run
  const remainingRef = useRef(0); // unscaled ms left on the pending step
  const startedAtRef = useRef(0);
  const seqRef = useRef(1);
  const speedRef = useRef<Speed>(state.speed);

  const scenario: Scenario = SCENARIOS[state.scenarioId] ?? SCENARIOS.vandalism;
  const clockStart = scenario.clockStart;
  const steps = useMemo(() => buildSteps(scenario), [scenario]);
  const { play: playCue } = useAlertSound(state.soundOn);

  // The step list and scenario are read through refs inside the engine, so a
  // callback captured earlier in the render cycle can never apply stale steps.
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const scenarioRef = useRef(scenario);
  scenarioRef.current = scenario;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const pushTimeline = useCallback(
    (at: number, text: string, kind: TimelineKind) => {
      const id = ++seqRef.current;
      const time = addSeconds(clockStart, at);
      setState((s) => ({ ...s, timeline: [...s.timeline, { id, time, text, kind }] }));
    },
    [clockStart]
  );

  const addLog = useCallback(
    (at: number, text: string) => {
      const t = addSeconds(clockStart, at);
      setState((s) => ({ ...s, logs: [...s.logs, { t, text }].slice(-60) }));
    },
    [clockStart]
  );

  // ---- step application ----------------------------------------------------
  // `schedule` and `applyStep` call each other, so the timer callback goes
  // through a ref that always points at the latest applyStep.
  const applyRef = useRef<(index: number, chain: boolean) => void>(() => {});

  const schedule = useCallback(
    (index: number, baseMs: number) => {
      clearTimer();
      pendingRef.current = index;
      remainingRef.current = baseMs;
      startedAtRef.current = Date.now();
      const ms = Math.max(0, baseMs / speedRef.current);
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        applyRef.current(index, true);
      }, ms);
    },
    [clearTimer]
  );

  const applyStep = useCallback(
    (index: number, chain: boolean) => {
      const activeSteps = stepsRef.current;
      const activeScenario = scenarioRef.current;
      const step = activeSteps[index];
      if (!step) return;

      const patch = step.patch ? step.patch(activeScenario) : {};
      if (step.toast) notify(step.toast.kind, step.toast.text);
      if (step.log) addLog(step.at, step.log);
      if (step.timeline) pushTimeline(step.at, step.timeline.text, step.timeline.kind);
      if (step.id === "riskstate") playCue("risk");
      if (step.id === "alerting") playCue("alert");

      setState((s) => {
        let done = s.doneSteps;
        if (step.mark) done = markOntology(done, step.mark);
        if (step.complete) done = step.complete.reduce(completeOntology, done);
        const currentStep = step.mark
          ? step.mark
          : s.currentStep && step.complete?.includes(s.currentStep)
            ? null
            : s.currentStep;
        return {
          ...s,
          ...patch,
          doneSteps: done,
          currentStep,
          stepIndex: index,
          narration: step.narration,
          view: step.view,
        };
      });

      const next = index + 1;
      const hasNext = next < activeSteps.length;

      // Manual stepping keeps the chain addressable so "resume" can continue it.
      if (!chain) {
        if (step.gate || !hasNext) {
          pendingRef.current = null;
          setState((s) => ({
            ...s,
            playing: false,
            ...(step.gate ? { phase: "gate" as const } : {}),
          }));
          return;
        }
        pendingRef.current = next;
        remainingRef.current = activeSteps[index].delay;
        setState((s) => ({ ...s, playing: false }));
        return;
      }

      if (step.gate) {
        pendingRef.current = null;
        setState((s) => ({ ...s, playing: false, phase: "gate" }));
        return;
      }

      if (hasNext) {
        schedule(next, activeSteps[index].delay);
      } else {
        pendingRef.current = null;
        setState((s) => ({ ...s, playing: false, phase: "gate" }));
      }
    },
    [addLog, pushTimeline, playCue, schedule]
  );

  applyRef.current = applyStep;

  const stopPending = useCallback(() => {
    if (timerRef.current !== null && pendingRef.current !== null) {
      const elapsed = (Date.now() - startedAtRef.current) * speedRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    }
    clearTimer();
  }, [clearTimer]);

  // ---- playback controls ---------------------------------------------------
  const start = useCallback(() => {
    clearTimer();
    pendingRef.current = null;
    setState((s) => ({
      ...initialFor(s.scenarioId, s),
      phase: "running",
      playing: true,
      narration: `Ξεκίνησε το σενάριο «${scenario.name}». Παρακολουθείται το ψηφιακό δίδυμο (${scenario.heritageEntity})…`,
    }));
    schedule(0, LEAD_IN);
  }, [clearTimer, schedule, scenario.name, scenario.heritageEntity]);

  const pause = useCallback(() => {
    stopPending();
    setState((s) => ({ ...s, playing: false }));
  }, [stopPending]);

  const resume = useCallback(() => {
    if (stateRef.current.phase === "idle") {
      start();
      return;
    }
    if (pendingRef.current === null) return;
    schedule(pendingRef.current, remainingRef.current);
    setState((s) => ({ ...s, playing: true }));
  }, [start, schedule]);

  const togglePlay = useCallback(() => {
    if (stateRef.current.phase === "idle") start();
    else if (stateRef.current.playing) pause();
    else resume();
  }, [start, pause, resume]);

  /** Advance exactly one step; auto-play stops so the operator keeps control. */
  const nextStep = useCallback(() => {
    if (stateRef.current.phase === "idle") {
      start();
      return;
    }
    const pending = pendingRef.current;
    if (pending === null) return;
    clearTimer();
    pendingRef.current = null;
    applyStep(pending, false);
  }, [start, clearTimer, applyStep]);

  const reset = useCallback(() => {
    clearTimer();
    pendingRef.current = null;
    setState((s) => initialFor(s.scenarioId, s));
  }, [clearTimer]);

  const selectScenario = useCallback(
    (id: string) => {
      clearTimer();
      pendingRef.current = null;
      setState((s) => initialFor(id, s));
    },
    [clearTimer]
  );

  const setSpeed = useCallback(
    (speed: Speed) => {
      const previous = speedRef.current;
      speedRef.current = speed;
      setState((s) => ({ ...s, speed }));
      if (timerRef.current !== null && pendingRef.current !== null) {
        const elapsed = (Date.now() - startedAtRef.current) * previous;
        const remaining = Math.max(0, remainingRef.current - elapsed);
        schedule(pendingRef.current, remaining);
      }
    },
    [schedule]
  );

  const setView = useCallback((view: SimState["view"]) => setState((s) => ({ ...s, view })), []);
  const togglePresentation = useCallback(
    () => setState((s) => ({ ...s, presentation: !s.presentation })),
    []
  );
  const toggleSound = useCallback(() => setState((s) => ({ ...s, soundOn: !s.soundOn })), []);

  // ---- operator-gated actions (never automated) ----------------------------
  const acknowledgeAlert = useCallback(() => {
    setState((s) =>
      s.alert
        ? {
            ...s,
            alert: { ...s.alert, status: "ACKNOWLEDGED" },
            narration:
              "Η ειδοποίηση επιβεβαιώθηκε. Παραμένει ανοιχτή μέχρι να αποφασίσεις για την απόκριση.",
          }
        : s
    );
    notify("info", "Η ειδοποίηση επιβεβαιώθηκε");
  }, []);

  const openDecision = useCallback(() => {
    setState((s) => ({
      ...s,
      view: "response",
      alert: s.alert ? { ...s.alert, status: "IN RESPONSE" } : s.alert,
      narration: "Άνοιξε η οθόνη απόκρισης — διάλεξε πώς θα αντιδράσεις στην ειδοποίηση.",
    }));
  }, []);

  const triggerAutomated = useCallback(() => {
    setState((s) => {
      let done = completeOntology(markOntology(s.doneSteps, "activation"), "activation");
      done = completeOntology(markOntology(done, "actuator"), "actuator");
      return {
        ...s,
        doneSteps: done,
        currentStep: null,
        automatedTriggered: true,
        narration:
          "Ενεργοποιήθηκε η αυτόματη απόκριση: οι ενεργοποιητές (συναγερμός / πύλη) έδρασαν άμεσα, χωρίς ανθρώπινη παρέμβαση.",
      };
    });
    pushTimeline(
      MANUAL_AT.trigger,
      "Εκτελέστηκε αυτόματη απόκριση (HP15 activated → HC11 Actuator)",
      "response"
    );
    notify("success", "Εκτελέστηκε η αυτόματη απόκριση");
  }, [pushTimeline]);

  const applyMitigation = useCallback(() => {
    setState((s) => {
      let done = completeOntology(markOntology(s.doneSteps, "management"), "management");
      done = completeOntology(markOntology(done, "action"), "action");
      return {
        ...s,
        doneSteps: done,
        currentStep: null,
        mitigationApplied: true,
        narration:
          "Η ομάδα απόκρισης εφάρμοσε μέτρα μετριασμού. Τώρα μπορείς να κλείσεις το περιστατικό και να ενημερώσεις το δίδυμο.",
      };
    });
    pushTimeline(
      MANUAL_AT.mitigate,
      "Διαχείριση Κινδύνου → εφαρμόστηκε Ενέργεια Διαχείρισης",
      "response"
    );
    notify("success", "Εφαρμόστηκαν μέτρα από την ομάδα απόκρισης");
  }, [pushTimeline]);

  const closeIncident = useCallback(() => {
    const snapshot = incidentSnapshotFor(scenario);
    setState((s) => {
      let done = s.doneSteps;
      ["activation", "actuator", "management", "action"].forEach((id) => {
        done = completeOntology(done, id);
      });
      done = completeOntology(markOntology(done, "update"), "update");
      done = completeOntology(markOntology(done, "twin"), "twin");
      return {
        ...s,
        doneSteps: done,
        currentStep: null,
        incidentClosed: true,
        phase: "closed",
        view: "history",
        narration:
          "Το περιστατικό έκλεισε. Το ψηφιακό δίδυμο ενημερώθηκε με νέο στιγμιότυπο που καταγράφει τι συνέβη.",
        snapshots: s.snapshots.some((x) => x.id === snapshot.id)
          ? s.snapshots
          : [...s.snapshots, snapshot],
        alert: s.alert ? { ...s.alert, status: "CLOSED" } : s.alert,
      };
    });
    pushTimeline(MANUAL_AT.close, "Ενημέρωση Διδύμου → δημιουργήθηκε νέο στιγμιότυπο", "twin");
    playCue("done");
    notify("success", "Το δίδυμο ενημερώθηκε — το περιστατικό έκλεισε");
  }, [scenario, pushTimeline, playCue]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const awaitingOperator = state.phase === "gate";
  const canTrigger = awaitingOperator && !state.automatedTriggered;
  const canMitigate = awaitingOperator && !state.mitigationApplied;
  const canClose =
    (state.automatedTriggered || state.mitigationApplied) && !state.incidentClosed;

  const nextAction: NextAction = useMemo(() => {
    if (state.phase === "idle") {
      return {
        kind: "start",
        label: "Εκτέλεση σεναρίου",
        hint: "Η ροή ξεκινά από τα εισερχόμενα δεδομένα και φτάνει ως την ειδοποίηση.",
      };
    }
    if (state.phase === "closed") {
      return {
        kind: "start",
        label: "Νέα εκτέλεση σεναρίου",
        hint: "Ξεκινά ξανά το ίδιο σενάριο από την αρχή — ή διάλεξε άλλο σενάριο από τη λίστα.",
      };
    }
    if (state.playing) {
      return {
        kind: "pause",
        label: "Παύση ροής",
        hint: "Σταμάτα τη ροή για να προχωρήσεις βήμα-βήμα ή να εξηγήσεις ένα στάδιο.",
      };
    }
    if (state.phase === "running") {
      return {
        kind: "resume",
        label: "Συνέχεια ροής",
        hint: "Η ροή είναι σε παύση. Συνέχισε αυτόματα ή προχώρησε ένα βήμα.",
      };
    }
    if (!state.automatedTriggered) {
      return {
        kind: "trigger",
        label: "Ενεργοποίηση αυτόματης απόκρισης",
        hint: "Οι μηχανισμοί (HC11 Actuator) δρουν άμεσα, χωρίς ανθρώπινη παρέμβαση.",
      };
    }
    if (!state.mitigationApplied) {
      return {
        kind: "mitigate",
        label: "Εφαρμογή μέτρων μετριασμού",
        hint: "Η ανθρώπινη ομάδα απόκρισης (E7 Activity) εφαρμόζει μέτρα.",
      };
    }
    return {
      kind: "close",
      label: "Κλείσιμο περιστατικού",
      hint: "Ενεργοποιείται η συντήρηση του διδύμου και γράφεται νέο στιγμιότυπο.",
    };
  }, [state.phase, state.playing, state.automatedTriggered, state.mitigationApplied]);

  nextActionRef.current = nextAction;

  const runNextAction = useCallback(() => {
    const kind = nextActionRef.current.kind;
    if (kind === "start") start();
    else if (kind === "pause") pause();
    else if (kind === "resume") resume();
    else if (kind === "trigger") triggerAutomated();
    else if (kind === "mitigate") applyMitigation();
    else if (kind === "close") closeIncident();
  }, [start, pause, resume, triggerAutomated, applyMitigation, closeIncident]);

  const progress = {
    done: state.doneSteps.length,
    total: ONTOLOGY_STEPS.length,
    pct: Math.round((state.doneSteps.length / ONTOLOGY_STEPS.length) * 100),
  };

  return {
    state,
    scenario,
    steps,
    progress,
    nextAction,
    actions: {
      start,
      pause,
      resume,
      togglePlay,
      nextStep,
      reset,
      selectScenario,
      setSpeed,
      setView,
      togglePresentation,
      toggleSound,
      acknowledgeAlert,
      openDecision,
      triggerAutomated,
      applyMitigation,
      closeIncident,
      runNextAction,
    },
    flags: { canTrigger, canMitigate, canClose },
  };
}

export type Simulation = ReturnType<typeof useSimulation>;
