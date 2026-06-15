'use client';
// Screen 7 — Enter Current Grades (Optional)
import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Check, Edit2, Loader2 } from 'lucide-react';
import { api, API_BASE, getToken } from '@/lib/api';
import { Phone } from './shared';

interface Props { onNext: () => void; onBack: () => void; classId: string | null; }

type Tab = 'manual' | 'photo' | 'gradebook';

interface Grade {
  id:         number;
  assessment: string;
  category:   string;
  score:      number;
  total:      number;
  editing:    boolean;
}

const ICONS: Record<string, string> = {
  Exam: '📄', Quiz: '❓', Homework: '📝', Lab: '🧪', Project: '🎯', Other: '📋',
};
const COLORS: Record<string, string> = {
  Exam: 'bg-blue-100 text-blue-600', Quiz: 'bg-green-100 text-green-600',
  Homework: 'bg-amber-100 text-amber-600', Lab: 'bg-purple-100 text-purple-600',
  Project: 'bg-pink-100 text-pink-600', Other: 'bg-gray-100 text-gray-600',
};
const BAR_COLORS: Record<string, string> = {
  Exam: 'bg-blue-500', Quiz: 'bg-green-500', Homework: 'bg-amber-500',
  Lab: 'bg-purple-500', Project: 'bg-pink-500', Other: 'bg-indigo-500',
};

const INITIAL_GRADES: Grade[] = [
  { id: 1, assessment: 'Exam 1',     category: 'Exam',     score: 84, total: 100, editing: false },
  { id: 2, assessment: 'Quiz 1',     category: 'Quiz',     score: 18, total: 20,  editing: false },
  { id: 3, assessment: 'Homework 1', category: 'Homework', score: 45, total: 50,  editing: false },
  { id: 4, assessment: 'Lab 1',      category: 'Lab',      score: 19, total: 20,  editing: false },
];

const CATEGORIES = ['Exam','Quiz','Homework','Lab','Project','Other'];

let nextId = 10;

export interface Screen9Handle { saveAndContinue: () => Promise<void>; }

