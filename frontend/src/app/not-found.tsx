'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, BookOpen, Target, HelpCircle, ArrowLeft } from 'lucide-react';

const QUICK_LINKS = [
  { icon: Home,       label: 'Dashboard', sub: 'Back to your plan',    href: '/dashboard' },
  { icon: BookOpen,   label: 'Classes',   sub: 'Your class workspaces', href: '/classes'   },
  { icon: Target,     label: 'Study Plan',sub: "Today's tasks",         href: '/dashboard' },
  { icon: HelpCircle, label: 'Help Center', sub: 'Find answers',        href: '#'          },
];

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center max-w-md mx-auto px-5">

      {/* ── Robot illustration ── */}
      <div className="w-full flex justify-center pt-10 pb-2">
        <div className="relative w-64 h-56">
          {/* Soft purple background blob */}
          <div className="absolute inset-x-4 inset-y-6 bg-indigo-50 rounded-full opacity-60" />
          {/* Robot image */}
          <Image
            src="https://res.cloudinary.com/mview/image/upload/v1781153881/atlas/pagenotfound.png"
            alt="Lost robot"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* ── 404 number ── */}
      <h1 className="text-8xl font-extrabold text-indigo-600 leading-none mt-2 mb-1"
        style={{ letterSpacing: '-4px' }}>
        404
      </h1>

      {/* ── Page not found ── */}
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">
        Page not found
      </h2>
      <p className="text-sm text-gray-500 text-center leading-relaxed mb-8">
        We couldn&apos;t find the page you&apos;re looking for.<br />
        It might have been moved or doesn&apos;t exist.
      </p>

      {/* ── Primary CTA ── */}
      <Link href="/dashboard"
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl text-sm shadow-lg shadow-indigo-200 transition-all mb-3">
        <Home className="w-4 h-4" />
        Go to Dashboard
      </Link>

      {/* ── Secondary CTA ── */}
      <button
        onClick={() => router.back()}
        className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-600 font-bold py-4 rounded-2xl text-sm transition-all mb-8">
        <ArrowLeft className="w-4 h-4" />
        Go Back
      </button>

      {/* ── Quick links grid ── */}
      <div className="w-full bg-gray-50 rounded-3xl p-5 mb-6 border border-gray-100">
        <p className="text-sm font-extrabold text-gray-800 text-center mb-4">
          Looking for something?
        </p>
        <div className="grid grid-cols-4 gap-3">
          {QUICK_LINKS.map(item => (
            <Link key={item.label} href={item.href}
              className="flex flex-col items-center gap-1 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:border-indigo-300 group-hover:bg-indigo-50 transition-all">
                <item.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-xs font-bold text-gray-800 text-center leading-tight">
                {item.label}
              </p>
              <p className="text-[9px] text-gray-400 text-center leading-tight">
                {item.sub}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Bottom note ── */}
      <div className="flex items-center gap-2 pb-8">
        <span className="text-lg">📚</span>
        <p className="text-xs text-gray-500 font-medium">
          Lost? Don&apos;t worry, let&apos;s get you back on track.
        </p>
      </div>

    </div>
  );
}
