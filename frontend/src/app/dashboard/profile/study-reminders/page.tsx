'use client';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import BackHeader from '../BackHeader';

export default function StudyRemindersPage() {
  const [weekend,     setWeekend]     = useState(true);
  const [prioritize,  setPrioritize]  = useState(true);
  const [suggestions, setSuggestions] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Study Reminders" />

      <div className="px-4 py-5 space-y-4">

        {/* Daily Study Goal */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3.5 flex items-center justify-between border-b border-gray-50">
            <div>
              <p className="text-sm font-bold text-gray-800">Daily Study Goal</p>
              <p className="text-xs text-gray-400">2 Hours</p>
              <p className="text-[10px] text-indigo-500">Recommended: 2–3 hours</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>

          <div className="px-4 py-3.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-800">Preferred Study Time</p>
              <p className="text-xs text-gray-400">Evening (6 PM – 10 PM)</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
        </div>

        {/* Toggle options */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {[
            { label: 'Weekend Study',       sub: 'Send reminders on weekends',        val: weekend,     set: setWeekend     },
            { label: 'Prioritize Weak Areas',sub: 'Focus more on weak areas',         val: prioritize,  set: setPrioritize  },
            { label: 'Smart Suggestions',   sub: 'Get AI suggestions as reminders',   val: suggestions, set: setSuggestions },
          ].map((s, i, arr) => (
            <div key={s.label}
              className={`flex items-center gap-3 px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">{s.label}</p>
                <p className="text-xs text-gray-400">{s.sub}</p>
              </div>
              <button onClick={() => s.set(!s.val)}
                className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${s.val ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${s.val ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all">
          Save Reminders
        </button>
      </div>
    </div>
  );
}
