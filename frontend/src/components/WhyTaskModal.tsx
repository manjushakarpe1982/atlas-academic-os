'use client';

import { useEffect } from 'react';
import {
  X, Target, Sparkles, Clock, AlertTriangle, Calendar,
  Quote, BookOpen, ClipboardCheck, Mic, Presentation,
  TrendingUp, Brain, Zap, ChevronRight,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
 *  WhyTaskModal
 *  Engine-breakdown explanation for a recommended task.
 *  Per SRS §7 and PPTX Slide 9 — Atlas's prioritisation engine
 *  uses 4 numbers to decide everything:
 *
 *    priority(topic) = emphasis × mastery_gap × proximity
 *
 *  Plus urgency at the class level.
 *
 *  This modal makes that math VISIBLE so students trust the rec.
 * ───────────────────────────────────────────────────────────── */

export interface EngineSignal {
  kind: string;        // 'verbal_cue' | 'exam_appearance' | etc.
  label: string;
  source: string;
  weight: number;      // 0-1
}

export interface WhyTaskData {
  topic: string;
  className: string;
  classId?: string;
  topicId?: string;
  duration: number;

  /* The 4 engine components — each normalised 0-1 */
  mastery:    { value: number; label: string };   // 0.28 = 28% mastery → big gap
  emphasis:   { value: number; label: string };   // 0.82 → professor emphasises
  proximity:  { value: number; label: string };   // 0.85 → exam in 3 days
  urgency:    { value: number; label: string };   // 0.74 → class is urgent

  /* Final computed priority score */
  priorityScore: number;  // 0-1

  /* Contributing signals (sorted by weight desc) */
  signals: EngineSignal[];

  /* Other tasks considered (for context — shows what Atlas ranked lower) */
  alternatives?: Array<{ topic: string; score: number; reason: string }>;
}

interface Props {
  data: WhyTaskData | null;
  onClose: () => void;
}

/* Signal icon + colour mapping (consistent with Topic Detail page) */
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

/* The 4 engine components, ordered as they appear in the formula */
const COMPONENTS_META = [
  {
    key: 'emphasis' as const,
    label: 'Emphasis',
    desc: 'How much the professor weighs this topic',
    icon: Target,
    color: 'bg-red-500',
    barColor: 'bg-red-500',
    tintColor: 'bg-red-50 border-red-100',
  },
  {
    key: 'mastery' as const,
    label: 'Mastery gap',
    desc: 'How much you still need to learn',
    icon: Brain,
    color: 'bg-purple-500',
    barColor: 'bg-purple-500',
    tintColor: 'bg-purple-50 border-purple-100',
    invert: true,  // shown as gap (1 - mastery)
  },
  {
    key: 'proximity' as const,
    label: 'Proximity',
    desc: 'How soon you\u2019ll be tested',
    icon: Calendar,
    color: 'bg-amber-500',
    barColor: 'bg-amber-500',
    tintColor: 'bg-amber-50 border-amber-100',
  },
  {
    key: 'urgency' as const,
    label: 'Class urgency',
    desc: 'How urgent this class is overall',
    icon: Zap,
    color: 'bg-blue-500',
    barColor: 'bg-blue-500',
    tintColor: 'bg-blue-50 border-blue-100',
  },
];

export default function WhyTaskModal({ data, onClose }: Props) {
  useEffect(() => {
    if (!data) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [data, onClose]);

  useEffect(() => {
    if (!data) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [data]);

  if (!data) return null;

  const masteryGap = 1 - data.mastery.value;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto pointer-events-none">
        <div className="w-full max-w-[680px] bg-white rounded-2xl shadow-2xl my-4 md:my-8 pointer-events-auto">

          {/* ── Header ──────────────────────────────────────── */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#534AB7] via-[#5B4FBC] to-[#7B6FE8] rounded-t-2xl p-6 text-white">
            <Sparkles className="absolute top-4 right-1/3 w-3 h-3 text-white/30" />
            <Sparkles className="absolute bottom-4 left-1/4 w-2.5 h-2.5 text-white/20" />

            <button onClick={onClose} aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center transition-colors">
              <X className="w-4 h-4" />
            </button>

            <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/70 mb-1.5">
              Why this task?
            </p>
            <h2 className="text-[22px] font-extrabold leading-tight mb-1 pr-12">
              {data.topic}
            </h2>
            <div className="flex items-center gap-2 text-[12px] text-white/80">
              <span>{data.className}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {data.duration} min</span>
            </div>

            {/* Final priority score */}
            <div className="mt-4 pt-4 border-t border-white/15 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Atlas priority score</p>
                <p className="text-3xl font-extrabold tabular-nums leading-none mt-1">
                  {(data.priorityScore * 100).toFixed(0)}<span className="text-base text-white/60 font-bold">/100</span>
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400 text-emerald-950 text-[10px] font-extrabold px-2.5 py-1 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Top pick today
              </span>
            </div>
          </div>

          {/* ── Body ────────────────────────────────────────── */}
          <div className="p-6 space-y-5">

            {/* ── The formula card ────────────────────────────── */}
            <div className="bg-[#FAFAFE] border border-[#ECE9FF] rounded-2xl p-4">
              <p className="text-[10px] font-extrabold text-[#9B9AB5] uppercase tracking-widest mb-2.5">The math behind it</p>
              <div className="flex items-center gap-2 flex-wrap text-[13px] font-extrabold">
                <span className="text-[#14142B]">priority =</span>
                <span className="px-2 py-1 rounded-md bg-red-50 text-red-700 border border-red-200">emphasis</span>
                <span className="text-[#9B9AB5]">×</span>
                <span className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">mastery gap</span>
                <span className="text-[#9B9AB5]">×</span>
                <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">proximity</span>
              </div>
              <p className="text-[11.5px] text-[#6B6A8A] mt-2.5 leading-relaxed">
                Class urgency acts as a modifier across all topics in the same class.
                Every output traces back to specific signals from your materials.
              </p>
            </div>

            {/* ── 4 engine components ─────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMPONENTS_META.map((c) => {
                const raw = data[c.key].value;
                const displayValue = c.invert ? masteryGap : raw;
                const Icon = c.icon;
                return (
                  <div key={c.key} className={`rounded-2xl border ${c.tintColor} p-4`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-8 h-8 rounded-lg ${c.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-extrabold text-[#14142B] truncate">{c.label}</p>
                        <p className="text-[10px] text-[#6B6A8A] truncate">{c.desc}</p>
                      </div>
                    </div>

                    {/* Bar + numeric */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-1 h-2 rounded-full bg-white border border-[#ECE9FF] overflow-hidden">
                        <div className={`h-full rounded-full ${c.barColor}`}
                          style={{ width: `${displayValue * 100}%` }} />
                      </div>
                      <span className="text-[11.5px] font-extrabold text-[#14142B] tabular-nums w-9 text-right">
                        {(displayValue * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-[11px] text-[#3A3A52]">{data[c.key].label}</p>
                  </div>
                );
              })}
            </div>

            {/* ── Signal evidence ─────────────────────────────── */}
            {data.signals.length > 0 && (
              <div className="bg-white border border-[#ECE9FF] rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#ECE9FF] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#534AB7]" />
                    <p className="text-[12px] font-extrabold text-[#14142B]">
                      Signals Atlas saw
                    </p>
                  </div>
                  <span className="text-[10.5px] font-bold text-[#9B9AB5]">{data.signals.length} signals</span>
                </div>
                <div className="divide-y divide-[#ECE9FF]">
                  {data.signals
                    .sort((a, b) => b.weight - a.weight)
                    .slice(0, 5)
                    .map((s, i) => {
                      const Icon = SIGNAL_ICONS[s.kind] ?? Sparkles;
                      const color = SIGNAL_COLORS[s.kind] ?? 'bg-gray-50 text-gray-700 border-gray-200';
                      return (
                        <div key={i} className="flex items-start gap-3 px-4 py-2.5">
                          <div className={`flex-shrink-0 w-7 h-7 rounded-lg border ${color} flex items-center justify-center`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-extrabold text-[#14142B] leading-snug">{s.label}</p>
                            <p className="text-[10.5px] text-[#9B9AB5] mt-0.5">from <strong>{s.source}</strong></p>
                          </div>
                          <span className="text-[10px] font-bold text-[#534AB7] bg-[#F4F2FF] px-1.5 py-0.5 rounded-md flex-shrink-0 mt-1">
                            ×{s.weight.toFixed(1)}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* ── Alternatives (other tasks considered) ───────── */}
            {data.alternatives && data.alternatives.length > 0 && (
              <div className="bg-white border border-[#ECE9FF] rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#ECE9FF] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#534AB7]" />
                  <p className="text-[12px] font-extrabold text-[#14142B]">Other tasks Atlas considered</p>
                </div>
                <div className="divide-y divide-[#ECE9FF]">
                  {data.alternatives.map((alt, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-extrabold text-[#14142B] truncate">{alt.topic}</p>
                        <p className="text-[10.5px] text-[#9B9AB5] truncate">{alt.reason}</p>
                      </div>
                      <span className="text-[11px] font-bold text-[#6B6A8A] tabular-nums">
                        {(alt.score * 100).toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Honesty footer ──────────────────────────────── */}
            <div className="bg-[#F4F2FF] border border-[#E8E5FD] rounded-xl px-4 py-3 flex items-start gap-2.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#534AB7] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#3A3A52] leading-relaxed">
                <strong>Trust but verify.</strong> Every signal above comes from your own uploaded materials.
                Disagree with the ranking? Override it and Atlas learns from your choice.
              </p>
            </div>

            {/* ── Actions ─────────────────────────────────────── */}
            <div className="flex items-center gap-2 pt-1">
              <button onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#534AB7] hover:bg-[#3F3795] text-white font-extrabold text-sm px-4 py-3 rounded-xl shadow-md shadow-[#534AB7]/25 transition-all active:scale-95">
                Start studying <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={onClose}
                className="inline-flex items-center justify-center gap-2 bg-white border border-[#E8E5FD] hover:border-[#534AB7]/30 text-[#534AB7] font-extrabold text-sm px-4 py-3 rounded-xl">
                Close
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
