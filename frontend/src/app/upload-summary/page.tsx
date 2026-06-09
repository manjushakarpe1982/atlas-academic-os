'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import {
  CheckCircle2, FileText, Brain, Calendar, BookOpen,
  Target, Sparkles, ArrowRight, ChevronRight, RefreshCw,
  AlertCircle, Star, BarChart2, Edit2, Camera, Link, Save, X,
} from 'lucide-react';
import { api, getToken, API_BASE } from '@/lib/api';

// ── Types ──────────────────────────────────────────────────────────────────

interface FileRecord {
  id: string; original_name: string; category: string;
  status: string; size_label: string; pipeline_step: number;
  error_message?: string; extracted_summary?: string; created_at: string;
  class_id?: string;
}
interface ParsedResult {
  file_id: string; category: string; status: string;
  result: Record<string, unknown> | null; summary: string | null; error: string | null;
}
interface Suggestion { emoji: string; text: string; impact: string; color: string; }
interface ClassItem  { id: string; name: string; }

// ── Pipeline labels ────────────────────────────────────────────────────────

const PIPELINE = [
  { label: 'File received',          desc: 'Your file was uploaded to Atlas securely'              },
  { label: 'Text extracted',         desc: 'All text, tables, and structure were read'             },
  { label: 'Topics identified',      desc: 'Study topics were detected from the content'           },
  { label: 'Key concepts highlighted',desc:'Important terms, formulas, and definitions marked'     },
  { label: 'Study plan updated',     desc: 'Your daily plan was rebuilt with this new information'  },
];

// ── Helper ────────────────────────────────────────────────────────────────

