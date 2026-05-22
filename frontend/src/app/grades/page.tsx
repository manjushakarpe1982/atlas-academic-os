'use client';

import { useState } from 'react';
import {
  TrendingUp, Target, Plus, ChevronRight, ChevronDown,
  BarChart2, Trophy, Zap, X, AlertTriangle,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import EmptyState from '@/components/EmptyState';
import Tooltip from '@/components/Tooltip';

/* ─── Data ───────────────────────────────────────────────────── */
const CLASSES = [
  {
    id:'bio101', name:'Biology 101',
    bar:'bg-indigo-500', light:'bg-indigo-50', text:'text-indigo-600', border:'border-indigo-200',
    currentGrade:'B+', currentPct:87, projectedGrade:'A−', projectedPct:91,
    targetGrade:'A', targetPct:93, credits:4,
    categories:[
      { name:'Exams',        weight:50, earned:88, entries:[{name:'Exam 1',score:88,max:100,date:'Oct 10'}] },
      { name:'Quizzes',      weight:25, earned:82, entries:[{name:'Quiz 1',score:18,max:20,date:'Sep 15'},{name:'Quiz 2',score:19,max:20,date:'Oct 5'},{name:'Quiz 3',score:16,max:20,date:'Oct 28'}] },
      { name:'Homework',     weight:20, earned:95, entries:[{name:'HW 1',score:48,max:50,date:'Sep 20'},{name:'HW 2',score:50,max:50,date:'Oct 8'}] },
      { name:'Participation',weight:5,  earned:90, entries:[] },
    ],
    rec:{ label:'Score 91+ on Exam 2', status:'achievable', delta:'+1 letter grade' },
    next:{ name:'Exam 2', date:'Nov 20', weight:25 },
  },
  {
    id:'stat201', name:'Statistics 201',
    bar:'bg-emerald-500', light:'bg-emerald-50', text:'text-emerald-600', border:'border-emerald-200',
    currentGrade:'A−', currentPct:91, projectedGrade:'A', projectedPct:93,
    targetGrade:'A', targetPct:93, credits:3,
    categories:[
      { name:'Problem Sets',weight:40, earned:93, entries:[] },
      { name:'Midterm',     weight:30, earned:90, entries:[] },
      { name:'Final',       weight:30, earned:0,  entries:[] },
    ],
    rec:{ label:'Complete PS#4 on time', status:'secured', delta:'On track' },
    next:{ name:'Problem Set #4', date:'Nov 22', weight:8 },
  },
  {
    id:'eng110', name:'English 110',
    bar:'bg-amber-500', light:'bg-amber-50', text:'text-amber-600', border:'border-amber-200',
    currentGrade:'B', currentPct:83, projectedGrade:'B+', projectedPct:87,
    targetGrade:'B+', targetPct:87, credits:3,
    categories:[
      { name:'Essays',       weight:60, earned:83, entries:[] },
      { name:'Participation',weight:20, earned:88, entries:[] },
      { name:'Final project',weight:20, earned:0,  entries:[] },
    ],
    rec:{ label:'Score 85+ on Essay 2', status:'stretch', delta:'+1 grade needed' },
    next:{ name:'Essay 2', date:'Nov 25', weight:20 },
  },
  {
    id:'his105', name:'History 105',
    bar:'bg-purple-500', light:'bg-purple-50', text:'text-purple-600', border:'border-purple-200',
    currentGrade:'A', currentPct:95, projectedGrade:'A', projectedPct:95,
    targetGrade:'A', targetPct:93, credits:3,
    categories:[
      { name:'Papers', weight:50, earned:96, entries:[] },
      { name:'Quizzes',weight:30, earned:94, entries:[] },
      { name:'Midterm',weight:20, earned:95, entries:[] },
    ],
    rec:{ label:'Grade secured', status:'secured', delta:'No action needed' },
    next:{ name:'Quiz 5', date:'Dec 1', weight:6 },
  },
  {
    id:'chem201', name:'Chemistry 201',
    bar:'bg-red-500', light:'bg-red-50', text:'text-red-600', border:'border-red-200',
    currentGrade:'B−', currentPct:79, projectedGrade:'B', projectedPct:83,
    targetGrade:'B+', targetPct:87, credits:4,
    categories:[
      { name:'Labs',    weight:30, earned:85, entries:[] },
      { name:'Exams',   weight:50, earned:76, entries:[] },
      { name:'Homework',weight:20, earned:82, entries:[] },
    ],
    rec:{ label:'Score 90+ on Final', status:'stretch', delta:'Needs effort' },
    next:{ name:'Lab Report 3', date:'Nov 25', weight:6 },
  },
];

const LEVERAGE = [
  { class:'Biology 101',   action:'Study mitosis tonight',       impact:'+0.12 GPA', bar:'bg-indigo-500', light:'bg-indigo-50',  text:'text-indigo-600' },
  { class:'Chemistry 201', action:'Complete all homework on time',impact:'+0.08 GPA', bar:'bg-red-500',    light:'bg-red-50',     text:'text-red-600'    },
  { class:'English 110',   action:'Start Essay 2 outline today',  impact:'+0.05 GPA', bar:'bg-amber-500',  light:'bg-amber-50',   text:'text-amber-600'  },
];

const REC: Record<string,{bg:string;text:string;dot:string}> = {
  achievable:{ bg:'bg-emerald-50',  text:'text-emerald-700', dot:'bg-emerald-500' },
  secured:   { bg:'bg-blue-50',     text:'text-blue-700',    dot:'bg-blue-500'    },
  stretch:   { bg:'bg-orange-50',   text:'text-orange-700',  dot:'bg-orange-500'  },
  locked:    { bg:'bg-red-50',      text:'text-red-700',     dot:'bg-red-500'     },
};

const INP = 'w-full bg-gray-50 border border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:bg-white text-gray-900 placeholder:text-gray-400 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all font-medium';

/* ─── Grade pill ─────────────────────────────────────────────── */
function gradePct(pct: number) {
  if (pct >= 90) return 'text-emerald-600';
  if (pct >= 80) return 'text-indigo-600';
  if (pct >= 70) return 'text-amber-600';
  return 'text-red-600';
}

/* ─── Add Grade Modal ────────────────────────────────────────── */
function AddGradeModal({ onClose }: { onClose: () => void }) {
  const [cls,   setCls]   = useState('bio101');
  const [cat,   setCat]   = useState('Quizzes');
  const [name,  setName]  = useState('');
  const [score, setScore] = useState('');
  const [max,   setMax]   = useState('100');

  const pct = score && max ? Math.round((+score / +max) * 100) : null;
  const letterGrade = pct ? (pct>=90?'A':pct>=80?'B':pct>=70?'C':pct>=60?'D':'F') : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500" />
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-0 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-extrabold text-gray-900">Add new grade</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Class */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Class</label>
              <select className={INP} value={cls} onChange={(e) => setCls(e.target.value)}>
                {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Category</label>
              <select className={INP} value={cat} onChange={(e) => setCat(e.target.value)}>
                {(CLASSES.find((c) => c.id === cls)?.categories || []).map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Assignment name</label>
              <input className={INP} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Quiz 4, Lab Report 2…" />
            </div>

            {/* Score + max */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Score</label>
                <input type="number" className={INP} value={score} onChange={(e) => setScore(e.target.value)} placeholder="85" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Out of</label>
                <input type="number" className={INP} value={max} onChange={(e) => setMax(e.target.value)} placeholder="100" />
              </div>
            </div>

            {/* Live preview */}
            {pct !== null && (
              <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                pct >= 90 ? 'bg-emerald-50 border border-emerald-200' :
                pct >= 80 ? 'bg-indigo-50 border border-indigo-200' :
                'bg-amber-50 border border-amber-200'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold ${
                    pct>=90?'bg-emerald-100 text-emerald-700':pct>=80?'bg-indigo-100 text-indigo-700':'bg-amber-100 text-amber-700'
                  }`}>{letterGrade}</div>
                  <div>
                    <p className={`text-sm font-extrabold ${pct>=90?'text-emerald-700':pct>=80?'text-indigo-700':'text-amber-700'}`}>{pct}%</p>
                    <p className="text-[10px] text-gray-500">{score} / {max} points</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500">Impact on grade</p>
                  <p className={`text-xs font-bold ${pct>=90?'text-emerald-600':pct>=80?'text-indigo-600':'text-amber-600'}`}>
                    {pct >= 88 ? '↑ Improves grade' : pct >= 80 ? '→ Holds grade' : '↓ Lowers grade'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-all text-sm">
              Cancel
            </button>
            <button onClick={onClose} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all text-sm shadow-md shadow-indigo-500/20">
              Save grade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Class row (collapsible) ────────────────────────────────── */
function ClassRow({ cls, onAddGrade }: { cls: typeof CLASSES[0]; onAddGrade: () => void }) {
  const [open, setOpen] = useState(false);
  const rec = REC[cls.rec.status];
  const atTarget = cls.projectedPct >= cls.targetPct;

  return (
    <div className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-all ${
      open ? 'border-indigo-200' : 'border-gray-100'
    }`}>
      {/* Header row */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50/50 transition-all"
        onClick={() => setOpen(!open)}
      >
        {/* Colour bar */}
        <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${cls.bar}`} />

        {/* Class name + rec */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-gray-900">{cls.name}</p>
            {atTarget && (
              <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">On track ✓</span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">{cls.credits} cr · Target {cls.targetGrade} · Next: {cls.next.name} {cls.next.date}</p>
        </div>

        {/* Current → Projected */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-center hidden sm:block">
            <p className="text-[9px] text-gray-400 mb-0.5">Current</p>
            <p className={`text-lg font-extrabold leading-none ${gradePct(cls.currentPct)}`}>{cls.currentGrade}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">{cls.currentPct}%</p>
          </div>
          <span className="text-gray-300 text-sm hidden sm:block">→</span>
          <div className="text-center">
            <p className="text-[9px] text-gray-400 mb-0.5">Projected</p>
            <p className={`text-lg font-extrabold leading-none ${gradePct(cls.projectedPct)}`}>{cls.projectedGrade}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">{cls.projectedPct}%</p>
          </div>
        </div>

        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>

      {/* Progress bars — always visible */}
      <div className="px-4 pb-3 space-y-1.5">
        {cls.categories.filter((c) => c.earned > 0).slice(0, 3).map((cat) => (
          <div key={cat.name} className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 w-20 sm:w-24 flex-shrink-0 truncate">{cat.name} <span className="hidden sm:inline">({cat.weight}%)</span></span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${cls.bar} rounded-full opacity-80`} style={{ width:`${cat.earned}%` }} />
            </div>
            <span className="text-[10px] font-semibold text-gray-600 w-7 text-right">{cat.earned}%</span>
          </div>
        ))}
      </div>

      {/* Recommendation strip */}
      <div className={`mx-4 mb-3 px-3 py-2 rounded-xl flex items-center gap-2 ${rec.bg}`}>
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${rec.dot}`} />
        <p className={`text-[11px] font-semibold ${rec.text} flex-1 truncate`}>{cls.rec.label}</p>
        <span className={`text-[10px] font-bold ${rec.text} flex-shrink-0 hidden sm:block`}>{cls.rec.delta}</span>
      </div>

      {/* Expanded — grade entries */}
      {open && (
        <div className="border-t border-gray-100 px-4 pt-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-gray-700">Grade entries</p>
            <button onClick={(e) => { e.stopPropagation(); onAddGrade(); }}
              className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 px-2.5 py-1 rounded-lg transition-all">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {cls.categories.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[11px] font-bold text-gray-600">{cat.name} <span className="font-normal text-gray-400">({cat.weight}% weight)</span></p>
                  {cat.earned > 0 && <span className={`text-[11px] font-extrabold ${gradePct(cat.earned)}`}>{cat.earned}% avg</span>}
                </div>
                {cat.entries.length > 0 ? (
                  <div className="space-y-1 pl-2">
                    {cat.entries.map((e, i) => (
                      <div key={i} className="flex items-center gap-3 py-1 border-b border-gray-50">
                        <p className="text-xs text-gray-700 flex-1 truncate">{e.name}</p>
                        <span className="text-[10px] text-gray-400">{e.date}</span>
                        <span className={`text-xs font-bold ${gradePct(Math.round((e.score/e.max)*100))}`}>
                          {e.score}/{e.max} <span className="font-normal text-gray-400">({Math.round((e.score/e.max)*100)}%)</span>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400 italic pl-2">No entries yet</p>
                )}
              </div>
            ))}
          </div>

          {/* Next assessment callout */}
          <div className="mt-3 flex items-center gap-2.5 bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2.5">
            <AlertTriangle className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
            <p className="text-[11px] text-indigo-700 font-medium">
              <strong>{cls.next.name}</strong> on {cls.next.date} · Worth {cls.next.weight}% of final grade
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
/* ─── What-if grade simulator ───────────────────────────────── */
/* ─── GPA Trajectory Chart ───────────────────────────────────── */
function GPATrajectory() {
  const weeks = [
    { week:'W1',  gpa:3.20 },
    { week:'W2',  gpa:3.20 },
    { week:'W3',  gpa:3.35 },
    { week:'W4',  gpa:3.28 },
    { week:'W5',  gpa:3.35 },
    { week:'W6',  gpa:3.42 },
    { week:'W7',  gpa:3.38 },
    { week:'W8',  gpa:3.42 },
    { week:'W9',  gpa:3.50 },
    { week:'W10', gpa:3.55 },
    { week:'W11', gpa:3.61, projected:true },
    { week:'W12', gpa:3.68, projected:true },
  ];

  const min = 3.0;
  const max = 4.0;
  const h   = 80;
  const w   = 100 / (weeks.length - 1);

  const toY = (gpa: number) => h - ((gpa - min) / (max - min)) * h;

  const solidPoints = weeks.filter((_, i) => i < 10).map((d, i) => `${i * w},${toY(d.gpa)}`).join(' ');
  const allPoints   = weeks.map((d, i) => `${i * w},${toY(d.gpa)}`).join(' ');
  const currentGpa  = weeks[9].gpa;
  const projGpa     = weeks[weeks.length - 1].gpa;
  const trend       = projGpa >= currentGpa ? 'up' : 'down';

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <p className="text-sm font-extrabold text-gray-900">GPA trajectory</p>
          <Tooltip text="Your GPA plotted week by week. Solid line = actual. Dashed = Atlas projection based on current grades and upcoming assessments." position="right" width="w-60" />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-400">Current</p>
            <p className="text-base font-extrabold text-gray-900">{currentGpa.toFixed(2)}</p>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="text-right">
            <p className="text-xs text-gray-400">Projected</p>
            <p className={`text-base font-extrabold ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend === 'up' ? '↑' : '↓'} {projGpa.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative">
        <svg viewBox={`0 0 100 ${h + 10}`} preserveAspectRatio="none" className="w-full h-24">
          {/* Grid lines */}
          {[3.0, 3.25, 3.5, 3.75, 4.0].map((g) => (
            <line key={g} x1="0" y1={toY(g)} x2="100" y2={toY(g)}
              stroke="#f3f4f6" strokeWidth="0.5" />
          ))}
          {/* Projected area fill */}
          <polyline points={`${9 * w},${toY(weeks[9].gpa)} ${allPoints.split(' ').slice(9).join(' ')} ${11 * w},${h} ${9 * w},${h}`}
            fill="rgba(99,102,241,0.06)" stroke="none" />
          {/* Solid line */}
          <polyline points={solidPoints} fill="none" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Dashed projected line */}
          <polyline points={`${9 * w},${toY(weeks[9].gpa)} ${weeks.slice(9).map((d,i) => `${(9+i)*w},${toY(d.gpa)}`).join(' ')}`}
            fill="none" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="2,2" strokeLinecap="round" />
          {/* Current point */}
          <circle cx={9 * w} cy={toY(weeks[9].gpa)} r="2" fill="#4F46E5" />
          {/* Projected end point */}
          <circle cx={11 * w} cy={toY(projGpa)} r="2" fill="none" stroke="#4F46E5" strokeWidth="1.5" />
        </svg>

        {/* X axis labels */}
        <div className="flex justify-between mt-1">
          {weeks.filter((_, i) => i % 3 === 0 || i === weeks.length - 1).map((d) => (
            <span key={d.week} className={`text-[9px] ${d.projected ? 'text-indigo-400' : 'text-gray-400'}`}>
              {d.week}
            </span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-indigo-600" />
          <span className="text-[10px] text-gray-500">Actual GPA</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-indigo-400" style={{ borderTop:'1.5px dashed #818cf8' }} />
          <span className="text-[10px] text-gray-500">Projected</span>
        </div>
        {trend === 'up' && (
          <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            📈 Trending up
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Target Grade Calculator ────────────────────────────────── */
function TargetGradeCalc() {
  const [targetClass, setTargetClass] = useState('bio101');
  const [targetLetter, setTargetLetter] = useState('A');
  const [open, setOpen] = useState(false);

  const classes = [
    { id:'bio101', name:'Biology 101',    currentPct:87, remaining:[
        { name:'Exam 2',  weight:25 },
        { name:'Final',   weight:25 },
      ]},
    { id:'stat201', name:'Statistics 201', currentPct:79, remaining:[
        { name:'PS #4',   weight:10 },
        { name:'Midterm', weight:20 },
        { name:'Final',   weight:30 },
      ]},
    { id:'eng301', name:'English 301',    currentPct:84, remaining:[
        { name:'Essay 2', weight:20 },
        { name:'Final',   weight:25 },
      ]},
  ];

  const targetPcts: Record<string,number> = { 'A':93,'A−':90,'B+':87,'B':83,'B−':80,'C+':77,'C':73 };
  const cls = classes.find((c) => c.id === targetClass)!;
  const targetPct = targetPcts[targetLetter];
  const earnedWeight = 100 - cls.remaining.reduce((s,r) => s + r.weight, 0);
  const earnedContrib = (cls.currentPct * earnedWeight) / 100;
  const remainingWeight = 100 - earnedWeight;
  const neededContrib = targetPct - earnedContrib;
  const neededAvg = remainingWeight > 0 ? Math.round((neededContrib / remainingWeight) * 100) : 0;
  const feasible = neededAvg <= 100;
  const easy     = neededAvg <= 85;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm mb-4">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600" />
          <p className="text-sm font-extrabold text-gray-900">To reach my target grade, I need…</p>
          <Tooltip text="Enter your target grade and Atlas calculates the exact score needed on remaining assessments." position="right" width="w-56" />
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 transition-all ${open ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
          {open ? '▲ Close' : '▼ Calculate'}
        </span>
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Class</label>
              <select value={targetClass} onChange={(e) => setTargetClass(e.target.value)}
                className="w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none bg-white transition-all">
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Target grade</label>
              <select value={targetLetter} onChange={(e) => setTargetLetter(e.target.value)}
                className="w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none bg-white transition-all">
                {Object.keys(targetPcts).map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Result card */}
          <div className={`rounded-2xl border-2 p-4 ${
            !feasible ? 'bg-red-50 border-red-200' :
            easy      ? 'bg-emerald-50 border-emerald-200' :
                        'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-xs font-bold text-gray-600 mb-0.5">
                  {!feasible ? '❌ Not achievable' : easy ? '✅ Achievable' : '⚠️ Challenging but possible'}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  To get <strong>{targetLetter}</strong> in {cls.name}, you need an average of
                </p>
              </div>
              <div className={`text-4xl font-extrabold flex-shrink-0 ${
                !feasible ? 'text-red-600' : easy ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {!feasible ? '100+' : `${neededAvg}%`}
              </div>
            </div>

            {/* Remaining assessments breakdown */}
            <div className="space-y-1.5 mb-3">
              {cls.remaining.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-xs bg-white/60 rounded-lg px-3 py-1.5">
                  <span className="font-medium text-gray-700">{r.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{r.weight}% of grade</span>
                    <span className={`font-extrabold ${
                      !feasible ? 'text-red-600' : easy ? 'text-emerald-600' : 'text-amber-600'
                    }`}>→ {!feasible ? '100+' : neededAvg}%</span>
                  </div>
                </div>
              ))}
            </div>

            <p className={`text-[11px] font-medium leading-relaxed ${
              !feasible ? 'text-red-700' :
              easy      ? 'text-emerald-700' :
                          'text-amber-700'
            }`}>
              {!feasible
                ? `Even scoring 100% on everything remaining won't reach ${targetLetter}. Consider targeting ${targetLetter === 'A' ? 'A−' : 'B+'} instead.`
                : easy
                ? `You're on track! ${neededAvg}% is within reach — keep your current study pace.`
                : `${neededAvg}% is above your current average (${cls.currentPct}%). Atlas recommends 2× study sessions this week.`
              }
            </p>
          </div>

          {/* Semester GPA impact */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 flex items-center justify-between">
            <p className="text-xs font-semibold text-indigo-800">Semester GPA if you achieve {targetLetter}</p>
            <p className="text-sm font-extrabold text-indigo-700">
              {feasible ? (3.42 + 0.08 * (easy ? 1.5 : 0.8)).toFixed(2) : '3.42'} GPA
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function WhatIfSimulator() {
  const [examScore, setExamScore] = useState(85);
  const [show,      setShow]      = useState(false);

  // Current: 87.2% — weights: Exams 40%, HW 30%, Quizzes 20%, Lab 10%
  // Exam 2 is 20% of final grade
  const currentGrade = 87.2;
  const examWeight   = 0.20;
  const otherWeight  = 1 - examWeight;
  const projected    = currentGrade * otherWeight + examScore * examWeight;
  const letter       = projected >= 93 ? 'A' : projected >= 90 ? 'A−' : projected >= 87 ? 'B+' : projected >= 83 ? 'B' : projected >= 80 ? 'B−' : projected >= 77 ? 'C+' : 'C';
  const letterColor  = projected >= 90 ? 'text-emerald-600' : projected >= 80 ? 'text-indigo-600' : 'text-amber-600';

  return (
    <div className="bg-white border border-indigo-200 rounded-2xl p-4 shadow-sm mb-4">
      <button onClick={() => setShow(!show)}
        className="w-full flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🎯</span>
          <p className="text-sm font-extrabold text-gray-900">What-if grade simulator</p>
          <Tooltip text="Slide to a hypothetical exam score and instantly see what your final grade would be." position="right" width="w-56" />
        </div>
        <span className="text-[10px] font-semibold text-indigo-500">{show ? '▲ Hide' : '▼ Try it'}</span>
      </button>

      {show && (
        <div className="mt-4 space-y-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-indigo-800">If I score on Exam 2:</p>
              <span className="text-lg font-extrabold text-indigo-700">{examScore}%</span>
            </div>
            <input type="range" min={0} max={100} value={examScore}
              onChange={(e) => setExamScore(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer" />
            <div className="flex justify-between text-[9px] text-indigo-400 mt-0.5">
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white border-2 border-indigo-200 rounded-xl px-4 py-3">
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">Projected final grade</p>
              <p className="text-2xl font-extrabold text-gray-900">{projected.toFixed(1)}%</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 mb-0.5">Letter grade</p>
              <p className={`text-3xl font-extrabold ${letterColor}`}>{letter}</p>
            </div>
          </div>

          {projected >= 90 && <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">🎉 Score {examScore}%+ on Exam 2 to finish with an A!</p>}
          {projected >= 80 && projected < 90 && <p className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2">💪 You need {Math.ceil((90 - currentGrade * otherWeight) / examWeight)}% on Exam 2 to reach an A−.</p>}
          {projected < 80 && <p className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">⚠️ Score at least {Math.ceil((80 - currentGrade * otherWeight) / examWeight)}% to stay above a B−.</p>}
        </div>
      )}
    </div>
  );
}

export default function GradesPage() {
  const [showModal, setShowModal] = useState(false);

  const currentGPA   = 3.42;
  const projectedGPA = 3.61;
  const targetGPA    = 3.70;
  const onTrack      = CLASSES.filter((c) => c.projectedPct >= c.targetPct).length;

  return (
    <AppLayout>
      {showModal && <AddGradeModal onClose={() => setShowModal(false)} />}

      <div className="p-4 md:p-6 max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-gray-900">Grade Tracker</h1>
            <p className="text-xs text-gray-400 mt-0.5">Fall 2026 · Updated just now</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold px-3.5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20">
            <Plus className="w-3.5 h-3.5" /> Add grade
          </button>
        </div>

        {/* GPA Trajectory Chart */}
        <GPATrajectory />

        {/* Target Grade Calculator */}
        <TargetGradeCalc />

        {/* GPA summary — 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label:'Current GPA',     value:currentGPA.toFixed(2),   icon:BarChart2,  color:'text-indigo-600', bg:'bg-indigo-50',  border:'border-indigo-100' },
            { label:'Projected GPA',   value:projectedGPA.toFixed(2), icon:TrendingUp, color:'text-emerald-600',bg:'bg-emerald-50', border:'border-emerald-100'},
            { label:'Target GPA',      value:targetGPA.toFixed(2),    icon:Target,     color:'text-blue-600',   bg:'bg-blue-50',    border:'border-blue-100'   },
            { label:'Classes on track',value:`${onTrack}/${CLASSES.length}`, icon:Trophy, color:'text-purple-600', bg:'bg-purple-50', border:'border-purple-100' },
          ].map((s) => (
            <div key={s.label} className={`bg-white border ${s.border} rounded-2xl p-3.5 md:p-4 shadow-sm`}>
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-2.5`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-xl md:text-2xl font-extrabold ${s.color} leading-none`}>{s.value}</p>
              <p className="text-[10px] md:text-[11px] text-gray-400 font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* GPA progress bar — full width */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-700">GPA progress to target</p>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-gray-400">Current: <strong className="text-indigo-600">{currentGPA}</strong></span>
              <span className="text-gray-300">→</span>
              <span className="text-gray-400">Projected: <strong className="text-emerald-600">{projectedGPA}</strong></span>
              <span className="text-gray-300">→</span>
              <span className="text-gray-400">Target: <strong className="text-blue-600">{targetGPA}</strong></span>
            </div>
          </div>
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
            {/* Target marker */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-blue-400 z-10" style={{ left:`${(targetGPA/4)*100}%` }} />
            {/* Projected */}
            <div className="absolute top-0 bottom-0 rounded-full bg-indigo-200"
              style={{ width:`${(projectedGPA/4)*100}%` }} />
            {/* Current */}
            <div className="absolute top-0 bottom-0 rounded-full bg-indigo-500"
              style={{ width:`${(currentGPA/4)*100}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>0.00</span>
            <span>Target {targetGPA} — gap: {(targetGPA - currentGPA).toFixed(2)}</span>
            <span>4.00</span>
          </div>
        </div>

        {/* Main layout — stacks on mobile */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* Class rows */}
          <div className="flex-1 space-y-3">
            {CLASSES.map((cls) => (
              <ClassRow key={cls.id} cls={cls} onAddGrade={() => setShowModal(true)} />
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:w-[220px] lg:flex-shrink-0 space-y-3">

            {/* Leverage moves */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-3">
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <p className="text-xs font-bold text-gray-700">Top leverage moves</p>
              </div>
              {/* Grid on mobile, stack on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                {LEVERAGE.map((l, i) => (
                  <div key={i} className={`${l.light} rounded-xl p-3 border border-transparent`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${l.bar}`} />
                      <p className="text-[10px] font-bold text-gray-500 truncate">{l.class}</p>
                    </div>
                    <p className="text-[11px] font-semibold text-gray-800 leading-snug">{l.action}</p>
                    <p className={`text-[11px] font-extrabold ${l.text} mt-1`}>{l.impact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent grades */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Recent grades</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-2 lg:gap-0 lg:space-y-2">
                {[
                  { name:'Bio Quiz 3',   score:'82%', pct:82 },
                  { name:'Bio HW 4',     score:'95%', pct:95 },
                  { name:'Bio Exam 1',   score:'88%', pct:88 },
                  { name:'Stats PS #3',  score:'92%', pct:92 },
                ].map((g) => (
                  <div key={g.name} className="flex items-center justify-between py-0.5">
                    <p className="text-[11px] text-gray-600 truncate">{g.name}</p>
                    <span className={`text-[11px] font-extrabold ml-2 flex-shrink-0 ${gradePct(g.pct)}`}>{g.score}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowModal(true)}
                className="w-full mt-3 flex items-center justify-center gap-1 text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 py-2 rounded-xl transition-all border border-indigo-100">
                <Plus className="w-3.5 h-3.5" /> Add grade
              </button>
            </div>

            {/* GPA gradient card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-4 text-white">
              <Trophy className="w-5 h-5 text-indigo-200 mb-2" />
              <p className="text-xs font-bold mb-1">GPA Progress</p>
              <div className="flex items-end gap-1.5 mb-2.5">
                <span className="text-2xl font-extrabold">{currentGPA}</span>
                <span className="text-indigo-200 text-xs mb-1">→ {projectedGPA}</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-white rounded-full" style={{ width:`${(currentGPA/4)*100}%` }} />
              </div>
              <p className="text-[10px] text-indigo-200">
                Target {targetGPA} · {((targetGPA-currentGPA)).toFixed(2)} points to go
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
