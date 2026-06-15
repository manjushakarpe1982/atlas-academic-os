'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, ChevronRight, ArrowRight, Brain, Loader2 } from 'lucide-react';
import { getUser, api } from '@/lib/api';

// ── Types ──────────────────────────────────────────────────────────────────
interface ClassSummary {
  id: string; name: string; term: string; grade: number | null;
}
interface Deadline {
  title: string; due_date: string | null; category: string; class_name: string; confidence: string;
}
interface StudySession { class_name: string; mins: number; done: boolean; }
interface CalEvent    { title: string; start_date: string; category: string; }
interface WeeklyProg  { sessions_done: number; sessions_goal: number; pct: number; }

interface DashData {
  classes:           ClassSummary[];
  deadlines:         Deadline[];
  study_plan:        StudySession[];
  calendar_events:   CalEvent[];
  weekly_progress:   WeeklyProg;
  ai_recommendation: string | null;
  stats:             { deadlines_this_week: number; high_priority_count: number };
}

// ── Helpers ───────────────────────────────────────────────────────────────
const CLASS_COLORS = ['bg-green-500','bg-blue-500','bg-purple-500','bg-orange-500','bg-pink-500','bg-teal-500'];
const CLASS_ICONS  = ['🌿','📐','⚗️','📝','📖','🔬'];
const CAT_PRIORITY: Record<string,string> = { exam:'High', quiz:'Medium', assignment:'Low', other:'Low' };
const PC: Record<string,string> = {
  High:'text-red-600 bg-red-50', Medium:'text-amber-600 bg-amber-50', Low:'text-green-600 bg-green-50',
  high:'text-red-600 bg-red-50', medium:'text-amber-600 bg-amber-50', low:'text-green-600 bg-green-50',
};

