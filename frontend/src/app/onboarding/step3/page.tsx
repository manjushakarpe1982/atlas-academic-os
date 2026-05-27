'use client';

import { Target, Check, Star } from 'lucide-react';
import OnboardingLayout from '../_components/OnboardingLayout';
import { useOnboarding } from '../_components/OnboardingContext';

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
  const { data, update } = useOnboarding();
  const selected = data.goals;
  const priority = data.top_priority ?? '';

  const toggle = (g: string) => {
    const next = selected.includes(g)
      ? selected.filter((x) => x !== g)
      : [...selected, g];
    // Keep priority valid: clear or default it based on the new selection.
    let nextPriority = priority;
    if (!next.includes(priority)) nextPriority = next[0] ?? '';
    update({ goals: next, top_priority: nextPriority || null });
  };

  const setPriority = (g: string) => update({ top_priority: g });

  return (
    <OnboardingLayout step={3}>
 <div className="w-full max-w-[1080px] mx-auto bg-white rounded-[28px] border border-[#EDE9FF] shadow-xl p-6 md:p-10 overflow-hidden">

  {/* Header Section */}
 <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-4">

  {/* Left Side - Text */}
  <div className="flex-1">
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-1.5 text-xs font-semibold text-[#5B4EE6] border border-[#D4CEFF] shadow-sm">
      <Target className="w-4 h-4" />
      Step 3 of 5
    </span>

    <h1 className="text-[36px] lg:text-[42px] font-extrabold text-[#1F1B4B] leading-tight mt-5 mb-3">
      Goals & Interests
    </h1>

    <div className="h-1 w-16 bg-[#5B4EE6] rounded-full mb-5" />

    <p className="text-[#6B6A8A] text-[15.5px] leading-relaxed max-w-md">
      Pick everything that applies — we'll use this to build your 
      daily plan and recommendations.
    </p>
  </div>

  {/* Right Side - Image (Better Aligned) */}
  <div className="hidden lg:block flex-shrink-0 pt-2">
    <div className="bg-white rounded-3xl p-3 shadow-md">
      <img
        src="https://res.cloudinary.com/mview/image/upload/atlas/onboardingpages3.webp"
        alt="Goals illustration"
        className="w-full h-auto object-contain max-h-[190px]" 
      />
    </div>
  </div>

</div>

  {/* Goals Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
    {ALL_GOALS.map((g) => {
      const isSelected = selected.includes(g.label);
      return (
        <button
          key={g.label}
          type="button"
          onClick={() => toggle(g.label)}
          className={`group relative flex items-center gap-4 rounded-lg px-5 py-3 text-left border-2 transition-all duration-200 hover:shadow-md ${
            isSelected
              ? 'border-[#5B4EE6] bg-white shadow-sm border-[#5B4EE6]/5]'
              : 'border-[#E9E7FA] bg-white hover:border-[#C4B8FF]'
          }`}
        >
          <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-3xl transition-all ${
            isSelected ? 'bg-[#F0EBFF]' : 'bg-[#F8F6FF]'
          }`}>
            {g.emoji}
          </div>

          <span className={`text-[15px] font-semibold leading-tight ${
            isSelected ? 'text-[#5B4EE6]' : 'text-[#2C2A4A]'
          }`}>
            {g.label}
          </span>

          {isSelected && (
            <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-[#5B4EE6] flex items-center justify-center">
              <Check className="w-4 h-4 text-white" strokeWidth={4} />
            </div>
          )}
        </button>
      );
    })}
  </div>

  {/* Top Priority Section */}
  {selected.length > 0 && (
    <div>
      <p className="text-sm font-bold text-[#2C2A4A] mb-4 flex items-center gap-2">
        Top priority <span className="text-[#9B9AB5] font-medium">(pick one)</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {selected.map((goalLabel) => {
          const isPriority = priority === goalLabel;
          const goal = ALL_GOALS.find((g) => g.label === goalLabel);

          return (
            <button
              key={goalLabel}
              onClick={() => setPriority(goalLabel)}
              className={`flex items-center gap-3 rounded-2xl px-5 py-4 text-left font-semibold transition-all border ${
                isPriority
                  ? 'bg-[#5B4EE6] text-white border-[#5B4EE6] shadow-lg'
                  : 'bg-white border-[#E9E7FA] hover:border-[#C4B8FF] text-[#2C2A4A]'
              }`}
            >
              {isPriority ? (
                <Star className="w-5 h-5 text-amber-300 fill-current" />
              ) : (
                <span className="text-xl">{goal?.emoji}</span>
              )}
              <span>{goalLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  )}

</div>
    </OnboardingLayout>
  );
}
