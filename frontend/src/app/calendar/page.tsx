"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  MapPin,
  Clock,
  Calendar,
  Bell,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

/* ─── Types ──────────────────────────────────────────────────── */
type EventType = "class" | "study" | "exam" | "deadline" | "personal";
type CalView = "month" | "week" | "day";

interface CalEvent {
  id: number;
  title: string;
  type: EventType;
  date: number;
  time?: string;
  duration?: string;
  loc?: string;
}

/* ─── Data ───────────────────────────────────────────────────── */
const EVENTS: CalEvent[] = [
  {
    id: 1,
    title: "Biology 101",
    type: "class",
    date: 19,
    time: "10:00 AM",
    duration: "1h",
    loc: "Mendel Hall 204",
  },
  {
    id: 2,
    title: "English 110",
    type: "class",
    date: 19,
    time: "11:00 AM",
    duration: "1h",
    loc: "Arts Building 505",
  },
  {
    id: 3,
    title: "Study: Mitosis",
    type: "study",
    date: 19,
    time: "2:00 PM",
    duration: "45 min",
    loc: "Biology 101",
  },
  {
    id: 4,
    title: "Gym",
    type: "personal",
    date: 19,
    time: "7:00 AM",
    duration: "1h",
    loc: "Fitness Center",
  },
  {
    id: 5,
    title: "Biology 101",
    type: "class",
    date: 20,
    time: "10:00 AM",
    duration: "1h",
    loc: "Mendel Hall 204",
  },
  {
    id: 6,
    title: "Statistics 201",
    type: "class",
    date: 20,
    time: "2:00 PM",
    duration: "1h",
    loc: "Math 301",
  },
  {
    id: 7,
    title: "History 105",
    type: "class",
    date: 20,
    time: "3:00 PM",
    duration: "1h",
    loc: "Humanities 201",
  },
  {
    id: 8,
    title: "Biology 101",
    type: "class",
    date: 21,
    time: "10:00 AM",
    duration: "1h",
    loc: "Mendel Hall 204",
  },
  {
    id: 9,
    title: "English 110",
    type: "class",
    date: 21,
    time: "11:00 AM",
    duration: "1h",
    loc: "Arts Building 505",
  },
  {
    id: 10,
    title: "Statistics 201",
    type: "class",
    date: 22,
    time: "2:00 PM",
    duration: "1h",
    loc: "Math 301",
  },
  {
    id: 11,
    title: "Stats PS#4 Due",
    type: "deadline",
    date: 22,
    time: "11:59 PM",
    duration: "",
    loc: "",
  },
  {
    id: 12,
    title: "Biology 101",
    type: "class",
    date: 23,
    time: "10:00 AM",
    duration: "1h",
    loc: "Mendel Hall 204",
  },
  {
    id: 13,
    title: "English Essay 2",
    type: "deadline",
    date: 25,
    time: "11:59 PM",
    duration: "",
    loc: "",
  },
  {
    id: 14,
    title: "Bio Exam 2",
    type: "exam",
    date: 26,
    time: "9:00 AM",
    duration: "2h",
    loc: "Exam Hall A",
  },
  {
    id: 15,
    title: "Statistics Quiz 3",
    type: "exam",
    date: 27,
    time: "2:00 PM",
    duration: "1h",
    loc: "Math 301",
  },
  {
    id: 16,
    title: "Biology Lab Report",
    type: "deadline",
    date: 30,
    time: "11:59 PM",
    duration: "",
    loc: "",
  },
];

const TYPE_STYLES: Record<
  EventType,
  { dot: string; bg: string; text: string; badge: string }
