"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight, BookOpen, Brain, Calendar,
  CheckCircle2, ChevronRight, GraduationCap,
  LineChart, Menu, Mic, Sparkles, Star,
  Target, Trophy, X, Zap, Upload,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className="sticky top-0 z-50   transition-all duration-200"
      style={{
        background: "#F8F6FF",
        borderBottom: scrolled ? "1px solid rgba(83,74,183,0.12)" : "1px solid transparent",
        boxShadow:   scrolled ? "0 1px 16px rgba(83,74,183,0.07)" : "none",
      }}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/25">
            <span className="text-white font-extrabold text-sm">A</span>
          </div>
          <span className="font-extrabold text-[#18172B] text-base tracking-tight">Atlas</span>
        </Link>

        {/* Desktop links */}
         <div className="hidden md:flex items-center gap-8">
          {["Features","How it works", "Pricing"].map((l) => (
            <a key={l} href={l === "Pricing" ? "/pricing" : `#${l.toLowerCase().replace(/ /g,"-")}`}
              className="text-sm font-medium text-[#6B6A8A] hover:text-[#534AB7] transition-colors">
              {l}
            </a>
          ))}
        </div>


        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login"
            className="text-sm font-semibold text-[#6B6A8A] hover:text-[#534AB7] px-4 py-2 rounded-xl hover:bg-[#EEEDFE] transition-all">
            Log in
          </Link>
          <Link href="/signup"
            className="bg-[#534AB7] hover:bg-[#3C3489] text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#534AB7]/20 transition-all">
            Get started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button className="md:hidden p-2 rounded-lg text-[#6B6A8A] hover:bg-[#EEEDFE]"
          onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-[#EEEDFE] px-6 py-5 space-y-3 shadow-lg">
          {["Features","How it works","Pricing"].map((l) => (
            <a key={l} href="#" className="block text-sm font-medium text-[#6B6A8A] py-1.5"
              onClick={() => setOpen(false)}>{l}</a>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-[#EEEDFE]">
            <Link href="/login" className="text-sm font-semibold text-center text-[#6B6A8A] py-2">Log in</Link>
            <Link href="/signup" className="bg-[#534AB7] text-white text-sm font-bold px-5 py-2.5 rounded-xl text-center">
              Get started free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO  — left text + right image (landingpage-1.webp)
══════════════════════════════════════════════════════════════ */
function Hero() {
  return (
<section className="relative  flex items-center overflow-hidden">
  {/* Soft Glow */}
  <div className="absolute top-0 left-20 w-72 h-72 bg-purple-200/20 rounded-full blur-[120px]" />
  <div className="absolute bottom-0 right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-[140px]" />

  <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-2 gap-16 items-center">
    
    {/* LEFT TEXT */}
    <div className="max-w-xl">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#dbd5f1] border border-purple-100 shadow-sm mb-6">
        <div className="w-2 h-2 rounded-full bg-[#635BFF]" />
        <span className="text-xs font-semibold  uppercase tracking-wide text-[#635BFF]">
          AI Powered Learning
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-5xl md:text-6xl font-black leading-tight text-[#171232]">
        Stop wondering
        <br />
        what to study next.
      </h1>

      {/* Gradient Text */}
      <h2 className="mt-2 text-4xl md:text-5xl font-black bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] bg-clip-text text-transparent">
        Atlas tells you.
      </h2>

      {/* Description */}
      <p className="mt-6 text-lg leading-8 text-[#666382]">
        Drop your syllabus. Atlas reads every lecture, slide, and grade — then tells you exactly what to study, why it matters, and how it moves your grade.
      </p>

      {/* Buttons */}
      <div className="mt-10 flex gap-4 flex-wrap">
        <a
          href="/signup"
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#635BFF] to-[#7C6CFF] text-white font-semibold shadow-lg hover:scale-105 transition"
        >
          Start Free
        </a>

        <a
         href="#how-it-works"
          className="px-8 py-4 rounded-2xl bg-white border border-gray-200 text-[#171232] font-semibold shadow-sm hover:shadow-md transition"
        >
          See how it works →
        </a>
      </div>

      {/* Features */}
      <div className="mt-8 flex gap-6 flex-wrap text-sm text-[#8A87A3]">
        {["Grounded in your own materials", "Explains every recommendation", "Predicts your exam score"].map((item) => (
          <div key={item} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" />
            {item}
          </div>
        ))}
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <div className="relative flex justify-center">
      {/* Main Dashboard */}
      <img
        src="https://res.cloudinary.com/mview/image/upload/atlas/landingpage-1.webp"
        alt="Dashboard"
        className="w-full max-w-[500px] rounded-[28px] shadow-[0_25px_60px_rgba(90,90,150,0.15)]"
      />

      {/* Floating Stat */}
      <div className="absolute -top-4 right-4 bg-white rounded-2xl shadow-xl px-5 py-4">
        <p className="text-xs text-gray-500">Exam prediction error</p>
        <h3 className="text-xl font-bold text-[#635BFF]">&lt;8 pts</h3>
      </div>

      {/* Floating Card */}
      <div className="absolute bottom-8 -left-4 bg-white rounded-2xl shadow-xl px-5 py-4">
        <p className="text-xs text-gray-500">Study Streak</p>
        <h3 className="text-xl font-bold text-[#171232]">7 Days</h3>
      </div>
    </div>
  </div>
</section>
  );
}


/* ══════════════════════════════════════════════════════════════
   FEATURES — "Built for serious students"
══════════════════════════════════════════════════════════════ */
const FEATURES = [
  { icon: Target,     grad:"from-violet-500 to-[#534AB7]",  tag:"Core",        title:"Daily ranked plan",      desc:"Ranked by grade impact, not anxiety. Tells you exactly what to study, for how long, and why."                      },
  { icon: Brain,      grad:"from-blue-500 to-cyan-500",     tag:"RAG-powered", title:"Grounded study guides",  desc:"Built from your own files, not the internet. Every claim cites your professor's actual lecture."                    },
  { icon: LineChart,  grad:"from-green-500 to-emerald-500", tag:"Predictive",  title:"Grade prediction",       desc:"Predicts your exam score, projects your final grade, and identifies the highest-leverage action."                   },
  { icon: Mic,        grad:"from-orange-500 to-amber-500",  tag:"Whisper AI",  title:"Lecture transcription",  desc:"Upload audio — Atlas transcribes with timestamps and detects topics your professor emphasised."                      },
  { icon: BookOpen,   grad:"from-pink-500 to-rose-500",     tag:"SM-2",        title:"Active study tools",     desc:"Flashcards, quizzes, SM-2 spaced repetition — all auto-generated from your own uploaded materials."                },
  { icon: Calendar,   grad:"from-teal-500 to-cyan-600",     tag:"Smart",       title:"Smart calendar",         desc:"Knows your classes, gym, sleep, and commute. Study blocks are scheduled around your real life."                     },
  { icon: Zap,        grad:"from-yellow-500 to-orange-500",  tag:"Explainable", title:"Every recommendation explained", desc:"Atlas never guesses silently. Every top task shows exactly why: lecture mentions, quiz misses, exam proximity."    },
];

function Features() {
  return (
    <section id="features" className="py-10" style={{ background:"#fafafe" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#EEEDFE] border border-[#ABA9FA]/40 rounded-full px-3.5 py-1 mb-4">
            <Sparkles className="w-3 h-3 text-[#534AB7]" />
            <span className="text-xs font-semibold text-[#534AB7]">Everything you need</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#18172B] mb-3">
            Built for serious students
          </h2>
          <p className="text-[#6B6A8A] max-w-lg mx-auto font-light">
            Not another calendar app. Atlas is the first tool that tells you{" "}
            <em className="text-[#534AB7] not-italic font-semibold">why</em> to study something.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-[#EEEDFE] hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              style={{ boxShadow:"0 2px 12px rgba(83,74,183,0.05)" }}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.grad} flex items-center justify-center mb-3.5 shadow-md`}>
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className="text-[16px] font-bold text-[#18172B]">{f.title}</h3>
                <span className="text-[10px] font-bold text-[#534AB7] bg-[#EEEDFE] border border-[#ABA9FA]/30 px-2 py-0.5 rounded-full whitespace-nowrap uppercase tracking-wide">
                  {f.tag}
                </span>
              </div>
              <p className="text-sm text-[#6B6A8A] leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   HOW IT WORKS — "Start in 3 simple steps"
   Matches reference: numbered circles + arrows between steps
══════════════════════════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    {
      n: 1,
      icon: Upload,
      title: "Upload syllabus",
      desc: "Add your syllabus to Atlas in seconds",
      bg: "from-violet-500 to-indigo-500",
      iconColor: "text-white",
      glow: "shadow-violet-300/40",
    },
    {
      n: 2,
      icon: Brain,
      title: "Atlas reads everything",
      desc: "Lectures, grades, and emphasis signals all fused into one engine",
      bg: "from-pink-500 to-rose-500",
      iconColor: "text-white",
      glow: "shadow-pink-300/40",
    },
    {
      n: 3,
      icon: Target,
      title: "Start studying",
      desc: "One ranked task with a reason. Start studying — Atlas adjusts as you go",
      bg: "from-emerald-500 to-teal-500",
      iconColor: "text-white",
      glow: "shadow-emerald-300/40",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-8 relative overflow-hidden"
    >
      {/* Decorative bg */}
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-violet-100 blur-3xl opacity-40" />
      <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-pink-100 blur-3xl opacity-40" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <div className="text-center mb-8">
          <span className="px-4 py-1 rounded-full bg-[#ECE9FF] text-[#534AB7] text-xs font-bold">
            HOW IT WORKS
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold text-[#171232] mt-4 mb-3">
            Drop a file.
            <span className="text-[#534AB7]"> Eight things happen.</span>
          </h2>

          <p className="text-[#6B6A8A]">
            Study smarter with Atlas in a few clicks.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="hidden md:block absolute top-14 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-violet-300 via-pink-300 to-emerald-300" />

          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((s, i) => (
              <div
                key={i}
                className="relative text-center flex flex-col items-center"
              >
                {/* Floating Number */}
              
<div className="absolute -top-5 z-20">
  <div className="w-12 h-12 rounded-full bg-[#F8F7FF] border border-[#E9E7FF] flex items-center justify-center shadow-sm">
    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
      <span className="text-sm font-bold text-[#534AB7]">
        {s.n}
      </span>
    </div>
  </div>
</div>

                {/* Premium Glass Card */}
                <div className="relative bg-white/80 backdrop-blur-xl border border-[#E9E7FF] shadow-xl rounded-[22px] px-5 py-9 w-full hover:-translate-y-2 transition-all duration-300">
                  
                  {/* Icon */}
                  <div
                    className={`mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br ${s.bg} flex items-center justify-center shadow-2xl ${s.glow} mb-6`}
                  >
                    <s.icon className={`w-9 h-9 ${s.iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-extrabold text-[#171232] mb-3">
                    {s.title}
                  </h3>

                  {/* Desc */}
                  <p className="text-sm text-[#6B6A8A] leading-relaxed max-w-[220px] mx-auto">
                    {s.desc}
                  </p>

                  {/* Bottom Accent */}
                  <div
                    className={`mt-6 mx-auto h-1.5 w-14 rounded-full bg-gradient-to-r ${s.bg}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   TESTIMONIALS — "Students trust the plan"
══════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════
   COMPARISON — "Why Atlas vs everything else"
══════════════════════════════════════════════════════════════ */
function Comparison() {
  const tools = [
    { name:'Notion / Evernote',  icon:'📓', does:'Organises files',    missing:'Doesn\'t prioritize'         },
    { name:'Quizlet / Anki',     icon:'🃏', does:'Generic flashcards', missing:'Not YOUR class'              },
    { name:'Canvas / Blackboard',icon:'🏫', does:'Lists deadlines',    missing:'Doesn\'t allocate time'       },
    { name:'ChatGPT',            icon:'🤖', does:'Answers questions',  missing:'Doesn\'t see your semester'   },
    { name:'Calendars',          icon:'📅', does:'Shows time',         missing:'Doesn\'t know grade stakes'   },
    { name:'Atlas',              icon:'⚡', does:'Ranks by grade impact', missing:null, isAtlas:true         },
  ];

  return (
    <section id="comparison" className="py-10 bg-white border-t border-[#EEEDFE]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#EEEDFE] border border-[#ABA9FA]/40 rounded-full px-3.5 py-1 mb-4">
            <span className="text-xs font-semibold text-[#534AB7]">Why Atlas</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#18172B] mb-3">
            Tools either organize <em className="not-italic text-[#534AB7]">or</em> generate.
          </h2>
          <p className="text-[#6B6A8A] max-w-md mx-auto font-light">
            None prioritize. Atlas is the first tool that tells you <strong className="text-[#534AB7]">what to study, when, and why</strong> — backed by your own professor's signals.
          </p>
        </div>

        <div className="bg-[#fafafe] border border-[#EEEDFE] rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 bg-[#EEEDFE]/60 px-5 py-3 border-b border-[#EEEDFE]">
            <p className="text-[11px] font-extrabold text-[#9B9AB5] uppercase tracking-widest">Tool</p>
            <p className="text-[11px] font-extrabold text-[#9B9AB5] uppercase tracking-widest">What it does</p>
            <p className="text-[11px] font-extrabold text-[#9B9AB5] uppercase tracking-widest">What's missing</p>
          </div>
          {tools.map((t, i) => (
            <div key={i} className={`grid grid-cols-3 px-5 py-3.5 border-b border-[#EEEDFE] last:border-0 items-center transition-all ${
              (t as any).isAtlas ? "bg-gradient-to-r from-[#534AB7] from-0% to-[#7B6FE8] to-100%" : "hover:bg-white"
            }`}>
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{t.icon}</span>
                <p className={`text-sm font-semibold ${(t as any).isAtlas ? "text-white" : "text-[#18172B]"}`}>{t.name}</p>
              </div>
              <p className={`text-sm ${(t as any).isAtlas ? "text-indigo-100" : "text-[#6B6A8A]"}`}>{t.does}</p>
              <div>
                {t.missing ? (
                  <span className="text-[11px] font-semibold text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg">✗ {t.missing}</span>
                ) : (
                  <span className="text-[11px] font-bold text-white bg-white/20 border border-white/30 px-2.5 py-1 rounded-lg">✓ Tells you exactly what to study next</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { q:"It told me to study mitosis because Smith mentioned it three times and I missed two enzyme questions on Quiz 3. It's not guessing.",   name:"Priya Sharma",   role:"Pre-med student",     term:"Fall 2026" },
    { q:"It predicted I'd score 87 on Exam 2. I scored 89. It's accurate enough that I trust it completely now.",                              name:"Aditya Thomas",  role:"Biology student",     term:"Fall 2026" },
    { q:"It's honest. It tells me when it's only partly sure — like 'this section is general biology, Smith didn't cover it.' No other tool does that.",   name:"Sara Khan",      role:"Engineering student", term:"Fall 2026" },
  ];
  return (
    <section className="py-8 border-t border-[#EEEDFE]" style={{ background:"#fafafe" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#EEEDFE] border border-[#ABA9FA]/40 rounded-full px-3.5 py-1 mb-4">
            <Star className="w-3 h-3 text-[#534AB7]" />
            <span className="text-xs font-semibold text-[#534AB7]">What students say</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#18172B] mb-2">
            Students trust the plan
          </h2>
          <p className="text-[#6B6A8A] font-light">Real results. Visible reasoning.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-[#EEEDFE] hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              style={{ boxShadow:"0 2px 12px rgba(83,74,183,0.05)" }}>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-[#6B6A8A] italic leading-relaxed mb-4 font-light">&ldquo;{t.q}&rdquo;</p>
              <div className="flex items-center gap-2.5 pt-3 border-t border-[#F0EFF8]">
                <div className="w-8 h-8 rounded-full bg-[#EEEDFE] flex items-center justify-center flex-shrink-0">
                  <span className="text-[11px] font-extrabold text-[#534AB7]">{t.name[0]}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#18172B]">{t.name}</p>
                  <p className="text-[10px] text-[#9B9AB5]">{t.role} · {t.term}</p>
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
   CTA — "Ready to stop guessing?"  with landingpage-2.webp
   Matches reference: left text + right 3D bag illustration
══════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════
   PRICING
══════════════════════════════════════════════════════════════ */
function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "Free",
      period: "to start",
      desc: "Get started and see the plan.",
      color: "border-[#EEEDFE]",
      btn: "bg-white border-2 border-[#534AB7] text-[#534AB7] hover:bg-[#EEEDFE]",
      features: [
        "1 class workspace",
        "Syllabus parsing",
        "Daily study plan",
        "Basic flashcards & quiz",
        "Grade tracking",
      ],
      missing: ["Lecture transcription", "RAG study guides", "Exam prediction"],
    },
    {
      name: "Student",
      price: "Student",
      period: "pricing TBD",
      desc: "Everything you need for a full semester.",
      color: "border-[#534AB7] shadow-xl shadow-[#534AB7]/10",
      btn: "bg-[#534AB7] hover:bg-[#3C3489] text-white",
      badge: "Most popular",
      features: [
        "Unlimited classes",
        "Lecture audio transcription",
        "RAG-grounded study guides",
        "Exam score prediction",
        "Spaced repetition (SM-2)",
        "Smart calendar",
        "Grade optimisation tips",
      ],
      missing: [],
    },
    {
      name: "Pro",
      price: "Pro",
      period: "pricing TBD",
      desc: "For power users and serious grade climbers.",
      color: "border-[#EEEDFE]",
      btn: "bg-white border-2 border-[#534AB7] text-[#534AB7] hover:bg-[#EEEDFE]",
      features: [
        "Everything in Student",
        "Per-student prediction calibration (improves over time)",
        "Cross-semester history",
        "Priority support",
        "Early access to new features",
      ],
      missing: [],
    },
  ];

  return (
    <section id="pricing" className="py-10 bg-[#fafafe] border-t border-[#EEEDFE]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#EEEDFE] border border-[#ABA9FA]/40 rounded-full px-3.5 py-1 mb-4">
            <span className="text-xs font-semibold text-[#534AB7]">Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#18172B] mb-3">Simple, student-first pricing</h2>
          <p className="text-[#6B6A8A] font-light">Pricing is being finalised. Join the waitlist to be notified at launch.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((p, i) => (
            <div key={i} className={`bg-white rounded-3xl border-2 ${p.color} p-6 relative flex flex-col`}>
              {(p as any).badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#534AB7] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
                  {(p as any).badge}
                </div>
              )}
              <div className="mb-5">
                <p className="text-[11px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-1">{p.name}</p>
                <div className="mb-2">
                  <span className="inline-flex items-center gap-1.5 bg-[#EEEDFE] text-[#534AB7] text-xs font-extrabold px-3 py-1.5 rounded-full">{p.period === "to start" ? "🎓 Free to start" : "⏳ Pricing coming soon"}</span>
                </div>
                <p className="text-sm text-[#6B6A8A] font-light">{p.desc}</p>
              </div>

              <ul className="space-y-2 mb-5 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#18172B]">
                    <span className="text-[#534AB7] mt-0.5 flex-shrink-0">✓</span> {f}
                  </li>
                ))}
                {p.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#9B9AB5]">
                    <span className="mt-0.5 flex-shrink-0">✗</span> {f}
                  </li>
                ))}
              </ul>

              <a href="/signup" className={`w-full text-center py-3 rounded-2xl text-sm font-bold transition-all ${p.btn}`}>
                {p.name === "Free" ? "Get started free" : "Join waitlist"}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#9B9AB5] mt-6">
          All plans include FERPA &amp; GDPR compliance · No ads · No data selling
        </p>
      </div>
    </section>
  );
}

function CTA() {
  return (
   <section className="py-5 bg-white border-t border-[#EEEDFE]">
  <div className="max-w-5xl mx-auto px-6">
    <div
      className="relative rounded-3xl overflow-hidden min-h-[420px] flex items-center"
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
          Drop your syllabus. Get a ranked study plan calibrated to your class, your professor's signals, and your real schedule.
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
        { label: "Features",     href: "/#features"       },
        { label: "How it works", href: "/#how-it-works"   },
        { label: "Pricing",      href: "/pricing"          },
        { label: "Changelog",    href: "/help"             },
      ],
    },
    {
      title: "App",
      links: [
        { label: "Dashboard",    href: "/home"             },
        { label: "My Classes",   href: "/classes"          },
        { label: "Study Plan",   href: "/study-plan"       },
        { label: "Grades",       href: "/grades"           },
        { label: "Analytics",    href: "/analytics"        },
        { label: "Calendar",     href: "/calendar"         },
      ],
    },
    {
      title: "Tools",
      links: [
        { label: "Study Guide",  href: "/study-guide"      },
        { label: "Flashcards",   href: "/flashcards"       },
        { label: "Quiz",         href: "/quiz"             },
        { label: "Exam Mode",    href: "/exam-mode"        },
        { label: "Upload",       href: "/upload"           },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Sign up",      href: "/signup"           },
        { label: "Log in",       href: "/login"            },
        { label: "Settings",     href: "/settings/profile" },
        { label: "Notifications",href: "/settings/notifications" },
        { label: "Privacy",      href: "/settings/privacy" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help centre",  href: "/help"             },
        { label: "Pricing",      href: "/pricing"          },
        { label: "Privacy policy", href: "/settings/privacy" },
        { label: "Terms of use", href: "/help"             },
      ],
    },
  ];

  return (
    <footer className="bg-[#18172B] text-white pt-14 pb-8">
      <div className="max-w-6xl mx-auto px-6">

        {/* Top row — logo + tagline + link groups */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-12">

          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#534AB7] flex items-center justify-center shadow-lg">
                <span className="text-white font-extrabold text-sm">A</span>
              </div>
              <span className="font-extrabold text-white tracking-wide">Atlas</span>
            </div>
            <p className="text-xs text-[#8B8AAB] leading-relaxed">
              The AI academic OS for college students. One ranked plan, every day.
            </p>
            <Link href="/signup"
              className="mt-4 inline-block bg-[#534AB7] hover:bg-[#3C3489] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all">
              Get started free
            </Link>
          </div>

          {/* Link groups */}
          {groups.map((g) => (
            <div key={g.title}>
              <p className="text-[11px] font-extrabold text-[#534AB7] uppercase tracking-widest mb-3">{g.title}</p>
              <ul className="space-y-2">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}
                      className="text-xs text-[#8B8AAB] hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#2E2D45] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#5C5B78]">© 2026 Atlas · Academic OS · All rights reserved</p>
          <div className="flex items-center gap-5">
            {[
              { label: "Privacy policy", href: "/settings/privacy" },
              { label: "Terms of use",   href: "/help"             },
              { label: "Help centre",    href: "/help"             },
              { label: "Pricing",        href: "/pricing"          },
            ].map((l) => (
              <Link key={l.label} href={l.href}
                className="text-xs text-[#5C5B78] hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-[#5C5B78]">FERPA & GDPR compliant · No ads</p>
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
  <main className="bg-white relative overflow-hidden">
  <Navbar />

  {/* RIGHT FLOAT IMAGE */}

  <Hero />
  <Features />
  <HowItWorks />
  <Comparison />
  {/* <Pricing /> */}
  <Testimonials />
  <CTA />
  <Footer />
</main>
  );
}
