'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, BookOpen, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface ClassData {
  id: string;
  name: string;
  instructor: string | null;
  credit_hours: number | null;
  term: string | null;
  created_at: string;
}

const CLASS_COLORS = ['bg-indigo-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-blue-500', 'bg-teal-500', 'bg-amber-500'];
const CLASS_BG     = ['bg-indigo-50',  'bg-green-50',  'bg-purple-50',  'bg-orange-50',  'bg-pink-50',  'bg-blue-50',  'bg-teal-50',  'bg-amber-50'];
const BORDER_COLORS = ['border-indigo-200', 'border-green-200', 'border-purple-200', 'border-orange-200', 'border-pink-200', 'border-blue-200', 'border-teal-200', 'border-amber-200']; 

export default function ClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api<{ classes: ClassData[] }>('/api/classes')
      .then(d => setClasses(d.classes || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm font-medium">Loading classes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-sm text-red-600 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-3 text-sm text-indigo-600 font-bold">Retry</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-14 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">My Classes</h1>
          <p className="text-sm text-gray-600 mt-0.5">{classes.length} class{classes.length !== 1 ? 'es' : ''} this semester</p>
        </div>
        <Link href="/add-class" className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Plus className="w-4 h-4 text-white" />
        </Link>
      </div>

      {classes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-lg font-bold text-gray-900 mb-2">No Classes Yet</p>
          <p className="text-sm text-gray-600 text-center mb-4">Add your first class to get started with Atlas</p>
          <Link href="/add-class" className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-indigo-700 transition-all">
            + Add Class
          </Link>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3">
          {classes.map((c, i) => {
            const color = CLASS_COLORS[i % CLASS_COLORS.length];
            const bg = CLASS_BG[i % CLASS_BG.length];
            return (
              <button key={c.id} onClick={() => router.push(`/dashboard/classes/${c.id}`)}
               className={`w-full border ${bg} ${BORDER_COLORS[i % BORDER_COLORS.length]} rounded-lg p-3 hover:border-indigo-300 hover:shadow-md transition-all text-left`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                      {c.instructor && (
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                          <span>👨‍🏫 {c.instructor}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        {c.term && (
                          <span className="text-xs bg-white px-2 py-1 rounded-full border border-gray-200">{c.term}</span>
                        )}
                        {c.credit_hours && (
                          <span className="text-xs bg-white px-2 py-1 rounded-full border border-gray-200">{c.credit_hours} Credits</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-6 h-6 flex-shrink-0 ml-2">
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
