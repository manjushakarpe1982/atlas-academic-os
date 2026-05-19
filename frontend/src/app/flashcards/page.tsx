'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  RotateCcw, ChevronRight, ChevronLeft,
  CheckCircle2, XCircle, Clock, Zap,
  BookOpen, BarChart2, AlertTriangle,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────── */
type Rating = 'again' | 'hard' | 'good' | 'easy';
type CardMode = 'flashcard' | 'cram';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  source: string;
  quizWrong?: boolean;
  interval: number;
  seen: boolean;
  rating?: Rating;
}

/* ─── Mock cards ─────────────────────────────────────────────── */
const CARDS: Flashcard[] = [
  { id:1,  front:'What are the 5 phases of mitosis in order?',                                                       back:'Prophase → Prometaphase → Metaphase → Anaphase → Telophase\n\nMemory tip: PPMAT',                              source:'Exam 2 Review Sheet · p.2', interval:1,  seen:false },
  { id:2,  front:'When does the nuclear envelope break down during mitosis?',                                          back:'Prometaphase — NOT prophase. The envelope begins to break down in prophase but fully disintegrates in prometaphase.', source:'Lecture 11 · 14:18', interval:1, seen:false, quizWrong:true },
  { id:3,  front:'What is the function of kinetochores?',                                                             back:'Kinetochores are protein complexes on centromeric DNA that serve as attachment sites for spindle microtubules.',   source:'Lecture 11 · 22:45', interval:1, seen:false },
  { id:4,  front:'At which phase do chromosomes align at the metaphase plate?',                                       back:'Metaphase. All chromosomes align at the equatorial plane (metaphase plate) before being pulled apart.',            source:'Lecture 11 Slides · Slide 12', interval:1, seen:false },
  { id:5,  front:'What is the spindle assembly checkpoint?',                                                          back:'A cell-cycle checkpoint during metaphase that verifies all kinetochores are properly attached to spindle microtubules before anaphase begins.', source:'Lecture 10 · 32:05', interval:1, seen:false },
  { id:6,  front:'Mitosis produces ___ daughter cells that are ___ identical to the parent.',                         back:'Two (2) daughter cells that are genetically identical to the parent cell.',                                        source:'BIO101 Syllabus', interval:1, seen:false },
  { id:7,  front:'What is the difference between a chromatid and a chromosome?',                                      back:'A chromosome is the entire DNA + protein structure. A chromatid is one copy of a duplicated chromosome — two sister chromatids are joined at the centromere.', source:'Exam 2 Review Sheet · p.1', interval:1, seen:false },
  { id:8,  front:'What happens during anaphase?',                                                                     back:'Sister chromatids are pulled apart toward opposite poles of the cell by shortening kinetochore microtubules. The cell also elongates during anaphase.',    source:'Lecture 11 · 28:30', interval:1, seen:false },
];

const RATING_CONFIG = [
  { id:'again' as Rating, label:'Again',  emoji:'😕', bg:'bg-red-50',    border:'border-red-200',    text:'text-red-700',    desc:'< 1 day'  },
  { id:'hard'  as Rating, label:'Hard',   emoji:'😤', bg:'bg-orange-50', border:'border-orange-200', text:'text-orange-700', desc:'2 days'   },
  { id:'good'  as Rating, label:'Good',   emoji:'😊', bg:'bg-green-50',  border:'border-green-200',  text:'text-green-700',  desc:'4 days'   },
  { id:'easy'  as Rating, label:'Easy',   emoji:'🚀', bg:'bg-blue-50',   border:'border-blue-200',   text:'text-blue-700',   desc:'8 days'   },
];

