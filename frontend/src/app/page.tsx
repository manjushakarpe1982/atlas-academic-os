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
          {["Features","How it works","Pricing"].map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`}
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
        Upload your syllabus, discover weak topics,
        build smart study plans, and improve faster
        with AI-powered learning guidance.
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
        {["AI Powered", "Adaptive", "Track Progress"].map((item) => (
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
        <p className="text-xs text-gray-500">Accuracy</p>
        <h3 className="text-xl font-bold text-[#635BFF]">82%</h3>
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
      title: "Get your plan",
      desc: "Atlas creates your smart study plan",
      bg: "from-pink-500 to-rose-500",
      iconColor: "text-white",
      glow: "shadow-pink-300/40",
    },
    {
      n: 3,
      icon: Target,
      title: "Start studying",
      desc: "Follow your plan and achieve goals",
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
            Start in
            <span className="text-[#534AB7]"> 3 simple steps</span>
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
function Testimonials() {
  const items = [
    { q:"It told me to study mitosis because Smith mentioned it three times and I missed two enzyme questions on Quiz 3. It's not guessing.",   name:"Priya Sharma",   role:"Pre-med student",     term:"Fall 2026" },
    { q:"It predicted I'd score 87 on Exam 2. I scored 89. It's accurate enough that I trust it completely now.",                              name:"Aditya Thomas",  role:"Biology student",     term:"Fall 2026" },
    { q:"The study guides it creates are sourced directly from my professor's lectures — not random internet stuff. That matters enormously.",   name:"Sara Khan",      role:"Engineering student", term:"Fall 2026" },
  ];
  return (
    <section className="py-8 border-t border-[#EEEDFE]" style={{ background:"#fafafe" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#EEEDFE] border border-[#ABA9FA]/40 rounded-full px-3.5 py-1 mb-4">
            <Star className="w-3 h-3 text-[#534AB7]" />
            <span className="text-xs font-semibold text-[#534AB7]">4.9 out of 5 stars</span>
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
          Join thousands of students who study smarter — not harder.
          Drop your syllabus and get your personalised plan.
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
  return (
    <footer className="bg-white border-t border-[#EEEDFE] py-4">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#534AB7] flex items-center justify-center shadow-sm">
            <span className="text-white font-extrabold text-xs">A</span>
          </div>
          <span className="text-sm font-medium text-[#9B9AB5]">© 2026 Atlas · Academic OS</span>
        </div>
        <div className="flex items-center gap-6">
          {["Privacy","Terms","Support","For universities"].map((l) => (
            <a key={l} href="#" className="text-xs font-medium text-[#9B9AB5] hover:text-[#534AB7] transition-colors">{l}</a>
          ))}
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
  <img
    src="https://res.cloudinary.com/mview/image/upload/atlas/landingpage-4.webp"
    alt=""
    className="
      absolute
      right-2 sm:right-6 md:right-12 lg:right-[18%]
      top-[18%] sm:top-[22%] md:top-[24%] lg:top-[25%]
      -translate-y-1/2
      w-14 sm:w-20 md:w-32 lg:w-44
      h-auto
      rotate-[8deg]
      opacity-95
      z-20
      pointer-events-none
      drop-shadow-2xl
      rounded-2xl
      hidden lg:block
    "
  />

  {/* LEFT FLOAT IMAGE */}
  {/* <img
    src="https://res.cloudinary.com/mview/image/upload/atlas/landingpage-5.webp"
    alt=""
    className="
      absolute
      left-2 sm:left-6 md:left-12 lg:left-[19%]
      top-[20%] sm:top-[23%] md:top-[25%] lg:top-[26%]
      -translate-y-1/2
      w-14 sm:w-20 md:w-32 lg:w-40
      h-auto
      -rotate-[8deg]
      opacity-95
      z-20
      pointer-events-none
      drop-shadow-2xl
      rounded-2xl
      hidden lg:block
    "
  /> */}

  <Hero />
  <Features />
  <HowItWorks />
  <Testimonials />
  <CTA />
  <Footer />
</main>
  );
}
