'use client';
import { useState } from 'react';
import { ChevronRight, Calendar, AlertCircle, CheckCircle2, Clock, SlidersHorizontal, Brain } from 'lucide-react';

const STATS = [
  { label: 'Upcoming', count: 5, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { label: 'Overdue', count: 1, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
  { label: 'Completed', count: 12, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Due This Week', count: 2, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
];

const FILTERS = ['All', 'Assignment', 'Quiz', 'Exam', 'Lab'];

interface Assignment {
  id: string;
  title: string;
  category: string;
  dueText: string;
  weight: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'OVERDUE';
  action: string;
  barColor: string;
}

const ASSIGNMENTS: Assignment[] = [
  { id: '1', title: 'Homework 1',          category: 'Assignment', dueText: 'Due Tomorrow, Jun 25',      weight: 'Worth 10%', priority: 'HIGH',    action: 'View',    barColor: 'bg-green-400' },
  { id: '2', title: 'Quiz 2',              category: 'Quiz',       dueText: 'Due in 3 days, Jun 28',     weight: 'Worth 20%', priority: 'HIGH',    action: 'Prepare', barColor: 'bg-orange-400' },
  { id: '3', title: 'Midterm Exam',         category: 'Exam',       dueText: 'Due in 12 days, Jul 7',     weight: 'Worth 30%', priority: 'MEDIUM',  action: 'Study',   barColor: 'bg-yellow-400' },
  { id: '4', title: 'Lab Report 2',         category: 'Lab',        dueText: 'Due in 15 days, Jul 10',    weight: 'Worth 15%', priority: 'LOW',     action: 'View',    barColor: 'bg-blue-400' },
  { id: '5', title: 'Reading Assignment',   category: 'Assignment', dueText: 'Overdue by 2 days, Jun 20', weight: 'Worth 5%',  priority: 'OVERDUE', action: 'View',    barColor: 'bg-red-400' },
];

function getCatIcon(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes('quiz')) return '❓';
  if (c.includes('exam')) return '📋';
  if (c.includes('lab')) return '🧪';
  return '📝';
}

function getCatIconBg(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes('quiz')) return 'bg-orange-100';
  if (c.includes('exam')) return 'bg-yellow-100';
  if (c.includes('lab')) return 'bg-blue-100';
  return 'bg-green-100';
}

function getCatBadge(cat: string): { text: string; color: string } {
  const c = cat.toLowerCase();
  if (c.includes('quiz')) return { text: 'Quiz', color: 'text-orange-600 bg-orange-50' };
  if (c.includes('exam')) return { text: 'Exam', color: 'text-yellow-700 bg-yellow-50' };
  if (c.includes('lab')) return { text: 'Lab', color: 'text-blue-600 bg-blue-50' };
  return { text: 'Assignment', color: 'text-green-600 bg-green-50' };
}

function getPriorityStyle(p: string): string {
  if (p === 'HIGH') return 'text-red-600 bg-red-50 border-red-200';
  if (p === 'MEDIUM') return 'text-amber-600 bg-amber-50 border-amber-200';
  if (p === 'LOW') return 'text-green-600 bg-green-50 border-green-200';
  return 'text-red-700 bg-red-100 border-red-300';
}

function getActionStyle(a: string): string {
  if (a === 'Prepare') return 'text-orange-600 border-orange-200 hover:bg-orange-50';
  if (a === 'Study') return 'text-yellow-700 border-yellow-200 hover:bg-yellow-50';
  return 'text-indigo-600 border-indigo-200 hover:bg-indigo-50';
}

export default function AssignmentsTab() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? ASSIGNMENTS : ASSIGNMENTS.filter(a => a.category === filter);

  return (
    <div className="space-y-4">

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col items-center text-center">
            <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center mb-1`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-lg font-extrabold text-gray-900">{s.count}</p>
            <p className="text-[9px] text-gray-400 font-medium leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}>{f}</button>
        ))}
        <button className="flex-shrink-0 w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center ml-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-gray-900">Upcoming ({filtered.length})</h2>
        <button className="text-xs text-gray-500 font-medium">Sort by: <span className="text-indigo-600 font-bold">Due Date ↓</span></button>
      </div>

      {/* Assignment Cards */}
      <div className="space-y-3">
        {filtered.map(a => {
          const badge = getCatBadge(a.category);
          return (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex">
              {/* Left Color Bar */}
              <div className={`w-1.5 ${a.barColor} flex-shrink-0`} />

              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Category Icon */}
                    <div className={`w-10 h-10 ${getCatIconBg(a.category)} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                      {getCatIcon(a.category)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-extrabold text-gray-900">{a.title}</p>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${badge.color}`}>
                        {badge.text}
                      </span>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-400">{a.dueText}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-400">{a.weight}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-2">
                    <div className="flex items-center gap-1">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getPriorityStyle(a.priority)}`}>
                        {a.priority}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                    <button className={`text-xs font-bold px-4 py-1.5 rounded-lg border transition-all ${getActionStyle(a.action)}`}>
                      {a.action}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Atlas Insight */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-extrabold text-gray-900">Atlas Insight</p>
          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
            You have 2 high priority assessments coming up that are worth 30% of your grade.
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-1" />
      </div>
    </div>
  );
}
