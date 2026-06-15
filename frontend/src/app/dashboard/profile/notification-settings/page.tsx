'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import BackHeader from '../BackHeader';

const NOTIFICATIONS = [
  { icon: '❓', color: 'bg-red-100',    title: 'Quiz Reminders',    sub: 'Get notified about upcoming quizzes',  key: 'quiz',    def: true  },
  { icon: '📋', color: 'bg-blue-100',   title: 'Assignment Alerts', sub: 'Get notified about assignments',       key: 'assign',  def: true  },
  { icon: '⏰', color: 'bg-amber-100',  title: 'Study Reminders',   sub: 'Daily study reminders',                key: 'study',   def: true  },
  { icon: '📊', color: 'bg-purple-100', title: 'Weekly Summary',    sub: 'Receive weekly progress summary',      key: 'weekly',  def: false },
  { icon: '🎯', color: 'bg-green-100',  title: 'New Grades',        sub: 'Notify when new grades are posted',   key: 'grades',  def: true  },
  { icon: '💡', color: 'bg-yellow-100', title: 'Tips & Updates',    sub: 'Important tips and updates',           key: 'tips',    def: false },
];

export default function NotificationSettingsPage() {
  const init = Object.fromEntries(NOTIFICATIONS.map(n => [n.key, n.def]));
  const [prefs, setPrefs] = useState<Record<string,boolean>>(init);
  const [time, setTime] = useState('7:00 PM');

  const toggle = (key: string) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Notification Settings" />

      <div className="px-4 py-5 space-y-4">
        <h2 className="text-sm font-extrabold text-gray-900">Notification Preferences</h2>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {NOTIFICATIONS.map((n, i) => (
            <div key={n.key}
              className={`flex items-center gap-3 px-4 py-3.5 ${i < NOTIFICATIONS.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <div className={`w-9 h-9 ${n.color} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800">{n.title}</p>
                <p className="text-xs text-gray-400">{n.sub}</p>
              </div>
              <button onClick={() => toggle(n.key)}
                className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${prefs[n.key] ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${prefs[n.key] ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>

        {/* Reminder time */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Reminder Time</p>
          <div className="flex items-center justify-between">
            <span className="text-base font-extrabold text-gray-900">{time}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all">
          Save Preferences
        </button>
      </div>
    </div>
  );
}
