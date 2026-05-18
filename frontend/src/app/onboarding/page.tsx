"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight, ArrowLeft, Check, GraduationCap,
  Upload, Clock, Calendar, Sparkles, X, Plus,
  Moon, Sun, BookOpen, Target,
} from "lucide-react";

/* ── helpers ──────────────────────────────────────────────────── */
const inputCls =
  "w-full bg-[#FAFAFE] border border-[#D5D3FD] hover:border-[#ABA9FA] focus:border-[#534AB7] focus:bg-white text-[#18172B] placeholder:text-[#C5C3E8] rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 font-medium";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STEPS = [
  { n: 1, label: "Your account"  },
  { n: 2, label: "Add classes"   },
  { n: 3, label: "Upload syllabi"},
  { n: 4, label: "Your schedule" },
  { n: 5, label: "Ready"         },
];

/* ── Step tracker ─────────────────────────────────────────────── */
function StepTrack({ current }: { current: number }) {
  return (
    <div className="bg-white border-b border-[#EEEDFE] px-6 py-0 flex items-center gap-0 h-12 overflow-x-auto">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className={`flex items-center gap-2 px-3 h-12 border-b-2 transition-all whitespace-nowrap ${
            s.n === current
              ? "border-[#534AB7]"
              : "border-transparent"
          }`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
              s.n < current
                ? "bg-[#534AB7] text-white"
                : s.n === current
                ? "bg-[#534AB7] text-white"
                : "bg-[#EEEDFE] text-[#9B9AB5]"
            }`}>
              {s.n < current ? <Check className="w-3 h-3" /> : s.n}
            </div>
            <span className={`text-xs font-semibold ${
              s.n === current ? "text-[#534AB7]" : s.n < current ? "text-[#9B9AB5]" : "text-[#C5C3E8]"
            }`}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="w-8 h-px bg-[#EEEDFE] flex-shrink-0" />
          )}
        </div>
      ))}
      <div className="ml-auto pl-4 flex-shrink-0">
        <span className="text-[11px] font-medium text-[#9B9AB5] flex items-center gap-1.5 whitespace-nowrap">
          <Clock className="w-3 h-3" /> ~2 min to finish
        </span>
      </div>
    </div>
  );
}

/* ── STEP 1 — Account info ────────────────────────────────────── */
function Step1({ onNext }: { onNext: () => void }) {
  const [name,    setName]    = useState("");
  const [sem,     setSem]     = useState("Fall 2026");
  const [gpa,     setGpa]     = useState("3.70");

  useEffect(() => {
    const n = localStorage.getItem("atlas_full_name");
    if (n) setName(n);
  }, []);

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <h2 className="text-xl font-extrabold text-[#18172B] mb-1">Welcome to Atlas</h2>
        <p className="text-sm text-[#6B6A8A] font-light mb-6">Let's confirm a few details to get you started.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#6B6A8A] mb-1.5 uppercase tracking-wide">Your name</label>
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Jordan Patel" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#6B6A8A] mb-1.5 uppercase tracking-wide">Current semester</label>
              <select className={inputCls} value={sem} onChange={(e) => setSem(e.target.value)}>
                {["Spring 2026","Summer 2026","Fall 2026","Spring 2027"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6B6A8A] mb-1.5 uppercase tracking-wide">Target GPA</label>
              <select className={inputCls} value={gpa} onChange={(e) => setGpa(e.target.value)}>
                {["4.00","3.90","3.80","3.70","3.60","3.50","3.00"].map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl p-3 mt-5">
          <Sparkles className="w-4 h-4 text-green-600 flex-shrink-0" />
          <p className="text-[11px] font-medium text-green-700">
            No ads · No data selling · FERPA compliant
          </p>
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={onNext}
            className="btn-primary text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow-md shadow-[#534AB7]/20">
            Next — add your classes <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="w-52 flex-shrink-0 hidden md:block">
        <div className="bg-[#FAFAFE] border border-[#EEEDFE] rounded-2xl p-4">
          <p className="text-[10px] font-bold text-[#9B9AB5] uppercase tracking-wide mb-3">Your semester</p>
          <div className="space-y-2.5">
            {[
              { k: "Name",     v: name || "—" },
              { k: "Semester", v: sem },
              { k: "Target GPA", v: gpa, color: true },
            ].map((r) => (
              <div key={r.k} className="flex justify-between text-xs">
                <span className="text-[#9B9AB5] font-medium">{r.k}</span>
                <span className={`font-bold ${r.color ? "text-[#534AB7]" : "text-[#18172B]"}`}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-[#9B9AB5] mt-3 font-light leading-relaxed">
          You'll add classes and syllabi in the next two steps.
        </p>
      </div>
    </div>
  );
}

/* ── STEP 2 — Add classes ─────────────────────────────────────── */
type ClassEntry = {
  id: number;
  name: string;
  professor: string;
  time: string;
  credits: string;
  days: string[];
};

function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [classes, setClasses] = useState<ClassEntry[]>([
    { id: 1, name: "", professor: "", time: "10:00 AM", credits: "3", days: [] },
  ]);
  const [active, setActive] = useState(1);

  const addCls = () => {
    const id = Date.now();
    setClasses((p) => [...p, { id, name: "", professor: "", time: "10:00 AM", credits: "3", days: [] }]);
    setActive(id);
  };

  const removeCls = (id: number) => {
    if (classes.length === 1) return;
    setClasses((p) => p.filter((c) => c.id !== id));
    setActive(classes[0].id);
  };

  const updateCls = (id: number, field: keyof ClassEntry, val: string | string[]) =>
    setClasses((p) => p.map((c) => (c.id === id ? { ...c, [field]: val } : c)));

  const toggleDay = (id: number, day: string) => {
    const cls = classes.find((c) => c.id === id)!;
    const days = cls.days.includes(day)
      ? cls.days.filter((d) => d !== day)
      : [...cls.days, day];
    updateCls(id, "days", days);
  };

  const DOTS = ["#534AB7","#1D9E75","#EF9F27","#D85A30","#A32D2D","#0F6E56"];

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <h2 className="text-xl font-extrabold text-[#18172B] mb-1">Add your classes</h2>
        <p className="text-sm text-[#6B6A8A] font-light mb-5">
          Enter each class. You'll upload syllabi in the next step — Atlas fills in the details.
        </p>

        <div className="space-y-3">
          {classes.map((cls, i) => (
            <div key={cls.id}
              className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                active === cls.id ? "border-[#534AB7] bg-[#FAFAFE]" : "border-[#EEEDFE] bg-white"
              }`}
              onClick={() => setActive(cls.id)}>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: DOTS[i % DOTS.length] }} />
                <input
                  className="flex-1 bg-transparent text-sm font-bold text-[#18172B] outline-none placeholder:text-[#C5C3E8]"
                  value={cls.name}
                  onChange={(e) => updateCls(cls.id, "name", e.target.value)}
                  placeholder="Class name (e.g. Biology 101)"
                  onClick={(e) => e.stopPropagation()}
                />
                {classes.length > 1 && (
                  <button onClick={(e) => { e.stopPropagation(); removeCls(cls.id); }}
                    className="text-[#C5C3E8] hover:text-red-400 transition-colors p-0.5">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {active === cls.id && (
                <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[#9B9AB5] mb-1 uppercase tracking-wide">Professor</label>
                      <input className={inputCls + " py-2 text-xs"} value={cls.professor}
                        onChange={(e) => updateCls(cls.id, "professor", e.target.value)}
                        placeholder="Dr. Smith" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#9B9AB5] mb-1 uppercase tracking-wide">Time</label>
                      <input className={inputCls + " py-2 text-xs"} value={cls.time}
                        onChange={(e) => updateCls(cls.id, "time", e.target.value)}
                        placeholder="10:00 AM" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#9B9AB5] mb-1 uppercase tracking-wide">Credits</label>
                      <select className={inputCls + " py-2 text-xs"} value={cls.credits}
                        onChange={(e) => updateCls(cls.id, "credits", e.target.value)}>
                        {["1","2","3","4","5","6"].map((n) => <option key={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#9B9AB5] mb-2 uppercase tracking-wide">Meeting days</label>
                    <div className="flex gap-1.5">
                      {DAYS.map((d) => (
                        <button key={d}
                          type="button"
                          onClick={() => toggleDay(cls.id, d)}
                          className={`w-9 h-8 rounded-lg text-[11px] font-bold transition-all ${
                            cls.days.includes(d)
                              ? "bg-[#534AB7] text-white"
                              : "bg-[#EEEDFE] text-[#9B9AB5] hover:bg-[#D5D3FD]"
                          }`}>
                          {d[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {active !== cls.id && (
                <p className="text-xs text-[#9B9AB5]">
                  {[cls.professor, cls.time, cls.credits && `${cls.credits} credits`].filter(Boolean).join(" · ") || "Click to edit"}
                </p>
              )}
            </div>
          ))}
        </div>

        <button onClick={addCls}
          className="w-full mt-3 flex items-center justify-center gap-2 border border-dashed border-[#ABA9FA] rounded-2xl py-3 text-sm font-semibold text-[#534AB7] hover:bg-[#EEEDFE] transition-all">
          <Plus className="w-4 h-4" /> Add another class
        </button>

        <div className="flex justify-between mt-6">
          <button onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-[#9B9AB5] hover:text-[#534AB7] transition-colors px-4 py-3 rounded-xl hover:bg-[#EEEDFE]">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button onClick={onNext}
            className="btn-primary text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow-md shadow-[#534AB7]/20">
            Next — upload syllabi <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="w-52 flex-shrink-0 hidden md:block">
        <div className="bg-[#FAFAFE] border border-[#EEEDFE] rounded-2xl p-4">
          <p className="text-[10px] font-bold text-[#9B9AB5] uppercase tracking-wide mb-3">Classes added</p>
          <div className="space-y-2">
            {classes.map((c, i) => (
              <div key={c.id} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: DOTS[i % DOTS.length] }} />
                <p className="text-xs font-semibold text-[#18172B] truncate">{c.name || "Unnamed class"}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-[#EEEDFE]">
            <p className="text-xs text-[#9B9AB5]">
              {classes.length} {classes.length === 1 ? "class" : "classes"} ·{" "}
              {classes.reduce((s, c) => s + Number(c.credits || 0), 0)} credits
            </p>
          </div>
        </div>
        <p className="text-[11px] text-[#9B9AB5] mt-3 font-light leading-relaxed">
          Upload a syllabus in step 3 and Atlas fills in professor info, deadlines, and grade weights.
        </p>
      </div>
    </div>
  );
}

/* ── STEP 3 — Upload syllabi ──────────────────────────────────── */
function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [parsed, setParsed]   = useState(false);
  const [parsing, setParsing] = useState(false);

  const simulateParse = () => {
    setParsing(true);
    setTimeout(() => { setParsing(false); setParsed(true); }, 1800);
  };

  const classes = [
    { name: "Biology 101",   color: "#534AB7", status: parsed ? "parsed" : parsing ? "parsing" : "waiting" },
    { name: "Statistics 201",color: "#1D9E75", status: "waiting" },
    { name: "English 110",   color: "#EF9F27", status: "waiting" },
    { name: "History 105",   color: "#D85A30", status: "waiting" },
  ];

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <h2 className="text-xl font-extrabold text-[#18172B] mb-1">Upload your syllabi</h2>
        <p className="text-sm text-[#6B6A8A] font-light mb-5">
          Atlas extracts deadlines, grade weights, and professor info in seconds. You can skip and upload later.
        </p>

        {/* Class list */}
        <div className="border border-[#EEEDFE] rounded-2xl overflow-hidden mb-4">
          {classes.map((cls, i) => (
            <div key={cls.name}
              className={`flex items-center gap-3 px-4 py-3.5 ${i < classes.length - 1 ? "border-b border-[#EEEDFE]" : ""} ${
                cls.status === "parsing" ? "bg-[#EEEDFE]/30" : "bg-white"
              }`}>
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cls.color }} />
              <span className="text-sm font-semibold text-[#18172B] flex-1">{cls.name}</span>
              {cls.status === "parsed" && (
                <span className="text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> Parsed
                </span>
              )}
              {cls.status === "parsing" && (
                <span className="text-[10px] font-bold bg-[#EEEDFE] text-[#534AB7] border border-[#ABA9FA]/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-2.5 h-2.5 border border-[#534AB7] border-t-transparent rounded-full animate-spin" />
                  Parsing…
                </span>
              )}
              {cls.status === "waiting" && (
                <span className="text-[10px] font-medium text-[#9B9AB5] border border-dashed border-[#C5C3E8] px-2 py-0.5 rounded-full">
                  Drop syllabus
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Parsed preview */}
        {parsed && (
          <div className="bg-[#FAFAFE] border border-[#EEEDFE] rounded-xl p-4 mb-4">
            <p className="text-[10px] font-bold text-[#9B9AB5] uppercase tracking-wide mb-2">Extracted from Biology 101</p>
            <div className="space-y-1.5">
              {[
                ["Professor",    "Dr. Sarah Smith"],
                ["Grade weights","Exams 50% · Quizzes 25% · HW 20%"],
                ["Next deadline","Quiz 4 · Nov 24"],
                ["Final exam",   "Dec 15 · 9am"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="text-[#9B9AB5]">{k}</span>
                  <span className="font-semibold text-[#18172B]">{v}</span>
                </div>
              ))}
            </div>
            <button className="text-[11px] text-[#534AB7] mt-2 font-semibold">Edit extracted data →</button>
          </div>
        )}

        {/* Drop zone */}
        <div
          onClick={simulateParse}
          className="border-2 border-dashed border-[#D5D3FD] hover:border-[#534AB7] rounded-2xl p-8 text-center cursor-pointer transition-all hover:bg-[#EEEDFE]/20 mb-5">
          <Upload className="w-6 h-6 text-[#9B9AB5] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#18172B] mb-1">Drop syllabus files here</p>
          <p className="text-xs text-[#9B9AB5]">PDF, DOCX, TXT · Atlas matches each file to the right class</p>
          <div className="flex justify-center gap-2 mt-3">
            {["PDF","DOCX","TXT"].map((t) => (
              <span key={t} className="text-[10px] font-bold bg-[#EEEDFE] text-[#534AB7] px-2 py-0.5 rounded-md">{t}</span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button onClick={onBack}
              className="flex items-center gap-2 text-sm font-semibold text-[#9B9AB5] hover:text-[#534AB7] transition-colors px-4 py-3 rounded-xl hover:bg-[#EEEDFE]">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={onNext}
              className="text-sm font-semibold text-[#9B9AB5] px-4 py-3 rounded-xl hover:bg-[#EEEDFE] hover:text-[#534AB7] transition-all">
              Skip this step
            </button>
          </div>
          <button onClick={onNext}
            className="btn-primary text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow-md shadow-[#534AB7]/20">
            Next — your schedule <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="w-52 flex-shrink-0 hidden md:block">
        <div className="bg-[#FAFAFE] border border-[#EEEDFE] rounded-2xl p-4">
          <p className="text-[10px] font-bold text-[#9B9AB5] uppercase tracking-wide mb-3">Extracted so far</p>
          <div className="space-y-2">
            {[
              { k: "Deadlines found",  v: parsed ? "14" : "0",   color: parsed },
              { k: "Grade categories", v: parsed ? "4" : "0",    color: parsed },
              { k: "Professors loaded",v: parsed ? "1" : "0",    color: parsed },
              { k: "Classes parsed",   v: parsed ? "1 / 4" : "0 / 4", color: parsed },
            ].map((r) => (
              <div key={r.k} className="flex justify-between text-xs">
                <span className="text-[#9B9AB5]">{r.k}</span>
                <span className={`font-bold ${r.color ? "text-[#534AB7]" : "text-[#C5C3E8]"}`}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mt-3">
          <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
            💡 You can skip syllabi now and upload them any time from the class workspace.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── STEP 4 — Schedule ────────────────────────────────────────── */
function Step4({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [sleepStart, setSleepStart] = useState("11:00 PM");
  const [sleepEnd,   setSleepEnd]   = useState("7:30 AM");
  const [weekday,    setWeekday]    = useState(2.5);
  const [weekend,    setWeekend]    = useState(4.0);
  const [sessionLen, setSessionLen] = useState("45–60 min");
  const [events,     setEvents]     = useState(["🏃 Gym · Mon/Thu", "🚗 Commute · 30 min"]);

  const totalWeekly = weekday * 5 + weekend * 2;

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <h2 className="text-xl font-extrabold text-[#18172B] mb-1">Tell Atlas about your day</h2>
        <p className="text-sm text-[#6B6A8A] font-light mb-5">
          Atlas builds a plan that fits your real life — not just your class schedule.
        </p>

        <div className="space-y-4">
          {/* Sleep window */}
          <div className="bg-white border border-[#EEEDFE] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Moon className="w-4 h-4 text-[#534AB7]" />
              <span className="text-sm font-bold text-[#18172B]">Sleep window</span>
            </div>
            <p className="text-xs text-[#9B9AB5] mb-3 font-light">No notifications or study blocks during this time</p>
            <div className="flex items-center gap-3">
              <input className={inputCls + " py-2 text-xs"} value={sleepStart}
                onChange={(e) => setSleepStart(e.target.value)} placeholder="11:00 PM" />
              <span className="text-sm text-[#9B9AB5] font-medium">to</span>
              <input className={inputCls + " py-2 text-xs"} value={sleepEnd}
                onChange={(e) => setSleepEnd(e.target.value)} placeholder="7:30 AM" />
            </div>
          </div>

          {/* Study hours */}
          <div className="bg-white border border-[#EEEDFE] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[#534AB7]" />
              <span className="text-sm font-bold text-[#18172B]">Daily study hours</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Weekdays", val: weekday, set: setWeekday },
                { label: "Weekends", val: weekend, set: setWeekend },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[11px] font-bold text-[#9B9AB5] mb-2 uppercase tracking-wide">{s.label}</p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => s.set(Math.max(0.5, s.val - 0.5))}
                      className="w-8 h-8 rounded-lg bg-[#EEEDFE] text-[#534AB7] font-bold text-base hover:bg-[#D5D3FD] transition-all">−</button>
                    <span className="text-lg font-bold text-[#534AB7] min-w-[2.5rem] text-center">{s.val}</span>
                    <button onClick={() => s.set(Math.min(12, s.val + 0.5))}
                      className="w-8 h-8 rounded-lg bg-[#EEEDFE] text-[#534AB7] font-bold text-base hover:bg-[#D5D3FD] transition-all">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fixed events */}
          <div className="bg-white border border-[#EEEDFE] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-[#534AB7]" />
              <span className="text-sm font-bold text-[#18172B]">Fixed weekly events</span>
            </div>
            <p className="text-xs text-[#9B9AB5] mb-3 font-light">Atlas won&apos;t schedule study sessions over these</p>
            <div className="flex flex-wrap gap-2">
              {events.map((ev) => (
                <div key={ev}
                  className="flex items-center gap-1.5 bg-[#FAFAFE] border border-[#EEEDFE] rounded-full px-3 py-1.5 text-xs font-medium text-[#18172B]">
                  {ev}
                  <button onClick={() => setEvents((p) => p.filter((e) => e !== ev))}
                    className="text-[#C5C3E8] hover:text-red-400 ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setEvents((p) => [...p, "📚 Study group"])}
                className="flex items-center gap-1 border border-dashed border-[#ABA9FA] rounded-full px-3 py-1.5 text-xs font-semibold text-[#534AB7] hover:bg-[#EEEDFE] transition-all">
                <Plus className="w-3 h-3" /> Add event
              </button>
            </div>
          </div>

          {/* Session length */}
          <div className="bg-white border border-[#EEEDFE] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-[#534AB7]" />
              <span className="text-sm font-bold text-[#18172B]">Preferred session length</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {["30 min", "45–60 min", "90 min", "2+ hours"].map((opt) => (
                <button key={opt} onClick={() => setSessionLen(opt)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    sessionLen === opt
                      ? "bg-[#534AB7] text-white shadow-md shadow-[#534AB7]/20"
                      : "bg-[#FAFAFE] border border-[#EEEDFE] text-[#6B6A8A] hover:border-[#ABA9FA]"
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-[#9B9AB5] hover:text-[#534AB7] transition-colors px-4 py-3 rounded-xl hover:bg-[#EEEDFE]">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button onClick={onNext}
            className="btn-primary text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow-md shadow-[#534AB7]/20">
            Almost done — see your plan <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="w-52 flex-shrink-0 hidden md:block">
        <div className="bg-[#FAFAFE] border border-[#EEEDFE] rounded-2xl p-4">
          <p className="text-[10px] font-bold text-[#9B9AB5] uppercase tracking-wide mb-3">Your available time</p>
          <div className="space-y-2">
            {[
              { k: "Weekdays",     v: `${weekday} hrs/day` },
              { k: "Weekends",     v: `${weekend} hrs/day` },
              { k: "Weekly total", v: `${totalWeekly.toFixed(1)} hrs`, color: true },
              { k: "Quiet hours",  v: `${sleepStart} – ${sleepEnd}` },
            ].map((r) => (
              <div key={r.k} className="flex justify-between text-xs">
                <span className="text-[#9B9AB5]">{r.k}</span>
                <span className={`font-bold ${r.color ? "text-[#534AB7]" : "text-[#18172B]"}`}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#EEEDFE] rounded-xl p-3 mt-3">
          <p className="text-[11px] text-[#534AB7] font-medium leading-relaxed">
            Atlas will never suggest studying during your sleep window or fixed events.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── STEP 5 — Ready ───────────────────────────────────────────── */
function Step5() {
  const router   = useRouter();
  const [name, setName] = useState("Jordan");

  useEffect(() => {
    const n = localStorage.getItem("atlas_full_name");
    if (n) setName(n.split(" ")[0]);
  }, []);

  return (
    <div className="text-center py-4">
      {/* Success icon */}
      <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center mx-auto mb-5">
        <Check className="w-8 h-8 text-green-600" />
      </div>

      <h2 className="text-3xl font-extrabold text-[#18172B] mb-2">
        You&apos;re all set, {name}.
      </h2>
      <p className="text-[#6B6A8A] max-w-md mx-auto font-light mb-8 leading-relaxed">
        Atlas has read your syllabi, mapped your deadlines, and built your first study plan.
        Here&apos;s what it found.
      </p>

      {/* Stats */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {[
          { n: "4",  label: "Classes set up"    },
          { n: "47", label: "Deadlines found"   },
          { n: "18", label: "Topics detected"   },
          { n: "2",  label: "Exams this month"  },
        ].map((s) => (
          <div key={s.label}
            className="bg-white border border-[#EEEDFE] rounded-2xl px-5 py-3.5 text-center"
            style={{ boxShadow: "0 2px 12px rgba(83,74,183,0.06)" }}>
            <p className="text-2xl font-extrabold text-[#534AB7]">{s.n}</p>
            <p className="text-xs font-medium text-[#9B9AB5] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Plan preview */}
      <div className="bg-white border border-[#EEEDFE] rounded-2xl p-5 max-w-sm mx-auto mb-8 text-left"
        style={{ boxShadow: "0 4px 20px rgba(83,74,183,0.08)" }}>
        <p className="text-[10px] font-bold text-[#9B9AB5] uppercase tracking-wide mb-3">
          Your first study plan — today
        </p>
        <div className="bg-[#EEEDFE] border border-[#ABA9FA]/40 rounded-xl p-3 mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-[#534AB7] uppercase tracking-widest">Biology 101</span>
            <span className="text-[10px] text-[#9B9AB5]">45 min</span>
          </div>
          <p className="text-sm font-bold text-[#18172B]">Review Mitosis</p>
          <p className="text-[11px] text-[#6B6A8A] mt-0.5">Exam Thursday · weakest topic · on review sheet</p>
        </div>
        {[
          { c: "Statistics", t: "Problem set #4", m: "40m" },
          { c: "English",    t: "Essay 2 outline", m: "20m" },
          { c: "History",    t: "Skim chapter 7",  m: "15m" },
        ].map((r, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-t border-[#EEEDFE]">
            <div className="w-5 h-5 rounded-full border border-[#D5D3FD] flex items-center justify-center text-[10px] text-[#9B9AB5] font-bold flex-shrink-0">
              {i + 2}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#18172B] truncate">{r.c} — {r.t}</p>
            </div>
            <span className="text-[10px] text-[#9B9AB5] flex-shrink-0">{r.m}</span>
          </div>
        ))}
      </div>

      {/* Go to plan */}
      <button
        onClick={() => router.push("/home")}
        className="btn-primary text-white font-bold px-10 py-4 rounded-2xl text-base flex items-center gap-2.5 mx-auto shadow-xl shadow-[#534AB7]/20">
        <BookOpen className="w-5 h-5" />
        Go to my plan
        <ArrowRight className="w-5 h-5" />
      </button>

      <p className="text-xs font-medium text-[#9B9AB5] mt-4">
        You can upload more files, add grades, and refine your schedule any time.
      </p>
    </div>
  );
}

/* ── Main onboarding page ─────────────────────────────────────── */
export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => Math.min(5, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-[#EEEDFE] px-6 h-14 flex items-center justify-between"
        style={{ boxShadow: "0 1px 8px rgba(83,74,183,0.05)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl btn-primary flex items-center justify-center shadow-md shadow-[#534AB7]/20">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-base text-[#18172B] tracking-tight">Atlas</span>
        </div>
        <button
          onClick={() => { if (confirm("Skip setup? You can complete it later.")) window.location.href = "/home"; }}
          className="text-xs font-semibold text-[#9B9AB5] hover:text-[#534AB7] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#EEEDFE]">
          Skip setup
        </button>
      </div>

      {/* Step tracker */}
      <StepTrack current={step} />

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {step === 1 && <Step1 onNext={next} />}
        {step === 2 && <Step2 onNext={next} onBack={back} />}
        {step === 3 && <Step3 onNext={next} onBack={back} />}
        {step === 4 && <Step4 onNext={next} onBack={back} />}
        {step === 5 && <Step5 />}
      </div>
    </main>
  );
}
