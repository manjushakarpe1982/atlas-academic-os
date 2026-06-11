'use client';
import { Calendar, RefreshCw, Layers, BarChart2 } from 'lucide-react';
import { Phone } from './shared';
import Image from 'next/image';

interface Props { onNext: () => void; onSkip: () => void; }

export default function CalScreen1({ onNext, onSkip }: Props) {
  return (
    <Phone>
      <div className="flex flex-col ">
       

        {/* Illustration */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="relative w-64 h-52">
            {/* Calendar icon with check */}

 <Image
            src=" https://res.cloudinary.com/mview/image/upload/v1780304978/atlas/dashboardpage4.png"
            alt="Add your first class"
            fill
            className="object-cover object-center rounded-t-2xl"
            priority
          />




          
            <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-white text-base font-extrabold">✓</span>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="px-6 pt-3 pb-4 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Never miss a<br />deadline again
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Connect your school calendar to automatically track assignments, quizzes, and exams.
          </p>
        </div>

        {/* Feature list */}
        <div className="px-12 space-y-5 mb-6">
          {[
            { icon: RefreshCw, text: 'Deadlines auto-sync',     sub: 'All important dates in one place'        },
            { icon: Layers,    text: 'Quizzes imported',        sub: 'Never miss a quiz or exam'               },
            { icon: BarChart2, text: 'Smarter study plans',     sub: 'Better recommendations for you'          },
          ].map(f => (
            <div key={f.text} className="flex items-start gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <f.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-800">{f.text}</p>
                <p className="text-sm text-gray-400">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>

      
      </div>
    </Phone>
  );
}
