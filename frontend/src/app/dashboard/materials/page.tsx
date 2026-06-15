'use client';
import { Search, ChevronRight } from 'lucide-react';
import { STUDY_MATERIALS, CLASSES } from '../components/mockData';

export default function StudyMaterialsPage() {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-extrabold text-gray-900">Study Materials</h1>
        <button className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <Search className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Class selector */}
      <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 mb-5 outline-none">
        {CLASSES.map(c => <option key={c.id}>{c.name}</option>)}
      </select>

      {/* Materials list */}
      <div className="space-y-2">
        {STUDY_MATERIALS.map(m => (
          <button key={m.id}
            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md transition-all">
            <div className={`w-10 h-10 ${m.color} rounded-xl flex items-center justify-center text-lg`}>
              {m.icon}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-extrabold text-gray-900">{m.title}</p>
              <p className="text-xs text-gray-400">{m.sub}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        ))}
      </div>
    </div>
  );
}
