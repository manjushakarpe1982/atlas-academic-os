'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import {
  CheckCircle2, XCircle, ChevronRight, ChevronLeft,
  RotateCcw, Trophy, BookOpen, AlertTriangle, Brain,
  Upload, Lock, Sparkles, Zap, Target, HelpCircle, TrendingUp,
} from 'lucide-react';

interface Question {
  id:number; question:string; options:string[];
  correct:number; explanation:string; source:string; quizWrong?:boolean;
}

const QUESTIONS: Question[] = [
  {
    id:1,
    question:'During which phase of mitosis does the nuclear envelope fully break down?',
    options:['Prophase','Prometaphase','Metaphase','Anaphase'],
    correct:1,
    explanation:'The nuclear envelope begins to break down in prophase but fully disintegrates during prometaphase. This is a common exam mistake — you answered "prophase" on Quiz 3.',
    source:'Lecture 11 · 14:18', quizWrong:true,
  },
  {
    id:2,
    question:'What is the correct order of mitosis phases?',
    options:[
      'Prophase → Metaphase → Prometaphase → Anaphase → Telophase',
      'Prophase → Prometaphase → Metaphase → Anaphase → Telophase',
      'Prometaphase → Prophase → Metaphase → Telophase → Anaphase',
      'Prophase → Prometaphase → Anaphase → Metaphase → Telophase',
    ],
    correct:1,
    explanation:'PPMAT: Prophase, Prometaphase, Metaphase, Anaphase, Telophase. This mnemonic was on the review sheet.',
    source:'Exam 2 Review Sheet · p.2',
  },
  {
    id:3,
    question:'What is the primary function of kinetochores during mitosis?',
    options:[
      'Duplicate DNA before cell division',
      'Break down the nuclear envelope',
      'Serve as attachment sites for spindle microtubules',
      'Synthesise proteins needed for cytokinesis',
    ],
    correct:2,
    explanation:'Kinetochores are protein complexes that assemble on centromeric DNA and serve as attachment points for spindle microtubules that pull chromosomes apart.',
    source:'Lecture 11 · 22:45',
  },
  {
    id:4,
    question:'Mitosis produces:',
    options:[
      '4 genetically diverse haploid cells',
      '2 genetically identical diploid cells',
      '4 genetically identical diploid cells',
      '2 genetically diverse haploid cells',
    ],
    correct:1,
    explanation:'Mitosis produces exactly 2 daughter cells that are genetically identical to the parent (diploid). Meiosis produces 4 haploid cells — a common confusion point.',
    source:'BIO101 Syllabus',
  },
  {
    id:5,
    question:'During which phase do sister chromatids separate and move to opposite poles?',
    options:['Metaphase','Prometaphase','Anaphase','Telophase'],
    correct:2,
    explanation:'Anaphase is when kinetochore microtubules shorten, pulling sister chromatids apart toward opposite poles. Dr. Smith emphasised this phase 3× in Lecture 11.',
    source:'Lecture 11 · 28:30',
  },
];

type AnswerState = 'unanswered' | 'correct' | 'wrong';

