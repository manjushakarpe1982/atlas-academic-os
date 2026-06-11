'use client';
/**
 * add-class/page.tsx — Orchestrator only.
 *
 * Header : Atlas icon (left) + Need Help? (right)
 * Footer : segmented progress bar + step label ONLY
 *          — each screen handles its own action buttons internally
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, HelpCircle } from 'lucide-react';

import { Step } from './components/types';
import { STEP_LABELS } from './components/mockData';

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

export default function AddClassPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS) as Step);
  const back = () => {
    if (step === 1) { router.push('/classes'); return; }
    setStep(s => Math.max(s - 1, 1) as Step);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
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

      {/* ── MAIN: active screen ── */}
      <main className="flex-1 flex flex-col">
        <div className="flex justify-center px-4 pt-6 pb-4">
          {screens[step]}
        </div>
      </main>

      {/* ── FOOTER: segmented progress bar + label only ──
           Action buttons live inside each Screen component  */}
      <footer className="sticky bottom-0 z-10 bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-2xl mx-auto px-4 pt-3 pb-4">

          {/* Segmented progress bar */}
          <div className="flex items-center gap-1.5 mb-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  i < step ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step label */}
          <p className="text-xs text-gray-400 text-center">
            {STEP_LABELS[step - 1]}
          </p>

        </div>
      </footer>

    </div>
  );
}
