"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";

import AskAIWidget, { AskAIInline } from "@/components/AskAIWidget";
import WhyTaskModal, { type WhyTaskData } from "@/components/WhyTaskModal";
import {
  Play,
  ChevronRight,
  Brain,
  Clock,
  AlertTriangle,
  Zap,
  Sparkles,
  BookOpen,
  SkipForward,
  ChevronDown,
  Upload,
  Lock,
  Target,
  ArrowRight,
} from "lucide-react";
import Tooltip from "@/components/Tooltip";

/* ─── Data ───────────────────────────────────────────────────── */
const TASKS = [
  {
    rank: 1,
    topic: "Cell Division",
    class: "Biology 101",
    duration: 45,
    priority: "High",
    mastery: 28,
    accentBar: "bg-indigo-500",
    classBg: "bg-indigo-50",
    classText: "text-indigo-700",
    reasons: [
      "Midterm in 3 days",
      "Quiz score 40% — weak",
      "24% syllabus weight",
      "Mentioned 5× by professor",
    ],
    evidence: [
      { label: "Syllabus", value: "Unit 2: Cell Structure" },
      { label: "Professor", value: "Mentioned 5×" },
      { label: "Quiz score", value: "40% — Below avg" },
      { label: "Mastery", value: "28% — Low" },
    ],
    engine: {
      mastery: { value: 0.28, label: "28% — big gap to close" },
      emphasis: { value: 0.82, label: "High — on review sheet + 5× mentioned" },
      proximity: { value: 0.85, label: "Midterm in 3 days" },
      urgency: { value: 0.74, label: "Biology 101 needs the most attention" },
      priorityScore: 0.78,
      signals: [
        {
          kind: "exam_appearance",
          label: "Listed as primary topic on Exam 2 review sheet",
          source: "Exam 2 Review Sheet",
          weight: 1.0,
        },
        {
          kind: "verbal_cue",
          label: '"You should know all five phases cold"',
          source: "Lecture 8 · 14:18",
          weight: 0.8,
        },
        {
          kind: "quiz_appearance",
          label: "Missed 2 of 3 phase ordering questions",
          source: "Quiz 3",
          weight: 0.7,
        },
        {
          kind: "lecture_mention",
          label: "Mentioned 5× across recent lectures",
          source: "Lectures 7-11",
          weight: 0.3,
        },
        {
          kind: "slide_emphasis",
          label: "Highlighted on slides 5-21",
          source: "Lecture 11",
          weight: 0.5,
        },
      ],
      alternatives: [
        {
          topic: "DNA Replication",
          score: 0.62,
          reason: "Mid-priority — exam covers but you scored 65% on Quiz 3",
        },
        {
          topic: "Genetics",
          score: 0.51,
          reason: "Lower priority — mastery already at 55%",
        },
        {
          topic: "Statistics PS#4",
          score: 0.48,
          reason: "Due Friday but you scored 92% avg in Stats",
        },
      ],
    },
  },
  {
    rank: 2,
    topic: "DNA Replication",
    class: "Biology 101",
    duration: 40,
    priority: "High",
    mastery: 35,
    accentBar: "bg-indigo-500",
    classBg: "bg-indigo-50",
    classText: "text-indigo-700",
    reasons: ["On review sheet", "Mentioned 3× in lectures", "Mastery: 35%"],
    evidence: [
      { label: "Syllabus", value: "Unit 2: Genetics" },
      { label: "Professor", value: "Mentioned 3×" },
      { label: "Quiz score", value: "45%" },
      { label: "Mastery", value: "35% — Low" },
    ],
    engine: {
      mastery: { value: 0.35, label: "35% — needs work" },
      emphasis: { value: 0.7, label: "Medium — on review sheet" },
      proximity: { value: 0.85, label: "Same exam in 3 days" },
      urgency: { value: 0.74, label: "Biology 101 is high-urgency" },
      priorityScore: 0.62,
      signals: [
        {
          kind: "review_sheet_appearance",
          label: "Listed on review sheet, page 2",
          source: "Exam 2 Review Sheet",
          weight: 0.9,
        },
        {
          kind: "lecture_mention",
          label: "Mentioned 3× in lectures",
          source: "Lectures 9-10",
          weight: 0.3,
        },
        {
          kind: "quiz_appearance",
          label: "Scored 45% on Quiz 3 questions",
          source: "Quiz 3",
          weight: 0.7,
        },
      ],
    },
  },
  {
    rank: 3,
    topic: "Genetics",
    class: "Biology 101",
    duration: 45,
    priority: "Medium",
    mastery: 55,
    accentBar: "bg-indigo-500",
    classBg: "bg-indigo-50",
    classText: "text-indigo-700",
    reasons: ["Exam question likely", "Medium mastery 55%"],
    evidence: [
      { label: "Syllabus", value: "Unit 3: Genetics" },
      { label: "Professor", value: "Mentioned 2×" },
      { label: "Quiz score", value: "55%" },
      { label: "Mastery", value: "55% — Medium" },
    ],
    engine: {
      mastery: { value: 0.55, label: "55% — partial mastery" },
      emphasis: { value: 0.55, label: "Light coverage so far" },
      proximity: { value: 0.85, label: "Exam in 3 days" },
      urgency: { value: 0.74, label: "Biology 101" },
      priorityScore: 0.51,
      signals: [
        {
          kind: "lecture_mention",
          label: "Mentioned 2× in lectures",
          source: "Lectures 12-13",
          weight: 0.3,
        },
      ],
    },
  },
  {
    rank: 4,
    topic: "Statistics PS#4",
    class: "Statistics 201",
    duration: 40,
    priority: "Medium",
    mastery: 72,
    accentBar: "bg-emerald-500",
    classBg: "bg-emerald-50",
    classText: "text-emerald-700",
    reasons: ["Due Friday", "2 days away"],
    evidence: [
      { label: "Syllabus", value: "Chapter 8" },
      { label: "Professor", value: "Problem set required" },
      { label: "Quiz score", value: "92% avg" },
      { label: "Mastery", value: "72% — Good" },
    ],
    engine: {
      mastery: { value: 0.72, label: "72% — strong mastery" },
      emphasis: { value: 0.6, label: "Required problem set" },
      proximity: { value: 0.9, label: "Due in 2 days" },
      urgency: { value: 0.42, label: "Statistics is on track" },
      priorityScore: 0.48,
      signals: [
        {
          kind: "review_sheet_appearance",
          label: "Listed in syllabus as required",
          source: "STAT 201 syllabus",
          weight: 0.6,
        },
      ],
    },
  },
];