> = {
  class: {
    dot: "bg-indigo-500",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    badge: "bg-indigo-100 text-indigo-700",
  },
  study: {
    dot: "bg-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
    badge: "bg-green-100 text-green-700",
  },
  exam: {
    dot: "bg-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
    badge: "bg-red-100 text-red-700",
  },
  deadline: {
    dot: "bg-orange-500",
    bg: "bg-orange-50",
    text: "text-orange-700",
    badge: "bg-orange-100 text-orange-700",
  },
  personal: {
    dot: "bg-gray-400",
    bg: "bg-gray-50",
    text: "text-gray-600",
    badge: "bg-gray-100 text-gray-600",
  },
};

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* ─── Add Event Modal ────────────────────────────────────────── */
function AddEventModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventType>("class");
  const [date, setDate] = useState("2026-05-19");
  const [time, setTime] = useState("");
  const [loc, setLoc] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!title.trim()) return;
    setSaved(true);
    setTimeout(onClose, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className={`h-1.5 ${TYPE_STYLES[type].dot}`} />
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-extrabold text-gray-900">Add event</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title *"
              className="w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as EventType)}
              className="w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm outline-none bg-white transition-all"
            >
              {(
                [
                  "class",
                  "study",
                  "exam",
                  "deadline",
                  "personal",
                ] as EventType[]
              ).map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all"
              />
            </div>
            <input
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              placeholder="Location (optional)"
              className="w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all"
            />
          </div>
          <div className="flex gap-2.5 mt-5">
            <button
              onClick={onClose}
              className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold py-2.5 rounded-xl text-sm transition-all"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={!title.trim()}
              className={`flex-1 font-bold py-2.5 rounded-xl text-sm transition-all ${saved ? "bg-emerald-500 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40"}`}
            >
              {saved ? "✓ Added!" : "Add event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function CalendarPage() {
  const [view, setView] = useState<CalView>("month");
  const [monthOff, setMonthOff] = useState(0);
  const [selectedDay, setSelectedDay] = useState(19);
  const [showModal, setShowModal] = useState(false);

  // When the student hasn't added classes or events yet, show a friendly
  // empty state with clear calls to action instead of an empty calendar.
  const [hasEvents, setHasEvents] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("atlas_has_events") === "true") setHasEvents(true);
  }, []);

  // May 2026 starts on Friday (index 5)
  const year = 2026;
  const month = 4 + monthOff; // 0-indexed
  const actualMonth = ((month % 12) + 12) % 12;
  const actualYear = year + Math.floor(month / 12);
  const firstDay = new Date(actualYear, actualMonth, 1).getDay();
  const daysInMonth = new Date(actualYear, actualMonth + 1, 0).getDate();
  const daysInPrev = new Date(actualYear, actualMonth, 0).getDate();

  // Static mock data is only used when the student has actually added events.
  // First-time users see empty calendar cells + friendly empty-state messages.
  const events = hasEvents ? EVENTS : [];
  const todayEvs = events.filter((e) => e.date === selectedDay);
  const comingUp = hasEvents
    ? [
        {
          title: "Bio Exam 2",
          date: "May 26",
          dot: "bg-red-500",
          text: "text-red-500",
        },
        {
          title: "Stats Quiz 3",
          date: "May 27",
          dot: "bg-red-500",
          text: "text-red-500",
        },
        {
          title: "English Essay Due",
          date: "May 25",
          dot: "bg-orange-500",
          text: "text-orange-500",
        },
        {
          title: "Biology Lab Report",
          date: "May 30",
          dot: "bg-orange-500",
          text: "text-orange-500",
        },
      ]
    : [];

  // Build 6-week grid
  const cells: { day: number; curr: boolean }[] = [];
  for (let i = 0; i < firstDay; i++)
    cells.push({ day: daysInPrev - firstDay + i + 1, curr: false });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, curr: true });
  while (cells.length % 7 !== 0)
    cells.push({ day: cells.length - daysInMonth - firstDay + 1, curr: false });

  return (
    <AppLayout>
      <div className="p-4 md:p-6 min-h-screen bg-[#F5F5FB]">
        <div className="max-w-[1200px] mx-auto">
          {/* ── Header ─────────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            {/* Left — title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Calendar className="w-4.5 h-4.5 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-gray-900">
                  Calendar
                </h1>
                <p className="text-xs text-gray-400">
                  {MONTHS[actualMonth]} {actualYear}
                </p>
              </div>
            </div>

            {/* Centre — view tabs + nav */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* View tabs */}
              <div className="flex bg-white border border-gray-200 rounded-xl p-0.5 shadow-sm">
                {(["month", "week", "day"] as CalView[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                      view === v
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>

              {/* Today */}
              <button
                onClick={() => {
                  setMonthOff(0);
                  setSelectedDay(19);
                }}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-indigo-300 transition-all shadow-sm"
              >
                Today
              </button>

              {/* Prev / Next */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMonthOff((p) => p - 1)}
                  className="w-8 h-8 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:border-indigo-300 transition-all shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => setMonthOff((p) => p + 1)}
                  className="w-8 h-8 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:border-indigo-300 transition-all shadow-sm"
                >
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Add event */}
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/25"
              >
                <Plus className="w-4 h-4" /> Add event
              </button>
            </div>
          </div>

          {/* ── Legend ─────────────────────────────────────────── */}
          <div className="flex items-center gap-8 mb-4 flex-wrap">
            {Object.entries(TYPE_STYLES).map(([t, s]) => (
              <div
                key={t}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500"
              >
                <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                <span className="capitalize">{t}</span>
              </div>
            ))}
          </div>

          {/* ── Main layout ─────────────────────────────────────── */}
          <div className="flex flex-col lg:flex-row gap-4 items-start">
            {/* ── Calendar area ─────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {/* ══ MONTH VIEW ══ */}
              {view === "month" && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="grid grid-cols-7 border-b border-gray-100">
                    {DAYS.map((d) => (
                      <div
                        key={d}
                        className="py-3 text-center text-xs font-extrabold text-gray-400 uppercase tracking-widest"
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
                    {cells.map((cell, idx) => {
                      const evs = cell.curr
                        ? events.filter((e) => e.date === cell.day)
                        : [];
                      const isToday =
                        cell.curr && cell.day === 19 && monthOff === 0;
                      const isSel =
                        cell.curr && cell.day === selectedDay && monthOff === 0;
                      const showEvs = evs.slice(0, 2);
                      const more = evs.length - 2;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (cell.curr) setSelectedDay(cell.day);
                          }}
                          className={`min-h-[90px] p-2 cursor-pointer transition-all hover:bg-indigo-50/30 ${isSel && !isToday ? "bg-indigo-50/20" : ""} ${!cell.curr ? "bg-gray-50/40" : ""}`}
                        >
                          <div className="flex justify-start mb-1">
                            <span
                              className={`w-7 h-7 flex items-center justify-center text-sm font-bold rounded-full transition-all ${
                                isToday
                                  ? "bg-indigo-600 text-white shadow-sm"
                                  : cell.curr
                                    ? "text-gray-700 hover:bg-indigo-100"
                                    : "text-gray-300"
                              }`}
                            >
                              {cell.day}
                            </span>
                          </div>
                          <div className="space-y-0.5">
                            {showEvs.map((ev) => {
                              const s = TYPE_STYLES[ev.type];
                              return (
                                <div
                                  key={ev.id}
                                  className={`${s.bg} ${s.text} rounded-lg px-1.5 py-0.5 text-[10px] font-semibold truncate border border-white/50`}
                                >
                                  {ev.title}
                                </div>
                              );
                            })}
                            {more > 0 && (
                              <p className="text-[10px] text-indigo-500 font-semibold pl-1">
                                +{more} more
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ══ WEEK VIEW ══ */}
              {view === "week" && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-sm font-extrabold text-gray-900">
                      Week of May 18–24, 2026
                    </p>
                    <p className="text-xs text-gray-400">
                      Click a day to view details
                    </p>
                  </div>
                  <div className="grid grid-cols-7 divide-x divide-gray-100">
                    {[
                      "Mon 18",
                      "Tue 19",
                      "Wed 20",
                      "Thu 21",
                      "Fri 22",
                      "Sat 23",
                      "Sun 24",
                    ].map((d, i) => {
                      const dayNum = 18 + i;
                      const evs = events.filter((e) => e.date === dayNum);
                      const isToday = dayNum === 19;
                      return (
                        <div
                          key={d}
                          onClick={() => {
                            setSelectedDay(dayNum);
                            setView("day");
                          }}
                          className={`min-h-[360px] p-2.5 cursor-pointer hover:bg-indigo-50/20 transition-all ${isToday ? "bg-indigo-50/30" : ""}`}
                        >
                          {/* Day header */}
                          <div
                            className={`text-center mb-3 py-1.5 rounded-xl ${isToday ? "bg-indigo-600" : ""}`}
                          >
                            <p
                              className={`text-[10px] font-extrabold uppercase ${isToday ? "text-indigo-200" : "text-gray-400"}`}
                            >
                              {d.split(" ")[0]}
                            </p>
                            <p
                              className={`text-lg font-extrabold leading-none ${isToday ? "text-white" : "text-gray-800"}`}
                            >
                              {d.split(" ")[1]}
                            </p>
                          </div>
                          <div className="space-y-1">
                            {evs.map((ev) => {
                              const s = TYPE_STYLES[ev.type];
                              return (
                                <div
                                  key={ev.id}
                                  className={`${s.bg} ${s.text} rounded-xl px-2 py-1.5 text-[10px] font-semibold leading-tight border border-white/60`}
                                >
                                  {ev.time && (
                                    <span className="opacity-60 block text-[9px]">
                                      {ev.time}
                                    </span>
                                  )}
                                  {ev.title}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ══ DAY VIEW ══ */}
              {view === "day" && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Day nav header */}
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setSelectedDay((p) => Math.max(1, p - 1))
                        }
                        className="w-8 h-8 border border-gray-200 hover:border-indigo-300 rounded-xl flex items-center justify-center transition-all"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-500" />
                      </button>
                      <div className="text-center">
                        <p className="text-base font-extrabold text-gray-900">
                          {selectedDay === 19 ? "Today · " : ""}May{" "}
                          {selectedDay}, 2026
                        </p>
                        <p className="text-xs text-gray-400">
                          {events.filter((e) => e.date === selectedDay).length}{" "}
                          events
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setSelectedDay((p) => Math.min(31, p + 1))
                        }
                        className="w-8 h-8 border border-gray-200 hover:border-indigo-300 rounded-xl flex items-center justify-center transition-all"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add event
                    </button>
                  </div>

                  {/* Hour timeline */}
                  <div className="divide-y divide-gray-100">
                    {Array.from({ length: 15 }, (_, i) => i + 7).map((hr) => {
                      const label =
                        hr < 12
                          ? `${hr}:00 AM`
                          : hr === 12
                            ? "12:00 PM"
                            : `${hr - 12}:00 PM`;
                      const dayEvs = events.filter(
                        (e) =>
                          e.date === selectedDay &&
                          e.time?.startsWith(
                            hr < 12
                              ? `${hr}:`
                              : hr === 12
                                ? "12:"
                                : `${hr - 12}:`,
                          ),
                      );
                      return (
                        <div
                          key={hr}
                          className="flex gap-4 px-5 py-3 min-h-[52px] hover:bg-gray-50/50 transition-all"
                        >
                          <div className="w-16 flex-shrink-0 text-xs text-gray-400 font-medium pt-0.5">
                            {label}
                          </div>
                          <div className="flex-1 space-y-1">
                            {dayEvs.map((ev) => {
                              const s = TYPE_STYLES[ev.type];
                              return (
                                <div
                                  key={ev.id}
                                  className={`${s.bg} border-l-4 ${s.dot.replace("bg-", "border-")} rounded-xl px-3 py-2 flex items-center justify-between`}
                                >
                                  <div>
                                    <p
                                      className={`text-xs font-bold ${s.text}`}
                                    >
                                      {ev.title}
                                    </p>
                                    {ev.loc && (
                                      <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {ev.loc}
                                      </p>
                                    )}
                                  </div>
                                  {ev.duration && (
                                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                                      {ev.duration}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {events.filter((e) => e.date === selectedDay).length ===
                      0 && (
                      <div className="text-center py-12 text-gray-400">
                        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm font-medium">
                          No events on May {selectedDay}
                        </p>
                        <p className="text-xs mt-1">
                          Click "Add event" to create one
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── AI Study Tip banner ──────────────────────────── */}
              <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">✨</span>
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-indigo-700">
                      AI Study Tip
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      You have 3 upcoming deadlines this week. Plan your study
                      sessions to stay on track!
                    </p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 border border-indigo-200 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all whitespace-nowrap flex-shrink-0">
                  View Study Plan →
                </button>
              </div>
            </div>

            {/* ── Right sidebar ────────────────────────────────── */}
            <div className="lg:w-[240px] lg:flex-shrink-0 space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm p-2  flex items-center ">
                <img
                  src="https://res.cloudinary.com/mview/image/upload/atlas/Calendarpage.webp"
                  alt="calendar"
                  className="w-28 h-28 object-cover shrink-0"
                />

                <div>
                  <p className="text-sm text-gray-400 font-medium">May {selectedDay}</p>

                  <h3 className="text-xl font-bold text-gray-900 leading-tight ">
                    {todayEvs.length} {todayEvs.length === 1 ? "event" : "events"}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">Today’s schedule</p>
                </div>
              </div>

              {/* Today summary card */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                {/* Event list */}
                <div className="divide-y divide-gray-50">
                  {todayEvs.length === 0 ? (
                    <div className="px-4 py-3 text-center text-xs text-gray-400">
                      {" "}
                      <p className="text-xl mb-1">🎉</p>
                      <p className="text-sm font-semibold text-gray-700">
                        Nothing scheduled
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Good day to study ahead
                      </p>
                      <button
                        onClick={() => setShowModal(true)}
                        className="mt-3 flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline mx-auto"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add something
                      </button>
                    </div>
                  ) : (
                    todayEvs.map((ev) => {
                      const s = TYPE_STYLES[ev.type];
                      return (
                        <div key={ev.id} className="px-4 py-3">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.dot}`}
                              />
                              <p className="text-sm font-bold text-gray-900 truncate">
                                {ev.title}
                              </p>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${s.badge}`}
                            >
                              {ev.type.charAt(0).toUpperCase() +
                                ev.type.slice(1)}
                            </span>
                          </div>
                          {ev.loc && (
                            <div className="flex items-center gap-1 text-[11px] text-gray-400 ml-4 mt-0.5">
                              <MapPin className="w-3 h-3 flex-shrink-0" />{" "}
                              {ev.loc}
                            </div>
                          )}
                          {ev.time && (
                            <div className="flex items-center gap-1 text-[11px] text-gray-400 ml-4 mt-0.5">
                              <Clock className="w-3 h-3 flex-shrink-0" />{" "}
                              {ev.time}
                              {ev.duration ? ` - ${ev.duration}` : ""}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Coming Up */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-extrabold text-gray-900">
                    Coming Up
                  </p>
                  <button className="text-xs font-semibold text-indigo-600 hover:underline">
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {comingUp.length === 0 ? (
                    <div className="text-center py-4">
                      <div className="w-9 h-9 rounded-xl bg-[#F4F2FF] flex items-center justify-center mx-auto mb-2">
                        <Bell className="w-4 h-4 text-[#534AB7]" />
                      </div>
                      <p className="text-xs font-semibold text-gray-700">No upcoming deadlines</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Add events to track exam &amp; due dates</p>
                    </div>
                  ) : (
                    comingUp.map((cu) => (
                    <div
                      key={cu.title}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${cu.dot}`}
                        />
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {cu.title}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold flex-shrink-0 ${cu.text}`}
                      >
                        {cu.date}
                      </span>
                    </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && <AddEventModal onClose={() => setShowModal(false)} />}
    </AppLayout>
  );
}
