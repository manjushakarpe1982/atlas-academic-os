'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Check, Shield, HelpCircle, ChevronDown,
  ArrowLeft, ArrowRight,
} from 'lucide-react';
import { STEPS } from './constants';

interface Props {
  children: React.ReactNode;
  /** current step number 1–5 */
  step: number;
  /** disable the Continue button */
  disableNext?: boolean;
}

export default function OnboardingLayout({ children, step, disableNext }: Props) {
  const router    = useRouter();
  const [userName, setUserName] = useState('Student');

  useEffect(() => {
    const n = localStorage.getItem('atlas_full_name');
    if (n) setUserName(n.split(' ')[0]);
  }, []);

  const pct      = ((step - 1) / (STEPS.length - 1)) * 100;
  const prevHref = step > 1 ? STEPS[step - 2].href : null;
  const nextHref = step < 5 ? STEPS[step].href     : null;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(135deg,#f7f5ff 0%,#ffffff 50%,#f0fdf4 100%)' }}
    >
      {/* ── Sticky header ──────────────────────────────────────── */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-[#EEEDFE] h-14 flex items-center px-6 justify-between flex-shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/25">
            <span className="text-white font-extrabold text-sm">A</span>
          </div>
          <div>
            <p className="text-xs font-extrabold text-[#1A1A2E] leading-none tracking-wide">ATLAS</p>
            <p className="text-[9px] text-[#9B9AB5] font-medium">Academic OS</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="#"
            className="text-xs font-medium text-[#6B6A8A] hover:text-[#534AB7] flex items-center gap-1.5 transition-colors">
            <HelpCircle className="w-4 h-4" /> Need help?
          </a>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#534AB7] to-[#7B6FE8] flex items-center justify-center text-white text-xs font-extrabold shadow-sm">
              {userName[0]?.toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-[#1A1A2E]">{userName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9B9AB5]" />
          </div>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sticky sidebar */}
        <aside className="w-[260px] bg-white/60 backdrop-blur-xl border-r border-[#EEEDFE] flex flex-col p-5 flex-shrink-0 sticky top-14 h-[calc(100vh-56px)]">

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-extrabold text-[#1A1A2E] uppercase tracking-widest">Progress</span>
              <span className="text-[10px] font-bold text-[#9B9AB5]">{step} of {STEPS.length}</span>
            </div>
            <div className="h-2 bg-[#EEEDFE] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#534AB7] to-[#7B6FE8] rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Step list */}
          <div className="flex flex-col gap-1.5 flex-1">
            {STEPS.map((s) => {
              const done   = step > s.n;
              const active = step === s.n;
              return (
                <Link
                  key={s.n}
                  href={done ? s.href : '#'}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#534AB7] to-[#6B5FE8] shadow-lg shadow-[#534AB7]/20 cursor-default pointer-events-none'
                      : done
                      ? 'bg-[#f0effe] hover:bg-[#e8e5fd] cursor-pointer'
                      : 'hover:bg-white/60 cursor-default pointer-events-none'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    active ? 'bg-white/20' : done ? 'bg-[#534AB7]' : 'bg-[#f0effe] border-2 border-[#D5D3FD]'
                  }`}>
                    {done
                      ? <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                      : <s.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#9B9AB5]'}`} />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold leading-none mb-0.5 ${active ? 'text-white' : 'text-[#1A1A2E]'}`}>
                      {s.n}. {s.label}
                    </p>
                    <p className={`text-[10px] font-light truncate ${active ? 'text-white/65' : 'text-[#9B9AB5]'}`}>
                      {s.sub}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Security badge */}
          <div className="mt-4 bg-gradient-to-br from-[#f0effe] to-[#e8e5fd] border border-[#D5D3FD] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-lg bg-white/60 flex items-center justify-center">
                <Shield className="w-3 h-3 text-[#534AB7]" />
              </div>
              <span className="text-xs font-extrabold text-[#1A1A2E]">Your data is safe</span>
            </div>
            <p className="text-[11px] text-[#6B6A8A] font-light leading-relaxed">
              Enterprise-grade encryption. FERPA compliant. No ads. No data selling.
            </p>
          </div>
        </aside>

        {/* Main scrollable area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 p-8 flex flex-col max-w-8xl mx-auto w-full">

            {/* Step content */}
            {children}

            {/* Bottom nav — hidden on step 5 (has its own CTA) */}
            {step < 5 && (
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#EEEDFE] flex-shrink-0">

                {/* Back / Skip */}
                {prevHref ? (
                  <Link href={prevHref}
                    className="flex items-center gap-2 text-sm font-semibold text-[#6B6A8A] hover:text-[#534AB7] border border-[#e8e7f5] hover:border-[#534AB7]/30 px-5 py-2.5 rounded-xl hover:bg-[#f5f3ff] transition-all">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      if (confirm('Skip setup? You can complete it later.')) router.push('/home');
                    }}
                    className="text-sm font-medium text-[#9B9AB5] hover:text-[#534AB7] transition-colors">
                    Skip setup
                  </button>
                )}

                {/* Continue */}
                {nextHref && (
                  <Link
                    href={disableNext ? '#' : nextHref}
                    onClick={(e) => disableNext && e.preventDefault()}
                    className={`bg-gradient-to-r from-[#534AB7] to-[#6B5FE8] text-white font-extrabold px-8 py-3 rounded-2xl text-sm flex items-center gap-2 shadow-xl shadow-[#534AB7]/25 transition-all active:scale-95 ${
                      disableNext ? 'opacity-40 cursor-not-allowed' : 'hover:from-[#3C3489] hover:to-[#534AB7]'
                    }`}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
