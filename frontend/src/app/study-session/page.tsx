'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import {
  Pause, Square, Play, ChevronRight,
  CheckCircle2, Brain, Clock, BookOpen,
  Flame, Zap,
} from 'lucide-react';

const TOPICS = [
  { name: 'Cell Division — Mitosis',  done: false },
  { name: 'Phase definitions (PPMAT)', done: false },
  { name: 'Spindle fibre function',    done: false },
  { name: 'Checkpoints & regulation', done: false },
];

const GOAL_SECS = 45 * 60;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

export default function StudySessionPage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(GOAL_SECS);
  const [running, setRunning] = useState(true);
  const [notes,   setNotes]   = useState('');
  const [topics,  setTopics]  = useState(TOPICS);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(t); router.push('/session-summary'); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, router]);

  const elapsed     = GOAL_SECS - seconds;
  const progressPct = Math.round((elapsed / GOAL_SECS) * 100);
  const doneCount   = topics.filter((t) => t.done).length;
  const elapsedMins = Math.floor(elapsed / 60);
  const circumference = 2 * Math.PI * 52;

  const toggleTopic = (i: number) =>
    setTopics((p) => p.map((t, j) => j === i ? { ...t, done: !t.done } : t));

  const endSession = () => router.push('/session-summary');

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-[960px] mx-auto">

        {/* ── Breadcrumb + header ───────────────────────────── */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
            <span>Biology 101</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-indigo-600 font-semibold">Study Session</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg md:text-xl font-extrabold text-gray-900">Cell Division</h1>
              <p className="text-xs text-gray-400 mt-0.5">Biology 101 · Active Practice · 45 min</p>
            </div>
            {/* Live status pill */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 ${
              running ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${running ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {running ? 'In session' : 'Paused'}
            </div>
          </div>
        </div>

        {/* ── Main layout ───────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* Left — timer + content */}
          <div className="flex-1 space-y-4">

            {/* ── Timer card ─────────────────────────────────── */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              {/* Progress strip at top */}
              <div className="h-1.5 bg-gray-100">
                <div className="h-full bg-indigo-500 transition-all duration-1000"
                  style={{ width: `${progressPct}%` }} />
              </div>

              <div className="p-5 md:p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">

                  {/* SVG ring timer */}
                  <div className="relative flex-shrink-0">
                    <svg width="124" height="124" viewBox="0 0 124 124">
                      {/* Track */}
                      <circle cx="62" cy="62" r="52" fill="none"
                        stroke="#EEF2FF" strokeWidth="10" />
                      {/* Progress */}
                      <circle cx="62" cy="62" r="52" fill="none"
                        stroke={running ? '#4F46E5' : '#F59E0B'}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - progressPct / 100)}
                        transform="rotate(-90 62 62)"
                        style={{ transition:'stroke-dashoffset 1s linear' }}
                      />
                    </svg>
                    {/* Time in center */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-2xl font-extrabold text-gray-900 tabular-nums leading-none">
                        {fmt(seconds)}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">remaining</p>
                    </div>
                  </div>

                  {/* Right of ring — stats + controls */}
                  <div className="flex-1 min-w-0 w-full">
                    {/* Mini stats row */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { icon:Clock,    label:'Elapsed',  value:`${elapsedMins}m`,  color:'text-indigo-600',  bg:'bg-indigo-50'  },
                        { icon:CheckCircle2,label:'Done', value:`${doneCount}/${topics.length}`, color:'text-emerald-600', bg:'bg-emerald-50' },
                        { icon:Flame,    label:'Streak',   value:'5 days',           color:'text-orange-600',  bg:'bg-orange-50'  },
                      ].map((s) => (
                        <div key={s.label} className={`${s.bg} rounded-xl p-2.5 text-center`}>
                          <s.icon className={`w-3.5 h-3.5 ${s.color} mx-auto mb-1`} />
                          <p className={`text-sm font-extrabold ${s.color} leading-none`}>{s.value}</p>
                          <p className="text-[9px] text-gray-400 mt-0.5">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Goal */}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2.5 mb-4">
                      <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">Session goal</p>
                      <p className="text-xs font-semibold text-gray-800">Understand mitosis stages &amp; checkpoints</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => setRunning(!running)}
                        className={`flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm flex-1 justify-center ${
                          running
                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                        }`}>
                        {running ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Resume</>}
                      </button>
                      <button onClick={endSession}
                        className="flex items-center gap-2 border-2 border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex-shrink-0">
                        <Square className="w-4 h-4" /> End
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Topics checklist ───────────────────────────── */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Topics covered</p>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width:`${(doneCount/topics.length)*100}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">{doneCount}/{topics.length}</span>
                </div>
              </div>
              <div className="space-y-2">
                {topics.map((t, i) => (
                  <button key={i} onClick={() => toggleTopic(i)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all border-2 ${
                      t.done
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-gray-50 border-transparent hover:border-indigo-200 hover:bg-indigo-50/30'
                    }`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      t.done ? 'bg-emerald-500' : 'border-2 border-gray-300'
                    }`}>
                      {t.done && <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <span className={`text-sm font-medium flex-1 ${t.done ? 'text-emerald-700 line-through' : 'text-gray-800'}`}>
                      {t.name}
                    </span>
                    {t.done && <span className="text-[10px] font-bold text-emerald-600 flex-shrink-0">✓ Done</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Session notes ──────────────────────────────── */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
              <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-3">Session Notes</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Jot down key insights, things to remember, or questions to revisit…"
                className="w-full bg-gray-50 border border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:bg-white rounded-xl p-3.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none resize-none transition-all"
                rows={4}
              />
              <p className="text-[10px] text-gray-400 mt-1.5">Notes are saved with your session summary</p>
            </div>
          </div>

          {/* ── Right sidebar ────────────────────────────────── */}
          <div className="lg:w-[200px] lg:flex-shrink-0 space-y-3">

            {/* Session info */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Session</p>
              <div className="divide-y divide-gray-50 space-y-0">
                {[
                  { label:'Subject',   value:'Biology 101'      },
                  { label:'Topic',     value:'Cell Division'    },
                  { label:'Duration',  value:'45 min'           },
                  { label:'Mode',      value:'Active Practice'  },
                  { label:'Elapsed',   value:`${elapsedMins} min` },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between text-xs py-2">
                    <span className="text-gray-400">{r.label}</span>
                    <span className="font-bold text-gray-800 text-right max-w-[100px] truncate">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI focus tip */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <p className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-widest">Focus tip</p>
              </div>
              <p className="text-[11px] text-indigo-600 leading-relaxed">
                Cell Division is your weakest topic at 28% mastery. Focus on the phase order — likely on the exam.
              </p>
            </div>

            {/* Quick resources */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Quick access</p>
              <div className="space-y-0.5">
                {[
                  { emoji:'📖', label:'Study Guide',  href:'/study-guide', desc:'Read notes' },
                  { emoji:'🃏', label:'Flashcards',   href:'/flashcards',  desc:'Test recall' },
                  { emoji:'❓', label:'Practice Quiz', href:'/quiz',        desc:'Self-test'  },
                ].map((r) => (
                  <a key={r.href} href={r.href}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-indigo-50 transition-all group">
                    <span className="text-base flex-shrink-0">{r.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-gray-800 group-hover:text-indigo-700 leading-none">{r.label}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">{r.desc}</p>
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-indigo-500 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>

            {/* End session */}
            <button onClick={endSession}
              className="w-full flex items-center justify-center gap-2 border-2 border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-xl text-sm transition-all">
              <Square className="w-4 h-4" /> End Session
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
