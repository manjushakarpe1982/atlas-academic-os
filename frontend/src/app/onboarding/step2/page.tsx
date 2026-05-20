'use client';

import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import OnboardingLayout from '../_components/OnboardingLayout';
import { INP } from '../_components/constants';

export default function Step2Page() {
  const [institution, setInstitution] = useState('');
  const [fieldStudy,  setFieldStudy]  = useState('');
  const [yearLevel,   setYearLevel]   = useState('');
  const [targetGPA,   setTargetGPA]   = useState('3.70');

  return (
    <OnboardingLayout step={2}>
      <div className="bg-white rounded-[28px] border border-[#ECE9FF] shadow-lg overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_380px]">

          {/* LEFT — form */}
          <div className="px-8 lg:px-10 py-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#534AB7]/10 text-[#534AB7] text-[11px] font-bold px-3.5 py-1.5 mb-5">
              <GraduationCap className="w-3.5 h-3.5" /> Step 2 of 5
            </span>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#14142B] leading-tight mb-2">
              Academic Profile
            </h1>
            <p className="text-sm text-[#6B6A8A] leading-relaxed mb-7 max-w-md">
              Tell us about your studies so Atlas can personalise your plan, study guides, and recommendations.
            </p>

            <div className="space-y-5">
              {/* Institution */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#8B89A5] mb-2">
                  Institution / University
                </label>
                <input
                  className="w-full h-12 rounded-xl border border-[#E8E8F3] bg-white px-4 text-sm text-[#1A1A2E] placeholder:text-[#C5C3E8] outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/10 transition-all"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. MIT, Stanford, State University"
                />
              </div>

              {/* Field */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#8B89A5] mb-2">
                  Field of Study / Major
                </label>
                <input
                  className="w-full h-12 rounded-xl border border-[#E8E8F3] bg-white px-4 text-sm text-[#1A1A2E] placeholder:text-[#C5C3E8] outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/10 transition-all"
                  value={fieldStudy}
                  onChange={(e) => setFieldStudy(e.target.value)}
                  placeholder="e.g. Computer Science, Biology, Business"
                />
              </div>

              {/* Year + GPA */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#8B89A5] mb-2">
                    Year / Level
                  </label>
                  <select
                    className="w-full h-12 rounded-xl border border-[#E8E8F3] bg-white px-4 text-sm text-[#1A1A2E] outline-none focus:border-[#534AB7] transition-all"
                    value={yearLevel}
                    onChange={(e) => setYearLevel(e.target.value)}
                  >
                    <option value="">Freshman (Year 1)</option>
                    {['Freshman (Year 1)','Sophomore (Year 2)','Junior (Year 3)','Senior (Year 4)','Graduate Year 1','Graduate Year 2','PhD'].map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#8B89A5] mb-2">
                    Target GPA
                  </label>
                  <select
                    className="w-full h-12 rounded-xl border border-[#E8E8F3] bg-white px-4 text-sm text-[#1A1A2E] outline-none focus:border-[#534AB7] transition-all"
                    value={targetGPA}
                    onChange={(e) => setTargetGPA(e.target.value)}
                  >
                    {['4.00','3.90','3.80','3.70','3.60','3.50','3.00'].map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Why we ask */}
              <div className="rounded-2xl border border-[#E9E7FA] bg-[#F4F2FF] px-5 py-4">
                <p className="text-xs font-bold text-[#534AB7] mb-1">Why we ask this</p>
                <p className="text-[12px] text-[#7A7893] leading-relaxed">
                  Atlas uses your institution and field to calibrate study guide difficulty,
                  prioritise exam topics, and match you with the most relevant academic resources.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — illustration */}
          <div className="hidden lg:flex bg-gradient-to-br from-[#F8F4FF] via-[#F1EAFF] to-[#EBDDFF] items-center justify-center p-8">
            <img
              src="https://res.cloudinary.com/mview/image/upload/atlas/onboardingpage2.webp"
              alt="Academic profile"
              className="w-full max-w-[320px] object-contain"
            />
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
