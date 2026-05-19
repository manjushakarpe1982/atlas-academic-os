'use client';

import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import {
  CheckCircle2, TrendingUp, ChevronRight,
  ArrowRight, Star, Brain, Clock,
  Target, BarChart2, Zap,
} from 'lucide-react';

const NEXT_PLAN = [
  { rank: 1, topic: 'Review DNA Replication',  class: 'Biology 101',   duration: 40, note: 'Still weak — 40% mastery' },
  { rank: 2, topic: 'Study Genetics Basics',   class: 'Biology 101',   duration: 45, note: 'Exam prep'                },
  { rank: 3, topic: 'Practice Quiz',           class: 'Statistics 201',duration: 30, note: 'Due Friday'              },
];

export default function SessionSummaryPage() {
  const router = useRouter();

  return (
    <AppLayout>
      <div className="p-6 max-w-[900px] mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Great work, Ananya! 🎉</h1>
          <p className="text-gray-500 font-light">You completed your study session</p>
        </div>

        <div className="flex gap-5">
          {/* Main */}
          <div className="flex-1 space-y-5">

            {/* Session stats */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-4">Session Summary</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Clock,     label: 'Time Studied',        value: '45 min',  color: 'text-indigo-600', bg: 'bg-indigo-50'  },
                  { icon: Brain,     label: 'Topics Covered',       value: '2',       color: 'text-green-600',  bg: 'bg-green-50'   },
                  { icon: TrendingUp,label: 'Confidence Improved',  value: '+12%',    color: 'text-blue-600',   bg: 'bg-blue-50'    },
                  { icon: Target,    label: 'Mastery Now',          value: '40%',     color: 'text-purple-600', bg: 'bg-purple-50'  },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
                    <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
                    <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5 leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What improved */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-4">What Improved</p>
              <div className="space-y-3">
                {[
                  { topic: 'Cell Division — Mitosis', before: 28, after: 40, delta: '+12%' },
                  { topic: 'Phase definitions',        before: 30, after: 45, delta: '+15%' },
                ].map((t) => (
                  <div key={t.topic}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-semibold text-gray-800">{t.topic}</p>
                      <span className="text-xs font-bold text-green-600">{t.delta}</span>
                    </div>
                    <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="absolute left-0 top-0 h-full bg-gray-300 rounded-full"
                        style={{ width: `${t.before}%` }} />
                      <div className="absolute left-0 top-0 h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${t.after}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                      <span>Before: {t.before}%</span>
                      <span>Now: {t.after}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Updated plan */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Plan Updated!</p>
                <span className="text-[11px] text-indigo-600 font-semibold">Based on your progress</span>
              </div>
              <p className="text-sm text-gray-600 mb-3 font-light">
                Atlas has updated your plan based on what you covered. Here&apos;s your next recommended session:
              </p>
              <div className="space-y-2.5">
                {NEXT_PLAN.map((t) => (
                  <div key={t.rank}
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition-all">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {t.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{t.topic}</p>
                      <p className="text-[11px] text-gray-400">{t.class} · {t.note}</p>
                    </div>
                    <span className="text-xs text-gray-400 font-semibold flex-shrink-0">{t.duration} min</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's next */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
              <p className="text-sm font-bold text-indigo-800 mb-1">What&apos;s Next?</p>
              <p className="text-xs text-indigo-600 mb-3 font-light">
                Practice quiz on Cell Division to lock in what you just learned — best done within 10 minutes of studying.
              </p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => router.push('/quiz')}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-500/20">
                  <Target className="w-3.5 h-3.5" /> Practice Quiz on Cell Division
                </button>
                <button onClick={() => router.push('/home')}
                  className="flex items-center gap-1.5 border border-indigo-300 text-indigo-700 font-semibold px-4 py-2.5 rounded-xl text-xs hover:bg-white transition-all">
                  View Full Plan <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="w-[200px] flex-shrink-0 space-y-4">

            {/* Self rating */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Rate your session</p>
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5].map((r) => (
                  <Star key={r} className={`w-5 h-5 ${r <= 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <p className="text-[10px] text-gray-400">4/5 — Good session</p>
            </div>

            {/* Streak */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <p className="text-lg font-extrabold text-orange-600 mb-0.5">🔥 5 days</p>
              <p className="text-xs font-bold text-orange-700">Study streak!</p>
              <p className="text-[11px] text-orange-500 mt-1 font-light">Keep going tomorrow to hit 6 days</p>
            </div>

            {/* Quick next actions */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Next actions</p>
              {[
                { label: '❓ Take a quiz',       href: '/quiz'          },
                { label: '🃏 Review flashcards', href: '/flashcards'    },
                { label: '🏠 Go to dashboard',   href: '/home'          },
                { label: '📊 View analytics',    href: '/analytics'     },
              ].map((a) => (
                <a key={a.href} href={a.href}
                  className="flex items-center justify-between text-xs font-semibold text-gray-700 hover:text-indigo-600 p-2 rounded-xl hover:bg-indigo-50 transition-all">
                  {a.label} <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
