'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import { CALENDAR_EVENTS } from '../components/mockData';

const DAYS = ['S','M','T','W','T','F','S'];
const DATES = [
  [null,null,null,1,2,3,4],
  [5,6,7,8,9,10,11],
  [12,13,14,15,16,17,18],
  [19,20,21,22,23,24,25],
  [26,27,28,29,30,31,null],
];
const PRIORITY_COLOR: Record<string,string> = {
  High: 'text-red-600', Medium: 'text-amber-600', Low: 'text-green-600',
};

export default function CalendarPage() {
  const [selected, setSelected] = useState(13);

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-gray-900">May 2024</h1>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </button>
          <button className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d,i) => (
            <div key={i} className="text-center text-[10px] font-extrabold text-gray-400 py-1">{d}</div>
          ))}
        </div>
        {DATES.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((d, di) => (
              <button key={di} onClick={() => d && setSelected(d)}
                className={`aspect-square flex items-center justify-center text-sm font-semibold rounded-full transition-all ${
                  !d ? '' :
                  d === selected ? 'bg-indigo-600 text-white' :
                  d === 13 ? 'bg-indigo-100 text-indigo-600' :
                  'text-gray-700 hover:bg-gray-100'
                }`}>
                {d}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Events for selected date */}
      <div>
        <p className="text-xs font-extrabold text-gray-500 mb-2">
          Today · Mon, May {selected}
        </p>
        <div className="space-y-2">
          {CALENDAR_EVENTS.map((e, i) => (
            <div key={i} className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-1 h-12 bg-indigo-600 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-extrabold text-gray-900">{e.title}</p>
                  <p className="text-xs text-gray-400">{e.class}</p>
                  <p className={`text-xs font-semibold mt-0.5 ${PRIORITY_COLOR[e.priority]}`}>
                    {e.priority} · {e.due}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-20 right-4 w-14 h-14 bg-indigo-600 rounded-full shadow-xl flex items-center justify-center text-white text-2xl">
        +
      </button>
    </div>
  );
}
