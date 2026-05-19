'use client';

import { useState } from 'react';
import {
  TrendingUp, Star, Target, CheckCircle2,
  AlertCircle, Plus, ChevronRight, BarChart2,
  Trophy, Zap, BookOpen,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

/* ─── Mock data ──────────────────────────────────────────────── */
const CLASSES = [
  {
    id: 'bio101',
    name: 'Biology 101',
    color: 'bg-indigo-500',
    lightBg: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    currentGrade: 'B+',
    currentPct: 87,
    projectedGrade: 'A−',
    projectedPct: 91,
    targetGrade: 'A',
    targetPct: 93,
    credits: 4,
    categories: [
      { name:'Exams',        weight:50, earned:88, entries:[{name:'Exam 1',score:88,max:100,date:'Oct 10'}] },
      { name:'Quizzes',      weight:25, earned:82, entries:[{name:'Quiz 1',score:18,max:20,date:'Sep 15'},{name:'Quiz 2',score:19,max:20,date:'Oct 5'},{name:'Quiz 3',score:16,max:20,date:'Oct 28'}] },
      { name:'Homework',     weight:20, earned:95, entries:[{name:'HW 1',score:48,max:50,date:'Sep 20'},{name:'HW 2',score:50,max:50,date:'Oct 8'}] },
      { name:'Participation',weight:5,  earned:90, entries:[] },
    ],
    recommendation: { label:'Score 91+ on Exam 2', status:'achievable', delta:'+1 letter grade' },
    nextAssessment: { name:'Exam 2', date:'Nov 20', weight:25 },
  },
  {
    id: 'stat201',
    name: 'Statistics 201',
    color: 'bg-green-500',
    lightBg: 'bg-green-50',
    textColor: 'text-green-700',
    currentGrade: 'A−',
    currentPct: 91,
    projectedGrade: 'A',
    projectedPct: 93,
    targetGrade: 'A',
    targetPct: 93,
    credits: 3,
    categories: [
      { name:'Problem Sets', weight:40, earned:93, entries:[] },
      { name:'Midterm',      weight:30, earned:90, entries:[] },
      { name:'Final',        weight:30, earned:0,  entries:[] },
    ],
    recommendation: { label:'Complete PS#4 on time', status:'secured', delta:'On track' },
    nextAssessment: { name:'Problem Set #4', date:'Nov 22', weight:8 },
  },
  {
    id: 'eng110',
    name: 'English 110',
    color: 'bg-yellow-500',
    lightBg: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    currentGrade: 'B',
    currentPct: 83,
    projectedGrade: 'B+',
    projectedPct: 87,
    targetGrade: 'B+',
    targetPct: 87,
    credits: 3,
    categories: [
      { name:'Essays',         weight:60, earned:83, entries:[] },
      { name:'Participation',  weight:20, earned:88, entries:[] },
      { name:'Final project',  weight:20, earned:0,  entries:[] },
    ],
    recommendation: { label:'Score 85+ on Essay 2', status:'stretch', delta:'+1 grade needed' },
    nextAssessment: { name:'Essay 2', date:'Nov 25', weight:20 },
  },
  {
    id: 'his105',
    name: 'History 105',
    color: 'bg-purple-500',
    lightBg: 'bg-purple-50',
    textColor: 'text-purple-700',
    currentGrade: 'A',
    currentPct: 95,
    projectedGrade: 'A',
    projectedPct: 95,
    targetGrade: 'A',
    targetPct: 93,
    credits: 3,
    categories: [
      { name:'Papers',   weight:50, earned:96, entries:[] },
      { name:'Quizzes',  weight:30, earned:94, entries:[] },
      { name:'Midterm',  weight:20, earned:95, entries:[] },
    ],
    recommendation: { label:'Grade secured', status:'secured', delta:'No action needed' },
    nextAssessment: { name:'Quiz 5', date:'Dec 1', weight:6 },
  },
  {
    id: 'chem201',
    name: 'Chemistry 201',
    color: 'bg-red-500',
    lightBg: 'bg-red-50',
    textColor: 'text-red-700',
    currentGrade: 'B−',
    currentPct: 79,
    projectedGrade: 'B',
    projectedPct: 83,
    targetGrade: 'B+',
    targetPct: 87,
    credits: 4,
    categories: [
      { name:'Labs',         weight:30, earned:85, entries:[] },
      { name:'Exams',        weight:50, earned:76, entries:[] },
      { name:'Homework',     weight:20, earned:82, entries:[] },
    ],
    recommendation: { label:'Score 90+ on Final exam', status:'stretch', delta:'Needs significant effort' },
    nextAssessment: { name:'Lab Report 3', date:'Nov 25', weight:6 },
  },
];

const REC_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  achievable: { bg:'bg-green-50',  text:'text-green-700',  dot:'bg-green-500'  },
  secured:    { bg:'bg-blue-50',   text:'text-blue-700',   dot:'bg-blue-500'   },
  stretch:    { bg:'bg-orange-50', text:'text-orange-700', dot:'bg-orange-500' },
  locked:     { bg:'bg-red-50',    text:'text-red-700',    dot:'bg-red-500'    },
};

