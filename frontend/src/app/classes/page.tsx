'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import {
  ChevronRight, Upload, BookOpen, FileText, Mic,
  BarChart2, Target, Clock, AlertCircle, CheckCircle2,
  Star, TrendingUp, Plus, Search, Filter,
} from 'lucide-react';

/* ─── Mock data ──────────────────────────────────────────────── */
const CLASSES = [
  {
    id: 'bio101',
    name: 'Biology 101',
    code: 'BIO 101',
    professor: 'Dr. Sarah Smith',
    schedule: 'MWF 10:00–10:50',
    credits: 4,
    grade: 'B+',
    gradePct: 87,
    target: 'A',
    color: 'bg-indigo-500',
    lightBg: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    topics: 14,
    files: 12,
    nextDeadline: 'Exam Thu',
    deadlineUrgency: 'high',
    examPrediction: 86,
  },
  {
    id: 'stat201',
    name: 'Statistics 201',
    code: 'STAT 201',
    professor: 'Prof. Marcus Lee',
    schedule: 'TTh 11:00–12:15',
    credits: 3,
    grade: 'A−',
    gradePct: 91,
    target: 'A',
    color: 'bg-green-500',
    lightBg: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    topics: 10,
    files: 8,
    nextDeadline: 'PS#4 Fri',
    deadlineUrgency: 'medium',
    examPrediction: null,
  },
  {
    id: 'eng110',
    name: 'English 110',
    code: 'ENG 110',
    professor: 'Prof. Diane Osei',
    schedule: 'MWF 11:00–11:50',
    credits: 3,
    grade: 'B',
    gradePct: 83,
    target: 'B+',
    color: 'bg-yellow-500',
    lightBg: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    topics: 8,
    files: 6,
    nextDeadline: 'Essay Mon',
    deadlineUrgency: 'medium',
    examPrediction: null,
  },
  {
    id: 'his105',
    name: 'History 105',
    code: 'HIS 105',
    professor: 'Prof. James Kwon',
    schedule: 'MWF 1:00–1:50',
    credits: 3,
    grade: 'A',
    gradePct: 95,
    target: 'A',
    color: 'bg-purple-500',
    lightBg: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    topics: 11,
    files: 9,
    nextDeadline: 'Quiz in 10d',
    deadlineUrgency: 'low',
    examPrediction: null,
  },
  {
    id: 'chem201',
    name: 'Chemistry 201',
    code: 'CHEM 201',
    professor: 'Dr. Raj Patel',
    schedule: 'TTh 2:00–3:15',
    credits: 4,
    grade: 'B−',
    gradePct: 79,
    target: 'B+',
    color: 'bg-red-500',
    lightBg: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    topics: 12,
    files: 7,
    nextDeadline: 'Lab report',
    deadlineUrgency: 'high',
    examPrediction: null,
  },
];

const TOPICS_BIO = [
  { name: 'Mitosis',               mastery: 28, emphasis: 0.9, tags: ['On review sheet', '3 lectures', 'Quiz 3 weak'] },
  { name: 'Cellular Respiration',  mastery: 44, emphasis: 0.8, tags: ['On review sheet', 'Quiz 3']                    },
  { name: 'Enzyme Kinetics',       mastery: 35, emphasis: 0.7, tags: ['On review sheet', 'Quiz 3 weak']               },
  { name: 'Krebs Cycle',           mastery: 72, emphasis: 0.6, tags: ['4 lectures', 'Quiz 2 ✓']                       },
  { name: 'Cell Membrane',         mastery: 81, emphasis: 0.4, tags: ['2 lectures']                                    },
  { name: 'DNA Replication',       mastery: 65, emphasis: 0.5, tags: ['2 lectures']                                    },
];

const FILES_BIO = [
  { name: 'BIO101_Syllabus.pdf',          type: 'syllabus',       status: 'ready',    size: '180 KB'  },
  { name: 'Lecture 10 — Krebs Cycle',     type: 'lecture_audio',  status: 'ready',    size: '48 min'  },
  { name: 'Exam 2 Review Sheet',          type: 'review_sheet',   status: 'ready',    size: '4 pages' },
  { name: 'Quiz 3 — Graded',             type: 'graded_work',    status: 'ready',    size: '82%'     },
  { name: 'Lecture 11 Slides',            type: 'lecture_slides', status: 'ready',    size: '2.1 MB'  },
  { name: 'Lab Report 2.docx',            type: 'assignment',     status: 'parsing',  size: '—'       },
];

const FILE_ICONS: Record<string, { icon: typeof FileText; bg: string; color: string }> = {
  syllabus:       { icon: FileText, bg: 'bg-indigo-100', color: 'text-indigo-600' },
  lecture_audio:  { icon: Mic,      bg: 'bg-green-100',  color: 'text-green-600'  },
  review_sheet:   { icon: BookOpen, bg: 'bg-yellow-100', color: 'text-yellow-600' },
  graded_work:    { icon: Target,   bg: 'bg-red-100',    color: 'text-red-600'    },
  lecture_slides: { icon: BarChart2,bg: 'bg-purple-100', color: 'text-purple-600' },
  assignment:     { icon: FileText, bg: 'bg-gray-100',   color: 'text-gray-600'   },
};

