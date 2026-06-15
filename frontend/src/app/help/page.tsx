'use client';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, Clock, Layers, Play } from 'lucide-react';

const STEPS = [
  {
    num: 1,
    title: 'Choose Your School',
    icon: '🏫',
    color: 'bg-orange-100',
  },
  {
    num: 2,
    title: 'Add Your Classes',
    icon: '📚',
    color: 'bg-green-100',
  },
  {
    num: 3,
    title: 'Upload Your Syllabus',
    icon: '📄',
    color: 'bg-blue-100',
  },
  {
    num: 4,
    title: 'Atlas Reads Everything',
    icon: '🤖',
    color: 'bg-purple-100',
  },
  {
    num: 5,
    title: 'Review & Edit',
    icon: '✏️',
    color: 'bg-indigo-100',
  },
  {
    num: 6,
    title: 'Enter Current Grades',
    sub: '(Optional)',
    icon: '📊',
    color: 'bg-pink-100',
  },
  {
    num: 7,
    title: 'Add Your Calendar',
    icon: '📅',
    color: 'bg-amber-100',
  },
  {
    num: 8,
    title: 'Get Smart Study Plans',
    icon: '🎯',
    color: 'bg-teal-100',
  },
];

export default function HelpPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-3">
        <button onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <span className="text-sm font-bold text-indigo-600">How Atlas Works</span>
      </header>

      <main className="flex-1 px-5 pt-6 pb-10">

        {/* ── Hero section ── */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
            How Atlas Works
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Atlas uses AI to turn your syllabus, grades, and calendar into a personalized plan that helps you improve your grades.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1.5 bg-indigo-50 rounded-xl px-3 py-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-700">8 Simple Steps</span>
            </div>
            <div className="flex items-center gap-1.5 bg-indigo-50 rounded-xl px-3 py-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-700">~8 min</span>
            </div>
          </div>

          {/* Hero images */}
          <div className="relative flex justify-center items-end gap-2 h-36 mb-2">
            {/* Sparkles */}
            <span className="absolute top-2 left-6 text-indigo-300 text-sm">✦</span>
            <span className="absolute top-4 right-8 text-purple-200 text-sm">✦</span>

            <Image
              src="https://res.cloudinary.com/mview/image/upload/atlas/needhelppage1.webp"
              alt="Student studying"
              width={130}
              height={130}
              className="object-contain"
              priority
            />
            <Image
              src="https://res.cloudinary.com/mview/image/upload/atlas/needhelppage2.webp"
              alt="Atlas robot"
              width={100}
              height={100}
              className="object-contain mb-2"
              priority
            />
          </div>
        </div>

        {/* ── Steps list ── */}
        <div className="space-y-2 mb-8">
          {STEPS.map((step, i) => (
            <div key={step.num}
              className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer">

              {/* Number circle */}
              <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-extrabold">{step.num}</span>
              </div>

              {/* Icon box */}
              <div className={`w-10 h-10 ${step.color} rounded-xl flex items-center justify-center flex-shrink-0 text-lg`}>
                {step.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">
                  {step.title}
                  {step.sub && (
                    <span className="text-xs font-normal text-gray-400 ml-1">{step.sub}</span>
                  )}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* ── CTA card ── */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl px-5 py-6 text-center">
          {/* Trophy + books */}
          <div className="flex justify-center mb-3">
            <span className="text-5xl">🏆</span>
          </div>

          <h2 className="text-lg font-extrabold text-gray-900 mb-1">
            Ready to improve your grades?
          </h2>
          <p className="text-xs text-gray-500 mb-5">
            Let&apos;s get you set up in just a few minutes
          </p>

          <button onClick={() => router.back()}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md shadow-indigo-200 transition-all mb-3">
            Continue Setup →
          </button>

          <button
            className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 hover:border-indigo-300 text-gray-700 font-bold py-3 rounded-2xl text-sm transition-all">
            <Play className="w-4 h-4 text-indigo-600" />
            Watch Quick Tour
          </button>
        </div>

      </main>
    </div>
  );
}
