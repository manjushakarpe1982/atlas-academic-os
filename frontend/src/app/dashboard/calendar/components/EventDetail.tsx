'use client';
import { ChevronLeft, Clock, BookOpen, Download, Bell, Trash2, CalendarDays } from 'lucide-react';
import { CalEvent, getCategoryIcon, getCatColor } from './shared';

interface Props { event: CalEvent; onBack: () => void; }

export default function EventDetail({ event, onBack }: Props) {
  const cat = getCatColor(event.category);
  const daysLeft = Math.max(0, event.date - 17);

  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
        <span className="text-sm font-bold text-gray-400">Event Details</span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className={`w-14 h-14 ${cat.bg} rounded-2xl flex items-center justify-center text-2xl`}>
          {getCategoryIcon(event.category)}
        </div>
        <div>
          <p className="text-xl font-extrabold text-gray-900">{event.category}</p>
          <p className="text-sm text-gray-500">{event.className}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <CalendarDays className="w-5 h-5 text-indigo-500" />
          <div>
            <p className="text-xs text-gray-400">Date</p>
            <p className="text-sm font-bold text-gray-900">Wednesday, June {event.date}, 2026</p>
          </div>
        </div>
        {event.time && (
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Clock className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-xs text-gray-400">Time</p>
              <p className="text-sm font-bold text-gray-900">{event.time} – {event.endTime || 'TBD'}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 px-4 py-3.5">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <div>
            <p className="text-xs text-gray-400">Class</p>
            <p className="text-sm font-bold text-gray-900">{event.className}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Download className="w-5 h-5 text-indigo-500" />
          <div>
            <p className="text-xs text-gray-400">Source</p>
            <p className="text-sm font-bold text-gray-900">Imported from {event.source}</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold text-gray-400 mb-1">Description</p>
        <p className="text-sm text-gray-700 leading-relaxed">{event.description}</p>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold text-gray-400 mb-1">Status</p>
        <span className={`text-sm font-bold ${daysLeft <= 3 ? 'text-red-600' : 'text-amber-600'}`}>
          {daysLeft === 0 ? 'Today' : 'Upcoming'}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold text-gray-400 mb-1">Time until due</p>
        <p className="text-sm font-extrabold text-indigo-600">
          {daysLeft === 0 ? 'Today!' : daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-xs font-bold text-gray-400">Actions</p>
        <button className="w-full flex items-center justify-center gap-2 border-2 border-indigo-200 text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-all text-sm">
          <BookOpen className="w-4 h-4" /> View Class
        </button>
        <button className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all text-sm">
          <Bell className="w-4 h-4" /> Set Reminder
        </button>
      </div>

      <button onClick={onBack}
        className="w-full mt-6 flex items-center justify-center gap-2 text-red-600 font-bold py-3 rounded-xl border-2 border-red-200 hover:bg-red-50 transition-all text-sm">
        <Trash2 className="w-4 h-4" /> Delete Event
      </button>
    </div>
  );
}
