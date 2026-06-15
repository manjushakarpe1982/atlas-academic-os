'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, MoreVertical, CheckCircle2, Circle } from 'lucide-react';

const CLASS = { name: 'Biology 1107', sub: 'Life Sciences', grade: 84, color: 'bg-green-500' };

const PROGRESS_ITEMS = [
  { label: 'Classes', done: 32, total: 36 },{ label: 'Assignments', done: 19, total: 22 },
  { label: 'Quizzes', done: 7, total: 8 },{ label: 'Labs', done: 5, total: 6 },
];
const WEIGHTS = [
  { label: 'Homework', pct: 25, color: '#6366f1' },{ label: 'Labs', pct: 20, color: '#8b5cf6' },
  { label: 'Exams', pct: 40, color: '#ec4899' },{ label: 'Participation', pct: 15, color: '#f59e0b' },
];
const GRADE_AVERAGES = [
  { label: 'Homework Average', weight: 25, score: 90, color: '#6366f1' },
  { label: 'Lab Average', weight: 20, score: 85, color: '#8b5cf6' },
  { label: 'Exam Average', weight: 40, score: 76, color: '#ec4899' },
  { label: 'Participation', weight: 15, score: 95, color: '#f59e0b' },
];
const CHAPTERS = [
  { num:1, title:'Introduction to Biology', done:true },{ num:2, title:'Chemistry of Life', done:true },
  { num:3, title:'Cell Structure and Function', done:true },{ num:4, title:'Cell Transport', done:true },
  { num:5, title:'Energy and Metabolism', done:true },{ num:6, title:'Photosynthesis', done:true },
  { num:7, title:'Cell Division', done:false },{ num:8, title:'Genetics', done:false },
];
const UPCOMING = [
  { title:'Biology Quiz 1', date:'Tomorrow', priority:'High', icon:'❓', color:'bg-red-100' },
  { title:'Lab Report', date:'Sun, May 19', priority:'Medium', icon:'🧪', color:'bg-orange-100' },
  { title:'Chapter 4 Reading', date:'Wed, May 22', priority:'Low', icon:'📖', color:'bg-green-100' },
];
const COMPLETED = [
  { title:'Homework 1', date:'May 1', icon:'📝' },
  { title:'Lab 1', date:'Apr 28', icon:'🧪' },
  { title:'Quiz 1', date:'Apr 30', icon:'❓' },
];
const LATE = [{ title:'Homework 0', date:'Apr 10', icon:'📝' }];
const TREND = [65,70,72,76,79,82,84];
const PC: Record<string,string> = { High:'text-red-600 bg-red-50', Medium:'text-amber-600 bg-amber-50', Low:'text-green-600 bg-green-50' };