function fmtDate(iso: string | null): string {
  if (!iso) return 'TBD';
  try {
    const d = new Date(iso);
    const today = new Date();
    const diff  = Math.ceil((d.getTime() - today.getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
  } catch { return iso; }
}

// ── Component ─────────────────────────────────────────────────────────────
export default function DashboardHome() {
  const user      = getUser();
  const firstName = user?.full_name?.split(' ')[0] || 'Student';

  const [data,    setData]    = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    api<DashData>('/api/dashboard')
      .then(d => setData(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-gray-400">Loading your dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="px-4 py-8 text-center">
      <p className="text-red-500 text-sm mb-3">❌ {error}</p>
      <button onClick={() => window.location.reload()}
        className="text-indigo-600 text-sm font-semibold hover:underline">Retry</button>
    </div>
  );

  const classes    = data?.classes        || [];
  const deadlines  = data?.deadlines      || [];
  const studyPlan  = data?.study_plan     || [];
  const events     = data?.calendar_events|| [];
  const weekly     = data?.weekly_progress|| { sessions_done:0, sessions_goal:5, pct:0 };
  const stats      = data?.stats          || { deadlines_this_week:0, high_priority_count:0 };
  const aiRec      = data?.ai_recommendation;

  // Most urgent item for "What to study first"
  const topDeadline = deadlines[0] || null;

  return (
    <div className="px-4 py-4 space-y-4 pb-24">

      {/* ── Greeting ── */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Good Morning, {firstName} 👋</h1>
        <p className="text-sm text-gray-400 mt-0.5">Let&apos;s make today productive!</p>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon:'📅', value: String(stats.deadlines_this_week || deadlines.length), label:'Deadlines this week' },
          { icon:'⚡', value: String(stats.high_priority_count || 0),               label:'High priority tasks' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 leading-tight">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── What to Study First ── */}
      {topDeadline ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-3 pb-1">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">What to Study First</p>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                {topDeadline.category === 'exam' ? '📄' : topDeadline.category === 'quiz' ? '❓' : '📝'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-base font-extrabold text-gray-900">{topDeadline.title}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PC[CAT_PRIORITY[topDeadline.category] || 'Low']}`}>
                    {CAT_PRIORITY[topDeadline.category] || 'Medium'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {fmtDate(topDeadline.due_date)}
                  {topDeadline.class_name ? ` · ${topDeadline.class_name}` : ''}
                </p>
                <p className="text-xs text-gray-500 mt-1">Reason: High grade impact + close deadline</p>
              </div>
              <span className="text-3xl flex-shrink-0">🏆</span>
            </div>
          </div>
          <div className="px-4 py-3">
            <Link href="/dashboard/study-plan"
              className="flex items-center justify-between w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-2xl text-sm transition-all shadow-md">
              Start Studying <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : classes.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-sm font-semibold text-gray-600 mb-2">🎉 No urgent deadlines this week!</p>
          <Link href="/dashboard/study-plan" className="text-xs text-indigo-600 font-semibold">View Study Plan</Link>
        </div>
      ) : null}

      {/* ── Today's Study Plan ── */}
      {studyPlan.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-extrabold text-gray-900">Today&apos;s Study Plan</h2>
            <Link href="/dashboard/study-plan" className="text-xs text-indigo-600 font-semibold">View all</Link>
          </div>
          <div className="space-y-3">
            {studyPlan.slice(0,4).map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${CLASS_COLORS[i % CLASS_COLORS.length]} flex-shrink-0`} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{s.class_name}</p>
                  <p className="text-xs text-gray-400">{s.mins} min</p>
                </div>
                {s.done
                  ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  : <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />}
              </div>
            ))}
          </div>
          <Link href="/dashboard/study-plan"
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 mt-4 hover:text-indigo-800 transition-colors">
            View Full Study Plan <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── Upcoming Deadlines — from assessments API ── */}
      {deadlines.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-extrabold text-gray-900">Upcoming Deadlines</h2>
            <Link href="/dashboard/assignments" className="text-xs text-indigo-600 font-semibold">View all</Link>
          </div>
          <div className="space-y-2">
            {deadlines.slice(0,5).map((d, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5">
                <p className="text-xs text-gray-400 w-20 flex-shrink-0">{fmtDate(d.due_date)}</p>
                <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                  {d.category === 'exam' ? '📄' : d.category === 'quiz' ? '❓' : '📝'}
                </div>
                <p className="flex-1 text-sm font-semibold text-gray-800 truncate">{d.title}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${PC[CAT_PRIORITY[d.category] || 'Low']}`}>
                  {CAT_PRIORITY[d.category] || 'Medium'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Calendar Events (if no assessments) ── */}
      {deadlines.length === 0 && events.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-extrabold text-gray-900">Upcoming Events</h2>
            <Link href="/dashboard/calendar" className="text-xs text-indigo-600 font-semibold">View all</Link>
          </div>
          {events.slice(0,4).map((e, i) => (
            <div key={i} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-lg">{e.category === 'exam' ? '📄' : e.category === 'quiz' ? '❓' : '📅'}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{e.title}</p>
                <p className="text-xs text-gray-400">{fmtDate(e.start_date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── My Classes — from classes API ── */}
      {classes.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-extrabold text-gray-900">My Classes</h2>
            <Link href="/dashboard/classes" className="text-xs text-indigo-600 font-semibold">View all</Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {classes.slice(0,4).map((c, i) => (
              <Link key={c.id} href="/dashboard/class-detail"
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-col items-center text-center hover:shadow-md transition-all">
                <div className={`w-9 h-9 ${CLASS_COLORS[i % CLASS_COLORS.length]} rounded-xl flex items-center justify-center text-base mb-1.5`}>
                  {CLASS_ICONS[i % CLASS_ICONS.length]}
                </div>
                <p className="text-[9px] font-bold text-gray-700 leading-tight mb-1 truncate w-full">
                  {c.name.split(' ').slice(0,2).join(' ')}
                </p>
                {c.grade != null ? (
                  <>
                    <p className={`text-sm font-extrabold ${
                      c.grade >= 90 ? 'text-green-600' : c.grade >= 80 ? 'text-blue-600' : c.grade >= 70 ? 'text-amber-600' : 'text-red-500'
                    }`}>{c.grade}%</p>
                    <div className="w-full h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                      <div className={`h-full ${CLASS_COLORS[i % CLASS_COLORS.length]} rounded-full`} style={{ width:`${c.grade}%` }}/>
                    </div>
                  </>
                ) : (
                  <p className="text-[9px] text-gray-400 mt-1">No grades</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-sm font-semibold text-gray-500 mb-2">No classes added yet</p>
          <Link href="/add-class"
            className="text-xs font-bold text-indigo-600 hover:underline">+ Add your first class</Link>
        </div>
      )}

      {/* ── Weekly Progress ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">Weekly Progress</h2>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#e5e7eb" strokeWidth="12"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#6366f1" strokeWidth="12"
                strokeDasharray={`${2*Math.PI*38*(weekly.pct/100)} ${2*Math.PI*38*(1-weekly.pct/100)}`}
                strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-extrabold text-indigo-600">{weekly.pct}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-2xl font-extrabold text-gray-900">
              {weekly.sessions_done} <span className="text-base font-bold text-gray-400">/ {weekly.sessions_goal}</span>
            </p>
            <p className="text-xs text-gray-500">study sessions<br/>completed</p>
          </div>
          <svg viewBox="0 0 60 30" className="w-14 h-8 flex-shrink-0">
            <polyline points="0,28 10,22 20,24 30,15 40,12 50,8 60,5"
              fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M0,28 10,22 20,24 30,15 40,12 50,8 60,5 60,30 0,30Z" fill="rgba(99,102,241,0.1)"/>
          </svg>
          <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0"/>
        </div>
        <p className="text-xs text-gray-400 mt-2">Goal: {weekly.sessions_goal} study sessions this week</p>
      </div>

      {/* ── Atlas AI Recommendation — from Claude API ── */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-white"/>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest mb-0.5">Atlas Recommendation</p>
          {aiRec ? (
            <p className="text-xs text-gray-600 leading-relaxed">{aiRec}</p>
          ) : (
            <>
              <p className="text-sm font-extrabold text-gray-900 mb-0.5">Focus on your studies today.</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                {classes.length > 0
                  ? `You have ${classes.length} active class${classes.length > 1 ? 'es' : ''}. Keep up the great work!`
                  : 'Add your first class to get personalized study recommendations.'}
              </p>
            </>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-1"/>
      </div>

    </div>
  );
}
