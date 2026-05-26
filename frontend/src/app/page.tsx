"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  LineChart,
  Menu,
  Mic,
  Sparkles,
  Star,
  Target,
  Trophy,
  X,
  Zap,
  Upload,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-200 bg-white"
      style={{
        borderBottom: scrolled
          ? "1px solid rgba(83,74,183,0.12)"
          : "1px solid #F0EFF8",
        boxShadow: scrolled ? "0 1px 16px rgba(83,74,183,0.07)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/25">
            <span className="text-white font-extrabold text-sm">A</span>
          </div>
          <span className="font-extrabold text-[#18172B] text-base tracking-tight">
            Atlas
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Features", href: "#features" },
            { label: "How it works", href: "#how-it-works" },
            { label: "For students", href: "#testimonials" },
            { label: "Pricing", href: "/pricing" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-[#6B6A8A] hover:text-[#534AB7] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-[#6B6A8A] hover:text-[#534AB7] px-4 py-2 rounded-xl hover:bg-[#EEEDFE] transition-all"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-[#534AB7] hover:bg-[#3C3489] text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#534AB7]/20 transition-all"
          >
            Get started free <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-[#6B6A8A] hover:bg-[#EEEDFE]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-[#EEEDFE] px-6 py-5 space-y-3 shadow-lg">
          {["Features", "How it works", "For students"].map((l) => (
            <a
              key={l}
              href="#"
              className="block text-sm font-medium text-[#6B6A8A] py-1.5"
              onClick={() => setOpen(false)}
            >
              {l}
            </a>
          ))}
          <a
            href="/pricing"
            className="block text-sm font-medium text-[#6B6A8A] py-1.5"
            onClick={() => setOpen(false)}
          >
            Pricing
          </a>
          <div className="pt-3 flex flex-col gap-2 border-t border-[#EEEDFE]">
            <Link
              href="/login"
              className="text-sm font-semibold text-center text-[#6B6A8A] py-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-[#534AB7] text-white text-sm font-bold px-5 py-2.5 rounded-xl text-center"
            >
              Get started free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#e6e3fa] to-[#EAE6FF]">
      {/* Purple bg blob — behind the image */}
      {/* Soft radial glow */}
      <div
        className="absolute right-16 top-8 w-80 h-80 rounded-full opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #A78BFA 0%, transparent 70%)",
        }}
      />
      {/* Star dots */}
      {[
        [72, 6],
        [88, 18],
        [65, 85],
        [82, 72],
        [55, 10],
        [94, 50],
      ].map(([l, t], i) => (
        <div
          key={i}
          className="absolute hidden lg:block text-[#7C6CFF]/25 text-lg select-none pointer-events-none"
          style={{ left: `${l}%`, top: `${t}%` }}
        >
          ✦
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row items-center ">
        {/* LEFT */}
        <div className="flex-1 max-w-[600px]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAE6FF] border border-[#C4B5FD]/40 mb-4">
            <Sparkles className="w-3 h-3 text-[#534AB7]" />
            <span className="text-[11px] font-bold text-[#534AB7] uppercase tracking-widest">
              AI Powered Study Platform
            </span>
          </div>

          <h1 className="text-[46px] md:text-[54px] font-black leading-[1.1] text-[#171232] mb-1">
            Stop wondering
            <br />
            what to study next.
          </h1>
          <h2
            className="text-[46px] md:text-[54px] font-black leading-[1.1] mb-5"
            style={{
              background: "linear-gradient(135deg, #534AB7, #7C3AED)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Atlas tells you.
          </h2>

          <p className="text-[#5C5888] text-base leading-relaxed mb-5 max-w-lg">
            Drop your syllabus. Atlas reads every lecture, slide, and grade —
            then tells you exactly what to study, why it matters, and how it
            moves your grade.
          </p>

          <div className="flex gap-3 flex-wrap mb-5">
            <Link
              href="/signup"
              className="flex items-center gap-2 bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold px-6 py-3 rounded-xl text-sm shadow-lg shadow-[#534AB7]/30 transition-all"
            >
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-[#171232] font-semibold px-6 py-3 rounded-xl text-sm border border-gray-200 shadow-sm transition-all"
            >
              See how it works{" "}
              <ArrowRight className="w-3.5 h-3.5 text-[#534AB7]" />
            </a>
          </div>

          <div className="mt-6 flex gap-3 flex-wrap text-xs text-[#8A87A3]">
            {[
              "Grounded in your own materials",
              "Explains every recommendation",
              "Predicts your exam score",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — dashboard image */}
        <div className=" relative flex justify-center lg:justify-end items-center">
          <img
            src="https://res.cloudinary.com/mview/image/upload/atlas/landingpage.webp"
            alt="Atlas dashboard"
            className="relative z-10 w-full max-w-[620px] rounded-2xl"
            style={{
              boxShadow:
                "0 24px 64px rgba(83,74,183,0.18), 0 0 0 1px rgba(83,74,183,0.08)",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   FEATURES
══════════════════════════════════════════════════════════════ */
const FEATURES = [
  {
    icon: Target,
    grad: "from-violet-500 to-[#534AB7]",
    tag: "Core",
    title: "Daily ranked plan",
    desc: "Ranked by grade impact, not anxiety. Tells you exactly what to study, for how long, and why.",
  },
  {
    icon: Brain,
    grad: "from-blue-500 to-cyan-500",
    tag: "RAG-powered",
    title: "Grounded study guides",
    desc: "Built from your own files, not the internet. Every claim cites your professor's actual lecture.",
  },
  {
    icon: LineChart,
    grad: "from-green-500 to-emerald-500",
    tag: "Predictive",
    title: "Grade prediction",
    desc: "Predicts your exam score, projects your final grade, and identifies the highest-leverage action.",
  },
  {
    icon: Mic,
    grad: "from-orange-500 to-amber-500",
    tag: "Whisper AI",
    title: "Lecture transcription",
    desc: "Upload audio — Atlas transcribes with timestamps and detects topics your professor emphasised.",
  },
  {
    icon: BookOpen,
    grad: "from-pink-500 to-rose-500",
    tag: "SM-2",
    title: "Active study tools",
    desc: "Flashcards, quizzes, SM-2 spaced repetition — all auto-generated from your own uploaded materials.",
  },
  {
    icon: Calendar,
    grad: "from-teal-500 to-cyan-600",
    tag: "Smart",
    title: "Smart calendar",
    desc: "Knows your classes, gym, sleep, and commute. Study blocks are scheduled around your real life.",
  },
  {
    icon: Zap,
    grad: "from-yellow-500 to-orange-500",
    tag: "Explainable",
    title: "Every recommendation explained",
    desc: "Atlas never guesses silently. Every top task shows exactly why: lecture mentions, quiz misses, exam proximity.",
  },
];

function FeatureCard({ f }: { f: (typeof FEATURES)[0] }) {
  return (
    <div
      className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group relative"
      style={{ boxShadow: "0 2px 14px rgba(83,74,183,0.07)" }}
    >
      <div className="flex gap-5">
        {/* Icon */}
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.grad} flex-shrink-0 flex items-center justify-center`}
        >
          <f.icon className="w-5 h-5 text-white" />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-[#18172B] leading-tight mb-1.5">
            {f.title}
          </h3>
          <p className="text-sm text-[#6B6A8A] leading-relaxed">{f.desc}</p>
        </div>
      </div>

      {/* Arrow - Always Fixed at Bottom Right */}
      <div className="absolute bottom-5 right-5">
        <div className="w-6 h-6 rounded-full bg-[#d7d3f7] flex items-center justify-center group-hover:bg-[#534AB7] transition-colors">
          <ArrowRight className="w-3 h-3 text-[#534AB7] group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="py-8 bg-[#F5F4FF]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white border border-[#DDD8FF] rounded-full px-4 py-1.5 mb-3">
            <span className="text-[11px] font-bold text-[#534AB7] uppercase tracking-widest">
              Built for serious students
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#18172B] mb-3">
            Everything you need to study smarter
          </h2>
          <p className="text-[#6B6A8A] max-w-2xl mx-auto">
            Atlas brings everything together so you can focus on what truly
            matters — learning.
          </p>
        </div>
        {/* Top row — 4 cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {FEATURES.slice(0, 4).map((f, i) => (
            <FeatureCard key={i} f={f} />
          ))}
        </div>
        {/* Bottom row — 3 cards */}
        <div className="grid md:grid-cols-3 gap-4 md:px-16">
          {FEATURES.slice(4).map((f, i) => (
            <FeatureCard key={i} f={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
/* ══════════════════════════════════════════════════════════════
   HOW IT WORKS
══════════════════════════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    {
      n: 1,
      icon: Upload,
      title: "Upload syllabus",
      desc: "Add your syllabus or files. Atlas parses lectures, deadlines, and grades.",
      bg: "bg-[#534AB7]",
    },
    {
      n: 2,
      icon: Brain,
      title: "Atlas reads everything",
      desc: "Lectures, grades, and emphasis signals all fused into one engine.",
      bg: "bg-[#7C3AED]",
    },
    {
      n: 3,
      icon: Target,
      title: "Start studying",
      desc: "One ranked task with a reason. Start studying — Atlas adjusts as you go.",
      bg: "bg-[#059669]",
    },
  ];

  return (
    <section id="how-it-works" className="py-8 bg-[#FAFAFE]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#EEEDFE] border border-[#ABA9FA]/40 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-bold text-[#534AB7] uppercase tracking-widest">
              How it works
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#18172B] mb-3">
            Drop a file.{" "}
            <span className="text-[#534AB7]">Eight things happen.</span>
          </h2>
          <p className="text-[#6B6A8A]">
            Study smarter with Atlas in a few clicks.
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-[#534AB7] via-[#7C3AED] to-[#059669] opacity-30" />

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div
                key={i}
                className="relative bg-white rounded-lg border border-[#EEEDFE] p-7 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                style={{ boxShadow: "0 2px 16px rgba(83,74,183,0.06)" }}
              >
                {/* Number bubble */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-[#EEEDFE] flex items-center justify-center shadow-sm">
                  <span className="text-xs font-extrabold text-[#534AB7]">
                    {s.n}
                  </span>
                </div>
                <div
                  className={`w-16 h-16 rounded-2xl ${s.bg} flex items-center justify-center mx-auto mb-5 shadow-lg`}
                >
                  <s.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-extrabold text-[#18172B] mb-2">
                  {s.title}
                </h3>
                <p className="text-base text-[#6B6A8A] leading-relaxed">
                  {s.desc}
                </p>
                <div
                  className={`mt-5 mx-auto h-1 w-12 rounded-full ${s.bg} opacity-40`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPARISON
══════════════════════════════════════════════════════════════ */
function Comparison() {
  const tools = [
    {
      name: "Notion / Evernote",
      icon: "📓",
      does: "Organises files",
      missing: "Doesn't prioritize",
    },
    {
      name: "Quizlet / Anki",
      icon: "🃏",
      does: "Generic flashcards",
      missing: "Not YOUR class",
    },
    {
      name: "Canvas / Blackboard",
      icon: "🏫",
      does: "Lists deadlines",
      missing: "Doesn't allocate time",
    },
    {
      name: "ChatGPT",
      icon: "🤖",
      does: "Answers questions",
      missing: "Doesn't see your semester",
    },
    {
      name: "Calendars",
      icon: "📅",
      does: "Shows time",
      missing: "Doesn't know grade stakes",
    },
    {
      name: "Atlas",
      icon: "⚡",
      does: "Ranks by grade impact",
      missing: null,
      isAtlas: true,
    },
  ];

  return (
    <section
      id="comparison"
      className="py-6 bg-white border-t border-[#EEEDFE]"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#EEEDFE] border border-[#ABA9FA]/40 rounded-full px-4 py-1.5 mb-2">
            <span className="text-xs font-bold text-[#534AB7] uppercase tracking-widest">
              Why Atlas
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#18172B] mb-3">
            Tools either organize{" "}
            <em className="not-italic text-[#534AB7]">or</em> generate.
          </h2>
          <p className="text-[#6B6A8A] max-w-lg mx-auto text-sm md:text-base">
            None prioritize. Atlas is the first tool that tells you{" "}
            <strong className="text-[#534AB7]">
              what to study, when, and why
            </strong>{" "}
            — backed by your own professor's signals.
          </p>
        </div>

        {/* ── Desktop table ── */}
        <div
          className="hidden md:block rounded-xl overflow-hidden border border-[#EEEDFE]"
          style={{ boxShadow: "0 4px 24px rgba(83,74,183,0.08)" }}
        >
          <div className="grid grid-cols-3 bg-[#F5F4FF] px-6 py-3.5 border-b border-[#EEEDFE]">
            <p className="text-[11px] font-extrabold text-[#807e7e] uppercase tracking-widest">
              Tool
            </p>
            <p className="text-[11px] font-extrabold text-[#807e7e] uppercase tracking-widest">
              What it does
            </p>
            <p className="text-[11px] font-extrabold text-[#807e7e] uppercase tracking-widest">
              What's missing
            </p>
          </div>
          {tools.map((t, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 px-6 py-4 border-b border-[#EEEDFE] last:border-0 items-center transition-all ${
                (t as any).isAtlas
                  ? "bg-[#534AB7]"
                  : i % 2 === 0
                    ? "bg-white"
                    : "bg-[#FAFAFE]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{t.icon}</span>
                <p
                  className={`text-sm font-semibold ${(t as any).isAtlas ? "text-white" : "text-[#18172B]"}`}
                >
                  {t.name}
                </p>
              </div>
              <p
                className={`text-sm ${(t as any).isAtlas ? "text-indigo-200" : "text-[#6B6A8A]"}`}
              >
                {t.does}
              </p>
              <div>
                {t.missing ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-3 py-1 rounded-lg">
                    ✗ {t.missing}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/20 border border-white/20 px-3 py-1 rounded-lg">
                    ✓ Tells you exactly what to study next
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Mobile cards ── */}
        <div className="md:hidden space-y-3">
          {tools.map((t, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-4 ${
                (t as any).isAtlas
                  ? "bg-[#534AB7] border-[#534AB7]"
                  : "bg-white border-[#EEEDFE]"
              }`}
              style={{ boxShadow: "0 2px 12px rgba(83,74,183,0.06)" }}
            >
              {/* Tool name + icon */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="text-xl">{t.icon}</span>
                <p
                  className={`text-sm font-bold ${(t as any).isAtlas ? "text-white" : "text-[#18172B]"}`}
                >
                  {t.name}
                </p>
              </div>
              {/* What it does */}
              <p
                className={`text-xs mb-2.5 ${(t as any).isAtlas ? "text-indigo-200" : "text-[#6B6A8A]"}`}
              >
                <span
                  className={`font-semibold ${(t as any).isAtlas ? "text-indigo-100" : "text-[#9B9AB5]"}`}
                >
                  Does:{" "}
                </span>
                {t.does}
              </p>
              {/* Missing / Atlas badge */}
              {t.missing ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg">
                  ✗ {t.missing}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-white/20 border border-white/20 px-2.5 py-1 rounded-lg">
                  ✓ Tells you exactly what to study next
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════════════════════════ */
function Testimonials() {
  const items = [
    {
      q: "It told me to study mitosis because Smith mentioned it three times and I missed two enzyme questions on Quiz 3. It's not guessing.",
      name: "Priya Sharma",
      role: "Pre-med student",
      avatar: "P",
    },
    {
      q: "It predicted I'd score 87 on Exam 2. I scored 89. It's accurate enough that I trust it completely now.",
      name: "Aditya Verma",
      role: "Biology student",
      avatar: "A",
    },
    {
      q: "It's honest. It tells me when it's only partly sure — like 'this section is general biology, Smith didn't cover it.' No other tool does that.",
      name: "Sara Khan",
      role: "Engineering student",
      avatar: "S",
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-8 bg-[#FAFAFE] border-t border-[#EEEDFE]"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#EEEDFE] border border-[#ABA9FA]/40 rounded-full px-4 py-1.5 mb-4">
            <Star className="w-3 h-3 text-[#534AB7]" />
            <span className="text-xs font-bold text-[#534AB7] uppercase tracking-widest">
              What students say
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#18172B] mb-2">
            Students trust the plan
          </h2>
          <p className="text-[#6B6A8A]">Real results. Visible reasoning.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-[#EEEDFE] hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              style={{ boxShadow: "0 2px 16px rgba(83,74,183,0.05)" }}
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm text-[#6B6A8A] leading-relaxed mb-5 italic">
                &ldquo;{t.q}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#F0EFF8]">
                <div className="w-9 h-9 rounded-full bg-[#EEEDFE] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-extrabold text-[#534AB7]">
                    {t.avatar}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#18172B]">{t.name}</p>
                  <p className="text-[10px] text-[#9B9AB5]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   CTA
══════════════════════════════════════════════════════════════ */
function CTA() {
  return (
    <section className="py-5 bg-white border-t border-[#EEEDFE]">
      <div className="max-w-5xl mx-auto px-6">
        <div
          className="relative rounded-xl overflow-hidden min-h-[420px] flex items-center"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/mview/image/upload/atlas/landingpage-2.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 20px 60px rgba(83,74,183,0.12)",
          }}
        >
          {/* soft overlay for readability */}
          <div className="absolute inset-0 bg-white/10"></div>

          {/* Text Over Image */}
          <div className="relative z-10 max-w-xl p-10 md:p-14">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 mb-5 shadow-sm">
              <span className="text-xs font-semibold text-[#534AB7]">
                Free to start for students
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold text-[#171232] leading-tight mb-4">
              Ready to stop
              <br />
              guessing?
            </h2>

            <p className="text-[#4E4A72] text-sm md:text-base leading-relaxed mb-7 max-w-md">
              Drop your syllabus. Get a ranked study plan calibrated to your
              class, your professor's signals, and your real schedule.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="bg-[#534AB7] hover:bg-[#463DA6] text-white font-bold px-7 py-3.5 rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-all"
              >
                Get started free <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login"
                className="bg-white hover:bg-gray-50 text-[#534AB7] font-semibold px-7 py-3.5 rounded-2xl text-sm border border-[#E8E5FF] transition-all"
              >
                Log in
              </Link>
            </div>

            <p className="text-[#7D78A8] text-xs mt-5">
              No credit card · No ads · FERPA &amp; GDPR compliant
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════ */
function Footer() {
  const groups = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/#features" },
        { label: "How it works", href: "/#how-it-works" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "App",
      links: [
        { label: "Dashboard", href: "/home" },
        { label: "My Classes", href: "/classes" },
        { label: "Study Plan", href: "/study-plan" },
        { label: "Grades", href: "/grades" },
        { label: "Analytics", href: "/analytics" },
        { label: "Calendar", href: "/calendar" },
      ],
    },
    {
      title: "Tools",
      links: [
        { label: "Study Guide", href: "/study-guide" },
        { label: "Flashcards", href: "/flashcards" },
        { label: "Quiz", href: "/quiz" },
        { label: "Exam Mode", href: "/exam-mode" },
        { label: "Upload", href: "/upload" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Sign up", href: "/signup" },
        { label: "Log in", href: "/login" },
        { label: "Settings", href: "/settings/profile" },
        { label: "Notifications", href: "/settings/notifications" },
        { label: "Privacy", href: "/settings/privacy" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help centre", href: "/help" },
        { label: "Pricing", href: "/pricing" },
        { label: "Privacy policy", href: "/settings/privacy" },
        { label: "Terms of use", href: "/help" },
      ],
    },
  ];

  return (
    <footer className="bg-[#171725] text-white pt-8 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-6">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#534AB7] flex items-center justify-center shadow-lg">
                <span className="text-white font-extrabold text-sm">A</span>
              </div>
              <span className="font-extrabold text-white tracking-wide">
                Atlas
              </span>
            </div>
            <p className="text-xs text-[#c3c2e4] leading-relaxed mb-4">
              The AI academic OS for college students. One ranked plan, every
              day.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-[#534AB7] hover:bg-[#3C3489] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
            >
              Get started free
            </Link>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <p className="text-[11px] font-extrabold text-[#857ce9] uppercase tracking-widest mb-3">
                {g.title}
              </p>
              <ul className="space-y-2">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-[#c3c2e4] hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#2E2D45] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-[#c3c2e4]">
            © 2026 Atlas · Academic OS · All rights reserved
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: "Privacy policy", href: "/settings/privacy" },
              { label: "Terms of use", href: "/help" },
              { label: "Help centre", href: "/help" },
              { label: "Pricing", href: "/pricing" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm text-[#c3c2e4] hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-sm text-[#c3c2e4]">
            FERPA & GDPR compliant · No ads
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Comparison />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
