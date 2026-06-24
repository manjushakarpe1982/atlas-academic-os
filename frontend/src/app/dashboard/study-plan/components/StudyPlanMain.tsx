"use client";
import { ChevronRight, Flame } from "lucide-react";
import { StudyPlanData, SessionItem } from "./shared";

interface Props {
  data: StudyPlanData;
  onStartStudying: () => void;
  onSessionClick: (s: SessionItem) => void;
}

function getSessionIcon(idx: number): string {
  const icons = ["📐", "⚗️", "📚", "🧬", "💻"];
  return icons[idx % icons.length];
}
function getBarColor(idx: number): string {
  const colors = [
    "bg-indigo-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-amber-500",
    "bg-blue-500",
  ];
  return colors[idx % colors.length];
}
function getDeadlineColor(days: number | null): string {
  if (days === null) return "bg-gray-500";
  if (days <= 2) return "bg-red-500";
  if (days <= 5) return "bg-amber-500";
  return "bg-indigo-500";
}
function formatExamDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function StudyPlanMain({
  data,
  onStartStudying,
  onSessionClick,
}: Props) {
  const { firstName, focusItem, sessions, deadlines } = data;

  return (
    <div className="px-4 py-4 pb-24">
      {/* Greeting */}
      <div className="mb-5">
        <h1 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
          Good morning, {firstName} <span className="text-xl">🔥</span>
        </h1>
        <p className="text-sm text-gray-500">
          Here&apos;s your plan for this week.
        </p>
      </div>

      {/* This Week Focus Card */}
      {focusItem ? (
        <div className="bg-violet-100 border border-violet-200 rounded-lg p-5 mb-5 text-black">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-[10px] font-bold bg-violet-500 px-2 py-0.5 text-white rounded-full uppercase tracking-wide">
              This Week Focus
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 bg-violet-300 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-base font-extrabold">{focusItem.className}</p>
              <p className="text-xs text-violet-600">
                {focusItem.topic || focusItem.examTitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white rounded-xl p-2.5 text-center">
              <p className="text-xs text-violet-600">Current Grade</p>
              <p className="text-lg font-extrabold">
                {focusItem.currentGrade !== null
                  ? `${focusItem.currentGrade}%`
                  : "—"}
              </p>
            </div>
            <div className="bg-white rounded-xl p-2.5 text-center">
              <p className="text-xs text-violet-600">Next Exam</p>
              <p className="text-sm font-extrabold">
                {formatExamDate(focusItem.examDate)}
              </p>
              <p className="text-[9px] text-orange-300 font-bold">
                {focusItem.daysLeft} days left
              </p>
            </div>
            <div className="bg-white rounded-xl p-2.5 text-center">
              <p className="text-xs text-violet-600">Impact</p>
              <p className="text-lg font-extrabold text-green-300">
                +{focusItem.potentialImpact}pts
              </p>
            </div>
          </div>

          <button
            onClick={onStartStudying}
            className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-all text-sm flex items-center justify-center gap-2"
          >
            Start Studying <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-5 text-center">
          <p className="text-sm font-bold text-indigo-800">
            No upcoming focus item
          </p>
          <p className="text-xs text-indigo-600 mt-1">
            Add classes and sync your calendar to get study recommendations
          </p>
        </div>
      )}

      {/* Recommended Sessions */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">
            Recommended Sessions
          </h2>
          {sessions.length > 0 && (
            <button className="text-xs text-indigo-600 font-semibold flex items-center gap-0.5">
              See All <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
        {sessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <p className="text-sm text-gray-500 font-medium">
              No recommended sessions yet
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Add classes and topics to get personalized study recommendations
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s, i) => (
              <div
                key={s.topicId}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex"
              >
                <div className={`w-1 ${getBarColor(i)} flex-shrink-0`} />
                <div className="flex-1 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    {getSessionIcon(i)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-extrabold text-gray-900 truncate">
                        {s.title}
                      </p>
                      {s.isHighImpact && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-red-600 bg-red-50 flex-shrink-0">
                          HIGH IMPACT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {s.className}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-gray-400">
                        {s.completed}/{s.total} materials
                      </span>
                      {s.urgencyText && (
                        <span
                          className={`text-[10px] font-semibold ${s.isHighImpact ? "text-red-500" : "text-amber-500"}`}
                        >
                          {s.urgencyText}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onSessionClick(s)}
                    className="text-xs font-bold text-indigo-600 border border-indigo-200 px-4 py-1.5 rounded-lg hover:bg-indigo-50 transition-all flex-shrink-0"
                  >
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Deadlines */}
      {deadlines.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-extrabold text-gray-900">
              Upcoming Deadlines
            </h2>
            <button className="text-xs text-indigo-600 font-semibold flex items-center gap-0.5">
              See All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {deadlines.map((d, i) => (
              <div key={i}>
                <div className="p-3 flex items-center gap-3">
                  <div
                    className={`w-10 h-12 ${getDeadlineColor(
                      d.days_left,
                    )} rounded-lg flex flex-col items-center justify-center shrink-0`}
                  >
                    <span className="text-[9px] font-bold text-white/80 leading-none">
                      {d.month}
                    </span>
                    <span className="text-lg font-extrabold text-white leading-none mt-0.5">
                      {d.day}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {d.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {d.className}
                      {d.due_date ? ` • ${d.due_date}` : ""}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${
                      d.days_left !== null && d.days_left <= 2
                        ? "text-red-600 bg-red-50"
                        : d.days_left !== null && d.days_left <= 5
                          ? "text-amber-600 bg-amber-50"
                          : "text-blue-600 bg-blue-50"
                    }`}
                  >
                    {d.days_left !== null ? `${d.days_left}d left` : "No date"}
                  </span>
                </div>

                {/* Divider */}
                {i !== deadlines.length - 1 && (
                  <div className="mx-4 border-b border-gray-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
