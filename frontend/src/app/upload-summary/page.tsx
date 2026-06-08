'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import AskAIWidget, { AskAIInline } from '@/components/AskAIWidget';
import {
  CheckCircle2, FileText, Brain, Calendar,
  BookOpen, Target, Sparkles, ArrowRight, Star,
  ChevronRight,
} from 'lucide-react';

/* ─── Pipeline steps — what Atlas does after upload ─────────── */
const PIPELINE = [
  { label:'File received',           desc:'Your file was uploaded to Atlas securely'              },
  { label:'Text extracted',          desc:'All text, tables, and structure were read'             },
  { label:'Topics identified',       desc:'12 study topics were detected from the content'       },
  { label:'Key concepts highlighted',desc:'Important terms, formulas, and definitions marked'    },
  { label:'Dates detected',          desc:'8 deadlines and exam dates added to your calendar'    },
  { label:'Difficulty analysed',     desc:'Each topic scored by how hard it is for you'          },
  { label:'Study plan updated',      desc:'Your daily plan was rebuilt with this new information' },
];

/* ─── What Atlas found ───────────────────────────────────────── */
const STATS = [
  { icon:Brain,    label:'Topics found',      value:12, color:'text-indigo-600',  bg:'bg-indigo-50',  border:'border-indigo-100' },
  { icon:Calendar, label:'Dates added',        value:8,  color:'text-red-600',     bg:'bg-red-50',     border:'border-red-100'    },
  { icon:BookOpen, label:'Study guides ready', value:4,  color:'text-emerald-600', bg:'bg-emerald-50', border:'border-emerald-100'},
  { icon:Target,   label:'Flashcards made',    value:36, color:'text-purple-600',  bg:'bg-purple-50',  border:'border-purple-100' },
  { icon:Star,     label:'Quiz questions',     value:20, color:'text-amber-600',   bg:'bg-amber-50',   border:'border-amber-100'  },
  { icon:FileText, label:'Pages read',         value:24, color:'text-blue-600',    bg:'bg-blue-50',    border:'border-blue-100'   },
];

/* ─── Topics extracted — ranked by how urgent they are ──────── */
const TOPICS = [
  { name:'Cell Division',        hard:true,  exam:true,  mastery:28 },
  { name:'Mitosis',              hard:true,  exam:true,  mastery:32 },
  { name:'DNA Replication',      hard:true,  exam:true,  mastery:40 },
  { name:'Cellular Respiration', hard:true,  exam:true,  mastery:44 },
  { name:'Enzyme Kinetics',      hard:true,  exam:false, mastery:35 },
  { name:'Krebs Cycle',          hard:false, exam:false, mastery:65 },
];

/* ─── Dates Atlas found in the file ─────────────────────────── */
const DATES = [
  { event:'Lab Report 3 Due',       date:'May 22',  days:1,  type:'deadline', urgent:true  },
  { event:'Quiz 4 — Cell Division', date:'May 24',  days:3,  type:'quiz',     urgent:true  },
  { event:'Biology Midterm',        date:'May 26',  days:5,  type:'exam',     urgent:true  },
  { event:'Final Exam',             date:'Jun 10',  days:20, type:'exam',     urgent:false },
];

