'use client';
/**
 * calendar/page.tsx
 * Header : Atlas icon + Need Help?
 * Footer : progress bar (steps 1–6) + per-screen action buttons
 * All buttons live here — screens contain only content
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, HelpCircle, ArrowLeft, ArrowRight, Shield } from 'lucide-react';

import CalScreen1 from './components/CalScreen1';
import CalScreen2 from './components/CalScreen2';
import CalScreen3 from './components/CalScreen3';
import CalScreen4 from './components/CalScreen4';
import CalScreen5 from './components/CalScreen5';
import CalScreen6 from './components/CalScreen6';
import CalScreen7 from './components/CalScreen7';
import CalScreen8 from './components/CalScreen8';

type CalStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// Per-step button config
// left: null = no left button | right: null = no buttons at all (auto-advance screens)
type BtnCfg = {
  left:  string | null;
  right: string | null;
  leftAction?:  string;
  rightAction?: string;
};

const BUTTONS: Record<number, BtnCfg> = {
  1: { left: 'Skip for now',          right: 'Connect Calendar'    },
  2: { left: 'Back',                  right: 'Continue'            },
  3: { left: 'Back',                  right: 'Continue'            },
  4: { left: 'Back',                  right: "I've copied the URL" },
  5: { left: null,                    right: null                  }, // auto-advance
  6: { left: null,                    right: 'Continue to Dashboard' },
  7: { left: 'Connect Calendar Later', right: 'Go to Dashboard'   },
  8: { left: 'Go Back',               right: 'Try Again'          },
};

export default function CalendarPage() {
  const router = useRouter();
  const [step,     setStep]     = useState<CalStep>(1);
  const [platform, setPlatform] = useState('canvas');
  const [feedUrl,  setFeedUrl]  = useState('');

  const go = (s: CalStep) => setStep(s);

  const handleRight = () => {
    if (step === 1) { go(2); return; }
    if (step === 2) { go(3); return; }
    if (step === 3) { if (feedUrl.trim()) go(5); return; }
    if (step === 4) { go(3); return; }          // "I've copied" → back to paste URL
    if (step === 6) { router.push('/dashboard'); return; }
    if (step === 7) { router.push('/dashboard'); return; }
    if (step === 8) { go(3); return; }           // Try Again → back to URL screen
  };

  const handleLeft = () => {
    if (step === 1) { router.push('/dashboard'); return; }  // Skip → dashboard
    if (step === 2) { go(1); return; }
    if (step === 3) { go(2); return; }
    if (step === 4) { go(3); return; }
    if (step === 7) { go(2); return; }           // "Connect Calendar Later" → back to platform
    if (step === 8) { go(2); return; }           // "Go Back" → back to platform
  };

  const btn = BUTTONS[step];
  const showProgress = step <= 6;

  return (
    <div className="">

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

      {/* ── SCREEN CONTENT ── */}
      <main className="flex-1 flex justify-center items-start px-4 pt-6 pb-48">
        {step === 1 && <CalScreen1 onNext={() => go(2)} onSkip={() => go(7)} />}
        {step === 2 && (
          <CalScreen2
            onNext={(p) => { setPlatform(p); go(3); }}
            onBack={() => go(1)}
            onNotSure={() => go(7)}
            onSelect={setPlatform}
            selected={platform}
          />
        )}
        {step === 3 && (
          <CalScreen3
            onNext={(url) => { setFeedUrl(url); go(5); }}
            onBack={() => go(2)}
            onHowTo={() => go(4)}
            platform={platform}
            url={feedUrl}
            setUrl={setFeedUrl}
          />
        )}
        {step === 4 && <CalScreen4 onBack={() => go(3)} onDone={() => go(3)} platform={platform} />}
        {step === 5 && <CalScreen5 onDone={() => go(6)} onError={() => go(8)} platform={platform} feedUrl={feedUrl} />}
        {step === 6 && <CalScreen6 onNext={() => router.push('/dashboard')} />}
        {step === 7 && <CalScreen7 onDashboard={() => router.push('/dashboard')} onConnect={() => go(2)} />}
        {step === 8 && <CalScreen8 onRetry={() => go(3)} onBack={() => go(2)} />}
      </main>

      {/* ── FOOTER ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-2xl mx-auto px-4 pt-3 pb-5">

          {/* Segmented progress bar — only steps 1–6 */}
          {showProgress && (
            <>
              <div className="flex items-center gap-1.5 mb-1.5">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= step ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-gray-400 text-center mb-3">
                {step} / 6
              </p>
            </>
          )}

          {/* Buttons — hidden when null (auto-advance screens like step 5) */}
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
                disabled={step === 3 && !feedUrl.trim()}
                className={`${btn.left ? 'flex-1' : 'w-full'} bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2`}>
                {btn.right}
                {(step === 1 || step === 2 || step === 3) && <ArrowRight className="w-4 h-4" />}
              </button>

            </div>
          )}

          {/* Step 3 — security note below buttons */}
          {step === 3 && (
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <Shield className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-400">Secure &amp; private</p>
            </div>
          )}

        </div>
      </footer>

    </div>
  );
}
