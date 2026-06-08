'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import {
  CheckCircle2, TrendingUp, ChevronRight,
  ArrowRight, Star, Brain, Clock,
  Target, Flame, Sparkles, BarChart2,
} from 'lucide-react';

const IMPROVED = [
  { topic:'Cell Division — Mitosis', before:28, after:40 },
  { topic:'Phase definitions',       before:30, after:45 },
];

const NEXT_TASKS = [
  { rank:1, topic:'Review DNA Replication', class:'Biology 101',    duration:40, note:'Still weak — 40% mastery', dot:'bg-indigo-500' },
  { rank:2, topic:'Study Genetics Basics',  class:'Biology 101',    duration:45, note:'Exam prep',                dot:'bg-indigo-500' },
  { rank:3, topic:'Practice Quiz',          class:'Statistics 201', duration:30, note:'Due Friday',               dot:'bg-emerald-500'},
];

export default function SessionSummaryPage() {
  const router = useRouter();
  const [rating, setRating] = useState(4);

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-[900px] mx-auto">

        {/* ── Hero completion card ──────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-lg overflow-hidden mb-5"
          style={{ animation:'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
          <style>{`
            @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
            @keyframes popIn  { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
          `}</style>
          <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />

          <div className="px-6 md:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

              {/* Check icon */}
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0"
                style={{ animation:'popIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both' }}>
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">
                  Great work, Ananya! 🎉
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  You completed a 45-min session on Cell Division · Biology 101
                </p>
              </div>

              {/* Streak badge */}
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-2.5 flex-shrink-0">
                <Flame className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-lg font-extrabold text-orange-600 leading-none">5 days</p>
                  <p className="text-[10px] text-orange-500 font-medium">Study streak 🔥</p>
                </div>
              </div>
            </div>

            {/* 4 stat boxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              {[
                { icon:Clock,      label:'Time studied',      value:'45 min', color:'text-indigo-600',  bg:'bg-indigo-50',  border:'border-indigo-100' },
                { icon:Brain,      label:'Topics covered',    value:'2',      color:'text-blue-600',    bg:'bg-blue-50',    border:'border-blue-100'   },
                { icon:TrendingUp, label:'Mastery gained',    value:'+12%',   color:'text-emerald-600', bg:'bg-emerald-50', border:'border-emerald-100'},
                { icon:Target,     label:'Mastery now',       value:'40%',    color:'text-purple-600',  bg:'bg-purple-50',  border:'border-purple-100' },
              ].map((s,i) => (
                <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-3.5 text-center`}
                  style={{ animation:`fadeUp 0.35s ease ${0.2+i*0.07}s both` }}>
                  <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1.5`} />
                  <p className={`text-xl font-extrabold ${s.color} leading-none`}>{s.value}</p>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main layout ───────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* Left — content */}
          <div className="flex-1 space-y-4">

            {/* Mastery improvement */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
              <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-4">
                Mastery improved this session
              </p>
              <div className="space-y-4">
                {IMPROVED.map((t) => (
                  <div key={t.topic}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-800">{t.topic}</p>
                      <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        +{t.after - t.before}%
                      </span>
                    </div>
                    {/* Before/After stacked bars */}
                    <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                      {/* Before (gray) */}
                      <div className="absolute inset-y-0 left-0 bg-gray-300 rounded-full"
                        style={{ width:`${t.before}%` }} />
                      {/* After (indigo) — animated */}
                      <div className="absolute inset-y-0 left-0 bg-indigo-500 rounded-full transition-all duration-700"
                        style={{ width:`${t.after}%` }} />
                      {/* After label inside bar */}
                      <span className="absolute right-2 top-0 bottom-0 flex items-center text-[10px] font-extrabold text-white">
                        {t.after}%
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>Before: {t.before}%</span>
                      <span className="text-indigo-600 font-semibold">Now: {t.after}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Updated plan */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-4 md:px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-sm font-extrabold text-gray-900">Your updated study plan</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Atlas re-ranked tasks based on your progress</p>
                </div>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                  Updated
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {NEXT_TASKS.map((t) => (
                  <div key={t.rank}
                    className="flex items-center gap-3 px-4 md:px-5 py-3.5 hover:bg-gray-50 transition-all">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
                      t.rank===1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>{t.rank}</div>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{t.topic}</p>
                      <p className="text-[10px] text-gray-400">{t.class} · {t.note}</p>
                    </div>
                    <span className="text-[11px] text-gray-400 font-semibold flex-shrink-0">{t.duration}m</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                  </div>
                ))}
              </div>
              <div className="px-4 md:px-5 py-3 border-t border-gray-50">
                <button onClick={() => router.push('/study-plan')}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
                  View full study plan <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* What to do next — AI suggestion */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 text-white">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold mb-1">Do this now — while it&apos;s fresh</p>
                  <p className="text-[12px] text-indigo-100 leading-relaxed">
                    Take a quick quiz on Cell Division right now. Recall within 10 minutes of studying locks the material 3× more effectively.
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5 mt-4 flex-wrap">
                <button onClick={() => router.push('/quiz')}
                  className="flex items-center gap-1.5 bg-white text-indigo-700 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all hover:bg-indigo-50 shadow-sm">
                  <Target className="w-3.5 h-3.5" /> Take practice quiz
                </button>
                <button onClick={() => router.push('/flashcards')}
                  className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all">
                  🃏 Review flashcards
                </button>
              </div>
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────────── */}
          <div className="lg:w-[200px] lg:flex-shrink-0 space-y-3">

            {/* Rate session */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Rate this session</p>
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5].map((r) => (
                  <button key={r} onClick={() => setRating(r)}>
                    <Star className={`w-6 h-6 transition-all ${r<=rating?'fill-amber-400 text-amber-400 scale-110':'text-gray-200 hover:text-amber-300'}`} />
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                {rating===5?'🌟 Perfect session!':rating===4?'😊 Good session':rating===3?'😐 Okay session':rating<=2?'😕 Tough session':''}
              </p>
            </div>

            {/* Session recap */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Session recap</p>
              <div className="divide-y divide-gray-50">
                {[
                  { label:'Duration',  value:'45 min'          },
                  { label:'Topics',    value:'Cell Division'   },
                  { label:'Mode',      value:'Active Practice' },
                  { label:'Completed', value:'2 / 4 topics'   },
                  { label:'Date',      value:'Today'           },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between text-xs py-2">
                    <span className="text-gray-400">{r.label}</span>
                    <span className="font-bold text-gray-700 text-right">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next actions */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Next actions</p>
              <div className="space-y-0.5">
                {[
                  { emoji:'❓', label:'Practice Quiz',    href:'/quiz'       },
                  { emoji:'🃏', label:'Flashcards',       href:'/flashcards' },
                  { emoji:'🏠', label:'Dashboard',        href:'/dashboard'       },
                  { emoji:'📊', label:'Analytics',        href:'/analytics'  },
                ].map((a) => (
                  <a key={a.href} href={a.href}
                    className="flex items-center justify-between text-xs font-semibold text-gray-700 hover:text-indigo-600 p-2 rounded-xl hover:bg-indigo-50 transition-all">
                    <span>{a.emoji} {a.label}</span>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