/* ─── Class card ─────────────────────────────────────────────── */
function ClassCard({ cls, onClick }: { cls: typeof CLASSES[0]; onClick: () => void }) {
  const urgencyColor = cls.deadlineUrgency === 'high' ? 'text-red-600 bg-red-50' :
    cls.deadlineUrgency === 'medium' ? 'text-orange-600 bg-orange-50' : 'text-gray-500 bg-gray-100';

  return (
    <div onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-5 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all group shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-3 h-3 rounded-full ${cls.color} flex-shrink-0`} />
          <div>
            <p className="text-sm font-bold text-gray-900">{cls.name}</p>
            <p className="text-[11px] text-gray-400">{cls.schedule}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xl font-extrabold ${
            cls.gradePct >= 90 ? 'text-green-600' : cls.gradePct >= 80 ? 'text-indigo-600' : 'text-orange-600'
          }`}>{cls.grade}</p>
          <p className="text-[10px] text-gray-400">{cls.gradePct}%</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
        <div className={`h-full ${cls.color} rounded-full`} style={{ width: `${cls.gradePct}%` }} />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-3 text-gray-400">
          <span>{cls.files} files</span>
          <span>{cls.topics} topics</span>
          <span>{cls.credits} cr</span>
        </div>
        <span className={`font-semibold px-2 py-0.5 rounded-full ${urgencyColor}`}>
          {cls.nextDeadline}
        </span>
      </div>

      {/* Exam prediction */}
      {cls.examPrediction && (
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2">
          <Star className="w-3.5 h-3.5 text-amber-500" />
          <p className="text-[11px] text-gray-600">
            Predicted exam score: <strong className="text-indigo-600">{cls.examPrediction}</strong>
          </p>
        </div>
      )}

      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 mt-2 ml-auto transition-all" />
    </div>
  );
}

