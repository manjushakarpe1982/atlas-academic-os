'use client';
// Screen 1 — Add Class Intro + class name input
import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import { Phone } from './shared';

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
            first class
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

        {/* ── Feature list ── */}
        <div className="px-5 space-y-2">
          {FEATURES.map(f => (
            <div key={f.text}
              className="flex items-center gap-3 bg-indigo-50/60 rounded-xl px-4 py-3 border border-indigo-100/50">
              {/* Indigo circle check */}
              <div className="w-5 h-5 rounded-full border-2 border-indigo-500 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              {/* Text with partial indigo highlight */}
              <p className="text-sm text-gray-600">
                {f.text.split(f.highlight).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="text-indigo-600 font-semibold">{f.highlight}</span>
                    )}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

      </div>
    </Phone>
  );
}
