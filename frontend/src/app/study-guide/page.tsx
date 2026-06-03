'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import Tooltip from '@/components/Tooltip';
import {
  BookOpen, CheckCircle2, ChevronRight, Flag,
  Brain, AlertTriangle, Star, RefreshCw,
  ChevronDown, ChevronUp, Volume2,
  MessageSquare, X, Send, Sparkles, Printer,
  Upload, Lock, Target, ArrowRight, Quote, Zap,
} from 'lucide-react';

type StudyMode = 'read' | 'listen' | 'quiz' | 'teach' | 'ask';

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
/* ─── Ask AI — RAG Q&A grounded in uploaded materials ───────── */
const SUGGESTED_QUESTIONS = [
  'What are the key phases of mitosis in order?',
  'What is the role of spindle fibres?',
  'When does the nuclear envelope break down?',
  'How is mitosis different from meiosis?',
  'What did Prof. Smith say about checkpoints?',
];

interface Message { role:'user'|'ai'; text:string; sources?:string[]; }

function AskAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const MOCK_ANSWERS: Record<string, { text:string; sources:string[] }> = {
    default: {
      text: "Based on your Biology 101 materials, mitosis is the process of cell division that produces two genetically identical daughter cells. Your professor Dr. Smith emphasized that students often confuse the phase order — the correct sequence is Prophase → Prometaphase → Metaphase → Anaphase → Telophase (PPMAT).",
      sources: ["📢 Lecture 8, 09:15", "📑 Lecture 10, slide 4", "📋 Exam 2 Review Sheet, p.1"],
    },
    phase: {
      text: "The 5 phases in order are: (1) Prophase — chromatin condenses, spindle begins forming. (2) Prometaphase — nuclear envelope breaks down, spindle fibres attach to kinetochores. (3) Metaphase — chromosomes align at the cell plate. (4) Anaphase — sister chromatids pulled to opposite poles. (5) Telophase — nuclear envelope reforms, chromosomes decondense.",
      sources: ["📢 Lecture 8, 09:15–18:40", "📑 Slides 3–8"],
    },
    spindle: {
      text: "Spindle fibres are microtubule structures that attach to chromosomes at the kinetochore during prometaphase. During anaphase, kinetochore microtubules shorten to pull sister chromatids to opposite poles. Dr. Smith said: 'If you remember nothing else, remember that kinetochore microtubules pull — that distinction showed up on last year's exam.'",
      sources: ["📢 Lecture 8, 22:04", "📋 Review Sheet, p.2"],
    },
    nuclear: {
      text: "The nuclear envelope fully breaks down in Prometaphase — not Prophase as many students assume. In Prophase it begins to fragment, but complete disintegration happens in Prometaphase when spindle microtubules need direct access to the chromosomes. This was on Quiz 3 and you got it wrong — worth reviewing carefully.",
      sources: ["📢 Lecture 8, 14:32", "✏️ Quiz 3, Q4 — you answered Prophase"],
    },
    meiosis: {
      text: "Your uploaded materials only briefly compare mitosis and meiosis. From Lecture 8: mitosis produces 2 identical diploid cells for growth/repair, while meiosis produces 4 haploid cells for reproduction. Smith noted this comparison may appear on Exam 2 as a short-answer question.",
      sources: ["📢 Lecture 8, 44:10", "⚠️ Supplementary — not fully covered in your files"],
    },
    checkpoint: {
      text: "Dr. Smith covered 3 checkpoints: G1 checkpoint (cell size, nutrients OK?), G2 checkpoint (DNA replicated correctly?), and the Spindle Assembly Checkpoint in metaphase (all chromosomes attached to spindle?). She said: 'The SAC is the one I love testing because students always forget it exists.'",
      sources: ["📢 Lecture 9, 08:22", "📑 Lecture 9, slides 14–16"],
    },
  };

  const getAnswer = (q: string) => {
    const lower = q.toLowerCase();
    if (lower.includes('phase') || lower.includes('order') || lower.includes('ppmat')) return MOCK_ANSWERS.phase;
    if (lower.includes('spindle') || lower.includes('microtubul') || lower.includes('kinetochore')) return MOCK_ANSWERS.spindle;
    if (lower.includes('nuclear') || lower.includes('envelope')) return MOCK_ANSWERS.nuclear;
    if (lower.includes('meiosis') || lower.includes('different')) return MOCK_ANSWERS.meiosis;
    if (lower.includes('checkpoint') || lower.includes('smith')) return MOCK_ANSWERS.checkpoint;
    return MOCK_ANSWERS.default;
  };

  const send = async (q?: string) => {
    const question = q || input.trim();
    if (!question) return;
    setInput('');
    setMessages((p) => [...p, { role:'user', text:question }]);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const ans = getAnswer(question);
    setMessages((p) => [...p, { role:'ai', text:ans.text, sources:ans.sources }]);
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col" style={{ height: 560 }}>

      {/* ── Header ────────────────────────────────────────────── */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-gray-900">Ask about this material</p>
            <p className="text-[10px] text-gray-400">Grounded in your Biology 101 uploads · not the internet</p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg flex-shrink-0">
          87% your files
        </span>
      </div>

      {/* ── Scrollable chat area ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">

        {/* Empty state — info + suggestions */}
        {messages.length === 0 && !loading && (
          <div>
            <div className="text-center py-5 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-2.5">
                <MessageSquare className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Ask anything about Mitosis</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                Atlas answers from your professor's lectures, slides, and review sheets — not the internet.
              </p>
            </div>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2.5">Suggested questions</p>
            <div className="space-y-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button key={q} onClick={() => send(q)}
                  className="w-full flex items-center gap-2.5 text-left px-3.5 py-2.5 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 rounded-xl text-xs font-medium text-gray-700 hover:text-indigo-700 transition-all group">
                  <span className="text-indigo-400 group-hover:text-indigo-600 flex-shrink-0">→</span>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'ai' && (
              <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className="max-w-[80%]">
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-sm'
              }`}>
                {m.text}
              </div>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {m.sources.map((s) => (
                    <span key={s} className="text-[10px] font-medium bg-white border border-indigo-100 text-indigo-600 px-2 py-1 rounded-lg">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-extrabold text-indigo-600">A</span>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center h-4">
                {[0,1,2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay:`${i*0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Follow-up chips after reply */}
        {messages.length > 1 && !loading && (
          <div className="flex gap-1.5 flex-wrap">
            {['What about checkpoints?', 'Compare with meiosis', 'Which phases are tested?'].map((q) => (
              <button key={q} onClick={() => send(q)}
                className="text-[10px] font-semibold bg-white border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 text-gray-500 px-2.5 py-1.5 rounded-lg transition-all">
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Input — pinned at bottom ───────────────────────────── */}
      <div className="flex-shrink-0 border-t border-gray-100 px-4 py-3 bg-white">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask a question about this material…"
            rows={1}
            className="flex-1 bg-gray-50 border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all resize-none"
          />
          <button onClick={() => send()}
            disabled={!input.trim() || loading}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition-all shadow-md shadow-indigo-500/20 flex-shrink-0">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5">↵ Enter to send</p>
      </div>
    </div>
  );
}


/* ─── Teach back with AI evaluation ─────────────────────────── */
function TeachBack() {
  const [answer,    setAnswer]    = useState('');
  const [loading,   setLoading]   = useState(false);
  const [feedback,  setFeedback]  = useState<null|{score:number;strong:string[];missing:string[];tip:string}>(null);

  const check = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    setFeedback(null);

    // Simulate AI evaluation (in production this calls the backend RAG endpoint)
    await new Promise((r) => setTimeout(r, 1800));

    // Score based on keywords detected
    const a = answer.toLowerCase();
    const found = {
      phases:      /prophase|prometaphase|metaphase|anaphase|telophase/.test(a),
      spindle:     /spindle|microtubul|kinetochore/.test(a),
      chromatids:  /chromatid|sister|centromere/.test(a),
      nuclear:     /nuclear|envelope/.test(a),
      cytokinesis: /cytokinesis|cell divid|two cell/.test(a),
    };
    const hits   = Object.values(found).filter(Boolean).length;
    const score  = Math.round((hits / 5) * 100);
    const strong = [];
    const missing = [];
    if (found.phases)     strong.push('Correctly described the phase order (PPMAT)');
    else                  missing.push('Phase order — PPMAT: Prophase, Prometaphase, Metaphase, Anaphase, Telophase');
    if (found.spindle)    strong.push('Mentioned spindle fibres / kinetochore microtubules');
    else                  missing.push('Spindle fibre role in pulling chromatids to poles');
    if (found.chromatids) strong.push('Explained sister chromatid separation');
    else                  missing.push('Sister chromatids — they separate in anaphase, not prophase');
    if (found.nuclear)    strong.push('Nuclear envelope breakdown mentioned');
    else                  missing.push('Nuclear envelope breaks down in prometaphase');
    if (found.cytokinesis)strong.push('Covered cytokinesis / final cell division');
    else                  missing.push('Cytokinesis — how the cytoplasm divides to form 2 daughter cells');

    const tip = score >= 80
      ? "Excellent! You understand the core process. Try explaining the checkpoints (G1, G2, spindle assembly) next."
      : score >= 50
      ? "Good start — you have the basic idea. Focus on the missing points above and try again."
      : "Keep going — re-read the phases section, then try explaining just the phases first before the full process.";

    setFeedback({ score, strong, missing, tip });
    setLoading(false);
  };

  const scoreColor = !feedback ? '' : feedback.score >= 80 ? 'text-emerald-600' : feedback.score >= 50 ? 'text-amber-600' : 'text-red-600';
  const scoreBg    = !feedback ? '' : feedback.score >= 80 ? 'bg-emerald-50 border-emerald-200' : feedback.score >= 50 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <MessageSquare className="w-5 h-5 text-indigo-600" />
        <h2 className="text-base font-extrabold text-gray-900">Teach it back</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
        Explain mitosis in your own words as if teaching a classmate. Include the phases, what happens in each, and why it matters. Don&apos;t look at the guide.
      </p>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl p-4 text-sm text-gray-800 outline-none resize-none transition-all"
        rows={7}
        placeholder="Start typing your explanation here… e.g. 'Mitosis is the process by which a cell divides into two identical daughter cells. It starts with Prophase where…'"
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3 mb-4">
        <button onClick={check} disabled={loading || !answer.trim()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20">
          {loading ? (
            <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Evaluating…</>
          ) : (
            <><MessageSquare className="w-4 h-4" /> Check my explanation</>
          )}
        </button>
        {feedback && (
          <button onClick={() => { setAnswer(''); setFeedback(null); }}
            className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            Try again
          </button>
        )}
        <p className="text-xs text-gray-400">Atlas compares your answer against your study guide</p>
      </div>

      {/* Feedback panel */}
      {feedback && (
        <div className="space-y-3 border-t border-gray-100 pt-4">
          {/* Score */}
          <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${scoreBg}`}>
            <p className={`text-3xl font-extrabold ${scoreColor}`}>{feedback.score}%</p>
            <div>
              <p className={`text-sm font-bold ${scoreColor}`}>
                {feedback.score >= 80 ? '🌟 Strong explanation!' : feedback.score >= 50 ? '📈 Good start — almost there' : '💪 Keep practising'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Based on key concepts from your Biology 101 materials</p>
            </div>
          </div>

          {/* What you got right */}
          {feedback.strong.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5">
              <p className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest mb-2">✓ You covered</p>
              <ul className="space-y-1">
                {feedback.strong.map((s) => (
                  <li key={s} className="text-xs text-emerald-700 flex items-start gap-1.5">
                    <span className="mt-0.5 flex-shrink-0">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What's missing */}
          {feedback.missing.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3.5">
              <p className="text-[10px] font-extrabold text-red-700 uppercase tracking-widest mb-2">✗ Missing or unclear</p>
              <ul className="space-y-1">
                {feedback.missing.map((m) => (
                  <li key={m} className="text-xs text-red-700 flex items-start gap-1.5">
                    <span className="mt-0.5 flex-shrink-0">→</span> {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tip */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3.5 py-2.5">
            <p className="text-xs font-semibold text-indigo-700">💡 {feedback.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Flag unclear signal button ─────────────────────────────── */
function FlagUnclearButton({ sectionId }: { sectionId: string }) {
  const [flagged, setFlagged] = useState(false);
  return (
    <Tooltip
      text="Flag this section as unclear. Atlas will go deeper on this topic and increase its engine priority score."
      position="top"
      width="w-60">
      <button onClick={() => setFlagged(!flagged)}
        className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all ${
          flagged
            ? 'bg-amber-50 border-amber-300 text-amber-700'
            : 'bg-white border-gray-200 text-gray-400 hover:border-amber-300 hover:text-amber-600'
        }`}>
        <AlertTriangle className="w-3.5 h-3.5" />
        {flagged ? 'Flagged unclear' : 'Flag unclear'}
      </button>
    </Tooltip>
  );
}

export default function StudyGuidePage() {
  const [mode,       setMode]       = useState<StudyMode>('read');
  const [sections,   setSections]   = useState(SECTIONS);
  const [activeId,   setActiveId]   = useState<string | null>('overview');
  const [selfRating, setSelfRating] = useState<number | null>(null);
  const [toast,      setToast]      = useState<{ msg:string; color:string } | null>(null);

  // Study Guide is built entirely from uploaded materials. Until the student
  // has uploaded a syllabus + lecture content, there's nothing to read.
  const [hasGuide, setHasGuide] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('atlas_has_guide') === 'true') {
      setHasGuide(true);
    }
  }, []);

  /* ─────────────────────────────────────────────────────────────
   * EMPTY STATE — no source material to generate a guide from yet.
   * ───────────────────────────────────────────────────────────── */
  if (!hasGuide) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#F5F5FB] p-4 md:p-8">
          <div className="max-w-[1000px] mx-auto">

            {/* Header */}
            <div className="text-center mb-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F4F2FF] border border-[#E8E5FD] text-[#534AB7] text-[11px] font-bold px-3.5 py-1.5 mb-4">
                <BookOpen className="w-3.5 h-3.5" /> Your study guide
              </span>
              <h1 className="text-3xl md:text-[34px] font-extrabold text-[#14142B] leading-tight mb-2">
                A study guide built from <span className="italic">your</span> class
              </h1>
              <p className="text-sm text-[#6B6A8A] max-w-xl mx-auto leading-relaxed">
                Atlas writes you a study guide using your actual lectures, slides,
                and syllabus — with every claim cited to where your professor
                said it. No generic Wikipedia summaries.
              </p>
            </div>

            {/* Hero — primary CTA */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#534AB7] via-[#5B4FBC] to-[#7B6FE8] rounded-3xl mb-7 shadow-xl shadow-[#534AB7]/20 p-7 md:p-8">
              <Sparkles className="absolute top-6 right-12 w-4 h-4 text-white/30" />
              <Sparkles className="absolute bottom-10 right-1/3 w-3 h-3 text-white/30" />
              <Sparkles className="absolute top-1/2 left-12 w-3 h-3 text-white/20" />

              <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur text-white text-[11px] font-bold px-3 py-1.5 mb-3">
                    <Zap className="w-3 h-3" /> Auto-generated from your files
                  </span>
                  <h2 className="text-2xl md:text-[28px] font-extrabold text-white mb-2 leading-tight">
                    Drop your materials to get started
                  </h2>
                  <p className="text-[13px] text-white/85 leading-relaxed max-w-md mb-5">
                    Upload your syllabus, lecture slides, or audio recordings.
                    Atlas turns them into a clean, citable study guide tailored
                    to your class.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href="/upload"
                      className="inline-flex items-center gap-2 bg-white hover:bg-[#F4F2FF] text-[#534AB7] px-5 py-2.5 rounded-xl font-extrabold text-sm shadow-lg transition-all active:scale-95">
                      <Upload className="w-4 h-4" /> Upload materials <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/classes"
                      className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 text-white px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all active:scale-95">
                      <BookOpen className="w-4 h-4" /> Browse classes
                    </Link>
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center w-[150px] h-[150px] rounded-3xl bg-white/10 backdrop-blur border border-white/20">
                  <BookOpen className="w-16 h-16 text-white/90" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Locked sample guide preview */}
            <div className="relative bg-white border border-[#ECE9FF] rounded-2xl mb-7 shadow-sm overflow-hidden">

              {/* Header bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#ECE9FF] bg-[#FAFAFE]">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#534AB7]" />
                  <h3 className="text-sm font-extrabold text-[#14142B]">Sample study guide</h3>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider bg-[#F4F2FF] text-[#534AB7] px-2 py-1 rounded-full">
                  <Lock className="w-3 h-3" /> Preview
                </span>
              </div>

              {/* Sample content — faded but readable, no overlay on top */}
              <div className="relative p-5 opacity-[0.55] pointer-events-none">
                {/* Top fade gradient hint */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-white pointer-events-none" />

                {/* Section header */}
                <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-[#ECE9FF]">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[#1A1A2E]">Cell Division &amp; Mitosis</p>
                    <p className="text-[11px] text-[#9B9AB5]">Biology 101 · Unit 2 · 4 citations</p>
                  </div>
                </div>

                {/* Paragraph with citation markers */}
                <p className="text-[13px] text-[#3A3A52] leading-relaxed mb-3">
                  Mitosis is the process by which a single cell divides into two
                  genetically identical daughter cells.
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#534AB7] text-white text-[9px] font-extrabold ml-1 align-super">1</span>
                  {' '}Professor Smith emphasized that the four phases — prophase,
                  metaphase, anaphase, and telophase — make up only ~10% of the
                  cell cycle.
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#534AB7] text-white text-[9px] font-extrabold ml-1 align-super">2</span>
                </p>

                {/* Citation card */}
                <div className="flex items-start gap-2 bg-[#FAFAFE] border border-[#ECE9FF] rounded-lg p-2.5">
                  <Quote className="w-3 h-3 text-[#534AB7] flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-[#534AB7]">Cited from: Lecture 8 — slide 14</p>
                    <p className="text-[11.5px] text-[#6B6A8A] mt-0.5 italic">
                      &ldquo;Remember, mitosis is M-phase — quick, but everything else builds toward it…&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom CTA bar — clearly separated, doesn't overlap content */}
              <div className="border-t border-[#ECE9FF] bg-gradient-to-r from-[#F4F2FF] via-white to-[#F4F2FF] px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/30 flex-shrink-0">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-extrabold text-[#14142B]">Your guide will look like this</p>
                    <p className="text-[11.5px] text-[#6B6A8A]">Every claim cited from your own materials.</p>
                  </div>
                </div>
                <Link
                  href="/upload"
                  className="inline-flex items-center gap-1.5 bg-[#534AB7] hover:bg-[#3F3795] text-white text-[12.5px] font-extrabold px-4 py-2 rounded-lg shadow-md shadow-[#534AB7]/25 transition-all active:scale-95 flex-shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload
                </Link>
              </div>
            </div>

            {/* 5 modes — what you can do with a study guide */}
            <div className="mb-7">
              <p className="text-[11px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-3">
                Five ways to study every guide
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { icon: BookOpen,      color: 'bg-[#534AB7]',   label: 'Read',       desc: 'Clean prose, organised by topic' },
                  { icon: Volume2,       color: 'bg-blue-500',    label: 'Listen',     desc: 'Hear it read aloud' },
                  { icon: Brain,         color: 'bg-emerald-500', label: 'Quiz me',    desc: 'Auto-generated quiz' },
                  { icon: MessageSquare, color: 'bg-orange-500',  label: 'Teach back', desc: 'Explain in your words' },
                  { icon: Sparkles,      color: 'bg-rose-500',    label: 'Ask',        desc: 'Chat about anything' },
                ].map((c) => (
                  <div key={c.label} className="bg-white border border-[#ECE9FF] rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-shadow text-center">
                    <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center shadow-md mx-auto mb-2`}>
                      <c.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-[13px] font-extrabold text-[#1A1A2E] mb-0.5">{c.label}</p>
                    <p className="text-[11px] text-[#6B6A8A] leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why this beats generic guides */}
            <div className="mb-7">
              <p className="text-[11px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-3">
                Why Atlas beats generic guides
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-[#ECE9FF] rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#534AB7] flex items-center justify-center shadow-md">
                      <Quote className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-[13px] font-extrabold text-[#1A1A2E]">Every claim cited</p>
                  </div>
                  <p className="text-[12px] text-[#6B6A8A] leading-relaxed">Tap any sentence to see exactly which lecture or slide it came from.</p>
                </div>
                <div className="bg-white border border-[#ECE9FF] rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-[13px] font-extrabold text-[#1A1A2E]">Your professor&apos;s emphasis</p>
                  </div>
                  <p className="text-[12px] text-[#6B6A8A] leading-relaxed">Highlights topics your prof mentioned repeatedly — not just textbook basics.</p>
                </div>
                <div className="bg-white border border-[#ECE9FF] rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-md">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-[13px] font-extrabold text-[#1A1A2E]">Honest about gaps</p>
                  </div>
                  <p className="text-[12px] text-[#6B6A8A] leading-relaxed">If your materials don&apos;t cover something, Atlas says so. Never bluffs.</p>
                </div>
              </div>
            </div>

            {/* Reassurance band */}
            <div className="bg-[#F4F2FF] border border-[#E8E5FD] rounded-2xl px-5 py-4 flex items-start gap-3.5">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <RefreshCw className="w-4 h-4 text-[#534AB7]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-extrabold text-[#1A1A2E]">Always up to date</p>
                <p className="text-[12px] text-[#6B6A8A] leading-relaxed">
                  Upload a new lecture mid-semester? Your study guide regenerates automatically.
                </p>
              </div>
            </div>

          </div>
        </div>
      </AppLayout>
    );
  }

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

  const handlePrint = () => {
    showToast('📄 Preparing PDF…', 'bg-gray-700');
    setTimeout(() => window.print(), 600);
  };

  const completedCount = sections.filter((s) => s.completed).length;
  const progressPct    = Math.round((completedCount / sections.length) * 100);

  const MODES = [
    { id:'read'  as StudyMode, icon:BookOpen,      label:'Read'       },
    { id:'listen'as StudyMode, icon:Volume2,       label:'Listen'     },
    { id:'quiz'  as StudyMode, icon:Brain,         label:'Quiz me'    },
    { id:'teach' as StudyMode, icon:MessageSquare, label:'Teach back' },
    { id:'ask'   as StudyMode, icon:Sparkles,      label:'Ask'        },
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
                onClick={handlePrint}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-50 border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 px-3.5 py-2 rounded-xl transition-all shadow-sm">
                <Printer className="w-3.5 h-3.5" /> Export PDF
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
              <TeachBack />
            )}

            {/* ASK mode */}
            {mode === 'ask' && (
              <AskAI />
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
