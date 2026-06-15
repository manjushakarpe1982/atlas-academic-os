'use client';

/**
 * page.tsx — Add Class orchestrator
 *
 * Steps 1–9 in proper sequence:
 *  1  Intro + class name input
 *  2  Upload syllabus
 *  3  AI Parsing (no buttons)
 *  4  Review course info + grade weights
 *  5  Important dates + topics
 *  6  Add textbook
 *  7  Textbook found
 *  8  Enter grades
 *  9  Success
 *  10 Your classes list
 */
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import { api, API_BASE, getToken } from '@/lib/api';

import Screen1 from './components/Screen1';
import Screen2 from './components/Screen2';
import Screen3 from './components/Screen3';
import Screen4 from './components/Screen4';
import Screen5 from './components/Screen5';
import Screen6 from './components/Screen6';
import Screen7, { Screen7Handle } from './components/Screen7';
import Screen8 from './components/Screen8';
import Screen9 from './components/Screen9';
import AppHeader from '../_components/AppHeader';

const TOTAL_STEPS = 9;

type BtnCfg = { left: string | null; right: string | null };
const BUTTONS: Record<number, BtnCfg> = {
  1:  { left: null,           right: 'Continue'                },
  2:  { left: 'Back',         right: 'Continue'                },
  3:  { left: null,           right: null                      }, // AI parsing — no buttons
  4:  { left: 'Back',         right: 'Everything Looks Good ✓' },
  5:  { left: 'Skip for now', right: 'Continue'                },
  6:  { left: null,           right: 'Yes, Add This Book'      },
  7:  { left: 'Skip for now', right: 'Save & Continue'         },
  8:  { left: null,           right: 'Continue'                },
  9:  { left: 'Go to Dashboard', right: 'Continue →'             } };

export default function AddClassPage() {
  const router = useRouter();

  // Lifted state — shared across screens
  const [step,      setStep]      = useState(1);
  const [className, setClassName] = useState('');
  const [classId,   setClassId]   = useState<string | null>(null);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const screen7Ref = useRef<Screen7Handle>(null);

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const back = () => {
    if (step === 1) { router.push('/classes'); return; }
    setStep(s => Math.max(s - 1, 1));
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
          body:   { name: className.trim(), term: 'Fall 2026' } });
        setClassId(cls.id);
        next();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to create class');
      } finally { setLoading(false); }
      return;
    }

    // Step 7 right = "Save & Continue" → save grades first
    if (step === 7) {
      screen7Ref.current?.saveAndContinue();
      return;
    }

    // Step 8 right = "Continue" → go to Screen9 (classes list)
    // Step 9 right = "Continue →" → go to /calendar
    if (step === 9) {
      router.push('/calendar');
      return;
    }

    next();
  };

  const handleLeft = () => {
    if (step === 5) { setStep(7); return; }              // Skip textbook → jump to grades
    if (step === 9) { router.push('/dashboard'); return; }  // Go to Dashboard
    back();
  };

  const btn = BUTTONS[step];

  // Map step numbers to screen components
  const screens: Record<number, React.ReactNode> = {
    1: <Screen1 onNext={next} onBack={back} className={className} setClassName={setClassName} />,
    2: <Screen2 onNext={next} onBack={back} classId={classId} />,
    3: <Screen3 onNext={next} onBack={back} classId={classId} />,
    4: <Screen4 onNext={next} onBack={back} classId={classId} />,
    5: <Screen5 onNext={next} onBack={back} />,
    6: <Screen6 onNext={next} onBack={back} />,
    7: <Screen7 ref={screen7Ref} onNext={next} onBack={back} classId={classId} />,
    8: <Screen8 onNext={next} onBack={back} classId={classId} />,
    9: <Screen9 onAddAnother={() => { setStep(1); setClassName(''); setClassId(null); }} /> };

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── HEADER ── */}
      <AppHeader right="both" />

      {/* ── SCREEN ── */}
      <main className="flex-1 flex flex-col pb-48">
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

          {/* Segmented progress bar */}
          <div className="flex items-center gap-1.5 mb-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  i < step ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              />
            ))}
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
