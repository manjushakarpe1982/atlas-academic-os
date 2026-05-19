'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  TrendingUp, Clock, Target, BookOpen,
  Star, ChevronRight, BarChart2, Calendar,
  Brain, Zap, Award,
} from 'lucide-react';

type Tab = 'overview' | 'subjects' | 'topics' | 'time';

const WEEKLY_STUDY = [
  { week:'Apr W3', hrs:8.5 },{ week:'Apr W4', hrs:10.2 },
  { week:'May W1', hrs:9.8 },{ week:'May W2', hrs:12.4 },
];

const SUBJECT_BREAKDOWN = [
  { name:'Biology 101',    hrs:5.2, pct:42, color:'bg-indigo-500', score:72 },
  { name:'Statistics 201', hrs:3.1, pct:25, color:'bg-green-500',  score:85 },
  { name:'English 110',    hrs:2.5, pct:20, color:'bg-yellow-500', score:78 },
  { name:'History 105',    hrs:1.6, pct:13, color:'bg-purple-500', score:91 },
];

const TOPIC_MASTERY = [
  { name:'Cell Division',        pct:40, trend:'+12', exam:true  },
  { name:'DNA Replication',      pct:35, trend:'+5',  exam:true  },
  { name:'Cellular Respiration', pct:44, trend:'+8',  exam:true  },
  { name:'Probability',          pct:68, trend:'+15', exam:false },
  { name:'Essay Structure',      pct:72, trend:'+3',  exam:false },
  { name:'World War II',         pct:88, trend:'+2',  exam:false },
];

const CALENDAR_DATA = [
  // May 2026 — simplified
  { date:13, events:['Bio Study',  'Stats Quiz']                           },
  { date:14, events:['English']                                             },
  { date:15, events:['History']                                             },
  { date:18, events:['Cell Div']                                            },
  { date:19, events:['DNA Rep', 'Stats PS4']                               },
  { date:20, events:['Biology Exam']   },
  { date:22, events:['Stats Quiz 3']                                        },
  { date:25, events:['Lab Report']                                          },
  { date:26, events:['History Essay']                                       },
];

