'use client';
// Screen 11 — Your Classes List
import { useEffect, useState } from 'react';
import { Plus, CheckCircle2, Loader2 } from 'lucide-react';
import { Phone } from './shared';
import { api } from '@/lib/api';

interface Props { onAddAnother: () => void; }

interface ClassItem {
  id:   string;
  name: string;
  term: string;
}

const CLASS_COLORS = [
  'bg-green-500', 'bg-blue-500', 'bg-purple-500',
  'bg-orange-500', 'bg-pink-500', 'bg-teal-500',
];

export default function Screen11({ onAddAnother }: Props) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ classes: ClassItem[] }>('/api/classes')
      .then(d => setClasses(d.classes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Phone>
      <div className="px-5 py-4">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-0.5">Your Classes</h1>
        <p className="text-xs text-gray-400 mb-4">
          {loading ? 'Loading...' : `${classes.length} class${classes.length !== 1 ? 'es' : ''} added`}
        </p>

        {/* Class list — real data */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            {classes.map((c, i) => (
              <div key={c.id}
                className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                <div className={`w-10 h-10 ${CLASS_COLORS[i % CLASS_COLORS.length]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs font-extrabold">
                    {c.name.split(' ')[0].slice(0, 4).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.term || 'Current Term'}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-bold text-green-600">Added</span>
                </div>
              </div>
            ))}

            {/* Empty state */}
            {classes.length === 0 && (
              <div className="text-center py-6 text-gray-400 text-sm">
                No classes added yet.
              </div>
            )}
          </div>
        )}

        {/* Add another class */}
        <button onClick={onAddAnother}
          className="w-full border-2 border-dashed border-indigo-300 text-indigo-600 font-bold py-3 rounded-2xl text-sm hover:bg-indigo-50 flex items-center justify-center gap-2 mb-4 transition-all">
          <Plus className="w-4 h-4" /> Add Another Class
        </button>

        {/* Info */}
        <div className="bg-indigo-50 rounded-2xl p-3 text-center border border-indigo-100">
          <p className="text-xs font-bold text-indigo-800">You can add up to 5 classes</p>
          <p className="text-xs text-indigo-600 mt-0.5">≈ 8–10 minutes per class</p>
        </div>
      </div>
    </Phone>
  );
}
