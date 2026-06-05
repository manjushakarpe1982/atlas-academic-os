'use client';

import { useEffect } from 'react';
import {
  X, FileText, Mic, Presentation, StickyNote, ClipboardCheck,
  Award, PenSquare, Download, ExternalLink, Play, Pause,
  ChevronLeft, ChevronRight, Search, BookOpen, CheckCircle2,
  Quote, Clock, AlertTriangle,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
 *  FilePreviewDrawer
 *  Per SRS FR-6.5 — clicking a file in the materials panel opens
 *  a preview drawer with file-type-appropriate rendering.
 *
 *  Supported types:
 *    • syllabus       → rendered text with extracted fields
 *    • lecture_audio  → audio player mock + transcript with timestamps
 *    • lecture_slides → slide thumbnails grid
 *    • review_sheet   → page-by-page preview
 *    • graded_work    → graded score + feedback
 *    • notes          → scrollable text
 *    • assignment     → instructions + due date
 * ───────────────────────────────────────────────────────────── */

export interface PreviewFile {
  id: number;
  name: string;
  type: string;
  sub?: string;
  status?: 'ready' | 'parsing' | 'uploading';
  /* type-specific optional fields */
  duration?: string;
  pages?: number;
  size?: string;
  uploadedAt?: string;
  score?: string;
  feedback?: string;
}

interface Props {
  file: PreviewFile | null;
  onClose: () => void;
}

const FILE_META: Record<string, { label: string; icon: typeof FileText; color: string; iconColor: string }> = {
  syllabus:       { label: 'Syllabus',       icon: FileText,        color: 'bg-red-50',     iconColor: 'text-red-600'     },
  lecture_audio:  { label: 'Lecture audio',  icon: Mic,             color: 'bg-blue-50',    iconColor: 'text-blue-600'    },
  lecture_slides: { label: 'Slide deck',     icon: Presentation,    color: 'bg-orange-50',  iconColor: 'text-orange-600'  },
  review_sheet:   { label: 'Review sheet',   icon: ClipboardCheck,  color: 'bg-purple-50',  iconColor: 'text-purple-600'  },
  graded_work:    { label: 'Graded work',    icon: Award,           color: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  notes:          { label: 'Your notes',     icon: StickyNote,      color: 'bg-amber-50',   iconColor: 'text-amber-700'   },
  assignment:     { label: 'Assignment',     icon: PenSquare,       color: 'bg-indigo-50',  iconColor: 'text-indigo-600'  },
};

/* Mock content for different file types */
const MOCK_AUDIO_TRANSCRIPT = [
  { t: '00:00', speaker: 'Dr. Smith', text: 'Alright everyone, today we\'re continuing with the cell cycle and getting deep into mitosis.' },
  { t: '00:42', speaker: 'Dr. Smith', text: 'You should know all five phases cold for the midterm — that\'s prophase, prometaphase, metaphase, anaphase, and telophase.', emphasis: true },
  { t: '02:18', speaker: 'Dr. Smith', text: 'Let me show you a quick diagram. Notice how the chromatin condenses during prophase.' },
  { t: '05:30', speaker: 'Student',   text: 'Is the spindle formation always the same in plant cells?' },
  { t: '05:42', speaker: 'Dr. Smith', text: 'Great question. Plant cells don\'t have centrosomes, but they form a similar spindle structure...' },
  { t: '09:15', speaker: 'Dr. Smith', text: 'This is the part I love testing — the differences between mitosis and meiosis.', emphasis: true },
  { t: '14:18', speaker: 'Dr. Smith', text: 'Remember, in metaphase the chromosomes align at the equatorial plate.' },
  { t: '22:50', speaker: 'Dr. Smith', text: 'Let\'s move on to the Krebs cycle. This is where energy production happens.' },
];

const MOCK_SLIDES = [
  { n: 1,  title: 'The Cell Cycle' },
  { n: 2,  title: 'Phases Overview' },
  { n: 3,  title: 'Interphase: G1, S, G2' },
  { n: 4,  title: 'Mitosis: Introduction' },
  { n: 5,  title: 'Prophase' },
  { n: 6,  title: 'Prometaphase' },
  { n: 7,  title: 'Metaphase' },
  { n: 8,  title: 'Anaphase' },
  { n: 9,  title: 'Telophase' },
  { n: 10, title: 'Cytokinesis' },
];

const MOCK_NOTES_TEXT = `# Mitosis — class notes, Oct 24

Smith said this would be on Exam 2 multiple times today. Need to focus on the phase ordering.

## Phases (in order)
1. Prophase — chromatin condenses
2. Prometaphase — nuclear envelope breaks down
3. Metaphase — chromosomes line up at equator
4. Anaphase — sister chromatids separate
5. Telophase — nuclear envelopes reform

## Things Smith emphasized
- Difference between mitosis and meiosis (mentioned this 3x)
- The exact ordering matters — won\'t accept partial credit on the ordering
- Plant vs animal cells (no centrosome in plants)

## Things I'm still unsure about
- How the spindle apparatus actually forms
- What "kinetochore" means exactly
- Why anaphase A vs anaphase B is a thing`;

const MOCK_SYLLABUS_FIELDS = {
  professor: 'Dr. Sarah Smith',
  schedule:  'MWF 10:00–10:50 AM',
  location:  'Science Hall · Room 207',
  officeHours: 'Tue/Thu 2-4 PM · Mendel Hall 314',
  categories: [
    { name: 'Exams (3)',    weight: 50 },
    { name: 'Quizzes (8)',  weight: 25 },
    { name: 'Homework',     weight: 20 },
    { name: 'Participation', weight: 5 },
  ],
  dates: [
    { what: 'Exam 1',  when: 'Sep 28' },
    { what: 'Exam 2',  when: 'Nov 22' },
    { what: 'Final',   when: 'Dec 18' },
  ],
};

export default function FilePreviewDrawer({ file, onClose }: Props) {
  /* Close on Escape */
  useEffect(() => {
    if (!file) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [file, onClose]);

  /* Lock body scroll while drawer is open */
  useEffect(() => {
    if (!file) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [file]);

  if (!file) return null;

  const meta = FILE_META[file.type] ?? { label: 'File', icon: FileText, color: 'bg-gray-50', iconColor: 'text-gray-600' };
  const Icon = meta.icon;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-[560px] bg-white shadow-2xl z-50 flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-5 border-b border-[#ECE9FF] flex-shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${meta.color} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${meta.iconColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#534AB7] mb-0.5">{meta.label}</p>
              <h3 className="text-[15px] font-extrabold text-[#14142B] leading-tight truncate">{file.name}</h3>
              {file.sub && <p className="text-[11.5px] text-[#9B9AB5] mt-0.5 truncate">{file.sub}</p>}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close preview"
            className="flex-shrink-0 w-9 h-9 rounded-lg hover:bg-[#F4F2FF] flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-[#6B6A8A]" />
          </button>
        </div>

        {/* Body — type-specific renderer */}
        <div className="flex-1 overflow-y-auto">
          {file.status === 'parsing' ? (
            <ParsingState file={file} />
          ) : file.type === 'syllabus'       ? <SyllabusPreview />
            : file.type === 'lecture_audio'  ? <AudioPreview />
            : file.type === 'lecture_slides' ? <SlidesPreview />
            : file.type === 'review_sheet'   ? <ReviewSheetPreview />
            : file.type === 'graded_work'    ? <GradedPreview />
            : file.type === 'notes'          ? <NotesPreview />
            : file.type === 'assignment'     ? <AssignmentPreview />
            : <GenericPreview file={file} />}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-2 px-5 py-3 border-t border-[#ECE9FF] flex-shrink-0">
          <button className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#534AB7] hover:bg-[#F4F2FF] px-3 py-2 rounded-lg transition-colors">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
          <button className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#534AB7] hover:bg-[#F4F2FF] px-3 py-2 rounded-lg transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Open full view
          </button>
          <div className="flex-1" />
          <span className="text-[10.5px] text-[#9B9AB5]">Press ESC to close</span>
        </div>
      </div>
    </>
  );
}

/* ─── Parsing state ──────────────────────────────────────────── */
function ParsingState({ file }: { file: PreviewFile }) {
  return (
    <div className="p-10 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
        <Clock className="w-6 h-6 text-amber-600 animate-pulse" />
      </div>
      <h3 className="text-base font-extrabold text-[#14142B] mb-1">Still parsing…</h3>
      <p className="text-[13px] text-[#6B6A8A] max-w-sm leading-relaxed">
        Atlas is reading <strong>{file.name}</strong> and extracting topics, signals, and key sections.
        This usually takes 15-30 seconds.
      </p>
    </div>
  );
}

/* ─── Syllabus preview ───────────────────────────────────────── */
function SyllabusPreview() {
  const s = MOCK_SYLLABUS_FIELDS;
  return (
    <div className="p-5 space-y-4">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <p className="text-[12px] text-emerald-800 leading-relaxed">
          <strong>Successfully parsed.</strong> Atlas extracted 14 fields from this syllabus and used them to build your class workspace.
        </p>
      </div>

      {/* Key fields */}
      <div className="bg-[#FAFAFE] border border-[#ECE9FF] rounded-xl p-4">
        <p className="text-[10px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-3">Class info</p>
        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div><p className="text-[#9B9AB5] mb-0.5">Professor</p><p className="font-extrabold text-[#14142B]">{s.professor}</p></div>
          <div><p className="text-[#9B9AB5] mb-0.5">Schedule</p> <p className="font-extrabold text-[#14142B]">{s.schedule}</p></div>
          <div><p className="text-[#9B9AB5] mb-0.5">Location</p> <p className="font-extrabold text-[#14142B]">{s.location}</p></div>
          <div><p className="text-[#9B9AB5] mb-0.5">Office hours</p><p className="font-extrabold text-[#14142B]">{s.officeHours}</p></div>
        </div>
      </div>

      {/* Grade categories */}
      <div className="bg-white border border-[#ECE9FF] rounded-xl p-4">
        <p className="text-[10px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-3">Grade categories</p>
        <div className="space-y-2.5">
          {s.categories.map((c) => (
            <div key={c.name} className="flex items-center justify-between text-[12px]">
              <span className="font-extrabold text-[#14142B]">{c.name}</span>
              <span className="font-bold text-[#534AB7]">{c.weight}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key dates */}
      <div className="bg-white border border-[#ECE9FF] rounded-xl p-4">
        <p className="text-[10px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-3">Key dates</p>
        <div className="space-y-2">
          {s.dates.map((d) => (
            <div key={d.what} className="flex items-center justify-between text-[12px] py-1.5 border-b border-[#F4F2FF] last:border-0">
              <span className="font-extrabold text-[#14142B]">{d.what}</span>
              <span className="text-[#6B6A8A]">{d.when}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Audio preview with transcript ──────────────────────────── */
function AudioPreview() {
  return (
    <div className="flex flex-col">
      {/* Mock audio player */}
      <div className="bg-gradient-to-br from-[#534AB7] to-[#7B6FE8] p-5 text-white">
        <div className="flex items-center gap-3 mb-3">
          <button className="w-11 h-11 rounded-full bg-white text-[#534AB7] flex items-center justify-center shadow-lg flex-shrink-0">
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-extrabold truncate">Lecture 8 — Cell Cycle</p>
            <p className="text-[11px] text-white/70">48 min · transcribed · 2 speakers</p>
          </div>
        </div>
        {/* Faux waveform */}
        <div className="flex items-center gap-0.5 h-10 mb-2">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i}
              className={`flex-1 rounded-full ${i < 12 ? 'bg-white' : 'bg-white/30'}`}
              style={{ height: `${30 + Math.sin(i * 0.6) * 25 + Math.cos(i * 0.2) * 15}%` }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[10.5px] font-bold text-white/80">
          <span>14:18</span>
          <span>48:00</span>
        </div>
      </div>

      {/* Transcript with search */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-extrabold text-[#9B9AB5] uppercase tracking-widest">Transcript</p>
          <div className="flex items-center gap-1.5 text-[10.5px] text-[#6B6A8A] bg-[#F4F2FF] px-2 py-1 rounded-md">
            <Search className="w-3 h-3" /> Searchable
          </div>
        </div>

        <div className="space-y-2.5">
          {MOCK_AUDIO_TRANSCRIPT.map((seg, i) => (
            <div key={i}
              className={`flex items-start gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                seg.emphasis ? 'bg-amber-50 border border-amber-200' : 'hover:bg-[#FAFAFE]'
              }`}>
              <button className="flex-shrink-0 text-[10px] font-extrabold text-[#534AB7] tabular-nums hover:underline pt-0.5">
                {seg.t}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-[#9B9AB5] uppercase tracking-wider mb-0.5">{seg.speaker}</p>
                <p className={`text-[12.5px] leading-relaxed ${seg.emphasis ? 'text-amber-900 font-semibold' : 'text-[#3A3A52]'}`}>
                  {seg.emphasis && <Quote className="inline w-3 h-3 mr-1 text-amber-600" />}
                  {seg.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Slides preview ─────────────────────────────────────────── */
function SlidesPreview() {
  return (
    <div className="p-5">
      {/* Current slide hero */}
      <div className="aspect-[16/10] bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-xl flex flex-col items-center justify-center text-center p-6 mb-4">
        <p className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest mb-2">Slide 5 of 32</p>
        <h3 className="text-xl font-extrabold text-[#14142B] mb-2">Prophase</h3>
        <p className="text-[12px] text-[#6B6A8A] max-w-xs leading-relaxed">
          Chromatin condenses into visible chromosomes. The nuclear envelope begins to break down.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#534AB7] hover:bg-[#F4F2FF] px-2.5 py-1.5 rounded-lg">
          <ChevronLeft className="w-3.5 h-3.5" /> Prev
        </button>
        <span className="text-[11px] text-[#6B6A8A]">5 / 32</span>
        <button className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#534AB7] hover:bg-[#F4F2FF] px-2.5 py-1.5 rounded-lg">
          Next <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Thumbnails */}
      <p className="text-[10px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-2">All slides</p>
      <div className="grid grid-cols-3 gap-2">
        {MOCK_SLIDES.map((s) => (
          <button key={s.n}
            className={`aspect-[16/10] rounded-lg border-2 p-2 text-left transition-colors ${
              s.n === 5
                ? 'bg-orange-50 border-orange-400'
                : 'bg-white border-[#ECE9FF] hover:border-orange-200'
            }`}>
            <p className="text-[8.5px] font-bold text-[#9B9AB5] mb-0.5">#{s.n}</p>
            <p className="text-[10px] font-extrabold text-[#14142B] leading-tight line-clamp-2">{s.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Review sheet preview ───────────────────────────────────── */
function ReviewSheetPreview() {
  return (
    <div className="p-5 space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-start gap-2.5">
        <BookOpen className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
        <p className="text-[12px] text-purple-900 leading-relaxed">
          <strong>4 pages</strong> · Generated by Dr. Smith for Exam 2. Atlas extracted <strong>11 emphasized topics</strong> from this sheet.
        </p>
      </div>

      {/* Page preview */}
      {[1, 2, 3, 4].map((p) => (
        <div key={p} className="bg-white border border-[#ECE9FF] rounded-xl p-4">
          <p className="text-[10px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-2">Page {p}</p>
          {p === 1 && (
            <>
              <h4 className="text-[13px] font-extrabold text-[#14142B] mb-2">Exam 2 Review — Cell Biology</h4>
              <p className="text-[12px] text-[#3A3A52] leading-relaxed mb-2">
                Focus areas: cell cycle, mitosis, cellular respiration, enzyme kinetics. Bring a calculator. Two-hour exam.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Mitosis', 'Cellular respiration', 'Enzyme kinetics', 'Krebs cycle'].map((t) => (
                  <span key={t} className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </>
          )}
          {p === 2 && (
            <>
              <h4 className="text-[13px] font-extrabold text-[#14142B] mb-2">Must-know topics</h4>
              <ul className="text-[12px] text-[#3A3A52] space-y-1 list-disc pl-4">
                <li><strong>Mitosis phases in order</strong> — partial credit not given for ordering</li>
                <li>Differences between mitosis and meiosis</li>
                <li>Where ATP is produced (Krebs cycle vs glycolysis)</li>
              </ul>
            </>
          )}
          {p > 2 && (
            <p className="text-[11px] text-[#9B9AB5] italic">Click &quot;Open full view&quot; to read full page.</p>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Graded work preview ────────────────────────────────────── */
function GradedPreview() {
  return (
    <div className="p-5 space-y-4">
      {/* Score banner */}
      <div className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 rounded-2xl p-5 text-center">
        <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest mb-1">Your score</p>
        <p className="text-5xl font-extrabold text-emerald-600 leading-none mb-1">82%</p>
        <p className="text-[12px] text-[#6B6A8A]">14 of 17 correct · B grade</p>
      </div>

      {/* Breakdown */}
      <div className="bg-white border border-[#ECE9FF] rounded-xl p-4">
        <p className="text-[10px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-3">Breakdown by topic</p>
        <div className="space-y-2.5">
          {[
            { topic: 'Mitosis phases',      score: 60, color: 'bg-red-400'     },
            { topic: 'Enzyme kinetics',     score: 50, color: 'bg-red-400'     },
            { topic: 'Krebs cycle',         score: 90, color: 'bg-emerald-500' },
            { topic: 'Cell membrane',       score: 100, color: 'bg-emerald-500' },
          ].map((b) => (
            <div key={b.topic}>
              <div className="flex items-center justify-between text-[11.5px] mb-1">
                <span className="font-extrabold text-[#14142B]">{b.topic}</span>
                <span className="font-bold text-[#6B6A8A]">{b.score}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#F4F2FF] overflow-hidden">
                <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <p className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest">Professor feedback</p>
        </div>
        <p className="text-[12px] text-amber-900 italic leading-relaxed">
          &ldquo;Review the phase ordering for mitosis — you keep mixing up prometaphase and metaphase.
          Office hours Tue/Thu if you want to walk through it.&rdquo;
        </p>
      </div>
    </div>
  );
}

/* ─── Notes preview ──────────────────────────────────────────── */
function NotesPreview() {
  return (
    <div className="p-5">
      <pre className="text-[12.5px] text-[#3A3A52] leading-relaxed font-sans whitespace-pre-wrap">{MOCK_NOTES_TEXT}</pre>
    </div>
  );
}

/* ─── Assignment preview ─────────────────────────────────────── */
function AssignmentPreview() {
  return (
    <div className="p-5 space-y-4">
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <p className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-widest mb-2">Due date</p>
        <p className="text-base font-extrabold text-[#14142B] mb-1">Friday · May 24 · 11:59 PM</p>
        <p className="text-[12px] text-[#6B6A8A]">3 days from now · Worth 8% of final grade</p>
      </div>

      <div className="bg-white border border-[#ECE9FF] rounded-xl p-4">
        <p className="text-[10px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-2">Instructions</p>
        <p className="text-[12.5px] text-[#3A3A52] leading-relaxed">
          Lab Report 2 — submit a 3-5 page report on the enzyme kinetics experiment from Lab 4.
          Include hypothesis, methods, data tables, and discussion. Cite at least 2 outside sources.
        </p>
      </div>
    </div>
  );
}

/* ─── Generic fallback preview ───────────────────────────────── */
function GenericPreview({ file }: { file: PreviewFile }) {
  return (
    <div className="p-10 text-center">
      <FileText className="w-10 h-10 text-[#9B9AB5] mx-auto mb-3" />
      <p className="text-sm font-extrabold text-[#14142B] mb-1">{file.name}</p>
      <p className="text-[12px] text-[#6B6A8A]">Preview not available for this file type.</p>
    </div>
  );
}
