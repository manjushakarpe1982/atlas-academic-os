'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { CalEvent } from './components/shared';
import CalendarMain from './components/CalendarMain';
import AddNewModal from './components/AddNewModal';
import AddStudySession from './components/AddStudySession';
import AddEventForm from './components/AddEventForm';
import EventDetail from './components/EventDetail';
import EditEvent from './components/EditEvent';

type View = 'calendar' | 'addModal' | 'addEvent' | 'addStudy' | 'detail' | 'edit';

export default function CalendarPage() {
  const [view, setView] = useState<View>('calendar');
  const [viewMode, setViewMode] = useState<'Month' | 'Week' | 'Day'>('Month');
  const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(null);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(() => {
    api<{ events: CalEvent[] }>('/api/calendar/all-events')
      .then(d => setEvents(d.events || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const goTo = (v: View) => { setView(v); window.scrollTo(0, 0); };
  const openDetail = (ev: CalEvent) => { setSelectedEvent(ev); goTo('detail'); };
  const backToCalendar = () => { setSelectedEvent(null); goTo('calendar'); };
  const onSaved = () => { fetchEvents(); backToCalendar(); };
  const onDeleted = () => { fetchEvents(); backToCalendar(); };

  if (loading) {
    return (
      <div className="px-4 py-4 pb-24">
        <h1 className="text-lg font-extrabold text-gray-900 mb-4">Calendar</h1>
        <div className="flex bg-gray-100 rounded-full p-1 mb-4">
          {['Month','Week','Day'].map(v => (
            <div key={v} className="flex-1 py-2 text-xs font-bold text-center text-gray-400">{v}</div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 animate-pulse">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="w-7 h-7 bg-gray-100 rounded-full mx-auto" />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-100 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-100 rounded" />
                <div className="h-3 w-20 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'addModal') {
    return (
      <>
        <CalendarMain events={events} viewMode={viewMode} onViewChange={setViewMode} onEventClick={openDetail} onAddClick={() => {}} />
        <AddNewModal onClose={backToCalendar} onAddEvent={() => goTo('addEvent')} onAddStudy={() => goTo('addStudy')} />
      </>
    );
  }
  if (view === 'addEvent') return <AddEventForm onBack={backToCalendar} onSaved={onSaved} />;
  if (view === 'addStudy') return <AddStudySession onBack={backToCalendar} onSaved={onSaved} />;
  if (view === 'detail' && selectedEvent) return <EventDetail event={selectedEvent} onBack={backToCalendar} onEdit={() => goTo('edit')} onDeleted={onDeleted} />;
  if (view === 'edit' && selectedEvent) return <EditEvent event={selectedEvent} onBack={() => goTo('detail')} onSaved={() => { fetchEvents(); backToCalendar(); }} />;

  return <CalendarMain events={events} viewMode={viewMode} onViewChange={setViewMode} onEventClick={openDetail} onAddClick={() => goTo('addModal')} />;
}
