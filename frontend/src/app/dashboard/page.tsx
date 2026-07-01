"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  ArrowRight,
  Brain,
  Loader2,
  Info,
  ThumbsUp,
  ThumbsDown,
  Eye,
  X,
} from "lucide-react";
import LoadingDashboard from "./components/LoadingDashboard";
import { api, API_BASE, getToken } from "@/lib/api";

// ── Types ──
interface Summary {
  greeting: string;
  name: string;
  deadlines_this_week: number;
  high_priority_tasks: number;
}
interface FocusTask {
  title: string;
  class_name: string;
  class_id: string;
  due_date: string | null;
  days_left: number | null;
  due_display: string;
  category: string;
  weight_pct: number | null;
  current_grade: number | null;
  priority: string;
  priority_score: number;
  confidence: string;
  source: string;
  reason: string;
  recommended_study_mins: number;
}
interface PlanItem {
  class_id: string;
  class_name: string;
  mins: number;
  done: boolean;
}
interface Deadline {
  id: string;
  title: string;
  class_name: string;
  due_date: string;
  due_display: string;
  day_name: string;
  category: string;
  priority: string;
}
interface ClassGrade {
  id: string;
  name: string;
  term: string;
  grade: number | null;
}
interface WeeklyProgress {
  sessions_done: number;
  sessions_goal: number;
  pct: number;
}
interface DashboardData {
  summary: Summary;
  focusTask: FocusTask | null;
  todayPlan: PlanItem[];
  upcomingDeadlines: Deadline[];
  classGrades: ClassGrade[];
  weeklyProgress: WeeklyProgress;
  aiRecommendation: string | null;
}

// ── Helpers ──
const CLASS_COLORS = [
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
];
const CLASS_LIGHT = [
  "bg-green-100",
  "bg-blue-100",
  "bg-red-100",
  "bg-orange-100",
  "bg-pink-100",
  "bg-teal-100",
];
const CLASS_ICONS = ["🌿", "📐", "⚗️", "📝", "🎨", "💻", "📜", "📖"];

function getClassStyle(i: number) {
  return {
    color: CLASS_COLORS[i % CLASS_COLORS.length],
    light: CLASS_LIGHT[i % CLASS_LIGHT.length],
    icon: CLASS_ICONS[i % CLASS_ICONS.length],
  };
}

function getCategoryIcon(cat: string): string {
  const c = (cat || "").toLowerCase();
  if (c.includes("quiz") || c.includes("exam") || c.includes("test"))
    return "📝";
  if (c.includes("homework") || c.includes("assignment")) return "📄";
  if (c.includes("lab")) return "🧪";
  if (c.includes("essay") || c.includes("paper")) return "✍️";
  return "📄";
}

function gradeColor(grade: number | null): string {
  if (grade === null) return "text-gray-400";
  if (grade >= 90) return "text-green-600";
  if (grade >= 80) return "text-blue-600";
  if (grade >= 70) return "text-amber-600";
  return "text-red-600";
}

