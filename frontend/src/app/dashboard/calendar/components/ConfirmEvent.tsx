'use client';
import { ChevronLeft, CalendarDays, Clock, BookOpen } from 'lucide-react';
import { EventFormData } from './AddEventForm';

interface Props { form: EventFormData; onConfirm: () => void; onBack: () => void; }

export default function ConfirmEvent({ form, onConfirm, onBack }: Props) {
  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
        <h1 className="text-base font-extrabold text-gray-900">Add Study Event</h1>
        <button onClick={onConfirm} className="text-sm font-bold text-indigo-600">Save</button>
      </div>

      <div className="flex flex-col items-center py-4">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
          <CalendarDays className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-base font-extrabold text-gray-900 mb-1">Add this event?</h2>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <p className="text-base font-extrabold text-gray-900">{form.title || 'Study Session – Genetics'}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>{form.date}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          <span>{form.time} – {form.endTime}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{form.className}</span>
        </div>
        {form.notes && (
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Notes (Optional)</p>
            <p className="text-xs text-gray-600">{form.notes}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Repeat</p>
          <p className="text-xs text-gray-600">{form.repeat}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button onClick={onConfirm}
          className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all text-sm">
          Add Event
        </button>
        <button onClick={onBack}
          className="w-full text-gray-500 font-semibold py-2 text-sm hover:text-gray-700 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
