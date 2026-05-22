'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import AskAIWidget, { AskAIInline } from '@/components/AskAIWidget';
import {
  Play, ChevronRight, Brain, Clock, AlertTriangle,
  Zap, Sparkles, BookOpen, SkipForward, ChevronDown,
} from 'lucide-react';

/* ─── Data ───────────────────────────────────────────────────── */
const TASKS = [
  {
    rank: 1, topic: 'Cell Division',   class: 'Biology 101',    duration: 45,
    priority: 'High', mastery: 28,
    accentBar: 'bg-indigo-500', classBg: 'bg-indigo-50', classText: 'text-indigo-700',
    reasons: ['Midterm in 3 days', 'Quiz score 40% — weak', '24% syllabus weight', 'Mentioned 5× by professor'],
    evidence: [
      { label: 'Syllabus',     value: 'Unit 2: Cell Structure' },
      { label: 'Professor',    value: 'Mentioned 5×' },
      { label: 'Quiz score',   value: '40% — Below avg' },
      { label: 'Mastery',      value: '28% — Low' },
    ],
  },
  {
    rank: 2, topic: 'DNA Replication', class: 'Biology 101',    duration: 40,
    priority: 'High', mastery: 35,
    accentBar: 'bg-indigo-500', classBg: 'bg-indigo-50', classText: 'text-indigo-700',
    reasons: ['On review sheet', 'Mentioned 3× in lectures', 'Mastery: 35%'],
    evidence: [
      { label: 'Syllabus',   value: 'Unit 2: Genetics' },
      { label: 'Professor',  value: 'Mentioned 3×' },
      { label: 'Quiz score', value: '45%' },
      { label: 'Mastery',    value: '35% — Low' },
    ],
  },
  {
    rank: 3, topic: 'Genetics',        class: 'Biology 101',    duration: 45,
    priority: 'Medium', mastery: 55,
    accentBar: 'bg-indigo-500', classBg: 'bg-indigo-50', classText: 'text-indigo-700',
    reasons: ['Exam question likely', 'Medium mastery 55%'],
    evidence: [
      { label: 'Syllabus',   value: 'Unit 3: Genetics' },
      { label: 'Professor',  value: 'Mentioned 2×' },
      { label: 'Quiz score', value: '55%' },
      { label: 'Mastery',    value: '55% — Medium' },
    ],
  },
  {
    rank: 4, topic: 'Statistics PS#4', class: 'Statistics 201', duration: 40,
    priority: 'Medium', mastery: 72,
    accentBar: 'bg-emerald-500', classBg: 'bg-emerald-50', classText: 'text-emerald-700',
    reasons: ['Due Friday', '2 days away'],
    evidence: [
      { label: 'Syllabus',   value: 'Chapter 8' },
      { label: 'Professor',  value: 'Problem set required' },
      { label: 'Quiz score', value: '92% avg' },
      { label: 'Mastery',    value: '72% — Good' },
    ],
  },
];

/* ─── Helpers ────────────────────────────────────────────────── */
function masteryBg(p: number)   { return p < 40 ? 'bg-red-500'  : p < 60 ? 'bg-amber-500'  : 'bg-emerald-500';  }
function masteryTxt(p: number)  { return p < 40 ? 'text-red-600': p < 60 ? 'text-amber-600': 'text-emerald-600'; }
function masteryLbl(p: number)  { return p < 40 ? 'Needs work'  : p < 60 ? 'Developing'    : 'Strong';           }
function priorityCls(p: string) {
  return p === 'High'
    ? 'bg-red-100 text-red-700 border-red-200'
    : 'bg-amber-100 text-amber-700 border-amber-200';
}

