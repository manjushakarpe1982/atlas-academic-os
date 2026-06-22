'use client';
import { Trash2 } from 'lucide-react';
import { GradeItem } from './shared';

interface Props { grade: GradeItem; onCancel: () => void; onDelete: () => void; }

export default function DeleteGradeModal({ grade, onCancel, onDelete }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-xs w-full text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-7 h-7 text-red-500" />
          </div>
        </div>
        <h2 className="text-base font-extrabold text-gray-900">Delete this grade?</h2>
        <div className="space-y-0.5">
          <p className="text-sm font-bold text-gray-800">{grade.title}</p>
          <p className="text-lg font-extrabold text-gray-900">{grade.score} / {grade.max}</p>
          <p className="text-xs text-gray-400">{grade.date}</p>
        </div>
        <p className="text-xs text-gray-500">This action cannot be undone.</p>
        <div className="flex gap-3 pt-1">
          <button onClick={onCancel} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-all text-sm">Cancel</button>
          <button onClick={onDelete} className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl hover:bg-red-700 transition-all text-sm">Delete</button>
        </div>
      </div>
    </div>
  );
}
