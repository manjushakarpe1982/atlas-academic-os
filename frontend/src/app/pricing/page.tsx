"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Check, X, ArrowRight, Sparkles, BookOpen, GraduationCap, Bot,
  ChevronDown, ChevronUp,
} from "lucide-react";
import SiteNav from "@/components/SiteNav";


/* ─────────────────────────────────────────────────────────────
 * Plans data
 * ───────────────────────────────────────────────────────────── */
type Plan = {
  name: string;
  forWho: string;
  iconBg: string;
  icon: typeof BookOpen;
  monthly: number;
  yearly: number;
  popular?: boolean;
  cta: string;
  ctaHref: string;
  ctaStyle: "primary" | "outline";
  features: { label: string; included: boolean }[];
};

const PLANS: Plan[] = [
  {
    name: "Free",
    forWho: "For getting started",
    iconBg: "bg-violet-100 text-[#534AB7]",
    icon: BookOpen,
    monthly: 0,
    yearly: 0,
    cta: "Get started free",
    ctaHref: "/signup",
    ctaStyle: "outline",
    features: [
      { label: "3 AI study topics per day",   included: true },
      { label: "Basic study planner",         included: true },
      { label: "Limited deadlines",           included: true },
      { label: "Community support",           included: true },
      { label: "Advanced AI insights",        included: false },
      { label: "Unlimited topics",            included: false },
      { label: "Priority support",            included: false },
    ],
  },
  {
    name: "Pro",
    forWho: "For serious students",
    iconBg: "bg-[#534AB7] text-white",
    icon: GraduationCap,
    monthly: 6.99,
    yearly: 5.59, // ~20% off
    popular: true,
    cta: "Get Pro",
    ctaHref: "/signup?plan=pro",
    ctaStyle: "primary",
    features: [
      { label: "Unlimited AI study topics",            included: true },
      { label: "Smart study planner",                  included: true },
      { label: "Unlimited deadlines",                  included: true },
      { label: "Advanced AI insights",                 included: true },
      { label: "Progress & performance analytics",     included: true },
      { label: "Priority support",                     included: true },
    ],
  },
  {
    name: "Exams",
    forWho: "For exam achievers",
    iconBg: "bg-orange-100 text-orange-500",
    icon: Sparkles,
    monthly: 12.99,
    yearly: 10.39,
    cta: "Get Exams",
    ctaHref: "/signup?plan=exams",
    ctaStyle: "outline",
    features: [
      { label: "Everything in Pro",                    included: true },
      { label: "Past papers & solutions",              included: true },
      { label: "AI exam predictions",                  included: true },
      { label: "Advanced performance report",          included: true },
      { label: "1-on-1 strategy call",                 included: true },
      { label: "Priority exam support",                included: true },
    ],
  },
];

const COMPARE_ROWS: { feature: string; free: React.ReactNode; pro: React.ReactNode; exams: React.ReactNode }[] = [
  { feature: "AI study topics per day",       free: "3",           pro: "Unlimited",  exams: "Unlimited" },
  { feature: "Smart study planner",           free: <X className="w-4 h-4 text-gray-300 mx-auto" />, pro: <Check className="w-4 h-4 text-emerald-500 mx-auto" />, exams: <Check className="w-4 h-4 text-emerald-500 mx-auto" /> },
  { feature: "Deadline reminders",            free: "Limited",     pro: "Unlimited",  exams: "Unlimited" },
  { feature: "AI insights & recommendations", free: <X className="w-4 h-4 text-gray-300 mx-auto" />, pro: <Check className="w-4 h-4 text-emerald-500 mx-auto" />, exams: <Check className="w-4 h-4 text-emerald-500 mx-auto" /> },
  { feature: "Progress analytics",            free: <X className="w-4 h-4 text-gray-300 mx-auto" />, pro: <Check className="w-4 h-4 text-emerald-500 mx-auto" />, exams: <Check className="w-4 h-4 text-emerald-500 mx-auto" /> },
  { feature: "Past papers & solutions",       free: <X className="w-4 h-4 text-gray-300 mx-auto" />, pro: <X className="w-4 h-4 text-gray-300 mx-auto" />, exams: <Check className="w-4 h-4 text-emerald-500 mx-auto" /> },
  { feature: "AI exam predictions",           free: <X className="w-4 h-4 text-gray-300 mx-auto" />, pro: <X className="w-4 h-4 text-gray-300 mx-auto" />, exams: <Check className="w-4 h-4 text-emerald-500 mx-auto" /> },
  { feature: "1-on-1 strategy call",          free: <X className="w-4 h-4 text-gray-300 mx-auto" />, pro: <X className="w-4 h-4 text-gray-300 mx-auto" />, exams: <Check className="w-4 h-4 text-emerald-500 mx-auto" /> },
  { feature: "Priority support",              free: <X className="w-4 h-4 text-gray-300 mx-auto" />, pro: <Check className="w-4 h-4 text-emerald-500 mx-auto" />, exams: <Check className="w-4 h-4 text-emerald-500 mx-auto" /> },
];