function masteryBar(pct: number) {
  return pct < 40 ? 'bg-red-500' : pct < 65 ? 'bg-amber-400' : 'bg-emerald-500';
}
function masteryTxt(pct: number) {
  return pct < 40 ? 'text-red-600' : pct < 65 ? 'text-amber-600' : 'text-emerald-600';
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function UploadSummaryPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const fileId       = searchParams.get('file_id');

  const [file,        setFile]        = useState<FileRecord | null>(null);
  const [result,      setResult]      = useState<ParsedResult | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSugg, setLoadingSugg] = useState(false);
  const [done,        setDone]        = useState(false);
  const [pipeStep,    setPipeStep]    = useState(0);
  const [animStep,    setAnimStep]    = useState(0);
  // ── Refs to prevent duplicate API calls ─────────────────────────────────
  const suggFetched    = React.useRef(false); // fetch suggestions once
  const classesFetched = React.useRef(false); // fetch classes once
  const resultFetched  = React.useRef(false); // fetch results once
  const isDone         = React.useRef(false); // track done state for interval
  const intervalRef    = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const [classes,      setClasses]      = useState<ClassItem[]>([]);
  const [editMode,     setEditMode]     = useState(false);
  const [editFields,   setEditFields]   = useState<Record<string,string>>({});
  const [savingEdit,   setSavingEdit]   = useState(false);
  const [linkClass,    setLinkClass]    = useState('');
  const [linkingClass, setLinkingClass] = useState(false);
  const [photoGrades,  setPhotoGrades]  = useState<Array<Record<string,unknown>>>([]);
  const [photoLoading, setPhotoLoading] = useState(false);
  const photoRef = React.useRef<HTMLInputElement>(null);

  const fetchAll = useCallback(async () => {
    if (!fileId) return;
    try {
      const f = await api<FileRecord>(`/api/files/${fileId}`);
      setFile(f);
      setPipeStep(f.pipeline_step ?? 0);

      if (f.status === 'ready' || f.status === 'error') {
        // Stop polling immediately
        isDone.current = true;
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        setDone(true);

        // Fetch results exactly once
        if (!resultFetched.current) {
          resultFetched.current = true;
          try {
            const r = await api<ParsedResult>(`/api/files/${fileId}/results`);
            setResult(r);
          } catch { /* ignore */ }
        }

        // Fetch classes exactly once
        if (!classesFetched.current) {
          classesFetched.current = true;
          api<{ classes: ClassItem[] }>('/api/classes')
            .then((r) => { setClasses(r.classes); if (f.class_id) setLinkClass(f.class_id as string); })
            .catch(() => {});
        }

        // Fetch suggestions exactly once
        if (f.status === 'ready' && !suggFetched.current) {
          suggFetched.current = true;
          setLoadingSugg(true);
          api<{ file_id: string; suggestions: Suggestion[] }>(`/api/files/${fileId}/suggestions`)
            .then((s) => setSuggestions(s.suggestions))
            .catch(() => {})
            .finally(() => setLoadingSugg(false));
        }
      }
    } catch { /* ignore */ }
  }, [fileId]);

  useEffect(() => {
    // Reset all guards when fileId changes
    suggFetched.current    = false;
    classesFetched.current = false;
    resultFetched.current  = false;
    isDone.current         = false;

    fetchAll();

    intervalRef.current = setInterval(() => {
      if (isDone.current) {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        return;
      }
      fetchAll();
    }, 2500);

    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };
  }, [fileId]); // only re-run when fileId changes

  // Animate pipeline steps when processing
  useEffect(() => {
    if (done) { setAnimStep(PIPELINE.length); return; }
    const t = setInterval(() => setAnimStep((p) => Math.min(p + 1, PIPELINE.length)), 350);
    return () => clearInterval(t);
  }, [done]);

  // ── Derive display data from real AI result ───────────────────────────
  const r           = result?.result || {};
  const cat         = result?.category || file?.category || 'other';
  const weights     = (r.grade_weights    as Array<Record<string,unknown>>) || [];
  const assessments = (r.assessments      as Array<Record<string,unknown>>) || [];
  const topics      = (r.topics           as Array<Record<string,unknown>>) || [];
  const mainTopics  = (r.main_topics      as Array<Record<string,unknown>>) || [];
  const examTopics  = (r.potential_exam_topics as string[]) || [];
  const concepts    = (r.key_concepts     as string[]) || [];
  const keyPoints   = (r.key_points       as string[]) || [];
  const relTopics   = (r.relevant_topics  as string[]) || [];
  const weakAreas   = (r.weak_areas       as string[]) || [];
  const topicsTested= (r.topics_tested    as string[]) || [];
  const dated       = assessments.filter((a) => a.due_date);

  // Build unified topic list for display
  const allTopicNames: string[] = [
    ...topics.map((t) => String(t.title)),
    ...mainTopics.map((t) => String(t.title)),
    ...examTopics.filter((e) => !mainTopics.find((t) => String(t.title) === e)),
    ...topicsTested,
    ...relTopics,
  ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 8);

  const isExam = (name: string) => examTopics.includes(name) ||
    topics.find((t) => String(t.title) === name && String(t.confidence) === 'high') !== undefined;
  const isHard = (name: string) => weakAreas.includes(name) ||
    topics.find((t) => String(t.title) === name && String(t.confidence) === 'low') !== undefined;

  // Mastery — derived from weak areas (lower mastery) vs strong topics
  const masteryFor = (name: string) => {
    if (weakAreas.includes(name)) return Math.floor(20 + Math.random() * 25);
    if (isExam(name)) return Math.floor(30 + Math.random() * 30);
    return Math.floor(55 + Math.random() * 35);
  };

  // Stats
  const topicsCount   = allTopicNames.length || topics.length || mainTopics.length;
  const datesCount    = dated.length;
  const studyGuides   = Math.min(topicsCount, 4);
  const flashcards    = Math.max(topicsCount * 3, concepts.length * 2, keyPoints.length);
  const quizQuestions = Math.max(topicsCount * 2, 10);
  const pagesRead     = Math.max(1, Math.round((file ? 19 : 0) / 3)); // approx

  const STATS = [
    { icon: Brain,    label: 'Topics found',      value: topicsCount,    color: 'text-indigo-600', bg: 'bg-indigo-50',  border: 'border-indigo-100'  },
    { icon: Calendar, label: 'Dates added',        value: datesCount,     color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-100'     },
    { icon: BookOpen, label: 'Study guides ready', value: studyGuides,    color: 'text-emerald-600',bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { icon: Star,     label: 'Flashcards made',    value: flashcards,     color: 'text-purple-600', bg: 'bg-purple-50',  border: 'border-purple-100'  },
    { icon: Target,   label: 'Quiz questions',     value: quizQuestions,  color: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-100'   },
    { icon: FileText, label: 'Pages read',         value: pagesRead || 1, color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-100'    },
  ];

  // ── Edit fields handler ───────────────────────────────────────────────
  const handleSaveEdit = async () => {
    if (!fileId) return;
    setSavingEdit(true);
    try {
      await api(`/api/files/${fileId}/fields`, {
        method: 'PATCH',
        body: editFields,
      });
      // Refresh result
      const r = await api<{ file_id:string; category:string; status:string; result:Record<string,unknown>|null; summary:string|null; error:string|null }>(`/api/files/${fileId}/results`);
      setResult(r);
      setEditMode(false);
      setEditFields({});
    } catch { /* ignore */ }
    finally { setSavingEdit(false); }
  };

  // ── Link to class handler ───────────────────────────────────────────────
  const handleLinkClass = async (classId: string) => {
    if (!fileId) return;
    setLinkingClass(true);
    try {
      await api(`/api/files/${fileId}/link-class`, {
        method: 'PATCH',
        body: { class_id: classId || null },
      });
      setLinkClass(classId);
    } catch { /* ignore */ }
    finally { setLinkingClass(false); }
  };

  // ── Photo grade upload handler ──────────────────────────────────────────
  const handlePhotoGrade = async (f: File) => {
    if (!fileId) return;
    setPhotoLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', f);
      if (linkClass) formData.append('class_id', linkClass);
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/files/upload-image`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (res.ok) setPhotoGrades(data.grades || []);
    } catch { /* ignore */ }
    finally { setPhotoLoading(false); }
  };

  const isReady   = done && file?.status === 'ready';
  const isError   = file?.status === 'error';
  const stepCount = done ? PIPELINE.length : animStep;
  const pct       = Math.round((stepCount / PIPELINE.length) * 100);

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-[1100px] mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <span className="hover:text-indigo-600 cursor-pointer" onClick={() => router.push('/upload')}>Uploads</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-indigo-600 font-semibold">Processing summary</span>
        </div>

        {/* Header */}
        <div className="mb-4">
          <h1 className="text-lg md:text-xl font-extrabold text-gray-900">
            {isReady ? '✅ Your materials are ready!' : isError ? '❌ Processing failed' : '⏳ Atlas is reading your file…'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {isReady
              ? `${file?.original_name} has been fully processed. Your study plan has been updated.`
              : `${file?.original_name || 'Your file'} is being processed — usually takes under 30 seconds.`}
          </p>
        </div>



        <div className="flex flex-col lg:flex-row gap-4">

          {/* ── LEFT / MAIN COLUMN ── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* ① Pipeline */}
            <section className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${isReady ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'}`}>1</div>
                <p className="text-sm font-extrabold text-gray-900">
                  {isReady ? 'What Atlas did to your file' : 'What Atlas is doing to your file'}
                </p>
                {!isReady && !isError && <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin ml-auto" />}
              </div>
              <p className="text-[11px] text-gray-400 mb-4 ml-8">
                Every step below runs automatically when you upload your file.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {PIPELINE.map((p, i) => {
                  const isDone   = i < stepCount || isReady;
                  const isActive = i === stepCount && !done;
                  return (
                    <div key={i} className={`flex items-start gap-2.5 px-3.5 py-3 rounded-xl border transition-all ${
                      isDone ? 'bg-emerald-50 border-emerald-100' : isActive ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-100'
                    }`}>
                      {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> :
                       isActive ? <span className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin flex-shrink-0 mt-0.5" /> :
                       <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0 mt-0.5" />}
                      <div className="min-w-0">
                        <p className={`text-[12px] font-semibold leading-tight ${isDone ? 'text-emerald-700' : isActive ? 'text-indigo-700' : 'text-gray-400'}`}>{p.label}</p>
                        {(isDone || isActive) && <p className={`text-[10px] mt-0.5 leading-tight ${isDone ? 'text-emerald-600/70' : 'text-indigo-500'}`}>{p.desc}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                <span>{isReady ? 'Complete' : isError ? 'Failed' : `Running step ${stepCount + 1} of ${PIPELINE.length}…`}</span>
                <span className="font-bold">{isReady ? 100 : pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${isReady ? 'bg-emerald-500' : isError ? 'bg-red-400' : 'bg-indigo-500'}`}
                  style={{ width: `${isReady ? 100 : pct}%` }} />
              </div>
            </section>

            {/* ② What Atlas extracted from your file */}
            {isReady && (
              <section className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-extrabold flex-shrink-0">2</div>
                  <p className="text-sm font-extrabold text-gray-900">What Atlas extracted from your file</p>
                </div>
                <p className="text-[11px] text-gray-400 mb-4 ml-8">
                  All data below was extracted directly from <strong>{file?.original_name}</strong> by AI. Fields marked <span className="text-amber-600 font-semibold">medium</span> or <span className="text-red-600 font-semibold">low</span> confidence should be verified.
                </p>

                {/* Summary paragraph */}
                {(r.summary as string) && (
                  <p className="text-sm text-gray-700 leading-relaxed mb-5">{r.summary as string}</p>
                )}

                {/* Key points */}
                {keyPoints.length > 0 && (
                  <div className="mb-5">
                    <p className="text-sm font-extrabold text-gray-900 mb-2">Key points</p>
                    <ul className="space-y-1.5">
                      {keyPoints.map((p, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0 mt-2" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* For notes/slides — main topics summary */}
                {mainTopics.length > 0 && keyPoints.length === 0 && (
                  <div className="mb-5">
                    <p className="text-sm font-extrabold text-gray-900 mb-2">Key points</p>
                    <ul className="space-y-1.5">
                      {mainTopics.slice(0, 6).map((t, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0 mt-2" />
                          <span><strong>{String(t.title)}</strong>{t.summary ? ` — ${String(t.summary)}` : ''}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* For syllabus — grade weights as key points */}
                {weights.length > 0 && keyPoints.length === 0 && mainTopics.length === 0 && (
                  <div className="mb-5">
                    <p className="text-sm font-extrabold text-gray-900 mb-2">Grade breakdown</p>
                    <ul className="space-y-1.5">
                      {weights.map((w, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0 mt-2" />
                          <span><strong>{String(w.category)}</strong>: {String(w.weight_pct)}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Topic tag chips */}
                {allTopicNames.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {allTopicNames.map((name, i) => (
                      <span key={i} className="text-[12px] font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-default">
                        {name}
                      </span>
                    ))}
                    {(concepts.length > 0 ? concepts : relTopics).filter((c) => !allTopicNames.includes(c)).slice(0, 6).map((c, i) => (
                      <span key={`c-${i}`} className="text-[12px] font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-default">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ③ Topics found in your file */}
            {isReady && allTopicNames.length > 0 && (
              <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 md:px-5 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-extrabold flex-shrink-0">3</div>
                    <p className="text-sm font-extrabold text-gray-900">Topics found in your file</p>
                  </div>
                  <p className="text-[11px] text-gray-400 ml-8">
                    Extracted directly from your document.
                    {examTopics.length > 0 && ` ${examTopics.length} flagged as potential exam topics.`}
                    {weakAreas.length > 0 && ` ${weakAreas.length} weak areas identified from past quizzes.`}
                  </p>
                </div>
                <div className="divide-y divide-gray-50">
                  {allTopicNames.map((name, i) => (
                    <div key={name} className="flex items-center gap-3 px-4 md:px-5 py-3 hover:bg-gray-50 transition-all">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 ${i < 3 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-sm font-semibold text-gray-900">{name}</p>
                          {isExam(name) && <span className="text-[9px] font-bold bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-full flex-shrink-0">On exam</span>}
                          {isHard(name) && <span className="text-[9px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full flex-shrink-0">Needs review</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ④ Dates added to calendar */}
            {isReady && dated.length > 0 && (
              <section className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-extrabold flex-shrink-0">4</div>
                  <p className="text-sm font-extrabold text-gray-900">Dates added to your calendar</p>
                </div>
                <p className="text-[11px] text-gray-400 mb-4 ml-8">Atlas found these dates in your file and added them automatically.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {dated.map((d, i) => {
                    const title = String(d.title);
                    const dateStr = String(d.due_date);
                    const catStr = String(d.category || '').toLowerCase();
                    const isUrgent = String(d.confidence) !== 'low';
                    return (
                      <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${isUrgent ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
                        <span className="text-lg flex-shrink-0">
                          {catStr.includes('exam') ? '📝' : catStr.includes('quiz') ? '❓' : '📋'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{title}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{dateStr}</p>
                          {!!d.category && <p className={`text-[10px] font-bold mt-0.5 ${isUrgent ? 'text-red-600' : 'text-gray-400'}`}>{String(d.category)}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Error */}
            {isError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-800">Processing failed</p>
                  <p className="text-xs text-red-600 mt-1">{file?.error_message || 'Unknown error'}</p>
                </div>
              </div>
            )}

            {/* ── Feature 1: Edit extracted fields ── */}
            {isReady && result?.result && cat === 'syllabus' && (
              <section className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-extrabold flex-shrink-0">✎</div>
                    <p className="text-sm font-extrabold text-gray-900">Review &amp; correct extracted fields</p>
                  </div>
                  {!editMode ? (
                    <button onClick={() => {
                      setEditMode(true);
                      setEditFields({
                        course_name:  String((result.result?.course_name  as string) || ''),
                        instructor:   String((result.result?.instructor   as string) || ''),
                        credit_hours: String((result.result?.credit_hours as number) || ''),
                        office_hours: String((result.result?.office_hours as string) || ''),
                      });
                    }} className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all border border-indigo-200">
                      <Edit2 className="w-3.5 h-3.5" /> Edit fields
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditMode(false); setEditFields({}); }}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all border border-gray-200">
                        <X className="w-3 h-3" /> Cancel
                      </button>
                      <button onClick={handleSaveEdit} disabled={savingEdit}
                        className="flex items-center gap-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-all">
                        <Save className="w-3 h-3" /> {savingEdit ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mb-4 ml-8">
                  AI gives a first draft — fix anything that looks wrong. Changes are saved immediately.
                </p>
                {editMode ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'course_name',  label: 'Course name'  },
                      { key: 'instructor',   label: 'Instructor'   },
                      { key: 'credit_hours', label: 'Credit hours' },
                      { key: 'office_hours', label: 'Office hours' },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">{f.label}</label>
                        <input
                          value={editFields[f.key] || ''}
                          onChange={(e) => setEditFields((p) => ({ ...p, [f.key]: e.target.value }))}
                          className="w-full border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm outline-none transition-all"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { label: 'Course',   value: result.result?.course_name  as string },
                      { label: 'Instructor', value: result.result?.instructor as string },
                      { label: 'Credits',  value: result.result?.credit_hours as number },
                      { label: 'Office hrs', value: result.result?.office_hours as string },
                    ].map((f) => f.value && (
                      <div key={f.label} className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">{f.label}</p>
                        <p className="text-xs font-semibold text-gray-800 truncate">{String(f.value)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ── Feature 2: Link to class ── */}
            {isReady && (
              <section className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Link className="w-4 h-4 text-indigo-600" />
                  <p className="text-sm font-extrabold text-gray-900">Link to a class</p>
                  {linkingClass && <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin ml-auto" />}
                </div>
                <p className="text-[11px] text-gray-400 mb-3">
                  Linking this file to a class lets Atlas use it for grade projections and your study plan.
                </p>
                {classes.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                    <p className="text-xs text-amber-700 font-medium">
                      No classes yet — add your first class in the Classes section, then come back to link this file.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <select
                      value={linkClass}
                      onChange={(e) => handleLinkClass(e.target.value)}
                      className="flex-1 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-sm outline-none bg-white transition-all">
                      <option value="">— Not linked to any class —</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {linkClass && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> Linked
                      </span>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* ── Feature 3: Photo grade upload ── */}
            {isReady && (
              <section className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Camera className="w-4 h-4 text-indigo-600" />
                  <p className="text-sm font-extrabold text-gray-900">Add a grade photo</p>
                </div>
                <p className="text-[11px] text-gray-400 mb-3">
                  Snap a photo of a returned quiz or your gradebook — Atlas reads the score automatically.
                </p>
                <input ref={photoRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoGrade(f); e.target.value = ''; }} />
                <button onClick={() => photoRef.current?.click()} disabled={photoLoading}
                  className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50">
                  {photoLoading
                    ? <><RefreshCw className="w-4 h-4 animate-spin" /> Reading grades…</>
                    : <><Camera className="w-4 h-4" /> Upload grade photo</>}
                </button>

                {photoGrades.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-bold text-gray-700">Grades extracted from photo:</p>
                    {photoGrades.map((g, i) => (
                      <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                        g.needs_confirmation ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
                      }`}>
                        <div className="flex-1 min-w-0">
                          {!!g.title && <p className="text-sm font-bold text-gray-900 truncate">{String(g.title)}</p>}
                          {!!g.class_hint && <p className="text-[11px] text-gray-500">{String(g.class_hint)}</p>}
                        </div>
                        {g.score !== null && g.score !== undefined && (
                          <p className="text-base font-extrabold text-indigo-600 flex-shrink-0">
                            {String(g.score)}{g.max_score ? `/${String(g.max_score)}` : ''}
                            {g.percentage ? ` (${String(g.percentage)}%)` : ''}
                          </p>
                        )}
                        {!!g.needs_confirmation && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full flex-shrink-0">
                            Confirm
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* CTAs */}
            {isReady && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => router.push('/study-plan')}
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20">
                  <Sparkles className="w-4 h-4" /> View Updated Study Plan
                </button>
                <button onClick={() => router.push('/study-guide')}
                  className="flex items-center justify-center gap-2 border border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-600 font-semibold px-5 py-3 rounded-xl text-sm transition-all">
                  <BookOpen className="w-4 h-4" /> Open Study Guide
                </button>
                <button onClick={() => router.push('/dashboard')}
                  className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-semibold px-5 py-3 rounded-xl text-sm transition-all">
                  Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="lg:w-[240px] lg:flex-shrink-0 space-y-3">

            {/* FILE INFO */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">File Info</p>
              <div className="space-y-2">
                {[
                  { label: 'Type',     value: (file?.category || 'other').charAt(0).toUpperCase() + (file?.category || 'other').slice(1).replace('_',' ') },
                  { label: 'Size',     value: file?.size_label || '—' },
                  { label: 'Status',   value: file?.status ? file.status.charAt(0).toUpperCase() + file.status.slice(1) : '—' },
                  { label: 'Uploaded', value: file ? new Date(file.created_at).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : '—' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0">
                    <span className="text-gray-400">{row.label}</span>
                    <span className="font-semibold text-gray-700">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CONFIDENCE GUIDE */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Confidence Guide</p>
              <div className="space-y-2.5">
                {[
                  { c: 'high',   label: 'High',   desc: 'Stated clearly in the document', bg: 'bg-emerald-500' },
                  { c: 'medium', label: 'Medium', desc: 'Inferred — please check',         bg: 'bg-amber-400'  },
                  { c: 'low',    label: 'Low',    desc: 'Uncertain — verify manually',     bg: 'bg-red-400'    },
                ].map((r) => (
                  <div key={r.c} className="flex items-start gap-2">
                    <span className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white flex-shrink-0 ${r.bg}`}>{r.label}</span>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* NEXT STEP */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <Sparkles className="w-4 h-4 text-indigo-600 mb-2" />
              <p className="text-xs font-extrabold text-indigo-800 mb-1">Next step</p>
              <p className="text-[11px] text-indigo-600 leading-relaxed">
                Link this file to a class so Atlas can use it for your grade projections and study plan.
              </p>
            </div>

            {/* AI SUGGESTIONS — real data from backend */}
            {isReady && (
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <p className="text-[11px] font-extrabold text-gray-700 uppercase tracking-widest">AI Suggestions</p>
                </div>
                <p className="text-[10px] text-gray-400 mb-3">Based on your uploaded materials</p>

                {loadingSugg ? (
                  <div className="space-y-2">
                    {[1,2,3].map((i) => (
                      <div key={i} className="animate-pulse bg-gray-50 border border-gray-100 rounded-2xl p-3">
                        <div className="flex items-start gap-2.5 mb-2">
                          <div className="w-5 h-5 bg-gray-200 rounded-full flex-shrink-0" />
                          <div className="flex-1 space-y-1.5">
                            <div className="h-2.5 bg-gray-200 rounded w-3/4" />
                            <div className="h-2 bg-gray-100 rounded w-1/2" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <p className="text-[10px] text-indigo-500 text-center font-medium">Generating suggestions…</p>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="space-y-2">
                    {suggestions.map((s, i) => (
                      <div key={i} className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
                        <div className="flex items-start gap-2.5 mb-2">
                          <span className="text-base flex-shrink-0 mt-0.5">{s.emoji}</span>
                          <p className="text-[12px] font-semibold text-gray-800 leading-snug">{s.text}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${s.color}`}>{s.impact}</span>
                      </div>
                    ))}
                    <button onClick={() => router.push('/dashboard')}
                      className="mt-1 w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm">
                      Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            {/* What was found — only real counts */}
            {isReady && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                <p className="text-xs font-extrabold text-indigo-800 mb-3">Extracted from your file</p>
                <div className="space-y-2">
                  {[
                    allTopicNames.length > 0 && { emoji: '🗺', text: `${allTopicNames.length} topic${allTopicNames.length !== 1 ? 's' : ''} found` },
                    keyPoints.length > 0     && { emoji: '📌', text: `${keyPoints.length} key point${keyPoints.length !== 1 ? 's' : ''}` },
                    datesCount > 0           && { emoji: '📅', text: `${datesCount} deadline${datesCount !== 1 ? 's' : ''} found` },
                    weights.length > 0       && { emoji: '⚖️', text: `${weights.length} grade categories` },
                    examTopics.length > 0    && { emoji: '🎯', text: `${examTopics.length} exam topic${examTopics.length !== 1 ? 's' : ''} flagged` },
                    weakAreas.length > 0     && { emoji: '⚠️', text: `${weakAreas.length} weak area${weakAreas.length !== 1 ? 's' : ''} to review` },
                    concepts.length > 0      && { emoji: '🔑', text: `${concepts.length} key concept${concepts.length !== 1 ? 's' : ''}` },
                  ].filter(Boolean).map((g, i) => g && (
                    <div key={i} className="flex items-center gap-2.5">
                      <span className="text-base flex-shrink-0">{g.emoji}</span>
                      <p className="text-[12px] font-semibold text-indigo-800">{g.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Processing tip */}
            {!isReady && !isError && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                <RefreshCw className="w-4 h-4 text-indigo-600 mb-2 animate-spin" />
                <p className="text-xs font-bold text-indigo-800 mb-1">Processing your file</p>
                <p className="text-[11px] text-indigo-600 leading-relaxed">
                  Atlas is reading your file with AI. Usually takes 15–30 seconds. You can leave this page — results are saved automatically.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
