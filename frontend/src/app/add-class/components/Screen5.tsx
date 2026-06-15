'use client';
// Screen 5 — Review What We Found
import { useEffect, useState } from 'react';
import { Edit2, ChevronDown, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { Phone, ConfBadge } from './shared';
import { api } from '@/lib/api';

interface Props { onNext: () => void; onBack: () => void; classId: string | null; }

interface Draft {
  course_name:   string | null;
  course_code:   string | null;
  instructor:    string | null;
  credit_hours:  number | null;
  grade_weights: Array<{ category: string; weight_pct: number | null; confidence: string }>;
  assessments:   Array<{ title: string; due_date: string | null; confidence: string; category?: string }>;
  topics:        Array<{ title: string; week_hint: number | null; confidence: string }>;
}

const WEIGHT_ICONS: Record<string, string> = {
  Homework: '📝', Quizzes: '❓', 'Exam I': '📄', 'Exam II': '📄',
  'Exam III': '📄', 'Final Exam': '🎓', Labs: '🧪', Participation: '🤝',
};

const MONTH_ABBR = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function formatDateBadge(iso: string | null) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    return { month: MONTH_ABBR[d.getMonth()], day: d.getDate() };
  } catch { return null; }
}

export default function Screen5({ onNext, onBack, classId }: Props) {
  const [draft,   setDraft]   = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!classId) return;
    api<Draft>(`/api/classes/${classId}/draft`)
      .then(d => setDraft(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) return (
    <Phone step={4} total={10}>
      <div className="flex items-center justify-center min-h-[480px]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    </Phone>
  );

  if (error) return (
    <Phone step={4} total={10}>
      <div className="px-5 py-8 text-center">
        <p className="text-red-500 text-sm mb-3">❌ {error}</p>
        <button onClick={onBack} className="text-indigo-600 text-sm font-semibold">Go back</button>
      </div>
    </Phone>
  );

  return (
    <Phone step={4} total={10}>
      <div className="flex flex-col bg-white min-h-[560px]">

        {/* ── Header ── */}
        <div className="px-5 pt-4 pb-3">
          <h1 className="text-xl font-extrabold text-gray-900 mb-0.5">Review what we found</h1>
          <p className="text-xs text-gray-400">Check everything and edit if anything looks wrong.</p>
        </div>

        {/* ── Extraction accuracy ── */}
        <div className="mx-5 mb-3 flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-bold text-green-700">92% extracted correctly</span>
          </div>
          <button className="text-xs font-semibold text-indigo-600">Learn more</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4" style={{ maxHeight: 420 }}>

          {/* ── Course Information ── */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
              <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Course Information</p>
              <button className="flex items-center gap-1 text-xs text-indigo-600 font-semibold">
                <Edit2 className="w-3 h-3" /> Edit
              </button>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 text-sm font-extrabold">M</span>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-gray-900">
                    {draft?.course_code && draft?.course_name
                      ? `${draft.course_code} – ${draft.course_name}`
                      : draft?.course_name || draft?.course_code || 'Course Name'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    {draft?.instructor && <span>👤 {draft.instructor}</span>}
                    {draft?.credit_hours && (
                      <><span>•</span><span>📚 {draft.credit_hours} Credit Hours</span></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Grading Breakdown ── */}
          {(draft?.grade_weights?.length ?? 0) > 0 && (
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-indigo-50 border-b border-indigo-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">📊</span>
                  <p className="text-[10px] font-extrabold text-gray-700 uppercase tracking-widest">Grading Breakdown</p>
                </div>
                <button className="flex items-center gap-1 text-xs text-indigo-600 font-semibold">
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              </div>
              <div className="px-4 py-2">
                {draft!.grade_weights.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm w-5 text-center">{WEIGHT_ICONS[w.category] || '📋'}</span>
                    <span className="flex-1 text-xs font-semibold text-gray-800">{w.category}</span>
                    {/* Mini progress bar */}
                    <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(w.weight_pct || 0) * 5}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-600 w-8 text-right">{w.weight_pct}%</span>
                    <ConfBadge level={w.confidence} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Important Dates ── */}
          {(draft?.assessments?.length ?? 0) > 0 && (
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-orange-50 border-b border-orange-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">📅</span>
                  <p className="text-[10px] font-extrabold text-gray-700 uppercase tracking-widest">Important Dates</p>
                </div>
                <button className="flex items-center gap-1 text-xs text-indigo-600 font-semibold">
                  <Edit2 className="w-3 h-3" /> Edit All
                </button>
              </div>
              <div className="px-4 py-2">
                {draft!.assessments.slice(0, 5).map((a, i) => {
                  const badge = formatDateBadge(a.due_date);
                  return (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      {/* Date badge */}
                      {badge ? (
                        <div className="flex-shrink-0 w-9 text-center">
                          <p className="text-[8px] font-extrabold text-red-500 uppercase leading-none">{badge.month}</p>
                          <p className="text-sm font-extrabold text-gray-900 leading-tight">{badge.day}</p>
                        </div>
                      ) : (
                        <div className="w-9 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-[8px] text-gray-400">TBD</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{a.title}</p>
                        <p className="text-[10px] text-gray-400">Date {a.due_date || 'TBD'}</p>
                      </div>
                      <ConfBadge level={a.confidence} />
                      <Edit2 className="w-3 h-3 text-gray-300 flex-shrink-0" />
                    </div>
                  );
                })}
                {(draft?.assessments?.length ?? 0) > 5 && (
                  <button className="flex items-center gap-1 text-xs text-indigo-600 font-semibold mt-2">
                    View all dates <ChevronDown className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Weekly Topics ── */}
          {(draft?.topics?.length ?? 0) > 0 && (
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-blue-50 border-b border-blue-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">📚</span>
                  <p className="text-[10px] font-extrabold text-gray-700 uppercase tracking-widest">Weekly Topics</p>
                </div>
                <button className="flex items-center gap-1 text-xs text-indigo-600 font-semibold">
                  <Edit2 className="w-3 h-3" /> Edit All
                </button>
              </div>
              <div className="px-4 py-2">
                {draft!.topics.slice(0, 3).map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <p className="text-xs font-semibold text-gray-800 flex-1 min-w-0 truncate">
                      {t.week_hint && <span className="text-gray-400 mr-1">Week {t.week_hint}:</span>}
                      {t.title}
                    </p>
                    <div className="flex items-center gap-1.5 ml-2">
                      <ConfBadge level={t.confidence} />
                      <ChevronDown className="w-3 h-3 text-gray-300" />
                    </div>
                  </div>
                ))}
                {(draft?.topics?.length ?? 0) > 3 && (
                  <button className="flex items-center gap-1 text-xs text-indigo-600 font-semibold mt-2">
                    View all {draft?.topics?.length} topics <ChevronDown className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Warning note ── */}
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-2xl px-3 py-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Atlas may miss small details. Quickly review dates and percentages before continuing.
            </p>
          </div>

        </div>
      </div>
    </Phone>
  );
}
