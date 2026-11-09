import { Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { SkinId } from "@/theme/skins";
import type { Skin } from "@/theme/skins";
import { cn } from "@/lib/utils";

/** Live look switcher so both interfaces can be compared side by side. */
export function SkinSwitcher({
  skins,
  skin,
  onSelect,
}: {
  skins: Skin[];
  skin: SkinId;
  onSelect: (id: SkinId) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Εμφάνιση διεπαφής"
          className="text-muted-foreground hover:text-foreground"
        >
          <Palette />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-2">
        <p className="px-2 pb-2 pt-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
          Εμφάνιση
        </p>
        <div className="flex flex-col gap-1">
          {skins.map((item) => {
            const active = item.id === skin;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border p-2.5 text-left transition-colors",
                  active
                    ? "border-primary/50 bg-primary/10"
                    : "border-transparent hover:border-border hover:bg-muted/60"
                )}
              >
                <span className="flex shrink-0 gap-1 pt-0.5">
                  {item.swatches.map((color, i) => (
                    <span
                      key={`${item.id}-${i}`}
                      className="size-4 rounded-full ring-1 ring-inset ring-foreground/10"
                      style={{ background: color }}
                    />
                  ))}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{item.label}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                    {item.description}
                  </span>
                </span>
                {active ? <Check className="mt-0.5 size-4 shrink-0 text-primary" /> : null}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
