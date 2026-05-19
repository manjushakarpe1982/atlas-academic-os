'use client';

import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import {
  Play, ChevronRight, Info, Brain, Target,
  Clock, TrendingUp, AlertTriangle, CheckCircle2,
  Zap, BarChart2, ArrowRight, Sparkles,
} from 'lucide-react';

const PLAN_TASKS = [
  {
    rank: 1, topic: 'Cell Division',   class: 'Biology 101',    duration: 45, priority: 'High Priority',
    priorityColor: 'bg-red-100 text-red-700',
    reasons: [
      'Midterm exam in 3 days',
      'Low quiz score (40% in topic)',
      'High-weightage in syllabus (24%)',
      'Weak mastery level detected (28%)',
    ],
    evidence: {
      syllabus: 'Unit 2: Cell Structure',
      professor: 'Mentioned 5 times in lectures',
      quiz: 'Score: 40% (Below average)',
      confidence: 'Low (28%)',
    },
  },
  {
    rank: 2, topic: 'DNA Replication', class: 'Biology 101',    duration: 40, priority: 'High Priority',
    priorityColor: 'bg-red-100 text-red-700',
    reasons: ['On review sheet','Mentioned 3× in lectures','Weak mastery (35%)'],
    evidence: {
      syllabus: 'Unit 2: Genetics',
      professor: 'Mentioned 3 times',
      quiz: 'Score: 45%',
      confidence: 'Low (35%)',
    },
  },
  {
    rank: 3, topic: 'Genetics',        class: 'Biology 101',    duration: 45, priority: 'Medium Priority',
    priorityColor: 'bg-yellow-100 text-yellow-700',
    reasons: ['Exam question likely','Medium mastery (55%)'],
    evidence: {
      syllabus: 'Unit 3: Genetics',
      professor: 'Mentioned 2 times',
      quiz: 'Score: 55%',
      confidence: 'Medium (55%)',
    },
  },
  {
    rank: 4, topic: 'Evolution',       class: 'Biology 101',    duration: 45, priority: 'Medium Priority',
    priorityColor: 'bg-yellow-100 text-yellow-700',
    reasons: ['Exam coverage','Review recommended'],
    evidence: {
      syllabus: 'Unit 4: Evolution',
      professor: 'Mentioned once',
      quiz: 'Score: 62%',
      confidence: 'Medium (62%)',
    },
  },
];

function EvidenceCard({ task }: { task: typeof PLAN_TASKS[0] }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mt-3">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Evidence</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Syllabus Section',  value: task.evidence.syllabus   },
          { label: 'Professor Emphasis',value: task.evidence.professor  },
          { label: 'Quiz Performance',  value: task.evidence.quiz       },
          { label: 'Confidence Level',  value: task.evidence.confidence },
        ].map((e) => (
          <div key={e.label} className="bg-white rounded-lg p-2 border border-gray-100">
            <p className="text-[9px] font-bold text-gray-400 uppercase">{e.label}</p>
            <p className="text-[11px] font-semibold text-gray-800 mt-0.5">{e.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudyPlanPage() {
  const router = useRouter();

  return (
    <AppLayout>
      <div className="p-6 max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
              <span>Home</span> <ChevronRight className="w-3 h-3" />
              <span className="text-indigo-600 font-bold">Personalised Study Plan</span>
            </p>
            <h1 className="text-2xl font-extrabold text-gray-900">Your Personalised Study Plan</h1>
            <p className="text-sm text-gray-400 mt-1 font-light">Based on AI analysis of your materials</p>
          </div>
          <button onClick={() => router.push('/study-session')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20">
            <Play className="w-4 h-4" /> Start Today&apos;s Session
          </button>
        </div>

        <div className="flex gap-5">
          {/* Left — plan tasks */}
          <div className="flex-1 space-y-4">

            {/* Why this plan banner */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-indigo-800 mb-1">Why this plan?</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      '✅ Biology Midterm in 3 days',
                      '✅ You scored low in quizzes in Cell Division',
                      '✅ These topics are high weightage',
                      '✅ Your available study time is limited',
                    ].map((r) => (
                      <span key={r} className="text-[11px] text-indigo-700 bg-white border border-indigo-100 px-2 py-1 rounded-lg font-medium">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Plan section header */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Recommended Study Order</p>
              <span className="text-[11px] text-gray-400">{PLAN_TASKS.reduce((s, t) => s + t.duration, 0)} min total</span>
            </div>

            {/* Tasks */}
            {PLAN_TASKS.map((task, i) => (
              <div key={task.rank} className={`bg-white border-2 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${
                i === 0 ? 'border-indigo-300' : 'border-gray-100 hover:border-indigo-200'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${
                    i === 0 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>{task.rank}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-sm font-extrabold text-gray-900">{task.topic}</p>
                        <p className="text-[11px] text-gray-400">{task.class}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${task.priorityColor}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-400 font-semibold">{task.duration} min</span>
                      </div>
                    </div>

                    {/* Reasons */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {task.reasons.map((r) => (
                        <span key={r} className="text-[10px] font-medium bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                          {r}
                        </span>
                      ))}
                    </div>

                    {/* Evidence */}
                    <EvidenceCard task={task} />

                    {i === 0 && (
                      <button onClick={() => router.push('/study-session')}
                        className="mt-4 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-500/20">
                        <Play className="w-3.5 h-3.5" /> Start This Topic
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button onClick={() => router.push('/home')}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all">
              View Full Plan <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right sidebar */}
          <div className="w-[220px] flex-shrink-0 space-y-4">

            {/* Plan stats */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Today&apos;s Plan</p>
              {[
                { label: 'Total time',      value: `${PLAN_TASKS.reduce((s,t)=>s+t.duration,0)} min` },
                { label: 'Topics',          value: `${PLAN_TASKS.length}` },
                { label: 'High priority',   value: `${PLAN_TASKS.filter(t=>t.priority.includes('High')).length}` },
                { label: 'Exam in',         value: '3 days' },
              ].map((r) => (
                <div key={r.label} className="flex justify-between text-xs py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-gray-400">{r.label}</span>
                  <span className="font-bold text-gray-800">{r.value}</span>
                </div>
              ))}
            </div>

            {/* Exam alert */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-xs font-bold text-red-800">Exam Alert</p>
              </div>
              <p className="text-[11px] text-red-700 leading-relaxed">
                Biology Midterm in <strong>3 days</strong>. Cell Division is your weakest topic.
              </p>
              <button onClick={() => router.push('/exam-mode')}
                className="mt-2 w-full text-[11px] font-bold text-red-600 hover:bg-red-100 py-2 rounded-xl border border-red-200 transition-all flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" /> Open Exam Mode
              </button>
            </div>

            {/* Learning style */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <Sparkles className="w-4 h-4 text-indigo-600 mb-2" />
              <p className="text-xs font-bold text-indigo-800 mb-1">AI Insight</p>
              <p className="text-[11px] text-indigo-600 leading-relaxed">
                You retain information better after active quiz practice rather than passive reading. Plan adjusted accordingly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
