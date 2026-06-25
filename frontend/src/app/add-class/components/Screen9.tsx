'use client';
// Screen 9 — Your Classes List
import { useEffect, useState } from 'react';
import { Plus, Loader2, ChevronRight, Star } from 'lucide-react';
import { Phone } from './shared';
import { api } from '@/lib/api';

interface Props { onAddAnother: () => void; }

interface ClassItem {
  id: string;
  name: string;
  term?: string;
  schedule?: string;
  professor?: string;
  credits?: number;
  instructor ?: string
}

const CLASS_COLORS = [
  { bg: 'bg-purple-100', text: 'text-purple-600', icon: '💻' },
  { bg: 'bg-green-100', text: 'text-green-600', icon: '📊' },
  { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: '📖' },
  { bg: 'bg-blue-100', text: 'text-blue-600', icon: '🔬' },
  { bg: 'bg-pink-100', text: 'text-pink-600', icon: '🎨' },
  { bg: 'bg-teal-100', text: 'text-teal-600', icon: '🧮' },
];

const CREDIT_COLORS = [
  'bg-purple-100 text-purple-600',
  'bg-green-100 text-green-600',
  'bg-yellow-100 text-yellow-600',
  'bg-blue-100 text-blue-600',
  'bg-pink-100 text-pink-600',
  'bg-teal-100 text-teal-600',
];

export default function Screen9({ onAddAnother }: Props) {
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
      <div className=" flex flex-col  bg-white">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg font-extrabold text-gray-900">
            Your Classes <span className="text-gray-600">({classes.length})</span>
          </h1>
        
        </div>

        {/* CLASS LIST */}
        <div className="flex-1 mb-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {classes.map((c, i) => {
                const colorScheme = CLASS_COLORS[i % CLASS_COLORS.length];
                const creditColor = CREDIT_COLORS[i % CREDIT_COLORS.length];
                
                return (
                  <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-12 h-12 ${colorScheme.bg} rounded-xl flex items-center justify-center flex-shrink-0 text-lg`}>
                        {colorScheme.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 mb-1">{c.name}</h3>
                        
                        {/* Schedule */}
                        {c.schedule && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                            📅 {c.schedule}
                          </p>
                        )}
                        
                        {/* Professor */}
                        {c.instructor && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            👨‍🏫 Prof. {c.instructor}
                          </p>
                        )}
                      </div>

                      {/* Right side - Credits + Chevron */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {c.credits && (
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${creditColor}`}>
                            {c.credits} Credits
                          </span>
                        )}
                        <ChevronRight className="w-5 h-5 text-gray-300" />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Empty state */}
              {classes.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No classes added yet</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ALL SET SECTION */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 mb-4 flex gap-3">
          <Star className="w-6 h-6 text-purple-600 flex-shrink-0" fill="currentColor" />
          <div>
            <p className="text-sm font-bold text-purple-900">All set!</p>
            <p className="text-xs text-purple-700 mt-1">You can always manage your classes from the Classes section.</p>
          </div>
        </div>

        {/* ADD ANOTHER CLASS BUTTON */}
        <button onClick={onAddAnother}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all mb-4">
          <Plus className="w-5 h-5" /> Add Another Class
        </button>

      </div>
    </Phone>
  );
}
