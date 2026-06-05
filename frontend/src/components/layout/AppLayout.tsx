'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, BookOpen, Calendar, BarChart2,
  Settings, Bell, Upload, ChevronDown, ChevronRight,
  FileUp, GraduationCap, Layers, Zap, Brain,
  HelpCircle, X, Menu, Activity, CheckCircle2, AlertTriangle, Clock, TrendingUp,
} from 'lucide-react';

// Alias so we can use BookOpen in both MAIN_NAV and STUDY_NAV
const BookOpen2 = BookOpen;

/* ─── Notification data ──────────────────────────────────────── */
const NOTIFS = [
  { id:1, type:'exam',     title:'Biology Midterm in 3 days',           sub:'Thursday May 22 · 9:00 AM',         time:'Now',     read:false, color:'bg-red-500'    },
  { id:2, type:'deadline', title:'Lab Report 3 due tomorrow',            sub:'Biology 101 · 6% of grade',          time:'2h ago',  read:false, color:'bg-orange-500' },
  { id:3, type:'plan',     title:'Your study plan was updated',          sub:'Cell Division moved to #1 priority', time:'3h ago',  read:false, color:'bg-indigo-500' },
  { id:4, type:'grade',    title:'Quiz 3 grade recorded',                sub:'Biology 101 · 82% · B−',             time:'1d ago',  read:true,  color:'bg-emerald-500'},
  { id:5, type:'streak',   title:'5-day study streak! 🔥',               sub:'Keep going to hit 6 days',           time:'1d ago',  read:true,  color:'bg-amber-500'  },
  { id:6, type:'plan',     title:'Statistics PS#4 due Friday',           sub:'2 days away · 8% of grade',          time:'2d ago',  read:true,  color:'bg-blue-500'   },
];

/* ─── Nav structure ──────────────────────────────────────────── */
const MAIN_NAV = [
  { href: '/home',           icon: LayoutDashboard, label: 'Dashboard',      desc: 'Your daily study plan'     },
  { href: '/classes',        icon: BookOpen,        label: 'Classes',        desc: 'All your class workspaces' },
  { href: '/calendar',       icon: Calendar,        label: 'Calendar',       desc: 'Week view & deadlines'     },
  { href: '/grades',         icon: BarChart2,       label: 'Grades',         desc: 'Grade tracker & GPA'       },
  { href: '/analytics',      icon: Activity,        label: 'Analytics',      desc: 'Progress & insights'       },
  { href: '/weekly-review',  icon: TrendingUp,      label: 'Weekly Review',  desc: 'Your week in summary'      },
];

const STUDY_NAV = [
  { href: '/upload',         icon: FileUp,        label: 'Uploads',          desc: 'Add syllabi, audio, notes'   },
  { href: '/study-plan',     icon: Layers,        label: 'Study Plan',       desc: 'AI personalised plan'        },
  { href: '/study-guide',    icon: BookOpen2,     label: 'Study Guide',      desc: 'AI guide from your files'    },
  { href: '/flashcards',     icon: Brain,         label: 'Flashcards',       desc: 'SM-2 spaced repetition'      },
  { href: '/quiz',           icon: GraduationCap, label: 'Quiz',             desc: 'Practice questions'          },
  { href: '/exam-mode',      icon: Zap,           label: 'Exam Mode',        desc: 'Pre-exam cram plan'          },
];

/* ─── Single nav link ────────────────────────────────────────── */
function NavLink({
  href, icon: Icon, label, active,
}: {
  href: string; icon: typeof LayoutDashboard;
  label: string; active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
        active
          ? 'bg-indigo-50 text-indigo-700'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
        active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'
      }`} />
      <span className="flex-1">{label}</span>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0" />}
    </Link>
  );
}

/* ─── Mobile bottom tab bar ──────────────────────────────────── */
function MobileTabBar({ pathname }: { pathname: string }) {
  const tabs = [
    { href: '/home',        icon: LayoutDashboard, label: 'Home'      },
    { href: '/classes',     icon: BookOpen,        label: 'Classes'   },
    { href: '/study-plan',  icon: Layers,          label: 'Plan'      },
    { href: '/analytics',   icon: BarChart2,       label: 'Analytics' },
    { href: '/exam-mode',   icon: Zap,             label: 'Exam'      },
  ];

  return (
    <nav aria-label="Main navigation" className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 flex md:hidden z-40 safe-area-pb">
      {tabs.map((t) => {
        const active = pathname === t.href || pathname.startsWith(t.href + '/');
        return (
          <Link key={t.href} href={t.href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors ${
              active ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
            }`}>
            <t.icon className={`w-5 h-5 ${active ? 'text-indigo-600' : ''}`} />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

