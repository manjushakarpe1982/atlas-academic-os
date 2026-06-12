'use client';
import { useState } from 'react';
import { CheckCircle2, Circle, Brain } from 'lucide-react';
import { STUDY_PLAN } from '../components/mockData';

export default function StudyPlanPage() {
  const [view, setView] = useState<'Day'|'Week'>('Week');
  const [checked, setChecked] = useState<Record<string,boolean>>({});

  const toggle = (key: string) => setChecked(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Your AI Study Plan</h1>
          <p className="text-xs text-gray-400">Personalized for this week</p>
        </div>
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Brain className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      {/* Day / Week toggle */}
      <div className="flex bg-gray-100 rounded-2xl p-1 mb-5 w-fit">
        {(['Day','Week'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}>{v}</button>
        ))}
      </div>

      {/* Schedule */}
      <div className="space-y-5">
        {STUDY_PLAN.map(day => (
          <div key={day.day}>
            <p className="text-xs font-extrabold text-gray-500 mb-2">{day.day}</p>
            <div className="space-y-2">
              {day.sessions.map(s => {
                const key = `${day.day}-${s.class}`;
                const done = checked[key] || s.done;
                return (
                  <div key={key}
                    className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-3">
                    <button onClick={() => toggle(key)}>
                      {done
                        ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                        : <Circle className="w-5 h-5 text-gray-300" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {s.class}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-gray-400">{s.mins} min</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Progress */}
      <div className="mt-5 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-extrabold text-gray-900">Weekly Progress</p>
          <p className="text-lg font-extrabold text-indigo-600">75%</p>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
          <div className="h-full bg-indigo-600 rounded-full w-3/4" />
        </div>
        <p className="text-xs text-gray-400">May 13 - May 19 · Goal: 10 study sessions</p>
      </div>
    </div>
  );
}
