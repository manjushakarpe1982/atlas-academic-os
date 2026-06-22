'use client';
import { useState } from 'react';
import { MoreVertical, Pencil, Trash2, Plus } from 'lucide-react';
import { GRADE_HISTORY, getCategoryIcon, getCategoryColor, GradeItem } from './shared';

interface Props {
  onAdd: () => void;
  onEdit: (g: GradeItem) => void;
  onDelete: (g: GradeItem) => void;
}

export default function GradeHistory({ onAdd, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <h2 className="text-sm font-extrabold text-gray-900 mb-3">Grade History</h2>
      <div className="space-y-0">
        {GRADE_HISTORY.map((g) => {
          const pct = Math.round(g.score / g.max * 100);
          return (
            <div key={g.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
              <div className={`w-10 h-10 ${getCategoryColor(g.category)} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                {getCategoryIcon(g.category)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">{g.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{g.date} · {g.category}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <p className="text-sm font-extrabold text-gray-900">{g.score} / {g.max}</p>
                <p className={`text-sm font-extrabold ${
                  pct >= 90 ? 'text-green-600' : pct >= 80 ? 'text-blue-600' : pct >= 70 ? 'text-amber-600' : 'text-red-600'
                }`}>{pct}%</p>
              </div>
              <div className="relative flex-shrink-0">
                <button onClick={() => setMenuOpen(menuOpen === g.id ? null : g.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
                {menuOpen === g.id && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                    <div className="absolute right-0 top-8 z-50 w-36 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                      <button onClick={() => { setMenuOpen(null); onEdit(g); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Pencil className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium">Edit</span>
                      </button>
                      <button onClick={() => { setMenuOpen(null); onDelete(g); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">
                        <Trash2 className="w-4 h-4" />
                        <span className="font-medium">Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={onAdd}
        className="w-full mt-4 border-2 border-dashed border-indigo-300 text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-sm">
        <Plus className="w-4 h-4" /> Add Grade
      </button>
    </div>
  );
}
