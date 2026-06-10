'use client';
// Screen 8 — Textbook Found
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Phone } from './shared';
import { ScreenProps } from './types';
import { MOCK_TEXTBOOK } from './mockData';

export default function Screen8({ onNext, onBack }: ScreenProps) {
  return (
    <Phone step={4} total={5}>
      <div className="px-5 py-4">
        <button onClick={onBack} className="mb-3 text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-xl font-extrabold text-gray-900 mb-1">We found your textbook!</h1>
        <p className="text-xs text-gray-400 mb-5">Is this the correct book?</p>

        {/* Book card */}
        <div className="flex gap-4 bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
          <div className="w-20 h-28 bg-indigo-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <div className="text-center p-2">
              <p className="text-white text-[9px] font-bold leading-tight">CAMPBELL</p>
              <p className="text-white text-[7px] leading-tight opacity-70">BIOLOGY</p>
            </div>
          </div>
          <div>
            <p className="font-extrabold text-gray-900 text-sm">{MOCK_TEXTBOOK.title}</p>
            <p className="text-xs text-gray-500">{MOCK_TEXTBOOK.edition}</p>
            <p className="text-xs text-gray-400 mt-1">Author: {MOCK_TEXTBOOK.author}</p>
            <p className="text-xs text-gray-400">Publisher: {MOCK_TEXTBOOK.publisher}</p>
            <span className="inline-flex items-center gap-1 mt-2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Match: {MOCK_TEXTBOOK.match}%
            </span>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-indigo-50 rounded-2xl p-3 mb-5 border border-indigo-100">
          <p className="text-xs font-bold text-indigo-800 mb-2">What we&apos;ll get for you:</p>
          {['Table of contents', 'Chapter topics', 'Better study recommendations'].map(t => (
            <div key={t} className="flex items-center gap-2 mt-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span className="text-xs text-indigo-700">{t}</span>
            </div>
          ))}
        </div>

        <button onClick={onNext}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md mb-2">
          Yes, Add This Book
        </button>
        <button onClick={onNext}
          className="w-full text-xs text-gray-400 hover:text-gray-600 py-2">
          Not the right book
        </button>
      </div>
    </Phone>
  );
}
