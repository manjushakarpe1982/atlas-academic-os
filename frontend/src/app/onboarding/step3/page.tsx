'use client';

import { useState } from 'react';
import { Target, Check, Star } from 'lucide-react';
import OnboardingLayout from '../_components/OnboardingLayout';

const ALL_GOALS = [
  { label: 'Improve grades',              emoji: '📈' },
  { label: 'Better time management',      emoji: '⏰' },
  { label: 'Exam preparation',            emoji: '📝' },
  { label: 'Research skills',             emoji: '🔬' },
  { label: 'Career preparation',          emoji: '💼' },
  { label: 'Learn new skills',            emoji: '🧠' },
  { label: 'Build study habits',          emoji: '📚' },
  { label: 'Reduce study stress',         emoji: '😌' },
  { label: 'Understand concepts deeply',  emoji: '💡' },
  { label: 'Complete assignments faster', emoji: '⚡' },
  { label: 'Prepare for grad school',     emoji: '🎓' },
  { label: 'Professional certification',  emoji: '🏆' },
];

export default function Step3Page() {
  const [selected, setSelected] = useState<string[]>(['Improve grades', 'Exam preparation']);
  const [priority, setPriority] = useState('Improve grades');

  const toggle = (g: string) =>
    setSelected((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));

  return (
    <OnboardingLayout step={3}>
      <div className="bg-white rounded-[28px] border border-[#ECE9FF] shadow-lg overflow-hidden w-full max-w-[1200px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_400px] items-stretch">

          {/* LEFT — goals */}
          <div className="px-8 lg:px-10 py-8 flex max-w-3xl flex-col">

            {/* Header */}
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#534AB7]/10 text-[#534AB7] text-[11px] font-bold px-3.5 py-1.5 mb-5">
              <Target className="w-3.5 h-3.5" /> Step 3 of 5
            </span>

            <h1 className="text-3xl lg:text-[40px] font-extrabold text-[#14142B] leading-tight mb-1">
              Goals &amp; Interests
            </h1>
            <div className="h-1 w-14 rounded-full bg-[#534AB7] mb-3" />
            <p className="text-sm text-[#6B6A8A] leading-relaxed mb-6 max-w-md">
              Select everything that applies — Atlas builds your daily plan and
              recommendations around your goals.
            </p>

            {/* Goal chips */}
            <p className="text-lg text-gray-600 mb-3">
              Select all that apply
            </p>
            <div className="flex flex-wrap gap-3.5 mb-7">
              {ALL_GOALS.map((g) => {
                const on = selected.includes(g.label);
                return (
                  <button
                    key={g.label}
                    type="button"
                    onClick={() => toggle(g.label)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold border transition-all ${
                      on
                        ? 'border-[#534AB7] bg-[#F4F2FF] text-[#534AB7] shadow-sm'
                        : 'border-[#E8E8F3] bg-white text-[#5C5A78] hover:border-[#534AB7]/40'
                    }`}
                  >
                    <span className="text-base leading-none">{g.emoji}</span>
                    {g.label}
                    {on && <Check className="w-3.5 h-3.5 flex-shrink-0 text-[#534AB7]" />}
                  </button>
                );
              })}
            </div>

            {/* Priority picker */}
            {selected.length > 0 && (
              <div>
                <p className="flex items-center gap-1.5 text-lg  text-gray-600 mb-3">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  Which is your top priority?
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {selected.map((g) => {
                    const on = priority === g;
                    const goal = ALL_GOALS.find((x) => x.label === g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setPriority(g)}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-[13px] font-bold border transition-all ${
                          on
                            ? 'bg-[#534AB7] border-[#534AB7] text-white shadow-lg shadow-indigo-200/60'
                            : 'bg-white border-[#E8E8F3] text-[#5C5A78] hover:border-[#534AB7]/40'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          {on ? (
                            <Star className="w-4 h-4 text-amber-300 fill-amber-300 flex-shrink-0" />
                          ) : (
                            <span className="text-sm leading-none">{goal?.emoji}</span>
                          )}
                          {g}
                        </span>
                        {/* Radio circle */}
                        <span
                          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                            on ? 'border-white' : 'border-[#D8D6EA]'
                          }`}
                        >
                          {on && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — illustration */}
        <div className="hidden lg:flex h-full pr-4 overflow-hidden rounded-2xl items-center justify-center">
      <img
        src="https://res.cloudinary.com/mview/image/upload/atlas/onboarding3.webp"
        alt="Academic profile illustration"
        className="w-[100%] h-auto max-h-[650px] object-contain"
      />
    </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
