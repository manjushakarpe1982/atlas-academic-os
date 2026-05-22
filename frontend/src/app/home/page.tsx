'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { PageSkeleton } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';
import Tooltip from '@/components/Tooltip';
import {
  Play, SkipForward, Info, ChevronRight, ChevronDown, AlertTriangle,
  Clock, Zap, Brain, Search,
  BarChart2, Target, BookOpen, Upload, Sparkles, ArrowRight,
  Activity,
} from 'lucide-react';

/* ─── Mock data ──────────────────────────────────────────────── */
const TODAY_TASKS = [
  {
    id: 1, class: 'Biology 101', classColor: 'bg-indigo-100 text-indigo-700', classDot: 'bg-indigo-500',
    topic: 'Study Cell Division — Mitosis', duration: 45, mode: 'Active Practice', priority: 'High Priority',
    priorityColor: 'bg-red-100 text-red-600',
    reason: 'Bio Midterm in 3 days · Low quiz score (40% in topic) · High-weightage in syllabus (24%) · Weak mastery detected (28%)',
  },
  {
    id: 2, class: 'Biology 101', classColor: 'bg-indigo-100 text-indigo-700', classDot: 'bg-indigo-500',
    topic: 'DNA Replication', duration: 40, mode: 'Flashcards', priority: 'High Priority',
    priorityColor: 'bg-red-100 text-red-600',
    reason: 'Mentioned 5× in lectures · On review sheet · Exam question likely',
  },
  {
    id: 3, class: 'Statistics 201', classColor: 'bg-green-100 text-green-700', classDot: 'bg-green-500',
    topic: 'Problem Set #4', duration: 40, mode: 'Practice', priority: 'Medium Priority',
    priorityColor: 'bg-yellow-100 text-yellow-700',
    reason: 'Due Friday — 2 days away',
  },
  {
    id: 4, class: 'English 110', classColor: 'bg-yellow-100 text-yellow-700', classDot: 'bg-yellow-500',
    topic: 'Essay 2 — Outline', duration: 20, mode: 'Writing', priority: 'Medium Priority',
    priorityColor: 'bg-yellow-100 text-yellow-700',
    reason: 'Due Monday — start now to avoid Sunday panic',
  },
];

const UPCOMING_EXAMS = [
  { name: 'Biology Midterm',   date: 'May 26, 2026', daysLeft: 3, color: 'text-red-600',    dot: 'bg-red-500'    },
  { name: 'Statistics Quiz 3', date: 'May 27, 2026', daysLeft: 4, color: 'text-orange-600', dot: 'bg-orange-500' },
];

const WEAK_TOPICS = [
  { name: 'Cell Division',   pct: 28, color: 'bg-red-500',    label: 'Low mastery'    },
  { name: 'Probability',     pct: 45, color: 'bg-orange-500', label: 'Medium mastery' },
  { name: 'DNA Replication', pct: 52, color: 'bg-orange-400', label: 'Medium mastery' },
];

const CLASSES_OVERVIEW = [
  { name: 'Biology 101',     prof: 'Prof. Smith',    pct: 72, color: 'bg-indigo-500', dot: 'bg-indigo-500' },
  { name: 'Statistics',      prof: 'Prof. Johnson',  pct: 64, color: 'bg-green-500',  dot: 'bg-green-500'  },
  { name: 'History',         prof: 'Prof. Williams', pct: 58, color: 'bg-yellow-500', dot: 'bg-yellow-500' },
  { name: 'Computer Science',prof: 'Prof. Brown',    pct: 80, color: 'bg-purple-500', dot: 'bg-purple-500' },
];

const UPCOMING_DEADLINES = [
  { name: 'Biology Lab Report',     date: 'Tomorrow',   urgency: 'high'   },
  { name: 'Statistics Problem Set', date: '2 days left', urgency: 'high'   },
  { name: 'History Essay',          date: '2 days left', urgency: 'medium' },
];

const RECENT_ACTIVITY = [
  { icon: '📄', action: 'Syllabus uploaded',     detail: 'Biology_Syllabus.pdf',   time: '2h ago'    },
  { icon: '📖', action: 'Study guide generated', detail: 'Cell Division, Mitosis',  time: '4h ago'    },
  { icon: '✅', action: 'Quiz completed',         detail: 'Statistics Quiz 2',       time: 'Yesterday' },
];

const STUDY_PROGRESS = [
  { day: 'Mon', hrs: 1.5 }, { day: 'Tue', hrs: 2.0 }, { day: 'Wed', hrs: 0.5 },
  { day: 'Thu', hrs: 2.5 }, { day: 'Fri', hrs: 1.0 }, { day: 'Sat', hrs: 3.0 }, { day: 'Sun', hrs: 2.0 },
];

