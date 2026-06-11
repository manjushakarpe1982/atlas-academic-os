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
      <div className="px-6 ">
    

        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          What&apos;s the name of<br />your class?
        </h1>
        <p className="text-base text-gray-500 mb-6">
          You can skip this if it&apos;s already in your syllabus.
        </p>

        <label className="text-base font-bold text-gray-600 mb-1 block">Class Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="BIOL 1107 - Intro Biology"
          className="w-full px-4 py-3 border-2 border-indigo-400 rounded-xl outline-none text-base mb-1 font-medium"
        />
        <p className="text-xs mt-1 text-gray-400 mb-8">Example: BIOL 1107 - Intro Biology</p>

       
      </div>
    </Phone>
  );
}
