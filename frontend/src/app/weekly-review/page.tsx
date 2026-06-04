'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import Tooltip from '@/components/Tooltip';
import {
  TrendingUp, TrendingDown, Clock, Brain,
  CheckCircle2, XCircle, Flame, Target,
  ChevronRight, ArrowRight, Star, BarChart2,
  Sparkles, AlertTriangle, Calendar,
  Lock, Upload,
} from 'lucide-react';

const WEEK_STATS = [
  { label:'Hours studied',   value:'11.5h', target:'14h', pct:82,  icon:Clock,       color:'text-indigo-600',  bg:'bg-indigo-50',  border:'border-indigo-100', good:true  },
  { label:'Sessions done',   value:'6',     target:'8',   pct:75,  icon:CheckCircle2,color:'text-emerald-600', bg:'bg-emerald-50', border:'border-emerald-100',good:true  },
  { label:'Topics covered',  value:'5',     target:'7',   pct:71,  icon:Brain,       color:'text-violet-600',  bg:'bg-violet-50',  border:'border-violet-100', good:false },
  { label:'Study streak',    value:'5 days',target:'7',   pct:71,  icon:Flame,       color:'text-orange-600',  bg:'bg-orange-50',  border:'border-orange-100', good:true  },
];

const MASTERY_DELTA = [
  { topic:'Cell Division',    before:28, after:42, class:'Biology 101'    },
  { topic:'Enzyme Kinetics',  before:35, after:50, class:'Biology 101'    },
  { topic:'Problem Set #3',   before:60, after:75, class:'Statistics 201' },
  { topic:'Essay structure',  before:55, after:55, class:'English 301',   noChange:true },
  { topic:'DNA Replication',  before:65, after:62, class:'Biology 101',   dropped:true  },
];

const SKIPPED = [
  { topic:'Krebs Cycle',      class:'Biology 101',    reason:'Skipped twice — now overdue' },
  { topic:'Statistics Ch.9',  class:'Statistics 201', reason:'Skipped once'                },
];

const NEXT_WEEK = [
  { rank:1, topic:'Mitosis deep dive',     class:'Biology 101',    mins:90, urgent:true  },
  { rank:2, topic:'Krebs Cycle (overdue)', class:'Biology 101',    mins:45, urgent:true  },
  { rank:3, topic:'Statistics PS#4',       class:'Statistics 201', mins:60, urgent:false },
  { rank:4, topic:'English essay draft',   class:'English 301',    mins:90, urgent:false },
];

