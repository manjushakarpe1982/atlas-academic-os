'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  AlertTriangle, Clock, Target, TrendingUp,
  CheckCircle2, ChevronRight, BookOpen,
  Brain, Zap, Trophy, Calendar, BarChart2,
  Star, XCircle, Plus,
} from 'lucide-react';

/* ─── Mock data ──────────────────────────────────────────────── */
const TOPICS = [
  { name:'Mitosis',               mastery:28,  emphasis:0.95, recommended:'Active Practice', done:false },
  { name:'Cellular Respiration',  mastery:44,  emphasis:0.85, recommended:'Spaced Review',   done:false },
  { name:'Enzyme Kinetics',       mastery:35,  emphasis:0.80, recommended:'Active Practice', done:false },
  { name:'Krebs Cycle',           mastery:72,  emphasis:0.65, recommended:'Quick Skim',      done:true  },
  { name:'Cell Membrane',         mastery:81,  emphasis:0.45, recommended:'Quick Skim',      done:true  },
  { name:'DNA Replication',       mastery:65,  emphasis:0.55, recommended:'Spaced Review',   done:false },
];

const GAPS = [
  { topic:'Mitosis',             gap:'When does the nuclear envelope break down?',  source:'Quiz 3 · Q4 wrong'   },
  { topic:'Enzyme Kinetics',     gap:'Michaelis-Menten kinetics formula',           source:'Quiz 3 · Q7 wrong'   },
  { topic:'Cellular Respiration',gap:'Number of ATP produced per glucose molecule', source:'Low mastery score'   },
];

const CRAM_PLAN = [
  { day:'Tonight (Tue)',  sessions:['Mitosis — 45 min (Active Practice)','Enzyme Kinetics — 30 min (Flashcards)'], highlight:true  },
  { day:'Wednesday',      sessions:['Cellular Respiration — 40 min','DNA Replication — 25 min'],                  highlight:false },
  { day:'Thursday (Exam)',sessions:['Light review only — no new topics','Skim review sheet — 20 min'],            highlight:false },
];

const SUCCESS = [
  { done:true,  label:'Upload Exam 2 review sheet'       },
  { done:true,  label:'Generate study guide for Mitosis' },
  { done:false, label:'Study Mitosis (45 min)'           },
  { done:false, label:'Study Enzyme Kinetics (30 min)'   },
  { done:false, label:'Review Cellular Respiration'      },
  { done:false, label:'Enter exam grade after Thursday'  },
];

