import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Indicator value against its safety threshold. The marker shows exactly where
 * the threshold sits, so "exceeded" is visible instead of just asserted.
 */
export function Meter({
  value,
  threshold,
  exceeded,
  className,
}: {
  value: number;
  threshold: number;
  exceeded: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const thr = Math.max(0, Math.min(1, threshold)) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative h-3 overflow-hidden rounded-full bg-muted shadow-[inset_0_1px_3px_hsl(var(--foreground)/0.08)]">
        <motion.div
          initial={reduced ? false : { width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: reduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "h-full rounded-full",
            exceeded
              ? "bg-gradient-to-r from-risk-medium via-risk-high to-risk-critical"
              : "bg-gradient-to-r from-onto-crmdig to-onto-cidoc"
          )}
        />
        <span
          className="absolute -top-1 bottom-[-4px] w-[3px] rounded-full bg-foreground/80 shadow-[0_0_0_2px_hsl(var(--card))]"
          style={{ left: `${thr}%` }}
          title={`Όριο ${threshold.toFixed(2)}`}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Τιμή <b className="tabular text-foreground">{value.toFixed(2)}</b>
        </span>
        <span>
          Όριο <b className="tabular text-foreground">{threshold.toFixed(2)}</b>
        </span>
      </div>
    </div>
  );
}

export function ThresholdVerdict({ exceeded }: { exceeded: boolean }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold",
        exceeded
          ? "bg-gradient-to-r from-risk-high to-risk-critical text-primary-foreground shadow-[0_10px_26px_-14px_hsl(var(--risk-critical)/0.9)]"
          : "bg-risk-normal-soft text-risk-normal ring-1 ring-inset ring-risk-normal/25"
      )}
    >
      {exceeded ? <AlertTriangle className="size-4" /> : <CheckCircle2 className="size-4" />}
      {exceeded ? "ΞΕΠΕΡΑΣΤΗΚΕ ΤΟ ΟΡΙΟ" : "ΕΝΤΟΣ ΟΡΙΟΥ — ΕΝΗΜΕΡΩΤΙΚΗ ΚΑΤΑΓΡΑΦΗ"}
    </div>
  );
}
