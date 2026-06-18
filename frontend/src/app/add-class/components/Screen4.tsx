'use client';
// Screen 5 — Review What We Found (with inline editing)
import { useEffect, useState } from 'react';
import { Edit2, ChevronDown, ChevronUp, AlertTriangle, Loader2, CheckCircle2, Save, X, Plus, Trash2 } from 'lucide-react';
import { Phone, ConfBadge } from './shared';
import { api } from '@/lib/api';

interface Props { onNext: () => void; onBack: () => void; classId: string | null; }

interface GradeWeight { category: string; weight_pct: number | null; confidence: string; }
interface Assessment  { title: string; due_date: string | null; confidence: string; category?: string; }
interface Topic       { title: string; week_hint: number | null; confidence: string; }

interface Draft {
  course_name:   string | null;
  course_code:   string | null;
  instructor:    string | null;
  credit_hours:  number | null;
  grade_weights: GradeWeight[];
  assessments:   Assessment[];
  topics:        Topic[];
}

const WEIGHT_ICONS: Record<string, string> = {
  Homework: '📝', Quizzes: '❓', 'Exam I': '📄', 'Exam II': '📄',
  'Exam III': '📄', 'Final Exam': '🎓', Labs: '🧪', Participation: '🤝',
};

const MONTH_ABBR = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
function formatDateBadge(iso: string | null) {
  if (!iso) return null;
  try { const d = new Date(iso); return { month: MONTH_ABBR[d.getMonth()], day: d.getDate() }; }
  catch { return null; }
}

