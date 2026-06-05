'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { PageSkeleton } from '@/components/Skeleton';
import {
  ChevronLeft, ChevronRight, ChevronDown, MapPin, Calendar, Clock,
  Target, TrendingUp, AlertTriangle, FileText, Mic, Presentation,
  StickyNote, ClipboardCheck, PenSquare, Filter, Upload as UploadIcon,
  Star, Sparkles, BarChart2, Brain, BookOpen, Award, GraduationCap, Mail,
} from 'lucide-react';
import FilePreviewDrawer, { PreviewFile } from '@/components/FilePreviewDrawer';

/* ─────────────────────────────────────────────────────────────
 *  Class Workspace
 *  Single-class detail page — the heart of the per-class UX.
 *  Reached by clicking a class card on /classes.
 *
 *  Sections (per SRS §3.6):
 *    1. Header (class name, professor, schedule, current grade, target)
 *    2. "What's coming" — next assessment + predicted score
 *    3. "What to study" — ranked topics
 *    4. Materials panel (sidebar) — uploaded files, filterable
 *    5. Professor card (sidebar) — contact, office hours, ratings
 * ───────────────────────────────────────────────────────────── */

/* ─── Mock data (mirrors /classes shape so we can find the class
 * by id from the same store). Replace with API fetch later. ─── */
const MOCK_CLASSES: Record<string, ClassData> = {
  bio101: {
    id: 'bio101',
    code: 'BIO 101',
    name: 'Biology 101',
    professor: {
      name: 'Dr. Sarah Smith',
      initials: 'SS',
      email: 'sarah.smith@university.edu',
      office: 'Mendel Hall · Room 314',
      officeHours: 'Tue/Thu 2:00–4:00 PM',
      rating: 4.2,
      reviews: 142,
      quote: 'Tough but fair. Office hours are gold.',
    },
    schedule: 'MWF 10:00–10:50 AM',
    classroom: 'Science Hall · Room 207',
    credits: 4,
    currentGrade: { letter: 'B+', percent: 87 },
    targetGrade: 'A',
    nextAssessment: {
      kind: 'Exam 2',
      due: 'Thursday',
      dueDetail: 'May 22 · 9:00 AM',
      weight: 20,
      predicted: 86,
      ciLow: 81,
      ciHigh: 91,
      needsForTarget: 91,
    },
    topics: [
      { name: 'Mitosis',             priority: 'high',   mastery: 28, signals: ['On review sheet', '2 lectures', 'NEW'] },
      { name: 'Cellular Respiration',priority: 'high',   mastery: 44, signals: ['On review sheet', '6 lectures', 'Quiz 3'] },
      { name: 'Enzyme Kinetics',     priority: 'high',   mastery: 35, signals: ['Quiz 3 weak'] },
      { name: 'Krebs Cycle',         priority: 'medium', mastery: 72, signals: ['Quiz 2 ✓'] },
      { name: 'Cell Membrane',       priority: 'low',    mastery: 81, signals: [] },
      { name: 'DNA Replication',     priority: 'low',    mastery: 65, signals: ['2 lectures'] },
    ],
    materials: [
      { id: 1, name: 'BIO101 Syllabus.pdf',         type: 'syllabus',       sub: '180 KB · uploaded Sep 1',  status: 'ready' },
      { id: 2, name: 'Lecture 8 — Krebs Cycle',     type: 'lecture_audio',  sub: '48 min · transcribed',     status: 'ready' },
      { id: 3, name: 'Lecture 11 Slides',           type: 'lecture_slides', sub: '2.1 MB · 32 slides',       status: 'ready' },
      { id: 4, name: 'Exam 2 Review Sheet',         type: 'review_sheet',   sub: '4 pages · Nov 10',         status: 'ready' },
      { id: 5, name: 'Quiz 3 — Graded',             type: 'graded_work',    sub: '82% · feedback included',  status: 'ready' },
      { id: 6, name: 'Your notes — Mitosis',        type: 'notes',          sub: 'Oct 24 · 3 pages',         status: 'ready' },
      { id: 7, name: 'Lab Report 2.docx',           type: 'assignment',     sub: 'Parsing…',                 status: 'parsing' },
    ],
  },
  stat201: {
    id: 'stat201',
    code: 'STAT 201',
    name: 'Statistics 201',
    professor: {
      name: 'Prof. Marcus Lee',
      initials: 'ML',
      email: 'marcus.lee@university.edu',
      office: 'Math Building · Room 412',
      officeHours: 'Wed 1:00–3:00 PM',
      rating: 4.5,
      reviews: 87,
      quote: 'Patient explainer. Use his examples.',
    },
    schedule: 'TTh 11:00 AM–12:15 PM',
    classroom: 'Math Building · Room 105',
    credits: 3,
    currentGrade: { letter: 'A−', percent: 91 },
    targetGrade: 'A',
    nextAssessment: {
      kind: 'Problem Set #4',
      due: 'Friday',
      dueDetail: 'May 24 · 11:59 PM',
      weight: 8,
      predicted: 92,
      ciLow: 88,
      ciHigh: 95,
      needsForTarget: 90,
    },
    topics: [],
    materials: [],
  },
};

