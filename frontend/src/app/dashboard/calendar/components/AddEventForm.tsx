'use client';
import { ChevronLeft, ChevronDown } from 'lucide-react';

export interface EventFormData {
  title: string; date: string; time: string; endTime: string;
  className: string; notes: string; repeat: string;
}

interface Props {
  form: EventFormData;
  onChange: (f: EventFormData) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AddEventForm({ form, onChange, onConfirm, onCancel }: Props) {
  const update = (key: keyof EventFormData, val: string) => onChange({ ...form, [key]: val });

  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onCancel}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
        <h1 className="text-base font-extrabold text-gray-900">Add Study Event</h1>
        <button onClick={onConfirm} className="text-sm font-bold text-indigo-600">Save</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Title</label>
          <input value={form.title} onChange={e => update('title', e.target.value)} placeholder="Study Session – Genetics"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Date</label>
          <div className="relative">
            <input value={form.date} readOnly className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Time</label>
          <div className="relative">
            <input value={form.time} readOnly className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">End Time <span className="font-normal text-gray-400">(Optional)</span></label>
          <div className="relative">
            <input value={form.endTime} readOnly className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Class <span className="font-normal text-gray-400">(Optional)</span></label>
          <div className="relative">
            <select value={form.className} onChange={e => update('className', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none bg-white appearance-none">
              <option>Biology 101</option><option>Calc 251</option><option>English 201</option><option>Physics 201</option><option>Chem 101</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Notes <span className="font-normal text-gray-400">(Optional)</span></label>
          <textarea value={form.notes} onChange={e => update('notes', e.target.value)}
            placeholder="Review DNA structure, inheritance patterns and practice questions."
            rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none resize-none" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Repeat</label>
          <div className="relative">
            <select value={form.repeat} onChange={e => update('repeat', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none bg-white appearance-none">
              <option>Does not repeat</option><option>Daily</option><option>Weekly</option><option>Monthly</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <button onClick={onConfirm}
          className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all text-sm">
          Add Event
        </button>
        <button onClick={onCancel}
          className="w-full text-gray-500 font-semibold py-2 text-sm hover:text-gray-700 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
