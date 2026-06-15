'use client';
import Image from 'next/image';
import { CheckCircle2, ChevronRight, Target, TrendingUp, BookOpen, ArrowRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface Props { onNext: () => void; }

const STATS = [
  { icon: '📚', value: '5',   label: 'Courses',        sub: 'Added'           },
  { icon: '📋', value: '28',  label: 'Assignments',    sub: 'Imported'        },
  { icon: '📅', value: '17',  label: 'Important Dates',sub: 'Added'           },
  { icon: '📊', value: '92%', label: 'Data Accuracy',  sub: 'High Confidence', highlight: true },
];

const NEXT_STEPS = [
  { icon: Target,     color: 'bg-indigo-100 text-indigo-600', title: 'Create Your Study Plan',    sub: 'Get a personalised weekly plan based on your deadlines and priorities.' },
  { icon: TrendingUp, color: 'bg-green-100 text-green-600',   title: 'Track Your Progress',       sub: 'Monitor your grades, assignments, and study goals.'                     },
  { icon: BookOpen,   color: 'bg-amber-100 text-amber-600',   title: 'Start Studying Smarter',    sub: 'Access AI study tools, summaries, and practice questions.'             },
];

export default function CalScreen6({ onNext }: Props) {

  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">

      {/* ── Header ── */}
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xs font-extrabold">A</span>
          </div>
          <span className="font-extrabold text-gray-900">Atlas</span>
        </div>
        <Link href="/help"
          className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800">
          <HelpCircle className="w-4 h-4" /> How it works
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-6 pb-8">

        {/* ── Hero illustration ── */}
        <div className="relative flex justify-center mb-5">
          {/* Confetti decorations */}
          <span className="absolute top-0 left-8 text-green-400 text-lg rotate-45">—</span>
          <span className="absolute top-2 right-10 text-amber-400 text-sm">✦</span>
          <span className="absolute top-6 left-16 text-indigo-300 text-xs">✦</span>
          <span className="absolute bottom-0 right-8 text-green-300 text-lg -rotate-12">—</span>
          <span className="absolute bottom-4 left-6 text-indigo-400 text-sm">✦</span>

          <Image
            src="https://res.cloudinary.com/mview/image/upload/v1781271405/atlas/addcalsuccess.png"
            alt="Calendar added successfully"
            width={160}
            height={160}
            className="object-contain"
            priority
          />
        </div>

        {/* ── Headline ── */}
        <div className="text-center mb-5">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Calendar added{' '}
            <span className="text-indigo-600">successfully!</span>
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            We&apos;ve imported your syllabus, grades, and important dates.<br />
            You&apos;re all set to start studying smarter.
          </p>
        </div>

        {/* ── Import summary card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
          {/* Successfully imported badge */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
            <p className="text-sm font-bold text-gray-800">Successfully imported</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {STATS.map(s => (
              <div key={s.label} className="flex flex-col items-center text-center">
                <span className="text-xl mb-1">{s.icon}</span>
                <p className={`text-lg font-extrabold ${s.highlight ? 'text-indigo-600' : 'text-gray-900'}`}>
                  {s.value}
                </p>
                <p className="text-[10px] font-bold text-gray-700 leading-tight">{s.label}</p>
                <p className={`text-[9px] leading-tight ${s.highlight ? 'text-indigo-500 font-semibold' : 'text-gray-400'}`}>
                  {s.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Sync note */}
          <div className="flex items-start gap-2 bg-indigo-50 rounded-xl px-3 py-2.5">
            <span className="text-sm mt-0.5">✨</span>
            <p className="text-xs text-indigo-700 leading-relaxed">
              We&apos;ll keep your calendar in sync and notify you about upcoming deadlines.
            </p>
          </div>
        </div>

        {/* ── What's next ── */}
        <div className="mb-6">
          <h2 className="text-base font-extrabold text-gray-900 mb-3">What&apos;s next?</h2>
          <div className="space-y-2">
            {NEXT_STEPS.map(step => (
              <div key={step.title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 px-4 py-3.5">
                <div className={`w-10 h-10 ${step.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-gray-900">{step.title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{step.sub}</p>
                </div>
                <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA buttons ── */}
        <button onClick={onNext}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-indigo-200 transition-all mb-3">
          Continue to Dashboard <ArrowRight className="w-5 h-5" />
        </button>

        <button onClick={onNext}
          className="w-full text-sm font-semibold text-indigo-600 hover:text-indigo-800 py-2 transition-colors">
          Explore features first
        </button>

      </main>
    </div>
  );
}
