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
      <div className="flex flex-col ">

        {/* Hero image — full width, not cropped */}
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
        <div className="px-6 pt-3 pb-4 flex flex-col flex-1">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1 text-center">
            Let&apos;s add your<br />first class
          </h1>
          <p className="text-base text-gray-500 mb-5 text-center leading-relaxed">
            Upload your syllabus and Atlas will do most of the work.
          </p>

<div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 ">
          <div className="space-y-2.5 mb-6">
            {['AI parses your syllabus', 'Extracts important dates', 'Builds your study plan'].map(t => (
              <div key={t} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-base text-gray-700">{t}</span>
              </div>
            ))}
          </div>
          </div>

        
        </div>

       

      </div>
    </Phone>
  );
}
