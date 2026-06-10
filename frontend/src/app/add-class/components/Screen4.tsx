'use client';
// Screen 4 — AI Parsing Progress
import { ArrowLeft, FileText, CheckCircle2, Circle } from 'lucide-react';
import { Phone } from './shared';
import { ScreenProps } from './types';

const PARSE_ITEMS = [
  { label: 'Course information',       done: true  },
  { label: 'Grading breakdown',        done: true  },
  { label: 'Important dates',          done: true  },
  { label: 'Weekly topics & schedule', done: false },
];

export default function Screen4({ onNext, onBack }: ScreenProps) {
  return (
    <Phone step={2} total={5}>
      <div className="px-6 py-4">
        <button onClick={onBack} className="mb-4 text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Reading your syllabus...</h1>
        <p className="text-sm text-gray-400 mb-8">This usually takes 15–30 seconds.</p>

        {/* Circular progress */}
        <div className="flex justify-center mb-8">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#4F46E5" strokeWidth="8"
                strokeDasharray="188" strokeDashoffset="47" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Parse checklist */}
        <div className="space-y-3 mb-8">
          {PARSE_ITEMS.map(item => (
            <div key={item.label} className="flex items-center gap-3">
              {item.done
                ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                : <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />}
              <span className={`text-sm ${item.done ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <button onClick={onNext}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all">
          Continue
        </button>
      </div>
    </Phone>
  );
}