function OverviewTab() {
  const pct = Math.round((PROGRESS_ITEMS.reduce((s,i)=>s+i.done,0)/PROGRESS_ITEMS.reduce((s,i)=>s+i.total,0))*100);
  const r=38; const circ=2*Math.PI*r;
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">Course Progress</h2>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10"/>
              <circle cx="50" cy="50" r={r} fill="none" stroke="#22c55e" strokeWidth="10"
                strokeDasharray={`${circ*pct/100} ${circ*(1-pct/100)}`} strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-lg font-extrabold text-gray-900">{pct}%</p>
              <p className="text-[9px] text-gray-400">Complete</p>
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            {PROGRESS_ITEMS.map(p=>(
              <div key={p.label} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"/>
                <span className="flex-1 text-xs text-gray-600">{p.label}</span>
                <span className="text-xs font-bold text-gray-800">{p.done}/{p.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h2 className="text-sm font-extrabold text-gray-900 mb-2">About This Course</h2>
        <p className="text-xs text-gray-500 leading-relaxed mb-3">Introduction to the principles of biology including cell structure, genetics, evolution, and ecosystems.</p>
        <div className="grid grid-cols-2 gap-3">
          {[{icon:'👤',label:'Instructor',value:'Dr. Amy Austin'},{icon:'📚',label:'Credits',value:'3'},{icon:'🗓️',label:'Schedule',value:'Mon, Wed, Fri 10:00 AM'},{icon:'📍',label:'Location',value:'Science Building Room 204'}].map(i=>(
            <div key={i.label} className="flex items-start gap-2">
              <span className="text-base flex-shrink-0">{i.icon}</span>
              <div><p className="text-[10px] text-gray-400">{i.label}</p><p className="text-xs font-semibold text-gray-800">{i.value}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900">Upcoming</h2>
          <span className="text-xs text-indigo-600 font-semibold">View all</span>
        </div>
        {UPCOMING.map(u=>(
          <div key={u.title} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className={`w-8 h-8 ${u.color} rounded-xl flex items-center justify-center text-sm flex-shrink-0`}>{u.icon}</div>
            <div className="flex-1"><p className="text-sm font-semibold text-gray-800">{u.title}</p><p className="text-xs text-gray-400">{u.date}</p></div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PC[u.priority]}`}>{u.priority}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GradesTab() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">Grade Breakdown</h2>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {(()=>{let o=-90;return WEIGHTS.map(w=>{const a=w.pct/100*360;const r=38;const s=o*Math.PI/180;const e=(o+a)*Math.PI/180;const x1=50+r*Math.cos(s);const y1=50+r*Math.sin(s);const x2=50+r*Math.cos(e);const y2=50+r*Math.sin(e);const l=a>180?1:0;o+=a;return <path key={w.label} d={`M50 50 L${x1} ${y1} A${r} ${r} 0 ${l} 1 ${x2} ${y2}Z`} fill={w.color}/>;})})()}
              <circle cx="50" cy="50" r="24" fill="white"/>
              <text x="50" y="47" textAnchor="middle" fontSize="10" fontWeight="800" fill="#111">84%</text>
              <text x="50" y="57" textAnchor="middle" fontSize="7" fill="#999">Total</text>
            </svg>
          </div>
          <div className="flex-1 space-y-1.5">
            {WEIGHTS.map(w=>(
              <div key={w.label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:w.color}}/>
                <span className="flex-1 text-xs text-gray-600">{w.label}</span>
                <span className="text-xs font-bold text-gray-800">{w.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">Grade Trend</h2>
        <svg viewBox="0 0 260 70" className="w-full">
          {[0,25,50].map(y=><line key={y} x1="30" y1={y+5} x2="260" y2={y+5} stroke="#f3f4f6" strokeWidth="1"/>)}
          <polyline points={TREND.map((p,i)=>`${30+i*35},${65-p*0.55}`).join(' ')} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          {TREND.map((p,i)=><circle key={i} cx={30+i*35} cy={65-p*0.55} r="3" fill="white" stroke="#6366f1" strokeWidth="2"/>)}
          <text x={30+(TREND.length-1)*35-5} y={65-TREND[TREND.length-1]*0.55-6} fontSize="8" fill="#6366f1" fontWeight="700">{TREND[TREND.length-1]}%</text>
          {['Mar','Apr','May','Jun','Jul'].map((l,i)=><text key={l} x={30+i*35-8} y="68" fontSize="7" fill="#9ca3af">{l}</text>)}
        </svg>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900">All Grades</h2>
          <span className="text-xs text-indigo-600 font-semibold">View all</span>
        </div>
        {GRADE_AVERAGES.map(g=>(
          <div key={g.label} className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:g.color}}/>
            <span className="flex-1 text-xs text-gray-700">{g.label}</span>
            <span className="text-xs text-gray-400 w-6">{g.weight}%</span>
            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{width:`${g.score}%`,background:g.color}}/>
            </div>
            <span className="text-xs font-bold text-gray-800 w-8 text-right">{g.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopicsTab() {
  const done=CHAPTERS.filter(c=>c.done).length;
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900">Course Topics</h2>
          <span className="text-xs text-indigo-600 font-semibold">View all</span>
        </div>
        {CHAPTERS.map(c=>(
          <div key={c.num} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-extrabold ${c.done?'bg-green-100 text-green-600':'bg-gray-100 text-gray-400'}`}>{c.num}</div>
            <p className={`flex-1 text-sm font-semibold ${c.done?'text-gray-800':'text-gray-400'}`}>{c.title}</p>
            {c.done?<CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0"/>:<Circle className="w-4 h-4 text-gray-300 flex-shrink-0"/>}
          </div>
        ))}
      </div>
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-3">
        <span className="text-3xl">🏆</span>
        <div>
          <p className="text-sm font-extrabold text-indigo-800">You&apos;re on track!</p>
          <p className="text-xs text-indigo-600">You&apos;ve completed {done} of {CHAPTERS.length} chapters</p>
          <div className="w-32 h-1.5 bg-indigo-200 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{width:`${done/CHAPTERS.length*100}%`}}/>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssignmentsTab() {
  const [filter, setFilter] = useState('All');
  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
        {['All','Homework','Quiz','Lab','Exam'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filter===f?'bg-indigo-600 text-white':'bg-gray-100 text-gray-600'}`}>{f}</button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900">Upcoming</h2>
          <span className="text-xs text-indigo-600 font-semibold">View all</span>
        </div>
        {UPCOMING.map(u=>(
          <div key={u.title} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className={`w-8 h-8 ${u.color} rounded-xl flex items-center justify-center text-sm flex-shrink-0`}>{u.icon}</div>
            <div className="flex-1"><p className="text-sm font-semibold text-gray-800">{u.title}</p><p className="text-xs text-gray-400">{u.date}</p></div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PC[u.priority]}`}>{u.priority}</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">Completed</h2>
        {COMPLETED.map(c=>(
          <div key={c.title} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-sm flex-shrink-0">{c.icon}</div>
            <div className="flex-1"><p className="text-sm font-semibold text-gray-500 line-through">{c.title}</p><p className="text-xs text-gray-400">{c.date}</p></div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600">Completed</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h2 className="text-sm font-extrabold text-red-500 mb-3">Late</h2>
        {LATE.map(l=>(
          <div key={l.title} className="flex items-center gap-3 py-2">
            <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center text-sm flex-shrink-0">{l.icon}</div>
            <div className="flex-1"><p className="text-sm font-semibold text-gray-800">{l.title}</p><p className="text-xs text-gray-400">{l.date}</p></div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">Late</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = ['Overview','Grades','Topics','Assignments'] as const;
type Tab = typeof TABS[number];

function PageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const init = (searchParams.get('tab') as Tab) || 'Overview';
  const [tab, setTab] = useState<Tab>(TABS.includes(init as Tab) ? init as Tab : 'Overview');
  const content: Record<Tab, React.ReactNode> = { Overview:<OverviewTab/>, Grades:<GradesTab/>, Topics:<TopicsTab/>, Assignments:<AssignmentsTab/> };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 pt-3 pb-0 border-b border-gray-100 sticky top-14 z-10">
        <div className="flex items-center justify-between mb-3">
          <button onClick={()=>router.back()}><ArrowLeft className="w-5 h-5 text-gray-600"/></button>
          <button><MoreVertical className="w-5 h-5 text-gray-400"/></button>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white text-xl flex-shrink-0">🌿</div>
          <div className="flex-1"><h1 className="font-extrabold text-gray-900 text-lg">{CLASS.name}</h1><p className="text-xs text-gray-400">{CLASS.sub}</p></div>
          <div className="text-right"><p className="text-[10px] text-gray-400">Current Grade</p><p className="text-2xl font-extrabold text-gray-900">{CLASS.grade}%</p></div>
        </div>
        <div className="flex">
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all ${tab===t?'text-indigo-600 border-indigo-600':'text-gray-400 border-transparent'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 py-4 pb-24">{content[tab]}</div>
    </div>
  );
}

export default function ClassDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"/></div>}>
      <PageContent/>
    </Suspense>
  );
}
