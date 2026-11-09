import { motion, useReducedMotion } from "framer-motion";
import { Landmark, ShieldAlert } from "lucide-react";
import type { RiskLevel } from "@/data/types";
import { RISK_LABEL } from "@/data/labels";
import { cn } from "@/lib/utils";

const HERO_BG: Record<RiskLevel, string> = {
  NORMAL: "bg-hero-normal",
  MEDIUM: "bg-hero-medium",
  HIGH: "bg-hero-high",
  CRITICAL: "bg-hero-critical",
};

const HERO_GLOW: Record<RiskLevel, string> = {
  NORMAL: "shadow-[0_22px_60px_-24px_hsl(var(--risk-normal)/0.75)]",
  MEDIUM: "shadow-[0_22px_60px_-24px_hsl(var(--risk-medium)/0.75)]",
  HIGH: "shadow-[0_22px_60px_-24px_hsl(var(--risk-high)/0.75)]",
  CRITICAL: "shadow-[0_22px_60px_-24px_hsl(var(--risk-critical)/0.8)]",
};

/** The one thing the operator must always see at a glance: how safe is the monument now. */
export function RiskHero({
  level,
  entity,
  hazard,
  changed,
  className,
}: {
  level: RiskLevel;
  entity: string;
  hazard?: string;
  changed?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      animate={
        changed && !reduced
          ? { scale: [1, 1.015, 1] }
          : {}
      }
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "relative isolate flex min-h-48 flex-col justify-center overflow-hidden rounded-2xl p-5 text-[hsl(var(--hero-ink))]",
        HERO_BG[level],
        HERO_GLOW[level],
        level === "CRITICAL" && changed && !reduced && "animate-pulse-ring",
        className
      )}
    >
      {/* decorative layers */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-[hsl(var(--hero-chip)/0.12)] to-transparent" />
      <div className="pointer-events-none absolute -right-12 -top-14 size-44 rounded-full bg-[hsl(var(--hero-chip)/0.14)] blur-[2px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 size-40 rounded-full bg-[hsl(var(--hero-chip)/0.1)]" />

      <div className="relative">
        <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] opacity-95">
          <ShieldAlert className="size-3.5" />
          Τρέχουσα κατάσταση κινδύνου
        </div>
        <div className="mt-2 font-display text-3xl font-extrabold leading-none drop-shadow-sm sm:text-4xl 2xl:text-5xl">
          {RISK_LABEL[level]}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--hero-chip)/0.14)] px-3 py-1 text-sm font-semibold ring-1 ring-inset ring-[hsl(var(--hero-chip)/0.25)] backdrop-blur-sm">
            <Landmark className="size-4" />
            {entity}
          </span>
        </div>
        {hazard ? <p className="mt-3 text-xs font-medium opacity-90">{hazard}</p> : null}
      </div>
    </motion.div>
  );
}
