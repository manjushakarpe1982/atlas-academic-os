'use client';
/**
 * add-class/page.tsx — Orchestrator only.
 * All screen UI lives in ./components/Screen1.tsx ... Screen11.tsx
 * All mock data lives in ./components/mockData.ts
 * Shared components (Phone, ConfBadge) live in ./components/shared.tsx
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Step } from './components/types';
import Screen1 from './components/Screen1';
import Screen2 from './components/Screen2';
import Screen3 from './components/Screen3';
import Screen4 from './components/Screen4';
import Screen5 from './components/Screen5';
import Screen6 from './components/Screen6';
import Screen7 from './components/Screen7';
import Screen8 from './components/Screen8';
import Screen9 from './components/Screen9';
import Screen10 from './components/Screen10';
import Screen11 from './components/Screen11';
import { STEP_LABELS } from './components/mockData';



export default function AddClassPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  const next = () => setStep(s => Math.min(s + 1, 11) as Step);
  const back = () => {
    if (step === 1) { router.push('/classes'); return; }
    setStep(s => Math.max(s - 1, 1) as Step);
  };

  // Each screen receives only what it needs
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">

      {/* ── Top nav: step number pills ── */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={back} className="text-gray-400 hover:text-gray-700 p-1 flex-shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5 flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {STEP_LABELS.map((_, i) => (
            <button key={i} onClick={() => setStep((i + 1) as Step)}
              className={`flex-shrink-0 w-7 h-7 rounded-full text-xs font-extrabold transition-all ${
                step === i + 1
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ── Step label ── */}
      <div className="text-center pt-4 pb-2 px-4">
        <p className="text-sm font-bold text-gray-500">{STEP_LABELS[step - 1]}</p>
      </div>

      {/* ── Active screen ── */}
      <div className="flex justify-center px-4 pb-6 pt-2">
        {screens[step]}
      </div>

      {/* ── Bottom prev / next ── */}
      <div className="flex justify-center gap-4 pb-10">
        <button onClick={back} disabled={step === 1}
          className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-bold px-5 py-2.5 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={next} disabled={step === 11}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition-all">
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
