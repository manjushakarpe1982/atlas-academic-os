'use client';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import BackHeader from '../BackHeader';
import { useTheme } from '@/context/ThemeContext';

type Theme = 'light' | 'dark' | 'system';

const THEMES: { id: Theme; label: string; sub: string; icon: string }[] = [
  { id: 'light',  label: 'Light Mode',     sub: 'Always use light theme',       icon: '☀️' },
  { id: 'dark',   label: 'Dark Mode',      sub: 'Always use dark theme',        icon: '🌙' },
  { id: 'system', label: 'System Default', sub: 'Follows your device settings', icon: '💻' },
];

export default function DarkModePage() {
  const { theme, setTheme } = useTheme();
  const [applied, setApplied] = useState(false);
  const [pending, setPending] = useState<Theme>(theme);

  const handleApply = () => {
    setTheme(pending);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  const previewBg =
    pending === 'dark'   ? 'from-gray-950 to-gray-800' :
    pending === 'light'  ? 'from-indigo-50 to-white'   :
                           'from-white to-gray-800';

  return (
    <div className="">
      <BackHeader title="Dark Mode" />

      <div className="px-4 py-5 space-y-4">

        {/* Live preview */}
        <div className={`bg-gradient-to-br ${previewBg} rounded-xl p-4 text-center transition-all duration-500 border border-gray-200 shadow-sm`}>
          <div className="text-5xl mb-3">
            {pending === 'dark' ? '🌙' : pending === 'light' ? '☀️' : '💻'}
          </div>
          <h2 className={`text-lg font-extrabold mb-1 ${pending === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {THEMES.find(t => t.id === pending)?.label}
          </h2>
          <p className={`text-sm ${pending === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {pending === 'dark'   ? 'Easy on your eyes at night' :
             pending === 'light'  ? 'Clear and bright display'   :
             'Matches your device setting'}
          </p>

          {/* Mini app preview */}
          <div className={`mt-4 mx-auto w-44 rounded-2xl p-3 shadow-lg ${
            pending === 'dark'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-indigo-600 rounded-lg flex-shrink-0" />
              <div className={`h-2 rounded-full flex-1 ${pending === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`} />
            </div>
            {[100, 75, 50].map((w, i) => (
              <div key={i}
                className={`h-1.5 rounded-full mb-1 ${pending === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                style={{ width: `${w}%` }} />
            ))}
            <div className="h-6 bg-indigo-600 rounded-xl mt-2" />
          </div>
        </div>

        {/* Theme options */}
        <div className="space-y-2.5">
          {THEMES.map(t => (
            <button key={t.id} onClick={() => setPending(t.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                pending === t.id
                  ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-indigo-200 hover:bg-gray-50'
              }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border ${
                t.id === 'dark'   ? 'bg-gray-900 border-gray-700' :
                t.id === 'light'  ? 'bg-amber-50 border-amber-100' :
                                    'bg-gradient-to-br from-white to-gray-800 border-gray-300'
              }`}>
                {t.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="text-base font-bold text-gray-900">{t.label}</p>
                <p className="text-sm text-gray-400">{t.sub}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                pending === t.id ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
              }`}>
                {pending === t.id && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </button>
          ))}
        </div>

        {/* Current status */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3">
          <p className="text-sm text-indigo-700">
            Currently Active: <strong>{THEMES.find(t => t.id === theme)?.label}</strong>
            {pending !== theme && <span className="text-indigo-500"> · Click Apply to switch to {THEMES.find(t => t.id === pending)?.label}</span>}
          </p>
        </div>

        {/* Apply button */}
        <button onClick={handleApply}
          disabled={pending === theme && !applied}
          className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-lg text-base shadow-md transition-all ${
            applied
              ? 'bg-green-500 text-white'
              : pending === theme
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}>
          {applied
            ? <><CheckCircle2 className="w-4 h-4" /> Theme Applied!</>
            : 'Apply Theme'}
        </button>

      </div>
    </div>
  );
}
