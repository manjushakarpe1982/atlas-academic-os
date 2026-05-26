'use client';

import { useState } from 'react';
import {
  GraduationCap, BookOpen, FlaskConical, Briefcase,
  Check, Sparkles, Bot, BarChart2, FileText, TrendingUp,
} from 'lucide-react';
import OnboardingLayout from '../_components/OnboardingLayout';
import { type Role } from '../_components/constants';
import Image from 'next/image';

const ROLES = [
  {
    id: 'student'      as Role, label: 'Student',      icon: GraduationCap,
    bg: 'bg-[#534AB7]', lightBg: 'bg-violet-50', border: 'border-violet-400',
    desc: 'I want to improve my academic performance and study smarter.',
  },
  {
    id: 'teacher'      as Role, label: 'Teacher',      icon: BookOpen,
    bg: 'bg-emerald-500', lightBg: 'bg-emerald-50', border: 'border-emerald-400',
    desc: 'I want to streamline my teaching and support my students.',
  },
  {
    id: 'researcher'   as Role, label: 'Researcher',   icon: FlaskConical,
    bg: 'bg-blue-500', lightBg: 'bg-blue-50', border: 'border-blue-400',
    desc: 'I want to accelerate my research and discover insights.',
  },
  {
    id: 'professional' as Role, label: 'Professional', icon: Briefcase,
    bg: 'bg-orange-500', lightBg: 'bg-orange-50', border: 'border-orange-400',
    desc: 'I want to upskill and advance my career.',
  },
];

const FEATURES = [
  { icon: Bot,        bg: 'bg-violet-100',  color: 'text-violet-600',  label: 'AI-Powered\nStudy Plan'    },
  { icon: BarChart2,  bg: 'bg-emerald-100', color: 'text-emerald-600', label: 'Smart Grade\nPredictions'  },
  { icon: FileText,   bg: 'bg-blue-100',    color: 'text-blue-600',    label: 'Document\nAnalysis'        },
  { icon: TrendingUp, bg: 'bg-orange-100',  color: 'text-orange-500',  label: 'Progress\nTracking'        },
];

export default function Step1Page() {
  const [role, setRole] = useState<Role>(null);

  return (
    <OnboardingLayout step={1} disableNext={!role}>
      <div className="bg-white rounded-xl border border-[#ECE9FF] shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[520px]">

  {/* ── LEFT — Main Content (70%) ─────────────────────────────── */}
  <div className="lg:w-[70%] flex-1 flex flex-col">

    {/* Step badge */}
    <div className="px-8 pt-7 pb-3">
      <span className="inline-flex items-center gap-2 rounded-full bg-[#F0EEFF] border border-[#D8D3FF] text-[#534AB7] text-[11px] font-bold px-3.5 py-1.5">
        <Sparkles className="w-3.5 h-3.5" /> Step 1 of 5
      </span>
    </div>

    {/* Title + subtitle */}
    <div className="px-8 pb-4 border-b border-[#F1EEFF]">
      <h1 className="text-3xl font-extrabold text-[#14142B] leading-tight mb-2">
        Welcome to Atlas! 👋
      </h1>
      <p className="text-[15px] text-[#6B6A8A] leading-relaxed">
        Your AI-powered academic companion.<br />
        Tell us a little about yourself so we can personalise your experience.
      </p>
    </div>

    {/* Role picker */}
   

      {/* Role picker */}


  {/* 4 Cards in One Row */}
 {/* Role picker */}
{/* Role picker */}
<div className="px-8 py-4 flex-1 flex flex-col justify-center">
  <p className="text-base font-extrabold  text-black mb-6 border-b-2 border-[#534AB7] inline-block pb-1">
    What best describes you?
  </p>

  {/* 4 Cards in One Row */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    {ROLES.map((r) => (
      <button
        key={r.id}
        onClick={() => setRole(r.id)}
        className={`relative text-left rounded-2xl border-2 p-4 transition-all duration-200 h-full flex flex-col ${
          role === r.id
            ? `${r.lightBg} ${r.border} shadow-sm`
            : 'border-[#ECE9FF] bg-white hover:border-[#D5D0FF] hover:bg-[#FAFAFE]'
        }`}>

        {/* Checkmark */}
        {role === r.id && (
          <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#534AB7] flex items-center justify-center shadow-sm">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
        )}

        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl ${r.bg} flex items-center justify-center mb-5 shadow-md flex-shrink-0`}>
          <r.icon className="w-7 h-7 text-white" />
        </div>

        {/* Text Content */}
        <div className="flex-1 flex flex-col">
          <p className="text-base font-extrabold text-[#16162E] mb-2 leading-tight">
            {r.label}
          </p>
          <p className="text-base text-[#6B6A8A] leading-relaxed">
            {r.desc}
          </p>
        </div>
      </button>
    ))}
  </div>
</div>

    {/* Feature strip */}
    <div className="px-8 py-3">
    <div className="border border-[#F1EEFF] bg-[#FAFAFE] rounded-xl px-8 py-5">
      <p className="text-lg font-bold   text-black mb-4">
        What you&apos;ll get with ATLAS
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FEATURES.map((f) => (
          <div key={f.label} className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center flex-shrink-0`}>
              <f.icon className={`w-5 h-5 ${f.color}`} style={{ width:20, height:20 }} />
            </div>
            <span className="text-[15px] font-semibold text-[#343452] leading-snug whitespace-pre-line">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
    </div>
  </div>

  {/* ── RIGHT — Illustration (30%) ────────────────────────────── */}
  <div
    className="hidden lg:flex flex-col items-center justify-center flex-shrink-0 relative overflow-hidden"
    style={{
      width: '32%',
      background: 'linear-gradient(145deg, #F2EEFF 0%, #EAE4FF 60%, #E0D8FF 100%)',
    }}
  >
    {/* Sparkle dots */}
    {[[10,8],[85,12],[5,70],[90,65],[50,5],[15,90]].map(([l,t],i)=>(
      <div key={i} className="absolute text-[#7C6CFF]/20 text-base select-none pointer-events-none"
        style={{ left:`${l}%`, top:`${t}%` }}>✦</div>
    ))}

    <Image
      src="https://res.cloudinary.com/mview/image/upload/atlas/desktop-hero.webp"
      alt="Atlas AI companion"
      fill
      priority
      className="object-cover"
    />
  </div>
</div>
    </OnboardingLayout>
  );
}
