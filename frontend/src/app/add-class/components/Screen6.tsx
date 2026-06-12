'use client';
// Step 5 — Important Dates + Topics (from parsed draft)
import { useEffect, useState } from 'react';
import { Edit2, Loader2 } from 'lucide-react';
import { Phone, ConfBadge } from './shared';
import { api } from '@/lib/api';

interface Props {
  onNext:  () => void;
  onBack:  () => void;
  classId: string | null;
}

export default function Screen6({ onNext, onBack, classId }: Props) {
  const [draft,   setDraft]   = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) return;
    api(`/api/classes/${classId}/draft`)
      .then(d => setDraft(d))
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) return (
    <Phone step={5} total={10}>
      <div className="flex items-center justify-center min-h-[480px]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    </Phone>
  );

  const dates  = draft?.assessments || [];
  const topics = draft?.topics       || [];

  return (
    <Phone step={5} total={10}>
      <div className="flex flex-col ">
        <div className="px-5 py-4 flex-1 overflow-y-auto" >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-extrabold text-gray-900">Important Dates</h1>
            <button className="text-xs text-indigo-600 font-semibold">Edit All</button>
          </div>

          {dates.length === 0 ? (
            <p className="text-sm text-gray-400 mb-4">No dates found in syllabus.</p>
          ) : (
            <div className="space-y-2 mb-5">
              {dates.slice(0, 8).map((d: any, i: number) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-extrabold text-indigo-600">
                        {d.due_date ? d.due_date.split('-')[2] : '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{d.title}</p>
                      <p className="text-[10px] text-gray-400">{d.due_date || 'Date TBD'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ConfBadge level={d.confidence} />
                    <Edit2 className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Weekly topics */}
          {topics.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">Weekly Topics</p>
                <button className="text-xs text-indigo-600 font-semibold">Edit All</button>
              </div>
              {topics.slice(0, 5).map((t: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <div>
                    {t.week_hint && <p className="text-[10px] text-gray-400">Week {t.week_hint}</p>}
                    <p className="text-xs font-semibold text-gray-800">{t.title}</p>
                  </div>
                  <ConfBadge level={t.confidence} />
                </div>
              ))}
              {topics.length > 5 && (
                <button className="text-xs text-indigo-600 font-semibold mt-2">
                  + {topics.length - 5} more weeks
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Phone>
  );
}
