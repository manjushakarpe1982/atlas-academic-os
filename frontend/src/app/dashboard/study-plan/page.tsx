'use client';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';

export default function StudyPlanPage() {
  return (
    <div className="px-4 py-4 pb-24 space-y-5">

      {/* ── Greeting ── */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Good morning, Pooja 🌟</h1>
        <p className="text-sm text-gray-400 mt-0.5">Here&apos;s your plan for this week.</p>
      </div>

      {/* ── This Week Focus ── */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
          <p className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">This Week Focus</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-4 text-white shadow-lg">
          {/* Top — Subject */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📐</span>
            </div>
            <div>
              <h2 className="text-lg font-extrabold leading-tight">Calculus 251</h2>
              <p className="text-xs text-white/70 mt-0.5">Chapter 14: Integration Techniques</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white/10 rounded-xl px-3 py-2">
              <p className="text-[10px] text-white/60 font-semibold mb-0.5">Current Grade</p>
              <p className="text-lg font-extrabold leading-tight">84%</p>
              <p className="text-[9px] text-white/50 mt-0.5">3.5% at last exam</p>
            </div>
            <div className="bg-white/10 rounded-xl px-3 py-2">
              <p className="text-[10px] text-white/60 font-semibold mb-0.5">Next Exam</p>
              <p className="text-sm font-extrabold leading-tight">Fri, May 17</p>
              <p className="text-[9px] text-orange-300 mt-0.5 font-semibold">3 days left</p>
            </div>
            <div className="bg-white/10 rounded-xl px-3 py-2">
              <p className="text-[10px] text-white/60 font-semibold mb-0.5">Potential Impact</p>
              <p className="text-lg font-extrabold leading-tight text-green-300">+8 pts</p>
              <p className="text-[9px] text-white/50 mt-0.5">with focused study</p>
            </div>
          </div>

          {/* CTA */}
          <Link href="/dashboard/study-plan/session?id=calc-ch14"
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
            Start Studying <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── Recommended Sessions ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900">Recommended Sessions</h2>
          <button className="text-xs text-indigo-600 font-semibold">See All (X)</button>
        </div>

        <div className="space-y-3">
          {/* Session 1 — Chapter 14 Practice */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
            <div className="flex flex-col items-center flex-shrink-0">
              <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">85% match</span>
              <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center mt-1.5">
                <span className="text-sm">📐</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />
                <p className="text-sm font-bold text-gray-900 truncate">Chapter 14 Practice</p>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 ml-3.5">Calculus 251</p>
              <div className="flex items-center gap-2 mt-1 ml-3.5">
                <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Today</span>
                <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Start in 2 days</span>
              </div>
            </div>
            <Link href="/dashboard/study-plan/session?id=calc-ch14"
              className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all flex-shrink-0">
              Start
            </Link>
          </div>

          {/* Session 2 — Chemistry Review */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
            <div className="flex flex-col items-center flex-shrink-0">
              <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">78% match</span>
              <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center mt-1.5">
                <span className="text-sm">⚗️</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                <p className="text-sm font-bold text-gray-900 truncate">Chemistry Review</p>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 ml-3.5">Chemistry 101</p>
              <div className="flex items-center gap-2 mt-1 ml-3.5">
                <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Fri, May 17</span>
                <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Lab due in 4 days</span>
              </div>
            </div>
            <Link href="/dashboard/study-plan/session?id=chem-review"
              className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all flex-shrink-0">
              Start
            </Link>
          </div>

          {/* Session 3 — English Reading & Notes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
            <div className="flex flex-col items-center flex-shrink-0">
              <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">70% match</span>
              <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center mt-1.5">
                <span className="text-sm">📖</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                <p className="text-sm font-bold text-gray-900 truncate">English Reading & Notes</p>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 ml-3.5">English 201</p>
              <div className="flex items-center gap-2 mt-1 ml-3.5">
                <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">May 22</span>
              </div>
            </div>
            <Link href="/dashboard/study-plan/session?id=eng-reading"
              className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all flex-shrink-0">
              Start
            </Link>
          </div>
        </div>
      </div>

      {/* ── Upcoming Deadlines ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900">Upcoming Deadlines</h2>
          <Link href="/dashboard/assignments" className="text-xs text-indigo-600 font-semibold">See All</Link>
        </div>

        <div className="space-y-2">
          {/* Calculus 251 — Exam */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
            <div className="w-12 h-14 bg-indigo-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border border-indigo-100">
              <p className="text-[8px] font-extrabold text-indigo-400 uppercase">MAY</p>
              <p className="text-lg font-extrabold text-indigo-700 leading-none">17</p>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-900">Calculus 251</p>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full flex-shrink-0">Exam</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Friday, 10:00 AM</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
          </div>

          {/* Chemistry 101 — Lab Report */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
            <div className="w-12 h-14 bg-orange-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border border-orange-100">
              <p className="text-[8px] font-extrabold text-orange-400 uppercase">MAY</p>
              <p className="text-lg font-extrabold text-orange-700 leading-none">18</p>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-900">Chemistry 101</p>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex-shrink-0">Lab Report</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Sunday, 11:00 PM</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
          </div>

          {/* English 201 — Essay */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
            <div className="w-12 h-14 bg-green-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border border-green-100">
              <p className="text-[8px] font-extrabold text-green-400 uppercase">MAY</p>
              <p className="text-lg font-extrabold text-green-700 leading-none">22</p>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-900">English 201</p>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex-shrink-0">Essay</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Wednesday, 11:55 PM</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
          </div>
        </div>
      </div>

    </div>
  );
}