interface Topic {
  name: string;
  priority: 'high' | 'medium' | 'low';
  mastery: number;
  signals: string[];
}
interface Material {
  id: number;
  name: string;
  type: string;
  sub: string;
  status: 'ready' | 'parsing' | 'uploading';
}
interface Professor {
  name: string;
  initials: string;
  email: string;
  office: string;
  officeHours: string;
  rating: number;
  reviews: number;
  quote: string;
}
interface ClassData {
  id: string;
  code: string;
  name: string;
  professor: Professor;
  schedule: string;
  classroom: string;
  credits: number;
  currentGrade: { letter: string; percent: number };
  targetGrade: string;
  nextAssessment: {
    kind: string;
    due: string;
    dueDetail: string;
    weight: number;
    predicted: number;
    ciLow: number;
    ciHigh: number;
    needsForTarget: number;
  };
  topics: Topic[];
  materials: Material[];
}

/* ─── Helpers ────────────────────────────────────────────────── */
const FILE_ICONS: Record<string, typeof FileText> = {
  syllabus:       FileText,
  lecture_audio:  Mic,
  lecture_slides: Presentation,
  review_sheet:   ClipboardCheck,
  graded_work:    Award,
  notes:          StickyNote,
  assignment:     PenSquare,
};
const FILE_COLORS: Record<string, string> = {
  syllabus:       'bg-red-50 text-red-600',
  lecture_audio:  'bg-blue-50 text-blue-600',
  lecture_slides: 'bg-orange-50 text-orange-600',
  review_sheet:   'bg-purple-50 text-purple-600',
  graded_work:    'bg-emerald-50 text-emerald-600',
  notes:          'bg-amber-50 text-amber-700',
  assignment:     'bg-indigo-50 text-indigo-600',
};
const FILE_LABELS: Record<string, string> = {
  syllabus:       'Syllabus',
  lecture_audio:  'Lecture audio',
  lecture_slides: 'Slides',
  review_sheet:   'Review sheet',
  graded_work:    'Graded work',
  notes:          'My notes',
  assignment:     'Assignment',
};
const PRIORITY_COLORS = {
  high:   { dot: 'bg-red-500',    pill: 'bg-red-100 text-red-700',       label: 'High'   },
  medium: { dot: 'bg-amber-500',  pill: 'bg-amber-100 text-amber-700',   label: 'Medium' },
  low:    { dot: 'bg-gray-400',   pill: 'bg-gray-100 text-gray-600',     label: 'Low'    },
};

