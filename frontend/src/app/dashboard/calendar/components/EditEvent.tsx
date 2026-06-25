'use client';
import { ChevronLeft, ChevronDown, Trash2 } from 'lucide-react';
import { CalEvent } from './shared';

interface Props { event: CalEvent; onBack: () => void; onSaved: () => void; }

export default function EditEvent({ event, onBack, onSaved }: Props) {
  return (
    <div className="px-4 py-4 pb-12">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
        <h1 className="text-base font-extrabold text-gray-900">Edit Event</h1>
        <button  className="text-sm font-bold text-indigo-600"></button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-gray-600 block mb-1.5">Title</label>
          <input defaultValue={event.title} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-600 block mb-1.5">Type</label>
          <div className="relative">
            <select defaultValue={event.type} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white appearance-none focus:border-indigo-500 focus:outline-none capitalize">
              <option value="quiz">Quiz</option><option value="assignment">Assignment</option><option value="exam">Exam</option>
              <option value="study">Study</option><option value="class">Class</option><option value="personal">Personal</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-sm font-bold text-gray-600 block mb-1.5">Date</label>
          <input type="date" defaultValue="2025-05-16" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-bold text-gray-600 block mb-1.5">Start Time</label>
            <input defaultValue={event.time} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-600 block mb-1.5">End Time</label>
            <input defaultValue={event.endTime || ''} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white" />
          </div>
        </div>
        <button onClick={onSaved} className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition-all text-base">
          Save Changes
        </button>
        <button onClick={onBack} className="w-full text-red-600 font-bold py-2.5 border border-red-300 rounded-lg text-base flex items-center justify-center gap-2">
          <Trash2 className="w-4 h-4" /> Delete Event
        </button>
      </div>
    </div>
  );
}
