'use client';
import { ChevronLeft, Sparkles, Lightbulb } from 'lucide-react';
import { SUMMARY_POINTS } from './shared';

interface Props { onBack: () => void; onGenerateQuiz: () => void; }

export default function SummaryView({ onBack, onGenerateQuiz }: Props) {
  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <h1 className="text-base font-extrabold text-gray-900">Genetics Summary</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3 h-3 text-indigo-600" />
          <span className="text-[10px] font-bold text-indigo-600">AI Generated</span>
        </div>
        <span className="text-[10px] text-gray-400">Today, 10:30 AM</span>
      </div>

      {/* Key Concepts */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">Key Concepts</h2>
        <div className="space-y-3">
          {SUMMARY_POINTS.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5 flex-shrink-0">•</span>
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-bold text-gray-900">{p.term}:</span> {p.def}
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
        <p className="text-sm text-gray-700 leading-relaxed">
          Genes determine traits, but environment also plays a role in how those traits appear.
        </p>
      </div>

      <p className="text-xs text-gray-400 text-center mb-4">Was this summary helpful?</p>

      <button onClick={onGenerateQuiz}
        className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all text-sm">
        Generate Quiz
      </button>
    </div>
  );
}
