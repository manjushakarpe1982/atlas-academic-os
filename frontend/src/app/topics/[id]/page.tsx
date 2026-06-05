'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { PageSkeleton } from '@/components/Skeleton';
import {
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown, AlertTriangle,
  FileText, Mic, Presentation, StickyNote, ClipboardCheck, Award,
  PenSquare, Brain, BookOpen, Volume2, MessageSquare, Sparkles,
  Target, Clock, Quote, ExternalLink,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
 *  Topic Detail View
 *  Per SRS FR-6.7 — every topic in the workspace is clickable
 *  and opens a topic detail with mastery history + linked materials.
 *
 *  Sections:
 *    1. Header (topic name, class link, mastery + priority)
 *    2. Mastery history sparkline
 *    3. Emphasis signals — why this topic matters
 *    4. Linked materials — files that cover this topic
 *    5. Study mode recommendation
 * ───────────────────────────────────────────────────────────── */

/* ─── Mock data ──────────────────────────────────────────────── */
const MOCK_TOPICS: Record<string, TopicData> = {
  mitosis: {
    id: 'mitosis',
    name: 'Mitosis',
    classId: 'bio101',
    className: 'Biology 101',
    classCode: 'BIO 101',
    mastery: 28,
    priority: 'high',
    weekRange: 'Weeks 5–7',
    description:
      'The process by which a single cell divides into two genetically identical daughter cells. Five phases — prophase, prometaphase, metaphase, anaphase, telophase — make up roughly 10% of the cell cycle.',
    masteryHistory: [
      { date: 'Oct 12', value: 0 },
      { date: 'Oct 19', value: 15 },
      { date: 'Oct 26', value: 22 },
      { date: 'Nov 2',  value: 35 },
      { date: 'Nov 9',  value: 32 }, // dip after a wrong quiz answer
      { date: 'Nov 16', value: 28 },
    ],
    signals: [
      { kind: 'exam_appearance',         label: 'On Exam 2 review sheet',                source: 'Exam 2 Review Sheet',   weight: 1.0,  detail: 'page 2, listed as primary topic' },
      { kind: 'verbal_cue',              label: '"You should know all five phases cold for the midterm"', source: 'Lecture 8',  weight: 0.8,  detail: '14:18 timestamp' },
      { kind: 'lecture_mention',         label: 'Mentioned 6× across recent lectures',   source: 'Lectures 7-11',         weight: 0.3,  detail: 'Avg 12 minutes per lecture' },
      { kind: 'quiz_appearance',         label: 'Appeared on Quiz 3 (you scored 60%)',   source: 'Quiz 3',                weight: 0.7,  detail: 'Missed 2 of 3 phase ordering questions' },
      { kind: 'review_sheet_appearance', label: 'Highlighted in Smith\'s review sheet',  source: 'Exam 2 Review Sheet',   weight: 0.9,  detail: 'In the "must know" section' },
    ],
    materials: [
      { id: 1, name: 'Lecture 8 — Cell Cycle',         type: 'lecture_audio',  sub: '48 min · ref. at 14:18' },
      { id: 2, name: 'Lecture 11 — Mitosis (Slides)',  type: 'lecture_slides', sub: '32 slides · slides 6-21' },
      { id: 3, name: 'Exam 2 Review Sheet',            type: 'review_sheet',   sub: 'pg. 2 · primary topic' },
      { id: 4, name: 'Quiz 3 — Graded',                type: 'graded_work',    sub: '82% overall · weak on phases' },
      { id: 5, name: 'Your notes — Mitosis',           type: 'notes',          sub: 'Oct 24 · 3 pages' },
    ],
  },
  enzyme_kinetics: {
    id: 'enzyme_kinetics',
    name: 'Enzyme Kinetics',
    classId: 'bio101',
    className: 'Biology 101',
    classCode: 'BIO 101',
    mastery: 35,
    priority: 'high',
    weekRange: 'Weeks 8–9',
    description:
      'The study of the rates of enzyme-catalysed reactions. Covers Michaelis-Menten kinetics, Km, Vmax, and the effects of inhibitors.',
    masteryHistory: [
      { date: 'Oct 19', value: 0 },
      { date: 'Oct 26', value: 18 },
      { date: 'Nov 2',  value: 28 },
      { date: 'Nov 9',  value: 32 },
      { date: 'Nov 16', value: 35 },
    ],
    signals: [
      { kind: 'quiz_appearance', label: 'You missed 4 of 7 enzyme questions on Quiz 3', source: 'Quiz 3', weight: 0.7, detail: 'Biggest weakness in the class so far' },
      { kind: 'lecture_mention', label: 'Mentioned 4× in lectures',                      source: 'Lectures 9-10', weight: 0.3, detail: '' },
      { kind: 'slide_emphasis',  label: 'Highlighted on slides 18-24',                    source: 'Lecture 10 slides', weight: 0.5, detail: '' },
    ],
    materials: [
      { id: 1, name: 'Lecture 10 — Krebs & Enzymes', type: 'lecture_audio',  sub: '52 min' },
      { id: 2, name: 'Quiz 3 — Graded',              type: 'graded_work',    sub: '82% · enzymes weak' },
    ],
  },
};

/* ─── Types ──────────────────────────────────────────────────── */
interface MasteryPoint { date: string; value: number; }
interface Signal { kind: string; label: string; source: string; weight: number; detail: string; }
interface Material { id: number; name: string; type: string; sub: string; }
interface TopicData {
  id: string;
  name: string;
  classId: string;
  className: string;
  classCode: string;
  mastery: number;
  priority: 'high' | 'medium' | 'low';
  weekRange: string;
  description: string;
  masteryHistory: MasteryPoint[];
  signals: Signal[];
  materials: Material[];
}

/* ─── Mappings ───────────────────────────────────────────────── */
const FILE_ICONS: Record<string, typeof FileText> = {
  syllabus: FileText, lecture_audio: Mic, lecture_slides: Presentation,
  review_sheet: ClipboardCheck, graded_work: Award, notes: StickyNote, assignment: PenSquare,
};
const FILE_COLORS: Record<string, string> = {
  syllabus: 'bg-red-50 text-red-600', lecture_audio: 'bg-blue-50 text-blue-600',
  lecture_slides: 'bg-orange-50 text-orange-600', review_sheet: 'bg-purple-50 text-purple-600',
  graded_work: 'bg-emerald-50 text-emerald-600', notes: 'bg-amber-50 text-amber-700',
  assignment: 'bg-indigo-50 text-indigo-600',
};
const SIGNAL_ICONS: Record<string, typeof Target> = {
  exam_appearance:         Target,
  verbal_cue:              Quote,
  lecture_mention:         Mic,
  quiz_appearance:         ClipboardCheck,
  review_sheet_appearance: BookOpen,
  slide_emphasis:          Presentation,
};
const SIGNAL_COLORS: Record<string, string> = {
  exam_appearance:         'bg-red-50 text-red-700 border-red-200',
  verbal_cue:              'bg-purple-50 text-purple-700 border-purple-200',
  lecture_mention:         'bg-blue-50 text-blue-700 border-blue-200',
  quiz_appearance:         'bg-amber-50 text-amber-700 border-amber-200',
  review_sheet_appearance: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  slide_emphasis:          'bg-orange-50 text-orange-700 border-orange-200',
};
const PRIORITY_COLORS = {
  high:   { ring: 'ring-red-200',   pill: 'bg-red-100 text-red-700',     label: 'High priority'   },
  medium: { ring: 'ring-amber-200', pill: 'bg-amber-100 text-amber-700', label: 'Medium priority' },
  low:    { ring: 'ring-gray-200',  pill: 'bg-gray-100 text-gray-600',   label: 'Low priority'    },
};

export default function TopicDetailPage() {
  const params  = useParams<{ id: string }>();
  const router  = useRouter();
  const [loading, setLoading] = useState(true);
  const [topic,   setTopic]   = useState<TopicData | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setTopic(MOCK_TOPICS[params.id] ?? null);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [params.id]);

  if (loading) return <PageSkeleton />;

  if (!topic) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#F5F5FB] p-8">
          <div className="max-w-[760px] mx-auto bg-white border border-[#ECE9FF] rounded-2xl p-10 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#F4F2FF] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-[#534AB7]" />
            </div>
            <h2 className="text-xl font-extrabold text-[#14142B] mb-1">Topic not found</h2>
            <p className="text-sm text-[#6B6A8A] mb-5">We couldn&apos;t find a topic with that id.</p>
            <button onClick={() => router.back()}
              className="inline-flex items-center gap-2 bg-[#534AB7] hover:bg-[#3F3795] text-white px-4 py-2.5 rounded-xl font-extrabold text-sm">
              <ChevronLeft className="w-4 h-4" /> Go back
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const p = PRIORITY_COLORS[topic.priority];

  /* Mastery trend direction */
  const last     = topic.masteryHistory[topic.masteryHistory.length - 1].value;
  const prev     = topic.masteryHistory[topic.masteryHistory.length - 2]?.value ?? last;
  const trendUp  = last >= prev;
  const trendDelta = Math.abs(last - prev);

  /* Recommended study mode based on mastery */
  let recMode = { label: 'Read', desc: 'Start by reading the section to learn the core concepts.', icon: BookOpen, color: 'bg-[#534AB7]', href: '/study-guide' };
  if (topic.mastery >= 70) recMode = { label: 'Quiz me', desc: 'You know it well — lock it in with retrieval practice.', icon: Brain, color: 'bg-emerald-500', href: '/quiz' };
  else if (topic.mastery >= 40) recMode = { label: 'Teach back', desc: 'Explain it in your own words to find the gaps.', icon: MessageSquare, color: 'bg-orange-500', href: '/study-guide' };

  /* SVG path for mastery history */
  const w = 600, h = 100, pad = 8;
  const xStep = (w - pad * 2) / Math.max(topic.masteryHistory.length - 1, 1);
  const points = topic.masteryHistory.map((pt, i) => ({
    x: pad + i * xStep,
    y: h - pad - ((pt.value / 100) * (h - pad * 2)),
    ...pt,
  }));
  const pathD = points
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
    .join(' ');
  const areaD = pathD + ` L ${points[points.length - 1].x} ${h} L ${points[0].x} ${h} Z`;

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#F5F5FB] p-4 md:p-8">
        <div className="max-w-[1100px] mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <Link href="/classes" className="hover:text-indigo-600">Classes</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/classes/${topic.classId}`} className="hover:text-indigo-600">{topic.className}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-indigo-600 font-semibold">{topic.name}</span>
          </div>

          {/* ── Header ─────────────────────────────────────────── */}
          <div className="bg-white border border-[#ECE9FF] rounded-2xl p-6 mb-5 shadow-sm">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-extrabold text-[#534AB7] uppercase tracking-widest mb-1">
                  {topic.classCode} · {topic.weekRange}
                </p>
                <h1 className="text-[28px] font-extrabold text-[#14142B] leading-tight mb-2">{topic.name}</h1>
                <p className="text-[13.5px] text-[#6B6A8A] leading-relaxed max-w-2xl">{topic.description}</p>
              </div>

              {/* Mastery donut + priority */}
              <div className="flex items-center gap-4">
                <div className={`relative w-20 h-20 rounded-full ring-4 ${p.ring} bg-white flex flex-col items-center justify-center`}>
                  <p className="text-[22px] font-extrabold text-[#14142B] leading-none">{topic.mastery}%</p>
                  <p className="text-[9px] font-bold text-[#9B9AB5] uppercase tracking-wider mt-0.5">mastery</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-full ${p.pill}`}>
                    {p.label}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                    {trendUp
                      ? <TrendingUp  className="w-3 h-3" />
                      : <TrendingDown className="w-3 h-3" />}
                    {trendUp ? '+' : '−'}{trendDelta}% this week
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2-column main grid ─────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

            {/* LEFT — main column */}
            <div className="space-y-5">

              {/* ── Mastery history ──────────────────────────── */}
              <div className="bg-white border border-[#ECE9FF] rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#ECE9FF]">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#534AB7]" />
                    <p className="text-sm font-extrabold text-[#14142B]">Mastery over time</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#6B6A8A]">
                    {topic.masteryHistory.length} data points
                  </span>
                </div>

                <div className="p-5">
                  <svg viewBox={`0 0 ${w} ${h + 30}`} className="w-full h-[160px]" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="masteryGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#534AB7" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#534AB7" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Dashed grid */}
                    {[25, 50, 75].map((pct) => {
                      const y = h - pad - ((pct / 100) * (h - pad * 2));
                      return (
                        <g key={pct}>
                          <line x1={pad} y1={y} x2={w - pad} y2={y} stroke="#E8E5FD" strokeDasharray="3 5" />
                          <text x={w - pad} y={y - 3} textAnchor="end" fill="#9B9AB5" fontSize="9" fontWeight="600">{pct}%</text>
                        </g>
                      );
                    })}
                    {/* Area under curve */}
                    <path d={areaD} fill="url(#masteryGrad)" />
                    {/* Line */}
                    <path d={pathD} stroke="#534AB7" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    {/* Dots + labels */}
                    {points.map((pt, i) => (
                      <g key={i}>
                        <circle cx={pt.x} cy={pt.y} r="4" fill="#534AB7" />
                        <circle cx={pt.x} cy={pt.y} r="1.5" fill="white" />
                        <text x={pt.x} y={h + 18} textAnchor="middle" fill="#9B9AB5" fontSize="9" fontWeight="600">{pt.date}</text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              {/* ── Emphasis signals ─────────────────────────── */}
              <div className="bg-white border border-[#ECE9FF] rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#ECE9FF]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#534AB7]" />
                    <p className="text-sm font-extrabold text-[#14142B]">Why this topic matters</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#6B6A8A]">{topic.signals.length} signals</span>
                </div>

                <div className="divide-y divide-[#ECE9FF]">
                  {topic.signals
                    .sort((a, b) => b.weight - a.weight)
                    .map((s, i) => {
                      const Icon  = SIGNAL_ICONS[s.kind] ?? Sparkles;
                      const color = SIGNAL_COLORS[s.kind] ?? 'bg-gray-50 text-gray-700 border-gray-200';
                      return (
                        <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#FAFAFE] transition-colors">
                          {/* Icon tile */}
                          <div className={`flex-shrink-0 w-9 h-9 rounded-lg border ${color} flex items-center justify-center`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {/* Body */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-extrabold text-[#14142B] leading-snug">{s.label}</p>
                            <p className="text-[11.5px] text-[#9B9AB5] mt-0.5">
                              <strong className="text-[#6B6A8A]">{s.source}</strong>
                              {s.detail && <> · {s.detail}</>}
                            </p>
                          </div>
                          {/* Weight indicator */}
                          <div className="hidden sm:flex flex-col items-end flex-shrink-0 w-12">
                            <p className="text-[10px] font-bold text-[#9B9AB5] uppercase tracking-wider mb-1">weight</p>
                            <div className="w-full h-1.5 rounded-full bg-[#F4F2FF] overflow-hidden">
                              <div className="h-full rounded-full bg-[#534AB7]" style={{ width: `${s.weight * 100}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>

            {/* RIGHT — sidebar */}
            <div className="space-y-5">

              {/* ── Recommended study mode ───────────────────── */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#534AB7] via-[#5B4FBC] to-[#7B6FE8] rounded-2xl p-5 shadow-lg shadow-[#534AB7]/20 text-white">
                <Sparkles className="absolute top-4 right-4 w-3 h-3 text-white/30" />
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/70 mb-2">Recommended next step</p>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${recMode.color} flex items-center justify-center border border-white/20`}>
                    <recMode.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-extrabold leading-tight mb-1">{recMode.label}</p>
                    <p className="text-[12px] text-white/85 leading-relaxed">{recMode.desc}</p>
                  </div>
                </div>
                <Link href={recMode.href}
                  className="block w-full text-center bg-white hover:bg-[#F4F2FF] text-[#534AB7] px-4 py-2.5 rounded-xl font-extrabold text-sm shadow-md">
                  Start now
                </Link>

                {/* All 4 modes hint */}
                <div className="mt-4 pt-4 border-t border-white/15">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-2">Other modes</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { icon: BookOpen,      label: 'Read'       },
                      { icon: Volume2,       label: 'Listen'     },
                      { icon: Brain,         label: 'Quiz me'    },
                      { icon: MessageSquare, label: 'Teach back' },
                    ].filter((m) => m.label !== recMode.label).map((m) => (
                      <span key={m.label} className="inline-flex items-center gap-1.5 text-[10.5px] font-bold bg-white/15 backdrop-blur border border-white/15 text-white px-2 py-1 rounded-md">
                        <m.icon className="w-3 h-3" /> {m.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Linked materials ─────────────────────────── */}
              <div className="bg-white border border-[#ECE9FF] rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#ECE9FF]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#534AB7]" />
                    <p className="text-sm font-extrabold text-[#14142B]">Linked materials</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#6B6A8A]">{topic.materials.length}</span>
                </div>

                <div className="divide-y divide-[#ECE9FF]">
                  {topic.materials.length === 0 ? (
                    <div className="text-center py-8 px-5">
                      <p className="text-[12px] text-[#6B6A8A]">No materials linked yet.</p>
                    </div>
                  ) : topic.materials.map((m) => {
                    const Icon = FILE_ICONS[m.type] ?? FileText;
                    const colorCls = FILE_COLORS[m.type] ?? 'bg-gray-50 text-gray-600';
                    return (
                      <div key={m.id} className="flex items-start gap-3 px-5 py-3 hover:bg-[#FAFAFE] cursor-pointer transition-colors">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${colorCls} flex items-center justify-center`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12.5px] font-extrabold text-[#14142B] leading-tight truncate">{m.name}</p>
                          <p className="text-[10.5px] text-[#9B9AB5] mt-0.5 truncate">{m.sub}</p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-[#9B9AB5] flex-shrink-0 mt-1" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Back to class link ────────────────────────── */}
              <Link href={`/classes/${topic.classId}`}
                className="flex items-center gap-2 text-[12px] font-bold text-[#534AB7] hover:underline">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to {topic.className}
              </Link>

            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
