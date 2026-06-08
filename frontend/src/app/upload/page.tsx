'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Upload, FileText, Mic, BookOpen, Target, BarChart2,
  CheckCircle2, XCircle, RefreshCw, AlertCircle, Trash2,
  Search, FolderOpen, Zap, X, ChevronDown, ChevronUp,
  Calendar, GraduationCap, Brain, Tag, Clock,
} from 'lucide-react';
import { api, getToken, API_BASE } from '@/lib/api';

// ── Types ─────────────────────────────────────────────────────────────────

type FileStatus   = 'uploading' | 'classifying' | 'parsing' | 'indexing' | 'ready' | 'error';
type FileCategory = 'syllabus' | 'lecture_audio' | 'lecture_slides' | 'notes' |
                    'assignment' | 'quiz' | 'graded_work' | 'review_sheet' | 'other';

interface AtlasFile {
  id:                string;
  original_name:     string;
  category:          FileCategory;
  status:            FileStatus;
  size_label:        string;
  pipeline_step:     number;
  error_message?:    string;
  extracted_summary?: string;
  created_at:        string;
}

interface ParsedResult {
  file_id:  string;
  category: string;
  status:   string;
  result:   Record<string, unknown> | null;
  summary:  string | null;
  error:    string | null;
}

// ── Constants ─────────────────────────────────────────────────────────────

const PIPELINE_STEPS = ['Uploading', 'Classifying', 'Parsing', 'Indexing', 'Ready'];

