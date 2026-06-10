'use client';
// Screen 2 — Class Name Input
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Phone } from './shared';
import { ScreenProps } from './types';

export default function Screen2({ onNext, onBack }: ScreenProps) {
  const [name, setName] = useState('BIOL 1107 - Intro Biology');

  return (
    <Phone step={1} total={5}>
      <div className="px-6 py-4">
        <button onClick={onBack} className="mb-4 text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          What&apos;s the name of<br />your class?
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          You can skip this if it&apos;s already in your syllabus.
        </p>

        <label className="text-xs font-bold text-gray-600 mb-1 block">Class Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="BIOL 1107 - Intro Biology"
          className="w-full px-4 py-3 border-2 border-indigo-400 rounded-2xl outline-none text-sm mb-1 font-medium"
        />
        <p className="text-xs text-gray-400 mb-8">Example: BIOL 1107 - Intro Biology</p>

        <div className="flex gap-3 mt-4">
          <button onClick={onNext}
            className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-2xl text-sm hover:bg-gray-50">
            Skip for now
          </button>
          <button onClick={onNext} disabled={!name.trim()}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-2xl text-sm shadow-md">
            Continue
          </button>
        </div>
      </div>
    </Phone>
  );
}
