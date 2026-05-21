'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import {
  ChevronRight, Upload, BookOpen, FileText, Mic,
  BarChart2, Target, CheckCircle2, Star, TrendingUp,
  Plus, Search, Brain, Zap, AlertTriangle,
  GraduationCap, Clock, ArrowLeft, RefreshCw,
} from 'lucide-react';

/* ─── Data ───────────────────────────────────────────────────── */
const CLASSES = [
  {
    id: 'bio101', name: 'Biology 101', code: 'BIO 101',
    professor: 'Dr. Sarah Smith', schedule: 'MWF 10:00–10:50 AM',
    credits: 4, grade: 'B+', gradePct: 87, target: 'A',
    accent: 'bg-indigo-500', accentLight: 'bg-indigo-50',
    accentBar: 'bg-indigo-200', accentProg: 'bg-indigo-500',
    accentText: 'text-indigo-600', accentBorder: 'border-indigo-200',
    topics: 14, files: 12, nextDeadline: 'Exam Thursday', deadlineUrgency: 'high',
    examPrediction: 86, profInitials: 'SS',
    topicsList: [
      { name: 'Mitosis',              mastery: 28, tags: ['On review sheet', 'Quiz 3 weak'] },
      { name: 'Cellular Respiration', mastery: 44, tags: ['On review sheet']                },
      { name: 'Enzyme Kinetics',      mastery: 35, tags: ['Quiz 3 weak']                    },
      { name: 'Krebs Cycle',          mastery: 72, tags: ['Quiz 2 ✓']                       },
      { name: 'Cell Membrane',        mastery: 81, tags: []                                  },
      { name: 'DNA Replication',      mastery: 65, tags: ['2 lectures']                      },
    ],
    grades: [
      { name: 'Exams',        weight: 50, score: 88 },
      { name: 'Quizzes',      weight: 25, score: 82 },
      { name: 'Homework',     weight: 20, score: 95 },
      { name: 'Participation',weight:  5, score: 90 },
    ],
    files_list: [
      { name: 'BIO101 Syllabus.pdf',        type: 'syllabus',       status: 'ready',   size: '180 KB' },
      { name: 'Lecture 10 — Krebs Cycle',   type: 'lecture_audio',  status: 'ready',   size: '48 min' },
      { name: 'Exam 2 Review Sheet',         type: 'review_sheet',   status: 'ready',   size: '4 pages'},
      { name: 'Quiz 3 — Graded',            type: 'graded_work',    status: 'ready',   size: '82%'    },
      { name: 'Lecture 11 Slides',           type: 'lecture_slides', status: 'ready',   size: '2.1 MB' },
      { name: 'Lab Report 2.docx',           type: 'assignment',     status: 'parsing', size: '—'      },
    ],
  },
  {
    id: 'stat201', name: 'Statistics 201', code: 'STAT 201',
    professor: 'Prof. Marcus Lee', schedule: 'TTh 11:00 AM–12:15 PM',
    credits: 3, grade: 'A−', gradePct: 91, target: 'A',
    accent: 'bg-emerald-500', accentLight: 'bg-emerald-50',
    accentBar: 'bg-emerald-200', accentProg: 'bg-emerald-500',
    accentText: 'text-emerald-600', accentBorder: 'border-emerald-200',
    topics: 10, files: 8, nextDeadline: 'PS#4 Friday', deadlineUrgency: 'medium',
    examPrediction: null, profInitials: 'ML',
    topicsList: [], grades: [], files_list: [],
  },
  {
    id: 'eng110', name: 'English 110', code: 'ENG 110',
    professor: 'Prof. Diane Osei', schedule: 'MWF 11:00–11:50 AM',
    credits: 3, grade: 'B', gradePct: 83, target: 'B+',
    accent: 'bg-amber-500', accentLight: 'bg-amber-50',
    accentBar: 'bg-amber-200', accentProg: 'bg-amber-500',
    accentText: 'text-amber-600', accentBorder: 'border-amber-200',
    topics: 8, files: 6, nextDeadline: 'Essay Monday', deadlineUrgency: 'medium',
    examPrediction: null, profInitials: 'DO',
    topicsList: [], grades: [], files_list: [],
  },
  {
    id: 'his105', name: 'History 105', code: 'HIS 105',
    professor: 'Prof. James Kwon', schedule: 'MWF 1:00–1:50 PM',
    credits: 3, grade: 'A', gradePct: 95, target: 'A',
    accent: 'bg-purple-500', accentLight: 'bg-purple-50',
    accentBar: 'bg-purple-200', accentProg: 'bg-purple-500',
    accentText: 'text-purple-600', accentBorder: 'border-purple-200',
    topics: 11, files: 9, nextDeadline: 'Quiz in 10 days', deadlineUrgency: 'low',
    examPrediction: null, profInitials: 'JK',
    topicsList: [], grades: [], files_list: [],
  },
  {
    id: 'chem201', name: 'Chemistry 201', code: 'CHEM 201',
    professor: 'Dr. Raj Patel', schedule: 'TTh 2:00–3:15 PM',
    credits: 4, grade: 'B−', gradePct: 79, target: 'B+',
    accent: 'bg-red-500', accentLight: 'bg-red-50',
    accentBar: 'bg-red-200', accentProg: 'bg-red-500',
    accentText: 'text-red-600', accentBorder: 'border-red-200',
    topics: 12, files: 7, nextDeadline: 'Lab report due', deadlineUrgency: 'high',
    examPrediction: null, profInitials: 'RP',
    topicsList: [], grades: [], files_list: [],
  },
];

