'use client';
import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { GradeItem } from './shared';
import { API_BASE, getToken } from '@/lib/api';

interface Props { grade: GradeItem; classId: string; onCancel: () => void; onDeleted: () => void; }

export default function DeleteGradeModal({ grade, classId, onCancel, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = getToken();
      await fetch(`${API_BASE}/api/classes/${classId}/grades/${grade.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeleted();
    } catch {}
    finally { setDeleting(false); }
  };

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
          <button onClick={handleDelete} disabled={deleting}
            className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl hover:bg-red-700 transition-all text-sm disabled:opacity-70 flex items-center justify-center gap-2">
            {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
