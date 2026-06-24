'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle2, XCircle, Loader2, Sparkles, RefreshCw, Clock, Trophy } from 'lucide-react';
import { API_BASE, getToken } from '@/lib/api';
import { TopicItem } from './shared';

interface Question { id: number; question: string; options: string[]; correctIndex: number; explanation: string; difficulty?: string; }
interface QuizData { title: string; totalQuestions: number; questions: Question[]; }

interface Props {
  className: string; classId: string; topic: TopicItem;
  onBack: () => void; onDone: () => void;
}

export default function PracticeQuiz({ className, classId, topic, onBack, onDone }: Props) {
  const [data, setData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cached, setCached] = useState(false);

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const fetchQuiz = async (regenerate = false) => {
    setLoading(true); setError('');
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/classes/study/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          class_name: className, class_id: classId, topic_id: topic.id,
          topic_title: topic.title, topic_description: topic.description || '', regenerate,
        }),
      });
      const d = await res.json();
      if (d.quiz) { setData(d.quiz); setCached(d.cached || false); setQIndex(0); setSelected(null); setShowAnswer(false); setScore(0); setFinished(false); }
      else { setError(d.error || 'Failed to generate quiz'); }
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true); setError('');
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/classes/study/quiz`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            class_name: className, class_id: classId, topic_id: topic.id,
            topic_title: topic.title, topic_description: topic.description || '', regenerate: false,
          }),
        });
        const d = await res.json();
        if (cancelled) return;
        if (d.quiz) { setData(d.quiz); setCached(d.cached || false); }
        else { setError(d.error || 'Failed'); }
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
          <h1 className="text-base font-extrabold text-gray-900">Practice Quiz</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">Generating Quiz...</p>
            <p className="text-xs text-gray-400 mt-1">Atlas AI is creating questions for</p>
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
          <h1 className="text-base font-extrabold text-gray-900">Practice Quiz</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-sm text-red-600 font-medium">{error || 'Failed'}</p>
          <button onClick={() => fetchQuiz(true)}
            className="flex items-center gap-2 text-sm font-bold text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const questions = data.questions;
  const total = questions.length;

  // Finished screen
  if (finished) {
    const pct = Math.round((score / total) * 100);
    const grade = pct >= 90 ? 'Excellent!' : pct >= 70 ? 'Good Job!' : pct >= 50 ? 'Keep Practicing' : 'Needs Review';
    const gradeColor = pct >= 90 ? 'text-green-600' : pct >= 70 ? 'text-blue-600' : pct >= 50 ? 'text-amber-600' : 'text-red-600';
    return (
      <div className="px-4 py-4 pb-24">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <h1 className="text-base font-extrabold text-gray-900">Quiz Results</h1>
        </div>
        <div className="flex flex-col items-center py-3 gap-4">
          <div className="w-20 h-20 bg-indigo-100 rounded-full mb-2 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-indigo-600" />
          </div>
          <p className={`text-2xl font-extrabold ${gradeColor}`}>{grade}</p>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 w-full text-center">
            <p className="text-4xl font-extrabold text-gray-900">{score}/{total}</p>
            <p className="text-sm text-gray-400 mt-1">Questions Correct</p>
            <p className={`text-lg font-extrabold mt-2 ${gradeColor}`}>{pct}%</p>
          </div>
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="bg-green-50 border border-green-100 rounded-lg p-2 text-center">
              <p className="text-lg font-extrabold text-green-600">{score}</p>
              <p className="text-[11px] text-green-500 font-medium">Correct</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-lg p-2 text-center">
              <p className="text-lg font-extrabold text-red-500">{total - score}</p>
              <p className="text-[11px] text-red-400 font-medium">Incorrect</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2 text-center">
              <p className="text-lg font-extrabold text-indigo-600">{total}</p>
              <p className="text-[11px] text-indigo-400 font-medium">Total</p>
            </div>
          </div>
        </div>
        <div className="space-y-3 mt-4">
          <button onClick={() => { setQIndex(0); setSelected(null); setShowAnswer(false); setScore(0); setFinished(false); }}
            className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition-all text-sm">
            Retake Quiz
          </button>
          <button onClick={() => fetchQuiz(true)}
            className="w-full bg-violet-100 border border-violet-200 text-indigo-600 font-bold py-2.5 rounded-lg hover:bg-indigo-50 transition-all text-sm">
            Generate New Quiz
          </button>
          <button onClick={onDone}
            className="w-full  border border-indigo-200 text-indigo-600 rounded-lg  font-bold py-2.5 text-sm hover:text-gray-700">
            Done
          </button>
        </div>
      </div>
    );
  }

  // Quiz questions
  const q = questions[qIndex];
  const isCorrect = selected === q.correctIndex;
  const handleSelect = (i: number) => { if (!showAnswer) { setSelected(i); setShowAnswer(true); if (i === q.correctIndex) setScore(score + 1); } };
  const next = () => {
    if (qIndex < total - 1) { setQIndex(qIndex + 1); setSelected(null); setShowAnswer(false); }
    else { setFinished(true); }
  };
  const diffColor = q.difficulty === 'hard' ? 'text-red-600 bg-red-50' : q.difficulty === 'medium' ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50';

  return (
    <div className="px-4 py-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <div>
            <h1 className="text-base font-extrabold text-gray-900">Practice Quiz</h1>
            <p className="text-xs text-gray-400">{topic.title} · {className}</p>
          </div>
        </div>
        {cached && (
          <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3 text-green-600" />
            <span className="text-[10px] font-bold text-green-600">Saved</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="flex items-center border border-gray-200 p-2 rounded-lg gap-3 mb-4">
        <p className="text-xs text-gray-600">Question {qIndex + 1} of {total}</p>
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${((qIndex + 1) / total) * 100}%` }} />
        </div>
        {q.difficulty && <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${diffColor}`}>{q.difficulty}</span>}
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 mb-4">
        <p className="text-base font-bold text-gray-900 mb-5">{q.question}</p>
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let style = 'border-gray-200 bg-white text-gray-700';
            if (showAnswer && i === q.correctIndex) style = 'border-green-400 bg-green-50 text-green-700';
            else if (showAnswer && i === selected && !isCorrect) style = 'border-red-400 bg-red-50 text-red-700';
            else if (selected === i && !showAnswer) style = 'border-indigo-400 bg-indigo-50 text-indigo-700';
            return (
              <button key={i} onClick={() => handleSelect(i)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border text-left transition-all ${style}`}>
                <span className="text-sm font-semibold">{opt}</span>
                {showAnswer && i === q.correctIndex && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto flex-shrink-0" />}
                {showAnswer && i === selected && !isCorrect && i !== q.correctIndex && <XCircle className="w-5 h-5 text-red-500 ml-auto flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {showAnswer && (
        <div className={`${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} border rounded-lg p-4 mb-4`}>
          <p className={`text-xs font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'} mb-1`}>
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </p>
          <p className="text-xs font-semibold text-gray-500 mt-1">Explanation</p>
          <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{q.explanation}</p>
        </div>
      )}

      {/* Next */}
      <button onClick={next} disabled={!showAnswer}
        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all text-sm disabled:opacity-40">
        {qIndex === total - 1 ? 'Finish Quiz' : 'Next Question'}
      </button>

      {/* Score */}
      <p className="text-xs text-gray-500 text-center mt-3">Score: {score}/{qIndex + (showAnswer ? 1 : 0)}</p>
    </div>
  );
}
