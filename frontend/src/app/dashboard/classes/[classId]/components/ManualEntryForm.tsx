'use client';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { CATEGORIES } from './shared';

interface Props { onBack: () => void; onSave: () => void; }

export default function ManualEntryForm({ onBack, onSave }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <button onClick={onBack}><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
        <h2 className="text-base font-extrabold text-gray-900">Add Grade</h2>
      </div>
      <div className="px-4 py-4 space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Assessment Name</label>
          <input placeholder="e.g. Quiz 2" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Category</label>
          <div className="relative">
            <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none bg-white appearance-none">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-bold text-gray-500 block mb-1.5">Score</label>
            <input type="number" placeholder="85" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" /></div>
          <div><label className="text-xs font-bold text-gray-500 block mb-1.5">Out Of</label>
            <input type="number" placeholder="100" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" /></div>
        </div>
        <div><label className="text-xs font-bold text-gray-500 block mb-1.5">Date</label>
          <input type="date" defaultValue="2026-02-24" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" /></div>
        <div><label className="text-xs font-bold text-gray-500 block mb-1.5">Weight</label>
          <input value="20% (Quizzes)" readOnly className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-600" /></div>
        <div><label className="text-xs font-bold text-gray-500 block mb-1.5">Notes <span className="font-normal text-gray-400">(Optional)</span></label>
          <textarea placeholder="Add any notes about this grade..." rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none resize-none" /></div>
        <button onClick={onSave} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all text-base">Save Grade</button>
      </div>
    </div>
  );
}
