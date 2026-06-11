'use client';
// Step 3 — AI Parsing Progress (polls /parse-status every 3s)
import { useEffect, useState, useRef } from 'react';
import { FileText, CheckCircle2, Circle } from 'lucide-react';
import { Phone } from './shared';
import { api } from '@/lib/api';

interface Props {
  onNext:  () => void;
  onBack:  () => void;
  classId: string | null;
}

const STEPS_LABELS = [
  'Reading syllabus...',
  'Extracting course info...',
  'Analysing grade weights...',
  'Finding important dates...',
  'Mapping weekly topics...',
];

export default function Screen4({ onNext, classId }: Props) {
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState('Starting...');
  const [done,     setDone]     = useState(false);
  const [failed,   setFailed]   = useState('');

  // Use ref to prevent calling onNext multiple times
  const advancedRef = useRef(false);

  useEffect(() => {
    if (!classId) return;

    advancedRef.current = false; // reset on mount
    let interval: ReturnType<typeof setInterval>;

    const poll = async () => {
      try {
        const res = await api<{ status: string; progress: number; step: string }>(
          `/api/classes/${classId}/parse-status`
        );
        setProgress(res.progress || 0);
        setStepText(res.step || '');

        if (res.status === 'done' && !advancedRef.current) {
          advancedRef.current = true; // prevent double-advance
          clearInterval(interval);
          setDone(true);
          setTimeout(() => onNext(), 1000);
        } else if (res.status === 'failed') {
          clearInterval(interval);
          setFailed(res.step || 'Parsing failed. Please try again.');
        }
      } catch { /* keep polling */ }
    };

    // Poll immediately then every 3s
    poll();
    interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]); // only re-run when classId changes, NOT when onNext changes

  const filledSteps = Math.min(
    STEPS_LABELS.length,
    Math.floor((progress / 100) * STEPS_LABELS.length)
  );

  return (
    <Phone step={3} total={10}>
      <div className="flex flex-col min-h-[480px] px-6 py-5">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          Reading your syllabus...
        </h1>
        <p className="text-sm text-gray-400 mb-8">This usually takes 15–30 seconds.</p>

        {/* Circular progress */}
        <div className="flex justify-center mb-8">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#4F46E5" strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * progress) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {done
                ? <CheckCircle2 className="w-10 h-10 text-green-500" />
                : <FileText className="w-8 h-8 text-indigo-600" />}
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          {STEPS_LABELS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              {i < filledSteps
                ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                : <Circle       className="w-5 h-5 text-gray-300 flex-shrink-0" />}
              <span className={`text-sm ${i < filledSteps ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {s}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-indigo-600 font-semibold mt-4 text-center">
          {stepText}
        </p>

        {failed && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
            ❌ {failed}
          </div>
        )}
      </div>
    </Phone>
  );
}
