"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight, Check, GraduationCap, BookOpen,
  FlaskConical, Briefcase, Shield, HelpCircle,
  ChevronDown, Bot, BarChart2, FileText, TrendingUp,
  Target, Sliders, User, Star, Plus, X, Clock, Moon,
} from "lucide-react";

type Role = "student" | "teacher" | "researcher" | "professional" | null;

const STEPS = [
  { n: 1, label: "Welcome",           sub: "Let's get to know you",        icon: User          },
  { n: 2, label: "Academic Profile",  sub: "Tell us about your studies",   icon: GraduationCap },
  { n: 3, label: "Goals & Interests", sub: "What do you want to achieve?", icon: Target        },
  { n: 4, label: "Preferences",       sub: "Customize your experience",    icon: Sliders       },
  { n: 5, label: "Complete",          sub: "You're all set!",              icon: Check         },
];

const ROLES = [
  { id: "student"      as Role, label: "Student",      desc: "I want to learn better and improve my academic performance.", icon: GraduationCap, bg: "bg-[#EEF0FF]", iconC: "text-[#534AB7]" },
  { id: "teacher"      as Role, label: "Teacher",      desc: "I want to streamline teaching and support my students.",      icon: BookOpen,      bg: "bg-[#E8FAF2]", iconC: "text-[#059669]" },
  { id: "researcher"   as Role, label: "Researcher",   desc: "I want to accelerate my research and discover insights.",     icon: FlaskConical,  bg: "bg-[#E8F4FD]", iconC: "text-[#0284C7]" },
  { id: "professional" as Role, label: "Professional", desc: "I want to upskill and advance my career.",                    icon: Briefcase,     bg: "bg-[#FFF4E5]", iconC: "text-[#D97706]" },
];

const FEATURES = [
  { icon: Bot,        bg: "bg-[#EEF0FF]", color: "text-[#534AB7]", label: "AI-Powered Recommendations" },
  { icon: BarChart2,  bg: "bg-[#E8FAF2]", color: "text-[#059669]", label: "Smart Study Planning"       },
  { icon: FileText,   bg: "bg-[#E8F4FD]", color: "text-[#0284C7]", label: "Document Analysis"          },
  { icon: TrendingUp, bg: "bg-[#FFF4E5]", color: "text-[#D97706]", label: "Progress Tracking"          },
];

