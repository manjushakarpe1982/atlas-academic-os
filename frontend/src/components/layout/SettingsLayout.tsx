'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import {
  User, Calendar, Bell, Shield,
  ChevronRight,
} from 'lucide-react';

const SETTINGS_NAV = [
  {
    href:  '/settings/profile',
    icon:  User,
    label: 'Profile',
    desc:  'Name, email, institution',
  },
  {
    href:  '/settings/schedule',
    icon:  Calendar,
    label: 'Schedule',
    desc:  'Study hours, sleep, events',
  },
  {
    href:  '/settings/notifications',
    icon:  Bell,
    label: 'Notifications',
    desc:  'Alerts & reminders',
  },
  {
    href:  '/settings/privacy',
    icon:  Shield,
    label: 'Privacy & Data',
    desc:  'Export, delete, opt-outs',
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AppLayout>
      <div className="p-6 max-w-[1100px] mx-auto">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage your account, schedule, and privacy preferences
          </p>
        </div>

        <div className="flex gap-5">

          {/* ── Left sub-nav ─────────────────────────────── */}
          <aside className="w-[220px] flex-shrink-0">
            <nav className="bg-white border border-gray-100 rounded-2xl p-2 shadow-sm space-y-0.5">
              {SETTINGS_NAV.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                      active
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      active
                        ? 'bg-indigo-600 shadow-md shadow-indigo-500/20'
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold leading-none mb-0.5 ${active ? 'text-indigo-700' : 'text-gray-800'}`}>
                        {item.label}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">{item.desc}</p>
                    </div>
                    {active && (
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Help card */}
            <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <p className="text-xs font-bold text-indigo-800 mb-1">Need help?</p>
              <p className="text-[11px] text-indigo-600 font-light leading-relaxed mb-2">
                Changes are saved automatically. Some settings take effect after refreshing.
              </p>
              <a
                href="https://support.claude.com"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                Contact support <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </aside>

          {/* ── Right content ─────────────────────────────── */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </AppLayout>
  );
}
