'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import {
  ChevronLeft, ChevronRight, FileText, Mic, BarChart2,
  Target, Upload, Sparkles, Brain, BookOpen, GraduationCap,
  Plus, Trash2, RefreshCw, AlertCircle, CheckCircle2, X,
  Camera, Tag, Calendar, Clock,
} from 'lucide-react';
import { api, getToken, API_BASE } from '@/lib/api';

// ── Types ─────────────────────────────────────────────────────────────────

interface ClassRecord {
  id: string; name: string; instructor: string | null;
  credit_hours: number | null; term: string | null;
  syllabus_file_id: string | null; textbook_isbn: string | null;
  created_at: string; updated_at: string;
  grade_weights: Array<{ id: string; category: string; weight_pct: number; confidence: string }>;
  assessments:   Array<{ id: string; title: string; category: string | null; due_date: string | null; source: string }>;
  topics:        Array<{ id: string; title: string; source: string; week_hint: number | null; confidence: string | null }>;
  files:         Array<{ id: string; original_name: string; category: string; status: string; size_label: string; extracted_summary: string | null; created_at: string }>;
  grades:        Array<{ id: string; category: string; title: string | null; score: number; max_score: number; recorded_at: string; source: string }>;
  current_grade: number | null;
  file_count: number; topic_count: number;
}

interface GradeSummary {
  current_grade: number | null; letter_grade: string | null;
  breakdown: Array<{ category: string; weight_pct: number; avg_score: number | null; count: number; confidence: string }>;
  confidence: string;
}

type Tab = 'overview' | 'grades' | 'topics' | 'files';

// ── Helpers ────────────────────────────────────────────────────────────────

function letterGrade(pct: number | null): string {
  if (pct === null) return '—';
  if (pct >= 93) return 'A';   if (pct >= 90) return 'A−';
  if (pct >= 87) return 'B+';  if (pct >= 83) return 'B';
  if (pct >= 80) return 'B−';  if (pct >= 77) return 'C+';
  if (pct >= 73) return 'C';   if (pct >= 70) return 'C−';
  if (pct >= 60) return 'D';   return 'F';
}

function gradeColor(pct: number | null): string {
  if (!pct) return 'text-gray-400';
  if (pct >= 90) return 'text-emerald-600';
  if (pct >= 80) return 'text-indigo-600';
  if (pct >= 70) return 'text-amber-600';
  return 'text-red-600';
}

function barColor(pct: number): string {
  if (pct >= 90) return 'bg-emerald-500';
  if (pct >= 80) return 'bg-indigo-500';
  if (pct >= 70) return 'bg-amber-400';
  return 'bg-red-500';
}

function confBadge(c: string) {
  const map: Record<string, string> = {
    high:   'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    low:    'bg-red-100 text-red-700',
  };
  return map[c] || map.medium;
}

const FILE_META: Record<string, { icon: typeof FileText; bg: string; color: string; label: string }> = {
  syllabus:       { icon: FileText,  bg: 'bg-indigo-100',  color: 'text-indigo-600',  label: 'Syllabus'      },
  lecture_audio:  { icon: Mic,       bg: 'bg-emerald-100', color: 'text-emerald-600', label: 'Lecture Audio' },
  lecture_slides: { icon: BarChart2, bg: 'bg-purple-100',  color: 'text-purple-600',  label: 'Slides'        },
  notes:          { icon: BookOpen,  bg: 'bg-amber-100',   color: 'text-amber-600',   label: 'Notes'         },
  assignment:     { icon: FileText,  bg: 'bg-blue-100',    color: 'text-blue-600',    label: 'Assignment'    },
  quiz:           { icon: Target,    bg: 'bg-orange-100',  color: 'text-orange-600',  label: 'Quiz'          },
  graded_work:    { icon: Target,    bg: 'bg-red-100',     color: 'text-red-600',     label: 'Graded Work'   },
  other:          { icon: FileText,  bg: 'bg-gray-100',    color: 'text-gray-500',    label: 'Other'         },
};

// ── Add Grade Modal ────────────────────────────────────────────────────────