const LEVERAGE_MOVES = [
  { class:'Biology 101',   action:'Study mitosis tonight',       impact:'+0.12 GPA', color:'text-indigo-600', bg:'bg-indigo-50' },
  { class:'Chemistry 201', action:'Complete all homework on time',impact:'+0.08 GPA', color:'text-red-600',    bg:'bg-red-50'    },
  { class:'English 110',   action:'Start Essay 2 outline today',  impact:'+0.05 GPA', color:'text-yellow-600', bg:'bg-yellow-50' },
];

/* ─── Class grade row ────────────────────────────────────────── */
function ClassGradeRow({ cls, onExpand }: { cls: typeof CLASSES[0]; onExpand: () => void }) {
  const rec = REC_STYLES[cls.recommendation.status];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        {/* Left accent */}
        <div className={`w-1.5 self-stretch rounded-full ${cls.color} flex-shrink-0`} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-gray-900">{cls.name}</p>
              <p className="text-[11px] text-gray-400">{cls.credits} credits · Target: {cls.targetGrade}</p>
            </div>
            {/* Grade */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-center">
                <p className="text-[10px] text-gray-400 mb-0.5">Current</p>
                <p className={`text-xl font-extrabold ${
                  cls.currentPct >= 90 ? 'text-green-600' : cls.currentPct >= 80 ? 'text-indigo-600' : 'text-orange-600'
                }`}>{cls.currentGrade}</p>
                <p className="text-[10px] text-gray-400">{cls.currentPct}%</p>
              </div>
              <div className="text-gray-300 text-lg">→</div>
              <div className="text-center">
                <p className="text-[10px] text-gray-400 mb-0.5">Projected</p>
                <p className={`text-xl font-extrabold ${
                  cls.projectedPct >= 90 ? 'text-green-600' : cls.projectedPct >= 80 ? 'text-indigo-600' : 'text-orange-600'
                }`}>{cls.projectedGrade}</p>
                <p className="text-[10px] text-gray-400">{cls.projectedPct}%</p>
              </div>
            </div>
          </div>

          {/* Category bars */}
          <div className="space-y-1.5 mb-3">
            {cls.categories.filter((c) => c.earned > 0).slice(0, 3).map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 w-24 flex-shrink-0">{cat.name} ({cat.weight}%)</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${cls.color} rounded-full opacity-80`} style={{ width:`${cat.earned}%` }} />
                </div>
                <span className="text-[10px] font-semibold text-gray-600 w-8 text-right">{cat.earned}%</span>
              </div>
            ))}
          </div>

          {/* Recommendation pill + next assessment */}
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${rec.bg} ${rec.text}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${rec.dot}`} />
              {cls.recommendation.label}
              <span className="opacity-70">— {cls.recommendation.delta}</span>
            </span>
            <button onClick={onExpand}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
              Details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Add grade modal ────────────────────────────────────────── */
function AddGradeModal({ onClose }: { onClose: () => void }) {
  const [selectedClass, setClass] = useState('bio101');
  const [category,     setCategory] = useState('Quizzes');
  const [name,         setName]     = useState('');
  const [score,        setScore]    = useState('');
  const [max,          setMax]      = useState('100');

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Add new grade</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Class</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-500"
              value={selectedClass} onChange={(e) => setClass(e.target.value)}>
              {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Category</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-500"
              value={category} onChange={(e) => setCategory(e.target.value)}>
              {(CLASSES.find((c) => c.id === selectedClass)?.categories || []).map((cat) => (
                <option key={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Assignment name</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-500"
              value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Quiz 4" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Score</label>
              <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-500"
                value={score} onChange={(e) => setScore(e.target.value)} placeholder="85" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Out of</label>
              <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-500"
                value={max} onChange={(e) => setMax(e.target.value)} placeholder="100" />
            </div>
          </div>

          {score && max && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5 flex items-center justify-between">
              <p className="text-xs font-semibold text-indigo-700">Grade: {Math.round((+score / +max) * 100)}%</p>
              <p className="text-xs text-indigo-500">
                {+score / +max >= 0.9 ? 'A' : +score / +max >= 0.8 ? 'B' : +score / +max >= 0.7 ? 'C' : 'D'}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button onClick={onClose}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20">
            Save grade
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function GradesPage() {
  const [showModal, setShowModal] = useState(false);

  const currentGPA  = 3.42;
  const projectedGPA= 3.61;
  const targetGPA   = 3.70;
  const onTrack     = CLASSES.filter((c) => c.projectedPct >= c.targetPct).length;

  return (
    <AppLayout>
      <div className="p-6 max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grade Tracker</h1>
            <p className="text-sm text-gray-400 mt-0.5">Fall 2026 · Updated just now</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20">
            <Plus className="w-4 h-4" /> Add grade
          </button>
        </div>

        {/* GPA summary strip */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label:'Current GPA',    value:currentGPA.toFixed(2),   icon:BarChart2,    color:'text-indigo-600', bg:'bg-indigo-50'  },
            { label:'Projected GPA',  value:projectedGPA.toFixed(2), icon:TrendingUp,   color:'text-green-600',  bg:'bg-green-50'   },
            { label:'Target GPA',     value:targetGPA.toFixed(2),    icon:Target,       color:'text-blue-600',   bg:'bg-blue-50'    },
            { label:'Classes on track',value:`${onTrack}/${CLASSES.length}`,icon:Trophy,color:'text-purple-600', bg:'bg-purple-50'  },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2.5`}>
                <s.icon className={`w-4.5 h-4.5 ${s.color}`} style={{width:18,height:18}} />
              </div>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-5">
          {/* Class rows */}
          <div className="flex-1 space-y-3">
            {CLASSES.map((cls) => (
              <ClassGradeRow key={cls.id} cls={cls} onExpand={() => {}} />
            ))}
          </div>

          {/* Right sidebar */}
          <div className="w-[220px] flex-shrink-0 space-y-4">

            {/* Leverage moves */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-3">
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <p className="text-xs font-bold text-gray-700">Top leverage moves</p>
              </div>
              <div className="space-y-2.5">
                {LEVERAGE_MOVES.map((l, i) => (
                  <div key={i} className={`${l.bg} rounded-xl p-2.5`}>
                    <p className="text-[10px] font-bold text-gray-500 mb-0.5">{l.class}</p>
                    <p className="text-[11px] font-semibold text-gray-800">{l.action}</p>
                    <p className={`text-[11px] font-bold ${l.color} mt-0.5`}>{l.impact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent grades */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Recent grades</p>
              <div className="space-y-2">
                {[
                  { name:'Bio Quiz 3',  score:'82%', color:'text-orange-600' },
                  { name:'Bio HW 4',    score:'95%', color:'text-green-600'  },
                  { name:'Bio Exam 1',  score:'88%', color:'text-indigo-600' },
                  { name:'Stats PS #3', score:'92%', color:'text-green-600'  },
                ].map((g) => (
                  <div key={g.name} className="flex items-center justify-between">
                    <p className="text-[11px] text-gray-600 truncate max-w-[130px]">{g.name}</p>
                    <span className={`text-[11px] font-bold ${g.color}`}>{g.score}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowModal(true)}
                className="w-full mt-3 flex items-center justify-center gap-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 py-2 rounded-xl transition-all">
                <Plus className="w-3.5 h-3.5" /> Add grade
              </button>
            </div>

            {/* GPA progress */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-4 text-white">
              <Trophy className="w-5 h-5 text-indigo-200 mb-2" />
              <p className="text-xs font-bold mb-1">GPA Progress</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-2xl font-extrabold">{currentGPA}</span>
                <span className="text-indigo-200 text-xs mb-1">→ {projectedGPA}</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width:`${(currentGPA/4)*100}%` }} />
              </div>
              <p className="text-[10px] text-indigo-200 mt-1">Target: {targetGPA} · {((targetGPA - currentGPA)*100).toFixed(0)} points gap</p>
            </div>
          </div>
        </div>

        {/* Add grade modal */}
        {showModal && <AddGradeModal onClose={() => setShowModal(false)} />}
      </div>
    </AppLayout>
  );
}
