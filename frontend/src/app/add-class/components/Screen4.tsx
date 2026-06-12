'use client';
// Step 3 — AI Parsing Progress
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { CheckCircle2, Shield } from 'lucide-react';
import { Phone } from './shared';
import { api } from '@/lib/api';

interface Props {
  onNext:  () => void;
  onBack:  () => void;
  classId: string | null;
}

const PARSE_STEPS = [
  { icon: '📄', label: 'Reading syllabus...',       sub: 'Scanning all pages and content'              },
  { icon: '🏷️', label: 'Extracting course info...', sub: 'Finding course name, code, and description'  },
  { icon: '⚖️', label: 'Analysing grade weights...', sub: 'Identifying assignments and their impact'   },
  { icon: '📅', label: 'Finding important dates...', sub: 'Extracting deadlines, exams, and milestones' },
  { icon: '📚', label: 'Mapping weekly topics...',   sub: 'Organizing topics and building your study plan' },
];

export default function Screen4({ onNext, classId }: Props) {
  const [progress,  setProgress]  = useState(0);
  const [stepText,  setStepText]  = useState('AI is analyzing your syllabus');
  const [current,   setCurrent]   = useState(0);
  const [failed,    setFailed]    = useState('');
  const advancedRef = useRef(false);

  useEffect(() => {
    if (!classId) return;
    advancedRef.current = false;
    let interval: ReturnType<typeof setInterval>;

    const poll = async () => {
      try {
        const res = await api<{ status: string; progress: number; step: string }>(
          `/api/classes/${classId}/parse-status`
        );
        const pct = res.progress || 0;
        setProgress(pct);
        setStepText(res.step || 'AI is analyzing your syllabus');
        setCurrent(Math.min(PARSE_STEPS.length - 1, Math.floor((pct / 100) * PARSE_STEPS.length)));

        if (res.status === 'done' && !advancedRef.current) {
          advancedRef.current = true;
          clearInterval(interval);
          setProgress(100);
          setCurrent(PARSE_STEPS.length);
          setTimeout(() => onNext(), 800);
        } else if (res.status === 'failed') {
          clearInterval(interval);
          setFailed(res.step || 'Parsing failed. Please try again.');
        }
      } catch { /* keep polling */ }
    };

    poll();
    interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  return (
    <Phone>
      <div className="flex flex-col bg-white ">

        {/* ── Header row ── */}
        <div className="flex items-start justify-between  pt-1 pb-3">
          <div className="flex-1 pr-3">
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-0.5">Reading your</h1>
            <h1 className="text-2xl font-extrabold text-indigo-600 leading-tight mb-2">syllabus...</h1>
            <p className="text-sm text-gray-500">
              This usually takes <span className="font-bold text-gray-700">15–30 seconds.</span>
            </p>
          </div>
          {/* Robot image */}
          <div className="relative flex-shrink-0">
            <span className="absolute -top-1 -left-2 text-indigo-200 text-xs">✦</span>
            <Image
              src="https://res.cloudinary.com/mview/image/upload/atlas/addclasspage4.webp"
              alt="AI Robot"
              width={100}
              height={100}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* ── Progress bar card ── */}
        <div className="mt-3 mb-4">
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">✨</span>
                <p className="text-[13px] font-semibold text-gray-700">{stepText}</p>
              </div>
              <span className="text-[13px] font-extrabold text-indigo-600">{progress}%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Steps list ── */}
        <div className=" flex-1">
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-2 top-5 bottom-5 w-0.5 bg-gray-100" />

            <div className="space-y-4 bg-white border p-4 rounded-xl border-gray-200">
              {PARSE_STEPS.map((s, i) => {
                const isDone   = i < current;
                const isActive = i === current;
                const isPending = i > current;

                return (
                  <div key={s.label} className="flex items-start gap-5  relative">
                    {/* Step icon circle */}
                    <div className={`relative z-10 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      isDone   ? 'bg-indigo-600'  :
                      isActive ? 'bg-indigo-100 border-2 border-indigo-400' :
                      'bg-gray-100'
                    }`}>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : isActive ? (
                        <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="text-sm opacity-50">{s.icon}</span>
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 pt-1">
                      <p className={`text-sm font-bold leading-tight ${
                        isDone ? 'text-indigo-600' : isActive ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {s.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${isDone || isActive ? 'text-gray-400' : 'text-gray-300'}`}>
                        {s.sub}
                      </p>
                    </div>

                    {/* Active spinner indicator */}
                    {isActive && (
                      <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Error ── */}
        {failed && (
          <div className="mx-5 mb-3 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-xs">
            ❌ {failed}
          </div>
        )}

        {/* ── Privacy footer ── */}
        <div className=" mb-4 mt-3">
          <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Your data is safe with us</p>
                <p className="text-xs text-gray-400">We never share your syllabus or personal data.</p>
              </div>
            </div>
            {/* <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div> */}
          </div>
        </div>

      </div>
    </Phone>
  );
}
