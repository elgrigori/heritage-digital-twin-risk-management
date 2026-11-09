# HDT Risk Demo v2 — Νέα έκδοση, πιο φιλική & πιο ομαλή

## Context

Το attached `hdt-risk-demo (1).zip` είναι ένα frontend-only React demo (Vite + React 18 + plain CSS) για τη
διπλωματική «Conceptual Modelling of Risk Management and an Alerting Mechanism in the Context of Heritage
Digital Twins» (RHDTO v1.2 + CRMdig + CIDOC-CRM). Περιέχει 10 σενάρια σε 5 μνημεία, 6 όψεις, ontology
trace panel και event-driven simulation με fixed `setTimeout` χρονοπρογραμματισμό.

Ζητούμενο: να υλοποιηθεί **νέα έκδοση** μέσα σε αυτό το workspace (το προηγούμενο project μένει
ανέγγιχτο — όλες οι αλλαγές γίνονται μόνο εδώ), **πιο user friendly και πιο ομαλή**, με:

- **μόνο ελληνικά** (χωρίς language switcher, χωρίς χρήση i18n για το περιεχόμενο),
- **τοπικά δεδομένα demo** όπως στο πρωτότυπο (καμία βάση, κανένα backend),
- **πιστή λογική/οντολογία**, αλλά **πιο σύγχρονο & καθαρό redesign**,
- καθοδηγούμενη ροή («Επόμενο βήμα» + πρόοδος), χειριστήρια εκτέλεσης (pause/step/speed),
  responsive για κινητό/tablet, ομαλές μεταβάσεις & ηχητικά/οπτικά σήματα κινδύνου.

Το workspace είναι σήμερα το αρχικό Enter template (React 19 + Vite + TS + Tailwind 3 + shadcn + router +
framer-motion + sonner + lucide-react). **Δεν χρειάζεται κανένα νέο dependency.**

---

## Τι παραμένει αναλλοίωτο (domain layer)

- Τα 10 σενάρια και τα δεδομένα τους (μνημεία, δείκτες, κατώφλια, risk score, ενέργειες, στιγμιότυπα)
  μεταφέρονται **verbatim**: `src/data/scenarios.ts`.
- Η εννοιολογική ροή / ontology steps: `src/ontology/trace.ts` (13 βήματα, CRMdig / CIDOC / RHDTO).
- Οι επιστημονικές διακρίσεις: Αξιολόγηση (rule check) ≠ Εκτίμηση (E13) · Risk State ≠ Damage State ·
  Ειδοποίηση ≠ Αυτόματη Απόκριση · Αυτόματη ≠ Ανθρώπινη Διαχείριση · Συντήρηση διδύμου στο τέλος.
- Οι αποφάσεις χειριστή παραμένουν **χειροκίνητες** (Επιβεβαίωση / Απόφαση / Ενεργοποίηση αυτόματης
  απόκρισης / Εφαρμογή μέτρων / Κλείσιμο περιστατικού).

### Δύο διορθώσεις ακρίβειας που θα γίνουν (ήταν λάθος στο πρωτότυπο)

1. **Κατώφλι**: το badge «ΞΕΠΕΡΑΣΤΗΚΕ ΤΟ ΟΡΙΟ» εμφανιζόταν πάντα. Θα υπολογίζεται πραγματικά:
   `exceeded = indicator >= threshold`. Σε σενάρια κάτω από το όριο (π.χ. «Ζημιά συντήρησης» 0.62 < 0.70)
   θα δείχνει «ΕΝΤΟΣ ΟΡΙΟΥ — ενημερωτική καταγραφή» με αντίστοιχο narration· οριακή τιμή
   («Ισχυροί άνεμοι» 0.65 = 0.65) μετράει ως υπέρβαση.
2. **Ειδοποίηση για MEDIUM**: το κείμενο «μόνο όταν γίνει ΥΨΗΛΗ ή ΚΡΙΣΙΜΗ» ήταν ανακριβές (2 σενάρια
   καταλήγουν MEDIUM). Η ειδοποίηση θα παράγεται για `MEDIUM|HIGH|CRITICAL` με σαφή χαρακτηρισμό
   (ενημερωτική / προειδοποίηση / συναγερμός) και σωστή διατύπωση.

---

## Νέα αρχιτεκτονική