const CAT_META: Record<FileCategory, { icon: typeof FileText; bg: string; color: string; label: string }> = {
  syllabus:       { icon: FileText,  bg: 'bg-indigo-100',  color: 'text-indigo-600',  label: 'Syllabus'       },
  lecture_audio:  { icon: Mic,       bg: 'bg-emerald-100', color: 'text-emerald-600', label: 'Lecture Audio'  },
  lecture_slides: { icon: BarChart2, bg: 'bg-purple-100',  color: 'text-purple-600',  label: 'Slides'         },
  notes:          { icon: BookOpen,  bg: 'bg-amber-100',   color: 'text-amber-600',   label: 'Notes'          },
  assignment:     { icon: FileText,  bg: 'bg-blue-100',    color: 'text-blue-600',    label: 'Assignment'     },
  quiz:           { icon: Target,    bg: 'bg-orange-100',  color: 'text-orange-600',  label: 'Quiz'           },
  graded_work:    { icon: Target,    bg: 'bg-red-100',     color: 'text-red-600',     label: 'Graded Work'    },
  review_sheet:   { icon: FileText,  bg: 'bg-teal-100',    color: 'text-teal-600',    label: 'Review Sheet'   },
  other:          { icon: FileText,  bg: 'bg-gray-100',    color: 'text-gray-500',    label: 'Other'          },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Pipeline bar ──────────────────────────────────────────────────────────

function PipelineBar({ step, status }: { step: number; status: FileStatus }) {
  const labels = ['Uploading', 'Classifying', 'Parsing with AI', 'Indexing', 'Ready'];
  return (
    <div className="mt-2.5">
      <div className="flex items-center gap-0.5 mb-1">
        {labels.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
            i < step                        ? 'bg-indigo-500' :
            i === step && status !== 'error' ? 'bg-indigo-300 animate-pulse' :
            i === step && status === 'error' ? 'bg-red-400' : 'bg-gray-100'
          }`} />
        ))}
      </div>
      <p className="text-[10px] text-gray-400 font-medium">
        {status === 'error'  ? '⚠ Error during processing' :
         status === 'ready'  ? '✓ AI analysis complete' :
         `${labels[step]}…`}
      </p>
    </div>
  );
}

// ── Parsed result panel ───────────────────────────────────────────────────

function SyllabusResult({ r }: { r: Record<string, unknown> }) {
  const weights    = (r.grade_weights    as Array<Record<string,unknown>> | undefined) || [];
  const assessments= (r.assessments      as Array<Record<string,unknown>> | undefined) || [];
  const topics     = (r.topics           as Array<Record<string,unknown>> | undefined) || [];
  const dated      = assessments.filter((a) => a.due_date);

  return (
    <div className="mt-3 space-y-3">
      {/* Header fields */}
      {!!(r.course_name || r.instructor || r.credit_hours) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {!!r.course_name && (
            <div className="bg-indigo-50 rounded-xl px-3 py-2">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide mb-0.5">Course</p>
              <p className="text-xs font-semibold text-indigo-900">{String(r.course_name)}</p>
            </div>
          )}
          {!!r.instructor && (
            <div className="bg-indigo-50 rounded-xl px-3 py-2">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide mb-0.5">Instructor</p>
              <p className="text-xs font-semibold text-indigo-900">{String(r.instructor)}</p>
            </div>
          )}
          {!!r.credit_hours && (
            <div className="bg-indigo-50 rounded-xl px-3 py-2">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide mb-0.5">Credits</p>
              <p className="text-xs font-semibold text-indigo-900">{String(r.credit_hours)}</p>
            </div>
          )}
        </div>
      )}

      {/* Grade weights */}
      {weights.length > 0 && (
        <div>
          <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Tag className="w-3 h-3" /> Grade weights
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {weights.map((w, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl px-3 py-2 text-center">
                <p className="text-sm font-extrabold text-indigo-600">{String(w.weight_pct)}%</p>
                <p className="text-[10px] text-gray-500 mt-0.5 truncate">{String(w.category)}</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  w.confidence === 'high' ? 'bg-emerald-100 text-emerald-700' :
                  w.confidence === 'low'  ? 'bg-red-100 text-red-600' :
                  'bg-amber-100 text-amber-700'
                }`}>{String(w.confidence)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deadlines */}
      {dated.length > 0 && (
        <div>
          <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calendar className="w-3 h-3" /> {dated.length} deadline{dated.length !== 1 ? 's' : ''} found
          </p>
          <div className="space-y-1.5">
            {dated.slice(0, 6).map((a, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                <p className="text-xs font-semibold text-gray-800 flex-1 truncate">{String(a.title)}</p>
                {!!a.category && <span className="text-[10px] text-gray-400">{String(a.category)}</span>}
                {!!a.due_date && <span className="text-[10px] font-bold text-indigo-600 flex-shrink-0">{String(a.due_date)}</span>}
              </div>
            ))}
            {dated.length > 6 && (
              <p className="text-[11px] text-gray-400 text-center">+{dated.length - 6} more deadlines</p>
            )}
          </div>
        </div>
      )}

      {/* Topics */}
      {topics.length > 0 && (
        <div>
          <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Brain className="w-3 h-3" /> {topics.length} topics
          </p>
          <div className="flex flex-wrap gap-1.5">
            {topics.slice(0, 12).map((t, i) => (
              <span key={i} className="text-[11px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-medium">
                {String(t.title)}
              </span>
            ))}
            {topics.length > 12 && (
              <span className="text-[11px] text-gray-400 px-2 py-1">+{topics.length - 12} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotesResult({ r }: { r: Record<string, unknown> }) {
  const topics   = (r.main_topics           as Array<Record<string,unknown>> | undefined) || [];
  const examTopics = (r.potential_exam_topics as string[] | undefined) || [];
  const concepts = (r.key_concepts          as string[] | undefined) || [];

  return (
    <div className="mt-3 space-y-3">
      {!!r.summary && (
        <div className="bg-amber-50 rounded-xl px-3 py-2.5">
          <p className="text-xs text-amber-800 leading-relaxed">{String(r.summary)}</p>
        </div>
      )}
      {examTopics.length > 0 && (
        <div>
          <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">Potential exam topics</p>
          <div className="flex flex-wrap gap-1.5">
            {examTopics.map((t, i) => (
              <span key={i} className="text-[11px] bg-red-50 border border-red-100 text-red-700 px-2.5 py-1 rounded-lg font-semibold">{t}</span>
            ))}
          </div>
        </div>
      )}
      {topics.length > 0 && (
        <div>
          <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">{topics.length} topics covered</p>
          <div className="space-y-1.5">
            {topics.slice(0, 4).map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-xl px-3 py-2">
                <p className="text-xs font-bold text-gray-800">{String(t.title)}</p>
                {!!t.summary && <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{String(t.summary)}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      {concepts.length > 0 && (
        <div>
          <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">Key concepts</p>
          <div className="flex flex-wrap gap-1.5">
            {concepts.map((c, i) => (
              <span key={i} className="text-[11px] bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg font-medium">{c}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuizResult({ r }: { r: Record<string, unknown> }) {
  const weakAreas   = (r.weak_areas    as string[] | undefined) || [];
  const topicsTested = (r.topics_tested as string[] | undefined) || [];

  return (
    <div className="mt-3 space-y-3">
      {(r.score !== null && r.score !== undefined) && (
        <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-4 py-3">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-indigo-600">{String(r.score)}<span className="text-sm text-gray-400">/{String(r.max_score)}</span></p>
            {!!r.percentage && <p className="text-xs text-gray-500 mt-0.5">{String(r.percentage)}%</p>}
          </div>
          {!!r.needs_confirmation && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700 font-semibold">Please confirm this score</p>
            </div>
          )}
        </div>
      )}
      {weakAreas.length > 0 && (
        <div>
          <p className="text-[11px] font-extrabold text-red-500 uppercase tracking-wider mb-2">Weak areas to review</p>
          <div className="flex flex-wrap gap-1.5">
            {weakAreas.map((w, i) => (
              <span key={i} className="text-[11px] bg-red-50 border border-red-100 text-red-700 px-2.5 py-1 rounded-lg font-semibold">{w}</span>
            ))}
          </div>
        </div>
      )}
      {topicsTested.length > 0 && (
        <div>
          <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">Topics tested</p>
          <div className="flex flex-wrap gap-1.5">
            {topicsTested.map((t, i) => (
              <span key={i} className="text-[11px] bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg">{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GenericResult({ r }: { r: Record<string, unknown> }) {
  const keyPoints = (r.key_points       as string[] | undefined) || [];
  const topics    = (r.relevant_topics  as string[] | undefined) || [];
  return (
    <div className="mt-3 space-y-3">
      {!!r.summary && (
        <div className="bg-gray-50 rounded-xl px-3 py-2.5">
          <p className="text-xs text-gray-700 leading-relaxed">{String(r.summary)}</p>
        </div>
      )}
      {keyPoints.length > 0 && (
        <div>
          <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">Key points</p>
          <ul className="space-y-1">
            {keyPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-1.5" />{p}
              </li>
            ))}
          </ul>
        </div>
      )}
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {topics.map((t, i) => (
            <span key={i} className="text-[11px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function ParsedResultPanel({ file }: { file: AtlasFile }) {
  const [open,    setOpen]    = useState(false);
  const [result,  setResult]  = useState<ParsedResult | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchResult = async () => {
    if (result || loading) return;
    setLoading(true);
    try {
      const data = await api<ParsedResult>(`/api/files/${file.id}/results`);
      setResult(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const handleToggle = () => {
    if (!open) fetchResult();
    setOpen(!open);
  };

  const cat = file.category;
  const isSyllabus = cat === 'syllabus';
  const isNotes    = ['lecture_slides','notes','review_sheet','announcement'].includes(cat);
  const isQuiz     = ['quiz','exam','graded_work','assignment'].includes(cat);

  return (
    <div className="mt-2">
      <button onClick={handleToggle}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {open ? 'Hide AI results' : 'View AI results'}
      </button>

      {open && (
        <div className="mt-3 bg-[#F8F7FF] border border-[#E8E5FD] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <p className="text-xs font-extrabold text-indigo-800">AI extraction results</p>
            {result?.error && (
              <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-auto">
                Partial — {result.error.slice(0, 60)}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center gap-2 py-4">
              <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
              <p className="text-xs text-gray-500">Loading results…</p>
            </div>
          ) : !result?.result ? (
            <p className="text-xs text-gray-500 py-2">
              {file.status === 'ready' ? 'No structured data extracted.' : 'Processing not complete yet.'}
            </p>
          ) : (
            <>
              {isSyllabus && <SyllabusResult r={result.result} />}
              {isNotes    && <NotesResult    r={result.result} />}
              {isQuiz     && <QuizResult     r={result.result} />}
              {!isSyllabus && !isNotes && !isQuiz && <GenericResult r={result.result} />}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── File row ──────────────────────────────────────────────────────────────

function FileRow({ file, onDelete, onRefresh }: {
  file:      AtlasFile;
  onDelete:  (id: string) => void;
  onRefresh: (id: string) => void;
}) {
  const meta       = CAT_META[file.category] ?? CAT_META.other;
  const processing = ['uploading', 'classifying', 'parsing', 'indexing'].includes(file.status);

  // Auto-poll while processing
  useEffect(() => {
    if (!processing || file.id.startsWith('temp-')) return;
    const interval = setInterval(() => onRefresh(file.id), 3000);
    return () => clearInterval(interval);
  }, [processing, file.id, onRefresh]);

  return (
    <div className={`bg-white border rounded-2xl p-3.5 md:p-4 transition-all hover:shadow-sm ${
      file.status === 'error' ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <meta.icon className={`w-4 h-4 ${meta.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{file.original_name}</p>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${meta.bg} ${meta.color}`}>
                  {meta.label}
                </span>
                <span className="text-[10px] text-gray-300 hidden sm:inline">·</span>
                <span className="text-[10px] text-gray-400 hidden sm:inline">{file.size_label}</span>
                <span className="text-[10px] text-gray-300 hidden sm:inline">·</span>
                <span className="text-[10px] text-gray-400 hidden sm:inline">{fmtDate(file.created_at)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {file.status === 'ready' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {file.status === 'error' && <XCircle      className="w-4 h-4 text-red-500" />}
              {processing              && <RefreshCw    className="w-3.5 h-3.5 text-indigo-400 animate-spin" />}
              <button onClick={() => onDelete(file.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {file.status === 'error' && file.error_message && (
            <div className="flex items-start gap-1.5 mt-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-red-600 font-medium">{file.error_message}</p>
            </div>
          )}

          {file.status === 'ready' && file.extracted_summary && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              <p className="text-[11px] text-gray-500">{file.extracted_summary}</p>
            </div>
          )}

          {processing && <PipelineBar step={file.pipeline_step} status={file.status} />}

          {/* Show AI results expand section only when ready */}
          {file.status === 'ready' && <ParsedResultPanel file={file} />}
        </div>
      </div>
    </div>
  );
}

// ── Drop zone ─────────────────────────────────────────────────────────────

function DropZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = Array.from(e.dataTransfer.files); if (f.length) onFiles(f); }}
      onClick={() => inputRef.current?.click()}
      role="button" tabIndex={0}
      className={`border-2 border-dashed rounded-2xl p-6 md:p-8 text-center cursor-pointer transition-all ${
        dragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/30'
      }`}>
      <input ref={inputRef} type="file" multiple className="hidden"
        accept=".pdf,.docx,.pptx,.mp3,.mp4,.m4a,.wav,.txt,.doc"
        onChange={(e) => { const f = Array.from(e.target.files || []); if (f.length) onFiles(f); e.target.value = ''; }} />
      <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <Upload className="w-6 h-6 text-indigo-600" />
      </div>
      <p className="text-base font-bold text-gray-800 mb-1">Drop files here or click to browse</p>
      <p className="text-sm text-gray-400 mb-4">Atlas reads your files with AI and extracts grades, deadlines, and topics</p>
      <div className="flex justify-center gap-2 flex-wrap">
        {[
          { ext: 'PDF',  c: 'text-red-500',    bg: 'bg-red-50',    b: 'border-red-100'    },
          { ext: 'DOCX', c: 'text-blue-500',   bg: 'bg-blue-50',   b: 'border-blue-100'   },
          { ext: 'PPTX', c: 'text-orange-500', bg: 'bg-orange-50', b: 'border-orange-100' },
          { ext: 'MP3',  c: 'text-emerald-500',bg: 'bg-emerald-50',b: 'border-emerald-100'},
          { ext: 'MP4',  c: 'text-violet-500', bg: 'bg-violet-50', b: 'border-violet-100' },
          { ext: 'TXT',  c: 'text-gray-500',   bg: 'bg-gray-50',   b: 'border-gray-200'   },
        ].map((t) => (
          <span key={t.ext} className={`inline-flex items-center gap-1.5 ${t.bg} border ${t.b} rounded-lg px-2.5 py-1`}>
            <FileText className={`w-3 h-3 ${t.c}`} />
            <span className={`text-[13px] font-extrabold ${t.c}`}>{t.ext}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────

export default function UploadPage() {
  const [files,   setFiles]   = useState<AtlasFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [view,    setView]    = useState<'all' | 'processing' | 'ready' | 'error'>('all');
  const [error,   setError]   = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    try {
      const res = await api<{ files: AtlasFile[]; total: number }>('/api/files');
      setFiles(res.files);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not load files.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  // Refresh a single file record (called by polling in FileRow)
  const refreshFile = useCallback(async (fileId: string) => {
    try {
      const updated = await api<AtlasFile>(`/api/files/${fileId}`);
      setFiles((prev) => prev.map((f) => f.id === fileId ? updated : f));
    } catch { /* ignore */ }
  }, []);

  const handleFiles = async (picked: File[]) => {
    for (const f of picked) {
      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const optimistic: AtlasFile = {
        id: tempId, original_name: f.name, category: 'other', status: 'uploading',
        size_label: f.size < 1024*1024 ? `${(f.size/1024).toFixed(0)} KB` : `${(f.size/(1024*1024)).toFixed(1)} MB`,
        pipeline_step: 0, created_at: new Date().toISOString(),
      };
      setFiles((prev) => [optimistic, ...prev]);

      try {
        const formData = new FormData();
        formData.append('file', f);
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/files/upload`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          setFiles((prev) => prev.map((row) =>
            row.id === tempId ? { ...optimistic, status: 'error', error_message: data.detail || 'Upload failed.' } : row
          ));
          continue;
        }
        setFiles((prev) => prev.map((row) => row.id === tempId ? (data.file as AtlasFile) : row));
      } catch {
        setFiles((prev) => prev.map((row) =>
          row.id === tempId ? { ...optimistic, status: 'error', error_message: 'Network error.' } : row
        ));
      }
    }
  };

  const handleDelete = async (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    try { await api(`/api/files/${id}`, { method: 'DELETE' }); }
    catch { loadFiles(); }
  };

  const filtered = files.filter((f) => {
    if (search && !f.original_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (view === 'processing' && !['uploading','classifying','parsing','indexing'].includes(f.status)) return false;
    if (view === 'ready'      && f.status !== 'ready')  return false;
    if (view === 'error'      && f.status !== 'error')  return false;
    return true;
  });

  const counts = {
    all:        files.length,
    processing: files.filter((f) => ['uploading','classifying','parsing','indexing'].includes(f.status)).length,
    ready:      files.filter((f) => f.status === 'ready').length,
    error:      files.filter((f) => f.status === 'error').length,
  };

  if (!loading && files.length === 0) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#F5F5FB] p-4 md:p-8">
          <div className="max-w-[920px] mx-auto">
            <div className="text-center mb-7">
              <h1 className="text-3xl md:text-[34px] font-extrabold text-[#14142B] leading-tight mb-2">Upload your course materials</h1>
              <p className="text-sm text-[#6B6A8A] max-w-xl mx-auto leading-relaxed">
                Atlas reads your files with AI — extracting grades, deadlines, and topics automatically.
              </p>
            </div>
            <DropZone onFiles={handleFiles} />
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
                <button onClick={() => setError(null)} className="ml-auto"><X className="w-4 h-4 text-red-400" /></button>
              </div>
            )}
            <div className="mt-9">
              <p className="text-[16px] font-extrabold text-[#737281] uppercase tracking-widest mb-3">What Atlas extracts</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {[
                  { icon: GraduationCap, color: 'bg-[#534AB7]',   label: 'Syllabus',           desc: 'Course name, instructor, grade weights, deadlines, topics.', tag: 'Start here' },
                  { icon: BarChart2,     color: 'bg-blue-500',    label: 'Lecture slides',     desc: 'Topics covered, potential exam content, key concepts.' },
                  { icon: Target,        color: 'bg-orange-500',  label: 'Past quizzes/exams', desc: 'Your score, weak areas, topics tested.' },
                  { icon: BookOpen,      color: 'bg-emerald-500', label: 'Course notes',       desc: 'Main topics, key terms, potential exam material.' },
                  { icon: Tag,           color: 'bg-red-500',     label: 'Graded work',        desc: 'Scores, feedback, topics where you need more practice.' },
                  { icon: FileText,      color: 'bg-amber-500',   label: 'Review sheets',      desc: 'Topics on review, exam preparation material.' },
                ].map((c) => (
                  <div key={c.label} className="relative bg-white border border-[#ECE9FF] rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#534AB7]/30 transition-all">
                    {c.tag && (
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-wider">{c.tag}</span>
                    )}
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                        <c.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-[16px] font-extrabold text-[#1A1A2E] leading-tight">{c.label}</p>
                    </div>
                    <p className="text-[13px] text-[#6B6A8A] leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-7">
              {[
                { icon: CheckCircle2, bg: 'bg-emerald-100', color: 'text-emerald-600', title: 'Private & encrypted',   desc: 'Your files are never shared or used to train AI.' },
                { icon: Clock,        bg: 'bg-blue-100',    color: 'text-blue-600',    title: 'Results in ~15 seconds', desc: 'AI analysis runs in the background immediately.' },
                { icon: Zap,          bg: 'bg-violet-100',  color: 'text-violet-600',  title: 'One-tap to fix errors', desc: 'Every extracted field is editable after parsing.' },
              ].map((b) => (
                <div key={b.title} className="bg-white border border-[#ECE9FF] rounded-xl px-4 py-3.5 flex items-start gap-3">
                  <div className={`flex-shrink-0 w-9 h-9 rounded-lg ${b.bg} flex items-center justify-center`}>
                    <b.icon className={`w-4 h-4 ${b.color}`} />
                  </div>
                  <div>
                    <p className="text-[14px] font-extrabold text-[#1A1A2E] mb-1">{b.title}</p>
                    <p className="text-[13px] text-[#6B6A8A] leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-gray-900">Study Materials</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {loading ? 'Loading…' : `${counts.ready} ready · ${counts.processing > 0 ? `${counts.processing} processing` : 'all up to date'}`}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto"><X className="w-4 h-4 text-red-400" /></button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 min-w-0 space-y-4">
            <DropZone onFiles={handleFiles} />

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-white border border-gray-100 rounded-xl p-1 gap-0.5 overflow-x-auto scrollbar-none">
                {(['all', 'processing', 'ready', 'error'] as const).map((v) => (
                  <button key={v} onClick={() => setView(v)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap flex-shrink-0 ${
                      view === v ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}>
                    {v}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${view === v ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {counts[v]}
                    </span>
                  </button>
                ))}
              </div>
              <div className="relative flex-1 min-w-[140px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files…"
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-700 outline-none focus:border-indigo-500 bg-white" />
              </div>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1,2,3].map((i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                        <div className="h-2 bg-gray-100 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FolderOpen className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                <p className="font-semibold text-sm">No files found</p>
                <p className="text-xs mt-1">Try adjusting filters or upload new files</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((f) => (
                  <FileRow key={f.id} file={f} onDelete={handleDelete} onRefresh={refreshFile} />
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-[210px] lg:flex-shrink-0 space-y-3">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Files</p>
              <div className="space-y-2">
                {[
                  { label: 'Total',      value: counts.all,        color: 'text-gray-700'   },
                  { label: 'Ready',      value: counts.ready,      color: 'text-emerald-600'},
                  { label: 'Processing', value: counts.processing, color: 'text-indigo-600' },
                  { label: 'Errors',     value: counts.error,      color: 'text-red-500'    },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <p className="text-[11px] text-gray-500">{s.label}</p>
                    <p className={`text-[13px] font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <Brain className="w-4 h-4 text-indigo-600 mb-2" />
              <p className="text-xs font-bold text-indigo-800 mb-1">AI reads every file</p>
              <p className="text-[11px] text-indigo-600 font-light leading-relaxed">
                Syllabus → grade weights + deadlines. Quiz → score + weak areas. Notes → exam topics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