/* ─── Task card ──────────────────────────────────────────────── */
function TaskCard({ task, isHero, onStart }: {
  task: typeof TASKS[0]; isHero: boolean; onStart: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`bg-white rounded-2xl overflow-hidden transition-all ${
      isHero
        ? 'border-2 border-indigo-300 shadow-lg shadow-indigo-500/10'
        : 'border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200'
    }`}>
      {/* Coloured accent strip */}
      <div className={`h-1 w-full ${isHero ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : task.accentBar}`} />

      <div className="p-4 md:p-5">

        {/* ── Row 1: rank + topic + time ──────────────────────── */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 mt-0.5 ${
            isHero ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500'
          }`}>{task.rank}</div>

          <div className="flex-1 min-w-0">
            <p className={`font-extrabold text-gray-900 leading-tight ${isHero ? 'text-base' : 'text-sm'}`}>
              {task.topic}
            </p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${task.classBg} ${task.classText}`}>
                {task.class}
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${priorityCls(task.priority)}`}>
                {task.priority} priority
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-400 flex-shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{task.duration}m</span>
          </div>
        </div>

        {/* ── Row 2: reason pills ──────────────────────────────── */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.reasons.map((r) => (
            <span key={r} className="text-[10px] font-medium bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
              {r}
            </span>
          ))}
        </div>

        {/* ── Evidence toggle ──────────────────────────────────── */}
        <button onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-[11px] font-semibold text-indigo-500 hover:text-indigo-700 mb-3 transition-colors">
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          {open ? 'Hide evidence' : 'Why this topic?'}
        </button>

        {open && (
          <div className="grid grid-cols-2 gap-2 mb-3 animate-in">
            {task.evidence.map((e) => (
              <div key={e.label} className="bg-gray-50 border border-gray-100 rounded-xl p-2.5">
                <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wide mb-0.5">{e.label}</p>
                <p className="text-[11px] font-semibold text-gray-800 leading-tight">{e.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── CTA buttons ──────────────────────────────────────── */}
        {isHero ? (
          <div className="flex items-center gap-2 pt-1">
            <button onClick={onStart}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-500/20 flex-1 sm:flex-none">
              <Play className="w-3.5 h-3.5" /> Start This Topic
            </button>
            <button className="flex items-center gap-1.5 border border-gray-200 hover:border-red-300 hover:text-red-500 text-gray-500 font-semibold px-4 py-2.5 rounded-xl text-xs transition-all">
              <SkipForward className="w-3.5 h-3.5" /> Skip
            </button>
          </div>
        ) : (
          <button onClick={onStart}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-all -ml-1">
            <BookOpen className="w-3.5 h-3.5" /> Study this topic
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function StudyPlanPage() {
  const router = useRouter();
  const totalMins = TASKS.reduce((s, t) => s + t.duration, 0);
  const highCount = TASKS.filter((t) => t.priority === 'High').length;

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-[1100px] mx-auto">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
              <span className="hover:text-indigo-600 cursor-pointer" onClick={() => router.push('/home')}>Home</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-indigo-600 font-semibold">Study Plan</span>
            </div>
            <h1 className="text-lg md:text-xl font-extrabold text-gray-900">Your Personalised Study Plan</h1>
            <p className="text-xs text-gray-400 mt-0.5">AI-generated from your materials · Updated today</p>
          </div>
          <button onClick={() => router.push('/study-session')}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20 flex-shrink-0">
            <Play className="w-4 h-4" /> Start Today&apos;s Session
          </button>
        </div>

        {/* ── Ask AI — top of page ─────────────────────────────── */}
        <AskAIInline context="study-plan" />

        {/* ── Why this plan ─────────────────────────────────────── */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-4 py-3.5 mb-5">
          <div className="flex items-start gap-2.5">
            <Brain className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-indigo-800 mb-2">Why this plan?</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Biology Midterm in 3 days',
                  'Low quiz scores in Cell Division',
                  'Topics ranked by exam weight',
                  'Adjusted for your study hours',
                ].map((r) => (
                  <span key={r} className="text-[11px] text-indigo-700 bg-white border border-indigo-100 px-2.5 py-1 rounded-lg font-medium">
                    ✓ {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Main layout ──────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* Left — task cards */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
                Recommended study order
              </p>
              <span className="text-[11px] text-gray-400 font-medium">{totalMins} min total</span>
            </div>

            {TASKS.map((task, i) => (
              <TaskCard
                key={task.rank}
                task={task}
                isHero={i === 0}
                onStart={() => router.push('/study-session')}
              />
            ))}

            <button onClick={() => router.push('/home')}
              className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-xl hover:bg-indigo-50 transition-all">
              Back to Dashboard <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right sidebar */}
          <div className="lg:w-[220px] lg:flex-shrink-0 space-y-3">

         
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">
                Today&apos;s Plan
              </p>
              <div className="divide-y divide-gray-50">
                {[
                  { label: 'Total time',    value: `${totalMins} min`, color: 'text-gray-800'    },
                  { label: 'Topics',        value: `${TASKS.length}`,  color: 'text-gray-800'    },
                  { label: 'High priority', value: `${highCount}`,     color: 'text-red-600'     },
                  { label: 'Exam in',       value: '3 days',           color: 'text-red-600'     },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center text-xs py-2">
                    <span className="text-gray-400">{r.label}</span>
                    <span className={`font-extrabold ${r.color}`}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly goal */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">
                Weekly Goal
              </p>
              <div className="flex items-end gap-1.5 mb-2">
                <p className="text-2xl font-extrabold text-indigo-600 leading-none">12.4</p>
                <p className="text-xs text-gray-400 mb-0.5">of 20h</p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '62%' }} />
              </div>
              <p className="text-[10px] text-emerald-600 font-semibold">62% · 7.6h remaining</p>
            </div>

            {/* Exam alert */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs font-extrabold text-red-800">Exam Alert</p>
              </div>
              <p className="text-[11px] text-red-700 leading-relaxed mb-2.5">
                Biology Midterm in <strong>3 days</strong>. Cell Division is weakest at 28%.
              </p>
              <button onClick={() => router.push('/exam-mode')}
                className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-red-600 hover:bg-red-100 py-2 rounded-xl border border-red-200 transition-all">
                <Zap className="w-3.5 h-3.5" /> Open Exam Mode
              </button>
            </div>

            {/* Topic mastery */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">
                Topic Mastery
              </p>
              <div className="space-y-3">
                {TASKS.map((t) => (
                  <div key={t.topic}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium text-gray-700 truncate">{t.topic}</span>
                      <span className={`text-[10px] font-extrabold flex-shrink-0 ml-2 ${masteryTxt(t.mastery)}`}>
                        {t.mastery}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${masteryBg(t.mastery)} rounded-full`}
                        style={{ width: `${t.mastery}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <p className="text-xs font-extrabold text-indigo-800">AI Insight</p>
              </div>
              <p className="text-[11px] text-indigo-600 leading-relaxed">
                You retain information better with active quiz practice rather than passive reading. Your plan includes more quiz tasks today.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
