'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Target, Calendar, User } from 'lucide-react';

const NAV = [
  { href: '/dashboard',              icon: Home,      label: 'Home'       },
  { href: '/dashboard/classes',      icon: BookOpen,  label: 'Classes'    },
  { href: '/dashboard/study-plan',   icon: Target,    label: 'Study Plan' },
  { href: '/dashboard/calendar',     icon: Calendar,  label: 'Calendar'   },
  { href: '/dashboard/profile',      icon: User,      label: 'Profile'    },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg max-w-md mx-auto">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV.map(n => {
          const active = path === n.href;
          return (
            <Link key={n.href} href={n.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                active ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}>
              <n.icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : ''}`} />
              <span className={`text-[10px] font-semibold ${active ? 'text-indigo-600' : ''}`}>
                {n.label}
              </span>
              {active && <div className="w-1 h-1 bg-indigo-600 rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
