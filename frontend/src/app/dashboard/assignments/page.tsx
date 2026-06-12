'use client';
import { useState } from 'react';
import { Filter } from 'lucide-react';
import { ASSIGNMENTS } from '../components/mockData';

const FILTERS = ['All','Homework','Quiz','Lab','Exam'];
const PRIORITY_COLOR: Record<string,string> = {
  High: 'bg-red-50 text-red-600', Medium: 'bg-amber-50 text-amber-600', Low: 'bg-green-50 text-green-600',
};

export default function AssignmentsPage() {
  const [filter, setFilter] = useState('All');

  const due = ASSIGNMENTS.filter(a => a.status === 'pending');
  const done = ASSIGNMENTS.filter(a => a.status === 'completed');

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-extrabold text-gray-900">Assignments</h1>
        <button className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <Filter className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{scrollbarWidth:'none'}}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Due */}
      <p className="text-xs font-extrabold text-red-500 mb-2">Due Tomorrow</p>
      <div className="space-y-2 mb-5">
        {due.slice(0,2).map(a => (
          <div key={a.id} className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center text-sm">📋</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{a.title}</p>
                <p className="text-xs text-gray-400">{a.sub}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.due}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PRIORITY_COLOR[a.priority]}`}>
                {a.priority}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Due This Week */}
      <p className="text-xs font-extrabold text-gray-500 mb-2">Due This Week</p>
      <div className="space-y-2 mb-5">
        {due.slice(2).map(a => (
          <div key={a.id} className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center text-sm">📋</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{a.title}</p>
                <p className="text-xs text-gray-400">{a.sub}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.due}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PRIORITY_COLOR[a.priority]}`}>
                {a.priority}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Completed */}
      <p className="text-xs font-extrabold text-green-600 mb-2">Completed</p>
      <div className="space-y-2">
        {done.map(a => (
          <div key={a.id} className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 opacity-70">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center text-sm">✅</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-500 line-through">{a.title}</p>
                <p className="text-xs text-gray-400">{a.sub}</p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600">Completed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