function AddGradeModal({ classId, weights, onClose, onSaved }: {
  classId: string;
  weights: ClassRecord['grade_weights'];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [category, setCategory] = useState(weights[0]?.category || '');
  const [title,    setTitle]    = useState('');
  const [score,    setScore]    = useState('');
  const [maxScore, setMaxScore] = useState('100');
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const photoRef = useRef<HTMLInputElement>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoResult,  setPhotoResult]  = useState<Array<Record<string,unknown>>>([]);

  const pct = score && maxScore ? Math.round((parseFloat(score) / parseFloat(maxScore)) * 100) : null;

  const handleSave = async () => {
    if (!category) { setError('Select a category.'); return; }
    if (!score)    { setError('Enter a score.');    return; }
    if (!maxScore) { setError('Enter max score.');  return; }
    setSaving(true);
    try {
      await api('/api/grades', {
        method: 'POST',
        body: { class_id: classId, category, title: title || null, score: parseFloat(score), max_score: parseFloat(maxScore) },
      });
      onSaved(); onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not save grade.');
    } finally { setSaving(false); }
  };

  const handlePhoto = async (f: File) => {
    setPhotoLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', f);
      formData.append('class_id', classId);
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/files/upload-image`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.grades?.length > 0) {
        setPhotoResult(data.grades);
        const g = data.grades[0];
        if (g.score)     setScore(String(g.score));
        if (g.max_score) setMaxScore(String(g.max_score));
        if (g.title)     setTitle(String(g.title));
      }
    } catch { /* ignore */ }
    finally { setPhotoLoading(false); }
  };

  const inp = "w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all bg-white";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="h-1.5 bg-indigo-600" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-extrabold text-gray-900">Add a grade</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Photo upload option */}
          <input ref={photoRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhoto(f); e.target.value = ''; }} />
          <button onClick={() => photoRef.current?.click()} disabled={photoLoading}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-600 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all mb-4 disabled:opacity-50">
            {photoLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Reading photo…</> : <><Camera className="w-4 h-4" /> Take/upload grade photo</>}
          </button>

          {photoResult.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 mb-4">
              <p className="text-xs font-bold text-emerald-700 mb-1">✓ Extracted from photo — review and confirm:</p>
              {photoResult.map((g, i) => (
                <p key={i} className="text-xs text-emerald-600">
                  {g.title ? String(g.title) + ': ' : ''}{String(g.score)}/{String(g.max_score)}
                  {g.needs_confirmation ? ' ⚠ confirm' : ''}
                </p>
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Category *</label>
              {weights.length > 0 ? (
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inp}>
                  {weights.map((w) => <option key={w.id} value={w.category}>{w.category} ({w.weight_pct}%)</option>)}
                </select>
              ) : (
                <input value={category} onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Exams, Homework, Quiz" className={inp} />
              )}
              {weights.length === 0 && (
                <p className="text-[11px] text-amber-600 mt-1">⚠ No grade weights found — upload and link a syllabus first for accurate calculations.</p>
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Assignment title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Exam 1, Homework 3" className={inp} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Score *</label>
                <input type="number" value={score} onChange={(e) => setScore(e.target.value)}
                  placeholder="88" className={inp} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Out of *</label>
                <input type="number" value={maxScore} onChange={(e) => setMaxScore(e.target.value)}
                  placeholder="100" className={inp} />
              </div>
            </div>
            {pct !== null && (
              <div className={`text-center font-extrabold text-2xl ${gradeColor(pct)}`}>
                {pct}% — {letterGrade(pct)}
              </div>
            )}
          </div>

          <div className="flex gap-2.5 mt-5">
            <button onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
            <button onClick={handleSave} disabled={saving || !score || !maxScore}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 disabled:opacity-50 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-md shadow-indigo-500/20">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Save grade</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Add Grade Weights Modal ───────────────────────────────────────────────────

function AddWeightsModal({ classId, onClose, onSaved }: {
  classId: string; onClose: () => void; onSaved: () => void;
}) {
  const [weights, setWeights] = useState([
    { category: 'Exams',      weight_pct: 40 },
    { category: 'Homework',   weight_pct: 25 },
    { category: 'Quizzes',    weight_pct: 20 },
    { category: 'Final Exam', weight_pct: 15 },
  ]);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const total = weights.reduce((s, w) => s + (Number(w.weight_pct) || 0), 0);

  const updateWeight = (i: number, field: 'category' | 'weight_pct', value: string) => {
    setWeights((prev) => prev.map((w, idx) =>
      idx === i ? { ...w, [field]: field === 'weight_pct' ? Number(value) : value } : w
    ));
  };

  const addRow    = () => setWeights((p) => [...p, { category: '', weight_pct: 0 }]);
  const removeRow = (i: number) => setWeights((p) => p.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (total < 90 || total > 110) { setError(`Weights must sum to ~100%. Currently: ${total}%`); return; }
    const valid = weights.filter((w) => w.category.trim() && w.weight_pct > 0);
    if (valid.length === 0) { setError('Add at least one category.'); return; }
    setSaving(true);
    try {
      await api(`/api/classes/${classId}/grade-weights`, {
        method: 'POST',
        body: { weights: valid },
      });
      onSaved();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not save.');
    } finally { setSaving(false); }
  };

  const inp = "border-2 border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm outline-none transition-all bg-white w-full";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="h-1.5 bg-indigo-600" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-extrabold text-gray-900">Set grade weights</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Enter the grade breakdown from your syllabus. These weights are used to calculate your real grade.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2 mb-3">
            <div className="grid grid-cols-5 gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wide px-1">
              <span className="col-span-3">Category</span>
              <span className="col-span-1">Weight %</span>
              <span></span>
            </div>
            {weights.map((w, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 items-center">
                <input value={w.category}
                  onChange={(e) => updateWeight(i, 'category', e.target.value)}
                  placeholder="e.g. Exams" className={`col-span-3 ${inp}`} />
                <input type="number" value={w.weight_pct}
                  onChange={(e) => updateWeight(i, 'weight_pct', e.target.value)}
                  placeholder="40" className={`col-span-1 ${inp}`} />
                <button onClick={() => removeRow(i)}
                  className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <button onClick={addRow}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add category
            </button>
            <span className={`text-sm font-extrabold ${
              total === 100 ? 'text-emerald-600' : total > 100 ? 'text-red-600' : 'text-amber-600'
            }`}>
              Total: {total}%
              {total === 100 ? ' ✓' : total > 100 ? ' (too high)' : ' (needs 100%)'}
            </span>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 mb-4">
            <p className="text-[11px] text-indigo-700">
              💡 Find these percentages in your professor&apos;s syllabus.
              Example: Exams 40%, Homework 25%, Quizzes 20%, Final 15% = 100%
            </p>
          </div>

          <div className="flex gap-2.5">
            <button onClick={onClose}
              className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving || total < 90 || total > 110}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 disabled:opacity-50 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-md">
              {saving
                ? <RefreshCw className="w-4 h-4 animate-spin" />
                : <><CheckCircle2 className="w-4 h-4" /> Save weights</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────

export default function ClassDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const classId = params?.id as string;

  const [cls,       setCls]       = useState<ClassRecord | null>(null);
  const [summary,   setSummary]   = useState<GradeSummary | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [tab,       setTab]       = useState<Tab>('overview');
  const [showAddGrade,   setShowAddGrade]   = useState(false);
  const [showAddWeights, setShowAddWeights] = useState(false);
  const [deletingGrade,  setDeletingGrade]  = useState<string | null>(null);

  const loadClass = useCallback(async () => {
    if (!classId) return;
    try {
      const [c, s] = await Promise.all([
        api<ClassRecord>(`/api/classes/${classId}`),
        api<GradeSummary>(`/api/grades/class/${classId}/summary`),
      ]);
      setCls(c);
      setSummary(s);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not load class.');
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => { loadClass(); }, [loadClass]);

  const handleDeleteGrade = async (gradeId: string) => {
    setDeletingGrade(gradeId);
    try {
      await api(`/api/grades/${gradeId}`, { method: 'DELETE' });
      await loadClass();
    } catch { /* ignore */ }
    finally { setDeletingGrade(null); }
  };

  if (loading) return (
    <AppLayout>
      <div className="p-6 max-w-[1100px] mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded w-1/3" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
          <div className="h-64 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    </AppLayout>
  );

  if (error || !cls) return (
    <AppLayout>
      <div className="p-6 max-w-[600px] mx-auto text-center mt-20">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-lg font-bold text-gray-700 mb-2">Class not found</p>
        <p className="text-sm text-gray-400 mb-6">{error}</p>
        <button onClick={() => router.push('/classes')}
          className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-indigo-700">
          Back to Classes
        </button>
      </div>
    </AppLayout>
  );

  const currentGrade = summary?.current_grade ?? cls.current_grade;
  const letterGr     = letterGrade(currentGrade);
  const gColor       = gradeColor(currentGrade);
  const hasSyllabus  = !!cls.syllabus_file_id;
  const nextDeadline = cls.assessments.filter((a) => a.due_date).sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())[0];

  return (
    <AppLayout>
      <div className="p-3 md:p-4 lg:p-6 max-w-[1200px] mx-auto">

        {/* Back */}
        <button onClick={() => router.push('/classes')}
          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 mb-3 font-semibold transition-colors">
          <ChevronLeft className="w-4 h-4" /> My Classes
        </button>

        {/* ── HEADER ── */}
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-3">
          <img src="https://res.cloudinary.com/mview/image/upload/atlas/classDetailpage.webp" alt=""
            className="absolute right-48 top-20 -translate-y-1/2 h-44 object-contain pointer-events-none select-none hidden md:block"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />

          <div className="relative z-10 px-6 py-5">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              {/* Left */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center flex-shrink-0 text-xl font-extrabold text-indigo-600 shadow-sm">
                  {cls.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">{cls.name}</h1>
                  {cls.instructor && <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5"><span>👤</span> {cls.instructor}</p>}
                  {cls.term       && <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5"><span>📅</span> {cls.term}</p>}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {[
                      cls.credit_hours ? `${cls.credit_hours} Credits` : null,
                      `${cls.topic_count} Topics`,
                      `${cls.file_count} Files`,
                    ].filter(Boolean).map((p) => (
                      <span key={p} className="text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-md">{p}</span>
                    ))}
                    {!hasSyllabus && (
                      <button onClick={() => router.push(`/upload?class_id=${classId}&hint=syllabus`)}
                        className="text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-md hover:bg-amber-100 transition-all">
                        ⚠ Upload syllabus
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right — grade */}
              <div className="flex flex-col items-start md:items-end flex-shrink-0">
                {currentGrade !== null ? (
                  <>
                    <p className={`text-5xl font-extrabold leading-none ${gColor}`}>{letterGr}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{currentGrade}% Current</p>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 ${confBadge(summary?.confidence || 'low')}`}>
                      {summary?.confidence?.toUpperCase() || 'LOW'} confidence
                    </span>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-4xl font-extrabold text-gray-300">—</p>
                    <p className="text-xs text-gray-400 mt-1">No grades yet</p>
                    <button onClick={() => setShowAddGrade(true)}
                      className="mt-2 text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-100">
                      + Add first grade
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar */}
            {currentGrade !== null && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span className="font-medium text-gray-600">Overall progress</span>
                  <span className="font-bold text-indigo-600">{currentGrade}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${barColor(currentGrade)} rounded-full transition-all`}
                    style={{ width: `${currentGrade}%` }} />
                </div>
              </div>
            )}

            {/* Next assessment */}
            {nextDeadline && (
              <div className="mt-4 bg-indigo-50 border border-indigo-100 flex items-center gap-3 py-2 px-3 rounded-xl">
                <div className="w-9 h-9 rounded-xl bg-white border border-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📅</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Assessment</p>
                  <p className="text-sm font-extrabold text-gray-900">{nextDeadline.title}</p>
                  {nextDeadline.due_date && <p className="text-xs text-indigo-600 font-semibold">{nextDeadline.due_date}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm mb-4 overflow-x-auto">
          {([
            { id: 'overview', label: 'Overview',    icon: '📊' },
            { id: 'grades',   label: 'Grades',      icon: '🏆' },
            { id: 'topics',   label: 'Topics',      icon: '🧠' },
            { id: 'files',    label: 'Materials',   icon: '📁' },
          ] as const).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                tab === t.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* OVERVIEW TAB */}
            {tab === 'overview' && (
              <>
                {/* Grade breakdown */}
                {summary && summary.breakdown.length > 0 ? (
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <p className="text-sm font-extrabold text-gray-900 mb-4">Grade breakdown</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {summary.breakdown.map((b) => (
                        <div key={b.category} className="border border-gray-100 rounded-2xl p-4 text-center">
                          <p className={`text-2xl font-extrabold leading-none ${b.avg_score !== null ? gradeColor(b.avg_score) : 'text-gray-300'}`}>
                            {b.avg_score !== null ? `${b.avg_score}%` : '—'}
                          </p>
                          <p className="text-xs font-bold text-gray-700 mt-1">{b.category}</p>
                          <p className="text-[10px] text-gray-400">{b.weight_pct}% of grade</p>
                          {b.avg_score !== null && (
                            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full ${barColor(b.avg_score)} rounded-full`} style={{ width: `${b.avg_score}%` }} />
                            </div>
                          )}
                          <p className="text-[10px] text-gray-400 mt-1">{b.count} grade{b.count !== 1 ? 's' : ''} entered</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-extrabold text-amber-800">Grade weights not set</p>
                        <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                          Atlas needs to know how your grade is calculated (Exams 40%, Homework 25%, etc.) to show your real grade.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Option 1 — Enter manually */}
                      <button onClick={() => setShowAddWeights(true)}
                        className="flex items-start gap-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3 transition-all text-left">
                        <Tag className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-extrabold">Enter weights manually</p>
                          <p className="text-[11px] opacity-80 mt-0.5">Type the percentages from your syllabus</p>
                        </div>
                      </button>

                      {/* Option 2 — Upload syllabus */}
                      <button onClick={() => router.push(`/upload?class_id=${classId}`)}
                        className="flex items-start gap-3 bg-white border-2 border-indigo-200 hover:border-indigo-400 rounded-xl px-4 py-3 transition-all text-left">
                        <Upload className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-extrabold text-indigo-800">Upload syllabus PDF</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">AI reads it and sets weights automatically</p>
                        </div>
                      </button>
                    </div>

                    <p className="text-[11px] text-amber-600">
                      💡 Already uploaded? Go to <strong>Uploads → Full summary →</strong> and use <strong>"Link to a class"</strong>
                    </p>
                  </div>
                )}

                {/* Topics overview */}
                {cls.topics.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                      <p className="text-sm font-extrabold text-gray-900">Topics from syllabus</p>
                      <button onClick={() => setTab('topics')} className="text-xs font-semibold text-indigo-600 hover:underline">View all</button>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {cls.topics.slice(0, 5).map((t, i) => (
                        <div key={t.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-all">
                          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold flex items-center justify-center flex-shrink-0">{i+1}</span>
                          <p className="text-sm font-medium text-gray-800 flex-1 truncate">{t.title}</p>
                          {t.week_hint && <span className="text-[10px] text-gray-400">Wk {t.week_hint}</span>}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${confBadge(t.confidence || 'medium')}`}>{t.confidence || 'medium'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* GRADES TAB */}
            {tab === 'grades' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-gray-900">{cls.grades.length} grade{cls.grades.length !== 1 ? 's' : ''} recorded</p>
                  <button onClick={() => setShowAddGrade(true)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all">
                    <Plus className="w-3.5 h-3.5" /> Add grade
                  </button>
                </div>

                {cls.grades.length === 0 ? (
                  <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
                    <GraduationCap className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-600 mb-1">No grades yet</p>
                    <p className="text-xs text-gray-400 mb-4">Add your first grade manually or take a photo of a returned quiz.</p>
                    <button onClick={() => setShowAddGrade(true)}
                      className="bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-700">
                      + Add first grade
                    </button>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="divide-y divide-gray-50">
                      {cls.grades.map((g) => {
                        const pct = Math.round((g.score / g.max_score) * 100);
                        return (
                          <div key={g.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-all group">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900">{g.title || g.category}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full">{g.category}</span>
                                <span className="text-[10px] text-gray-400">{new Date(g.recorded_at).toLocaleDateString()}</span>
                                {g.source === 'photo' && <span className="text-[10px] text-purple-600">📷 photo</span>}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className={`text-base font-extrabold ${gradeColor(pct)}`}>{pct}%</p>
                              <p className="text-[10px] text-gray-400">{g.score}/{g.max_score}</p>
                            </div>
                            <button onClick={() => handleDeleteGrade(g.id)} disabled={deletingGrade === g.id}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                              {deletingGrade === g.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TOPICS TAB */}
            {tab === 'topics' && (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-50">
                  <p className="text-sm font-extrabold text-gray-900">All topics — {cls.topics.length} found</p>
                  <p className="text-xs text-gray-400 mt-0.5">Extracted from your syllabus by AI</p>
                </div>
                {cls.topics.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <Brain className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-500 mb-1">No topics yet</p>
                    <p className="text-xs text-gray-400">Upload and link a syllabus to extract topics automatically.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {cls.topics.map((t, i) => (
                      <div key={t.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-all">
                        <span className="text-sm font-bold text-gray-300 w-5 flex-shrink-0">{i+1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{t.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {t.week_hint && <span className="text-[10px] text-gray-400">Week {t.week_hint}</span>}
                            <span className="text-[10px] text-gray-400 capitalize">{t.source}</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${confBadge(t.confidence || 'medium')}`}>
                          {t.confidence || 'medium'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FILES TAB */}
            {tab === 'files' && (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <p className="text-sm font-extrabold text-gray-900">Course Materials — {cls.files.length} files</p>
                  <button onClick={() => router.push('/upload')}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-all">
                    <Upload className="w-3.5 h-3.5" /> Upload file
                  </button>
                </div>
                {cls.files.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-500 mb-1">No files yet</p>
                    <p className="text-xs text-gray-400 mb-4">Upload files and link them to this class.</p>
                    <button onClick={() => router.push('/upload')}
                      className="bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-700">
                      Upload a file
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {cls.files.map((f) => {
                      const meta = FILE_META[f.category] || FILE_META.other;
                      return (
                        <div key={f.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-all">
                          <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                            <meta.icon className={`w-4 h-4 ${meta.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{f.original_name}</p>
                            <p className="text-[11px] text-gray-400">{meta.label} · {f.size_label}</p>
                            {f.extracted_summary && <p className="text-[10px] text-indigo-500 mt-0.5 truncate">{f.extracted_summary}</p>}
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${f.status === 'ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {f.status === 'ready' ? 'Ready' : 'Processing'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="w-full lg:w-[240px] lg:flex-shrink-0 space-y-4">

            {/* Quick add grade */}
            <div className="bg-indigo-600 rounded-2xl p-4 text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5 mb-2 opacity-80" />
              <p className="text-sm font-extrabold mb-1">Add a grade</p>
              <p className="text-[11px] opacity-80 mb-3 leading-relaxed">Got a quiz back? Log it now to keep your projection up to date.</p>
              <button onClick={() => setShowAddGrade(true)}
                className="w-full flex items-center justify-center gap-1.5 bg-white text-indigo-600 font-extrabold text-xs py-2.5 rounded-xl hover:bg-indigo-50 transition-all shadow-sm">
                <Plus className="w-3.5 h-3.5" /> Add grade
              </button>
            </div>

            {/* Grade weights */}
            {cls.grade_weights.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Grade weights</p>
                <div className="space-y-2">
                  {cls.grade_weights.map((w) => (
                    <div key={w.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{w.category}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-indigo-600">{w.weight_pct}%</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${confBadge(w.confidence)}`}>{w.confidence}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming deadlines */}
            {cls.assessments.filter((a) => a.due_date).length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Upcoming</p>
                <div className="space-y-2">
                  {cls.assessments.filter((a) => a.due_date).slice(0, 4).map((a) => (
                    <div key={a.id} className="flex items-start gap-2">
                      <span className="text-sm flex-shrink-0 mt-0.5">📅</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold text-gray-800 truncate">{a.title}</p>
                        <p className="text-[10px] text-indigo-600 font-semibold">{a.due_date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick tools */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Quick Tools</p>
              <div className="space-y-1">
                {[
                  { icon: '📖', label: 'Study Guide', href: '/study-guide' },
                  { icon: '🃏', label: 'Flashcards',  href: '/flashcards'  },
                  { icon: '❓', label: 'Practice Quiz',href: '/quiz'        },
                  { icon: '📤', label: 'Upload File',  href: '/upload'      },
                ].map((t) => (
                  <a key={t.href} href={t.href}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-indigo-50 transition-all group">
                    <span className="text-base">{t.icon}</span>
                    <p className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700">{t.label}</p>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-500 ml-auto" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddWeights && (
        <AddWeightsModal
          classId={classId}
          onClose={() => setShowAddWeights(false)}
          onSaved={loadClass}
        />
      )}
      {showAddGrade && (
        <AddGradeModal
          classId={classId}
          weights={cls.grade_weights}
          onClose={() => setShowAddGrade(false)}
          onSaved={loadClass}
        />
      )}
    </AppLayout>
  );
}
