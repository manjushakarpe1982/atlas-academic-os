'use client';
import { WEIGHTS } from './shared';

export default function GradeBreakdown() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <h2 className="text-sm font-extrabold text-gray-900 mb-3">Grade Breakdown</h2>
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {(()=>{let o=-90;return WEIGHTS.map(w=>{const a=w.pct/100*360;const r=38;const s=o*Math.PI/180;const e=(o+a)*Math.PI/180;const x1=50+r*Math.cos(s);const y1=50+r*Math.sin(s);const x2=50+r*Math.cos(e);const y2=50+r*Math.sin(e);const l=a>180?1:0;o+=a;return <path key={w.label} d={`M50 50 L${x1} ${y1} A${r} ${r} 0 ${l} 1 ${x2} ${y2}Z`} fill={w.color}/>;})})()}
            <circle cx="50" cy="50" r="24" fill="white"/>
            <text x="50" y="47" textAnchor="middle" fontSize="10" fontWeight="800" fill="#111">84%</text>
            <text x="50" y="57" textAnchor="middle" fontSize="7" fill="#999">Total</text>
          </svg>
        </div>
        <div className="flex-1 space-y-1.5">
          {WEIGHTS.map(w=>(
            <div key={w.label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:w.color}}/>
              <span className="flex-1 text-xs text-gray-600">{w.label}</span>
              <span className="text-xs font-bold text-gray-800">{w.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
