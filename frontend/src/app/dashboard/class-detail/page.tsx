'use client';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TABS = ['Overview','Grades','Topics','Assignments'];
const WEIGHTS = [
  { label: 'Homework', pct: 25, color: '#6366f1' },
  { label: 'Labs',     pct: 20, color: '#8b5cf6' },
  { label: 'Exams',    pct: 40, color: '#ec4899' },
  { label: 'Participation', pct: 15, color: '#f59e0b' },
];

export default function ClassDetailPage() {
  const router = useRouter();
  const [tab, setTab] = useState('Overview');

  return (
    <div className="pb-4">
      {/* Class header */}
      <div className="bg-white px-4 pt-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center text-white font-bold">🌿</div>
            <div>
              <h1 className="font-extrabold text-gray-900">Biology 1107</h1>
              <p className="text-xs text-gray-400">Life Sciences</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Current Grade</p>
            <p className="text-2xl font-extrabold text-gray-900">84%</p>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                tab === t ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Grade Breakdown */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <h2 className="text-sm font-extrabold text-gray-900 mb-3">Grade Breakdown</h2>
          {/* Donut chart placeholder */}
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#6366f1" strokeWidth="12"
                  strokeDasharray="239" strokeDashoffset="59.75" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-lg font-extrabold text-gray-900">84%</p>
                <p className="text-[9px] text-gray-400">Total</p>
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              {WEIGHTS.map(w => (
                <div key={w.label} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: w.color }} />
                  <span className="text-xs text-gray-600 flex-1">{w.label}</span>
                  <span className="text-xs font-bold text-gray-800">{w.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-extrabold text-gray-900 mb-3">Upcoming Items</h2>
          {[
            { title: 'Quiz 1',        date: 'Tomorrow',  priority: 'High'   },
            { title: 'Lab Report 1',  date: 'Sun, May 19', priority: 'Medium' },
            { title: 'Midterm Exam',  date: 'May 26',    priority: 'Medium' },
          ].map(i => (
            <div key={i.title} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-gray-800">{i.title}</p>
                <p className="text-xs text-gray-400">{i.date}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                i.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
              }`}>{i.priority}</span>
            </div>
          ))}
          <button className="w-full mt-3 py-2 text-sm font-bold text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50">
            View Grade Details
          </button>
        </div>
      </div>
    </div>
  );
}
