'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Clock, MapPin, BookOpen, Target, Zap, User } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

type EventType = 'class' | 'study' | 'exam' | 'deadline' | 'personal';

interface CalEvent {
  id: number; title: string; subtitle?: string;
  date: number; time?: string; duration?: string; type: EventType;
}

const EVENTS: CalEvent[] = [
  { id:1,  title:'Biology 101',       subtitle:'Mendel Hall 204',   date:19, time:'10:00 AM', duration:'1h',     type:'class'    },
  { id:2,  title:'English 110',       subtitle:'Arts Building 305', date:19, time:'11:00 AM', duration:'1h',     type:'class'    },
  { id:3,  title:'Statistics 201',    subtitle:'Math Hall 12',      date:20, time:'11:00 AM', duration:'1h 15m', type:'class'    },
  { id:4,  title:'History 105',       subtitle:'Humanities 201',    date:20, time:'1:00 PM',  duration:'1h',     type:'class'    },
  { id:5,  title:'Biology 101',       subtitle:'Mendel Hall 204',   date:21, time:'10:00 AM', duration:'1h',     type:'class'    },
  { id:6,  title:'English 110',       subtitle:'Arts Building 305', date:21, time:'11:00 AM', duration:'1h',     type:'class'    },
  { id:7,  title:'Statistics 201',    subtitle:'Math Hall 12',      date:22, time:'11:00 AM', duration:'1h 15m', type:'class'    },
  { id:8,  title:'Biology 101',       subtitle:'Mendel Hall 204',   date:23, time:'10:00 AM', duration:'1h',     type:'class'    },
  { id:9,  title:'Study: Mitosis',    subtitle:'Biology 101',       date:19, time:'2:00 PM',  duration:'45 min', type:'study'    },
  { id:10, title:'Study: Stats PS4',  subtitle:'Statistics 201',    date:20, time:'3:00 PM',  duration:'40 min', type:'study'    },
  { id:11, title:'Study: Essay',      subtitle:'English 110',       date:21, time:'4:00 PM',  duration:'20 min', type:'study'    },
  { id:12, title:'Bio Exam 2',        subtitle:'Mendel Hall 204',   date:26, time:'9:00 AM',  duration:'2h',     type:'exam'     },
  { id:13, title:'Statistics Quiz 3', subtitle:'Math Hall 12',      date:27, time:'11:00 AM', duration:'45 min', type:'exam'     },
  { id:14, title:'Stats PS#4 Due',    subtitle:'Submit on Canvas',  date:22, time:'11:59 PM', type:'deadline' },
  { id:15, title:'Biology Lab Report',subtitle:'Submit on Canvas',  date:20, time:'11:59 PM', type:'deadline' },
  { id:16, title:'English Essay 2',   subtitle:'Submit on Canvas',  date:25, time:'11:59 PM', type:'deadline' },
  { id:17, title:'Gym',               subtitle:'Fitness Center',    date:19, time:'7:00 AM',  duration:'1h',     type:'personal' },
  { id:18, title:'Gym',               subtitle:'Fitness Center',    date:22, time:'7:00 AM',  duration:'1h',     type:'personal' },
];

const TYPE_STYLES: Record<EventType, { dot:string; bg:string; text:string; border:string; label:string }> = {
  class:    { dot:'bg-indigo-500',  bg:'bg-indigo-100',  text:'text-indigo-700',  border:'border-indigo-200', label:'Class'    },
  study:    { dot:'bg-emerald-500', bg:'bg-emerald-100', text:'text-emerald-700', border:'border-emerald-200',label:'Study'    },
  exam:     { dot:'bg-red-500',     bg:'bg-red-100',     text:'text-red-700',     border:'border-red-200',    label:'Exam'     },
  deadline: { dot:'bg-orange-500',  bg:'bg-orange-100',  text:'text-orange-700',  border:'border-orange-200', label:'Deadline' },
  personal: { dot:'bg-gray-400',    bg:'bg-gray-100',    text:'text-gray-600',    border:'border-gray-200',   label:'Personal' },
};