/* ─── Results screen ─────────────────────────────────────────── */
function ResultsScreen({ answers, onRestart }: {
  answers: (number|null)[];
  onRestart: () => void;
}) {
  const score  = answers.filter((a,i) => a === QUESTIONS[i].correct).length;
  const total  = QUESTIONS.length;
  const pct    = Math.round((score / total) * 100);
  const wrong  = QUESTIONS.filter((_,i) => answers[i] !== null && answers[i] !== QUESTIONS[i].correct);

  const grade  = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F';
  const gradeColor = pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-amber-500' : 'text-red-500';
  const gradeBg    = pct >= 80 ? 'from-emerald-500 to-teal-500' : pct >= 60 ? 'from-amber-400 to-orange-500' : 'from-red-500 to-rose-500';
  const msg = pct >= 80 ? '🌟 Excellent work! Strong understanding of mitosis.' :
              pct >= 60 ? '📈 Good effort — review the missed questions below.' :
                          '💪 Keep studying — try the flashcards again first.';

  return (
    <AppLayout>
      <style>{`
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        @keyframes staggerIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
      `}</style>

      <div className="min-h-[80vh] flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-3xl" style={{ animation:'fadeSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>

          {/* ── Top hero card ─────────────────────────────────── */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-lg overflow-hidden mb-4"
            style={{ animation:'staggerIn 0.4s ease 0.1s both' }}>

            {/* Thin colour strip */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${gradeBg}`} />

            <div className="px-6 md:px-8 py-6">

              {/* Title row */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Quiz complete</p>
                  <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Mitosis</h2>
                  <p className="text-sm text-gray-400 mt-0.5">Biology 101 · {total} questions</p>
                </div>
                <div className="text-right flex-shrink-0" style={{ animation:'popIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both' }}>
                  <p className={`text-5xl md:text-6xl font-extrabold leading-none ${gradeColor}`}>{pct}%</p>
                  <p className="text-xs text-gray-400 mt-1">{score} of {total} correct</p>
                </div>
              </div>

              {/* Stat pills */}
              <div className="flex items-center gap-2.5 mb-5 flex-wrap">
                {[
                  { label:'Correct',   value:score,       color:'text-emerald-700', bg:'bg-emerald-50', border:'border-emerald-200', dot:'bg-emerald-500' },
                  { label:'Incorrect', value:total-score, color:'text-red-700',     bg:'bg-red-50',     border:'border-red-200',     dot:'bg-red-500'     },
                  { label:'Grade',     value:grade,       color:'text-indigo-700',  bg:'bg-indigo-50',  border:'border-indigo-200',  dot:'bg-indigo-500'  },
                ].map((s) => (
                  <div key={s.label} className={`flex items-center gap-2.5 ${s.bg} border ${s.border} rounded-xl px-4 py-2.5`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                    <div>
                      <p className={`text-base font-extrabold leading-none ${s.color}`}>{s.value}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-wide">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message + buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-600">{msg}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={onRestart}
                    className="flex items-center gap-1.5 border-2 border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 font-bold px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all text-sm whitespace-nowrap">
                    <RotateCcw className="w-3.5 h-3.5" /> Try again
                  </button>
                  <a href="/study-guide"
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-500/20 text-sm whitespace-nowrap">
                    <BookOpen className="w-3.5 h-3.5" /> Study guide
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Misconception detector ────────────────────────── */}
          {score < total && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🧠</span>
                <p className="text-sm font-extrabold text-red-800">Misconception detected</p>
              </div>
              <p className="text-xs text-red-600 mb-3">You got these wrong — Atlas detects a pattern, not just a knowledge gap:</p>
              <div className="space-y-2.5">
                {QUESTIONS.filter((_,i) => answers[i] !== QUESTIONS[i].correct).map((q, idx) => (
                  <div key={q.id} className="bg-white border border-red-100 rounded-xl px-3.5 py-3">
                    <p className="text-xs font-semibold text-gray-800 mb-1">"{q.question}"</p>
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-bold text-red-600 flex-shrink-0 mt-0.5">✗ You likely think:</span>
                      <p className="text-[11px] text-red-700">The answer is during Prophase — but it's actually <strong>Prometaphase</strong>. This is a common misconception: the nuclear envelope starts fragmenting in Prophase but fully breaks down in Prometaphase.</p>
                    </div>
                    <a href="/study-guide"
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
                      Fix this misconception → Study Guide
                    </a>
                  </div>
                )).slice(0,2)}
              </div>
            </div>
          )}

          {/* ── Per-question review ───────────────────────────── */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden"
            style={{ animation:'staggerIn 0.4s ease 0.45s both' }}>
            <div className="px-6 md:px-8 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-extrabold text-gray-900">Question review</p>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">✓ {score} correct</span>
                {total-score > 0 && <span className="flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">✗ {total-score} wrong</span>}
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {QUESTIONS.map((q, i) => {
                const userAns  = answers[i];
                const isRight  = userAns === q.correct;
                return (
                  <div key={q.id} className={`px-6 md:px-8 py-4 flex items-start gap-4 ${!isRight ? 'bg-red-50/30' : ''}`}>
                    {/* Status circle */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 mt-0.5 ${
                      isRight ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {isRight ? '✓' : '✗'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 mb-1.5 leading-snug">{q.question}</p>

                      {/* Compact answer comparison */}
                      <div className="flex flex-col sm:flex-row gap-1.5">
                        <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg">
                          ✓ {q.options[q.correct]}
                        </span>
                        {!isRight && userAns !== null && (
                          <span className="text-[11px] bg-red-100 text-red-800 font-semibold px-2.5 py-1 rounded-lg">
                            ✗ {q.options[userAns]}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] text-gray-400 flex-shrink-0 hidden sm:inline mt-1">Q{i+1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function QuizPage() {
  const [index,    setIndex]    = useState(0);
  const [selected, setSelected] = useState<number|null>(null);
  const [answered, setAnswered] = useState<AnswerState>('unanswered');
  const [answers,  setAnswers]  = useState<(number|null)[]>(Array(QUESTIONS.length).fill(null));
  const [done,     setDone]     = useState(false);

  // Quiz is generated from uploaded materials. Without materials there are
  // no questions to answer — show empty state.
  const [hasQuiz, setHasQuiz] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('atlas_has_quiz') === 'true') {
      setHasQuiz(true);
    }
  }, []);

  /* ─────────────────────────────────────────────────────────────
   * EMPTY STATE — no quiz to take yet.
   * Compact, dashboard-feel composition (different from study-guide).
   * ───────────────────────────────────────────────────────────── */
  if (!hasQuiz) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#F5F5FB] p-4 md:p-8">
          <div className="max-w-[960px] mx-auto">

            {/* ── Hero card — lavender bg with Quizpage1.webp full-width illustration ── */}
            <div className="relative overflow-hidden bg-[#F4F2FF] border border-[#E8E5FD] rounded-xl shadow-sm mb-3 min-h-[210px]">
              {/* Full-width background illustration */}
              <img
                src="https://res.cloudinary.com/mview/image/upload/atlas/quizpage1.webp"
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none"
              />
           

              {/* Foreground content */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-5 p-4 md:px-5">
                <div className="flex items-center gap-4 max-w-[60%]">
                  {/* Purple help-circle icon tile */}
                  <div className="w-14 h-14 rounded-2xl mt-3 bg-gradient-to-br from-[#534AB7] to-[#7B6FE8] flex items-center justify-center shadow-lg shadow-[#534AB7]/30 flex-shrink-0">
                    <HelpCircle className="w-7 h-7 text-white" />
                  </div>
                  <div className="min-w-0">
<p className="inline-flex items-center px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold uppercase tracking-wider border border-violet-200">
  Quiz
</p>                    <h1 className="text-xl md:text-2xl font-extrabold text-[#14142B] leading-tight">
                      No questions ready yet
                    </h1>
                    <p className="text-base text-[#6B6A8A] mt-1 leading-relaxed">
                      Upload course materials and Atlas writes a quiz tailored to what your professor covers.
                    </p>
                  </div>
                </div>

                {/* Upload button on the right */}
                <Link
                  href="/upload"
                  className="inline-flex  items-center gap-2 bg-[#534AB7] hover:bg-[#3F3795] text-white px-2 py-2 rounded-xl font-extrabold text-sm shadow-md shadow-[#534AB7]/25 transition-all active:scale-95 flex-shrink-0"
                >
                  <Upload className="w-4 h-4" /> Upload materials
                </Link>
              </div>
            </div>

            {/* ── Stat strip — separate card, 3 colored stat tiles ───────── */}
            <div className="bg-white border border-[#ECE9FF] rounded-xl shadow-sm mb-6">
              <div className="grid grid-cols-3 divide-x divide-[#ECE9FF]">
                {[
                  { label:'Questions',    value:'0', icon: BookOpen,    iconColor: 'text-[#534AB7]',   iconBg: 'bg-[#F4F2FF]' },
                  { label:'Avg score',    value:'—', icon: TrendingUp,  iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
                  { label:'Quizzes taken',value:'0', icon: Trophy,      iconColor: 'text-orange-600',  iconBg: 'bg-orange-50' },
                ].map((s) => (
                  <div key={s.label} className="px-4 py-4 flex items-center justify-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${s.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <s.icon className={`w-6 h-6 ${s.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-xl font-extrabold text-[#14142B] leading-none">{s.value}</p>
                      <p className="text-[13px] font-bold text-[#9B9AB5] uppercase tracking-wider mt-1">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Sample question — clearly marked as a non-functional preview ── */}
            <div className="relative bg-white border-2 border-dashed border-[#D8D3FF] rounded-3xl shadow-sm overflow-hidden mb-6">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#ECE9FF] bg-[#F4F2FF]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#534AB7]" />
                  <h3 className="text-sm font-extrabold text-[#14142B]">A glimpse of what Atlas writes</h3>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider bg-white text-[#534AB7] px-2 py-1 rounded-full border border-[#D8D3FF]">
                  <Lock className="w-3 h-3" /> Read-only preview
                </span>
              </div>

              {/* The question — obviously a preview */}
              <div className="relative p-6 opacity-[0.6] pointer-events-none select-none">
                <p className="text-[11px] font-bold text-[#534AB7] uppercase tracking-widest mb-2">Question 1 of 10</p>
                <h4 className="text-base md:text-lg font-extrabold text-[#1A1A2E] leading-snug mb-5">
                  During which phase of mitosis does the nuclear envelope fully break down?
                </h4>
                <div className="space-y-2">
                  {[
                    { letter: 'A', text: 'Prophase' },
                    { letter: 'B', text: 'Prometaphase', highlight: true },
                    { letter: 'C', text: 'Metaphase' },
                    { letter: 'D', text: 'Anaphase' },
                  ].map((opt) => (
                    <div
                      key={opt.letter}
                      className={`flex items-center gap-3 border rounded-xl px-4 py-3 ${
                        opt.highlight
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-white border-[#ECE9FF]'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-extrabold flex-shrink-0 ${
                        opt.highlight ? 'bg-emerald-500 text-white' : 'bg-[#F4F2FF] text-[#534AB7]'
                      }`}>
                        {opt.letter}
                      </span>
                      <span className={`text-[13.5px] font-semibold ${opt.highlight ? 'text-emerald-900' : 'text-[#3A3A52]'}`}>
                        {opt.text}
                      </span>
                      {opt.highlight && <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto" />}
                    </div>
                  ))}
                </div>
                <p className="text-[11.5px] text-[#9B9AB5] mt-4 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> From: Lecture 11 · 14:18
                </p>
              </div>

              {/* Footer CTA bar — makes the locked state unmistakable + actionable */}
              <div className="border-t border-[#ECE9FF] bg-gradient-to-r from-[#F4F2FF] via-white to-[#F4F2FF] px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/30 flex-shrink-0">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[16px] font-extrabold text-[#14142B]">This is just a sample</p>
                    <p className="text-[13px] text-[#6B6A8A]">Upload materials to get your real quiz.</p>
                  </div>
                </div>
                <Link
                  href="/upload"
                  className="inline-flex items-center gap-1.5 bg-[#534AB7] hover:bg-[#3F3795] text-white text-[14px] font-extrabold px-4 py-2 rounded-lg shadow-md shadow-[#534AB7]/25 transition-all active:scale-95 flex-shrink-0"
                >
                  <Upload className="w-4 h-4" /> Upload
                </Link>
              </div>
            </div>

            {/* ── 3 horizontal feature strips (different layout than other pages) ── */}
            <div className="space-y-2.5 mb-6">
              {[
                {
                  icon: Sparkles, color: 'bg-[#534AB7]',
                  title: 'Built from your lectures',
                  desc: 'Atlas writes questions from your professor\'s emphasis, not a generic question bank.',
                },
                {
                  icon: Target, color: 'bg-emerald-500',
                  title: 'Focused on your weak spots',
                  desc: 'Quizzes prioritise topics you missed last time — adaptive, not random.',
                },
                {
                  icon: Brain, color: 'bg-blue-500',
                  title: 'Wrong answers become flashcards',
                  desc: 'Anything you miss is automatically queued for spaced-repetition review.',
                },
              ].map((s) => (
                <div key={s.title} className="bg-white border border-[#ECE9FF] rounded-xl px-5 py-4 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-extrabold text-[#1A1A2E] mb-0.5">{s.title}</p>
                    <p className="text-[13.5px] text-[#6B6A8A] leading-relaxed">{s.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#9B9AB5] flex-shrink-0 mt-1" />
                </div>
              ))}
            </div>

            {/* Footer — secondary action + privacy line */}
            <div className="flex items-center justify-between gap-3 text-[14px] text-[#9B9AB5] px-2">
              <p className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#534AB7]" />
                Quizzes regenerate every time you upload new material.
              </p>
              <Link
                href="/flashcards"
                className="font-bold text-[15px] text-[#534AB7] hover:underline whitespace-nowrap"
              >
                See flashcards →
              </Link>
            </div>

          </div>
        </div>
      </AppLayout>
    );
  }

  const q     = QUESTIONS[index];
  const total = QUESTIONS.length;

  // Web Audio API sound effects — no external files needed
  const playSound = (correct: boolean) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (correct) {
        // Correct — two ascending pleasant tones
        [0, 0.12].forEach((delay, i) => {
          const osc  = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(i === 0 ? 523 : 659, ctx.currentTime + delay); // C5 → E5
          gain.gain.setValueAtTime(0.25, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.25);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.25);
        });
      } else {
        // Wrong — classic game-show double buzz
        [0, 0.18].forEach((delay) => {
          const osc  = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'square';
          osc.frequency.setValueAtTime(160, ctx.currentTime + delay);
          gain.gain.setValueAtTime(0.45, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.14);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.14);
        });
      }
    } catch (_) { /* Audio not supported — fail silently */ }
  };

  const handleSelect = (opt:number) => {
    if (answered !== 'unanswered') return;
    const isCorrect = opt === q.correct;
    setSelected(opt);
    setAnswered(isCorrect ? 'correct' : 'wrong');
    setAnswers((p) => { const n=[...p]; n[index]=opt; return n; });
    playSound(isCorrect);
  };

  const goNext = () => {
    if (index + 1 >= total) { setDone(true); return; }
    setIndex((p) => p+1);
    const nextAns = answers[index+1];
    setSelected(nextAns);
    setAnswered(nextAns===null ? 'unanswered' : nextAns===QUESTIONS[index+1].correct ? 'correct' : 'wrong');
  };

  const goPrev = () => {
    if (index === 0) return;
    setIndex((p) => p-1);
    const prevAns = answers[index-1];
    setSelected(prevAns);
    setAnswered(prevAns===null ? 'unanswered' : prevAns===QUESTIONS[index-1].correct ? 'correct' : 'wrong');
  };

  const restart = () => {
    setIndex(0); setSelected(null); setAnswered('unanswered');
    setAnswers(Array(total).fill(null)); setDone(false);
  };

  if (done) return <ResultsScreen answers={answers} onRestart={restart} />;

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-[920px] mx-auto">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
              <span className="hover:text-indigo-600 cursor-pointer">Biology 101</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-indigo-600 font-semibold">Practice Quiz — Mitosis</span>
            </div>
            <h1 className="text-lg md:text-xl font-extrabold text-gray-900">Practice Quiz</h1>
            <p className="text-xs text-gray-400 mt-0.5">{total} questions · Mitosis</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-sm px-3.5 py-2 rounded-xl">
              {index+1} <span className="font-normal text-indigo-400">/ {total}</span>
            </div>
          </div>
        </div>

        {/* ── Progress dots + bar ───────────────────────────────── */}
        <div className="mb-5">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width:`${((index)/total)*100}%` }} />
          </div>
          <div className="flex gap-1.5">
            {QUESTIONS.map((_,i) => (
              <div key={i} className={`flex-1 h-2 rounded-full transition-all ${
                i === index        ? 'bg-indigo-400 animate-pulse' :
                answers[i] === null ? 'bg-gray-100' :
                answers[i] === QUESTIONS[i].correct ? 'bg-emerald-400' : 'bg-red-400'
              }`} />
            ))}
          </div>
        </div>

        {/* ── Main layout ──────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* Question area */}
          <div className="flex-1 min-w-0">

            {/* Quiz 3 flag */}
            {q.quizWrong && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <p className="text-xs font-semibold text-amber-800">You got this wrong on Quiz 3 — pay extra attention</p>
              </div>
            )}

            {/* Question card */}
            <div className="bg-white border-2 border-indigo-100 rounded-2xl p-5 md:p-6 mb-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                  Question {index+1} of {total}
                </span>
                <span className="text-[10px] text-gray-400 font-medium hidden sm:inline">📎 {q.source}</span>
              </div>
              <p className="text-base md:text-lg font-bold text-gray-900 leading-relaxed">{q.question}</p>
            </div>

            {/* Options */}
            <div className="space-y-2.5 mb-4">
              {q.options.map((opt,i) => {
                const isCorrect   = i === q.correct;
                const isSelected  = i === selected;
                const isWrong     = isSelected && !isCorrect && answered !== 'unanswered';
                const isRevealed  = answered !== 'unanswered';

                let cls = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer';
                if (isRevealed && isCorrect) cls = 'bg-emerald-50 border-2 border-emerald-400 text-emerald-900 cursor-default';
                else if (isWrong)            cls = 'bg-red-50 border-2 border-red-400 text-red-900 cursor-default';
                else if (isRevealed)         cls = 'bg-gray-50 border-2 border-gray-100 text-gray-400 cursor-default';

                let badge = 'bg-gray-100 text-gray-500';
                if (isRevealed && isCorrect)        badge = 'bg-emerald-500 text-white';
                else if (isWrong)                   badge = 'bg-red-500 text-white';

                return (
                  <button key={i} onClick={() => handleSelect(i)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all ${cls}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${badge}`}>
                      {isRevealed && isCorrect ? '✓' : isWrong ? '✗' : ['A','B','C','D'][i]}
                    </span>
                    <span className="text-sm font-medium flex-1 leading-snug">{opt}</span>
                    {isRevealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                    {isWrong                  && <XCircle     className="w-4 h-4 text-red-500     flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {answered !== 'unanswered' && (
              <div className={`rounded-2xl p-4 mb-5 border ${
                answered === 'correct'
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {answered === 'correct'
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    : <XCircle      className="w-4 h-4 text-red-600" />
                  }
                  <p className={`text-xs font-extrabold ${answered==='correct'?'text-emerald-800':'text-red-800'}`}>
                    {answered==='correct' ? '✓ Correct!' : '✗ Not quite'}
                  </p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{q.explanation}</p>
                <p className="text-[10px] text-gray-400 mt-2">📎 {q.source}</p>
              </div>
            )}

            {/* ── Navigation ───────────────────────────────────── */}
            <div className="flex items-center justify-between gap-3 pt-2">

              {/* Previous — always visible and properly styled */}
              <button onClick={goPrev} disabled={index===0}
                className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl border-2 transition-all
                  border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50
                  disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-600
                  shadow-sm">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {/* Next — only after answering */}
              {answered !== 'unanswered' ? (
                <button onClick={goNext}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20 text-sm">
                  {index+1>=total ? 'See results' : 'Next question'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <p className="text-xs text-gray-400 font-medium">Select an answer to continue</p>
              )}
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <div className="lg:w-[190px] lg:flex-shrink-0 space-y-3">

            {/* Question tracker */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Questions</p>
              <div className="space-y-1.5">
                {QUESTIONS.map((_,i) => (
                  <div key={i} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs transition-all ${
                    i===index ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 ${
                      i===index             ? 'bg-indigo-600 text-white shadow-sm' :
                      answers[i]===null     ? 'bg-gray-100 text-gray-400' :
                      answers[i]===QUESTIONS[i].correct ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {answers[i]===null ? i+1 : answers[i]===QUESTIONS[i].correct ? '✓' : '✗'}
                    </div>
                    <span className={`font-semibold ${
                      i===index ? 'text-indigo-700' :
                      answers[i]===null ? 'text-gray-400' :
                      answers[i]===QUESTIONS[i].correct ? 'text-emerald-700' : 'text-red-600'
                    }`}>Question {i+1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Score so far */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">So far</p>
              <div className="space-y-2 divide-y divide-gray-50">
                {[
                  { label:'Correct', value:answers.filter((a,i)=>a!==null&&a===QUESTIONS[i].correct).length, color:'text-emerald-600' },
                  { label:'Wrong',   value:answers.filter((a,i)=>a!==null&&a!==QUESTIONS[i].correct).length, color:'text-red-500' },
                  { label:'Left',    value:answers.filter((a)=>a===null).length,                              color:'text-indigo-600' },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between items-center pt-2 first:pt-0">
                    <span className="text-[11px] text-gray-400">{s.label}</span>
                    <span className={`text-sm font-extrabold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Brain className="w-3.5 h-3.5 text-indigo-600" />
                <p className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-widest">Tip</p>
              </div>
              <p className="text-[11px] text-indigo-600 leading-relaxed">
                Read each option carefully before selecting — common traps are subtle word changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
