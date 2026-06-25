'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, ArrowRight } from 'lucide-react';
import { DAYS, EVENTS, FILTER_CHIPS, getEventsForDate, getTypeBadge, getTypeIcon, CalEvent } from './shared';

interface Props {
  viewMode: 'Month' | 'Week' | 'Day';
  onViewChange: (v: 'Month' | 'Week' | 'Day') => void;
  onEventClick: (ev: CalEvent) => void;
  onAddClick: () => void;
}

export default function CalendarMain({ viewMode, onViewChange, onEventClick, onAddClick }: Props) {
  const [selected, setSelected] = useState(new Date().getDate());
  const [filter, setFilter] = useState('All');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  // Navigate months
  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else { setCurrentMonth(currentMonth - 1); }
    setSelected(1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else { setCurrentMonth(currentMonth + 1); }
    setSelected(1);
  };

  // Generate calendar grid for current month
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const calendarDates: (number | null)[][] = [];
  let day = 1;
  let prevDay = daysInPrevMonth - firstDay + 1;
  let nextDay = 1;

  for (let week = 0; week < 6; week++) {
    const row: (number | null)[] = [];
    for (let col = 0; col < 7; col++) {
      if (week === 0 && col < firstDay) {
        row.push(null); prevDay++;
      } else if (day > daysInMonth) {
        row.push(null); nextDay++;
      } else {
        row.push(day); day++;
      }
    }
    if (row.every(d => d === null)) break;
    calendarDates.push(row);
  }

  // Week view range
  const weekStart = new Date(currentYear, currentMonth, selected);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
  const prevWeek = () => { const d = selected - 7; if (d < 1) prevMonth(); else setSelected(d); };
  const nextWeek = () => { const d = selected + 7; if (d > daysInMonth) nextMonth(); else setSelected(d); };

  // Day view
  const prevDayNav = () => { if (selected <= 1) prevMonth(); else setSelected(selected - 1); };
  const nextDayNav = () => { if (selected >= daysInMonth) nextMonth(); else setSelected(selected + 1); };

  const today = new Date();
  const isToday = (d: number) => d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  // Next important event
  const nextImportant = EVENTS.find(e => (e.type === 'quiz' || e.type === 'exam') && e.date >= 15);

  // Filtered upcoming events
  const upcoming = EVENTS.filter(e => e.date >= 15).sort((a, b) => a.date - b.date);
  const filtered = filter === 'All' ? upcoming : upcoming.filter(e => e.type === filter.toLowerCase());

  return (
    <div className="px-4 py-4 pb-28 relative">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-extrabold text-gray-900">Calendar</h1>
        <div className="w-5 h-5" />
      </div>

      {/* View Toggle */}
      <div className="flex bg-gray-100 rounded-full p-1 mb-4">
        {(['Month','Week','Day'] as const).map(v => (
          <button key={v} onClick={() => onViewChange(v)}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
              viewMode === v ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500'
            }`}>{v}</button>
        ))}
      </div>

      {/* ── MONTH VIEW ── */}
      {viewMode === 'Month' && (
        <>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth}><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
        <h2 className="text-base font-extrabold text-gray-900">{MONTH_NAMES[currentMonth]} {currentYear}</h2>
        <button onClick={nextMonth}><ChevronRight className="w-5 h-5 text-gray-400" /></button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 mb-4">
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
          ))}
        </div>
        {calendarDates.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((d, di) => {
              if (!d) return <div key={di} />;
              const evts = getEventsForDate(d);
              return (
                <button key={di} onClick={() => setSelected(d)}
                  className="flex flex-col items-center py-1 min-h-[40px]">
                  <span className={`w-7 h-7 flex items-center justify-center text-xs font-semibold rounded-full transition-all ${
                    d === selected ? 'bg-indigo-600 text-white' :
                    isToday(d) ? 'bg-indigo-100 text-indigo-600 font-extrabold' :
                    'text-gray-700'
                  }`}>{d}</span>
                  {evts.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {evts.slice(0, 3).map((ev, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${
                          ev.type === 'quiz' ? 'bg-purple-500' :
                          ev.type === 'exam' ? 'bg-red-500' :
                          ev.type === 'assignment' ? 'bg-green-500' :
                          ev.type === 'study' ? 'bg-indigo-500' :
                          'bg-blue-500'
                        }`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Event Type Legend */}
      <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
        {[
          { label: 'Quiz', color: 'bg-purple-500' },
          { label: 'Assignment', color: 'bg-green-500' },
          { label: 'Exam', color: 'bg-red-500' },
          { label: 'Study Session', color: 'bg-indigo-500' },
          { label: 'Class', color: 'bg-blue-500' },
          { label: 'Personal', color: 'bg-gray-500' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${l.color}`} />
            <span className="text-[10px] text-gray-500">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Next Important */}
        </>
      )}

      {/* ── WEEK VIEW ── */}
      {viewMode === 'Week' && (
        <>
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevWeek}><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
            <h2 className="text-sm font-extrabold text-gray-900">
              {MONTH_NAMES[weekDays[0].getMonth()]} {weekDays[0].getDate()} – {MONTH_NAMES[weekDays[6].getMonth()]} {weekDays[6].getDate()}, {currentYear}
            </h2>
            <button onClick={nextWeek}><ChevronRight className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="space-y-1 mb-4">
            {weekDays.map(wd => {
              const dayNum = wd.getDate();
              const dayEvents = getEventsForDate(dayNum);
              const dayNames = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
              return (
                <div key={dayNum}>
                  <div className="flex items-start gap-3 py-2">
                    <div className="w-10 text-center flex-shrink-0">
                      <p className="text-[10px] text-gray-400 font-bold">{dayNames[wd.getDay()]}</p>
                      <p className={`text-lg font-extrabold ${isToday(dayNum) ? 'text-indigo-600' : 'text-gray-900'}`}>{dayNum}</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {dayEvents.length === 0 ? (
                        <div className="h-8" />
                      ) : (
                        dayEvents.map(ev => {
                        const badge = getTypeBadge(ev.type);
                        return (
                          <button key={ev.id} onClick={() => onEventClick(ev)}
                            className={`w-full ${ev.color} rounded-lg px-3 py-2 flex items-center justify-between text-left`}>
                            <div>
                              <p className={`text-xs font-bold ${ev.textColor}`}>{ev.title}</p>
                              <p className="text-[10px] text-gray-500">{ev.time}</p>
                            </div>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badge.color}`}>{badge.text}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
                <div className="border-b border-gray-100 ml-14" />
              </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── DAY VIEW ── */}
      {viewMode === 'Day' && (() => {
        const dayEvents = getEventsForDate(selected).sort((a, b) => {
          const toMin = (t: string) => { const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i); if (!m) return 0; let h = parseInt(m[1]); if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12; if (m[3].toUpperCase() === 'AM' && h === 12) h = 0; return h * 60 + parseInt(m[2]); };
          return toMin(a.time) - toMin(b.time);
        });
        const dayName = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
        const dayOfWeek = new Date(currentYear, currentMonth, selected).getDay();
        const hours = ['9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM','6 PM','7 PM'];

        return (
          <>
            <div className="flex items-center justify-between mb-1">
              <button onClick={prevDayNav}><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
              <div className="text-center">
                <h2 className="text-base font-extrabold text-gray-900">{MONTH_NAMES[currentMonth]} {selected}, {currentYear}</h2>
                <p className="text-[10px] text-gray-400 font-bold">{dayName[dayOfWeek]}</p>
              </div>
              <button onClick={nextDayNav}><ChevronRight className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 mb-4">
              {hours.map(hour => {
                const hourEvents = dayEvents.filter(ev => ev.time.replace(':00 ', ' ').startsWith(hour.replace(' ', ':00 ').split(':')[0]));
                return (
                  <div key={hour} className="flex min-h-[48px] border-b border-gray-50 last:border-0">
                    <div className="w-12 text-[10px] text-gray-400 font-medium pt-1 flex-shrink-0">{hour}</div>
                    <div className="flex-1 py-1 space-y-1">
                      {hourEvents.map(ev => {
                        const badge = getTypeBadge(ev.type);
                        return (
                          <button key={ev.id} onClick={() => onEventClick(ev)}
                            className={`w-full ${ev.color} rounded-lg px-3 py-2 text-left`}>
                            <div className="flex items-center justify-between">
                              <p className={`text-xs font-bold ${ev.textColor}`}>{ev.title}</p>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badge.color}`}>{badge.text}</span>
                            </div>
                            <p className="text-[10px] text-gray-500">{ev.time}{ev.endTime ? ` – ${ev.endTime}` : ''}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}

      {/* Next Important */}
      {nextImportant && (
        <div className="bg-indigo-600 rounded-2xl p-4 mb-4 text-white">
          <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-200 mb-2">Next Important</p>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-base font-extrabold">{nextImportant.title}</p>
              <p className="text-xs text-indigo-200 mt-0.5">Tomorrow • {nextImportant.time}</p>
              <p className="text-xs text-indigo-200 mt-1">
                Worth {nextImportant.weight}% • Current Grade: {nextImportant.currentGrade ?? '—'}%
              </p>
            </div>
            <button onClick={() => onEventClick(nextImportant)}
              className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold">
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <button className="w-full bg-white text-indigo-600 font-bold py-2.5 rounded-xl mt-3 text-sm flex items-center justify-center gap-2">
            Start Studying <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upcoming Events */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">Upcoming (All Events)</h2>
          <button className="text-xs text-indigo-600 font-semibold">View All</button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto mb-3" style={{ scrollbarWidth: 'none' }}>
          {FILTER_CHIPS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 border border-gray-200'
              }`}>{f}</button>
          ))}
        </div>

        {/* Event List */}
        <div className="space-y-2.5">
          {filtered.map(ev => {
            const badge = getTypeBadge(ev.type);
            return (
              <button key={ev.id} onClick={() => onEventClick(ev)}
                className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5 flex items-center gap-3 text-left hover:border-indigo-200 transition-all">
                <div className={`w-10 h-10 ${ev.color} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                  {getTypeIcon(ev.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{ev.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">May {ev.date}, {ev.time}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${badge.color}`}>
                  {badge.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAB Add Button */}
      <button onClick={onAddClick}
        className="fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 rounded-full shadow-xl flex items-center justify-center hover:bg-indigo-700 transition-all z-30">
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
