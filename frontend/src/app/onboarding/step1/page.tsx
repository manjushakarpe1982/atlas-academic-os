'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  GraduationCap, BookOpen, FlaskConical, Briefcase,
  Check, Sparkles, Bot, BarChart2, FileText, TrendingUp,
} from 'lucide-react';
import OnboardingLayout from '../_components/OnboardingLayout';
import { type Role } from '../_components/constants';

const ROLES = [
  { id: 'student'      as Role, label: 'Student',      icon: GraduationCap, bg: 'from-violet-500 to-purple-600', desc: 'I want to improve my academic performance and study smarter.' },
  { id: 'teacher'      as Role, label: 'Teacher',      icon: BookOpen,      bg: 'from-emerald-500 to-teal-600',  desc: 'I want to streamline my teaching and support my students.'    },
  { id: 'researcher'   as Role, label: 'Researcher',   icon: FlaskConical,  bg: 'from-blue-500 to-cyan-600',     desc: 'I want to accelerate my research and discover insights.'      },
  { id: 'professional' as Role, label: 'Professional', icon: Briefcase,     bg: 'from-orange-500 to-amber-600',  desc: 'I want to upskill and advance my career.'                    },
];

const FEATURES = [
  { icon: Bot,        bg: 'bg-violet-100',  color: 'text-violet-600',  label: 'AI-Powered Study Plan'   },
  { icon: BarChart2,  bg: 'bg-emerald-100', color: 'text-emerald-600', label: 'Smart Grade Predictions' },
  { icon: FileText,   bg: 'bg-blue-100',    color: 'text-blue-600',    label: 'Document Analysis'       },
  { icon: TrendingUp, bg: 'bg-orange-100',  color: 'text-orange-500',  label: 'Progress Tracking'       },
];

export default function Step1Page() {
  const [role, setRole] = useState<Role>(null);

  return (
    <OnboardingLayout step={1} disableNext={!role}>
      <div className="bg-white rounded-[28px] border border-[#ECE9FF] shadow-lg overflow-hidden flex flex-col">

        {/* ══════════════════════════════════════════════════════
            TOP — full width — heading + subtitle + badge
        ══════════════════════════════════════════════════════ */}
        <div className="w-full px-8 lg:px-12 pt-8 pb-7 border-b border-[#F1EEFF]">
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 text-violet-700 text-[11px] font-bold px-3.5 py-1.5 mb-5">
            <Sparkles className="w-3.5 h-3.5" /> Step 1 of 5
          </span>
          <h1 className="text-3xl lg:text-[2.6rem] font-extrabold text-[#14142B] leading-tight mb-2.5">
            Welcome to Atlas! 👋
          </h1>
          <p className="text-[15px] text-[#6B6A8A] leading-relaxed max-w-5xl">
            Your AI-powered academic companion. Tell us a little about yourself
            so we can personalise your experience.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════
            MIDDLE — 70% left (role cards) | 30% right (image)
        ══════════════════════════════════════════════════════ */}
      <div className="flex flex-1 min-h-0">

  {/* LEFT — 70% */}
  <div
    className="flex-1 px-8 lg:px-12 py-8 flex flex-col"
    style={{ flexBasis: "70%" }}
  >
    <p className="text-[11px] font-extrabold tracking-[0.18em] uppercase text-[#534AB7] mb-6">
      What best describes you?
    </p>

    {/* Role Cards */}
    <div className="grid grid-cols-4 gap-4 mb-8">
      {ROLES.map((r) => (
        <button
          key={r.id}
          onClick={() => setRole(r.id)}
          className={`relative text-left rounded-2xl border-2 p-5 transition-all duration-200 ${
            role === r.id
              ? "border-violet-500 bg-violet-50 shadow-md shadow-violet-200/40"
              : "border-[#ECE9FF] bg-white hover:border-violet-300 hover:shadow-sm"
          }`}
        >
          {role === r.id && (
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center shadow-md">
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </div>
          )}

          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.bg} flex items-center justify-center mb-4 shadow-md`}
          >
            <r.icon className="w-7 h-7 text-white" />
          </div>

          <p className="text-base font-extrabold text-[#16162E] mb-1.5">
            {r.label}
          </p>
          <p className="text-[13px] text-[#6B6A8A] leading-relaxed">
            {r.desc}
          </p>
        </button>
      ))}
    </div>

    {/* FEATURES MOVED HERE */}
    <div className="rounded-2xl border border-[#ECE9FF] bg-[#FAFAFE] px-6 py-5 mt-auto">
      <p className="text-sm font-bold text-[#1A1A2E] mb-6">
        What you&apos;ll get with ATLAS
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((f) => (
          <div key={f.label} className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-full ${f.bg} flex items-center justify-center flex-shrink-0`}
            >
              <f.icon
                className={f.color}
                style={{ width: 20, height: 20 }}
              />
            </div>

            <span className="text-[13px] font-semibold text-[#1A1A2E] leading-snug">
              {f.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* RIGHT — IMAGE */}
  <div
    className="hidden lg:flex items-center justify-center flex-shrink-0 relative bg-white overflow-hidden rounded-l-3xl"
    style={{
      flexBasis: "30%",
      minHeight: "420px",
      borderLeft: "1px solid #F1EEFF",
    }}
  >
    <Image
      src="https://res.cloudinary.com/mview/image/upload/atlas/desktop-hero.webp"
      alt="Atlas AI companion"
      fill
      priority
      className="object-cover rounded-l-3xl"
    />
  </div>
</div>
      </div>
    </OnboardingLayout>
  );
}
