"use client";
import { useState, useEffect } from "react";
import {
  ChevronRight,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  SlidersHorizontal,
  Brain,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { api } from "@/lib/api";

interface Assignment {
  id: string;
  title: string;
  category: string;
  due_date: string;
  days_left: number | null;
  weight: number;
  priority: string;
  action: string;
  due_text: string;
  completed: boolean;
}
interface Stats {
  upcoming: number;
  overdue: number;
  completed: number;
  due_this_week: number;
}
interface AssignmentsData {
  assignments: Assignment[];
  stats: Stats;
  insight: string | null;
}

const STAT_CONFIG = [
  {
    key: "upcoming",
    label: "Upcoming",
    icon: Calendar,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  {
    key: "overdue",
    label: "Overdue",
    icon: AlertCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
  },
  {
    key: "due_this_week",
    label: "Due This Week",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
];

const FILTERS = ["All", "Assignment", "Quiz", "Exam", "Lab"];

function getCatIcon(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes("quiz")) return "❓";
  if (c.includes("exam") || c.includes("midterm") || c.includes("final"))
    return "📋";
  if (c.includes("lab")) return "🧪";
  if (c.includes("project")) return "📊";
  return "📝";
}
function getCatBg(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes("quiz")) return "bg-amber-50";
  if (c.includes("exam") || c.includes("midterm") || c.includes("final"))
    return "bg-red-50";
  if (c.includes("lab")) return "bg-blue-50";
  if (c.includes("project")) return "bg-purple-50";
  return "bg-green-50";
}
function getCatBadge(cat: string): { text: string; color: string } {
  const c = cat.toLowerCase();
  if (c.includes("quiz"))
    return { text: "Quiz", color: "text-amber-700 bg-amber-100" };
  if (c.includes("exam") || c.includes("midterm") || c.includes("final"))
    return { text: "Exam", color: "text-red-700 bg-red-100" };
  if (c.includes("lab"))
    return { text: "Lab", color: "text-blue-700 bg-blue-100" };
  if (c.includes("project"))
    return { text: "Project", color: "text-purple-700 bg-purple-100" };
  return { text: "Assignment", color: "text-green-700 bg-green-100" };
}
function getBarColor(p: string): string {
  if (p === "HIGH") return "bg-red-500";
  if (p === "MEDIUM") return "bg-amber-500";
  if (p === "LOW") return "bg-indigo-400";
  if (p === "OVERDUE") return "bg-red-600";
  return "bg-green-500";
}
function getPriorityBadge(p: string): { text: string; style: string } {
  if (p === "HIGH")
    return { text: "HIGH", style: "text-red-700 bg-red-100 border-red-200" };
  if (p === "MEDIUM")
    return {
      text: "MEDIUM",
      style: "text-amber-700 bg-amber-100 border-amber-200",
    };
  if (p === "LOW")
    return {
      text: "LOW",
      style: "text-indigo-600 bg-indigo-50 border-indigo-200",
    };
  if (p === "OVERDUE")
    return { text: "OVERDUE", style: "text-red-700 bg-red-100 border-red-200" };
  return {
    text: "DONE",
    style: "text-green-700 bg-green-100 border-green-200",
  };
}
function getActionStyle(p: string): string {
  if (p === "HIGH" || p === "OVERDUE")
    return "text-red-600 border-red-200 hover:bg-red-50";
  if (p === "MEDIUM")
    return "text-amber-600 border-amber-200 hover:bg-amber-50";
  if (p === "COMPLETED") return "text-green-600 border-green-200 bg-green-50";
  return "text-indigo-600 border-indigo-200 hover:bg-indigo-50";
}
function formatDueText(a: Assignment): string {
  if (a.completed) return "Completed";
  if (a.days_left === null || a.days_left === undefined) return "No due date";
  if (a.days_left === 0) return "Due today";
  if (a.days_left === 1) return "Due tomorrow";
  if (a.days_left > 0) return `Due in ${a.days_left} days`;
  return `Overdue by ${Math.abs(a.days_left)} days`;
}
function formatShortDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function AssignmentsTab({ classId }: { classId: string }) {
  const [data, setData] = useState<AssignmentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"due" | "priority">("due");

  useEffect(() => {
    if (!classId) return;
    api<AssignmentsData>(`/api/classes/${classId}/assignments`)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-3 animate-pulse"
            >
              <div className="w-7 h-7 bg-gray-100 rounded-lg mx-auto mb-1" />
              <div className="h-5 w-8 bg-gray-100 rounded mx-auto mb-1" />
              <div className="h-2 w-12 bg-gray-100 rounded mx-auto" />
            </div>
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse flex gap-3"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-gray-100 rounded" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.assignments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500 font-medium">
          No assignments found
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Assignments appear when you upload a syllabus
        </p>
      </div>
    );
  }

  const { assignments, stats, insight } = data;

  // Filter
  const filtered =
    filter === "All"
      ? assignments
      : assignments.filter((a) => {
          const c = a.category.toLowerCase();
          const f = filter.toLowerCase();
          if (f === "exam")
            return (
              c.includes("exam") || c.includes("midterm") || c.includes("final")
            );
          return c.includes(f);
        });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "priority") {
      const order = { OVERDUE: 0, HIGH: 1, MEDIUM: 2, LOW: 3, COMPLETED: 4 };
      return (
        (order[a.priority as keyof typeof order] ?? 5) -
        (order[b.priority as keyof typeof order] ?? 5)
      );
    }
    return (a.days_left ?? 9999) - (b.days_left ?? 9999);
  });

  return (
    <div className="space-y-5">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        {STAT_CONFIG.map((s) => {
          const val = stats[s.key as keyof Stats];
          return (
            <div
              key={s.key}
              className={`${s.bg} border ${s.border} rounded-lg p-2 flex flex-col items-center text-center`}
            >
              {/* Icon + Value on same line */}
              <div className="flex items-center gap-2 mb-1">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <p className="text-lg font-extrabold text-gray-900 leading-tight">
                  {val}
                </p>
              </div>

              <p className="text-[11px] text-gray-500 font-semibold leading-tight">
                {s.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filter Pills + Sort */}
      <div className="flex items-center gap-1.5">
        <div
          className="flex-1 flex gap-1.5 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-3 py-1 rounded-lg text-[13px] font-bold transition-all ${
                filter === f
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-500 border border-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSortBy(sortBy === "due" ? "priority" : "due")}
          className="flex-shrink-0 w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-gray-900">
          {filter === "All" ? "All" : filter} ({sorted.length})
        </h2>
        <button
          onClick={() => setSortBy(sortBy === "due" ? "priority" : "due")}
          className="text-[11px] text-gray-500 font-medium flex items-center gap-0.5"
        >
          Sort by:{" "}
          <span className="text-indigo-600 font-bold">
            {sortBy === "due" ? "Due Date" : "Priority"}
          </span>
          <ChevronDown className="w-3 h-3 text-indigo-600" />
        </button>
      </div>

      {/* Assignment Cards */}
      {sorted.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-8">
          No {filter.toLowerCase()} assignments
        </p>
      ) : (
        <div className="space-y-2.5">
          {sorted.map((a) => {
            const badge = getCatBadge(a.category);
            const priority = getPriorityBadge(a.priority);
            const dueText = formatDueText(a);
            const shortDate = formatShortDate(a.due_date);
            const isUrgent = a.priority === "HIGH" || a.priority === "OVERDUE";

            return (
              <div
                key={a.id}
                className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex"
              >
                <div
                  className={`w-1 ${getBarColor(a.priority)} flex-shrink-0`}
                />
                <div className="flex-1 px-4 py-3.5">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 ${getCatBg(a.category)} rounded-xl flex items-center justify-center text-lg flex-shrink-0 mt-0.5`}
                    >
                      {getCatIcon(a.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-extrabold text-gray-900 leading-snug">
                        {a.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}
                        >
                          {badge.text}
                        </span>
                        {a.weight > 0 && (
                          <span className="text-[10px] text-gray-400">
                            • Worth {a.weight}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Calendar
                          className={`w-3 h-3 ${isUrgent ? "text-red-400" : "text-gray-400"}`}
                        />
                        <p
                          className={`text-[11px] ${isUrgent ? "text-red-500 font-semibold" : "text-gray-400"}`}
                        >
                          {dueText}
                          {shortDate ? ` • ${shortDate}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Right: Priority + Arrow */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${priority.style}`}
                        >
                          {priority.text}
                        </span>
                      
                      </div>
                      <button
                        className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition-all ${getActionStyle(a.priority)}`}
                      >
                        {a.action}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Atlas Tip */}
      {insight && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-extrabold text-gray-900">Atlas Tip</p>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
              {insight}
            </p>
          </div>
         
        </div>
      )}
    </div>
  );
}
