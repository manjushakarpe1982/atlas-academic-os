'use client';

import { useState } from 'react';
import SettingsLayout from '@/components/layout/SettingsLayout';
import {
  CheckCircle2, Plus, X, Info, Clock,
  Moon, Sun, Sunrise, Sunset, Coffee,
  Calendar, Target, Zap, Timer,
} from 'lucide-react';

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

/* ─── Section card ───────────────────────────────────────────── */
function Card({ title, icon: Icon, iconBg, subtitle, children }: {
  title: string; icon: typeof Clock; iconBg: string;
  subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-4 md:px-6 py-3.5 border-b border-gray-50">
        <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-none">{title}</p>
          {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="px-4 md:px-6 py-4">{children}</div>
    </div>
  );
}

/* ─── Day toggle ─────────────────────────────────────────────── */
function DayToggle({ days, selected, onChange }: {
  days: string[]; selected: string[]; onChange: (d: string[]) => void;
}) {
  const toggle = (d: string) =>
    onChange(selected.includes(d) ? selected.filter((x) => x !== d) : [...selected, d]);
  return (
    <div className="flex gap-1.5 flex-wrap">
      {days.map((d) => (
        <button key={d} type="button" onClick={() => toggle(d)}
          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
            selected.includes(d)
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
              : 'bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
          }`}>
          {d[0]}
        </button>
      ))}
    </div>
  );
}

const INP =
  'bg-gray-50 border border-gray-200 hover:border-indigo-300 ' +
  'focus:border-indigo-500 focus:bg-white text-gray-900 placeholder:text-gray-300 ' +
  'rounded-xl px-3 py-2.5 text-sm outline-none transition-all font-medium';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

interface FixedEvent { id: number; label: string; days: string[]; time: string; emoji: string; }

/* ─── Modern hours slider card ───────────────────────────────── */
function HoursCard({
  label, sublabel, value, min, max, step, color, bgColor, onChange,
}: {
  label: string; sublabel: string; value: number; min: number; max: number;
  step: number; color: string; bgColor: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={`${bgColor} rounded-2xl p-4 border border-white`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-bold text-gray-800">{label}</p>
          <p className="text-[11px] text-gray-500 font-light">{sublabel}</p>
        </div>
        <div className={`text-2xl font-extrabold ${color}`}>{value}<span className="text-sm font-semibold ml-0.5">h</span></div>
      </div>

      {/* Custom slider */}
      <div className="relative mt-1 mb-3">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(+e.target.value)}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${color.includes('indigo') ? '#4F46E5' : '#10B981'} ${pct}%, #E5E7EB ${pct}%)`,
          }}
        />
      </div>

      {/* Tick marks */}
      <div className="flex justify-between text-[9px] text-gray-400 font-medium">
        {[0,2,4,6,8,10,12].map((t) => <span key={t}>{t}h</span>)}
      </div>
    </div>
  );
}

/* ─── Sleep arc visual ───────────────────────────────────────── */
function SleepVisual({ bedtime, wakeup, sleepHours }: {
  bedtime: string; wakeup: string; sleepHours: number;
}) {
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-5 text-white relative overflow-hidden">
      {/* Stars decoration */}
      {[...Array(8)].map((_, i) => (
        <div key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-40"
          style={{ top: `${10 + (i * 11) % 60}%`, left: `${5 + (i * 13) % 85}%` }} />
      ))}

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-indigo-300" />
          <p className="text-sm font-bold">Sleep Window</p>
        </div>
        <div className="bg-white/15 rounded-full px-3 py-1">
          <p className="text-xs font-bold text-indigo-100">{sleepHours.toFixed(1)}h sleep</p>
        </div>
      </div>

      <div className="flex items-center justify-between relative z-10">
        {/* Bedtime */}
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mx-auto mb-1.5">
            <Moon className="w-5 h-5 text-indigo-200" />
          </div>
          <p className="text-[10px] text-indigo-300 font-medium">Bedtime</p>
          <p className="text-base font-extrabold">{bedtime}</p>
        </div>

        {/* Arc */}
        <div className="flex-1 flex items-center justify-center px-3">
          <div className="w-full h-12 relative">
            <svg viewBox="0 0 100 30" className="w-full h-full">
              <path d="M 5 25 Q 50 -5 95 25" fill="none" stroke="rgba(165,180,252,0.4)" strokeWidth="2" strokeDasharray="4 2" />
              <path d="M 5 25 Q 50 -5 95 25" fill="none" stroke="rgba(165,180,252,0.9)" strokeWidth="2"
                strokeDasharray={`${(sleepHours / 12) * 120} 120`} />
            </svg>
            <div className="absolute inset-x-0 bottom-1 flex justify-center">
              <span className="text-[10px] text-indigo-300 font-medium">No notifications</span>
            </div>
          </div>
        </div>

        {/* Wake up */}
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mx-auto mb-1.5">
            <Sunrise className="w-5 h-5 text-yellow-300" />
          </div>
          <p className="text-[10px] text-indigo-300 font-medium">Wake up</p>
          <p className="text-base font-extrabold">{wakeup}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function ScheduleSettings() {
  const [weekdayHrs,  setWeekdayHrs]  = useState(2.5);
  const [weekendHrs,  setWeekendHrs]  = useState(4.0);
  const [sessionLen,  setSessionLen]  = useState('45–60 min');
  const [studyTime,   setStudyTime]   = useState('Evening');
  const [targetGPA,   setTargetGPA]   = useState('3.70');
  const [sleepStart,  setSleepStart]  = useState('11:00 PM');
  const [sleepEnd,    setSleepEnd]    = useState('7:30 AM');
  const [events, setEvents] = useState<FixedEvent[]>([
    { id:1, label:'Gym',     days:['Mon','Thu'], time:'7:00 AM', emoji:'🏃' },
    { id:2, label:'Commute', days:['Mon','Tue','Wed','Thu','Fri'], time:'8:30 AM', emoji:'🚗' },
  ]);
  const [addLabel, setAddLabel] = useState('');
  const [addDays,  setAddDays]  = useState<string[]>([]);
  const [addTime,  setAddTime]  = useState('');
  const [addEmoji, setAddEmoji] = useState('📅');
  const [adding,   setAdding]   = useState(false);
  const [saved, setSaved]       = useState(false);

  const totalWeekly = +(weekdayHrs * 5 + weekendHrs * 2).toFixed(1);

  // Calculate sleep hours
  const calcSleep = () => {
    try {
      const parse = (t: string) => {
        const [time, ampm] = t.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        return h * 60 + (m || 0);
      };
      const diff = (parse(sleepEnd) + 1440 - parse(sleepStart)) % 1440;
      return diff / 60;
    } catch { return 8.5; }
  };

  const sleepHours = calcSleep();

  const addEvent = () => {
    if (!addLabel) return;
    setEvents((p) => [...p, { id: Date.now(), label: addLabel, days: addDays, time: addTime, emoji: addEmoji }]);
    setAddLabel(''); setAddDays([]); setAddTime(''); setAdding(false);
  };

  const deleteEvent = (id: number) => setEvents((p) => p.filter((e) => e.id !== id));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const TIME_OPTIONS = [
    { id:'Morning',    icon: Sunrise, label:'Morning',    sub:'6 AM – 12 PM', bg:'bg-amber-50',   text:'text-amber-600',  active:'bg-amber-500'   },
    { id:'Afternoon',  icon: Sun,     label:'Afternoon',  sub:'12 PM – 6 PM', bg:'bg-orange-50',  text:'text-orange-600', active:'bg-orange-500'  },
    { id:'Evening',    icon: Sunset,  label:'Evening',    sub:'6 PM – 10 PM', bg:'bg-indigo-50',  text:'text-indigo-600', active:'bg-indigo-500'  },
    { id:'Late night', icon: Moon,    label:'Late night', sub:'10 PM – 2 AM', bg:'bg-purple-50',  text:'text-purple-600', active:'bg-purple-500'  },
  ];

  return (
    <SettingsLayout>
      <div className="space-y-5">

        {/* ── Daily study hours ────────────────────────────── */}
        <Card title="Daily Study Hours" icon={Clock} iconBg="bg-indigo-500"
          subtitle="Atlas schedules study blocks within these limits">
          <div className="space-y-4 mb-4">
            <HoursCard
              label="Weekdays" sublabel="Monday – Friday"
              value={weekdayHrs} min={0.5} max={12} step={0.5}
              color="text-indigo-600" bgColor="bg-indigo-50"
              onChange={setWeekdayHrs}
            />
            <HoursCard
              label="Weekends" sublabel="Saturday – Sunday"
              value={weekendHrs} min={0.5} max={12} step={0.5}
              color="text-emerald-600" bgColor="bg-emerald-50"
              onChange={setWeekendHrs}
            />
          </div>

          {/* Summary */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl px-4 py-3">
            <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-indigo-800">
                {totalWeekly} hours per week · {(totalWeekly * 4).toFixed(0)} hrs/month
              </p>
              <p className="text-[11px] text-indigo-500 font-light mt-0.5">
                Recommended: 2–3 hrs/weekday, 4–5 hrs/weekend for a full course load
              </p>
            </div>
          </div>
        </Card>

        {/* ── Preferred study time ─────────────────────────── */}
        <Card title="Preferred Study Time" icon={Timer} iconBg="bg-amber-500"
          subtitle="Atlas will place sessions during this window">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {TIME_OPTIONS.map((opt) => (
              <button key={opt.id} type="button" onClick={() => setStudyTime(opt.id)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${
                  studyTime === opt.id
                    ? 'border-indigo-400 bg-indigo-50 shadow-sm'
                    : 'border-gray-100 bg-white hover:border-indigo-200 hover:bg-gray-50'
                }`}>
                <div className={`w-9 h-9 rounded-xl ${studyTime === opt.id ? opt.active : opt.bg} flex items-center justify-center flex-shrink-0 transition-all`}>
                  <opt.icon className={`w-4.5 h-4.5 ${studyTime === opt.id ? 'text-white' : opt.text}`} style={{width:18,height:18}} />
                </div>
                <div>
                  <p className={`text-sm font-bold ${studyTime === opt.id ? 'text-indigo-700' : 'text-gray-800'}`}>
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-gray-400">{opt.sub}</p>
                </div>
                {studyTime === opt.id && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* ── Session length + Target GPA ──────────────────── */}
        <Card title="Session Preferences" icon={Target} iconBg="bg-green-500">
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2.5">Session length</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { v:'30 min',    emoji:'⚡' },
                  { v:'45–60 min', emoji:'📖' },
                  { v:'90 min',    emoji:'🎯' },
                  { v:'2+ hours',  emoji:'🏆' },
                ].map((o) => (
                  <button key={o.v} type="button" onClick={() => setSessionLen(o.v)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                      sessionLen === o.v
                        ? 'border-green-400 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50/50'
                    }`}>
                    <span>{o.emoji}</span> {o.v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2.5">Target GPA</p>
              <div className="flex flex-wrap gap-2">
                {['4.00','3.90','3.80','3.70','3.60','3.50','3.00'].map((g) => (
                  <button key={g} type="button" onClick={() => setTargetGPA(g)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all min-w-[60px] ${
                      targetGPA === g
                        ? 'border-green-400 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-green-300'
                    }`}>{g}</button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* ── Sleep window ─────────────────────────────────── */}
        <Card title="Sleep Window" icon={Moon} iconBg="bg-indigo-800"
          subtitle="No study blocks or notifications during this time">

          {/* Visual sleep arc */}
          <div className="mb-4">
            <SleepVisual bedtime={sleepStart} wakeup={sleepEnd} sleepHours={sleepHours} />
          </div>

          {/* Time inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="w-4 h-4 text-indigo-600" />
                <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide">Bedtime</p>
              </div>
              <input className={INP + ' w-full text-center font-extrabold text-lg text-indigo-700 bg-white'}
                value={sleepStart} onChange={(e) => setSleepStart(e.target.value)}
                placeholder="11:00 PM" />
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sunrise className="w-4 h-4 text-amber-600" />
                <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Wake Up</p>
              </div>
              <input className={INP + ' w-full text-center font-extrabold text-lg text-amber-700 bg-white'}
                value={sleepEnd} onChange={(e) => setSleepEnd(e.target.value)}
                placeholder="7:30 AM" />
            </div>
          </div>

          {/* Sleep quality note */}
          <div className="mt-3 flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl px-3.5 py-2.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-green-700 font-medium">
              {sleepHours >= 7 && sleepHours <= 9
                ? `Great! ${sleepHours.toFixed(1)}h sleep is within the recommended 7–9 hours for students.`
                : sleepHours < 7
                ? `Only ${sleepHours.toFixed(1)}h sleep detected. Aim for at least 7h for better focus.`
                : `${sleepHours.toFixed(1)}h sleep. That's quite a lot — Atlas will still respect this window.`
              }
            </p>
          </div>
        </Card>

        {/* ── Fixed events ─────────────────────────────────── */}
        <Card title="Fixed Weekly Events" icon={Calendar} iconBg="bg-purple-500"
          subtitle="Atlas will never schedule study sessions over these">

          <div className="space-y-2.5 mb-4">
            {events.map((ev) => (
              <div key={ev.id}
                className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-3 md:px-4 py-3 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                <span className="text-lg flex-shrink-0">{ev.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800">{ev.label}</p>
                  <p className="text-[11px] text-gray-400">
                    {ev.days.join(', ')} {ev.time && `· ${ev.time}`}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {ev.days.map((d) => (
                    <span key={d} className="text-[9px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md">
                      {d[0]}
                    </span>
                  ))}
                </div>
                <button onClick={() => deleteEvent(ev.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all flex-shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Add event form */}
            {adding ? (
              <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-4 space-y-3 bg-indigo-50/30">
                <div className="flex items-center gap-2">
                  {/* Emoji picker */}
                  <select value={addEmoji} onChange={(e) => setAddEmoji(e.target.value)}
                    className="text-xl bg-white border border-gray-200 rounded-xl px-2 py-2 outline-none cursor-pointer w-16 text-center">
                    {['📅','🏃','🚗','🏫','💪','🎵','🍽','🧘','📚','⚽','🎮','👥'].map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                  <input className={INP + ' flex-1'} value={addLabel}
                    onChange={(e) => setAddLabel(e.target.value)}
                    placeholder="Event name (e.g. Gym, Lecture, Commute)" />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <DayToggle days={DAYS} selected={addDays} onChange={setAddDays} />
                  <input className={INP + ' w-28'} value={addTime}
                    onChange={(e) => setAddTime(e.target.value)} placeholder="9:00 AM" />
                </div>
                <div className="flex gap-2">
                  <button onClick={addEvent}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all">
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
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-indigo-300 text-gray-500 hover:text-indigo-600 font-semibold text-xs py-3.5 rounded-2xl transition-all hover:bg-indigo-50/30">
                <Plus className="w-3.5 h-3.5" /> Add fixed event
              </button>
            )}
          </div>
        </Card>

        {/* ── Save ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          <p className="text-xs text-gray-400">Schedule changes apply to your next generated study plan</p>
          <button onClick={save}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20 active:scale-95">
            <CheckCircle2 className="w-4 h-4" /> Save schedule
          </button>
        </div>
      </div>
      <SaveToast show={saved} />
    </SettingsLayout>
  );
}
