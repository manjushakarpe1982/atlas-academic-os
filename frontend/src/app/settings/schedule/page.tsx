'use client';

import { useState } from 'react';
import { CheckCircle2, Plus, X, Info } from 'lucide-react';
import SettingsLayout from '@/components/layout/SettingsLayout';

/* ─── Save toast ─────────────────────────────────────────────── */
function SaveToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2.5 bg-gray-900 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl z-50 animate-fade-in">
      <CheckCircle2 className="w-4 h-4 text-green-400" />
      Schedule saved
    </div>
  );
}

/* ─── Stepper ────────────────────────────────────────────────── */
function Stepper({
  value, min, max, step, unit, onChange,
}: {
  value: number; min: number; max: number;
  step: number; unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, +(value - step).toFixed(1)))}
        className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold text-base hover:bg-indigo-100 transition-all"
      >−</button>
      <span className="text-base font-bold text-indigo-600 min-w-[3.5rem] text-center">
        {value}{unit}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, +(value + step).toFixed(1)))}
        className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold text-base hover:bg-indigo-100 transition-all"
      >+</button>
    </div>
  );
}

/* ─── Day toggle ─────────────────────────────────────────────── */
function DayToggle({
  days, selected, onChange,
}: {
  days: string[]; selected: string[];
  onChange: (d: string[]) => void;
}) {
  const toggle = (d: string) =>
    onChange(selected.includes(d) ? selected.filter((x) => x !== d) : [...selected, d]);
  return (
    <div className="flex gap-1.5">
      {days.map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => toggle(d)}
          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
            selected.includes(d)
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
          }`}
        >
          {d[0]}
        </button>
      ))}
    </div>
  );
}

const INP =
  'bg-[#FAFAFE] border border-gray-200 hover:border-indigo-300 ' +
  'focus:border-indigo-500 focus:bg-white text-gray-900 placeholder:text-gray-300 ' +
  'rounded-xl px-3 py-2.5 text-sm outline-none transition-all font-medium';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

interface FixedEvent {
  id: number; label: string; days: string[]; time: string;
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function ScheduleSettings() {
  // Study hours
  const [weekdayHrs,  setWeekdayHrs]  = useState(2.5);
  const [weekendHrs,  setWeekendHrs]  = useState(4.0);

  // Session
  const [sessionLen,  setSessionLen]  = useState('45–60 min');
  const [studyTime,   setStudyTime]   = useState('Evening');
  const [targetGPA,   setTargetGPA]   = useState('3.70');

  // Sleep
  const [sleepStart,  setSleepStart]  = useState('11:00 PM');
  const [sleepEnd,    setSleepEnd]    = useState('7:30 AM');

  // Fixed events
  const [events, setEvents] = useState<FixedEvent[]>([
    { id:1, label:'Gym',      days:['Mon','Thu'], time:'7:00 AM' },
    { id:2, label:'Commute',  days:['Mon','Tue','Wed','Thu','Fri'], time:'8:30 AM' },
  ]);
  const [addLabel, setAddLabel] = useState('');
  const [addDays,  setAddDays]  = useState<string[]>([]);
  const [addTime,  setAddTime]  = useState('');
  const [adding,   setAdding]   = useState(false);

  const [saved, setSaved] = useState(false);

  const totalWeekly = +(weekdayHrs * 5 + weekendHrs * 2).toFixed(1);

  const addEvent = () => {
    if (!addLabel) return;
    setEvents((p) => [...p, { id: Date.now(), label: addLabel, days: addDays, time: addTime }]);
    setAddLabel(''); setAddDays([]); setAddTime(''); setAdding(false);
  };

  const deleteEvent = (id: number) =>
    setEvents((p) => p.filter((e) => e.id !== id));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <SettingsLayout>
      <div className="space-y-5">

        {/* ── Study hours ──────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-1.5">Daily study hours</h2>
          <p className="text-xs text-gray-400 mb-5 font-light">
            Atlas will schedule study blocks within these limits every day.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-5">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Weekdays</p>
              <Stepper value={weekdayHrs} min={0.5} max={12} step={0.5} unit=" hrs" onChange={setWeekdayHrs} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Weekends</p>
              <Stepper value={weekendHrs} min={0.5} max={12} step={0.5} unit=" hrs" onChange={setWeekendHrs} />
            </div>
          </div>

          {/* Summary pill */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3.5 py-2">
            <Info className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <p className="text-xs font-semibold text-indigo-700">
              {totalWeekly} hours per week total · {(totalWeekly * 4).toFixed(0)} hrs/month
            </p>
          </div>
        </div>

        {/* ── Session preferences ──────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-5">Session preferences</h2>
          <div className="space-y-5">

            {/* Study time of day */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2.5">
                Preferred study time
              </p>
              <div className="flex flex-wrap gap-2">
                {['Morning','Afternoon','Evening','Late night'].map((o) => (
                  <button key={o} type="button" onClick={() => setStudyTime(o)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                      studyTime === o
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'
                    }`}>{o}</button>
                ))}
              </div>
            </div>

            {/* Session length */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2.5">
                Session length
              </p>
              <div className="flex flex-wrap gap-2">
                {['30 min','45–60 min','90 min','2+ hours'].map((o) => (
                  <button key={o} type="button" onClick={() => setSessionLen(o)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                      sessionLen === o
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'
                    }`}>{o}</button>
                ))}
              </div>
            </div>

            {/* Target GPA */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2.5">
                Target GPA
              </p>
              <div className="flex flex-wrap gap-2">
                {['4.00','3.90','3.80','3.70','3.60','3.50','3.00'].map((g) => (
                  <button key={g} type="button" onClick={() => setTargetGPA(g)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                      targetGPA === g
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'
                    }`}>{g}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Sleep window ─────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-1.5">Sleep window</h2>
          <p className="text-xs text-gray-400 mb-4 font-light">
            Atlas will never schedule study blocks or send notifications during this time.
          </p>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Bedtime</p>
              <input className={INP + ' w-32'} value={sleepStart}
                onChange={(e) => setSleepStart(e.target.value)} placeholder="11:00 PM" />
            </div>
            <span className="text-sm text-gray-300 font-medium mt-4">→</span>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Wake up</p>
              <input className={INP + ' w-32'} value={sleepEnd}
                onChange={(e) => setSleepEnd(e.target.value)} placeholder="7:30 AM" />
            </div>
            <div className="mt-4 ml-2">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
                {(() => {
                  try {
                    const parse = (t: string) => {
                      const [time, ampm] = t.split(' ');
                      let [h, m] = time.split(':').map(Number);
                      if (ampm === 'PM' && h !== 12) h += 12;
                      if (ampm === 'AM' && h === 12) h = 0;
                      return h * 60 + (m || 0);
                    };
                    const diff = (parse(sleepEnd) + 1440 - parse(sleepStart)) % 1440;
                    const h = Math.floor(diff / 60);
                    const m = diff % 60;
                    return `${h}h ${m}m sleep`;
                  } catch {
                    return '8h 30m sleep';
                  }
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* ── Fixed events ─────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-1.5">Fixed weekly events</h2>
          <p className="text-xs text-gray-400 mb-4 font-light">
            Atlas will never place study sessions over these events.
          </p>

          {/* Event list */}
          <div className="space-y-2.5 mb-4">
            {events.map((ev) => (
              <div key={ev.id}
                className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{ev.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {ev.days.join(' · ')} {ev.time && `· ${ev.time}`}
                  </p>
                </div>
                <button onClick={() => deleteEvent(ev.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Add event form */}
            {adding ? (
              <div className="border-2 border-dashed border-indigo-200 rounded-xl p-4 space-y-3">
                <input className={INP + ' w-full'} value={addLabel}
                  onChange={(e) => setAddLabel(e.target.value)}
                  placeholder="Event name (e.g. Gym, Commute, Lab…)" />
                <div className="flex items-center gap-3 flex-wrap">
                  <DayToggle days={DAYS} selected={addDays} onChange={setAddDays} />
                  <input className={INP + ' w-28'} value={addTime}
                    onChange={(e) => setAddTime(e.target.value)}
                    placeholder="9:00 AM" />
                </div>
                <div className="flex gap-2">
                  <button onClick={addEvent}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all">
                    Add event
                  </button>
                  <button onClick={() => setAdding(false)}
                    className="border border-gray-200 text-gray-500 font-semibold text-xs px-4 py-2 rounded-xl hover:bg-gray-50 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAdding(true)}
                className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-200 hover:border-indigo-300 text-gray-500 hover:text-indigo-600 font-semibold text-xs py-3 rounded-xl transition-all hover:bg-indigo-50/30">
                <Plus className="w-3.5 h-3.5" /> Add fixed event
              </button>
            )}
          </div>
        </div>

        {/* ── Save ─────────────────────────────────────────── */}
        <div className="flex justify-end">
          <button onClick={save}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20">
            Save schedule
          </button>
        </div>
      </div>

      <SaveToast show={saved} />
    </SettingsLayout>
  );
}
