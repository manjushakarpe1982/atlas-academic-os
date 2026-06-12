'use client';
import Link from 'next/link';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { CLASSES, ASSIGNMENTS, STUDY_PLAN } from './components/mockData';

const PRIORITY_COLOR: Record<string, string> = {
  High: 'text-red-600 bg-red-50', Medium: 'text-amber-600 bg-amber-50', Low: 'text-green-600 bg-green-50',
};

export default function DashboardHome() {
  return (
    <div className="px-4 py-4 space-y-5">

      {/* Greeting */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Good Morning, Pooja 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">You have 3 important deadlines this week.</p>
      </div>

      {/* Study Priority */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900">Study Priority</h2>
          <Link href="/dashboard/assignments" className="text-xs text-indigo-600 font-semibold">View all</Link>
        </div>
        <div className="space-y-2">
          {ASSIGNMENTS.filter(a => a.status === 'pending').slice(0,3).map(a => (
            <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-gray-800">{a.title}</p>
                <p className="text-xs text-gray-400">Tomorrow · Worth 20%</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PRIORITY_COLOR[a.priority]}`}>
                {a.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900">Quick Stats</h2>
          <Link href="/dashboard/grades" className="text-xs text-indigo-600 font-semibold">See all</Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Classes',    value: '3',   icon: '📚' },
            { label: 'Tasks',      value: '7',   icon: '✅' },
            { label: 'Day Streak', value: '12',  icon: '🔥' },
            { label: 'Avg. Grade', value: '84%', icon: '📊' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-lg">{s.icon}</span>
              <p className="text-base font-extrabold text-gray-900">{s.value}</p>
              <p className="text-[10px] text-gray-400 text-center">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Study Plan */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900">Today&apos;s Study Plan</h2>
          <Link href="/dashboard/study-plan" className="text-xs text-indigo-600 font-semibold">See plan</Link>
        </div>
        <div className="space-y-2">
          {[
            { class: 'Biology 1107',  mins: 45, color: 'bg-green-500'  },
            { class: 'Calculus 251',  mins: 30, color: 'bg-blue-500'   },
            { class: 'Chemistry 101', mins: 20, color: 'bg-purple-500' },
          ].map(s => (
            <div key={s.class} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${s.color} flex-shrink-0`} />
              <p className="flex-1 text-sm font-semibold text-gray-800">{s.class}</p>
              <p className="text-xs text-gray-400">{s.mins} min</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900">Upcoming Deadlines</h2>
          <Link href="/dashboard/assignments" className="text-xs text-indigo-600 font-semibold">View all</Link>
        </div>
        {ASSIGNMENTS.filter(a => a.status === 'pending').slice(0,3).map(a => (
          <div key={a.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-sm">📋</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">{a.title}</p>
              <p className="text-xs text-gray-400">{a.due}</p>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PRIORITY_COLOR[a.priority]}`}>
              {a.priority}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
