'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { PageSkeleton } from '@/components/Skeleton';
import Tooltip from '@/components/Tooltip';
import {
  Play, SkipForward, Info, ChevronRight, ChevronDown,
  Clock, Brain, Search, BarChart2, TrendingUp,
  Upload, Sparkles, ArrowRight, Activity,
  Zap, Target, AlertTriangle, X, MoreVertical,
  Calendar, BookOpen,
} from 'lucide-react';

/* ─── Data ───────────────────────────────────────────────────── */
const TODAY_TASKS = [
  { id:1, class:'Biology 101', classColor:'bg-indigo-100 text-indigo-700', classDot:'bg-indigo-500', topic:'Study Cell Division — Mitosis', duration:45, priority:'High',   priorityColor:'text-red-500 bg-red-50',    reason:'Bio Midterm in 3 days · Weakest topic (28%) · High syllabus weight (24%)' },
  { id:2, class:'Biology 101', classColor:'bg-indigo-100 text-indigo-700', classDot:'bg-green-500',  topic:'DNA Replication',               duration:40, priority:'High',   priorityColor:'text-red-500 bg-red-50',    reason:'Mentioned 5× in lectures · Likely exam question' },
  { id:3, class:'Stats 201',   classColor:'bg-orange-100 text-orange-700', classDot:'bg-orange-500', topic:'Problem Set #4',               duration:40, priority:'Medium', priorityColor:'text-orange-500 bg-orange-50', reason:'Due Friday — 2 days away' },
  { id:4, class:'English 110', classColor:'bg-blue-100 text-blue-700',     classDot:'bg-blue-500',   topic:'Essay 2 — Outline',            duration:20, priority:'Medium', priorityColor:'text-orange-500 bg-orange-50', reason:'Due Monday — start now' },
];

const UPCOMING = [
  { name:'Biology Midterm',    sub:'BIO 101 · Exam',      days:3, dot:'bg-red-500',    daysColor:'text-red-500',    rowBg:'bg-red-50'    },
  { name:'Statistics Quiz 3',  sub:'STAT 201 · Quiz',     days:4, dot:'bg-orange-400', daysColor:'text-orange-500', rowBg:'bg-orange-50' },
  { name:'Biology Lab Report', sub:'BIO 101 · Deadline',  days:0, dot:'bg-violet-500', daysColor:'text-violet-600', rowBg:'bg-violet-50' },
  { name:'Statistics PS #4',   sub:'STAT 201 · Deadline', days:2, dot:'bg-amber-400',  daysColor:'text-amber-600',  rowBg:'bg-amber-50'  },
];

const WEAK_TOPICS = [
  { name:'Cell Division (Mitosis)', pct:28, color:'bg-red-500'   },
  { name:'DNA Replication',         pct:35, color:'bg-orange-500'},
  { name:'Enzyme Kinetics',         pct:44, color:'bg-amber-400' },
  { name:'Cellular Respiration',    pct:65, color:'bg-green-500' },
];

const STUDY_PROGRESS = [
  { day:'M', hrs:1.5 },{ day:'T', hrs:2.0 },{ day:'W', hrs:0.5 },
  { day:'T', hrs:2.5 },{ day:'F', hrs:1.0 },{ day:'S', hrs:3.0 },{ day:'S', hrs:2.0 },
];

