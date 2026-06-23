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
  X,
} from "lucide-react";
import LoadingDashboard from "./components/LoadingDashboard";
import { api } from "@/lib/api";

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
        className="text-gray-300 hover:text-indigo-500 transition-colors"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xs bg-gray-900 text-white rounded-xl shadow-2xl p-3 text-xs leading-relaxed"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-6 text-gray-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>

            <div className="space-y-1.5 pr-4">
              {lines.map((line, i) => (
                <p
                  key={i}
                  className={
                    line.startsWith("•")
                      ? "text-gray-300 pl-2"
                      : line.startsWith("→")
                        ? "text-indigo-300 font-semibold"
                        : "text-white font-bold"
                  }
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Tooltip arrow */}
            <div className="absolute -top-1.5 left-3 w-3 h-3 bg-gray-900 rotate-45" />
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
    <div className="px-4 py-4 space-y-5 pb-24">
      {/* ── Greeting ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">
            {summary.greeting}, {summary.name} 👋
          </h1>
          <p className="text-sm text-green-500 mt-0.5 font-medium">
            Let&apos;s make today productive!
          </p>
        </div>
        <div className="w-10 h-10 flex items-center justify-center">
          <span className="text-3xl">🏆</span>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-lg">📅</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xl font-extrabold text-gray-900">
                {summary.deadlines_this_week}
              </p>
              <Tooltip lines={TIPS.deadlines} />
            </div>
            <p className="text-xs text-gray-400 leading-tight">
              Deadlines this week
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-lg">⚡</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xl font-extrabold text-gray-900">
                {summary.high_priority_tasks}
              </p>
              <Tooltip lines={TIPS.highPriority} />
            </div>
            <p className="text-xs text-gray-400 leading-tight">
              High priority tasks
            </p>
          </div>
        </div>
      </div>

      {/* ── What to Study First ── */}
      {focusTask && (
        <div
          className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://res.cloudinary.com/mview/image/upload/v1781853065/atlas/dashboardhomepage1.png)",
            backgroundPosition: "right -10px top -10px",
            backgroundSize: "140px",
          }}
        >
          <div className="bg-gradient-to-r from-white via-white/90 to-transparent">
            <div className="px-4 pt-3 pb-1">
              <div className="flex items-center gap-1.5 mb-2">
                <p className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">
                  What to Study First
                </p>
                <Tooltip lines={TIPS.focusTask} />
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                  {getCategoryIcon(focusTask.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-base font-extrabold text-gray-900">
                      {focusTask.title}
                    </p>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
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
                className="flex items-center justify-between w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-2xl text-sm transition-all shadow-md"
              >
                Start Studying <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Today's Study Plan ── */}
      {todayPlan.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-extrabold text-gray-900">
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
          <div className="space-y-3">
            {todayPlan.map((item, i) => {
              const s = getClassStyle(i);
              return (
                <div key={item.class_id} className="flex items-center gap-3">
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
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 mt-4 hover:text-indigo-800 transition-colors"
          >
            View Full Study Plan <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── Upcoming Deadlines ── */}
      {upcomingDeadlines.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-extrabold text-gray-900">
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
          <div className="space-y-2">
            {upcomingDeadlines.slice(0, 3).map((d) => (
              <div key={d.id} className="flex items-center gap-3 py-1.5">
                <p className="text-xs text-gray-400 w-20 flex-shrink-0">
                  {d.due_display}
                </p>
                <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                  {getCategoryIcon(d.category)}
                </div>
                <p className="flex-1 text-sm font-semibold text-gray-800 truncate">
                  {d.title}
                </p>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-extrabold text-gray-900">
                My Classes
              </h2>
              <Tooltip lines={TIPS.classGrades} />
            </div>
            <Link
              href="/dashboard/classes"
              className="text-xs text-indigo-600 font-semibold"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {classGrades.slice(0, 4).map((c, i) => {
              const s = getClassStyle(i);
              const grade = c.grade ?? 0;
              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-col items-center text-center"
                >
                  <div
                    className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center text-base mb-1.5`}
                  >
                    {s.icon}
                  </div>
                  <p className="text-[9px] font-bold text-gray-700 leading-tight mb-1 truncate w-full">
                    {c.name}
                  </p>
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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-1.5 mb-4">
          <h2 className="text-base font-extrabold text-gray-900">
            Weekly Progress
          </h2>
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
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="10"
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
            <p className="text-sm text-gray-500 mt-1">
              study sessions
              <br />
              completed
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
            <ChevronRight className="w-5 h-5 text-gray-300" />
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
        <div className="border-t border-gray-100 mt-4 pt-3">
          <p className="text-xs text-gray-400">
            Goal: {weeklyProgress.sessions_goal} study sessions this week
          </p>
        </div>
      </div>

      {/* ── Atlas Recommendation ── */}
      {aiRecommendation && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">
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
