'use client';
import { useEffect, useState, useRef } from 'react';
import { CheckCircle2, Circle, AlertCircle, Shield, HelpCircle } from 'lucide-react';
import { Phone } from './shared';
import { api } from '@/lib/api';
import Image from 'next/image';

interface Props {
  onDone:   () => void;
  onError:  () => void;
  platform: string;
  feedUrl:  string;
}

const SYNC_STEPS = [
  { label: 'Connecting to {platform}', sub: 'Secure connection established' },
  { label: 'Fetching calendar data',   sub: 'Downloading your events'        },
  { label: 'Importing assignments',    sub: 'Finding all assignments'         },
  { label: 'Importing exams & quizzes',sub: 'Finding exams and quizzes'      },
];

export default function CalScreen5({ onDone, onError, platform, feedUrl }: Props) {
  const [current, setCurrent] = useState(0);
  const [error,   setError]   = useState('');
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const calledRef = useRef(false);

  const platformName = platform === 'canvas' ? 'Canvas' : 'Blackboard';

  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  useEffect(() => {
    if (calledRef.current || !feedUrl) return;
    calledRef.current = true;

    const run = async () => {
      // Initialize first timestamp
      setTimestamps([getTime()]);

      // Animate through steps while API call runs
      const stepInterval = setInterval(() => {
        setCurrent(prev => {
          const next = prev < SYNC_STEPS.length ? prev + 1 : prev;
          if (next > prev) {
            setTimestamps(ts => [...ts, getTime()]);
          }
          if (prev >= SYNC_STEPS.length - 1) {
            clearInterval(stepInterval);
          }
          return next;
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
        setError(e instanceof Error ? e.message : 'Unable to fetch calendar data');
        setCurrent(SYNC_STEPS.length);
      }
    };

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    setError('');
    setCurrent(0);
    setTimestamps([getTime()]);
    calledRef.current = false;
  };

  return (
    <Phone>
      <div className="flex flex-col mb-8  bg-white ">
        {/* Header with Icon */}
        <div className="flex justify-center">
         <Image
            src="
https://res.cloudinary.com/mview/image/upload/calscreen5page_afsgad.webp"
            alt="Calendar Syncing Illustration"
            width={300}
            height={180}
           
            priority
          />
        </div>

        {/* Title and Subtitle */}
        <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-2">
          Syncing your calendar
        </h1>
        <p className="text-sm text-gray-600 text-center mb-2">
          This helps us keep your schedule and deadlines up to date.
        </p>

        {/* Progress Steps */}
        <div className=" bg-white rounded-xl p-3 shadow border border-gray-100 mb-3">
          {SYNC_STEPS.map((s, i) => {
            const label    = s.label.replace('{platform}', platformName);
            const isDone   = i < current;
            const isActive = i === current;
            const isPending = i > current;

            return (
              <div key={s.label} className="flex gap-4">
                {/* Step Indicator */}
                <div className="flex flex-col items-center flex-shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : isActive ? (
                    <div className="w-6 h-6 border border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300" />
                  )}
                  {i < SYNC_STEPS.length - 1 && (
                    <div className={`w-0.5 h-12 ${isDone || isActive ? 'bg-indigo-400' : 'bg-gray-300'} my-1`} />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 ">
                  <p className={`text-sm font-bold ${isDone ? 'text-gray-900' : isActive ? 'text-indigo-600' : 'text-gray-600'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.sub}</p>
                </div>

                {/* Status Badge and Time */}
                <div className="flex flex-col items-end flex-shrink-0">
                  {isDone && (
                    <>
                      <span className="text-xs font-semibold text-green-600">Completed</span>
                      <p className="text-xs text-gray-500 mt-2">{timestamps[i]}</p>
                    </>
                  )}
                  {isActive && (
                    <>
                      <span className="text-xs font-semibold text-indigo-600">In progress</span>
                      <p className="text-xs text-gray-500 mt-2">{timestamps[i]}</p>
                    </>
                  )}
                  {isPending && (
                    <span className="text-xs font-semibold text-gray-500">Pending</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Section */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-900">{error}</p>
              <p className="text-xs text-red-700 mt-1">Please check your calendar URL and try again.</p>
            </div>
            <button
              onClick={handleRetry}
              className="flex-shrink-0 ml-2 px-3 py-1.5 border border-red-400 text-red-600 hover:bg-red-50 font-semibold text-xs rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Tip Section */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
          <span className="text-xl flex-shrink-0">❓</span>
          <div>
            <p className="text-sm font-bold text-gray-900">Tip</p>
            <p className="text-xs text-gray-600 mt-1">Keep this screen open while we sync your data.</p>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-gray-900">Your data is safe and secure</p>
            <p className="text-xs text-gray-600 mt-1">We only read your calendar information.</p>
          </div>
        </div>
      </div>
    </Phone>
  );
}
