'use client';
import { useEffect, useState, useRef } from 'react';
import { CheckCircle2, Circle, RefreshCw } from 'lucide-react';
import { Phone } from './shared';
import { api } from '@/lib/api';

interface Props {
  onDone:   () => void;
  onError:  () => void;
  platform: string;
  feedUrl:  string;
}

const SYNC_STEPS = [
  { label: 'Connecting to {platform}', sub: 'Establishing secure connection' },
  { label: 'Fetching calendar data',   sub: 'Downloading your events'        },
  { label: 'Importing assignments',    sub: 'Finding all assignments'         },
  { label: 'Importing exams & quizzes',sub: 'Finding exams and quizzes'      },
];

export default function CalScreen5({ onDone, onError, platform, feedUrl }: Props) {
  const [current, setCurrent] = useState(0);
  const [error,   setError]   = useState('');
  const calledRef = useRef(false);

  const platformName = platform === 'canvas' ? 'Canvas' : 'Blackboard';

  useEffect(() => {
    if (calledRef.current || !feedUrl) return;
    calledRef.current = true;

    const run = async () => {
      // Animate through steps while API call runs
      const stepInterval = setInterval(() => {
        setCurrent(prev => {
          if (prev < SYNC_STEPS.length - 1) return prev + 1;
          clearInterval(stepInterval);
          return prev;
        });
      }, 900);

      try {
        // Call real backend
        await api('/api/calendar/sync', {
          method: 'POST',
          body:   { ics_url: feedUrl, school: platform },
        });
        clearInterval(stepInterval);
        setCurrent(SYNC_STEPS.length); // all done
        setTimeout(() => onDone(), 600);
      } catch (e: unknown) {
        clearInterval(stepInterval);
        setError(e instanceof Error ? e.message : 'Sync failed');
        setTimeout(() => onError(), 1500);
      }
    };

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Phone>
      <div className="flex flex-col px-6 pt-6 pb-4 bg-white min-h-[520px]">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
            <RefreshCw className={`w-10 h-10 text-indigo-600 ${current < SYNC_STEPS.length ? 'animate-spin' : ''}`} />
          </div>
        </div>

        <h1 className="text-xl font-extrabold text-gray-900 mb-1 text-center">
          Syncing your calendar...
        </h1>
        <p className="text-xs text-gray-400 text-center mb-6">This may take a few seconds.</p>

        <div className="space-y-4 mb-6">
          {SYNC_STEPS.map((s, i) => {
            const label    = s.label.replace('{platform}', platformName);
            const isDone   = i < current;
            const isActive = i === current;
            return (
              <div key={s.label} className="flex items-center gap-3">
                {isDone
                  ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  : isActive
                    ? <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    : <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />}
                <div>
                  <p className={`text-sm font-semibold ${isDone ? 'text-gray-900' : isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-400">{s.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-xs">
            ❌ {error}
          </div>
        )}

        <div className="mt-auto bg-amber-50 border border-amber-100 rounded-2xl p-3 flex items-start gap-2">
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
