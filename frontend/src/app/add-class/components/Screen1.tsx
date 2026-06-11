'use client';
// Screen 1 — Add Class Intro
// Footer: "Add First Class" button
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { Phone } from './shared';

interface Props { onNext: () => void; onBack: () => void; }

export default function Screen1({ onNext }: Props) {
  return (
    <Phone>
      <div className="flex flex-col min-h-[520px]">

        {/* Hero image — full width, not cropped */}
        <div className="relative w-full flex-shrink-0" style={{ paddingBottom: '52%' }}>
          <Image
            src="https://res.cloudinary.com/mview/image/upload/v1781160138/atlas/classpagestep1.png"
            alt="Add your first class"
            fill
            className="object-cover object-center rounded-t-2xl"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Content */}
        <div className="px-6 pt-3 pb-4 flex flex-col flex-1">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1 text-center">
            Let&apos;s add your<br />first class
          </h1>
          <p className="text-sm text-gray-500 mb-5 text-center leading-relaxed">
            Upload your syllabus and Atlas will do most of the work.
          </p>

          <div className="space-y-2.5 mb-6">
            {['AI parses your syllabus', 'Extracts important dates', 'Builds your study plan'].map(t => (
              <div key={t} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">{t}</span>
              </div>
            ))}
          </div>

          {/* Segmented progress — step 1 of 5 */}
          <div className="flex gap-1.5 mt-auto">
            {[0,1,2,3,4].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i === 0 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1 text-center">Step 1 of 5</p>
        </div>

        {/* Footer button */}
        <div className="px-6 pb-5 pt-2 border-t border-gray-100">
          <button onClick={onNext}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all">
            Add First Class
          </button>
        </div>

      </div>
    </Phone>
  );
}
