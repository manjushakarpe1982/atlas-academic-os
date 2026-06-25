'use client';
import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, ArrowRight } from 'lucide-react';
import { DAYS, FILTER_CHIPS, getEventsForDate, getTypeBadge, getTypeIcon, getTypeDotColor, getTypeBgColor, getTypeTextColor, formatEventDate, CalEvent } from './shared';

interface Props {
  events: CalEvent[];
  viewMode: 'Month' | 'Week' | 'Day';
  onViewChange: (v: 'Month' | 'Week' | 'Day') => void;
  onEventClick: (ev: CalEvent) => void;
  onAddClick: () => void;
}

function EventCard({ ev, onClick }: { ev: CalEvent; onClick: (ev: CalEvent) => void }) {
  const badge = getTypeBadge(ev.type);
  return (
    <button onClick={() => onClick(ev)}
      className="w-full bg-white rounded-lg border border-gray-100 shadow-sm p-3.5 flex items-center gap-3 text-left hover:border-indigo-200 transition-all">
      <div className={`w-10 h-10 ${getTypeBgColor(ev.type)} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
        {getTypeIcon(ev.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate">{ev.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {ev.date ? formatEventDate(ev.date) : 'No due date'}
          {ev.time ? ` • ${ev.time}` : ''}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}>{badge.text}</span>
        <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${
          ev.source === 'syllabus' ? 'text-orange-600 bg-orange-50' : 'text-blue-600 bg-blue-50'
        }`}>{ev.source === 'syllabus' ? 'Syllabus' : 'Calendar'}</span>
      </div>
    </button>
  );
}

