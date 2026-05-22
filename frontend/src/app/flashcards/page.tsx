'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  RotateCcw, ChevronRight, ChevronLeft,
  CheckCircle2, AlertTriangle, Brain,
  Sparkles, BookOpen, Copy, Keyboard,
} from 'lucide-react';

type Rating = 'again' | 'hard' | 'good' | 'easy';

interface Flashcard {
  id:number; front:string; back:string;
  source:string; quizWrong?:boolean;
}

const CARDS: Flashcard[] = [
  { id:1, front:'What are the 5 phases of mitosis in order?',                       back:'Prophase → Prometaphase → Metaphase → Anaphase → Telophase\n\nMemory tip: PPMAT',                                                                                          source:'Exam 2 Review Sheet · p.2'     },
  { id:2, front:'When does the nuclear envelope break down during mitosis?',         back:'Prometaphase — NOT prophase.\n\nThe envelope begins to break down in prophase but fully disintegrates in prometaphase.',                                               source:'Lecture 11 · 14:18',   quizWrong:true },
  { id:3, front:'What is the function of kinetochores?',                             back:'Kinetochores are protein complexes on centromeric DNA that serve as attachment sites for spindle microtubules.',                                                         source:'Lecture 11 · 22:45'           },
  { id:4, front:'At which phase do chromosomes align at the metaphase plate?',       back:'Metaphase.\n\nAll chromosomes align at the equatorial plane (metaphase plate) before being pulled apart.',                                                                source:'Lecture 11 Slides · Slide 12' },
  { id:5, front:'What is the spindle assembly checkpoint?',                          back:'A cell-cycle checkpoint during metaphase that verifies all kinetochores are properly attached to spindle microtubules before anaphase begins.',                           source:'Lecture 10 · 32:05'           },
  { id:6, front:'Mitosis produces ___ daughter cells that are ___ to the parent.',   back:'Two (2) daughter cells that are genetically identical to the parent cell.',                                                                                               source:'BIO101 Syllabus'              },
  { id:7, front:'What is the difference between a chromatid and a chromosome?',      back:'A chromosome is the entire DNA + protein structure.\n\nA chromatid is one copy of a duplicated chromosome — two sister chromatids are joined at the centromere.',        source:'Exam 2 Review Sheet · p.1'    },
  { id:8, front:'What happens during anaphase?',                                     back:'Sister chromatids are pulled apart toward opposite poles by shortening kinetochore microtubules. The cell also elongates during anaphase.',                                source:'Lecture 11 · 28:30'           },
];

const RATINGS = [
  { id:'again' as Rating, label:'Again', emoji:'😕', bg:'bg-red-50',    border:'border-red-300',    text:'text-red-700',    next:'Repeat now'  },
  { id:'hard'  as Rating, label:'Hard',  emoji:'😤', bg:'bg-orange-50', border:'border-orange-300', text:'text-orange-700', next:'2 days'      },
  { id:'good'  as Rating, label:'Good',  emoji:'😊', bg:'bg-emerald-50',border:'border-emerald-300',text:'text-emerald-700',next:'4 days'      },
  { id:'easy'  as Rating, label:'Easy',  emoji:'🚀', bg:'bg-blue-50',   border:'border-blue-300',   text:'text-blue-700',   next:'8 days'      },
];

