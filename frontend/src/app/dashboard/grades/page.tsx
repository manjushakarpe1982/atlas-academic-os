'use client';
import { ChevronDown } from 'lucide-react';
import { CLASSES } from '../components/mockData';

const BREAKDOWN = [
  { label: 'Homework',     pct: 25, score: 90, color: '#6366f1' },
  { label: 'Labs',         pct: 20, score: 85, color: '#8b5cf6' },
  { label: 'Exams',        pct: 40, score: 78, color: '#ec4899' },
  { label: 'Participation',pct: 15, score: 95, color: '#f59e0b' },
];

export default function GradesPage() {
  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-extrabold text-gray-900 mb-4">Grade Details</h1>

      {/* Class selector */}
      <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200 mb-5">
        <span className="text-sm font-bold text-gray-900">Biology 1107</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>

      {/* Current Grade */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4 text-center">
        <p className="text-xs text-gray-400 mb-1">Current Grade</p>
        <p className="text-5xl font-extrabold text-gray-900">84%</p>
        <p className="text-2xl font-extrabold text-indigo-600 mt-1">B</p>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">Need for Next Grade</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl font-extrabold text-gray-900">A</p>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '84%' }} />
            </div>
            <p className="text-sm font-bold text-green-600">92%</p>
          </div>
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">Performance Breakdown</h2>
        <div className="space-y-3">
          {BREAKDOWN.map(b => (
            <div key={b.label} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: b.color }} />
              <span className="text-xs text-gray-600 w-24">{b.label}</span>
              <span className="text-xs text-gray-400 w-6">{b.pct}%</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${b.score}%`, background: b.color }} />
              </div>
              <span className="text-xs font-bold text-gray-800 w-8 text-right">{b.score}%</span>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full py-3 text-sm font-bold text-indigo-600 border border-indigo-200 rounded-2xl hover:bg-indigo-50">
        View All Grades
      </button>
    </div>
  );
}
