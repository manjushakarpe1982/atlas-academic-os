'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, ArrowRight } from 'lucide-react';
import { DAYS, DATES, EVENTS, FILTER_CHIPS, getEventsForDate, getTypeBadge, getTypeIcon, CalEvent } from './shared';

interface Props {
  viewMode: 'Month' | 'Week' | 'Day';
  onViewChange: (v: 'Month' | 'Week' | 'Day') => void;
  onEventClick: (ev: CalEvent) => void;
  onAddClick: () => void;
}

export default function CalendarMain({ viewMode, onViewChange, onEventClick, onAddClick }: Props) {
  const [selected, setSelected] = useState(16);
  const [filter, setFilter] = useState('All');

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

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
        <h2 className="text-base font-extrabold text-gray-900">May 2025</h2>
        <button><ChevronRight className="w-5 h-5 text-gray-400" /></button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 mb-4">
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
          ))}
        </div>
        {DATES.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((d, di) => {
              if (!d) return <div key={di} />;
              const isCurrentMonth = wi === 0 && d > 20 ? false : wi === 4 && d < 10 ? false : true;
              const evts = isCurrentMonth ? getEventsForDate(d) : [];
              const isSelected = d === selected && isCurrentMonth;
              const isToday = d === 15 && isCurrentMonth;
              return (
                <button key={di} onClick={() => isCurrentMonth && setSelected(d)}
                  className="flex flex-col items-center py-1 min-h-[40px]">
                  <span className={`w-7 h-7 flex items-center justify-center text-xs font-semibold rounded-full transition-all ${
                    !isCurrentMonth ? 'text-gray-300' :
                    isSelected ? 'bg-indigo-600 text-white' :
                    isToday ? 'bg-indigo-100 text-indigo-600 font-extrabold' :
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
