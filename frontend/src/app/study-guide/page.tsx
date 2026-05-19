'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  BookOpen, CheckCircle2, ChevronRight, Flag,
  Mic, MessageSquare, Brain, RefreshCw,
  AlertTriangle, Star, Zap, ChevronDown,
  ChevronUp, Volume2, FileText,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────── */
type StudyMode = 'read' | 'listen' | 'quiz' | 'teach';

interface Citation {
  source: string;
  ref: string;
  preview: string;
}

interface Section {
  id: string;
  title: string;
  content: string;
  citations: Citation[];
  partialCoverage?: boolean;
  completed: boolean;
  commonMistake?: string;
}

/* ─── Mock data ──────────────────────────────────────────────── */
const SECTIONS: Section[] = [
  {
    id: 'objectives',
    title: 'Learning Objectives',
    completed: true,
    content: `By the end of this guide you should be able to:
• Describe the 5 phases of mitosis and what occurs in each
• Distinguish mitosis from meiosis and explain when each occurs  
• Explain the role of spindle fibres in chromosome separation
• Identify key regulatory checkpoints in the cell cycle
• Predict what happens when mitotic checkpoints fail`,
    citations: [],
  },
  {
    id: 'overview',
    title: 'What is Mitosis?',
    completed: true,
    content: `Mitosis is the process of nuclear division that produces two genetically identical daughter cells from a single parent cell. [Source 1] It is the primary mechanism of growth, tissue repair, and asexual reproduction in eukaryotes.

The entire process is tightly regulated by the cell cycle, which consists of interphase (G1, S, and G2 phases) followed by mitosis (M phase). [Source 2] Dr. Smith emphasised in Lecture 11 that "the S phase is where DNA replication occurs — without it, mitosis cannot proceed correctly." [Source 3]`,
    citations: [
      { source: 'BIO101_Syllabus.pdf', ref: 'Source 1', preview: 'Mitosis: nuclear division producing identical daughter cells…' },
      { source: 'Lecture 11 Slides · Slide 4', ref: 'Source 2', preview: 'Cell cycle: G1 → S → G2 → M phase…' },
      { source: 'Lecture 11 Audio · 08:42', ref: 'Source 3', preview: '"the S phase is where DNA replication occurs"' },
    ],
  },
  {
    id: 'phases',
    title: 'The 5 Phases of Mitosis',
    completed: true,
    content: `Mitosis is divided into five sequential phases: [Source 1]

**Prophase** — Chromatin condenses into visible chromosomes. The mitotic spindle begins to form from centrosomes. The nuclear envelope starts to break down. [Source 2]

**Prometaphase** — The nuclear envelope fully disintegrates. Spindle fibres attach to kinetochores on chromosomes. Dr. Smith noted: "The nuclear envelope breaks down during prometaphase, not prophase — this is a common exam mistake." [Source 3]

**Metaphase** — Chromosomes align at the cell's equatorial plate (metaphase plate). The spindle assembly checkpoint verifies all kinetochores are properly attached. [Source 4]

**Anaphase** — Sister chromatids are pulled apart toward opposite poles. The cell elongates. This phase was emphasised 3× in Lecture 11. [Source 2]

**Telophase** — Nuclear envelopes reform around each set of chromosomes. Chromosomes begin to decondense. Cytokinesis begins. [Source 1]`,
    citations: [
      { source: 'Exam 2 Review Sheet · p.2', ref: 'Source 1', preview: 'PPMAT: Prophase, Prometaphase, Metaphase, Anaphase, Telophase' },
      { source: 'Lecture 11 Slides · Slides 8–14', ref: 'Source 2', preview: 'Detailed phase diagrams with annotations' },
      { source: 'Lecture 11 Audio · 14:18', ref: 'Source 3', preview: '"nuclear envelope breaks down during prometaphase, not prophase"' },
      { source: 'Lecture 10 Audio · 32:05', ref: 'Source 4', preview: 'Spindle assembly checkpoint — metaphase plate alignment' },
    ],
  },
  {
    id: 'spindle',
    title: 'Spindle Fibres & Kinetochores',
    completed: false,
    content: `The mitotic spindle is a structure made of microtubules that segregates chromosomes during mitosis. [Source 1]

Kinetochores are protein complexes that assemble on centromeric DNA and serve as attachment sites for spindle microtubules. [Source 2] There are three types of spindle microtubules:
• Kinetochore microtubules — attach to kinetochores directly  
• Polar microtubules — push the poles apart
• Astral microtubules — anchor the spindle to the cell cortex`,
    citations: [
      { source: 'Lecture 11 Slides · Slide 18', ref: 'Source 1', preview: 'Spindle structure diagram with labelled components' },
      { source: 'Lecture 11 Audio · 22:45', ref: 'Source 2', preview: 'Kinetochore assembly on centromeric DNA' },
    ],
    partialCoverage: true,
  },
  {
    id: 'mistakes',
    title: 'Common Mistakes',
    completed: false,
    content: `Based on your Quiz 3 performance and lecture emphasis, watch out for:

❌ **Prometaphase vs Prophase confusion** — The nuclear envelope breaks down in prometaphase, NOT prophase. You got this wrong on Quiz 3 Q4. [Source 1]

❌ **Mitosis vs meiosis** — Mitosis produces 2 identical diploid cells. Meiosis produces 4 genetically diverse haploid cells. Different purposes. [Source 2]

❌ **Cytokinesis timing** — Cytokinesis begins during anaphase/telophase, not after. [Source 3]`,
    citations: [
      { source: 'Quiz 3 · Q4 (incorrect answer)', ref: 'Source 1', preview: 'Student answered prophase — correct answer is prometaphase' },
      { source: 'Exam 2 Review Sheet · p.3', ref: 'Source 2', preview: 'Comparison table: mitosis vs meiosis' },
      { source: 'Lecture 11 Audio · 41:02', ref: 'Source 3', preview: '"cytokinesis overlaps with the end of mitosis"' },
    ],
    commonMistake: 'You answered Q4 wrong on Quiz 3 — nuclear envelope breakdown is prometaphase not prophase',
  },
  {
    id: 'keyterms',
    title: 'Key Terms',
    completed: false,
    content: `**Centromere** — Region of a chromosome where sister chromatids are joined and kinetochores form
**Centrosome** — Organelle that organises spindle microtubules (animal cells)
**Chromatid** — One copy of a duplicated chromosome, joined to its identical copy at the centromere
**Cytokinesis** — Division of the cytoplasm following nuclear division
**Kinetochore** — Protein complex on centromere that attaches to spindle microtubules
**Metaphase plate** — Imaginary plane where chromosomes align during metaphase
**Spindle fibres** — Microtubule structures that move chromosomes during cell division`,
    citations: [
      { source: 'Exam 2 Review Sheet · p.1', ref: 'Source 1', preview: 'Glossary of key mitosis terms' },
    ],
  },
];

