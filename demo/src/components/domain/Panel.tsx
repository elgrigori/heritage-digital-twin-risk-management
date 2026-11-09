import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PanelTone = "brand" | "teal" | "amber" | "rose" | "plain";

const TONE_CHIP: Record<PanelTone, string> = {
  brand: "bg-brand",
  teal: "bg-gradient-to-br from-onto-crmdig to-onto-cidoc",
  amber: "bg-gradient-to-br from-risk-medium to-risk-high",
  rose: "bg-gradient-to-br from-onto-rhdto to-risk-critical",
  plain: "bg-muted text-muted-foreground",
};

const TONE_EDGE: Record<PanelTone, string> = {
  brand: "before:bg-edge-brand",
  teal: "before:bg-edge-teal",
  amber: "before:bg-edge-amber",
  rose: "before:bg-edge-rose",
  plain: "before:bg-edge-plain",
};

export function Panel({
  title,
  sub,
  icon,
  tone = "brand",
  actions,
  className,
  bodyClassName,
  children,
}: {
  title?: string;
  sub?: string;
  icon?: ReactNode;
  tone?: PanelTone;
  actions?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "surface-panel relative overflow-hidden p-4 transition-[box-shadow,transform] duration-300 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:content-[''] hover:-translate-y-0.5 hover:shadow-glow sm:p-5",
        TONE_EDGE[tone],
        className
      )}
    >
      {title ? (
        <header className="mb-4 flex items-start gap-3">
          {icon ? (
            <div
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-xl text-primary-foreground ring-1 ring-inset ring-primary-foreground/25",
                TONE_CHIP[tone]
              )}
            >
              {icon}
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold sm:text-base">{title}</h3>
            {sub ? <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div> : null}
          </div>
          {actions}
        </header>
      ) : null}
      <div className={cn(bodyClassName)}>{children}</div>
    </section>
  );
}

export function PanelGrid({
  cols = 2,
  className,
  children,
}: {
  cols?: 2 | 3;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-2 2xl:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}
