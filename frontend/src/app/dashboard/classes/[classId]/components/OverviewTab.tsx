'use client';
import { PROGRESS_ITEMS, UPCOMING, PC } from './shared';

export default function OverviewTab() {
  const pct = Math.round((PROGRESS_ITEMS.reduce((s,i)=>s+i.done,0)/PROGRESS_ITEMS.reduce((s,i)=>s+i.total,0))*100);
  const r=38; const circ=2*Math.PI*r;
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">Course Progress</h2>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10"/>
              <circle cx="50" cy="50" r={r} fill="none" stroke="#22c55e" strokeWidth="10"
                strokeDasharray={`${circ*pct/100} ${circ*(1-pct/100)}`} strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-lg font-extrabold text-gray-900">{pct}%</p>
              <p className="text-[9px] text-gray-400">Complete</p>
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            {PROGRESS_ITEMS.map(p=>(
              <div key={p.label} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"/>
                <span className="flex-1 text-xs text-gray-600">{p.label}</span>
                <span className="text-xs font-bold text-gray-800">{p.done}/{p.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h2 className="text-sm font-extrabold text-gray-900 mb-2">About This Course</h2>
        <p className="text-xs text-gray-500 leading-relaxed mb-3">Introduction to the principles of biology including cell structure, genetics, evolution, and ecosystems.</p>
        <div className="grid grid-cols-2 gap-3">
          {[{icon:'👤',label:'Instructor',value:'Dr. Amy Austin'},{icon:'📚',label:'Credits',value:'3'},{icon:'🗓️',label:'Schedule',value:'Mon, Wed, Fri 10:00 AM'},{icon:'📍',label:'Location',value:'Science Building Room 204'}].map(i=>(
            <div key={i.label} className="flex items-start gap-2">
              <span className="text-base flex-shrink-0">{i.icon}</span>
              <div><p className="text-[10px] text-gray-400">{i.label}</p><p className="text-xs font-semibold text-gray-800">{i.value}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900">Upcoming</h2>
          <span className="text-xs text-indigo-600 font-semibold">View all</span>
        </div>
        {UPCOMING.map(u=>(
          <div key={u.title} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className={`w-8 h-8 ${u.color} rounded-xl flex items-center justify-center text-sm flex-shrink-0`}>{u.icon}</div>
            <div className="flex-1"><p className="text-sm font-semibold text-gray-800">{u.title}</p><p className="text-xs text-gray-400">{u.date}</p></div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PC[u.priority]}`}>{u.priority}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
