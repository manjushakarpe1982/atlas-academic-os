'use client';
// Step 4 — Review parsed results (loads from /draft)
import { useEffect, useState } from 'react';
import { Edit2, Loader2 } from 'lucide-react';
import { Phone, ConfBadge } from './shared';
import { api } from '@/lib/api';

interface Props {
  onNext:  () => void;
  onBack:  () => void;
  classId: string | null;
}

interface Draft {
  course_name:   string | null;
  course_code:   string | null;
  instructor:    string | null;
  credit_hours:  number | null;
  grade_weights: Array<{ category: string; weight_pct: number | null; confidence: string }>;
  assessments:   Array<{ title: string; due_date: string | null; confidence: string }>;
  topics:        Array<{ title: string; week_hint: number | null; confidence: string }>;
}

export default function Screen5({ onNext, onBack, classId }: Props) {
  const [draft,    setDraft]    = useState<Draft | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

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
      <div className="px-6 py-8 text-center">
        <p className="text-red-500 text-sm">❌ {error}</p>
        <button onClick={onBack} className="mt-4 text-indigo-600 text-sm font-semibold">Go back</button>
      </div>
    </Phone>
  );

  return (
    <Phone step={4} total={10}>
      <div className="flex flex-col min-h-[480px]">
        <div className="px-5 py-4 flex-1 overflow-y-auto" style={{ maxHeight: 440 }}>
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-extrabold text-gray-900">Review what we found</h1>
            <span className="text-[10px] font-extrabold bg-indigo-600 text-white px-2 py-1 rounded-full">
              IMPORTANT
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-4">Check everything and edit if anything looks wrong.</p>

          {/* Course Info */}
          <div className="bg-gray-50 rounded-2xl p-3 mb-3 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">Course Information</p>
              <Edit2 className="w-3.5 h-3.5 text-gray-400" />
            </div>
            {[
              { label: 'Course',      value: [draft?.course_code, draft?.course_name].filter(Boolean).join(' – ') || '—' },
              { label: 'Instructor',  value: draft?.instructor  || '—' },
              { label: 'Credits',     value: draft?.credit_hours != null ? `${draft.credit_hours} hrs` : '—' },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between py-1.5 border-t border-gray-200 first:border-0">
                <div>
                  <p className="text-[10px] text-gray-400">{f.label}</p>
                  <p className="text-xs font-semibold text-gray-800">{f.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Grade Weights */}
          {(draft?.grade_weights?.length ?? 0) > 0 && (
            <div className="bg-gray-50 rounded-2xl p-3 mb-3 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">Grading Breakdown</p>
                <Edit2 className="w-3.5 h-3.5 text-gray-400" />
              </div>
              {draft!.grade_weights.map(w => (
                <div key={w.category} className="flex items-center justify-between py-1.5 border-t border-gray-200 first:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-indigo-400" />
                    <span className="text-xs font-semibold text-gray-800">{w.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-700">{w.weight_pct ?? '?'}%</span>
                    <ConfBadge level={w.confidence} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Phone>
  );
}
