// ── Step type ──────────────────────────────────────────────────────────────
export type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// ── Shared props ───────────────────────────────────────────────────────────
export interface ScreenProps {
  onNext: () => void;
  onBack: () => void;
}
