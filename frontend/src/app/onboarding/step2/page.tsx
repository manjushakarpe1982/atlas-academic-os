'use client';

import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import OnboardingLayout from '../_components/OnboardingLayout';
import { INP } from '../_components/constants';

export default function Step2Page() {
  const [institution, setInstitution] = useState('');
  const [fieldStudy, setFieldStudy] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [targetGPA, setTargetGPA] = useState('3.70');

  return (
    <OnboardingLayout step={2}>
      <div className="min-h-full w-full rounded-[32px] bg-[#F8F8FD] p-6 md:p-10">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center h-full">

          {/* LEFT SECTION */}
          <div className="max-w-xl flex flex-col justify-between h-full">

            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#5B4EE6]/10 px-3 py-1 text-[11px] font-bold text-[#5B4EE6] mb-5">
                <GraduationCap className="w-3.5 h-3.5" />
                Step 2 of 5
              </span>

              <h1 className="text-[34px] font-extrabold text-[#14142B] leading-tight mb-3">
                Academic Profile
              </h1>

              <p className="text-sm text-[#77768A] leading-relaxed max-w-md">
                Tell us about your studies so Atlas can personalise your
                plan, study guides, and recommendations.
              </p>
            </div>

            {/* FORM */}
            <div className="space-y-5">

              {/* Institution */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#8B89A5] mb-2">
                  Institution / University
                </label>
                <input
                  className={`${INP} h-14 rounded-xl border border-[#E8E8F3] bg-white px-5 shadow-none focus:ring-2 focus:ring-[#5B4EE6]/20`}
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. MIT, Stanford, State University"
                />
              </div>

              {/* Field */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#8B89A5] mb-2">
                  Field of Study / Major
                </label>
                <input
                  className={`${INP} h-14 rounded-xl border border-[#E8E8F3] bg-white px-5 shadow-none focus:ring-2 focus:ring-[#5B4EE6]/20`}
                  value={fieldStudy}
                  onChange={(e) => setFieldStudy(e.target.value)}
                  placeholder="e.g. Computer Science, Biology, Business"
                />
              </div>

              {/* Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Year */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#8B89A5] mb-2">
                    Year / Level
                  </label>
                  <select
                    className={`${INP} h-14 rounded-xl border border-[#E8E8F3] bg-white px-4`}
                    value={yearLevel}
                    onChange={(e) => setYearLevel(e.target.value)}
                  >
                    <option value="">Freshman (Year 1)</option>
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
                </div>

                {/* GPA */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#8B89A5] mb-2">
                    Target GPA
                  </label>
                  <select
                    className={`${INP} h-14 rounded-xl border border-[#E8E8F3] bg-white px-4`}
                    value={targetGPA}
                    onChange={(e) => setTargetGPA(e.target.value)}
                  >
                    {['4.00', '3.90', '3.80', '3.70', '3.60', '3.50', '3.00'].map(
                      (g) => (
                        <option key={g}>{g}</option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Why We Ask */}
              <div className="rounded-2xl border border-[#E9E7FA] bg-[#F4F2FF] px-5 py-4 mt-2">
                <p className="text-xs font-bold text-[#5B4EE6] mb-1">
                  Why we ask this
                </p>
                <p className="text-[12px] text-[#7A7893] leading-relaxed">
                  Atlas uses your institution and field to calibrate study
                  guide difficulty, prioritise exam topics, and match you with
                  the most relevant academic resources.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex items-center justify-between">
              <button className="rounded-xl border border-[#E6E5F4] bg-white px-6 py-3 text-sm font-semibold text-[#7A7893] hover:bg-gray-50 transition">
                ← Back
              </button>

              <button className="rounded-xl bg-gradient-to-r from-[#5B4EE6] to-[#7A6CF0] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.02]">
                Continue →
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE PANEL */}
          <div className="hidden lg:flex justify-center items-center">
            <img
              src="https://res.cloudinary.com/mview/image/upload/atlas/onboardingpage2.webp"
              alt="Academic profile illustration"
              className="w-full max-w-[520px] object-contain"
            />
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}