/* ─── Helpers ────────────────────────────────────────────────── */
function masteryBg(p: number) {
  return p < 40 ? "bg-red-500" : p < 60 ? "bg-amber-500" : "bg-emerald-500";
}
function masteryTxt(p: number) {
  return p < 40
    ? "text-red-600"
    : p < 60
      ? "text-amber-600"
      : "text-emerald-600";
}
function masteryLbl(p: number) {
  return p < 40 ? "Needs work" : p < 60 ? "Developing" : "Strong";
}
function priorityCls(p: string) {
  return p === "High"
    ? "bg-red-100 text-red-700 border-red-200"
    : "bg-amber-100 text-amber-700 border-amber-200";
}

/* ─── Task card ──────────────────────────────────────────────── */
function TaskCard({
  task,
  isHero,
  onStart,
  onShowWhy,
}: {
  task: (typeof TASKS)[0];
  isHero: boolean;
  onStart: () => void;
  onShowWhy: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden transition-all ${
        isHero
          ? "border-2 border-indigo-300 shadow-lg shadow-indigo-500/10"
          : "border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200"
      }`}
    >
      {/* Coloured accent strip */}
      <div
        className={`h-1 w-full ${isHero ? "bg-gradient-to-r from-indigo-500 to-violet-500" : task.accentBar}`}
      />

      <div className="p-4 md:p-5">
        {/* ── Row 1: rank + topic + time ──────────────────────── */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 mt-0.5 ${
              isHero
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {task.rank}
          </div>

          <div className="flex-1 min-w-0">
            <p
              className={`font-extrabold text-gray-900 leading-tight ${isHero ? "text-base" : "text-sm"}`}
            >
              {task.topic}
            </p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${task.classBg} ${task.classText}`}
              >
                {task.class}
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${priorityCls(task.priority)}`}
              >
                {task.priority} priority
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-400 flex-shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{task.duration}m</span>
          </div>
        </div>

        {/* ── Row 2: reason pills ──────────────────────────────── */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.reasons.map((r) => (
            <span
              key={r}
              className="text-[10px] font-medium bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {r}
            </span>
          ))}
        </div>

        {/* ── Evidence toggle ──────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
            {open ? "Hide evidence" : "Quick evidence"}
          </button>
          <span className="text-gray-300">·</span>
          <button
            onClick={onShowWhy}
            className="flex items-center gap-1 text-[11px] font-bold text-[#534AB7] hover:text-[#3F3795] hover:bg-[#F4F2FF] px-2 py-1 -mx-1 rounded-md transition-colors"
          >
            <Sparkles className="w-3 h-3" /> Why this task?
          </button>
        </div>

        {open && (
          <div className="grid grid-cols-2 gap-2 mb-3 animate-in">
            {task.evidence.map((e) => (
              <div
                key={e.label}
                className="bg-gray-50 border border-gray-100 rounded-xl p-2.5"
              >
                <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wide mb-0.5">
                  {e.label}
                </p>
                <p className="text-[11px] font-semibold text-gray-800 leading-tight">
                  {e.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── CTA buttons ──────────────────────────────────────── */}
        {isHero ? (
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onStart}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-500/20 flex-1 sm:flex-none"
            >
              <Play className="w-3.5 h-3.5" /> Start This Topic
            </button>
            <Tooltip
              text="Skip this task today — Atlas reschedules it and recalculates your plan."
              position="top"
              width="w-52"
            >
              <button className="flex items-center gap-1.5 border border-gray-200 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 text-gray-400 font-semibold px-4 py-2.5 rounded-xl text-xs transition-all">
                <SkipForward className="w-3.5 h-3.5" /> Skip today
              </button>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onStart}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-all -ml-1"
            >
              <BookOpen className="w-3.5 h-3.5" /> Study this topic
            </button>
            <Tooltip
              text="Skip this task today — Atlas reschedules it and recalculates your plan."
              position="top"
              width="w-52"
            >
              <button className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 hover:text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-200 px-3 py-1.5 rounded-xl transition-all">
                <SkipForward className="w-3 h-3" /> Skip
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function StudyPlanPage() {
  const router = useRouter();
  const totalMins = TASKS.reduce((s, t) => s + t.duration, 0);
  const highCount = TASKS.filter((t) => t.priority === "High").length;

  // Modal state for the "Why this task?" engine breakdown
  const [whyTask, setWhyTask] = useState<WhyTaskData | null>(null);

  // The study plan is fully generated from uploaded materials. Until the
  // student has any, show a strong empty state that previews what a real
  // plan looks like and gives one clear next action.
  const [hasPlan, setHasPlan] = useState(false);
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("atlas_has_plan") === "true"
    ) {
      setHasPlan(true);
    }
  }, []);

  /* ─────────────────────────────────────────────────────────────
   * EMPTY STATE — no materials uploaded, no plan to generate yet.
   * ───────────────────────────────────────────────────────────── */
  if (!hasPlan) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#F5F5FB] p-4 md:p-8">
          <div className="max-w-[1000px] mx-auto">
            {/* Header */}
            <div className="text-center mb-7">
              <h1 className="text-3xl md:text-[34px] font-extrabold text-[#14142B] leading-tight mb-2">
                One ranked plan, every day
              </h1>
              <p className="text-sm text-[#6B6A8A] max-w-2xl mx-auto leading-relaxed">
                Upload your course materials and Atlas builds a daily study plan
                ranked by what actually moves your grade. Every task comes with
                a clear reason — no guesswork.
              </p>
            </div>

            {/* Hero — dark purple gradient with studyplanpage.webp as full-width bg */}
            <div
              className="relative overflow-hidden rounded-3xl mb-7
             bg-gradient-to-br from-[#534AB7] via-[#5B4FBC] to-[#7B6FE8]
             shadow-xl shadow-[#534AB7]/20 min-h-[210px]"
            >
              {/* Desktop-only illustration */}
              <img
                src="https://res.cloudinary.com/mview/image/upload/atlas/studyplanpage.webp"
                alt=""
                className="hidden lg:block absolute inset-0 w-full h-full object-cover object-right pointer-events-none"
              />

              {/* Mobile decorative blobs */}
              <div className="lg:hidden absolute -top-16 -right-12 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
              <div className="lg:hidden absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-white/10 blur-3xl" />

              {/* Desktop sparkles */}
              <Sparkles className="hidden lg:block absolute top-8 right-1/3 w-4 h-4 text-white/30 z-10" />
              <Sparkles className="hidden lg:block absolute bottom-12 right-1/4 w-3 h-3 text-white/30 z-10" />

              {/* Content */}
              <div className="relative z-10 p-6 md:p-8 lg:p-9 max-w-full lg:max-w-[58%]">
                {/* Mobile glass card */}
                <div className=" ">
                  {/* Badge */}
                  <span
                    className="inline-flex items-center gap-2 rounded-full
                   bg-white/15 backdrop-blur border border-white/20
                   text-white text-[11px] font-bold px-3 py-1.5 mb-4"
                  >
                    <Zap className="w-3 h-3" />
                    Takes 30 seconds
                  </span>

                  {/* Heading */}
                  <h2 className="text-[28px] lg:text-[32px] font-extrabold text-white leading-tight mb-3">
                    Drop your syllabus
                    <br />
                    <span className="text-white/90">
                      to start planning smarter
                    </span>
                  </h2>

                  {/* Description */}
                  <p className="text-[14px] md:text-[15px] text-white/85   leading-relaxed mb-6">
                    Atlas reads your syllabus, lecture slides, and grades — then
                    ranks every topic by grade impact, deadline, and how well
                    you already know it.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/upload"
                      className="inline-flex justify-center items-center gap-2
                     bg-white hover:bg-[#F4F2FF]
                     text-[#534AB7]
                     px-5 py-3 rounded-xl
                     font-extrabold text-sm
                     shadow-lg transition-all active:scale-95"
                    >
                      <Upload className="w-4 h-4" />
                      Upload materials
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href="/classes"
                      className="inline-flex justify-center items-center gap-2
                     bg-white/15 hover:bg-white/25
                     backdrop-blur border border-white/30
                     text-white px-5 py-3 rounded-xl
                     font-extrabold text-sm transition-all active:scale-95"
                    >
                      <BookOpen className="w-4 h-4" />
                      Add a class first
                    </Link>
                  </div>

                  {/* Mobile feature cards */}
                 
                </div>
              </div>
            </div>

            {/* Locked sample plan preview — the killer motivation */}
            <div className="relative bg-white border border-[#ECE9FF] rounded-2xl p-5 mb-7 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#534AB7]" />
                  <h3 className="text-lg font-extrabold text-[#14142B]">
                    Sample study plan
                  </h3>
                </div>
                <span className="text-[12px] text-[#9B9AB5] font-semibold">
                  Preview
                </span>
              </div>

              <div className="relative space-y-2.5">
                {[
                  {
                    rank: 1,
                    topic: "Cell Division",
                    subject: "Biology 101",
                    duration: "45 min",
                    priority: "High",
                    pColor: "bg-red-100 text-red-700",
                    bar: "bg-indigo-500",
                    sbg: "bg-indigo-50",
                    stext: "text-indigo-700",
                  },
                  {
                    rank: 2,
                    topic: "Hypothesis Testing",
                    subject: "Statistics 201",
                    duration: "30 min",
                    priority: "High",
                    pColor: "bg-red-100 text-red-700",
                    bar: "bg-purple-500",
                    sbg: "bg-purple-50",
                    stext: "text-purple-700",
                  },
                  {
                    rank: 3,
                    topic: "Essay Structure",
                    subject: "English 110",
                    duration: "25 min",
                    priority: "Medium",
                    pColor: "bg-amber-100 text-amber-700",
                    bar: "bg-rose-500",
                    sbg: "bg-rose-50",
                    stext: "text-rose-700",
                  },
                ].map((t) => (
                  <div
                    key={t.rank}
                    className="relative flex items-stretch bg-[#FAFAFE] border border-[#ECE9FF] rounded-xl overflow-hidden opacity-60"
                  >
                    {/* Colored accent bar */}
                    <div className={`w-1 ${t.bar} flex-shrink-0`} />
                    <div className="flex-1 p-3.5 flex items-center gap-3">
                      {/* Rank circle */}
                      <div className="w-8 h-8 rounded-full bg-[#F4F2FF] flex items-center justify-center text-[#534AB7] font-extrabold text-sm flex-shrink-0">
                        {t.rank}
                      </div>
                      {/* Topic + class */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-extrabold text-[#1A1A2E] truncate">
                          {t.topic}
                        </p>
                        <span
                          className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${t.sbg} ${t.stext} mt-1`}
                        >
                          {t.subject}
                        </span>
                      </div>
                      {/* Duration */}
                      <div className="flex items-center gap-1 text-[11px] text-[#6B6A8A] flex-shrink-0">
                        <Clock className="w-3 h-3" /> {t.duration}
                      </div>
                      {/* Priority badge */}
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 ${t.pColor}`}
                      >
                        {t.priority}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Centered lock overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-11 h-11 rounded-2xl bg-[#534AB7] flex items-center justify-center shadow-lg shadow-[#534AB7]/30 mb-2">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-[18px] font-extrabold text-[#14142B]">
                    Your plan will look like this
                  </p>
                  <p className="text-[13px] text-[#6B6A8A] mt-0.5">
                    Upload a syllabus to generate yours.
                  </p>
                </div>
              </div>
            </div>

            {/* How Atlas builds your plan */}
            <div className="mb-7">
              <p className="text-[15px] font-extrabold text-[#61616b] uppercase tracking-widest mb-3">
                How Atlas builds your plan
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    icon: Target,
                    color: "bg-[#534AB7]",
                    label: "Ranked by grade impact",
                    desc: "Tasks that move your final grade most go first.",
                  },
                  {
                    icon: AlertTriangle,
                    color: "bg-red-500",
                    label: "Deadline-aware",
                    desc: "Approaching exams and due dates bubble up.",
                  },
                  {
                    icon: Brain,
                    color: "bg-blue-500",
                    label: "Mastery-driven",
                    desc: "More time on weak topics, less on what you know.",
                  },
                  {
                    icon: Clock,
                    color: "bg-emerald-500",
                    label: "Fits your schedule",
                    desc: "Tasks sized to the time you actually have today.",
                  },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="bg-white border border-[#ECE9FF] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center shadow-md flex-shrink-0`}
                      >
                        <c.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-[16px] font-extrabold text-[#1A1A2E] leading-tight">
                        {c.label}
                      </p>
                    </div>
                    <p className="text-[13px] text-[#6B6A8A] leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reassurance band */}
            <div className="bg-[#F4F2FF] border border-[#E8E5FD] rounded-2xl px-5 py-4 flex items-start gap-3.5">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-[#534AB7]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-extrabold text-[#1A1A2E]">
                  Every task has a reason
                </p>
                <p className="text-[13px] text-[#6B6A8A] leading-relaxed">
                  Atlas tells you WHY each task is ranked where it is — syllabus
                  weight, professor mentions, your past performance. No black
                  boxes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-[1100px] mx-auto">
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
              <span
                className="hover:text-indigo-600 cursor-pointer"
                onClick={() => router.push("/home")}
              >
                Home
              </span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-indigo-600 font-semibold">Study Plan</span>
            </div>
            <h1 className="text-lg md:text-xl font-extrabold text-gray-900">
              Your Personalised Study Plan
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              AI-generated from your materials · Updated today
            </p>
          </div>
          <button
            onClick={() => router.push("/study-session")}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20 flex-shrink-0"
          >
            <Play className="w-4 h-4" /> Start Today&apos;s Session
          </button>
        </div>

        {/* ── Ask AI — top of page ─────────────────────────────── */}
        <AskAIInline context="study-plan" />

        {/* ── Why this plan ─────────────────────────────────────── */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-4 py-3.5 mb-5">
          <div className="flex items-start gap-2.5">
            <Brain className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-indigo-800 mb-2">
                Why this plan?
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Biology Midterm in 3 days",
                  "Low quiz scores in Cell Division",
                  "Topics ranked by exam weight",
                  "Adjusted for your study hours",
                ].map((r) => (
                  <span
                    key={r}
                    className="text-[11px] text-indigo-700 bg-white border border-indigo-100 px-2.5 py-1 rounded-lg font-medium"
                  >
                    ✓ {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Main layout ──────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left — task cards */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
                Recommended study order
              </p>
              <span className="text-[11px] text-gray-400 font-medium">
                {totalMins} min total
              </span>
            </div>

            {TASKS.map((task, i) => (
              <TaskCard
                key={task.rank}
                task={task}
                isHero={i === 0}
                onStart={() => router.push("/study-session")}
                onShowWhy={() =>
                  setWhyTask({
                    topic: task.topic,
                    className: task.class,
                    duration: task.duration,
                    ...task.engine,
                  })
                }
              />
            ))}

            <button
              onClick={() => router.push("/home")}
              className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-xl hover:bg-indigo-50 transition-all"
            >
              Back to Dashboard <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right sidebar */}
          <div className="lg:w-[220px] lg:flex-shrink-0 space-y-3">
            {/* Ask AI */}
            <AskAIWidget context="study-plan" />
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">
                Today&apos;s Plan
              </p>
              <div className="divide-y divide-gray-50">
                {[
                  {
                    label: "Total time",
                    value: `${totalMins} min`,
                    color: "text-gray-800",
                  },
                  {
                    label: "Topics",
                    value: `${TASKS.length}`,
                    color: "text-gray-800",
                  },
                  {
                    label: "High priority",
                    value: `${highCount}`,
                    color: "text-red-600",
                  },
                  { label: "Exam in", value: "3 days", color: "text-red-600" },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex justify-between items-center text-xs py-2"
                  >
                    <span className="text-gray-400">{r.label}</span>
                    <span className={`font-extrabold ${r.color}`}>
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly goal */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">
                Weekly Goal
              </p>
              <div className="flex items-end gap-1.5 mb-2">
                <p className="text-2xl font-extrabold text-indigo-600 leading-none">
                  12.4
                </p>
                <p className="text-xs text-gray-400 mb-0.5">of 20h</p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: "62%" }}
                />
              </div>
              <p className="text-[10px] text-emerald-600 font-semibold">
                62% · 7.6h remaining
              </p>
            </div>

            {/* Exam alert */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs font-extrabold text-red-800">
                  Exam Alert
                </p>
              </div>
              <p className="text-[11px] text-red-700 leading-relaxed mb-2.5">
                Biology Midterm in <strong>3 days</strong>. Cell Division is
                weakest at 28%.
              </p>
              <button
                onClick={() => router.push("/exam-mode")}
                className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-red-600 hover:bg-red-100 py-2 rounded-xl border border-red-200 transition-all"
              >
                <Zap className="w-3.5 h-3.5" /> Open Exam Mode
              </button>
            </div>

            {/* Topic mastery */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">
                Topic Mastery
              </p>
              <div className="space-y-3">
                {TASKS.map((t) => (
                  <div key={t.topic}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium text-gray-700 truncate">
                        {t.topic}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold flex-shrink-0 ml-2 ${masteryTxt(t.mastery)}`}
                      >
                        {t.mastery}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${masteryBg(t.mastery)} rounded-full`}
                        style={{ width: `${t.mastery}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <p className="text-xs font-extrabold text-indigo-800">
                  AI Insight
                </p>
              </div>
              <p className="text-[11px] text-indigo-600 leading-relaxed">
                You retain information better with active quiz practice rather
                than passive reading. Your plan includes more quiz tasks today.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* "Why this task?" engine breakdown modal */}
      <WhyTaskModal data={whyTask} onClose={() => setWhyTask(null)} />
    </AppLayout>
  );
}
