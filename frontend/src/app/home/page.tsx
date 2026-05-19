'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import {
  Play, SkipForward, Info, ChevronRight, AlertTriangle,
  Clock, TrendingUp, Zap, Brain, Search, Bell,
  BarChart2, CheckCircle2, RotateCcw, Target,
  BookOpen, Upload, Sparkles, ArrowRight,
  Calendar, Star, Activity,
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
  { name: 'Biology Midterm',   date: 'May 26, 2026', daysLeft: 3,  color: 'text-red-600',    dot: 'bg-red-500'    },
  { name: 'Statistics Quiz 3', date: 'May 27, 2026', daysLeft: 4,  color: 'text-orange-600', dot: 'bg-orange-500' },
];

const WEAK_TOPICS = [
  { name: 'Cell Division',    pct: 28, color: 'bg-red-500',    label: 'Low mastery'    },
  { name: 'Probability',      pct: 45, color: 'bg-orange-500', label: 'Medium mastery' },
  { name: 'DNA Replication',  pct: 52, color: 'bg-orange-400', label: 'Medium mastery' },
];

const CLASSES_OVERVIEW = [
  { name: 'Biology 101',    prof: 'Prof. Smith',    pct: 72, color: 'bg-indigo-500', dot: 'bg-indigo-500' },
  { name: 'Statistics',     prof: 'Prof. Johnson',  pct: 64, color: 'bg-green-500',  dot: 'bg-green-500'  },
  { name: 'History',        prof: 'Prof. Williams', pct: 58, color: 'bg-yellow-500', dot: 'bg-yellow-500' },
  { name: 'Computer Science',prof: 'Prof. Brown',   pct: 80, color: 'bg-purple-500', dot: 'bg-purple-500' },
];

const UPCOMING_DEADLINES = [
  { name: 'Biology Lab Report',      class: 'Bio',   date: 'Tomorrow',  urgency: 'high'   },
  { name: 'Statistics Problem Set',  class: 'Stats', date: '2 days left',urgency: 'high'  },
  { name: 'History Essay',           class: 'Hist',  date: '2 days left',urgency: 'medium'},
];

const RECENT_ACTIVITY = [
  { icon: '📄', action: 'Syllabus uploaded',      detail: 'Biology_Syllabus.pdf',  time: '2h ago' },
  { icon: '📖', action: 'Study guide generated',  detail: 'Cell Division, Mitosis', time: '4h ago' },
  { icon: '✅', action: 'Quiz completed',          detail: 'Statistics Quiz 2',      time: 'Yesterday' },
];

const STUDY_PROGRESS = [
  { day: 'Mon', hrs: 1.5 }, { day: 'Tue', hrs: 2.0 }, { day: 'Wed', hrs: 0.5 },
  { day: 'Thu', hrs: 2.5 }, { day: 'Fri', hrs: 1.0 }, { day: 'Sat', hrs: 3.0 }, { day: 'Sun', hrs: 2.0 },
];

/* ─── Mini bar chart ─────────────────────────────────────────── */
function MiniBarChart({ data }: { data: { day: string; hrs: number }[] }) {
  const max = Math.max(...data.map((d) => d.hrs));
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div
            className="w-full rounded-sm bg-indigo-200 hover:bg-indigo-500 transition-colors cursor-pointer"
            style={{ height: `${(d.hrs / max) * 44}px` }}
            title={`${d.day}: ${d.hrs}h`}
          />
          <span className="text-[9px] text-gray-400 font-medium">{d.day[0]}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Hero task card ─────────────────────────────────────────── */
function HeroTask({ task, onStart, onSkip }: {
  task: typeof TODAY_TASKS[0];
  onStart: () => void;
  onSkip: () => void;
}) {
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

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3.5 py-2.5 mb-4">
        <div className="flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">{task.reason}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/study-session"
          onClick={onStart}
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

/* ─── Secondary task ─────────────────────────────────────────── */
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
export default function HomePage() {
  const [tasks,    setTasks]    = useState(TODAY_TASKS);
  const [userName, setUserName] = useState('Ananya');
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

  return (
    <AppLayout>
      <div className="p-5 max-w-[1300px] mx-auto">

        {/* ── Top header ──────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5 gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">
              {greeting}, {userName}! 👋
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Let&apos;s make today productive.</p>
          </div>

          {/* Global search */}
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

        {/* ── Main 3-col grid ──────────────────────────────────── */}
        <div className="grid grid-cols-12 gap-4">

          {/* ── COL 1: Today's Plan (5 cols) ─────────────────── */}
          <div className="col-span-12 lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Today&apos;s Plan</p>
              <Link href="/study-plan" className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                View full plan <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <HeroTask
              task={heroTask}
              onStart={() => {}}
              onSkip={() => skipTask(heroTask.id)}
            />

            {otherTasks.map((t, i) => (
              <TaskRow key={t.id} task={t} rank={i + 2} onSkip={() => skipTask(t.id)} />
            ))}

            {/* AI Recommendation card */}
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

          {/* ── COL 2: Middle panels (4 cols) ────────────────── */}
          <div className="col-span-12 lg:col-span-4 space-y-4">

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
          </div>

          {/* ── COL 3: Right panels (3 cols) ─────────────────── */}
          <div className="col-span-12 lg:col-span-3 space-y-4">

            {/* Study Progress */}
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

            {/* Recent Activity */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3">Recent Activity</p>
              <div className="space-y-2.5">
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-base flex-shrink-0 mt-0.5">{a.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-gray-800">{a.action}</p>
                      <p className="text-[10px] text-gray-400 truncate">{a.detail}</p>
                    </div>
                    <span className="text-[10px] text-gray-300 flex-shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Upload Material',     href: '/upload',      icon: Upload,   bg: 'bg-indigo-50',  text: 'text-indigo-600' },
                  { label: 'Generate Study Guide', href: '/study-guide', icon: BookOpen, bg: 'bg-green-50',   text: 'text-green-600'  },
                  { label: 'Start Quiz',           href: '/quiz',        icon: Target,   bg: 'bg-yellow-50',  text: 'text-yellow-600' },
                  { label: 'Enter Exam Mode',      href: '/exam-mode',   icon: Zap,      bg: 'bg-red-50',     text: 'text-red-600'    },
                ].map((a) => (
                  <Link key={a.href} href={a.href}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl ${a.bg} hover:shadow-sm transition-all text-center cursor-pointer`}>
                    <a.icon className={`w-4 h-4 ${a.text}`} />
                    <span className={`text-[10px] font-bold ${a.text} leading-tight`}>{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
