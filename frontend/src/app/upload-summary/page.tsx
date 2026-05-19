'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import {
  CheckCircle2, FileText, Brain, Calendar,
  BookOpen, Target, Zap, ChevronRight,
  Sparkles, ArrowRight, Star, AlertTriangle,
  TrendingUp, Clock,
} from 'lucide-react';

/* ─── Pipeline step ──────────────────────────────────────────── */
const PIPELINE = [
  { label: 'File uploaded',          done: true  },
  { label: 'Extracting text',        done: true  },
  { label: 'Detecting topics',       done: true  },
  { label: 'Identifying key concepts',done: true },
  { label: 'Finding important dates',done: true  },
  { label: 'Analysing difficulty',   done: true  },
  { label: 'Generating study plan',  done: true  },
];

const EXTRACTED = {
  topics:    12,
  dates:     8,
  guides:    4,
  flashcards:36,
  questions: 20,
  pages:     24,
};

const TOPICS_FOUND = [
  { name: 'Cell Division',       difficulty: 'Hard',   examLikely: true,  mastery: 28  },
  { name: 'Mitosis',             difficulty: 'Hard',   examLikely: true,  mastery: 32  },
  { name: 'DNA Replication',     difficulty: 'Hard',   examLikely: true,  mastery: 40  },
  { name: 'Krebs Cycle',         difficulty: 'Medium', examLikely: false, mastery: 65  },
  { name: 'Cellular Respiration',difficulty: 'Medium', examLikely: true,  mastery: 44  },
  { name: 'Enzyme Kinetics',     difficulty: 'Hard',   examLikely: false, mastery: 35  },
];

const DATES_FOUND = [
  { event: 'Biology Midterm',        date: 'May 26, 2026', daysLeft: 3,  type: 'exam',     urgent: true  },
  { event: 'Lab Report 3 Due',       date: 'May 22, 2026', daysLeft: 1,  type: 'deadline', urgent: true  },
  { event: 'Quiz 4 — Cell Division', date: 'May 24, 2026', daysLeft: 3,  type: 'quiz',     urgent: true  },
  { event: 'Final Exam',             date: 'Jun 10, 2026', daysLeft: 20, type: 'exam',     urgent: false },
];

const AI_SUGGESTIONS = [
  {
    label: 'Spend 1 more hour on Cell Division today',
    impact: 'High Impact',
    impactColor: 'text-red-600 bg-red-50 border-red-200',
    icon: '🧬',
  },
  {
    label: 'Take a quiz on DNA Replication',
    impact: 'Medium Impact',
    impactColor: 'text-orange-600 bg-orange-50 border-orange-200',
    icon: '❓',
  },
  {
    label: 'Review your notes in Genetics',
    impact: 'Medium Impact',
    impactColor: 'text-orange-600 bg-orange-50 border-orange-200',
    icon: '📖',
  },
  {
    label: 'Best time to study: 7PM – 9PM',
    impact: 'Schedule Tip',
    impactColor: 'text-blue-600 bg-blue-50 border-blue-200',
    icon: '⏰',
  },
  {
    label: 'You learn better with quizzes',
    impact: 'Learning Style',
    impactColor: 'text-purple-600 bg-purple-50 border-purple-200',
    icon: '🧠',
  },
];

