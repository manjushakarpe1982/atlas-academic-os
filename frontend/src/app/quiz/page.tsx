'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  CheckCircle2, XCircle, ChevronRight,
  ChevronLeft, RotateCcw, Trophy, Clock,
  BookOpen, AlertTriangle,
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  source: string;
  quizWrong?: boolean;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'During which phase of mitosis does the nuclear envelope fully break down?',
    options: ['Prophase','Prometaphase','Metaphase','Anaphase'],
    correct: 1,
    explanation: 'The nuclear envelope begins to break down in prophase but fully disintegrates during prometaphase. This is a common exam mistake — you answered "prophase" on Quiz 3.',
    source: 'Lecture 11 · 14:18',
    quizWrong: true,
  },
  {
    id: 2,
    question: 'What is the correct order of mitosis phases?',
    options: [
      'Prophase → Metaphase → Prometaphase → Anaphase → Telophase',
      'Prophase → Prometaphase → Metaphase → Anaphase → Telophase',
      'Prometaphase → Prophase → Metaphase → Telophase → Anaphase',
      'Prophase → Prometaphase → Anaphase → Metaphase → Telophase',
    ],
    correct: 1,
    explanation: 'PPMAT: Prophase, Prometaphase, Metaphase, Anaphase, Telophase. This mnemonic was on the review sheet.',
    source: 'Exam 2 Review Sheet · p.2',
  },
  {
    id: 3,
    question: 'What is the primary function of kinetochores during mitosis?',
    options: [
      'Duplicate DNA before cell division',
      'Break down the nuclear envelope',
      'Serve as attachment sites for spindle microtubules',
      'Synthesise proteins needed for cytokinesis',
    ],
    correct: 2,
    explanation: 'Kinetochores are protein complexes that assemble on centromeric DNA and serve as attachment points for spindle microtubules that pull chromosomes apart.',
    source: 'Lecture 11 · 22:45',
  },
  {
    id: 4,
    question: 'Mitosis produces:',
    options: [
      '4 genetically diverse haploid cells',
      '2 genetically identical diploid cells',
      '4 genetically identical diploid cells',
      '2 genetically diverse haploid cells',
    ],
    correct: 1,
    explanation: 'Mitosis produces exactly 2 daughter cells that are genetically identical to the parent (diploid). Meiosis produces 4 haploid cells — a common confusion point.',
    source: 'BIO101 Syllabus',
  },
  {
    id: 5,
    question: 'During which phase do sister chromatids separate and move to opposite poles?',
    options: ['Metaphase','Prometaphase','Anaphase','Telophase'],
    correct: 2,
    explanation: 'Anaphase is when kinetochore microtubules shorten, pulling sister chromatids apart toward opposite poles. Dr. Smith emphasised this phase 3× in Lecture 11.',
    source: 'Lecture 11 · 28:30',
  },
];

type AnswerState = 'unanswered' | 'correct' | 'wrong';

