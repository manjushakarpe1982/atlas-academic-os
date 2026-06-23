'use client';
import { useState, useEffect } from 'react';
import { ChevronRight, Calendar, AlertCircle, CheckCircle2, Clock, SlidersHorizontal, Brain, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Assignment {
  id: string; title: string; category: string; due_date: string; days_left: number | null;
  weight: number; priority: string; action: string; due_text: string; completed: boolean;
}
interface Stats { upcoming: number; overdue: number; completed: number; due_this_week: number; }
interface AssignmentsData { assignments: Assignment[]; stats: Stats; insight: string | null; }

const STAT_CONFIG = [
  { key: 'upcoming',      label: 'Upcoming',      icon: Calendar,      color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { key: 'overdue',       label: 'Overdue',        icon: AlertCircle,   color: 'text-red-600',    bg: 'bg-red-100' },
  { key: 'completed',     label: 'Completed',      icon: CheckCircle2,  color: 'text-green-600',  bg: 'bg-green-100' },
  { key: 'due_this_week', label: 'Due This Week',  icon: Clock,         color: 'text-orange-600', bg: 'bg-orange-100' },
];

const FILTERS = ['All', 'Assignment', 'Quiz', 'Exam', 'Lab'];

function getCatIcon(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes('quiz')) return '❓';
  if (c.includes('exam') || c.includes('midterm') || c.includes('final')) return '📋';
  if (c.includes('lab')) return '🧪';
  return '📝';
}
function getCatIconBg(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes('quiz')) return 'bg-orange-100';
  if (c.includes('exam') || c.includes('midterm') || c.includes('final')) return 'bg-yellow-100';
  if (c.includes('lab')) return 'bg-blue-100';
  return 'bg-green-100';
}
function getCatBadge(cat: string): { text: string; color: string } {
  const c = cat.toLowerCase();
  if (c.includes('quiz')) return { text: 'Quiz', color: 'text-orange-600 bg-orange-50' };
  if (c.includes('exam') || c.includes('midterm') || c.includes('final')) return { text: 'Exam', color: 'text-yellow-700 bg-yellow-50' };
  if (c.includes('lab')) return { text: 'Lab', color: 'text-blue-600 bg-blue-50' };
  return { text: 'Assignment', color: 'text-green-600 bg-green-50' };
}
function getBarColor(p: string): string {
  if (p === 'HIGH') return 'bg-red-400';
  if (p === 'MEDIUM') return 'bg-orange-400';
  if (p === 'LOW') return 'bg-blue-400';
  if (p === 'OVERDUE') return 'bg-red-500';
  return 'bg-green-400';
}
function getPriorityStyle(p: string): string {
  if (p === 'HIGH') return 'text-red-600 bg-red-50 border-red-200';
  if (p === 'MEDIUM') return 'text-amber-600 bg-amber-50 border-amber-200';
  if (p === 'LOW') return 'text-green-600 bg-green-50 border-green-200';
  if (p === 'OVERDUE') return 'text-red-700 bg-red-100 border-red-300';
  return 'text-green-600 bg-green-50 border-green-200';
}
function getActionStyle(a: string): string {
  if (a === 'Prepare') return 'text-orange-600 border-orange-200 hover:bg-orange-50';
  if (a === 'Study') return 'text-yellow-700 border-yellow-200 hover:bg-yellow-50';
  if (a === 'Done') return 'text-green-600 border-green-200 bg-green-50';
  return 'text-indigo-600 border-indigo-200 hover:bg-indigo-50';
}

export default function AssignmentsTab({ classId }: { classId: string }) {
  const [data, setData] = useState<AssignmentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (!classId) return;
    api<AssignmentsData>(`/api/classes/${classId}/assignments`)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading assignments...</span>
      </div>
    );
  }

  if (!data || data.assignments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500 font-medium">No assignments found</p>
        <p className="text-xs text-gray-400 mt-1">Assignments appear when you upload a syllabus</p>
      </div>
    );
  }

  const { assignments, stats, insight } = data;
  const filtered = filter === 'All' ? assignments : assignments.filter(a => {
    const c = a.category.toLowerCase();
    const f = filter.toLowerCase();
    if (f === 'exam') return c.includes('exam') || c.includes('midterm') || c.includes('final');
    return c.includes(f);
  });

  return (
    <div className="space-y-4">

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        {STAT_CONFIG.map(s => (
          <div key={s.key} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col items-center text-center">
            <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center mb-1`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-lg font-extrabold text-gray-900">{stats[s.key as keyof Stats]}</p>
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
      {filtered.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">No {filter.toLowerCase()} assignments found</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => {
            const badge = getCatBadge(a.category);
            return (
              <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex">
                <div className={`w-1.5 ${getBarColor(a.priority)} flex-shrink-0`} />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 ${getCatIconBg(a.category)} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                        {getCatIcon(a.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-extrabold text-gray-900">{a.title}</p>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${badge.color}`}>
                          {badge.text}
                        </span>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-400">{a.due_text}</p>
                        </div>
                        {a.weight > 0 && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-400">Worth {a.weight}%</p>
                          </div>
                        )}
                      </div>
                    </div>
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
      )}

      {/* Atlas Insight */}
      {insight && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-extrabold text-gray-900">Atlas Insight</p>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{insight}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-1" />
        </div>
      )}
    </div>
  );
}
