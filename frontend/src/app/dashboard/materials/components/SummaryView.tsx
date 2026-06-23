'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, Sparkles, Lightbulb, Link2, BookOpen, Loader2, RefreshCw, Clock } from 'lucide-react';
import { API_BASE, getToken } from '@/lib/api';
import { TopicItem } from './shared';

interface KeyConcept { term: string; definition: string; }
interface SummaryData {
  title: string;
  keyConcepts: KeyConcept[];
  remember: string;
  connections: string;
  studyTip: string;
  keyTakeaways: string[];
}

interface Props {
  className: string;
  classId: string;
  topic: TopicItem;
  onBack: () => void;
  onGenerateQuiz: () => void;
}

export default function SummaryView({ className, classId, topic, onBack, onGenerateQuiz }: Props) {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cached, setCached] = useState(false);
  const [updatedAt, setUpdatedAt] = useState('');

  const fetchSummary = async (regenerate = false) => {
    setLoading(true);
    setError('');
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/classes/study/summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          class_name: className,
          class_id: classId,
          topic_id: topic.id,
          topic_title: topic.title,
          topic_description: topic.description || '',
          regenerate,
        }),
      });
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
        setCached(data.cached || false);
        setUpdatedAt(data.updated_at || '');
      } else {
        setError(data.error || 'Failed to generate summary');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/classes/study/summary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            class_name: className, class_id: classId, topic_id: topic.id,
            topic_title: topic.title, topic_description: topic.description || '', regenerate: false,
          }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (data.summary) { setSummary(data.summary); setCached(data.cached || false); setUpdatedAt(data.updated_at || ''); }
        else { setError(data.error || 'Failed to generate summary'); }
      } catch { if (!cancelled) setError('Network error'); }
      finally { if (!cancelled) setLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="px-4 py-4 pb-24">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <h1 className="text-base font-extrabold text-gray-900">{topic.title} Summary</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">Generating Summary...</p>
            <p className="text-xs text-gray-400 mt-1">Atlas AI is creating a summary for</p>
            <p className="text-xs text-indigo-600 font-semibold">{topic.title} · {className}</p>
          </div>
          <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
        </div>
      </div>
    );
  }

  // Error
  if (error || !summary) {
    return (
      <div className="px-4 py-4 pb-24">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <h1 className="text-base font-extrabold text-gray-900">{topic.title} Summary</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-sm text-red-600 font-medium">{error || 'Failed to generate summary'}</p>
          <button onClick={() => fetchSummary(true)}
            className="flex items-center gap-2 text-sm font-bold text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  // Format time
  const timeLabel = (() => {
    if (cached && updatedAt) {
      try {
        const d = new Date(updatedAt);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin} min ago`;
        const diffHrs = Math.floor(diffMin / 60);
        if (diffHrs < 24) return `${diffHrs}h ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } catch { return ''; }
    }
    return 'Just now';
  })();

  return (
    <div className="px-4 py-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <div>
            <h1 className="text-base font-extrabold text-gray-900">{summary.title || topic.title} Summary</h1>
            <p className="text-xs text-gray-400">{className}</p>
          </div>
        </div>
      </div>

      {/* AI Badge + Cache indicator */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3 h-3 text-indigo-600" />
          <span className="text-[10px] font-bold text-indigo-600">AI Generated</span>
        </div>
        {cached && (
          <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3 text-green-600" />
            <span className="text-[10px] font-bold text-green-600">Saved</span>
          </div>
        )}
        <span className="text-[10px] text-gray-400">{timeLabel}</span>
      </div>

      {/* Key Concepts */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">Key Concepts</h2>
        <div className="space-y-3">
          {summary.keyConcepts.map((c, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5 flex-shrink-0">•</span>
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-bold text-gray-900">{c.term}:</span> {c.definition}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Remember */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <p className="text-xs font-bold text-amber-700">Remember</p>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{summary.remember}</p>
      </div>

      {/* Connections */}
      {summary.connections && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-bold text-blue-700">Connections</p>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{summary.connections}</p>
        </div>
      )}

      {/* Study Tip */}
      {summary.studyTip && (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-green-600" />
            <p className="text-xs font-bold text-green-700">Study Tip</p>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{summary.studyTip}</p>
        </div>
      )}

      {/* Key Takeaways */}
      {summary.keyTakeaways && summary.keyTakeaways.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🎯</span>
            <p className="text-xs font-bold text-indigo-700">Key Takeaways</p>
          </div>
          <div className="space-y-2">
            {summary.keyTakeaways.map((t, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-5 h-5 bg-indigo-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-extrabold text-indigo-700">{i + 1}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regenerate */}
      <button onClick={() => fetchSummary(true)}
        className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 py-2 mb-2 hover:text-indigo-600 transition-colors">
        <RefreshCw className="w-3.5 h-3.5" /> Regenerate Summary
      </button>

      {/* Generate Quiz */}
      <button onClick={onGenerateQuiz}
        className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all text-sm">
        Generate Quiz
      </button>
    </div>
  );
}
