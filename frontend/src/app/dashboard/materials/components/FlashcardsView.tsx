'use client';
import { useState } from 'react';
import { ChevronLeft, RotateCcw, ThumbsDown, ThumbsUp } from 'lucide-react';
import { FLASHCARDS } from './shared';

interface Props { onBack: () => void; onDone: () => void; }

export default function FlashcardsView({ onBack, onDone }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = FLASHCARDS[index];

  const next = () => { if (index < FLASHCARDS.length - 1) { setIndex(index + 1); setFlipped(false); } else { onDone(); } };
  const prev = () => { if (index > 0) { setIndex(index - 1); setFlipped(false); } };

  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <div>
            <h1 className="text-base font-extrabold text-gray-900">Flashcards</h1>
            <p className="text-xs text-gray-400">Genetics</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mb-4">Card {index + 1} of {FLASHCARDS.length}</p>

      {/* Card */}
      <button onClick={() => setFlipped(!flipped)}
        className="w-full bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-8 min-h-[220px] flex flex-col items-center justify-center text-center mb-4 hover:border-indigo-200 transition-all">
        {!flipped ? (
          <>
            <p className="text-xl font-extrabold text-gray-900 mb-3">{card.front}</p>
            <p className="text-xs text-gray-400">Tap to reveal the answer</p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-700 leading-relaxed">{card.back}</p>
          </>
        )}
      </button>

      {flipped && (
        <div className="flex items-center justify-center gap-6 mb-6">
          <button onClick={() => { next(); }}
            className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-[10px] font-bold text-red-500">Need Review</span>
          </button>
          <button onClick={() => { next(); }}
            className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-[10px] font-bold text-green-500">I Know This</span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={prev} disabled={index === 0}
          className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all text-sm disabled:opacity-30">
          Previous
        </button>
        <button onClick={next}
          className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all text-sm">
          Next
        </button>
      </div>
    </div>
  );
}