export default function CalendarMain({ events, viewMode, onViewChange, onEventClick, onAddClick }: Props) {
  const [selected, setSelected] = useState(new Date().getDate());
  const [filter, setFilter] = useState('All');
  const [showAllEvents, setShowAllEvents] = useState<Record<string, boolean>>({});
  const overdueRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);
  const upcomingRef = useRef<HTMLDivElement>(null);
  const noDateRef = useRef<HTMLDivElement>(null);
  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    const y = ref.current.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
  const [showYearGrid, setShowYearGrid] = useState(false);
  const yearStart = Math.floor(pickerYear / 12) * 12;

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const prevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else setCurrentMonth(currentMonth - 1); setSelected(1); };
  const nextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else setCurrentMonth(currentMonth + 1); setSelected(1); };

  // Calendar grid
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarDates: (number | null)[][] = [];
  let day = 1;
  for (let week = 0; week < 6; week++) {
    const row: (number | null)[] = [];
    for (let col = 0; col < 7; col++) {
      if (week === 0 && col < firstDay) row.push(null);
      else if (day > daysInMonth) row.push(null);
      else { row.push(day); day++; }
    }
    if (row.every(d => d === null)) break;
    calendarDates.push(row);
  }

  // Week
  const weekStart = new Date(currentYear, currentMonth, selected);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(d.getDate() + i); return d; });
  const prevWeek = () => { const d = selected - 7; if (d < 1) prevMonth(); else setSelected(d); };
  const nextWeek = () => { const d = selected + 7; if (d > daysInMonth) nextMonth(); else setSelected(d); };
  const prevDayNav = () => { if (selected <= 1) prevMonth(); else setSelected(selected - 1); };
  const nextDayNav = () => { if (selected >= daysInMonth) nextMonth(); else setSelected(selected + 1); };

  const today = new Date();
  const isToday = (d: number) => d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  // Next important
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const nextImportant = events.find(e => (e.type === 'quiz' || e.type === 'exam') && e.date >= todayStr);

  // Group events by status
  const allFiltered = filter === 'All' ? events : events.filter(e => e.type === filter.toLowerCase());
  const overdue = allFiltered.filter(e => e.date && e.date < todayStr).sort((a, b) => a.date.localeCompare(b.date));
  const todayEvents = allFiltered.filter(e => e.date === todayStr);
  const upcoming = allFiltered.filter(e => e.date && e.date > todayStr).sort((a, b) => a.date.localeCompare(b.date));
  const noDate = allFiltered.filter(e => !e.date);

  return (
    <div className="px-4 py-4 pb-12 relative">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-extrabold text-gray-900">Calendar</h1>
      </div>

      {/* View Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
        {(['Month','Week','Day'] as const).map(v => (
          <button key={v} onClick={() => onViewChange(v)}
            className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${viewMode === v ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500'}`}>{v}</button>
        ))}
      </div>

      {/* ── MONTH VIEW ── */}
      {viewMode === 'Month' && (
        <>
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth}><ChevronLeft className="w-5 h-5 text-gray-500" /></button>
            <button onClick={() => { setPickerYear(currentYear); setShowPicker(true); }}
              className="text-base font-extrabold text-gray-900 hover:text-indigo-600 transition-colors">
              {MONTH_NAMES[currentMonth]} {currentYear} ▾
            </button>
            <button onClick={nextMonth}><ChevronRight className="w-5 h-5 text-gray-500" /></button>
          </div>

          {/* Picker Modal */}
          {showPicker && (
            <>
              <div className="fixed inset-0 bg-black/40 z-40" onClick={() => { setShowPicker(false); setShowYearGrid(false); }} />
              <div className="fixed inset-x-4 top-1/4 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 p-5 max-w-sm mx-auto">
                {showYearGrid ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={() => setPickerYear(yearStart - 12)}><ChevronLeft className="w-5 h-5 text-gray-500" /></button>
                      <p className="text-sm font-extrabold text-gray-900">{yearStart} – {yearStart + 11}</p>
                      <button onClick={() => setPickerYear(yearStart + 12)}><ChevronRight className="w-5 h-5 text-gray-500" /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: 12 }, (_, i) => yearStart + i).map(y => (
                        <button key={y} onClick={() => { setPickerYear(y); setShowYearGrid(false); }}
                          className={`py-2.5 rounded-xl text-sm font-bold transition-all ${y === currentYear ? 'bg-indigo-600 text-white' : y === today.getFullYear() ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>{y}</button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={() => setPickerYear(pickerYear - 1)}><ChevronLeft className="w-5 h-5 text-gray-500" /></button>
                      <button onClick={() => setShowYearGrid(true)} className="text-lg font-extrabold text-gray-900 hover:text-indigo-600">{pickerYear} ▾</button>
                      <button onClick={() => setPickerYear(pickerYear + 1)}><ChevronRight className="w-5 h-5 text-gray-500" /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {MONTH_NAMES.map((m, i) => (
                        <button key={m} onClick={() => { setCurrentMonth(i); setCurrentYear(pickerYear); setSelected(1); setShowPicker(false); setShowYearGrid(false); }}
                          className={`py-2.5 rounded-xl text-sm font-bold transition-all ${i === currentMonth && pickerYear === currentYear ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-indigo-50'}`}>{m.slice(0, 3)}</button>
                      ))}
                    </div>
                  </>
                )}
                <div className="flex gap-2 mt-4">
                  <button onClick={() => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); setSelected(today.getDate()); setShowPicker(false); setShowYearGrid(false); }}
                    className="flex-1 border border-indigo-200 text-indigo-600 font-bold py-2 rounded-xl text-sm">Today</button>
                  <button onClick={() => { setShowPicker(false); setShowYearGrid(false); }}
                    className="flex-1 bg-gray-100 text-gray-600 font-bold py-2 rounded-xl text-sm">Cancel</button>
                </div>
              </div>
            </>
          )}

          {/* Calendar Grid */}
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 mb-4">
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map(d => <div key={d} className="text-center text-[12px] font-bold text-gray-500 py-1">{d}</div>)}
            </div>
            {calendarDates.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7">
                {week.map((d, di) => {
                  if (!d) return <div key={di} />;
                  const evts = getEventsForDate(events, currentYear, currentMonth, d);
                  return (
                    <button key={di} onClick={() => setSelected(d)} className="flex flex-col items-center py-1 min-h-[47px]">
                      <span className={`w-7 h-7 flex items-center justify-center text-sm font-semibold rounded-full transition-all ${
                        d === selected ? 'bg-indigo-600 text-white' : isToday(d) ? 'bg-indigo-100 text-indigo-600 font-extrabold' : 'text-gray-700'
                      }`}>{d}</span>
                      {evts.length > 0 && (
                        <div className="flex gap-0.5 mt-0.5">
                          {evts.slice(0, 3).map((ev, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full ${getTypeDotColor(ev.type)}`} />)}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap mb-7">
            {[{ label:'Quiz', color:'bg-purple-500' },{ label:'Assignment', color:'bg-green-500' },{ label:'Exam', color:'bg-red-500' },{ label:'Study Session', color:'bg-indigo-500' },{ label:'Class', color:'bg-blue-500' },{ label:'Personal', color:'bg-gray-500' }].map(l => (
              <div key={l.label} className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${l.color}`} />
                <span className="text-[10px] text-gray-500">{l.label}</span>
              </div>
            ))}
          </div>
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
              const dayEvents = getEventsForDate(events, wd.getFullYear(), wd.getMonth(), dayNum);
              const dayNames = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
              return (
                <div key={dayNum}>
                  <div className="flex items-start gap-3 py-2">
                    <div className="w-10 text-center flex-shrink-0">
                      <p className="text-[12px] text-gray-500 font-bold">{dayNames[wd.getDay()]}</p>
                      <p className={`text-base font-bold ${isToday(dayNum) ? 'text-indigo-600' : 'text-gray-900'}`}>{dayNum}</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {dayEvents.length === 0 ? <div className="h-8" /> : dayEvents.map(ev => {
                        const badge = getTypeBadge(ev.type);
                        return (
                          <button key={ev.id} onClick={() => onEventClick(ev)}
                            className={`w-full ${getTypeBgColor(ev.type)} rounded-lg px-3 py-2 flex items-center justify-between text-left`}>
                            <div>
                              <p className={`text-xs font-bold ${getTypeTextColor(ev.type)}`}>{ev.title}</p>
                              <p className="text-[10px] text-gray-500">{ev.time || 'All day'}</p>
                            </div>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badge.color}`}>{badge.text}</span>
                          </button>
                        );
                      })}
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
        const dayEvents = getEventsForDate(events, currentYear, currentMonth, selected);
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
            {dayEvents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-4 text-center">
                <p className="text-sm text-gray-500">No events for this day</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 mb-4 space-y-2">
                {dayEvents.map(ev => {
                  const badge = getTypeBadge(ev.type);
                  return (
                    <button key={ev.id} onClick={() => onEventClick(ev)}
                      className={`w-full ${getTypeBgColor(ev.type)} rounded-lg px-3 py-3 text-left`}>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-bold ${getTypeTextColor(ev.type)}`}>{ev.title}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badge.color}`}>{badge.text}</span>
                      </div>
                      <p className="text-[12px] text-gray-500 mt-0.5">{ev.time ? `${ev.time}${ev.endTime ? ` – ${ev.endTime}` : ''}` : 'All day'}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        );
      })()}

      {/* Next Important */}
      {nextImportant && (
        <div className="bg-orange-50  border border-orange-200 rounded-lg p-3 mb-7 text-black">
          <p className="text-[15px] font-bold  text-orange-600 mb-2">Next Important</p>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-base font-extrabold">{nextImportant.title}</p>
              <p className="text-xs text-indigo-600 mt-0.5">{formatEventDate(nextImportant.date)}{nextImportant.time ? ` • ${nextImportant.time}` : ''}</p>
              {(nextImportant.weight > 0 || nextImportant.currentGrade !== null) && (
                <p className="text-xs text-orange-600 mt-1">
                  {nextImportant.weight > 0 ? `Worth ${nextImportant.weight}%` : ''}{nextImportant.weight > 0 && nextImportant.currentGrade !== null ? ' • ' : ''}{nextImportant.currentGrade !== null ? `Current Grade: ${nextImportant.currentGrade}%` : ''}
                </p>
              )}
            </div>
            <button onClick={() => onEventClick(nextImportant)} className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold">
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <button className="w-full bg-white text-indigo-600 font-bold py-2.5 rounded-lg border border-indigo-200 mt-3 text-sm flex items-center justify-center gap-2">
            Start Studying <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Events List — Grouped */}
      <div className="mb-4">
        <div className="flex gap-1.5 overflow-x-auto mb-4" style={{ scrollbarWidth: 'none' }}>
          {FILTER_CHIPS.map(f => (
            <button key={f} onClick={() => { setFilter(f); setShowAllEvents({}); }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>{f}</button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { label: 'Overdue', count: overdue.length, bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700', ref: overdueRef },
            { label: 'Today', count: todayEvents.length, bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700', ref: todayRef },
            { label: 'Upcoming', count: upcoming.length, bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-700', ref: upcomingRef },
            { label: 'No Date', count: noDate.length, bg: 'bg-gray-50', border: 'border-gray-100', text: 'text-gray-600', ref: noDateRef },
          ].map(s => (
            <button key={s.label} onClick={() => s.count > 0 && scrollTo(s.ref)}
              className={`${s.bg} border ${s.border} rounded-lg p-1 text-center transition-all ${s.count > 0 ? 'hover:opacity-80 cursor-pointer' : 'opacity-50 cursor-default'}`}>
              <p className={`text-lg font-extrabold ${s.text}`}>{s.count}</p>
              <p className="text-[10px] text-gray-500 font-semibold">{s.label}</p>
            </button>
          ))}
        </div>

        {allFiltered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <p className="text-sm text-gray-500">No events found</p>
            <p className="text-xs text-gray-400 mt-1">Add events or sync your calendar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {overdue.length > 0 && (
              <div ref={overdueRef}>
                <h3 className="text-sm font-bold text-red-600  mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full" /> Overdue ({overdue.length})
                </h3>
                <div className="space-y-2">{(showAllEvents.overdue ? overdue : overdue.slice(0, 3)).map(ev => <EventCard key={ev.id} ev={ev} onClick={onEventClick} />)}</div>
                {overdue.length > 3 && (
                  <button onClick={() => setShowAllEvents(p => ({ ...p, overdue: !p.overdue }))}
                    className="w-full mt-2 flex items-center justify-center gap-2 text-sm font-bold text-red-600 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-all">
                    {showAllEvents.overdue ? 'Show Less' : `Show More (${overdue.length - 3} more)`}
                  </button>
                )}
              </div>
            )}
            {todayEvents.length > 0 && (
              <div ref={todayRef}>
                <h3 className="text-sm font-bold text-green-600  mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full" /> Today ({todayEvents.length})
                </h3>
                <div className="space-y-2">{(showAllEvents.today ? todayEvents : todayEvents.slice(0, 3)).map(ev => <EventCard key={ev.id} ev={ev} onClick={onEventClick} />)}</div>
                {todayEvents.length > 3 && (
                  <button onClick={() => setShowAllEvents(p => ({ ...p, today: !p.today }))}
                    className="w-full mt-2 flex items-center justify-center gap-2 text-sm font-bold text-green-600 py-2 rounded-lg border border-green-200 hover:bg-green-50 transition-all">
                    {showAllEvents.today ? 'Show Less' : `Show More (${todayEvents.length - 3} more)`}
                  </button>
                )}
              </div>
            )}
            {upcoming.length > 0 && (
              <div ref={upcomingRef}>
                <h3 className="text-sm font-bold text-indigo-600  mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full" /> Upcoming ({upcoming.length})
                </h3>
                <div className="space-y-2">
                  {(showAllEvents.upcoming ? upcoming : upcoming.slice(0, 3)).map(ev => <EventCard key={ev.id} ev={ev} onClick={onEventClick} />)}
                </div>
                {upcoming.length > 3 && (
                  <button onClick={() => setShowAllEvents(p => ({ ...p, upcoming: !p.upcoming }))}
                    className="w-full mt-2 flex items-center justify-center gap-2 text-sm font-bold text-indigo-600 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-all">
                    {showAllEvents.upcoming ? 'Show Less' : `Show More (${upcoming.length - 3} more)`}
                  </button>
                )}
              </div>
            )}
            {noDate.length > 0 && (
              <div ref={noDateRef}>
                <h3 className="text-sm font-bold text-gray-500  mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full" /> No Due Date ({noDate.length})
                </h3>
                <div className="space-y-2">{(showAllEvents.nodate ? noDate : noDate.slice(0, 3)).map(ev => <EventCard key={ev.id} ev={ev} onClick={onEventClick} />)}</div>
                {noDate.length > 3 && (
                  <button onClick={() => setShowAllEvents(p => ({ ...p, nodate: !p.nodate }))}
                    className="w-full mt-2 flex items-center justify-center gap-2 text-sm font-bold text-gray-500 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all">
                    {showAllEvents.nodate ? 'Show Less' : `Show More (${noDate.length - 3} more)`}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={onAddClick}
        className="fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 rounded-full shadow-xl flex items-center justify-center hover:bg-indigo-700 transition-all z-30">
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