const Screen9 = forwardRef<Screen9Handle, Props>(function Screen9({ onNext, onBack, classId }, ref) {
  const [tab,     setTab]     = useState<Tab>('manual');
  const [saving,  setSaving]  = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [grades, setGrades] = useState<Grade[]>(INITIAL_GRADES);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const pct = (g: Grade) =>
    g.total > 0 ? Math.round((g.score / g.total) * 100) : 0;

  const update = (id: number, field: keyof Grade, value: string | number | boolean) => {
    setGrades(prev => prev.map(g => {
      if (g.id !== id) return g;
      const updated = { ...g, [field]: value };
      return updated;
    }));
  };

  const startEdit = (id: number) => {
    setGrades(prev => prev.map(g => ({ ...g, editing: g.id === id ? true : g.editing })));
  };

  const saveEdit = (id: number) => {
    update(id, 'editing', false);
  };

  const removeGrade = (id: number) => {
    setGrades(prev => prev.filter(g => g.id !== id));
  };

  const addGrade = () => {
    const newGrade: Grade = {
      id: nextId++,
      assessment: '',
      category: 'Exam',
      score: 0,
      total: 100,
      editing: true,    // opens in edit mode immediately
    };
    setGrades(prev => [...prev, newGrade]);
  };

  // ── Summary stats ─────────────────────────────────────────────────────────
  const avgScore    = grades.length > 0
    ? Math.round(grades.reduce((s, g) => s + pct(g), 0) / grades.length)
    : 0;
  const totalScore  = grades.reduce((s, g) => s + g.score, 0);
  const totalPoints = grades.reduce((s, g) => s + g.total, 0);

  // Save grades to backend then call onNext
  const saveAndContinue = async () => {
    if (!classId) { onNext(); return; }
    setSaving(true);
    setSaveMsg('');
    try {
      // Close any open edit rows first
      setGrades(prev => prev.map(g => ({ ...g, editing: false })));

      const payload = grades
        .filter(g => g.assessment.trim() && g.total > 0)
        .map(g => ({
          assessment: g.assessment,
          category:   g.category,
          score:      g.score,
          total:      g.total,
        }));

      await api(`/api/classes/${classId}/grades`, {
        method: 'POST',
        body:   { grades: payload },
      });
      setSaveMsg(`✅ ${payload.length} grade(s) saved!`);
      setTimeout(() => onNext(), 600);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Save failed';
      setSaveMsg(`❌ ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ saveAndContinue }));

  const TAB_LABELS = [
    { id: 'manual'    as Tab, icon: '✏️', label: 'Manual Entry'         },
    { id: 'photo'     as Tab, icon: '📷', label: 'Upload Photo'         },
    { id: 'gradebook' as Tab, icon: '📊', label: 'Gradebook Screenshot' },
  ];

  const inp = 'w-full border border-indigo-300 rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-500';

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
          <Image
            src="https://res.cloudinary.com/mview/image/upload/v1781271805/atlas/addclassreviewpage.png"
            alt="Grade review" width={64} height={64} className="object-contain flex-shrink-0" priority
          />
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
                <span>{t.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Column headers ── */}
        {tab === 'manual' && (
          <>
            <div className="px-5 mb-1">
              <div className="flex items-center gap-2 px-1">
                <p className="text-[10px] font-extrabold text-gray-500 flex-1">Assessment</p>
                <p className="text-[10px] font-extrabold text-gray-500 w-20">Score / Max</p>
                <p className="text-[10px] font-extrabold text-gray-500 w-10 text-right">%</p>
                <p className="w-5" />
              </div>
            </div>

            {/* ── Grade rows ── */}
            <div className="px-5 space-y-2 mb-3 overflow-y-auto" style={{ maxHeight: 240 }}>
              {grades.map(g => {
                const p = pct(g);
                const cat = g.category || 'Other';
                const icon = ICONS[cat] || '📋';
                const color = COLORS[cat] || 'bg-gray-100 text-gray-600';
                const bar = BAR_COLORS[cat] || 'bg-indigo-500';

                return (
                  <div key={g.id} className="rounded-2xl overflow-hidden border border-gray-100">
                    {g.editing ? (
                      /* ── Edit mode ── */
                      <div className="space-y-2 px-3 py-2.5 bg-indigo-50 border-l-4 border-indigo-500 rounded-xl">
                        <div className="flex items-center gap-2">
                          {/* Category selector */}
                          <select
                            value={g.category}
                            onChange={e => update(g.id, 'category', e.target.value)}
                            className={`${inp} w-24 flex-shrink-0`}>
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                          </select>
                          {/* Assessment name */}
                          <input
                            className={`${inp} flex-1`}
                            value={g.assessment}
                            placeholder="e.g. Exam 1"
                            onChange={e => update(g.id, 'assessment', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Score */}
                          <div className="flex items-center gap-1 flex-1">
                            <input
                              type="number" min="0" max={g.total}
                              className={`${inp} w-16`}
                              value={g.score}
                              onChange={e => update(g.id, 'score', Number(e.target.value))}
                            />
                            <span className="text-xs text-gray-400">/</span>
                            <input
                              type="number" min="1"
                              className={`${inp} w-16`}
                              value={g.total}
                              onChange={e => update(g.id, 'total', Number(e.target.value))}
                            />
                          </div>
                          {/* Auto-calculated pct */}
                          <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded-full w-12 text-center ${
                            p >= 90 ? 'text-green-700 bg-green-100' :
                            p >= 80 ? 'text-blue-700 bg-blue-100' :
                            'text-amber-700 bg-amber-100'
                          }`}>{p}%</span>
                          {/* Save */}
                          <button onClick={() => saveEdit(g.id)}
                            className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-green-600">
                            <Check className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── View mode — clearly editable ── */
                      <div className="border border-dashed border-indigo-200 rounded-xl bg-white">
                        {/* Tap to edit hint bar */}
                        <button
                          onClick={() => startEdit(g.id)}
                          className="w-full flex items-center justify-between px-3 py-1.5 bg-indigo-50 rounded-t-xl border-b border-dashed border-indigo-200 hover:bg-indigo-100 transition-colors">
                          <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Tap to edit</span>
                          <Edit2 className="w-3 h-3 text-indigo-400" />
                        </button>

                        <button className="w-full text-left px-3 py-2" onClick={() => startEdit(g.id)}>
                          <div className="flex items-center gap-2 mb-1.5">
                            {/* Icon */}
                            <div className={`w-6 h-6 ${color} rounded-lg flex items-center justify-center text-xs flex-shrink-0`}>
                              {icon}
                            </div>
                            {/* Name */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-800 truncate">{g.assessment || 'Untitled'}</p>
                              <p className="text-[9px] text-gray-400">{cat}</p>
                            </div>
                            {/* Score */}
                            <span className="text-xs font-bold text-gray-700 w-16 text-center">
                              {g.score} / {g.total}
                            </span>
                            {/* Pct badge */}
                            <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded-full w-10 text-center ${
                              p >= 90 ? 'text-green-700 bg-green-100' :
                              p >= 80 ? 'text-blue-700 bg-blue-100' :
                              'text-amber-700 bg-amber-100'
                            }`}>{p}%</span>
                            {/* Delete */}
                            <button
                              onClick={e => { e.stopPropagation(); removeGrade(g.id); }}
                              className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full ${bar} rounded-full`} style={{ width: `${p}%` }} />
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Add Another Grade ── */}
            <div className="px-5 mb-3">
              <button
                onClick={addGrade}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-indigo-300 text-indigo-600 font-bold py-2.5 rounded-2xl text-xs hover:bg-indigo-50 transition-all">
                <Plus className="w-3.5 h-3.5" /> Add Another Grade
              </button>
            </div>
          </>
        )}

        {/* Photo / Gradebook tabs — placeholder */}
        {tab !== 'manual' && (
          <div className="px-5 mb-4 flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 mx-5 rounded-2xl">
            <span className="text-3xl mb-2">{tab === 'photo' ? '📷' : '📊'}</span>
            <p className="text-xs font-semibold text-gray-500">
              {tab === 'photo' ? 'Take or upload a photo of your grade sheet' : 'Upload a screenshot of your gradebook'}
            </p>
            <button className="mt-3 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl">
              {tab === 'photo' ? 'Open Camera' : 'Upload Screenshot'}
            </button>
          </div>
        )}

        {/* ── Progress summary ── */}
        <div className="mx-5 mb-3 bg-indigo-50 border border-indigo-100 rounded-2xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
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
              <p className="text-xl font-extrabold text-indigo-600">{totalScore}<span className="text-sm font-bold text-gray-400">/{totalPoints}</span></p>
              <p className="text-[9px] text-gray-500">Total Points</p>
            </div>
          </div>
        </div>

        {/* ── Tip ── */}
        <div className="mx-5 mb-3 flex items-start gap-2">
          <span className="text-sm">💡</span>
          <p className="text-[10px] text-gray-500 leading-relaxed">
            Tip: Tap any grade row to edit it. Percentages calculate automatically.
          </p>
        </div>

        {/* ── Save status ── */}
        {(saving || saveMsg) && (
          <div className={`mx-5 mb-2 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
            saveMsg.startsWith('✅') ? 'bg-green-50 text-green-700' :
            saveMsg.startsWith('❌') ? 'bg-red-50 text-red-700' :
            'bg-indigo-50 text-indigo-600'
          }`}>
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />}
            {saveMsg || 'Saving grades...'}
          </div>
        )}

      </div>
    </Phone>
  );
}
);

export default Screen9;