export default function WeeklyReviewPage() {
  const router = useRouter();
  const gpaChange = +0.08;

  // Weekly Review summarises a full week of study activity. Until the
  // student has been using Atlas for at least a few days, there's literally
  // nothing to review — show a gentle "see you Sunday" empty state.
  const [hasReview, setHasReview] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('atlas_has_review') === 'true') {
      setHasReview(true);
    }
  }, []);

  /* ─────────────────────────────────────────────────────────────
   * EMPTY STATE — no week of activity to review yet.
   * Tone: relaxed and motivating, not "click to unlock".
   * ───────────────────────────────────────────────────────────── */
  if (!hasReview) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#F5F5FB] p-4 md:p-4">
          <div className="max-w-[920px] mx-auto">

            {/* Header */}
            <div className="text-center mb-4">
              
              <h1 className="text-3xl md:text-[34px] font-extrabold text-[#14142B] leading-tight mb-2">
                See you on Sunday
              </h1>
              <p className="text-sm text-[#6B6A8A] max-w-3xl mx-auto leading-relaxed">
                Every Sunday evening, Atlas wraps up your week — hours studied,
                topics mastered, what slipped, and what to focus on next. Come
                back after a few days of study and your first review will appear.
              </p>
            </div>

            {/* Hero — with weeklyreviewpage1.webp as full-width bg image */}
            <div className="relative overflow-hidden  rounded-xl mb-7 shadow-xl shadow-[#534AB7]/20 min-h-[260px]">
              {/* Full-width background illustration */}
              <img
                src="https://res.cloudinary.com/mview/image/upload/atlas/weeklyreviewpage1.webp"
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none"
              />
              {/* Purple-to-transparent overlay so left-side text stays crisp */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#6e64e0] via-[#534AB7]/90 via-45% to-transparent pointer-events-none" />

              {/* Decorative sparkles */}
              <Sparkles className="absolute top-6 right-1/3 w-4 h-4 text-white/30 z-10 pointer-events-none" />
              <Sparkles className="absolute bottom-12 right-1/2 w-3 h-3 text-white/30 z-10 pointer-events-none" />
              <Sparkles className="absolute top-1/2 left-12 w-3 h-3 text-white/20 z-10 pointer-events-none" />

              {/* Foreground content — left-aligned, max width so it doesn't overlap illustration */}
              <div className="relative z-10 p-7 md:p-9 max-w-[60%]">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur text-white text-[12px] font-bold px-3 py-1.5 mb-3 border border-white/15">
                  <Clock className="w-3 h-3" /> Generated every Sunday
                </span>
                <h2 className="text-2xl md:text-[28px] font-extrabold text-white mb-2 leading-tight">
                  Build your first week of progress
                </h2>
                <p className="text-[15px] text-white/85 leading-relaxed mb-5">
                  Study a few sessions this week — even short ones count.
                  Your first weekly review will be richer the more you put in.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/study-plan"
                    className="inline-flex items-center gap-2 bg-white hover:bg-[#F4F2FF] text-[#534AB7] px-5 py-2.5 rounded-xl font-extrabold text-sm shadow-lg transition-all active:scale-95">
                    <Sparkles className="w-4 h-4" /> Open study plan
                  </Link>
                  <Link href="/upload"
                    className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 text-white px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all active:scale-95">
                    <Upload className="w-4 h-4" /> Add materials
                  </Link>
                </div>
              </div>
            </div>

            {/* "What you'll see" — preview of the weekly review */}
            <div className="mb-5">
              <p className="text-[13px] font-extrabold text-[#9292a1] uppercase tracking-widest mb-3">
                What every weekly review includes
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { icon: Clock,        color: 'bg-[#534AB7]',   label: 'Hours studied',     desc: 'Total time, broken down by class and topic.' },
                  { icon: Brain,        color: 'bg-blue-500',    label: 'Mastery gained',    desc: 'Which topics moved forward and by how much.' },
                  { icon: Flame,        color: 'bg-orange-500',  label: 'Study streak',      desc: 'Days in a row you stayed consistent.' },
                  { icon: AlertTriangle,color: 'bg-amber-500',   label: 'What you skipped',  desc: 'Topics deferred this week, now overdue.' },
                ].map((c) => (
                  <div key={c.label} className="bg-white border border-[#ECE9FF] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                        <c.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-[15px] font-extrabold text-[#1A1A2E] leading-tight">{c.label}</p>
                    </div>
                    <p className="text-[14px] text-[#6B6A8A] leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample preview row — locked, matches screenshot reference */}
            <div className="relative bg-white border border-[#ECE9FF] rounded-xl p-5 mb-7 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#534AB7]" />
                  <h3 className="text-lg font-extrabold text-[#14142B]">Sample weekly summary</h3>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#534AB7] bg-[#F4F2FF] px-2.5 py-1 rounded-full">
                  Preview
                </span>
              </div>

              {/* Faded 4-stat row with centered lock overlay */}
              <div className="relative">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 opacity-60">
                  {[
                    { value: '14.5h',  label: 'Hours studied', color: 'text-[#534AB7]',   bg: 'bg-[#F4F2FF]',    icon: Clock },
                    { value: '8',      label: 'Sessions',      color: 'text-emerald-600', bg: 'bg-emerald-50',   icon: CheckCircle2 },
                    { value: '+12%',   label: 'Mastery gain',  color: 'text-blue-600',    bg: 'bg-blue-50',      icon: TrendingUp },
                    { value: '5 days', label: 'Streak',        color: 'text-orange-600',  bg: 'bg-orange-50',    icon: Flame },
                  ].map((s) => (
                    <div key={s.label} className="bg-white border border-[#ECE9FF] rounded-xl p-3.5">
                      <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center mb-2.5`}>
                        <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                      </div>
                      <p className={`text-2xl font-extrabold ${s.color} leading-none mb-1.5`}>{s.value}</p>
                      <p className="text-[11px] text-[#9B9AB5] font-semibold">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Centered lock overlay with small white halo behind text for legibility */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-11 h-11 rounded-full bg-[#534AB7] flex items-center justify-center shadow-lg shadow-[#534AB7]/30 mb-5">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-[16px] font-extrabold bg-inherit text-[#14142B]  px-2 py-0.5">Your data will appear here</p>
                  <p className="text-[13px] text-[#6B6A8A]  px-2 py-0.5 mt-0.5">First review unlocks after a few days of study.</p>
                </div>
              </div>
            </div>

            {/* Reassurance / motivation band */}
            <div className="bg-[#F4F2FF] border border-[#E8E5FD] rounded-2xl px-5 py-4 flex items-start gap-3.5">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Star className="w-4 h-4 text-[#534AB7]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-extrabold text-[#1A1A2E]">Small steps every day &gt; big efforts once</p>
                <p className="text-[12px] text-[#6B6A8A] leading-relaxed">
                  Even 20 minutes a day adds up to a meaningful weekly review. Consistency beats intensity.
                </p>
              </div>
            </div>

          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-[960px] mx-auto">

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => router.push('/home')}>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-indigo-600 font-semibold">Weekly Review</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">Weekly Review</h1>
              <p className="text-xs text-gray-400 mt-0.5">Week of May 13–19 · Generated Sunday evening</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <div className="text-right">
                <p className="text-base font-extrabold text-emerald-600">+{gpaChange.toFixed(2)}</p>
                <p className="text-[9px] text-emerald-500 font-medium">GPA change this week</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4 stat cards ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {WEEK_STATS.map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-3.5`}>
              <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
              <p className={`text-xl font-extrabold ${s.color} leading-none`}>{s.value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
              <div className="mt-2 h-1 bg-white/60 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${s.good ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width:`${s.pct}%` }} />
              </div>
              <p className="text-[9px] text-gray-400 mt-0.5">{s.pct}% of goal ({s.target})</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 space-y-4">

            {/* Mastery changes */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
                <p className="text-sm font-extrabold text-gray-900">Mastery changes this week</p>
                <Tooltip text="Mastery is recalculated after every quiz, session, and self-rating. Green = improved. Red = dropped (needs attention)." position="right" width="w-56" />
              </div>
              <div className="divide-y divide-gray-50">
                {MASTERY_DELTA.map((t) => {
                  const delta = t.after - t.before;
                  const isGood = delta > 0;
                  return (
                    <div key={t.topic} className="flex items-center gap-3 px-5 py-3.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-extrabold ${
                        (t as any).dropped ? 'bg-red-100 text-red-600' :
                        (t as any).noChange ? 'bg-gray-100 text-gray-500' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {(t as any).dropped ? '↓' : (t as any).noChange ? '→' : '↑'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{t.topic}</p>
                        <p className="text-[10px] text-gray-400">{t.class}</p>
                      </div>
                      {/* Before → After bar */}
                      <div className="w-28 hidden sm:block">
                        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="absolute inset-y-0 left-0 bg-gray-300 rounded-full"
                            style={{ width:`${t.before}%` }} />
                          <div className={`absolute inset-y-0 left-0 rounded-full ${(t as any).dropped ? 'bg-red-500' : (t as any).noChange ? 'bg-gray-400' : 'bg-emerald-500'}`}
                            style={{ width:`${t.after}%` }} />
                        </div>
                        <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
                          <span>{t.before}%</span>
                          <span className="font-bold">{t.after}%</span>
                        </div>
                      </div>
                      <span className={`text-xs font-extrabold flex-shrink-0 ${
                        (t as any).dropped ? 'text-red-600' : (t as any).noChange ? 'text-gray-400' : 'text-emerald-600'
                      }`}>
                        {delta === 0 ? '±0' : delta > 0 ? `+${delta}%` : `${delta}%`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skipped tasks */}
            {SKIPPED.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-amber-100 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <p className="text-sm font-extrabold text-amber-800">Tasks you skipped this week</p>
                </div>
                <div className="divide-y divide-amber-100">
                  {SKIPPED.map((s) => (
                    <div key={s.topic} className="flex items-center justify-between gap-3 px-5 py-3">
                      <div>
                        <p className="text-sm font-semibold text-amber-900">{s.topic}</p>
                        <p className="text-[10px] text-amber-600">{s.class} · {s.reason}</p>
                      </div>
                      <button onClick={() => router.push('/study-plan')}
                        className="text-[11px] font-bold text-amber-700 border border-amber-300 hover:bg-amber-100 px-2.5 py-1 rounded-xl transition-all flex-shrink-0">
                        Schedule →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI summary */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 text-white">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-extrabold mb-1.5">Atlas says about this week</p>
                  <p className="text-xs text-indigo-100 leading-relaxed">
                    Good week overall — 11.5h studied, mastery improved on 3 topics. 
                    Your biggest risk going into next week is <strong className="text-white">Krebs Cycle</strong> (skipped twice, exam approaching) and <strong className="text-white">DNA Replication</strong> which dropped 3%. 
                    Priority next week: Bio sessions Monday + Wednesday before the exam Thursday.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar — next week plan */}
          <div className="lg:w-[220px] lg:flex-shrink-0 space-y-3">

            {/* Star rating */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Rate this week</p>
              <div className="flex justify-center gap-1 mb-1.5">
                {[1,2,3,4,5].map((r) => (
                  <Star key={r} className={`w-5 h-5 ${r <= 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <p className="text-xs text-gray-500">Solid week 😊</p>
            </div>

            {/* Next week plan */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                <p className="text-xs font-extrabold text-gray-900">Next week plan</p>
              </div>
              <div className="divide-y divide-gray-50">
                {NEXT_WEEK.map((t) => (
                  <div key={t.rank} className="flex items-center gap-2.5 px-4 py-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 ${
                      t.rank === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>{t.rank}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-gray-800 truncate">{t.topic}</p>
                      <p className="text-[9px] text-gray-400">{t.class} · {t.mins}m</p>
                    </div>
                    {t.urgent && <span className="text-[8px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full flex-shrink-0">Urgent</span>}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-gray-50">
                <button onClick={() => router.push('/study-plan')}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                  Full plan <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-1">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Quick actions</p>
              {[
                { label:'Start next session',  href:'/study-session', emoji:'▶' },
                { label:'View full plan',       href:'/study-plan',    emoji:'📋' },
                { label:'Check grades',         href:'/grades',        emoji:'📊' },
                { label:'Analytics deep dive',  href:'/analytics',     emoji:'📈' },
              ].map((a) => (
                <button key={a.href} onClick={() => router.push(a.href)}
                  className="w-full flex items-center gap-2.5 text-xs font-semibold text-gray-700 hover:text-indigo-600 p-2 rounded-xl hover:bg-indigo-50 transition-all text-left">
                  <span>{a.emoji}</span> {a.label}
                  <ChevronRight className="w-3 h-3 ml-auto text-gray-300" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
