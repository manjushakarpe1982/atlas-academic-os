"use client";

import Link from "next/link";
import { CheckCircle2, X, ArrowLeft } from "lucide-react";

const plans = [
  {
    name: "Free",
    period: "to start",
    badge: null,
    desc: "Get started and see the plan.",
    color: "border-[#EEEDFE]",
    btn: "bg-white border-2 border-[#534AB7] text-[#534AB7] hover:bg-[#EEEDFE]",
    ctaLabel: "Get started free",
    ctaHref: "/signup",
    features: [
      "1 class workspace",
      "Syllabus parsing",
      "Daily study plan",
      "Basic flashcards & quiz",
      "Grade tracking",
    ],
    missing: [
      "Lecture transcription",
      "RAG study guides",
      "Exam prediction",
    ],
  },
  {
    name: "Student",
    period: "pricing TBD",
    badge: "Most popular",
    desc: "Everything you need for a full semester.",
    color: "border-[#534AB7] shadow-2xl shadow-[#534AB7]/10",
    btn: "bg-[#534AB7] hover:bg-[#3C3489] text-white",
    ctaLabel: "Join waitlist",
    ctaHref: "/signup",
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
    period: "pricing TBD",
    badge: null,
    desc: "For power users and serious grade climbers.",
    color: "border-[#EEEDFE]",
    btn: "bg-white border-2 border-[#534AB7] text-[#534AB7] hover:bg-[#EEEDFE]",
    ctaLabel: "Join waitlist",
    ctaHref: "/signup",
    features: [
      "Everything in Student",
      "Per-student prediction calibration",
      "Cross-semester history",
      "Priority support",
      "Early access to new features",
    ],
    missing: [],
  },
];