const FAQ = [
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, UPI, net banking, and digital wallets.",
  },
  {
    q: "Can I change my plan later?",
    a: "Yes. You can upgrade or downgrade your plan at any time from your account settings — no hidden fees, prorated automatically.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. We use enterprise-grade encryption and never share or sell your data. We are GDPR-compliant and you can export or delete your data anytime.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes — we offer a 7-day money-back guarantee on all paid plans. If Atlas isn't right for you, just email support within 7 days for a full refund.",
  },
];

/* ─────────────────────────────────────────────────────────────
 * Plan card
 * ───────────────────────────────────────────────────────────── */
function PlanCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const price = yearly ? plan.yearly : plan.monthly;
  const originalPrice = yearly ? plan.monthly : null;

  return (
    <div className={`relative bg-white rounded-3xl border-2 shadow-sm p-7 flex flex-col ${
      plan.popular
        ? "border-[#534AB7] shadow-xl shadow-[#534AB7]/15 bg-gradient-to-b from-[#F7F5FF] to-white"
        : "border-[#ECE9FF]"
    }`}>
      {/* Most popular ribbon */}
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#534AB7] text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-full shadow-md">
          Most popular
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-xl font-extrabold text-[#14142B] mb-1">{plan.name}</h3>
          <p className="text-[12.5px] text-[#6B6A8A]">{plan.forWho}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${plan.iconBg} flex items-center justify-center flex-shrink-0`}>
          <plan.icon className="w-5 h-5" />
        </div>
      </div>

      {/* Price */}
      <div className="mb-5">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-[#14142B]">
            ${price.toFixed(price === Math.floor(price) ? 0 : 2)}
          </span>
          {originalPrice !== null && originalPrice > 0 && (
            <span className="text-base text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
          )}
          <span className="text-sm text-[#6B6A8A]">/ month</span>
        </div>
        <p className="text-[11.5px] text-[#9B9AB5] mt-1">
          {price === 0 ? "Free forever" : yearly ? "Billed yearly" : "Billed monthly"}
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-2.5 mb-7 flex-1">
        {plan.features.map((f) => (
          <li key={f.label} className="flex items-start gap-2.5">
            {f.included ? (
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                <Check className="w-2.5 h-2.5 text-emerald-600" strokeWidth={3.5} />
              </span>
            ) : (
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                <X className="w-2.5 h-2.5 text-gray-400" strokeWidth={3} />
              </span>
            )}
            <span className={`text-[13px] leading-snug ${
              f.included ? "text-[#3A3A52]" : "text-[#A8A6BD]"
            }`}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={plan.ctaHref}
        className={`w-full text-center font-extrabold text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
          plan.ctaStyle === "primary"
            ? "bg-[#534AB7] hover:bg-[#3C3489] text-white shadow-lg shadow-[#534AB7]/25"
            : "bg-white border-2 border-[#E8E5FD] text-[#534AB7] hover:bg-[#F4F2FF]"
        }`}
      >
        {plan.ctaStyle === "primary" && <ArrowRight className="w-4 h-4" />}
        {plan.cta}
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * FAQ item (accordion)
 * ───────────────────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-[#ECE9FF] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-left px-5 py-4 hover:bg-[#FAFAFE] transition-colors"
      >
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#534AB7] text-white text-[11px] font-extrabold flex items-center justify-center mt-0.5">
            ?
          </span>
          <span className="text-sm font-bold text-[#14142B]">{q}</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[#6B6A8A] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#6B6A8A] flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 pt-1 pl-14 text-[13px] text-[#6B6A8A] leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Page
 * ───────────────────────────────────────────────────────────── */
export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <main className="bg-[#F7F6FF] min-h-screen">

      <SiteNav />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-[1180px] mx-auto px-5 pt-14 pb-10 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#F4F2FF] border border-[#E8E5FD] text-[#534AB7] text-[11px] font-bold px-3.5 py-1.5 mb-5">
          <Sparkles className="w-3.5 h-3.5" /> Pricing
        </span>
        <h1 className="text-4xl md:text-[44px] font-extrabold text-[#14142B] mb-3 leading-tight">
          Simple, student-first pricing
        </h1>
        <p className="text-[15px] text-[#6B6A8A] max-w-xl mx-auto mb-7 leading-relaxed">
          Pick the plan that works for you. Upgrade or downgrade anytime — no hidden fees.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-3 bg-white border border-[#ECE9FF] rounded-full pl-5 pr-2 py-2 shadow-sm">
          <span className={`text-[13px] font-bold transition-colors ${
            !yearly ? "text-[#14142B]" : "text-[#9B9AB5]"
          }`}>
            Monthly
          </span>

          {/* Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            onClick={() => setYearly((y) => !y)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
              yearly ? "bg-[#534AB7]" : "bg-[#E2DFF5]"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                yearly ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </button>

          <span className={`text-[13px] font-bold transition-colors ${
            yearly ? "text-[#14142B]" : "text-[#9B9AB5]"
          }`}>
            Yearly
          </span>

          <span className="bg-[#F4F2FF] text-[#534AB7] text-[11px] font-extrabold px-2.5 py-1 rounded-full">
            Save 20%
          </span>
        </div>
      </section>

      {/* ── Plan cards ──────────────────────────────────────── */}
      <section className="max-w-[1180px] mx-auto px-5 pb-7">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((p) => (
            <PlanCard key={p.name} plan={p} yearly={yearly} />
          ))}
        </div>
        <p className="text-center text-[12px] text-[#9B9AB5] mt-6">
          All plans include GDPR-compliant security. Cancel anytime.
        </p>
      </section>

      {/* ── Compare plans table ─────────────────────────────── */}
      <section className="max-w-[1180px] mx-auto px-5 py-12">
        <div className="bg-white rounded-3xl border border-[#ECE9FF] shadow-sm overflow-hidden">
          <div className="px-7 py-5 border-b border-[#ECE9FF] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#534AB7]" />
            <h2 className="text-lg font-extrabold text-[#14142B]">Compare plans</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FAFAFE] text-[11px] font-extrabold text-[#9B9AB5] uppercase tracking-widest">
                <tr>
                  <th className="text-left px-7 py-3.5">Features</th>
                  <th className="px-4 py-3.5 text-center">Free</th>
                  <th className="px-4 py-3.5 text-center">Pro</th>
                  <th className="px-4 py-3.5 text-center">Exams</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-[#FAFAFE]/50"}>
                    <td className="px-7 py-3.5 text-[13px] font-semibold text-[#3A3A52]">{row.feature}</td>
                    <td className="px-4 py-3.5 text-center text-[13px] text-[#3A3A52]">{row.free}</td>
                    <td className="px-4 py-3.5 text-center text-[13px] text-[#3A3A52]">{row.pro}</td>
                    <td className="px-4 py-3.5 text-center text-[13px] text-[#3A3A52]">{row.exams}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="max-w-[760px] mx-auto px-5 pb-14">
        <h2 className="text-center text-2xl md:text-[28px] font-extrabold text-[#14142B] mb-7 inline-flex items-center justify-center gap-2 w-full">
          Frequently asked questions <Sparkles className="w-5 h-5 text-[#534AB7]" />
        </h2>
        <div className="space-y-3">
          {FAQ.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* ── Bottom CTA banner ───────────────────────────────── */}
      <section className="max-w-[1180px] mx-auto px-5 pb-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#534AB7] via-[#5B4FBC] to-[#7B6FE8] rounded-3xl p-7 md:p-9 shadow-xl shadow-[#534AB7]/20">
          <Sparkles className="absolute top-6 right-8 w-4 h-4 text-white/30" />
          <Sparkles className="absolute bottom-8 right-1/3 w-3 h-3 text-white/20" />

          <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-6">
            {/* Robot mascot */}
            <div className="hidden md:flex items-center justify-center w-[100px] h-[100px] rounded-3xl bg-white/15 backdrop-blur border border-white/20">
              <Bot className="w-14 h-14 text-white" strokeWidth={1.5} />
            </div>

            <div>
              <h3 className="text-xl md:text-[24px] font-extrabold text-white mb-1.5">
                Ready to supercharge your studies?
              </h3>
              <p className="text-[13px] text-white/85 leading-relaxed">
                Join thousands of students who are already achieving more with Atlas.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="bg-white hover:bg-[#F4F2FF] text-[#534AB7] px-5 py-2.5 rounded-xl font-extrabold text-sm shadow-lg transition-all active:scale-95"
              >
                Get started free
              </Link>
              <Link
                href="/#features"
                className="bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 text-white px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all active:scale-95"
              >
                View all features
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
