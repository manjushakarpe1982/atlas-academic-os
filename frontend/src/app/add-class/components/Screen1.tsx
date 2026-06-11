'use client';
// Screen 1 — Intro + Class Name Input (combined)
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { Phone } from './shared';

interface Props {
  onNext:    () => void;
  onBack:    () => void;
  className: string;
  setClassName: (v: string) => void;
}

export default function Screen1({ className, setClassName }: Props) {
  return (
    <Phone>
      <div className="flex flex-col">

        {/* Hero image */}
        <div className="relative w-full flex-shrink-0" style={{ paddingBottom: '62%' }}>
          <Image
            src="https://res.cloudinary.com/mview/image/upload/v1781160138/atlas/classpagestep1.png"
            alt="Add your first class"
            fill
            className="object-cover object-center rounded-t-2xl"
            priority
          />
        </div>

        {/* Content */}
        <div className="px-6 pt-4 pb-4 flex flex-col">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1 text-center">
            Let&apos;s add your first class
          </h1>
          <p className="text-sm text-gray-500 mb-4 text-center leading-relaxed">
            Upload your syllabus and Atlas will do most of the work.
          </p>

          {/* Class name input */}
          <div className="mb-4">
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">
              Class name
            </label>
            <input
              type="text"
              value={className}
              onChange={e => setClassName(e.target.value)}
              placeholder="e.g. BIOL 1107 - Intro Biology"
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 rounded-xl outline-none text-sm transition-all"
            />
          </div>

          {/* Feature list */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <div className="space-y-2">
              {['AI parses your syllabus', 'Extracts important dates', 'Builds your study plan'].map(t => (
                <div key={t} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Phone>
  );
}