export default function Screen5({ onNext, onBack, classId }: Props) {
  const [draft,   setDraft]   = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  // Edit mode flags
  const [editCourse,  setEditCourse]  = useState(false);
  const [editGrades,  setEditGrades]  = useState(false);
  const [editDates,   setEditDates]   = useState(false);
  const [editTopics,  setEditTopics]  = useState(false);
  const [showAllDates,  setShowAllDates]  = useState(false);
  const [showAllTopics, setShowAllTopics] = useState(false);

  useEffect(() => {
    if (!classId) return;
    api<Draft>(`/api/classes/${classId}/draft`)
      .then(d => setDraft(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [classId]);

  // Save draft back to backend
  const saveDraft = async (updated: Draft) => {
    if (!classId) return;
    setSaving(true);
    try {
      await api(`/api/classes/${classId}/draft`, { method: 'PATCH', body: updated });
      setDraft(updated);
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  // ── Course field change ──
  const setCourse = (field: keyof Draft, value: string | number | null) => {
    if (!draft) return;
    setDraft({ ...draft, [field]: value });
  };

  // ── Grade weight change ──
  const setWeight = (i: number, field: keyof GradeWeight, value: string | number | null) => {
    if (!draft) return;
    const gw = [...draft.grade_weights];
    gw[i] = { ...gw[i], [field]: value };
    setDraft({ ...draft, grade_weights: gw });
  };
  const addWeight = () => {
    if (!draft) return;
    setDraft({ ...draft, grade_weights: [...draft.grade_weights, { category: '', weight_pct: 0, confidence: 'medium' }] });
  };
  const removeWeight = (i: number) => {
    if (!draft) return;
    setDraft({ ...draft, grade_weights: draft.grade_weights.filter((_, j) => j !== i) });
  };

  // ── Assessment change ──
  const setAssessment = (i: number, field: keyof Assessment, value: string | null) => {
    if (!draft) return;
    const a = [...draft.assessments];
    a[i] = { ...a[i], [field]: value };
    setDraft({ ...draft, assessments: a });
  };
  const addAssessment = () => {
    if (!draft) return;
    setDraft({ ...draft, assessments: [...draft.assessments, { title: '', due_date: null, confidence: 'medium' }] });
  };
  const removeAssessment = (i: number) => {
    if (!draft) return;
    setDraft({ ...draft, assessments: draft.assessments.filter((_, j) => j !== i) });
  };

  // ── Topic change ──
  const setTopic = (i: number, field: keyof Topic, value: string | number | null) => {
    if (!draft) return;
    const t = [...draft.topics];
    t[i] = { ...t[i], [field]: value };
    setDraft({ ...draft, topics: t });
  };
  const addTopic = () => {
    if (!draft) return;
    setDraft({ ...draft, topics: [...draft.topics, { title: '', week_hint: null, confidence: 'medium' }] });
  };
  const removeTopic = (i: number) => {
    if (!draft) return;
    setDraft({ ...draft, topics: draft.topics.filter((_, j) => j !== i) });
  };

  // Shared save + close
  const save = (closeFn: () => void) => {
    if (draft) saveDraft(draft);
    closeFn();
  };

  // ── Input styles ──
  const inp = "w-full max-w-full px-2 py-1 text-sm border border-indigo-300 rounded outline-none focus:border-indigo-500 bg-white box-border";

  if (loading) return (
    <Phone step={4} total={8}>
      <div className="flex items-center justify-center min-h-[480px]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    </Phone>
  );

  if (error) return (
    <Phone step={4} total={8}>
      <div className="px-5 py-8 text-center">
        <p className="text-red-500 text-sm mb-3">❌ {error}</p>
        <button onClick={onBack} className="text-indigo-600 text-sm font-semibold">Go back</button>
      </div>
    </Phone>
  );

  return (
    <Phone step={4} total={8}>
      <div className="flex flex-col bg-white overflow-hidden">

        {/* Header */}
        <div className=" pb-3">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-0.5">Review what we found</h1>
          <p className="text-sm text-gray-400">Check everything and edit if anything looks wrong.</p>
        </div>

        {/* Accuracy badge */}
        <div className=" mb-3 flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-3 py-2 w-auto">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-bold text-green-700">92% extracted correctly</span>
          </div>
          {saving && <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />}
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden  pb-4 space-y-4 w-full max-w-full" >

          {/* ── COURSE INFORMATION ── */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
              <p className="text-[12px] font-extrabold text-gray-500 uppercase tracking-widest">Course Information</p>
              {editCourse ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => save(() => setEditCourse(false))}
                    className="flex items-center gap-0.5 text-sm text-green-600 font-bold">
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button onClick={() => setEditCourse(false)} className="text-gray-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setEditCourse(true)}
                  className="flex items-center gap-1 text-xs text-indigo-600 font-semibold">
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
              )}
            </div>
            <div className="px-4 py-3">
              {editCourse ? (
                <div className="space-y-2">
                  {[
                    { label: 'Course Name', field: 'course_name' as const,  value: draft?.course_name   || '' },
                    { label: 'Course Code', field: 'course_code' as const,  value: draft?.course_code   || '' },
                    { label: 'Instructor',  field: 'instructor' as const,   value: draft?.instructor    || '' },
                    { label: 'Credit Hours',field: 'credit_hours' as const, value: String(draft?.credit_hours || '') },
                  ].map(f => (
                    <div key={f.field}>
                      <label className="text-[12px] font-bold text-gray-500 block mb-0.5">{f.label}</label>
                      <input className={inp} value={f.value}
                        onChange={e => setCourse(f.field, f.field === 'credit_hours' ? Number(e.target.value) : e.target.value)} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 text-base font-extrabold">
                      {draft?.course_code?.[0] || draft?.course_name?.[0] || 'C'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900">
                      {draft?.course_code && draft?.course_name
                        ? `${draft.course_code} – ${draft.course_name}`
                        : draft?.course_name || draft?.course_code || 'Course Name'}
                    </p>
                    <div className="flex items-center gap-2 text-[13px] text-gray-500 mt-0.5">
                      {draft?.instructor && <span>👤 {draft.instructor}</span>}
                      {draft?.credit_hours && <><span>•</span><span>📚 {draft.credit_hours} Credits</span></>}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* ── GRADING BREAKDOWN ── */}
          {(draft?.grade_weights?.length ?? 0) > 0 && (
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-indigo-50 border-b border-indigo-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">📊</span>
                  <p className="text-[12px] font-extrabold text-gray-700 uppercase tracking-widest">Grading Breakdown</p>
                </div>
                {editGrades ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => save(() => setEditGrades(false))}
                      className="flex items-center gap-0.5 text-sm text-green-600 font-bold">
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button onClick={() => setEditGrades(false)} className="text-gray-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditGrades(true)}
                    className="flex items-center gap-1 text-xs text-indigo-600 font-semibold">
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                )}
              </div>
              <div className="px-2 py-2">
                {draft!.grade_weights.map((w, i) => (
                  <div key={i} className="py-2 border-b border-gray-50 last:border-0 overflow-x-hidden w-full">
                    {editGrades ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm w-5 text-center flex-shrink-0">{WEIGHT_ICONS[w.category] || '📋'}</span>
                        <input 
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded outline-none focus:border-indigo-500 bg-white"
                          value={w.category}
                          placeholder="Category name"
                          onChange={e => setWeight(i, 'category', e.target.value)} />
                        <input 
                          className="w-12 px-2 py-1.5 text-sm border border-gray-300 rounded outline-none focus:border-indigo-500 bg-white text-center"
                          type="number" 
                          min="0" 
                          max="100" 
                          value={w.weight_pct ?? ''}
                          placeholder="0"
                          onChange={e => setWeight(i, 'weight_pct', Number(e.target.value))} />
                        <span className="text-[13px] text-gray-500 flex-shrink-0">%</span>
                        <button onClick={() => removeWeight(i)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm w-6 text-center flex-shrink-0">{WEIGHT_ICONS[w.category] || '📋'}</span>
                        <span className="flex-1 text-sm font-semibold text-gray-800">{w.category}</span>
                        <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(w.weight_pct || 0) * 5}%` }} />
                        </div>
                        <span className="text-[13px] font-bold text-gray-600 w-8 text-right flex-shrink-0">{w.weight_pct}%</span>
                        <ConfBadge level={w.confidence} />
                      </div>
                    )}
                  </div>
                ))}
                {editGrades && (
                  <button onClick={addWeight}
                    className="flex items-center gap-1 text-xs text-indigo-600 font-semibold mt-2 hover:text-indigo-800">
                    <Plus className="w-3.5 h-3.5" /> Add Category
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── ASSESSMENTS (No Due Date / TBD) ── */}
          {(draft?.assessments?.filter(a => !a.due_date)?.length ?? 0) > 0 && (
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-orange-50 border-b border-orange-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">📋</span>
                  <p className="text-[12px] font-extrabold text-gray-700 uppercase tracking-widest">Assessments</p>
                </div>
                {editDates ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => save(() => setEditDates(false))}
                      className="flex items-center gap-0.5 text-sm text-green-600 font-bold">
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button onClick={() => setEditDates(false)} className="text-gray-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditDates(true)}
                    className="flex items-center gap-1 text-xs text-indigo-600 font-semibold">
                    <Edit2 className="w-4 h-4" /> Edit All
                  </button>
                )}
              </div>
              <div className="px-4 py-2">
                {draft!.assessments.map((a, idx) => !a.due_date && (
                  <div key={idx} className="flex items-center gap-2 py-2 border-b overflow-x-hidden w-full border-gray-50 last:border-0">
                    {editDates ? (
                      <>
                        <input 
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded outline-none focus:border-indigo-500 bg-white"
                          value={a.title} 
                          placeholder="Assessment name"
                          onChange={e => setAssessment(idx, 'title', e.target.value)} />
                        <button onClick={() => removeAssessment(idx)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{a.title}</p>
                       
                        </div>
                        <ConfBadge level={a.confidence} />
                      </>
                    )}
                  </div>
                ))}
                {editDates && (
                  <button onClick={addAssessment}
                    className="flex items-center gap-1 text-sm text-indigo-600 font-semibold mt-2 hover:text-indigo-800">
                    <Plus className="w-3.5 h-3.5" /> Add Assessment
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── IMPORTANT DATES (With Due Date) ── */}
          {(draft?.assessments?.filter(a => a.due_date)?.length ?? 0) > 0 && (
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-orange-50 border-b border-orange-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">📅</span>
                  <p className="text-[12px] font-extrabold text-gray-700 uppercase tracking-widest">Important Dates</p>
                </div>
                {editDates ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => save(() => setEditDates(false))}
                      className="flex items-center gap-0.5 text-sm text-green-600 font-bold">
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button onClick={() => setEditDates(false)} className="text-gray-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditDates(true)}
                    className="flex items-center gap-1 text-xs text-indigo-600 font-semibold">
                    <Edit2 className="w-4 h-4" /> Edit All
                  </button>
                )}
              </div>
              <div className="px-4 py-2">
                {draft!.assessments.map((a, idx) => a.due_date && (
                  <div key={idx} className="py-2 border-b border-gray-50 last:border-0 overflow-x-hidden">
                    {editDates ? (
                      <div className="flex items-center gap-2">
                        <input 
                          className="w-32 flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded outline-none focus:border-indigo-500 bg-white"
                          value={a.title} 
                          placeholder="Assessment name"
                          onChange={e => setAssessment(idx, 'title', e.target.value)} />
                        <input 
                          className="w-32 px-2 py-1.5 text-sm border border-gray-300 rounded outline-none focus:border-indigo-500 bg-white"
                          type="date" 
                          value={a.due_date || ''}
                          onChange={e => setAssessment(idx, 'due_date', e.target.value || null)} />
                        <button onClick={() => removeAssessment(idx)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {(() => {
                          const badge = formatDateBadge(a.due_date);
                          return badge ? (
                            <div className="flex-shrink-0 w-9 text-center">
                              <p className="text-[10px] font-extrabold text-red-500 uppercase leading-none">{badge.month}</p>
                              <p className="text-sm font-extrabold text-gray-900 leading-tight">{badge.day}</p>
                            </div>
                          ) : (
                            <div className="w-9 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-[8px] text-gray-400">TBD</span>
                            </div>
                          );
                        })()}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{a.title}</p>
                          <p className="text-[11px] text-gray-400">{a.due_date || 'TBD'}</p>
                        </div>
                        <ConfBadge level={a.confidence} />
                      </div>
                    )}
                  </div>
                ))}
                {editDates && (
                  <button onClick={addAssessment}
                    className="flex items-center gap-1 text-sm text-indigo-600 font-semibold mt-2 hover:text-indigo-800">
                    <Plus className="w-3.5 h-3.5" /> Add Date
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── WEEKLY TOPICS ── */}
          {(draft?.topics?.length ?? 0) > 0 && (
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-blue-50 border-b border-blue-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">📚</span>
                  <p className="text-[12px] font-extrabold text-gray-700 uppercase tracking-widest">Weekly Topics</p>
                </div>
                {editTopics ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => save(() => setEditTopics(false))}
                      className="flex items-center gap-0.5 text-sm text-green-600 font-bold">
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button onClick={() => setEditTopics(false)} className="text-gray-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditTopics(true)}
                    className="flex items-center gap-1 text-xs text-indigo-600 font-semibold">
                    <Edit2 className="w-4 h-4" /> Edit All
                  </button>
                )}
              </div>
              <div className="px-4 py-2">
                {(showAllTopics ? draft!.topics : draft!.topics.slice(0, 3)).map((t, i) => (
                  <div key={i} className="py-2 border-b border-gray-50 last:border-0 overflow-x-hidden w-full">
                    {editTopics ? (
                      <div className="flex items-center gap-2">
                        <input 
                          className="w-16 px-2 py-1.5 text-sm border border-gray-300 rounded outline-none focus:border-indigo-500 bg-white text-center"
                          type="number" 
                          min="1" 
                          value={t.week_hint ?? ''}
                          placeholder="Week"
                          onChange={e => setTopic(i, 'week_hint', e.target.value ? Number(e.target.value) : null)} />
                        <input 
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded outline-none focus:border-indigo-500 bg-white"
                          value={t.title} 
                          placeholder="Topic title"
                          onChange={e => setTopic(i, 'title', e.target.value)} />
                        <button onClick={() => removeTopic(i)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="flex-1 w-32 text-sm font-semibold text-gray-800 min-w-0 truncate">
                          {t.week_hint && <span className="text-gray-400 mr-1">Week {t.week_hint}:</span>}
                          {t.title}
                        </p>
                        <ConfBadge level={t.confidence} />
                      </div>
                    )}
                  </div>
                ))}
                {editTopics && (
                  <button onClick={addTopic}
                    className="flex items-center gap-1 text-sm text-indigo-600 font-semibold mt-2 hover:text-indigo-800">
                    <Plus className="w-3.5 h-3.5" /> Add Topic
                  </button>
                )}
                {!editTopics && (draft?.topics?.length ?? 0) > 3 && (
                  <button onClick={() => setShowAllTopics(!showAllTopics)}
                    className="flex items-center gap-1 text-sm text-indigo-600 font-semibold mt-2">
                    {showAllTopics ? 'Show less' : `View all ${draft?.topics?.length} topics`}
                    {showAllTopics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 leading-relaxed">
              Atlas may miss small details. Quickly review dates and percentages before continuing.
            </p>
          </div>

        </div>
      </div>
    </Phone>
  );
}
