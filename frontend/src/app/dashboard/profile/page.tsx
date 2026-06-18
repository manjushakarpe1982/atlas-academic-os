'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, LogOut, Bell } from 'lucide-react';
import { getUser, clearAuth } from '@/lib/api';

const SETTINGS = [
  { label: 'Account Settings',       sub: 'Personal information',       icon: '👤', href: '/dashboard/profile/account-settings'       },
  { label: 'School Settings',        sub: 'Connected school & LMS',     icon: '🏫', href: '/dashboard/profile/school-settings'        },
  { label: 'Calendar Sync',          sub: 'Manage calendar connection', icon: '📅', href: '/dashboard/profile/calendar-sync'          },
  { label: 'Notification Settings',  sub: 'Manage your notifications',  icon: '🔔', href: '/dashboard/profile/notification-settings'  },
  { label: 'Dark Mode',              sub: 'App UI preferences',         icon: '🌙', href: '/dashboard/profile/dark-mode', toggle: true },
  { label: 'Help & Support',         sub: 'Get help and contact us',    icon: '❓', href: '/dashboard/profile/help-support'           },
  { label: 'Privacy & Data',         sub: 'Manage your privacy settings', icon: '🔒', href: '/dashboard/profile/privacy-data'         },
];

export default function ProfilePage() {
  const router  = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    router.push('/auth/login');
  };

  return (
    <div className="px-4 py-4">

      {/* ── Profile card ── */}
      <div className="bg-indigo-600 rounded-3xl p-5 mb-5 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
            👩‍🎓
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-extrabold truncate">{user?.full_name || 'Pooja Sharma'}</p>
            <p className="text-indigo-200 text-sm truncate">{user?.email || 'pooja@student.edu'}</p>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full mt-1 inline-block">Student</span>
          </div>
          <ChevronRight className="w-5 h-5 text-white/60" />
        </div>
        <Link href="/dashboard/profile/account-settings"
          className="block w-full bg-white/20 hover:bg-white/30 text-white font-bold py-2.5 rounded-2xl text-sm text-center transition-all">
          Edit Profile
        </Link>
      </div>

      {/* ── Settings list ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        {SETTINGS.map((s, i) => (
          <Link key={s.label} href={s.href}
            className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-all ${
              i < SETTINGS.length - 1 ? 'border-b border-gray-50' : ''
            }`}>
            <span className="text-xl w-9 text-center">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-gray-800">{s.label}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
            {s.toggle ? (
              <div className="w-10 h-5 bg-gray-200 rounded-full relative flex-shrink-0">
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
              </div>
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
          </Link>
        ))}
      </div>

      {/* ── Logout ── */}
      <button onClick={() => setShowLogout(true)}
        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-3 rounded-xl text-base border border-red-100 hover:bg-red-100 transition-all">
        <LogOut className="w-5 h-5" /> Log Out
      </button>

      {/* ── Logout confirmation modal ── */}
      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowLogout(false)} />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-2xl">🚪</div>
            </div>
            <h2 className="text-lg font-extrabold text-gray-900 text-center mb-1">Log out from Atlas?</h2>
            <p className="text-sm text-gray-500 text-center mb-5">You can sign in again anytime.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogout(false)}
                className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-2xl text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleLogout}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl text-sm shadow-md">
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
