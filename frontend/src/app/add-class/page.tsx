'use client';
/**
 * page.tsx — Orchestrator
 * Header : Atlas icon + Need Help?
 * Footer : segmented progress bar + step label + per-step action buttons
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, HelpCircle, ArrowRight } from 'lucide-react';

import { Step } from './components/types';

import Screen1  from './components/Screen1';
import Screen2  from './components/Screen2';
import Screen3  from './components/Screen3';
import Screen4  from './components/Screen4';
import Screen5  from './components/Screen5';
import Screen6  from './components/Screen6';
import Screen7  from './components/Screen7';
import Screen8  from './components/Screen8';
import Screen9  from './components/Screen9';
import Screen10 from './components/Screen10';
import Screen11 from './components/Screen11';

const TOTAL_STEPS = 11;

// Per-step footer button config
// left: null = no left button
type BtnCfg = { left: string | null; right: string | null };
const BUTTONS: Record<number, BtnCfg> = {
  1:  { left: null,           right: 'Add First Class'     },
  2:  { left: 'Back',         right: 'Confirm'             },
  3:  { left: 'Back',         right: 'Continue'            },
  4:  { left: null,            right: 'Continue'                  }, // AI parsing — no buttons
  5:  { left: 'Back',         right: 'Continue'            },
  6:  { left: null,           right: 'Everything Looks Good ✓' },
  7:  { left: 'Skip for now', right: 'Continue'            },
  8:  { left: null,           right: 'Yes, Add This Book'  },
  9:  { left: 'Skip for now', right: 'Save & Continue'     },
  10: { left: 'Add Another',  right: 'Continue →'          },
  11: { left: null,           right: 'Go to Dashboard'     },
};

export default function AddClassPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS) as Step);
  const back = () => {
    if (step === 1) { router.push('/classes'); return; }
    setStep(s => Math.max(s - 1, 1) as Step);
  };

  const handleLeft  = () => {
    if (step === 10) { setStep(2); return; } // "Add Another" resets to step 2
    back();
  };
  const handleRight = () => {
    if (step === 11) { router.push('/dashboard'); return; }
    next();
  };

  const btn = BUTTONS[step];

  const screens: Record<Step, React.ReactNode> = {
    1:  <Screen1  onNext={next} onBack={back} />,
    2:  <Screen2  onNext={next} onBack={back} />,
    3:  <Screen3  onNext={next} onBack={back} />,
    4:  <Screen4  onNext={next} onBack={back} />,
    5:  <Screen5  onNext={next} onBack={back} />,
    6:  <Screen6  onNext={next} onBack={back} />,
    7:  <Screen7  onNext={next} onBack={back} />,
    8:  <Screen8  onNext={next} onBack={back} />,
    9:  <Screen9  onNext={next} onBack={back} />,
    10: <Screen10 onNext={next} onBack={back} />,
    11: <Screen11 onAddAnother={() => setStep(2)} />,
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-gray-900 text-base">Atlas</span>
          </div>
          <a href="#" onClick={e => e.preventDefault()}
            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            <HelpCircle className="w-4 h-4" />
            Need Help?
          </a>
        </div>
      </header>

      {/* ── MAIN: screen content ── */}
      <main className="flex-1 flex flex-col pb-48">
        <div className="flex justify-center px-4 pt-6 pb-4">
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

          {/* Action buttons — hidden on processing steps (right === null) */}
          {btn.right !== null && (
            <div className="flex gap-3">

              {/* Left button */}
              {btn.left && (
                <button onClick={handleLeft}
                  className="flex-1 border-2 border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 font-bold py-3.5 rounded-2xl text-sm transition-all">
                  {btn.left}
                </button>
              )}

              {/* Right button */}
              <button onClick={handleRight}
                className={`${btn.left ? 'flex-1' : 'w-full'} bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2`}>
                {btn.right}
                {(step < 10 && step !== 6 && step !== 8) && (
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
