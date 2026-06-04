'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { PageSkeleton } from '@/components/Skeleton';
import Tooltip from '@/components/Tooltip';
import {
  TrendingUp, Plus, ChevronRight, Star,
  AlertTriangle, Target, BarChart2, Sparkles,
  BookOpen, ArrowRight, MoreVertical,
  Upload, Lock, GraduationCap, Brain, Zap, Shield,
} from 'lucide-react';

/* ─── Data ───────────────────────────────────────────────────── */
const CLASSES = [
  {
    id:'stat201', name:'Statistics 201', code:'STAT 201', credits:3, prof:'Prof. Michael Lee',
    status:'on-track', statusColor:'bg-green-100 text-green-700',
    current:'A-', projected:'A', currentPct:91, projPct:94,
    icon:'📊', iconBg:'bg-purple-50', iconColor:'text-purple-600',
    borderColor:'border-l-purple-400',
    scores:[{label:'Assignments',pct:92,color:'bg-purple-500'},{label:'Exams',pct:65,color:'bg-purple-400'},{label:'Participation',pct:65,color:'bg-purple-400'}],
  },
  {
    id:'bio101', name:'Biology 101', code:'BIO 101', credits:4, prof:'Prof. Sarah Smith',
    status:'on-track', statusColor:'bg-green-100 text-green-700',
    current:'B+', projected:'A-', currentPct:87, projPct:91,
    icon:'🧬', iconBg:'bg-green-50', iconColor:'text-green-600',
    borderColor:'border-l-green-400',
    scores:[{label:'Assignments',pct:85,color:'bg-green-500'},{label:'Exams',pct:79,color:'bg-green-400'},{label:'Lab & Quizzes',pct:99,color:'bg-green-400'}],
  },
  {
    id:'eng110', name:'English 110', code:'ENG 110', credits:3, prof:'Prof. David Kim',
    status:'at-risk', statusColor:'bg-red-100 text-red-600',
    current:'B-', projected:'B', currentPct:79, projPct:83,
    icon:'📖', iconBg:'bg-yellow-50', iconColor:'text-yellow-600',
    borderColor:'border-l-yellow-400',
    scores:[{label:'Assignments',pct:65,color:'bg-yellow-500'},{label:'Exams',pct:75,color:'bg-yellow-400'},{label:'Participation',pct:70,color:'bg-yellow-400'}],
  },
  {
    id:'his105', name:'History 105', code:'HIS 105', credits:3, prof:'Prof. Brena Wilson',
    status:'on-track', statusColor:'bg-green-100 text-green-700',
    current:'A', projected:'A', currentPct:95, projPct:94,
    icon:'🏛', iconBg:'bg-blue-50', iconColor:'text-blue-600',
    borderColor:'border-l-blue-400',
    scores:[{label:'Assignments',pct:99,color:'bg-blue-500'},{label:'Exams',pct:88,color:'bg-blue-400'},{label:'Participation',pct:92,color:'bg-blue-400'}],
  },
  {
    id:'chem201', name:'Chemistry 201', code:'CHEM 201', credits:4, prof:'Prof. James Brown',
    status:'at-risk', statusColor:'bg-red-100 text-red-600',
    current:'D+', projected:'C-', currentPct:67, projPct:70,
    icon:'🧪', iconBg:'bg-red-50', iconColor:'text-red-600',
    borderColor:'border-l-red-400',
    scores:[{label:'Assignments',pct:99,color:'bg-red-500'},{label:'Exams',pct:66,color:'bg-red-400'},{label:'Lab & Quizzes',pct:60,color:'bg-red-400'}],
  },
];

const GPA_TREND = [
  {m:'Aug',v:3.2},{m:'Sep',v:3.3},{m:'Oct',v:3.25},{m:'Nov',v:3.4},
  {m:'Dec',v:3.35},{m:'Jan',v:3.5},{m:'Feb',v:3.55},
];

const GPA_PROJ = [
  {m:'Jan',v:3.5},{m:'Feb',v:3.6},{m:'Mar',v:3.7},{m:'Apr',v:3.8},
];

function gradeColor(g: string) {
  if (g.startsWith('A')) return 'text-green-600';
  if (g.startsWith('B')) return 'text-indigo-600';
  if (g.startsWith('C')) return 'text-amber-600';
  return 'text-red-600';
}

