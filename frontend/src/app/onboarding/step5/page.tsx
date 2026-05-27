'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check, ArrowRight, GraduationCap, Landmark, Target, Clock,
  CalendarDays, Moon, Star, BookOpen, Upload, Brain, ArrowRight as ArrowFlow,
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
    router.push('/home');
  };

  const roleLabel = data.role
    ? data.role.charAt(0).toUpperCase() + data.role.slice(1)
    : '—';

  // Build the summary rows from the user's actual answers.
  const summary: { icon: typeof GraduationCap; label: string; value: string }[] = [
    { icon: GraduationCap, label: 'Role',          value: roleLabel },
    { icon: Landmark,      label: 'Institution',   value: data.institution || 'Not provided' },
    { icon: BookOpen,      label: 'Field of study',value: data.field_of_study || 'Not provided' },
    { icon: CalendarDays,  label: 'Year / Level',  value: data.year_level || 'Not provided' },
    { icon: Target,        label: 'Target GPA',    value: data.target_gpa != null ? data.target_gpa.toFixed(2) : 'Not set' },
    { icon: Clock,         label: 'Study time',    value: data.study_time || 'Not set' },
  ];

  const weeklyTotal = +((data.weekday_hours || 0) * 5 + (data.weekend_hours || 0) * 2).toFixed(1);

  return (
    <OnboardingLayout step={5}>
      <div className="bg-white rounded-[28px] border border-[#ECE9FF] shadow-lg overflow-hidden w-full max-w-[1080px] mx-auto">
        <div className="px-7 md:px-10 py-9 md:py-11 flex flex-col items-center text-center w-full">

          {/* Success check */}
          <div className="relative mb-5">
            <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#534AB7] to-[#7B6FE8] flex items-center justify-center shadow-2xl shadow-[#534AB7]/30">
              <Check className="w-9 h-9 text-white" strokeWidth={3} />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-[#534AB7]/20 animate-ping" />
          </div>

          {/* Success message */}
          <h1 className="text-3xl md:text-[34px] font-extrabold text-[#14142B] mb-2">
            You&apos;re all set, {name}! 🎉
          </h1>
          <p className="text-sm text-[#6B6A8A] leading-relaxed mb-7 max-w-md">
            Your profile is complete. Here&apos;s a quick summary of what you told
            us — Atlas will use this to personalise your experience.
          </p>

          {/* ── Summary of onboarding responses ──────────────────── */}
          <div className="w-full bg-[#FAFAFE] border border-[#EEEDFE] rounded-2xl p-5 mb-5 text-left">
            <p className="text-[11px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-4">
              Your responses
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {summary.map((s) => (
                <div key={s.label} className="flex items-center gap-3 bg-white border border-[#EEEDFE] rounded-xl px-3.5 py-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F4F2FF] flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-4 h-4 text-[#534AB7]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-[#9B9AB5]">{s.label}</p>
                    <p className="text-sm font-bold text-[#1A1A2E] truncate">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily hours + sleep window */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="flex items-center gap-3 bg-white border border-[#EEEDFE] rounded-xl px-3.5 py-3">
                <div className="w-9 h-9 rounded-lg bg-[#F4F2FF] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-[#534AB7]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-[#9B9AB5]">Weekly study target</p>
                  <p className="text-sm font-bold text-[#1A1A2E]">{weeklyTotal}h / week</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white border border-[#EEEDFE] rounded-xl px-3.5 py-3">
                <div className="w-9 h-9 rounded-lg bg-[#F4F2FF] flex items-center justify-center flex-shrink-0">
                  <Moon className="w-4 h-4 text-[#534AB7]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-[#9B9AB5]">Sleep window</p>
                  <p className="text-sm font-bold text-[#1A1A2E]">
                    {data.sleep_start || '—'} → {data.sleep_end || '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Goals chips ──────────────────────────────────────── */}
          {data.goals.length > 0 && (
            <div className="w-full bg-[#F8F7FF] border border-[#E8E5FD] rounded-2xl p-5 mb-7 text-left">
              <p className="text-[11px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-3">
                Goals you selected
              </p>
              <div className="flex flex-wrap gap-2">
                {data.goals.map((g) => {
                  const isTop = g === data.top_priority;
                  return (
                    <span
                      key={g}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border ${
                        isTop
                          ? 'bg-[#534AB7] border-[#534AB7] text-white'
                          : 'bg-white border-[#E8E5FD] text-[#5C5A78]'
                      }`}
                    >
                      {isTop && <Star className="w-3 h-3 fill-amber-300 text-amber-300" />}
                      {g}
                    </span>
                  );
                })}
              </div>
              {data.top_priority && (
                <p className="text-[11px] text-[#9B9AB5] mt-3">
                  <Star className="w-3 h-3 inline fill-amber-400 text-amber-400 mr-1" />
                  Top priority: <span className="font-bold text-[#534AB7]">{data.top_priority}</span>
                </p>
              )}
            </div>
          )}

          {/* ── Dashboard button (two lines) ─────────────────────── */}
          <button
            onClick={goToDashboard}
            className="bg-gradient-to-r from-[#534AB7] to-[#6B5FE8] hover:from-[#3C3489] hover:to-[#534AB7] text-white px-9 py-3 rounded-2xl flex items-center gap-3 shadow-xl shadow-[#534AB7]/25 transition-all active:scale-95"
          >
            <span className="text-left leading-tight">
              <span className="block text-sm font-extrabold">Go to my Dashboard</span>
              <span className="block text-[11px] font-medium text-white/70">
                Upload files, add grades &amp; start planning
              </span>
            </span>
            <ArrowRight className="w-5 h-5 flex-shrink-0" />
          </button>

          <p className="text-xs text-[#9B9AB5] mt-3 font-light">
            You can update any of these any time in Settings.
          </p>

          {/* ── Simple "how it works" flow ───────────────────────── */}
          <div className="w-full mt-8 pt-7 border-t border-[#EEEDFE]">
            <p className="text-[11px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-5">
              What happens next
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-center gap-3 sm:gap-2">
              {[
                { icon: Upload, color: 'bg-[#534AB7]', title: 'Upload syllabus', desc: 'Add your syllabus or files.' },
                { icon: Brain,  color: 'bg-[#7B6FE8]', title: 'Atlas reads it',  desc: 'Lectures, grades & deadlines parsed.' },
                { icon: Target, color: 'bg-emerald-500', title: 'Start studying', desc: 'Get your first ranked task.' },
              ].map((s, i, arr) => (
                <div key={s.title} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 flex-1">
                  <div className="flex sm:flex-col items-center gap-3 sm:gap-2 flex-1">
                    <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                      <s.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left sm:text-center">
                      <p className="text-sm font-bold text-[#1A1A2E]">{s.title}</p>
                      <p className="text-[11px] text-[#9B9AB5] leading-tight">{s.desc}</p>
                    </div>
                  </div>
                  {/* connector arrow between steps (desktop only) */}
                  {i < arr.length - 1 && (
                    <ArrowFlow className="hidden sm:block w-4 h-4 text-[#D8D6EA] flex-shrink-0 mt-3" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
