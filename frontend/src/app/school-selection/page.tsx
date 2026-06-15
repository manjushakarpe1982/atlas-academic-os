'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Building2, ArrowLeft, HelpCircle } from 'lucide-react';
import { api, getUser, getToken } from '@/lib/api';
import Link from 'next/link';
import AppHeader from '../_components/AppHeader';

const SCHOOLS = [
  { id: 'arkansas', name: 'University of Arkansas', lms: 'Blackboard Learn', abbr: 'UA', color: 'bg-red-600'  },
  { id: 'tamu',     name: 'Texas A&M University',   lms: 'Canvas',           abbr: 'AM', color: 'bg-red-800'  },
  { id: 'other',    name: 'Other School',            lms: 'Other LMS',        abbr: '?',  color: 'bg-gray-400' },
];

export default function SchoolSelectionPage() {
  const router   = useRouter();
  const [selected, setSelected] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // Get user initial from stored user data
  const user        = getUser();
  const userInitial = user?.full_name?.[0]?.toUpperCase()
    || user?.email?.[0]?.toUpperCase()
    || 'U';

  // Redirect to login if no token
  useEffect(() => {
    if (!getToken()) router.replace('/auth/login');
  }, [router]);

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      // Save school to Supabase via backend
      await api('/api/auth/school', {
        method: 'POST',
        body:   { school: selected },
      });
      // Update stored user object
      if (user) {
        localStorage.setItem('user', JSON.stringify({ ...user, school: selected }));
      }
      router.push('/acknowledgment');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save school. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── HEADER ── */}
   <AppHeader right="avatar" />
      {/* ── CONTENT ── */}
      <main className="flex-1 px-5 pt-8 pb-32">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          Which school do you attend?
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          This helps Atlas connect to your school calendar.
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm font-medium">
            ❌ {error}
          </div>
        )}

        {/* School options */}
        <div className="space-y-3 mb-5">
          {SCHOOLS.map(s => (
            <button key={s.id} onClick={() => setSelected(s.id)}
              className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl text-left transition-all ${
                selected === s.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}>
              <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                {s.abbr === '?' ? <Building2 className="w-5 h-5" /> : s.abbr}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-base">{s.name}</p>
                <p className="text-sm text-gray-400">{s.lms}</p>
              </div>
              {selected === s.id && (
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        <button onClick={handleContinue} disabled={!selected || loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-md text-base">
          {loading ? 'Saving...' : 'Continue →'}
        </button>
        <p className="text-center text-sm text-gray-500 mt-3">
          You can change this later in settings
        </p>
      </main>

      {/* ── FOOTER ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">
          <button onClick={() => router.back()}
            className="flex items-center gap-2 text-base font-semibold text-gray-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <Link href="/help?from=/school-selection"
            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            <HelpCircle className="w-4 h-4" /> Need Help?
          </Link>
        </div>
      </footer>

    </div>
  );
}
