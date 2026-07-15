'use client';
// Screen 1 — Add Class Intro + class name input
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import { Phone } from './shared';
import { api } from '@/lib/api';

const ORDINALS = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];

interface Props {
  onNext:       () => void;
  onBack:       () => void;
  className:    string;
  setClassName: (v: string) => void;
}

const FEATURES = [
  { text: 'AI parses your syllabus',  highlight: 'AI parses'         },
  { text: 'Extracts important dates', highlight: 'important dates'   },
  { text: 'Builds your study plan',   highlight: 'your study plan'   },
];

export default function Screen1({ className, setClassName }: Props) {
  const [ordinal, setOrdinal] = useState('First');

  useEffect(() => {
    api<{ classes: any[] }>('/api/classes')
      .then((r) => {
        const count = r.classes?.length || 0;
        setOrdinal(count < ORDINALS.length ? ORDINALS[count] : 'Next');
      })
      .catch(() => {});
  }, []);

  return (
    <Phone>
      <div className="flex flex-col bg-white ">

        {/* ── Hero illustration ── */}
        <div className="relative flex justify-center">
          {/* Sparkle */}
          <span className="absolute top-4 left-8 text-indigo-300 text-base">✦</span>
          <span className="absolute top-6 right-10 text-purple-200 text-sm">✦</span>

          <Image
            src="https://res.cloudinary.com/mview/image/upload/v1781160138/atlas/classpagestep1.png"
            alt="Backpack and books"
            width={250}
            height={200}
            className="object-contain"
            priority
          />
        </div>

        {/* ── Headline ── */}
        <div className="px-6  pb-4 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-1">
            Let&apos;s add your
          </h1>
          <h1 className="text-2xl font-extrabold text-indigo-600 leading-tight mb-3">
            {ordinal} Class
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Upload your syllabus and Atlas will do most of the work.
          </p>
        </div>

        {/* ── Class name input ── */}
        <div className="px-5 mb-4">
          <label className="text-lg font-bold text-gray-700 mb-2 block">Class Name</label>
          <div className="flex items-center gap-2 border-2 border-gray-200 focus-within:border-indigo-500 rounded-xl px-3 py-3 transition-all bg-white">
            <input
              type="text"
              value={className}
              onChange={e => setClassName(e.target.value)}
              placeholder="e.g. BIOL 1107 - Intro Biology"
              className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-300 bg-transparent"
            />
            <BookOpen className="w-5 h-5 text-gray-300 flex-shrink-0" />
          </div>
        </div>

        {/* ── Feature list — one card ── */}
        <div className="px-5">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50/60 border border-indigo-100 rounded-lg p-4">
            <p className="text-sm font-extrabold text-indigo-500 uppercase tracking-wider mb-3">
              ✨ What Atlas does for you
            </p>
            <div className="space-y-3">
              {FEATURES.map((f, i) => (
                <div key={f.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-base flex-shrink-0">
                    {['🤖', '📅', '🎯'][i]}
                  </div>
                  <p className="text-sm text-gray-600 flex-1">
                    {f.text.split(f.highlight).map((part, j, arr) => (
                      <span key={j}>
                        {part}
                        {j < arr.length - 1 && (
                          <span className="text-indigo-600 font-bold">{f.highlight}</span>
                        )}
                      </span>
                    ))}
                  </p>
                  {i < FEATURES.length && (
                    <span className="text-green-500 text-sm flex-shrink-0">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Phone>
  );
}
