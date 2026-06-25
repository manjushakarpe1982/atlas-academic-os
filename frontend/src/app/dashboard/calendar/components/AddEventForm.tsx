'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronDown, Loader2 } from 'lucide-react';
import { API_BASE, getToken } from '@/lib/api';

interface Props { onBack: () => void; onSaved: () => void; }

export default function AddEventForm({ onBack, onSaved }: Props) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('quiz');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [className, setClassName] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const now = new Date(); const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const handleSave = async () => {
    if (!title.trim() || !date) { setError('Title and date are required'); return; }
    if (date < todayStr) { setError('Cannot select a past date. Please choose today or a future date.'); return; }
    setSaving(true); setError('');
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/calendar/add-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, type, date, startTime, endTime, className, notes }),
      });
      const data = await res.json();
      if (data.success) { onSaved(); }
      else { setError(data.detail || 'Failed to save'); }
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
        <h1 className="text-base font-extrabold text-gray-900">Add Event</h1>
        <button onClick={handleSave} disabled={saving} className="text-sm font-bold text-indigo-600 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 mb-3 text-center">{error}</p>}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Biology Quiz 1"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Type</label>
          <div className="relative">
            <select value={type} onChange={e => setType(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white appearance-none focus:border-indigo-500 focus:outline-none">
              <option value="quiz">Quiz</option><option value="assignment">Assignment</option><option value="exam">Exam</option>
              <option value="class">Class</option><option value="personal">Personal</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Date</label>
          <input type="date" value={date} onChange={e => { setDate(e.target.value); if (e.target.value < todayStr) setError('Cannot select a past date. Please choose today or a future date.'); else setError(''); }}
            min={todayStr}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" />
          {date && date < todayStr && (
            <p className="text-xs text-red-500 mt-1">⚠️ Past dates are not allowed. Please select today or later.</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1.5">Start Time</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:border-indigo-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1.5">End Time</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:border-indigo-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Notes <span className="font-normal text-gray-400">(Optional)</span></label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add details..."
            rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none resize-none" />
        </div>
        <button onClick={handleSave} disabled={saving}
          className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Event
        </button>
        <button onClick={onBack} className="w-full text-gray-500 font-semibold py-2 text-sm">Cancel</button>
      </div>
    </div>
  );
}