export default function ClassWorkspacePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading]   = useState(true);
  const [cls,     setCls]       = useState<ClassData | null>(null);
  const [filter,  setFilter]    = useState<string>('all');
  const [hasData, setHasData]   = useState(false);
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);

  useEffect(() => {
    // Simulate fetch
    const t = setTimeout(() => {
      const found = MOCK_CLASSES[params.id];
      setCls(found ?? null);
      setLoading(false);

      // The student "has data" for this class only after they've uploaded
      // a syllabus or completed the manual setup. Toggle via flag.
      if (typeof window !== 'undefined' && localStorage.getItem(`atlas_class_${params.id}_ready`) === 'true') {
        setHasData(true);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [params.id]);

  if (loading) return <PageSkeleton />;

  /* ─── Class not found ──────────────────────────────────────── */
  if (!cls) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#F5F5FB] p-8">
          <div className="max-w-[760px] mx-auto bg-white border border-[#ECE9FF] rounded-2xl p-10 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#F4F2FF] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-[#534AB7]" />
            </div>
            <h2 className="text-xl font-extrabold text-[#14142B] mb-1">Class not found</h2>
            <p className="text-sm text-[#6B6A8A] mb-5">We couldn&apos;t find a class with that id. It may have been deleted.</p>
            <Link href="/classes"
              className="inline-flex items-center gap-2 bg-[#534AB7] hover:bg-[#3F3795] text-white px-4 py-2.5 rounded-xl font-extrabold text-sm">
              <ChevronLeft className="w-4 h-4" /> Back to classes
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  /* ─── Empty state — class exists but no materials uploaded yet ─── */
  if (!hasData) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#F5F5FB] p-4 md:p-8">
          <div className="max-w-[1100px] mx-auto">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
              <Link href="/classes" className="hover:text-indigo-600">Classes</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-indigo-600 font-semibold">{cls.name}</span>
            </div>

            {/* Header — simplified */}
            <div className="bg-white border border-[#ECE9FF] rounded-2xl p-6 mb-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#534AB7] flex items-center justify-center text-white font-extrabold text-xl flex-shrink-0">
                  {cls.code.split(' ')[0].slice(0, 3).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-extrabold text-[#534AB7] uppercase tracking-widest mb-0.5">{cls.code}</p>
                  <h1 className="text-2xl font-extrabold text-[#14142B] mb-1">{cls.name}</h1>
                  <p className="text-[12.5px] text-[#6B6A8A]">{cls.professor.name} · {cls.schedule}</p>
                </div>
              </div>
            </div>

            {/* Empty-state CTA */}
            <div className="bg-gradient-to-br from-[#F4F2FF] via-white to-[#EEEAFF] border border-[#E8E5FD] rounded-3xl p-7 md:p-10 mb-6 shadow-sm">
              <div className="max-w-xl mx-auto text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#534AB7] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#534AB7]/30">
                  <UploadIcon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-[24px] font-extrabold text-[#14142B] mb-2">Drop your syllabus to unlock this class</h2>
                <p className="text-[13.5px] text-[#6B6A8A] leading-relaxed mb-5">
                  Atlas reads your {cls.name} materials and builds the topic list, ranks what to study,
                  and tracks your grade automatically — all from one upload.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link href="/upload"
                    className="inline-flex items-center gap-2 bg-[#534AB7] hover:bg-[#3F3795] text-white px-5 py-2.5 rounded-xl font-extrabold text-sm shadow-md shadow-[#534AB7]/25">
                    <UploadIcon className="w-4 h-4" /> Upload syllabus
                  </Link>
                  <Link href="/classes"
                    className="inline-flex items-center gap-2 bg-white border border-[#E8E5FD] hover:border-[#534AB7]/30 text-[#534AB7] px-5 py-2.5 rounded-xl font-extrabold text-sm">
                    <ChevronLeft className="w-4 h-4" /> Back to classes
                  </Link>
                </div>
              </div>
            </div>

            {/* "What will appear here" preview cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: Target,        color: 'bg-[#534AB7]',   label: "What's coming",       desc: 'Next exam, deadlines, predicted grade.' },
                { icon: Sparkles,      color: 'bg-emerald-500', label: 'What to study',       desc: 'Topics ranked by priority for you.' },
                { icon: BookOpen,      color: 'bg-orange-500',  label: 'Materials',           desc: 'All syllabi, lectures, notes in one place.' },
                { icon: GraduationCap, color: 'bg-blue-500',    label: 'Professor card',      desc: 'Office hours, contact, ratings.' },
              ].map((c) => (
                <div key={c.label} className="bg-white border border-[#ECE9FF] rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`w-9 h-9 rounded-xl ${c.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                      <c.icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-[13px] font-extrabold text-[#1A1A2E]">{c.label}</p>
                  </div>
                  <p className="text-[12px] text-[#6B6A8A] leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </AppLayout>
    );
  }

  /* ─── Populated workspace ──────────────────────────────────── */
  const filteredMaterials = filter === 'all'
    ? cls.materials
    : cls.materials.filter((m) => m.type === filter);

  const a = cls.nextAssessment;
  const masteryAvg = cls.topics.length === 0 ? 0 :
    Math.round(cls.topics.reduce((s, t) => s + t.mastery, 0) / cls.topics.length);

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#F5F5FB] p-4 md:p-8">
        <div className="max-w-[1240px] mx-auto">

          {/* ── Breadcrumb ───────────────────────────────────── */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <Link href="/classes" className="hover:text-indigo-600">Classes</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-indigo-600 font-semibold">{cls.name}</span>
          </div>

          {/* ── Header card ──────────────────────────────────── */}
          <div className="bg-white border border-[#ECE9FF] rounded-2xl p-5 md:p-6 mb-5 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] items-start gap-5">
              {/* Class code badge */}
              <div className="w-16 h-16 rounded-2xl bg-[#534AB7] flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0">
                {cls.code.split(' ')[0].slice(0, 3).toUpperCase()}
              </div>

              {/* Title + meta */}
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold text-[#534AB7] uppercase tracking-widest mb-1">{cls.code} · {cls.credits} credits</p>
                <h1 className="text-[26px] font-extrabold text-[#14142B] leading-tight mb-2">{cls.name}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[#6B6A8A]">
                  <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> {cls.professor.name}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {cls.schedule}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {cls.classroom}</span>
                </div>
              </div>

              {/* Grade summary */}
              <div className="flex items-center gap-4 lg:gap-5 lg:border-l lg:border-[#ECE9FF] lg:pl-5">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-[#9B9AB5] uppercase tracking-wider mb-1">Current</p>
                  <p className="text-2xl font-extrabold text-[#14142B] leading-none">{cls.currentGrade.letter}</p>
                  <p className="text-[11px] text-[#6B6A8A] mt-1">{cls.currentGrade.percent}%</p>
                </div>
                <div className="w-px h-10 bg-[#ECE9FF]" />
                <div className="text-center">
                  <p className="text-[10px] font-bold text-[#9B9AB5] uppercase tracking-wider mb-1">Target</p>
                  <p className="text-2xl font-extrabold text-emerald-600 leading-none">{cls.targetGrade}</p>
                  <p className="text-[11px] text-[#6B6A8A] mt-1">on track</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2-column main grid ─────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

            {/* ── LEFT: Main column (insights first) ─────────── */}
            <div className="space-y-5">

              {/* ── 1. What's coming ─────────────────────────── */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#534AB7] via-[#5B4FBC] to-[#7B6FE8] rounded-2xl p-5 md:p-6 shadow-lg shadow-[#534AB7]/20 text-white">
                <Sparkles className="absolute top-5 right-12 w-3 h-3 text-white/30" />
                <Sparkles className="absolute bottom-10 right-1/4 w-3 h-3 text-white/20" />

                <div className="relative">
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-white/70 mb-2">What&apos;s coming</p>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="text-[22px] font-extrabold mb-1">{a.kind} — {a.due}</h3>
                      <p className="text-[12.5px] text-white/85">{a.dueDetail} · Worth <strong>{a.weight}%</strong> of final grade</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">Predicted</p>
                      <p className="text-3xl font-extrabold tabular-nums leading-none">{a.predicted}</p>
                      <p className="text-[11px] text-white/70 mt-1">CI {a.ciLow}–{a.ciHigh}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/15 flex items-center gap-2 text-[13px]">
                    <Target className="w-4 h-4 text-white/80 flex-shrink-0" />
                    <span className="text-white/90">
                      To stay on track for an <strong>{cls.targetGrade}</strong>: score <strong className="text-emerald-300">{a.needsForTarget}+</strong>
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link href="/exam-mode"
                      className="inline-flex items-center gap-2 bg-white hover:bg-[#F4F2FF] text-[#534AB7] px-4 py-2 rounded-xl font-extrabold text-sm shadow-md">
                      <Brain className="w-4 h-4" /> Open exam mode
                    </Link>
                    <Link href="/study-plan"
                      className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 text-white px-4 py-2 rounded-xl font-extrabold text-sm">
                      <Sparkles className="w-4 h-4" /> Today&apos;s plan
                    </Link>
                  </div>
                </div>
              </div>

              {/* ── 2. What to study (ranked topics) ─────────── */}
              <div className="bg-white border border-[#ECE9FF] rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#ECE9FF]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-[#14142B]">What to study</p>
                      <p className="text-[11px] text-[#9B9AB5]">{cls.topics.length} topics · ranked by grade impact</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#6B6A8A]">
                    Avg mastery <strong className="text-[#14142B]">{masteryAvg}%</strong>
                  </span>
                </div>

                <div className="divide-y divide-[#ECE9FF]">
                  {cls.topics.map((t, i) => {
                    const p = PRIORITY_COLORS[t.priority];
                    const topicSlug = t.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
                    return (
                      <Link key={t.name} href={`/topics/${topicSlug}`}
                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAFAFE] transition-colors cursor-pointer">
                        {/* Rank */}
                        <span className="text-[13px] font-extrabold text-[#9B9AB5] tabular-nums w-5 flex-shrink-0">
                          {i + 1}
                        </span>
                        {/* Priority dot */}
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.dot}`} />
                        {/* Topic + signals */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13.5px] font-extrabold text-[#14142B] leading-tight truncate">{t.name}</p>
                          {t.signals.length > 0 && (
                            <p className="text-[11px] text-[#9B9AB5] mt-0.5 truncate">{t.signals.join(' · ')}</p>
                          )}
                        </div>
                        {/* Mastery bar */}
                        <div className="hidden sm:flex flex-col items-end w-24 flex-shrink-0">
                          <p className="text-[11px] font-bold text-[#6B6A8A] mb-1">{t.mastery}%</p>
                          <div className="w-full h-1.5 rounded-full bg-[#F4F2FF] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                t.mastery < 40 ? 'bg-red-400' :
                                t.mastery < 70 ? 'bg-amber-400' :
                                'bg-emerald-500'
                              }`}
                              style={{ width: `${t.mastery}%` }}
                            />
                          </div>
                        </div>
                        {/* Priority pill */}
                        <span className={`hidden md:inline-flex text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-full flex-shrink-0 ${p.pill}`}>
                          {p.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#9B9AB5] flex-shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* ── 3. Mini-trend / footer hint ────────────────── */}
              <div className="bg-[#F4F2FF] border border-[#E8E5FD] rounded-2xl px-5 py-4 flex items-start gap-3.5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-4 h-4 text-[#534AB7]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-extrabold text-[#1A1A2E]">Your grade trend in {cls.name}</p>
                  <p className="text-[12px] text-[#6B6A8A] leading-relaxed">
                    You started at <strong>78%</strong> in week 1. Now at <strong>{cls.currentGrade.percent}%</strong>. Keep this pace and you&apos;ll land an <strong>{cls.targetGrade}</strong>.
                  </p>
                </div>
              </div>

            </div>

            {/* ── RIGHT: Sidebar ────────────────────────────────── */}
            <div className="space-y-5">

              {/* ── Materials ─────────────────────────────────── */}
              <div className="bg-white border border-[#ECE9FF] rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#ECE9FF]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#534AB7]" />
                      <p className="text-sm font-extrabold text-[#14142B]">Materials</p>
                    </div>
                    <Link href="/upload" className="text-[11px] font-bold text-[#534AB7] hover:underline flex items-center gap-1">
                      <UploadIcon className="w-3 h-3" /> Add
                    </Link>
                  </div>
                  {/* Filter chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                    {['all', 'syllabus', 'lecture_audio', 'lecture_slides', 'review_sheet', 'notes', 'assignment'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`flex-shrink-0 text-[10.5px] font-bold px-2 py-1 rounded-full transition-colors ${
                          filter === f
                            ? 'bg-[#534AB7] text-white'
                            : 'bg-[#F4F2FF] text-[#534AB7] hover:bg-[#E8E5FD]'
                        }`}
                      >
                        {f === 'all' ? 'All' : (FILE_LABELS[f] ?? f)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-[#ECE9FF] max-h-[480px] overflow-y-auto">
                  {filteredMaterials.length === 0 ? (
                    <div className="text-center py-8 px-5">
                      <Filter className="w-5 h-5 text-[#9B9AB5] mx-auto mb-2" />
                      <p className="text-[12px] text-[#6B6A8A]">No files match this filter.</p>
                    </div>
                  ) : filteredMaterials.map((m) => {
                    const Icon = FILE_ICONS[m.type] ?? FileText;
                    const colorCls = FILE_COLORS[m.type] ?? 'bg-gray-50 text-gray-600';
                    return (
                      <button key={m.id}
                        onClick={() => setPreviewFile(m as PreviewFile)}
                        className="w-full text-left flex items-start gap-3 px-5 py-3 hover:bg-[#FAFAFE] transition-colors cursor-pointer">
                        <div className={`w-8 h-8 rounded-lg ${colorCls} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12.5px] font-extrabold text-[#14142B] leading-tight truncate">{m.name}</p>
                          <p className="text-[10.5px] text-[#9B9AB5] mt-0.5 truncate">
                            {m.sub}
                            {m.status === 'parsing' && <span className="ml-1 text-amber-600 font-bold">· parsing</span>}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Professor card ────────────────────────────── */}
              <div className="bg-white border border-[#ECE9FF] rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#ECE9FF] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#534AB7]" />
                  <p className="text-sm font-extrabold text-[#14142B]">Professor</p>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#534AB7] to-[#7B6FE8] flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
                      {cls.professor.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-extrabold text-[#14142B] truncate">{cls.professor.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-[11px] font-bold text-[#1A1A2E]">{cls.professor.rating}</span>
                        <span className="text-[11px] text-[#9B9AB5]">· {cls.professor.reviews} reviews</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-[12px]">
                    <div className="flex items-start gap-2 text-[#3A3A52]">
                      <MapPin className="w-3.5 h-3.5 text-[#9B9AB5] flex-shrink-0 mt-0.5" />
                      <span>{cls.professor.office}</span>
                    </div>
                    <div className="flex items-start gap-2 text-[#3A3A52]">
                      <Clock className="w-3.5 h-3.5 text-[#9B9AB5] flex-shrink-0 mt-0.5" />
                      <span>{cls.professor.officeHours}</span>
                    </div>
                    <div className="flex items-start gap-2 text-[#3A3A52]">
                      <Mail className="w-3.5 h-3.5 text-[#9B9AB5] flex-shrink-0 mt-0.5" />
                      <a href={`mailto:${cls.professor.email}`} className="text-[#534AB7] hover:underline truncate">{cls.professor.email}</a>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#ECE9FF]">
                    <p className="text-[11.5px] text-[#6B6A8A] italic leading-relaxed">
                      &ldquo;{cls.professor.quote}&rdquo;
                    </p>
                    <p className="text-[10px] text-[#9B9AB5] mt-1.5">— student review</p>
                  </div>
                </div>
              </div>

              {/* ── Quick actions ─────────────────────────────── */}
              <div className="bg-white border border-[#ECE9FF] rounded-2xl shadow-sm p-4">
                <p className="text-[10px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-2.5">Quick actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/grades" className="flex items-center gap-2 px-3 py-2 bg-[#F4F2FF] hover:bg-[#E8E5FD] rounded-lg text-[11.5px] font-bold text-[#534AB7]">
                    <BarChart2 className="w-3.5 h-3.5" /> Grades
                  </Link>
                  <Link href="/calendar" className="flex items-center gap-2 px-3 py-2 bg-[#F4F2FF] hover:bg-[#E8E5FD] rounded-lg text-[11.5px] font-bold text-[#534AB7]">
                    <Calendar className="w-3.5 h-3.5" /> Calendar
                  </Link>
                  <Link href="/flashcards" className="flex items-center gap-2 px-3 py-2 bg-[#F4F2FF] hover:bg-[#E8E5FD] rounded-lg text-[11.5px] font-bold text-[#534AB7]">
                    <Brain className="w-3.5 h-3.5" /> Cards
                  </Link>
                  <Link href="/quiz" className="flex items-center gap-2 px-3 py-2 bg-[#F4F2FF] hover:bg-[#E8E5FD] rounded-lg text-[11.5px] font-bold text-[#534AB7]">
                    <ClipboardCheck className="w-3.5 h-3.5" /> Quiz
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* File preview drawer (opens when a material is clicked) */}
      <FilePreviewDrawer file={previewFile} onClose={() => setPreviewFile(null)} />
    </AppLayout>
  );
}
