'use client';
import { useState } from 'react';
import { UPCOMING, COMPLETED, LATE, PC } from './shared';

export default function AssignmentsTab() {
  const [filter, setFilter] = useState('All');
  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {['All', 'Homework', 'Quiz', 'Lab', 'Exam'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{f}</button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900">Upcoming</h2>
          <span className="text-xs text-indigo-600 font-semibold">View all</span>
        </div>
        {UPCOMING.map(u => (
          <div key={u.title} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className={`w-8 h-8 ${u.color} rounded-xl flex items-center justify-center text-sm flex-shrink-0`}>{u.icon}</div>
            <div className="flex-1"><p className="text-sm font-semibold text-gray-800">{u.title}</p><p className="text-xs text-gray-400">{u.date}</p></div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PC[u.priority]}`}>{u.priority}</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">Completed</h2>
        {COMPLETED.map(c => (
          <div key={c.title} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-sm flex-shrink-0">{c.icon}</div>
            <div className="flex-1"><p className="text-sm font-semibold text-gray-500 line-through">{c.title}</p><p className="text-xs text-gray-400">{c.date}</p></div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600">Completed</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h2 className="text-sm font-extrabold text-red-500 mb-3">Late</h2>
        {LATE.map(l => (
          <div key={l.title} className="flex items-center gap-3 py-2">
            <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center text-sm flex-shrink-0">{l.icon}</div>
            <div className="flex-1"><p className="text-sm font-semibold text-gray-800">{l.title}</p><p className="text-xs text-gray-400">{l.date}</p></div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">Late</span>
          </div>
        ))}
      </div>
    </div>
  );
}
