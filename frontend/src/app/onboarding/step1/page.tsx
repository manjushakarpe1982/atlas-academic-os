'use client';

import {
  GraduationCap, BookOpen, FlaskConical, Briefcase,
  Check, Sparkles, Bot, BarChart2, FileText, TrendingUp,
} from 'lucide-react';
import OnboardingLayout from '../_components/OnboardingLayout';
import { type Role } from '../_components/constants';
import { useOnboarding } from '../_components/OnboardingContext';

const ROLES = [
  {
    id: 'high_school'  as Role, label: 'High School',  icon: GraduationCap,
    bg: 'bg-[#534AB7]', lightBg: 'bg-violet-50', border: 'border-violet-400',
    desc: "I'm in high school and want to study smarter and improve my grades.",
  },
  {
    id: 'college'      as Role, label: 'College',      icon: BookOpen,
    bg: 'bg-emerald-500', lightBg: 'bg-emerald-50', border: 'border-emerald-400',
    desc: "I'm in college or university and want to ace my courses.",
  },
  {
    id: 'graduate'     as Role, label: 'Graduate',     icon: FlaskConical,
    bg: 'bg-blue-500', lightBg: 'bg-blue-50', border: 'border-blue-400',
    desc: "I'm a graduate student working on advanced studies or research.",
  },
  {
    id: 'self_learner' as Role, label: 'Self-learner', icon: Briefcase,
    bg: 'bg-orange-500', lightBg: 'bg-orange-50', border: 'border-orange-400',
    desc: "I'm learning on my own and want a structured study path.",
  },
];

const FEATURES = [
  { icon: Bot,        bg: 'bg-violet-100',  color: 'text-violet-600',  label: 'AI-Powered\nStudy Plan'    },
  { icon: BarChart2,  bg: 'bg-emerald-100', color: 'text-emerald-600', label: 'Smart Grade\nPredictions'  },
  { icon: FileText,   bg: 'bg-blue-100',    color: 'text-blue-600',    label: 'Document\nAnalysis'        },
  { icon: TrendingUp, bg: 'bg-orange-100',  color: 'text-orange-500',  label: 'Progress\nTracking'        },
];

export default function Step1Page() {
  const { data, update } = useOnboarding();
  const role = (data.role as Role) ?? null;
  const setRole = (r: Role) => update({ role: r });

  return (
    <OnboardingLayout step={1} disableNext={!role}>
      <div className="w-full max-w-[1080px] mx-auto bg-white rounded-[28px] border border-[#ECE9FF] shadow-lg p-3  md:p-5 overflow-hidden">

        {/* ── Full-width header banner: text overlaps image ──────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EFEBFF] via-[#F2EEFF] to-[#E9E3FF] mb-5 min-h-[250px] lg:min-h-[260px]">

  {/* Background Image - Visible only on large screens */}
  <img
    src="https://res.cloudinary.com/mview/image/upload/atlas/onBoardingPage1.webp"
    alt="Atlas welcome illustration"
    className="hidden lg:block absolute inset-0 w-full h-full object-cover"
  />

  {/* Text overlay on left side */}
  <div className="relative z-10 px-7 lg:px-10 py-8 max-w-xl">
    <span className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur border border-[#D8D3FF] text-[#534AB7] text-[11px] font-bold px-3.5 py-1.5 mb-4">
      <Sparkles className="w-3.5 h-3.5" /> Step 1 of 5
    </span>
    
    <h1 className="text-4xl lg:text-[44px] font-extrabold text-[#14142B] leading-[1.1] mb-3">
      Welcome to Atlas! 👋
    </h1>
    
    <p className="text-base text-[#5C5A78] leading-relaxed max-w-sm">
      Your AI-powered academic companion. Tell us a little about
      yourself so we can personalise your experience.
    </p>
  </div>
</div>

        {/* ── Role picker card ───────────────────────────────────── */}
        <div className="pb-3 ">
          <p className="text-lg font-extrabold text-[#14142B] mb-3">
            What best describes you?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`relative text-center rounded-2xl border-2 p-3 transition-all duration-200 flex flex-col items-center ${
                  role === r.id
                    ? `${r.lightBg} ${r.border} shadow-sm`
                    : 'border-[#ECE9FF] bg-white hover:border-[#D5D0FF] hover:bg-[#FAFAFE]'
                }`}>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${r.bg} flex items-center justify-center mb-4 shadow-md`}>
                  <r.icon className="w-7 h-7 text-white" />
                </div>

                <p className="text-base font-extrabold text-[#16162E] mb-2">
                  {r.label}
                </p>
                <p className="text-[13px] text-[#6B6A8A] leading-relaxed mb-4 flex-1">
                  {r.desc}
                </p>

                {/* Radio circle */}
                <span className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  role === r.id ? 'bg-[#534AB7] border-[#534AB7]' : 'border-[#D8D6EA]'
                }`}>
                  {role === r.id && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Feature strip ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#ECE9FF] shadow-sm p-6 lg:p-7">
          <p className="text-base font-bold text-[#14142B] mb-5">
            What you&apos;ll get with ATLAS
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center flex-shrink-0`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <span className="text-[14px] font-semibold text-[#343452] leading-snug whitespace-pre-line">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </OnboardingLayout>
  );
}
