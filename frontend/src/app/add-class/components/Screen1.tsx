'use client';
// Screen 1 — Add Class Intro
import { CheckCircle2 } from 'lucide-react';
import { BookOpen } from 'lucide-react';
import { Phone } from './shared';
import { ScreenProps } from './types';

export default function Screen1({ onNext }: ScreenProps) {
  return (
    <Phone>
      <div className="px-6 py-4 flex flex-col items-center text-center min-h-[520px]">
        <div className="w-24 h-24 bg-indigo-100 rounded-3xl flex items-center justify-center mb-6 mt-4">
          <BookOpen className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Let&apos;s add your<br />first class
        </h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Upload your syllabus and Atlas will do most of the work.
        </p>

        <div className="w-full space-y-3 mb-8 text-left">
          {['AI parses your syllabus', 'Extracts important dates', 'Builds your study plan'].map(t => (
            <div key={t} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">{t}</span>
            </div>
          ))}
        </div>

        <button onClick={onNext}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all">
          Add First Class
        </button>

        <div className="mt-4">
          <div className="flex gap-1 justify-center">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1.5 rounded-full ${i === 0 ? 'w-4 bg-indigo-600' : 'w-1.5 bg-gray-200'}`} />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1 text-center">Step 1 of 5</p>
        </div>
      </div>
    </Phone>
  );
}
