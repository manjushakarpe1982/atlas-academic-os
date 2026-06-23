'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Home, BookOpen, Target, Calendar, User, Bell, ClipboardList, BarChart3, Brain, HelpCircle, Settings, LogOut, BookOpenCheck, FileText, AlertTriangle } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { clearAuth } from '@/lib/api';

const MENU_ITEMS = [
  { href: '/dashboard',              icon: Home,          label: '1. Home (Dashboard)'  },
  { href: '/dashboard/classes',      icon: BookOpen,      label: '2. Classes'           },

 
  { href: '/dashboard/materials',    icon: BookOpen,      label: '3. Study Materials'   },
  { href: '/dashboard/study-plan',   icon: Target,        label: '4. Study Plan'        },
  { href: '/dashboard/calendar',     icon: Calendar,      label: '5. Calendar'          },
 
 
 
 
];

// ── Static notification data ──
const NOTIFICATIONS = [
  {
    id: '1',
    icon: AlertTriangle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    title: 'Biology Quiz Tomorrow',
    body: 'Worth 30% of your grade. Start studying now!',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: '2',
    icon: FileText,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    title: 'Calculus Homework Due',
    body: 'Due Friday, May 17. 3 problems remaining.',
    time: '5 hours ago',
    unread: true,
  },
  {
    id: '3',
    icon: BookOpenCheck,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Study Plan Updated',
    body: 'Your study plan for this week has been refreshed.',
    time: '1 day ago',
    unread: true,
  },
  {
    id: '4',
    icon: Brain,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    title: 'Atlas Tip',
    body: 'You completed 3 of 5 study sessions. Keep it up!',
    time: '2 days ago',
    unread: false,
  },
];

interface Props { title?: string; showBack?: boolean; }

export default function TopHeader({ title, showBack }: Props) {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const path = usePathname();

  // Close notification panel when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <header>
  <div className="px-4 h-14 flex items-center justify-between">
    
    {/* Left Side */}
    <div className="flex items-center gap-4">
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="w-8 h-8 flex flex-col justify-center gap-1.5 group"
      >
        <span className="w-5 h-0.5 bg-gray-700 rounded-full transition-all group-hover:w-6" />
        <span className="w-6 h-0.5 bg-gray-700 rounded-full" />
        <span className="w-4 h-0.5 bg-gray-700 rounded-full transition-all group-hover:w-6" />
      </button>

      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
          <span className="text-white text-xs font-extrabold">A</span>
        </div>
        <span className="font-extrabold text-gray-900">Atlas</span>
      </Link>
    </div>

    {/* Right Side */}
    <div className="flex items-center gap-4">
      {/* Notification Bell — opens panel, no redirect */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification Panel */}
        {notifOpen && (
          <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
            {/* Panel Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-gray-900">Notifications</h3>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            </div>

            {/* Notification Items */}
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
              {NOTIFICATIONS.map(n => (
                <div
                  key={n.id}
                  className={`px-4 py-3 flex items-start gap-3 transition-colors hover:bg-gray-50 cursor-pointer ${
                    n.unread ? 'bg-indigo-50/40' : ''
                  }`}
                >
                  <div className={`w-9 h-9 ${n.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <n.icon className={`w-4 h-4 ${n.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900 truncate">{n.title}</p>
                      {n.unread && (
                        <span className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Panel Footer */}
            <div className="border-t border-gray-100 px-4 py-2.5">
              <button
                onClick={() => setNotifOpen(false)}
                className="w-full text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Mark all as read
              </button>
            </div>
          </div>
        )}
      </div>

      <UserAvatar />
    </div>
  </div>
</header>
      </header>

      {/* Drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

          {/* Drawer */}
          <div className="relative w-64 bg-white pb-14 h-full flex flex-col shadow-2xl">
            {/* Drawer header */}
            <div className="bg-indigo-600 px-5 pt-4 pb-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-white font-extrabold">A</span>
                  </div>
                  <div>
                    <p className="text-white font-extrabold text-base">Atlas</p>
                    <p className="text-indigo-200 text-xs">AI Study Assistant</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)}>
                  <X className="w-5 h-5 text-white/80 hover:text-white" />
                </button>
              </div>
              {/* User info */}
            
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto py-2">
              <p className="text-[14px] font-extrabold text-gray-400 uppercase tracking-widest px-5 py-2">ALL SCREENS</p>
              {MENU_ITEMS.map(item => {
                const active = path === item.href;
                return (
                  <Link key={item.href} href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-5 py-3 text-sm font-semibold transition-all ${
                      active ? 'bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                    <item.icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-3 space-y-1">
              <Link href="/help" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-xl font-semibold">
                <HelpCircle className="w-4 h-4 text-gray-400" /> Help & Support
              </Link>
              <Link href="/dashboard/profile" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-xl font-semibold">
                <Settings className="w-4 h-4 text-gray-400" /> Settings
              </Link>
              <button onClick={() => { clearAuth(); window.location.href = '/auth/login'; }} className="w-full flex items-center gap-3 px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded-xl font-semibold">
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}