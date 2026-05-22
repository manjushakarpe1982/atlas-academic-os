'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
;
import EmptyState from '@/components/EmptyState';
import Tooltip from '@/components/Tooltip';
import { TrendingUp, Clock, BookOpen, Star, BarChart2, Brain, Award, Target, Zap } from 'lucide-react';
import { PageSkeleton } from '@/components/Skeleton';

type Tab = 'overview' | 'subjects' | 'topics' | 'time';

/* ─── Data ───────────────────────────────────────────────────── */
const WEEKLY = [
  { week:'Apr W3', hrs:8.5  },
  { week:'Apr W4', hrs:10.2 },
  { week:'May W1', hrs:9.8  },
  { week:'May W2', hrs:12.4 },
];

const SUBJECTS = [
  { name:'Biology 101',    hrs:5.2, pct:42, color:'bg-indigo-500', light:'bg-indigo-100', text:'text-indigo-600', score:72 },
  { name:'Statistics 201', hrs:3.1, pct:25, color:'bg-emerald-500',light:'bg-emerald-100',text:'text-emerald-600',score:85 },
  { name:'English 110',    hrs:2.5, pct:20, color:'bg-amber-500',  light:'bg-amber-100',  text:'text-amber-600',  score:78 },
  { name:'History 105',    hrs:1.6, pct:13, color:'bg-purple-500', light:'bg-purple-100', text:'text-purple-600', score:91 },
];

const TOPICS = [
  { name:'Cell Division',        cls:'Biology',    pct:40, trend:'+12', exam:true  },
  { name:'DNA Replication',      cls:'Biology',    pct:35, trend:'+5',  exam:true  },
  { name:'Cellular Respiration', cls:'Biology',    pct:44, trend:'+8',  exam:true  },
  { name:'Probability',          cls:'Statistics', pct:68, trend:'+15', exam:false },
  { name:'Essay Structure',      cls:'English',    pct:72, trend:'+3',  exam:false },
  { name:'World War II',         cls:'History',    pct:88, trend:'+2',  exam:false },
];

const CALENDAR_DATA: Record<number,string[]> = {
  13:['bio','stats'], 14:['eng'], 15:['hist'],
  18:['bio'], 19:['bio','stats'], 20:['exam'],
  22:['stats'], 25:['deadline'], 26:['eng'],
};

const DOT_TYPE: Record<string,string> = {
  bio:'bg-indigo-500', stats:'bg-emerald-500',
  eng:'bg-amber-500',  hist:'bg-purple-500',
  exam:'bg-red-500',   deadline:'bg-orange-500',
};

const ACHIEVEMENTS = [
  { icon:'🔥', label:'5-day streak',         sub:'Keep going!',           earned:true  },
  { icon:'⭐', label:'Quiz Master',           sub:'10 quizzes completed',  earned:true  },
  { icon:'📈', label:'+0.3 GPA improvement', sub:'This semester',          earned:true  },
  { icon:'🎯', label:'100% plan completion', sub:'Complete 3 in a row',    earned:false },
  { icon:'🏆', label:'Top score 90%+',       sub:'Score 90%+ on exam',     earned:false },
];

/* ─── Helpers ────────────────────────────────────────────────── */
function masteryColor(p: number) {
  return p < 40 ? 'bg-red-500' : p < 65 ? 'bg-amber-500' : 'bg-emerald-500';
}
function masteryText(p: number) {
  return p < 40 ? 'text-red-600' : p < 65 ? 'text-amber-600' : 'text-emerald-600';
}
function masteryLabel(p: number) {
  return p < 40 ? 'Needs work' : p < 65 ? 'Developing' : 'Strong';
}
function masteryBadge(p: number) {
  return p < 40 ? 'bg-red-50 text-red-700 border-red-200' :
         p < 65 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-emerald-50 text-emerald-700 border-emerald-200';
}