// ── Tooltip Component ──
function Tooltip({ lines }: { lines: string[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-400 hover:text-indigo-500 transition-colors"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xs bg-white border border-violet-300 text-violet-900 rounded-xl shadow-2xl p-3 text-xs leading-relaxed"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-6 text-black hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>

            <div className="space-y-1.5 pr-4">
              {lines.map((line, i) => (
                <p
                  key={i}
                  className={
                    line.startsWith("•")
                      ? "text-violet-700 pl-2"
                      : line.startsWith("→")
                        ? "text-black font-semibold"
                        : "text-violet-900 font-bold"
                  }
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Tooltip arrow */}
            <div className="absolute -top-1.5 left-3 w-3 h-3 bg-violet-100 rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tooltip content for each section ──
const TIPS = {
  deadlines: [
    "Deadlines This Week",
    "→ Formula:",
    "• Count of assessments from assessments table",
    "• Where due_date is between Monday and Sunday of current week",
    "→ Source: assessments table (from syllabus AI parsing)",
  ],
  highPriority: [
    "High Priority Tasks",
    "→ Formula:",
    "• Count of calendar_events where start_date is within next 7 days",
    "→ Source: calendar_events table (from ICS calendar sync)",
  ],
  focusTask: [
    "What to Study First",
    "→ Formula: SCORE = (urgency × 40%) + (impact × 35%) + (need × 25%) + bonus",
    "→ Combines 3 tables:",
    "• calendar_events.start_date → urgency (how soon)",
    "• grade_weights.weight_pct → impact (how much it's worth)",
    "• grades (score/max_score) → need (current grade)",
    "→ Bonus: +15 final/midterm, +10 exam, +5 quiz",
    "→ Picks the calendar event with the highest score",
    "→ Confidence: HIGH if all 3 sources have data, MEDIUM if 2, LOW if 1",
  ],
  todayPlan: [
    "Today's Study Plan",
    "→ Source: classes table",
    "• Shows first 4 classes (ordered by created_at)",
    "• 45 min per class (fixed)",
    "• Done ✓ = grades table has entry this week for that class",
  ],
  upcomingDeadlines: [
    "Upcoming Deadlines",
    "→ Sources: assessments table + calendar_events table",
    "• All future assessments (from syllabus parsing)",
    "• All future calendar events (from ICS sync)",
    "• Deduplicated by title (no duplicates)",
    "• Sorted by due_date ascending, limit 5",
    "→ Priority: High if title contains exam/quiz/test/final/midterm, else Medium",
  ],
  classGrades: [
    "My Classes",
    "→ Sources: classes table + grades table",
    "• Classes from classes table (ordered by created_at)",
    "• Grade = average of (score / max_score × 100) from grades table",
    "• Color: green ≥90%, blue ≥80%, amber ≥70%, red <70%",
  ],
  weeklyProgress: [
    "Weekly Progress",
    "→ Source: grades table",
    "• sessions_done = count of unique class_ids with grades entered this week",
    "• sessions_goal = max(total classes, 5)",
    "• pct = (sessions_done / sessions_goal) × 100",
  ],
  aiRecommendation: [
    "Atlas Recommendation",
    "→ Source: Claude Haiku AI",
    "• Sends class names + most urgent focusTask title to Claude",
    "• Returns a 2-sentence study recommendation",
    "• Falls back to null if AI call fails",
  ],
};

export default function DashboardHome() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studyFeedback, setStudyFeedback] = useState<
    "helpful" | "not_helpful" | null
  >(null);
  const [showFeedbackSheet, setShowFeedbackSheet] = useState(false);
  const [feedbackReason, setFeedbackReason] = useState<string | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [recExpanded, setRecExpanded] = useState(false);

  useEffect(() => {
    api<DashboardData>("/api/dashboard")
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingDashboard />;
  }

  if (error || !data) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-sm text-red-600 font-medium">
          {error || "Failed to load dashboard"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-sm text-indigo-600 font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  const summary = data.summary || {
    greeting: "Hello",
    name: "Student",
    deadlines_this_week: 0,
    high_priority_tasks: 0,
  };
  const rawFocus = data.focusTask;
  const focusTask = rawFocus && rawFocus.title ? rawFocus : null;
  const todayPlan = data.todayPlan || [];
  const upcomingDeadlines = data.upcomingDeadlines || [];
  const classGrades = data.classGrades || [];
  const weeklyProgress = data.weeklyProgress || {
    sessions_done: 0,
    sessions_goal: 5,
    pct: 0,
  };
  const aiRecommendation = data.aiRecommendation || null;
  const pctFrac = (weeklyProgress.pct || 0) / 100;

  return (
    <div className="px-4 py-4 space-y-5 pb-12">
      {/* ── Greeting ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">
            {summary.greeting}, {summary.name} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5 font-medium">
            Let&apos;s make today productive!
          </p>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/dashboard/calendar"
          className="bg-white rounded-lg border border-gray-200 shadow-sm px-2 py-1 flex items-center gap-2 hover:border-indigo-200 transition-all"
        >
          <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-base">📅</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xl font-extrabold text-gray-900">
                {summary.deadlines_this_week}
              </p>
              <Eye className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-[11px] text-gray-500">Deadlines this week</p>
          </div>
        </Link>
        <Link
          href="/dashboard/study-plan"
          className="bg-white rounded-lg border border-gray-200 shadow-sm px-2 py-1 flex items-center gap-2 hover:border-indigo-200 transition-all"
        >
          <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-base">⚡</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xl font-extrabold text-gray-900">
                {summary.high_priority_tasks}
              </p>
              <Eye className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-[11px] text-gray-500">High priority tasks</p>
          </div>
        </Link>
      </div>

      {/* ── Empty State — No Classes ── */}
      {!focusTask && classGrades.length === 0 && todayPlan.length === 0 && (
        <div className="bg-white border-2 border-dashed border-indigo-200 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📚</span>
          </div>
          <h2 className="text-lg font-extrabold text-gray-900 mb-1">
            Get Started with Atlas
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Add your first class to unlock smart study plans, grade tracking,
            and AI-powered recommendations.
          </p>
          <Link
            href="/add-class"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all text-sm"
          >
            <span className="text-lg">+</span> Add Your First Class
          </Link>
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-indigo-50 rounded-xl p-2.5 text-center">
              <span className="text-lg">📄</span>
              <p className="text-[10px] font-semibold text-gray-600 mt-1">
                Upload Syllabus
              </p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-2.5 text-center">
              <span className="text-lg">🤖</span>
              <p className="text-[10px] font-semibold text-gray-600 mt-1">
                AI Extracts Data
              </p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-2.5 text-center">
              <span className="text-lg">🎯</span>
              <p className="text-[10px] font-semibold text-gray-600 mt-1">
                Smart Study Plan
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── What to Study First ── */}
      {focusTask && (
        <div
          className="rounded-lg border border-purple-200 shadow-sm overflow-hidden bg-no-repeat relative"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/mview/image/upload/v1781853065/atlas/dashboardhomepage1.png')`,
            backgroundSize: "cover", // ← Changed to cover for proper fit
            backgroundPosition: "center", // ← Better positioning
            // Adjust height as needed
          }}
        >
          {/* Light overlay - very subtle (you can remove if you don't want any) */}

          <div className="relative z-10">
            <div className="px-4 pt-3">
              <div className="flex items-center gap-1.5 mb-2">
                <p className="text-sm font-bold text-indigo-500 ">
                  What to Study First
                </p>
                <Tooltip lines={TIPS.focusTask} />
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {getCategoryIcon(focusTask.category)}
                </div>

                <div className="flex-1 min-w-0 mb-1">
                  <div className="flex items-center gap-1 flex-wrap">
                    <p className="text-base font-extrabold text-gray-900">
                      {focusTask.title}
                    </p>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        focusTask.priority === "High"
                          ? "text-red-600 bg-red-50"
                          : focusTask.priority === "Medium"
                            ? "text-amber-600 bg-amber-50"
                            : "text-gray-600 bg-gray-100"
                      }`}
                    >
                      {focusTask.priority}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-0.5">
                    📅 {focusTask.due_display}
                    {focusTask.weight_pct
                      ? ` · Worth ${focusTask.weight_pct}%`
                      : ""}
                    {focusTask.current_grade
                      ? ` · Grade ${focusTask.current_grade}%`
                      : ""}
                  </p>

                  <p className="text-xs text-gray-600 mt-1">
                    Reason: {focusTask.reason}
                  </p>

                  {focusTask.recommended_study_mins > 0 && (
                    <p className="text-xs text-indigo-600 font-semibold mt-1">
                      ⏱ {focusTask.recommended_study_mins} min recommended
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 py-3">
              <Link
                href="/dashboard/study-plan"
                className="flex items-center justify-between w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-lg text-base transition-all shadow-md"
              >
                Start Studying <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Study Recommendation Feedback ── */}
      {focusTask && (
        <div className="flex items-center justify-center border border-gray-200 rounded-lg gap-3 py-2.5 bg-white">
          <button
            onClick={async () => {
              const newVal = studyFeedback === "helpful" ? null : "helpful";
              setStudyFeedback(newVal);
              if (newVal === "helpful") {
                try {
                  const token = getToken();
                  await fetch(
                    `${API_BASE}/api/dashboard/recommendation-feedback`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        feedback_type: "helpful",
                        focus_task_title: focusTask?.title,
                        focus_task_category: focusTask?.category,
                      }),
                    },
                  );
                } catch {}
              }
            }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              studyFeedback === "helpful"
                ? "bg-indigo-100 text-indigo-600"
                : "text-gray-500 hover:bg-gray-50"
            }`}
            style={{ transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          >
            <ThumbsUp
              className={`w-4 h-4 transition-all duration-300 ${studyFeedback === "helpful" ? "text-indigo-600" : "text-gray-400"}`}
              fill={studyFeedback === "helpful" ? "currentColor" : "none"}
              strokeWidth={studyFeedback === "helpful" ? 0 : 2}
            />
            Helpful
          </button>
          <div className="w-px h-5 bg-gray-200" />
          <button
            onClick={() => setShowFeedbackSheet(true)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              studyFeedback === "not_helpful"
                ? "bg-red-50 text-red-500"
                : "text-gray-500 hover:bg-gray-50"
            }`}
            style={{ transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          >
            <ThumbsDown
              className={`w-4 h-4 transition-all duration-300 ${studyFeedback === "not_helpful" ? "text-red-500" : "text-gray-400"}`}
              fill={studyFeedback === "not_helpful" ? "currentColor" : "none"}
              strokeWidth={studyFeedback === "not_helpful" ? 0 : 2}
            />
            Not Helpful
          </button>
        </div>
      )}

      {/* ── Not Helpful Feedback Sheet ── */}
      {showFeedbackSheet && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowFeedbackSheet(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 px-5 pt-6 pb-8 max-w-lg mx-auto"
            style={{ animation: "slideUp 0.3s ease-out" }}
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />

            {feedbackSubmitted ? (
              <div className="flex flex-col items-center py-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-1">
                  Thanks!
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  Your feedback helps Atlas improve future recommendations.
                </p>
                <button
                  onClick={() => {
                    setShowFeedbackSheet(false);
                    setFeedbackReason(null);
                    setFeedbackSubmitted(false);
                  }}
                  className="mt-5 bg-indigo-600 text-white font-bold px-8 py-2.5 rounded-xl text-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-extrabold text-gray-900 text-center mb-1">
                  Why wasn&apos;t this helpful?
                </h3>
                <p className="text-xs text-gray-500 text-center mb-5">
                  Your feedback helps Atlas improve future recommendations.
                </p>
                <div className="space-y-3 mb-5">
                  {[
                    {
                      id: "wrong",
                      title: "This is wrong",
                      desc: "The information or suggestion is incorrect.",
                    },
                    {
                      id: "missing",
                      title: "Missing context",
                      desc: "Important information was not considered.",
                    },
                    {
                      id: "studied",
                      title: "I already studied this",
                      desc: "I've already completed or planned this.",
                    },
                    { id: "other", title: "Other", desc: "Something else." },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setFeedbackReason(opt.id)}
                      className={`w-full flex items-center gap-3 text-left p-3.5 rounded-xl border transition-all ${
                        feedbackReason === opt.id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">
                          {opt.title}
                        </p>
                        <p className="text-xs text-gray-500">{opt.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          feedbackReason === opt.id
                            ? "border-indigo-600"
                            : "border-gray-300"
                        }`}
                      >
                        {feedbackReason === opt.id && (
                          <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={async () => {
                    try {
                      const token = getToken();
                      await fetch(
                        `${API_BASE}/api/dashboard/recommendation-feedback`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            feedback_type: "not_helpful",
                            reason: feedbackReason,
                            focus_task_title: focusTask?.title,
                            focus_task_category: focusTask?.category,
                          }),
                        },
                      );
                    } catch {}
                    setStudyFeedback("not_helpful");
                    setFeedbackSubmitted(true);
                  }}
                  disabled={!feedbackReason}
                  className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl text-sm disabled:opacity-40 hover:bg-indigo-700 transition-all"
                >
                  Submit Feedback
                </button>
                <button
                  onClick={() => {
                    setShowFeedbackSheet(false);
                    setFeedbackReason(null);
                  }}
                  className="w-full text-indigo-600 font-semibold py-3 text-sm mt-1"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
          <style jsx>{`
            @keyframes slideUp {
              from {
                transform: translateY(100%);
              }
              to {
                transform: translateY(0);
              }
            }
          `}</style>
        </>
      )}

      {/* ── Today's Study Plan ── */}
      {todayPlan.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center  justify-between mb-1">
            <div className="flex items-center  gap-1.5">
              <h2 className="text-base font-bold text-gray-900">
                Today&apos;s Study Plan
              </h2>
              <Tooltip lines={TIPS.todayPlan} />
            </div>
            <Link
              href="/dashboard/study-plan"
              className="text-xs text-indigo-600 font-semibold"
            >
              View all
            </Link>
          </div>
          <div className="">
            {todayPlan.map((item, i) => {
              const s = getClassStyle(i);
              return (
                <div
                  key={item.class_id}
                  className="flex items-center gap-3 py-1.5 border-b border-gray-100 last:border-b-0"
                >
                  <div
                    className={`w-8 h-8 ${s.light} rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-sm">{s.icon}</span>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.class_name}
                    </p>
                    <p className="text-xs text-gray-400">{item.mins} min</p>
                  </div>

                  {item.done ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
          <Link
            href="/dashboard/study-plan"
            className="flex items-center justify-center gap-1.5 text-sm bg-violet-100 text-violet-600 px-3 py-2 rounded-lg font-bold mt-4 hover:text-indigo-800 transition-colors w-full"
          >
            View Full Study Plan <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── Upcoming Deadlines ── */}
      {upcomingDeadlines.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-gray-900">
                Upcoming Deadlines
              </h2>
              <Tooltip lines={TIPS.upcomingDeadlines} />
            </div>
            <Link
              href="/dashboard/assignments"
              className="text-xs text-indigo-600 font-semibold"
            >
              View all
            </Link>
          </div>
          <div className="">
            {upcomingDeadlines.slice(0, 3).map((d) => (
              <div
                key={d.id}
                className="flex items-center border-b border-gray-100 gap-2 py-2"
              >
                <p className="text-xs text-gray-500 w-20 flex-shrink-0">
                  {d.due_display}
                </p>
                <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center text-[13px] flex-shrink-0">
                  {getCategoryIcon(d.category)}
                </div>
                <p className="flex-1 text-sm font-semibold text-gray-800 truncate">
                  {d.title}
                </p>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    d.priority === "High"
                      ? "text-red-600 bg-red-50"
                      : "text-amber-600 bg-amber-50"
                  }`}
                >
                  {d.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── My Classes ── */}
      {classGrades.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-gray-900">My Classes</h2>
              <Tooltip lines={TIPS.classGrades} />
            </div>
            <Link
              href="/dashboard/classes"
              className="text-xs text-indigo-600 font-semibold"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {classGrades.slice(0, 3).map((c, i) => {
              const s = getClassStyle(i);
              const grade = c.grade ?? 0;
              return (
                <div
                  key={c.id}
                  className="bg-white rounded-lg border border-gray-100 shadow-sm p-2 flex flex-col items-center text-center w-full min-w-0"
                >
                  <div className="flex items-center gap-2 w-full min-w-0">
                    <div
                      className={`w-7 h-7 ${s.color} rounded-lg flex items-center justify-center shrink-0`}
                    >
                      {s.icon}
                    </div>

                    <p className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-bold text-gray-700 text-left">
                      {c.name}
                    </p>
                  </div>
                  <p
                    className={`text-sm font-extrabold ${gradeColor(c.grade)}`}
                  >
                    {c.grade !== null ? `${c.grade}%` : "—"}
                  </p>
                  <div className="w-full h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full ${s.color} rounded-full`}
                      style={{ width: `${grade}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Weekly Progress ── */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center gap-1.5 mb-4">
          <h2 className="text-base font-bold text-gray-900">Weekly Progress</h2>
          <Tooltip lines={TIPS.weeklyProgress} />
        </div>
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="12"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 40 * pctFrac} ${2 * Math.PI * 40 * (1 - pctFrac)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base font-extrabold text-purple-700">
                {weeklyProgress.pct}%
              </span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-3xl font-extrabold text-gray-900 leading-none">
              {weeklyProgress.sessions_done}{" "}
              <span className="text-xl font-bold text-gray-400">
                / {weeklyProgress.sessions_goal}
              </span>
            </p>
            <p className="text-[13px] text-gray-500 mt-1">
              study sessions completed
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <svg viewBox="0 0 60 35" className="w-16 h-10">
              <defs>
                <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(124,58,237,0.25)" />
                  <stop offset="100%" stopColor="rgba(124,58,237,0.02)" />
                </linearGradient>
              </defs>
              <path
                d="M0,30 8,25 16,27 24,18 32,14 40,10 48,7 56,4 60,3 60,35 0,35Z"
                fill="url(#sparkFill)"
              />
              <polyline
                points="0,30 8,25 16,27 24,18 32,14 40,10 48,7 56,4 60,3"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-gray-500 font-medium">Weekly Goal</p>
            <p className="text-xs font-bold text-purple-700">
              {weeklyProgress.sessions_done} of {weeklyProgress.sessions_goal}{" "}
              sessions
            </p>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all"
              style={{ width: `${weeklyProgress.pct}%` }}
            />
          </div>
        </div>
        <div className="border-t border-gray-100 mt-3 pt-2">
          <p className="text-xs text-gray-500">
            Goal: {weeklyProgress.sessions_goal} study sessions this week
          </p>
        </div>
      </div>

      {/* ── Atlas Recommendation ── */}
      {aiRecommendation && (
        <div className="bg-violet-50 border border-indigo-100 rounded-lg p-3 flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-12 font-bold text-indigo-500 ">
                Atlas Recommendation
              </p>
              <Tooltip lines={TIPS.aiRecommendation} />
            </div>
            <p
              className={`text-sm text-gray-700 leading-relaxed ${!recExpanded ? "line-clamp-3" : ""}`}
            >
              {aiRecommendation}
            </p>
            <button
              onClick={() => setRecExpanded(!recExpanded)}
              className="text-xs font-bold text-indigo-600 mt-1 hover:text-indigo-800 transition-colors"
            >
              {recExpanded ? "Show less" : "Show more"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
