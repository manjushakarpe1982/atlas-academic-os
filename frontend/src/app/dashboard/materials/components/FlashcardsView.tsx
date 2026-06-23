'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, RotateCcw, ThumbsUp, Loader2, Sparkles, RefreshCw, Clock } from 'lucide-react';
import { API_BASE, getToken } from '@/lib/api';
import { TopicItem } from './shared';

interface Card { id: number; question: string; answer: string; difficulty?: string; }
interface FlashcardsData { title: string; totalCards: number; cards: Card[]; }

interface Props {
  className: string; classId: string; topic: TopicItem;
  onBack: () => void; onDone: () => void;
}

export default function FlashcardsView({ className, classId, topic, onBack, onDone }: Props) {
  const [data, setData] = useState<FlashcardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cached, setCached] = useState(false);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [review, setReview] = useState<Set<number>>(new Set());

  const fetchFlashcards = async (regenerate = false) => {
    setLoading(true); setError('');
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/classes/study/flashcards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          class_name: className, class_id: classId, topic_id: topic.id,
          topic_title: topic.title, topic_description: topic.description || '', regenerate,
        }),
      });
      const d = await res.json();
      if (d.flashcards) { setData(d.flashcards); setCached(d.cached || false); setIndex(0); setFlipped(false); setKnown(new Set()); setReview(new Set()); }
      else { setError(d.error || 'Failed to generate flashcards'); }
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true); setError('');
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/classes/study/flashcards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            class_name: className, class_id: classId, topic_id: topic.id,
            topic_title: topic.title, topic_description: topic.description || '', regenerate: false,
          }),
        });
        const d = await res.json();
        if (cancelled) return;
        if (d.flashcards) { setData(d.flashcards); setCached(d.cached || false); }
        else { setError(d.error || 'Failed to generate flashcards'); }
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
          <h1 className="text-base font-extrabold text-gray-900">Flashcards</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">Generating Flashcards...</p>
            <p className="text-xs text-gray-400 mt-1">Atlas AI is creating flashcards for</p>
            <p className="text-xs text-indigo-600 font-semibold">{topic.title} · {className}</p>
          </div>
          <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
        </div>
      </div>
    );
  }

  // Error
  if (error || !data) {
    return (
      <div className="px-4 py-4 pb-24">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <h1 className="text-base font-extrabold text-gray-900">Flashcards</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-sm text-red-600 font-medium">{error || 'Failed'}</p>
          <button onClick={() => fetchFlashcards(true)}
            className="flex items-center gap-2 text-sm font-bold text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const cards = data.cards;
  const card = cards[index];
  const total = cards.length;
  const progress = Math.round(((known.size + review.size) / total) * 100);

  const handleKnow = () => { setKnown(new Set(known).add(card.id)); next(); };
  const handleReview = () => { setReview(new Set(review).add(card.id)); next(); };
  const next = () => { if (index < total - 1) { setIndex(index + 1); setFlipped(false); } else { onDone(); } };
  const prev = () => { if (index > 0) { setIndex(index - 1); setFlipped(false); } };

  const diffColor = card.difficulty === 'hard' ? 'text-red-600 bg-red-50' : card.difficulty === 'medium' ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50';

  return (
    <div className="px-4 py-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <div>
            <h1 className="text-base font-extrabold text-gray-900">Flashcards</h1>
            <p className="text-xs text-gray-400">{topic.title} · {className}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {cached && (
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
              <Clock className="w-3 h-3 text-green-600" />
              <span className="text-[10px] font-bold text-green-600">Saved</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-4">
        <p className="text-xs text-gray-400">Card {index + 1} of {total}</p>
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 bg-green-50 rounded-xl py-2 text-center">
          <p className="text-lg font-extrabold text-green-600">{known.size}</p>
          <p className="text-[9px] text-green-500 font-medium">Know</p>
        </div>
        <div className="flex-1 bg-red-50 rounded-xl py-2 text-center">
          <p className="text-lg font-extrabold text-red-500">{review.size}</p>
          <p className="text-[9px] text-red-400 font-medium">Review</p>
        </div>
        <div className="flex-1 bg-gray-50 rounded-xl py-2 text-center">
          <p className="text-lg font-extrabold text-gray-600">{total - known.size - review.size}</p>
          <p className="text-[9px] text-gray-400 font-medium">Remaining</p>
        </div>
      </div>

      {/* Card */}
      <button onClick={() => setFlipped(!flipped)}
        className="w-full bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-8 min-h-[220px] flex flex-col items-center justify-center text-center mb-4 hover:border-indigo-200 transition-all relative">
        {card.difficulty && (
          <span className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full ${diffColor}`}>
            {card.difficulty}
          </span>
        )}
        {!flipped ? (
          <>
            <p className="text-xl font-extrabold text-gray-900 mb-3">{card.question}</p>
            <p className="text-xs text-gray-400">Tap to reveal the answer</p>
          </>
        ) : (
          <p className="text-sm text-gray-700 leading-relaxed">{card.answer}</p>
        )}
      </button>

      {/* Know / Review buttons */}
      {flipped && (
        <div className="flex items-center justify-center gap-6 mb-6">
          <button onClick={handleReview} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-[10px] font-bold text-red-500">Need Review</span>
          </button>
          <button onClick={handleKnow} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-[10px] font-bold text-green-500">I Know This</span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mb-3">
        <button onClick={prev} disabled={index === 0}
          className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all text-sm disabled:opacity-30">
          Previous
        </button>
        <button onClick={next}
          className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all text-sm">
          {index === total - 1 ? 'Finish' : 'Next'}
        </button>
      </div>

      {/* Regenerate */}
      <button onClick={() => fetchFlashcards(true)}
        className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-gray-400 py-2 hover:text-indigo-600 transition-colors">
        <RefreshCw className="w-3 h-3" /> Regenerate Flashcards
      </button>
    </div>
  );
}
