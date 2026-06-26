"use client";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  RotateCcw,
  ThumbsUp,
  Loader2,
  Sparkles,
  RefreshCw,
  Clock,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { API_BASE, getToken } from "@/lib/api";
import { TopicItem } from "./shared";
import AttemptHistory from "./AttemptHistory";
import { LiaHandPointer } from "react-icons/lia";
interface Card {
  id: number;
  question: string;
  answer: string;
  difficulty?: string;
}
interface FlashcardsData {
  title: string;
  totalCards: number;
  cards: Card[];
}

interface Props {
  className: string;
  classId: string;
  topic: TopicItem;
  onBack: () => void;
  onDone: () => void;
}

export default function FlashcardsView({
  className,
  classId,
  topic,
  onBack,
  onDone,
}: Props) {
  const [data, setData] = useState<FlashcardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cached, setCached] = useState(false);
  const [checkingAttempts, setCheckingAttempts] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [retakeOfAttempt, setRetakeOfAttempt] = useState<number | null>(null);

  // Check for existing attempts on mount
  useEffect(() => {
    const check = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/classes/study/attempts/${topic.id}/flashcards`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = await res.json();
        if (d.attempts && d.attempts.length > 0) { setShowHistory(true); }
      } catch {}
      finally { setCheckingAttempts(false); }
    };
    check();
  }, [topic.id]);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [review, setReview] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [attemptSaved, setAttemptSaved] = useState(false);

  // Save attempt when finished
  useEffect(() => {
    if (!finished || attemptSaved || !data) return;
    setAttemptSaved(true);
    const save = async () => {
      try {
        const token = getToken();
        await fetch(`${API_BASE}/api/classes/study/save-attempt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            topic_id: topic.id, class_id: classId, material_type: 'flashcards',
            content_json: data.cards, score: known.size, total: data.cards.length, is_retake: !!retakeOfAttempt, parent_attempt: retakeOfAttempt,
          }),
        });
        const res = await fetch(`${API_BASE}/api/classes/study/attempts/${topic.id}/flashcards`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = await res.json();
        setAttempts(d.attempts || []);
      } catch {}
    };
    save();
  }, [finished]);

  const fetchFlashcards = async (regenerate = false) => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/classes/study/flashcards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          class_name: className,
          class_id: classId,
          topic_id: topic.id,
          topic_title: topic.title,
          topic_description: topic.description || "",
          regenerate,
        }),
      });
      const d = await res.json();
      if (d.flashcards) {
        setData(d.flashcards);
        setCached(d.cached || false);
        setIndex(0);
        setFlipped(false);
        setKnown(new Set());
        setReview(new Set());
        setFinished(false);
        setAttemptSaved(false);
      } else {
        setError(d.error || "Failed to generate flashcards");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/classes/study/flashcards`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            class_name: className,
            class_id: classId,
            topic_id: topic.id,
            topic_title: topic.title,
            topic_description: topic.description || "",
            regenerate: false,
          }),
        });
        const d = await res.json();
        if (cancelled) return;
        if (d.flashcards) {
          setData(d.flashcards);
          setCached(d.cached || false);
        } else {
          setError(d.error || "Failed to generate flashcards");
        }
      } catch {
        if (!cancelled) setError("Network error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Loading
  if (checkingAttempts) {
    return (
      <div className="px-4 py-4 pb-24">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <h1 className="text-base font-extrabold text-gray-900">Flashcards</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (showHistory) {
    return (
      <AttemptHistory
        topicId={topic.id} topicTitle={topic.title} classId={classId} className={className}
        materialType="flashcards" onBack={onBack}
        onRegenerate={() => { setShowHistory(false); setRetakeOfAttempt(null); fetchFlashcards(true); }}
        onRetake={(content: any, attemptNumber: number) => {
          const cards = content?.cards || content || [];
          setData({ title: topic.title, totalCards: cards.length, cards });
          setIndex(0); setFlipped(false); setKnown(new Set()); setReview(new Set()); setFinished(false); setAttemptSaved(false);
          setRetakeOfAttempt(attemptNumber);
          setLoading(false);
          setShowHistory(false);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="px-4 py-4 pb-24">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onBack}>
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-base font-extrabold text-gray-900">Flashcards</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="text-center mt-4 space-y-1">
            <p className="text-sm font-bold text-gray-900">
              Generating Flashcards...
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Atlas AI is creating flashcards for
            </p>
            <p className="text-xs text-indigo-600 font-semibold">
              {topic.title} · {className}
            </p>
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
          <button onClick={onBack}>
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-base font-extrabold text-gray-900">Flashcards</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-sm text-red-600 font-medium">
            {error || "Failed"}
          </p>
          <button
            onClick={() => fetchFlashcards(true)}
            className="flex items-center gap-2 text-sm font-bold text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const cards = data.cards;
  const card = cards[index];
  const total = cards.length;
  // Finished screen
  if (finished) {
    const pct = total > 0 ? Math.round((known.size / total) * 100) : 0;
    return (
      <div className="px-4 py-4 pb-24">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <h1 className="text-base font-extrabold text-gray-900">Flashcard Results</h1>
        </div>
        <div className="flex flex-col items-center py-3 gap-4">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
            <Trophy className="w-10 h-10 text-indigo-600" />
          </div>
          <p className={`text-2xl font-extrabold ${pct >= 70 ? 'text-green-600' : pct >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
            {pct >= 70 ? 'Great Job!' : pct >= 50 ? 'Keep Practicing' : 'Needs Review'}
          </p>
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
              <p className="text-xl font-extrabold text-green-600">{known.size}</p>
              <p className="text-[10px] text-green-500 font-medium">Know</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
              <p className="text-xl font-extrabold text-red-500">{review.size}</p>
              <p className="text-[10px] text-red-400 font-medium">Review</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-center">
              <p className="text-xl font-extrabold text-indigo-600">{attempts.length}</p>
              <p className="text-[10px] text-indigo-400 font-medium">Attempts</p>
            </div>
          </div>
        </div>

        {attempts.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-extrabold text-gray-900">Attempt History</h3>
            </div>
            <div className="space-y-2">
              {attempts.map((a: any) => {
                const aPct = a.total > 0 ? Math.round(a.score / a.total * 100) : 0;
                const isLatest = a.attempt_number === attempts[0]?.attempt_number;
                return (
                  <div key={a.id} className={`rounded-xl border p-3 flex items-center gap-3 ${isLatest ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold ${isLatest ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{a.attempt_number}</div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-900">Attempt #{a.attempt_number} {isLatest && <span className="text-indigo-600">· Latest</span>}</p>
                      <p className="text-[10px] text-gray-400">{new Date(a.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-extrabold ${aPct >= 70 ? 'text-green-600' : aPct >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{aPct}%</p>
                      <p className="text-[10px] text-gray-400">{a.score}/{a.total} known</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-3 mt-4">
          <button onClick={() => { setShowHistory(true); setFinished(false); }}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all text-sm">
            Review Attempt History
          </button>
          <button onClick={() => { fetchFlashcards(true); setAttemptSaved(false); setRetakeOfAttempt(null); }}
            className="w-full border-2 border-indigo-200 text-indigo-600 font-bold py-2.5 rounded-xl hover:bg-indigo-50 transition-all text-sm">
            Regenerate
          </button>
          <button onClick={onDone} className="w-full border border-gray-200 text-gray-600 rounded-xl font-bold py-2.5 text-sm hover:bg-gray-50">Done</button>
        </div>
      </div>
    );
  }

  const progress = Math.round(((known.size + review.size) / total) * 100);

  const handleKnow = () => {
    setKnown(new Set(known).add(card.id));
    next();
  };
  const handleReview = () => {
    setReview(new Set(review).add(card.id));
    next();
  };
  const next = () => {
    if (index < total - 1) {
      setIndex(index + 1);
      setFlipped(false);
    } else {
      setFinished(true);
    }
  };
  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setFlipped(false);
    }
  };

  const diffColor =
    card.difficulty === "hard"
      ? "text-red-600 bg-red-100 border border-red-200"
      : card.difficulty === "medium"
        ? "text-amber-600 bg-amber-100 border border-amber-200"
        : "text-green-600 bg-green-100 border border-green-200";

  return (
    <div className="px-4 py-4 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack}>
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-gray-900">
              Flashcards
            </h1>
            <p className="text-xs text-gray-400">
              {topic.title} · {className}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {cached && (
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
              <Clock className="w-3 h-3 text-green-600" />
              <span className="text-[10px] font-bold text-green-600">
                Saved
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 border border-gray-200 p-3 rounded-lg mt-4 mb-6">
        <p className="text-xs text-gray-600">
          Card {index + 1} of {total}
        </p>
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-8">
        <div className="flex-1 bg-green-50 border border-green-200 rounded-lg py-1 text-center">
          <p className="text-base font-bold text-green-600">{known.size}</p>
          <p className="text-[11px] text-green-500 font-medium">Know</p>
        </div>
        <div className="flex-1 bg-red-50 border border-red-200 rounded-lg py-1 text-center">
          <p className="text-base font-bold text-red-500">{review.size}</p>
          <p className="text-[11px] text-red-400 font-medium">Review</p>
        </div>
        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg py-1 text-center">
          <p className="text-base font-bold text-gray-600">
            {total - known.size - review.size}
          </p>
          <p className="text-[11px] text-gray-400 font-medium">Remaining</p>
        </div>
      </div>

      {/* Card */}
      <button
        onClick={() => setFlipped(!flipped)}
        className="w-full bg-violet-50 rounded-lg border border-violet-200 shadow-lg py-12 p-8 min-h-[220px] flex flex-col items-center justify-center text-center mb-6 hover:border-indigo-200 transition-all relative"
      >
        {card.difficulty && (
          <span
            className={`absolute top-3 right-3 text-[10px] font-bold px-3 py-0.5 rounded-full ${diffColor}`}
          >
            {card.difficulty}
          </span>
        )}
        {!flipped ? (
          <>
            <p className="text-lg font-bold text-gray-900 mb-5">
              {card.question}
            </p>

            <div className="flex flex-col items-center gap-2 text-xs text-gray-400">
              <div className="relative w-8 h-12">
                <LiaHandPointer className="absolute top-2 left-0.5 text-[26px] text-[#7C6CF7]" />

                <span className="absolute top-[0px] left-[12px] w-[2px] h-[6px] bg-[#7C6CF7] rounded-full" />
                <span className="absolute top-[3px] left-[8px] w-[1.5px] h-[5px] bg-[#7C6CF7] rounded-full rotate-[-35deg]" />
                <span className="absolute top-[3px] left-[16px] w-[1.5px] h-[5px] bg-[#7C6CF7] rounded-full rotate-[35deg]" />
                <span className="absolute top-[7px] left-[5px] w-[1.5px] h-[4px] bg-[#7C6CF7] rounded-full rotate-[-65deg]" />
                <span className="absolute top-[7px] left-[19px] w-[1.5px] h-[4px] bg-[#7C6CF7] rounded-full rotate-[65deg]" />
              </div>

              <p className="text-center">Tap to reveal the answer</p>
            </div>
          </>
        ) : (
          <p className="text-base text-gray-800 leading-relaxed">{card.answer}</p>
        )}
      </button>
      {/* Know / Review buttons */}
     
        <div className="flex items-center justify-center gap-6 mb-7">
          <button
            onClick={handleReview}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-[10px] font-bold text-red-500">
              Need Review
            </span>
          </button>
          <button
            onClick={handleKnow}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-[10px] font-bold text-green-500">
              I Know This
            </span>
          </button>
        </div>
    

      {/* Navigation */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={prev}
          disabled={index === 0}
          className="flex-1 border border-violet-200 bg-violet-100 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-50 transition-all text-base disabled:opacity-30"
        >
          Previous
        </button>
        <button
          onClick={next}
          className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-all text-base"
        >
          {index === total - 1 ? "Finish" : "Next"}
        </button>
      </div>

      {/* Regenerate */}
      <button
        onClick={() => fetchFlashcards(true)}
        className="w-full flex items-center justify-center gap-2  mb-4 text-sm border border-indigo-500 rounded-lg font-semibold text-indigo-500 py-2  hover:text-indigo-600 transition-colors"
      >
        <RefreshCw className="w-3 h-3" /> Regenerate Flashcards
      </button>
    </div>
  );
}
