export type SkinId = "aegean" | "console";

export interface Skin {
  id: SkinId;
  label: string;
  description: string;
  /** Three preview swatches shown in the switcher. */
  swatches: [string, string, string];
}

export const SKINS: Skin[] = [
  {
    id: "aegean",
    label: "Αιγαίο",
    description: "Φωτεινό, ζεστό μάρμαρο με aegean blue, gradients και serif τίτλους.",
    swatches: ["hsl(40 38% 96%)", "hsl(226 68% 47%)", "hsl(292 50% 48%)"],
  },
  {
    id: "console",
    label: "Κέντρο Ελέγχου",
    description: "Σκούρο ops-console, neon accents, μονοτυπικοί τίτλοι και κοφτερές γωνίες.",
    swatches: ["hsl(222 32% 8%)", "hsl(187 92% 52%)", "hsl(152 68% 52%)"],
  },
];

export const DEFAULT_SKIN: SkinId = "aegean";
