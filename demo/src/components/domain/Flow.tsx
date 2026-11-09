import type { ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** One node of the conceptual flow, highlighted while the engine is on it. */
export function FlowNode({
  title,
  sub,
  tag,
  hot,
  className,
}: {
  title: string;
  sub?: string;
  tag?: ReactNode;
  hot?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3 transition-all duration-300",
        hot
          ? "border-primary bg-card shadow-glow"
          : "border-border",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold">{title}</div>
        {sub ? <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">{sub}</div> : null}
      </div>
      {tag}
    </div>
  );
}

export function FlowArrow({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1 text-[11px] font-semibold text-primary">
      <ArrowDown className="size-3.5" />
      {label ? <span className="font-mono text-muted-foreground">{label}</span> : null}
    </div>
  );
}

export function FlowStack({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col", className)}>{children}</div>;
}