/* ─── Bar chart ──────────────────────────────────────────────── */
function BarChart({ data }: { data: { week:string; hrs:number }[] }) {
  const max = Math.max(...data.map((d) => d.hrs));
  return (
    <div className="flex items-end gap-2 md:gap-4 h-20 md:h-24 mt-3">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <span className="text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">{d.hrs}h</span>
          <div className="w-full rounded-t-lg bg-indigo-400 hover:bg-indigo-600 transition-colors cursor-pointer"
            style={{ height:`${(d.hrs/max)*64}px` }} />
          <span className="text-[9px] text-gray-400 text-center leading-tight truncate w-full text-center">{d.week}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Donut ──────────────────────────────────────────────────── */
function Donut({ pct, color, label }: { pct:number; color:string; label:string }) {
  const r=36, circ=2*Math.PI*r, dash=(pct/100)*circ;
  return (
    <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center flex-shrink-0">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="relative text-center">
        <p className="text-lg md:text-xl font-extrabold text-gray-900">{pct}%</p>
        <p className="text-[8px] md:text-[9px] text-gray-400 leading-tight">{label}</p>
      </div>
    </div>
  );
}

/* ─── Mini calendar ──────────────────────────────────────────── */
function MiniCalendar() {
  return (
    <div>
      <div className="grid grid-cols-7 gap-0.5 mb-1.5">
        {['S','M','T','W','T','F','S'].map((d,i) => (
          <div key={i} className="text-[9px] font-bold text-gray-400 text-center py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {[...Array(4)].map((_,i) => <div key={`b${i}`} />)}
        {Array.from({length:31},(_,i)=>i+1).map((d) => {
          const evs = CALENDAR_DATA[d] || [];
          const isToday = d===19;
          return (
            <div key={d} className={`relative p-1 rounded-lg cursor-pointer transition-all hover:bg-indigo-50 ${isToday?'bg-indigo-600':''}`}>
              <p className={`text-[10px] font-semibold text-center leading-none mb-1 ${isToday?'text-white':'text-gray-700'}`}>{d}</p>
              {evs.length>0 && (
                <div className="flex justify-center gap-0.5 flex-wrap">
                  {evs.slice(0,2).map((ev) => (
                    <div key={ev} className={`w-1.5 h-1.5 rounded-full ${DOT_TYPE[ev]||'bg-gray-400'}`} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2">
        {[{c:'bg-red-500',l:'Exam'},{c:'bg-orange-500',l:'Deadline'},{c:'bg-indigo-500',l:'Bio'},{c:'bg-emerald-500',l:'Stats'}].map((l) => (
          <div key={l.l} className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${l.c}`} />
            <span className="text-[9px] text-gray-400">{l.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Stat card ──────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, delta, deltaGood, bg, color }: {
  icon: typeof Clock; label:string; value:string; delta:string;
  deltaGood:boolean; bg:string; color:string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-3.5 md:p-4 shadow-sm">
      <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-2.5`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className={`text-xl md:text-2xl font-extrabold ${color} leading-none`}>{value}</p>
      <p className="text-[10px] text-gray-400 mt-0.5 mb-0.5">{label}</p>
      <p className={`text-[10px] font-bold ${deltaGood?'text-emerald-600':'text-red-500'}`}>{delta}</p>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>('overview');
   const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  if (loading) return <PageSkeleton />;

    return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-5">
          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-gray-900">Progress Analytics</h1>
            <p className="text-xs text-gray-400 mt-0.5">Fall 2026 · Updated just now</p>
          </div>
          {/* Tabs — scrollable on mobile */}
          <div className="flex items-center bg-white border border-gray-100 rounded-xl p-1 gap-0.5 shadow-sm overflow-x-auto scrollbar-none">
            {(['overview','subjects','topics','time'] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap flex-shrink-0 ${
                  tab===t ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                }`}>{t}</button>
            ))}
          </div>
        </div>

        {/* ════ OVERVIEW ════ */}
        {tab==='overview' && (
          <div className="space-y-4">

            {/* Top stats — 2 cols mobile, 4 cols desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={Clock}     label="Study time"    value="24.5h" delta="-12% vs last month" deltaGood={false} bg="bg-indigo-50"  color="text-indigo-600" />
              <StatCard icon={BarChart2} label="Avg score"     value="76%"   delta="+6% vs last month"  deltaGood={true}  bg="bg-emerald-50" color="text-emerald-600" />
              <StatCard icon={Brain}     label="Topics studied" value="28"   delta="+9 this month"      deltaGood={true}  bg="bg-blue-50"    color="text-blue-600"   />
              <StatCard icon={Zap}       label="Quizzes taken" value="12"    delta="+3 this month"      deltaGood={true}  bg="bg-purple-50"  color="text-purple-600" />
            </div>

            {/* Middle row — donut + bar chart + calendar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

              {/* Overall progress */}
              <div className="md:col-span-4 bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-4">Overall Progress</p>
                <div className="flex items-center gap-4 mb-4">
                  <Donut pct={68} color="#4F46E5" label="Overall" />
                  <div className="flex-1 space-y-2.5">
                    {[
                      { label:'Study time',   value:'24h 30m' },
                      { label:'Cards reviewed',value:'28'     },
                      { label:'Quizzes taken', value:'12'     },
                    ].map((s) => (
                      <div key={s.label}>
                        <p className="text-[10px] text-gray-400">{s.label}</p>
                        <p className="text-sm font-extrabold text-gray-900">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Score trend mini bars */}
                <div className="pt-3 border-t border-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] text-gray-400">Score trend</p>
                    <p className="text-[11px] font-extrabold text-indigo-600">76% <span className="text-emerald-600 font-bold text-[10px]">↑+6%</span></p>
                  </div>
                  <div className="flex items-end gap-0.5 h-8">
                    {[62,65,68,71,70,73,76,74,76].map((v,i) => (
                      <div key={i} className={`flex-1 rounded-sm transition-colors ${i===8?'bg-indigo-500':'bg-indigo-200'} hover:bg-indigo-400`}
                        style={{ height:`${((v-60)/20)*100}%` }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Study time chart */}
              <div className="md:col-span-5 bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Study Time</p>
                  <span className="text-[10px] font-bold text-red-500">-12%</span>
                </div>
                <p className="text-2xl font-extrabold text-gray-900">24h 30m</p>
                <p className="text-[11px] text-gray-400 mb-1">Total this month</p>
                <BarChart data={WEEKLY} />
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    { label:'Daily avg',       value:'2.5 hrs',  color:'text-indigo-600' },
                    { label:'Best day',         value:'Saturday', color:'text-emerald-600'},
                    { label:'Longest session',  value:'3.5 hrs',  color:'text-purple-600' },
                    { label:'Sessions / week',  value:'6',        color:'text-amber-600'  },
                  ].map((s) => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-[10px] text-gray-400 leading-tight">{s.label}</p>
                      <p className={`text-sm font-extrabold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini calendar */}
              <div className="md:col-span-3 bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-3">May 2026</p>
                <MiniCalendar />
              </div>
            </div>

            {/* Bottom row — subjects + achievements */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

              {/* Subject breakdown */}
              <div className="md:col-span-7 bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-4">Subject Breakdown</p>
                <div className="space-y-3.5">
                  {SUBJECTS.map((s) => (
                    <div key={s.name} className="flex items-center gap-3">
                      <div className="w-24 md:w-32 flex-shrink-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{s.name}</p>
                        <p className="text-[10px] text-gray-400">{s.hrs}h · {s.pct}%</p>
                      </div>
                      <div className="flex-1">
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${s.color} rounded-full`} style={{ width:`${s.pct}%` }} />
                        </div>
                      </div>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
                        s.score>=85?'bg-emerald-100 text-emerald-700':s.score>=75?'bg-indigo-100 text-indigo-700':'bg-amber-100 text-amber-700'
                      }`}>{s.score}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="md:col-span-5 bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-3">Achievements</p>
                <div className="space-y-2">
                  {ACHIEVEMENTS.map((a,i) => (
                    <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                      a.earned ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-100 opacity-50'
                    }`}>
                      <span className="text-lg flex-shrink-0">{a.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{a.label}</p>
                        <p className="text-[10px] text-gray-400">{a.sub}</p>
                      </div>
                      {a.earned
                        ? <span className="text-[9px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full flex-shrink-0">Earned</span>
                        : <span className="text-[9px] font-bold text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full flex-shrink-0">Locked</span>
                      }
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ SUBJECTS ════ */}
        {tab==='subjects' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SUBJECTS.map((s) => (
                <div key={s.name} className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className={`w-10 h-10 rounded-xl ${s.light} flex items-center justify-center mb-3`}>
                    <BookOpen className={`w-5 h-5 ${s.text}`} />
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-1">{s.name}</p>
                  <p className={`text-3xl font-extrabold ${s.score>=85?'text-emerald-600':s.score>=75?'text-indigo-600':'text-amber-600'} mb-0.5`}>{s.score}%</p>
                  <p className="text-[11px] text-gray-400 mb-3">{s.hrs}h studied · {s.pct}% of total time</p>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width:`${s.score}%` }} />
                  </div>
                  {/* Study time bar */}
                  <div className="mt-2">
                    <p className="text-[10px] text-gray-400 mb-1">Share of study time</p>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full opacity-60`} style={{ width:`${s.pct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparative bar */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
              <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-4">Score comparison</p>
              <div className="space-y-3">
                {SUBJECTS.map((s) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <div className="w-28 md:w-36 flex-shrink-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{s.name}</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full`} style={{ width:`${s.score}%` }} />
                      </div>
                    </div>
                    <span className={`text-sm font-extrabold w-10 text-right flex-shrink-0 ${
                      s.score>=85?'text-emerald-600':s.score>=75?'text-indigo-600':'text-amber-600'
                    }`}>{s.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ TOPICS ════ */}
        {tab==='topics' && (
          <div className="space-y-4">
            {/* Summary row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label:'Needs work', count: TOPICS.filter(t=>t.pct<40).length,  bg:'bg-red-50',     text:'text-red-600',     border:'border-red-100'     },
                { label:'Developing', count: TOPICS.filter(t=>t.pct>=40&&t.pct<65).length, bg:'bg-amber-50', text:'text-amber-600', border:'border-amber-100' },
                { label:'Strong',     count: TOPICS.filter(t=>t.pct>=65).length, bg:'bg-emerald-50', text:'text-emerald-600', border:'border-emerald-100' },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-3.5 text-center`}>
                  <p className={`text-2xl font-extrabold ${s.text}`}>{s.count}</p>
                  <p className={`text-[11px] font-semibold ${s.text}`}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Topic list */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-4 md:px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                <p className="text-sm font-extrabold text-gray-900">Topic mastery — all classes</p>
                <span className="text-[11px] text-gray-400">{TOPICS.length} topics</span>
              </div>
              <div className="divide-y divide-gray-50">
                {TOPICS.map((t) => (
                  <div key={t.name} className="flex items-center gap-3 px-4 md:px-5 py-3 hover:bg-gray-50 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                        {t.exam && (
                          <span className="text-[9px] font-bold bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
                            Exam
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{t.cls}</p>
                    </div>
                    <div className="w-24 md:w-40 flex-shrink-0">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${masteryColor(t.pct)} rounded-full`} style={{ width:`${t.pct}%` }} />
                      </div>
                    </div>
                    <span className={`text-sm font-extrabold w-10 text-right flex-shrink-0 ${masteryText(t.pct)}`}>{t.pct}%</span>
                    <span className="text-[10px] font-bold text-emerald-600 w-8 text-right flex-shrink-0 hidden sm:block">{t.trend}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border flex-shrink-0 hidden sm:block ${masteryBadge(t.pct)}`}>
                      {masteryLabel(t.pct)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ TIME ════ */}
        {tab==='time' && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label:'This week',    value:'12.4h', delta:'+2h vs last week', good:true,  color:'text-indigo-600',  bg:'bg-indigo-50'  },
                { label:'Daily avg',    value:'2.5h',  delta:'Goal: 3h',         good:false, color:'text-amber-600',   bg:'bg-amber-50'   },
                { label:'Best session', value:'3.5h',  delta:'Last Saturday',    good:true,  color:'text-emerald-600', bg:'bg-emerald-50' },
                { label:'Streak',       value:'5 days',delta:'Keep going!',      good:true,  color:'text-purple-600',  bg:'bg-purple-50'  },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} border border-gray-100 rounded-2xl p-3.5 md:p-4`}>
                  <p className={`text-xl md:text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
                  <p className={`text-[10px] font-bold mt-0.5 ${s.good?'text-emerald-600':'text-amber-600'}`}>{s.delta}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Weekly chart */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1">Weekly Study Hours</p>
                <BarChart data={WEEKLY} />
              </div>

              {/* Time of day performance */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Performance by time of day</p>
                  <Tooltip text="Shows when you study most (hours) vs when you actually score best on quizzes. The gap reveals your optimal study time." position="top" width="w-60" />
                </div>
                <p className="text-[10px] text-gray-400 mb-4">Hours studied vs quiz score at each time</p>
                <div className="space-y-3">
                  {[
                    { label:'🌅 Morning  6–12',  hrs:3.2, score:78, scoreColor:'text-amber-600',  hrsBar:'bg-indigo-300' },
                    { label:'☀️ Afternoon 12–6', hrs:4.1, score:72, scoreColor:'text-red-500',    hrsBar:'bg-indigo-400' },
                    { label:'🌙 Evening  6–10',  hrs:4.8, score:91, scoreColor:'text-emerald-600',hrsBar:'bg-indigo-500' },
                    { label:'🌌 Late night 10–2',hrs:0.4, score:61, scoreColor:'text-red-500',    hrsBar:'bg-indigo-200' },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 font-medium">{s.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">{s.hrs}h studied</span>
                          <span className={`font-extrabold ${s.scoreColor}`}>{s.score}% avg score</span>
                        </div>
                      </div>
                      <div className="flex gap-1 h-3">
                        {/* Hours bar */}
                        <div className="flex-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${s.hrsBar} rounded-full`} style={{ width:`${(s.hrs/5)*100}%` }} />
                        </div>
                        {/* Score bar */}
                        <div className="flex-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.score>=85?'bg-emerald-500':s.score>=75?'bg-amber-400':'bg-red-400'}`}
                            style={{ width:`${s.score}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Insight */}
                <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
                  <p className="text-xs font-bold text-emerald-800 mb-0.5">💡 Your insight</p>
                  <p className="text-[11px] text-emerald-700">You study most at <strong>6–10pm</strong> and score best then too (91%). But you study 4h in the afternoon and only score 72%. Shift afternoon study to evening for better results.</p>
                </div>
                <div className="flex items-center gap-3 mt-2.5 text-[10px] text-gray-400">
                  <div className="flex items-center gap-1"><div className="w-3 h-2 rounded bg-indigo-400" /><span>Hours studied</span></div>
                  <div className="flex items-center gap-1"><div className="w-3 h-2 rounded bg-emerald-400" /><span>Quiz score</span></div>
                </div>
              </div>
            </div>

            {/* Subject time breakdown */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
              <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-4">Time by subject — this month</p>
              <div className="space-y-3">
                {SUBJECTS.map((s) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <div className="w-24 md:w-36 flex-shrink-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{s.name}</p>
                      <p className="text-[10px] text-gray-400">{s.hrs}h</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full`} style={{ width:`${s.pct}%` }} />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-600 w-8 text-right flex-shrink-0">{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
 

}
