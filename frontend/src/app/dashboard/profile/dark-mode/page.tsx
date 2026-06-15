'use client';
import { useState } from 'react';
import BackHeader from '../BackHeader';

const THEMES = [
  { id: 'light',   label: 'Light Mode',    sub: 'Always use light theme',  icon: '☀️', bg: 'bg-white border-gray-200'    },
  { id: 'dark',    label: 'Dark Mode',     sub: 'Always use dark theme',   icon: '🌙', bg: 'bg-gray-900 border-gray-700'  },
  { id: 'system',  label: 'System Default',sub: 'Use device settings',     icon: '💻', bg: 'bg-gray-100 border-gray-200'  },
];

export default function DarkModePage() {
  const [selected, setSelected] = useState('system');

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Dark Mode" />

      <div className="px-4 py-5 space-y-4">

        {/* Moon illustration */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-center text-white">
          <div className="text-6xl mb-3">🌙</div>
          <h2 className="text-xl font-extrabold mb-1">Choose Your Theme</h2>
          <p className="text-indigo-200 text-sm">Select the theme that works best<br />for your eyes and environment.</p>
        </div>

        {/* Theme options */}
        <div className="space-y-3">
          {THEMES.map(t => (
            <button key={t.id} onClick={() => setSelected(t.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                selected === t.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'
              }`}>
              <div className={`w-12 h-12 ${t.bg} rounded-xl border flex items-center justify-center text-2xl flex-shrink-0`}>
                {t.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-extrabold text-gray-900">{t.label}</p>
                <p className="text-xs text-gray-400">{t.sub}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selected === t.id ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
              }`}>
                {selected === t.id && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </button>
          ))}
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all">
          Apply Theme
        </button>
      </div>
    </div>
  );
}
