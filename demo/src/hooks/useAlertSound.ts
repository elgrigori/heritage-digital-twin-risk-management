import { useCallback, useRef } from "react";

export type SoundCue = "risk" | "alert" | "done";

/**
 * Short, generated risk cues — no audio assets, and nothing plays until the
 * operator has interacted with the page (browsers block audio before a gesture).
 */
const CUES: Record<SoundCue, { notes: number[]; type: OscillatorType; gain: number }> = {
  risk: { notes: [523.25, 659.25], type: "triangle", gain: 0.05 },
  alert: { notes: [880, 659.25, 880], type: "sawtooth", gain: 0.04 },
  done: { notes: [659.25, 987.77], type: "sine", gain: 0.05 },
};

export function useAlertSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback(
    (cue: SoundCue) => {
      if (!enabled || typeof window === "undefined" || !window.AudioContext) return;
      try {
        if (!ctxRef.current) ctxRef.current = new window.AudioContext();
        const ctx = ctxRef.current;
        if (ctx.state === "suspended") void ctx.resume();
        const { notes, type, gain } = CUES[cue];
        notes.forEach((freq, i) => {
          const start = ctx.currentTime + i * 0.13;
          const osc = ctx.createOscillator();
          const amp = ctx.createGain();
          osc.type = type;
          osc.frequency.value = freq;
          amp.gain.setValueAtTime(0, start);
          amp.gain.linearRampToValueAtTime(gain, start + 0.02);
          amp.gain.exponentialRampToValueAtTime(0.0001, start + 0.24);
          osc.connect(amp);
          amp.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.26);
        });
      } catch {
        // Audio feedback is decorative: never break the demo because of it.
      }
    },
    [enabled]
  );

  return { play };
}
