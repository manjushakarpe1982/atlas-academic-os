'use client';
// Screen 7 — Add Textbook (Optional)
import { useState } from 'react';
import { ArrowLeft, Barcode, Hash } from 'lucide-react';
import { Phone } from './shared';
import { ScreenProps } from './types';

type Tab = 'scan' | 'isbn';

export default function Screen7({ onNext, onBack }: ScreenProps) {
  const [tab, setTab] = useState<Tab>('scan');

  return (
    <Phone step={4} total={5}>
      <div className="px-5 py-4">
        <button onClick={onBack} className="mb-3 text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-xl font-extrabold text-gray-900 mb-1">Add your textbook?</h1>
        <p className="text-xs text-gray-400 mb-5 leading-relaxed">
          This helps Atlas give you chapter-level recommendations.
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 bg-gray-100 rounded-2xl p-1">
          {(['scan', 'isbn'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
              }`}>
              {t === 'scan'
                ? <span className="flex items-center justify-center gap-1"><Barcode className="w-3.5 h-3.5" /> Scan Barcode</span>
                : <span className="flex items-center justify-center gap-1"><Hash className="w-3.5 h-3.5" /> Enter ISBN</span>}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'scan' ? (
          <div className="bg-gray-900 rounded-2xl h-40 flex items-center justify-center mb-5 relative overflow-hidden">
            <div className="absolute inset-4 border-2 border-white/30 rounded-xl" />
            <div className="text-center text-white">
              <Barcode className="w-8 h-8 mx-auto mb-2 opacity-60" />
              <p className="text-xs opacity-60">Position barcode within<br />the frame to scan</p>
            </div>
          </div>
        ) : (
          <input
            placeholder="Enter ISBN (e.g. 9780134710723)"
            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 rounded-2xl outline-none text-sm mb-5"
          />
        )}

        <div className="flex gap-3">
          <button onClick={onBack}
            className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-2xl text-sm hover:bg-gray-50">
            Skip for now
          </button>
          <button onClick={onNext}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl text-sm shadow-md">
            Enter ISBN
          </button>
        </div>
      </div>
    </Phone>
  );
}
