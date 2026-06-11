'use client';
/**
 * add-class/page.tsx — Orchestrator only.
 * Header: Atlas icon (left) + "Need Help?" link (right)
 * Footer: progress bar + step label + Back/Next buttons
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Brain, HelpCircle } from 'lucide-react';

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

  const progressPct = Math.round((step / TOTAL_STEPS) * 100);

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

      {/* ── HEADER: Atlas icon left · "Need Help?" right ── */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left — Atlas logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-gray-900 text-base">Atlas</span>
          </div>

          {/* Right — Need Help? */}
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            onClick={e => e.preventDefault()}
          >
            <HelpCircle className="w-4 h-4" />
            Need Help?
          </a>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col">
        {/* Active screen */}
        <div className="flex justify-center px-4 pt-6 pb-4">
          {screens[step]}
        </div>
      </main>

      {/* ── FOOTER: progress bar + label + Back/Next ── */}
      <footer className="sticky bottom-0 z-10 bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-2xl mx-auto px-4 pt-3 pb-5">

          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-1">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs font-bold text-indigo-600 w-10 text-right flex-shrink-0">
              {step}/{TOTAL_STEPS}
            </span>
          </div>

          {/* Step label */}
          <p className="text-xs text-gray-400 font-medium mb-3 text-center">
            {STEP_LABELS[step - 1]}
          </p>

          {/* Back / Next buttons */}
          <div className="flex gap-3">
            <button
              onClick={back}
              className="flex items-center justify-center gap-2 flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-2xl text-sm hover:bg-gray-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 1 ? 'Exit' : 'Back'}
            </button>
            <button
              onClick={next}
              disabled={step === TOTAL_STEPS}
              className="flex items-center justify-center gap-2 flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold py-3 rounded-2xl text-sm shadow-md transition-all"
            >
              {step === TOTAL_STEPS ? 'Done' : 'Next'}
              {step < TOTAL_STEPS && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