/* ─── Citation chip ──────────────────────────────────────────── */
function CitationChip({ citation }: { citation: Citation }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        onClick={() => setShow(!show)}
        className="text-[10px] font-bold bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded-md ml-0.5 transition-all"
      >
        {citation.ref}
      </button>
      {show && (
        <div className="absolute bottom-full left-0 mb-1 z-50 bg-white border border-indigo-200 rounded-xl shadow-xl p-3 w-60">
          <p className="text-[10px] font-bold text-indigo-700 mb-1">{citation.source}</p>
          <p className="text-[11px] text-gray-600 italic">"{citation.preview}"</p>
          <button onClick={() => setShow(false)} className="absolute top-1 right-2 text-gray-400 hover:text-gray-600 text-xs">×</button>
        </div>
      )}
    </span>
  );
}

/* ─── Section card ───────────────────────────────────────────── */
function SectionCard({
  section, isActive, onToggle, onComplete,
}: {
  section: Section;
  isActive: boolean;
  onToggle: () => void;
  onComplete: () => void;
}) {
  // Render content with inline citation chips
  const renderContent = (text: string, citations: Citation[]) => {
    let result = text;
    citations.forEach((c) => {
      result = result.replace(
        `[${c.ref}]`,
        `__CITE__${c.ref}__CITE__`
      );
    });

    return result.split('\n').map((line, li) => (
      <p key={li} className="text-sm text-gray-700 leading-relaxed mb-2 last:mb-0">
        {line.split('__CITE__').map((part, pi) => {
          const cit = citations.find((c) => c.ref === part);
          if (cit) return <CitationChip key={pi} citation={cit} />;
          // Bold text
          const bold = part.replace(/\*\*(.*?)\*\*/g, '');
          return <span key={pi} dangerouslySetInnerHTML={{
            __html: part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          }} />;
        })}
      </p>
    ));
  };

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-all ${
      isActive ? 'border-indigo-200 shadow-md' : 'border-gray-100 shadow-sm'
    }`}>
      {/* Header */}
      <div
        className={`flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-all ${
          section.completed ? 'bg-green-50/50' : ''
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-2.5">
          {section.completed
            ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            : <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
          }
          <p className="text-sm font-bold text-gray-900">{section.title}</p>
          {section.partialCoverage && (
            <span className="text-[9px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full">
              Limited coverage
            </span>
          )}
          {section.commonMistake && (
            <span className="text-[9px] font-bold bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-full">
              ⚠ Quiz 3 error
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {section.citations.length > 0 && (
            <span className="text-[10px] text-gray-400">{section.citations.length} sources</span>
          )}
          {isActive ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {/* Content */}
      {isActive && (
        <div className="px-5 pb-5 pt-1 border-t border-gray-50">
          {section.commonMistake && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mb-4">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-medium">{section.commonMistake}</p>
            </div>
          )}

          <div className="prose prose-sm max-w-none">
            {renderContent(section.content, section.citations)}
          </div>

          {/* Citations list */}
          {section.citations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Sources</p>
              <div className="flex flex-wrap gap-1.5">
                {section.citations.map((c) => (
                  <span key={c.ref} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium">
                    📎 {c.source}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mark complete */}
          {!section.completed && (
            <button onClick={onComplete}
              className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-700 hover:bg-green-50 px-3 py-2 rounded-xl transition-all">
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark as completed
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function StudyGuidePage() {
  const [mode,       setMode]       = useState<StudyMode>('read');
  const [sections,   setSections]   = useState(SECTIONS);
  const [activeId,   setActiveId]   = useState<string | null>('overview');
  const [selfRating, setSelfRating] = useState<number | null>(null);

  const completedCount = sections.filter((s) => s.completed).length;
  const progressPct    = Math.round((completedCount / sections.length) * 100);
  const groundingPct   = 87;

  const toggleSection = (id: string) =>
    setActiveId((p) => (p === id ? null : id));

  const completeSection = (id: string) =>
    setSections((p) => p.map((s) => (s.id === id ? { ...s, completed: true } : s)));

  const MODES: { id: StudyMode; icon: typeof BookOpen; label: string }[] = [
    { id:'read',   icon: BookOpen,       label: 'Read'      },
    { id:'listen', icon: Volume2,        label: 'Listen'    },
    { id:'quiz',   icon: Brain,          label: 'Quiz me'   },
    { id:'teach',  icon: MessageSquare,  label: 'Teach back'},
  ];

  return (
    <AppLayout>
      <div className="p-6 max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-sm text-gray-400 mb-1">
              <span className="hover:text-indigo-600 cursor-pointer">Biology 101</span>
              <span className="mx-1.5">›</span>
              <span className="hover:text-indigo-600 cursor-pointer">Topics</span>
              <span className="mx-1.5">›</span>
              <span className="text-gray-700 font-medium">Mitosis</span>
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Mitosis — Study Guide</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs text-gray-400">Generated from your files</span>
              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {groundingPct}% from your materials
              </span>
              <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {13 - groundingPct}% supplementary
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 px-3 py-2 rounded-xl transition-all">
              <RefreshCw className="w-3.5 h-3.5" /> Regenerate
            </button>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-300 px-3 py-2 rounded-xl transition-all">
              <Flag className="w-3.5 h-3.5" /> Flag issue
            </button>
          </div>
        </div>

        {/* ── Study flow nav ─────────────────────────────── */}
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-5 shadow-sm overflow-x-auto">
          <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap">Study flow:</span>
          {[
            { label:'📁 Upload',       href:'/upload',      done: true  },
            { label:'📖 Study Guide',  href:'/study-guide', done: true, active: true },
            { label:'🃏 Flashcards',   href:'/flashcards',  done: false },
            { label:'❓ Quiz',         href:'/quiz',         done: false },
            { label:'⚡ Exam Mode',    href:'/exam-mode',   done: false },
          ].map((s, i) => (
            <div key={s.href} className="flex items-center gap-2 flex-shrink-0">
              {i > 0 && <span className="text-gray-200 text-sm">›</span>}
              <a href={s.href}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                  s.active
                    ? 'bg-indigo-600 text-white'
                    : s.done
                    ? 'text-green-700 bg-green-50 hover:bg-green-100'
                    : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                }`}>
                {s.label}
              </a>
            </div>
          ))}
       
          {MODES.map((m) => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === m.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}>
              <m.icon className="w-3.5 h-3.5" />
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex gap-5">
          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Grounding banner */}
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-4">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-bold text-green-800">
                  {groundingPct}% of this guide comes from your own uploaded files
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {['BIO101 Syllabus','Lecture 11','Review Sheet','Quiz 3'].map((s) => (
                    <span key={s} className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{s}</span>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-green-600 font-medium flex-shrink-0">
                Click any [Source N] chip to see the original
              </p>
            </div>

            {/* Sections */}
            {mode === 'read' && (
              <div className="space-y-3">
                {sections.map((s) => (
                  <SectionCard
                    key={s.id}
                    section={s}
                    isActive={activeId === s.id}
                    onToggle={() => toggleSection(s.id)}
                    onComplete={() => completeSection(s.id)}
                  />
                ))}
              </div>
            )}

            {mode === 'teach' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-bold text-gray-900">Teach it back</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Explain mitosis in your own words as if teaching a classmate who has never heard of it.
                  Include the phases, what happens in each, and why it matters. Don&apos;t look at the guide.
                </p>
                <textarea
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-800 outline-none focus:border-indigo-500 resize-none"
                  rows={8}
                  placeholder="Start typing your explanation here…"
                />
                <div className="flex items-center gap-2 mt-3">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
                    Check my explanation
                  </button>
                  <p className="text-xs text-gray-400">Atlas will compare it against your study guide</p>
                </div>
              </div>
            )}

            {(mode === 'listen' || mode === 'quiz') && (
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-center">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  {mode === 'listen' ? <Volume2 className="w-7 h-7 text-indigo-600" /> : <Brain className="w-7 h-7 text-indigo-600" />}
                </div>
                <p className="text-base font-bold text-gray-900 mb-1">
                  {mode === 'listen' ? 'Audio mode' : 'Quiz mode'}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  {mode === 'listen'
                    ? 'Atlas will read this guide aloud using text-to-speech'
                    : 'Switch to the Quiz screen for interactive questions from this topic'}
                </p>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all">
                  {mode === 'listen' ? '▶ Play audio guide' : '→ Go to Quiz'}
                </button>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="w-[210px] flex-shrink-0 space-y-4">

            {/* Progress */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Your progress</p>
              <div className="flex items-center justify-between mb-2">
                <p className="text-2xl font-extrabold text-indigo-600">{progressPct}%</p>
                <p className="text-xs text-gray-400">{completedCount}/{sections.length} sections</p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width:`${progressPct}%` }} />
              </div>

              {/* Self rating */}
              <div className="mt-3 pt-3 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 mb-2">Rate your confidence</p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((r) => (
                    <button key={r} onClick={() => setSelfRating(r)}>
                      <Star className={`w-4 h-4 ${r <= (selfRating||0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* TOC */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Contents</p>
              <div className="space-y-1.5">
                {sections.map((s) => (
                  <button key={s.id} onClick={() => setActiveId(s.id)}
                    className={`w-full flex items-center gap-2 text-left px-2 py-1.5 rounded-lg transition-all ${
                      activeId === s.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-600'
                    }`}>
                    {s.completed
                      ? <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                      : <div className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" />
                    }
                    <span className="text-[11px] font-medium truncate">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Professor quote */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-indigo-700 mb-1.5">🎙 Dr. Smith said</p>
              <p className="text-[11px] text-indigo-600 italic leading-relaxed">
                "The nuclear envelope breaks down during prometaphase, not prophase — this is a common exam mistake."
              </p>
              <p className="text-[10px] text-indigo-400 mt-1.5">Lecture 11 · 14:18</p>
            </div>

            {/* Quick actions */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-2">
              {[
                { label:'🃏 Practice flashcards', href:'/flashcards' },
                { label:'❓ Take a quiz',         href:'/quiz'       },
                { label:'⚡ Exam mode',           href:'/exam-mode'  },
              ].map((a) => (
                <a key={a.label} href={a.href}
                  className="flex items-center justify-between text-xs font-semibold text-gray-700 hover:text-indigo-600 p-2 rounded-xl hover:bg-indigo-50 transition-all">
                  {a.label}
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
