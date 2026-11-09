import { ONTOLOGY_STEPS, stepIndex } from "./trace";

/**
 * Mark an ontology step as the current one. Every earlier step is considered
 * completed, which mirrors the sequential execution of the conceptual model.
 */
export function markOntology(done: string[], id: string): string[] {
  const idx = stepIndex(id);
  const earlier = idx > 0 ? ONTOLOGY_STEPS.slice(0, idx).map((s) => s.id) : [];
  return Array.from(new Set([...done, ...earlier, id]));
}

export function completeOntology(done: string[], id: string): string[] {
  return done.includes(id) ? done : [...done, id];
}
