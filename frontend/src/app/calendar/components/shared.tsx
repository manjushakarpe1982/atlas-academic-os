'use client';

export function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
    
      {/* Status bar */}
     
      <div>{children}</div>
    </div>
  );
}