export default function QuizPage() {
  const [index,       setIndex]     = useState(0);
  const [selected,    setSelected]  = useState<number | null>(null);
  const [answered,    setAnswered]  = useState<AnswerState>('unanswered');
  const [answers,     setAnswers]   = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [done,        setDone]      = useState(false);

  const q       = QUESTIONS[index];
  const score   = answers.filter((a, i) => a === QUESTIONS[i].correct).length;
  const pct     = Math.round((score / QUESTIONS.length) * 100);

  const handleSelect = (opt: number) => {
    if (answered !== 'unanswered') return;
    setSelected(opt);
    const isCorrect = opt === q.correct;
    setAnswered(isCorrect ? 'correct' : 'wrong');
    setAnswers((p) => { const n=[...p]; n[index]=opt; return n; });
  };

  const next = () => {
    if (index + 1 >= QUESTIONS.length) { setDone(true); return; }
    setIndex((p) => p + 1);
    setSelected(null);
    setAnswered('unanswered');
  };

  const restart = () => {
    setIndex(0); setSelected(null); setAnswered('unanswered');
    setAnswers(Array(QUESTIONS.length).fill(null)); setDone(false);
  };

  if (done) {
    return (
      <AppLayout>
        <div className="p-6 max-w-2xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              pct >= 80 ? 'bg-green-100' : pct >= 60 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <Trophy className={`w-8 h-8 ${pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600'}`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Quiz complete!</h2>
            <p className="text-gray-500 mb-6">Mitosis · {QUESTIONS.length} questions</p>
            <div className={`text-5xl font-extrabold mb-2 ${pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {pct}%
            </div>
            <p className="text-gray-400 mb-8">{score} of {QUESTIONS.length} correct</p>

            {/* Review wrong answers */}
            {answers.some((a, i) => a !== QUESTIONS[i].correct) && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-left">
                <p className="text-xs font-bold text-red-700 mb-3">Review wrong answers</p>
                {QUESTIONS.map((q, i) => answers[i] !== q.correct && (
                  <div key={q.id} className="mb-3 pb-3 border-b border-red-100 last:border-0 last:mb-0">
                    <p className="text-xs font-semibold text-red-800 mb-1">{q.question}</p>
                    <p className="text-[11px] text-red-600">Your answer: {q.options[answers[i]!]}</p>
                    <p className="text-[11px] text-green-700">Correct: {q.options[q.correct]}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button onClick={restart}
                className="flex items-center gap-2 border border-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all">
                <RotateCcw className="w-4 h-4" /> Try again
              </button>
              <a href="/study-guide"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20">
                <BookOpen className="w-4 h-4" /> Back to guide
              </a>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-[900px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-gray-400 mb-0.5">Biology 101 › Mitosis</p>
            <h1 className="text-xl font-bold text-gray-900">Practice Quiz</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
              {index + 1} / {QUESTIONS.length}
            </span>
          </div>
        </div>

        {/* Study flow */}
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-5 shadow-sm overflow-x-auto">
          <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap">Study flow:</span>
          {[
            { label:'📁 Upload',       href:'/upload',      active:false },
            { label:'📖 Study Guide',  href:'/study-guide', active:false },
            { label:'🃏 Flashcards',   href:'/flashcards',  active:false },
            { label:'❓ Quiz',         href:'/quiz',         active:true  },
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

        {/* Progress */}
        <div className="mb-6">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width:`${((index)/QUESTIONS.length)*100}%` }} />
          </div>
          <div className="flex gap-1 mt-2">
            {QUESTIONS.map((_, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full ${
                answers[i] === null ? 'bg-gray-100' :
                answers[i] === QUESTIONS[i].correct ? 'bg-green-400' : 'bg-red-400'
              }`} />
            ))}
          </div>
        </div>

        <div className="flex gap-5">
          {/* Question */}
          <div className="flex-1">

            {/* Quiz 3 flag */}
            {q.quizWrong && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <p className="text-xs font-semibold text-amber-800">You got this wrong on Quiz 3</p>
              </div>
            )}

            {/* Question card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4 shadow-sm">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-3">
                Question {index + 1} of {QUESTIONS.length}
              </p>
              <p className="text-base font-bold text-gray-900 leading-relaxed mb-1">{q.question}</p>
              <p className="text-[11px] text-gray-400">Source: {q.source}</p>
            </div>

            {/* Options */}
            <div className="space-y-2.5 mb-4">
              {q.options.map((opt, i) => {
                let style = 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50';
                if (answered !== 'unanswered') {
                  if (i === q.correct) style = 'bg-green-50 border-green-400 text-green-800';
                  else if (i === selected && i !== q.correct) style = 'bg-red-50 border-red-400 text-red-800';
                  else style = 'bg-gray-50 border-gray-100 text-gray-400 cursor-default';
                } else if (selected === i) {
                  style = 'bg-indigo-50 border-indigo-400 text-indigo-800';
                }
                return (
                  <button key={i} onClick={() => handleSelect(i)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${style}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      answered !== 'unanswered' && i === q.correct ? 'bg-green-500 text-white' :
                      answered !== 'unanswered' && i === selected && i !== q.correct ? 'bg-red-500 text-white' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {answered !== 'unanswered' && i === q.correct ? '✓' :
                       answered !== 'unanswered' && i === selected ? '✗' :
                       ['A','B','C','D'][i]}
                    </span>
                    <span className="text-sm font-medium flex-1">{opt}</span>
                    {answered !== 'unanswered' && i === q.correct && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    {answered !== 'unanswered' && i === selected && i !== q.correct && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {answered !== 'unanswered' && (
              <div className={`rounded-2xl p-4 mb-4 border ${
                answered === 'correct' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {answered === 'correct'
                    ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                    : <XCircle className="w-4 h-4 text-red-600" />
                  }
                  <p className={`text-xs font-bold ${answered === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                    {answered === 'correct' ? 'Correct!' : 'Not quite'}
                  </p>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{q.explanation}</p>
                <p className="text-[10px] text-gray-400 mt-2">📎 {q.source}</p>
              </div>
            )}

            {/* Next button */}
            <div className="flex justify-between">
              <button
                onClick={() => { if (index > 0) { setIndex((p) => p-1); setSelected(answers[index-1]); setAnswered(answers[index-1] !== null ? (answers[index-1] === QUESTIONS[index-1].correct ? 'correct' : 'wrong') : 'unanswered'); } }}
                disabled={index === 0}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {answered !== 'unanswered' && (
                <button onClick={next}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20">
                  {index + 1 >= QUESTIONS.length ? 'See results' : 'Next question'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-[180px] flex-shrink-0 space-y-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Progress</p>
              <div className="space-y-2">
                {QUESTIONS.map((_, i) => (
                  <div key={i} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] ${
                    i === index ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-400'
                  }`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold ${
                      answers[i] === null ? i === index ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-400' :
                      answers[i] === QUESTIONS[i].correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {answers[i] === null ? i+1 : answers[i] === QUESTIONS[i].correct ? '✓' : '✗'}
                    </div>
                    <span className="truncate">Q{i+1}</span>
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
