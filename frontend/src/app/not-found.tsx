'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, BookOpen, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">

        {/* Atlas logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <span className="text-white font-extrabold text-sm">A</span>
          </div>
          <span className="text-lg font-extrabold text-gray-900">Atlas</span>
        </div>

        {/* 404 illustration */}
        <div className="relative mb-6">
          <div className="text-8xl font-extrabold text-indigo-100 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl">🔭</div>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Page not found</h1>
        <p className="text-sm text-gray-400 leading-relaxed mb-8">
          This page doesn't exist or was moved. Let's get you back on track.
        </p>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { href:'/dashboard',       icon:Home,     label:'Dashboard',  desc:'Back to your plan'    },
            { href:'/classes',    icon:BookOpen, label:'Classes',    desc:'Your class workspaces'},
            { href:'/study-plan', icon:Search,   label:'Study Plan', desc:'Today\'s tasks'        },
            { href:'/help',       icon:Search,   label:'Help',       desc:'Find answers'         },
          ].map((l) => (
            <Link key={l.href} href={l.href}
              className="flex items-center gap-3 bg-white border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 rounded-2xl p-3.5 text-left transition-all group shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center flex-shrink-0 transition-all">
                <l.icon className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{l.label}</p>
                <p className="text-[10px] text-gray-400">{l.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
