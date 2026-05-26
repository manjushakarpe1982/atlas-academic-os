'use client';

import { useState } from 'react';
import {
  GraduationCap, Landmark, BookOpen, CalendarDays, BarChart3, Lightbulb, ChevronDown,
} from 'lucide-react';
import OnboardingLayout from '../_components/OnboardingLayout';

/* Small left-hand icon box that sits beside a field */
function IconBox({ icon: Icon }: { icon: typeof Landmark }) {
  return (
    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#F4F2FF] text-[#5B4EE6]">
      <Icon className="h-5 w-5" />
    </div>
  );
}

export default function Step2Page() {
  const [institution, setInstitution] = useState('');
  const [fieldStudy, setFieldStudy] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [targetGPA, setTargetGPA] = useState('3.70');

  const fieldInput =
    'h-14 w-full rounded-xl border border-[#E8E8F3] bg-white px-5 text-sm font-medium ' +
    'text-[#1A1A2E] placeholder:text-[#bbb9d4] outline-none transition-all ' +
    'hover:border-[#ABA9FA] focus:border-[#5B4EE6] focus:ring-2 focus:ring-[#5B4EE6]/20';

  return (
    <OnboardingLayout step={2}>
<div className="min-h-full w-full bg-white rounded-[28px] border border-[#ECE9FF] shadow-lg p-6 md:p-10">
  <div className="grid lg:grid-cols-[60%_40%] h-full items-stretch gap-4 ">

    {/* LEFT SECTION - Larger (68%) */}
    <div className="max-w-2xl flex flex-col h-full">

      {/* Header */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#5B4EE6]/10 px-3 py-1 text-[11px] font-bold text-[#5B4EE6] mb-3">
          <GraduationCap className="w-3.5 h-3.5" />
          Step 2 of 5
        </span>

        <h1 className="text-[34px] font-extrabold text-[#14142B] leading-tight mb-1">
          Academic Profile
        </h1>
        <div className="h-1 w-12 rounded-full bg-[#5B4EE6] mb-3" />

        <p className="text-[15px] text-[#77768A] leading-relaxed max-w-md">
          Tell us about your studies so Atlas can personalise your
          plan, study guides, and recommendations.
        </p>
      </div>

      {/* FORM */}
      <div className="space-y-5 flex-1">

        {/* Institution */}
        <div>
          <label className="block text-base font-bold text-[#3A3A52] mb-2">
            Institution / University
          </label>
          <div className="flex items-center gap-3">
            <IconBox icon={Landmark} />
            <input
              className={fieldInput}
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. MIT, Stanford, State University"
            />
          </div>
        </div>

        {/* Field of Study */}
        <div>
          <label className="block text-base font-bold text-[#3A3A52] mb-2">
            Field of Study / Major
          </label>
          <div className="flex items-center gap-3">
            <IconBox icon={BookOpen} />
            <input
              className={fieldInput}
              value={fieldStudy}
              onChange={(e) => setFieldStudy(e.target.value)}
              placeholder="e.g. Computer Science, Biology, Business"
            />
          </div>
        </div>

        {/* Year / Level  +  Target GPA */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-bold text-[#3A3A52] mb-2">
              Year / Level
            </label>
            <div className="flex items-center gap-3">
              <IconBox icon={CalendarDays} />
              <div className="relative flex-1">
                <select
                  className={`${fieldInput} appearance-none pr-10`}
                  value={yearLevel}
                  onChange={(e) => setYearLevel(e.target.value)}
                >
                  <option value="">Select Year</option>
                  {[
                    'Freshman (Year 1)',
                    'Sophomore (Year 2)',
                    'Junior (Year 3)',
                    'Senior (Year 4)',
                    'Graduate Year 1',
                    'Graduate Year 2',
                    'PhD',
                  ].map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B89A5]" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-base font-bold text-[#3A3A52] mb-2">
              Target GPA
            </label>
            <div className="flex items-center gap-3">
              <IconBox icon={BarChart3} />
              <div className="relative flex-1">
                <select
                  className={`${fieldInput} appearance-none pr-10`}
                  value={targetGPA}
                  onChange={(e) => setTargetGPA(e.target.value)}
                >
                  {['4.00', '3.90', '3.80', '3.70', '3.60', '3.50', '3.00'].map(
                    (g) => (
                      <option key={g}>{g}</option>
                    )
                  )}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B89A5]" />
              </div>
            </div>
          </div>
        </div>

        {/* Why We Ask */}
        <div className="flex items-start gap-3 rounded-2xl border border-[#E9E7FA] bg-[#F4F2FF] px-5 py-4 mt-2">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#5B4EE6] text-white">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div>
            <p className="text-base font-bold text-[#5B4EE6] mb-1">
              Why we ask this
            </p>
            <p className="text-base text-[#7A7893] leading-relaxed">
              Atlas uses your institution and field to calibrate study
              guide difficulty, prioritise exam topics, and match you with
              the most relevant academic resources.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT IMAGE PANEL - Smaller (32%) */}
    <div className="hidden lg:flex h-full overflow-hidden rounded-2xl items-center justify-center">
      <img
        src="https://res.cloudinary.com/mview/image/upload/atlas/onboarding2.webp"
        alt="Academic profile illustration"
        className="w-[100%] h-auto max-h-[650px] object-contain"
      />
    </div>
  </div>
</div>
    </OnboardingLayout>
  );
}
