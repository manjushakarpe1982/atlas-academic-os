'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Check, GraduationCap, BookOpen, Target, Sliders } from 'lucide-react';

export default function AtlasOnboarding() {
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-[#f7f7ff] via-white to-[#f2f0ff]">

      {/* LEFT SIDEBAR */}
      <div className="w-[300px] border-r bg-white/70 backdrop-blur-xl p-6 flex flex-col justify-between">
        
        {/* Logo */}
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">ATLAS</h1>
              <p className="text-xs text-gray-500">Academic OS</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <p className="text-sm text-gray-500">Onboarding Progress</p>
            <p className="text-xs text-gray-400 mb-2">1 of 5</p>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 w-1/5 bg-indigo-500 rounded-full" />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
              <p className="text-sm font-medium">1. Welcome</p>
              <p className="text-xs text-gray-500">Let’s get to know you</p>
            </div>

            <div className="p-3 rounded-xl hover:bg-gray-50">
              <p className="text-sm">2. Academic Profile</p>
              <p className="text-xs text-gray-400">Tell us about your studies</p>
            </div>

            <div className="p-3 rounded-xl hover:bg-gray-50">
              <p className="text-sm">3. Goals & Interests</p>
              <p className="text-xs text-gray-400">What do you want to achieve?</p>
            </div>

            <div className="p-3 rounded-xl hover:bg-gray-50">
              <p className="text-sm">4. Preferences</p>
              <p className="text-xs text-gray-400">Customize your experience</p>
            </div>

            <div className="p-3 rounded-xl hover:bg-gray-50">
              <p className="text-sm">5. Complete</p>
              <p className="text-xs text-gray-400">You’re all set!</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 rounded-xl bg-gray-50 border text-xs text-gray-500">
          <p className="font-medium text-gray-700 mb-1">Your Data is Safe</p>
          We use enterprise-grade security to protect your data and privacy.
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10 flex flex-col justify-between">

        {/* Header */}
        <div>
          <div className="flex justify-between items-center mb-10">
            <div />
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Need help?</span>
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                P
              </div>
              <span>Pooja</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold">
            Welcome to ATLAS! 👋
          </h1>
          <p className="text-gray-500 mt-2">
            Your AI-powered academic companion is ready to help you learn smarter, not harder.
          </p>

          {/* Selection */}
          <div className="mt-8">
  {/* Header */}
  <h2 className="text-xl font-semibold text-indigo-600">
    Let’s get started
  </h2>
  <p className="text-sm text-gray-500 mt-1 mb-6">
    What best describes you?
  </p>

  {/* Grid */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

    {/* CARD COMPONENT STYLE */}
    
    {/* Student (SELECTED) */}
    <div className="relative cursor-pointer rounded-2xl border-2 border-indigo-500 bg-white p-5 shadow-md transition hover:shadow-lg">
      
      {/* radio */}
      <div className="absolute top-3 right-3">
        <div className="h-4 w-4 rounded-full border-2 border-indigo-500 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-indigo-500" />
        </div>
      </div>

      {/* icon */}
      <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4 mx-auto">
  <GraduationCap className="text-indigo-600 w-8 h-8" />
</div>

      <p className="font-semibold text-gray-900">Student</p>
      <p className="text-xs text-gray-500 mt-1">
        I want to learn better and improve my academic performance.
      </p>
    </div>

    {/* Teacher */}
    <div className="relative cursor-pointer rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">

      <div className="absolute top-3 right-3">
        <div className="h-4 w-4 rounded-full border border-gray-300" />
      </div>

      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
  <BookOpen className="text-green-600 w-8 h-8" />
</div>

      <p className="font-semibold text-gray-900">Teacher</p>
      <p className="text-xs text-gray-500 mt-1">
        I want to streamline teaching and support my students.
      </p>
    </div>

    {/* Researcher */}
    <div className="relative cursor-pointer rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">

      <div className="absolute top-3 right-3">
        <div className="h-4 w-4 rounded-full border border-gray-300" />
      </div>

      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 mx-auto">
  <Target className="text-blue-600 w-8 h-8" />
</div>

      <p className="font-semibold text-gray-900">Researcher</p>
      <p className="text-xs text-gray-500 mt-1">
        I want to accelerate my research and discover insights.
      </p>
    </div>

    {/* Professional */}
    <div className="relative cursor-pointer rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">

      <div className="absolute top-3 right-3">
        <div className="h-4 w-4 rounded-full border border-gray-300" />
      </div>

    <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mb-4 mx-auto">
  <Sliders className="text-orange-500 w-8 h-8" />
</div>
      <p className="font-semibold text-gray-900">Professional</p>
      <p className="text-xs text-gray-500 mt-1">
        I want to upskill and advance my career.
      </p>
    </div>

  </div>
</div>

          {/* Feature strip */}
          <div className="mt-10 grid grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-white rounded-xl border flex items-center gap-2">
              <Check className="text-green-500 w-4 h-4" />
              AI Recommendations
            </div>
            <div className="p-3 bg-white rounded-xl border flex items-center gap-2">
              <Check className="text-green-500 w-4 h-4" />
              Smart Study Planning
            </div>
            <div className="p-3 bg-white rounded-xl border flex items-center gap-2">
              <Check className="text-green-500 w-4 h-4" />
              Document Analysis
            </div>
            <div className="p-3 bg-white rounded-xl border flex items-center gap-2">
              <Check className="text-green-500 w-4 h-4" />
              Progress Tracking
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="flex justify-end">
          <Button className="px-8 py-6 text-base rounded-xl bg-indigo-600 hover:bg-indigo-700">
            Continue →
          </Button>
        </div>
      </div>

    {/* RIGHT ILLUSTRATION */}
<div className="w-[420px] hidden xl:flex items-center justify-center relative">

  {/* soft background glow (ONLY UI effect, not cards) */}
  <div className="absolute w-[320px] h-[320px] bg-indigo-200/30 blur-3xl rounded-full" />
  <div className="absolute w-[220px] h-[220px] bg-purple-200/30 blur-3xl rounded-full bottom-10 right-10" />

  {/* ONLY IMAGE (no extra UI elements) */}
  <div className="relative z-10">
    <Image
      src="https://res.cloudinary.com/mview/image/upload/atlas/desktop-hero.webp"
      alt="ATLAS Hero"
      width={420}
      height={520}
      className="object-contain drop-shadow-2xl"
      priority
    />
  </div>

</div>

    </div>
  );
}