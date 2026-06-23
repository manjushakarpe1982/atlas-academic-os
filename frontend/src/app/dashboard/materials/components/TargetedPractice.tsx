'use client';
import { useState } from 'react';
import { ChevronLeft, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const TARGETED_QS = [
  { id: 1, question: 'In a cross between a heterozygous tall plant and a homozygous short plant, what is the probability of offspring being tall?', options: ['A. 25%', 'B. 50%', 'C. 75%', 'D. 100%'], correctIndex: 1 },
  { id: 2, question: 'What pattern of inheritance shows both alleles equally in the phenotype?', options: ['A. Dominance', 'B. Codominance', 'C. Recessive', 'D. Epistasis'], correctIndex: 1 },
];

interface Props { onBack: () => void; onDone: () => void; }

export default function TargetedPractice({ onBack, onDone }: Props) {
  const [difficulty, setDifficulty] = useState<'Easy'|'Medium'|'Hard'>('Medium');
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const q = TARGETED_QS[qIndex];
  const isCorrect = selected === q.correctIndex;

  const handleSelect = (i: number) => { if (!showAnswer) { setSelected(i); setShowAnswer(true); } };
  const next = () => {
    if (qIndex < TARGETED_QS.length - 1) { setQIndex(qIndex + 1); setSelected(null); setShowAnswer(false); }
    else { onDone(); }
  };

  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
        <div>
          <h1 className="text-base font-extrabold text-gray-900">Targeted Practice</h1>
          <p className="text-xs text-gray-400">Genetics</p>
        </div>
      </div>

      {/* Weak Area Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <p className="text-xs font-bold text-amber-700">Weak Area Detected</p>
          <p className="text-sm font-extrabold text-gray-900 mt-0.5">Inheritance Patterns</p>
          <p className="text-xs text-gray-500 mt-0.5">Your confidence: <span className="font-bold text-amber-600">45%</span></p>
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-5">
        <p className="text-xs font-bold text-gray-400 mb-2">Difficulty</p>
        <div className="flex gap-2">
          {(['Easy','Medium','Hard'] as const).map(d => (
            <button key={d} onClick={() => setDifficulty(d)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                difficulty === d ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}>{d}</button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">Question {qIndex + 1} of {TARGETED_QS.length}</p>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <p className="text-sm font-extrabold text-gray-900 mb-4 leading-relaxed">{q.question}</p>
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let style = 'border-gray-200 bg-white text-gray-700';
            if (showAnswer && i === q.correctIndex) style = 'border-green-400 bg-green-50 text-green-700';
            else if (showAnswer && i === selected && !isCorrect) style = 'border-red-400 bg-red-50 text-red-700';
            else if (selected === i && !showAnswer) style = 'border-indigo-400 bg-indigo-50 text-indigo-700';
            return (
              <button key={i} onClick={() => handleSelect(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${style}`}>
                <span className="text-sm font-semibold">{opt}</span>
                {showAnswer && i === q.correctIndex && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto flex-shrink-0" />}
                {showAnswer && i === selected && !isCorrect && i !== q.correctIndex && <XCircle className="w-5 h-5 text-red-500 ml-auto flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={next} disabled={!showAnswer}
        className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all text-sm disabled:opacity-40">
        Next Question
      </button>
    </div>
  );
}
