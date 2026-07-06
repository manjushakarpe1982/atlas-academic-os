"use client";
import { useState } from "react";
import { MoreVertical, Pencil, Trash2, Plus } from "lucide-react";
import { getCategoryIcon, getCategoryColor, GradeItem } from "./shared";

interface Props {
  grades: GradeItem[];
  onAdd: () => void;
  onEdit: (g: GradeItem) => void;
  onDelete: (g: GradeItem) => void;
}

export default function GradeHistory({
  grades,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3">
      <h2 className="text-base font-bold text-gray-900 mb-1">Grade History</h2>

      {grades.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">
          No grades recorded yet
        </p>
      ) : (
        <div className="space-y-0 max-h-[400px] overflow-y-auto">
          {grades.map((g, idx) => {
            const pct = Math.round((g.score / g.max) * 100);
            const openUp = idx >= grades.length - 2;
            return (
              <div
                key={g.id}
                className="flex items-center gap-2 py-3 border-b border-gray-50 last:border-0"
              >
                <div
                  className={`w-10 h-10 ${getCategoryColor(g.category)} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}
                >
                  {getCategoryIcon(g.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm font-bold text-gray-900 truncate">{g.title}</p>
                    {g.source && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${
                        g.source === 'manual' ? 'bg-blue-50 text-blue-600' : g.source === 'scanned' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
                      }`}>
                        {g.source === 'manual' ? 'Manual' : g.source === 'scanned' ? 'Scanned' : 'Uploaded'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {g.date} · {g.category}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">
                    {g.score} / {g.max}
                  </p>
                  <p
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold border ${
                      pct >= 90
                        ? "text-green-700 bg-green-50 border-green-100"
                        : pct >= 80
                          ? "text-blue-700 bg-blue-50 border-blue-100"
                          : pct >= 70
                            ? "text-amber-700 bg-amber-50 border-amber-100"
                            : "text-red-700 bg-red-50 border-red-100"
                    }`}
                  >
                    {pct}%
                  </p>
                </div>
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => setMenuOpen(menuOpen === g.id ? null : g.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  {menuOpen === g.id && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setMenuOpen(null)}
                      />
                      <div className={`absolute right-0 ${openUp ? 'bottom-8' : 'top-8'} z-50 w-36 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden`}>
                        <button
                          onClick={() => {
                            setMenuOpen(null);
                            onEdit(g);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-indigo-500" />
                          <span className="font-medium">Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            setMenuOpen(null);
                            onDelete(g);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                        >
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
      )}

      <button
        onClick={onAdd}
        className="w-full mt-4 border bg-indigo-600 border-indigo-300 text-white font-bold py-3 rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-base"
      >
        <Plus className="w-5 h-5" /> Add Grade
      </button>
    </div>
  );
}
