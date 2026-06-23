'use client';
import { useState } from 'react';
import { ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from './shared';

interface Props { onBack: () => void; onDone: () => void; }

export default function PracticeQuiz({ onBack, onDone }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const q = QUIZ_QUESTIONS[qIndex];
  const isCorrect = selected === q.correctIndex;

  const handleSelect = (i: number) => { if (!showAnswer) { setSelected(i); setShowAnswer(true); } };
  const next = () => {
    if (qIndex < QUIZ_QUESTIONS.length - 1) { setQIndex(qIndex + 1); setSelected(null); setShowAnswer(false); }
    else { onDone(); }
  };

  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <div>
            <h1 className="text-base font-extrabold text-gray-900">Practice Quiz</h1>
            <p className="text-xs text-gray-400">Genetics</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mb-4">Question {qIndex + 1} of {QUIZ_QUESTIONS.length}</p>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${((qIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <p className="text-base font-extrabold text-gray-900 mb-5">{q.question}</p>
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let style = 'border-gray-200 bg-white text-gray-700';
            if (showAnswer && i === q.correctIndex) style = 'border-green-400 bg-green-50 text-green-700';
            else if (showAnswer && i === selected && !isCorrect) style = 'border-red-400 bg-red-50 text-red-700';
            else if (selected === i && !showAnswer) style = 'border-indigo-400 bg-indigo-50 text-indigo-700';

            return (
              <button key={i} onClick={() => handleSelect(i)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${style}`}>
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
        <div className={`${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} border rounded-2xl p-4 mb-4`}>
          <p className={`text-xs font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'} mb-1`}>
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </p>
          <p className="text-xs font-bold text-gray-400 mt-1">Explanation</p>
          <p className="text-sm text-gray-700 mt-0.5">{q.explanation}</p>
        </div>
      )}

      <button onClick={next} disabled={!showAnswer}
        className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all text-sm disabled:opacity-40">
        Next Question
      </button>
    </div>
  );
}
