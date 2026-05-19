'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import {
  Pause, Square, Play, ChevronRight,
  CheckCircle2, Target, BookOpen, Brain,
  Clock, BarChart2, AlertCircle,
} from 'lucide-react';

export default function StudySessionPage() {
  const router = useRouter();
  const [seconds,  setSeconds]  = useState(45 * 60); // 45 min
  const [running,  setRunning]  = useState(true);
  const [notes,    setNotes]    = useState('');
  const [topics,   setTopics]   = useState([
    { name: 'Cell Division — Mitosis',  done: false },
    { name: 'Phase definitions',         done: false },
    { name: 'Spindle fibre function',    done: false },
    { name: 'Checkpoints',              done: false },
  ]);

  const GOAL_SECS = 45 * 60;

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

  const elapsed = GOAL_SECS - seconds;
  const progressPct = Math.round((elapsed / GOAL_SECS) * 100);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const toggleTopic = (i: number) =>
    setTopics((p) => p.map((t, j) => j === i ? { ...t, done: !t.done } : t));

  const endSession = () => router.push('/session-summary');

  return (
    <AppLayout>
      <div className="p-6 max-w-[900px] mx-auto">

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
            <span>Biology 101</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-bold text-indigo-600">Study Session</span>
          </div>
          <h1 className="text-xl font-extrabold text-gray-900">Study Session</h1>
          <p className="text-sm text-gray-400">Cell Division</p>
        </div>

        <div className="flex gap-5">
          {/* Main — timer */}
          <div className="flex-1 space-y-4">

            {/* Big timer card */}
            <div className="bg-white border-2 border-indigo-200 rounded-3xl p-8 text-center shadow-lg shadow-indigo-500/8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Time Remaining</p>

              {/* Countdown */}
              <div className="text-7xl font-extrabold text-gray-900 tracking-tight mb-2 font-mono">
                {fmt(seconds)}
              </div>

              {/* Progress ring area */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden max-w-xs">
                  <div className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${progressPct}%` }} />
                </div>
                <span className="text-xs text-gray-400 font-semibold">{progressPct}%</span>
              </div>

              <p className="text-sm text-gray-500 mb-1 font-medium">Session Goal</p>
              <p className="text-xs text-gray-400 mb-6">Understand mitosis stages</p>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setRunning(!running)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-2xl text-sm transition-all shadow-md shadow-indigo-500/25">
                  {running ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Resume</>}
                </button>
                <button onClick={endSession}
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold px-6 py-3.5 rounded-2xl text-sm transition-all">
                  <Square className="w-4 h-4" /> End Session
                </button>
              </div>
            </div>

            {/* Topics checklist */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3">
                Progress — {topics.filter((t) => t.done).length} of {topics.length} topics
              </p>
              <div className="space-y-2">
                {topics.map((t, i) => (
                  <button key={i} onClick={() => toggleTopic(i)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      t.done ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-100 hover:bg-indigo-50 hover:border-indigo-200'
                    }`}>
                    {t.done
                      ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      : <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    }
                    <span className={`text-sm font-medium ${t.done ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Session notes */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3">Session Notes</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Jot down key insights, things to remember, or questions to look up…"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:bg-white resize-none transition-all"
                rows={4}
              />
            </div>
          </div>

          {/* Right sidebar */}
          <div className="w-[210px] flex-shrink-0 space-y-4">

            {/* Session info */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Session Info</p>
              <div className="space-y-2.5">
                {[
                  { label: 'Subject',    value: 'Biology 101'    },
                  { label: 'Topic',      value: 'Cell Division'  },
                  { label: 'Duration',   value: '45 min'         },
                  { label: 'Mode',       value: 'Active Practice'},
                  { label: 'Time spent', value: `${Math.floor(elapsed/60)} min` },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between text-xs">
                    <span className="text-gray-400">{r.label}</span>
                    <span className="font-bold text-gray-800 truncate max-w-[100px] text-right">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick resources */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Quick Resources</p>
              <div className="space-y-2">
                {[
                  { label: '📖 Study Guide',  href: '/study-guide' },
                  { label: '🃏 Flashcards',   href: '/flashcards'  },
                  { label: '❓ Practice Quiz', href: '/quiz'        },
                ].map((r) => (
                  <a key={r.href} href={r.href}
                    className="flex items-center justify-between text-xs font-semibold text-gray-700 hover:text-indigo-600 p-2 rounded-xl hover:bg-indigo-50 transition-all">
                    {r.label} <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Motivational */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-4 text-white">
              <Brain className="w-5 h-5 text-indigo-200 mb-2" />
              <p className="text-xs font-bold mb-1">Stay focused!</p>
              <p className="text-[11px] text-indigo-200 leading-relaxed">
                Cell Division is your weakest topic and most likely to appear on the exam. Every minute counts.
              </p>
            </div>

            {/* End session */}
            <button onClick={endSession}
              className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
              <Square className="w-4 h-4" /> End Session Early
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
