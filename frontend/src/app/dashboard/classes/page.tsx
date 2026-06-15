'use client';
import Link from 'next/link';
import { Plus, Calendar } from 'lucide-react';
import { CLASSES } from '../components/mockData';
import TopHeader from '@/components/TopHeader';

export default function ClassesPage() {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-extrabold text-gray-900">Your Classes</h1>
        <Link href="/add-class"
          className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-xl">
          <Plus className="w-3.5 h-3.5" /> Add Class
        </Link>
      </div>

      <div className="space-y-3">
        {CLASSES.map(c => (
          <Link key={c.id} href={`/dashboard/class-detail`}
            className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-11 h-11 ${c.color} rounded-2xl flex items-center justify-center text-white font-extrabold text-sm`}>
                {c.icon}
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-400">{c.sub}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-extrabold text-gray-900">{c.grade}%</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full mb-2">
              <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.grade}%` }} />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{c.next}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
