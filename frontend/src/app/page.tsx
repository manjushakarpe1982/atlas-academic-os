"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight, BookOpen, Brain, Calendar, CheckCircle2,
  ChevronRight, Clock, GraduationCap, LineChart, Menu,
  Mic, Sparkles, Star, Target, Trophy, X, Zap,
} from "lucide-react";

/* ─── Navbar — NO animations, just scroll shadow ─────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#ffffff",
        borderBottom: scrolled
          ? "1px solid rgba(83,74,183,0.12)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 16px rgba(83,74,183,0.06)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl btn-primary flex items-center justify-center shadow-md shadow-brand-500/20">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-lg text-[#18172B] tracking-tight">Atlas</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it works", "Pricing"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm font-medium text-[#6B6A8A] hover:text-[#534AB7] transition-colors duration-150"
            >
              {l}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-[#6B6A8A] hover:text-[#534AB7] px-4 py-2 rounded-xl hover:bg-[#EEEDFE] transition-all duration-150"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="btn-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#534AB7]/20"
          >
            Get started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-[#6B6A8A] hover:bg-[#EEEDFE] transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden bg-white border-t border-[#EEEDFE] px-6 py-5 space-y-3 animate-fade-in"
          style={{ boxShadow: "0 8px 24px rgba(83,74,183,0.08)" }}
        >
          {["Features", "How it works", "Pricing"].map((l) => (
            <a
              key={l}
              href="#"
              className="block text-sm font-medium text-[#6B6A8A] py-1.5"
              onClick={() => setOpen(false)}
            >
              {l}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-[#EEEDFE]">
            <Link href="/login" className="text-sm font-semibold text-center text-[#6B6A8A] py-2">
              Log in
            </Link>
            <Link
              href="/signup"
              className="btn-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl text-center"
            >
              Get started free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Hero ────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative bg-white overflow-hidden" style={{ paddingTop: 80, paddingBottom: 80 }}>
      {/* Very subtle orbs */}
      <div className="orb w-[500px] h-[500px] bg-[#EEEDFE] -top-40 -left-40 opacity-60" />
      <div className="orb w-[400px] h-[400px] bg-[#EEE0FD] top-1/2 -right-40 opacity-50" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#EEEDFE] border border-[#ABA9FA] rounded-full px-4 py-1.5 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-[#534AB7]" />
          <span className="text-xs font-semibold text-[#534AB7]">
            AI-powered academic OS for college students
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        </div>

        {/* Headline — no animation class */}
        <h1
          className="text-5xl md:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6 text-[#18172B]"
        >
          Stop wondering<br />
          what to study next.<br />
          <span className="gradient-text">Atlas tells you.</span>
        </h1>

        {/* Sub — no animation class */}
        <p className="text-lg md:text-xl text-[#6B6A8A] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Drop your syllabus. Atlas reads your lectures, tracks your grades, and builds a
          daily study plan calibrated to your exact classes — backed by evidence, not guesswork.
        </p>

        {/* CTAs — no animation class */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/signup"
            className="btn-primary text-white font-bold px-8 py-4 rounded-2xl text-base flex items-center gap-2.5 w-full sm:w-auto justify-center shadow-xl shadow-[#534AB7]/20"
          >
            <Zap className="w-4 h-4" />
            Start free — 60 seconds
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how-it-works"
            className="bg-white text-[#6B6A8A] hover:text-[#534AB7] font-medium px-8 py-4 rounded-2xl text-base flex items-center gap-2 w-full sm:w-auto justify-center border border-[#D5D3FD] hover:border-[#534AB7]/40 transition-all duration-200 shadow-sm"
          >
            See how it works <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Trust row — no animation */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#9B9AB5]">
          {["No credit card", "Any university", "FERPA compliant", "No ads, ever"].map((t) => (
            <span key={t} className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              {t}
            </span>
          ))}
        </div>

        {/* Floating plan preview — float animation is fine (not a header element) */}
        <div className="mt-16 max-w-sm mx-auto">
          <div
            className="animate-float bg-white rounded-2xl p-5 text-left border border-[#D5D3FD]"
            style={{ boxShadow: "0 24px 64px rgba(83,74,183,0.12)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-[#9B9AB5]">Tuesday · 2.5 hrs available</span>
            </div>
            <div className="bg-[#EEEDFE] border border-[#ABA9FA]/40 rounded-xl p-3.5 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-[#534AB7] uppercase tracking-widest">Biology 101</span>
                <span className="text-[10px] font-medium text-[#9B9AB5]">45 min</span>
              </div>
              <p className="text-sm font-bold text-[#18172B]">Review Mitosis</p>
              <p className="text-[11px] text-[#6B6A8A] mt-0.5">Exam Thursday · weakest topic · on review sheet</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { c: "Statistics", t: "PS #4",  m: "40m" },
                { c: "English",    t: "Essay",  m: "20m" },
                { c: "History",    t: "Ch. 7",  m: "15m" },
              ].map((x) => (
                <div key={x.c} className="bg-[#F8F7FF] rounded-lg p-2.5 border border-[#EEEDFE]">
                  <p className="text-[9px] font-bold text-[#9B9AB5] uppercase mb-0.5">{x.c}</p>
                  <p className="text-xs font-semibold text-[#18172B]">{x.t}</p>
                  <p className="text-[10px] text-[#9B9AB5]">{x.m}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Stats ───────────────────────────────────────────────────── */
function Stats() {
  const items = [
    { icon: GraduationCap, value: "12,000+", label: "Active students"        },
    { icon: Trophy,         value: "+0.5",    label: "Avg letter grade lift"  },
    { icon: Clock,          value: "60 sec",  label: "To first study plan"    },
    { icon: Star,           value: "4.9 / 5", label: "Student satisfaction"   },
  ];
  return (
    <section className="bg-white border-y border-[#EEEDFE]">
      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEEDFE] border border-[#ABA9FA]/30 flex items-center justify-center flex-shrink-0">
              <s.icon style={{ width: 18, height: 18 }} className="text-[#534AB7]" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#18172B] leading-tight">{s.value}</p>
              <p className="text-xs font-medium text-[#9B9AB5]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Features ────────────────────────────────────────────────── */
const FEATURES = [
  { icon: Target,    grad: "from-violet-500 to-[#534AB7]",  title: "Daily ranked plan",      tag: "Core",          desc: "Ranked by grade impact, not anxiety. Tells you exactly what to study, for how long, and why." },
  { icon: Brain,     grad: "from-blue-500 to-cyan-500",     title: "Grounded study guides",  tag: "RAG-powered",   desc: "Built from your own files, not the internet. Every claim cites your professor's lecture." },
  { icon: LineChart, grad: "from-green-500 to-emerald-500", title: "Grade prediction",       tag: "Predictive AI", desc: "Predicts your exam score, projects your final grade, and identifies the highest-leverage move." },
  { icon: Mic,       grad: "from-orange-500 to-amber-500",  title: "Lecture transcription",  tag: "Whisper AI",    desc: "Upload audio — Atlas transcribes with timestamps and detects what your professor emphasised." },
  { icon: BookOpen,  grad: "from-pink-500 to-rose-500",     title: "Active study tools",     tag: "SM-2",          desc: "Flashcards, quizzes, SM-2 spaced repetition — all generated from your own materials." },
  { icon: Calendar,  grad: "from-teal-500 to-cyan-600",     title: "Smart calendar",         tag: "Auto-schedule", desc: "Knows your classes, gym, sleep, and commute. Study blocks fit around your real life." },
];

function Features() {
  return (
    <section id="features" className="bg-white py-28">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#EEEDFE] border border-[#ABA9FA]/40 rounded-full px-3.5 py-1 mb-5">
            <Sparkles className="w-3 h-3 text-[#534AB7]" />
            <span className="text-xs font-semibold text-[#534AB7]">Everything you need</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#18172B] mb-4">
            Built for serious students
          </h2>
          <p className="text-[#6B6A8A] max-w-lg mx-auto text-lg font-light">
            Not another calendar app. Atlas is the first tool that tells you{" "}
            <em className="text-[#534AB7] not-italic font-semibold">why</em> to study something.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-[#EEEDFE] card-hover"
              style={{ boxShadow: "0 2px 12px rgba(83,74,183,0.05)" }}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.grad} flex items-center justify-center mb-4 shadow-md`}>
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-[15px] font-bold text-[#18172B]">{f.title}</h3>
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

/* ─── How it works ────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: "01", icon: GraduationCap, title: "Drop your syllabus",   desc: "Upload PDF, DOCX, or TXT. Atlas extracts every deadline, grade weight, and professor detail in under 15 seconds." },
    { n: "02", icon: Mic,           title: "Upload your materials", desc: "Recordings, slides, notes, past quizzes. Atlas transcribes, indexes, and detects professor emphasis automatically." },
    { n: "03", icon: Target,        title: "Get your daily plan",   desc: "Open Atlas each day. See exactly what to study, for how long, and why — AI reasoning always shown." },
  ];
  return (
    <section id="how-it-works" className="bg-[#FAFAFE] py-28 border-t border-[#EEEDFE]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#18172B] mb-4">
            Up and running in 60 seconds
          </h2>
          <p className="text-[#6B6A8A] max-w-md mx-auto font-light">Three steps. Then Atlas handles the rest.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <div className="relative inline-flex mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-[#D5D3FD] flex items-center justify-center" style={{ boxShadow: "0 4px 16px rgba(83,74,183,0.1)" }}>
                  <s.icon className="w-7 h-7 text-[#534AB7]" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full btn-primary text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                  {s.n}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#18172B] mb-2">{s.title}</h3>
              <p className="text-sm text-[#6B6A8A] leading-relaxed font-light">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ────────────────────────────────────────────── */
function Testimonials() {
  const items = [
    { q: "It told me to study mitosis because Smith mentioned it three times and I missed two enzyme questions on Quiz 3. It's not guessing.", name: "Pre-med student",     term: "Fall 2026" },
    { q: "It predicted I'd score 87 on Exam 2. I scored 89. Accurate enough that I trust it completely now.",                               name: "Biology student",     term: "Fall 2026" },
    { q: "It knows I have lab Tuesday, gym Thursday, essay Monday — so it spread my prep across the right hours.",                          name: "Engineering student", term: "Fall 2026" },
  ];
  return (
    <section className="bg-white py-28 border-t border-[#EEEDFE]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#18172B] mb-3">
            Students trust the plan
          </h2>
          <p className="text-[#6B6A8A] font-light">Real results. Visible reasoning.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-[#EEEDFE] card-hover"
              style={{ boxShadow: "0 2px 12px rgba(83,74,183,0.05)" }}
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-[#6B6A8A] italic leading-relaxed mb-5 font-light">&ldquo;{t.q}&rdquo;</p>
              <div>
                <p className="text-sm font-bold text-[#18172B]">{t.name}</p>
                <p className="text-xs font-medium text-[#9B9AB5] mt-0.5">{t.term}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="bg-[#FAFAFE] py-28 border-t border-[#EEEDFE]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div
          className="bg-white rounded-3xl p-10 md:p-16 border border-[#D5D3FD] relative overflow-hidden"
          style={{ boxShadow: "0 8px 48px rgba(83,74,183,0.10)" }}
        >
          <div className="orb w-72 h-72 bg-[#EEEDFE] -top-24 left-1/2 -translate-x-1/2 opacity-80" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#EEEDFE] border border-[#ABA9FA]/40 rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-3.5 h-3.5 text-[#534AB7]" />
              <span className="text-xs font-semibold text-[#534AB7]">Free to start</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#18172B] mb-4">
              Ready to stop<br />
              <span className="gradient-text">guessing?</span>
            </h2>
            <p className="text-[#6B6A8A] mb-8 max-w-sm mx-auto font-light">
              Drop your syllabus. Get your first study plan in under 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup"
                className="btn-primary text-white font-bold px-8 py-4 rounded-2xl text-base flex items-center gap-2 justify-center shadow-xl shadow-[#534AB7]/20">
                <Zap className="w-4 h-4" /> Get started free
              </Link>
              <Link href="/login"
                className="bg-white text-[#6B6A8A] hover:text-[#534AB7] font-medium px-8 py-4 rounded-2xl text-base flex items-center gap-2 justify-center border border-[#D5D3FD] hover:border-[#534AB7]/40 transition-all duration-200">
                Log in <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-xs font-medium text-[#9B9AB5] mt-5">
              No credit card · No ads · FERPA &amp; GDPR compliant
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-white border-t border-[#EEEDFE] py-10">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg btn-primary flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xs">A</span>
          </div>
          <span className="text-sm font-medium text-[#9B9AB5]">© 2026 Atlas · Academic OS</span>
        </div>
        <div className="flex items-center gap-6">
          {["Privacy", "Terms", "Support", "For universities"].map((l) => (
            <a key={l} href="#" className="text-xs font-medium text-[#9B9AB5] hover:text-[#534AB7] transition-colors">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-white">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
