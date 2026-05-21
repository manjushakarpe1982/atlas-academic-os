'use client';

import { useState } from 'react';
import {
  TrendingUp, Target, Plus, ChevronRight, ChevronDown,
  BarChart2, Trophy, Zap, X, AlertTriangle,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

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
