import { useEffect } from "react";
import type { ViewId } from "@/data/types";

const VIEW_ORDER: ViewId[] = [
  "overview",
  "monitoring",
  "evaluation",
  "alerts",
  "response",
  "history",
];

const isTypingTarget = (el: EventTarget | null) => {
  if (!(el instanceof HTMLElement)) return false;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) || el.isContentEditable;
};

/**
 * Presentation-friendly shortcuts: the whole demo can be driven from the
 * keyboard while projecting. Ignored while the user types or a dialog is open.
 */
export function useKeyboardShortcuts(handlers: {
  onTogglePlay: () => void;
  onNextStep: () => void;
  onReset: () => void;
  onView: (view: ViewId) => void;
  onHelp: () => void;
}) {
  const { onTogglePlay, onNextStep, onReset, onView, onHelp } = handlers;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      const dialogOpen = document.querySelector('[role="dialog"][data-state="open"]');
      if (dialogOpen && event.key !== "Escape") return;

      switch (event.key) {
        case " ":
          event.preventDefault();
          onTogglePlay();
          break;
        case "ArrowRight":
          event.preventDefault();
          onNextStep();
          break;
        case "r":
        case "R":
          onReset();
          break;
        case "?":
          onHelp();
          break;
        default: {
          const index = Number(event.key);
          if (Number.isInteger(index) && index >= 1 && index <= VIEW_ORDER.length) {
            onView(VIEW_ORDER[index - 1]);
          }
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onTogglePlay, onNextStep, onReset, onView, onHelp]);
}

export const SHORTCUTS: { keys: string; label: string }[] = [
  { keys: "Space", label: "Έναρξη / Παύση ροής" },
  { keys: "→", label: "Επόμενο βήμα" },
  { keys: "R", label: "Επαναφορά σεναρίου" },
  { keys: "1 – 6", label: "Μετάβαση σε όψη" },
  { keys: "?", label: "Άνοιγμα βοήθειας" },
];
