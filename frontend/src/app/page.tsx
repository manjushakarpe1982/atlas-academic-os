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
  { icon: Target,     color: 'bg-indigo-100 text-indigo-600', title: 'Focus on What Matters',  desc: 'Study high-impact topics first.'                   },
  { icon: Calendar,   color: 'bg-orange-100 text-orange-600', title: 'Never Miss a Deadline',  desc: 'All assignments, quizzes, and exams in one place.' },
  { icon: TrendingUp, color: 'bg-green-100 text-green-600',   title: 'Track Progress',         desc: 'See your grades improve over time.'                },
  { icon: Sparkles,   color: 'bg-yellow-100 text-yellow-600', title: 'AI Study Materials',     desc: 'Practice questions, flashcards, and summaries.'    },
];

const TOPICS = [
  { label: 'Cell Division', impact: 'High Impact',   impactColor: 'text-green-600 bg-green-50'  },
  { label: 'Derivatives',   impact: 'Medium Impact', impactColor: 'text-amber-600 bg-amber-50'  },
  { label: 'Lab Report',    impact: 'Low Impact',    impactColor: 'text-gray-500  bg-gray-100'  },
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
           <section className="pt-14">
        <div className="max-w-md mx-auto">
          {/* Outer wrapper drives height from image aspect ratio */}
          <div className="relative w-full" style={{ paddingBottom: '90%' }}>

            {/* Background image — object-contain = never cropped */}
            <Image
              src="https://res.cloudinary.com/mview/image/upload/v1781153485/atlas/homepage1.png"
              alt="Atlas hero"
              fill
              className="object-contain object-right-bottom"
              priority
            />

          

            {/* Text — absolutely positioned top-left, overlapping the image */}
            <div className="absolute inset-0 flex flex-col justify-center px-5 pt-4 pb-4">
              <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-1">
                Smarter Study.
              </h1>
              <h1 className="text-4xl font-extrabold text-indigo-600 leading-tight mb-3">
                Better Grades.
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed mb-5 max-w-[200px]">
                Atlas uses AI to analyze your syllabus, grades, and schedule to tell you what to study and when.
              </p>

              <div className="flex flex-col gap-2.5 max-w-[200px]">
                <Link href="/auth/signup"
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-2xl text-xs shadow-lg shadow-indigo-200 transition-all">
                  Get Started Free <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button className="flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 font-bold py-2.5 px-5 rounded-2xl text-xs hover:border-indigo-300 hover:text-indigo-600 transition-all bg-white/90">
                  <span className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Play className="w-2 h-2 text-indigo-600 ml-0.5" />
                  </span>
                  See How It Works
                </button>
              </div>

              <div className="flex items-center gap-1.5 mt-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-xs text-gray-500 font-medium">Built for college students</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW ATLAS WORKS — column layout ── */}
      <section id="how-it-works" className="py-5 px-5 bg-gray-100">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-3">
            How Atlas Works
          </h2>

          {/* COLUMN — one step per row */}
          <div className="flex flex-col gap-4">
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
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">
            Why Students Choose Atlas
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {WHY_ATLAS.map(f => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center mb-3`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <p className="text-base font-extrabold text-gray-900 mb-1">{f.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
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
