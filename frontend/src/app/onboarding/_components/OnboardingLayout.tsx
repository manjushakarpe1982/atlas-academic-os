'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Check, Shield, HelpCircle, ChevronDown,
  ArrowLeft, ArrowRight, LayoutDashboard,
  AlertTriangle, X,
} from 'lucide-react';
import { STEPS } from './constants';

interface Props {
  children: React.ReactNode;
  step: number;
  disableNext?: boolean;
}

/* ─── Skip setup modal ───────────────────────────────────────── */
function SkipModal({ onClose, onDashboard }: {
  onClose: () => void;
  onDashboard: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="relative bg-white rounded-[28px] shadow-2xl w-full max-w-md overflow-hidden">
        {/* Top colour strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#534AB7] to-[#7B6FE8]" />

        <div className="p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-5">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
          </div>

          <h2 className="text-2xl font-extrabold text-[#1A1A2E] mb-2">
            Skip setup?
          </h2>
          <p className="text-sm text-[#6B6A8A] font-light leading-relaxed mb-6">
            You can always complete your profile later in <strong className="text-[#534AB7] font-semibold">Settings</strong>.
            Without setup, Atlas will use default preferences — your plan will be
            less personalised until you finish.
          </p>

          {/* What you'll miss */}
          <div className="bg-[#F8F7FF] border border-[#E8E5FD] rounded-2xl p-4 mb-6">
            <p className="text-[11px] font-extrabold text-[#534AB7] uppercase tracking-widest mb-3">
              What you&apos;ll miss
            </p>
            <ul className="space-y-2">
              {[
                'Personalised study plan based on your goals',
                'AI study guides calibrated to your field',
                'Sleep & schedule conflict detection',
                'Accurate grade predictions for your courses',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[9px] text-amber-600 font-bold">!</span>
                  </div>
                  <span className="text-[12px] text-[#6B6A8A]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border-2 border-[#E8E5FD] hover:border-[#534AB7]/40 text-[#6B6A8A] hover:text-[#534AB7] font-semibold py-3 rounded-2xl text-sm transition-all hover:bg-[#F8F7FF]"
            >
              Continue setup
            </button>
            <button
              onClick={onDashboard}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#534AB7] to-[#6B5FE8] hover:from-[#3C3489] hover:to-[#534AB7] text-white font-bold py-3 rounded-2xl text-sm transition-all shadow-lg shadow-[#534AB7]/20"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingLayout({ children, step, disableNext }: Props) {
  const router = useRouter();
  const [userName,   setUserName]   = useState('Student');
  const [showSkip,   setShowSkip]   = useState(false);

  useEffect(() => {
    const n = localStorage.getItem('atlas_full_name');
    if (n) setUserName(n.split(' ')[0]);
  }, []);

  const pct      = ((step - 1) / (STEPS.length - 1)) * 100;
  const prevHref = step > 1 ? STEPS[step - 2].href : null;
  const nextHref = step < 5 ? STEPS[step].href     : null;

  return (
    <>
      {/* Skip modal */}
      {showSkip && (
        <SkipModal
          onClose={() => setShowSkip(false)}
          onDashboard={() => router.push('/home')}
        />
      )}

      {/* Full-screen wrapper — no scroll on body */}
      <div
        className="h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#f7f5ff 0%,#ffffff 50%,#f0fdf4 100%)' }}
      >
        {/* ── Sticky top header ──────────────────────────────── */}
        <header className="h-14 flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-[#EEEDFE] flex items-center px-6 justify-between z-40">
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
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#534AB7] to-[#7B6FE8] flex items-center justify-center text-white text-xs font-extrabold shadow-sm">
                {userName[0]?.toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-[#1A1A2E]">{userName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#9B9AB5]" />
            </div>
          </div>
        </header>

        {/* ── Main row — sidebar + content ────────────────────── */}
        <div className="flex flex-1 min-h-0">

          {/* ── Sidebar — sticky, fixed height ────────────────── */}
          <aside className="w-[240px] flex-shrink-0 flex flex-col bg-white/60 backdrop-blur-xl border-r border-[#EEEDFE] p-5 overflow-y-auto">

            {/* Progress bar */}
            <div className="mb-5 flex-shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold text-[#1A1A2E] uppercase tracking-widest">
                  Progress
                </span>
                <span className="text-[10px] font-bold text-[#9B9AB5]">
                  {step} of {STEPS.length}
                </span>
              </div>
              <div className="h-1.5 bg-[#EEEDFE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#534AB7] to-[#7B6FE8] rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Step list */}
            <div className="flex flex-col gap-1 flex-1">
              {STEPS.map((s) => {
                const done   = step > s.n;
                const active = step === s.n;
                return (
                  <Link
                    key={s.n}
                    href={done ? s.href : '#'}
                    onClick={(e) => !done && e.preventDefault()}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all ${
                      active
                        ? 'bg-gradient-to-r from-[#534AB7] to-[#6B5FE8] shadow-md shadow-[#534AB7]/20'
                        : done
                        ? 'bg-[#f0effe] hover:bg-[#e8e5fd]'
                        : 'opacity-60'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      active ? 'bg-white/20' : done ? 'bg-[#534AB7]' : 'bg-[#f0effe] border-2 border-[#D5D3FD]'
                    }`}>
                      {done
                        ? <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                        : <s.icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#9B9AB5]'}`} />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[11px] font-bold leading-none mb-0.5 ${active ? 'text-white' : 'text-[#1A1A2E]'}`}>
                        {s.n}. {s.label}
                      </p>
                      <p className={`text-[10px] truncate ${active ? 'text-white/60' : 'text-[#9B9AB5]'}`}>
                        {s.sub}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Security badge */}
            <div className="mt-4 flex-shrink-0 bg-gradient-to-br from-[#f0effe] to-[#e8e5fd] border border-[#D5D3FD] rounded-2xl p-3.5">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-3.5 h-3.5 text-[#534AB7] flex-shrink-0" />
                <span className="text-[11px] font-extrabold text-[#1A1A2E]">Your data is safe</span>
              </div>
              <p className="text-[10px] text-[#6B6A8A] font-light leading-relaxed">
                Enterprise-grade encryption. FERPA compliant. No ads. No data selling.
              </p>
            </div>
          </aside>

          {/* ── Right: scrollable content + sticky footer ───────── */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">

            {/* Scrollable step content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 lg:p-8">
                {children}
              </div>
            </div>

            {/* ── Sticky bottom nav ──────────────────────────── */}
            {step < 5 && (
              <div className="flex-shrink-0 border-t border-[#EEEDFE] bg-white/80 backdrop-blur-xl px-8 py-4 flex items-center justify-between">
                {/* Left — Back or Skip */}
                {prevHref ? (
                  <Link
                    href={prevHref}
                    className="flex items-center gap-2 text-sm font-semibold text-[#6B6A8A] hover:text-[#534AB7] border border-[#e8e7f5] hover:border-[#534AB7]/30 px-5 py-2.5 rounded-xl hover:bg-[#f5f3ff] transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Link>
                ) : (
                  <button
                    onClick={() => setShowSkip(true)}
                    className="text-sm font-medium text-[#9B9AB5] hover:text-[#534AB7] transition-colors underline-offset-2 hover:underline"
                  >
                    Skip setup
                  </button>
                )}

                {/* Right — Continue */}
                {nextHref && (
                  <Link
                    href={disableNext ? '#' : nextHref}
                    onClick={(e) => disableNext && e.preventDefault()}
                    className={`flex items-center gap-2 font-extrabold px-8 py-3 rounded-2xl text-sm shadow-xl transition-all active:scale-95 ${
                      disableNext
                        ? 'bg-[#534AB7]/30 text-white/60 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#534AB7] to-[#6B5FE8] hover:from-[#3C3489] hover:to-[#534AB7] text-white shadow-[#534AB7]/25'
                    }`}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
