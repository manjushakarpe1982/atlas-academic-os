'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  GraduationCap,
  BookOpen,
  FlaskConical,
  Briefcase,
  Check,
  Sparkles,
  Bot,
  BarChart2,
  FileText,
  TrendingUp,
} from 'lucide-react';
import OnboardingLayout from '../_components/OnboardingLayout';
import { type Role } from '../_components/constants';

const ROLES = [
  {
    id: 'student' as Role,
    label: 'Student',
    icon: GraduationCap,
    bg: 'from-violet-500 to-purple-600',
    desc: 'I want to improve my academic performance and study smarter.',
  },
  {
    id: 'teacher' as Role,
    label: 'Teacher',
    icon: BookOpen,
    bg: 'from-emerald-500 to-teal-600',
    desc: 'I want to streamline my teaching and support my students.',
  },
  {
    id: 'researcher' as Role,
    label: 'Researcher',
    icon: FlaskConical,
    bg: 'from-blue-500 to-cyan-600',
    desc: 'I want to accelerate my research and discover insights.',
  },
  {
    id: 'professional' as Role,
    label: 'Professional',
    icon: Briefcase,
    bg: 'from-orange-500 to-amber-600',
    desc: 'I want to upskill and advance my career.',
  },
];

const FEATURES = [
  {
    icon: Bot,
    bg: 'bg-violet-100',
    color: 'text-violet-600',
    label: 'AI Study Plan',
  },
  {
    icon: BarChart2,
    bg: 'bg-emerald-100',
    color: 'text-emerald-600',
    label: 'Smart Insights',
  },
  {
    icon: FileText,
    bg: 'bg-blue-100',
    color: 'text-blue-600',
    label: 'Document Analysis',
  },
  {
    icon: TrendingUp,
    bg: 'bg-orange-100',
    color: 'text-orange-500',
    label: 'Progress Tracking',
  },
];

export default function Step1Page() {
  const [role, setRole] = useState<Role>(null);

  return (
   <OnboardingLayout step={1} disableNext={!role}>
  <div className="min-h-full rounded-[32px] overflow-hidden bg-white border border-[#ECE9FF] shadow-xl">

    <div className="flex flex-col min-h-[760px]">

      {/* TOP FULL WIDTH */}
      <div className="w-full px-10 lg:px-14 pt-12 pb-10 border-b border-[#F1EEFF]">
        <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 text-violet-700 text-xs font-bold px-4 py-2 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Step 1 of 5
        </span>

        <h1 className="text-[44px] lg:text-[56px] font-black leading-tight text-[#14142B] mb-4">
          Welcome to Atlas! 👋
        </h1>

        <p className="text-[#6B6A8A] text-[16px] leading-8 max-w-3xl">
          Your AI-powered academic companion. Tell us a little about yourself
          so we can personalize your learning experience.
        </p>
      </div>

      {/* MIDDLE 70 / 30 */}
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] flex-1">

        {/* LEFT SIDE */}
        <div className="px-10 lg:px-14 py-12">

          <p className="text-xs font-black tracking-[0.2em] uppercase text-violet-600 mb-8">
            What best describes you?
          </p>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {ROLES.map((r) => (
    <button
      key={r.id}
      onClick={() => setRole(r.id)}
      className={`relative text-left rounded-3xl border-2 p-7 transition-all duration-200 min-h-[220px] ${
        role === r.id
          ? 'border-violet-500 bg-violet-50 shadow-lg shadow-violet-200/40'
          : 'border-[#ECE9FF] bg-white hover:border-violet-300 hover:shadow-md'
      }`}
    >
      {/* selected */}
      {role === r.id && (
        <div className="absolute top-5 right-5 w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center">
          <Check
            className="w-4 h-4 text-white"
            strokeWidth={3}
          />
        </div>
      )}

      {/* icon */}
      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${r.bg} flex items-center justify-center mb-5`}
      >
        <r.icon className="w-7 h-7 text-white" />
      </div>

      {/* title */}
      <p className="text-xl font-bold text-[#16162E] mb-3">
        {r.label}
      </p>

      {/* desc */}
      <p className="text-[15px] text-[#6B6A8A] leading-7">
        {r.desc}
      </p>
    </button>
  ))}
</div>
        </div>

        {/* RIGHT SIDE 30% */}
        <div className="relative bg-gradient-to-br from-[#F8F4FF] via-[#F1EAFF] to-[#EBDDFF] flex items-center justify-center px-8 py-10 overflow-hidden">
          <div className="absolute w-[420px] h-[420px] rounded-full border border-white/30" />
          <div className="absolute w-[540px] h-[540px] rounded-full border border-white/15" />

          <div className="relative z-10">
            <Image
              src="https://res.cloudinary.com/mview/image/upload/atlas/desktop-hero.webp"
              alt="Atlas Hero"
              width={420}
              height={420}
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM FULL WIDTH */}
      <div className="w-full border-t border-[#F1EEFF] px-10 lg:px-14 py-8">
        <p className="text-xs font-black tracking-[0.2em] uppercase text-violet-600 mb-6">
          What you’ll get with Atlas
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-4 py-3"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center shrink-0`}
              >
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>

              <span className="text-sm font-bold text-[#1A1A2E]">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
</OnboardingLayout>
  );
}