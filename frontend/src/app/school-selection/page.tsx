'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2 } from 'lucide-react';

const SCHOOLS = [
  { id: 'arkansas', name: 'University of Arkansas', lms: 'Blackboard Learn', abbr: 'UA', color: 'bg-red-600' },
  { id: 'tamu',     name: 'Texas A&M University',   lms: 'Canvas',           abbr: 'AM', color: 'bg-red-800' },
  { id: 'other',    name: 'Other School',            lms: 'Other LMS',        abbr: '?',  color: 'bg-gray-400' },
];

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Which school do you attend?</h1>
        <p className="text-sm text-gray-400 mb-6">This helps Atlas connect to your school calendar.</p>

        <div className="space-y-3 mb-6">
          {SCHOOLS.map(s => (
            <button key={s.id} onClick={() => setSelected(s.id)}
              className={`w-full flex items-center gap-4 p-4 border-2 rounded-2xl text-left transition-all ${
                selected === s.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-gray-300 bg-white'
              }`}>
              <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                {s.abbr === '?' ? <Building2 className="w-5 h-5" /> : s.abbr}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{s.name}</p>
                <p className="text-xs text-gray-400">{s.lms}</p>
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
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md">
          {loading ? 'Saving...' : 'Continue →'}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">You can change this later in settings</p>
      </div>
    </div>
  );
}
