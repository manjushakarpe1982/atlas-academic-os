'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';

interface Props { onBack: () => void; onSaved: () => void; }

export default function AddEventForm({ onBack, onSaved }: Props) {
  return (
    <div className="px-4 py-4 pb-12">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
        <h1 className="text-base font-extrabold text-gray-900">Add Event</h1>
        <button  className="text-sm font-bold text-indigo-600"></button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-gray-600 block mb-1.5">Title</label>
          <input placeholder="e.g. Biology Quiz 1" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-600 block mb-1.5">Type</label>
          <div className="relative">
            <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white appearance-none focus:border-indigo-500 focus:outline-none">
              <option>Quiz</option><option>Assignment</option><option>Exam</option><option>Class</option><option>Personal</option>
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
            <input defaultValue="10:00 AM" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-600 block mb-1.5">End Time</label>
            <input defaultValue="11:00 AM" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white" />
          </div>
        </div>
        <div>
          <label className="text-sm font-bold text-gray-600 block mb-1.5">Class <span className="font-normal text-gray-400">(Optional)</span></label>
          <div className="relative">
            <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white appearance-none focus:border-indigo-500 focus:outline-none">
              <option>Biology 1107</option><option>Chemistry 101</option><option>Math 251</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-sm font-bold text-gray-600 block mb-1.5">Notes <span className="font-normal text-gray-400">(Optional)</span></label>
          <textarea placeholder="Add details..." rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none resize-none" />
        </div>
        <button onClick={onSaved} className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition-all text-base">
          Save Event
        </button>
        <button onClick={onBack} className="w-full border border-gray-200 rounded-lg text-gray-500 font-semibold py-2 text-base">Cancel</button>
      </div>
    </div>
  );
}
