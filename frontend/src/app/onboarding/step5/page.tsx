'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight } from 'lucide-react';
import OnboardingLayout from '../_components/OnboardingLayout';

export default function Step5Page() {
  const router = useRouter();
  const [name, setName] = useState('Jordan');

  useEffect(() => {
    const n = localStorage.getItem('atlas_full_name');
    if (n) setName(n.split(' ')[0]);
  }, []);

  return (
    <OnboardingLayout step={5}>
      <div className="flex-1 flex flex-col items-center justify-center text-center py-4">

        {/* Animated success ring */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#534AB7] to-[#7B6FE8] flex items-center justify-center shadow-2xl shadow-[#534AB7]/30">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-[#534AB7]/20 animate-ping" />
        </div>

        <h1 className="text-3xl font-extrabold text-[#1A1A2E] mb-2">
          You&apos;re all set, {name}! 🎉
        </h1>
        <p className="text-[#6B6A8A] max-w-sm font-light mb-8 leading-relaxed text-sm">
          Your personalised Atlas workspace is ready. Your AI study companion has mapped your
          goals and built your first study plan.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8 w-full max-w-lg">
          {[
            { n:'4',  l:'Classes ready',    bg:'bg-indigo-50',  text:'text-indigo-600' },
            { n:'47', l:'Deadlines mapped', bg:'bg-green-50',   text:'text-green-600'  },
            { n:'18', l:'Topics detected',  bg:'bg-blue-50',    text:'text-blue-600'   },
            { n:'2',  l:'Exams this month', bg:'bg-orange-50',  text:'text-orange-500' },
          ].map((s) => (
            <div key={s.l}
              className={`${s.bg} rounded-2xl p-3.5 text-center border border-white shadow-sm`}>
              <p className={`text-2xl font-extrabold ${s.text}`}>{s.n}</p>
              <p className="text-[10px] font-medium text-[#9B9AB5] mt-0.5 leading-tight">{s.l}</p>
            </div>
          ))}
        </div>

        {/* First plan preview */}
        <div className="bg-white border border-[#e8e7f5] rounded-2xl p-5 max-w-sm w-full mb-8 text-left shadow-md shadow-[#534AB7]/5">
          <p className="text-[10px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-3">
            Your first study plan — today
          </p>

          {/* Hero task */}
          <div className="bg-[#f0effe] border border-[#c4bbff]/50 rounded-xl p-3.5 mb-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-extrabold text-[#534AB7] uppercase tracking-widest">
                Biology 101
              </span>
              <span className="text-[10px] text-[#9B9AB5]">45 min</span>
            </div>
            <p className="text-sm font-extrabold text-[#1A1A2E]">Review Mitosis</p>
            <p className="text-[11px] text-[#6B6A8A] mt-0.5">
              Exam Thursday · weakest topic · on review sheet
            </p>
          </div>

          {/* Other tasks */}
          {[
            { c:'Statistics', t:'Problem set #4',  m:'40m' },
            { c:'English',    t:'Essay 2 outline', m:'20m' },
            { c:'History',    t:'Skim chapter 7',  m:'15m' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-t border-[#f0effe]">
              <div className="w-5 h-5 rounded-full border-2 border-[#e8e7f5] flex items-center justify-center text-[9px] text-[#9B9AB5] font-bold flex-shrink-0">
                {i + 2}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1A1A2E] truncate">
                  {r.c} — {r.t}
                </p>
              </div>
              <span className="text-[10px] text-[#9B9AB5] flex-shrink-0">{r.m}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push('/home')}
          className="bg-[#534AB7] hover:bg-[#3C3489] text-white font-extrabold px-10 py-4 rounded-2xl text-base flex items-center gap-2.5 mx-auto shadow-xl shadow-[#534AB7]/25 transition-all active:scale-95">
          Go to my Dashboard <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-xs text-[#9B9AB5] mt-4 font-light">
          You can upload files, add grades, and adjust your schedule any time in Settings.
        </p>
      </div>
    </OnboardingLayout>
  );
}