/* ─── Mini bar chart ─────────────────────────────────────────── */
function MiniBarChart() {
  const max = Math.max(...STUDY_PROGRESS.map(d => d.hrs));
  return (
    <div className="flex items-end gap-1 h-10">
      {STUDY_PROGRESS.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div className={`w-full rounded-md transition-colors ${i === 5 ? 'bg-indigo-600' : 'bg-indigo-200'}`}
            style={{ height:`${(d.hrs/max)*36}px` }} />
          <span className="text-[9px] text-gray-400">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function HomePage() {
  const [loading,    setLoading]    = useState(true);
  const [tasks,      setTasks]      = useState(TODAY_TASKS);
  const [userName,   setUserName]   = useState('Ananya');
  const [showEngine, setShowEngine] = useState(false);
  const [tipDismiss, setTipDismiss] = useState(false);
    const [search,   setSearch]   = useState('');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const n = localStorage.getItem('atlas_full_name');
    if (n) setUserName(n.split(' ')[0]);
  }, []);

  const skipTask = (id: number) => setTasks(p => {
    const i = p.findIndex(t => t.id === id);
    if (i < 0) return p;
    const a = [...p]; const [t] = a.splice(i, 1); a.push(t); return a;
  });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const heroTask   = tasks[0];
  const otherTasks = tasks.slice(1);
  const doneMins   = 65; const goalMins = 150;
  const gPct       = Math.round((doneMins/goalMins)*100);
  const r = 34; const circ = 2*Math.PI*r;

  const engineScores = [
    { label:'Mastery',   value:28, color:'bg-red-500',    icon:'🧠', desc:'Your current knowledge' },
    { label:'Emphasis',  value:95, color:'bg-indigo-500', icon:'📢', desc:'Professor weight'        },
    { label:'Proximity', value:88, color:'bg-amber-500',  icon:'⏱',  desc:'Days until exam'         },
  ];

  if (loading) return <PageSkeleton />;

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#F5F5FB] p-4 md:p-6">
        <div className="max-w-[1200px] mx-auto">

          {/* ── Atlas tip banner ───────────────────────────────── */}
           {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5 gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">
              {greeting}, {userName}! 👋
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Let&apos;s make today productive.</p>
          </div>

          <div className="relative flex-1 max-w-xs hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search anything…"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/analytics"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 px-3 py-2 rounded-xl transition-all hover:bg-indigo-50">
              <Activity className="w-3.5 h-3.5" /> Analytics
            </Link>
            <Link href="/upload"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm">
              <Upload className="w-3.5 h-3.5" /> Upload
            </Link>
          </div>
        </div>

        {/* ── Conflict banner ──────────────────────────────────── */}
        <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-5">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-xs font-semibold text-amber-800">
            <strong>Atlas detected:</strong> Biology Midterm in 3 days + Statistics Quiz in 4 days. Cell Division is your weakest topic — prioritised at top of today&apos;s plan.
          </p>
          <Link href="/study-plan" className="ml-auto text-[11px] font-bold text-amber-700 hover:text-amber-900 whitespace-nowrap flex items-center gap-1">
            View plan <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
          {/* ── Main layout ──────────────────────────────────────── */}
          <div className="flex flex-col lg:flex-row gap-4 items-start">

            {/* ── LEFT ─────────────────────────────────────────── */}
            <div className="lg:w-[70%] min-w-0 space-y-4">

              {/* Hero card — image as background, text overlaid */}
              <div className="relative rounded-3xl overflow-hidden" style={{ minHeight: 280 }}>

                {/* Background image */}
                <img
                  src="https://res.cloudinary.com/mview/image/upload/atlas/homepage.webp"
                  alt="Study illustration"
                  className="absolute inset-0 w-full h-full object-cover"
                />


                {/* Text content on top */}
                <div className="relative z-10 p-6" style={{ minHeight: 280 }}>

                  {/* Top row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">Today's Focus</span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-white/70 backdrop-blur px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" /> {heroTask.duration} min
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="text-[11px] font-semibold bg-white/80 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
                      📚 {heroTask.class}
                    </span>
                    <span className="text-[11px] font-bold bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
                      High Priority
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-tight max-w-[60%]">
                    {heroTask.topic}
                  </h2>

                  {/* Reason pills */}
                  <div className="flex items-center gap-3 mb-4 flex-wrap max-w-[60%]">
                    {['Bio Midterm in 3 days', 'Weakest topic (28%)', 'High syllabus weight (24%)'].map((r) => (
                      <span key={r} className="text-[11px] text-gray-600 flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-gray-400 inline-flex items-center justify-center text-white text-[8px] flex-shrink-0">i</span>
                        {r}
                      </span>
                    ))}
                  </div>

                  {/* Why toggle */}
                  <button onClick={() => setShowEngine(!showEngine)}
                    className="flex items-center gap-2 text-sm text-gray-600 bg-white/70 backdrop-blur hover:bg-white/90 px-3.5 py-2 rounded-xl border border-white/60 mb-4 transition-all">
                    <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[9px] text-gray-500 flex-shrink-0">?</span>
                    Why is this task #1?
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showEngine ? 'rotate-180' : ''}`} />
                  </button>

                  {showEngine && (
                    <div className="bg-white/85 backdrop-blur rounded-2xl p-4 mb-4 max-w-[55%] space-y-2.5 border border-white/60">
                      {engineScores.map((s) => (
                        <div key={s.label}>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="font-semibold text-gray-700">{s.icon} {s.label}</span>
                            <span className={`font-extrabold ${s.value<40?'text-red-600':s.value<70?'text-amber-600':'text-indigo-600'}`}>{s.value}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full ${s.color} rounded-full`} style={{ width:`${s.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex items-center gap-3">
                    <Link href="/study-session"
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-lg shadow-indigo-500/30">
                      <Play className="w-4 h-4" /> Start Study Session
                    </Link>
                    <button onClick={() => skipTask(heroTask.id)}
                      className="flex items-center gap-2 bg-white/80 hover:bg-white text-gray-700 font-semibold px-5 py-3 rounded-2xl text-sm transition-all border border-white/60 backdrop-blur">
                      <SkipForward className="w-4 h-4" /> Switch Task
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats strip — 3 cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon:'🎯', label:'Study Streak',      value:'7 days',  sub:'Keep it going! 🔥',  valueColor:'text-gray-900' },
                  { icon:'📈', label:'Weekly Progress',   value:'72%',     sub:'On track ↑ 12%',      valueColor:'text-gray-900' },
                  { icon:'⏰', label:'Focus Time Today',  value:'65 min',  sub:'Great start! 🎉',     valueColor:'text-gray-900' },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl flex-shrink-0">
                      {s.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-medium">{s.label}</p>
                      <p className={`text-lg font-extrabold leading-tight ${s.valueColor}`}>{s.value}</p>
                      <p className="text-[10px] text-gray-400">{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Today's Plan full list */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <p className="text-sm font-extrabold text-gray-900">Today&apos;s Plan</p>
                    <p className="text-xs text-gray-400 hidden sm:block">Your prioritized study roadmap for today.</p>
                  </div>
                  <Link href="/study-plan" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                    View full plan <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {tasks.map((t, i) => (
                    <div key={t.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-all group">
                      <span className="text-sm font-bold text-gray-300 w-4 flex-shrink-0">{i+1}</span>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.classDot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{t.topic}</p>
                        <p className="text-[11px] text-gray-400">{t.class} · {t.duration} min</p>
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${t.priorityColor}`}>
                        {t.priority}
                      </span>
                      <button className="w-7 h-7 rounded-xl bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center flex-shrink-0 transition-all shadow-sm shadow-indigo-500/20">
                        <Play className="w-3 h-3 text-white" />
                      </button>
                      <button className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-100 transition-all flex-shrink-0">
                        <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* AI Rec footer */}
                <div className="mx-4 mb-4 mt-2 bg-[#dfdbf5] border border-indigo-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-indigo-700">AI Recommendation</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Focus on Cell Division and DNA Replication — both have exams this week and low mastery.</p>
                    </div>
                  </div>
                  <Link href="/study-plan"
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex-shrink-0">
                    View Study Plan <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ── RIGHT sidebar ───────────────────────────────── */}
            <div className="lg:w-[30%] lg:flex-shrink-0 space-y-4">

              {/* Daily Goal ring */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  {/* Ring */}
                  <div className="relative flex-shrink-0">
                    <svg width="76" height="76" viewBox="0 0 76 76">
                      <circle cx="38" cy="38" r={r} fill="none" stroke="#EEF2FF" strokeWidth="8" />
                      <circle cx="38" cy="38" r={r} fill="none" stroke="#4F46E5" strokeWidth="8"
                        strokeLinecap="round" strokeDasharray={circ}
                        strokeDashoffset={circ*(1-gPct/100)} transform="rotate(-90 38 38)"
                        style={{ transition:'stroke-dashoffset 0.8s ease' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-base font-extrabold text-indigo-600">{gPct}%</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900">Daily Goal</p>
                    <p className="text-xs text-gray-400 mt-0.5">{doneMins}m of {goalMins}m</p>
                    <p className="text-sm font-extrabold text-orange-500 mt-1">{goalMins-doneMins}m left</p>
                  </div>
                </div>

                {/* This week */}
                <div className="border-t border-gray-50 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                      <p className="text-[11px] font-bold text-gray-500">This Week</p>
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900 leading-none mb-0.5">12.4h</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mb-2">+16% vs last week</p>
                  <MiniBarChart />
                </div>
              </div>

              {/* Upcoming — matches design image exactly */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-base font-extrabold text-gray-900">Upcoming</p>
                  <Link href="/calendar" className="text-sm font-semibold text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                    View calendar <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="space-y-2">
                  {UPCOMING.map((u) => (
                    <div key={u.name} className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl ${u.rowBg}`}>
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${u.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 leading-tight">{u.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{u.sub}</p>
                      </div>
                      <span className={`text-sm font-extrabold flex-shrink-0 ${u.daysColor}`}>
                        {u.days === 0 ? 'Tomorrow' : `${u.days}d`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weak Topics */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-extrabold text-gray-900">Weak Topics</p>
                  <Link href="/study-guide" className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-0.5">
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {WEAK_TOPICS.map((t) => (
                    <div key={t.name} className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-sm">
                        {t.pct < 40 ? '🔴' : t.pct < 55 ? '🟠' : '🟡'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[11px] font-semibold text-gray-800 truncate">{t.name}</p>
                          <span className="text-[11px] font-extrabold text-gray-600 ml-2 flex-shrink-0">{t.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${t.color} rounded-full`} style={{ width:`${t.pct}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