const FILE_META: Record<string,{icon:typeof FileText;bg:string;color:string;label:string}> = {
  syllabus:       { icon: FileText,  bg:'bg-indigo-100',  color:'text-indigo-600',  label:'Syllabus'       },
  lecture_audio:  { icon: Mic,       bg:'bg-emerald-100', color:'text-emerald-600', label:'Lecture Audio'  },
  review_sheet:   { icon: BookOpen,  bg:'bg-amber-100',   color:'text-amber-600',   label:'Review Sheet'   },
  graded_work:    { icon: Target,    bg:'bg-red-100',     color:'text-red-600',     label:'Graded Work'    },
  lecture_slides: { icon: BarChart2, bg:'bg-purple-100',  color:'text-purple-600',  label:'Slides'         },
  assignment:     { icon: FileText,  bg:'bg-gray-100',    color:'text-gray-500',    label:'Assignment'     },
};

type CLS = typeof CLASSES[0];
type Tab = 'overview' | 'topics' | 'materials' | 'grades';

/* ─── Helpers ────────────────────────────────────────────────── */
function gradeColor(pct: number) {
  if (pct >= 90) return 'text-emerald-600';
  if (pct >= 80) return 'text-indigo-600';
  return 'text-amber-600';
}

function masteryColor(pct: number) {
  if (pct < 40) return 'bg-red-500';
  if (pct < 65) return 'bg-amber-500';
  return 'bg-emerald-500';
}

function masteryLabel(pct: number) {
  if (pct < 40) return { text: 'Needs work', color: 'text-red-600 bg-red-50' };
  if (pct < 65) return { text: 'Developing', color: 'text-amber-600 bg-amber-50' };
  return { text: 'Strong', color: 'text-emerald-600 bg-emerald-50' };
}

