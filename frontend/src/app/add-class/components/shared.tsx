'use client';
// ── Shared UI components used across all screens ───────────────────────────


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
      className="relative bg-white rounded-[2.5rem] shadow-2xl border border-gray-200 overflow-hidden"
      style={{ width: 320, minHeight: 580 }}
    >
      {/* Status bar */}
      <div className="bg-white px-6 pt-3 pb-1 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-900">9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-2 border border-gray-900 rounded-sm relative">
            <div className="absolute inset-0.5 bg-gray-900 rounded-sm w-3/4" />
          </div>
        </div>
      </div>

      {/* Screen content */}
      <div className="flex-1">{children}</div>

      {/* Step progress dots */}
      {step && total && (
        <div className="px-6 pb-4">
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i < step ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center">
            Step {step} of {total}
          </p>
        </div>
      )}
    </div>
  );
}
