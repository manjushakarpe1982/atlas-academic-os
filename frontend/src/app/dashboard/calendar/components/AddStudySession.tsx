'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronDown, CheckCircle2 } from 'lucide-react';

interface Props { onBack: () => void; onSaved: () => void; }

export default function AddStudySession({ onBack, onSaved }: Props) {
  const [subject, setSubject] = useState('Biology 1107');
  const [topic, setTopic] = useState('Genetics');
  const [date, setDate] = useState('May 16, 2025');
  const [time, setTime] = useState('3:00 PM');
  const [duration, setDuration] = useState('45 minutes');
  const [notes, setNotes] = useState('');
  const [repeat, setRepeat] = useState('Does not repeat');
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className="px-4 py-4 pb-24">
        <div className="flex items-center justify-between mb-5">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <h1 className="text-base font-extrabold text-gray-900">Add Study Session</h1>
          <div className="w-5" />
        </div>
        <div className="flex flex-col items-center py-10 gap-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Study Session Added!</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 w-full">
            <p className="text-sm font-bold text-gray-900">{subject} - {topic}</p>
            <p className="text-xs text-gray-400 mt-1">{date} at {time}</p>
            <p className="text-xs text-gray-400">{duration}</p>
          </div>
          <p className="text-xs text-gray-500 text-center">You can view it in your calendar and upcoming list.</p>
          <div className="flex gap-3 w-full mt-4">
            <button onClick={onBack}
              className="flex-1 border-2 border-indigo-200 text-indigo-600 font-bold py-3 rounded-xl text-sm">
              Save Session
            </button>
            <button onClick={onSaved}
              className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl text-sm">
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
        <h1 className="text-base font-extrabold text-gray-900">Add Study Session</h1>
        <button onClick={() => setSaved(true)} className="text-sm font-bold text-indigo-600">Save</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Subject</label>
          <div className="relative">
            <select value={subject} onChange={e => setSubject(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white appearance-none focus:border-indigo-500 focus:outline-none">
              <option>Biology 1107</option><option>Chemistry 101</option><option>Math 251</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Topic</label>
          <div className="relative">
            <select value={topic} onChange={e => setTopic(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white appearance-none focus:border-indigo-500 focus:outline-none">
              <option>Genetics</option><option>Cell Structure</option><option>Mitosis</option><option>Evolution</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Date</label>
          <input type="date" defaultValue="2025-05-16"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1.5">Time</label>
            <input value={time} readOnly className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1.5">Duration</label>
            <div className="relative">
              <select value={duration} onChange={e => setDuration(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white appearance-none focus:border-indigo-500 focus:outline-none">
                <option>15 minutes</option><option>30 minutes</option><option>45 minutes</option><option>60 minutes</option><option>90 minutes</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Notes <span className="font-normal text-gray-400">(Optional)</span></label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Review inheritance patterns and practice questions."
            rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none resize-none" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Repeat</label>
          <div className="relative">
            <select value={repeat} onChange={e => setRepeat(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white appearance-none focus:border-indigo-500 focus:outline-none">
              <option>Does not repeat</option><option>Daily</option><option>Weekly</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <button onClick={() => setSaved(true)}
          className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all text-sm">
          Save Study Session
        </button>
        <button onClick={onBack}
          className="w-full text-gray-500 font-semibold py-2 text-sm">Cancel</button>
      </div>
    </div>
  );
}
