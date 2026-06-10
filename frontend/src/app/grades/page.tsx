'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { PageSkeleton } from '@/components/Skeleton';
import Tooltip from '@/components/Tooltip';
import { api } from '@/lib/api';
import {
  TrendingUp, Plus, ChevronRight, Star,
  AlertTriangle, Target, BarChart2, Sparkles,
  BookOpen, ArrowRight, MoreVertical,
  Upload, Lock, GraduationCap, Brain, Zap, Shield,
  RefreshCw,
} from 'lucide-react';

/* ─── Data ───────────────────────────────────────────────────── */
// ── Real class data from API ─────────────────────────────────────────────
interface RealClass {
  id: string; name: string; instructor: string | null;
  credit_hours: number | null; current_grade: number | null;
}

interface GradeSummaryData {
  current_grade: number | null; letter_grade: string | null;
  breakdown: Array<{ category: string; weight_pct: number; avg_score: number | null; count: number; confidence: string }>;
  confidence: string;
}

function letterGrade(pct: number | null): string {
  if (pct === null) return '—';
  if (pct >= 93) return 'A';  if (pct >= 90) return 'A−';
  if (pct >= 87) return 'B+'; if (pct >= 83) return 'B';
  if (pct >= 80) return 'B−'; if (pct >= 77) return 'C+';
  if (pct >= 73) return 'C';  if (pct >= 70) return 'C−';
  if (pct >= 60) return 'D';  return 'F';
}

function gradeColor(g: string) {
  if (g.startsWith('A')) return 'text-green-600';
  if (g.startsWith('B')) return 'text-indigo-600';
  if (g.startsWith('C')) return 'text-amber-600';
  return 'text-red-600';
}