/* ─── Countdown ──────────────────────────────────────────────── */
function Countdown() {
  const [hrs, setHrs]  = useState(42);
  const [mins, setMins]= useState(17);

  useEffect(() => {
    const t = setInterval(() => {
      setMins((m) => { if (m > 0) return m - 1; setHrs((h) => h - 1); return 59; });
    }, 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-1 text-red-600 font-extrabold">
      <Clock className="w-4 h-4" />
      <span className="text-lg">{hrs}h {mins}m</span>
    </div>
  );
}

export default function ExamModePage() {
  const [topics,      setTopics]     = useState(TOPICS);
  const [checklist,   setChecklist]  = useState(SUCCESS);
  const [gradeInput,  setGradeInput] = useState('');
  const [showGrade,   setShowGrade]  = useState(false);

  const predictedScore  = 86;
  const confidenceLow   = 81;
  const confidenceHigh  = 91;
  const daysLeft        = 2;
  const examWeight      = 20;

  const toggleTopic = (i: number) =>
    setTopics((p) => p.map((t, j) => j === i ? { ...t, done: !t.done } : t));

  const toggleCheck = (i: number) =>
    setChecklist((p) => p.map((c, j) => j === i ? { ...c, done: !c.done } : c));

  return (
    <AppLayout>
      <div className="p-6 max-w-[1100px] mx-auto">

        {/* ── Persistent exam banner ──────────────────────────── */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl px-5 py-4 mb-5 flex items-center justify-between text-white shadow-xl shadow-indigo-500/25">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-5 h-5 text-indigo-200 flex-shrink-0" />
            <div>
              <p className="text-sm font-extrabold">Exam 2 — Cell Biology &amp; Metabolism</p>
              <p className="text-xs text-indigo-200">Thursday, Nov 20 · Mendel Hall 204 · 9:00 AM · Worth {examWeight}% of final grade · Covers weeks 7–11</p>
            </div>
          </div>
          <div className="flex items-center gap-6 flex-shrink-0">
            <Countdown />
            <div className="text-right">
              <p className="text-[10px] text-indigo-200 uppercase tracking-wide">Days left</p>
              <p className="text-2xl font-extrabold">{daysLeft}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-5">
          {/* ── Left main ──────────────────────────────────────── */}
          <div className="flex-1 space-y-5">

            {/* Predicted score */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Predicted exam score</p>
              <div className="flex items-center gap-8 mb-4">
                <div className="text-center">
                  <p className="text-5xl font-extrabold text-indigo-600">{predictedScore}</p>
                  <p className="text-xs text-gray-400 mt-1">Predicted score</p>
                </div>
                <div className="w-px h-12 bg-gray-100" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-500">{confidenceLow}–{confidenceHigh}</p>
                  <p className="text-xs text-gray-400 mt-1">Confidence range</p>
                </div>
                <div className="w-px h-12 bg-gray-100" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{examWeight}%</p>
                  <p className="text-xs text-gray-400 mt-1">Of final grade</p>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                <p className="text-xs font-semibold text-green-800">
                  🎯 Score 91+ to secure an A− for the semester. Study Mitosis tonight to move prediction from 86 → ~91.
                </p>
              </div>
            </div>

            {/* Topic breakdown */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Topics on this exam</p>
              <div className="space-y-3">
                {topics.map((t, i) => (
                  <div key={t.name}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${t.done ? 'opacity-60' : 'hover:bg-gray-50'}`}>
                    <button onClick={() => toggleTopic(i)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        t.done ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-indigo-400'
                      }`}>
                      {t.done && <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />}
                    </button>

                    {/* Mastery bar */}
                    <div className="w-14 flex-shrink-0">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${
                          t.mastery < 40 ? 'bg-red-500' : t.mastery < 65 ? 'bg-orange-500' : 'bg-green-500'
                        }`} style={{ width:`${t.mastery}%` }} />
                      </div>
                      <p className="text-[9px] text-gray-400 text-center mt-0.5">{t.mastery}%</p>
                    </div>

                    <p className={`text-sm font-semibold flex-1 ${t.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {t.name}
                    </p>

                    {/* Emphasis dots */}
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((d) => (
                        <div key={d} className={`w-2 h-2 rounded-full ${d <= Math.round(t.emphasis * 5) ? 'bg-indigo-500' : 'bg-gray-100'}`} />
                      ))}
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      t.recommended === 'Active Practice' ? 'bg-red-100 text-red-700' :
                      t.recommended === 'Spaced Review'   ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {t.recommended}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1.5">
                <span>Dots = professor emphasis</span>
                <span>·</span>
                <span>Bar = your mastery</span>
              </p>
            </div>

            {/* Knowledge gaps */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-4 h-4 text-red-500" />
                <p className="text-xs font-bold text-gray-700">Things you still don&apos;t know ({GAPS.length})</p>
                <span className="text-[10px] text-gray-400 ml-auto">Shrinks as you study</span>
              </div>
              <div className="space-y-2.5">
                {GAPS.map((g, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-red-800">{g.topic}</p>
                      <p className="text-xs text-red-600 mt-0.5">{g.gap}</p>
                      <p className="text-[10px] text-red-400 mt-0.5">{g.source}</p>
                    </div>
                    <a href="/study-guide"
                      className="text-[10px] font-bold text-indigo-600 hover:underline flex-shrink-0">Study →</a>
                  </div>
                ))}
              </div>
            </div>

            {/* Enter grade (post-exam) */}
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-5">
              <p className="text-sm font-bold text-gray-700 mb-2">After the exam — enter your grade</p>
              <p className="text-xs text-gray-400 mb-3">This closes exam mode and updates your predictions for the rest of the semester.</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  placeholder="e.g. 89"
                  className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-500"
                />
                <span className="text-sm text-gray-400 font-medium">out of 100</span>
                <button
                  onClick={() => gradeInput && setShowGrade(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all ml-2">
                  Save grade
                </button>
              </div>
              {showGrade && gradeInput && (
                <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="text-xs font-semibold text-green-800">
                    Grade saved: {gradeInput}% · Exam mode closed · Predictions updated ✓
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right sidebar ──────────────────────────────────── */}
          <div className="w-[210px] flex-shrink-0 space-y-4">

            {/* Cram plan */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-3">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Cram plan</p>
              </div>
              <div className="space-y-3">
                {CRAM_PLAN.map((day, i) => (
                  <div key={i} className={`rounded-xl p-3 ${day.highlight ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50'}`}>
                    <p className={`text-[10px] font-bold mb-1.5 ${day.highlight ? 'text-indigo-700' : 'text-gray-600'}`}>
                      {day.day}
                    </p>
                    {day.sessions.map((s, j) => (
                      <p key={j} className={`text-[11px] mb-1 last:mb-0 ${day.highlight ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                        • {s}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Success checklist */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-3">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Success checklist</p>
              </div>
              <div className="space-y-1.5">
                {checklist.map((c, i) => (
                  <button key={i} onClick={() => toggleCheck(i)}
                    className="w-full flex items-start gap-2 text-left hover:bg-gray-50 p-1.5 rounded-lg transition-all">
                    {c.done
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                      : <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                    }
                    <p className={`text-[11px] ${c.done ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                      {c.label}
                    </p>
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-50">
                <p className="text-[10px] text-gray-400">
                  {checklist.filter((c) => c.done).length}/{checklist.length} completed
                </p>
              </div>
            </div>

            {/* Quick study */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-4 text-white space-y-2">
              <Zap className="w-4 h-4 text-indigo-200" />
              <p className="text-xs font-bold">Study right now</p>
              {[
                { label:'📖 Study guide', href:'/study-guide' },
                { label:'🃏 Flashcards',  href:'/flashcards'  },
                { label:'❓ Quick quiz',  href:'/quiz'        },
              ].map((a) => (
                <a key={a.label} href={a.href}
                  className="flex items-center justify-between text-[11px] font-semibold text-white bg-white/15 hover:bg-white/25 px-3 py-2 rounded-xl transition-all">
                  {a.label} <ChevronRight className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
