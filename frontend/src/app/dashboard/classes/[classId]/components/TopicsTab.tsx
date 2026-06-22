'use client';
import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Topic {
  id: string;
  title: string;
  description: string | null;
  status: string;
  confidence: string;
}

export default function TopicsTab({ classId }: { classId: string }) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!classId) return;
    api<{ topics: Topic[] }>(`/api/classes/${classId}/topics`)
      .then(d => setTopics(d.topics || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading topics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  const done = topics.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-4">
      {topics.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500 font-medium">No topics found</p>
          <p className="text-xs text-gray-400 mt-1">Topics are added when you upload a syllabus</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-extrabold text-gray-900">Course Topics</h2>
              <span className="text-xs text-gray-400 font-semibold">{topics.length} topics</span>
            </div>
            {topics.map((t, i) => {
              const isDone = t.status === 'completed';
              const inProgress = t.status === 'in_progress';
              return (
                <div key={t.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-extrabold ${
                    isDone ? 'bg-green-100 text-green-600' : inProgress ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
                  }`}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${isDone ? 'text-gray-800' : inProgress ? 'text-indigo-700' : 'text-gray-400'}`}>{t.title}</p>
                    {t.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{t.description}</p>}
                  </div>
                  {isDone
                    ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    : <Circle className={`w-4 h-4 flex-shrink-0 ${inProgress ? 'text-indigo-400' : 'text-gray-300'}`} />
                  }
                </div>
              );
            })}
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="text-sm font-extrabold text-indigo-800">
                {done === topics.length ? 'All topics completed!' : done > 0 ? "You're on track!" : 'Get started!'}
              </p>
              <p className="text-xs text-indigo-600">
                {done > 0 ? `You've completed ${done} of ${topics.length} topics` : `${topics.length} topics to cover`}
              </p>
              <div className="w-32 h-1.5 bg-indigo-200 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${topics.length > 0 ? (done / topics.length * 100) : 0}%` }} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