```
src/
  data/types.ts            (μεταφορά + τύποι βημάτων)
  data/scenarios.ts        (μεταφορά verbatim — 10 σενάρια / 5 μνημεία)
  ontology/trace.ts        (μεταφορά verbatim)
  state/clock.ts           (μεταφορά: parseClock / fmtClock / addSeconds)
  state/timeline.ts        ΝΕΟ — δηλωτικό σενάριο βημάτων (STEPS per scenario)
  state/useSimulation.ts   ΑΝΑΓΡΑΦΗ — step engine με play/pause/step/speed/gates
  hooks/useKeyboardShortcuts.ts   ΝΕΟ
  hooks/useAlertSound.ts          ΝΕΟ (WebAudio, χωρίς asset)
  components/shell/AppShell.tsx   ΝΕΟ — responsive grid + drawers
  components/shell/TopBar.tsx     ΝΕΟ
  components/shell/CommandBar.tsx ΝΕΟ (αντικαθιστά NowBar) — narration + CTA + controls + progress
  components/shell/SidebarNav.tsx ΝΕΟ (αντικαθιστά Sidebar)
  components/shell/TracePanel.tsx ΝΕΟ (αντικαθιστά OntologyTrace)
  components/shell/ScenarioPicker.tsx ΝΕΟ (αντί για <select>)
  components/shell/HelpDialog.tsx     ΝΕΟ (συντομεύσεις + υπόμνημα)
  components/domain/*      ΝΕΟ — RiskBadge, OntoTag, Panel, KV, FlowNode/FlowProp, Explain,
                                 Meter, TimelineList, SnapshotChain, NextActionHint
  views/Overview.tsx · LiveMonitoring.tsx · RiskEvaluation.tsx · Alerts.tsx · Response.tsx · History.tsx
```

### Μηχανή προσομοίωσης (`src/state/useSimulation.ts` + `state/timeline.ts`)

Αντικαθίσταται ο fixed χρονοπρογραμματισμός από **δήλωση βημάτων** — κάθε βήμα:
`{ id, view, narration, ontology: { mark?, complete? }, effects, timeline?, toast?, gate? }`.

- `mode: "auto" | "manual"`, `playing`, `speed: 0.5 | 1 | 2`, `stepIndex`.
- `play/pause/toggle`, `nextStep()` (προχωρά αμέσως ένα βήμα, σταματά το auto), `reset()`,
  `skipToEnd()` (μόνο για επίδειξη, χωρίς να παρακάμπτει τα gates), `selectScenario(id)`, `setSpeed()`.
- **Gates**: τα ανθρώπινα βήματα γίνονται gates που σταματούν τη ροή και εκθέτουν την απαιτούμενη
  ενέργεια στο CommandBar (`nextAction`), ώστε ο χρήστης να μη ψάχνει κουμπιά σε άλλη όψη.
  Η «Επιβεβαίωση» είναι προαιρετική· το «Κλείσιμο» ξεκλειδώνει με αυτόματη απόκριση **ή** μέτρα.
- **Διορθώσεις ομαλότητας**: ξεχωριστοί timers σεναρίου vs toasts (στο πρωτότυπο το `clearTimers()`
  άφηνε κολλημένα toasts), καθαρισμός timers σε unmount/αλλαγή σεναρίου, κανένα διπλό `run()`.
- Διατηρούνται τα ίδια ontology marks/order ώστε η ιχνηλάτηση να μένει συνεπής (και με κλείσιμο χωρίς μέτρα).

### Design system (`src/index.css` + `tailwind.config.ts`)

- Semantic **HSL** tokens (light + dark block που ήδη υπάρχει στο template): `--background/--card/--muted/
  --primary/--accent/--destructive/--border/--ring` + νέα: `--risk-normal|medium|high|critical`,
  `--onto-crmdig|cidoc|rhdto`, gradients, `--shadow-elegant/--shadow-glow`, `--transition-smooth`, radii.
- `tailwind.config.ts`: επέκταση με `risk.*`, `onto.*`, `brand.*` colors, shadows, keyframes/animations
  (`pulse-ring`, `rise`, `fade-in`, `rail`). Καμία inline/`text-white`-style χρήση στα components.
