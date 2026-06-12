'use client';
import Image from 'next/image';
import { RefreshCw, Layers, BarChart2, CheckCircle2 } from 'lucide-react';
import { Phone } from './shared';

interface Props { onNext: () => void; onSkip: () => void; }

const FEATURES = [
  { icon: RefreshCw, title: 'Deadlines auto-sync',  sub: 'All important dates in one place' },
  { icon: Layers,    title: 'Quizzes imported',     sub: 'Never miss a quiz or exam'        },
  { icon: BarChart2, title: 'Smarter study plans',  sub: 'Better recommendations for you'   },
];

export default function CalScreen1({ }: Props) {
  return (
    <Phone>
      <div className=" ">

        {/* Hero illustration */}
        <div className="relative w-full flex justify-center pt-6 pb-2">
          {/* Sparkle decorations */}
          <span className="absolute top-4 left-8 text-indigo-400 text-lg">✦</span>
          <span className="absolute top-10 right-8 text-indigo-300 text-sm">✦</span>
          <span className="absolute bottom-4 left-10 text-purple-300 text-xs">✦</span>
          <span className="absolute bottom-2 right-6 text-indigo-400 text-base">✦</span>

          {/* Calendar image with green check badge */}
          <div className="relative">
            <Image
              src="https://res.cloudinary.com/mview/image/upload/v1780304978/atlas/dashboardpage4.png"
              alt="Calendar illustration"
              width={270}
              height={180}
              className="object-contain"
              priority
            />
            {/* Green check badge */}
            <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="px-6 pt-3 pb-5 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-1">
            Never Miss A
          </h1>
          <h1 className="text-2xl font-extrabold text-indigo-600 leading-tight mb-3">
            Deadline Again
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Connect your school calendar to automatically track assignments, quizzes, and exams.
          </p>
        </div>

        {/* Feature list */}
        <div className="px-5 space-y-2 pb-4">
          {FEATURES.map(f => (
            <div key={f.title}
              className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-indigo-50">
              {/* Icon */}
              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <f.icon className="w-4 h-4 text-indigo-600" />
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-gray-900">{f.title}</p>
                <p className="text-sm text-gray-400">{f.sub}</p>
              </div>
              {/* Green check */}
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </Phone>
  );
}
