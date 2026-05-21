'use client';

import { useState, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Upload, FileText, Mic, BookOpen, Target,
  BarChart2, CheckCircle2, XCircle, RefreshCw,
  AlertCircle, Trash2, Eye, Search, FolderOpen, Zap, X,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────── */
type FileStatus   = 'uploading' | 'classifying' | 'parsing' | 'indexing' | 'ready' | 'error';
type FileCategory = 'syllabus' | 'lecture_audio' | 'lecture_slides' | 'notes' | 'assignment' | 'quiz' | 'graded_work' | 'review_sheet' | 'other';

interface AtlasFile {
  id: number; name: string; category: FileCategory;
  class: string; status: FileStatus; size: string;
  uploadedAt: string; pipelineStep: number;
  errorMsg?: string; extracted?: string;
}

/* ─── Preview Modal ──────────────────────────────────────────── */
function PreviewModal({ file, onClose }: { file: AtlasFile; onClose: () => void }) {
  const meta = CAT_META[file.category];

  const PREVIEW: Partial<Record<FileCategory, { label:string; value:string; accent?:boolean }[]>> = {
    syllabus: [
      { label:'Deadlines found',  value:'14 deadlines detected',        accent:true  },
      { label:'Grade categories', value:'4 categories mapped'                        },
      { label:'Professor',        value:'Dr. Sarah Smith'                            },
      { label:'Office',           value:'Mendel Hall 314'                            },
      { label:'Exams',            value:'40% of final grade'                         },
      { label:'Quizzes',          value:'25% of final grade'                         },
      { label:'Homework',         value:'20% of final grade'                         },
      { label:'Lab',              value:'10% of final grade'                         },
    ],
    lecture_audio: [
      { label:'Transcript',       value:'8,400 words',                  accent:true  },
      { label:'Emphasis signals', value:'6 topics flagged by professor', accent:true  },
      { label:'Top topic',        value:'"Mitosis phases will be on exam"'           },
      { label:'Key warning',      value:'"Enzyme kinetics is tricky"'               },
      { label:'Duration',         value:'48 minutes'                                 },
    ],
    review_sheet: [
      { label:'Topics covered',   value:'8 topics',                     accent:true  },
      { label:'Key terms',        value:'24 terms',                     accent:true  },
      { label:'Top topic',        value:'Cell Division & Mitosis'                    },
      { label:'Also covers',      value:'DNA Replication, Krebs Cycle'              },
    ],
    graded_work: [
      { label:'Score',            value:'82% — Grade B+',               accent:true  },
      { label:'Weak area',        value:'Enzyme kinetics (40%)',         accent:true  },
      { label:'Strong area',      value:'Cell biology (100%)'                        },
      { label:'Recommendation',   value:'Review competitive inhibition'             },
    ],
    lecture_slides: [
      { label:'Total slides',     value:'32 slides',                    accent:true  },
      { label:'Main topic',       value:'Mitosis & Cell Division'                   },
      { label:'Also covers',      value:'DNA replication'                           },
      { label:'Exam tip noted',   value:'Summary slide 27–32'                       },
    ],
    notes: [
      { label:'Topics',           value:'18 topics detected',           accent:true  },
      { label:'Pages',            value:'12 pages'                                  },
      { label:'Top topic',        value:'Cell biology overview'                     },
    ],
  };

  const rows = PREVIEW[file.category] || [
    { label:'File',      value: file.name                          },
    { label:'Size',      value: file.size                          },
    { label:'Uploaded',  value: file.uploadedAt                    },
    { label:'Class',     value: file.class                         },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">
        {/* Colour strip */}
        <div className={`h-1 w-full ${meta.bg.replace('100','400')}`} />

        {/* Mobile handle */}
        <div className="flex justify-center pt-2.5 sm:hidden">
          <div className="w-8 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-4 border-b border-gray-100">
          <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
            <meta.icon className={`w-5 h-5 ${meta.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold text-gray-900 truncate">{file.name}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{file.class} · {file.size} · {file.uploadedAt}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all flex-shrink-0">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Extracted rows — clean key/value table */}
        <div className="px-5 py-4 space-y-0 divide-y divide-gray-50">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <p className="text-[11px] font-medium text-gray-400 flex-shrink-0">{row.label}</p>
              <p className={`text-[12px] font-semibold text-right ml-4 ${row.accent ? 'text-indigo-600' : 'text-gray-800'}`}>
                {row.value}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/60">
          <p className="text-[10px] text-gray-400">Extracted automatically by Atlas</p>
          <button onClick={onClose}
            className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}



interface AtlasFile {
  id: number; name: string; category: FileCategory;
  class: string; status: FileStatus; size: string;
  uploadedAt: string; pipelineStep: number;
  errorMsg?: string; extracted?: string;
}

/* ─── Data ───────────────────────────────────────────────────── */
const INITIAL_FILES: AtlasFile[] = [
  { id:1,  name:'BIO101_Syllabus.pdf',          category:'syllabus',       class:'Biology 101',    status:'ready',    size:'180 KB', uploadedAt:'Nov 10', pipelineStep:4, extracted:'14 deadlines · 4 grade categories · Prof: Dr. Smith' },
  { id:2,  name:'Lecture 10 — Krebs Cycle.mp3', category:'lecture_audio',  class:'Biology 101',    status:'ready',    size:'48 min', uploadedAt:'Nov 12', pipelineStep:4, extracted:'8,400 word transcript · 6 emphasis signals detected' },
  { id:3,  name:'Exam 2 Review Sheet.pdf',       category:'review_sheet',   class:'Biology 101',    status:'ready',    size:'320 KB', uploadedAt:'Nov 14', pipelineStep:4, extracted:'8 topics · 24 key terms' },
  { id:4,  name:'Quiz 3 — Graded.pdf',           category:'graded_work',    class:'Biology 101',    status:'ready',    size:'85 KB',  uploadedAt:'Oct 28', pipelineStep:4, extracted:'Score: 82% · Weak area: enzyme kinetics' },
  { id:5,  name:'Lecture 11 Slides.pptx',        category:'lecture_slides', class:'Biology 101',    status:'ready',    size:'2.1 MB', uploadedAt:'Nov 13', pipelineStep:4, extracted:'32 slides · Topics: mitosis, cell division' },
  { id:6,  name:'Lab Report 2.docx',             category:'assignment',     class:'Biology 101',    status:'parsing',  size:'220 KB', uploadedAt:'Nov 15', pipelineStep:2 },
  { id:7,  name:'STAT201_Syllabus.pdf',           category:'syllabus',       class:'Statistics 201', status:'ready',    size:'145 KB', uploadedAt:'Sep 2',  pipelineStep:4, extracted:'11 deadlines · 3 grade categories' },
  { id:8,  name:'Problem Set 3 — Solutions.pdf', category:'graded_work',    class:'Statistics 201', status:'ready',    size:'560 KB', uploadedAt:'Nov 5',  pipelineStep:4, extracted:'Score: 92% · All problems correct' },
  { id:9,  name:'Lecture Recording Nov 12.mp4',  category:'lecture_audio',  class:'English 110',    status:'indexing', size:'62 min', uploadedAt:'Nov 12', pipelineStep:3 },
  { id:10, name:'Essay 1 Feedback.pdf',           category:'graded_work',    class:'English 110',    status:'ready',    size:'95 KB',  uploadedAt:'Oct 20', pipelineStep:4, extracted:'Grade: B+ · 5 feedback notes' },
  { id:11, name:'Midterm Notes.docx',             category:'notes',          class:'History 105',    status:'ready',    size:'340 KB', uploadedAt:'Oct 15', pipelineStep:4, extracted:'18 topics · 12 pages' },
  { id:12, name:'Chem Lab Manual.pdf',            category:'notes',          class:'Chemistry 201',  status:'error',    size:'4.2 MB', uploadedAt:'Nov 8',  pipelineStep:1, errorMsg:'File too large — max 5 MB. Try compressing it.' },
];

const PIPELINE_STEPS = ['Uploading','Classifying','Parsing','Indexing','Ready'];

const CAT_META: Record<FileCategory, { icon: typeof FileText; bg:string; color:string; label:string }> = {
  syllabus:       { icon:FileText,  bg:'bg-indigo-100',  color:'text-indigo-600',  label:'Syllabus'       },
  lecture_audio:  { icon:Mic,       bg:'bg-emerald-100', color:'text-emerald-600', label:'Lecture Audio'  },
  lecture_slides: { icon:BarChart2, bg:'bg-purple-100',  color:'text-purple-600',  label:'Slides'         },
  notes:          { icon:BookOpen,  bg:'bg-amber-100',   color:'text-amber-600',   label:'Notes'          },
  assignment:     { icon:FileText,  bg:'bg-blue-100',    color:'text-blue-600',    label:'Assignment'     },
  quiz:           { icon:Target,    bg:'bg-orange-100',  color:'text-orange-600',  label:'Quiz'           },
  graded_work:    { icon:Target,    bg:'bg-red-100',     color:'text-red-600',     label:'Graded Work'    },
  review_sheet:   { icon:FileText,  bg:'bg-teal-100',    color:'text-teal-600',    label:'Review Sheet'   },
  other:          { icon:FileText,  bg:'bg-gray-100',    color:'text-gray-500',    label:'Other'          },
};

const CLASSES = ['All classes','Biology 101','Statistics 201','English 110','History 105','Chemistry 201'];

/* ─── Pipeline bar ───────────────────────────────────────────── */
function PipelineBar({ step, status }: { step:number; status:FileStatus }) {
  return (
    <div className="mt-2.5">
      <div className="flex items-center gap-0.5 mb-1">
        {PIPELINE_STEPS.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
            i < step  ? 'bg-indigo-500' :
            i === step && status !== 'error' ? 'bg-indigo-300 animate-pulse' :
            i === step && status === 'error' ? 'bg-red-400' :
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

/* ─── File row ───────────────────────────────────────────────── */
function FileRow({ file, onDelete, onRetry, onView }: {
  file: AtlasFile;
  onDelete: (id:number) => void;
  onRetry:  (id:number) => void;
  onView:   (file:AtlasFile) => void;
}) {
  const meta = CAT_META[file.category];
  const processing = ['uploading','classifying','parsing','indexing'].includes(file.status);

  return (
    <div className={`bg-white border rounded-2xl p-3.5 md:p-4 transition-all hover:shadow-sm ${
      file.status === 'error' ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
    }`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <meta.icon className={`w-4 h-4 ${meta.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{file.name}</p>
              {/* Meta pills — wrap on mobile */}
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${meta.bg} ${meta.color}`}>
                  {meta.label}
                </span>
                <span className="text-[10px] text-gray-400 truncate max-w-[100px] sm:max-w-none">{file.class}</span>
                <span className="text-[10px] text-gray-300 hidden sm:inline">·</span>
                <span className="text-[10px] text-gray-400 hidden sm:inline">{file.size}</span>
                <span className="text-[10px] text-gray-300 hidden sm:inline">·</span>
                <span className="text-[10px] text-gray-400 hidden sm:inline">{file.uploadedAt}</span>
              </div>
            </div>

            {/* Status + actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {file.status === 'ready'   && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {file.status === 'error'   && <XCircle      className="w-4 h-4 text-red-500" />}
              {processing                && <RefreshCw    className="w-3.5 h-3.5 text-indigo-400 animate-spin" />}
              {file.status === 'ready'   && (
                <button onClick={() => onView(file)}
                  className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all"
                  title="Preview extracted content">
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}
              {file.status === 'error'   && (
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

          {/* Error */}
          {file.status === 'error' && file.errorMsg && (
            <div className="flex items-start gap-1.5 mt-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-red-600 font-medium">{file.errorMsg}</p>
            </div>
          )}

          {/* Extracted info */}
          {file.status === 'ready' && file.extracted && (
            <p className="text-[11px] text-gray-400 mt-1.5">📊 {file.extracted}</p>
          )}

          {/* Pipeline bar */}
          {processing && <PipelineBar step={file.pipelineStep} status={file.status} />}
        </div>
      </div>
    </div>
  );
}

/* ─── Drop zone ──────────────────────────────────────────────── */
function DropZone({ onUpload }: { onUpload: (name:string) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    Array.from(e.dataTransfer.files).forEach((f) => onUpload(f.name));
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-6 md:p-8 text-center cursor-pointer transition-all ${
        dragging
          ? 'border-indigo-400 bg-indigo-50'
          : 'border-gray-200 bg-gray-50/60 hover:border-indigo-300 hover:bg-indigo-50/30'
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
        Atlas auto-detects the file type and matches it to the right class
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
  const [search,      setSearch]      = useState('');
  const [view,        setView]        = useState<'all'|'processing'|'ready'|'error'>('all');
  const [previewFile, setPreviewFile] = useState<AtlasFile | null>(null);

  const handleUpload = (name: string) => {
    const newFile: AtlasFile = {
      id: Date.now(), name, category:'other', class:'Biology 101',
      status:'uploading', size:'—', uploadedAt:'Just now', pipelineStep:0,
    };
    setFiles((p) => [newFile, ...p]);

    let step = 0;
    const statuses: FileStatus[] = ['uploading','classifying','parsing','indexing','ready'];
    const interval = setInterval(() => {
      step++;
      if (step >= statuses.length) {
        clearInterval(interval);
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
    f.id === id ? { ...f, status:'uploading', pipelineStep:0, errorMsg:undefined } : f
  ));

  const filtered = files.filter((f) => {
    if (filterClass !== 'All classes' && f.class !== filterClass) return false;
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

  return (
    <AppLayout>
      {previewFile && <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />}
      <div className="p-4 md:p-6 max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-gray-900">Study Materials</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {counts.ready} files ready · {counts.processing > 0 ? `${counts.processing} processing` : 'all up to date'}
            </p>
          </div>
        </div>

        {/* Main layout — stacks on mobile */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* Left — dropzone + file list */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Drop zone */}
            <DropZone onUpload={handleUpload} />

            {/* Filters row — scrollable on mobile */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* View tabs */}
              <div className="flex items-center bg-white border border-gray-100 rounded-xl p-1 gap-0.5 overflow-x-auto scrollbar-none">
                {(['all','processing','ready','error'] as const).map((v) => (
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

              {/* Class filter */}
              <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 outline-none focus:border-indigo-500 bg-white flex-shrink-0">
                {CLASSES.map((c) => <option key={c}>{c}</option>)}
              </select>

              {/* Search */}
              <div className="relative flex-1 min-w-[140px]">
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
              <div className="space-y-2">
                {filtered.map((f) => (
                  <FileRow key={f.id} file={f} onDelete={handleDelete} onRetry={handleRetry} onView={setPreviewFile} />
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar — full width on mobile, fixed on desktop */}
          <div className="lg:w-[210px] lg:flex-shrink-0 space-y-3">

            {/* Storage */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Storage</p>
              <div className="flex items-end gap-1.5 mb-1">
                <p className="text-2xl font-extrabold text-gray-900">2.4</p>
                <p className="text-sm text-gray-400 mb-0.5">GB of 25 GB</p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width:'9.6%' }} />
              </div>
              <p className="text-[10px] text-emerald-600 font-semibold">9.6% used · 22.6 GB free</p>
            </div>

            {/* Files by class */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">By class</p>
              {/* Grid on mobile, list on desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-0 lg:space-y-2">
                {[
                  { name:'Biology 101',    count:6, color:'bg-indigo-500'  },
                  { name:'Statistics 201', count:2, color:'bg-emerald-500' },
                  { name:'English 110',    count:2, color:'bg-amber-500'   },
                  { name:'History 105',    count:1, color:'bg-purple-500'  },
                  { name:'Chemistry 201',  count:1, color:'bg-red-500'     },
                ].map((c) => (
                  <div key={c.name} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.color}`} />
                    <p className="text-[11px] text-gray-600 flex-1 truncate">{c.name}</p>
                    <span className="text-[11px] font-bold text-gray-500">{c.count}</span>
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

            {/* Accepted types */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Accepted formats</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5 lg:gap-0 lg:space-y-1.5">
                {[
                  { label:'Syllabi',        fmt:'PDF, DOCX'      },
                  { label:'Lecture audio',  fmt:'MP3, MP4, M4A'  },
                  { label:'Slides',         fmt:'PPTX, PDF'      },
                  { label:'Notes',          fmt:'DOCX, TXT, PDF' },
                  { label:'Assignments',    fmt:'PDF, DOCX'      },
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