const DAYS_H = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/* ─── Add Event Modal (UI only) ──────────────────────────────── */
function AddEventModal({ onClose }: { onClose: () => void }) {
  const [title,   setTitle]   = useState('');
  const [type,    setType]    = useState<EventType>('class');
  const [date,    setDate]    = useState('');
  const [time,    setTime]    = useState('');
  const [loc,     setLoc]     = useState('');
  const [note,    setNote]    = useState('');

  const INP = 'w-full bg-gray-50 border border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:bg-white text-gray-900 placeholder:text-gray-400 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all font-medium';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      {/* Sheet on mobile, dialog on desktop */}
      <div className="relative bg-white w-full sm:max-w-[440px] sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-0 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-extrabold text-gray-900">Add new event</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Title</label>
              <input className={INP} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Biology Lecture, Study Session…" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Type</label>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(TYPE_STYLES) as EventType[]).map((t) => (
                  <button key={t} type="button" onClick={() => setType(t)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize ${
                      type === t ? `${TYPE_STYLES[t].bg} ${TYPE_STYLES[t].border} ${TYPE_STYLES[t].text}` : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${TYPE_STYLES[t].dot}`} />
                    {TYPE_STYLES[t].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Date</label>
                <input type="date" className={INP} value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Time</label>
                <input type="time" className={INP} value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Location (optional)</label>
              <input className={INP} value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="e.g. Mendel Hall 204, Online…" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Note (optional)</label>
              <textarea className={INP + ' resize-none'} rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Any extra details…" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-all text-sm">Cancel</button>
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all text-sm shadow-sm shadow-indigo-500/20">Add event</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function CalendarPage() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(19);
  const [showModal,   setShowModal]   = useState(false);
  const [showPanel,   setShowPanel]   = useState(false);
  const [calView,     setCalView]     = useState<'month'|'week'|'day'>('month');

  const base = new Date(2026, 4 + monthOffset, 1);
  const year = base.getFullYear(), month = base.getMonth();
  const monthName  = MONTHS[month];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDow    = new Date(year, month, 1).getDay();
  const TODAY = 19;

  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const dayEvents = selectedDay
    ? EVENTS.filter((e) => e.date === selectedDay).sort((a, b) => (a.time || '').localeCompare(b.time || ''))
    : [];

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setShowPanel(true);
  };

  return (
    <AppLayout>
      {showModal && <AddEventModal onClose={() => setShowModal(false)} />}

      <div className="p-4 md:p-6 max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-gray-900">Calendar</h1>
            <p className="text-xs text-gray-400 mt-0.5">{monthName} {year}</p>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* View tabs */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5 gap-0.5">
              {(['month','week','day'] as const).map((v) => (
                <button key={v} onClick={() => setCalView(v)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    calView===v ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}>{v}</button>
              ))}
            </div>
            <button onClick={() => setMonthOffset(0)}
              className="hidden sm:block text-xs font-semibold text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 px-3 py-2 rounded-xl transition-all">
              Today
            </button>
            <button onClick={() => setMonthOffset((p) => p - 1)}
              className="p-2 rounded-xl border border-gray-200 hover:border-indigo-300 text-gray-500 hover:text-indigo-600 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setMonthOffset((p) => p + 1)}
              className="p-2 rounded-xl border border-gray-200 hover:border-indigo-300 text-gray-500 hover:text-indigo-600 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm shadow-indigo-500/20">
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add event</span>
            </button>
          </div>
        </div>

        {/* Legend — scrollable on mobile */}
        <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-1 scrollbar-none">
          {(Object.entries(TYPE_STYLES) as [EventType, typeof TYPE_STYLES[EventType]][]).map(([t, s]) => (
            <div key={t} className="flex items-center gap-1.5 flex-shrink-0">
              <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
              <span className="text-[11px] text-gray-500 font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Main layout — stacks on mobile */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* ── WEEK VIEW ────────────────────────────────────────── */}
          {calView === 'week' && (
            <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <p className="text-sm font-extrabold text-gray-900">Week of May 18 – 24, 2026</p>
                <span className="text-xs text-gray-400">Click a day to see details</span>
              </div>
              <div className="grid grid-cols-7 divide-x divide-gray-100">
                {['Mon 18','Tue 19','Wed 20','Thu 21','Fri 22','Sat 23','Sun 24'].map((d, i) => {
                  const dayNum = 18 + i;
                  const evs = EVENTS.filter((e) => e.date === dayNum);
                  const isToday = dayNum === 19;
                  return (
                    <div key={d} className={`min-h-[400px] p-2 cursor-pointer hover:bg-gray-50 transition-all ${isToday?'bg-indigo-50/40':''}`}
                      onClick={() => { setSelectedDay(dayNum); setCalView('day'); }}>
                      <div className={`text-center mb-2 py-1.5 rounded-xl ${isToday?'bg-indigo-600':'bg-transparent'}`}>
                        <p className={`text-[9px] font-bold uppercase ${isToday?'text-indigo-200':'text-gray-400'}`}>{d.split(' ')[0]}</p>
                        <p className={`text-base font-extrabold leading-none ${isToday?'text-white':'text-gray-800'}`}>{d.split(' ')[1]}</p>
                      </div>
                      <div className="space-y-1">
                        {evs.map((ev) => {
                          const s = TYPE_STYLES[ev.type];
                          return (
                            <div key={ev.id} className={`${s.bg} ${s.text} rounded-lg px-1.5 py-1 text-[10px] font-semibold leading-tight border ${s.border} truncate`}>
                              {ev.time && <span className="opacity-60">{ev.time} </span>}
                              {ev.title}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── DAY VIEW ─────────────────────────────────────────── */}
          {calView === 'day' && (
            <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedDay((p) => Math.max(1, (p||19)-1))}
                    className="p-1.5 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all">
                    <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                  <p className="text-sm font-extrabold text-gray-900">
                    {selectedDay === 19 ? 'Today · ' : ''}May {selectedDay || 19}, 2026
                  </p>
                  <button onClick={() => setSelectedDay((p) => Math.min(31, (p||19)+1))}
                    className="p-1.5 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all">
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>
                <button onClick={() => setShowModal(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-all">
                  <Plus className="w-3.5 h-3.5" /> Add event
                </button>
              </div>
              <div className="p-5">
                {/* Hour grid */}
                <div className="space-y-0">
                  {Array.from({length:16},(_,i)=>i+7).map((hr) => {
                    const timeStr = hr < 12 ? `${hr}:00 AM` : hr === 12 ? '12:00 PM' : `${hr-12}:00 PM`;
                    const evs = EVENTS.filter((e) => e.date === (selectedDay||19) && e.time?.startsWith(hr < 12 ? `${hr}:` : hr === 12 ? '12:' : `${hr-12}:`));
                    return (
                      <div key={hr} className="flex gap-3 min-h-[48px] border-b border-gray-50 py-1">
                        <div className="w-14 flex-shrink-0 text-[10px] font-medium text-gray-400 pt-0.5">{timeStr}</div>
                        <div className="flex-1 space-y-1">
                          {evs.map((ev) => {
                            const s = TYPE_STYLES[ev.type];
                            return (
                              <div key={ev.id} className={`${s.bg} border ${s.border} rounded-xl px-3 py-2`}>
                                <p className={`text-xs font-bold ${s.text}`}>{ev.title}</p>
                                {ev.subtitle && <p className="text-[10px] text-gray-400 mt-0.5">📍 {ev.subtitle}</p>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  {EVENTS.filter((e) => e.date === (selectedDay||19)).length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-sm font-medium">No events on this day</p>
                      <p className="text-xs mt-1">Click "Add event" to create one</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Monthly calendar */}
          {calView === 'month' && (
          <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/60">
              {DAYS_H.map((d) => (
                <div key={d} className="py-2.5 text-center text-[11px] font-extrabold text-gray-400 uppercase tracking-wide">
                  <span className="hidden sm:inline">{d}</span>
                  <span className="sm:hidden">{d[0]}</span>
                </div>
              ))}
            </div>

            {/* Cells — larger height */}
            <div className="grid grid-cols-7">
              {cells.map((day, idx) => {
                if (!day) return (
                  <div key={`b-${idx}`}
                    className={`min-h-[80px] sm:min-h-[110px] md:min-h-[120px] border-b border-r border-gray-100 bg-gray-50/30 ${idx % 7 === 6 ? 'border-r-0' : ''}`}
                  />
                );

                const evs       = EVENTS.filter((e) => e.date === day);
                const isToday   = day === TODAY && monthOffset === 0;
                const isSel     = day === selectedDay;
                const hasExam   = evs.some((e) => e.type === 'exam');
                const hasDead   = evs.some((e) => e.type === 'deadline');

                return (
                  <div key={day} onClick={() => handleDayClick(day)}
                    className={`min-h-[80px] sm:min-h-[110px] md:min-h-[120px] border-b border-r border-gray-100 p-1.5 sm:p-2 cursor-pointer transition-all hover:bg-indigo-50/40 ${
                      isSel ? 'bg-indigo-50 ring-1 ring-inset ring-indigo-300' : ''
                    } ${idx % 7 === 6 ? 'border-r-0' : ''}`}>

                    {/* Day number + urgency */}
                    <div className="flex items-center justify-between mb-1">
                      <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-extrabold transition-all ${
                        isToday  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30' :
                        isSel    ? 'bg-indigo-100 text-indigo-700' :
                                   'text-gray-700 hover:bg-gray-100'
                      }`}>{day}</div>
                      {(hasExam || hasDead) && (
                        <div className={`w-1.5 h-1.5 rounded-full ${hasExam ? 'bg-red-500' : 'bg-orange-500'}`} />
                      )}
                    </div>

                    {/* Event pills */}
                    <div className="space-y-0.5">
                      {evs.slice(0, 2).map((ev) => {
                        const s = TYPE_STYLES[ev.type];
                        return (
                          <div key={ev.id}
                            className={`text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-md truncate leading-tight ${s.bg} ${s.text}`}>
                            {ev.title}
                          </div>
                        );
                      })}
                      {evs.length > 2 && (
                        <p className="text-[9px] text-gray-400 font-semibold pl-0.5">+{evs.length - 2}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )} {/* end calView === 'month' */}

          {/* Day panel — slide up on mobile, fixed sidebar on desktop */}
          {/* Mobile backdrop */}
          {showPanel && (
            <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setShowPanel(false)} />
          )}

          <div className={`
            lg:w-[260px] lg:flex-shrink-0 lg:space-y-3 lg:static lg:translate-y-0 lg:bg-transparent
            fixed bottom-0 inset-x-0 z-40 bg-white rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto
            transition-transform duration-300
            ${showPanel ? 'translate-y-0' : 'translate-y-full'}
            lg:flex lg:flex-col lg:translate-y-0 lg:max-h-none lg:overflow-visible lg:rounded-none lg:shadow-none
          `}>
            {/* Mobile drag handle */}
            <div className="flex justify-center pt-3 pb-1 lg:hidden">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            <div className="p-4 lg:p-0 space-y-3">
              {/* Day heading */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                      {selectedDay ? `${monthName} ${selectedDay}` : 'Select a day'}
                    </p>
                    {selectedDay && (
                      <p className="text-xl font-extrabold text-gray-900 mt-0.5">
                        {dayEvents.length > 0 ? `${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : 'Free day 🎉'}
                      </p>
                    )}
                  </div>
                  <button onClick={() => setShowPanel(false)}
                    className="lg:hidden p-1.5 rounded-xl hover:bg-gray-100 transition-all">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Events for day */}
              {selectedDay && dayEvents.length > 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="divide-y divide-gray-50">
                    {dayEvents.map((ev) => {
                      const s = TYPE_STYLES[ev.type];
                      return (
                        <div key={ev.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-all">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${s.dot}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 leading-tight">{ev.title}</p>
                            {ev.subtitle && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                <p className="text-[11px] text-gray-400 truncate">{ev.subtitle}</p>
                              </div>
                            )}
                            {ev.time && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                <p className="text-[11px] text-gray-400">{ev.time}{ev.duration ? ` · ${ev.duration}` : ''}</p>
                              </div>
                            )}
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${s.bg} ${s.text}`}>
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : selectedDay ? (
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-5 text-center">
                  <p className="text-xl mb-1">🎉</p>
                  <p className="text-sm font-semibold text-gray-700">Nothing scheduled</p>
                  <p className="text-xs text-gray-400 mt-0.5">Good day to study ahead</p>
                  <button onClick={() => setShowModal(true)}
                    className="mt-3 flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline mx-auto">
                    <Plus className="w-3.5 h-3.5" /> Add something
                  </button>
                </div>
              ) : null}

              {/* Coming up */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Coming up</p>
                <div className="space-y-2.5">
                  {[
                    { label:'Bio Exam 2',         date:'May 26', dot:'bg-red-500',    text:'text-red-600'    },
                    { label:'Stats Quiz 3',        date:'May 27', dot:'bg-red-400',    text:'text-red-500'    },
                    { label:'English Essay Due',   date:'May 25', dot:'bg-orange-500', text:'text-orange-600' },
                    { label:'Biology Lab Report',  date:'May 20', dot:'bg-orange-400', text:'text-orange-500' },
                  ].map((u) => (
                    <div key={u.label} className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${u.dot}`} />
                      <p className="text-[11px] text-gray-700 flex-1 truncate font-medium">{u.label}</p>
                      <span className={`text-[10px] font-bold ${u.text} flex-shrink-0`}>{u.date}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
