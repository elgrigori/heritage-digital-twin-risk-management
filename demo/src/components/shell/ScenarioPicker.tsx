import { useMemo, useState } from "react";
import { Check, Landmark, Search } from "lucide-react";
import type { HazardKind } from "@/data/types";
import { HAZARD_LABEL, RISK_SHORT } from "@/data/labels";
import { SCENARIO_LIST } from "@/data/scenarios";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiskBadge } from "@/components/domain/primitives";
import { cn } from "@/lib/utils";

type Filter = "all" | HazardKind;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Όλα" },
  { id: "anthropogenic", label: HAZARD_LABEL.anthropogenic },
  { id: "natural", label: HAZARD_LABEL.natural },
];

export function ScenarioPicker({
  open,
  onOpenChange,
  currentId,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentId: string;
  onSelect: (id: string) => void;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const term = query.trim().toLowerCase();
    const visible = SCENARIO_LIST.filter((s) => {
      const matchesFilter = filter === "all" || s.hazardType === filter;
      const matchesQuery =
        !term ||
        s.name.toLowerCase().includes(term) ||
        s.heritageEntity.toLowerCase().includes(term) ||
        s.hazardLabel.toLowerCase().includes(term);
      return matchesFilter && matchesQuery;
    });
    return Array.from(new Set(visible.map((s) => s.heritageEntity))).map((monument) => ({
      monument,
      items: visible.filter((s) => s.heritageEntity === monument),
    }));
  }, [filter, query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Διάλεξε σενάριο</DialogTitle>
          <DialogDescription>
            10 σενάρια σε 5 μνημεία. Ίδια εννοιολογική ροή για κάθε κίνδυνο — αλλάζουν μόνο τα
            δεδομένα και οι ενέργειες.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Αναζήτηση σεναρίου ή μνημείου…"
              className="pl-9"
              aria-label="Αναζήτηση σεναρίου"
            />
          </div>
          <div className="flex gap-1 rounded-xl border border-border bg-muted/40 p-1">
            {FILTERS.map((f) => (
              <Button
                key={f.id}
                variant={filter === f.id ? "soft" : "ghost"}
                size="sm"
                onClick={() => setFilter(f.id)}
                className="rounded-lg"
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="slim-scroll max-h-[55vh] space-y-5 overflow-y-auto pr-1">
          {groups.map((group) => (
            <section key={group.monument}>
              <h3 className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                <Landmark className="size-3.5" />
                {group.monument}
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {group.items.map((s) => {
                  const selected = s.id === currentId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        onSelect(s.id);
                        onOpenChange(false);
                      }}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-all hover:border-primary/60 hover:shadow-glow",
                        selected ? "border-primary bg-primary/5" : "border-border bg-card"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-bold">{s.name}</span>
                        {selected ? <Check className="mt-0.5 size-4 shrink-0 text-primary" /> : null}
                      </div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{s.hazardLabel}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <RiskBadge
                          level={s.resultingRisk}
                          label={`${RISK_SHORT[s.resultingRisk]} · ${s.dimensions.riskScore.toFixed(1)}/10`}
                        />
                      </div>
                      <div className="mt-2 text-[11px] text-muted-foreground">
                        {s.monitoringSource}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
          {groups.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Δεν βρέθηκε σενάριο με αυτά τα κριτήρια.
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
