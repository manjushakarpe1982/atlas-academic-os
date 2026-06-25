'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, AlertTriangle, CheckCircle2, XCircle, Loader2, Sparkles, RefreshCw, Clock, Target, TrendingUp } from 'lucide-react';
import { API_BASE, getToken } from '@/lib/api';
import { TopicItem } from './shared';
import AttemptHistory from './AttemptHistory';

interface Question { id: number; question: string; options: string[]; correctIndex: number; explanation: string; }
interface WeakArea { id: number; name: string; confidence: number; description: string; questions: Question[]; }
interface TargetedData { title: string; difficulty: string; weakAreas: WeakArea[]; totalQuestions: number; studyAdvice: string; }

interface Props {
  className: string; classId: string; topic: TopicItem;
  onBack: () => void; onDone: () => void;
}

export default function TargetedPractice({ className, classId, topic, onBack, onDone }: Props) {
  const [data, setData] = useState<TargetedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cached, setCached] = useState(false);
  const [checkingAttempts, setCheckingAttempts] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  // Check for existing attempts on mount
  useEffect(() => {
    const check = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/classes/study/attempts/${topic.id}/targeted`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = await res.json();
        if (d.attempts && d.attempts.length > 0) { setShowHistory(true); }
      } catch {}
      finally { setCheckingAttempts(false); }
    };
    check();
  }, [topic.id]);
  const [difficulty, setDifficulty] = useState<'easy'|'medium'|'hard'>('medium');

  // Flatten questions from all weak areas
  const allQuestions = data ? data.weakAreas.flatMap(wa => wa.questions.map(q => ({ ...q, weakArea: wa.name }))) : [];
  const total = allQuestions.length;

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
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
        const allQs = data.weakAreas.flatMap((wa: any) => wa.questions);
        await fetch(`${API_BASE}/api/classes/study/save-attempt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            topic_id: topic.id, class_id: classId, material_type: 'targeted',
            content_json: { questions: allQs, userAnswers }, score, total: allQs.length,
          }),
        });
        const res = await fetch(`${API_BASE}/api/classes/study/attempts/${topic.id}/targeted`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = await res.json();
        setAttempts(d.attempts || []);
      } catch {}
    };
    save();
  }, [finished]);

  const fetchTargeted = async (regenerate = false, diff = difficulty) => {
    setLoading(true); setError('');
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/classes/study/targeted`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          class_name: className, class_id: classId, topic_id: topic.id,
          topic_title: topic.title, topic_description: topic.description || '',
          difficulty: diff, regenerate,
        }),
      });
      const d = await res.json();
      if (d.targeted) { setData(d.targeted); setCached(d.cached || false); setQIndex(0); setSelected(null); setShowAnswer(false); setScore(0); setFinished(false); }
      else { setError(d.error || 'Failed'); }
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true); setError('');
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/classes/study/targeted`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            class_name: className, class_id: classId, topic_id: topic.id,
            topic_title: topic.title, topic_description: topic.description || '',
            difficulty, regenerate: false,
          }),
        });
        const d = await res.json();
        if (cancelled) return;
        if (d.targeted) { setData(d.targeted); setCached(d.cached || false); }
        else { setError(d.error || 'Failed'); }
      } catch { if (!cancelled) setError('Network error'); }
      finally { if (!cancelled) setLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const changeDifficulty = (d: 'easy'|'medium'|'hard') => { setDifficulty(d); fetchTargeted(true, d); };

  // Loading
  if (checkingAttempts) {
    return (
      <div className="px-4 py-4 pb-24">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <h1 className="text-base font-extrabold text-gray-900">Targeted Practice</h1>
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
        materialType="targeted" onBack={onBack}
        onStartNew={(regenerate: boolean) => { setShowHistory(false); if (regenerate) fetchTargeted(true); }}
        onRetake={(content: any) => {
          const qs = content?.questions || content || [];
          const weakAreas = [{ area: topic.title, confidence: 0, questions: qs }];
          setData({ weakAreas });
          setQIndex(0); setSelected(null); setShowAnswer(false); setScore(0); setFinished(false); setAttemptSaved(false); setUserAnswers([]);
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
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <h1 className="text-base font-extrabold text-gray-900">Targeted Practice</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center animate-pulse">
            <Target className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">Analyzing Weak Areas...</p>
            <p className="text-xs text-gray-400 mt-1">Atlas AI is generating targeted practice for</p>
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
          <h1 className="text-base font-extrabold text-gray-900">Targeted Practice</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-sm text-red-600 font-medium">{error || 'Failed'}</p>
          <button onClick={() => fetchTargeted(true)}
            className="flex items-center gap-2 text-sm font-bold text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  // Finished
  if (finished) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <div className="px-4 py-4 pb-24">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <h1 className="text-base font-extrabold text-gray-900">Practice Complete</h1>
        </div>
        <div className="flex flex-col items-center py-6 gap-4">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
            <Target className="w-10 h-10 text-indigo-600" />
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 w-full text-center">
            <p className="text-4xl font-extrabold text-gray-900">{score}/{total}</p>
            <p className="text-sm text-gray-400 mt-1">Questions Correct</p>
            <p className={`text-lg font-extrabold mt-2 ${pct >= 70 ? 'text-green-600' : pct >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{pct}%</p>
          </div>

          {/* Weak Area Results */}
          <div className="w-full space-y-3">
            {data.weakAreas.map(wa => (
              <div key={wa.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-gray-900">{wa.name}</p>
                  <span className={`text-xs font-bold ${wa.confidence < 50 ? 'text-red-600' : 'text-amber-600'}`}>{wa.confidence}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${wa.confidence < 50 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${wa.confidence}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Study Advice */}
          {data.studyAdvice && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 w-full">
              <p className="text-sm font-bold text-indigo-700 mb-1">Study Advice</p>
              <p className="text-sm text-gray-700 leading-relaxed">{data.studyAdvice}</p>
            </div>
          )}
        </div>
        {/* Attempt History */}
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
                      <p className="text-xs font-bold text-gray-900">Attempt #{a.attempt_number} {isLatest && <span className="text-indigo-600">\u00b7 Latest</span>}</p>
                      <p className="text-[10px] text-gray-400">{new Date(a.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-extrabold ${aPct >= 70 ? 'text-green-600' : aPct >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{aPct}%</p>
                      <p className="text-[10px] text-gray-400">{a.score}/{a.total}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-3 mt-4">
          <button onClick={() => { setQIndex(0); setSelected(null); setShowAnswer(false); setScore(0); setFinished(false); setAttemptSaved(false); }}
            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-lg hover:bg-indigo-700 transition-all text-sm">
            Retake Practice
          </button>
          <button onClick={() => { fetchTargeted(true); setAttemptSaved(false); }}
            className="w-full bg-violet-100 border border-violet-200 text-violet-600 font-bold py-3 rounded-lg hover:bg-indigo-50 transition-all text-sm">
            Generate New Practice
          </button>
          <button onClick={onDone} className="w-full border border-indigo-200 text-indigo-600 rounded-lg font-bold py-2.5 text-sm">Done</button>
        </div>
      </div>
    );
  }

  // Questions
  const q = allQuestions[qIndex];
  const isCorrect = selected === q.correctIndex;
  const handleSelect = (i: number) => { if (!showAnswer) { setSelected(i); setShowAnswer(true); if (i === q.correctIndex) setScore(score + 1); setUserAnswers(prev => { const copy = [...prev]; copy[qIndex] = i; return copy; }); } };
  const next = () => {
    if (qIndex < total - 1) { setQIndex(qIndex + 1); setSelected(null); setShowAnswer(false); }
    else { setFinished(true); }
  };

  return (
    <div className="px-4 py-4 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <div>
            <h1 className="text-base font-extrabold text-gray-900">Targeted Practice</h1>
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

      {/* Weak Area Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 flex items-start gap-3">
        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <p className="text-xs font-bold text-amber-700">Weak Area Detected</p>
          <p className="text-sm font-extrabold text-gray-900 mt-0.5">{q.weakArea}</p>
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-4">
        <p className="text-sm font-bold text-gray-600 mb-2">Difficulty</p>
        <div className="flex gap-2">
          {(['easy','medium','hard'] as const).map(d => (
            <button key={d} onClick={() => changeDifficulty(d)}
              className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all capitalize ${
                difficulty === d ? 'bg-indigo-600 text-white' : 'bg-gray-100 border border-gray-200 text-gray-600'
              }`}>{d}</button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm p-2 gap-3 mb-4">
        <p className="text-xs text-gray-600">Question {qIndex + 1} of {total}</p>
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${((qIndex + 1) / total) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 mb-4">
        <p className="text-sm font-extrabold text-gray-900 mb-4 leading-relaxed">{q.question}</p>
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let style = 'border-gray-200 bg-white text-gray-700';
            if (showAnswer && i === q.correctIndex) style = 'border-green-400 bg-green-50 text-green-700';
            else if (showAnswer && i === selected && !isCorrect) style = 'border-red-400 bg-red-50 text-red-700';
            else if (selected === i && !showAnswer) style = 'border-indigo-400 bg-indigo-50 text-indigo-700';
            return (
              <button key={i} onClick={() => handleSelect(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${style}`}>
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
        <div className={`${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} border rounded-lg p-3 mb-4`}>
          <p className={`text-xs font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'} mb-1`}>
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </p>
          <p className="text-xs font-bold text-gray-600 mt-1">Explanation</p>
          <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{q.explanation}</p>
        </div>
      )}

      <button onClick={next} disabled={!showAnswer}
        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all text-sm disabled:opacity-40">
        {qIndex === total - 1 ? 'Finish Practice' : 'Next Question'}
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">Score: {score}/{qIndex + (showAnswer ? 1 : 0)}</p>
    </div>
  );
}
