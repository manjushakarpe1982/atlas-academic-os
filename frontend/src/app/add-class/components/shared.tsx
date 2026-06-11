'use client';
// ── Shared UI components ───────────────────────────────────────────────────

// Confidence badge
export function ConfBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    High:   'bg-green-100 text-green-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low:    'bg-red-100 text-red-600',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles[level] || styles.Medium}`}>
      {level}
    </span>
  );
}

// Segmented progress bar — each step is a short pill/dash
// Filled segments = indigo-600, unfilled = gray-200, gap between each
export function SegmentedProgress({
  step,
  total,
  label,
}: {
  step: number;
  total: number;
  label?: string;
}) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < step ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {label && (
        <p className="text-xs text-gray-400 text-center mt-1">{label}</p>
      )}
    </div>
  );
}

// Phone shell wrapper
export function Phone({
  children,
  step,
  total,
}: {
  children: React.ReactNode;
  step?: number;
  total?: number;
}) {
  return (
    <div
      className="relative"
  
    >
    

      {/* Screen content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
