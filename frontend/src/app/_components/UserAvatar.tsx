'use client';
/**
 * UserAvatar — shows login status in every header.
 * - Logged in  → colored circle with first letter + dropdown (Profile, Logout)
 * - Logged out → "Sign In" link
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { getUser, clearAuth } from '@/lib/api';

export default function UserAvatar() {
  const router  = useRouter();
  const [user,    setUser]    = useState<{ full_name?: string; email?: string } | null>(null);
  const [open,    setOpen]    = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Read user from localStorage on mount
  useEffect(() => {
    setUser(getUser());
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setOpen(false);
    router.push('/auth/login');
  };

  const initial = user?.full_name?.[0]?.toUpperCase()
    || user?.email?.[0]?.toUpperCase()
    || 'U';

  // ── Not logged in ──
  if (!user) {
    return (
      <Link href="/auth/login"
        className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
        Sign In
      </Link>
    );
  }

  // ── Logged in ──
  return (
    <div className="relative" ref={dropRef}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 group"
      >
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-white text-sm font-extrabold">{initial}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-10 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-sm font-extrabold text-gray-900 truncate">
              {user.full_name || 'Student'}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium">
              <User className="w-4 h-4 text-gray-400" />
              My Profile
            </Link>
            <Link href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium">
              <Settings className="w-4 h-4 text-gray-400" />
              Settings
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-50 py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold">
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