- Επαναχρησιμοποίηση υπαρχόντων shadcn primitives: `card`, `button` (νέες variants: `hero`, `warn`, `go`,
  `done`), `badge`, `progress`, `sheet` (mobile sidebar & trace), `dialog` (scenario picker, help),
  `tooltip`, `tabs`, `toggle-group` (speed), `switch`, `separator`, `scroll-area`, `collapsible` (trace σε
  mobile). Toasts μέσω του υπάρχοντος `sonner` Toaster αντί για custom `Toasts.tsx`. Icons: `lucide-react`.

### UX βελτιώσεις

1. **Καθοδηγούμενη ροή**: sticky CommandBar με narration (`aria-live="polite"`), **κύριο CTA «Επόμενο
   βήμα»**, progress rail με «x/13 βήματα οντολογίας» + stepper ανά όψη, και in-view `NextActionHint` όταν
   εκκρεμεί ανθρώπινη ενέργεια.
2. **Χειριστήρια**: Play/Pause, Επόμενο βήμα, Επαναφορά, ταχύτητα 0.5x/1x/2x, Λειτουργία παρουσίασης.
3. **Scenario gallery**: dialog με ομαδοποίηση ανά μνημείο (Παρθενώνας, Κνωσός, Μυστράς, Επίδαυρος, Σούνιο),
   φίλτρο ανθρωπογενής/φυσικός, badge κινδύνου & risk score, πλήρες keyboard support.
4. **Responsive**: ≥1280 → 3 στήλες (nav / περιεχόμενο / trace)· tablet → nav icon-rail + trace drawer·
   κινητό (390) → TopBar + Sheet για nav/trace, μονή στήλη, sticky CommandBar, χωρίς οριζόντιο scroll.
5. **Motion**: `framer-motion` (AnimatePresence για αλλαγή όψης, animated risk hero με παλμό στην αλλαγή
   κατάστασης, σταδιακή εμφάνιση logs/timeline, pop στα στιγμιότυπα, spring στο progress rail) με
   `useReducedMotion` → πλήρης σεβασμός `prefers-reduced-motion`.
6. **Ήχος/οπτικά σήματα**: διακριτικό chime (WebAudio oscillator, χωρίς αρχεία) σε ειδοποίηση/αλλαγή
   κατάστασης, με toggle mute στο TopBar (AudioContext resume στο πρώτο click).
7. **Προσβασιμότητα & βοήθεια**: συντομεύσεις (`Space` play/pause, `→` επόμενο βήμα, `R` επαναφορά,
   `1–6` όψεις, `?` βοήθεια), focus-visible rings, landmarks, contrast ελεγχόμενο στα tokens.

---

## Αρχεία προς αλλαγή

| Ενέργεια | Αρχείο |
|---|---|
| Μεταφορά verbatim | `src/data/types.ts`, `src/data/scenarios.ts`, `src/ontology/trace.ts`, `src/state/clock.ts` |
| Νέα | `src/state/timeline.ts`, `src/hooks/useKeyboardShortcuts.ts`, `src/hooks/useAlertSound.ts`, `src/components/shell/*`, `src/components/domain/*`, `src/views/*` |
| Αναγραφή | `src/state/useSimulation.ts` |
| Τροποποίηση | `src/index.css`, `tailwind.config.ts`, `src/pages/Index.tsx`, `src/components/ui/button.tsx`, `index.html` (`lang="el"`, τίτλος), `src/pages/NotFound.tsx` (ελληνικό κείμενο), `src/App.tsx` (καθαρισμός providers/Toaster) |
| Ανέπαφα | `src/components/ui/*` (εκτός button variants), `src/router.tsx`, `src/i18n/*`, `public/locales/*`, `src/analytics.ts`, `.enter/*` |

Σημείωση: διατηρείται το `bootstrapGeneratedSiteAnalytics()` (δεν αφαιρείται/παρακάμπτεται, χωρίς
χειροκίνητα `fetch`). Δεν χρησιμοποιείται `t()` για το περιεχόμενο του demo.

---

## Implementation checklist