/* flashcards due per class */
const FLASHCARD_DECKS = [
  { class: 'Biology 101',    cards: 14, dot: 'bg-indigo-500', color: 'text-indigo-600' },
  { class: 'Statistics 201', cards: 6,  dot: 'bg-green-500',  color: 'text-green-600'  },
  { class: 'History 105',    cards: 4,  dot: 'bg-yellow-500', color: 'text-yellow-600' },
];

/* ─── Mini bar chart ─────────────────────────────────────────── */
function MiniBarChart({ data }: { data: { day: string; hrs: number }[] }) {
  const max = Math.max(...data.map((d) => d.hrs));
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div
            className="w-full rounded-sm bg-indigo-300 hover:bg-indigo-600 transition-colors cursor-pointer"
            style={{ height: `${(d.hrs / max) * 44}px` }}
            title={`${d.day}: ${d.hrs}h`}
          />
          <span className="text-[9px] text-gray-400 font-medium">{d.day[0]}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── What can I skip today? ─────────────────────────────────── */
function SkipTodayCard() {
  const [open, setOpen] = useState(false);
  const SKIPPABLE = [
    { topic:'Krebs Cycle',     class:'Biology 101',    mastery:72, reason:'Already strong at 72% — skim later this week',    safe:true  },
    { topic:'English Essay outline', class:'English 301', mastery:65, reason:'Due Monday — safe to push to Sunday evening',   safe:true  },
    { topic:'Stats Ch.9 reading',class:'Statistics 201', mastery:60, reason:'Low quiz value — covers it again next week',     safe:true  },
    { topic:'Mitosis',         class:'Biology 101',    mastery:28, reason:'Exam Thursday — skipping this risks your grade',   safe:false },
  ];
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-4">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-all">
        <div className="flex items-center gap-2.5">
          <span className="text-base">⏭</span>
          <div className="text-left">
            <p className="text-sm font-extrabold text-gray-900">What can I skip today?</p>
            <p className="text-[10px] text-gray-400">Atlas identifies your lowest-risk tasks to drop</p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${open ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
          {open ? '▲ Close' : '▼ Show'}
        </span>
      </button>
      {open && (
        <div className="border-t border-gray-50 divide-y divide-gray-50">
          {SKIPPABLE.map((s) => (
            <div key={s.topic} className={`flex items-start gap-3 px-4 py-3 ${s.safe ? 'hover:bg-gray-50' : 'bg-red-50/30'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${s.safe ? 'bg-emerald-100' : 'bg-red-100'}`}>
                <span className="text-[10px]">{s.safe ? '✓' : '✗'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-gray-900">{s.topic}</p>
                  <span className="text-[9px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{s.class}</span>
                  <span className="text-[9px] font-bold text-gray-400">{s.mastery}% mastery</span>
                </div>
                <p className={`text-[11px] mt-0.5 ${s.safe ? 'text-gray-500' : 'text-red-600 font-semibold'}`}>{s.reason}</p>
              </div>
              {s.safe && (
                <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:bg-indigo-50 px-2.5 py-1 rounded-lg transition-all flex-shrink-0">
                  Skip
                </button>
              )}
            </div>
          ))}
          <div className="px-4 py-2.5 bg-gray-50/50">
            <p className="text-[10px] text-gray-400">⚠️ Skipping tasks with exams in &lt;3 days is not recommended by Atlas.</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Streak & milestone banner ─────────────────────────────── */
function StreakBanner() {
  const streak = 5;
  const milestones = [
    { days:3,  label:'3-day streak',  done:true  },
    { days:7,  label:'Week warrior',  done:false },
    { days:14, label:'2-week grind',  done:false },
    { days:30, label:'Month master',  done:false },
  ];
  const next = milestones.find((m) => !m.done);
  const pct  = next ? Math.round((streak / next.days) * 100) : 100;

  return (
    <div className="bg-white border border-orange-200 rounded-2xl px-4 py-3.5 flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center flex-shrink-0">
        <span className="text-xl">🔥</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="text-sm font-extrabold text-gray-900">{streak}-day study streak</p>
          <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width:`${pct}%` }} />
          </div>
          <p className="text-[10px] text-gray-400 whitespace-nowrap">{streak}/{next?.days} → 🏆 {next?.label}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero task ──────────────────────────────────────────────── */
function HeroTask({ task, onStart, onSkip }: {
  task: typeof TODAY_TASKS[0];
  onStart: () => void;
  onSkip: () => void;
}) {
  const [showEngine, setShowEngine] = useState(false);

  const engineScores = [
    { label:'Mastery',   value:28,   max:100, color:'bg-red-500',    desc:'Your current knowledge of this topic',            icon:'🧠' },
    { label:'Emphasis',  value:95,   max:100, color:'bg-indigo-500', desc:'How much your professor weighted it in lectures',  icon:'📢' },
    { label:'Proximity', value:88,   max:100, color:'bg-amber-500',  desc:'How soon you\'ll be tested on this topic',         icon:'⏱' },
    { label:'Urgency',   value:91,   max:100, color:'bg-red-400',    desc:'Overall pressure score for this class',            icon:'🎯' },
  ];

  return (
    <div className="bg-white border-2 border-indigo-300 rounded-2xl p-5 shadow-lg shadow-indigo-500/10">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0">1</div>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${task.classColor}`}>{task.class}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${task.priorityColor}`}>{task.priority}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-bold">{task.duration} min</span>
        </div>
      </div>

      <h2 className="text-lg font-extrabold text-gray-900 mb-3">{task.topic}</h2>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3.5 py-2.5 mb-3">
        <div className="flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">{task.reason}</p>
        </div>
      </div>

      {/* Why this task — engine breakdown */}
      <button onClick={() => setShowEngine(!showEngine)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border-2 transition-all mb-3 ${
          showEngine
            ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
            : 'bg-gray-50 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-gray-700 hover:text-indigo-700'
        }`}>
        <div className="flex items-center gap-2">
          <span className="text-base">🔍</span>
          <span className="text-sm font-bold">Why is this task #1?</span>
          <Tooltip text="The engine ranks tasks using 4 signals: Mastery (how well you know it), Emphasis (professor weight), Proximity (how soon you're tested), and Urgency (overall class pressure)." position="right" width="w-64" />
        </div>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${showEngine ? 'rotate-180 text-indigo-600' : 'text-gray-400'}`} />
      </button>

      {showEngine && (
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 mb-3 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">⚙️</span>
            <p className="text-xs font-extrabold text-indigo-800 uppercase tracking-widest">
              Engine scores
            </p>
            <code className="ml-auto text-[10px] font-bold text-indigo-500 bg-indigo-100 px-2 py-0.5 rounded-lg hidden sm:block">
              priority = emphasis × mastery_gap × proximity
            </code>
          </div>
          {engineScores.map((s) => (
            <div key={s.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{s.icon}</span>
                  <p className="text-sm font-bold text-gray-900">{s.label}</p>
                  <p className="text-xs text-gray-500 hidden sm:block">— {s.desc}</p>
                </div>
                <span className={`text-sm font-extrabold px-2.5 py-0.5 rounded-lg ${
                  s.value < 40 ? 'text-red-700 bg-red-100' :
                  s.value < 70 ? 'text-amber-700 bg-amber-100' :
                                  'text-indigo-700 bg-indigo-100'
                }`}>
                  {s.label === 'Mastery' ? `${s.value}% ← LOW` : `${s.value}%`}
                </span>
              </div>
              <div className="h-2.5 bg-white border border-indigo-100 rounded-full overflow-hidden shadow-inner">
                <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width:`${s.value}%` }} />
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-indigo-200 mt-1">
            <p className="text-xs font-semibold text-indigo-700">
              📊 Low mastery (28%) × high emphasis (95%) × close exam (88%) = <strong>#1 priority today</strong>
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Link href="/study-session" onClick={onStart}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/25">
          <Play className="w-4 h-4" /> Start Study Session
        </Link>
        <button onClick={onSkip}
          className="flex items-center gap-2 border border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 font-medium px-4 py-2.5 rounded-xl text-sm transition-all">
          <SkipForward className="w-4 h-4" /> Switch task
        </button>
      </div>
    </div>
  );
}

/* ─── Secondary task row ─────────────────────────────────────── */
function TaskRow({ task, rank, onSkip }: { task: typeof TODAY_TASKS[0]; rank: number; onSkip: () => void }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:border-indigo-200 hover:shadow-sm transition-all group shadow-sm">
      <div className="w-6 h-6 rounded-full border-2 border-gray-200 text-gray-400 text-xs font-bold flex items-center justify-center flex-shrink-0 group-hover:border-indigo-400 group-hover:text-indigo-600 transition-all">
        {rank}
      </div>
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.classDot}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{task.topic}</p>
        <p className="text-[11px] text-gray-400 truncate">{task.class} · {task.reason}</p>
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${task.priorityColor}`}>
        {task.priority.split(' ')[0]}
      </span>
      <span className="text-xs text-gray-400 font-semibold flex-shrink-0">{task.duration}m</span>
      <button onClick={onSkip}
        className="p-1 rounded-lg hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-all">
        <SkipForward className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
/* ─── Daily goal ring ────────────────────────────────────────── */
function DailyGoalRing() {
  const goalMins = 150;
  const doneMins = 65;
  const pct      = Math.min(100, Math.round((doneMins / goalMins) * 100));
  const r        = 28;
  const circ     = 2 * Math.PI * r;
  const offset   = circ * (1 - pct / 100);
  const done     = pct >= 100;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3">Daily Study Goal</p>
      <div className="flex items-center gap-3">
        {/* Ring */}
        <div className="relative flex-shrink-0">
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r={r} fill="none" stroke="#EEF2FF" strokeWidth="7" />
            <circle cx="32" cy="32" r={r} fill="none"
              stroke={done ? '#10B981' : '#4F46E5'}
              strokeWidth="7" strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              transform="rotate(-90 32 32)"
              style={{ transition:'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className={`text-sm font-extrabold leading-none ${done ? 'text-emerald-600' : 'text-indigo-600'}`}>{pct}%</p>
          </div>
        </div>
        {/* Stats */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 mb-1">{doneMins}m <span className="text-gray-400 font-normal">of {goalMins}m</span></p>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label:'Studied', value:`${doneMins}m`, color:'text-indigo-600' },
              { label:'Left',    value:`${goalMins-doneMins}m`, color:'text-amber-600' },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-lg p-1.5 text-center">
                <p className={`text-xs font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-[9px] text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Exam countdown widget ──────────────────────────────────── */
function ExamCountdown() {
  const exams = [
    { name:'Biology Midterm', subject:'BIO 101',  days:3, color:'bg-red-500',   light:'bg-red-50',   border:'border-red-100',   text:'text-red-700'   },
    { name:'Statistics Quiz', subject:'STAT 201', days:5, color:'bg-amber-500', light:'bg-amber-50', border:'border-amber-100', text:'text-amber-700' },
    { name:'English Essay',   subject:'ENG 301',  days:8, color:'bg-blue-500',  light:'bg-blue-50',  border:'border-blue-100',  text:'text-blue-700'  },
  ];
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Upcoming</p>
        <Link href="/calendar" className="text-[11px] font-semibold text-indigo-600 hover:underline">Calendar →</Link>
      </div>
      <div className="space-y-2">
        {exams.map((e) => (
          <div key={e.name} className={`flex items-center justify-between gap-2 ${e.light} border ${e.border} rounded-xl px-3 py-2`}>
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${e.color}`} />
              <div className="min-w-0">
                <p className={`text-[11px] font-bold ${e.text} truncate`}>{e.name}</p>
                <p className="text-[9px] text-gray-400">{e.subject}</p>
              </div>
            </div>
            <span className={`text-xs font-extrabold flex-shrink-0 ${e.days<=3?'text-red-600':e.days<=5?'text-amber-600':'text-gray-600'}`}>
              {e.days}d
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const [tasks,    setTasks]    = useState(TODAY_TASKS);
  const [userName, setUserName] = useState('Pooja');
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    const n = localStorage.getItem('atlas_full_name');
    if (n) setUserName(n.split(' ')[0]);
  }, []);

  const skipTask = (id: number) => {
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      if (idx < 0) return prev;
      const moved = [...prev];
      const [t] = moved.splice(idx, 1);
      moved.push(t);
      return moved;
    });
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const heroTask = tasks[0];
  const otherTasks = tasks.slice(1);
  const totalFlashcards = FLASHCARD_DECKS.reduce((s, d) => s + d.cards, 0);

  if (loading) return <PageSkeleton />;

    return (
    <AppLayout>
      <div className="p-5 max-w-[1300px] mx-auto">

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

        {/* ── 3-col grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

          {/* COL 1 — Today's Plan (5 cols) */}
          <div className="col-span-1 lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Today&apos;s Plan</p>
              <Link href="/study-plan" className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                View full plan <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <HeroTask task={heroTask} onStart={() => {}} onSkip={() => skipTask(heroTask.id)} />

            {otherTasks.map((t, i) => (
              <TaskRow key={t.id} task={t} rank={i + 2} onSkip={() => skipTask(t.id)} />
            ))}

            {/* AI Recommendation */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-4 text-white">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold mb-0.5">AI Recommendation</p>
                  <p className="text-[11px] text-indigo-100 leading-relaxed">
                    Focus more on <strong>Cell Division</strong> and <strong>DNA Replication</strong> topics based on your quiz performance and weak areas.
                  </p>
                </div>
              </div>
              <Link href="/study-plan"
                className="mt-3 flex items-center justify-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 rounded-xl transition-all">
                View Study Plan <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* COL 2 — Middle (4 cols) — exactly 3 cards */}
          <div className="col-span-1 lg:col-span-4 space-y-4">

            {/* Upcoming Exams */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Upcoming Exams</p>
                <Link href="/calendar" className="text-[11px] text-indigo-600 font-semibold hover:underline">View all</Link>
              </div>
              <div className="space-y-2.5">
                {UPCOMING_EXAMS.map((e) => (
                  <div key={e.name} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${e.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{e.name}</p>
                      <p className="text-[10px] text-gray-400">{e.date}</p>
                    </div>
                    <span className={`text-[10px] font-extrabold ${e.color} bg-white border border-gray-200 px-2 py-0.5 rounded-full`}>
                      in {e.daysLeft}d
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/exam-mode"
                className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 py-2 rounded-xl transition-all border border-indigo-100">
                <Zap className="w-3 h-3" /> Open Exam Mode
              </Link>
            </div>

            {/* Weak Topics */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Weak Topics</p>
                <Link href="/study-guide" className="text-[11px] text-indigo-600 font-semibold hover:underline">View all</Link>
              </div>
              <div className="space-y-3">
                {WEAK_TOPICS.map((t) => (
                  <div key={t.name}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-gray-800">{t.name}</p>
                      <span className={`text-[10px] font-bold ${t.pct < 40 ? 'text-red-600' : 'text-orange-600'}`}>{t.pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${t.color} rounded-full`} style={{ width: `${t.pct}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{t.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Upcoming Deadlines</p>
                <Link href="/calendar" className="text-[11px] text-indigo-600 font-semibold hover:underline">View all</Link>
              </div>
              <div className="space-y-2">
                {UPCOMING_DEADLINES.map((d) => (
                  <div key={d.name} className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${d.urgency === 'high' ? 'bg-red-500' : 'bg-orange-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{d.name}</p>
                    </div>
                    <span className={`text-[10px] font-bold ${d.urgency === 'high' ? 'text-red-600' : 'text-orange-600'}`}>
                      {d.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Flashcards Due */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Flashcards Due</p>
                <Link href="/flashcards" className="text-[11px] text-indigo-600 font-semibold hover:underline">Review all</Link>
              </div>
              <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-3.5 py-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-500/20">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-base font-extrabold text-indigo-700 leading-none">{totalFlashcards} cards</p>
                  <p className="text-[10px] text-indigo-500 font-medium mt-0.5">due for review today</p>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                {FLASHCARD_DECKS.map((d) => (
                  <div key={d.class} className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${d.dot}`} />
                    <p className="text-[11px] font-medium text-gray-700 flex-1 truncate">{d.class}</p>
                    <span className={`text-[11px] font-extrabold ${d.color}`}>{d.cards} cards</span>
                  </div>
                ))}
              </div>
              <Link href="/flashcards"
                className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-500/20">
                <Brain className="w-3.5 h-3.5" /> Start flashcard review
              </Link>
            </div>
          </div>

          {/* COL 3 — Right (3 cols) */}
          <div className="col-span-1 lg:col-span-3 space-y-4">

            {/* Daily goal ring — compact in sidebar */}
            <DailyGoalRing />

            {/* Exam countdown */}
            <ExamCountdown />

            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Study Progress</p>
                <span className="text-[10px] text-gray-400">This Week</span>
              </div>
              <p className="text-2xl font-extrabold text-gray-900 mb-0.5">12.4 hrs</p>
              <p className="text-[11px] text-green-600 font-semibold mb-3">+16% vs last week</p>
              <MiniBarChart data={STUDY_PROGRESS} />
            </div>

            {/* Classes Overview */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Classes Overview</p>
                <span className="text-[10px] text-gray-400">4 Classes</span>
              </div>
              <div className="space-y-2.5">
                {CLASSES_OVERVIEW.map((c) => (
                  <div key={c.name} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-[11px] font-semibold text-gray-700 truncate">{c.name}</p>
                        <span className="text-[10px] font-bold text-gray-500">{c.pct}%</span>
                      </div>
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                      </div>
                      <p className="text-[9px] text-gray-400 mt-0.5">{c.prof}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
