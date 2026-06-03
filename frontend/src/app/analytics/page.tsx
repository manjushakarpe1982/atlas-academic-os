'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { PageSkeleton } from '@/components/Skeleton';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import {
  BarChart3, Upload, ChevronRight, Lock,
  TrendingUp, Clock, Target, Sparkles, Brain, BookOpen, Zap,
} from 'lucide-react';


type Tab = 'overview' | 'subjects' | 'topics' | 'time';

/* ─── KPI background sparkline/bar SVGs ─────────────────────── */
function KpiChart({ type }: { type: 'purple'|'green'|'blue'|'violet' }) {
  if (type === 'purple') return (
    <svg className="absolute right-0 bottom-0 w-[62%] h-[70%] opacity-95 pointer-events-none" viewBox="0 0 200 100" preserveAspectRatio="none">
      <defs><linearGradient id="kg1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#6d5cf6" stopOpacity=".35"/><stop offset="100%" stopColor="#6d5cf6" stopOpacity="0"/></linearGradient></defs>
      <path d="M0,70 C30,55 50,80 80,60 C110,40 130,75 160,45 C180,30 195,40 200,35 L200,100 L0,100 Z" fill="url(#kg1)"/>
      <path d="M0,70 C30,55 50,80 80,60 C110,40 130,75 160,45 C180,30 195,40 200,35" stroke="#6d5cf6" strokeWidth="1.5" fill="none"/>
    </svg>
  );
  if (type === 'green') return (
    <svg className="absolute right-0 bottom-0 w-[62%] h-[70%] opacity-95 pointer-events-none" viewBox="0 0 200 100" preserveAspectRatio="none">
      <defs><linearGradient id="kg2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#29c089" stopOpacity=".35"/><stop offset="100%" stopColor="#29c089" stopOpacity="0"/></linearGradient></defs>
      <path d="M0,80 C25,75 45,55 70,50 C95,45 110,30 135,28 C160,26 180,40 200,35 L200,100 L0,100 Z" fill="url(#kg2)"/>
      <path d="M0,80 C25,75 45,55 70,50 C95,45 110,30 135,28 C160,26 180,40 200,35" stroke="#29c089" strokeWidth="1.5" fill="none"/>
    </svg>
  );
  if (type === 'blue') return (
    <svg className="absolute right-0 bottom-0 w-[62%] h-[70%] opacity-95 pointer-events-none" viewBox="0 0 200 100" preserveAspectRatio="none">
      <g fill="#cdc6ff">
        {[[10,65,30],[34,55,40],[58,60,35],[82,48,47],[106,40,55],[130,30,65],[154,20,75],[178,10,85]].map(([x,y,h],i) => (
          <rect key={i} x={x} y={y} width="14" height={h} rx="3" fill={i===7?'#6d5cf6':'#cdc6ff'}/>
        ))}
      </g>
    </svg>
  );
  return (
    <svg className="absolute right-0 bottom-0 w-[62%] h-[70%] opacity-95 pointer-events-none" viewBox="0 0 200 100" preserveAspectRatio="none">
      <defs><linearGradient id="kg4" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#b89ef0" stopOpacity=".4"/><stop offset="100%" stopColor="#b89ef0" stopOpacity="0"/></linearGradient></defs>
      <path d="M0,75 C25,65 45,72 70,60 C95,48 110,68 135,50 C160,32 180,42 200,30 L200,100 L0,100 Z" fill="url(#kg4)"/>
      <path d="M0,75 C25,65 45,72 70,60 C95,48 110,68 135,50 C160,32 180,42 200,30" stroke="#b89ef0" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

/* ─── Icons (SVG inline) ─────────────────────────────────────── */
const IconClock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
const IconBar  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20h18M6 16v-4M11 16V8M16 16v-6M21 16v-2"/></svg>;
const IconBook = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14"/><path d="M12 3v18"/></svg>;
const IconBolt = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>;
const ArrowUp  = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
const ArrowDn  = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>;
const InfoI    = () => <span className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-full border border-[#9a9db4] text-[#9a9db4] text-[9px] font-bold ml-1.5">i</span>;

export default function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);

  // Analytics only makes sense once the student has been using Atlas — at
  // least one study session, grade, or completed task. Until then, show a
  // hybrid empty state that teaches what analytics unlocks.
  const [hasAnalytics, setHasAnalytics] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('atlas_has_analytics') === 'true') {
      setHasAnalytics(true);
    }
  }, []);

  if (loading) return <PageSkeleton />;

  /* ─────────────────────────────────────────────────────────────
   * EMPTY STATE — student hasn't used Atlas enough to generate
   * meaningful analytics yet (no study sessions, no grades).
   * ───────────────────────────────────────────────────────────── */
  if (!hasAnalytics) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#F5F5FB] p-4 md:p-8">
          <div className="max-w-[1000px] mx-auto">

            {/* Header */}
            <div className="text-center mb-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F4F2FF] border border-[#E8E5FD] text-[#534AB7] text-[11px] font-bold px-3.5 py-1.5 mb-4">
                <BarChart3 className="w-3.5 h-3.5" /> Step 5 — Track your progress
              </span>
              <h1 className="text-3xl md:text-[34px] font-extrabold text-[#14142B] leading-tight mb-2">
                Your analytics will appear here
              </h1>
              <p className="text-sm text-[#6B6A8A] max-w-xl mx-auto leading-relaxed">
                Start studying with Atlas — once you log a few study sessions or
                grades, you&apos;ll see deep insights into how you learn, what&apos;s
                working, and where to focus.
              </p>
            </div>

            {/* Two big action cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
              {/* Option 1 — Start studying (primary, purple) */}
              <Link
                href="/study-plan"
                className="group relative overflow-hidden bg-gradient-to-br from-[#534AB7] via-[#5B4FBC] to-[#7B6FE8] rounded-3xl p-6 shadow-xl shadow-[#534AB7]/20 hover:shadow-2xl transition-all active:scale-[0.99]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/90 text-emerald-950 text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-wider">
                    Recommended
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white mb-1.5">
                  Start a study session
                </h3>
                <p className="text-[13px] text-white/85 leading-relaxed mb-5">
                  Open your daily study plan and start a focused session —
                  Atlas tracks every minute and builds your analytics from it.
                </p>
                <div className="flex items-center gap-2 text-white font-extrabold text-sm">
                  <span>Open study plan</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Option 2 — Upload materials (secondary, white) */}
              <Link
                href="/upload"
                className="group block text-left relative overflow-hidden bg-white border border-[#ECE9FF] rounded-3xl p-6 shadow-sm hover:shadow-lg hover:border-[#534AB7]/30 transition-all active:scale-[0.99]"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F4F2FF] flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-[#534AB7]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#14142B] mb-1.5">
                  Add your materials
                </h3>
                <p className="text-[13px] text-[#6B6A8A] leading-relaxed mb-5">
                  Haven&apos;t uploaded a syllabus yet? Drop your course files
                  first so Atlas knows what to track.
                </p>
                <div className="flex items-center gap-2 text-[#534AB7] font-extrabold text-sm">
                  <span>Upload files</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            {/* Locked KPI preview row — what analytics shows */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
              {[
                { icon: Clock,      color: 'text-[#534AB7]',   bg: 'bg-[#EFECFF]',  label: 'Study time',     hint: '—' },
                { icon: Target,     color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Avg score',      hint: '—' },
                { icon: BookOpen,   color: 'text-blue-600',    bg: 'bg-blue-50',    label: 'Topics studied', hint: '—' },
                { icon: TrendingUp, color: 'text-violet-600',  bg: 'bg-violet-50',  label: 'Streak',         hint: '—' },
              ].map((k) => (
                <div key={k.label} className="relative overflow-hidden bg-white border border-[#ECE9FF] rounded-2xl p-4 shadow-sm">
                  <div className={`w-9 h-9 rounded-lg ${k.bg} flex items-center justify-center mb-2.5`}>
                    <k.icon className={`w-4 h-4 ${k.color}`} />
                  </div>
                  <div className="text-2xl font-extrabold text-gray-300 leading-none tracking-tight">{k.hint}</div>
                  <div className="text-xs text-[#9B9AB5] mt-2">{k.label}</div>
                </div>
              ))}
            </div>

            {/* Locked chart preview */}
            <div className="relative bg-white border border-[#ECE9FF] rounded-2xl p-5 mb-7 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#534AB7]" />
                  <h3 className="text-sm font-extrabold text-[#14142B]">Performance trends</h3>
                </div>
                <span className="text-[11px] text-[#9B9AB5] font-semibold">Locked</span>
              </div>

              <div className="relative h-[180px]">
                {/* Faded bars */}
                <svg viewBox="0 0 600 180" className="w-full h-full opacity-30 pointer-events-none">
                  {[40, 80, 120].map((y) => (
                    <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#E5E5F0" strokeDasharray="4 4" />
                  ))}
                  {[60, 110, 75, 130, 95, 145, 110, 160].map((h, i) => (
                    <rect key={i} x={20 + i * 75} y={170 - h} width="40" height={h} rx="6" fill="#534AB7" opacity={0.4 + i * 0.05} />
                  ))}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-11 h-11 rounded-2xl bg-[#534AB7] flex items-center justify-center shadow-lg shadow-[#534AB7]/30 mb-2">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-[13px] font-extrabold text-[#14142B]">Start studying to unlock</p>
                  <p className="text-[11.5px] text-[#6B6A8A] mt-0.5">Complete a few study sessions to see your trends.</p>
                </div>
              </div>
            </div>

            {/* What you'll see */}
            <div className="mb-7">
              <p className="text-[11px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-3">
                What you&apos;ll discover
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { icon: Clock,      color: 'bg-[#534AB7]',   label: 'Time spent per topic', desc: 'Where your hours actually go — by class and topic.' },
                  { icon: Target,     color: 'bg-emerald-500', label: 'Performance trends',   desc: 'Quiz, exam, and assignment scores over time.' },
                  { icon: Brain,      color: 'bg-blue-500',    label: 'Mastery map',          desc: 'Which topics you understand and which need work.' },
                  { icon: TrendingUp, color: 'bg-orange-500',  label: 'Study habits',         desc: 'Your most productive times of day and patterns.' },
                ].map((c) => (
                  <div key={c.label} className="bg-white border border-[#ECE9FF] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                        <c.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-[13px] font-extrabold text-[#1A1A2E] leading-tight">{c.label}</p>
                    </div>
                    <p className="text-[12px] text-[#6B6A8A] leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reassurance band */}
            <div className="bg-[#F4F2FF] border border-[#E8E5FD] rounded-2xl px-5 py-4 flex items-start gap-3.5">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-[#534AB7]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-extrabold text-[#1A1A2E]">The more you study, the smarter Atlas gets</p>
                <p className="text-[12px] text-[#6B6A8A] leading-relaxed">
                  Analytics improve continuously — every session, quiz, and grade refines your insights.
                </p>
              </div>
            </div>

          </div>
        </div>
      </AppLayout>
    );
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'topics',   label: 'Topics'   },
    { id: 'time',     label: 'Time'     },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#f3f3f8] px-7 pt-7 pb-14 font-[Inter]">
        <div className="max-w-[1080px] mx-auto">

          {/* ── Header ─────────────────────────────────────── */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h1 className="text-[26px] font-bold text-[#11132b] tracking-tight mb-1.5">Progress Analytics</h1>
              <div className="flex items-center gap-2 text-[13px] text-[#6c6f8a]">
                Fall 2026 · Updated just now
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#29c089]"/>
              </div>
            </div>
            <div className="flex gap-0.5 bg-white rounded-full p-1 shadow-sm">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-[18px] py-2 rounded-full text-[13px] font-medium transition-all border-none outline-none cursor-pointer ${
                    tab === t.id ? 'bg-[#6d5cf6] text-white font-semibold' : 'bg-transparent text-[#6c6f8a] hover:text-[#11132b]'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── KPI Row ────────────────────────────────────── */}
          <div className="grid grid-cols-4 gap-3.5 mb-3.5">
            {/* KPI 1 */}
            <div className="relative overflow-hidden min-h-[138px] bg-white p-0 border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-[18px]">
                <div className="w-[30px] h-[30px] rounded-lg bg-[#efecff] flex items-center justify-center text-[#6d5cf6] mb-3.5"><IconClock/></div>
                <div className="text-[30px] font-bold text-[#6d5cf6] leading-none tracking-tight">24.5h</div>
                <div className="text-xs text-[#6c6f8a] mt-2">Study time</div>
                <div className="flex items-center gap-1 text-[11px] text-[#ec5b56] mt-2.5"><ArrowDn/> -12% vs last month</div>
                <KpiChart type="purple"/>
              </CardContent>
            </div>
            {/* KPI 2 */}
            <div className="relative overflow-hidden min-h-[138px] bg-white p-0 border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-[18px]">
                <div className="w-[30px] h-[30px] rounded-lg bg-[#e2f6ee] flex items-center justify-center text-[#29c089] mb-3.5"><IconBar/></div>
                <div className="text-[30px] font-bold text-[#29c089] leading-none tracking-tight">76%</div>
                <div className="text-xs text-[#6c6f8a] mt-2">Avg score</div>
                <div className="flex items-center gap-1 text-[11px] text-[#29c089] mt-2.5"><ArrowUp/> +6% vs last month</div>
                <KpiChart type="green"/>
              </CardContent>
            </div>
            {/* KPI 3 */}
            <div className="relative overflow-hidden min-h-[138px] p-0 bg-white border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-[18px]">
                <div className="w-[30px] h-[30px] rounded-lg bg-[#e6efff] flex items-center justify-center text-[#4f7df3] mb-3.5"><IconBook/></div>
                <div className="text-[30px] font-bold text-[#6d5cf6] leading-none tracking-tight">28</div>
                <div className="text-xs text-[#6c6f8a] mt-2">Topics studied</div>
                <div className="flex items-center gap-1 text-[11px] text-[#29c089] mt-2.5"><ArrowUp/> 9 this month</div>
                <KpiChart type="blue"/>
              </CardContent>
            </div>
            {/* KPI 4 */}
            <div className="relative overflow-hidden min-h-[138px] p-0 bg-white border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-[18px]">
                <div className="w-[30px] h-[30px] rounded-lg bg-[#efecff] flex items-center justify-center text-[#8b6cf2] mb-3.5"><IconBolt/></div>
                <div className="text-[30px] font-bold text-[#8b6cf2] leading-none tracking-tight">12</div>
                <div className="text-xs text-[#6c6f8a] mt-2">Quizzes taken</div>
                <div className="flex items-center gap-1 text-[11px] text-[#29c089] mt-2.5"><ArrowUp/> 3 this month</div>
                <KpiChart type="violet"/>
              </CardContent>
            </div>
          </div>

          {/* ── Row 2 ──────────────────────────────────────── */}
          <div className="grid gap-3.5 mb-3.5" style={{ gridTemplateColumns:'1.05fr 1.25fr 1.05fr' }}>

            {/* Overall Progress */}
            <div  className="bg-white border border-gray-100 shadow-sm rounded-xl">
              <CardContent className="p-[18px]">
                <p className="text-[11px] font-semibold tracking-[0.08em] text-[#6c6f8a] uppercase mb-3.5">Overall Progress</p>
                <div className="grid gap-4" style={{ gridTemplateColumns:'130px 1fr', alignItems:'center' }}>
                  <div className="relative w-[130px] h-[130px]">
                    <svg width="130" height="130" viewBox="0 0 130 130">
                      <circle cx="65" cy="65" r="52" fill="none" stroke="#f1f1f7" strokeWidth="14"/>
                      <circle cx="65" cy="65" r="52" fill="none" stroke="#6d5cf6" strokeWidth="14"
                        strokeDasharray="326.7" strokeDashoffset="104.5" strokeLinecap="round" transform="rotate(-90 65 65)"/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-[#6d5cf6] tracking-tight">68%</div>
                      <div className="text-[11px] text-[#6c6f8a] mt-0.5">Overall</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3.5">
                    {[['Study time','24h 30m'],['Cards reviewed','28'],['Quizzes taken','12']].map(([k,v]) => (
                      <div key={k}>
                        <div className="text-xs text-[#6c6f8a]">{k}</div>
                        <div className="font-bold text-base mt-0.5">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator className="my-4"/>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs text-[#6c6f8a]">Score trend</span>
                  <span className="text-xs"><span className="font-bold text-[#11132b] mr-1.5">70%</span><span className="text-[#29c089] font-semibold">+6%</span></span>
                </div>
                <div className="grid grid-cols-5 gap-2.5 items-end h-[70px]">
                  {[42,48,55,62,88].map((h,i) => (
                    <div key={i} className="w-full rounded-t-md" style={{ height:`${h}%`, background: i===4?'#6d5cf6':'#efecff' }}/>
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-2.5 mt-2">
                  {['Apr 14','Apr 21','Apr 28','May 5','May 12'].map(l => (
                    <div key={l} className="text-[11px] text-[#9a9db4] text-center">{l}</div>
                  ))}
                </div>
              </CardContent>
            </div>

            {/* Study Time */}
            <div  className="bg-white border border-gray-100 shadow-sm rounded-xl">
              <CardContent className="p-[18px]">
                <div className="flex justify-between items-start">
                  <p className="text-[11px] font-semibold tracking-[0.08em] text-[#6c6f8a] uppercase">Study Time</p>
                  <span className="text-xs text-[#ec5b56] font-semibold flex items-center gap-0.5">-12% <ArrowDn/></span>
                </div>
                <div className="mt-3.5">
                  <div className="text-[28px] font-bold text-[#11132b] tracking-tight leading-tight">24h 30m</div>
                  <div className="text-xs text-[#6c6f8a] mt-0.5">Total this month</div>
                </div>
                <div className="mt-1.5">
                  <svg viewBox="0 0 460 130" width="100%" height="130" preserveAspectRatio="none">
                    <defs><linearGradient id="st-grad" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#6d5cf6" stopOpacity=".18"/><stop offset="100%" stopColor="#6d5cf6" stopOpacity="0"/></linearGradient></defs>
                    <g stroke="#eef0f7" strokeWidth="1"><line x1="0" y1="20" x2="460" y2="20"/><line x1="0" y1="55" x2="460" y2="55"/><line x1="0" y1="90" x2="460" y2="90"/><line x1="0" y1="125" x2="460" y2="125"/></g>
                    <path d="M20,95 L75,100 L130,80 L195,75 L260,55 L325,45 L390,30 L440,18 L440,130 L20,130 Z" fill="url(#st-grad)"/>
                    <path d="M20,95 L75,100 L130,80 L195,75 L260,55 L325,45 L390,30 L440,18" fill="none" stroke="#6d5cf6" strokeWidth="2.2" strokeLinejoin="round"/>
                    <g fill="#fff" stroke="#6d5cf6" strokeWidth="2">
                      {[[20,95],[75,100],[130,80],[195,75],[260,55],[325,45],[390,30]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="3.5"/>)}
                      <circle cx="440" cy="18" r="4" fill="#6d5cf6"/>
                    </g>
                  </svg>
                  <div className="grid grid-cols-4 mt-1">
                    {['Apr W3','Apr W4','May W1','May W2'].map(w=><div key={w} className="text-[11px] text-[#9a9db4] text-center">{w}</div>)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mt-3.5">
                  {[['Daily avg','2.5 hrs',false],['Best day','Saturday',true],['Longest session','3.5 hrs',false],['Sessions / week','6',false]].map(([k,v,g])=>(
                    <div key={String(k)} className="bg-[#f7f7fc] rounded-[10px] px-3 py-2.5">
                      <div className="text-[11px] text-[#9a9db4]">{k}</div>
                      <div className={`font-bold text-sm mt-1 ${g?'text-[#29c089]':'text-[#11132b]'}`}>{v}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>

            {/* Calendar */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-xl">
              <CardContent className="p-[18px]">
                <div className="flex items-center justify-between mb-3.5">
                  <p className="text-[11px] font-semibold tracking-[0.08em] text-[#6c6f8a] uppercase">May 2026</p>
                  <div className="flex gap-1.5">
                    {['‹','›'].map(a=>(
                      <button key={a} className="w-[22px] h-[22px] rounded-md border border-[#ececf3] bg-white text-[#6c6f8a] flex items-center justify-center cursor-pointer text-[13px] hover:bg-gray-50">{a}</button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {['S','M','T','W','T','F','S'].map((d,i)=><div key={i} className="text-[11px] text-[#9a9db4] text-center py-1">{d}</div>)}
                  {[...Array(5)].map((_,i)=><div key={`b${i}`}/>)}
                  {[...Array(31)].map((_,i)=>{
                    const d=i+1, isToday=d===19;
                    const evts:Record<number,string[]>={19:['study'],21:['quiz'],22:['deadline'],25:['exam','study'],26:['quiz','study'],29:['quiz','study']};
                    const dotC:Record<string,string>={exam:'#ec5b56',deadline:'#f3a23a',quiz:'#8b6cf2',study:'#6d5cf6'};
                    return (
                      <div key={d} className={`relative flex flex-col items-center justify-center text-xs rounded-lg cursor-pointer ${isToday?'bg-[#6d5cf6] text-white font-semibold':'text-[#11132b] hover:bg-gray-100'}`} style={{aspectRatio:'1.15'}}>
                        {d}
                        {evts[d]&&<div className="absolute bottom-0.5 flex gap-0.5">{evts[d].map((e,j)=><span key={j} className="w-1 h-1 rounded-full" style={{background:isToday?'rgba(255,255,255,.85)':dotC[e]}}/>)}</div>}
                      </div>
                    );
                  })}
                  {[...Array(6)].map((_,i)=><div key={`e${i}`}/>)}
                </div>
                <div className="flex flex-wrap gap-x-3.5 gap-y-2 text-[11px] text-[#6c6f8a] mt-3.5 pt-3.5 border-t border-[#ececf3]">
                  {[['#ec5b56','Exam'],['#f3a23a','Deadline'],['#8b6cf2','Quiz'],['#6d5cf6','Study']].map(([c,l])=>(
                    <span key={l} className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full" style={{background:c}}/>{l}</span>
                  ))}
                </div>
              </CardContent>
            </div>
          </div>

          {/* ── Row 3 ──────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3.5 mb-3.5">

            {/* Subject Breakdown */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-xl">
              <CardContent className="p-[18px]">
                <p className="text-[11px] font-semibold tracking-[0.08em] text-[#6c6f8a] uppercase mb-3.5">Subject Breakdown</p>
                {[
                  {name:'Biology 101',   time:'52h 45m',pct:72,bar:'#6d5cf6',pill:'bg-[#efecff] text-[#6d5cf6]',iconBg:'bg-[#e2f6ee]',iconC:'text-[#29c089]'},
                  {name:'Statistics 201',time:'31h 20m',pct:85,bar:'#29c089',pill:'bg-[#e2f6ee] text-[#29c089]',iconBg:'bg-[#e7efff]',iconC:'text-[#4f7df3]'},
                  {name:'English 110',   time:'23h 20m',pct:78,bar:'#f3a23a',pill:'bg-[#fdeed8] text-[#f3a23a]',iconBg:'bg-[#fdeed8]',iconC:'text-[#f3a23a]'},
                  {name:'History 105',   time:'16h 10m',pct:91,bar:'#8b6cf2',pill:'bg-[#efecff] text-[#8b6cf2]',iconBg:'bg-[#efecff]',iconC:'text-[#8b6cf2]'},
                ].map((s,i)=>(
                  <div key={s.name} className={`grid gap-3.5 items-center py-3 ${i>0?'border-t border-[#eef0f7]':''}`} style={{gridTemplateColumns:'38px 130px 1fr 56px'}}>
                    <div className={`w-[38px] h-[38px] rounded-[10px] ${s.iconBg} flex items-center justify-center ${s.iconC}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/></svg>
                    </div>
                    <div>
                      <div className="font-semibold text-[13px] text-[#11132b]">{s.name}</div>
                      <div className="text-[11px] text-[#9a9db4] mt-0.5">{s.time}</div>
                    </div>
                    <div className="h-[9px] bg-[#f1f1f7] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{width:`${s.pct}%`,background:s.bar}}/>
                    </div>
                    <div className={`text-center text-xs font-semibold py-1 rounded-md ${s.pill}`}>{s.pct}%</div>
                  </div>
                ))}
                <Separator className="mt-1.5"/>
                <div className="text-center pt-3.5 text-xs font-semibold text-[#6d5cf6]">View all subjects →</div>
              </CardContent>
            </div>

            {/* Achievements */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-xl">
              <CardContent className="p-[18px]">
                <p className="text-[11px] font-semibold tracking-[0.08em] text-[#6c6f8a] uppercase mb-3.5">Achievements</p>
                {[
                  {ic:'🔥',icBg:'bg-[#ffe9df]',t:'5-day streak',         d:'Keep going!',           earned:true },
                  {ic:'⭐',icBg:'bg-[#fff3d0]',t:'Quiz Master',           d:'10 quizzes completed',  earned:true },
                  {ic:'📈',icBg:'bg-[#e2f6ee]',t:'+0.5 GPA improvement', d:'This semester',         earned:true },
                  {ic:'🎯',icBg:'bg-[#fde2e1]',t:'100% plan completion', d:'Complete 5 in a row',   earned:false},
                  {ic:'🏆',icBg:'bg-[#fff3d0]',t:'Top score 90%+',       d:'Score 90%+ on exam',    earned:false},
                ].map((a,i)=>(
                  <div key={a.t} className={`flex items-center gap-3 py-[11px] ${i>0?'border-t border-[#eef0f7]':''}`}>
                    <div className={`w-9 h-9 rounded-[10px] ${a.icBg} flex items-center justify-center text-[18px] shrink-0`}>{a.ic}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-[13px] text-[#11132b]">{a.t}</div>
                      <div className="text-[11px] text-[#9a9db4] mt-0.5">{a.d}</div>
                    </div>
                    <Badge variant={a.earned?'default':'outline'} className={a.earned?'bg-[#e2f6ee] text-[#29c089] border-0 hover:bg-[#e2f6ee]':'text-[#6c6f8a]'}>
                      {a.earned?'Earned':'Locked'}
                    </Badge>
                  </div>
                ))}
                <Separator className="mt-1.5"/>
                <div className="text-center pt-3.5 text-xs font-semibold text-[#6d5cf6]">View all achievements →</div>
              </CardContent>
            </div>
          </div>

          {/* ── How You Compare ────────────────────────────── */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-xl mb-3.5">
            <CardContent className="p-[18px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center">
                    <span className="text-[11px] font-semibold tracking-[0.08em] text-[#6c6f8a] uppercase">How you compare — anonymous</span>
                    <InfoI/>
                  </div>
                  <div className="text-xs text-[#6c6f8a] mt-1">All comparisons are fully anonymous · opt-out in Privacy settings</div>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#6c6f8a] shrink-0">
                  <span>Compared to</span>
                  <div className="flex items-center gap-1.5 border border-[#ececf3] rounded-lg px-2.5 py-1.5 bg-white text-xs">
                    Students in your courses
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
              <div className="relative mt-3.5">
                {[
                  {iconBg:'bg-[#e2f6ee]',iconC:'text-[#29c089]',name:'Biology 101',   sub:'Top 28% of students',barW:'78%',bar:'bg-[#6d5cf6]',tag:'● Top 28%',tagC:'text-[#29c089]'},
                  {iconBg:'bg-[#e7efff]',iconC:'text-[#4f7df3]',name:'Statistics 201',sub:'Top 35% of students',barW:'70%',bar:'bg-[#29c089]',tag:'● Top 35%',tagC:'text-[#f3a23a]'},
                  {iconBg:'bg-[#fdeed8]',iconC:'text-[#f3a23a]',name:'English 110',   sub:'Top 44% of students',barW:'58%',bar:'bg-[#4f7df3]', tag:'● Top 44%',tagC:'text-[#f3a23a]'},
                ].map((s,i)=>(
                  <div key={s.name} className={`grid gap-3.5 items-center py-3 ${i>0?'border-t border-[#eef0f7]':''}`} style={{gridTemplateColumns:'38px 150px 1fr 80px'}}>
                    <div className={`w-8 h-8 rounded-[10px] ${s.iconBg} flex items-center justify-center ${s.iconC}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/></svg>
                    </div>
                    <div>
                      <div className="font-semibold text-[13px]">{s.name}</div>
                      <div className="text-[11px] text-[#9a9db4] mt-0.5">{s.sub}</div>
                    </div>
                    <div className="relative h-3.5">
                      <div className="absolute inset-0 bg-[#f1f1f7] rounded-full"/>
                      <div className={`absolute inset-y-0 left-0 ${s.bar} rounded-full`} style={{width:s.barW}}/>
                      <div className="absolute top-[-4px] bottom-[-4px] left-[64%] w-0.5"
                        style={{background:'repeating-linear-gradient(to bottom,#9a9db4 0,#9a9db4 3px,transparent 3px,transparent 6px)'}}/>
                    </div>
                    <div className={`font-semibold text-xs ${s.tagC}`}>{s.tag}</div>
                  </div>
                ))}
                <div className="relative h-4">
                  <div className="absolute text-[11px] text-[#9a9db4] -translate-x-1/2 whitespace-nowrap" style={{left:'calc(38px + 150px + 28px + 64% * 0.6)'}}>Class average</div>
                </div>
              </div>
            </CardContent>
          </div>

          {/* ── Confidence Calibration ──────────────────────── */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-xl">
            <CardContent className="p-[18px]">
              <div className="flex items-center">
                <span className="text-[11px] font-semibold tracking-[0.08em] text-[#6c6f8a] uppercase">Confidence Calibration</span>
                <InfoI/>
              </div>
              <p className="text-xs text-[#6c6f8a] mt-1 mb-3.5">Your self-rated confidence vs actual quiz score — per topic</p>
              <div className="grid gap-5" style={{gridTemplateColumns:'220px 1fr 240px', alignItems:'stretch'}}>

                {/* Legend */}
                <div className="flex flex-col gap-3 text-xs">
                  {[
                    {c:'bg-[#29c089]',dash:false,label:'Well calibrated',  lc:'text-[#29c089]',desc:'Your confidence matches your performance'},
                    {c:'bg-[#f3a23a]',dash:false,label:'Overconfident',     lc:'text-[#f3a23a]',desc:'You rated higher than your actual score'},
                    {c:'bg-[#6d5cf6]',dash:false,label:'Underconfident',    lc:'text-[#6d5cf6]',desc:'You rated lower than your actual score'},
                    {c:'',            dash:true, label:'Perfect line',      lc:'text-[#11132b]',desc:'Ideal calibration'},
                  ].map(l=>(
                    <div key={l.label} className="grid gap-2" style={{gridTemplateColumns:'12px 1fr', alignItems:'start'}}>
                      {l.dash
                        ? <span className="block mt-2" style={{width:14,height:2,background:'repeating-linear-gradient(to right,#9a9db4 0,#9a9db4 3px,transparent 3px,transparent 6px)'}}/>
                        : <span className={`w-2 h-2 rounded-full ${l.c} mt-1.5 block`}/>
                      }
                      <div>
                        <div className={`font-semibold ${l.lc}`}>{l.label}</div>
                        <div className="text-[11px] text-[#6c6f8a] mt-0.5 leading-snug">{l.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Scatter */}
                <div className="grid gap-1" style={{gridTemplateColumns:'14px 1fr'}}>
                  <div className="text-[11px] text-[#6c6f8a] text-center" style={{writingMode:'vertical-rl',transform:'rotate(180deg)'}}>Actual quiz score →</div>
                  <div>
                    <svg viewBox="0 0 440 260" width="100%" preserveAspectRatio="xMidYMid meet">
                      <g stroke="#eef0f7" strokeWidth="1">
                        {[20,70,120,170,220].map(y=><line key={y} x1="40" y1={y} x2="430" y2={y}/>)}
                        {[118,196,274,352].map(x=><line key={x} x1={x} y1="20" x2={x} y2="220"/>)}
                      </g>
                      <g fill="#9a9db4" fontSize="10">
                        {[['100%',24],['80%',74],['60%',124],['40%',174],['20%',224]].map(([l,y])=><text key={String(l)} x="32" y={Number(y)} textAnchor="end">{l}</text>)}
                      </g>
                      <g fill="#9a9db4" fontSize="10" textAnchor="middle">
                        {[['20%',118],['40%',196],['60%',274],['80%',352],['100%',430]].map(([l,x])=><text key={String(l)} x={Number(x)} y="240">{l}</text>)}
                      </g>
                      <line x1="40" y1="220" x2="430" y2="20" stroke="#c8cad9" strokeWidth="1.5" strokeDasharray="4 4"/>
                      {[[305,78],[335,55],[365,40],[240,120],[395,28]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="6" fill="#29c089"/>)}
                      {[[270,92],[295,105],[335,78]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="6" fill="#f3a23a"/>)}
                      {[[180,100],[155,140],[115,180],[90,200]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="6" fill="#6d5cf6"/>)}
                    </svg>
                    <div className="text-[11px] text-[#6c6f8a] text-center mt-1">Self-rated confidence →</div>
                  </div>
                </div>

                {/* Tip */}
                <div className="bg-[#efecff] rounded-[10px] p-3.5 text-xs text-[#11132b] leading-relaxed">
                  <div className="flex items-center gap-1.5 font-semibold mb-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6d5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.01"/></svg>
                    Tip
                  </div>
                  <p>You tend to be overconfident on <strong>Enzyme Kinetics</strong> — you rated 70% confidence but scored 62%.</p>
                  <p className="mt-2.5">Study this more before assessments.</p>
                </div>
              </div>
            </CardContent>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
