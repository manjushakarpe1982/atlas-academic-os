'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock, Calendar, Brain, CheckCircle2 } from 'lucide-react';
import { Suspense } from 'react';

// ── Static session data keyed by id ──
const SESSIONS: Record<string, {
  subject: string;
  chapter: string;
  topic: string;
  icon: string;
  iconBg: string;
  borderColor: string;
  estimatedMins: number;
  examDate: string;
  reasonBold: string;
  reasonText: string;
  achievements: string[];
  focusAreas: string[];
}> = {
  'calc-ch14': {
    subject: 'Calculus 251',
    chapter: 'Chapter 14',
    topic: 'Integration Techniques',
    icon: '📐',
    iconBg: 'bg-indigo-600',
    borderColor: 'border-indigo-500',
    estimatedMins: 90,
    examDate: 'Fri, May 17',
    reasonBold: 'Your exam is in 3 days',
    reasonText: ' and this topic has the highest impact on your grade.',
    achievements: [
      'Improve your understanding of integration methods',
      'Score better in your upcoming exam',
      'Boost your overall course grade',
    ],
    focusAreas: ['Integration by Parts', 'Substitution', 'Definite Integrals', 'Applications'],
  },
  'chem-review': {
    subject: 'Chemistry 101',
    chapter: 'Lab Review',
    topic: 'Organic Compounds',
    icon: '⚗️',
    iconBg: 'bg-orange-600',
    borderColor: 'border-orange-500',
    estimatedMins: 60,
    examDate: 'Sun, May 18',
    reasonBold: 'Your lab report is due in 4 days',
    reasonText: ' and reviewing key concepts will help you write a stronger report.',
    achievements: [
      'Solidify your understanding of organic compounds',
      'Prepare for a higher lab report score',
      'Build confidence for the final exam',
    ],
    focusAreas: ['Molecular Structures', 'Reaction Mechanisms', 'Lab Procedures', 'Nomenclature'],
  },
  'eng-reading': {
    subject: 'English 201',
    chapter: 'Unit 5',
    topic: 'Reading & Notes',
    icon: '📖',
    iconBg: 'bg-green-600',
    borderColor: 'border-green-500',
    estimatedMins: 45,
    examDate: 'Wed, May 22',
    reasonBold: 'Your essay is due next week',
    reasonText: ' and completing the reading now will give you more time to draft.',
    achievements: [
      'Complete all required readings on time',
      'Gather strong notes for your essay',
      'Improve your overall participation grade',
    ],
    focusAreas: ['Close Reading', 'Thesis Development', 'Citation Practice', 'Critical Analysis'],
  },
};

const DEFAULT_ID = 'calc-ch14';

function SessionContent() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get('id') || DEFAULT_ID;
  const session = SESSIONS[sessionId] || SESSIONS[DEFAULT_ID];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="px-4 h-14 flex items-center gap-3">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-indigo-600" />
          </button>
          <div className="flex-1">
            <p className="text-base font-extrabold text-gray-900">{session.subject}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-6 pb-28">

        {/* ── Subject Card ── */}
        <div className={`bg-white rounded-2xl border-l-4 ${session.borderColor} shadow-sm p-5 flex items-center gap-4`}>
          <div className={`w-14 h-14 ${session.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md`}>
            <span className="text-2xl">{session.icon}</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">{session.subject}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{session.chapter}</p>
            <p className="text-sm text-gray-400">{session.topic}</p>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-base font-extrabold text-gray-900">{session.estimatedMins} min</p>
              <p className="text-[10px] text-gray-400 font-medium">Estimated Time</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-base font-extrabold text-gray-900">{session.examDate}</p>
              <p className="text-[10px] text-gray-400 font-medium">Exam Date</p>
            </div>
          </div>
        </div>

        {/* ── Why Atlas recommended this ── */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-extrabold text-indigo-900 mb-1">Why Atlas recommended this?</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-bold text-gray-800">{session.reasonBold}</span>
              {session.reasonText}
            </p>
          </div>
        </div>

        {/* ── What you'll achieve ── */}
        <div>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">What you&apos;ll achieve</h2>
          <div className="space-y-3">
            {session.achievements.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Focus Areas ── */}
        <div>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">Focus Areas</h2>
          <div className="flex flex-wrap gap-2">
            {session.focusAreas.map((area) => (
              <span
                key={area}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 z-30">
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-base transition-all shadow-lg">
          Continue to Study <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-400">Loading...</div>}>
      <SessionContent />
    </Suspense>
  );
}