/* ── Step 1 ──────────────────────────────────────────────────── */
function Step1({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header row */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[2.6rem] font-extrabold text-[#1A1A2E] leading-tight tracking-tight mb-2">
            Welcome to ATLAS! 👋
          </h1>
          <p className="text-[#6B6A8A] text-[15px] font-light leading-relaxed max-w-[420px]">
            Your AI-powered academic companion is ready to help you learn smarter, not harder.
          </p>
        </div>

        {/* Floating cards top-right */}
        <div className="hidden lg:flex flex-col gap-2.5 flex-shrink-0">
          {[
            { icon: Star,      bg: "bg-[#EEF0FF]", ic: "text-[#534AB7]", label: "AI Study Assistant",  bars: ["w-20","w-14"] },
            { icon: BarChart2, bg: "bg-[#E8FAF2]", ic: "text-[#059669]", label: "Smart Insights",      bars: ["w-16","w-10"] },
            { icon: BarChart2, bg: "bg-[#E8F4FD]", ic: "text-[#0284C7]", label: "Personalized Plan",   bars: ["w-14","w-8","w-5"] },
          ].map((c) => (
            <div key={c.label}
              className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(83,74,183,0.10)] px-3.5 py-2.5 flex items-center gap-2.5 min-w-[196px]">
              <div className={`w-8 h-8 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                <c.icon className={`w-4 h-4 ${c.ic}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1A1A2E]">{c.label}</p>
                <div className="flex gap-1 mt-1 items-center">
                  {c.bars.map((w, i) => (
                    <div key={i} className={`h-1.5 rounded-full ${w} ${i===0?"bg-[#534AB7]":i===1?"bg-[#ABA9FA]":"bg-[#D5D3FD]"}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role picker */}
      <p className="text-[#534AB7] text-[13px] font-bold mb-1 tracking-wide">Let&apos;s get started</p>
      <p className="text-[#1A1A2E] font-bold text-[15px] mb-4">What best describes you?</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {ROLES.map((r) => (
          <button key={r.id} onClick={() => setRole(r.id)}
            className={`relative rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
              role === r.id
                ? "border-[#534AB7] bg-[#F5F4FF] shadow-lg shadow-[#534AB7]/12"
                : "border-[#E8E7F5] bg-white hover:border-[#ABA9FA] hover:shadow-md"
            }`}>
            {/* Radio */}
            <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
              role === r.id ? "border-[#534AB7]" : "border-[#C5C3E8]"
            }`}>
              {role === r.id && <div className="w-2 h-2 rounded-full bg-[#534AB7]" />}
            </div>

            <div className={`w-12 h-12 rounded-2xl ${r.bg} flex items-center justify-center mb-3`}>
              <r.icon className={`w-6 h-6 ${r.iconC}`} />
            </div>
            <p className="text-[13px] font-extrabold text-[#1A1A2E] mb-1">{r.label}</p>
            <p className="text-[11px] text-[#6B6A8A] font-light leading-relaxed">{r.desc}</p>
          </button>
        ))}
      </div>

      {/* Features strip */}
      <div className="bg-white/70 border border-[#EEEDFE] rounded-2xl p-4 mt-auto">
        <p className="text-[13px] font-bold text-[#1A1A2E] mb-3">What you&apos;ll get with ATLAS</p>
        <div className="flex flex-wrap gap-5">
          {FEATURES.map((f) => (
            <div key={f.label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl ${f.bg} flex items-center justify-center`}>
                <f.icon className={`w-4 h-4 ${f.color}`} />
              </div>
              <span className="text-[12px] font-semibold text-[#1A1A2E]">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Step 2 ──────────────────────────────────────────────────── */
function Step2() {
  return (
    <div className="flex-1">
      <h1 className="text-3xl font-extrabold text-[#1A1A2E] mb-1.5">Academic Profile</h1>
      <p className="text-[#6B6A8A] text-sm font-light mb-7">Tell us about your studies so Atlas can personalise everything for you.</p>
      <div className="space-y-4 max-w-lg">
        {[
          { l: "Institution / University",  p: "e.g. MIT, Stanford, Local Community College" },
          { l: "Field of study / Major",     p: "e.g. Computer Science, Biology, Business"   },
          { l: "Current year / Level",       p: "e.g. Sophomore, Graduate Year 2"             },
        ].map((f) => (
          <div key={f.l}>
            <label className="block text-[11px] font-bold text-[#6B6A8A] mb-1.5 uppercase tracking-wider">{f.l}</label>
            <input placeholder={f.p}
              className="w-full bg-[#FAFAFE] border border-[#D5D3FD] hover:border-[#ABA9FA] focus:border-[#534AB7] focus:bg-white text-[#1A1A2E] placeholder:text-[#C5C3E8] rounded-xl px-4 py-3 text-sm outline-none transition-all font-medium" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Step 3 ──────────────────────────────────────────────────── */
function Step3() {
  const goals = ["Improve grades","Better time management","Exam preparation","Research skills","Career preparation","Learn new skills","Build study habits","Reduce stress"];
  const [sel, setSel] = useState<string[]>([]);
  const toggle = (g: string) => setSel((p) => p.includes(g) ? p.filter((x) => x !== g) : [...p, g]);
  return (
    <div className="flex-1">
      <h1 className="text-3xl font-extrabold text-[#1A1A2E] mb-1.5">Goals & Interests</h1>
      <p className="text-[#6B6A8A] text-sm font-light mb-6">Select all that apply — Atlas builds your experience around these.</p>
      <div className="flex flex-wrap gap-2.5 max-w-xl">
        {goals.map((g) => (
          <button key={g} onClick={() => toggle(g)}
            className={`px-4 py-2.5 rounded-xl text-[13px] font-semibold border-2 transition-all ${
              sel.includes(g)
                ? "border-[#534AB7] bg-[#EEF0FF] text-[#534AB7]"
                : "border-[#E8E7F5] bg-white text-[#6B6A8A] hover:border-[#ABA9FA] hover:text-[#534AB7]"
            }`}>
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Step 4 ──────────────────────────────────────────────────── */
function Step4() {
  const [studyTime, setStudyTime] = useState("Evening");
  const [sessionLen, setSessionLen] = useState("45–60 min");
  const [events, setEvents] = useState(["🏃 Gym · Mon/Thu","🚗 Commute · 30 min"]);
  return (
    <div className="flex-1">
      <h1 className="text-3xl font-extrabold text-[#1A1A2E] mb-1.5">Preferences</h1>
      <p className="text-[#6B6A8A] text-sm font-light mb-6">Customise how Atlas fits into your day.</p>
      <div className="space-y-5 max-w-lg">
        {/* Study time */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[#534AB7]" />
            <label className="text-[13px] font-bold text-[#1A1A2E]">Preferred study time</label>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["Morning","Afternoon","Evening","Late night"].map((o) => (
              <button key={o} onClick={() => setStudyTime(o)}
                className={`px-4 py-2 rounded-xl text-[12px] font-semibold border-2 transition-all ${studyTime===o?"border-[#534AB7] bg-[#EEF0FF] text-[#534AB7]":"border-[#E8E7F5] bg-white text-[#6B6A8A] hover:border-[#ABA9FA]"}`}>
                {o}
              </button>
            ))}
          </div>
        </div>
        {/* Session length */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-[#534AB7]" />
            <label className="text-[13px] font-bold text-[#1A1A2E]">Session length</label>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["30 min","45–60 min","90 min","2+ hours"].map((o) => (
              <button key={o} onClick={() => setSessionLen(o)}
                className={`px-4 py-2 rounded-xl text-[12px] font-semibold border-2 transition-all ${sessionLen===o?"border-[#534AB7] bg-[#EEF0FF] text-[#534AB7]":"border-[#E8E7F5] bg-white text-[#6B6A8A] hover:border-[#ABA9FA]"}`}>
                {o}
              </button>
            ))}
          </div>
        </div>
        {/* Fixed events */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Moon className="w-4 h-4 text-[#534AB7]" />
            <label className="text-[13px] font-bold text-[#1A1A2E]">Fixed weekly events</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {events.map((ev) => (
              <div key={ev} className="flex items-center gap-1.5 bg-[#F5F4FF] border border-[#D5D3FD] rounded-full px-3 py-1.5 text-[12px] font-medium text-[#1A1A2E]">
                {ev}
                <button onClick={() => setEvents((p) => p.filter((e) => e !== ev))} className="text-[#C5C3E8] hover:text-red-400 ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button onClick={() => setEvents((p) => [...p, "📚 Study group"])}
              className="flex items-center gap-1 border border-dashed border-[#ABA9FA] rounded-full px-3 py-1.5 text-[12px] font-semibold text-[#534AB7] hover:bg-[#EEF0FF] transition-all">
              <Plus className="w-3 h-3" /> Add event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Step 5 ──────────────────────────────────────────────────── */
function Step5() {
  const router = useRouter();
  const [name, setName] = useState("Jordan");
  useEffect(() => {
    const n = localStorage.getItem("atlas_full_name");
    if (n) setName(n.split(" ")[0]);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#534AB7] to-[#7B6FE8] flex items-center justify-center mb-5 shadow-2xl shadow-[#534AB7]/30">
        <Check className="w-10 h-10 text-white" strokeWidth={3} />
      </div>
      <h1 className="text-3xl font-extrabold text-[#1A1A2E] mb-2">You&apos;re all set, {name}! 🎉</h1>
      <p className="text-[#6B6A8A] max-w-md font-light mb-8 leading-relaxed">
        Your personalised ATLAS workspace is ready. Your AI study companion is waiting.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 w-full max-w-xl">
        {[
          { n: "4",  l: "Classes ready"    },
          { n: "47", l: "Deadlines mapped" },
          { n: "18", l: "Topics detected"  },
          { n: "2",  l: "Exams this month" },
        ].map((s) => (
          <div key={s.l} className="bg-white rounded-2xl border border-[#EEEDFE] p-4 shadow-sm">
            <p className="text-2xl font-extrabold text-[#534AB7]">{s.n}</p>
            <p className="text-[11px] text-[#9B9AB5] mt-0.5 font-medium">{s.l}</p>
          </div>
        ))}
      </div>
      <button onClick={() => router.push("/home")}
        className="bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold px-10 py-4 rounded-2xl text-[15px] flex items-center gap-2.5 mx-auto shadow-xl shadow-[#534AB7]/25 transition-all">
        Go to my Dashboard <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>(null);
  const router = useRouter();
  const [userName, setUserName] = useState("Pooja");

  useEffect(() => {
    const n = localStorage.getItem("atlas_full_name");
    if (n) setUserName(n.split(" ")[0]);
  }, []);

  const next = () => setStep((s) => Math.min(5, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));
  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg,#F0EFFE 0%,#F8F7FF 50%,#EEF3FF 100%)" }}>

      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-[#EEEDFE] h-[60px] flex items-center px-6 justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 32 32" className="w-9 h-9">
            <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="none" stroke="#534AB7" strokeWidth="2.2"/>
            <polygon points="16,7 24,11.5 24,20.5 16,25 8,20.5 8,11.5" fill="#534AB7" opacity="0.12"/>
            <text x="16" y="21" textAnchor="middle" fontSize="11" fontWeight="800" fill="#534AB7">A</text>
          </svg>
          <div>
            <p className="text-[13px] font-extrabold text-[#1A1A2E] leading-none tracking-wide">ATLAS</p>
            <p className="text-[10px] text-[#9B9AB5] font-medium tracking-wide">Academic OS</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B6A8A] hover:text-[#534AB7] transition-colors">
            <HelpCircle className="w-4 h-4" /> Need help?
          </button>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#534AB7] to-[#7B6FE8] flex items-center justify-center text-white text-xs font-bold shadow-md">
              {userName[0]?.toUpperCase()}
            </div>
            <span className="text-[13px] font-semibold text-[#1A1A2E]">{userName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9B9AB5]" />
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-[280px] bg-white/60 backdrop-blur-xl border-r border-[#EEEDFE] flex flex-col p-5 flex-shrink-0">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-bold text-[#1A1A2E]">Onboarding Progress</span>
              <span className="text-[11px] font-semibold text-[#9B9AB5]">{step} of {STEPS.length}</span>
            </div>
            <div className="h-2 bg-[#EEEDFE] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#534AB7] to-[#7B6FE8] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-1.5 flex-1">
            {STEPS.map((s) => {
              const done   = step > s.n;
              const active = step === s.n;
              return (
                <div key={s.n}
                  onClick={() => done && setStep(s.n)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
                    active ? "bg-gradient-to-r from-[#534AB7] to-[#6B5FE8] shadow-lg shadow-[#534AB7]/20 cursor-default"
                    : done  ? "bg-[#F0EFFE] cursor-pointer hover:bg-[#E8E6FD]"
                    :         "hover:bg-white/60 cursor-default"
                  }`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    active ? "bg-white/20"
                    : done  ? "bg-[#534AB7]"
                    :         "bg-[#F0EFFE] border-2 border-[#D5D3FD]"
                  }`}>
                    {done
                      ? <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                      : <s.icon className={`w-4 h-4 ${active ? "text-white" : "text-[#9B9AB5]"}`} />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[13px] font-semibold leading-none mb-0.5 ${active ? "text-white" : "text-[#1A1A2E]"}`}>
                      {s.n}. {s.label}
                    </p>
                    <p className={`text-[11px] font-light truncate ${active ? "text-white/65" : "text-[#9B9AB5]"}`}>
                      {s.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Security badge */}
          <div className="mt-4 bg-gradient-to-br from-[#F0EFFE] to-[#E8E6FD] border border-[#D5D3FD] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-white/60 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-[#534AB7]" />
              </div>
              <span className="text-[12px] font-bold text-[#1A1A2E]">Your Data is Safe</span>
            </div>
            <p className="text-[11px] text-[#6B6A8A] font-light leading-relaxed">
              We use enterprise-grade security to protect your data and privacy.
            </p>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col p-8 overflow-y-auto">
          <div className="flex-1 flex flex-col">
            {step === 1 && <Step1 role={role} setRole={setRole} />}
            {step === 2 && <Step2 />}
            {step === 3 && <Step3 />}
            {step === 4 && <Step4 />}
            {step === 5 && <Step5 />}
          </div>

          {/* Bottom bar */}
          {step < 5 && (
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#EEEDFE]">
              {step > 1 ? (
                <button onClick={prev}
                  className="text-[13px] font-semibold text-[#6B6A8A] hover:text-[#534AB7] px-5 py-3 rounded-xl border border-[#D5D3FD] hover:border-[#534AB7] hover:bg-[#F0EFFE] transition-all">
                  ← Back
                </button>
              ) : (
                <button onClick={() => { if (confirm("Skip setup?")) router.push("/home"); }}
                  className="text-[13px] font-medium text-[#9B9AB5] hover:text-[#534AB7] transition-colors">
                  Skip setup
                </button>
              )}

              <button onClick={next} disabled={step === 1 && !role}
                className="bg-gradient-to-r from-[#534AB7] to-[#6B5FE8] hover:from-[#3C3489] hover:to-[#534AB7] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3.5 rounded-2xl text-[14px] flex items-center gap-2 shadow-xl shadow-[#534AB7]/25 transition-all">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
