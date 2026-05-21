'use client';

import { useState } from 'react';
import { Target, Check } from 'lucide-react';
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
  const [selected, setSelected] = useState<string[]>(['Improve grades','Exam preparation']);
  const [priority, setPriority] = useState('Improve grades');

  const toggle = (g: string) =>
    setSelected((p) => p.includes(g) ? p.filter((x) => x !== g) : [...p, g]);

  return (
    <OnboardingLayout step={3}>
      <div className="bg-white rounded-[28px] border border-[#ECE9FF] shadow-lg overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_360px]">

          {/* LEFT — goals */}
          <div className="px-8 lg:px-10 py-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#534AB7]/10 text-[#534AB7] text-[11px] font-bold px-3.5 py-1.5 mb-5">
              <Target className="w-3.5 h-3.5" /> Step 3 of 5
            </span>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#14142B] leading-tight mb-2">
              Goals &amp; Interests
            </h1>
            <p className="text-sm text-[#6B6A8A] leading-relaxed mb-6 max-w-md">
              Select everything that applies — Atlas builds your daily plan and recommendations around your goals.
            </p>

            {/* Goal chips */}
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#8B89A5] mb-3">
                Select all that apply
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {ALL_GOALS.map((g) => (
                  <button
                    key={g.label}
                    type="button"
                    onClick={() => toggle(g.label)}
                    className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-[12px] font-semibold border transition-all ${
                      selected.includes(g.label)
                        ? 'border-[#534AB7] bg-[#F4F2FF] text-[#534AB7] shadow-sm'
                        : 'border-[#E8E8F3] bg-white text-[#6F6D89] hover:border-[#534AB7]/30'
                    }`}
                  >
                    <span>{g.emoji}</span>
                    {g.label}
                    {selected.includes(g.label) && (
                      <Check className="w-3 h-3 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority picker */}
            {selected.length > 0 && (
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#8B89A5] mb-3">
                  ⭐ Which is your top priority?
                </p>
                <div className="flex flex-wrap gap-2">
                  {selected.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setPriority(g)}
                      className={`rounded-xl px-4 py-2 text-[12px] font-semibold border transition-all ${
                        priority === g
                          ? 'bg-[#534AB7] border-[#534AB7] text-white shadow-lg shadow-indigo-100'
                          : 'bg-white border-[#E8E8F3] text-[#6F6D89] hover:border-[#534AB7]/30'
                      }`}
                    >
                      {priority === g && '⭐ '}{g}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

         

            <div className="hidden lg:flex h-full w-full overflow-hidden rounded-3xl">
  <img
 src="https://res.cloudinary.com/mview/image/upload/atlas/onboardingpage3.webp"    alt="Academic profile illustration"
    className="w-full h-full object-cover"
  />
</div>
       
        </div>
      </div>
    </OnboardingLayout>
  );
}