const faqs = [
  {
    q: "When will pricing be finalised?",
    a: "We are still in development. Join the waitlist and you will be the first to know when pricing is confirmed.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes. You can upgrade or downgrade at any time. We will make the process straightforward.",
  },
  {
    q: "Is my data safe?",
    a: "All plans include FERPA and GDPR compliance. We do not sell data or show ads.",
  },
  {
    q: "What counts as a class workspace?",
    a: "One class workspace means one course — its syllabus, files, grades, and study plan. The Free plan supports one class at a time.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#fafafe]">

      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-[#EEEDFE]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#534AB7] flex items-center justify-center">
              <span className="text-white font-extrabold text-xs">A</span>
            </div>
            <span className="font-extrabold text-[#18172B] tracking-wide text-sm">Atlas</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 text-sm text-[#6B6A8A] hover:text-[#534AB7] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
            <Link href="/signup" className="bg-[#534AB7] hover:bg-[#3C3489] text-white text-sm font-bold px-4 py-2 rounded-xl transition-all">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="text-center pt-16 pb-10 px-6">
        <div className="inline-flex items-center gap-2 bg-[#EEEDFE] border border-[#ABA9FA]/40 rounded-full px-3.5 py-1 mb-5">
          <span className="text-xs font-semibold text-[#534AB7]">Pricing</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#18172B] mb-3 tracking-tight">
          Simple, student-first pricing
        </h1>
        <p className="text-[#6B6A8A] text-lg font-light max-w-md mx-auto">
          Pricing is being finalised. Join the waitlist to be notified at launch.
        </p>
      </div>

      {/* ── Plans ──────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-5 items-start">
          {plans.map((p, i) => (
            <div key={i}
              className={`bg-white rounded-3xl border-2 ${p.color} p-6 relative flex flex-col ${
                p.badge ? "md:-mt-3 md:pb-9" : ""
              }`}>

              {/* Most popular badge */}
              {p.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#534AB7] text-white text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                  {p.badge}
                </div>
              )}

              {/* Plan header */}
              <div className="mb-5">
                <p className="text-[11px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-2">{p.name}</p>
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-[#EEEDFE] text-[#534AB7] text-xs font-extrabold px-3 py-1.5 rounded-full">
                    {p.period === "to start" ? "🎓 Free to start" : "⏳ Pricing coming soon"}
                  </span>
                </div>
                <p className="text-sm text-[#6B6A8A] leading-relaxed">{p.desc}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#18172B]">
                    <CheckCircle2 className="w-4 h-4 text-[#534AB7] mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
                {p.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#C4C3D8]">
                    <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href={p.ctaHref}
                className={`w-full text-center py-3 rounded-2xl text-sm font-bold transition-all block ${p.btn}`}>
                {p.ctaLabel}
              </Link>
            </div>
          ))}
        </div>

        {/* Compliance note */}
        <p className="text-center text-xs text-[#9B9AB5] mt-6">
          All plans include FERPA & GDPR compliance · No ads · No data selling
        </p>

        {/* ── Feature comparison table ───────────────────── */}
        <div className="mt-16">
          <h2 className="text-2xl font-extrabold text-[#18172B] text-center mb-8">Compare plans</h2>
          <div className="bg-white rounded-3xl border border-[#EEEDFE] overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-4 border-b border-[#EEEDFE]">
              <div className="p-4 text-sm font-semibold text-[#6B6A8A]">Feature</div>
              {["Free", "Student", "Pro"].map((n) => (
                <div key={n} className="p-4 text-center">
                  <p className="text-xs font-extrabold text-[#9B9AB5] uppercase tracking-widest">{n}</p>
                </div>
              ))}
            </div>
            {/* Rows */}
            {[
              ["Syllabus parsing",                       true,  true,  true  ],
              ["Daily ranked study plan",                true,  true,  true  ],
              ["Basic flashcards & quiz",                true,  true,  true  ],
              ["Grade tracking",                         true,  true,  true  ],
              ["Number of classes",                     "1",   "∞",   "∞"   ],
              ["Lecture transcription",                  false, true,  true  ],
              ["RAG-grounded study guides",              false, true,  true  ],
              ["Exam score prediction",                  false, true,  true  ],
              ["Spaced repetition (SM-2)",               false, true,  true  ],
              ["Smart calendar",                         false, true,  true  ],
              ["Per-student prediction calibration",     false, false, true  ],
              ["Cross-semester history",                 false, false, true  ],
              ["Priority support",                       false, false, true  ],
              ["Early access to new features",           false, false, true  ],
            ].map(([label, free, student, pro], i) => (
              <div key={i} className={`grid grid-cols-4 ${i % 2 === 0 ? "bg-white" : "bg-[#fafafe]"} border-b border-[#EEEDFE] last:border-0`}>
                <div className="p-3.5 text-sm text-[#18172B]">{label}</div>
                {[free, student, pro].map((val, j) => (
                  <div key={j} className="p-3.5 flex items-center justify-center">
                    {val === true  && <CheckCircle2 className="w-4 h-4 text-[#534AB7]" />}
                    {val === false && <X className="w-4 h-4 text-[#C4C3D8]" />}
                    {typeof val === "string" && <span className="text-sm font-bold text-[#534AB7]">{val}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ───────────────────────────────────────────── */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[#18172B] text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#EEEDFE] p-5">
                <p className="font-bold text-[#18172B] mb-1.5 text-sm">{f.q}</p>
                <p className="text-sm text-[#6B6A8A] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ────────────────────────────────────── */}
        <div className="mt-16 bg-[#534AB7] rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-2">Free to start, no credit card needed</h2>
          <p className="text-[#C5C1F5] mb-6 text-sm">Drop your syllabus and get your first ranked study plan in minutes.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/signup"
              className="bg-white text-[#534AB7] font-extrabold px-7 py-3 rounded-2xl text-sm hover:bg-[#EEEDFE] transition-all">
              Get started free
            </Link>
            <Link href="/"
              className="border border-white/40 text-white font-semibold px-7 py-3 rounded-2xl text-sm hover:bg-white/10 transition-all">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
