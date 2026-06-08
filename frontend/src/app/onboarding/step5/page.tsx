'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check, ArrowRight, GraduationCap, Landmark, BookOpen, CalendarDays,
  Target, Clock, BarChart3, Moon, Upload, Brain, Sparkles, Shield, Star,
} from 'lucide-react';
import OnboardingLayout from '../_components/OnboardingLayout';
import { useOnboarding } from '../_components/OnboardingContext';

export default function Step5Page() {
  const router = useRouter();
  const { save, data } = useOnboarding();
  const [name, setName] = useState('there');

  useEffect(() => {
    const n = localStorage.getItem('atlas_full_name');
    if (n) setName(n.split(' ')[0]);
    // Safety net: ensure onboarding is flagged complete if the user
    // reached this screen (e.g. via back/forward navigation).
    save(true).catch(() => {});
    localStorage.setItem('atlas_onboarding_completed', 'true');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToDashboard = () => {
    localStorage.setItem('atlas_onboarding_completed', 'true');
    router.push('/dashboard');
  };

  const roleLabel = data.role
    ? data.role.charAt(0).toUpperCase() + data.role.slice(1)
    : '—';

  const studyTimeDisplay =
    data.study_time
      ? data.study_time === 'Morning'    ? 'Mornings (6AM – 12PM)'
      : data.study_time === 'Afternoon'  ? 'Afternoons (12PM – 6PM)'
      : data.study_time === 'Evening'    ? 'Evenings (6PM – 10PM)'
      : data.study_time === 'Late night' ? 'Late nights (10PM – 2AM)'
      : data.study_time
      : 'Not set';

  const weeklyTotal = +((data.weekday_hours || 0) * 5 + (data.weekend_hours || 0) * 2).toFixed(1);

  // 8-card responses grid — soft pastel tile per item
  const responses = [
    { icon: GraduationCap, label: 'Role',               value: roleLabel,                                           bg: 'bg-violet-100',  fg: 'text-violet-600' },
    { icon: Landmark,      label: 'Institution',        value: data.institution || 'Not provided',                  bg: 'bg-blue-100',    fg: 'text-blue-600' },
    { icon: BookOpen,      label: 'Field of study',     value: data.field_of_study || 'Not provided',               bg: 'bg-emerald-100', fg: 'text-emerald-600' },
    { icon: CalendarDays,  label: 'Year / Level',       value: data.year_level || 'Not provided',                   bg: 'bg-orange-100',  fg: 'text-orange-500' },
    { icon: Target,        label: 'Target GPA',         value: data.target_gpa != null ? data.target_gpa.toFixed(2) : 'Not set', bg: 'bg-pink-100', fg: 'text-pink-500' },
    { icon: Clock,         label: 'Study time',         value: studyTimeDisplay,                                    bg: 'bg-amber-100',   fg: 'text-amber-600' },
    { icon: BarChart3,     label: 'Weekly study target',value: `${weeklyTotal}h / week`,                            bg: 'bg-teal-100',    fg: 'text-teal-600' },
    { icon: Moon,          label: 'Sleep window',
      value: (data.sleep_start || '—') + ' – ' + (data.sleep_end || '—'),                                            bg: 'bg-indigo-100',  fg: 'text-indigo-500' },
  ];

  const steps = [
    { n: '01', icon: Upload, color: 'bg-[#534AB7]', ring: 'bg-violet-100 text-[#534AB7]',
      title: 'Upload syllabus',   desc: 'Add your syllabus or files so Atlas understands your courses.' },
    { n: '02', icon: Brain,  color: 'bg-[#7B6FE8]', ring: 'bg-violet-100 text-[#534AB7]',
      title: 'Atlas reads it',    desc: 'Our AI will extract key topics, deadlines, and weightage.' },
    { n: '03', icon: Target, color: 'bg-emerald-500', ring: 'bg-emerald-100 text-emerald-600',
      title: 'Start studying',    desc: 'Get your first ranked tasks and personalised study plan.' },
  ];

  return (
    <OnboardingLayout step={5}>
      <div className="w-full max-w-[1080px] mx-auto bg-white rounded-3xl px-6 py-8 shadow-xl">

        {/* ── Header — success badge + heading ───────────────────── */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="relative mb-4">
            <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-[#534AB7] to-[#7B6FE8] flex items-center justify-center shadow-2xl shadow-[#534AB7]/30">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-[#534AB7]/20 animate-ping" />
          </div>
          <h1 className="text-[34px] md:text-[40px] font-extrabold text-[#14142B] mb-2">
            You&apos;re all set, {name}! 🎉
          </h1>
          <p className="text-sm text-[#6B6A8A] leading-relaxed max-w-lg">
            Your profile is complete. Here&apos;s a quick summary of what you told us —
            Atlas will use this to personalise your experience.
          </p>
        </div>

        {/* ── Your responses — 4-col grid (8 cards) ──────────────── */}
     <div className="bg-[#F8F7FF] border border-[#E8E5FD] rounded-xl px-4 py-3 mb-1">
  <p className="text-lg font-bold text-gray-900 mb-3">
    Your responses
  </p>

  {/* Horizontal Scroll Container */}
  <div className="overflow-x-auto pb-6 -mx-1 px-1 snap-x snap-mandatory scrollbar-thin custom-scroll md:overflow-visible">
    <div className="flex gap-3.5 w-max md:w-auto md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {responses.map((r) => (
        <div
          key={r.label}
          className="flex items-center gap-3 bg-white border border-[#ECE9FF] rounded-2xl shadow-sm hover:shadow-md transition-shadow px-4 py-3.5 w-[280px] flex-shrink-0 md:w-auto snap-center"
        >
          <div className={`w-11 h-11 rounded-xl ${r.bg} flex items-center justify-center flex-shrink-0`}>
            <r.icon className={`w-5 h-5 ${r.fg}`} />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-[#9B9AB5] mb-0.5">{r.label}</p>
            <p className="text-sm font-bold text-[#1A1A2E] truncate">{r.value}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

        {/* ── Purple "Ready to get started?" CTA banner ──────────── */}
        <div className="mt-4 relative overflow-hidden rounded-xl bg-gradient-to-br from-[#534AB7] via-[#5B4FBC] to-[#6B5FE8] mb-3 shadow-xl shadow-[#534AB7]/20">
          {/* Decorative sparkles */}
          <Sparkles className="absolute top-5 left-1/3 w-4 h-4 text-white/40" />
          <Sparkles className="absolute bottom-6 right-1/3 w-3 h-3 text-white/30" />
          <Sparkles className="absolute top-10 right-[42%] w-3 h-3 text-white/30" />

          <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_auto] items-center gap-5 px-7 md:px-8 py-4">
            <div>
              <h3 className="text-xl md:text-[22px] font-extrabold text-white mb-1">
                Ready to get started?
              </h3>
              <p className="text-sm text-white/80 leading-relaxed max-w-xl">
                Upload your files, add grades, and let Atlas build your personalised study plan.
              </p>
            </div>

            <button
              onClick={goToDashboard}
              className="bg-white hover:bg-[#F4F2FF] text-[#534AB7] px-6 py-3 rounded-xl flex items-center gap-2 font-extrabold text-sm shadow-lg transition-all active:scale-95"
            >
              Go to my Dashboard <ArrowRight className="w-4 h-4" />
            </button>

            
          </div>
        </div>

        {/* ── Settings note ──────────────────────────────────────── */}
        <p className="flex items-center justify-center gap-1.5 text-[13px] text-[#75748a] mb-4">
          <Shield className="w-3.5 h-3.5" />
          You can update any of these details anytime in Settings.
        </p>

        {/* ── WHAT HAPPENS NEXT divider ──────────────────────────── */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-[#E8E5FD]" />
          <Sparkles className="w-3.5 h-3.5 text-[#9B9AB5]" />
          <p className="text-base font-extrabold text-[#534AB7] uppercase tracking-widest">
            What happens next
          </p>
          <Sparkles className="w-3.5 h-3.5 text-[#9B9AB5]" />
          <div className="flex-1 h-px bg-[#E8E5FD]" />
        </div>

        {/* ── 3 numbered next-step cards ─────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
          {steps.map((s) => (
            <div key={s.n} className="relative bg-[#F8F7FF] border border-[#E8E5FD] rounded-2xl p-3">
              {/* number badge */}
              <div className={`absolute -top-2 left-4 inline-flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-extrabold ${s.ring} border border-white shadow-sm`}>
                {s.n}
              </div>

              <div className="flex items-start gap-4 mt-3">
                <div className={`w-14 h-14 rounded-xl ${s.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm xl:text-base font-extrabold text-[#1A1A2E] mb-1">{s.title}</p>
                  <p className="text-sm xl:text-base text-[#6B6A8A] leading-relaxed">{s.desc}</p>
                </div>
              </div>

              {/* footer arrow */}
              <div className="flex justify-end mt-3">
                <ArrowRight className="w-4 h-4 text-[#534AB7]" />
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer pill ────────────────────────────────────────── */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 bg-white border border-[#E8E5FD] rounded-full px-4 py-2 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <p className="text-[13px] text-[#6B6A8A]">
              Let&apos;s make your academic journey smarter, together. <span className="text-[#534AB7]">💜</span>
            </p>
          </div>
        </div>

      </div>
    </OnboardingLayout>
  );
}