/* ─── Real Donut Chart ───────────────────────────────────────── */
function RealDonutChart({ classes }: { classes: RealClass[] }) {
  const withGrades = classes.filter(c => c.current_grade !== null);

  const bands = [
    { label: 'A (90-100%)', color: '#4F46E5', min: 90,  max: 101 },
    { label: 'B (80-89%)',  color: '#818CF8', min: 80,  max: 90  },
    { label: 'C (70-79%)',  color: '#FCD34D', min: 70,  max: 80  },
    { label: 'D (60-69%)',  color: '#F97316', min: 60,  max: 70  },
    { label: 'F (Below 60%)', color: '#E5E7EB', min: 0, max: 60  },
  ];

  const counts = bands.map(b =>
    withGrades.filter(c => (c.current_grade || 0) >= b.min && (c.current_grade || 0) < b.max).length
  );

  const total = counts.reduce((s, c) => s + c, 0);
  const avg   = withGrades.length > 0
    ? Math.round(withGrades.reduce((s, c) => s + (c.current_grade || 0), 0) / withGrades.length)
    : null;

  if (total === 0) {
    return <p className="text-xs text-gray-400 py-3 text-center">Add grades to see distribution</p>;
  }

  const r = 28, cx = 36, cy = 36;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-shrink-0">
        <svg width="72" height="72" viewBox="0 0 72 72">
          {bands.map((b, i) => {
            const pct  = (counts[i] / total) * 100;
            const dash = (pct / 100) * circ;
            const el   = (
              <circle key={i} cx={cx} cy={cy} r={r}
                fill="none" stroke={b.color} strokeWidth="10"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 36 36)"
              />
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-base font-extrabold text-gray-900 leading-none">{avg}%</p>
          <p className="text-[8px] text-gray-400">Average</p>
        </div>
      </div>
      <div className="space-y-1">
        {bands.map((b, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-600">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: b.color }} />
            <span>{b.label}</span>
            <span className="ml-auto font-bold text-gray-700">{counts[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Class row card — real data ─────────────────────────────── */
function ClassRow({ cls }: { cls: RealClass }) {
  const [open,    setOpen]    = useState(false);
  const [summary, setSummary] = useState<GradeSummaryData | null>(null);
  const [loadingS,setLoadingS]= useState(false);

  const pct    = cls.current_grade;
  const letter = letterGrade(pct);

  const borderCol = pct === null ? 'border-l-gray-200'
    : pct >= 90 ? 'border-l-emerald-400'
    : pct >= 70 ? 'border-l-indigo-400'
    : 'border-l-red-400';

  const letterCol = pct === null ? 'text-gray-400'
    : pct >= 90 ? 'text-emerald-600'
    : pct >= 80 ? 'text-indigo-600'
    : pct >= 70 ? 'text-amber-600'
    : 'text-red-600';

  const statusText  = pct === null ? 'No grades' : pct >= 70 ? 'On track' : 'At risk';
  const statusColor = pct === null ? 'bg-gray-100 text-gray-500'
    : pct >= 70 ? 'bg-green-100 text-green-700'
    : 'bg-red-100 text-red-600';

  const handleToggle = async () => {
    setOpen(!open);
    if (!open && !summary && !loadingS) {
      setLoadingS(true);
      try {
        const s = await api<GradeSummaryData>(`/api/grades/class/${cls.id}/summary`);
        setSummary(s);
      } catch { /* ignore */ }
      finally { setLoadingS(false); }
    }
  };

  const strokeColor = (pct: number) =>
    pct >= 90 ? '#10b981' : pct >= 80 ? '#6366f1' : pct >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <div className={`bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm border-l-4 ${borderCol}`}>
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-base font-extrabold text-indigo-600 flex-shrink-0">
              {cls.name.slice(0,2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-extrabold text-gray-900">{cls.name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
                  {statusText}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {cls.credit_hours ? `${cls.credit_hours} credits` : ''}
                {cls.instructor ? ` · ${cls.instructor}` : ''}
              </p>
            </div>
          </div>

          {/* Current grade */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-center">
              <p className="text-[10px] text-gray-400 mb-0.5">Current</p>
              <p className={`text-2xl font-extrabold leading-none ${letterCol}`}>{letter}</p>
              {pct !== null && <p className="text-[10px] text-gray-400 mt-0.5">{pct}%</p>}
            </div>
          </div>
        </div>

        {/* Breakdown circles — shown from summary */}
        {summary && summary.breakdown.length > 0 && (
          <div className="flex items-center gap-8 mb-3 flex-wrap">
            {summary.breakdown.slice(0, 4).map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="relative w-16 h-16">
                  <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
                    <circle cx="22" cy="22" r="18" fill="none" stroke="#f3f4f6" strokeWidth="5"/>
                    {b.avg_score !== null && (
                      <circle cx="22" cy="22" r="18" fill="none"
                        stroke={strokeColor(b.avg_score)}
                        strokeWidth="5" strokeLinecap="round"
                        strokeDasharray={`${(b.avg_score/100)*113} 113`}/>
                    )}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-extrabold text-gray-700">
                      {b.avg_score !== null ? `${b.avg_score}%` : '—'}
                    </span>
                  </div>
                </div>
                <p className="text-[9px] text-gray-400 text-center leading-tight">{b.category}</p>
              </div>
            ))}
          </div>
        )}

        {pct === null && !open && (
          <p className="text-[11px] text-amber-600 mb-2">
            📊 No grades yet — add a grade to see your projection
          </p>
        )}

        {/* Details toggle */}
        <button onClick={handleToggle}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
          <span>{open ? '▲' : '▼'}</span> {loadingS ? 'Loading…' : 'Details'}
        </button>

        {open && (
          <div className="mt-3 pt-3 border-t border-gray-50 space-y-2">
            {summary && summary.breakdown.length > 0 ? (
              summary.breakdown.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <p className="text-xs text-gray-500 w-28 flex-shrink-0">
                    {b.category} <span className="text-gray-300">({b.weight_pct}%)</span>
                  </p>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    {b.avg_score !== null && (
                      <div className="h-full rounded-full"
                        style={{width:`${b.avg_score}%`, backgroundColor: strokeColor(b.avg_score)}}/>
                    )}
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-10 text-right">
                    {b.avg_score !== null ? `${b.avg_score}%` : '—'}
                  </span>
                  <span className="text-[10px] text-gray-400 w-14 text-right">
                    {b.count} grade{b.count !== 1 ? 's' : ''}
                  </span>
                </div>
              ))
            ) : summary && summary.breakdown.length === 0 ? (
              <p className="text-xs text-gray-400">No grade weights found — upload and link a syllabus first.</p>
            ) : (
              <p className="text-xs text-gray-400">Loading…</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function GradesPage() {
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // When the student hasn't logged any grades yet, show a hybrid empty state
  // that teaches them what /grades unlocks instead of a broken-looking
  // empty GPA chart.
  const [hasGrades, setHasGrades] = useState(false);

  const [realClasses, setRealClasses] = useState<RealClass[]>([]);

  const loadData = useCallback(() => {
    setLoading(true);
    api<{ classes: RealClass[]; total: number }>('/api/classes')
      .then((res) => {
        setRealClasses(res.classes);
        if (res.classes.length > 0) setHasGrades(true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <PageSkeleton/>;

  /* ─────────────────────────────────────────────────────────────
   * EMPTY STATE — hybrid: keeps grade-tracker structure visible
   * but shows a preview + CTAs instead of broken-looking empty data.
   * ───────────────────────────────────────────────────────────── */
  if (!hasGrades) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#F5F5FB] p-4 md:p-4">
          <div className="max-w-[1000px] mx-auto">

            {/* Header */}
            <div className="text-center mb-4">
             
              <h1 className="text-3xl md:text-[34px] font-extrabold text-[#14142B] leading-tight mb-2">
                See where your grades are heading
              </h1>
              <p className="text-sm text-[#6B6A8A] max-w-xl mx-auto leading-relaxed">
                Upload a grade report or enter scores manually — Atlas projects
                your final grade and shows you exactly where to focus next.
              </p>
            </div>

            {/* Two big action cards — with Cloudinary bg images and text overlap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-7">
              {/* Option 1 — Upload grade report (purple gradient + gradespage2 illustration) */}
              <Link
                href="/upload"
                className="group relative overflow-hidden bg-gradient-to-br from-[#534AB7] via-[#5B4FBC] to-[#7B6FE8] rounded-xl shadow-xl shadow-[#534AB7]/20 hover:shadow-2xl transition-all active:scale-[0.99] min-h-[230px]"
              >
                {/* Full-width background illustration */}
                <img
                  src="https://res.cloudinary.com/mview/image/upload/atlas/gradespage2.webp"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none"
                />
               

                {/* Foreground content */}
                <div className="relative z-10 p-6 ">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  {/* Recommended badge */}
                  <span className="absolute top-5 right-5 inline-flex items-center gap-1 rounded-full bg-emerald-400 text-emerald-950 text-[10px] font-extrabold px-2 py-1 uppercase tracking-wider z-20">
                    Recommended
                  </span>
                  <h3 className="text-xl font-extrabold text-white mb-1.5">
                    Upload grade report
                  </h3>
                  <p className="text-[14px] text-white/85 leading-relaxed mb-5 max-w-[65%]">
                    Drop a transcript, gradebook export, or graded assignment —
                    Atlas extracts every score automatically.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white text-[#534AB7] font-extrabold text-sm px-4 py-2.5 rounded-xl shadow-md">
                    <Upload className="w-4 h-4" /> Upload a file
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Option 2 — Add grade manually (white + gradespage1 illustration) */}
              <button
                onClick={() => setShowAddModal(true)}
                className="group text-left relative overflow-hidden bg-white border border-[#bcb4f1] rounded-xl shadow-sm hover:shadow-lg hover:border-[#534AB7]/30 transition-all active:scale-[0.99] min-h-[230px]"
              >
                {/* Full-width background illustration */}
                <img
                  src="https://res.cloudinary.com/mview/image/upload/atlas/gradespage1.webp"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none"
                />
                {/* White-to-transparent overlay so text on the left stays crisp */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-45% to-transparent pointer-events-none" />

                {/* Foreground content */}
                <div className="relative z-10 p-6 max-w-[65%]">
                  <div className="w-11 h-11 rounded-xl bg-[#F4F2FF] flex items-center justify-center mb-2">
                    <Plus className="w-5 h-5 text-[#534AB7]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#14142B] mb-1.5">
                    Add grade manually
                  </h3>
                  <p className="text-[14px] text-[#6B6A8A] leading-relaxed mb-5">
                    Enter a single score for any class — quiz, exam, paper —
                    and Atlas updates your projection.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white border-2 border-[#E8E5FD] text-[#534AB7] font-extrabold text-sm px-4 py-2.5 rounded-xl">
                    Log a grade
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </div>

            {/* Locked GPA chart preview — matches screenshot reference */}
            <div className="relative bg-[#F4F2FF] border border-[#E8E5FD] rounded-xl p-5 mb-7 shadow-sm overflow-hidden">
              <div className="flex  md:flex-row flex-col items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-6 h-6 text-[#534AB7]" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#14142B]">GPA trend</h3>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#6B6A8A]">
                  <Lock className="w-4 h-4" /> Locked until first score
                </span>
              </div>

              {/* Smooth curve chart with centered lock overlay */}
              <div className="relative h-[180px]">
                <svg viewBox="0 0 700 180" className="w-full h-full opacity-50 pointer-events-none" preserveAspectRatio="none">
                  {/* Dashed grid lines */}
                  {[45, 90, 135].map((y) => (
                    <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="#D8D3FF" strokeDasharray="3 5" />
                  ))}
                  {/* Natural sloped curve - rises with visible peaks and dips */}
                  <path
                    d="M 20 155 C 60 145, 100 135, 130 125 S 200 105, 240 130 S 330 85, 380 95 S 470 50, 520 80 S 620 30, 680 25"
                    stroke="#534AB7"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Dots positioned along the natural curve */}
                  {[
                    [20, 155],   // start, low
                    [130, 125],  // climb
                    [240, 130],  // small dip
                    [320, 100],  // rise
                    [380, 95],   // peak then dip
                    [450, 70],   // rise
                    [520, 80],   // small dip
                    [600, 40],   // strong rise
                    [680, 25],   // top right
                  ].map(([x, y], i) => (
                    <g key={i}>
                      <circle cx={x} cy={y} r="5" fill="#534AB7" />
                      <circle cx={x} cy={y} r="2" fill="white" />
                    </g>
                  ))}
                </svg>

                {/* Centered lock message */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#534AB7] flex items-center justify-center shadow-lg shadow-[#534AB7]/30 mb-2">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-lg font-extrabold text-[#14142B]">Add a grade to unlock</p>
                  <p className="text-[14px] text-[#4a494e] mt-0.5">Your GPA trend appears once you log your first score.</p>
                </div>
              </div>
            </div>

            {/* What Atlas tracks */}
            <div className="mb-7">
              <p className="text-base font-extrabold text-[#4d4d50] uppercase tracking-widest mb-3">
                What you&apos;ll see here
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { icon: TrendingUp,    color: 'bg-[#534AB7]',   label: 'Live GPA tracking',      desc: 'Your GPA updates with every new score.' },
                  { icon: Target,        color: 'bg-emerald-500', label: 'Per-class projections',  desc: 'Projected final grade for each class.' },
                  { icon: AlertTriangle, color: 'bg-orange-500',  label: 'Weak spots flagged',     desc: 'See which class needs attention first.' },
                  { icon: Brain,         color: 'bg-blue-500',    label: 'Grade impact ranking',   desc: 'Which task moves your GPA the most.' },
                ].map((c) => (
                  <div key={c.label} className="bg-white border border-[#ECE9FF] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                        <c.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-[15px] font-bold text-[#1A1A2E] leading-tight">{c.label}</p>
                    </div>
                    <p className="text-[15px] text-[#6B6A8A] leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reassurance band */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="bg-white border border-[#ECE9FF] rounded-2xl px-4 py-3.5 flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-[15px] font-extrabold text-[#1A1A2E] mb-0.5">Real grading weights</p>
                  <p className="text-[13px] text-[#6B6A8A] leading-relaxed">Atlas uses your syllabus, not generic formulas.</p>
                </div>
              </div>
              <div className="bg-white border border-[#ECE9FF] rounded-2xl px-4 py-3.5 flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <BarChart2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[15px] font-extrabold text-[#1A1A2E] mb-0.5">More data, better predictions</p>
                  <p className="text-[13px] text-[#6B6A8A] leading-relaxed">Accuracy improves with every grade added.</p>
                </div>
              </div>
              <div className="bg-white border border-[#ECE9FF] rounded-2xl px-4 py-3.5 flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-[15px] font-extrabold text-[#1A1A2E] mb-0.5">Private &amp; secure</p>
                  <p className="text-[13px] text-[#6B6A8A] leading-relaxed">Your grades are never shared, ever.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-[1200px] mx-auto">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Grade Tracker</h1>
            <p className="text-sm text-gray-400 mt-0.5">Fall 2026 · Overall academic progress</p>
          </div>
          <button onClick={()=>setShowAddModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/25">
            <Plus className="w-4 h-4"/> Add grade
          </button>
        </div>

        {/* ── Main 2-col layout ─────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-4 items-start">

          {/* ── LEFT — main content ───────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-4">



            {/* Target Grade Calculator */}
            

            {/* Class rows */}
            <div className="space-y-3">
              {realClasses.length > 0
                ? realClasses.map(cls=><ClassRow key={cls.id} cls={cls}/>)
                : <div className="text-center py-8 text-gray-400 text-sm">
                    No classes yet — add your classes first to track grades.
                  </div>}
            </div>
          </div>

          {/* ── RIGHT sidebar ─────────────────────────────────── */}
          <div className="lg:w-[240px] lg:flex-shrink-0 space-y-4">

            {/* Top Performing Classes removed — was static data */}

            {/* Needs Attention — real data */}
            {realClasses.filter(c => c.current_grade !== null && c.current_grade < 70).length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-orange-500"/>
                  <p className="text-sm font-extrabold text-gray-900">Needs Attention</p>
                </div>
                <div className="space-y-2.5">
                  {realClasses
                    .filter(c => c.current_grade !== null && c.current_grade < 70)
                    .map((c, i) => (
                      <div key={c.id} className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-extrabold flex items-center justify-center flex-shrink-0">{i+1}</span>
                        <p className="text-xs font-semibold text-gray-800 flex-1 truncate">{c.name}</p>
                        <span className="text-xs font-extrabold flex-shrink-0 text-red-500">{c.current_grade}%</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Grade Distribution */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 className="w-4 h-4 text-indigo-500"/>
                <p className="text-sm font-extrabold text-gray-900">Grade Distribution</p>
              </div>
              <RealDonutChart classes={realClasses}/>

            </div>

            {/* GPA Summary — real avg */}
            <div className="bg-indigo-600 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-indigo-200"/>
                <p className="text-xs font-extrabold text-indigo-100">Average Grade</p>
              </div>
              {realClasses.filter(c => c.current_grade !== null).length > 0 ? (
                <>
                  <p className="text-3xl font-extrabold leading-none">
                    {Math.round(realClasses.filter(c => c.current_grade !== null).reduce((s,c) => s + (c.current_grade||0), 0) / realClasses.filter(c => c.current_grade !== null).length)}%
                  </p>
                  <p className="text-xs text-indigo-200 mt-2">
                    Across {realClasses.filter(c => c.current_grade !== null).length} class{realClasses.filter(c => c.current_grade !== null).length !== 1 ? 'es' : ''}
                  </p>
                </>
              ) : (
                <p className="text-sm text-indigo-200 mt-1">Add grades to see your average</p>
              )}
            </div>

            {/* Insights */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-indigo-500"/>
                <p className="text-sm font-extrabold text-gray-900">Insights</p>
              </div>
              <div className="space-y-2.5">
                {realClasses.filter(c => c.current_grade !== null && c.current_grade < 70).length > 0 && (
                  <div className="flex items-start gap-2.5">
                    <span className="text-base flex-shrink-0">⚠️</span>
                    <p className="text-xs font-medium text-orange-500 leading-relaxed">
                      {realClasses.filter(c => c.current_grade !== null && c.current_grade < 70).map(c => c.name).join(', ')} need{realClasses.filter(c => c.current_grade !== null && c.current_grade < 70).length === 1 ? 's' : ''} attention
                    </p>
                  </div>
                )}
                {realClasses.filter(c => c.current_grade !== null && c.current_grade >= 90).length > 0 && (
                  <div className="flex items-start gap-2.5">
                    <span className="text-base flex-shrink-0">⭐</span>
                    <p className="text-xs font-medium text-green-600 leading-relaxed">
                      {realClasses.filter(c => c.current_grade !== null && c.current_grade >= 90).map(c => c.name).join(', ')} — excellent work
                    </p>
                  </div>
                )}
                {realClasses.filter(c => c.current_grade !== null).length === 0 && (
                  <p className="text-xs text-gray-400">Add grades to see personalised insights.</p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Add Grade Modal */}
      {showAddModal && <AddGradeModal
        onClose={() => setShowAddModal(false)}
        onSaved={() => { setShowAddModal(false); loadData(); }}
        realClasses={realClasses}
      />}
    </AppLayout>
  );
}

/* ─── Add Grade Modal ────────────────────────────────────────── */
function AddGradeModal({ onClose, onSaved, realClasses }: { onClose: () => void; onSaved: () => void; realClasses: RealClass[] }) {
  const [cls,       setCls]       = useState(realClasses[0]?.id ?? '');
  const [name,      setName]      = useState('');
  const [category,  setCategory]  = useState('');
  const [score,     setScore]     = useState('');
  const [total,     setTotal]     = useState('100');
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState('');
  const [weights,   setWeights]   = useState<Array<{category: string; weight_pct: number}>>([]);
  const [loadingW,  setLoadingW]  = useState(false);

  // Fetch grade weights when class changes
  useEffect(() => {
    if (!cls) return;
    setLoadingW(true);
    api<{ grade_weights: Array<{id:string; category:string; weight_pct:number}> }>(`/api/classes/${cls}`)
      .then((c) => {
        setWeights(c.grade_weights || []);
        if (c.grade_weights?.length > 0) setCategory(c.grade_weights[0].category);
        else setCategory('');
      })
      .catch(() => {})
      .finally(() => setLoadingW(false));
  }, [cls]);

  const pct = score && total ? Math.round((parseFloat(score) / parseFloat(total)) * 100) : null;

  const save = async () => {
    if (!cls)         { setError('Please select a class.'); return; }
    if (!name.trim()) { setError('Please enter an assignment name.'); return; }
    if (!category)    { setError('Please select a category.'); return; }
    if (!score || isNaN(parseFloat(score))) { setError('Please enter a valid score.'); return; }
    setError('');
    setSaving(true);
    try {
      await api('/api/grades', {
        method: 'POST',
        body: {
          class_id:  cls,
          category,
          title:     name.trim(),
          score:     parseFloat(score),
          max_score: parseFloat(total) || 100,
          source:    'manual',
        },
      });
      setSaved(true);
      setTimeout(() => { onSaved(); }, 900);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not save grade. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm outline-none bg-white transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="h-1.5 bg-indigo-600" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-extrabold text-gray-900">Add a grade</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
              <span className="text-gray-500 text-sm font-bold">✕</span>
            </button>
          </div>
          <div className="space-y-3">
            {/* Class */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Class</label>
              <select value={cls} onChange={e => setCls(e.target.value)} className={inp}>
                {realClasses.length > 0
                  ? realClasses.map(c => <option key={c.id} value={c.id}>{c.name}{c.current_grade !== null ? ` (${letterGrade(c.current_grade)})` : ''}</option>)
                  : <option disabled value="">No classes yet</option>}
              </select>
            </div>

            {/* Assignment name */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Assignment name *</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Quiz 3, Midterm Exam" className={inp} />
            </div>

            {/* Category — from real grade weights */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Category *</label>
              {loadingW ? (
                <div className="border-2 border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-400">Loading categories…</div>
              ) : weights.length > 0 ? (
                <select value={category} onChange={e => setCategory(e.target.value)} className={inp}>
                  {weights.map(w => (
                    <option key={w.category} value={w.category}>
                      {w.category} ({w.weight_pct}% of grade)
                    </option>
                  ))}
                </select>
              ) : (
                <div>
                  <input value={category} onChange={e => setCategory(e.target.value)}
                    placeholder="e.g. Exams, Homework, Quizzes" className={inp} />
                  <p className="text-[11px] text-amber-600 mt-1">
                    ⚠ No grade weights set for this class. Go to Classes → {realClasses.find(c=>c.id===cls)?.name || 'class'} → set weights first for accurate calculation.
                  </p>
                </div>
              )}
            </div>

            {/* Score */}
            <div className="grid grid-cols-2 gap-3">
            {/* Score */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Score *</label>
                <input type="number" value={score} onChange={e => setScore(e.target.value)}
                  placeholder="e.g. 85" className={inp} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Out of</label>
                <input type="number" value={total} onChange={e => setTotal(e.target.value)}
                  className={inp} />
              </div>
            </div>

            {/* Live score preview */}
            {pct !== null && (
              <div className={`rounded-xl px-3.5 py-2.5 text-center font-extrabold text-lg border ${
                pct >= 90 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                pct >= 80 ? 'bg-indigo-50 border-indigo-200 text-indigo-600' :
                pct >= 70 ? 'bg-amber-50 border-amber-200 text-amber-600' :
                'bg-red-50 border-red-200 text-red-600'
              }`}>
                {pct}% — {letterGrade(pct)}
              </div>
            )}
          </div>
          {error && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}
          <div className="flex gap-2.5 mt-4">
            <button onClick={onClose}
              className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold py-2.5 rounded-xl text-sm transition-all">
              Cancel
            </button>
            <button onClick={save} disabled={!name.trim() || !score || saving}
              className={`flex-1 font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
                saved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40'
              }`}>
              {saved ? '✓ Grade added!' : saving ? <><RefreshCw className="w-4 h-4 animate-spin"/> Saving…</> : <><Plus className="w-4 h-4"/> Add grade</>}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