/* ─── Bar chart ──────────────────────────────────────────────── */
function BarChart({ data }: { data: { week: string; hrs: number }[] }) {
  const max = Math.max(...data.map((d) => d.hrs));
  return (
    <div className="flex items-end gap-4 h-24 mt-3">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold text-indigo-600">{d.hrs}h</span>
          <div className="w-full rounded-t-lg bg-indigo-500 hover:bg-indigo-600 transition-colors cursor-pointer"
            style={{ height: `${(d.hrs / max) * 64}px` }} />
          <span className="text-[9px] text-gray-400 text-center leading-tight">{d.week}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Donut chart (CSS) ──────────────────────────────────────── */
function DonutChart({ pct, color, label }: { pct: number; color: string; label: string }) {
  const r = 36; const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="relative text-center">
        <p className="text-xl font-extrabold text-gray-900">{pct}%</p>
        <p className="text-[9px] text-gray-400 leading-tight">{label}</p>
      </div>
    </div>
  );
}

/* ─── Mini calendar ──────────────────────────────────────────── */
function MiniCalendar() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const dates = Array.from({length:31},(_,i)=>i+1);
  const eventDates = CALENDAR_DATA.map((c) => c.date);

  const DOT_COLORS: Record<string,string> = {
    'Bio Study': 'bg-indigo-500', 'Stats Quiz': 'bg-green-500',
    'English': 'bg-yellow-500', 'History': 'bg-purple-500',
    'Cell Div': 'bg-indigo-500', 'DNA Rep': 'bg-indigo-400',
    'Stats PS4': 'bg-green-400', 'Biology Exam': 'bg-red-500',
    'Stats Quiz 3': 'bg-green-500', 'Lab Report': 'bg-orange-500',
    'History Essay': 'bg-yellow-500',
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {days.map((d) => (
          <div key={d} className="text-[9px] font-bold text-gray-400 text-center">{d[0]}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {/* May 1 starts on Friday (offset 4) */}
        {[...Array(4)].map((_,i) => <div key={`e${i}`} />)}
        {dates.map((d) => {
          const evs = CALENDAR_DATA.find((c) => c.date === d)?.events || [];
          const isToday = d === 19;
          return (
            <div key={d}
              className={`relative p-0.5 rounded-lg cursor-pointer hover:bg-indigo-50 transition-all ${
                isToday ? 'bg-indigo-600 rounded-lg' : ''
              }`}>
              <p className={`text-[10px] font-semibold text-center ${isToday ? 'text-white' : 'text-gray-700'}`}>{d}</p>
              {evs.length > 0 && (
                <div className="flex justify-center gap-0.5 flex-wrap mt-0.5">
                  {evs.slice(0,2).map((ev) => (
                    <div key={ev} className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[ev] || 'bg-gray-400'}`} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {[
          { color:'bg-red-500',    label:'Exams'          },
          { color:'bg-orange-500', label:'Deadlines'      },
          { color:'bg-indigo-500', label:'Study Sessions' },
          { color:'bg-green-500',  label:'Classes'        },
          { color:'bg-gray-400',   label:'Other'          },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${l.color}`} />
            <span className="text-[9px] text-gray-400">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <AppLayout>
      <div className="p-6 max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Progress Analytics</h1>
            <p className="text-sm text-gray-400 mt-0.5">Spring 2026 · Updated just now</p>
          </div>
          <div className="flex items-center bg-white border border-gray-100 rounded-xl p-1 gap-1 shadow-sm">
            {(['overview','subjects','topics','time'] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  tab === t ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                }`}>{t}</button>
            ))}
          </div>
        </div>

        {/* ── OVERVIEW ──────────────────────────────────────── */}
        {tab === 'overview' && (
          <div className="grid grid-cols-12 gap-4">

            {/* Overall progress donut */}
            <div className="col-span-12 md:col-span-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-4">Overall Progress</p>
              <div className="flex items-center justify-between mb-4">
                <DonutChart pct={68} color="#4F46E5" label="Overall" />
                <div className="space-y-3 flex-1 ml-5">
                  {[
                    { label:'Study Time',   value:'24h 30m', delta:'-12%', deltaColor:'text-red-500'   },
                    { label:'Ready Time',   value:'28',      delta:'+9%',  deltaColor:'text-green-600' },
                    { label:'Quizes Taken', value:'28',      delta:'+8%',  deltaColor:'text-green-600' },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-[10px] text-gray-400 font-medium">{s.label}</p>
                      <div className="flex items-baseline gap-1.5">
                        <p className="text-lg font-extrabold text-gray-900">{s.value}</p>
                        <span className={`text-[10px] font-bold ${s.deltaColor}`}>{s.delta}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 mb-1">Average Score</p>
                <p className="text-2xl font-extrabold text-indigo-600 mb-1">76%</p>
                <p className="text-[10px] text-green-600 font-bold">+6% vs last month</p>
                {/* Trend line placeholder */}
                <div className="mt-2 h-8 flex items-end gap-0.5">
                  {[62,65,68,71,70,73,76,74,76].map((v,i) => (
                    <div key={i} className="flex-1 bg-indigo-200 rounded-sm hover:bg-indigo-400 transition-colors"
                      style={{ height:`${((v-60)/20)*100}%` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Study time chart */}
            <div className="col-span-12 md:col-span-5 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Study Time Trend</p>
              <p className="text-2xl font-extrabold text-gray-900">24h 30m <span className="text-sm text-red-500 font-bold">-12%</span></p>
              <p className="text-[11px] text-gray-400 mb-2">Total this month</p>
              <BarChart data={WEEKLY_STUDY} />

              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { label:'Daily average',   value:'2.5 hrs',  color:'text-indigo-600' },
                  { label:'Best day',        value:'Saturday', color:'text-green-600'  },
                  { label:'Longest session', value:'3.5 hrs',  color:'text-purple-600' },
                  { label:'Sessions this wk',value:'6',        color:'text-orange-600' },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-[10px] text-gray-400">{s.label}</p>
                    <p className={`text-sm font-extrabold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="col-span-12 md:col-span-3 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">May 2026</p>
                <div className="flex items-center gap-1">
                  <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 text-xs">‹</button>
                  <span className="text-[10px] text-gray-500 font-medium">Month</span>
                  <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 text-xs">›</button>
                </div>
              </div>
              <MiniCalendar />
            </div>

            {/* Subject breakdown */}
            <div className="col-span-12 md:col-span-7 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-4">Subject Breakdown</p>
              <div className="space-y-4">
                {SUBJECT_BREAKDOWN.map((s) => (
                  <div key={s.name} className="flex items-center gap-4">
                    <div className="w-28 flex-shrink-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{s.name}</p>
                      <p className="text-[10px] text-gray-400">{s.hrs}h studied</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full`} style={{ width:`${s.pct}%` }} />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-600 w-8 text-right">{s.pct}%</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
                      s.score >= 85 ? 'bg-green-100 text-green-700' : s.score >= 75 ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'
                    }`}>{s.score}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="col-span-12 md:col-span-5 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-4">Achievements</p>
              <div className="space-y-2.5">
                {[
                  { icon:'🔥', label:'5-day streak',        sub:'Keep going!',          earned:true  },
                  { icon:'⭐', label:'Quiz Master',          sub:'10 quizzes completed', earned:true  },
                  { icon:'📈', label:'+0.3 GPA improvement',sub:'This semester',         earned:true  },
                  { icon:'🎯', label:'100% plan completion', sub:'Complete 3 in a row',  earned:false },
                  { icon:'🏆', label:'Top score',            sub:'Score 90%+ on exam',   earned:false },
                ].map((a, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl ${
                    a.earned ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-50 border border-gray-100 opacity-50'
                  }`}>
                    <span className="text-xl flex-shrink-0">{a.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900">{a.label}</p>
                      <p className="text-[10px] text-gray-400">{a.sub}</p>
                    </div>
                    {a.earned && <span className="text-[9px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full">Earned</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SUBJECTS tab ──────────────────────────────────── */}
        {tab === 'subjects' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SUBJECT_BREAKDOWN.map((s) => (
              <div key={s.name} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${s.color.replace('bg-','bg-').replace('500','100')} flex items-center justify-center mb-3`}>
                  <BookOpen className={`w-5 h-5 ${s.color.replace('bg-','text-')}`} />
                </div>
                <p className="text-sm font-bold text-gray-900 mb-0.5">{s.name}</p>
                <p className="text-2xl font-extrabold text-gray-800 mb-1">{s.score}%</p>
                <p className="text-[11px] text-gray-400">{s.hrs}h studied · {s.pct}% of total</p>
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full`} style={{ width:`${s.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TOPICS tab ────────────────────────────────────── */}
        {tab === 'topics' && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-4">Topic Mastery — All Classes</p>
            <div className="space-y-3">
              {TOPIC_MASTERY.map((t) => (
                <div key={t.name} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-all">
                  <p className="text-sm font-semibold text-gray-800 w-44 flex-shrink-0">{t.name}</p>
                  <div className="flex-1">
                    <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${
                        t.pct < 40 ? 'bg-red-500' : t.pct < 65 ? 'bg-orange-500' : 'bg-green-500'
                      }`} style={{ width:`${t.pct}%` }} />
                    </div>
                  </div>
                  <span className={`text-sm font-extrabold w-10 text-right ${
                    t.pct < 40 ? 'text-red-600' : t.pct < 65 ? 'text-orange-600' : 'text-green-600'
                  }`}>{t.pct}%</span>
                  <span className="text-xs font-bold text-green-600 w-10 text-right">{t.trend}</span>
                  {t.exam && <span className="text-[9px] font-bold bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-full">Exam</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TIME tab ──────────────────────────────────────── */}
        {tab === 'time' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-4">Weekly Study Hours</p>
              <BarChart data={WEEKLY_STUDY} />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-4">Study by Time of Day</p>
              <div className="space-y-3">
                {[
                  { label:'Morning (6–12)',     hrs:3.2,  pct:25 },
                  { label:'Afternoon (12–6)',   hrs:4.1,  pct:33 },
                  { label:'Evening (6–10)',     hrs:4.8,  pct:39 },
                  { label:'Late night (10–2)',  hrs:0.4,  pct:3  },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 font-medium">{s.label}</span>
                      <span className="font-bold text-gray-800">{s.hrs}h</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width:`${s.pct}%` }} />
                    </div>
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
