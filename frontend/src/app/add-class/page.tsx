'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, BookOpen, LogOut, Brain } from 'lucide-react';

const MOCK_CLASSES = [
  { id: '1', name: 'BIOL 1107 — Intro Biology',    grade: 'B+', pct: 87, term: 'Fall 2026' },
  { id: '2', name: 'MATH 251 — Calculus III',       grade: 'A−', pct: 91, term: 'Fall 2026' },
  { id: '3', name: 'CHEM 1103 — General Chemistry', grade: 'C+', pct: 78, term: 'Fall 2026' },
];

export default function ClassesPage() {
  const router   = useRouter();
  const [classes, setClasses]  = useState(MOCK_CLASSES);
  const [name,    setName]     = useState('');
  const [showForm, setShowForm] = useState(false);

  const addClass = () => {
    if (!name.trim()) return;
    setClasses(p => [...p, { id: Date.now().toString(), name: name.trim(), grade: '—', pct: 0, term: 'Fall 2026' }]);
    setName(''); setShowForm(false);
  };

  const gradeColor = (pct: number) =>
    pct >= 90 ? 'text-emerald-600' : pct >= 70 ? 'text-indigo-600' : pct > 0 ? 'text-amber-600' : 'text-gray-400';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-gray-900 text-lg">Atlas</span>
        </div>
        <button onClick={() => router.push('/auth')}
          className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Classes</h1>
            <p className="text-sm text-gray-400 mt-0.5">Fall 2026 · {classes.length} classes</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md">
            <Plus className="w-4 h-4" /> Add class
          </button>
        </div>

        {/* Add class form */}
        {showForm && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm">
            <p className="text-sm font-bold text-gray-800 mb-3">New class name</p>
            <div className="flex gap-2">
              <input value={name} onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addClass()}
                placeholder="e.g. BIOL 1107 — Intro Biology" autoFocus
                className="flex-1 px-4 py-2.5 border-2 border-gray-200 focus:border-indigo-500 rounded-xl outline-none text-sm transition-all" />
              <button onClick={addClass} disabled={!name.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-sm">
                Add
              </button>
              <button onClick={() => { setShowForm(false); setName(''); }}
                className="border-2 border-gray-200 text-gray-500 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Class list */}
        <div className="space-y-3">
          {classes.map(c => (
            <div key={c.id}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all cursor-pointer"
              onClick={() => router.push('/dashboard')}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 bg-indigo-50 rounded-2xl flex items-center justify-center text-sm font-extrabold text-indigo-600 flex-shrink-0">
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{c.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.term}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className={`text-2xl font-extrabold ${gradeColor(c.pct)}`}>{c.grade}</p>
                {c.pct > 0 && <p className="text-xs text-gray-400">{c.pct}%</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Empty */}
        {classes.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="font-bold text-gray-500 mb-1">No classes yet</p>
            <button onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-700 mt-2">
              Add your first class
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
