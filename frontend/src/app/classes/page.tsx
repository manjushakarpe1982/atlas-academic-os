"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { PageSkeleton } from "@/components/Skeleton";
import EmptyState from "@/components/EmptyState";
import Tooltip from "@/components/Tooltip";
import {
  ChevronRight,
  Upload,
  BookOpen,
  FileText,
  Mic,
  BarChart2,
  Target,
  CheckCircle2,
  Star,
  TrendingUp,
  Plus,
  Search,
  Brain,
  Zap,
  AlertTriangle,
  GraduationCap,
  Clock,
  ArrowLeft,
  RefreshCw,
  X,
  Sparkles,
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────────────── */
const CLASSES = [
  {
    id: "bio101",
    name: "Biology 101",
    code: "BIO 101",
    professor: "Dr. Sarah Smith",
    schedule: "MWF 10:00–10:50 AM",
    credits: 4,
    grade: "B+",
    gradePct: 87,
    target: "A",
    accent: "bg-indigo-500",
    accentLight: "bg-indigo-50",
    accentBar: "bg-indigo-200",
    accentProg: "bg-indigo-500",
    accentText: "text-indigo-600",
    accentBorder: "border-indigo-200",
    topics: 14,
    files: 12,
    nextDeadline: "Exam Thursday",
    deadlineUrgency: "high",
    examPrediction: 86,
    profInitials: "SS",
    topicsList: [
      {
        name: "Mitosis",
        mastery: 28,
        tags: ["On review sheet", "Quiz 3 weak"],
      },
      { name: "Cellular Respiration", mastery: 44, tags: ["On review sheet"] },
      { name: "Enzyme Kinetics", mastery: 35, tags: ["Quiz 3 weak"] },
      { name: "Krebs Cycle", mastery: 72, tags: ["Quiz 2 ✓"] },
      { name: "Cell Membrane", mastery: 81, tags: [] },
      { name: "DNA Replication", mastery: 65, tags: ["2 lectures"] },
    ],
    grades: [
      { name: "Exams", weight: 50, score: 88 },
      { name: "Quizzes", weight: 25, score: 82 },
      { name: "Homework", weight: 20, score: 95 },
      { name: "Participation", weight: 5, score: 90 },
    ],
    files_list: [
      {
        name: "BIO101 Syllabus.pdf",
        type: "syllabus",
        status: "ready",
        size: "180 KB",
      },
      {
        name: "Lecture 10 — Krebs Cycle",
        type: "lecture_audio",
        status: "ready",
        size: "48 min",
      },
      {
        name: "Exam 2 Review Sheet",
        type: "review_sheet",
        status: "ready",
        size: "4 pages",
      },
      {
        name: "Quiz 3 — Graded",
        type: "graded_work",
        status: "ready",
        size: "82%",
      },
      {
        name: "Lecture 11 Slides",
        type: "lecture_slides",
        status: "ready",
        size: "2.1 MB",
      },
      {
        name: "Lab Report 2.docx",
        type: "assignment",
        status: "parsing",
        size: "—",
      },
    ],
  },
  {
    id: "stat201",
    name: "Statistics 201",
    code: "STAT 201",
    professor: "Prof. Marcus Lee",
    schedule: "TTh 11:00 AM–12:15 PM",
    credits: 3,
    grade: "A−",
    gradePct: 91,
    target: "A",
    accent: "bg-emerald-500",
    accentLight: "bg-emerald-50",
    accentBar: "bg-emerald-200",
    accentProg: "bg-emerald-500",
    accentText: "text-emerald-600",
    accentBorder: "border-emerald-200",
    topics: 10,
    files: 8,
    nextDeadline: "PS#4 Friday",
    deadlineUrgency: "medium",
    examPrediction: null,
    profInitials: "ML",
    topicsList: [],
    grades: [],
    files_list: [],
  },
  {
    id: "eng110",
    name: "English 110",
    code: "ENG 110",
    professor: "Prof. Diane Osei",
    schedule: "MWF 11:00–11:50 AM",
    credits: 3,
    grade: "B",
    gradePct: 83,
    target: "B+",
    accent: "bg-amber-500",
    accentLight: "bg-amber-50",
    accentBar: "bg-amber-200",
    accentProg: "bg-amber-500",
    accentText: "text-amber-600",
    accentBorder: "border-amber-200",
    topics: 8,
    files: 6,
    nextDeadline: "Essay Monday",
    deadlineUrgency: "medium",
    examPrediction: null,
    profInitials: "DO",
    topicsList: [],
    grades: [],
    files_list: [],
  },
  {
    id: "his105",
    name: "History 105",
    code: "HIS 105",
    professor: "Prof. James Kwon",
    schedule: "MWF 1:00–1:50 PM",
    credits: 3,
    grade: "A",
    gradePct: 95,
    target: "A",
    accent: "bg-purple-500",
    accentLight: "bg-purple-50",
    accentBar: "bg-purple-200",
    accentProg: "bg-purple-500",
    accentText: "text-purple-600",
    accentBorder: "border-purple-200",
    topics: 11,
    files: 9,
    nextDeadline: "Quiz in 10 days",
    deadlineUrgency: "low",
    examPrediction: null,
    profInitials: "JK",
    topicsList: [],
    grades: [],
    files_list: [],
  },
  {
    id: "chem201",
    name: "Chemistry 201",
    code: "CHEM 201",
    professor: "Dr. Raj Patel",
    schedule: "TTh 2:00–3:15 PM",
    credits: 4,
    grade: "B−",
    gradePct: 79,
    target: "B+",
    accent: "bg-red-500",
    accentLight: "bg-red-50",
    accentBar: "bg-red-200",
    accentProg: "bg-red-500",
    accentText: "text-red-600",
    accentBorder: "border-red-200",
    topics: 12,
    files: 7,
    nextDeadline: "Lab report due",
    deadlineUrgency: "high",
    examPrediction: null,
    profInitials: "RP",
    topicsList: [],
    grades: [],
    files_list: [],
  },
];

const FILE_META: Record<
  string,
  { icon: typeof FileText; bg: string; color: string; label: string }
> = {
  syllabus: {
    icon: FileText,
    bg: "bg-indigo-100",
    color: "text-indigo-600",
    label: "Syllabus",
  },
  lecture_audio: {
    icon: Mic,
    bg: "bg-emerald-100",
    color: "text-emerald-600",
    label: "Lecture Audio",
  },
  review_sheet: {
    icon: BookOpen,
    bg: "bg-amber-100",
    color: "text-amber-600",
    label: "Review Sheet",
  },
  graded_work: {
    icon: Target,
    bg: "bg-red-100",
    color: "text-red-600",
    label: "Graded Work",
  },
  lecture_slides: {
    icon: BarChart2,
    bg: "bg-purple-100",
    color: "text-purple-600",
    label: "Slides",
  },
  assignment: {
    icon: FileText,
    bg: "bg-gray-100",
    color: "text-gray-500",
    label: "Assignment",
  },
};

type CLS = (typeof CLASSES)[0];
type Tab = "overview" | "topics" | "materials" | "grades";

/* ─── Helpers ────────────────────────────────────────────────── */
function gradeColor(pct: number) {
  if (pct >= 90) return "text-emerald-600";
  if (pct >= 80) return "text-indigo-600";
  return "text-amber-600";
}

function masteryColor(pct: number) {
  if (pct < 40) return "bg-red-500";
  if (pct < 65) return "bg-amber-500";
  return "bg-emerald-500";
}

function masteryLabel(pct: number) {
  if (pct < 40) return { text: "Needs work", color: "text-red-600 bg-red-50" };
  if (pct < 65)
    return { text: "Developing", color: "text-amber-600 bg-amber-50" };
  return { text: "Strong", color: "text-emerald-600 bg-emerald-50" };
}

/* ══════════════════════════════════════════════════════════════
   CLASS CARD
══════════════════════════════════════════════════════════════ */
function ClassCard({ cls, onClick }: { cls: CLS; onClick: () => void }) {
  const scheduleShort = cls.schedule.split(" ")[0]; // MWF or TTh
  const urgencyStyle =
    cls.deadlineUrgency === "high"
      ? "bg-red-50 text-red-600 border border-red-200"
      : cls.deadlineUrgency === "medium"
        ? "bg-amber-50 text-amber-600 border border-amber-200"
        : "bg-indigo-50 text-indigo-600 border border-indigo-200";

  // Icon per class — matches the screenshot
  const classEmojis: Record<string, string> = {
    bio101: "🧬",
    stat201: "📊",
    eng110: "💬",
    his105: "🏛",
    chem201: "🧪",
    default: "📚",
  };
  const emoji = classEmojis[cls.id] || classEmojis.default;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-sm group"
    >
      <div className="p-5">
        {/* Top row — icon + name + grade */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl ${cls.accentLight} flex items-center justify-center flex-shrink-0 text-2xl`}
            >
              {emoji}
            </div>
            <div>
              <p className="text-base font-extrabold text-gray-900 leading-tight">
                {cls.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {cls.code} · {cls.credits} credits
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p
              className={`text-2xl font-extrabold leading-none ${gradeColor(cls.gradePct)}`}
            >
              {cls.grade}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{cls.gradePct}%</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1.5">
            <span>Current progress</span>
            <span>
              Target: <strong className={cls.accentText}>{cls.target}</strong>
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${cls.accentProg} rounded-full transition-all`}
              style={{ width: `${cls.gradePct}%` }}
            />
          </div>
        </div>

        {/* Info pills — topics · files · schedule */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {[
            { icon: BookOpen, val: `${cls.topics} topics` },
            { icon: FileText, val: `${cls.files} files` },
            { icon: Clock, val: scheduleShort },
          ].map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 text-xs text-gray-500"
            >
              <s.icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span>{s.val}</span>
            </div>
          ))}
        </div>

        {/* Footer — deadline + view link */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${urgencyStyle}`}
            >
              📅 {cls.nextDeadline}
            </span>
            {cls.examPrediction && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center gap-1">
                <Star className="w-3 h-3 fill-indigo-500 text-indigo-500" />{" "}
                Predicted: {cls.examPrediction}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-indigo-500 group-hover:text-indigo-700 flex items-center gap-1 transition-colors">
            View class <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   CLASS DETAIL
══════════════════════════════════════════════════════════════ */
function ClassDetail({ cls, onBack }: { cls: CLS; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");

  const TABS = [
    { id: "overview" as Tab, label: "Overview", icon: "📊" },
    { id: "topics" as Tab, label: "Topics", icon: "🧠" },
    { id: "materials" as Tab, label: "Materials", icon: "📁" },
    { id: "grades" as Tab, label: "Grades", icon: "🏆" },
    { id: "overview" as Tab, label: "Assignments", icon: "📝" },
  ];

  const classEmoji: Record<string, string> = {
    bio101: "🧬",
    stat201: "📊",
    eng110: "💬",
    his105: "🏛",
    chem201: "🧪",
  };

  return (
    <>
      <div className="min-h-screen bg-[#F5F5FB]">
        <div className="p-3 md:p-4 lg:p-6 max-w-[1200px] mx-auto">
          {/* Back */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 mb-3 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> My Classes
          </button>

          {/* ── HEADER CARD — white bg, gradient overlay, robot center-right ── */}
          <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-2">
          

            {/* Robot image — absolute center-right */}
            <img
              src="https://res.cloudinary.com/mview/image/upload/atlas/classDetailpage.webp"
              alt=""
              className="absolute right-48 top-20 -translate-y-1/2 h-44 object-contain pointer-events-none select-none hidden md:block"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />

            <div className="relative z-10 px-6 py-5">
              {/* Row: left info | right grade */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                {/* LEFT */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center flex-shrink-0 text-2xl shadow-sm">
                    {(
                      {
                        bio101: "🧬",
                        stat201: "📊",
                        eng110: "💬",
                        his105: "🏛",
                        chem201: "🧪",
                      } as Record<string, string>
                    )[cls.id] || "📚"}
                  </div>
                  <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                      {cls.name}
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                      <span className="text-base">👤</span> {cls.professor}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                      <span className="text-base">🕐</span> {cls.schedule}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {[
                        `${cls.credits} Credits`,
                        `${cls.topics} Topics`,
                        `${cls.files} Files`,
                        `Target: ${cls.target}`,
                      ].map((p) => (
                        <span
                          key={p}
                          className="text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-md"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT — grade + buttons */}
                <div className="flex flex-col items-start md:items-end flex-shrink-0">
                  <p
                    className={`text-5xl font-extrabold leading-none ${gradeColor(cls.gradePct)}`}
                  >
                    {cls.grade}
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {cls.gradePct}% Current
                  </p>
                  <div className="flex flex-col items-center gap-2 mt-2 ">
                    <Link
                      href="/study-guide"
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-700  hover:bg-indigo-100 rounded-xl transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Study Guide
                    </Link>
                    <Link
                      href="/exam-mode"
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-700  hover:bg-indigo-100  rounded-xl transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" /> Exam Mode
                    </Link>
                  </div>
                </div>
              </div>

              {/* Progress bar — full width inside card */}
              <div className="mt-5">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span className="font-medium text-gray-600">
                    Overall progress
                  </span>
                  <span className={`font-bold ${cls.accentText}`}>
                    Target: {cls.target}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cls.accentProg} rounded-full transition-all`}
                    style={{ width: `${cls.gradePct}%` }}
                  />
                </div>
              </div>

              {/* ── Next Assessment — inside same card, below progress ── */}
              <div className="mt-4 pt-4  bg-indigo-50 border border-indigo-100 flex flex-col py-1 px-2 rounded-xl sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ">
                      Next Assessment
                    </p>
                    <p className="text-base font-extrabold text-gray-900">
                      Exam 2 – Thu, Nov 20
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Topics: Mitosis · Cell Cycle · Enzymes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-center bg-white border border-gray-200 rounded-xl px-2 py-1 shadow-sm">
                    <p className="text-3xl font-extrabold text-indigo-600 leading-none">
                      {cls.examPrediction || 86}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Predicted LTI ⓘ
                    </p>
                  </div>
                  <svg
                    width="80"
                    height="36"
                    viewBox="0 0 80 36"
                    className="hidden sm:block"
                  >
                    <polyline
                      points="0,28 16,20 32,24 48,12 64,8 80,4"
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <polyline
                      points="0,28 16,20 32,24 48,12 64,8 80,4 80,36 0,36"
                      fill="url(#sparkGrad)"
                      stroke="none"
                    />
                    <defs>
                      <linearGradient
                        id="sparkGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#4F46E5"
                          stopOpacity="0.2"
                        />
                        <stop
                          offset="100%"
                          stopColor="#4F46E5"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ── TABS + CONTENT ─────────────────────────────────────── */}

          {/* Tab bar */}
          <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm mb-4 overflow-x-auto">
            {[
              { id: "overview" as Tab, label: "Overview", icon: "📊" },
              { id: "topics" as Tab, label: "Topics", icon: "🧠" },
              { id: "materials" as Tab, label: "Materials", icon: "📁" },
              { id: "grades" as Tab, label: "Grades", icon: "🏆" },
              { id: "assignments" as Tab, label: "Assignments", icon: "📝" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  tab === t.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* ── MAIN CONTENT ─────────────────────────────────── */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* OVERVIEW TAB */}
              {tab === "overview" && (
                <>
                  {/* AI Study Insights */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">⚡</span>
                      <p className="text-sm font-extrabold text-gray-900">
                        AI Study Insights
                      </p>
                      <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                        Beta
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        {
                          icon: "🎯",
                          text: "Keep practicing Mitosis diagrams",
                          color: "bg-indigo-50 border-indigo-100",
                        },
                        {
                          icon: "📋",
                          text: "Review Cellular Respiration steps",
                          color: "bg-amber-50 border-amber-100",
                        },
                        {
                          icon: "🔬",
                          text: "Focus more on Enzyme Kinetics examples",
                          color: "bg-green-50 border-green-100",
                        },
                      ].map((s, i) => (
                        <div
                          key={i}
                          className={`flex items-start gap-2.5 p-3 rounded-md border ${s.color}`}
                        >
                          <span className="text-lg flex-shrink-0">
                            {s.icon}
                          </span>
                          <p className="text-xs font-medium text-gray-700 leading-relaxed">
                            {s.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Topics by priority */}
                  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-5 py-2 ">
                      <div className="flex items-center gap-2">
                        <span className="text-base">⚡</span>
                        <p className="text-sm font-extrabold text-gray-900">
                          Topics — by priority
                        </p>
                      </div>
                      <button className="text-xs font-semibold text-indigo-600 hover:underline">
                        View all topics
                      </button>
                    </div>
                    <div className="mb-3">
                      {(cls.topicsList.length > 0
                        ? cls.topicsList
                        : [
                            { name: "Mitosis", mastery: 28, tags: [] },
                            {
                              name: "Cellular Respiration",
                              mastery: 44,
                              tags: [],
                            },
                            { name: "Enzyme Kinetics", mastery: 35, tags: [] },
                            { name: "Krebs Cycle", mastery: 72, tags: [] },
                          ]
                      )
                        .slice(0, 4)
                        .map((t, i) => {
                          const ml = masteryLabel(t.mastery);
                          // Light bg per row based on mastery
                
                          const barColor = masteryColor(t.mastery);
                          return (
                            <div
                              key={t.name}
                              className="px-4 py-1  md:px-6 " // Better padding
                            >
                              <div className="flex  items-center gap-3 px-3 py-2 bg-indigo-50 border border-indigo-100 hover:brightness-95 transition-all group rounded-xl">
                                {/* Rank Number */}
                                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-extrabold flex items-center justify-center flex-shrink-0">
                                  {i + 1}
                                </span>

                                {/* Topic Info */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-gray-900 truncate">
                                    {t.name}
                                  </p>

                                  <div className="flex items-center gap-3">
                                    {/* Progress Bar */}
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                      <div
                                        className={`h-full rounded-full transition-all ${barColor}`}
                                        style={{ width: `${t.mastery}%` }}
                                      />
                                    </div>

                                    {/* Percentage */}
                                    <span className="text-[13px] font-semibold text-gray-600 w-10 text-right">
                                      {t.mastery}%
                                    </span>
                                  </div>
                                </div>

                                {/* Status Badge */}
                                <span
                                  className={`text-xs font-bold px-4 py-1.5 rounded-full flex-shrink-0 whitespace-nowrap ${ml.color}`}
                                >
                                  {ml.text}
                                </span>

                                {/* Chevron */}
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Performance breakdown — 4 separate cards in a grid */}

                  <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                      {/* Left */}
                      <div className="flex items-center gap-4">
                        <Sparkles className="w-7 h-7 text-indigo-600" />

                        <div>
                          <p className="text-base font-extrabold text-gray-900">
                            Performance breakdown
                          </p>
                          <p className="text-xs text-gray-400">
                            Academic progress
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                      {[
                        {
                          name: "Exams",
                          score: 88,
                          icon: "📝",
                          color: "text-indigo-600",
                          bar: "bg-indigo-500",
                          light: "bg-indigo-50",
                        },
                        {
                          name: "Quizzes",
                          score: 82,
                          icon: "❓",
                          color: "text-violet-600",
                          bar: "bg-violet-500",
                          light: "bg-violet-50",
                        },
                        {
                          name: "Homework",
                          score: 95,
                          icon: "📚",
                          color: "text-emerald-600",
                          bar: "bg-emerald-500",
                          light: "bg-emerald-50",
                        },
                        {
                          name: "Participation",
                          score: 90,
                          icon: "🤝",
                          color: "text-amber-600",
                          bar: "bg-amber-500",
                          light: "bg-amber-50",
                        },
                      ].map((g) => (
                        <div
                          key={g.name}
                          className=" border border-gray-200 rounded-2xl p-4 text-center"
                        >
                          {/* Score Card Item */}
                          <div className="flex items-center gap-1">
                            {/* Icon - Left Side */}
                            <div
                              className={`w-11 h-11 rounded-2xl ${g.light} flex items-center justify-center text-xl flex-shrink-0`}
                            >
                              {g.icon}
                            </div>

                            {/* Text Content - Right Side */}
                            <div className="flex-1">
                              {/* Score */}
                              <p
                                className={`text-2xl font-extrabold ${g.color}`}
                              >
                                {g.score}%
                              </p>

                              {/* Label */}
                              <p className="text-xs font-bold text-gray-700">
                                {g.name}
                              </p>

                              <p className="text-[10px] text-gray-400">
                                Average score
                              </p>
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${g.bar} rounded-full`}
                              style={{ width: `${g.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div className="bg-gradient-to-r from-indigo-100 to-violet-100 rounded-2xl p-5 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-200 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-black">
                          AI Study Recommendation
                        </p>
                        <p className="text-xs text-gray-700 mt-0.5">
                          Spend 20–30 minutes daily on weak topics to improve
                          your overall grade.
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all hover:bg-indigo-50 flex-shrink-0 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" /> Generate Study Plan
                    </button>
                  </div>
                </>
              )}

              {/* TOPICS TAB */}
              {tab === "topics" && (
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-gray-50">
                    <p className="text-sm font-extrabold text-gray-900">
                      All Topics
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Sorted by mastery — weakest first
                    </p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {(cls.topicsList.length > 0
                      ? cls.topicsList
                      : [
                          {
                            name: "Mitosis",
                            mastery: 28,
                            tags: ["On review sheet"],
                          },
                          {
                            name: "Enzyme Kinetics",
                            mastery: 35,
                            tags: ["Quiz 3 weak"],
                          },
                          {
                            name: "Cellular Respiration",
                            mastery: 44,
                            tags: ["On review sheet"],
                          },
                          {
                            name: "DNA Replication",
                            mastery: 65,
                            tags: ["2 lectures"],
                          },
                          {
                            name: "Krebs Cycle",
                            mastery: 72,
                            tags: ["Quiz 2 ✓"],
                          },
                          { name: "Cell Membrane", mastery: 81, tags: [] },
                        ]
                    ).map((t, i) => {
                      const ml = masteryLabel(t.mastery);
                      return (
                        <div
                          key={t.name}
                          className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-all group"
                        >
                          <span className="text-sm font-bold text-gray-300 w-5 flex-shrink-0">
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <p className="text-sm font-semibold text-gray-900">
                                {t.name}
                              </p>
                              {t.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[9px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full border border-indigo-100"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${masteryColor(t.mastery)} rounded-full`}
                                  style={{ width: `${t.mastery}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400">
                                {t.mastery}%
                              </span>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${ml.color}`}
                          >
                            {ml.text}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 flex-shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MATERIALS TAB */}
              {tab === "materials" && (
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                    <p className="text-sm font-extrabold text-gray-900">
                      Course Materials
                    </p>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-all">
                      <Upload className="w-3.5 h-3.5" /> Upload file
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {(cls.files_list.length > 0
                      ? cls.files_list
                      : [
                          {
                            name: "BIO101 Syllabus.pdf",
                            type: "syllabus",
                            status: "ready",
                            size: "180 KB",
                          },
                          {
                            name: "Lecture 10 — Krebs",
                            type: "lecture_audio",
                            status: "ready",
                            size: "48 min",
                          },
                          {
                            name: "Exam 2 Review Sheet",
                            type: "review_sheet",
                            status: "ready",
                            size: "4 pages",
                          },
                          {
                            name: "Quiz 3 — Graded",
                            type: "graded_work",
                            status: "ready",
                            size: "82%",
                          },
                          {
                            name: "Lecture 11 Slides",
                            type: "lecture_slides",
                            status: "ready",
                            size: "2.1 MB",
                          },
                        ]
                    ).map((f) => {
                      const meta = FILE_META[f.type] || FILE_META.assignment;
                      return (
                        <div
                          key={f.name}
                          className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-all group"
                        >
                          <div
                            className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}
                          >
                            <meta.icon className={`w-4 h-4 ${meta.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {f.name}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {meta.label} · {f.size}
                            </p>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${f.status === "ready" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                          >
                            {f.status === "ready" ? "Ready" : "Processing"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GRADES TAB */}
              {tab === "grades" && (
                <div className="space-y-4">
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <p className="text-sm font-extrabold text-gray-900 mb-4">
                      Grade breakdown
                    </p>
                    <div className="space-y-3">
                      {(cls.grades.length > 0
                        ? cls.grades
                        : [
                            { name: "Exams", weight: 50, score: 88 },
                            { name: "Quizzes", weight: 25, score: 82 },
                            { name: "Homework", weight: 20, score: 95 },
                            { name: "Participation", weight: 5, score: 90 },
                          ]
                      ).map((g) => (
                        <div key={g.name}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-800">
                                {g.name}
                              </p>
                              <span className="text-[10px] text-gray-400">
                                {g.weight}%
                              </span>
                            </div>
                            <span
                              className={`text-sm font-extrabold ${gradeColor(g.score)}`}
                            >
                              {g.score}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${masteryColor(g.score)} rounded-full`}
                              style={{ width: `${g.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT SIDEBAR ─────────────────────────────────── */}
            <div className="w-full lg:w-[240px] lg:flex-shrink-0 space-y-4">
              {/* Professor card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">
                    Professor
                  </p>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                    Online
                  </span>
                </div>
                <div className="flex flex-col items-center text-center mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xl mb-2 shadow-lg shadow-indigo-500/25">
                    {cls.profInitials}
                  </div>
                  <p className="text-sm font-extrabold text-gray-900">
                    {cls.professor}
                  </p>
                  <p className="text-xs text-gray-400">Professor</p>
                </div>
                <div className="space-y-1.5 mb-3">
                  {[
                    { icon: "🕐", val: cls.schedule.split(" ")[0] },
                    {
                      icon: "⏰",
                      val: cls.schedule.split(" ").slice(1).join(" "),
                    },
                    {
                      icon: "📧",
                      val:
                        cls.professor.toLowerCase().replace(" ", ".") +
                        "@university.edu",
                    },
                  ].map((r) => (
                    <div
                      key={r.val}
                      className="flex items-center gap-2 text-xs text-gray-500"
                    >
                      <span className="flex-shrink-0">{r.icon}</span>
                      <span className="truncate">{r.val}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full flex items-center justify-center gap-2 border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-700 font-bold py-2 rounded-xl text-xs transition-all">
                  Message Professor
                </button>
              </div>

              {/* Quick Tools */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm w-full">
                <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3">
                  Quick Tools
                </p>
                <div className="space-y-1">
                  {[
                    {
                      icon: "📖",
                      label: "Study Guide",
                      sub: "AI-generated notes",
                      href: "/study-guide",
                    },
                    {
                      icon: "🃏",
                      label: "Flashcards",
                      sub: "Spaced repetition",
                      href: "/flashcards",
                    },
                    {
                      icon: "❓",
                      label: "Practice Quiz",
                      sub: "Test yourself",
                      href: "/quiz",
                    },
                    {
                      icon: "⚡",
                      label: "Exam Mode",
                      sub: "Simulate exam",
                      href: "/exam-mode",
                    },
                    {
                      icon: "📤",
                      label: "Upload File",
                      sub: "Add materials",
                      href: "/upload",
                    },
                  ].map((t) => (
                    <a
                      key={t.href}
                      href={t.href}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-indigo-50 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center flex-shrink-0 text-base transition-all">
                        {t.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 group-hover:text-indigo-700">
                          {t.label}
                        </p>
                        <p className="text-[10px] text-gray-400">{t.sub}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-500 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 p-3 flex gap-2 md:hidden z-30">
        <Link
          href="/study-guide"
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 rounded-2xl text-sm"
        >
          <BookOpen className="w-4 h-4" /> Study Guide
        </Link>
        <Link
          href="/exam-mode"
          className="flex-1 flex items-center justify-center gap-2 border-2 border-indigo-200 text-indigo-700 font-bold py-3 rounded-2xl text-sm"
        >
          <Zap className="w-4 h-4" /> Exam Mode
        </Link>
      </div>
      <div className="h-20 md:hidden" />
    </>
  );
}
function AddClassModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [professor, setProfessor] = useState("");
  const [credits, setCredits] = useState("3");
  const [color, setColor] = useState("#534AB7");
  const [saved, setSaved] = useState(false);

  const COLORS = [
    "#534AB7",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
  ];

  const handleSave = () => {
    if (!name.trim()) return;
    setSaved(true);
    setTimeout(onClose, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Top strip */}
        <div className="h-1.5 w-full" style={{ background: color }} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-extrabold text-gray-900">
              Add a class
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Class name */}
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">
                Class name *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Introduction to Biology"
                className="w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all"
              />
            </div>

            {/* Code + Credits row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">
                  Course code
                </label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. BIO 101"
                  className="w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">
                  Credits
                </label>
                <select
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  className="w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all bg-white"
                >
                  {["1", "2", "3", "4", "5", "6"].map((c) => (
                    <option key={c} value={c}>
                      {c} credits
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Professor */}
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">
                Professor
              </label>
              <input
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                placeholder="e.g. Dr. Sarah Smith"
                className="w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all"
              />
            </div>

            {/* Color picker */}
            <div>
              <label className="text-xs font-bold text-gray-600 mb-2 block">
                Class colour
              </label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full transition-all ${color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3.5 py-2.5 mt-4">
            <p className="text-xs text-indigo-700 font-medium">
              💡 After adding, upload your syllabus so Atlas can build your
              study plan automatically.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2.5 mt-4">
            <button
              onClick={onClose}
              className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold py-2.5 rounded-xl text-sm transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className={`flex-1 flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl text-sm transition-all ${
                saved
                  ? "bg-emerald-500 text-white"
                  : name.trim()
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
                    : "bg-indigo-300 text-white cursor-not-allowed"
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Added!
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Add class
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClassesPage() {
  const [selected, setSelected] = useState<CLS | null>(null);
  const [loading, setLoading] = useState(true);

  // When the student hasn't added any classes yet, show a friendly empty
  // state instead of the full classes grid. Toggled via a localStorage flag
  // that the Add Class flow will flip to 'true' on successful add.
  const [hasClasses, setHasClasses] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("atlas_has_classes") === "true") setHasClasses(true);
  }, []);

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = CLASSES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.professor.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );

  const totalCredits = CLASSES.reduce((s, c) => s + c.credits, 0);
  const avgGrade = Math.round(
    CLASSES.reduce((s, c) => s + c.gradePct, 0) / CLASSES.length,
  );

  if (selected) {
    return (
      <AppLayout>
        <ClassDetail cls={selected} onBack={() => setSelected(null)} />
      </AppLayout>
    );
  }

  if (loading) return <PageSkeleton />;

  /* ─────────────────────────────────────────────────────────────
   * EMPTY STATE — student hasn't added any classes yet.
   * Shows guidance + two clear options: upload syllabus OR add manually.
   * ───────────────────────────────────────────────────────────── */
  if (!hasClasses) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#F5F5FB] p-4 md:p-8">
          <div className="max-w-[920px] mx-auto">

            {/* Header */}
            <div className="text-center mb-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F4F2FF] border border-[#E8E5FD] text-[#534AB7] text-[11px] font-bold px-3.5 py-1.5 mb-4">
                <GraduationCap className="w-3.5 h-3.5" /> Step 2 — Add your classes
              </span>
              <h1 className="text-3xl md:text-[34px] font-extrabold text-[#14142B] leading-tight mb-2">
                Add the classes you&apos;re taking
              </h1>
              <p className="text-sm text-[#6B6A8A] max-w-xl mx-auto leading-relaxed">
                Atlas builds a personalised study plan for every class. Add them by
                uploading a syllabus, or enter them manually — your choice.
              </p>
            </div>

            {/* Two big action cards — Upload OR Manual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
              {/* Option 1 — Upload syllabus (primary, purple) */}
              <Link
                href="/upload"
                className="group relative overflow-hidden bg-gradient-to-br from-[#534AB7] via-[#5B4FBC] to-[#7B6FE8] rounded-3xl p-6 shadow-xl shadow-[#534AB7]/20 hover:shadow-2xl transition-all active:scale-[0.99]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/90 text-emerald-950 text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-wider">
                    Recommended
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white mb-1.5">
                  Upload syllabus
                </h3>
                <p className="text-[13px] text-white/85 leading-relaxed mb-5">
                  Atlas reads your syllabus and creates the class automatically —
                  with topics, deadlines, and grading weights all set up.
                </p>
                <div className="flex items-center gap-2 text-white font-extrabold text-sm">
                  <span>Upload a file</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Option 2 — Add manually (secondary, white) */}
              <button
                onClick={() => setShowAddModal(true)}
                className="group text-left relative overflow-hidden bg-white border border-[#ECE9FF] rounded-3xl p-6 shadow-sm hover:shadow-lg hover:border-[#534AB7]/30 transition-all active:scale-[0.99]"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F4F2FF] flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-[#534AB7]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#14142B] mb-1.5">
                  Add manually
                </h3>
                <p className="text-[13px] text-[#6B6A8A] leading-relaxed mb-5">
                  Don&apos;t have a syllabus handy? Enter class details one at a
                  time — code, name, professor, schedule.
                </p>
                <div className="flex items-center gap-2 text-[#534AB7] font-extrabold text-sm">
                  <span>Enter class details</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* What Atlas tracks per class */}
            <div className="mb-7">
              <p className="text-[11px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-3">
                What Atlas tracks for each class
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { icon: BookOpen,   color: 'bg-[#534AB7]',    label: 'Topics covered',  desc: 'Every concept from lectures, tagged by week and unit.' },
                  { icon: Target,     color: 'bg-emerald-500',  label: 'Grading weights', desc: 'Exam, quiz, homework percentages — auto-extracted.' },
                  { icon: BarChart2,  color: 'bg-blue-500',     label: 'Your grades',     desc: 'Live grade tracking with projected final score.' },
                  { icon: Brain,      color: 'bg-orange-500',   label: 'Weak areas',      desc: 'Topics you missed, ranked for focused review.' },
                ].map((c) => (
                  <div key={c.label} className="bg-white border border-[#ECE9FF] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                        <c.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-[13px] font-extrabold text-[#1A1A2E] leading-tight">{c.label}</p>
                    </div>
                    <p className="text-[12px] text-[#6B6A8A] leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reassurance band */}
            <div className="bg-[#F4F2FF] border border-[#E8E5FD] rounded-2xl px-5 py-4 flex items-start gap-3.5">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-[#534AB7]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-extrabold text-[#1A1A2E]">Add as many classes as you need</p>
                <p className="text-[12px] text-[#6B6A8A] leading-relaxed">
                  You can come back any time to add new classes, edit details, or remove old ones.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Reuse the existing "Add class" modal */}
        {showAddModal && (
          <AddClassModal onClose={() => setShowAddModal(false)} />
        )}
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-3 md:p-4 lg:p-6 max-w-[1200px] mx-auto">
        {/* ── Header card — light purple bg, illustration right side ── */}
        <div className="relative bg-gradient-to-r from-[#EEF0FF] via-[#EAE8FE] to-[#E4E2FD] rounded-3xl overflow-hidden mb-5 shadow-sm border border-[#DDDAFE]">
          {/* Inline SVG illustration — graduation cap + plant (always visible) */}
          <div className="absolute right-32 top-1/2 -translate-y-1/2 hidden md:block opacity-40 pointer-events-none select-none">
            <svg width="160" height="130" viewBox="0 0 160 130" fill="none">
              {/* Plant leaves */}
              <ellipse
                cx="130"
                cy="55"
                rx="18"
                ry="32"
                fill="#A5B4FC"
                transform="rotate(-20 130 55)"
                opacity="0.7"
              />
              <ellipse
                cx="148"
                cy="60"
                rx="14"
                ry="26"
                fill="#818CF8"
                transform="rotate(15 148 60)"
                opacity="0.6"
              />
              <ellipse
                cx="118"
                cy="65"
                rx="12"
                ry="22"
                fill="#C7D2FE"
                transform="rotate(-35 118 65)"
                opacity="0.5"
              />
              {/* Plant stem */}
              <rect
                x="133"
                y="72"
                width="4"
                height="40"
                rx="2"
                fill="#818CF8"
                opacity="0.5"
              />
              {/* Pot */}
              <rect
                x="122"
                y="108"
                width="26"
                height="20"
                rx="4"
                fill="#A5B4FC"
                opacity="0.6"
              />
              <rect
                x="118"
                y="105"
                width="34"
                height="6"
                rx="3"
                fill="#818CF8"
                opacity="0.5"
              />
              {/* Graduation cap — board */}
              <ellipse
                cx="62"
                cy="42"
                rx="42"
                ry="10"
                fill="#6366F1"
                opacity="0.7"
              />
              {/* Cap top */}
              <rect
                x="42"
                y="20"
                width="40"
                height="24"
                rx="4"
                fill="#4F46E5"
                opacity="0.8"
              />
              {/* Tassel string */}
              <line
                x1="100"
                y1="42"
                x2="112"
                y2="68"
                stroke="#818CF8"
                strokeWidth="3"
                opacity="0.6"
              />
              <circle cx="112" cy="72" r="6" fill="#A5B4FC" opacity="0.7" />
              {/* Stars */}
              <circle cx="30" cy="20" r="3" fill="#818CF8" opacity="0.4" />
              <circle cx="115" cy="18" r="2" fill="#A5B4FC" opacity="0.5" />
              <circle cx="20" cy="70" r="2" fill="#C7D2FE" opacity="0.4" />
            </svg>
          </div>

          <div className="relative z-10 px-6 py-5">
            {/* Title row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900">
                    My Classes
                  </h1>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Fall 2026 · {CLASSES.length} classes · {totalCredits}{" "}
                    credits total
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/25"
              >
                <Plus className="w-4 h-4" /> Add class
              </button>
            </div>

            {/* 4 stat cards — white bg matching image */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  icon: TrendingUp,
                  bg: "bg-indigo-50",
                  color: "text-indigo-600",
                  label: "Current GPA",
                  value: "3.42",
                },
                {
                  icon: Star,
                  bg: "bg-emerald-50",
                  color: "text-emerald-500",
                  label: "Projected GPA",
                  value: "3.61",
                },
                {
                  icon: CheckCircle2,
                  bg: "bg-blue-50",
                  color: "text-blue-500",
                  label: "On track",
                  value: "3 / 5",
                },
                {
                  icon: Brain,
                  bg: "bg-purple-50",
                  color: "text-purple-500",
                  label: "Avg grade",
                  value: `${avgGrade}%`,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div>
                    <p
                      className={`text-lg md:text-xl font-extrabold ${s.color} leading-none`}
                    >
                      {s.value}
                    </p>
                    <p className="text-[11px] md:text-xs text-gray-400 mt-0.5">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Search + Sort row ───────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mb-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search classes or professors..."
              className="w-full sm:w-72 bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-indigo-400 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            {search && (
              <p className="text-xs text-gray-400">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </p>
            )}
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm text-xs text-gray-500 font-medium">
              Sort by:{" "}
              <span className="font-bold text-gray-800 ml-1">Recent</span>
              <ChevronRight className="w-3.5 h-3.5 rotate-90 text-gray-400" />
            </div>
            <button className="w-9 h-9 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center hover:border-indigo-300 transition-all">
              <svg viewBox="0 0 16 16" className="w-4 h-4 fill-indigo-600">
                <rect x="1" y="1" width="5" height="5" rx="1" />
                <rect x="10" y="1" width="5" height="5" rx="1" />
                <rect x="1" y="10" width="5" height="5" rx="1" />
                <rect x="10" y="10" width="5" height="5" rx="1" />
              </svg>
            </button>
            <button className="w-9 h-9 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center hover:border-indigo-300 transition-all">
              <svg viewBox="0 0 16 16" className="w-4 h-4 fill-gray-400">
                <rect x="1" y="2" width="14" height="2" rx="1" />
                <rect x="1" y="7" width="14" height="2" rx="1" />
                <rect x="1" y="12" width="14" height="2" rx="1" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Class grid ──────────────────────────────────────── */}
        {filtered.length === 0 && search ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No classes match "{search}"</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            type="no-classes"
            onAction={() => setShowAddModal(true)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {filtered.map((cls) => (
              <ClassCard
                key={cls.id}
                cls={cls}
                onClick={() => setSelected(cls)}
              />
            ))}
          </div>
        )}
      </div>

      {showAddModal && <AddClassModal onClose={() => setShowAddModal(false)} />}
    </AppLayout>
  );
}
