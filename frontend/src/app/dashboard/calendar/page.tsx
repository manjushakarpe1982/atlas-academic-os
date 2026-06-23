'use client';
import { useState } from 'react';
import { CalEvent } from './components/shared';
import { EventFormData } from './components/AddEventForm';
import CalendarMain from './components/CalendarMain';
import EventDetail from './components/EventDetail';
import AddEventForm from './components/AddEventForm';
import ConfirmEvent from './components/ConfirmEvent';
import EventSuccess from './components/EventSuccess';

type View = 'calendar' | 'detail' | 'add' | 'confirm' | 'success';

const DEFAULT_FORM: EventFormData = {
  title: '', date: 'June 20, 2026', time: '10:00 AM',
  endTime: '11:30 AM', className: 'Biology 101',
  notes: '', repeat: 'Does not repeat',
};

export default function CalendarPage() {
  const [view, setView] = useState<View>('calendar');
  const [tab, setTab] = useState<'Month'|'Week'|'Agenda'>('Month');
  const [selected, setSelected] = useState(17);
  const [detailEvent, setDetailEvent] = useState<CalEvent | null>(null);
  const [form, setForm] = useState<EventFormData>({ ...DEFAULT_FORM });

  const openDetail = (ev: CalEvent) => { setDetailEvent(ev); setView('detail'); };
  const openAdd = () => { setForm({ ...DEFAULT_FORM }); setView('add'); };

  if (view === 'detail' && detailEvent) {
    return <EventDetail event={detailEvent} onBack={() => setView('calendar')} />;
  }
  if (view === 'add') {
    return <AddEventForm form={form} onChange={setForm} onConfirm={() => setView('confirm')} onCancel={() => setView('calendar')} />;
  }
  if (view === 'confirm') {
    return <ConfirmEvent form={form} onConfirm={() => setView('success')} onBack={() => setView('add')} />;
  }
  if (view === 'success') {
    return <EventSuccess form={form} onDone={() => setView('calendar')} />;
  }

  return (
    <CalendarMain
      selected={selected} tab={tab}
      onSelectDate={setSelected} onTabChange={setTab}
      onEventClick={openDetail} onAddClick={openAdd}
    />
  );
}
