'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { User, Calendar, Bell, Shield, ChevronRight } from 'lucide-react';

const NAV = [
  { href:'/settings/profile',       icon:User,     label:'Profile',        desc:'Name, email, institution', color:'bg-indigo-500'  },
  { href:'/settings/schedule',      icon:Calendar, label:'Schedule',       desc:'Study hours & sleep',      color:'bg-emerald-500' },
  { href:'/settings/notifications', icon:Bell,     label:'Notifications',  desc:'Alerts & reminders',       color:'bg-amber-500'   },
  { href:'/settings/privacy',       icon:Shield,   label:'Privacy & Data', desc:'Export, delete, opt-outs', color:'bg-rose-500'    },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="mb-5">
          <h1 className="text-lg md:text-3xl font-extrabold text-gray-900">Settings</h1>
          <p className="text-base text-gray-400 mt-0.5">Manage your account, schedule, and privacy preferences</p>
        </div>

        {/* ── Mobile: tab bar (shown only below lg) ─────────── */}
        <div className="lg:hidden mb-4">
          <div className="flex overflow-x-auto scrollbar-none gap-1.5 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                  }`}>
                  <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Desktop: sidebar + content side by side ───────── */}
        <div className="flex flex-col lg:flex-row gap-5">

          {/* Sidebar — hidden on mobile, shown on lg+ */}
          <aside className="w-full lg:w-[220px] lg:flex-shrink-0 lg:sticky lg:top-6 lg:self-start hidden lg:block">
            <nav className="bg-white border border-gray-100 rounded-2xl p-2 shadow-sm space-y-0.5">
              {NAV.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link key={item.href} href={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all group ${
                      active ? 'bg-white shadow-sm border border-indigo-100' : 'hover:bg-gray-50'
                    }`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      active ? item.color + ' shadow-md' : 'bg-white border border-gray-100 group-hover:border-indigo-100'
                    }`}>
                      <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-400 group-hover:text-indigo-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-base font-semibold leading-none mb-0.5 ${active ? 'text-gray-900' : 'text-gray-700'}`}>
                        {item.label}
                      </p>
                      <p className={`text-[12px] truncate font-light ${active ? 'text-indigo-500' : 'text-gray-400'}`}>
                        {item.desc}
                      </p>
                    </div>
                    {active && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <p className="text-base font-bold text-indigo-800 mb-1">Need help?</p>
              <p className="text-[12px] text-indigo-600 leading-relaxed mb-2">
                Changes are saved when you click Save.
              </p>
              <a href="https://support.claude.com" target="_blank" rel="noreferrer"
                className="text-[13px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                Contact support <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </aside>

          {/* Content — full width on mobile */}
          <div className="flex-1 min-w-0 w-full">
            {children}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
