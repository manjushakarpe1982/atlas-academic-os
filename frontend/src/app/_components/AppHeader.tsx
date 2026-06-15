'use client';
/**
 * AppHeader — shared header for all non-dashboard pages.
 *
 * Props:
 *  right?: 'help'   → "Need Help?" link  (default)
 *          'avatar' → UserAvatar dropdown
 *          'both'   → Need Help? + UserAvatar
 *          'none'   → nothing on right
 */
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import UserAvatar from './UserAvatar';


type RightSlot = 'help' | 'avatar' | 'both' | 'none';

interface Props { right?: RightSlot; }

export default function AppHeader({ right = 'help' }: Props) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-md mx-auto px-5 h-14 flex items-center justify-between">

        {/* ── Left: Atlas logo ── */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-extrabold">A</span>
          </div>
          <span className="font-extrabold text-gray-900 text-base">Atlas</span>
        </Link>

        {/* ── Right slot ── */}
        <div className="flex items-center gap-3">
          {(right === 'help' || right === 'both') && (
            <Link href="/help"
              className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
              <HelpCircle className="w-4 h-4" />
              Need Help?
            </Link>
          )}
          {(right === 'avatar' || right === 'both') && (
            <UserAvatar />
          )}
        </div>

      </div>
    </header>
  );
}
