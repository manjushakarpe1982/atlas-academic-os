'use client';
import { CheckCircle2 } from 'lucide-react';
import { Phone } from './shared';

interface Props { onNext: () => void; }

const UPCOMING = [
  { title: 'Biology Quiz',        date: 'Fri, May 16 • 12:00 AM' },
  { title: 'Calculus Homework',   date: 'Mon, May 19 • 11:58 PM' },
  { title: 'Chemistry Lab Report',date: 'Wed, May 21 • 11:58 PM' },
];

export default function CalScreen6({ onNext }: Props) {
  return (
    <Phone>
      <div className="flex flex-col min-h-[520px]">

        {/* Success icon */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="px-6 text-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
            Calendar Connected! 🎉
          </h1>
          <p className="text-sm text-gray-400">We&apos;ve imported your upcoming deadlines.</p>
        </div>

        {/* Upcoming This Week */}
        <div className="px-5 flex-1">
          <p className="text-xs font-extrabold text-gray-700 uppercase tracking-wide mb-3">
            Upcoming This Week
          </p>
          <div className="space-y-2">
            {UPCOMING.map(item => (
              <div key={item.title}
                className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 text-xs">📅</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      
      </div>
    </Phone>
  );
}
