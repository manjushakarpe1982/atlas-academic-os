'use client';
// Screen 10 — Class Added Successfully
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Phone } from './shared';
import { ScreenProps } from './types';

export default function Screen10({ onNext }: ScreenProps) {
  const router = useRouter();

  return (
    <Phone>
      <div className="px-6 py-4 flex flex-col items-center text-center min-h-[520px]">
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Success icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Biology added<br />successfully!
          </h1>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            You&apos;re one step closer to a smarter study plan.
          </p>

          {/* Benefits */}
          <div className="w-full space-y-2 text-left">
            {['Weekly study plan enabled', 'Grade tracking enabled', 'Deadlines will be tracked'].map(t => (
              <div key={t} className="flex items-center gap-3 bg-indigo-50 rounded-xl px-4 py-2.5 border border-indigo-100">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span className="text-sm text-indigo-800 font-medium">{t}</span>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </Phone>
  );
}
