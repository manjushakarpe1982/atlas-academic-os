'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, Target, Calendar, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getToken, getUser } from '@/lib/api';
import AppHeader from './_components/AppHeader';
import { Button } from '@/components/ui/button';


const HOW_STEPS = [
  { num: 1, color: 'bg-indigo-600', icon: '📄', title: 'Upload Syllabus',     desc: 'Upload your syllabus. Atlas detects what matters automatically.' },
  { num: 2, color: 'bg-green-500',  icon: '📊', title: 'Add Your Grades',     desc: 'Enter grades or upload a screenshot. Atlas calculates what impacts your grade most.' },
  { num: 3, color: 'bg-orange-500', icon: '📅', title: 'Get Smart Study Plan',desc: 'Atlas creates a personalized study plan based on importance and deadlines.' },
  { num: 4, color: 'bg-red-500',    icon: '🎯', title: 'Study Smarter',       desc: 'Focus on what matters most and improve your grades.' },
];

const WHY_FEATURES = [
  { icon: Target,     color: 'bg-indigo-100 text-indigo-600', title: 'Focus on What Matters',  desc: 'Study high-impact topics first.'                        },
  { icon: Calendar,   color: 'bg-red-100 text-red-500',       title: 'Never Miss a Deadline',  desc: 'All assignments, quizzes, and exams in one place.'      },
  { icon: TrendingUp, color: 'bg-green-100 text-green-600',   title: 'Track Progress',         desc: 'See your grades improve over time.'                     },
  { icon: Sparkles,   color: 'bg-yellow-100 text-yellow-600', title: 'AI Study Materials',     desc: 'Practice questions, flashcards, and summaries.'         },
];

const PREVIEW_ROWS = [
  { subject: 'Biology • Chapter 5',  tag: 'High Impact',   tagColor: 'text-red-500' },
  { subject: 'Maths • Chapter 5',    tag: 'Medium Impact', tagColor: 'text-amber-500' },
  { subject: 'Chemistry • Chapter 4',tag: 'Due Soon',      tagColor: 'text-indigo-500' },
];

export default function LandingPage() {
   const router = useRouter();


  const handleGetStarted = () => {
    const token = getToken();
    if (!token) { router.push('/auth/signup'); return; }

    const user = getUser();
    if (!user?.school)         { router.push('/school-selection'); return; }
    if (!user?.acknowledged_at){ router.push('/acknowledgment');   return; }
    router.push('/dashboard');
  };
  return (
    <div className="min-h-screen bg-white">

      <AppHeader right="both" />

      {/* ── HERO — bg image full visible, text overlaps left side ── */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: 260 }}>

        {/* Background image — full show, no crop */}
        <Image
          src="https://res.cloudinary.com/mview/image/upload/atlas/newhomepage.webp"
          alt="Atlas hero background"
          width={480}
          height={720}
          className="w-full h-auto block"
          style={{ objectFit: 'contain', objectPosition: 'top right' }}
          priority
        />

     
        {/* Text — absolutely positioned over image, left side */}
        <div className="absolute inset-0 flex flex-col justify-center px-3 ">
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight ">
            Smarter Study.
          </h1>
          <h1 className="text-3xl font-extrabold text-indigo-600 leading-tight mb-2">
            Better Grades.
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed  max-w-[190px]">
            Atlas analyses your syllabus, grades, and deadlines to tell you{' '}
            <span className="font-bold text-gray-900">what</span> to study and <span className="font-bold text-gray-900">when</span> to study it.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-row gap-2.5 ">
            <Button onClick={handleGetStarted}
              className="flex items-center justify-center  bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 px-2 rounded-xl text-sm shadow-lg shadow-indigo-200 transition-all">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
            <button
              className="flex items-center justify-center  border-2 border-gray-300 text-gray-700 font-bold py-2 px-2  rounded-xl text-sm hover:border-indigo-400 hover:text-indigo-600 transition-all bg-white/80">
              <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Play className="w-2.5 h-2.5 text-indigo-600 ml-0.5" />
              </span>
              See How It Works
            </button>
          </div>
        </div>

      </section>

      {/* ── HOW ATLAS WORKS ── */}
      <section className="py-5 px-5 bg-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-px bg-gray-300" />
          <h2 className="text-xl font-extrabold text-gray-900 whitespace-nowrap">How Atlas Works</h2>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div className="space-y-3">
          {HOW_STEPS.map(s => (
            <div key={s.num}
              className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              {/* Number + Icon */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center text-2xl">
                  {s.icon}
                </div>
                <div className={`absolute -top-1.5 -left-1.5 w-5 h-5 ${s.color} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-[10px] font-extrabold">{s.num}</span>
                </div>
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-base font-extrabold text-gray-900">{s.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed mt-0.5">{s.desc}</p>
              </div>
             
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY STUDENTS CHOOSE ATLAS ── */}
      <section className="py-3 px-5 bg-gray-50">
        <h2 className="text-xl font-extrabold text-gray-900 text-center mb-5">Why Students Choose Atlas</h2>
        <div className="grid grid-cols-1 gap-3">
          {WHY_FEATURES.map(f => (
           <div key={f.title} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
  <div className="flex items-start gap-3">
    {/* Icon */}
    <div className={`w-9 h-9 ${f.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <f.icon className="w-4 h-4" />
    </div>

    {/* Text content */}
    <div className="flex-1 min-w-0">
      <p className="text-base font-extrabold text-gray-900 mb-0.5">{f.title}</p>
      <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
    </div>
  </div>
</div>
          ))}
        </div>
      </section>

      {/* ── READY TO STUDY SMARTER CTA ── */}
      <section className="py-8 px-5 bg-indigo-500 mx-4 my-5 rounded-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white leading-tight mb-1">
              Ready to Study<br />Smarter?
            </h2>
            <p className="text-indigo-200 text-xs leading-relaxed">
              Set up your semester<br />in under 10 minutes.
            </p>
          </div>
          {/* Mini preview card */}
          <div className="bg-white rounded-2xl p-3 w-36 flex-shrink-0 shadow-lg">
            <p className="text-[9px] font-extrabold text-gray-500 mb-2">This Week&apos;s Plan</p>
            <div className="space-y-1.5 mb-2">
              {PREVIEW_ROWS.map(r => (
                <div key={r.subject} className="flex items-center justify-between gap-1">
                  <p className="text-[9px] text-gray-700 truncate flex-1">{r.subject}</p>
                  <span className={`text-[8px] font-bold flex-shrink-0 ${r.tagColor}`}>{r.tag}</span>
                </div>
              ))}
            </div>
            <div className="pt-1.5 border-t border-gray-100">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[9px] font-bold text-gray-500">Overall Progress</p>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full w-3/4" />
              </div>
              <p className="text-[9px] text-indigo-600 font-bold mt-0.5 text-right">75%</p>
            </div>
          </div>
        </div>

        <Button onClick={handleGetStarted}
          className="flex items-center justify-center gap-2 bg-white text-indigo-600 font-extrabold py-5 px-6 rounded-2xl text-sm shadow-md hover:bg-indigo-50 transition-all">
          Get Started Free <ArrowRight className="w-4 h-4" />
        </Button>

        <p className="text-center text-indigo-300 text-[10px] mt-3 flex items-center justify-center gap-1">
          🔒 Your data is encrypted and private.
        </p>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 py-5 px-5 text-center">
      
        <p className="text-xs text-gray-400">© 2026 Atlas Academic OS · University of Arkansas & Texas A&M Beta</p>
      </footer>

    </div>
  );
}
