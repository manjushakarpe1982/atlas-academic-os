'use client';

import { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Clock, AlertTriangle, ChevronRight, ChevronLeft,
  CheckCircle2, XCircle, Flag, RotateCcw,
  BookOpen, Trophy, Brain, Eye, EyeOff,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────── */
type Screen = 'intro' | 'exam' | 'results';

interface Question {
  id: number; topic: string; question: string;
  options: string[]; correct: number; explanation: string;
}

/* ─── 10 exam-style questions ────────────────────────────────── */
const QUESTIONS: Question[] = [
  { id:1,  topic:'Mitosis',              question:'During which phase does the nuclear envelope fully break down?',                              options:['Prophase','Prometaphase','Metaphase','Anaphase'],              correct:1, explanation:'The nuclear envelope fully disintegrates in prometaphase, not prophase.' },
  { id:2,  topic:'Mitosis',              question:'What is the correct order of mitosis phases?',                                               options:['Prophase → Metaphase → Anaphase → Telophase','Prophase → Prometaphase → Metaphase → Anaphase → Telophase','Prometaphase → Prophase → Metaphase → Anaphase','Prophase → Anaphase → Metaphase → Telophase'], correct:1, explanation:'PPMAT: Prophase, Prometaphase, Metaphase, Anaphase, Telophase.' },
  { id:3,  topic:'Mitosis',              question:'During anaphase, what pulls sister chromatids to opposite poles?',                           options:['Polar microtubules','Kinetochore microtubules','Astral fibres','Cytoplasm'],            correct:1, explanation:'Kinetochore microtubules shorten to pull chromatids apart during anaphase.' },
  { id:4,  topic:'Cell Biology',         question:'Mitosis produces:',                                                                          options:['4 haploid cells','2 identical diploid cells','4 identical diploid cells','2 haploid cells'], correct:1, explanation:'Mitosis produces 2 genetically identical diploid daughter cells.' },
  { id:5,  topic:'Enzyme Kinetics',      question:'What does the Km value represent in enzyme kinetics?',                                       options:['Maximum reaction rate','Substrate concentration at half Vmax','Enzyme concentration','Product inhibition constant'], correct:1, explanation:'Km (Michaelis constant) is the substrate concentration at which reaction rate is half of Vmax.' },
  { id:6,  topic:'Enzyme Kinetics',      question:'Competitive inhibition can be overcome by:',                                                 options:['Decreasing temperature','Increasing substrate concentration','Adding more enzyme','Decreasing pH'],             correct:1, explanation:'Competitive inhibitors compete with substrate — excess substrate outcompetes the inhibitor.' },
  { id:7,  topic:'Cellular Respiration', question:'How many ATP molecules are produced per glucose in aerobic respiration?',                    options:['2','10','30–32','38–40'],                                      correct:2, explanation:'Aerobic respiration yields approximately 30–32 ATP per glucose molecule.' },
  { id:8,  topic:'Cellular Respiration', question:'Where does the Krebs cycle occur?',                                                          options:['Cytoplasm','Nucleus','Mitochondrial matrix','Inner mitochondrial membrane'], correct:2, explanation:'The Krebs cycle takes place in the mitochondrial matrix.' },
  { id:9,  topic:'DNA Replication',      question:'Which enzyme is responsible for unwinding the DNA double helix during replication?',         options:['DNA polymerase','DNA ligase','Helicase','Primase'],             correct:2, explanation:'Helicase unwinds and separates the two DNA strands at the replication fork.' },
  { id:10, topic:'DNA Replication',      question:'DNA replication is described as semi-conservative because:',                                 options:['Each new strand is entirely new','Each new DNA molecule has one original and one new strand','Both strands are copied simultaneously','Only one strand is used as a template'], correct:1, explanation:'Semi-conservative means each daughter DNA molecule keeps one original strand and one newly synthesised strand.' },
];

const EXAM_DURATION = 20 * 60; // 20 minutes in seconds

/* ─── Topic & type config ───────────────────────────────────── */
const TOPIC_OPTIONS = [
  { id:'mitosis',     label:'Mitosis',              questions:3, mastery:28, weak:true  },
  { id:'enzyme',      label:'Enzyme Kinetics',       questions:2, mastery:35, weak:true  },
  { id:'respiration', label:'Cellular Respiration',  questions:3, mastery:44, weak:true  },
  { id:'dna',         label:'DNA Replication',       questions:2, mastery:65, weak:false },
];

const EXAM_TYPES = [
  { id:'mcq',     emoji:'☑',  label:'MCQ',            desc:'4-option multiple choice'      },
  { id:'written', emoji:'✍️', label:'Written',         desc:'Answer in your own words'      },
  { id:'solve',   emoji:'🔢', label:'Solve / Numeric', desc:'Calculate or fill a formula'   },
];

/* ─── Intro screen ───────────────────────────────────────────── */
function IntroScreen({ onStart }: { onStart: (topics:string[], type:string) => void }) {
  const [selectedTopics, setSelectedTopics] = useState(['mitosis','enzyme','respiration','dna']);
  const [examType,       setExamType]       = useState('mcq');

  const toggleTopic = (id: string) =>
    setSelectedTopics((p) =>
      p.includes(id) ? (p.length > 1 ? p.filter((t) => t !== id) : p) : [...p, id]
    );

  const totalQ  = TOPIC_OPTIONS.filter((t) => selectedTopics.includes(t.id)).reduce((s,t) => s+t.questions, 0);
  const estMins = Math.max(5, totalQ * 2);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-100"
        style={{ animation:'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }`}</style>

        {/* Header strip */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-indigo-50">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">Biology 101</p>
            <h1 className="text-base font-extrabold text-gray-900 leading-tight">Set up your Exam</h1>
          </div>
        </div>

        {/* Two-column body */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">

          {/* Left — Topics */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-extrabold flex items-center justify-center flex-shrink-0">1</span>
              <p className="text-[11px] font-extrabold text-gray-700 uppercase tracking-widest">Select topics</p>
            </div>
            <div className="space-y-1.5">
              {TOPIC_OPTIONS.map((t) => {
                const isOn = selectedTopics.includes(t.id);
                return (
                  <button key={t.id} onClick={() => toggleTopic(t.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 transition-all text-left ${
                      isOn ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-200'
                    }`}>
                    <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                      isOn ? 'bg-indigo-600' : 'border-2 border-gray-300 bg-white'
                    }`}>
                      {isOn && <CheckCircle2 className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-xs font-semibold leading-none ${isOn?'text-indigo-900':'text-gray-700'}`}>{t.label}</p>
                        {t.weak && <span className="text-[8px] font-bold bg-red-100 text-red-600 px-1 py-0.5 rounded-full flex-shrink-0">Weak</span>}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-14 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${t.mastery<40?'bg-red-500':t.mastery<65?'bg-amber-500':'bg-emerald-500'}`} style={{ width:`${t.mastery}%` }} />
                        </div>
                        <span className="text-[9px] text-gray-400">{t.mastery}%</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold flex-shrink-0 ${isOn?'text-indigo-600':'text-gray-400'}`}>{t.questions}Q</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right — Type + summary + start */}
          <div className="p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-extrabold flex items-center justify-center flex-shrink-0">2</span>
              <p className="text-[11px] font-extrabold text-gray-700 uppercase tracking-widest">Question type</p>
            </div>
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {EXAM_TYPES.map((et) => (
                <button key={et.id} onClick={() => setExamType(et.id)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all text-center ${
                    examType === et.id ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-200'
                  }`}>
                  <span className="text-lg">{et.emoji}</span>
                  <p className={`text-[10px] font-extrabold leading-tight ${examType===et.id?'text-indigo-700':'text-gray-700'}`}>{et.label}</p>
                  <p className={`text-[8px] leading-tight ${examType===et.id?'text-indigo-500':'text-gray-400'}`}>{et.desc}</p>
                </button>
              ))}
            </div>

            {examType !== 'mcq' && (
              <div className="flex items-start gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-2.5 py-2 mb-3">
                <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-700 leading-snug">
                  {examType==='written' ? 'Self-graded after submitting.' : 'Enter exact values or formulas.'}
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 mb-3 mt-auto">
              <span className="text-xs font-bold text-gray-700">📝 {totalQ} questions</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs font-bold text-gray-700">⏱ ~{estMins}m</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs font-bold text-gray-700">{selectedTopics.length}/{TOPIC_OPTIONS.length} topics</span>
            </div>

            <button onClick={() => onStart(selectedTopics, examType)} disabled={selectedTopics.length===0}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 active:scale-[0.98] text-white font-extrabold py-3 rounded-xl transition-all shadow-md shadow-indigo-500/20 text-sm">
              <Brain className="w-4 h-4" /> Start — {totalQ} questions
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-2">🔒 Answers shown after submit</p>
          </div>
        </div>
      </div>
    </div>
  );
}



/* ─── Results screen ─────────────────────────────────────────── */
function ResultsScreen({ answers, flagged, timeTaken, onRetry, writtenAnswers, examType }: {
  answers: (number|null)[]; flagged: boolean[];
  timeTaken: number; onRetry: () => void;
  writtenAnswers?: string[]; examType?: string;
}) {
  const [selfGrades,   setSelfGrades]   = useState<Record<number,number>>({});
  const [showReflect,  setShowReflect]  = useState(true);
  const [confidence,   setConfidence]   = useState(0);
  const [feeling,      setFeeling]      = useState('');
  const [surprise,     setSurprise]     = useState('');
  const [reflectDone,  setReflectDone]  = useState(false);
  const isWritten = examType === 'written' || examType === 'solve';

  const score  = isWritten
    ? Object.values(selfGrades).filter((g) => g >= 3).length
    : answers.filter((a,i) => a === QUESTIONS[i].correct).length;
  const total  = QUESTIONS.length;
  const pct    = Math.round((score / total) * 100);
  const mins   = Math.floor(timeTaken / 60);
  const secs   = timeTaken % 60;
  const grade  = pct>=90?'A':pct>=80?'B':pct>=70?'C':pct>=60?'D':'F';
  const gradeColor = pct>=80?'text-emerald-600':pct>=60?'text-amber-500':'text-red-500';
  const gradeBg    = pct>=80?'bg-gradient-to-r from-emerald-500 to-teal-500':pct>=60?'bg-gradient-to-r from-amber-400 to-orange-500':'bg-gradient-to-r from-red-500 to-rose-500';
  const msg = pct>=80?'🌟 Excellent! Strong understanding of the material.':pct>=60?'📈 Good effort — review the wrong answers below.':'💪 Keep studying — focus on the red topics.';

  return (
    <div className="p-4 md:p-6 max-w-[860px] mx-auto"
      style={{ animation:'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }`}</style>

      {/* ── Result hero card ─────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-lg overflow-hidden mb-4">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
        <div className="px-6 md:px-8 py-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Exam complete</p>
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Biology 101 Simulation</h2>
              <p className="text-sm text-gray-400 mt-0.5">Cell Biology &amp; Metabolism · {total} questions</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`text-5xl md:text-6xl font-extrabold leading-none ${gradeColor}`}>{pct}%</p>
              <p className="text-xs text-gray-400 mt-1">{score} of {total} correct</p>
            </div>
          </div>

          {/* Stat pills */}
          <div className="flex items-center gap-2.5 mb-5 flex-wrap">
            {[
              { label:'Correct',   value:score,                      dot:'bg-emerald-500', color:'text-emerald-700', bg:'bg-emerald-50', border:'border-emerald-200' },
              { label:'Incorrect', value:total-score,                dot:'bg-red-500',     color:'text-red-700',     bg:'bg-red-50',     border:'border-red-200'     },
              { label:'Grade',     value:grade,                      dot:'bg-indigo-500',  color:'text-indigo-700',  bg:'bg-indigo-50',  border:'border-indigo-200'  },
              { label:'Time used', value:`${mins}m ${secs}s`,       dot:'bg-gray-400',    color:'text-gray-700',    bg:'bg-gray-50',    border:'border-gray-200'    },
            ].map((s) => (
              <div key={s.label} className={`flex items-center gap-2 ${s.bg} border ${s.border} rounded-xl px-3.5 py-2`}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                <div>
                  <p className={`text-sm font-extrabold leading-none ${s.color}`}>{s.value}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wide">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-600">{msg}</p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={onRetry}
                className="flex items-center gap-1.5 border-2 border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 font-bold px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all text-sm">
                <RotateCcw className="w-3.5 h-3.5" /> Retry
              </button>
              <a href="/study-guide"
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-500/20 text-sm">
                <BookOpen className="w-3.5 h-3.5" /> Study guide
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Post-exam reflection ──────────────────────────────── */}
      {showReflect && !reflectDone && (
        <div className="bg-white border border-indigo-200 rounded-3xl shadow-sm overflow-hidden mb-4">
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🪞</span>
              <p className="text-sm font-extrabold text-gray-900">Quick reflection — 30 seconds</p>
            </div>
            <p className="text-xs text-gray-400 mb-4">This feeds Atlas's engine to improve future predictions. Takes 3 taps.</p>

            {/* Q1 — confidence before */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-700 mb-2">How confident did you feel going in?</p>
              <div className="flex gap-2">
                {[{v:1,l:'😰 Not ready'},{v:2,l:'😐 Unsure'},{v:3,l:'😊 Prepared'},{v:4,l:'💪 Very ready'}].map((o) => (
                  <button key={o.v} onClick={() => setConfidence(o.v)}
                    className={`flex-1 text-[10px] font-semibold py-2 px-1 rounded-xl border-2 transition-all text-center ${
                      confidence === o.v ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:border-indigo-200'
                    }`}>{o.l}</button>
                ))}
              </div>
            </div>

            {/* Q2 — how did it go */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-700 mb-2">How do you think the exam went?</p>
              <div className="flex gap-2">
                {['😓 Harder than expected','😐 About as expected','😊 Easier than expected'].map((f) => (
                  <button key={f} onClick={() => setFeeling(f)}
                    className={`flex-1 text-[10px] font-semibold py-2 px-1 rounded-xl border-2 transition-all text-center leading-tight ${
                      feeling === f ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:border-indigo-200'
                    }`}>{f}</button>
                ))}
              </div>
            </div>

            {/* Q3 — surprises */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-700 mb-2">Any surprise topics on the exam?</p>
              <input value={surprise} onChange={(e) => setSurprise(e.target.value)}
                placeholder="e.g. Cell checkpoints weren't in my study guide"
                className="w-full border border-gray-200 focus:border-indigo-400 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition-all" />
            </div>

            <div className="flex gap-2">
              <button onClick={() => { setReflectDone(true); setShowReflect(false); }}
                disabled={confidence === 0 || !feeling}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                Save reflection ✓
              </button>
              <button onClick={() => setShowReflect(false)}
                className="text-xs text-gray-400 hover:text-gray-600 px-4 transition-colors">
                Skip
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">📊 Atlas uses this to calibrate your grade predictions</p>
          </div>
        </div>
      )}

      {/* ── Per-question review ───────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 md:px-8 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-extrabold text-gray-900">Answer review</p>
          <div className="flex gap-2">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">✓ {score} correct</span>
            {total-score>0 && <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">✗ {total-score} wrong</span>}
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {QUESTIONS.map((q, i) => {
            const isRight = isWritten ? (selfGrades[i] ?? 0) >= 3 : answers[i] === q.correct;
            const selfG   = selfGrades[i] ?? 0;
            return (
              <div key={q.id} className={`px-6 md:px-8 py-4 ${!isRight && !isWritten ? 'bg-red-50/20' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 mt-0.5 ${
                    isWritten
                      ? selfG >= 3 ? 'bg-emerald-100 text-emerald-700' : selfG > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                      : isRight ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>{isWritten ? (selfG >= 3 ? '✓' : selfG > 0 ? '~' : '?') : (isRight ? '✓' : '✗')}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded-md">{q.topic}</span>
                      {flagged[i] && <span className="text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-md">🚩 Flagged</span>}
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mb-2 leading-snug">{q.question}</p>

                    {/* Written answer — show user's answer + correct + self-grade */}
                    {isWritten ? (
                      <div className="space-y-2">
                        {writtenAnswers?.[i] && (
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your answer</p>
                            <p className="text-xs text-gray-700">{writtenAnswers[i]}</p>
                          </div>
                        )}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-1">Model answer</p>
                          <p className="text-xs text-emerald-800">{q.options[q.correct]}</p>
                          <p className="text-[11px] text-gray-500 italic mt-1">{q.explanation}</p>
                        </div>
                        {/* Self-grade buttons */}
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Rate your answer</p>
                          <div className="flex gap-1.5 flex-wrap">
                            {[
                              { v:1, label:'Wrong',    color:'bg-red-100 text-red-700 border-red-200'    },
                              { v:2, label:'Partial',  color:'bg-amber-100 text-amber-700 border-amber-200'},
                              { v:3, label:'Good',     color:'bg-blue-100 text-blue-700 border-blue-200'  },
                              { v:4, label:'Correct',  color:'bg-emerald-100 text-emerald-700 border-emerald-200'},
                            ].map((g) => (
                              <button key={g.v} onClick={() => setSelfGrades((p) => ({ ...p, [i]: g.v }))}
                                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border-2 transition-all ${
                                  selfG === g.v ? g.color + ' border-2' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}>{g.label}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* MCQ answer review */
                      <div>
                        <div className="flex flex-col sm:flex-row gap-1.5 mb-2">
                          <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg">✓ {q.options[q.correct]}</span>
                          {!isRight && answers[i] !== null && (
                            <span className="text-[11px] bg-red-100 text-red-800 font-semibold px-2.5 py-1 rounded-lg">✗ {q.options[answers[i]!]}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 italic">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Exam screen ────────────────────────────────────────────── */
function ExamScreen({ onFinish, selectedTopics, examType }: {
  onFinish: (answers:(number|null)[], flagged:boolean[], timeTaken:number, written?:string[]) => void;
  selectedTopics: string[];
  examType: string;
}) {
  const topicMap: Record<string,string> = { mitosis:'Mitosis', enzyme:'Enzyme Kinetics', respiration:'Cellular Respiration', dna:'DNA Replication' };
  const activeTopics = selectedTopics.map((t) => topicMap[t]);
  const filteredQ    = QUESTIONS.filter((q) => activeTopics.includes(q.topic));
  const examDuration = Math.max(300, filteredQ.length * 2 * 60);
  const typeLabel    = EXAM_TYPES.find((e) => e.id === examType);

  const [index,    setIndex]    = useState(0);
  const [answers,  setAnswers]  = useState<(number|null)[]>(Array(filteredQ.length).fill(null));
  const [flagged,  setFlagged]  = useState<boolean[]>(Array(filteredQ.length).fill(false));
  const [timeLeft, setTimeLeft] = useState(examDuration);
  const [written,  setWritten]  = useState<string[]>(Array(filteredQ.length).fill(''));
  const startTime = useRef(Date.now());

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((p) => {
        if (p <= 1) { clearInterval(t); handleSubmit(); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = () => {
    const elapsed = Math.round((Date.now() - startTime.current) / 1000);
    onFinish(answers, flagged, Math.min(elapsed, examDuration), written);
  };

  const select = (opt: number) => {
    setAnswers((p) => { const n=[...p]; n[index]=opt; return n; });
  };

  const toggleFlag = () => {
    setFlagged((p) => { const n=[...p]; n[index]=!n[index]; return n; });
  };

  if (filteredQ.length === 0) return null;
  const q          = filteredQ[index];
  const mins       = Math.floor(timeLeft / 60);
  const secs       = String(timeLeft % 60).padStart(2,'0');
  const answered   = examType === 'written' ? written.filter((w) => w.trim()).length : answers.filter((a) => a !== null).length;
  const isUrgent   = timeLeft < 5 * 60;
  const allAnswered = examType === 'written' ? written.every((w) => w.trim()) : answers.every((a) => a !== null);
  const total      = filteredQ.length;

  return (
    <div className="p-4 md:p-6 max-w-[900px] mx-auto">

      {/* ── Exam top bar ─────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-gray-900">Biology 101 — Exam Simulation</p>
          <p className="text-[10px] text-gray-400">{answered} of {total} answered · {typeLabel?.emoji} {typeLabel?.label}</p>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 flex-shrink-0 ${
          isUrgent ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'
        }`}>
          <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-600' : 'text-gray-500'}`} />
          <span className={`text-lg font-extrabold tabular-nums ${isUrgent ? 'text-red-600' : 'text-gray-700'}`}>
            {mins}:{secs}
          </span>
        </div>

        {/* Submit */}
        <button onClick={handleSubmit}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-sm flex-shrink-0">
          Submit exam
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">

        {/* Question area */}
        <div className="flex-1 min-w-0">

          {/* Question card — clean professional */}
          <div className="bg-white border-2 border-indigo-200 rounded-2xl p-5 md:p-6 mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                  Q{index+1} of {total}
                </span>
                <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {q.topic}
                </span>
              </div>
              <button onClick={toggleFlag}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                  flagged[index]
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-white border-gray-200 text-gray-400 hover:border-amber-300 hover:text-amber-600'
                }`}>
                <Flag className="w-3.5 h-3.5" />
                {flagged[index] ? 'Flagged' : 'Flag'}
              </button>
            </div>
            <p className="text-base md:text-lg font-bold text-gray-900 leading-relaxed">{q.question}</p>
            <p className="text-[10px] text-gray-400 mt-3">🔒 Answers revealed only after you submit</p>
          </div>

          {/* Options — changes based on exam type */}
          <div className="mb-5">
            {examType === 'mcq' && (
              <div className="space-y-2.5">
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => select(i)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                      answers[index] === i
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40'
                    }`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
                      answers[index] === i ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>{['A','B','C','D'][i]}</span>
                    <span className="text-sm font-medium text-gray-800 flex-1 leading-snug">{opt}</span>
                    {answers[index] === i && <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            )}

            {examType === 'written' && (
              <div>
                <p className="text-[11px] text-gray-500 mb-2 font-medium">Write your answer below</p>
                <textarea
                  value={written[index]}
                  onChange={(e) => setWritten((p) => { const n=[...p]; n[index]=e.target.value; return n; })}
                  placeholder="Type your answer here in your own words…"
                  rows={5}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-400 focus:bg-white text-gray-900 placeholder:text-gray-400 rounded-2xl p-4 text-sm outline-none resize-none transition-all"
                />
                <p className="text-[10px] text-gray-400 mt-1.5">
                  📝 Self-graded after you submit
                </p>
              </div>
            )}

            {examType === 'solve' && (
              <div>
                <p className="text-[11px] text-gray-500 mb-2 font-medium">Enter your numeric answer or formula</p>
                <input
                  value={written[index]}
                  onChange={(e) => setWritten((p) => { const n=[...p]; n[index]=e.target.value; return n; })}
                  placeholder="e.g. 30–32 ATP, or Km = [S] at ½Vmax…"
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-400 focus:bg-white text-gray-900 placeholder:text-gray-400 rounded-2xl px-4 py-3 text-sm outline-none transition-all"
                />
                <p className="text-[10px] text-gray-400 mt-1.5">
                  🔢 Enter exact value or formula
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button onClick={() => { if (index>0) setIndex((p)=>p-1); }}
              disabled={index===0}
              className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            {index < total - 1 ? (
              <button onClick={() => setIndex((p)=>p+1)}
                className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-500/20">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit}
                className={`flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md ${
                  allAnswered
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                }`}>
                {allAnswered ? '✓ Submit exam' : 'Submit exam'}
              </button>
            )}
          </div>
        </div>

        {/* Sidebar — question navigator */}
        <div className="lg:w-[190px] lg:flex-shrink-0">
          <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Questions</p>
            <div className="grid grid-cols-5 lg:grid-cols-4 gap-1.5 mb-3">
              {filteredQ.map((_, i) => (
                <button key={i} onClick={() => setIndex(i)}
                  className={`aspect-square rounded-xl text-xs font-extrabold transition-all flex items-center justify-center relative ${
                    i === index          ? 'bg-indigo-600 text-white shadow-sm' :
                    answers[i] !== null  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                                           'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}>
                  {i+1}
                  {flagged[i] && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="space-y-1.5 pt-3 border-t border-gray-100">
              {[
                { color:'bg-indigo-600', label:'Current' },
                { color:'bg-emerald-100 border border-emerald-300', label:'Answered' },
                { color:'bg-gray-100', label:'Not answered' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-md flex-shrink-0 ${l.color}`} />
                  <span className="text-[10px] text-gray-500">{l.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-md bg-gray-100 flex-shrink-0 relative">
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full" />
                </div>
                <span className="text-[10px] text-gray-500">Flagged</span>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Progress</span>
                <span>{answered}/{QUESTIONS.length}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width:`${(answered/QUESTIONS.length)*100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── App ────────────────────────────────────────────────────── */
export default function ExamModePage() {
  const [screen,       setScreen]       = useState<Screen>('intro');
  const [answers,      setAnswers]      = useState<(number|null)[]>([]);
  const [flagged,      setFlagged]      = useState<boolean[]>([]);
  const [timeTaken,    setTimeTaken]    = useState(0);
  const [writtenAnss,  setWrittenAnss]  = useState<string[]>([]);
  const [selTopics,    setSelTopics]    = useState<string[]>([]);
  const [selType,      setSelType]      = useState('mcq');

  const handleFinish = (a:(number|null)[], f:boolean[], t:number, w?:string[]) => {
    setAnswers(a); setFlagged(f); setTimeTaken(t); if(w) setWrittenAnss(w); setScreen('results');
  };

  const handleStart = (topics:string[], type:string) => {
    setSelTopics(topics); setSelType(type); setScreen('exam');
  };

  return (
    <AppLayout>
      {screen === 'intro'   && <IntroScreen onStart={handleStart} />}
      {screen === 'exam'    && <ExamScreen onFinish={handleFinish} selectedTopics={selTopics} examType={selType} />}
      {screen === 'results' && <ResultsScreen answers={answers} flagged={flagged} timeTaken={timeTaken} writtenAnswers={writtenAnss} examType={selType} onRetry={() => setScreen('intro')} />}
    </AppLayout>
  );
}
