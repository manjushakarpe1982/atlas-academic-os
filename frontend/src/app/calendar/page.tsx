'use client';

import { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, Clock,
  BookOpen, Target, AlertCircle, Calendar,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

/* ─── types ──────────────────────────────────────────────────── */
type EventType = 'class' | 'study' | 'exam' | 'deadline' | 'personal';

interface CalEvent {
  id: number;
  title: string;
  subtitle?: string;
  day: number;        // 0=Mon … 6=Sun
  startHour: number;  // 8 = 8am
  duration: number;   // in hours
  type: EventType;
}

/* ─── Mock events ────────────────────────────────────────────── */
const EVENTS: CalEvent[] = [
  // Classes
  { id:1,  title:'Biology 101',    subtitle:'Mendel 204',   day:0, startHour:10, duration:1,   type:'class'    },
  { id:2,  title:'Biology 101',    subtitle:'Mendel 204',   day:2, startHour:10, duration:1,   type:'class'    },
  { id:3,  title:'Biology 101',    subtitle:'Mendel 204',   day:4, startHour:10, duration:1,   type:'class'    },
  { id:4,  title:'Statistics 201', subtitle:'Math Hall 12', day:1, startHour:11, duration:1.25,type:'class'    },
  { id:5,  title:'Statistics 201', subtitle:'Math Hall 12', day:3, startHour:11, duration:1.25,type:'class'    },
  { id:6,  title:'English 110',    subtitle:'Arts 305',     day:0, startHour:11, duration:1,   type:'class'    },
  { id:7,  title:'English 110',    subtitle:'Arts 305',     day:2, startHour:11, duration:1,   type:'class'    },
  { id:8,  title:'English 110',    subtitle:'Arts 305',     day:4, startHour:11, duration:1,   type:'class'    },

  // Study blocks
  { id:9,  title:'Study: Mitosis', subtitle:'Biology 101',  day:1, startHour:14, duration:0.75,type:'study'    },
  { id:10, title:'Study: Stats PS4',subtitle:'Statistics',  day:2, startHour:15, duration:0.67,type:'study'    },
  { id:11, title:'Study: Essay',   subtitle:'English 110',  day:3, startHour:16, duration:0.33,type:'study'    },
  { id:12, title:'Study: Mitosis', subtitle:'Biology 101',  day:0, startHour:20, duration:1,   type:'study'    },

  // Exams / deadlines
  { id:13, title:'Bio Exam 2',     subtitle:'Mendel 204',   day:3, startHour:9,  duration:2,   type:'exam'     },
  { id:14, title:'Stats PS#4 Due', subtitle:'11:59 PM',     day:4, startHour:23, duration:0.5, type:'deadline' },
  { id:15, title:'English Essay',  subtitle:'Due 11:59 PM', day:6, startHour:23, duration:0.5, type:'deadline' },

  // Personal
  { id:16, title:'Gym',            subtitle:'Fitness Center',day:0, startHour:7,  duration:1,   type:'personal' },
  { id:17, title:'Gym',            subtitle:'Fitness Center',day:3, startHour:7,  duration:1,   type:'personal' },
  { id:18, title:'Lunch',          day:1, startHour:12, duration:1,   type:'personal' },
  { id:19, title:'Lunch',          day:3, startHour:12, duration:1,   type:'personal' },
];

const EVENT_STYLES: Record<EventType, { bg: string; border: string; text: string; dot: string }> = {
  class:    { bg:'bg-indigo-50',  border:'border-indigo-300', text:'text-indigo-800', dot:'bg-indigo-500'  },
  study:    { bg:'bg-green-50',   border:'border-green-300',  text:'text-green-800',  dot:'bg-green-500'   },
  exam:     { bg:'bg-red-50',     border:'border-red-400',    text:'text-red-800',    dot:'bg-red-500'     },
  deadline: { bg:'bg-orange-50',  border:'border-orange-300', text:'text-orange-800', dot:'bg-orange-500'  },
  personal: { bg:'bg-gray-50',    border:'border-gray-200',   text:'text-gray-600',   dot:'bg-gray-400'    },
};

const DAYS   = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DAYS_S = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const HOURS  = Array.from({ length: 16 }, (_, i) => i + 7); // 7am–10pm

const HOUR_H = 60; // px per hour

/* ─── Legend ─────────────────────────────────────────────────── */
const LEGEND = [
  { type:'class'    as EventType, label:'Class'      },
  { type:'study'    as EventType, label:'Study block' },
  { type:'exam'     as EventType, label:'Exam'        },
  { type:'deadline' as EventType, label:'Deadline'    },
  { type:'personal' as EventType, label:'Personal'    },
];

export default function CalendarPage() {
  const [weekOffset, setWeekOffset]  = useState(0);
  const [selected,   setSelected]    = useState<CalEvent | null>(null);

  // "current" week label
  const baseDate  = new Date(2026, 10, 16); // Nov 16 2026 (Mon)
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  const weekLabel = baseDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) +
    ' – ' +
    new Date(baseDate.getTime() + 6*86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const todayCol = 1; // Tuesday

  return (
    <AppLayout>
      <div className="p-6 max-w-[1300px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            <p className="text-sm text-gray-400 mt-0.5">{weekLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Legend */}
            <div className="flex items-center gap-3 mr-3">
              {LEGEND.map((l) => (
                <div key={l.type} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${EVENT_STYLES[l.type].dot}`} />
                  <span className="text-xs text-gray-500 font-medium">{l.label}</span>
                </div>
              ))}
            </div>

            <button onClick={() => setWeekOffset(0)}
              className="text-xs font-semibold text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 px-3 py-2 rounded-xl transition-all">
              Today
            </button>
            <button onClick={() => setWeekOffset((p) => p - 1)}
              className="p-2 rounded-xl border border-gray-200 hover:border-indigo-300 text-gray-500 hover:text-indigo-600 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setWeekOffset((p) => p + 1)}
              className="p-2 rounded-xl border border-gray-200 hover:border-indigo-300 text-gray-500 hover:text-indigo-600 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all ml-1">
              <Plus className="w-3.5 h-3.5" /> Add event
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          {/* ── Grid ────────────────────────────────────────── */}
          <div className="flex-1 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">

            {/* Day headers */}
            <div className="grid border-b border-gray-100" style={{ gridTemplateColumns:'60px repeat(7,1fr)' }}>
              <div className="py-3 border-r border-gray-50" />
              {DAYS.map((d, i) => (
                <div key={d} className={`py-3 text-center border-r border-gray-50 last:border-r-0 ${i === todayCol ? 'bg-indigo-50' : ''}`}>
                  <p className={`text-[11px] font-semibold uppercase tracking-wide ${i === todayCol ? 'text-indigo-600' : 'text-gray-400'}`}>
                    {DAYS_S[i]}
                  </p>
                  <p className={`text-sm font-bold mt-0.5 ${i === todayCol ? 'text-indigo-700' : 'text-gray-700'}`}>
                    {16 + i}
                  </p>
                  {i === todayCol && <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mx-auto mt-1" />}
                </div>
              ))}
            </div>

            {/* Time grid */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              <div className="relative" style={{ gridTemplateColumns:'60px repeat(7,1fr)' }}>

                {/* Hour rows */}
                {HOURS.map((h) => (
                  <div key={h} className="flex border-b border-gray-50" style={{ height: HOUR_H }}>
                    <div className="w-[60px] flex-shrink-0 flex items-start justify-end pr-3 pt-1">
                      <span className="text-[10px] text-gray-300 font-medium">
                        {h === 12 ? '12pm' : h > 12 ? `${h-12}pm` : `${h}am`}
                      </span>
                    </div>
                    {DAYS.map((_, di) => (
                      <div key={di} className={`flex-1 border-l border-gray-50 ${di === todayCol ? 'bg-indigo-50/30' : ''}`} />
                    ))}
                  </div>
                ))}

                {/* Events overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{ left: 60 }}>
                  {EVENTS.map((ev) => {
                    const st     = EVENT_STYLES[ev.type];
                    const topPx  = (ev.startHour - 7) * HOUR_H;
                    const htPx   = Math.max(ev.duration * HOUR_H, 24);
                    const colW   = `calc((100% - 0px) / 7)`;
                    const leftPx = `calc(${ev.day} * (100% / 7) + 2px)`;

                    return (
                      <div
                        key={ev.id}
                        onClick={(e) => { e.stopPropagation(); setSelected(ev); }}
                        className={`absolute rounded-lg border-l-4 px-2 py-1 cursor-pointer pointer-events-auto hover:shadow-md transition-all overflow-hidden ${st.bg} ${st.border}`}
                        style={{
                          top: topPx + 2,
                          height: htPx - 4,
                          left: leftPx,
                          width: `calc(100% / 7 - 4px)`,
                          zIndex: 10,
                        }}
                      >
                        <p className={`text-[10px] font-bold leading-tight truncate ${st.text}`}>{ev.title}</p>
                        {ev.subtitle && htPx > 36 && (
                          <p className={`text-[9px] truncate ${st.text} opacity-70`}>{ev.subtitle}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right panel ─────────────────────────────────── */}
          <div className="w-[200px] flex-shrink-0 space-y-3">

            {/* Event detail */}
            {selected ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-3 h-3 rounded-full mt-0.5 ${EVENT_STYLES[selected.type].dot}`} />
                  <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-500 text-lg leading-none">×</button>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-0.5">{selected.title}</p>
                {selected.subtitle && <p className="text-xs text-gray-400 mb-2">{selected.subtitle}</p>}
                <div className="space-y-1 text-[11px] text-gray-500">
                  <p className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {DAYS[selected.day]}</p>
                  <p className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selected.startHour > 12 ? `${selected.startHour-12}:00 PM` : `${selected.startHour}:00 AM`}
                    {' '}&nbsp;·&nbsp;{Math.round(selected.duration * 60)} min
                  </p>
                  <p className="capitalize font-medium text-gray-700 mt-1 pt-1 border-t border-gray-50">{selected.type}</p>
                </div>
              </div>
            ) : (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                <p className="text-xs font-bold text-indigo-700 mb-1">Click any event</p>
                <p className="text-[11px] text-indigo-500 font-light">to see its details here</p>
              </div>
            )}

            {/* Upcoming */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Upcoming</p>
              <div className="space-y-2.5">
                {[
                  { label:'Bio Exam 2',        day:'Thu', color:'text-red-600',    dot:'bg-red-500'    },
                  { label:'Stats PS#4 Due',     day:'Fri', color:'text-orange-600', dot:'bg-orange-500' },
                  { label:'English Essay Due',  day:'Mon', color:'text-orange-600', dot:'bg-orange-500' },
                ].map((u) => (
                  <div key={u.label} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${u.dot}`} />
                    <p className="text-[11px] text-gray-600 flex-1 truncate">{u.label}</p>
                    <span className={`text-[10px] font-bold ${u.color}`}>{u.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Study hours */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">This week</p>
              <p className="text-2xl font-extrabold text-indigo-600">8.5h</p>
              <p className="text-[11px] text-gray-400">study time planned</p>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width:'68%' }} />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">68% of your 12.5h goal</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
