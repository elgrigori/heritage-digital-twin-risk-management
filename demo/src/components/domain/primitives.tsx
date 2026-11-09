import type { ReactNode } from "react";
import { Info, ArrowRight } from "lucide-react";
import type { AlertStatus, OntoLayer, RiskLevel } from "@/data/types";
import { RISK_LABEL, STATUS_LABEL } from "@/data/labels";
import { cn } from "@/lib/utils";

const RISK_TONE: Record<RiskLevel, string> = {
  NORMAL: "bg-risk-normal-soft text-risk-normal",
  MEDIUM: "bg-risk-medium-soft text-risk-medium",
  HIGH: "bg-risk-high-soft text-risk-high",
  CRITICAL: "bg-risk-critical-soft text-risk-critical",
};

export function RiskBadge({
  level,
  className,
  label,
}: {
  level: RiskLevel;
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold tracking-wide",
        RISK_TONE[level],
        className
      )}
    >
      <span className="size-2 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
      {label ?? RISK_LABEL[level]}
    </span>
  );
}

const ONTO_TONE: Record<OntoLayer, string> = {
  CRMdig: "bg-onto-crmdig-soft text-onto-crmdig",
  CIDOC: "bg-onto-cidoc-soft text-onto-cidoc",
  RHDTO: "bg-onto-rhdto-soft text-onto-rhdto",
  local: "bg-primary/10 text-primary",
};

export function OntoTag({
  layer,
  children,
  className,
}: {
  layer: OntoLayer;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2 py-0.5 font-mono text-[11px] font-bold",
        ONTO_TONE[layer],
        className
      )}
    >
      {children}
    </span>
  );
}

const STATUS_TONE: Record<AlertStatus, string> = {
  ACTIVE: "bg-risk-critical-soft text-risk-critical",
  ACKNOWLEDGED: "bg-onto-cidoc-soft text-onto-cidoc",
  "IN RESPONSE": "bg-risk-high-soft text-risk-high",
  CLOSED: "bg-risk-normal-soft text-risk-normal",
};

export function StatusPill({ status, className }: { status: AlertStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wide",
        STATUS_TONE[status],
        className
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function KV({
  k,
  v,
  mono,
  className,
}: {
  k: ReactNode;
  v: ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-baseline gap-x-3 gap-y-0.5 border-b border-border/60 py-2 text-sm last:border-b-0",
        className
      )}
    >
      <dt className="min-w-0 break-words text-muted-foreground">{k}</dt>
      <dd
        className={cn(
          "min-w-0 break-words text-right font-semibold",
          mono && "font-mono tabular [overflow-wrap:anywhere]"
        )}
      >
        {v}
      </dd>
    </div>
  );
}

export function MiniLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "text-[11px] font-bold uppercase tracking-[0.08em] text-primary",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Explain({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-start gap-3 overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 via-card to-onto-crmdig/10 p-4 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-brand before:content-['']",
        className
      )}
    >
      <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-brand text-primary-foreground">
        <Info className="size-4" />
      </div>
      <div className="min-w-0">
        {title ? <div className="text-sm font-bold">{title}</div> : null}
        <p className="text-sm leading-relaxed text-muted-foreground [&_b]:text-foreground">
          {children}
        </p>
      </div>
    </div>
  );
}

export function EmptyState({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("py-8 text-center text-sm text-muted-foreground", className)}>{children}</p>
  );
}

/** In-view nudge towards the single guided action of the command bar. */
export function NextActionHint({
  label,
  hint,
  className,
}: {
  label: string;
  hint: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-gradient-to-r from-primary/10 via-card to-onto-crmdig/10 px-4 py-3",
        className
      )}
    >
      <ArrowRight className="size-4 shrink-0 text-primary" />
      <div className="min-w-0 text-sm">
        <span className="font-bold text-primary">{label}</span>
        <span className="text-muted-foreground"> — {hint}</span>
      </div>
    </div>
  );
}

export function PageHead({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <div className="bg-brand bg-clip-text text-[11px] font-extrabold uppercase tracking-[0.14em] text-transparent">
          {eyebrow}
        </div>
        <h2 className="mt-1 text-xl font-bold sm:text-2xl">{title}</h2>
        <p className="mt-1.5 max-w-3xl text-sm text-muted-foreground">{description}</p>
      </div>
      {aside}
    </div>
  );
}
