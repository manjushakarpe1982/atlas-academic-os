'use client';
import Link from 'next/link';
import { Brain, BookOpen, Target, BarChart3 } from 'lucide-react';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-md mx-auto px-4 py-16">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-extrabold text-gray-900">Atlas</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Your AI Study Coach</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Snap your syllabus, log your grades — Atlas tells you exactly what to study each week.
          </p>
        </div>

        {/* Features preview */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { icon: BookOpen,  label: 'Syllabus AI',   color: 'bg-blue-50 text-blue-600'   },
            { icon: BarChart3, label: 'Grade Tracker', color: 'bg-purple-50 text-purple-600'},
            { icon: Target,    label: 'Study Plan',    color: 'bg-green-50 text-green-600'  },
          ].map((f) => (
            <div key={f.label} className={`${f.color} rounded-2xl p-3 text-center`}>
              <f.icon className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs font-semibold">{f.label}</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Link href="/auth/signup"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl text-center text-lg transition-all shadow-lg shadow-indigo-500/20">
            Create Account
          </Link>
          <Link href="/auth/login"
            className="block w-full border-2 border-indigo-200 hover:border-indigo-400 text-indigo-600 font-bold py-4 rounded-2xl text-center text-lg transition-all">
            Sign In
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Available at University of Arkansas &amp; Texas A&amp;M • Free beta
        </p>
      </div>
    </div>
  );
}