export default function UploadSummaryPage() {
  const router = useRouter();
  const [fileName] = useState('Biology_Syllabus.pdf');
  const [step, setStep] = useState(0);

  // Animate pipeline steps on load
  useEffect(() => {
    const t = setInterval(() => {
      setStep((p) => {
        if (p >= PIPELINE.length) { clearInterval(t); return p; }
        return p + 1;
      });
    }, 280);
    return () => clearInterval(t);
  }, []);

  const allDone = step >= PIPELINE.length;

  return (
    <AppLayout>
      <div className="p-6 max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Upload</span>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Summary</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {allDone ? '✅ Your materials are ready!' : '⏳ AI is analysing your materials…'}
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-light">
            {allDone
              ? `Atlas has processed ${fileName} and generated your study plan.`
              : `Processing ${fileName} — this takes about 30 seconds…`}
          </p>
        </div>

        <div className="flex gap-5">
          {/* Left — main content */}
          <div className="flex-1 space-y-5">

            {/* AI Processing pipeline */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">AI is analysing your materials</p>
                  <p className="text-[11px] text-gray-400">
                    {allDone ? 'Processing complete' : `Step ${step} of ${PIPELINE.length}…`}
                  </p>
                </div>
                {!allDone && (
                  <div className="ml-auto flex-shrink-0">
                    <span className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin inline-block" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {PIPELINE.map((p, i) => (
                  <div key={i} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    i < step ? 'bg-green-50' : i === step ? 'bg-indigo-50' : 'bg-gray-50'
                  }`}>
                    {i < step ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : i === step ? (
                      <span className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0" />
                    )}
                    <span className={`text-[11px] font-medium ${
                      i < step ? 'text-green-700' : i === step ? 'text-indigo-700' : 'text-gray-400'
                    }`}>{p.label}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                  <span>Processing…</span>
                  <span>{Math.round((step / PIPELINE.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${(step / PIPELINE.length) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* What Atlas found */}
            {allDone && (
              <>
                {/* Stats strip */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {[
                    { icon: Brain,     label: 'Topics Extracted',    value: EXTRACTED.topics,     color: 'text-indigo-600', bg: 'bg-indigo-50'  },
                    { icon: Calendar,  label: 'Important Dates',      value: EXTRACTED.dates,      color: 'text-red-600',    bg: 'bg-red-50'     },
                    { icon: BookOpen,  label: 'Study Guides',         value: EXTRACTED.guides,     color: 'text-green-600',  bg: 'bg-green-50'   },
                    { icon: Target,    label: 'Flashcards Created',   value: EXTRACTED.flashcards, color: 'text-purple-600', bg: 'bg-purple-50'  },
                    { icon: Star,      label: 'Quiz Questions',       value: EXTRACTED.questions,  color: 'text-orange-600', bg: 'bg-orange-50'  },
                    { icon: FileText,  label: 'Pages Processed',      value: EXTRACTED.pages,      color: 'text-blue-600',   bg: 'bg-blue-50'    },
                  ].map((s) => (
                    <div key={s.label} className={`${s.bg} rounded-2xl p-3.5 text-center border border-white shadow-sm`}>
                      <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1.5`} />
                      <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                      <p className="text-[9px] text-gray-500 font-medium leading-tight mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Topics found */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-4">Topics Extracted — Ranked by Priority</p>
                  <div className="space-y-2.5">
                    {TOPICS_FOUND.map((t, i) => (
                      <div key={t.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-all">
                        <span className="text-xs font-bold text-gray-400 w-4 flex-shrink-0">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-gray-900">{t.name}</p>
                            {t.examLikely && (
                              <span className="text-[9px] font-bold bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-full">
                                Exam likely
                              </span>
                            )}
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                              t.difficulty === 'Hard' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}>{t.difficulty}</span>
                          </div>
                        </div>
                        <div className="w-20 flex-shrink-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[9px] text-gray-400">Mastery</span>
                            <span className={`text-[9px] font-bold ${t.mastery < 40 ? 'text-red-600' : 'text-orange-600'}`}>{t.mastery}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${t.mastery < 40 ? 'bg-red-500' : 'bg-orange-400'}`}
                              style={{ width: `${t.mastery}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important dates found */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-4">Important Dates Found</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {DATES_FOUND.map((d) => (
                      <div key={d.event}
                        className={`flex items-start gap-3 p-3 rounded-xl border ${
                          d.urgent ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'
                        }`}>
                        <span className="text-base flex-shrink-0 mt-0.5">
                          {d.type === 'exam' ? '📝' : d.type === 'quiz' ? '❓' : '📋'}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{d.event}</p>
                          <p className="text-[10px] text-gray-500">{d.date}</p>
                          <p className={`text-[10px] font-bold mt-0.5 ${d.urgent ? 'text-red-600' : 'text-gray-400'}`}>
                            {d.daysLeft <= 3 ? `⚠ ${d.daysLeft} days away` : `${d.daysLeft} days`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => router.push('/study-plan')}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20">
                    <Sparkles className="w-4 h-4" /> View Personalised Study Plan
                  </button>
                  <button
                    onClick={() => router.push('/study-guide')}
                    className="flex items-center gap-2 border border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-600 font-semibold px-5 py-3 rounded-xl text-sm transition-all">
                    <BookOpen className="w-4 h-4" /> Open Study Guide
                  </button>
                  <button
                    onClick={() => router.push('/home')}
                    className="flex items-center gap-2 border border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-600 font-semibold px-5 py-3 rounded-xl text-sm transition-all">
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right sidebar — AI Suggestions */}
          {allDone && (
            <div className="w-[240px] flex-shrink-0 space-y-4">

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <p className="text-xs font-extrabold text-gray-700 uppercase tracking-widest">AI Suggestions</p>
                </div>
                <p className="text-[11px] text-gray-400 mb-3 font-light">Suggestions for you based on your uploaded materials</p>
                <div className="space-y-2">
                  {AI_SUGGESTIONS.map((s, i) => (
                    <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-start gap-2">
                        <span className="text-base flex-shrink-0">{s.icon}</span>
                        <p className="text-[11px] font-semibold text-gray-800 leading-relaxed flex-1">{s.label}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border mt-2 inline-block ${s.impactColor}`}>
                        {s.impact}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => router.push('/home')}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all">
                  Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* What was generated */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                <p className="text-xs font-bold text-indigo-800 mb-3">Generated for you</p>
                <div className="space-y-2">
                  {[
                    { label: `${EXTRACTED.topics} Topics mapped`,     icon: '🗺' },
                    { label: `${EXTRACTED.guides} Study guides ready`, icon: '📖' },
                    { label: `${EXTRACTED.flashcards} Flashcards made`,icon: '🃏' },
                    { label: `${EXTRACTED.questions} Quiz questions`,  icon: '❓' },
                    { label: `${EXTRACTED.dates} Dates added to calendar`, icon: '📅' },
                  ].map((g, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-sm">{g.icon}</span>
                      <p className="text-[11px] font-semibold text-indigo-800">{g.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