/* ─── Main layout ────────────────────────────────────────────── */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [userName,   setUserName]   = useState('Student');
  const [initials,   setInitials]   = useState('S');
  const [studyOpen,  setStudyOpen]  = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs,     setNotifs]     = useState<typeof NOTIFS>([]);

  const unreadCount = notifs.filter((n) => !n.read).length;
  const markAllRead = () => setNotifs((p) => p.map((n) => ({ ...n, read: true })));
  const markRead    = (id: number) => setNotifs((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));

  // First-time students see an empty notifications dropdown.
  // Real notifications will appear once they've added classes / uploaded materials / etc.
  // Toggle via localStorage.atlas_has_notifications = 'true'.
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('atlas_has_notifications') === 'true') {
      setNotifs(NOTIFS);
    }
  }, []);

  useEffect(() => {
    const n = localStorage.getItem('atlas_full_name') || 'Student';
    setUserName(n);
    setInitials(n.split(' ').map((x: string) => x[0]).join('').slice(0, 2).toUpperCase());

    // Auto-open Study Tools if on a study page
    const studyPaths = ['/upload','/study-guide','/flashcards','/quiz','/exam-mode'];
    if (studyPaths.some((p) => pathname.startsWith(p))) setStudyOpen(true);
  }, [pathname]);

  const isStudyActive = STUDY_NAV.some((n) => pathname === n.href || pathname.startsWith(n.href + '/'));

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">

      {/* ── Desktop Sidebar ───────────────────────────────────── */}
      <aside className={`
        hidden md:flex flex-col w-[240px] bg-white border-r border-gray-100 flex-shrink-0
        transition-all duration-300
      `}>

        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-50">
          <Link href="/home" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              A
            </div>
            <div>
              <p className="font-extrabold text-sm leading-none text-gray-900 tracking-wide">ATLAS</p>
              <p className="text-[10px] text-gray-400 font-medium">Academic OS</p>
            </div>
          </Link>
        </div>

        {/* Scrollable nav */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">

          {/* ── Section: Main ───────────────────────────────── */}
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pb-1.5">Main</p>
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href || pathname.startsWith(item.href + '/')}
            />
          ))}

          {/* ── Section: Study Tools ────────────────────────── */}
          <div className="pt-3">
            <button
              onClick={() => setStudyOpen((p) => !p)}
              className={`w-full flex items-center justify-between px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                isStudyActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>Study Tools</span>
              {studyOpen
                ? <ChevronDown className="w-3 h-3" />
                : <ChevronRight className="w-3 h-3" />
              }
            </button>

            {studyOpen && (
              <div className="space-y-0.5">
                {STUDY_NAV.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    active={pathname === item.href || pathname.startsWith(item.href + '/')}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom: Settings + User ──────────────────────── */}
        <div className="px-3 py-3 border-t border-gray-50 space-y-0.5">
          <NavLink href="/settings/profile" icon={Settings} label="Settings"
            active={pathname.startsWith('/settings')} />
          <NavLink href="/help" icon={HelpCircle} label="Help Center"
            active={pathname === '/help'} />

          {/* User card */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-all mt-1 group">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{userName}</p>
              <p className="text-[10px] text-gray-400">Student</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 group-hover:text-gray-600" />
          </div>
        </div>
      </aside>

      {/* ── Mobile Sidebar Overlay ────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[280px] bg-white h-full flex flex-col shadow-2xl">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <Link href="/home" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">A</div>
                <div>
                  <p className="font-extrabold text-sm text-gray-900">ATLAS</p>
                  <p className="text-[10px] text-gray-400">Academic OS</p>
                </div>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pb-1.5">Main</p>
              {MAIN_NAV.map((item) => (
                <div key={item.href} onClick={() => setMobileOpen(false)}>
                  <NavLink href={item.href} icon={item.icon} label={item.label}
                    active={pathname === item.href || pathname.startsWith(item.href + '/')} />
                </div>
              ))}
              <div className="pt-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pb-1.5">Study Tools</p>
                {STUDY_NAV.map((item) => (
                  <div key={item.href} onClick={() => setMobileOpen(false)}>
                    <NavLink href={item.href} icon={item.icon} label={item.label}
                      active={pathname === item.href || pathname.startsWith(item.href + '/')} />
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-gray-50">
                <div onClick={() => setMobileOpen(false)}>
                  <NavLink href="/settings/profile" icon={Settings} label="Settings" active={pathname.startsWith('/settings')} />
                </div>
                <div onClick={() => setMobileOpen(false)}>
                  <NavLink href="/help" icon={HelpCircle} label="Help Center" active={pathname === '/help'} />
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{userName}</p>
                  <p className="text-[11px] text-gray-400">Student</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main area ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-100 px-4 md:px-6 flex items-center justify-between flex-shrink-0">

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-50 text-gray-500 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb — current section label */}
          <div className="hidden md:block text-sm text-gray-400 font-medium">
            {[...MAIN_NAV, ...STUDY_NAV].find((n) =>
              pathname === n.href || pathname.startsWith(n.href + '/')
            )?.label ?? 'Atlas'}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Notification bell + dropdown */}
            <div className="relative">
              <button onClick={() => setShowNotifs((p) => !p)}
                className="relative p-2 rounded-xl hover:bg-gray-50 transition-all">
                <Bell className="w-6 h-6 text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border border-white flex items-center justify-center text-[9px] font-extrabold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifs && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                  <div className="absolute right-0 top-10 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl shadow-black/10 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-extrabold text-gray-900">Notifications</p>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{unreadCount} new</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button onClick={markAllRead}
                            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                            Mark all read
                          </button>
                        )}
                        <button onClick={() => setShowNotifs(false)}
                          className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all">
                          <X className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Notification list — or empty state */}
                    {notifs.length === 0 ? (
                      <div className="px-4 py-10 flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-[#F4F2FF] flex items-center justify-center mb-3">
                          <Bell className="w-6 h-6 text-[#534AB7]" />
                        </div>
                        <p className="text-base font-extrabold text-gray-900 mb-1">You&apos;re all caught up</p>
                        <p className="text-[13px] text-gray-500 leading-relaxed max-w-[220px]">
                          Notifications about deadlines, grades, and study streaks will appear here once you start using Atlas.
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                        {notifs.map((n) => (
                          <div key={n.id} onClick={() => markRead(n.id)}
                            className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-all hover:bg-gray-50 ${!n.read ? 'bg-indigo-50/30' : ''}`}>
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${!n.read ? n.color : 'bg-gray-200'}`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold leading-snug ${!n.read ? 'text-gray-900' : 'text-gray-500'}`}>
                                {n.title}
                              </p>
                              <p className="text-[11px] text-gray-400 mt-0.5">{n.sub}</p>
                            </div>
                            <span className="text-[11px] text-gray-400 flex-shrink-0 mt-0.5">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
                      <Link href="/settings/notifications" onClick={() => setShowNotifs(false)}
                        className="text-[14px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                        Manage notification settings →
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
            <Link href="/upload"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-3 py-2 rounded-xl transition-all shadow-sm shadow-indigo-500/20">
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline">Upload</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* ── Mobile bottom tab bar ─────────────────────────────── */}
      <MobileTabBar pathname={pathname} />
    </div>
  );
}

/* ─── Global keyboard shortcuts ─────────────────────────────── */
// This is exported so it can be used as a hook in any page
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire when typing in inputs
      if (['INPUT','TEXTAREA','SELECT'].includes((e.target as HTMLElement).tagName)) return;
      const key = `${e.ctrlKey||e.metaKey?'mod+':''}${e.key.toLowerCase()}`;
      if (shortcuts[key]) { e.preventDefault(); shortcuts[key](); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
}