- [ ] Μεταφορά `types.ts`, `scenarios.ts` (10 σενάρια / 5 μνημεία), `trace.ts` (13 βήματα), `clock.ts` στο `src/`.
- [ ] `state/timeline.ts`: δηλωτικά βήματα ανά σενάριο με view, narration, ontology marks, toast, timeline event, gate.
- [ ] `state/useSimulation.ts`: play/pause/nextStep/reset/speed/gates + `nextAction` + ξεχωριστοί timers toasts + cleanup.
- [ ] Διόρθωση `exceeded = indicator >= threshold` και προσαρμογή κειμένων/narration (κάτω/πάνω/οριακή τιμή).
- [ ] Ειδοποίηση για `MEDIUM|HIGH|CRITICAL` με σωστό χαρακτηρισμό (ενημερωτική/προειδοποίηση/συναγερμός).
- [ ] Gates: Επιβεβαίωση (προαιρετική), Απόφαση → όψη Απόκρισης, Ενεργοποίηση, Μέτρα, Κλείσιμο· σωστά ontology marks σε κάθε διαδρομή (και κλείσιμο χωρίς μέτρα).
- [ ] `index.css` + `tailwind.config.ts`: semantic HSL tokens (light/dark), risk/onto/brand colors, shadows, keyframes.
- [ ] `button.tsx`: variants `hero`/`warn`/`go`/`done` με semantic tokens (χωρίς hardcoded χρώματα).
- [ ] `AppShell` + `TopBar` + `SidebarNav` + `TracePanel`: responsive 3-column → drawers, Sheet για κινητό.
- [ ] `CommandBar`: sticky, narration (aria-live), CTA επόμενης ενέργειας, controls, progress rail + stepper.
- [ ] `ScenarioPicker`: ομαδοποίηση ανά μνημείο, φίλτρο hazard, risk badge/score, keyboard accessible.
- [ ] `HelpDialog` + `useKeyboardShortcuts` (Space/→/R/1–6/?) + `useAlertSound` με mute toggle.
- [ ] Έξι όψεις ξαναχτισμένες με tokens + framer-motion, ίδιο ελληνικό περιεχόμενο και `Explain` callouts.
- [ ] `pages/Index.tsx` φορτώνει το demo· `index.html` `lang="el"` + ελληνικός τίτλος· `NotFound` στα ελληνικά.
- [ ] Sonner toasts αντί custom `Toasts.tsx`· αφαίρεση περιττών template providers χωρίς να σπάσει ο router.

## Verification checklist

- [ ] `pnpm lint` και `pnpm exec tsc --noEmit` χωρίς σφάλματα.
- [ ] `pnpm run build` επιτυχές (authoritative build του framework).
- [ ] Πλήρης ροή «Βανδαλισμός» (HIGH): monitoring → evaluation → alerts → response → history, με σωστά ontology marks 13/13 στο κλείσιμο.
- [ ] «Σεισμός» (CRITICAL): εμφανίζεται Damage State στο στιγμιότυπο, χωρίς σύγχυση με Risk State.
- [ ] «Ζημιά συντήρησης» (0.62 < 0.70): εμφανίζεται «ΕΝΤΟΣ ΟΡΙΟΥ» και όχι «ΞΕΠΕΡΑΣΤΗΚΕ ΤΟ ΟΡΙΟ», με ενημερωτική ειδοποίηση.
- [ ] Οριακή περίπτωση «Ισχυροί άνεμοι» (0.65 = 0.65): μετράει ως υπέρβαση.
- [ ] Pause → «Επόμενο βήμα» προχωρά ένα βήμα και σταματά το auto· speed 0.5x/2x αλλάζει τον ρυθμό· reset μηδενίζει όψη/κατάσταση/toasts (χωρίς κολλημένα toasts).
- [ ] Gate ordering: «Κλείσιμο» ενεργό μόνο μετά από αυτόματη απόκριση ή μέτρα· κλείσιμο χωρίς μέτρα αφήνει συνεπή ιχνηλάτηση.
- [ ] Αλλαγή σεναρίου εν μέσω εκτέλεσης: κανένα υπολειπόμενο timer/διπλό βήμα.
- [ ] Responsive επαλήθευση με `website_screenshot` στην ίδια όψη σε `mobile_390` και `desktop_1280` (drawers, sticky CommandBar, χωρίς οριζόντιο scroll).
- [ ] Keyboard: Space/→/R/1–6/? λειτουργούν, focus-visible ορατό, narration με aria-live.
- [ ] `prefers-reduced-motion`: καμία animation, καμία οπτική/λειτουργική αστοχία.
- [ ] Ήχος: chime στην ειδοποίηση μετά από user gesture, mute toggle σιωπά πλήρως.
