'use client';
/**
 * page.tsx — Add Class orchestrator
 *
 * Steps (9 total — Screen2 and Screen6 removed):
 *  1  Intro + class name input
 *  2  Upload syllabus
 *  3  AI Parsing (no buttons)
 *  4  Review course info + grade weights
 *  5  Textbook (combined with old Screen 6)
 *  6  Enter grades
 *  7  Success
 *  8  Your classes list
 *  9  (Skipped - now at 8)
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, HelpCircle, ArrowRight } from 'lucide-react';
import { api, API_BASE, getToken } from '@/lib/api';

import Screen1  from './components/Screen1';
import Screen3  from './components/Screen3';
import Screen4  from './components/Screen4';
import Screen5  from './components/Screen5';
import Screen7  from './components/Screen7';
import Screen8  from './components/Screen8';
import Screen9  from './components/Screen9';
import Screen10 from './components/Screen10';
import Screen11 from './components/Screen11';
import Link from 'next/link';
import AppHeader from '../_components/AppHeader';

const TOTAL_STEPS = 9;

type BtnCfg = { left: string | null; right: string | null };
const BUTTONS: Record<number, BtnCfg> = {
  1:  { left: null,           right: 'Continue'                },
  2:  { left: 'Back',         right: 'Continue'                },
  3:  { left: null,           right: null                      }, // AI parsing — no buttons
  4:  { left: 'Back',         right: 'Continue'                },
  5:  { left: null,           right: 'Everything Looks Good ✓' },
  6:  { left: null,           right: 'Yes, Add This Book'      },
  7:  { left: 'Skip for now', right: 'Save & Continue'         },
  8:  { left: 'Skip',         right: 'Go to Dashboard'         },

};

// Steps that cannot be skipped (must go through normally)
const BLOCKING_STEPS = [3]; // AI parsing auto-advances

export default function AddClassPage() {
  const router = useRouter();

  // Lifted state — shared across screens
  const [step,      setStep]      = useState(1);
  const [className, setClassName] = useState('');
  const [classId,   setClassId]   = useState<string | null>(null);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  
  const back = () => {
    if (step === 1) { router.push('/classes'); return; }
    setStep(s => Math.max(s - 1, 1));
  };

  // Navigate to specific step via progress bar click
  const goToStep = (targetStep: number) => {
    // Cannot skip blocking steps
    if (BLOCKING_STEPS.includes(targetStep)) {
      return; // Ignore click on auto-advancing steps
    }

    // Can only go back or stay at current step
    if (targetStep >= step) {
      return; // Cannot skip ahead
    }

    // Going back to step 1 resets form
    if (targetStep === 1) {
      setClassName('');
      setClassId(null);
    }

    setStep(targetStep);
  };

  // ── Right button handler — API calls happen here ──────────────────────
  const handleRight = async () => {
    setError('');

    // Step 1 → Create class in DB, then go to upload
    if (step === 1) {
      if (!className.trim()) { setError('Please enter a class name.'); return; }
      setLoading(true);
      try {
        const cls = await api<{ id: string }>('/api/classes', {
          method: 'POST',
          body:   { name: className.trim(), term: 'Fall 2026' },
        });
        setClassId(cls.id);
        next();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to create class');
      } finally { setLoading(false); }
      return;
    }

    // Step 9 → Add Another class (reset)
    if (step === 9) {
      setStep(1);
      setClassName('');
      setClassId(null);
      return;
    }

    // Step 10 → Go to dashboard
    if (step === 10) {
      router.push('/dashboard');
      return;
    }

    next();
  };

  const handleLeft = () => {
    if (step === 9) { setStep(1); setClassName(''); setClassId(null); return; }
    back();
  };

  const btn = BUTTONS[step];

  // Map step numbers to screen components
  // Removed Screen6 — its data is now in Screen5
  const screens: Record<number, React.ReactNode> = {
    1:  <Screen1  onNext={next} onBack={back} className={className} setClassName={setClassName} />,
    2:  <Screen3  onNext={next} onBack={back} classId={classId} />,
    3:  <Screen4  onNext={next} onBack={back} classId={classId} />,
    4:  <Screen5  onNext={next} onBack={back} classId={classId} />,
    5:  <Screen7  onNext={next} onBack={back} />,
    6:  <Screen8  onNext={next} onBack={back} />,
    7:  <Screen9  onNext={next} onBack={back} classId={classId} />,
    8:  <Screen10 onNext={next} onBack={back} />,
    9:  <Screen11 onAddAnother={() => { setStep(1); setClassName(''); setClassId(null); }} />,
  };

  return (
    <div className=" flex flex-col">

      {/* ── HEADER ── */}
      <AppHeader right="both" />

      {/* ── SCREEN ── */}
      <main className="flex-1 flex flex-col ">
        {error && (
          <div className="max-w-2xl mx-auto w-full px-4 pt-3">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm font-medium">
              ❌ {error}
            </div>
          </div>
        )}
        <div className="flex justify-center px-4 pt-4 pb-4">
          {screens[step]}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-2xl mx-auto px-4 pt-3 pb-5">

          {/* Clickable progress bar */}
          <div className="flex items-center gap-1.5 mb-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
              const stepNum = i + 1;
              const isCompleted = i < step;
              const isCurrent = i === step - 1;
              const canClick = stepNum < step && !BLOCKING_STEPS.includes(stepNum);

              return (
                <button
                  key={i}
                  onClick={() => goToStep(stepNum)}
                  disabled={!canClick}
                  title={
                    canClick
                      ? `Go back to step ${stepNum}`
                      : isCurrent
                        ? `Current step ${stepNum}`
                        : BLOCKING_STEPS.includes(stepNum)
                          ? 'Cannot skip this step'
                          : 'Cannot skip ahead'
                  }
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-indigo-600 cursor-pointer hover:bg-indigo-700'
                      : isCurrent
                        ? 'bg-indigo-400 cursor-default'
                        : 'bg-gray-200 cursor-not-allowed'
                  }`}
                />
              );
            })}
          </div>

          {/* Step number */}
          <p className="text-xs font-bold text-gray-400 text-center mb-3">
            {step} / {TOTAL_STEPS}
          </p>

          {/* Buttons */}
          {btn.right !== null && (
            <div className="flex gap-3">
              {btn.left && (
                <button onClick={handleLeft}
                  className="flex-1 border-2 border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 font-bold py-3.5 rounded-2xl text-sm transition-all">
                  {btn.left}
                </button>
              )}
              <button onClick={handleRight} disabled={loading}
                className={`${btn.left ? 'flex-1' : 'w-full'} bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2`}>
                {loading ? 'Please wait...' : btn.right}
                {!loading && step < 9 && step !== 5 && step !== 7 && (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>
          )}

        </div>
      </footer>

    </div>
  );
}
