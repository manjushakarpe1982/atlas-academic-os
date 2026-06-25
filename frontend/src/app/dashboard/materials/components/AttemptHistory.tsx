'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, Trophy, Eye, RefreshCw, Loader2, TrendingUp, CheckCircle2, XCircle, Download, RotateCcw } from 'lucide-react';
import { API_BASE, getToken } from '@/lib/api';

interface Attempt {
  id: string; attempt_number: number; score: number; total: number;
  content_json: any; completed_at: string;
}

interface Props {
  topicId: string; topicTitle: string; classId: string; className: string;
  materialType: 'quiz' | 'flashcards' | 'targeted';
  onBack: () => void;
  onStartNew: (regenerate: boolean) => void;
  onRetake: (content: any) => void;
}

export default function AttemptHistory({ topicId, topicTitle, classId, className, materialType, onBack, onStartNew, onRetake }: Props) {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewing, setPreviewing] = useState<Attempt | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/classes/study/attempts/${topicId}/${materialType}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = await res.json();
        setAttempts(d.attempts || []);
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, [topicId, materialType]);

  const labels: Record<string, string> = { quiz: 'Practice Quiz', flashcards: 'Flashcards', targeted: 'Targeted Practice' };
  const label = labels[materialType] || 'Study';

  // Preview screen — show questions + user answers + correct answers
  if (previewing) {
    const questions = previewing.content_json?.questions || previewing.content_json || [];
    const userAnswers = previewing.content_json?.userAnswers || [];
    const pct = previewing.total > 0 ? Math.round(previewing.score / previewing.total * 100) : 0;

    const downloadAsDoc = () => {
      const dateStr = new Date(previewing.completed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><style>
        body { font-family: Calibri, Arial, sans-serif; padding: 20px; color: #333; }
        h1 { color: #4F46E5; font-size: 22px; margin-bottom: 4px; }
        h2 { color: #6B7280; font-size: 14px; margin-top: 0; font-weight: normal; }
        .summary { background: #F0F0FF; padding: 12px; border-radius: 8px; margin: 16px 0; }
        .summary b { color: #4F46E5; }
        .q-block { border: 1px solid #E5E7EB; border-radius: 8px; padding: 14px; margin-bottom: 12px; }
        .q-correct { border-left: 4px solid #22C55E; }
        .q-wrong { border-left: 4px solid #EF4444; }
        .q-title { font-weight: bold; font-size: 14px; margin-bottom: 8px; }
        .option { padding: 6px 10px; margin: 3px 0; border-radius: 4px; font-size: 13px; }
        .opt-correct { background: #DCFCE7; color: #166534; font-weight: bold; }
        .opt-wrong { background: #FEE2E2; color: #991B1B; font-weight: bold; }
        .opt-normal { background: #F9FAFB; color: #6B7280; }
        .explanation { color: #6B7280; font-style: italic; font-size: 12px; margin-top: 6px; }
        .card-block { border: 1px solid #E5E7EB; border-radius: 8px; padding: 14px; margin-bottom: 12px; }
        .card-answer { background: #EEF2FF; padding: 8px; border-radius: 6px; margin-top: 8px; }
      </style></head><body>`;

      html += `<h1>${label} — Attempt #${previewing.attempt_number}</h1>`;
      html += `<h2>${topicTitle} · ${className} · ${dateStr}</h2>`;
      html += `<div class="summary"><b>Score:</b> ${previewing.score}/${previewing.total} (${pct}%)</div>`;

      if (materialType === 'flashcards') {
        (Array.isArray(questions) ? questions : []).forEach((card: any, i: number) => {
          html += `<div class="card-block">`;
          html += `<div class="q-title">Card ${i + 1}: ${card.question || card.front || ''}</div>`;
          html += `<div class="card-answer"><b>Answer:</b> ${card.answer || card.back || ''}</div>`;
          html += `</div>`;
        });
      } else {
        (Array.isArray(questions) ? questions : []).forEach((q: any, i: number) => {
          const userAnswer = userAnswers[i];
          const isCorrect = userAnswer === q.correctIndex;
          html += `<div class="q-block ${isCorrect ? 'q-correct' : 'q-wrong'}">`;
          html += `<div class="q-title">${isCorrect ? '✅' : '❌'} Q${i + 1}. ${q.question}</div>`;
          (q.options || []).forEach((opt: string, oi: number) => {
            const cls = oi === q.correctIndex ? 'opt-correct' : oi === userAnswer ? 'opt-wrong' : 'opt-normal';
            let suffix = '';
            if (oi === q.correctIndex) suffix = ' ✅ Correct Answer';
            else if (oi === userAnswer && !isCorrect) suffix = ' ❌ Your Answer';
            html += `<div class="option ${cls}">${opt}${suffix}</div>`;
          });
          if (q.explanation) html += `<div class="explanation">${q.explanation}</div>`;
          html += `</div>`;
        });
      }

      html += `</body></html>`;
      const blob = new Blob([html], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${label.replace(/\s+/g, '_')}_Attempt_${previewing.attempt_number}_${topicTitle.replace(/\s+/g, '_')}.doc`;
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div className="px-4 py-4 pb-24">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setPreviewing(null)}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <div className="flex-1">
            <h1 className="text-base font-extrabold text-gray-900">Attempt #{previewing.attempt_number}</h1>
            <p className="text-xs text-gray-400">Score: {previewing.score}/{previewing.total} ({pct}%) · {new Date(previewing.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <button onClick={downloadAsDoc}
            className="flex items-center gap-1.5 bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-200 transition-all">
            <Download className="w-3.5 h-3.5" /> DOC
          </button>
        </div>

        {materialType === 'flashcards' ? (
          // Flashcard preview — show cards with question/answer
          <div className="space-y-3">
            {(Array.isArray(questions) ? questions : []).map((card: any, i: number) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs font-bold text-gray-400 mb-1">Card {i + 1}</p>
                <p className="text-sm font-bold text-gray-900 mb-2">{card.question || card.front}</p>
                <div className="bg-indigo-50 rounded-lg p-3">
                  <p className="text-xs font-bold text-indigo-600 mb-0.5">Answer</p>
                  <p className="text-sm text-gray-800">{card.answer || card.back}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Quiz / Targeted preview — show questions with user answer + correct answer
          <div className="space-y-3">
            {(Array.isArray(questions) ? questions : []).map((q: any, i: number) => {
              const userAnswer = userAnswers[i];
              const isCorrect = userAnswer === q.correctIndex;
              return (
                <div key={i} className={`bg-white rounded-2xl border shadow-sm p-4 ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />}
                    <p className="text-sm font-bold text-gray-900">Q{i + 1}. {q.question}</p>
                  </div>
                  <div className="space-y-1.5 ml-6">
                    {(q.options || []).map((opt: string, oi: number) => {
                      const isUserPick = oi === userAnswer;
                      const isRight = oi === q.correctIndex;
                      return (
                        <div key={oi} className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${
                          isRight ? 'bg-green-50 text-green-700 font-bold border border-green-200' :
                          isUserPick ? 'bg-red-50 text-red-600 font-bold border border-red-200' :
                          'bg-gray-50 text-gray-600'
                        }`}>
                          <span>{opt}</span>
                          {isRight && <span className="text-[10px]">✅ Correct</span>}
                          {isUserPick && !isRight && <span className="text-[10px]">❌ Your answer</span>}
                        </div>
                      );
                    })}
                  </div>
                  {q.explanation && <p className="text-xs text-gray-500 mt-2 ml-6 italic">{q.explanation}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="px-4 py-4 pb-24">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <h1 className="text-base font-extrabold text-gray-900">{label}</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        </div>
      </div>
    );
  }

  // No attempts — should not reach here, but fallback
  if (attempts.length === 0) {
    onStartNew(false);
    return null;
  }

  const best = Math.max(...attempts.map(a => a.total > 0 ? Math.round(a.score / a.total * 100) : 0));

  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
        <div>
          <h1 className="text-base font-extrabold text-gray-900">{label}</h1>
          <p className="text-xs text-gray-400">{topicTitle}</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-indigo-600 rounded-2xl p-5 mb-5 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <p className="text-base font-extrabold">{attempts.length} Attempt{attempts.length > 1 ? 's' : ''}</p>
            <p className="text-xs text-indigo-200">Best Score: {best}%</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
            <p className="text-lg font-extrabold">{attempts.length}</p>
            <p className="text-[9px] text-indigo-200">Total</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
            <p className="text-lg font-extrabold">{best}%</p>
            <p className="text-[9px] text-indigo-200">Best</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
            <p className="text-lg font-extrabold">{attempts[0].total > 0 ? Math.round(attempts[0].score / attempts[0].total * 100) : 0}%</p>
            <p className="text-[9px] text-indigo-200">Latest</p>
          </div>
        </div>
      </div>

      {/* Attempt List */}
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-indigo-600" />
        <h3 className="text-sm font-extrabold text-gray-900">All Attempts</h3>
      </div>
      <div className="space-y-2.5 mb-5">
        {attempts.map(a => {
          const aPct = a.total > 0 ? Math.round(a.score / a.total * 100) : 0;
          const isLatest = a.attempt_number === attempts[0]?.attempt_number;
          return (
            <div key={a.id} className={`rounded-2xl border p-4 flex items-center gap-3 ${isLatest ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold ${isLatest ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                #{a.attempt_number}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">
                  Attempt #{a.attempt_number} {isLatest && <span className="text-indigo-600">· Latest</span>}
                </p>
                <p className="text-[10px] text-gray-400">
                  {new Date(a.completed_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right mr-2">
                <p className={`text-sm font-extrabold ${aPct >= 70 ? 'text-green-600' : aPct >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{aPct}%</p>
                <p className="text-[10px] text-gray-400">{a.score}/{a.total}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <button onClick={() => setPreviewing(a)}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-100 px-3 py-1.5 rounded-lg hover:bg-indigo-200 transition-all">
                  <Eye className="w-3 h-3" /> Preview
                </button>
                <button onClick={() => onRetake(a.content_json)}
                  className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-all">
                  <RotateCcw className="w-3 h-3" /> Re-Take
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <button onClick={() => onStartNew(true)}
        className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all text-sm flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4" /> Regenerate New Test
      </button>
      <button onClick={onBack}
        className="w-full text-gray-500 font-semibold py-3 text-sm mt-2">Back</button>
    </div>
  );
}
