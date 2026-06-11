'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Building2, ArrowLeft, HelpCircle } from 'lucide-react';

const SCHOOLS = [
  { id: 'arkansas', name: 'University of Arkansas', lms: 'Blackboard Learn', abbr: 'UA', color: 'bg-red-600'  },
  { id: 'tamu',     name: 'Texas A&M University',   lms: 'Canvas',           abbr: 'AM', color: 'bg-red-800'  },
  { id: 'other',    name: 'Other School',            lms: 'Other LMS',        abbr: '?',  color: 'bg-gray-400' },
];

// First letter avatar — derived from logged-in user's name
// TODO: replace with real user data from auth context
const USER_INITIAL = 'J';

export default function SchoolSelectionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleContinue = () => {
    if (!selected) return;
    setLoading(true);
    // TODO: connect to backend
    setTimeout(() => { setLoading(false); router.push('/acknowledgment'); }, 500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col ">

      {/* ── STICKY HEADER ── */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-5 h-14 flex items-center justify-between">

          {/* Left — Atlas icon + name */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-gray-900 text-base">Atlas</span>
          </div>

          {/* Right — user initial avatar */}
          <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-extrabold">{USER_INITIAL}</span>
          </div>

        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 px-5 pt-8 pb-32">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          Which school do you attend?
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          This helps Atlas connect to your school calendar.
        </p>

        {/* School options */}
        <div className="space-y-3 mb-5">
          {SCHOOLS.map(s => (
            <button key={s.id} onClick={() => setSelected(s.id)}
              className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl text-left transition-all ${
                selected === s.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}>
              {/* School logo */}
              <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                {s.abbr === '?' ? <Building2 className="w-5 h-5" /> : s.abbr}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-base">{s.name}</p>
                <p className="text-sm text-gray-400">{s.lms}</p>
              </div>
              {/* Selected checkmark */}
              {selected === s.id && (
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-md text-base">
          {loading ? 'Saving...' : 'Continue →'}
        </button>
        <p className="text-center text-sm text-gray-500 mt-3">
          You can change this later in settings
        </p>
      </main>

      {/* ── FIXED FOOTER ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">

          {/* Left — Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-base font-semibold text-gray-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Right — Need Help */}
          <a
            href="#"
            onClick={e => e.preventDefault()}
            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            <HelpCircle className="w-4 h-4" />
            Need Help?
          </a>

        </div>
      </footer>

    </div>
  );
}
