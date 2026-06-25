'use client';
import { useState } from 'react';
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

  const openDetail = (ev: CalEvent) => { setSelectedEvent(ev); setView('detail'); };
  const backToCalendar = () => { setView('calendar'); setSelectedEvent(null); };

  if (view === 'addModal') {
    return (
      <>
        <CalendarMain viewMode={viewMode} onViewChange={setViewMode} onEventClick={openDetail} onAddClick={() => {}} />
        <AddNewModal onClose={backToCalendar} onAddEvent={() => setView('addEvent')} onAddStudy={() => setView('addStudy')} />
      </>
    );
  }
  if (view === 'addEvent') return <AddEventForm onBack={backToCalendar} onSaved={backToCalendar} />;
  if (view === 'addStudy') return <AddStudySession onBack={backToCalendar} onSaved={backToCalendar} />;
  if (view === 'detail' && selectedEvent) return <EventDetail event={selectedEvent} onBack={backToCalendar} onEdit={() => setView('edit')} />;
  if (view === 'edit' && selectedEvent) return <EditEvent event={selectedEvent} onBack={() => setView('detail')} onSaved={() => setView('detail')} />;

  return <CalendarMain viewMode={viewMode} onViewChange={setViewMode} onEventClick={openDetail} onAddClick={() => setView('addModal')} />;
}
