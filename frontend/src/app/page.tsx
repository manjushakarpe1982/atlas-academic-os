'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, CheckCircle2, Target, Calendar, TrendingUp, Sparkles } from 'lucide-react';

const HOW_IT_WORKS = [
  {
    num: '1', color: 'bg-indigo-600', icon: '📄',
    title: 'Upload Syllabus',
    desc:  'Upload your syllabus. Atlas extracts what matters automatically.',
  },
  {
    num: '2', color: 'bg-green-500', icon: '📊',
    title: 'Add Your Grades',
    desc:  'Enter your grades or upload a screenshot. Atlas calculates what impacts your grade most.',
  },
  {
    num: '3', color: 'bg-orange-500', icon: '📅',
    title: 'Get Your Plan',
    desc:  'Get a weekly study plan ranked by grade impact. Focus on what improves your grades fastest.',
  },
];

const WHY_ATLAS = [
  { icon: Target,     color: 'bg-indigo-300 text-indigo-600', title: 'Focus on What Matters',  desc: 'Study high-impact topics first.'                   },
  { icon: Calendar,   color: 'bg-orange-300 text-orange-600', title: 'Never Miss a Deadline',  desc: 'All assignments, quizzes, and exams in one place.' },
  { icon: TrendingUp, color: 'bg-green-300 text-green-600',   title: 'Track Progress',         desc: 'See your grades improve over time.'                },
  { icon: Sparkles,   color: 'bg-yellow-300 text-yellow-600', title: 'AI Study Materials',     desc: 'Practice questions, flashcards, and summaries.'    },
];



export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-extrabold">A</span>
            </div>
            <span className="font-extrabold text-gray-900 text-lg">Atlas</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login"
              className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      {/*
        Strategy: section height = image aspect ratio via paddingBottom trick.
        Image fills the section with object-contain so nothing is cropped.
        Text is absolutely positioned on top with a left-side gradient for readability.
      */}
          <section className="pt-10 md:pt-14 bg-[#F8F9FF] overflow-hidden">
  <div className="relative w-full ">

    

    {/* Content */}
    <div className="relative z-10 px-5 md:px-10 pt-10 md:pt-20">
      <div className="max-w-[320px] md:max-w-[500px]">

        {/* Small Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-xs font-semibold mb-5">
          <CheckCircle2 className="w-4 h-4" />
          Built for College Students
        </div>

        {/* Heading */}
        <h1 className="text-[38px] md:text-6xl font-extrabold text-gray-900 leading-[1.05]">
          Smarter Study.
        </h1>

        <h1 className="text-[38px] md:text-6xl font-extrabold text-indigo-600 leading-[1.05] mb-5">
          Better Grades.
        </h1>

        {/* Description */}
        <p className="text-[15px] md:text-lg text-gray-600 leading-7 mb-7">
          Atlas analyzes your syllabus, grades, and deadlines to tell you
          exactly <span className="font-semibold text-gray-900">what to study</span> and{" "}
          <span className="font-semibold text-gray-900">when to study it.</span>
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

          <Link
            href="/auth/signup"
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl text-base shadow-lg shadow-indigo-200 transition-all"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button className="flex items-center justify-center gap-2 border border-gray-200 bg-white text-gray-700 font-semibold py-3 px-6 rounded-xl text-base hover:border-indigo-300 hover:text-indigo-600 transition-all">
            <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <Play className="w-3 h-3 text-indigo-600 fill-indigo-600" />
            </span>
            See How It Works
          </button>
        </div>

       
      </div>
    </div>
  </div>
</section>

      {/* ── HOW ATLAS WORKS — column layout ── */}
      <section id="how-it-works" className="py-5 px-5 bg-gray-100">
        <div className="">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-3">
            How Atlas Works
          </h2>

          {/* COLUMN — one step per row */}
          <div className="flex flex-col ">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title}>
                <div className="flex items-start gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  {/* Icon + number */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl border border-gray-100">
                      {step.icon}
                    </div>
                    <div className={`w-5 h-5 ${step.color} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-[10px] font-extrabold">{step.num}</span>
                    </div>
                  </div>
                  {/* Text */}
                  <div className="flex-1 pt-1">
                    <p className="text-base font-extrabold text-gray-900 mb-1">{step.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
                {/* Connector arrow between steps */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="flex justify-center my-1">
                    <div className="w-0.5 h-5 bg-gray-300 rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY STUDENTS CHOOSE ATLAS ── */}
      <section id="features" className="py-4 px-5 bg-white">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-4">
            Why Students Choose Atlas
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {WHY_ATLAS.map(f => (
            <div key={f.title} className="bg-gray-50 rounded-2xl p-2 border border-gray-100">
  <div className="flex items-start gap-4">
    {/* Icon */}
    <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
      <f.icon className="w-5 h-5 text-white" />
    </div>

    {/* Heading + Description */}
    <div className="flex-1">
      <h3 className="text-base font-extrabold text-gray-900 mb-1">
        {f.title}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">
        {f.desc}
      </p>
    </div>
  </div>
</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-5 px-3 bg-gradient-to-br from-indigo-400 to-indigo-500">
        <div className="max-w-md mx-auto text-center">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">Ready to Study Smarter?</h2>
          <p className="text-sm text-indigo-200 mb-6">Set up your semester in under 10 minutes.</p>
          <Link href="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 font-extrabold py-3.5 px-8 rounded-2xl text-sm shadow-lg hover:bg-indigo-50 transition-all">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
         
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 py-6 px-5 text-center">
        
        <p className="text-base text-gray-400">
          © 2026 Atlas Academic OS · University of Arkansas &amp; Texas A&amp;M Beta
        </p>
      </footer>

    </div>
  );
}
