'use client';
import { CheckCircle2 } from 'lucide-react';

interface Props { onViewGrades: () => void; onAddAnother: () => void; }

export default function GradeSuccess({ onViewGrades, onAddAnother }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center space-y-5">
      <div className="relative py-2">
        <div className="absolute top-0 left-0 w-2 h-2 bg-indigo-400 rounded-full" />
        <div className="absolute top-4 right-0 w-1.5 h-1.5 bg-purple-300 rounded-full" />
        <div className="absolute bottom-0 left-4 w-1.5 h-1.5 bg-green-300 rounded-full" />
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-gray-900">Quiz 2</h1>
        <p className="text-lg font-bold text-gray-700">85 / 100</p>
        <p className="text-sm text-gray-400">Feb 24, 2026</p>
      </div>
      <div className="w-full bg-white border-2 border-gray-100 rounded-2xl p-5 space-y-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Updated Current Grade</p>
        <p className="text-4xl font-extrabold text-green-600">72%</p>
        <div className="flex items-center justify-center gap-1"><span className="text-sm font-bold text-green-600">↑ 12%</span></div>
        <p className="text-xs text-gray-500">Great job! Your grade improved.</p>
      </div>
      <div className="w-full space-y-3 pt-2">
        <button onClick={onViewGrades} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all text-base">View Grades</button>
        <button onClick={onAddAnother} className="w-full text-indigo-600 font-bold py-2 text-sm hover:text-indigo-800 transition-colors">Add Another Grade</button>
      </div>
    </div>
  );
}
