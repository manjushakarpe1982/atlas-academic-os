'use client';
// Screen 11 — Your Classes List (Loop / Add More)
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Phone } from './shared';
import { MOCK_CLASSES_ADDED } from './mockData';

interface Props { onAddAnother: () => void; }

export default function Screen11({ onAddAnother }: Props) {
  const router = useRouter();

  return (
    <Phone>
      <div className="px-5 py-4">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Your Classes</h1>
        <p className="text-xs text-gray-400 mb-5">3 of 5 classes added</p>

        {/* Class list */}
        <div className="space-y-2 mb-5">
          {MOCK_CLASSES_ADDED.map(c => (
            <div key={c.name}
              className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-extrabold text-indigo-600">
                  {c.name.split(' ')[0].slice(0, 4)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-400">{c.full}</p>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">
                {c.status}
              </span>
            </div>
          ))}
        </div>

        {/* Add another */}
        <button onClick={onAddAnother}
          className="w-full border-2 border-dashed border-indigo-300 text-indigo-600 font-bold py-3 rounded-2xl text-sm hover:bg-indigo-50 flex items-center justify-center gap-2 mb-5 transition-all">
          <Plus className="w-4 h-4" /> Add Another Class
        </button>

        {/* Info card */}
        <div className="bg-indigo-50 rounded-2xl p-4 text-center border border-indigo-100 mb-4">
          <p className="text-xs font-bold text-indigo-800 mb-1">Repeat this flow for each class</p>
          <p className="text-sm font-extrabold text-indigo-900 mt-1">5 classes</p>
          <p className="text-xs text-indigo-700">≈ 8–10 minutes total</p>
        </div>

        <p className="text-xs text-gray-400 text-center mb-4">You can add up to 5 classes</p>

        <button onClick={() => router.push('/dashboard')}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl text-sm shadow-md">
          Go to Dashboard
        </button>
      </div>
    </Phone>
  );
}