export default function FlashcardsPage() {
  const [cards,     setCards]     = useState(CARDS);
  const [index,     setIndex]     = useState(0);
  const [flipped,   setFlipped]   = useState(false);
  const [mode,      setMode]      = useState<CardMode>('flashcard');
  const [done,      setDone]      = useState(false);
  const [correct,   setCorrect]   = useState(0);
  const [again,     setAgain]     = useState(0);

  const current = cards[index];
  const total   = cards.length;
  const progress= Math.round((index / total) * 100);

  const rate = (r: Rating) => {
    const updated = cards.map((c, i) =>
      i === index ? { ...c, seen: true, rating: r } : c
    );
    setCards(updated);
    if (r === 'again') setAgain((p) => p + 1);
    else setCorrect((p) => p + 1);

    if (index + 1 >= total) { setDone(true); return; }
    setIndex((p) => p + 1);
    setFlipped(false);
  };

  const restart = () => {
    setCards(CARDS.map((c) => ({ ...c, seen: false, rating: undefined })));
    setIndex(0); setFlipped(false); setDone(false); setCorrect(0); setAgain(0);
  };

  if (done) {
    return (
      <AppLayout>
        <div className="p-6 max-w-2xl mx-auto text-center">
          <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Session complete! 🎉</h2>
            <p className="text-gray-500 mb-6">You reviewed all {total} cards on Mitosis</p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label:'Correct', value: correct,       color:'text-green-600' },
                { label:'Again',   value: again,         color:'text-red-600'   },
                { label:'Score',   value:`${Math.round((correct/total)*100)}%`, color:'text-indigo-600' },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-2xl p-4">
                  <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={restart}
                className="flex items-center gap-2 border border-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all">
                <RotateCcw className="w-4 h-4" /> Restart
              </button>
              <a href="/quiz"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20">
                Take a quiz <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-[1000px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-gray-400 mb-0.5">Biology 101 › Mitosis</p>
            <h1 className="text-xl font-bold text-gray-900">Flashcards</h1>
          </div>
          {/* Mode */}
          <div className="flex items-center bg-white border border-gray-100 rounded-xl p-1 gap-1 shadow-sm">
            {([
              { id:'flashcard' as CardMode, label:'Flashcards' },
              { id:'cram'      as CardMode, label:'Cram 60s'   },
            ]).map((m) => (
              <button key={m.id} onClick={() => setMode(m.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === m.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                }`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Study flow */}
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-5 shadow-sm overflow-x-auto">
          <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap">Study flow:</span>
          {[
            { label:'📁 Upload',       href:'/upload',      active:false },
            { label:'📖 Study Guide',  href:'/study-guide', active:false },
            { label:'🃏 Flashcards',   href:'/flashcards',  active:true  },
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
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>Card {index + 1} of {total}</span>
            <span>{progress}% complete</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width:`${progress}%` }} />
          </div>
        </div>

        <div className="flex gap-5">
          {/* Card area */}
          <div className="flex-1">

            {/* Quiz 3 warning */}
            {current.quizWrong && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <p className="text-xs font-semibold text-amber-800">
                  You answered this wrong on Quiz 3 — pay extra attention
                </p>
              </div>
            )}

            {/* Card */}
            <div
              onClick={() => !flipped && setFlipped(true)}
              className={`bg-white border-2 rounded-3xl p-8 min-h-[280px] flex flex-col justify-between cursor-pointer transition-all shadow-md ${
                flipped
                  ? 'border-green-300 bg-green-50/30'
                  : 'border-indigo-200 hover:border-indigo-300 hover:shadow-lg'
              }`}
            >
              {/* Front */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    flipped ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {flipped ? 'Answer' : 'Question'}
                  </span>
                  <span className="text-xs text-gray-400">{current.source}</span>
                </div>

                {!flipped ? (
                  <p className="text-lg font-semibold text-gray-900 leading-relaxed">{current.front}</p>
                ) : (
                  <div>
                    <p className="text-base font-bold text-gray-900 mb-3 leading-relaxed whitespace-pre-line">{current.back}</p>
                  </div>
                )}
              </div>

              {/* Flip hint */}
              {!flipped && (
                <div className="text-center mt-4">
                  <p className="text-xs text-gray-400">Click to reveal answer</p>
                </div>
              )}
            </div>

            {/* Rating buttons */}
            {flipped && (
              <div className="grid grid-cols-4 gap-2.5 mt-4">
                {RATING_CONFIG.map((r) => (
                  <button key={r.id} onClick={() => rate(r.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all hover:shadow-md active:scale-95 ${r.bg} ${r.border}`}>
                    <span className="text-xl">{r.emoji}</span>
                    <span className={`text-xs font-bold ${r.text}`}>{r.label}</span>
                    <span className={`text-[10px] ${r.text} opacity-70`}>{r.desc}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => { if (index > 0) { setIndex((p) => p-1); setFlipped(false); } }}
                disabled={index === 0}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button onClick={() => setFlipped(!flipped)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all">
                <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Flip
              </button>
              <button
                onClick={() => { if (index < total-1) { setIndex((p) => p+1); setFlipped(false); } }}
                disabled={index === total-1}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                Skip <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-[200px] flex-shrink-0 space-y-4">

            {/* Session stats */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Session</p>
              <div className="space-y-2.5">
                {[
                  { label:'Reviewed',     value: index,              color:'text-gray-900'   },
                  { label:'Correct',      value: correct,            color:'text-green-600'  },
                  { label:'Again',        value: again,              color:'text-red-600'    },
                  { label:'Remaining',    value: total - index,      color:'text-indigo-600' },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between">
                    <span className="text-[11px] text-gray-500">{s.label}</span>
                    <span className={`text-[11px] font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card queue */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Queue</p>
              <div className="space-y-1.5">
                {cards.map((c, i) => (
                  <div key={c.id}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-all ${
                      i === index ? 'bg-indigo-50 text-indigo-700 font-bold' :
                      c.seen && c.rating === 'again' ? 'text-red-500' :
                      c.seen ? 'text-green-600' : 'text-gray-400'
                    }`}>
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      i === index ? 'bg-indigo-500' :
                      c.seen && c.rating === 'again' ? 'bg-red-400' :
                      c.seen ? 'bg-green-400' : 'bg-gray-200'
                    }`} />
                    <span className="truncate">{c.front.slice(0, 28)}…</span>
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
