'use client';
import { CheckCircle2, Circle } from 'lucide-react';
import { CHAPTERS } from './shared';

export default function TopicsTab() {
  const done = CHAPTERS.filter(c => c.done).length;
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900">Course Topics</h2>
          <span className="text-xs text-indigo-600 font-semibold">View all</span>
        </div>
        {CHAPTERS.map(c => (
          <div key={c.num} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-extrabold ${c.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>{c.num}</div>
            <p className={`flex-1 text-sm font-semibold ${c.done ? 'text-gray-800' : 'text-gray-400'}`}>{c.title}</p>
            {c.done ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> : <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />}
          </div>
        ))}
      </div>
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-3">
        <span className="text-3xl">🏆</span>
        <div>
          <p className="text-sm font-extrabold text-indigo-800">You&apos;re on track!</p>
          <p className="text-xs text-indigo-600">You&apos;ve completed {done} of {CHAPTERS.length} chapters</p>
          <div className="w-32 h-1.5 bg-indigo-200 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${done / CHAPTERS.length * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
