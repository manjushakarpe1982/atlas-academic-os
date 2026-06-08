'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Upload, FileText, Mic, BookOpen, Target,
  BarChart2, CheckCircle2, XCircle, RefreshCw,
  AlertCircle, Trash2, Search, FolderOpen, Zap, X,
} from 'lucide-react';
import { api, getToken, API_BASE } from '@/lib/api';

// ── Types ────────────────────────────────────────────────────────────────

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

// ── Constants ────────────────────────────────────────────────────────────

const PIPELINE_STEPS = ['Uploading', 'Classifying', 'Parsing', 'Indexing', 'Ready'];

const CAT_META: Record<FileCategory, { icon: typeof FileText; bg: string; color: string; label: string }> = {
  syllabus:       { icon: FileText,  bg: 'bg-indigo-100',  color: 'text-indigo-600',  label: 'Syllabus'      },
  lecture_audio:  { icon: Mic,       bg: 'bg-emerald-100', color: 'text-emerald-600', label: 'Lecture Audio' },
  lecture_slides: { icon: BarChart2, bg: 'bg-purple-100',  color: 'text-purple-600',  label: 'Slides'        },
  notes:          { icon: BookOpen,  bg: 'bg-amber-100',   color: 'text-amber-600',   label: 'Notes'         },
  assignment:     { icon: FileText,  bg: 'bg-blue-100',    color: 'text-blue-600',    label: 'Assignment'    },
  quiz:           { icon: Target,    bg: 'bg-orange-100',  color: 'text-orange-600',  label: 'Quiz'          },
  graded_work:    { icon: Target,    bg: 'bg-red-100',     color: 'text-red-600',     label: 'Graded Work'   },
  review_sheet:   { icon: FileText,  bg: 'bg-teal-100',    color: 'text-teal-600',    label: 'Review Sheet'  },
  other:          { icon: FileText,  bg: 'bg-gray-100',    color: 'text-gray-500',    label: 'Other'         },
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Pipeline bar ─────────────────────────────────────────────────────────

function PipelineBar({ step, status }: { step: number; status: FileStatus }) {
  return (
    <div className="mt-2.5">
      <div className="flex items-center gap-0.5 mb-1">
        {PIPELINE_STEPS.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
            i < step                                  ? 'bg-indigo-500' :
            i === step && status !== 'error'          ? 'bg-indigo-300 animate-pulse' :
            i === step && status === 'error'          ? 'bg-red-400' :
                                                        'bg-gray-100'
          }`} />
        ))}
      </div>
      <p className="text-[10px] text-gray-400 font-medium">
        {status === 'error' ? '⚠ Error' : status === 'ready' ? '✓ Ready' : `${PIPELINE_STEPS[step]}…`}
      </p>
    </div>
  );
}

// ── File row ─────────────────────────────────────────────────────────────

function FileRow({ file, onDelete }: {
  file:     AtlasFile;
  onDelete: (id: string) => void;
}) {
  const meta       = CAT_META[file.category] ?? CAT_META.other;
  const processing = ['uploading', 'classifying', 'parsing', 'indexing'].includes(file.status);

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
              <button
                onClick={() => onDelete(file.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"
              >
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
            <p className="text-[11px] text-gray-400 mt-1.5">📊 {file.extracted_summary}</p>
          )}

          {processing && <PipelineBar step={file.pipeline_step} status={file.status} />}
        </div>
      </div>
    </div>
  );
}

// ── Drop zone ─────────────────────────────────────────────────────────────

function DropZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const picked = Array.from(e.dataTransfer.files);
    if (picked.length) onFiles(picked);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Upload files — drag and drop or click to browse"
      className={`border-2 border-dashed rounded-2xl p-6 md:p-8 text-center cursor-pointer transition-all ${
        dragging
          ? 'border-indigo-400 bg-indigo-50'
          : 'border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/30'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        accept=".pdf,.docx,.pptx,.mp3,.mp4,.m4a,.wav,.txt,.doc"
        onChange={(e) => {
          const picked = Array.from(e.target.files || []);
          if (picked.length) onFiles(picked);
          e.target.value = '';
        }}
      />
      <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <Upload className="w-6 h-6 text-indigo-600" />
      </div>
      <p className="text-base font-bold text-gray-800 mb-1">Drop files here or click to browse</p>
      <p className="text-sm text-gray-400 mb-4">
        Atlas auto-detects the file type and matches it to the right class
      </p>
      <div className="flex justify-center gap-2 flex-wrap">
        {[
          { ext: 'PDF',  color: 'text-red-500',     bg: 'bg-red-50',     border: 'border-red-100'    },
          { ext: 'DOCX', color: 'text-blue-500',    bg: 'bg-blue-50',    border: 'border-blue-100'   },
          { ext: 'PPTX', color: 'text-orange-500',  bg: 'bg-orange-50',  border: 'border-orange-100' },
          { ext: 'MP3',  color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100'},
          { ext: 'MP4',  color: 'text-violet-500',  bg: 'bg-violet-50',  border: 'border-violet-100' },
          { ext: 'TXT',  color: 'text-gray-500',    bg: 'bg-gray-50',    border: 'border-gray-200'   },
        ].map((t) => (
          <span key={t.ext} className={`inline-flex items-center gap-1.5 ${t.bg} border ${t.border} rounded-lg px-2.5 py-1`}>
            <FileText className={`w-3 h-3 ${t.color}`} />
            <span className={`text-[13px] font-extrabold ${t.color}`}>{t.ext}</span>
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

  // ── Load existing files on mount ────────────────────────────────────────
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

  // ── Upload handler — sends real multipart request ───────────────────────
  const handleFiles = async (picked: File[]) => {
    for (const f of picked) {
      // Add an optimistic "uploading" row immediately so the UI reacts instantly
      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const optimistic: AtlasFile = {
        id:            tempId,
        original_name: f.name,
        category:      'other',
        status:        'uploading',
        size_label:    f.size < 1024 * 1024
                         ? `${(f.size / 1024).toFixed(0)} KB`
                         : `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        pipeline_step: 0,
        created_at:    new Date().toISOString(),
      };
      setFiles((prev) => [optimistic, ...prev]);

      try {
        const formData = new FormData();
        formData.append('file', f);

        const token = getToken();
        const res = await fetch(`${API_BASE}/api/files/upload`, {
          method:  'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body:    formData,
        });

        const data = await res.json();

        if (!res.ok) {
          // Replace optimistic row with an error row
          setFiles((prev) => prev.map((row) =>
            row.id === tempId
              ? { ...optimistic, status: 'error', error_message: data.detail || 'Upload failed.' }
              : row
          ));
          continue;
        }

        // Replace optimistic row with the real record from the server
        setFiles((prev) => prev.map((row) =>
          row.id === tempId ? (data.file as AtlasFile) : row
        ));
      } catch {
        setFiles((prev) => prev.map((row) =>
          row.id === tempId
            ? { ...optimistic, status: 'error', error_message: 'Network error. Check your connection.' }
            : row
        ));
      }
    }
  };

  // ── Delete handler ───────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    // Optimistically remove from UI
    setFiles((prev) => prev.filter((f) => f.id !== id));
    try {
      await api(`/api/files/${id}`, { method: 'DELETE' });
    } catch {
      // If delete failed, reload to restore correct state
      loadFiles();
    }
  };

  // ── Filter ───────────────────────────────────────────────────────────────
  const filtered = files.filter((f) => {
    if (search && !f.original_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (view === 'processing' && !['uploading', 'classifying', 'parsing', 'indexing'].includes(f.status)) return false;
    if (view === 'ready'      && f.status !== 'ready')  return false;
    if (view === 'error'      && f.status !== 'error')  return false;
    return true;
  });

  const counts = {
    all:        files.length,
    processing: files.filter((f) => ['uploading', 'classifying', 'parsing', 'indexing'].includes(f.status)).length,
    ready:      files.filter((f) => f.status === 'ready').length,
    error:      files.filter((f) => f.status === 'error').length,
  };

  // ── Empty state (first-time user) ────────────────────────────────────────
  if (!loading && files.length === 0) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#F5F5FB] p-4 md:p-8">
          <div className="max-w-[920px] mx-auto">
            <div className="text-center mb-7">
              <h1 className="text-3xl md:text-[34px] font-extrabold text-[#14142B] leading-tight mb-2">
                Upload your course materials
              </h1>
              <p className="text-sm text-[#6B6A8A] max-w-xl mx-auto leading-relaxed">
                Atlas will read your syllabus, slides, lectures, and notes — then build
                your personalised study plan based on what your professor actually emphasises.
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
              <p className="text-[16px] font-extrabold text-[#737281] uppercase tracking-widest mb-3">
                What you can upload
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {[
                  { icon: FileText,   color: 'bg-[#534AB7]',   label: 'Syllabus',           desc: 'The most important file — topics, dates, grading weights.', tag: 'Start here' },
                  { icon: BarChart2,  color: 'bg-blue-500',    label: 'Lecture slides',     desc: 'PPT, PDF — Atlas extracts key topics and emphasis.' },
                  { icon: Mic,        color: 'bg-rose-500',    label: 'Lecture recordings', desc: 'MP3, MP4, M4A — auto-transcribed with timestamps.' },
                  { icon: BookOpen,   color: 'bg-emerald-500', label: 'Course notes',       desc: 'Your own notes or shared notes from classmates.' },
                  { icon: Target,     color: 'bg-orange-500',  label: 'Past quizzes/exams', desc: 'Helps Atlas predict likely future questions.' },
                  { icon: BarChart2,  color: 'bg-amber-500',   label: 'Grade reports',      desc: 'See where you stand and project your final grade.' },
                ].map((c) => (
                  <div key={c.label} className="relative bg-white border border-[#ECE9FF] rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#534AB7]/30 transition-all">
                    {c.tag && (
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-wider">
                        {c.tag}
                      </span>
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

            <p className="text-center text-[13px] text-[#747485] mt-6">
              Supports PDF, DOCX, PPT, TXT, MP3, MP4, M4A, JPG, PNG · Up to 500 MB per file
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-7">
              {[
                { icon: CheckCircle2, bg: 'bg-emerald-100', color: 'text-emerald-600', title: 'Your files are private',     desc: 'Encrypted, never shared, never used to train AI.' },
                { icon: Zap,          bg: 'bg-blue-100',    color: 'text-blue-600',    title: 'Fast processing',            desc: 'Most files parse in under 60 seconds.' },
                { icon: FileText,     bg: 'bg-violet-100',  color: 'text-violet-600',  title: 'FERPA & GDPR compliant',     desc: 'Delete your data any time.' },
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

  // ── File manager view ────────────────────────────────────────────────────
  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-[1100px] mx-auto">

        <div className="flex items-center justify-between mb-4 md:mb-5">
          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-gray-900">Study Materials</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {loading
                ? 'Loading…'
                : `${counts.ready} files ready · ${counts.processing > 0 ? `${counts.processing} processing` : 'all up to date'}`}
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

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-white border border-gray-100 rounded-xl p-1 gap-0.5 overflow-x-auto scrollbar-none">
                {(['all', 'processing', 'ready', 'error'] as const).map((v) => (
                  <button key={v} onClick={() => setView(v)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap flex-shrink-0 ${
                      view === v ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}>
                    {v}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                      view === v ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>{counts[v]}</span>
                  </button>
                ))}
              </div>

              <div className="relative flex-1 min-w-[140px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search files…"
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-700 outline-none focus:border-indigo-500 bg-white"
                />
              </div>
            </div>

            {/* File list */}
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
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
                <p className="text-xs mt-1">Try adjusting your filters or upload new files</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((f) => (
                  <FileRow key={f.id} file={f} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-[210px] lg:flex-shrink-0 space-y-3">

            {/* Stats */}
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

            {/* Pro tip */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <Zap className="w-4 h-4 text-indigo-600 mb-2" />
              <p className="text-xs font-bold text-indigo-800 mb-1">Pro tip</p>
              <p className="text-[11px] text-indigo-600 font-light leading-relaxed">
                Upload lecture audio right after class — Atlas transcribes and detects what your professor emphasised.
              </p>
            </div>

            {/* Accepted formats */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Accepted formats</p>
              <div className="space-y-1.5">
                {[
                  { label: 'Syllabi',       fmt: 'PDF, DOCX'     },
                  { label: 'Lecture audio', fmt: 'MP3, MP4, M4A' },
                  { label: 'Slides',        fmt: 'PPTX, PDF'     },
                  { label: 'Notes',         fmt: 'DOCX, TXT'     },
                  { label: 'Assignments',   fmt: 'PDF, DOCX'     },
                ].map((t) => (
                  <div key={t.label} className="flex items-center justify-between">
                    <p className="text-[11px] text-gray-600">{t.label}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{t.fmt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
