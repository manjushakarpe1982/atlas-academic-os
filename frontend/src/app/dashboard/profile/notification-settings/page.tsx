'use client';
import { useState } from 'react';
import { BarChart3, ChevronDown, CircleHelp, ClipboardList, Clock3, Lightbulb, Target } from 'lucide-react';
import BackHeader from '../BackHeader';

const NOTIFICATIONS = [
  {
    icon: CircleHelp,
    color: 'bg-red-100',
    iconColor: 'text-red-500',
    title: 'Quiz Reminders',
    sub: 'Get notified about upcoming quizzes',
    key: 'quiz',
    def: true
  },
  {
    icon: ClipboardList,
    color: 'bg-blue-100',
    iconColor: 'text-blue-500',
    title: 'Assignment Alerts',
    sub: 'Get notified about assignments',
    key: 'assign',
    def: true
  },
  {
    icon: Clock3,
    color: 'bg-amber-100',
    iconColor: 'text-amber-500',
    title: 'Study Reminders',
    sub: 'Daily study reminders',
    key: 'study',
    def: true
  },
  {
    icon: BarChart3,
    color: 'bg-purple-100',
    iconColor: 'text-purple-500',
    title: 'Weekly Summary',
    sub: 'Receive weekly progress summary',
    key: 'weekly',
    def: false
  },
  {
    icon: Target,
    color: 'bg-green-100',
    iconColor: 'text-green-500',
    title: 'New Grades',
    sub: 'Notify when new grades are posted',
    key: 'grades',
    def: true
  },
  {
    icon: Lightbulb,
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-500',
    title: 'Tips & Updates',
    sub: 'Important tips and updates',
    key: 'tips',
    def: false
  }
];

export default function NotificationSettingsPage() {
  const init = Object.fromEntries(NOTIFICATIONS.map(n => [n.key, n.def]));
  const [prefs, setPrefs] = useState<Record<string,boolean>>(init);
  const [time, setTime] = useState('7:00 PM');

  const toggle = (key: string) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="">
      <BackHeader title="Notification Settings" />

      <div className="px-4 py-5 ">
        <h2 className="text-base font-bold text-gray-900 mb-3">Notification Preferences</h2>

        <div className="bg-white mb-5  rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {NOTIFICATIONS.map((n, i) => (
            <div key={n.key}
              className={`flex items-center gap-3 px-4 py-3.5 ${i < NOTIFICATIONS.length - 1 ? 'border-b border-gray-100' : ''}`}>
           

<div className={`w-9 h-9 ${n.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
  <n.icon className={`w-5 h-5 ${n.iconColor}`} />
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
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <p className="text-[14px] font-bold text-gray-500  mb-2">Reminder Time</p>
          <div className="flex items-center justify-between">
            <span className="text-base font-extrabold text-gray-900">{time}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>

      
      </div>
    </div>
  );
}