/* ─── Class detail view ──────────────────────────────────────── */
function ClassDetail({ cls, onBack }: { cls: typeof CLASSES[0]; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'materials' | 'grades'>('overview');

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Breadcrumb */}
      <button onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 mb-5 transition-colors">
        ← My Classes
      </button>

      {/* Class header */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${cls.lightBg} ${cls.borderColor} border-2 flex items-center justify-center`}>
              <BookOpen className={`w-5 h-5 ${cls.textColor}`} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{cls.name}</h1>
              <p className="text-sm text-gray-500">{cls.professor} · {cls.schedule}</p>
              <div className="flex items-center gap-2 mt-1.5">
                {[
                  `🎯 Target: ${cls.target}`,
                  `${cls.files} files`,
                  `${cls.topics} topics`,
                  `${cls.credits} credits`,
                ].map((pill) => (
                  <span key={pill} className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{pill}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-4xl font-extrabold ${
              cls.gradePct >= 90 ? 'text-green-600' : cls.gradePct >= 80 ? 'text-indigo-600' : 'text-orange-600'
            }`}>{cls.grade}</p>
            <p className="text-sm text-gray-400">Current grade</p>
            <Link href={`/exam-mode`}
              className="text-xs font-semibold text-indigo-600 hover:underline mt-1 block">
              → Exam mode
            </Link>
          </div>
        </div>

        {/* Exam prediction banner */}
        {cls.examPrediction && (
          <div className="mt-4 bg-indigo-50 border-2 border-indigo-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-indigo-800 mb-0.5">⚠ Exam 2 — Cell biology &amp; metabolism · Thursday, Nov 20</p>
              <p className="text-[11px] text-indigo-600">Worth 20% of final grade · Covers weeks 7–11</p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-2xl font-extrabold text-indigo-700">{cls.examPrediction}</p>
              <p className="text-[10px] text-indigo-500">Predicted score</p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 bg-white border border-gray-100 rounded-xl p-1 mb-5 shadow-sm w-fit">
        {(['overview','topics','materials','grades'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
              activeTab === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex gap-5">
        {/* Main */}
        <div className="flex-1 min-w-0">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">What to study</p>
                <div className="space-y-3">
                  {TOPICS_BIO.slice(0, 4).map((t) => (
                    <div key={t.name} className="flex items-center gap-3">
                      <div className="w-16 flex-shrink-0">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${
                            t.mastery < 40 ? 'bg-red-500' : t.mastery < 65 ? 'bg-orange-500' : 'bg-green-500'
                          }`} style={{ width: `${t.mastery}%` }} />
                        </div>
                        <p className="text-[9px] text-gray-400 mt-0.5 text-center">{t.mastery}%</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 flex-1">{t.name}</p>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {t.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[9px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TOPICS */}
          {activeTab === 'topics' && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">All topics — ordered by priority</p>
              <div className="space-y-3">
                {TOPICS_BIO.map((t, i) => (
                  <div key={t.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                    <span className="text-xs font-bold text-gray-300 w-4 flex-shrink-0">{i+1}</span>
                    <div className="w-20 flex-shrink-0">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${
                          t.mastery < 40 ? 'bg-red-500' : t.mastery < 65 ? 'bg-orange-500' : 'bg-green-500'
                        }`} style={{ width: `${t.mastery}%` }} />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 flex-1">{t.name}</p>
                    <div className="flex gap-1 flex-wrap">
                      {t.tags.map((tag) => (
                        <span key={tag} className="text-[9px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">{tag}</span>
                      ))}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MATERIALS */}
          {activeTab === 'materials' && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Uploaded files ({FILES_BIO.length})</p>
                <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                  <Upload className="w-3.5 h-3.5" /> Upload file
                </button>
              </div>
              <div className="space-y-2">
                {FILES_BIO.map((f) => {
                  const fi = FILE_ICONS[f.type] || FILE_ICONS.assignment;
                  return (
                    <div key={f.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                      <div className={`w-8 h-8 rounded-xl ${fi.bg} flex items-center justify-center flex-shrink-0`}>
                        <fi.icon className={`w-4 h-4 ${fi.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{f.name}</p>
                        <p className="text-[11px] text-gray-400 capitalize">{f.type.replace('_',' ')} · {f.size}</p>
                      </div>
                      {f.status === 'parsing' ? (
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full animate-pulse">Parsing…</span>
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* GRADES */}
          {activeTab === 'grades' && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Grade breakdown</p>
                <button className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-all">
                  <Plus className="w-3.5 h-3.5" /> Add grade
                </button>
              </div>
              {[
                { category: 'Exams',         weight: 50, earned: 88, possible: 100 },
                { category: 'Quizzes',        weight: 25, earned: 82, possible: 100 },
                { category: 'Homework',       weight: 20, earned: 95, possible: 100 },
                { category: 'Participation',  weight:  5, earned: 90, possible: 100 },
              ].map((g) => (
                <div key={g.category} className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-semibold text-gray-700">{g.category}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-400">{g.weight}% weight</span>
                      <span className="text-sm font-bold text-indigo-600">{g.earned}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${g.earned}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-[200px] flex-shrink-0 space-y-3">
          {/* Professor */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Professor</p>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm mb-2">
              SS
            </div>
            <p className="text-xs font-bold text-gray-900">{cls.professor}</p>
            <div className="mt-2 space-y-1 text-[11px] text-gray-500">
              <p>📍 Mendel Hall 314</p>
              <p>⏰ Tue/Thu 2–4pm</p>
              <p>✉ s.smith@univ.edu</p>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {[1,2,3,4].map((s) => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
              <span className="text-[10px] text-gray-400">4.2</span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Quick actions</p>
            {[
              { label: '📁 Upload file',  href: '/upload'      },
              { label: '📖 Study guide',  href: '/study-guide' },
              { label: '🃏 Flashcards',   href: '/flashcards'  },
              { label: '❓ Quiz',         href: '/quiz'        },
              { label: '⚡ Exam mode',    href: '/exam-mode'   },
            ].map((a) => (
              <Link key={a.label} href={a.href}
                className="flex items-center justify-between text-xs font-semibold text-gray-700 hover:text-indigo-600 p-2 rounded-xl hover:bg-indigo-50 transition-all">
                {a.label}
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Classes list view ──────────────────────────────────────── */
export default function ClassesPage() {
  const [selectedClass, setSelectedClass] = useState<typeof CLASSES[0] | null>(null);
  const [search,        setSearch]        = useState('');

  const filtered = CLASSES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.professor.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedClass) {
    return (
      <AppLayout>
        <ClassDetail cls={selectedClass} onBack={() => setSelectedClass(null)} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
            <p className="text-sm text-gray-400 mt-0.5">Fall 2026 · {CLASSES.length} classes · {CLASSES.reduce((s,c)=>s+c.credits,0)} credits</p>
          </div>
          <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20">
            <Plus className="w-4 h-4" /> Add class
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search classes or professors…"
            className="w-full max-w-sm bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Current GPA',  value: '3.42', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Projected GPA',value: '3.61', icon: Star,        color: 'text-green-600',  bg: 'bg-green-50'  },
            { label: 'On track',     value: '3/5',  icon: CheckCircle2,color: 'text-blue-600',   bg: 'bg-blue-50'   },
            { label: 'Files uploaded',value: '42',  icon: FileText,    color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-400 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Class grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cls) => (
            <ClassCard key={cls.id} cls={cls} onClick={() => setSelectedClass(cls)} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
