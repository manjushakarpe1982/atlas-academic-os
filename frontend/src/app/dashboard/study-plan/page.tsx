'use client';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { StudyPlanData } from './components/shared';
import StudyPlanMain from './components/StudyPlanMain';
import StudySession from './components/StudySession';

type View = 'main' | 'session';

export default function StudyPlanPage() {
  const [view, setView] = useState<View>('main');
  const [data, setData] = useState<StudyPlanData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api<StudyPlanData>('/api/dashboard/study-plan')
      .then(d => { if (!cancelled) setData(d); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-4 pb-24">
        {/* Skeleton */}
        <div className="mb-5 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-56 bg-gray-100 rounded" />
        </div>
        <div className="bg-gray-100 rounded-lg h-52 mb-5 animate-pulse" />
        <div className="h-4 w-40 bg-gray-200 rounded mb-3" />
        {[1,2,3].map(i => (
          <div key={i} className="bg-white rounded-lg border border-gray-100 p-4 mb-3 flex gap-3 animate-pulse">
            <div className="w-10 h-10 bg-gray-100 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-gray-100 rounded" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-sm text-red-600 font-medium">Failed to load study plan</p>
        <button onClick={() => window.location.reload()} className="mt-3 text-sm text-indigo-600 font-bold">Retry</button>
      </div>
    );
  }

  if (view === 'session' && data.focusItem) {
    return <StudySession focus={data.focusItem} onBack={() => setView('main')} onContinue={() => setView('main')} />;
  }

  return (
    <StudyPlanMain
      data={data}
      onStartStudying={() => setView('session')}
      onSessionClick={() => setView('session')}
    />
  );
}
