'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  BookOpen, CheckCircle2, ChevronRight, Flag,
  Brain, AlertTriangle, Star, RefreshCw,
  ChevronDown, ChevronUp, Volume2,
  MessageSquare, X,
} from 'lucide-react';

type StudyMode = 'read' | 'listen' | 'quiz' | 'teach';

interface Citation { source:string; ref:string; preview:string; }
interface Section {
  id:string; title:string; content:string;
  citations:Citation[]; completed:boolean;
  partialCoverage?:boolean; commonMistake?:string;
}

const SECTIONS: Section[] = [
  {
    id:'objectives', title:'Learning Objectives', completed:true, citations:[],
    content:`By the end of this guide you should be able to:
• Describe the 5 phases of mitosis and what occurs in each
• Distinguish mitosis from meiosis and explain when each occurs
• Explain the role of spindle fibres in chromosome separation
• Identify key regulatory checkpoints in the cell cycle
• Predict what happens when mitotic checkpoints fail`,
  },
  {
    id:'overview', title:'What is Mitosis?', completed:true,
    citations:[
      { source:'BIO101_Syllabus.pdf',         ref:'Source 1', preview:'Mitosis: nuclear division producing identical daughter cells…' },
      { source:'Lecture 11 Slides · Slide 4', ref:'Source 2', preview:'Cell cycle: G1 → S → G2 → M phase…' },
      { source:'Lecture 11 Audio · 08:42',    ref:'Source 3', preview:'"the S phase is where DNA replication occurs"' },
    ],
    content:`Mitosis is the process of nuclear division that produces two genetically identical daughter cells from a single parent cell. [Source 1] It is the primary mechanism of growth, tissue repair, and asexual reproduction in eukaryotes.

The entire process is tightly regulated by the cell cycle, which consists of interphase (G1, S, and G2 phases) followed by mitosis (M phase). [Source 2] Dr. Smith emphasised in Lecture 11 that "the S phase is where DNA replication occurs — without it, mitosis cannot proceed correctly." [Source 3]`,
  },
  {
    id:'phases', title:'The 5 Phases of Mitosis', completed:true,
    citations:[
      { source:'Exam 2 Review Sheet · p.2',      ref:'Source 1', preview:'PPMAT: Prophase, Prometaphase, Metaphase, Anaphase, Telophase' },
      { source:'Lecture 11 Slides · Slides 8–14',ref:'Source 2', preview:'Detailed phase diagrams with annotations' },
      { source:'Lecture 11 Audio · 14:18',        ref:'Source 3', preview:'"nuclear envelope breaks down during prometaphase, not prophase"' },
      { source:'Lecture 10 Audio · 32:05',        ref:'Source 4', preview:'Spindle assembly checkpoint — metaphase plate alignment' },
    ],
    content:`Mitosis is divided into five sequential phases: [Source 1]

**Prophase** — Chromatin condenses into visible chromosomes. The mitotic spindle begins to form from centrosomes. The nuclear envelope starts to break down. [Source 2]

**Prometaphase** — The nuclear envelope fully disintegrates. Spindle fibres attach to kinetochores on chromosomes. Dr. Smith noted: "The nuclear envelope breaks down during prometaphase, not prophase — this is a common exam mistake." [Source 3]

**Metaphase** — Chromosomes align at the cell's equatorial plate (metaphase plate). The spindle assembly checkpoint verifies all kinetochores are properly attached. [Source 4]

**Anaphase** — Sister chromatids are pulled apart toward opposite poles. The cell elongates. This phase was emphasised 3× in Lecture 11. [Source 2]

**Telophase** — Nuclear envelopes reform around each set of chromosomes. Chromosomes begin to decondense. Cytokinesis begins. [Source 1]`,
  },
  {
    id:'spindle', title:'Spindle Fibres & Kinetochores', completed:false, partialCoverage:true,
    citations:[
      { source:'Lecture 11 Slides · Slide 18', ref:'Source 1', preview:'Spindle structure diagram with labelled components' },
      { source:'Lecture 11 Audio · 22:45',     ref:'Source 2', preview:'Kinetochore assembly on centromeric DNA' },
    ],
    content:`The mitotic spindle is a structure made of microtubules that segregates chromosomes during mitosis. [Source 1]

Kinetochores are protein complexes that assemble on centromeric DNA and serve as attachment sites for spindle microtubules. [Source 2] There are three types of spindle microtubules:
• Kinetochore microtubules — attach to kinetochores directly
• Polar microtubules — push the poles apart
• Astral microtubules — anchor the spindle to the cell cortex`,
  },
  {
    id:'mistakes', title:'Common Exam Mistakes', completed:false,
    commonMistake:'You answered Q4 wrong on Quiz 3 — nuclear envelope breakdown is prometaphase, not prophase',
    citations:[
      { source:'Quiz 3 · Q4',               ref:'Source 1', preview:'Student answered prophase — correct: prometaphase' },
      { source:'Exam 2 Review Sheet · p.3', ref:'Source 2', preview:'Comparison table: mitosis vs meiosis' },
      { source:'Lecture 11 Audio · 41:02',  ref:'Source 3', preview:'"cytokinesis overlaps with the end of mitosis"' },
    ],
    content:`Based on your Quiz 3 performance and lecture emphasis, watch out for:

❌ **Prometaphase vs Prophase** — The nuclear envelope breaks down in prometaphase, NOT prophase. You got this wrong on Quiz 3 Q4. [Source 1]

❌ **Mitosis vs Meiosis** — Mitosis produces 2 identical diploid cells. Meiosis produces 4 genetically diverse haploid cells. [Source 2]

❌ **Cytokinesis timing** — Cytokinesis begins during anaphase/telophase, not after. [Source 3]`,
  },
  {
    id:'keyterms', title:'Key Terms', completed:false,
    citations:[{ source:'Exam 2 Review Sheet · p.1', ref:'Source 1', preview:'Glossary of key mitosis terms' }],
    content:`**Centromere** — Region where sister chromatids are joined and kinetochores form
**Centrosome** — Organelle that organises spindle microtubules (animal cells)
**Chromatid** — One copy of a duplicated chromosome
**Cytokinesis** — Division of the cytoplasm following nuclear division
**Kinetochore** — Protein complex on centromere that attaches to spindle microtubules
**Metaphase plate** — Imaginary plane where chromosomes align during metaphase
**Spindle fibres** — Microtubule structures that move chromosomes during cell division`,
  },
];

