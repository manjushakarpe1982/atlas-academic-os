'use client';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { EventFormData } from './AddEventForm';

interface Props { form: EventFormData; onDone: () => void; }

export default function EventSuccess({ form, onDone }: Props) {
  const fields = [
    { label: 'Title',              value: form.title || 'Study Session – Genetics' },
    { label: 'Date',               value: form.date },
    { label: 'Time',               value: form.time },
    { label: 'End Time (Optional)', value: form.endTime },
    { label: 'Class (Optional)',   value: form.className },
    { label: 'Notes (Optional)',   value: form.notes || 'Review DNA structure, inheritance patterns and practice questions.', multi: true },
    { label: 'Repeat',            value: form.repeat },
  ];

  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onDone}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
        <h1 className="text-base font-extrabold text-gray-900">Add Study Event</h1>
        <button onClick={onDone} className="text-sm font-bold text-indigo-600">Save</button>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-green-800">Event Added!</p>
          <p className="text-xs text-green-600">Your study event has been added to the calendar.</p>
        </div>
      </div>

      <div className="space-y-4">
        {fields.map(f => (
          <div key={f.label}>
            <label className="text-xs font-bold text-gray-500 block mb-1.5">{f.label}</label>
            {'multi' in f && f.multi ? (
              <textarea value={f.value} readOnly rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-600 resize-none" />
            ) : (
              <input value={f.value} readOnly
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
