'use client';

import { useState } from 'react';
import { Target, Check } from 'lucide-react';
import OnboardingLayout from '../_components/OnboardingLayout';

const ALL_GOALS = [
  { label: 'Improve grades', emoji: '📈' },
  { label: 'Better time management', emoji: '⏰' },
  { label: 'Exam preparation', emoji: '📝' },
  { label: 'Research skills', emoji: '🔬' },
  { label: 'Career preparation', emoji: '💼' },
  { label: 'Learn new skills', emoji: '🧠' },
  { label: 'Build study habits', emoji: '📚' },
  { label: 'Reduce study stress', emoji: '😌' },
  { label: 'Understand concepts deeply', emoji: '💡' },
  { label: 'Complete assignments faster', emoji: '⚡' },
  { label: 'Prepare for grad school', emoji: '🎓' },
  { label: 'Professional certification', emoji: '🏆' },
];

export default function Step3Page() {
  const [selected, setSelected] = useState<string[]>([
    'Improve grades',
    'Exam preparation',
  ]);
  const [priority, setPriority] = useState('Improve grades');

  const toggle = (g: string) =>
    setSelected((p) =>
      p.includes(g) ? p.filter((x) => x !== g) : [...p, g]
    );

  return (
    <OnboardingLayout step={3}>
      <div className="min-h-full w-full rounded-[32px] bg-[#F8F8FD] p-6 md:p-10">
        <div className="grid lg:grid-cols-[1.08fr_1fr] gap-10 items-center h-full">

          {/* LEFT SECTION */}
          <div className="max-w-xl flex flex-col justify-between h-full">

            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#5B4EE6]/10 px-3 py-1 text-[11px] font-bold text-[#5B4EE6] mb-5">
                <Target className="w-3.5 h-3.5" />
                Step 3 of 5
              </span>

              <h1 className="text-[34px] font-extrabold text-[#14142B] leading-tight mb-3">
                Goals & Interests
              </h1>

              <p className="text-sm text-[#77768A] leading-relaxed max-w-md">
                Select everything that applies — Atlas builds your daily
                plan and recommendations around your goals.
              </p>
            </div>

            {/* Goal Selection */}
            <div className="mb-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8B89A5] mb-4">
                Select all that apply
              </p>

              <div className="flex flex-wrap gap-3">
                {ALL_GOALS.map((g) => (
                  <button
                    key={g.label}
                    type="button"
                    onClick={() => toggle(g.label)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold border transition-all ${
                      selected.includes(g.label)
                        ? 'border-[#5B4EE6] bg-[#F4F2FF] text-[#5B4EE6] shadow-sm'
                        : 'border-[#E8E8F3] bg-white text-[#6F6D89] hover:border-[#5B4EE6]/30'
                    }`}
                  >
                    <span>{g.emoji}</span>
                    {g.label}
                    {selected.includes(g.label) && (
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            {selected.length > 0 && (
              <div className="mb-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8B89A5] mb-3">
                  ⭐ Which is your top priority?
                </p>

                <div className="flex flex-wrap gap-3">
                  {selected.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setPriority(g)}
                      className={`rounded-xl px-5 py-2.5 text-[12px] font-semibold border transition-all ${
                        priority === g
                          ? 'bg-[#5B4EE6] border-[#5B4EE6] text-white shadow-lg shadow-indigo-100'
                          : 'bg-white border-[#E8E8F3] text-[#6F6D89] hover:border-[#5B4EE6]/30'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Buttons */}
            <div className="mt-auto flex items-center justify-between">
              <button className="rounded-xl border border-[#E6E5F4] bg-white px-6 py-3 text-sm font-semibold text-[#7A7893] hover:bg-gray-50 transition">
                ← Back
              </button>

              <button className="rounded-xl bg-gradient-to-r from-[#5B4EE6] to-[#7A6CF0] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.02]">
                Continue →
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden lg:flex justify-center items-center">
            <img
              src="https://res.cloudinary.com/mview/image/upload/atlas/onboardingpage3.webp"
              alt="Goals and interests illustration"
              className="w-full max-w-[520px] object-contain"
            />
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}