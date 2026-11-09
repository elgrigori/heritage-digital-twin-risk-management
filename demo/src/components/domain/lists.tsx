import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Cpu, History } from "lucide-react";
import type { LogLine, Snapshot, TimelineEvent, TimelineKind } from "@/data/types";
import { RiskBadge } from "./primitives";
import { cn } from "@/lib/utils";

const DOT_TONE: Record<TimelineKind, string> = {
  info: "bg-primary",
  risk: "bg-risk-high",
  alert: "bg-risk-critical",
  response: "bg-onto-cidoc",
  twin: "bg-onto-rhdto",
};

export function TimelineList({ events }: { events: TimelineEvent[] }) {
  const reduced = useReducedMotion();
  return (
    <ol className="relative">
      <AnimatePresence initial={false}>
        {events.map((e) => (
          <motion.li
            key={e.id}
            initial={reduced ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-[62px_1fr] gap-3"
          >
            <span className="pt-0.5 text-right font-mono text-[11px] text-muted-foreground tabular">
              {e.time}
            </span>
            <div className="relative border-l border-border pb-4 pl-4">
              <span
                className={cn(
                  "absolute -left-[5px] top-1.5 size-2.5 rounded-full ring-4 ring-background",
                  DOT_TONE[e.kind]
                )}
              />
              <span className="text-sm">{e.text}</span>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ol>
  );
}

/** Monospace processing log of the digital operation. */
export function ProcessingLog({ logs }: { logs: LogLine[] }) {
  const reduced = useReducedMotion();
  return (
    <div className="deep-panel slim-scroll max-h-56 overflow-y-auto rounded-xl p-3 font-mono text-xs">
      <AnimatePresence initial={false}>
        {logs.map((l, i) => (
          <motion.div
            key={`${l.t}-${i}`}
            initial={reduced ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex gap-3 py-1"
          >
            <span className="text-risk-medium">{l.t}</span>
            <span className="text-ink-foreground/90">{l.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
      {logs.length === 0 ? (
        <div className="flex items-center gap-2 py-2 text-ink-muted">
          <Cpu className="size-3.5" /> Κανένα συμβάν ακόμη.
        </div>
      ) : null}
    </div>
  );
}

export function SnapshotChain({
  snapshots,
  highlightLatest,
}: {
  snapshots: Snapshot[];
  highlightLatest?: boolean;
}) {
  const reduced = useReducedMotion();
  const lastId = snapshots[snapshots.length - 1]?.id;
  return (
    <div className="flex flex-col">
      {snapshots.map((s, i) => (
        <div key={`${s.id}-${i}`}>
          {i > 0 ? (
            <div className="flex justify-center py-1 text-onto-rhdto">
              <ArrowDown className="size-4" />
            </div>
          ) : null}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "rounded-xl border border-l-4 border-border bg-card p-4",
              s.baseline ? "border-l-border" : "border-l-onto-rhdto",
              highlightLatest && s.id === lastId && !s.baseline && "shadow-glow"
            )}
          >
            <div className="font-mono text-[11px] font-semibold text-onto-rhdto">{s.id}</div>
            <div className="mb-2 mt-1 text-base font-bold">{s.title}</div>
            <div className="flex flex-wrap items-center gap-2">
              <RiskBadge level={s.riskState} />
              {s.timestamp ? (
                <span className="font-mono text-[11px] text-muted-foreground tabular">
                  {s.timestamp}
                </span>
              ) : null}
            </div>
            <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
              {s.incident ? (
                <div>
                  <dt className="inline font-semibold">Περιστατικό: </dt>
                  <dd className="inline">{s.incident}</dd>
                </div>
              ) : null}
              {s.managementAction ? (
                <div>
                  <dt className="inline font-semibold">Ενέργεια: </dt>
                  <dd className="inline">{s.managementAction}</dd>
                </div>
              ) : null}
              {s.damageState ? (
                <div className="text-risk-high">
                  <dt className="inline font-semibold">Κατάσταση ζημιάς: </dt>
                  <dd className="inline">{s.damageState}</dd>
                </div>
              ) : null}
              {s.info ? <dd className="block pt-1 text-muted-foreground/90">{s.info}</dd> : null}
            </dl>
          </motion.div>
        </div>
      ))}
      {snapshots.length === 1 ? (
        <p className="flex items-center gap-2 pt-4 text-sm text-muted-foreground">
          <History className="size-4" />
          Κλείσε το περιστατικό στην οθόνη απόκρισης για να γραφτεί νέο στιγμιότυπο.
        </p>
      ) : null}
    </div>
  );
}
