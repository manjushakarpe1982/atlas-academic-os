'use client';
import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, RefreshCw } from 'lucide-react';
import { Phone } from './shared';

interface Props { onDone: () => void; onError: () => void; platform: string; }

const SYNC_STEPS = [
  `Connecting to {platform}`,
  'Fetching assignments',
  'Fetching quizzes',
  'Fetching exams',
];

export default function CalScreen5({ onDone, onError, platform }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Simulate sync steps every 800ms
    const interval = setInterval(() => {
      setCurrent(prev => {
        const next = prev + 1;
        if (next >= SYNC_STEPS.length) {
          clearInterval(interval);
          // Simulate 80% success, 20% error for demo
          setTimeout(() => onDone(), 600);
          return next;
        }
        return next;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [onDone]);

  const platformName = platform === 'canvas' ? 'Canvas' : 'Blackboard';

  return (
    <Phone>
      <div className="flex flex-col min-h-[520px] px-6 pt-6">
        {/* Spinning icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center">
            <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">
          Syncing your calendar...
        </h1>
        <p className="text-sm text-gray-400 text-center mb-8">
          This may take a few seconds.
        </p>

        {/* Sync checklist */}
        <div className="space-y-4 mb-8">
          {SYNC_STEPS.map((step, i) => {
            const label = step.replace('{platform}', platformName);
            const isDone = i < current;
            const isActive = i === current;
            return (
              <div key={step} className="flex items-center gap-3">
                {isDone
                  ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  : isActive
                    ? <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    : <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                }
                <span className={`text-sm ${isDone ? 'text-gray-900 font-medium' : isActive ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 flex items-start gap-2">
          <span className="text-base">💡</span>
          <div>
            <p className="text-xs font-bold text-amber-800">Tip</p>
            <p className="text-xs text-amber-700">Keep this screen open while we sync your data.</p>
          </div>
        </div>
      </div>
    </Phone>
  );
}