/* ─── Citation chip ──────────────────────────────────────────── */
function CitationChip({ citation }: { citation: Citation }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block">
      <button onClick={() => setShow(!show)}
        className="text-[10px] font-bold bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded-md ml-0.5 transition-all">
        {citation.ref}
      </button>
      {show && (
        <div className="absolute bottom-full left-0 mb-1 z-50 bg-white border border-indigo-200 rounded-xl shadow-xl p-3 w-64">
          <p className="text-[10px] font-bold text-indigo-700 mb-1">📎 {citation.source}</p>
          <p className="text-[11px] text-gray-600 italic">"{citation.preview}"</p>
          <button onClick={() => setShow(false)} className="absolute top-2 right-2.5 text-gray-400 hover:text-gray-600 text-sm leading-none">×</button>
        </div>
      )}
    </span>
  );
}

/* ─── Section card ───────────────────────────────────────────── */
function SectionCard({ section, isActive, onToggle, onComplete }: {
  section: Section; isActive: boolean;
  onToggle: () => void; onComplete: () => void;
}) {
  const renderContent = (text: string, citations: Citation[]) => {
    let result = text;
    citations.forEach((c) => { result = result.replace(`[${c.ref}]`, `__CITE__${c.ref}__CITE__`); });
    return result.split('\n').map((line, li) => (
      <p key={li} className="text-sm text-gray-700 leading-relaxed mb-2 last:mb-0">
        {line.split('__CITE__').map((part, pi) => {
          const cit = citations.find((c) => c.ref === part);
          if (cit) return <CitationChip key={pi} citation={cit} />;
          return <span key={pi} dangerouslySetInnerHTML={{ __html: part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
        })}
      </p>
    ));
  };

  return (
    <div className={`bg-white rounded-2xl overflow-hidden transition-all border ${
      isActive ? 'border-indigo-200 shadow-md' : 'border-gray-100 shadow-sm hover:border-indigo-100'
    }`}>
      {/* Header */}
      <div onClick={onToggle}
        className={`flex items-center justify-between px-4 md:px-5 py-3.5 cursor-pointer hover:bg-gray-50/60 transition-all ${
          section.completed ? 'bg-emerald-50/40' : ''
        }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          {section.completed
            ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            : <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
          }
          <p className="text-sm font-bold text-gray-900 truncate">{section.title}</p>
          {section.partialCoverage && (
            <span className="text-[9px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full flex-shrink-0 hidden sm:inline">
              Limited source
            </span>
          )}
          {section.commonMistake && (
            <span className="text-[9px] font-bold bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-full flex-shrink-0 hidden sm:inline">
              ⚠ Quiz error
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {section.citations.length > 0 && (
            <span className="text-[10px] text-gray-400 hidden sm:inline">{section.citations.length} sources</span>
          )}
          {isActive
            ? <ChevronUp className="w-4 h-4 text-gray-400" />
            : <ChevronDown className="w-4 h-4 text-gray-400" />
          }
        </div>
      </div>

      {/* Content */}
      {isActive && (
        <div className="px-4 md:px-5 pb-5 pt-3 border-t border-gray-50">
          {section.commonMistake && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mb-4">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-medium">{section.commonMistake}</p>
            </div>
          )}

          <div className="space-y-0">
            {renderContent(section.content, section.citations)}
          </div>

          {section.citations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Sources</p>
              <div className="flex flex-wrap gap-1.5">
                {section.citations.map((c) => (
                  <span key={c.ref} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium">
                    📎 {c.source}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!section.completed && (
            <button onClick={onComplete}
              className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2 rounded-xl transition-all border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark as completed
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function StudyGuidePage() {
  const [mode,       setMode]       = useState<StudyMode>('read');
  const [sections,   setSections]   = useState(SECTIONS);
  const [activeId,   setActiveId]   = useState<string | null>('overview');
  const [selfRating, setSelfRating] = useState<number | null>(null);
  const [toast,      setToast]      = useState<{ msg:string; color:string } | null>(null);

  const showToast = (msg: string, color: string) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRegenerate = () => {
    showToast('✓ Study guide regenerated from your latest files', 'bg-indigo-600');
  };

  const handleFlag = () => {
    showToast('⚑ Issue flagged — we\'ll review this guide', 'bg-red-500');
  };

  const completedCount = sections.filter((s) => s.completed).length;
  const progressPct    = Math.round((completedCount / sections.length) * 100);

  const MODES = [
    { id:'read'  as StudyMode, icon:BookOpen,      label:'Read'       },
    { id:'listen'as StudyMode, icon:Volume2,       label:'Listen'     },
    { id:'quiz'  as StudyMode, icon:Brain,         label:'Quiz me'    },
    { id:'teach' as StudyMode, icon:MessageSquare, label:'Teach back' },
  ];

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-[1100px] mx-auto">

        {/* Toast notification */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 ${toast.color} text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl transition-all`}>
            <span>{toast.msg}</span>
            <button onClick={() => setToast(null)}>
              <X className="w-4 h-4 opacity-70 hover:opacity-100" />
            </button>
          </div>
        )}

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
            <span className="hover:text-indigo-600 cursor-pointer">Biology 101</span>
            <ChevronRight className="w-3 h-3" />
            <span className="hover:text-indigo-600 cursor-pointer">Topics</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-indigo-600 font-semibold">Mitosis</span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-lg md:text-xl font-extrabold text-gray-900">Mitosis — Study Guide</h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  87% from your files
                </span>
                <span className="text-[10px] text-gray-400">4 sources used</span>
                <span className="text-[10px] text-gray-400">·</span>
                <span className="text-[10px] text-gray-400">Updated today</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Regenerate + Flag */}
              <button
                onClick={handleRegenerate}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border-2 border-indigo-300 hover:bg-indigo-100 hover:border-indigo-500 px-3.5 py-2 rounded-xl transition-all shadow-sm">
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </button>
              <button
                onClick={handleFlag}
                className="flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border-2 border-red-300 hover:bg-red-100 hover:border-red-500 px-3.5 py-2 rounded-xl transition-all shadow-sm">
                <Flag className="w-3.5 h-3.5" /> Flag issue
              </button>

              {/* Study mode tabs — desktop */}
              <div className="hidden sm:flex items-center bg-white border border-gray-100 rounded-xl p-1 gap-0.5 shadow-sm">
                {MODES.map((m) => (
                  <button key={m.id} onClick={() => setMode(m.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      mode === m.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }`}>
                    <m.icon className="w-3.5 h-3.5" />
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mode tabs — mobile only, scrollable */}
          <div className="flex sm:hidden items-center bg-white border border-gray-100 rounded-xl p-1 gap-0.5 shadow-sm mt-3 overflow-x-auto scrollbar-none">
            {MODES.map((m) => (
              <button key={m.id} onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                  mode === m.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                }`}>
                <m.icon className="w-3.5 h-3.5" />
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Sources banner ────────────────────────────────────── */}
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-emerald-800">87% of this guide comes from your uploaded files</p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {['BIO101 Syllabus','Lecture 11','Review Sheet','Quiz 3'].map((s) => (
                <span key={s} className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{s}</span>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 font-medium flex-shrink-0 hidden sm:block">
            Tap [Source N] to see original
          </p>
        </div>

        {/* ── Main layout ───────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* Left — content area */}
          <div className="flex-1 min-w-0">

            {/* READ mode */}
            {mode === 'read' && (
              <div className="space-y-2.5">
                {sections.map((s) => (
                  <SectionCard key={s.id} section={s}
                    isActive={activeId === s.id}
                    onToggle={() => setActiveId((p) => p === s.id ? null : s.id)}
                    onComplete={() => setSections((p) => p.map((x) => x.id === s.id ? { ...x, completed:true } : x))}
                  />
                ))}
              </div>
            )}

            {/* LISTEN mode */}
            {mode === 'listen' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm text-center">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Volume2 className="w-7 h-7 text-indigo-600" />
                </div>
                <p className="text-base font-extrabold text-gray-900 mb-1">Audio mode</p>
                <p className="text-sm text-gray-400 mb-5 max-w-sm mx-auto">
                  Atlas reads this guide aloud using text-to-speech. Great for commuting or revising on the go.
                </p>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20">
                  ▶ Play audio guide
                </button>
              </div>
            )}

            {/* QUIZ mode */}
            {mode === 'quiz' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm text-center">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-7 h-7 text-indigo-600" />
                </div>
                <p className="text-base font-extrabold text-gray-900 mb-1">Quiz mode</p>
                <p className="text-sm text-gray-400 mb-5 max-w-sm mx-auto">
                  Test yourself with questions generated from this study guide. Identifies weak spots instantly.
                </p>
                <a href="/quiz"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20">
                  Go to Quiz <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* TEACH mode */}
            {mode === 'teach' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-extrabold text-gray-900">Teach it back</h2>
                </div>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  Explain mitosis in your own words as if teaching a classmate. Include the phases, what happens in each, and why it matters. Don&apos;t look at the guide.
                </p>
                <textarea
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-800 outline-none focus:border-indigo-400 resize-none transition-all"
                  rows={8}
                  placeholder="Start typing your explanation here…"
                />
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20">
                    Check my explanation
                  </button>
                  <p className="text-xs text-gray-400">Atlas will compare it against your study guide</p>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="lg:w-[210px] lg:flex-shrink-0 space-y-3">

            {/* Progress */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Your progress</p>
              <div className="flex items-center justify-between mb-2">
                <p className="text-2xl font-extrabold text-indigo-600">{progressPct}%</p>
                <p className="text-xs text-gray-400">{completedCount}/{sections.length} sections</p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width:`${progressPct}%` }} />
              </div>
              <p className="text-[10px] text-gray-400 mb-1.5">Rate your confidence</p>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((r) => (
                  <button key={r} onClick={() => setSelfRating(r)}>
                    <Star className={`w-4 h-4 ${r<=(selfRating||0)?'fill-amber-400 text-amber-400':'text-gray-200'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Table of contents */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Contents</p>
              <div className="space-y-0.5">
                {sections.map((s) => (
                  <button key={s.id} onClick={() => { setActiveId(s.id); setMode('read'); }}
                    className={`w-full flex items-center gap-2 text-left px-2 py-2 rounded-xl transition-all ${
                      activeId === s.id && mode === 'read' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-600'
                    }`}>
                    {s.completed
                      ? <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      : <div className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" />
                    }
                    <span className="text-[11px] font-medium truncate">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Professor quote */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <p className="text-[10px] font-extrabold text-indigo-700 mb-1.5">🎙 Dr. Smith said</p>
              <p className="text-[11px] text-indigo-600 italic leading-relaxed">
                "The nuclear envelope breaks down during prometaphase, not prophase — common exam mistake."
              </p>
              <p className="text-[10px] text-indigo-400 mt-1.5">Lecture 11 · 14:18</p>
            </div>

            {/* Quick links */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Study tools</p>
              <div className="space-y-0.5">
                {[
                  { label:'🃏 Flashcards', href:'/flashcards' },
                  { label:'❓ Take a quiz', href:'/quiz'       },
                  { label:'⚡ Exam mode',  href:'/exam-mode'  },
                ].map((a) => (
                  <a key={a.href} href={a.href}
                    className="flex items-center justify-between text-xs font-semibold text-gray-700 hover:text-indigo-600 p-2 rounded-xl hover:bg-indigo-50 transition-all">
                    {a.label}
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
