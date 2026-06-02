"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { PageSkeleton } from "@/components/Skeleton";
import Tooltip from "@/components/Tooltip";
import {
  Play,
  SkipForward,
  Info,
  ChevronRight,
  ChevronDown,
  Clock,
  Brain,
  Search,
  TrendingUp,
  Upload,
  Sparkles,
  ArrowRight,
  Activity,
  Zap,
  Target,
  AlertTriangle,
  X,
  MoreVertical,
  Calendar,
  BookOpen,
  Shield,
  Check,
  Star,
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────────────── */
const TODAY_TASKS = [
  {
    id: 1,
    class: "Biology 101",
    classColor: "bg-indigo-100 text-indigo-700",
    classDot: "bg-indigo-500",
    topic: "Study Cell Division — Mitosis",
    duration: 45,
    priority: "High",
    priorityColor: "text-red-500 bg-red-50",
    reason:
      "Bio Midterm in 3 days · Weakest topic (28%) · High syllabus weight (24%)",
  },
  {
    id: 2,
    class: "Biology 101",
    classColor: "bg-indigo-100 text-indigo-700",
    classDot: "bg-green-500",
    topic: "DNA Replication",
    duration: 40,
    priority: "High",
    priorityColor: "text-red-500 bg-red-50",
    reason: "Mentioned 5× in lectures · Likely exam question",
  },
  {
    id: 3,
    class: "Stats 201",
    classColor: "bg-orange-100 text-orange-700",
    classDot: "bg-orange-500",
    topic: "Problem Set #4",
    duration: 40,
    priority: "Medium",
    priorityColor: "text-orange-500 bg-orange-50",
    reason: "Due Friday — 2 days away",
  },
  {
    id: 4,
    class: "English 110",
    classColor: "bg-blue-100 text-blue-700",
    classDot: "bg-blue-500",
    topic: "Essay 2 — Outline",
    duration: 20,
    priority: "Medium",
    priorityColor: "text-orange-500 bg-orange-50",
    reason: "Due Monday — start now",
  },
];

const UPCOMING = [
  {
    name: "Biology Midterm",
    sub: "BIO 101 · Exam",
    days: 3,
    dot: "bg-red-500",
    daysColor: "text-red-500",
    rowBg: "bg-red-50",
  },
  {
    name: "Statistics Quiz 3",
    sub: "STAT 201 · Quiz",
    days: 4,
    dot: "bg-orange-400",
    daysColor: "text-orange-500",
    rowBg: "bg-orange-50",
  },
  {
    name: "Biology Lab Report",
    sub: "BIO 101 · Deadline",
    days: 0,
    dot: "bg-violet-500",
    daysColor: "text-violet-600",
    rowBg: "bg-violet-50",
  },
  {
    name: "Statistics PS #4",
    sub: "STAT 201 · Deadline",
    days: 2,
    dot: "bg-amber-400",
    daysColor: "text-amber-600",
    rowBg: "bg-amber-50",
  },
];

const WEAK_TOPICS = [
  { name: "Cell Division (Mitosis)", pct: 28, color: "bg-red-500" },
  { name: "DNA Replication", pct: 35, color: "bg-orange-500" },
  { name: "Enzyme Kinetics", pct: 44, color: "bg-amber-400" },
  { name: "Cellular Respiration", pct: 65, color: "bg-green-500" },
];

const STUDY_PROGRESS = [
  { day: "M", hrs: 1.5 },
  { day: "T", hrs: 2.0 },
  { day: "W", hrs: 0.5 },
  { day: "T", hrs: 2.5 },
  { day: "F", hrs: 1.0 },
  { day: "S", hrs: 3.0 },
  { day: "S", hrs: 2.0 },
];

/* ─── Mini bar chart ─────────────────────────────────────────── */
function MiniBarChart() {
  const max = Math.max(...STUDY_PROGRESS.map((d) => d.hrs));
  return (
    <div className="flex items-end gap-1 h-10">
      {STUDY_PROGRESS.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div
            className={`w-full rounded-md transition-colors ${i === 5 ? "bg-indigo-600" : "bg-indigo-200"}`}
            style={{ height: `${(d.hrs / max) * 36}px` }}
          />
          <span className="text-[9px] text-gray-400">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState(TODAY_TASKS);
  const [userName, setUserName] = useState("Ananya");
  const [showEngine, setShowEngine] = useState(false);
  const [tipDismiss, setTipDismiss] = useState(false);
  const [search, setSearch] = useState("");
  // Two-flag check decides which dashboard state to render:
  //   1. onboardingDone = false → user just logged in, hasn't gone through onboarding
  //   2. onboardingDone = true  but hasMaterials = false → onboarded, no uploads yet
  //   3. onboardingDone = true  and hasMaterials = true  → full personalised dashboard
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [hasMaterials, setHasMaterials] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const n = localStorage.getItem("atlas_full_name");
    if (n) setUserName(n.split(" ")[0]);
    if (localStorage.getItem("atlas_onboarding_completed") === "true")
      setOnboardingDone(true);
    if (localStorage.getItem("atlas_has_materials") === "true")
      setHasMaterials(true);
  }, []);

  const skipTask = (id: number) =>
    setTasks((p) => {
      const i = p.findIndex((t) => t.id === id);
      if (i < 0) return p;
      const a = [...p];
      const [t] = a.splice(i, 1);
      a.push(t);
      return a;
    });
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const heroTask = tasks[0];
  const otherTasks = tasks.slice(1);
  const doneMins = 65;
  const goalMins = 150;
  const gPct = Math.round((doneMins / goalMins) * 100);
  const r = 34;
  const circ = 2 * Math.PI * r;

  const engineScores = [
    {
      label: "Mastery",
      value: 28,
      color: "bg-red-500",
      icon: "🧠",
      desc: "Your current knowledge",
    },
    {
      label: "Emphasis",
      value: 95,
      color: "bg-indigo-500",
      icon: "📢",
      desc: "Professor weight",
    },
    {
      label: "Proximity",
      value: 88,
      color: "bg-amber-500",
      icon: "⏱",
      desc: "Days until exam",
    },
  ];

  if (loading) return <PageSkeleton />;

  /* ─────────────────────────────────────────────────────────────
   * STATE 1 — User just logged in but hasn't gone through (or
   * finished) onboarding. Without their goals/preferences nothing
   * else can be personalised, so the dashboard nudges them to
   * complete onboarding first.
   * ───────────────────────────────────────────────────────────── */
  if (!onboardingDone) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#F5F5FB] p-4 md:p-6">
          <div className="max-w-[1100px] mx-auto">
            {/* Greeting */}
            <div className="mb-4">
              <p className="text-[15px] text-[#6B6A8A] ">{greeting},</p>
              <h1 className="text-3xl md:text-[36px] font-extrabold text-[#14142B] leading-tight">
                Welcome back, {userName} 👋
              </h1>
              <p className="text-[15px] text-[#6B6A8A] mt-1.5 max-w-xl leading-relaxed">
                You&apos;re almost there. Finish a quick setup so Atlas can
                personalise your study plan, grades, and recommendations.
              </p>
            </div>

            {/* ── Hero — Let's personalise Atlas ───────────────── */}
            <div className="relative overflow-hidden rounded-xl mb-6 shadow-xl shadow-[#534AB7]/20 min-h-[280px] md:min-h-[300px]">
              {/* Full-width background image */}
              <img
                src="https://res.cloudinary.com/mview/image/upload/atlas/onboardingpage6.webp"
                alt="Personalise Atlas illustration"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Decorative sparkles */}
              <Sparkles className="absolute top-8 right-12 w-4 h-4 text-white/40 z-10" />
              <Sparkles className="absolute bottom-10 left-1/2 w-3 h-3 text-white/30 z-10" />
              <Sparkles className="absolute top-14 left-1/3 w-3 h-3 text-white/25 z-10" />

              {/* Foreground content overlapping the image */}
              <div className="relative z-10 p-7 md:p-9 max-w-xl min-h-[240px] md:min-h-[250px] flex flex-col justify-center">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 backdrop-blur text-white text-[11px] font-bold px-3 py-1.5 mb-3">
                  <Sparkles className="w-3 h-3" /> 5 quick steps · 2 min
                </span>
                <h2 className="text-2xl md:text-[30px] font-extrabold text-white mb-2 leading-tight drop-shadow">
                  Let&apos;s personalise Atlas for you
                </h2>
                <p className="text-[13px] text-white/90 leading-relaxed max-w-md mb-5">
                  Tell us your role, goals, and study preferences so Atlas can
                  build a plan that actually fits your day.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/upload"
                    className="inline-flex items-center gap-2 bg-white hover:bg-[#F4F2FF] text-[#534AB7] px-5 py-2.5 rounded-xl font-extrabold text-sm shadow-lg transition-all active:scale-95"
                  >
                    <Upload className="w-4 h-4" /> Upload syllabus
                  </Link>
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center gap-2  hover:bg-white/25 backdrop-blur border border-white text-white px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" /> Start setup{" "}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ── What you'll set up — 3 cards with illustrations ─ */}
            <p className="text-[15px] font-extrabold text-black uppercase tracking-widest mb-3">
              What you&apos;ll set up
            </p>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 gap-4 mb-6">
              {[
                {
                  icon: BookOpen,
                  color: "bg-[#534AB7]",
                  title: "Your academic profile",
                  desc: "Add your institution, field of study, and year level.",
                  img: "https://res.cloudinary.com/mview/image/upload/atlas/dashboardpage7.webp",
                },
                {
                  icon: Target,
                  color: "bg-emerald-500",
                  title: "Your goals",
                  desc: "Pick what matters — grades, exams, or skills.",
                  img: "https://res.cloudinary.com/mview/image/upload/atlas/dashboardpage8.webp",
                },
                {
                  icon: Calendar,
                  color: "bg-orange-500",
                  title: "Your study preferences",
                  desc: "Tell us when you study best and how long sessions run.",
                  img: "https://res.cloudinary.com/mview/image/upload/atlas/dashboardpage9.webp",
                },
              ].map((c) => (
                <Link
                  key={c.title}
                  href="/onboarding"
                  className="group relative overflow-hidden bg-white border border-[#ECE9FF] rounded-2xl shadow-sm hover:shadow-lg hover:border-[#534AB7]/40 transition-all"
                >
                  <div className="flex items-stretch">
                    {/* Left — text */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-row md:flex-col gap-2">
                        {" "}
                        {/* Icon + Text in row */}
                        {/* Icon */}
                        <div
                          className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center flex-shrink-0 shadow-md mt-1`}
                        >
                          <c.icon className="w-5 h-5 text-white" />
                        </div>
                        {/* Text Content */}
                        <div className="flex-1 flex flex-col">
  <p className="text-base font-extrabold text-[#1A1A2E] mb-1 leading-tight">
    {c.title}
  </p>
  
  <p className="text-[14px] text-[#6B6A8A] leading-relaxed mb-2 flex-1">
    {c.desc}
  </p>

  {/* Arrow - Pushed to the End (Right) */}
  <div className="flex justify-end md:justify-start">
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F4F2FF] text-[#534AB7] group-hover:bg-[#534AB7] group-hover:text-white transition-colors">
      <ArrowRight className="w-3.5 h-3.5" />
    </span>
  </div>
</div>
                      </div>
                    </div>
                    {/* Right — illustration */}
                    <div className="hidden sm:flex w-[110px] flex-shrink-0 items-end justify-center  pb-3">
                      <img
                        src={c.img}
                        alt={c.title}
                        className="w-full h-auto max-h-[120px] object-contain"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* ── Reassurance band 1 — full-width image + overlay ─ */}
            <div className="relative overflow-hidden border border-[#ccc5f8] rounded-2xl mb-3 min-h-[88px]">
              {/* Full-width background image */}
              <img
                src="https://res.cloudinary.com/mview/image/upload/atlas/dashboardpage10.webp"
                alt="Quick setup illustration"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Lavender gradient overlay so text stays readable on the left */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#F4F2FF]/95 via-[#F4F2FF]/80 to-[#F4F2FF]/0" />

              {/* Foreground content */}
              <div className="relative z-10 flex items-center gap-3.5 px-5 py-4 min-h-[88px]">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5 text-[#534AB7]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-extrabold text-[#14142B]">
                    Takes about 2 minutes.
                  </p>
                  <p className="text-[14px] text-[#6B6A8A]">
                    You can update any answer later in Settings.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Reassurance band 2 ─────────────────────────────── */}
            <div className="relative overflow-hidden bg-white border border-[#ECE9FF] rounded-2xl px-5 py-4 flex items-center gap-3.5 shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/30">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-extrabold text-[#534AB7]">
                  You&apos;re on your way!
                </p>
                <p className="text-[14px] text-[#6B6A8A]">
                  A few quick steps now = a smarter study plan that saves you
                  hours later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  /* ─────────────────────────────────────────────────────────────
   * STATE 2 — Student finished onboarding but hasn't uploaded any
   * materials yet. Show a friendly empty-state dashboard with a
   * clear path to upload, instead of pre-populated mock data.
   * ───────────────────────────────────────────────────────────── */
  if (!hasMaterials) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#F5F5FB] p-4 md:p-6">
          <div className="max-w-[1200px] mx-auto">
            {/* ── "Finish your profile first" banner (Scenario 1 only) ─ */}
            {!onboardingDone && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-gradient-to-r from-[#FFF7E6] to-[#FFF1D6] border border-[#FFD98A] rounded-2xl p-4 md:p-5 mb-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-[#7A5A1F]">
                    Finish setting up your profile
                  </p>
                  <p className="text-[12.5px] text-[#8A7242] leading-relaxed">
                    You can keep exploring — but Atlas will personalise things
                    much better once you complete the 5-step onboarding.
                  </p>
                </div>
                <Link
                  href="/onboarding"
                  className="flex-shrink-0 inline-flex items-center gap-1.5 bg-[#534AB7] hover:bg-[#3C3489] text-white px-4 py-2 rounded-lg font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  Continue onboarding <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* ── Greeting ───────────────────────────────────────── */}
            <div className="mb-5">
              <p className="text-sm text-[#6B6A8A] mb-1">{greeting},</p>
              <h1 className="text-3xl md:text-[34px] font-extrabold text-[#14142B] leading-tight">
                Welcome to Atlas, {userName} 👋
              </h1>
              <p className="text-sm text-[#6B6A8A] mt-1.5 max-w-xl">
                {onboardingDone
                  ? "Your profile is set up. Upload your syllabus or course materials to unlock your personalised study plan, grades, and deadlines."
                  : "Get started by uploading your syllabus — or finish your profile first so Atlas can tailor everything to your goals."}
              </p>
            </div>

            {/* ── Hero upload card — image left + Why-upload right ── */}
            <div className="relative overflow-hidden rounded-3xl mb-6 shadow-xl shadow-[#534AB7]/20 bg-gradient-to-br from-[#3F3795] via-[#534AB7] to-[#7B6FE8] min-h-[320px] md:min-h-[360px]">
              {/* Background image — covers only the LEFT side, image visible there */}
              <img
                src="https://res.cloudinary.com/mview/image/upload/atlas/dashboardpage1.webp"
                alt="Upload syllabus illustration"
                className="absolute inset-y-0 left-0 w-full lg:w-[68%] h-full object-cover object-center pointer-events-none"
              />
              {/* Dark overlay only on the left portion so text stays readable over the image */}
              <div className="absolute inset-y-0 left-0 w-full lg:w-[68%] bg-gradient-to-r from-[#3F3795]/85 via-[#3F3795]/55 to-[#3F3795]/0" />

              {/* Decorative sparkles */}
              <Sparkles className="absolute top-6 right-12 w-4 h-4 text-white/30 z-10" />
              <Sparkles className="absolute bottom-10 left-1/3 w-3 h-3 text-white/20 z-10" />

              {/* Foreground content */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] items-center gap-6 p-6 md:p-9 min-h-[320px] md:min-h-[360px]">
                {/* LEFT — copy + CTA overlaid on the image */}
                <div className="max-w-lg">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur text-white text-[11px] font-bold px-3 py-1.5 mb-3">
                    <Sparkles className="w-3 h-3" /> Let&apos;s get you started
                  </span>
                  <h2 className="text-2xl md:text-[30px] font-extrabold text-white mb-2 leading-tight drop-shadow">
                    Upload your first syllabus
                  </h2>
                  <p className="text-[13px] text-white/90 leading-relaxed max-w-md mb-5">
                    Atlas will parse your lectures, deadlines, and grading
                    weights automatically — then build a ranked study plan
                    around your goals.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Link
                      href="/upload"
                      className="inline-flex items-center gap-2 bg-white hover:bg-[#F4F2FF] text-[#534AB7] px-5 py-2.5 rounded-xl font-extrabold text-sm shadow-lg transition-all active:scale-95"
                    >
                      <Upload className="w-4 h-4" /> Upload syllabus
                    </Link>
                    {!onboardingDone && (
                      <Link
                        href="/onboarding"
                        className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 text-white px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all active:scale-95"
                      >
                        <Sparkles className="w-4 h-4" /> Start setup
                      </Link>
                    )}
                  </div>
                  <p className="flex items-center gap-1.5 text-[12px] text-white/80">
                    <Shield className="w-3.5 h-3.5" /> Your data is private and
                    secure
                  </p>
                </div>

                {/* RIGHT — "Why upload?" card on the clean purple area */}
                <div className="bg-white rounded-2xl p-5 shadow-2xl">
                  <p className="text-sm font-extrabold text-[#1A1A2E] mb-3">
                    Why upload?
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      "Get a personalised study plan",
                      "Track important dates",
                      "Receive smart recommendations",
                      "Improve your grades",
                    ].map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-2.5 text-[13px] text-[#3A3A52] font-medium"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Check
                            className="w-3 h-3 text-emerald-600"
                            strokeWidth={3.5}
                          />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ── 3 action cards with illustrations ──────────────── */}
            <p className="text-[11px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-3">
              Or get started another way
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: Upload,
                  color: "bg-[#534AB7]",
                  href: "/upload",
                  title: "Upload files",
                  desc: "PDFs, slides, notes — Atlas reads them all.",
                  img: "https://res.cloudinary.com/mview/image/upload/atlas/dashboardpage2.webp",
                },
                {
                  icon: BookOpen,
                  color: "bg-emerald-500",
                  href: "/classes",
                  title: "Add classes manually",
                  desc: "No syllabus? Add classes one at a time.",
                  img: "https://res.cloudinary.com/mview/image/upload/atlas/dashboardpage3.webp",
                },
                {
                  icon: Calendar,
                  color: "bg-orange-500",
                  href: "/calendar",
                  title: "Plan your week",
                  desc: "Block out study time and key deadlines.",
                  img: "https://res.cloudinary.com/mview/image/upload/atlas/dashboardpage4.webp",
                },
              ].map((c) => (
                <Link
                  key={c.title}
                  href={c.href}
                  className="group relative overflow-hidden bg-white border border-[#ECE9FF] rounded-2xl shadow-sm hover:shadow-lg hover:border-[#534AB7]/40 transition-all"
                >
                  <div className="flex items-stretch">
                    {/* Left — text */}
                    <div className="flex-1 p-5">
                      <div
                        className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mb-2.5 shadow-md`}
                      >
                        <c.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-sm font-extrabold text-[#1A1A2E] mb-1">
                        {c.title}
                      </p>
                      <p className="text-[12px] text-[#6B6A8A] leading-relaxed mb-3">
                        {c.desc}
                      </p>
                      <span className="text-[12px] font-bold text-[#534AB7] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Get started <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    {/* Right — illustration */}
                    <div className="hidden sm:flex w-[110px] flex-shrink-0 items-center justify-center pr-2">
                      <img
                        src={c.img}
                        alt={c.title}
                        className="w-full h-auto max-h-[110px] object-contain"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  /* ─────────────────────────────────────────────────────────────
   * STATE 3 — Student has uploaded materials. Show the full
   * personalised dashboard (existing implementation below).
   * ───────────────────────────────────────────────────────────── */
  return (
    <AppLayout>
      <div className="min-h-screen bg-[#F5F5FB] p-4 md:p-6">
        <div className="max-w-[1200px] mx-auto">
          {/* ── Atlas tip banner ───────────────────────────────── */}
          {/* ── Header ───────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-5 gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">
                {greeting}, {userName}! 👋
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Let&apos;s make today productive.
              </p>
            </div>

            <div className="relative flex-1 max-w-xs hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search anything…"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href="/analytics"
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 px-3 py-2 rounded-xl transition-all hover:bg-indigo-50"
              >
                <Activity className="w-3.5 h-3.5" /> Analytics
              </Link>
              <Link
                href="/upload"
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" /> Upload
              </Link>
            </div>
          </div>

          {/* ── Conflict banner ──────────────────────────────────── */}
          <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-5">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs font-semibold text-amber-800">
              <strong>Atlas detected:</strong> Biology Midterm in 3 days +
              Statistics Quiz in 4 days. Cell Division is your weakest topic —
              prioritised at top of today&apos;s plan.
            </p>
            <Link
              href="/study-plan"
              className="ml-auto text-[11px] font-bold text-amber-700 hover:text-amber-900 whitespace-nowrap flex items-center gap-1"
            >
              View plan <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {/* ── Main layout ──────────────────────────────────────── */}
          <div className="flex flex-col lg:flex-row gap-4 items-start">
            {/* ── LEFT ─────────────────────────────────────────── */}
            <div className="lg:w-[70%] min-w-0 space-y-4">
              {/* Hero card — image as background, text overlaid */}
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{ minHeight: 280 }}
              >
                {/* Background image */}
                <img
                  src="https://res.cloudinary.com/mview/image/upload/atlas/homepage.webp"
                  alt="Study illustration"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Text content on top */}
                <div className="relative z-10 p-6" style={{ minHeight: 280 }}>
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">
                      Today's Focus
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-white/70 backdrop-blur px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" /> {heroTask.duration} min
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="text-[11px] font-semibold bg-white/80 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
                      📚 {heroTask.class}
                    </span>
                    <span className="text-[11px] font-bold bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
                      High Priority
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-tight max-w-[60%]">
                    {heroTask.topic}
                  </h2>

                  {/* Reason pills */}
                  <div className="flex items-center gap-3 mb-4 flex-wrap max-w-[60%]">
                    {[
                      "Bio Midterm in 3 days",
                      "Weakest topic (28%)",
                      "High syllabus weight (24%)",
                    ].map((r) => (
                      <span
                        key={r}
                        className="text-[11px] text-gray-600 flex items-center gap-1.5"
                      >
                        <span className="w-3.5 h-3.5 rounded-full bg-gray-400 inline-flex items-center justify-center text-white text-[8px] flex-shrink-0">
                          i
                        </span>
                        {r}
                      </span>
                    ))}
                  </div>

                  {/* Why toggle */}
                  <button
                    onClick={() => setShowEngine(!showEngine)}
                    className="flex items-center gap-2 text-sm text-gray-600 bg-white/70 backdrop-blur hover:bg-white/90 px-3.5 py-2 rounded-xl border border-white/60 mb-4 transition-all"
                  >
                    <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[9px] text-gray-500 flex-shrink-0">
                      ?
                    </span>
                    Why is this task #1?
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showEngine ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showEngine && (
                    <div className="bg-white/85 backdrop-blur rounded-2xl p-4 mb-4 max-w-[55%] space-y-2.5 border border-white/60">
                      {engineScores.map((s) => (
                        <div key={s.label}>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="font-semibold text-gray-700">
                              {s.icon} {s.label}
                            </span>
                            <span
                              className={`font-extrabold ${s.value < 40 ? "text-red-600" : s.value < 70 ? "text-amber-600" : "text-indigo-600"}`}
                            >
                              {s.value}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${s.color} rounded-full`}
                              style={{ width: `${s.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex items-center gap-3">
                    <Link
                      href="/study-session"
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-lg shadow-indigo-500/30"
                    >
                      <Play className="w-4 h-4" /> Start Study Session
                    </Link>
                    <button
                      onClick={() => skipTask(heroTask.id)}
                      className="flex items-center gap-2 bg-white/80 hover:bg-white text-gray-700 font-semibold px-5 py-3 rounded-2xl text-sm transition-all border border-white/60 backdrop-blur"
                    >
                      <SkipForward className="w-4 h-4" /> Switch Task
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats strip — 3 cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    icon: "🎯",
                    label: "Study Streak",
                    value: "7 days",
                    sub: "Keep it going! 🔥",
                    valueColor: "text-gray-900",
                  },
                  {
                    icon: "📈",
                    label: "Weekly Progress",
                    value: "72%",
                    sub: "On track ↑ 12%",
                    valueColor: "text-gray-900",
                  },
                  {
                    icon: "⏰",
                    label: "Focus Time Today",
                    value: "65 min",
                    sub: "Great start! 🎉",
                    valueColor: "text-gray-900",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl flex-shrink-0">
                      {s.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-medium">
                        {s.label}
                      </p>
                      <p
                        className={`text-lg font-extrabold leading-tight ${s.valueColor}`}
                      >
                        {s.value}
                      </p>
                      <p className="text-[10px] text-gray-400">{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Today's Plan full list */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <p className="text-sm font-extrabold text-gray-900">
                      Today&apos;s Plan
                    </p>
                    <p className="text-xs text-gray-400 hidden sm:block">
                      Your prioritized study roadmap for today.
                    </p>
                  </div>
                  <Link
                    href="/study-plan"
                    className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    View full plan <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {tasks.map((t, i) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-all group"
                    >
                      <span className="text-sm font-bold text-gray-300 w-4 flex-shrink-0">
                        {i + 1}
                      </span>
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${t.classDot}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {t.topic}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {t.class} · {t.duration} min
                        </p>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${t.priorityColor}`}
                      >
                        {t.priority}
                      </span>
                      <button className="w-7 h-7 rounded-xl bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center flex-shrink-0 transition-all shadow-sm shadow-indigo-500/20">
                        <Play className="w-3 h-3 text-white" />
                      </button>
                      <button className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-100 transition-all flex-shrink-0">
                        <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* AI Rec footer */}
                <div className="mx-4 mb-4 mt-2 bg-[#dfdbf5] border border-indigo-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-indigo-700">
                        AI Recommendation
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Focus on Cell Division and DNA Replication — both have
                        exams this week and low mastery.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/study-plan"
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex-shrink-0"
                  >
                    View Study Plan <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ── RIGHT sidebar ───────────────────────────────── */}
            <div className="lg:w-[30%] lg:flex-shrink-0 space-y-4">
              {/* Daily Goal ring */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  {/* Ring */}
                  <div className="relative flex-shrink-0">
                    <svg width="76" height="76" viewBox="0 0 76 76">
                      <circle
                        cx="38"
                        cy="38"
                        r={r}
                        fill="none"
                        stroke="#EEF2FF"
                        strokeWidth="8"
                      />
                      <circle
                        cx="38"
                        cy="38"
                        r={r}
                        fill="none"
                        stroke="#4F46E5"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={circ * (1 - gPct / 100)}
                        transform="rotate(-90 38 38)"
                        style={{ transition: "stroke-dashoffset 0.8s ease" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-base font-extrabold text-indigo-600">
                        {gPct}%
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900">
                      Daily Goal
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {doneMins}m of {goalMins}m
                    </p>
                    <p className="text-sm font-extrabold text-orange-500 mt-1">
                      {goalMins - doneMins}m left
                    </p>
                  </div>
                </div>

                {/* This week */}
                <div className="border-t border-gray-50 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                      <p className="text-[11px] font-bold text-gray-500">
                        This Week
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900 leading-none mb-0.5">
                    12.4h
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold mb-2">
                    +16% vs last week
                  </p>
                  <MiniBarChart />
                </div>
              </div>

              {/* Upcoming — matches design image exactly */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-base font-extrabold text-gray-900">
                    Upcoming
                  </p>
                  <Link
                    href="/calendar"
                    className="text-sm font-semibold text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                  >
                    View calendar <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="space-y-2">
                  {UPCOMING.map((u) => (
                    <div
                      key={u.name}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl ${u.rowBg}`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${u.dot}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 leading-tight">
                          {u.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{u.sub}</p>
                      </div>
                      <span
                        className={`text-sm font-extrabold flex-shrink-0 ${u.daysColor}`}
                      >
                        {u.days === 0 ? "Tomorrow" : `${u.days}d`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weak Topics */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-extrabold text-gray-900">
                    Weak Topics
                  </p>
                  <Link
                    href="/study-guide"
                    className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-0.5"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {WEAK_TOPICS.map((t) => (
                    <div key={t.name} className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-sm">
                        {t.pct < 40 ? "🔴" : t.pct < 55 ? "🟠" : "🟡"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[11px] font-semibold text-gray-800 truncate">
                            {t.name}
                          </p>
                          <span className="text-[11px] font-extrabold text-gray-600 ml-2 flex-shrink-0">
                            {t.pct}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${t.color} rounded-full`}
                            style={{ width: `${t.pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
