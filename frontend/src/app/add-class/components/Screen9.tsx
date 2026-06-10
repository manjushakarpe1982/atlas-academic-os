'use client';
// Screen 9 — Enter Current Grades (Optional)
import { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Phone } from './shared';
import { ScreenProps } from './types';
import { MOCK_GRADES } from './mockData';

type Tab = 'manual' | 'photo' | 'gradebook';

export default function Screen9({ onNext, onBack }: ScreenProps) {
  const [tab,    setTab]    = useState<Tab>('manual');
  const [grades, setGrades] = useState(MOCK_GRADES);

  const removeGrade = (index: number) =>
    setGrades(prev => prev.filter((_, i) => i !== index));

  return (
    <Phone step={5} total={5}>
      <div className="px-5 py-4">
        <button onClick={onBack} className="mb-3 text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-xl font-extrabold text-gray-900 mb-0.5">Enter current grades</h1>
        <p className="text-xs font-semibold text-gray-400 mb-0.5">(Optional)</p>
        <p className="text-xs text-gray-400 mb-4">
          Add any grades you already have. You can skip this for now.
        </p>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1">
          {(['manual', 'photo', 'gradebook'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                tab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'
              }`}>
              {t === 'manual' ? 'Manual Entry' : t === 'photo' ? 'Upload Photo' : 'Gradebook Screenshot'}
            </button>
          ))}
        </div>

        {/* Grade table header */}
        <div className="grid grid-cols-3 gap-2 px-1 mb-1">
          <p className="text-[10px] font-bold text-gray-500">Assessment</p>
          <p className="text-[10px] font-bold text-gray-500 text-center">Score / Points</p>
          <p className="text-[10px] font-bold text-gray-500 text-right">%</p>
        </div>

        {/* Grade rows */}
        <div className="space-y-1.5 mb-3">
          {grades.map((g, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
              <p className="text-xs font-semibold text-gray-800">{g.assessment}</p>
              <p className="text-xs text-center text-gray-700">{g.score} / {g.total}</p>
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-xs font-bold text-gray-700">{g.pct}%</span>
                <button onClick={() => removeGrade(i)} className="text-gray-300 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="flex items-center gap-1 text-xs text-indigo-600 font-semibold mb-5 hover:text-indigo-800">
          <Plus className="w-3.5 h-3.5" /> Add Another Grade
        </button>

        <div className="flex gap-3">
          <button onClick={onBack}
            className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-2xl text-sm hover:bg-gray-50">
            Skip for now
          </button>
          <button onClick={onNext}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl text-sm shadow-md">
            Save &amp; Continue
          </button>
        </div>
      </div>
    </Phone>
  );
}
