'use client';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { DAYS, DATES, EVENTS, SOURCES, getEventsForDate, getCatColor, CalEvent } from './shared';

interface Props {
  selected: number;
  tab: 'Month' | 'Week' | 'Agenda';
  onSelectDate: (d: number) => void;
  onTabChange: (t: 'Month' | 'Week' | 'Agenda') => void;
  onEventClick: (ev: CalEvent) => void;
  onAddClick: () => void;
}

export default function CalendarMain({ selected, tab, onSelectDate, onTabChange, onEventClick, onAddClick }: Props) {
  const upcoming = EVENTS.filter(e => e.date >= 17).slice(0, 4);

  return (
    <div className="px-4 py-4 pb-24">

      {/* Month / Week / Agenda */}
      <div className="flex bg-gray-100 rounded-full p-1 mb-4">
        {(['Month','Week','Agenda'] as const).map(t => (
          <button key={t} onClick={() => onTabChange(t)}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
              tab === t ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500'
            }`}>{t}</button>
        ))}
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
        <h2 className="text-base font-extrabold text-gray-900">June 2026</h2>
        <button><ChevronRight className="w-5 h-5 text-gray-400" /></button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 mb-5">
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d, i) => (
            <div key={i} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
          ))}
        </div>
        {DATES.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((d, di) => {
              const evts = d ? getEventsForDate(d) : [];
              const isSelected = d === selected;
              const isToday = d === 17;
              return (
                <button key={di} onClick={() => d && onSelectDate(d)}
                  className="flex flex-col items-center py-1.5 min-h-[44px] relative">
                  <span className={`w-7 h-7 flex items-center justify-center text-xs font-semibold rounded-full transition-all ${
                    !d ? '' :
                    isSelected ? 'bg-indigo-600 text-white' :
                    isToday ? 'bg-indigo-100 text-indigo-600 font-extrabold' :
                    'text-gray-700'
                  }`}>{d}</span>
                  {evts.length > 0 && (
                    <div className="mt-0.5 flex flex-col items-center gap-0">
                      {evts.slice(0, 1).map(ev => (
                        <span key={ev.id} className={`text-[7px] font-bold leading-tight ${ev.textColor} truncate max-w-[40px]`}>
                          {ev.title}
                        </span>
                      ))}
                      {evts.length === 1 && (
                        <span className={`text-[7px] leading-tight ${evts[0].textColor} truncate max-w-[40px]`}>
                          {evts[0].className}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold text-gray-900">Upcoming Events</h3>
          <button className="text-xs text-indigo-600 font-semibold">See All</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {upcoming.map(ev => {
            const cat = getCatColor(ev.category);
            return (
              <button key={ev.id} onClick={() => onEventClick(ev)}
                className="flex-shrink-0 w-28 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 text-left hover:border-indigo-200 transition-all">
                <div className="flex items-center gap-1 mb-2">
                  <div className={`w-6 h-8 ${cat.bg} rounded-lg flex flex-col items-center justify-center`}>
                    <span className="text-[7px] font-bold text-gray-500 leading-none">JUN</span>
                    <span className={`text-xs font-extrabold ${cat.text} leading-none`}>{ev.date}</span>
                  </div>
                </div>
                <p className="text-xs font-extrabold text-gray-900 truncate">{ev.title}</p>
                <p className="text-[10px] text-gray-400 truncate">{ev.className}</p>
                {ev.time && <p className="text-[10px] text-gray-400">{ev.time}</p>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Study Event */}
      <button onClick={onAddClick}
        className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 mb-5 hover:border-indigo-200 transition-all text-left">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Plus className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">Add Study Event</p>
          <p className="text-xs text-gray-400">Create your own study session, revision, or personal event.</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </button>

      {/* Calendar Sources */}
      <div>
        <h3 className="text-sm font-extrabold text-gray-900 mb-3">Calendar Sources</h3>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {SOURCES.map(s => (
            <div key={s.name} className="flex items-center gap-3 px-4 py-3.5">
              <span className="text-xl">{s.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{s.name}</p>
                <p className="text-xs text-gray-400">{s.sub}</p>
              </div>
              {s.connected ? (
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              ) : (
                <Plus className="w-4 h-4 text-indigo-600" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
