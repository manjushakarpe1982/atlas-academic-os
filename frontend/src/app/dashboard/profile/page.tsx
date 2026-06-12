'use client';
import { ChevronRight, LogOut } from 'lucide-react';

const SETTINGS = [
  { label: 'Account Settings',      icon: '👤' },
  { label: 'School Settings',       icon: '🏫' },
  { label: 'Calendar Sync',         icon: '📅', badge: 'Connected' },
  { label: 'Notification Settings', icon: '🔔' },
  { label: 'Study Reminders',       icon: '⏰' },
  { label: 'Dark Mode',             icon: '🌙', toggle: true },
  { label: 'Help & Support',        icon: '❓' },
  { label: 'Privacy Policy',        icon: '🔒' },
];

export default function ProfilePage() {
  return (
    <div className="px-4 py-4">
      {/* Profile card */}
      <div className="bg-indigo-600 rounded-3xl p-5 mb-5 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
            <span className="text-3xl">👩‍🎓</span>
          </div>
          <div>
            <p className="text-lg font-extrabold">Pooja Sharma</p>
            <p className="text-indigo-200 text-sm">pooja.sharma@email.com</p>
          </div>
        </div>
        <button className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-2.5 rounded-2xl text-sm transition-all">
          Edit Profile
        </button>
      </div>

      {/* Settings list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        {SETTINGS.map((s, i) => (
          <div key={s.label}
            className={`flex items-center gap-3 px-4 py-3.5 ${
              i < SETTINGS.length - 1 ? 'border-b border-gray-50' : ''
            } hover:bg-gray-50 transition-all cursor-pointer`}>
            <span className="text-lg w-8 text-center">{s.icon}</span>
            <p className="flex-1 text-sm font-semibold text-gray-800">{s.label}</p>
            {s.badge && (
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{s.badge}</span>
            )}
            {s.toggle ? (
              <div className="w-10 h-5 bg-gray-200 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
              </div>
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-300" />
            )}
          </div>
        ))}
      </div>

      {/* Logout */}
      <button className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-3.5 rounded-2xl text-sm border border-red-100 hover:bg-red-100 transition-all">
        <LogOut className="w-4 h-4" /> Log Out
      </button>
    </div>
  );
}