/* ══════════════════════════════════════════════════════════════
   CLASS CARD
══════════════════════════════════════════════════════════════ */
function ClassCard({ cls, onClick }: { cls: CLS; onClick: () => void }) {
  const urgency =
    cls.deadlineUrgency === 'high'   ? 'bg-red-50 text-red-600 border-red-200' :
    cls.deadlineUrgency === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                       'bg-gray-100 text-gray-500 border-gray-200';

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-sm group"
    >
      {/* Light colour top bar */}
      <div className={`h-2 w-full ${cls.accentBar}`} />

      <div className="p-5">
        {/* Top row — name + grade */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${cls.accentLight} border ${cls.accentBorder} flex items-center justify-center flex-shrink-0`}>
              <GraduationCap className={`w-5 h-5 ${cls.accentText}`} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-gray-900 leading-tight">{cls.name}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{cls.code} · {cls.credits} credits</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={`text-2xl font-extrabold leading-none ${gradeColor(cls.gradePct)}`}>{cls.grade}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{cls.gradePct}%</p>
          </div>
        </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1.5">
              <span>Current progress</span>
              <span>Target: <strong className={cls.accentText}>{cls.target}</strong></span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${cls.accentProg} rounded-full transition-all`}
                style={{ width: `${cls.gradePct}%` }} />
            </div>
          </div>

        {/* Info row */}
        <div className="flex items-center gap-0 mb-3">
          {[
            { icon: BookOpen, val: `${cls.topics} topics` },
            { icon: FileText, val: `${cls.files} files`   },
            { icon: Clock,    val: cls.schedule.split(' ')[0] },
          ].map((s, i) => (
            <div key={i} className={`flex items-center gap-1.5 text-[11px] text-gray-500 flex-1 ${i > 0 ? 'border-l border-gray-100 pl-3' : ''}`}>
              <s.icon className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span>{s.val}</span>
            </div>
          ))}
        </div>

        {/* Footer — deadline + exam prediction */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${urgency}`}>
            📅 {cls.nextDeadline}
          </span>
          {cls.examPrediction ? (
            <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 rounded-lg px-2.5 py-1">
              <Star className="w-3 h-3 text-indigo-500 fill-indigo-500" />
              <span className="text-[10px] font-extrabold text-indigo-700">
                Predicted: {cls.examPrediction}
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              {cls.professor.split(' ').slice(-1)[0]}
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   CLASS DETAIL
══════════════════════════════════════════════════════════════ */
function ClassDetail({ cls, onBack }: { cls: CLS; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>('overview');

  const TABS: { id: Tab; label: string; emoji: string }[] = [
    { id: 'overview',  label: 'Overview',  emoji: '📊' },
    { id: 'topics',    label: 'Topics',    emoji: '🧠' },
    { id: 'materials', label: 'Materials', emoji: '📁' },
    { id: 'grades',    label: 'Grades',    emoji: '🏆' },
  ];

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">

      {/* Breadcrumb */}
      <button onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> My Classes
      </button>

      {/* ── Header card ──────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-4">
        <div className={`h-2 w-full ${cls.accentBar}`} />
        <div className="p-4 md:p-6">

          {/* Top row — icon+name LEFT, grade RIGHT */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className={`w-11 h-11 md:w-14 md:h-14 rounded-2xl ${cls.accentLight} border-2 ${cls.accentBorder} flex items-center justify-center flex-shrink-0`}>
                <GraduationCap className={`w-5 h-5 md:w-7 md:w-7 ${cls.accentText}`} />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-extrabold text-gray-900 leading-tight">{cls.name}</h1>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5">{cls.professor}</p>
                <p className="text-xs text-gray-400 mt-0.5">🕐 {cls.schedule}</p>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {[`${cls.credits} cr`, `${cls.topics} topics`, `${cls.files} files`, `Target: ${cls.target}`].map((p) => (
                    <span key={p} className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">{p}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Grade */}
            <div className="text-right flex-shrink-0">
              <p className={`text-4xl md:text-5xl font-extrabold leading-none ${gradeColor(cls.gradePct)}`}>{cls.grade}</p>
              <p className="text-xs text-gray-400 mt-1">{cls.gradePct}% · Current</p>
              <div className="mt-2 flex flex-col gap-1 items-end">
                <Link href="/study-guide" className={`text-[10px] font-bold ${cls.accentText} hover:underline flex items-center gap-0.5`}>
                  📖 Study guide <ChevronRight className="w-3 h-3" />
                </Link>
                <Link href="/exam-mode" className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5">
                  ⚡ Exam mode <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              <span>Grade progress</span>
              <span>Target <strong className={cls.accentText}>{cls.target}</strong></span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${cls.accentProg} rounded-full`} style={{ width: `${cls.gradePct}%` }} />
            </div>
          </div>

          {/* Exam prediction */}
          {cls.examPrediction && (
            <div className="mt-3 bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <AlertTriangle className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                  <p className="text-xs font-extrabold text-indigo-800">Exam 2 — Thu Nov 20 · Worth 20%</p>
                </div>
                <p className="text-[11px] text-indigo-600">Study Mitosis tonight → score 86 → 91</p>
              </div>
              <div className="bg-white border border-indigo-200 rounded-xl px-3 py-1.5 text-center flex-shrink-0">
                <p className="text-xl font-extrabold text-indigo-700">{cls.examPrediction}</p>
                <p className="text-[9px] text-indigo-500">Predicted</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs — scrollable on mobile ───────────────────────── */}
      <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 mb-4 shadow-sm overflow-x-auto scrollbar-none">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
              tab === t.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}>
            <span>{t.emoji}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab content + sidebar ─────────────────────────────── */}
      {/* On mobile: content full width, sidebar below. On desktop: side by side */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Main content */}
        <div className="flex-1 min-w-0 order-2 lg:order-1">

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-extrabold text-gray-900">📚 Topics — by priority</p>
                  <button onClick={() => setTab('topics')} className="text-[11px] font-semibold text-indigo-600 hover:underline">View all</button>
                </div>
                <div className="space-y-2.5">
                  {(cls.topicsList.length > 0 ? cls.topicsList : [{ name:'Upload your syllabus to see topics', mastery:0, tags:[] }])
                    .slice(0, 4).map((t, i) => {
                      const ml = masteryLabel(t.mastery);
                      return (
                        <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl hover:bg-indigo-50/50 transition-all">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
                            i===0?'bg-red-100 text-red-600':i===1?'bg-amber-100 text-amber-600':'bg-gray-200 text-gray-500'
                          }`}>{i+1}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm font-semibold text-gray-900 truncate">{t.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 max-w-[100px] h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full ${masteryColor(t.mastery)} rounded-full`} style={{ width:`${t.mastery}%` }} />
                              </div>
                              <span className="text-[10px] font-bold text-gray-500">{t.mastery}%</span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0 ${ml.color}`}>{ml.text}</span>
                        </div>
                      );
                  })}
                </div>
              </div>

              {cls.grades.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
                  <p className="text-sm font-extrabold text-gray-900 mb-4">🏆 Grade breakdown</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cls.grades.map((g) => (
                      <div key={g.name} className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-gray-700">{g.name}</p>
                          <span className="text-xs text-gray-400">{g.weight}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-1.5">
                          <div className={`h-full ${cls.accentProg} rounded-full`} style={{ width:`${g.score}%` }} />
                        </div>
                        <p className={`text-base font-extrabold ${gradeColor(g.score)}`}>{g.score}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TOPICS */}
          {tab === 'topics' && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 md:px-5 py-3.5 border-b border-gray-50">
                <p className="text-sm font-extrabold text-gray-900">All topics — by priority</p>
                <span className="text-[11px] text-gray-400">{cls.topicsList.length} topics</span>
              </div>
              <div className="divide-y divide-gray-50">
                {(cls.topicsList.length > 0 ? cls.topicsList : [{ name:'Upload syllabus to see topics', mastery:0, tags:['Upload first'] }])
                  .map((t, i) => {
                    const ml = masteryLabel(t.mastery);
                    return (
                      <div key={i} className="flex items-center gap-3 px-4 md:px-5 py-3 hover:bg-gray-50 transition-all">
                        <span className="text-xs font-extrabold text-gray-300 w-4 flex-shrink-0">{i+1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{t.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-20 md:w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                              <div className={`h-full ${masteryColor(t.mastery)} rounded-full`} style={{ width:`${t.mastery}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500">{t.mastery}%</span>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-1 flex-wrap justify-end max-w-[160px]">
                          {t.tags.map((tag) => (
                            <span key={tag} className="text-[9px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded-md whitespace-nowrap">{tag}</span>
                          ))}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0 ${ml.color}`}>{ml.text}</span>
                      </div>
                    );
                })}
              </div>
            </div>
          )}

          {/* MATERIALS */}
          {tab === 'materials' && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 md:px-5 py-3.5 border-b border-gray-50">
                <p className="text-sm font-extrabold text-gray-900">Files <span className="text-gray-400 font-normal">({cls.files_list.length})</span></p>
                <Link href="/upload" className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm">
                  <Upload className="w-3.5 h-3.5" /> Upload
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {(cls.files_list.length > 0 ? cls.files_list : [{ name:'No files yet', type:'assignment', status:'ready', size:'—' }])
                  .map((f, i) => {
                    const fm = FILE_META[f.type] || FILE_META.assignment;
                    return (
                      <div key={i} className="flex items-center gap-3 px-4 md:px-5 py-3 hover:bg-gray-50 transition-all cursor-pointer">
                        <div className={`w-8 h-8 rounded-xl ${fm.bg} flex items-center justify-center flex-shrink-0`}>
                          <fm.icon className={`w-4 h-4 ${fm.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{f.name}</p>
                          <p className="text-[11px] text-gray-400">{fm.label} · {f.size}</p>
                        </div>
                        {f.status === 'parsing' ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg animate-pulse flex-shrink-0">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Processing
                          </span>
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        )}
                      </div>
                    );
                })}
              </div>
            </div>
          )}

          {/* GRADES */}
          {tab === 'grades' && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 md:px-5 py-3.5 border-b border-gray-50">
                <p className="text-sm font-extrabold text-gray-900">Grade breakdown</p>
                <button className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-all">
                  <Plus className="w-3.5 h-3.5" /> Add grade
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                {(cls.grades.length > 0 ? cls.grades : [
                  { name:'Exams', weight:50, score:88 },
                  { name:'Quizzes', weight:25, score:82 },
                  { name:'Homework', weight:20, score:95 },
                  { name:'Participation', weight:5, score:90 },
                ]).map((g) => (
                  <div key={g.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{g.name}</p>
                        <p className="text-[11px] text-gray-400">{g.weight}% of final grade</p>
                      </div>
                      <p className={`text-xl font-extrabold ${gradeColor(g.score)}`}>{g.score}%</p>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${cls.accentProg} rounded-full`} style={{ width:`${g.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar — full width on mobile, fixed on desktop ── */}
        <div className="order-1 lg:order-2 lg:w-[210px] lg:flex-shrink-0 space-y-3">

          {/* Professor */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Professor</p>
            <div className="flex items-center gap-3 lg:block">
              <div className={`w-12 h-12 rounded-2xl ${cls.accentLight} border ${cls.accentBorder} flex items-center justify-center text-base font-extrabold ${cls.accentText} flex-shrink-0 lg:mb-3`}>
                {cls.profInitials}
              </div>
              <div className="flex-1 min-w-0 lg:block">
                <p className="text-sm font-bold text-gray-900 mb-1.5 lg:mb-2">{cls.professor}</p>
                <div className="space-y-1 text-[11px] text-gray-500">
                  <p>📍 Mendel Hall 314</p>
                  <p className="hidden sm:block">⏰ Office hrs: T/Th 2–4 PM</p>
                  <p className="hidden sm:block">✉ s.smith@university.edu</p>
                </div>
                <div className="flex items-center gap-0.5 mt-2 pt-2 border-t border-gray-50">
                  {[1,2,3,4].map((s) => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                  <span className="text-[10px] text-gray-400 ml-1">4.2 / 5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Study tools */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Study tools</p>
            {/* Grid on mobile, list on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5 lg:gap-0 lg:space-y-0.5">
              {[
                { emoji:'📖', label:'Study Guide',   href:'/study-guide', desc:'AI-generated notes' },
                { emoji:'🃏', label:'Flashcards',    href:'/flashcards',  desc:'Spaced repetition'  },
                { emoji:'❓', label:'Practice Quiz', href:'/quiz',        desc:'Test yourself'       },
                { emoji:'⚡', label:'Exam Mode',     href:'/exam-mode',   desc:'Cram plan'           },
                { emoji:'📁', label:'Upload file',   href:'/upload',      desc:'Add materials'       },
              ].map((a) => (
                <Link key={a.href} href={a.href}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-indigo-50 transition-all group border border-transparent hover:border-indigo-100 lg:border-0">
                  <span className="text-sm flex-shrink-0">{a.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-gray-800 group-hover:text-indigo-700 leading-none truncate">{a.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 hidden lg:block">{a.desc}</p>
                  </div>
                  <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-indigo-500 flex-shrink-0 hidden lg:block" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LIST PAGE
══════════════════════════════════════════════════════════════ */
export default function ClassesPage() {
  const [selected, setSelected] = useState<CLS | null>(null);
  const [search,   setSearch]   = useState('');

  const filtered = CLASSES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.professor.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const totalCredits = CLASSES.reduce((s, c) => s + c.credits, 0);
  const avgGrade = Math.round(CLASSES.reduce((s, c) => s + c.gradePct, 0) / CLASSES.length);

  if (selected) {
    return <AppLayout><ClassDetail cls={selected} onBack={() => setSelected(null)} /></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">My Classes</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Fall 2026 · {CLASSES.length} classes · {totalCredits} credits total
            </p>
          </div>
          <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm shadow-indigo-500/20">
            <Plus className="w-4 h-4" /> Add class
          </button>
        </div>

        {/* Stats strip — compact */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { icon: TrendingUp,  bg:'bg-indigo-50',  color:'text-indigo-600',  label:'Current GPA',   value:'3.42' },
            { icon: Star,        bg:'bg-emerald-50', color:'text-emerald-600', label:'Projected GPA', value:'3.61' },
            { icon: CheckCircle2,bg:'bg-blue-50',    color:'text-blue-600',    label:'On track',      value:'3 / 5'},
            { icon: Brain,       bg:'bg-purple-50',  color:'text-purple-600',  label:'Avg grade',     value:`${avgGrade}%`},
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div>
                <p className={`text-base font-extrabold ${s.color} leading-none`}>{s.value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search — inline with results count */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search classes or professors…"
              className="w-64 bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-indigo-400 transition-all shadow-sm"
            />
          </div>
          {search && (
            <p className="text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
          )}
        </div>

        {/* Class grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cls) => (
            <ClassCard key={cls.id} cls={cls} onClick={() => setSelected(cls)} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
