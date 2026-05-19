'use client';

import { useState, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Upload, FileText, Mic, BookOpen, Target,
  BarChart2, CheckCircle2, XCircle, Clock,
  AlertCircle, Trash2, Eye, RefreshCw,
  ChevronDown, Filter, Search, FolderOpen,
  Plus, X, Zap,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────── */
type FileStatus = 'uploading' | 'classifying' | 'parsing' | 'indexing' | 'ready' | 'error';
type FileCategory = 'syllabus' | 'lecture_audio' | 'lecture_slides' | 'notes' | 'assignment' | 'quiz' | 'graded_work' | 'review_sheet' | 'other';

interface AtlasFile {
  id: number;
  name: string;
  category: FileCategory;
  class: string;
  status: FileStatus;
  size: string;
  uploadedAt: string;
  pipelineStep: number; // 0-4
  errorMsg?: string;
  extracted?: string;
}

/* ─── Mock data ──────────────────────────────────────────────── */
const INITIAL_FILES: AtlasFile[] = [
  { id:1,  name:'BIO101_Syllabus.pdf',          category:'syllabus',       class:'Biology 101',    status:'ready',      size:'180 KB', uploadedAt:'Nov 10', pipelineStep:4, extracted:'Deadlines: 14 · Grade weights: 4 categories · Prof: Dr. Smith' },
  { id:2,  name:'Lecture 10 — Krebs Cycle.mp3', category:'lecture_audio',  class:'Biology 101',    status:'ready',      size:'48 min', uploadedAt:'Nov 12', pipelineStep:4, extracted:'Transcript: 8,400 words · Emphasis signals: 6 found' },
  { id:3,  name:'Exam 2 Review Sheet.pdf',       category:'review_sheet',   class:'Biology 101',    status:'ready',      size:'320 KB', uploadedAt:'Nov 14', pipelineStep:4, extracted:'Topics covered: 8 · Key terms: 24' },
  { id:4,  name:'Quiz 3 — Graded.pdf',           category:'graded_work',    class:'Biology 101',    status:'ready',      size:'85 KB',  uploadedAt:'Oct 28', pipelineStep:4, extracted:'Score: 82% · Weak areas: enzyme kinetics' },
  { id:5,  name:'Lecture 11 Slides.pptx',        category:'lecture_slides', class:'Biology 101',    status:'ready',      size:'2.1 MB', uploadedAt:'Nov 13', pipelineStep:4, extracted:'Slides: 32 · Topics: mitosis, cell division' },
  { id:6,  name:'Lab Report 2.docx',             category:'assignment',     class:'Biology 101',    status:'parsing',    size:'220 KB', uploadedAt:'Nov 15', pipelineStep:2 },
  { id:7,  name:'STAT201_Syllabus.pdf',           category:'syllabus',       class:'Statistics 201', status:'ready',      size:'145 KB', uploadedAt:'Sep 2',  pipelineStep:4, extracted:'Deadlines: 11 · Grade weights: 3 categories' },
  { id:8,  name:'Problem Set 3 — Solutions.pdf', category:'graded_work',    class:'Statistics 201', status:'ready',      size:'560 KB', uploadedAt:'Nov 5',  pipelineStep:4, extracted:'Score: 92% · All problems correct' },
  { id:9,  name:'Lecture Recording Nov 12.mp4',  category:'lecture_audio',  class:'English 110',    status:'indexing',   size:'62 min', uploadedAt:'Nov 12', pipelineStep:3 },
  { id:10, name:'Essay 1 Feedback.pdf',           category:'graded_work',    class:'English 110',    status:'ready',      size:'95 KB',  uploadedAt:'Oct 20', pipelineStep:4, extracted:'Grade: B+ · Comments: 5 feedback notes' },
  { id:11, name:'Midterm Notes.docx',             category:'notes',          class:'History 105',    status:'ready',      size:'340 KB', uploadedAt:'Oct 15', pipelineStep:4, extracted:'Topics: 18 · Pages: 12' },
  { id:12, name:'Chem Lab Manual.pdf',            category:'notes',          class:'Chemistry 201',  status:'error',      size:'4.2 MB', uploadedAt:'Nov 8',  pipelineStep:1, errorMsg:'File too large — max 5 MB. Try compressing it.' },
];

const PIPELINE_STEPS = ['Uploading', 'Classifying', 'Parsing', 'Indexing', 'Ready'];

const CAT_META: Record<FileCategory, { icon: typeof FileText; bg: string; color: string; label: string }> = {
  syllabus:       { icon: FileText,  bg:'bg-indigo-100', color:'text-indigo-600', label:'Syllabus'        },
  lecture_audio:  { icon: Mic,       bg:'bg-green-100',  color:'text-green-600',  label:'Lecture Audio'   },
  lecture_slides: { icon: BarChart2, bg:'bg-purple-100', color:'text-purple-600', label:'Lecture Slides'  },
  notes:          { icon: BookOpen,  bg:'bg-yellow-100', color:'text-yellow-600', label:'Notes'           },
  assignment:     { icon: FileText,  bg:'bg-blue-100',   color:'text-blue-600',   label:'Assignment'      },
  quiz:           { icon: Target,    bg:'bg-orange-100', color:'text-orange-600', label:'Quiz'            },
  graded_work:    { icon: Target,    bg:'bg-red-100',    color:'text-red-600',    label:'Graded Work'     },
  review_sheet:   { icon: FileText,  bg:'bg-teal-100',   color:'text-teal-600',   label:'Review Sheet'    },
  other:          { icon: FileText,  bg:'bg-gray-100',   color:'text-gray-500',   label:'Other'           },
};

const CLASSES = ['All classes','Biology 101','Statistics 201','English 110','History 105','Chemistry 201'];

/* ─── Pipeline progress bar ──────────────────────────────────── */
function PipelineBar({ step, status }: { step: number; status: FileStatus }) {
  return (
    <div className="mt-2">
      <div className="flex items-center gap-1 mb-1">
        {PIPELINE_STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div className={`h-1.5 flex-1 rounded-full transition-all ${
              i < step ? 'bg-indigo-500' :
              i === step && status !== 'error' ? 'bg-indigo-300 animate-pulse' :
              i === step && status === 'error' ? 'bg-red-400' :
              'bg-gray-100'
            }`} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-gray-400 font-medium">
          {status === 'error' ? '⚠ Error' : status === 'ready' ? '✓ Ready' : `${PIPELINE_STEPS[step]}…`}
        </p>
        <p className="text-[10px] text-gray-300">{PIPELINE_STEPS[step]}</p>
      </div>
    </div>
  );
}

/* ─── File row ───────────────────────────────────────────────── */
function FileRow({ file, onDelete, onRetry }: {
  file: AtlasFile;
  onDelete: (id: number) => void;
  onRetry: (id: number) => void;
}) {
  const meta = CAT_META[file.category];

  return (
    <div className={`bg-white border rounded-2xl p-4 transition-all hover:shadow-sm ${
      file.status === 'error' ? 'border-red-200' : 'border-gray-100'
    }`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <meta.icon className={`w-4 h-4 ${meta.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{file.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
                  {meta.label}
                </span>
                <span className="text-[10px] text-gray-400">{file.class}</span>
                <span className="text-[10px] text-gray-300">·</span>
                <span className="text-[10px] text-gray-400">{file.size}</span>
                <span className="text-[10px] text-gray-300">·</span>
                <span className="text-[10px] text-gray-400">{file.uploadedAt}</span>
              </div>
            </div>

            {/* Status + actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {file.status === 'ready' && (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
              {file.status === 'error' && (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              {['parsing','indexing','classifying','uploading'].includes(file.status) && (
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              )}
              {file.status === 'ready' && (
                <button className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all">
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}
              {file.status === 'error' && (
                <button onClick={() => onRetry(file.id)}
                  className="text-[10px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded-lg transition-all">
                  Retry
                </button>
              )}
              <button onClick={() => onDelete(file.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Error message */}
          {file.status === 'error' && file.errorMsg && (
            <div className="flex items-start gap-1.5 mt-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-red-600 font-medium">{file.errorMsg}</p>
            </div>
          )}

          {/* Extracted data (ready files) */}
          {file.status === 'ready' && file.extracted && (
            <p className="text-[11px] text-gray-400 mt-1.5 font-medium">📊 {file.extracted}</p>
          )}

          {/* Pipeline bar (processing files) */}
          {['uploading','classifying','parsing','indexing'].includes(file.status) && (
            <PipelineBar step={file.pipelineStep} status={file.status} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Drop zone ──────────────────────────────────────────────── */
function DropZone({ onUpload }: { onUpload: (name: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach((f) => onUpload(f.name));
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
        dragging
          ? 'border-indigo-400 bg-indigo-50'
          : 'border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/30'
      }`}
    >
      <input ref={inputRef} type="file" multiple className="hidden"
        accept=".pdf,.docx,.pptx,.mp3,.mp4,.m4a,.wav,.txt,.doc"
        onChange={(e) => Array.from(e.target.files||[]).forEach((f) => onUpload(f.name))} />

      <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <Upload className="w-6 h-6 text-indigo-600" />
      </div>
      <p className="text-sm font-bold text-gray-800 mb-1">Drop files here or click to browse</p>
      <p className="text-xs text-gray-400 mb-3">
        Atlas auto-detects file type and matches it to the right class
      </p>
      <div className="flex justify-center gap-2 flex-wrap">
        {['PDF','DOCX','PPTX','MP3','MP4','TXT'].map((t) => (
          <span key={t} className="text-[10px] font-bold bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-md">{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function UploadPage() {
  const [files,       setFiles]       = useState<AtlasFile[]>(INITIAL_FILES);
  const [filterClass, setFilterClass] = useState('All classes');
  const [filterCat,   setFilterCat]   = useState('all');
  const [search,      setSearch]      = useState('');
  const [view,        setView]        = useState<'all' | 'processing' | 'ready' | 'error'>('all');

  const handleUpload = (name: string) => {
    const newFile: AtlasFile = {
      id: Date.now(),
      name,
      category: 'other',
      class: 'Biology 101',
      status: 'uploading',
      size: '—',
      uploadedAt: 'Just now',
      pipelineStep: 0,
    };
    setFiles((p) => [newFile, ...p]);

    // Simulate pipeline — then redirect to upload summary
    let step = 0;
    const statuses: FileStatus[] = ['uploading','classifying','parsing','indexing','ready'];
    const interval = setInterval(() => {
      step++;
      if (step >= statuses.length) {
        clearInterval(interval);
        // Redirect to After Upload Summary screen
        setTimeout(() => { window.location.href = '/upload-summary'; }, 500);
        return;
      }
      setFiles((p) => p.map((f) =>
        f.id === newFile.id ? { ...f, status: statuses[step], pipelineStep: step, category: step >= 1 ? 'notes' : 'other' } : f
      ));
    }, 1000);
  };

  const handleDelete = (id: number) => setFiles((p) => p.filter((f) => f.id !== id));
  const handleRetry  = (id: number) => setFiles((p) => p.map((f) =>
    f.id === id ? { ...f, status: 'uploading', pipelineStep: 0, errorMsg: undefined } : f
  ));

  const filtered = files.filter((f) => {
    if (filterClass !== 'All classes' && f.class !== filterClass) return false;
    if (filterCat !== 'all' && f.category !== filterCat) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (view === 'processing' && !['uploading','classifying','parsing','indexing'].includes(f.status)) return false;
    if (view === 'ready'      && f.status !== 'ready') return false;
    if (view === 'error'      && f.status !== 'error') return false;
    return true;
  });

  const counts = {
    all:        files.length,
    processing: files.filter((f) => ['uploading','classifying','parsing','indexing'].includes(f.status)).length,
    ready:      files.filter((f) => f.status === 'ready').length,
    error:      files.filter((f) => f.status === 'error').length,
  };

  const totalSize = `${files.filter((f) => f.status === 'ready').length} files ready`;

  return (
    <AppLayout>
      <div className="p-6 max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Study Materials</h1>
            <p className="text-sm text-gray-400 mt-0.5">{totalSize} across all classes</p>
          </div>
        </div>

        <div className="flex gap-5">
          {/* Left — upload + files */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Study flow banner */}
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-4 shadow-sm overflow-x-auto">
          <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap">Study flow:</span>
          {[
            { label:'📁 Upload',       href:'/upload',      active:true  },
            { label:'📖 Study Guide',  href:'/study-guide', active:false },
            { label:'🃏 Flashcards',   href:'/flashcards',  active:false },
            { label:'❓ Quiz',         href:'/quiz',         active:false },
            { label:'⚡ Exam Mode',    href:'/exam-mode',   active:false },
          ].map((s, i) => (
            <div key={s.href} className="flex items-center gap-2 flex-shrink-0">
              {i > 0 && <span className="text-gray-200 text-sm">›</span>}
              <a href={s.href}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                  s.active ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                }`}>
                {s.label}
              </a>
            </div>
          ))}
          <span className="ml-auto text-[11px] text-gray-400 whitespace-nowrap hidden sm:block">
            Upload files → Atlas generates study guide automatically
          </span>
        </div>

        {/* Drop zone */}
            <DropZone onUpload={handleUpload} />

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* View tabs */}
              <div className="flex items-center bg-white border border-gray-100 rounded-xl p-1 gap-1">
                {(['all','processing','ready','error'] as const).map((v) => (
                  <button key={v} onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all flex items-center gap-1.5 ${
                      view === v ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}>
                    {v}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      view === v ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>{counts[v]}</span>
                  </button>
                ))}
              </div>

              {/* Class filter */}
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 outline-none focus:border-indigo-500 bg-white">
                {CLASSES.map((c) => <option key={c}>{c}</option>)}
              </select>

              {/* Search */}
              <div className="relative flex-1 min-w-[160px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search files…"
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-700 outline-none focus:border-indigo-500 bg-white" />
              </div>
            </div>

            {/* File list */}
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FolderOpen className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                <p className="font-semibold text-sm">No files found</p>
                <p className="text-xs mt-1">Try adjusting your filters or upload new files</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filtered.map((f) => (
                  <FileRow key={f.id} file={f} onDelete={handleDelete} onRetry={handleRetry} />
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="w-[210px] flex-shrink-0 space-y-4">

            {/* Storage */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Storage (Cloudinary)</p>
              <p className="text-2xl font-extrabold text-gray-900">2.4 GB</p>
              <p className="text-[11px] text-gray-400">of 25 GB free</p>
              <div className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width:'9.6%' }} />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">9.6% used</p>
            </div>

            {/* By class */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Files by class</p>
              {[
                { name:'Biology 101',    count:6, color:'bg-indigo-500' },
                { name:'Statistics 201', count:2, color:'bg-green-500'  },
                { name:'English 110',    count:2, color:'bg-yellow-500' },
                { name:'History 105',    count:1, color:'bg-purple-500' },
                { name:'Chemistry 201',  count:1, color:'bg-red-500'    },
              ].map((c) => (
                <div key={c.name} className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.color}`} />
                  <p className="text-[11px] text-gray-600 flex-1 truncate">{c.name}</p>
                  <span className="text-[11px] font-bold text-gray-500">{c.count}</span>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <Zap className="w-4 h-4 text-indigo-600 mb-2" />
              <p className="text-xs font-bold text-indigo-800 mb-1">Pro tip</p>
              <p className="text-[11px] text-indigo-600 font-light leading-relaxed">
                Upload lecture audio right after class — Atlas transcribes and detects what your professor emphasised.
              </p>
            </div>

            {/* Accepted types */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Accepted types</p>
              <div className="space-y-1.5">
                {[
                  { label:'Syllabi',       fmt:'PDF, DOCX'        },
                  { label:'Lecture audio', fmt:'MP3, MP4, M4A'    },
                  { label:'Slides',        fmt:'PPTX, PDF'        },
                  { label:'Notes',         fmt:'DOCX, TXT, PDF'   },
                  { label:'Assignments',   fmt:'PDF, DOCX'        },
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
