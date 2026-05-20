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
  { icon: Bot,        bg: 'bg-violet-100', color: 'text-violet-600', label: 'AI Study Plan'      },
  { icon: BarChart2,  bg: 'bg-emerald-100',color: 'text-emerald-600',label: 'Smart Insights'     },
  { icon: FileText,   bg: 'bg-blue-100',   color: 'text-blue-600',   label: 'Document Analysis'  },
  { icon: TrendingUp, bg: 'bg-orange-100', color: 'text-orange-500', label: 'Progress Tracking'  },
];

export default function Step1Page() {
  const [role, setRole] = useState<Role>(null);

  return (
    <OnboardingLayout step={1} disableNext={!role}>

      {/* White card — same as step 2 & 3 */}
      <div className="bg-white rounded-[28px] border border-[#ECE9FF] shadow-lg overflow-hidden">

        {/* ── Header row ─────────────────────────────────────── */}
        <div className="flex items-start gap-0 border-b border-[#F1EEFF]">

          {/* Left header text */}
          <div className="flex-1 px-8 lg:px-10 pt-8 pb-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 text-violet-700 text-[11px] font-bold px-3.5 py-1.5 mb-5">
              <Sparkles className="w-3.5 h-3.5" /> Step 1 of 5
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#14142B] leading-tight mb-3">
              Welcome to Atlas! 👋
            </h1>
            <p className="text-sm text-[#6B6A8A] leading-relaxed max-w-md">
              Your AI-powered academic companion. Tell us a little about yourself
              so we can personalise your experience.
            </p>
          </div>

          {/* Right — illustration */}
          <div className="hidden lg:flex w-[260px] flex-shrink-0 bg-gradient-to-br from-[#F8F4FF] via-[#F1EAFF] to-[#EBDDFF] items-center justify-center p-4 self-stretch">
            <Image
              src="https://res.cloudinary.com/mview/image/upload/atlas/desktop-hero.webp"
              alt="Atlas AI companion"
              width={220} height={220}
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* ── Role picker ─────────────────────────────────────── */}
        <div className="px-8 lg:px-10 py-7">
          <p className="text-[11px] font-extrabold tracking-widest uppercase text-[#534AB7] mb-5">
            What best describes you?
          </p>

          <div className="grid grid-cols-2 gap-4">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`relative text-left rounded-2xl border-2 p-5 transition-all duration-200 ${
                  role === r.id
                    ? 'border-violet-500 bg-violet-50 shadow-md shadow-violet-200/40'
                    : 'border-[#ECE9FF] bg-white hover:border-violet-300 hover:shadow-sm'
                }`}
              >
                {role === r.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                )}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.bg} flex items-center justify-center mb-4 shadow-md`}>
                  <r.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-base font-extrabold text-[#16162E] mb-1.5">{r.label}</p>
                <p className="text-[12px] text-[#6B6A8A] leading-relaxed">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Feature strip ───────────────────────────────────── */}
        <div className="border-t border-[#F1EEFF] px-8 lg:px-10 py-5 bg-[#FAFAFE]">
          <p className="text-[10px] font-extrabold tracking-widest uppercase text-[#9B9AB5] mb-4">
            What you&apos;ll get with Atlas
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center flex-shrink-0`}>
                  <f.icon className={`w-4.5 h-4.5 ${f.color}`} style={{ width: 18, height: 18 }} />
                </div>
                <span className="text-[12px] font-semibold text-[#1A1A2E]">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
