'use client';
import Link from 'next/link';
import { CheckCircle2, Circle, ChevronRight, ArrowRight, Brain } from 'lucide-react';

export default function DashboardHome() {
  return (
    <div className="px-4 py-4 space-y-5 pb-24">

      {/* ── Greeting ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Good Morning, Pooja 🎓</h1>
          <p className="text-sm text-gray-400 mt-0.5">Let&apos;s make today productive!</p>
        </div>
        <div className="w-10 h-10 flex items-center justify-center">
          <span className="text-3xl">🏆</span>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">📅</span>
          <div>
            <p className="text-xl font-extrabold text-gray-900">3</p>
            <p className="text-xs text-gray-400 leading-tight">Deadlines this week</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <p className="text-xl font-extrabold text-gray-900">2</p>
            <p className="text-xs text-gray-400 leading-tight">High priority tasks</p>
          </div>
        </div>
      </div>

      {/* ── What to Study First ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 pt-3 pb-1">
          <p className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest mb-2">What to Study First</p>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
              📝
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base font-extrabold text-gray-900">Biology Quiz</p>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-red-600 bg-red-50">
                  High
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                📅 Tomorrow · Worth 30%
              </p>
              <p className="text-xs text-gray-500 mt-1">Reason: High grade impact + close deadline</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-3">
          <Link href="/dashboard/study-plan"
            className="flex items-center justify-between w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-2xl text-sm transition-all shadow-md">
            Start Studying <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── Today's Study Plan ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900">Today&apos;s Study Plan</h2>
          <Link href="/dashboard/study-plan" className="text-xs text-indigo-600 font-semibold">View all</Link>
        </div>
        <div className="space-y-3">
          {/* Biology 1107 — 45 min — done */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🌿</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Biology 1107</p>
              <p className="text-xs text-gray-400">45 min</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          </div>

          {/* Calculus 251 — 30 min — done */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-sm">📐</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Calculus 251</p>
              <p className="text-xs text-gray-400">30 min</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          </div>

          {/* Chemistry 101 — 20 min — not done */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-sm">⚗️</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Chemistry 101</p>
              <p className="text-xs text-gray-400">20 min</p>
            </div>
            <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
          </div>
        </div>

        <Link href="/dashboard/study-plan"
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 mt-4 hover:text-indigo-800 transition-colors">
          View Full Study Plan <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ── Upcoming Deadlines ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900">Upcoming Deadlines</h2>
          <Link href="/dashboard/assignments" className="text-xs text-indigo-600 font-semibold">View all</Link>
        </div>
        <div className="space-y-2">
          {/* Biology Quiz */}
          <div className="flex items-center gap-3 py-1.5">
            <p className="text-xs text-gray-400 w-20 flex-shrink-0">Tomorrow</p>
            <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
              📝
            </div>
            <p className="flex-1 text-sm font-semibold text-gray-800 truncate">Biology Quiz</p>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-red-600 bg-red-50 flex-shrink-0">
              High
            </span>
          </div>

          {/* Calculus Homework */}
          <div className="flex items-center gap-3 py-1.5">
            <p className="text-xs text-gray-400 w-20 flex-shrink-0">Fri, May 17</p>
            <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
              📄
            </div>
            <p className="flex-1 text-sm font-semibold text-gray-800 truncate">Calculus Homework</p>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-amber-600 bg-amber-50 flex-shrink-0">
              Medium
            </span>
          </div>

          {/* Chem Lab Report */}
          <div className="flex items-center gap-3 py-1.5">
            <p className="text-xs text-gray-400 w-20 flex-shrink-0">Sun, May 19</p>
            <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
              📄
            </div>
            <p className="flex-1 text-sm font-semibold text-gray-800 truncate">Chem Lab Report</p>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-amber-600 bg-amber-50 flex-shrink-0">
              Medium
            </span>
          </div>
        </div>
      </div>

      {/* ── My Classes ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900">My Classes</h2>
          <Link href="/dashboard/classes" className="text-xs text-indigo-600 font-semibold">View all</Link>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {/* Biology 1107 — 84% */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-col items-center text-center">
            <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center text-base mb-1.5">
              🌿
            </div>
            <p className="text-[9px] font-bold text-gray-700 leading-tight mb-1 truncate w-full">Biology 1107</p>
            <p className="text-sm font-extrabold text-blue-600">84%</p>
            <div className="w-full h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '84%' }} />
            </div>
          </div>

          {/* Calculus 251 — 90% */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-col items-center text-center">
            <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-base mb-1.5">
              📐
            </div>
            <p className="text-[9px] font-bold text-gray-700 leading-tight mb-1 truncate w-full">Calculus 251</p>
            <p className="text-sm font-extrabold text-green-600">90%</p>
            <div className="w-full h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '90%' }} />
            </div>
          </div>

          {/* Chemistry 101 — 76% */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-col items-center text-center">
            <div className="w-9 h-9 bg-purple-500 rounded-xl flex items-center justify-center text-base mb-1.5">
              ⚗️
            </div>
            <p className="text-[9px] font-bold text-gray-700 leading-tight mb-1 truncate w-full">Chemistry 101</p>
            <p className="text-sm font-extrabold text-amber-600">76%</p>
            <div className="w-full h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '76%' }} />
            </div>
          </div>

          {/* English 101 — 88% */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-col items-center text-center">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-base mb-1.5">
              📝
            </div>
            <p className="text-[9px] font-bold text-gray-700 leading-tight mb-1 truncate w-full">English 101</p>
            <p className="text-sm font-extrabold text-blue-600">88%</p>
            <div className="w-full h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: '88%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Weekly Progress ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">Weekly Progress</h2>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#e5e7eb" strokeWidth="12" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#6366f1" strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 38 * 0.6} ${2 * Math.PI * 38 * 0.4}`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-extrabold text-indigo-600">60%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-2xl font-extrabold text-gray-900">
              3 <span className="text-base font-bold text-gray-400">/ 5</span>
            </p>
            <p className="text-xs text-gray-500">study sessions<br />completed</p>
          </div>
          <svg viewBox="0 0 60 30" className="w-14 h-8 flex-shrink-0">
            <polyline points="0,28 10,22 20,24 30,15 40,12 50,8 60,5"
              fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M0,28 10,22 20,24 30,15 40,12 50,8 60,5 60,30 0,30Z" fill="rgba(99,102,241,0.1)" />
          </svg>
          <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
        </div>
        <p className="text-xs text-gray-400 mt-2">Goal: 5 study sessions this week</p>
      </div>

      {/* ── Atlas Recommendation ── */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest mb-0.5">Atlas Recommendation</p>
          <p className="text-sm font-extrabold text-gray-900 mb-0.5">Focus on Biology today.</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            You have a quiz tomorrow which has 30% weightage. A focused 45 min session can make a big difference!
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-1" />
      </div>

    </div>
  );
}
