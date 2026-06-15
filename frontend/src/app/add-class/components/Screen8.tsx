'use client';
// Screen 10 — Class Added Successfully
import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Phone } from './shared';
import { api } from '@/lib/api';

interface Props { onNext: () => void; onBack: () => void; classId: string | null; }

export default function Screen10({ classId }: Props) {
  const [className, setClassName] = useState('Your class');

  // Load real class name
  useEffect(() => {
    if (!classId) return;
    api<{ name: string }>(`/api/classes/${classId}`)
      .then(d => { if (d?.name) setClassName(d.name); })
      .catch(() => {});
  }, [classId]);

  const shortName = className.split(' ').slice(0, 2).join(' ');

  return (
    <Phone>
      <div className="px-6 py-4 flex flex-col items-center text-center min-h-[520px]">
        <div className="flex-1 flex flex-col items-center justify-center">

          {/* Success icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-5">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>

          {/* Dynamic class name */}
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1 leading-tight">
            <span className="text-indigo-600">{shortName}</span><br />
            added successfully!
          </h1>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            You&apos;re one step closer to a smarter study plan.
          </p>

          {/* Benefits */}
          <div className="w-full space-y-2 text-left">
            {[
              'Weekly study plan enabled',
              'Grade tracking enabled',
              'Deadlines will be tracked',
            ].map(t => (
              <div key={t}
                className="flex items-center gap-3 bg-indigo-50 rounded-xl px-4 py-2.5 border border-indigo-100">
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