/* ─── GPA Trend SVG Chart ────────────────────────────────────── */
function GPATrendChart() {
  const W = 520;           // Increased for better proportion
  const H = 130;
  const Pl = 10;           // Reduced left padding (was 22) → starts from left
  const Pr = 8;
  const Pt = 8;
  const Pb = 24;
  
  const cW = W - Pl - Pr;
  const cH = H - Pt - Pb;
  const minV = 0.8, maxV = 4.5;

  const actual    = [{v:1.0},{v:2.5},{v:2.7},{v:2.6},{v:2.9},{v:3.3},{v:3.55}];
  const months    = ['Aug','Sep','Oct','Nov','Dec','Jan','Feb'];
  const projExtra = [{v:3.75},{v:3.9}];
  const totalPts  = actual.length + projExtra.length;

  const tx = (i: number) => Pl + (i / (totalPts - 1)) * cW;
  const ty = (v: number) => Pt + cH - ((v - minV) / (maxV - minV)) * cH;

  const aPts = actual.map((d, i) => ({ x: tx(i), y: ty(d.v) }));
  const pPts = [aPts[aPts.length - 1], ...projExtra.map((d, i) => ({
    x: tx(actual.length + i), 
    y: ty(d.v)
  }))];

  const line = (pts: { x: number; y: number }[]) => {
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const dx = (pts[i].x - pts[i - 1].x) * 0.35;
      d += ` C${pts[i - 1].x + dx},${pts[i - 1].y} ${pts[i].x - dx},${pts[i].y} ${pts[i].x},${pts[i].y}`;
    }
    return d;
  };

  const ap = line(aPts);
  const pp = line(pPts);
  const bl = Pt + cH;
  const area = `${ap} L${aPts[aPts.length - 1].x},${bl} L${Pl},${bl}Z`;
  const yVals = [4.0, 3.0, 2.0, 1.0];

  return (
    <svg 
      viewBox={`0 0 ${W} ${H}`} 
      className="w-full h-auto"
      style={{ height: '210px', display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="gGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0.02"/>
        </linearGradient>
      </defs>

      {/* Horizontal Grid Lines */}
      {yVals.map(v => (
        <g key={v}>
          <line 
            x1={Pl} y1={ty(v)} 
            x2={W - Pr} y2={ty(v)} 
            stroke="#E5E7EB" 
            strokeWidth="0.8" 
            strokeDasharray="3,2"
          />
          <text 
            x={Pl - 6} y={ty(v) + 3} 
            textAnchor="end" 
            fontSize="7.5" 
            fill="#9CA3AF"
          >
            {v.toFixed(1)}
          </text>
        </g>
      ))}

      {/* Area Under Curve */}
      <path d={area} fill="url(#gGrad)" />

      {/* Actual GPA Line */}
      <path 
        d={ap} 
        fill="none" 
        stroke="#6366F1" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />

      {/* Projected GPA Line */}
      <path 
        d={pp} 
        fill="none" 
        stroke="#6366F1" 
        strokeWidth="2.5" 
        strokeDasharray="5,3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />

      {/* Dots on Actual Points */}
      {aPts.map((p, i) => (
        <circle 
          key={i} 
          cx={p.x} 
          cy={p.y} 
          r="2.8" 
          fill="white" 
          stroke="#6366F1" 
          strokeWidth="2" 
        />
      ))}

      {/* Month Labels */}
      {months.map((m, i) => (
        <text 
          key={m} 
          x={tx(i)} 
          y={H - 6} 
          textAnchor="middle" 
          fontSize="7.5" 
          fill="#9CA3AF"
          fontWeight="500"
        >
          {m}
        </text>
      ))}
    </svg>
  );
}


/* ─── Donut chart ────────────────────────────────────────────── */
function DonutChart() {
  const segments = [
    { pct:20, color:'#4F46E5', label:'A (90-100%)' },
    { pct:18, color:'#818CF8', label:'B (80-89%)'  },
    { pct:27, color:'#FCD34D', label:'C (70-79%)'  },
    { pct:27, color:'#F97316', label:'D (60-69%)'  },
    { pct:8,  color:'#F3F4F6', label:'F (Below 60%)'},
  ];
  const r=28, cx=36, cy=36;
  const circ=2*Math.PI*r;
  let offset=0;
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-shrink-0">
        <svg width="72" height="72" viewBox="0 0 72 72">
          {segments.map((s,i)=>{
            const dash = (s.pct/100)*circ;
            const el = (
              <circle key={i} cx={cx} cy={cy} r={r}
                fill="none" stroke={s.color} strokeWidth="10"
                strokeDasharray={`${dash} ${circ-dash}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 36 36)"
              />
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-base font-extrabold text-gray-900 leading-none">3.25</p>
          <p className="text-[8px] text-gray-400">Average</p>
        </div>
      </div>
      <div className="space-y-1">
        {segments.map((s,i)=>(
          <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-600">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{background:s.color}}/>
            <span>{s.label}</span>
            <span className="ml-auto font-bold text-gray-700">{[2,2,3,2,0][i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Target Grade Calculator ────────────────────────────────── */
function TargetCalc() {
  const [open, setOpen] = useState(false);
  const [examScore, setExamScore] = useState(85);
  const targetPct = 3.42 * 0.8 + (examScore/100) * 0.2;
  const letter = targetPct >= 0.93 ? 'A' : targetPct >= 0.90 ? 'A-' : targetPct >= 0.87 ? 'B+' : targetPct >= 0.83 ? 'B' : 'B-';

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-500" />
          <p className="text-sm font-extrabold text-gray-900">To reach my target grade, I need...</p>
        </div>
        <button onClick={()=>setOpen(!open)}
          className="text-xs font-bold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-md transition-all">
          Calculate
        </button>
      </div>

      {/* 4 separate white cards */}
      <div className="grid grid-cols-4 gap-3 mt-4">
        {[
          {label:'Current GPA',    value:'3.55', color:'text-gray-900',   icon:'📊', iconBg:'bg-indigo-50' },
          {label:'Target GPA',     value:'3.80', color:'text-green-600',  icon:'🎯', iconBg:'bg-green-50'  },
          {label:'Target Safe GPA',value:'3.70', color:'text-indigo-600', icon:'🛡', iconBg:'bg-blue-50'   },
          {label:'Classes on track',value:'3 / 5',color:'text-gray-900',  icon:'🏆', iconBg:'bg-amber-50'  },
        ].map((s,i)=>(
          <div key={i} className="bg-white border border-gray-100 rounded-md p-3 shadow-sm text-center">
            <div className={`w-10 h-10 rounded-2xl ${s.iconBg} flex items-center justify-center mx-auto mb-2 text-xl`}>
              {s.icon}
            </div>
            <p className={`text-xl font-extrabold leading-none ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-400 mt-1 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-[11px] text-gray-500 mb-1.5">
          <span className="font-semibold">GPA Progress to Target</span>
          <span>Current: 3.55 · Target: 3.80</span>
        </div>
        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full" style={{width:'88%'}}/>
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>0%</span>
          <span className="text-indigo-500 font-semibold">You're 0.25 GPA away from your target</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Class row card ─────────────────────────────────────────── */
function ClassRow({ cls }: { cls: typeof CLASSES[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm border-l-4 ${cls.borderColor}`}>
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${cls.iconBg} flex items-center justify-center text-xl flex-shrink-0`}>
              {cls.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-extrabold text-gray-900">{cls.name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls.statusColor}`}>
                  {cls.status === 'on-track' ? 'On track' : 'At risk'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">{cls.code} · {cls.credits} credits · Prof. {cls.prof.replace('Prof. ','')}</p>
            </div>
          </div>

          {/* Current + Projected grades */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-center">
              <p className="text-[10px] text-gray-400 mb-0.5">Current</p>
              <p className={`text-2xl font-extrabold leading-none ${gradeColor(cls.current)}`}>{cls.current}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{cls.currentPct}%</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 mb-0.5">Projected</p>
              <p className={`text-2xl font-extrabold leading-none ${gradeColor(cls.projected)}`}>{cls.projected}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{cls.projPct}%</p>
            </div>
            <button className="p-1 rounded-lg hover:bg-gray-100 transition-all">
              <MoreVertical className="w-4 h-4 text-gray-400"/>
            </button>
          </div>
        </div>

        {/* Score circles */}
        <div className="flex items-center gap-16 mb-3">
          {cls.scores.map((s,i)=>(
            <div key={i} className="flex flex-col items-center gap-1">
              {/* Circular progress */}
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#f3f4f6" strokeWidth="5"/>
                  <circle cx="22" cy="22" r="18" fill="none" stroke={s.color.replace('bg-','').includes('purple')?'#7C3AED':s.color.replace('bg-','').includes('green')?'#16A34A':s.color.replace('bg-','').includes('yellow')?'#D97706':s.color.replace('bg-','').includes('blue')?'#2563EB':'#DC2626'}
                    strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${(s.pct/100)*113} 113`}/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-extrabold text-gray-700">{s.pct}%</span>
                </div>
              </div>
              <p className="text-[9px] text-gray-400 text-center leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Details toggle */}
        <button onClick={()=>setOpen(!open)}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
          <span>{open ? '▲' : '▼'}</span> Details
        </button>

        {open && (
          <div className="mt-3 pt-3 border-t border-gray-50 space-y-2">
            {cls.scores.map((s,i)=>(
              <div key={i} className="flex items-center gap-3">
                <p className="text-xs text-gray-500 w-28 flex-shrink-0">{s.label}</p>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full`} style={{width:`${s.pct}%`}}/>
                </div>
                <span className="text-xs font-bold text-gray-700 w-8 text-right">{s.pct}%</span>
              </div>
            ))}
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

  useEffect(()=>{ const t=setTimeout(()=>setLoading(false),600); return()=>clearTimeout(t); },[]);
  useEffect(()=>{
    if (typeof window !== 'undefined' && localStorage.getItem('atlas_has_grades') === 'true') {
      setHasGrades(true);
    }
  }, []);

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

            {/* GPA Trend chart */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span>📈</span>
                  <p className="text-sm font-extrabold text-gray-900">GPA Trend</p>
                  <Tooltip text="Solid = actual GPA. Dashed = projected." position="right" width="w-48"/>
                </div>
                <div className="border border-gray-200 rounded-xl px-3.5 py-1.5 text-xs font-medium text-gray-600 bg-white shadow-sm cursor-pointer">
                  This Semester ▾
                </div>
              </div>

              {/* Left text + Right chart in one row */}
              <div style={{display:'flex', alignItems:'flex-start', width:'100%'}}>

                {/* LEFT — fixed narrow width */}
                <div style={{width:'110px', flexShrink:0}}>
                  <p style={{fontSize:'11px', color:'#9CA3AF', marginBottom:'2px'}}>Current GPA</p>
                  <p style={{fontSize:'38px', fontWeight:800, color:'#111827', lineHeight:1}}>3.55</p>
                  <p style={{fontSize:'11px', color:'#9CA3AF', marginTop:'12px', marginBottom:'2px'}}>Projected GPA</p>
                  <p style={{fontSize:'32px', fontWeight:800, color:'#22C55E', lineHeight:1}}>3.80</p>
                  <p style={{fontSize:'10px', color:'#22C55E', fontWeight:600, marginTop:'6px'}}>↑ +0.08 from last month</p>
                </div>

                {/* RIGHT — takes ALL remaining width */}
                <div style={{flex:1, minWidth:0}}>
                  <GPATrendChart/>
                  <div style={{display:'flex', gap:'16px', marginTop:'6px', paddingLeft:'20px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                      <svg width="20" height="3"><line x1="0" y1="1.5" x2="20" y2="1.5" stroke="#6366F1" strokeWidth="2"/></svg>
                      <span style={{fontSize:'10px', color:'#6B7280'}}>Actual GPA</span>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                      <svg width="20" height="3"><line x1="0" y1="1.5" x2="20" y2="1.5" stroke="#6366F1" strokeWidth="2" strokeDasharray="4,2"/></svg>
                      <span style={{fontSize:'10px', color:'#6B7280'}}>Projected GPA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Target Grade Calculator */}
            <TargetCalc/>

            {/* Class rows */}
            <div className="space-y-3">
              {CLASSES.map(cls=><ClassRow key={cls.id} cls={cls}/>)}
            </div>
          </div>

          {/* ── RIGHT sidebar ─────────────────────────────────── */}
          <div className="lg:w-[240px] lg:flex-shrink-0 space-y-4">

            {/* Top Performing Classes */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-yellow-500"/>
                <p className="text-sm font-extrabold text-gray-900">Top Performing Classes</p>
              </div>
              <div className="space-y-2">
                {[
                  {rank:1, name:'History 105',    pct:95, color:'text-green-600'},
                  {rank:2, name:'Statistics 201', pct:88, color:'text-indigo-600'},
                  {rank:3, name:'Biology 101',    pct:82, color:'text-green-600'},
                ].map(c=>(
                  <div key={c.name} className="flex items-center bg-indigo-50 border border-indigo-100 rounded-md px-3 py-1.5 gap-1">
                    <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-600 text-[10px] font-extrabold flex items-center justify-center flex-shrink-0">{c.rank}</span>
                    <p className="text-xs font-semibold text-gray-800 flex-1 truncate">{c.name}</p>
                    <span className={`text-xs font-extrabold flex-shrink-0 ${c.color}`}>{c.pct}%</span>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full text-center text-xs font-semibold text-indigo-600 hover:underline">View all</button>
            </div>

            {/* Needs Attention */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-orange-500"/>
                <p className="text-sm font-extrabold text-gray-900">Needs Attention</p>
              </div>
              <div className="space-y-2.5">
                {[
                  {rank:1, name:'English 110',  pct:70, color:'text-orange-500'},
                  {rank:2, name:'Chemistry 201',pct:60, color:'text-red-500'},
                ].map(c=>(
                  <div key={c.name} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-extrabold flex items-center justify-center flex-shrink-0">{c.rank}</span>
                    <p className="text-xs font-semibold text-gray-800 flex-1 truncate">{c.name}</p>
                    <span className={`text-xs font-extrabold flex-shrink-0 ${c.color}`}>{c.pct}%</span>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full text-center text-xs font-semibold text-indigo-600 hover:underline">View all</button>
            </div>

            {/* Grade Distribution */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 className="w-4 h-4 text-indigo-500"/>
                <p className="text-sm font-extrabold text-gray-900">Grade Distribution</p>
              </div>
              <DonutChart/>
              <button className="mt-3 w-full text-center text-xs font-semibold text-indigo-600 hover:underline">View full analytics</button>
            </div>

            {/* GPA Summary — indigo card */}
            <div className="bg-indigo-600 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-indigo-200"/>
                <p className="text-xs font-extrabold text-indigo-100">GPA Summary</p>
              </div>
              <p className="text-3xl font-extrabold leading-none">3.55 <span className="text-lg text-indigo-200">/ 4.00</span></p>
              <p className="text-xs text-indigo-200 mt-2">You're doing great! Keep going!</p>
            </div>

            {/* Insights */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-indigo-500"/>
                <p className="text-sm font-extrabold text-gray-900">Insights</p>
              </div>
              <div className="space-y-2.5">
                {[
                  {icon:'📈', text:"Your GPA is above the class average",  color:'text-green-600'},
                  {icon:'⚠️', text:"English 110 needs more attention",       color:'text-orange-500'},
                  {icon:'✅', text:"You're improving in 3 classes",          color:'text-indigo-600'},
                ].map((s,i)=>(
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-base flex-shrink-0">{s.icon}</span>
                    <p className={`text-xs font-medium ${s.color} leading-relaxed`}>{s.text}</p>
                  </div>
                ))}
              </div>
              <button className="mt-3 flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline">
                View full Insights <ArrowRight className="w-3 h-3"/>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Grade Modal */}
      {showAddModal && <AddGradeModal onClose={()=>setShowAddModal(false)} />}
    </AppLayout>
  );
}

/* ─── Add Grade Modal ────────────────────────────────────────── */
function AddGradeModal({ onClose }: { onClose: () => void }) {
  const [cls,    setCls]    = useState('bio101');
  const [name,   setName]   = useState('');
  const [type,   setType]   = useState('quiz');
  const [score,  setScore]  = useState('');
  const [total,  setTotal]  = useState('100');
  const [weight, setWeight] = useState('');
  const [saved,  setSaved]  = useState(false);

  const save = () => {
    if (!name.trim() || !score) return;
    setSaved(true);
    setTimeout(onClose, 800);
  };

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
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Class</label>
              <select value={cls} onChange={e=>setCls(e.target.value)}
                className="w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm outline-none bg-white transition-all">
                {CLASSES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Assignment name *</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Quiz 3, Midterm Exam"
                className="w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Type</label>
                <select value={type} onChange={e=>setType(e.target.value)}
                  className="w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm outline-none bg-white transition-all">
                  {['quiz','exam','assignment','lab','participation'].map(t=>(
                    <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Weight %</label>
                <input value={weight} onChange={e=>setWeight(e.target.value)} placeholder="e.g. 10"
                  className="w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Score *</label>
                <input value={score} onChange={e=>setScore(e.target.value)} placeholder="e.g. 85"
                  className="w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Out of</label>
                <input value={total} onChange={e=>setTotal(e.target.value)}
                  className="w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all" />
              </div>
            </div>
            {score && total && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3.5 py-2.5">
                <p className="text-xs font-semibold text-indigo-700">
                  Score: {Math.round((Number(score)/Number(total))*100)}% —
                  {Number(score)/Number(total) >= 0.9 ? ' 🌟 Excellent!' : Number(score)/Number(total) >= 0.8 ? ' ✅ Good' : Number(score)/Number(total) >= 0.7 ? ' 📈 Passing' : ' ⚠️ Needs work'}
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-2.5 mt-5">
            <button onClick={onClose}
              className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold py-2.5 rounded-xl text-sm transition-all">
              Cancel
            </button>
            <button onClick={save} disabled={!name.trim() || !score}
              className={`flex-1 font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
                saved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40'
              }`}>
              {saved ? '✓ Grade added!' : <><Plus className="w-4 h-4"/> Add grade</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
