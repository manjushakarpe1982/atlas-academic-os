'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, FileText, BarChart2, Calendar, Edit3, Shield, Lock } from 'lucide-react';

const ITEMS = [
  { icon: FileText,  title: 'Upload your syllabus',                    desc: 'so Atlas can understand your course structure, grading breakdown, and important dates.'           },
  { icon: BarChart2, title: 'Add grades (optional)',                   desc: 'to get smarter, more accurate study recommendations.'                                              },
  { icon: Calendar,  title: 'Connect your school calendar (optional)', desc: 'to automatically track assignments, quizzes, and deadlines.'                                       },
  { icon: Edit3,     title: 'Review and edit anything Atlas extracts', desc: "AI may make mistakes, and you're always in control."                                               },
  { icon: Shield,    title: 'Atlas gives study recommendations',       desc: 'to help improve your academic outcomes, but recommendations are guidance, not guarantees.'          },
];

export default function AcknowledgmentPage() {
  const router  = useRouter();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!checked) return;
    setLoading(true);
    // TODO: connect to backend POST /api/ack
    setTimeout(() => { setLoading(false); router.push('/add-class'); }, 600);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto">

      {/* ── HEADER ── */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900">Acknowledgment</h1>
          <div className="w-8" />
        </div>
        {/* Progress bar */}
        <div className="flex gap-1.5 mb-1">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`flex-1 h-1 rounded-full ${i <= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          ))}
        </div>
        <p className="text-xs font-semibold text-indigo-600 text-center">Step 2 of 5</p>
      </div>

      {/* ── HERO IMAGE + HEADLINE ── */}
      <div className="px-5 pt-2 pb-4 flex items-center gap-4">
        <div className="flex-shrink-0 w-24 h-24 relative">
          <Image
            src="https://res.cloudinary.com/mview/image/upload/v1781153670/atlas/acknowledgment.png"
            alt="Acknowledgment illustration"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-2">
            Before we get started
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Atlas works best when your syllabus, grades, and class schedule are up to date.
          </p>
        </div>
      </div>

      {/* ── LIST — scrollable, ends before footer ── */}
      <div className="px-5 pb-44 flex-1 overflow-y-auto">
        <p className="text-sm font-extrabold text-indigo-600 mb-3">Here&apos;s what to expect:</p>
        <div className="space-y-2">
          {ITEMS.map(item => (
            <div key={item.title}
              className="flex items-start gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <item.icon className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-snug">{item.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FIXED FOOTER — checkbox + button + privacy ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-md mx-auto px-5 pt-4 pb-6">

          {/* Checkbox */}
          <label className="flex items-center gap-3 mb-4 cursor-pointer">
            <div
              onClick={() => setChecked(!checked)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                checked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'
              }`}>
              {checked && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-700 font-medium">I understand and want to continue</span>
          </label>

          {/* Continue button */}
          <button
            onClick={handleContinue}
            disabled={!checked || loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-indigo-200 transition-all mb-3">
            {loading ? 'Setting up...' : 'Continue Setup'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>

          {/* Privacy note */}
          <div className="flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs text-gray-400 text-center">
              Your data stays private and under your control. We never share your information.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
