'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { API_BASE, getToken } from '@/lib/api';
import { TopicItem } from './shared';

interface ProgressItem { completed: boolean; updated_at: string | null; }
interface Progress { summary: ProgressItem; flashcards: ProgressItem; quiz: ProgressItem; targeted: ProgressItem; }

const MATERIALS = [
  { id: 'summary',    icon: '📝', title: 'Summary',          sub: 'Key concepts in easy words' },
  { id: 'flashcards', icon: '🗂️', title: 'Flashcards',       sub: 'Review important terms' },
  { id: 'quiz',       icon: '❓', title: 'Practice Quiz',     sub: 'Test your understanding' },
  { id: 'targeted',   icon: '🎯', title: 'Targeted Practice', sub: 'Focus on weak areas' },
];

interface Props { topic: TopicItem; onBack: () => void; onSelect: (id: string) => void; className?: string; }

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'Just now';
    if (min < 60) return `${min}m ago`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  } catch { return ''; }
}

export default function ChooseMaterial({ topic, onBack, onSelect ,className }: Props) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/classes/study/progress/${topic.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = await res.json();
        if (!cancelled && d.progress) setProgress(d.progress);
      } catch {}
      finally { if (!cancelled) setLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, [topic.id]);

  const completedCount = progress ? Object.values(progress).filter(p => p.completed).length : 0;
  const totalPct = Math.round((completedCount / 4) * 100);

  // Skeleton loading UI
  if (loading) {
    return (
      <div className="px-4 py-4 pb-24">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <div>
            <h1 className="text-base font-extrabold text-gray-900">{topic.title}</h1>
            <p className="text-xs text-gray-400">Loading progress...</p>
          </div>
        </div>

        {/* About Topic skeleton */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-5">
          <p className="text-xs font-bold text-indigo-700 mb-1">About this topic</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {topic.description || `Study materials for ${topic.title}.`} 🧬
          </p>
        </div>

        {/* Progress skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="h-3 w-24 bg-gray-200 rounded-full" />
            <div className="h-3 w-20 bg-gray-200 rounded-full" />
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full" />
        </div>

        {/* Material cards skeleton */}
        <div className="h-3 w-44 bg-gray-200 rounded-full mb-3" />
        <div className="space-y-3">
          {MATERIALS.map(m => (
            <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 animate-pulse">
              <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{m.icon}</div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-extrabold text-gray-900">{m.title}</p>
                  <div className="w-4 h-4 bg-gray-200 rounded-full" />
                </div>
                <div className="h-2.5 w-36 bg-gray-100 rounded-full" />
                <div className="h-2 w-20 bg-gray-100 rounded-full" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-200 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-12">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-700" /></button>
        <div>
          <h1 className="text-base font-extrabold text-gray-900">{topic.title}</h1>
          <p className="text-sm text-gray-500">{className}</p>
        </div>
      </div>

      {/* About Topic */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-5">
        <p className="text-sm font-bold text-indigo-700 mb-1">About this topic</p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {topic.description || `Study materials for ${topic.title}.`} 🧬
        </p>
      </div>

      {/* Progress Overview */}
      {progress && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-500 ">Your Progress</p>
            <p className="text-sm font-bold text-indigo-600">{completedCount}/4 completed</p>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${totalPct}%` }} />
          </div>
        </div>
      )}

      {/* Material Options */}
      <p className="text-sm font-bold text-gray-600  mb-3">Choose what you want to study</p>
      <div className="space-y-3">
        {MATERIALS.map(m => {
          const p = progress ? progress[m.id as keyof Progress] : null;
          const done = p?.completed || false;
          const updatedAt = p?.updated_at || null;

          return (
            <button key={m.id} onClick={() => onSelect(m.id)}
              className={`w-full rounded-lg border shadow-sm p-4 flex items-center gap-4 transition-all text-left ${
                done ? 'bg-green-50 border-green-200 hover:border-green-300' : 'bg-white border-gray-200 hover:border-indigo-200'
              }`}>
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${
                done ? 'bg-green-100' : 'bg-gray-100'
              }`}>{m.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-extrabold text-gray-900">{m.title}</p>
                  {done && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </div>
                <p className="text-xs text-gray-400">{m.sub}</p>
                {done && updatedAt && (
                  <p className="text-[10px] text-green-600 font-semibold mt-0.5">Completed · {timeAgo(updatedAt)}</p>
                )}
                {!done && (
                  <p className="text-[10px] text-gray-400 mt-0.5">Not started</p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
