'use client';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { GradeItem, CATEGORIES } from './shared';

interface Props { grade: GradeItem; onBack: () => void; onSave: () => void; onDelete: () => void; }

export default function EditGradeForm({ grade, onBack, onSave, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <button onClick={onBack}><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
        <h2 className="text-base font-extrabold text-gray-900">Edit Grade</h2>
      </div>
      <div className="px-4 py-4 space-y-4">
        <div><label className="text-xs font-bold text-gray-500 block mb-1.5">Assessment Name</label>
          <input defaultValue={grade.title} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" /></div>
        <div><label className="text-xs font-bold text-gray-500 block mb-1.5">Category</label>
          <div className="relative">
            <select defaultValue={grade.category} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none bg-white appearance-none">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-bold text-gray-500 block mb-1.5">Score</label>
            <input type="number" defaultValue={grade.score} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" /></div>
          <div><label className="text-xs font-bold text-gray-500 block mb-1.5">Out Of</label>
            <input type="number" defaultValue={grade.max} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" /></div>
        </div>
        <div><label className="text-xs font-bold text-gray-500 block mb-1.5">Date</label>
          <input type="date" defaultValue="2026-02-10" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" /></div>
        <div><label className="text-xs font-bold text-gray-500 block mb-1.5">Weight</label>
          <input value="20% (Quizzes)" readOnly className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-600" /></div>
        <div><label className="text-xs font-bold text-gray-500 block mb-1.5">Notes <span className="font-normal text-gray-400">(Optional)</span></label>
          <textarea placeholder="Add notes..." rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none resize-none" /></div>
        <div className="flex gap-3 pt-1">
          <button onClick={onDelete} className="flex-1 border-2 border-red-200 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-all text-sm">Delete Grade</button>
          <button onClick={onSave} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all text-sm">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
