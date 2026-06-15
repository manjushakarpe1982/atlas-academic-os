'use client';
// Screen 9 — Enter Current Grades (Optional)
import { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Info } from 'lucide-react';
import { Phone } from './shared';
import { MOCK_GRADES } from './mockData';

interface Props { onNext: () => void; onBack: () => void; classId: string | null; }

type Tab = 'manual' | 'photo' | 'gradebook';

const CATEGORY_STYLE: Record<string, { color: string; icon: string }> = {
  'Exam 1':     { color: 'bg-blue-100 text-blue-600',   icon: '📄' },
  'Quiz 1':     { color: 'bg-green-100 text-green-600', icon: '❓' },
  'Homework 1': { color: 'bg-amber-100 text-amber-600', icon: '📝' },
  'Lab 1':      { color: 'bg-purple-100 text-purple-600',icon: '🧪' },
};

const PROGRESS_COLOR: Record<string, string> = {
  'Exam 1':     'bg-blue-500',
  'Quiz 1':     'bg-green-500',
  'Homework 1': 'bg-amber-500',
  'Lab 1':      'bg-blue-600',
};

export default function Screen9({ onNext, onBack, classId }: Props) {
  const [tab,    setTab]    = useState<Tab>('manual');
  const [grades, setGrades] = useState(MOCK_GRADES);

  const removeGrade = (i: number) => setGrades(prev => prev.filter((_, j) => j !== i));

  const avgScore    = Math.round(grades.reduce((sum, g) => sum + g.pct, 0) / (grades.length || 1));
  const weightedTotal = grades.reduce((s, g) => s + g.score, 0);
  const weightedMax   = grades.reduce((s, g) => s + g.total, 0);

  const TAB_LABELS = [
    { id: 'manual'   as Tab, icon: '✏️', label: 'Manual Entry'         },
    { id: 'photo'    as Tab, icon: '📷', label: 'Upload Photo'         },
    { id: 'gradebook'as Tab, icon: '📊', label: 'Gradebook Screenshot' },
  ];

  return (
    <Phone>
      <div className="flex flex-col bg-white min-h-[560px]">

        {/* ── Header ── */}
        <div className="px-5 pt-4 pb-3 flex items-start justify-between">
          <div className="flex-1 pr-3">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg font-extrabold text-gray-900">Enter current grades</h1>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Optional</span>
            </div>
            <p className="text-xs text-gray-500">Add any grades you already have.<br />You can skip this for now.</p>
          </div>
          {/* Cloudinary image */}
          <div className="flex-shrink-0">
            <Image
              src="https://res.cloudinary.com/mview/image/upload/v1781271805/atlas/addclassreviewpage.png"
              alt="Grade review"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="px-5 mb-3">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {TAB_LABELS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  tab === t.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
                }`}>
                <span>{t.icon}</span>
                <span className="hidden sm:inline">{t.label}</span>
                {tab !== t.id && <span className="sm:hidden">{t.label.split(' ')[0]}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table header ── */}
        <div className="px-5 mb-1">
          <div className="grid grid-cols-12 gap-1 px-1">
            <p className="col-span-4 text-[10px] font-extrabold text-gray-500">Assessment</p>
            <p className="col-span-5 text-[10px] font-extrabold text-gray-500">Score / Points</p>
            <p className="col-span-2 text-[10px] font-extrabold text-gray-500 text-right">%</p>
            <p className="col-span-1" />
          </div>
        </div>

        {/* ── Grade rows ── */}
        <div className="px-5 space-y-2 mb-3">
          {grades.map((g, i) => {
            const style = CATEGORY_STYLE[g.assessment] || { color: 'bg-gray-100 text-gray-600', icon: '📋' };
            const progressColor = PROGRESS_COLOR[g.assessment] || 'bg-indigo-500';
            return (
              <div key={i} className="bg-gray-50 rounded-2xl px-3 py-2.5 border border-gray-100">
                <div className="grid grid-cols-12 gap-1 items-center mb-1.5">
                  {/* Assessment */}
                  <div className="col-span-4 flex items-center gap-1.5">
                    <div className={`w-6 h-6 ${style.color} rounded-lg flex items-center justify-center text-xs flex-shrink-0`}>
                      {style.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 leading-tight">{g.assessment}</p>
                      <p className="text-[9px] text-gray-400 capitalize">{g.assessment.replace(' 1','').replace(' 2','')}</p>
                    </div>
                  </div>
                  {/* Score */}
                  <div className="col-span-5 flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-700">{g.score} / {g.total}</span>
                  </div>
                  {/* Percentage */}
                  <div className="col-span-2 text-right">
                    <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded-full ${
                      g.pct >= 90 ? 'text-green-700 bg-green-100' :
                      g.pct >= 80 ? 'text-blue-700 bg-blue-100' :
                      'text-amber-700 bg-amber-100'
                    }`}>{g.pct}%</span>
                  </div>
                  {/* Delete */}
                  <div className="col-span-1 flex justify-end">
                    <button onClick={() => removeGrade(i)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${progressColor} rounded-full transition-all`} style={{ width: `${g.pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Add Another Grade ── */}
        <div className="px-5 mb-3">
          <button className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-indigo-200 text-indigo-600 font-bold py-2.5 rounded-2xl text-xs hover:bg-indigo-50 transition-all">
            <Plus className="w-3.5 h-3.5" /> Add Another Grade
          </button>
        </div>

        {/* ── Progress summary ── */}
        <div className="mx-5 mb-3 bg-indigo-50 border border-indigo-100 rounded-2xl p-3">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-sm">📈</span>
            <p className="text-xs font-extrabold text-gray-800">Your Progress So Far</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xl font-extrabold text-gray-900">{grades.length}</p>
              <p className="text-[9px] text-gray-500">Grades Entered</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-indigo-600">{avgScore}%</p>
              <p className="text-[9px] text-gray-500">Average Score</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-indigo-600">{weightedTotal} / {weightedMax}</p>
              <p className="text-[9px] text-gray-500">Weighted Score</p>
            </div>
          </div>
        </div>

        {/* ── Tip ── */}
        <div className="mx-5 mb-3 flex items-start gap-2">
          <span className="text-sm">💡</span>
          <p className="text-[10px] text-gray-500 leading-relaxed">
            Tip: Entering current grades helps Atlas create a more accurate study plan for you.
          </p>
        </div>

      </div>
    </Phone>
  );
}