function masteryColor(p: number) {
  return p < 40 ? 'bg-red-500' : p < 60 ? 'bg-amber-500' : 'bg-emerald-500';
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function UploadSummaryPage() {
  const router = useRouter();
  const [step, setStep]     = useState(0);
  const [done, setDone]     = useState(false);

  // Animate pipeline on load
  useEffect(() => {
    const t = setInterval(() => {
      setStep((p) => {
        const next = p + 1;
        if (next >= PIPELINE.length) { clearInterval(t); setDone(true); return next; }
        return next;
      });
    }, 320);
    return () => clearInterval(t);
  }, []);

  const pct = Math.round((step / PIPELINE.length) * 100);

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-[1100px] mx-auto">

        {/* ── Breadcrumb ───────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <span className="hover:text-indigo-600 cursor-pointer" onClick={() => router.push('/upload')}>Uploads</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-indigo-600 font-semibold">Processing summary</span>
        </div>

        {/* ── Page header ──────────────────────────────────────── */}
        <div className="mb-4">
          <h1 className="text-lg md:text-xl font-extrabold text-gray-900">
            {done ? '✅ Your materials are ready!' : '⏳ Atlas is reading your file…'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {done
              ? 'Biology_Syllabus.pdf has been fully processed. Your study plan has been updated.'
              : 'Biology_Syllabus.pdf is being processed — usually takes under 30 seconds.'}
          </p>
        </div>

        {/* ── Ask AI — top of page ─────────────────────────────── */}
        <AskAIInline context="upload-summary" />

        {/* ── STEP 1: What Atlas is doing (pipeline) ───────────── */}
        <section className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm mb-4">

          {/* Section label */}
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${done ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'}`}>
              1
            </div>
            <p className="text-sm font-extrabold text-gray-900">
              {done ? 'What Atlas did to your file' : 'What Atlas is doing to your file'}
            </p>
            {!done && <span className="w-3.5 h-3.5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin ml-auto flex-shrink-0" />}
          </div>
          <p className="text-[11px] text-gray-400 mb-4 ml-8">
            {done
              ? 'Every step below ran automatically when you uploaded your file.'
              : 'These steps run automatically. You don\'t need to do anything.'}
          </p>

          {/* Pipeline steps — 2 col on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {PIPELINE.map((p, i) => {
              const isDone    = i < step;
              const isActive  = i === step && !done;
              return (
                <div key={i} className={`flex items-start gap-2.5 px-3.5 py-3 rounded-xl border transition-all ${
                  isDone   ? 'bg-emerald-50 border-emerald-100' :
                  isActive ? 'bg-indigo-50 border-indigo-200' :
                             'bg-gray-50 border-gray-100'
                }`}>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : isActive ? (
                    <span className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin flex-shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-[12px] font-semibold leading-tight ${
                      isDone ? 'text-emerald-700' : isActive ? 'text-indigo-700' : 'text-gray-400'
                    }`}>{p.label}</p>
                    {(isDone || isActive) && (
                      <p className={`text-[10px] mt-0.5 leading-tight ${isDone ? 'text-emerald-600/70' : 'text-indigo-500'}`}>
                        {p.desc}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
            <span>{done ? 'Complete' : `Running step ${step + 1} of ${PIPELINE.length}…`}</span>
            <span className="font-bold">{pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-300 ${done ? 'bg-emerald-500' : 'bg-indigo-500'}`}
              style={{ width:`${pct}%` }} />
          </div>
        </section>

        {/* ── Steps 2–4 only visible after processing ──────────── */}
        {done && (
          <div className="flex flex-col lg:flex-row gap-4">

            {/* Left column */}
            <div className="flex-1 space-y-4">

              {/* ── STEP 2: What was found ──────────────────────── */}
              <section className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-extrabold flex-shrink-0">2</div>
                  <p className="text-sm font-extrabold text-gray-900">What Atlas found in your file</p>
                </div>
                <p className="text-[11px] text-gray-400 mb-4 ml-8">
                  All of this was automatically extracted from Biology_Syllabus.pdf.
                </p>

                {/* Stats — 3 col on mobile, 6 on desktop */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
                  {STATS.map((s) => (
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-3 text-center`}>
                      <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                      <p className={`text-xl font-extrabold ${s.color} leading-none`}>{s.value}</p>
                      <p className="text-[9px] text-gray-500 font-medium mt-0.5 leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── STEP 3: Topics ranked ───────────────────────── */}
              <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 md:px-5 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-extrabold flex-shrink-0">3</div>
                    <p className="text-sm font-extrabold text-gray-900">Topics ranked by urgency</p>
                  </div>
                  <p className="text-[11px] text-gray-400 ml-8">
                    Sorted by: how weak you are + how likely it is on the exam + how soon the exam is.
                  </p>
                </div>
                <div className="divide-y divide-gray-50">
                  {TOPICS.map((t, i) => (
                    <div key={t.name} className="flex items-center gap-3 px-4 md:px-5 py-3 hover:bg-gray-50 transition-all">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 ${
                        i < 3 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                      }`}>{i + 1}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                          {t.exam && (
                            <span className="text-[9px] font-bold bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
                              On exam
                            </span>
                          )}
                          {t.hard && (
                            <span className="text-[9px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
                              Hard
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Mastery bar */}
                      <div className="flex-shrink-0 text-right hidden sm:block">
                        <p className={`text-[10px] font-bold ${t.mastery < 40 ? 'text-red-600' : 'text-amber-600'}`}>
                          {t.mastery}% mastery
                        </p>
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-0.5">
                          <div className={`h-full ${masteryColor(t.mastery)} rounded-full`} style={{ width:`${t.mastery}%` }} />
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold sm:hidden ${t.mastery < 40 ? 'text-red-600' : 'text-amber-600'}`}>
                        {t.mastery}%
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── STEP 4: Dates Atlas added ───────────────────── */}
              <section className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-extrabold flex-shrink-0">4</div>
                  <p className="text-sm font-extrabold text-gray-900">Dates added to your calendar</p>
                </div>
                <p className="text-[11px] text-gray-400 mb-4 ml-8">
                  Atlas found these dates in your file and added them automatically.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DATES.map((d) => (
                    <div key={d.event} className={`flex items-start gap-3 p-3 rounded-xl border ${
                      d.urgent ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'
                    }`}>
                      <span className="text-lg flex-shrink-0">
                        {d.type === 'exam' ? '📝' : d.type === 'quiz' ? '❓' : '📋'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{d.event}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{d.date}</p>
                        <p className={`text-[10px] font-bold mt-0.5 ${d.urgent ? 'text-red-600' : 'text-gray-400'}`}>
                          {d.days <= 5 ? `⚠ ${d.days} days away` : `${d.days} days away`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── CTAs ─────────────────────────────────────────── */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => router.push('/study-plan')}
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20 flex-1 sm:flex-none">
                  <Sparkles className="w-4 h-4" /> View Updated Study Plan
                </button>
                <button onClick={() => router.push('/study-guide')}
                  className="flex items-center justify-center gap-2 border border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-600 font-semibold px-5 py-3 rounded-xl text-sm transition-all">
                  <BookOpen className="w-4 h-4" /> Open Study Guide
                </button>
                <button onClick={() => router.push('/dashboard')}
                  className="flex items-center justify-center gap-2 border border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 font-semibold px-5 py-3 rounded-xl text-sm transition-all">
                  Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right sidebar ── */}
            <div className="lg:w-[240px] lg:flex-shrink-0 space-y-3">

              
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <p className="text-[11px] font-extrabold text-gray-700 uppercase tracking-widest">AI Suggestions</p>
                </div>
                <p className="text-[10px] text-gray-400 mb-3">Based on your uploaded materials</p>
                <div className="space-y-2">
                  {[
                    { emoji:'🧬', text:'Spend 1 more hour on Cell Division today',         impact:'High Impact',    color:'text-red-600 bg-red-50 border-red-200'         },
                    { emoji:'❓', text:'Take a quiz on DNA Replication',                    impact:'Medium Impact',  color:'text-amber-600 bg-amber-50 border-amber-200'   },
                    { emoji:'📖', text:'Review your notes in Genetics',                    impact:'Medium Impact',  color:'text-amber-600 bg-amber-50 border-amber-200'   },
                    { emoji:'⏰', text:'Best time to study: 7PM – 9PM',                    impact:'Schedule Tip',   color:'text-blue-600 bg-blue-50 border-blue-200'      },
                    { emoji:'🧠', text:'You learn better with quizzes',                    impact:'Learning Style', color:'text-purple-600 bg-purple-50 border-purple-200'},
                  ].map((s, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
                      <div className="flex items-start gap-2.5 mb-2">
                        <span className="text-base flex-shrink-0 mt-0.5">{s.emoji}</span>
                        <p className="text-[12px] font-semibold text-gray-800 leading-snug">{s.text}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${s.color}`}>
                        {s.impact}
                      </span>
                    </div>
                  ))}
                </div>
                <button onClick={() => router.push('/dashboard')}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm">
                  Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Generated for you — BELOW */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                <p className="text-xs font-extrabold text-indigo-800 mb-3">Generated for you</p>
                <div className="space-y-2">
                  {[
                    { emoji:'🗺', text:'12 topics mapped'        },
                    { emoji:'📖', text:'4 study guides ready'    },
                    { emoji:'🃏', text:'36 flashcards made'      },
                    { emoji:'❓', text:'20 quiz questions'       },
                    { emoji:'📅', text:'8 dates in your calendar'},
                  ].map((g, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <span className="text-base flex-shrink-0">{g.emoji}</span>
                      <p className="text-[12px] font-semibold text-indigo-800">{g.text}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