/* ─── Session complete screen ────────────────────────────────── */
function SessionComplete({ total, correct, again, onRestart }: {
  total:number; correct:number; again:number; onRestart:()=>void;
}) {
  const score = Math.round((correct / total) * 100);
  return (
    <AppLayout>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div
          className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-xl w-full max-w-md text-center"
          style={{ animation: 'fadeSlideUp 0.45s cubic-bezier(0.16,1,0.3,1) both' }}
        >
          <style>{`
            @keyframes fadeSlideUp {
              from { opacity:0; transform:translateY(32px) scale(0.97); }
              to   { opacity:1; transform:translateY(0)    scale(1);    }
            }
            @keyframes popIn {
              0%   { transform: scale(0); opacity:0; }
              60%  { transform: scale(1.15); }
              100% { transform: scale(1); opacity:1; }
            }
            @keyframes countUp {
              from { opacity:0; transform:translateY(8px); }
              to   { opacity:1; transform:translateY(0);   }
            }
          `}</style>

          {/* Animated check icon */}
          <div
            className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200"
            style={{ animation: 'popIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both' }}
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <h2
            className="text-2xl font-extrabold text-gray-900 mb-1"
            style={{ animation: 'countUp 0.4s ease 0.3s both' }}
          >
            Session complete! 🎉
          </h2>
          <p
            className="text-sm text-gray-400 mb-7"
            style={{ animation: 'countUp 0.4s ease 0.4s both' }}
          >
            You reviewed all {total} cards on Mitosis
          </p>

          {/* Stat boxes */}
          <div className="grid grid-cols-3 gap-3 mb-7">
            {[
              { label:'Correct', value:correct,       color:'text-emerald-600', bg:'bg-emerald-50', border:'border-emerald-200', delay:'0.45s' },
              { label:'Again',   value:again,          color:'text-red-600',     bg:'bg-red-50',     border:'border-red-200',     delay:'0.52s' },
              { label:'Score',   value:`${score}%`,   color:'text-indigo-600',  bg:'bg-indigo-50',  border:'border-indigo-200',  delay:'0.59s' },
            ].map((s) => (
              <div
                key={s.label}
                className={`${s.bg} border ${s.border} rounded-2xl p-4`}
                style={{ animation: `countUp 0.4s ease ${s.delay} both` }}
              >
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Score message */}
          <div
            className={`rounded-2xl px-4 py-3 mb-6 text-sm font-semibold ${
              score >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              score >= 60 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-red-50 text-red-700 border border-red-200'
            }`}
            style={{ animation: 'countUp 0.4s ease 0.65s both' }}
          >
            {score >= 80 ? '🌟 Great work! Your retention is strong.' :
             score >= 60 ? '📈 Good progress — review the "Again" cards once more.' :
                           '💪 Keep going — repetition builds memory.'}
          </div>

          {/* Buttons */}
          <div
            className="flex gap-3 justify-center"
            style={{ animation: 'countUp 0.4s ease 0.7s both' }}
          >
            <button onClick={onRestart}
              className="flex items-center gap-2 border-2 border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-600 font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-all text-sm">
              <RotateCcw className="w-4 h-4" /> Restart
            </button>
            <a href="/quiz"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20 text-sm">
              Take a quiz <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function FlashcardsPage() {
  const [cards,   setCards]   = useState(CARDS.map((c) => ({ ...c, seen:false, rating:undefined as Rating|undefined })));
  const [index,   setIndex]   = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Keyboard shortcuts: Space = flip, 1=Again 2=Hard 3=Good 4=Easy, ←/→ navigate

  const [done,    setDone]    = useState(false);
  const [correct, setCorrect] = useState(0);
  const [again,   setAgain]   = useState(0);

  const total   = cards.length;
  const current = cards[index];
  const pct     = Math.round((index / total) * 100);

    useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (done) return;
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!flipped) setFlipped(true); }
      if (flipped) {
        if (e.key === '1') rate('again');
        if (e.key === '2') rate('hard');
        if (e.key === '3') rate('good');
        if (e.key === '4') rate('easy');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [flipped, done]);

  const rate = (r: Rating) => {
    setCards((p) => p.map((c, i) => i === index ? { ...c, seen:true, rating:r } : c));
    if (r === 'again') setAgain((p) => p + 1);
    else setCorrect((p) => p + 1);
    if (index + 1 >= total) { setDone(true); return; }
    setIndex((p) => p + 1);
    setFlipped(false);
  };

  const restart = () => {
    setCards(CARDS.map((c) => ({ ...c, seen:false, rating:undefined })));
    setIndex(0); setFlipped(false); setDone(false); setCorrect(0); setAgain(0);
  };

  if (done) return <SessionComplete total={total} correct={correct} again={again} onRestart={restart} />;

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-[1000px] mx-auto">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
              <span className="hover:text-indigo-600 cursor-pointer">Biology 101</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-indigo-600 font-semibold">Flashcards — Mitosis</span>
            </div>
            <h1 className="text-lg md:text-xl font-extrabold text-gray-900">Flashcards</h1>
            <p className="text-xs text-gray-400 mt-0.5">{total} cards · Spaced repetition</p>
          </div>
          <button onClick={restart}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 px-3 py-2 rounded-xl transition-all hover:bg-indigo-50 flex-shrink-0">
            <RotateCcw className="w-3.5 h-3.5" /> Restart
          </button>
        </div>

        {/* ── Progress bar ─────────────────────────────────────── */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>Card {index + 1} of {total}</span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-600 font-semibold">✓ {correct} correct</span>
              {again > 0 && <span className="text-red-500 font-semibold">↩ {again} again</span>}
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width:`${pct}%` }} />
          </div>
        </div>

        {/* ── Main layout ──────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* Card area — flex-1 but capped */}
          <div className="flex-1 min-w-0 max-w-full lg:max-w-[640px]">

            {/* Quiz warning */}
            {current.quizWrong && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <p className="text-xs font-semibold text-amber-800">
                  You got this wrong on Quiz 3 — pay extra attention
                </p>
              </div>
            )}

            {/* ── Flash card ───────────────────────────────────── */}
            <div
              onClick={() => !flipped && setFlipped(true)}
              className={`relative rounded-3xl border-2 transition-all duration-200 cursor-pointer select-none overflow-hidden ${
                flipped
                  ? 'border-emerald-300 shadow-lg shadow-emerald-500/10'
                  : 'border-indigo-200 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 shadow-md'
              }`}
              style={{ minHeight: 260 }}
            >
              {/* Gradient top strip */}
              <div className={`h-1.5 w-full ${flipped ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`} />

              <div className={`p-6 md:p-8 flex flex-col h-full ${flipped ? 'bg-emerald-50/20' : 'bg-white'}`}>
                {/* Card label + source */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest ${
                    flipped ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {flipped ? 'Answer' : 'Question'}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium hidden sm:inline">📎 {current.source}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(flipped ? current.back : current.front); }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-all group" title="Copy to clipboard">
                    <Copy className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex items-center">
                  {!flipped ? (
                    <p className="text-base md:text-lg font-semibold text-gray-900 leading-relaxed">
                      {current.front}
                    </p>
                  ) : (
                    <p className="text-base font-semibold text-gray-900 leading-relaxed whitespace-pre-line">
                      {current.back}
                    </p>
                  )}
                </div>

                {/* Flip hint */}
                {!flipped && (
                  <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-indigo-50">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                      <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                    <p className="text-xs text-indigo-400 font-medium">Tap to reveal answer</p>
                  </div>
                )}
              </div>
            </div>

            {/* Keyboard hint */}
            <p className="text-center text-[10px] text-gray-400 mt-2 hidden sm:block">
              <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-[9px] font-mono">Space</kbd> flip &nbsp;
              {flipped && <><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-[9px] font-mono">1</kbd>–<kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-[9px] font-mono">4</kbd> rate</>}
            </p>
            {flipped ? (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {RATINGS.map((r) => (
                  <button key={r.id} onClick={() => rate(r.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 md:p-4 rounded-2xl border-2 transition-all hover:shadow-md active:scale-95 ${r.bg} ${r.border}`}>
                    <span className="text-xl md:text-2xl">{r.emoji}</span>
                    <span className={`text-xs font-extrabold ${r.text}`}>{r.label}</span>
                    <span className={`text-[9px] font-medium ${r.text} opacity-70 hidden sm:block`}>{r.next}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-[11px] text-gray-400 mt-3">
                <p className="text-center text-[11px] text-gray-400 mt-3 font-medium">
                  Press <kbd className="bg-gray-100 border border-gray-200 text-gray-500 px-1.5 py-0.5 rounded-md text-[10px] font-mono mx-0.5">Space</kbd> or tap the card to flip
                </p>
              </p>
            )}

            {/* ── Navigation ───────────────────────────────────── */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 gap-2">
              <button
                onClick={() => { if (index > 0) { setIndex((p) => p-1); setFlipped(false); } }}
                disabled={index === 0}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 px-4 py-2.5 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button
                onClick={() => setFlipped((p) => !p)}
                className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 border-2 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-400 px-6 py-2.5 rounded-xl transition-all shadow-sm">
                <RotateCcw className="w-4 h-4" />
                {flipped ? 'See question' : 'Flip card'}
              </button>

              <button
                onClick={() => { if (index < total-1) { setIndex((p) => p+1); setFlipped(false); } }}
                disabled={index === total-1}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 px-4 py-2.5 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm">
                Skip <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <div className="lg:w-[200px] lg:flex-shrink-0 space-y-3">

            {/* Session stats */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Session</p>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-0 lg:space-y-2.5 lg:divide-y lg:divide-gray-50">
                {[
                  { label:'Reviewed',  value:index,       color:'text-gray-800'    },
                  { label:'Correct',   value:correct,     color:'text-emerald-600' },
                  { label:'Again',     value:again,       color:'text-red-500'     },
                  { label:'Remaining', value:total-index, color:'text-indigo-600'  },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between items-center lg:pt-2 first:lg:pt-0">
                    <span className="text-[11px] text-gray-400">{s.label}</span>
                    <span className={`text-sm font-extrabold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card queue */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Queue</p>
              <div className="space-y-1">
                {cards.map((c, i) => (
                  <div key={c.id}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-xl text-[11px] transition-all ${
                      i === index       ? 'bg-indigo-50 text-indigo-700 font-bold' :
                      c.seen && c.rating === 'again' ? 'text-red-500' :
                      c.seen            ? 'text-emerald-600' :
                                          'text-gray-400'
                    }`}>
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      i === index              ? 'bg-indigo-500' :
                      c.seen && c.rating === 'again' ? 'bg-red-400' :
                      c.seen                   ? 'bg-emerald-400' :
                                                 'bg-gray-200'
                    }`} />
                    <span className="truncate">{c.front.slice(0,30)}…</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What the ratings mean */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Brain className="w-3.5 h-3.5 text-indigo-600" />
                <p className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-widest">How rating works</p>
              </div>
              <div className="space-y-1.5">
                {RATINGS.map((r) => (
                  <div key={r.id} className="flex items-center gap-2">
                    <span className="text-sm">{r.emoji}</span>
                    <div>
                      <span className={`text-[10px] font-bold ${r.text}`}>{r.label}</span>
                      <span className="text-[10px] text-gray-400"> — {r.next}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-indigo-500 mt-2.5 leading-relaxed">
                Cards you mark "Again" come back sooner. This is spaced repetition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
