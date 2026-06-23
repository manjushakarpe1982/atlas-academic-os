'use client';
import { ChevronLeft, Flame } from 'lucide-react';
import { PROGRESS_DATA } from './shared';

interface Props { onBack: () => void; }

export default function ProgressView({ onBack }: Props) {
  const d = PROGRESS_DATA;
  const r = 38; const circ = 2 * Math.PI * r;

  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
        <div>
          <h1 className="text-base font-extrabold text-gray-900">Your Progress</h1>
          <p className="text-xs text-gray-400">Genetics</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">Overall Progress</h2>
        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="8" />
              <circle cx="50" cy="50" r={r} fill="none" stroke="#6366f1" strokeWidth="8"
                strokeDasharray={`${circ * d.overall / 100} ${circ * (1 - d.overall / 100)}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-extrabold text-gray-900">{d.overall}%</p>
            </div>
          </div>
          <div>
            <p className="text-lg font-extrabold text-green-600">Good Job!</p>
            <p className="text-xs text-gray-400">Keep it up!</p>
          </div>
        </div>
      </div>

      {/* Performance by Material */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">Performance by Material</h2>
        <div className="space-y-3">
          {d.materials.map((m, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg flex-shrink-0">{m.icon}</span>
              <p className="text-sm font-semibold text-gray-800 flex-1">{m.name}</p>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                m.status === 'Completed' ? 'text-green-600 bg-green-50' :
                m.status === 'In Progress' ? 'text-amber-600 bg-amber-50' :
                'text-indigo-600 bg-indigo-50'
              }`}>{m.status || m.progress}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weak Areas */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">Weak Areas</h2>
        <div className="space-y-3">
          {d.weakAreas.map((w, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-gray-800">{w.name}</p>
                <span className={`text-xs font-bold ${w.pct < 50 ? 'text-red-600' : 'text-amber-600'}`}>{w.pct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${w.pct < 50 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${w.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Streak */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Flame className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Study Streak</p>
          <p className="text-2xl font-extrabold text-indigo-700">{d.streak} Days</p>
          <p className="text-xs text-gray-400">Great consistency!</p>
        </div>
      </div>
    </div>
  );
}
