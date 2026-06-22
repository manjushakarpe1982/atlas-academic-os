'use client';
import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, TrendingDown, FileText, Calendar, Star, User, ChevronRight, Target } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface OverviewData {
  classInfo: { name: string; instructor: string | null; term: string | null; credit_hours: number | null };
  currentGrade: number | null;
  totalGrades: number;
  insight: { strongest: { category: string; avg: number } | null; weakest: { category: string; avg: number } | null };
  syllabusFile: { id: string; name: string; date: string } | null;
  nextDeadline: { title: string; category: string; due_date: string; days_left: number | null } | null;
}

function formatDeadlineDate(dateStr: string): { month: string; day: string; full: string } {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: String(d.getDate()),
      full: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
    };
  } catch {
    return { month: '—', day: '—', full: dateStr };
  }
}

export default function OverviewTab({ classId }: { classId: string }) {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) return;
    api<OverviewData>(`/api/classes/${classId}/overview`)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading overview...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-10 text-sm text-red-600">Failed to load overview</div>;
  }

  const { classInfo, insight, syllabusFile, nextDeadline } = data;

  return (
    <div className="space-y-4">

      {/* Strongest Area + Needs Attention */}
      {(insight.strongest || insight.weakest) && (
        <div className="grid grid-cols-2 gap-3">
          {insight.strongest && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Strongest Area</p>
              <p className="text-base font-extrabold text-gray-900 mt-1">{insight.strongest.category}</p>
              <p className="text-xl font-extrabold text-green-600">{insight.strongest.avg}%</p>
              <p className="text-[10px] font-bold text-green-500 mt-1">Great work!</p>
            </div>
          )}
          {insight.weakest && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                <TrendingDown className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Needs Attention</p>
              <p className="text-base font-extrabold text-gray-900 mt-1">{insight.weakest.category}</p>
              <p className="text-xl font-extrabold text-red-500">{insight.weakest.avg}%</p>
              <p className="text-[10px] font-bold text-red-400 mt-1">Focus more here</p>
            </div>
          )}
        </div>
      )}

      {/* About This Course */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h2 className="text-sm font-extrabold text-gray-900 mb-4">About This Course</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium">Instructor</p>
              <p className="text-xs font-bold text-gray-800">{classInfo.instructor || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium">Credits</p>
              <p className="text-xs font-bold text-gray-800">{classInfo.credit_hours ? `${classInfo.credit_hours} Credits` : '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium">Term</p>
              <p className="text-xs font-bold text-gray-800">{classInfo.term || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium">Syllabus</p>
              <p className="text-xs font-bold text-gray-800 truncate max-w-[110px]">{syllabusFile ? syllabusFile.name : 'Not uploaded'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Deadline */}
      {nextDeadline && (() => {
        const dt = formatDeadlineDate(nextDeadline.due_date);
        return (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-extrabold text-gray-900">Next Deadline</h2>
              <Link href="/dashboard/assignments" className="text-xs text-indigo-600 font-semibold flex items-center gap-0.5">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex flex-col items-center justify-center flex-shrink-0">
                <p className="text-[10px] font-bold text-indigo-600 leading-none">{dt.month}</p>
                <p className="text-lg font-extrabold text-indigo-700 leading-none mt-0.5">{dt.day}</p>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900 truncate">{nextDeadline.title}</p>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full flex-shrink-0 capitalize">
                    {nextDeadline.category}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {nextDeadline.days_left !== null
                    ? nextDeadline.days_left === 0 ? 'Due today'
                      : nextDeadline.days_left === 1 ? 'Due tomorrow'
                      : `Due in ${nextDeadline.days_left} days`
                    : ''
                  }
                  {nextDeadline.due_date ? ` · ${dt.full}` : ''}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 transition-colors">
                Add to Calendar
              </button>
            </div>
          </div>
        );
      })()}

      {/* Atlas Recommendation */}
      {nextDeadline && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">✨</span>
            <h2 className="text-sm font-extrabold text-gray-900">Atlas Recommendation</h2>
          </div>
          <div className="bg-white rounded-xl p-4 flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-extrabold text-indigo-700">
                Focus on {nextDeadline.category === 'exam' || nextDeadline.category === 'quiz'
                  ? nextDeadline.title.split(' - ').pop() || nextDeadline.title
                  : nextDeadline.title}
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {nextDeadline.title} is due in {nextDeadline.days_left ?? '?'} days
                {data.insight.weakest ? ` and ${data.insight.weakest.category} needs improvement.` : '.'}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!insight.strongest && !insight.weakest && !nextDeadline && !syllabusFile && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-center">
          <p className="text-sm font-bold text-indigo-800">Get started!</p>
          <p className="text-xs text-indigo-600 mt-1">Upload a syllabus and enter grades to see your class overview</p>
        </div>
      )}
    </div>
  );
}
