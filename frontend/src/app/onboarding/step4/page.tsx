'use client';

import { useState } from 'react';
import {
  Sliders, Clock, Zap, Target, Moon,
  Plus, X, Sunrise, Star,
} from 'lucide-react';
import OnboardingLayout from '../_components/OnboardingLayout';
import { INP, DAYS, type FixedEvent } from '../_components/constants';

function DayPill({ d, active, onClick }: { d: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
        active ? 'bg-[#534AB7] text-white shadow-sm' : 'bg-[#f0effe] text-[#534AB7] hover:bg-[#ede9ff]'
      }`}>
      {d[0]}
    </button>
  );
}

const TIME_OPTIONS = [
  { id:'Morning',    icon: Sunrise, label:'Morning',    sub:'6 AM – 12 PM',  activeColor:'bg-amber-500',  ring:'border-amber-400'  },
  { id:'Afternoon',  icon: Clock,   label:'Afternoon',  sub:'12 PM – 6 PM',  activeColor:'bg-orange-500', ring:'border-orange-400' },
  { id:'Evening',    icon: Moon,    label:'Evening',    sub:'6 PM – 10 PM',  activeColor:'bg-[#534AB7]',  ring:'border-[#534AB7]'  },
  { id:'Late night', icon: Star,    label:'Late night', sub:'10 PM – 2 AM',  activeColor:'bg-purple-600', ring:'border-purple-500' },
];

export default function Step4Page() {
  const [studyTime,  setStudyTime]  = useState('Evening');
  const [sessionLen, setSessionLen] = useState('45–60 min');
  const [weekday,    setWeekday]    = useState(2.5);
  const [weekend,    setWeekend]    = useState(4.0);
  const [sleepStart, setSleepStart] = useState('11:00 PM');
  const [sleepEnd,   setSleepEnd]   = useState('7:30 AM');
  const [events,     setEvents]     = useState<FixedEvent[]>([
    { id:1, label:'Gym',     days:['Mon','Thu'],                   time:'7:00 AM', emoji:'🏃' },
    { id:2, label:'Commute', days:['Mon','Tue','Wed','Thu','Fri'], time:'8:30 AM', emoji:'🚗' },
  ]);
  const [addLabel, setAddLabel] = useState('');
  const [addDays,  setAddDays]  = useState<string[]>([]);
  const [addTime,  setAddTime]  = useState('');
  const [addEmoji, setAddEmoji] = useState('📅');
  const [adding,   setAdding]   = useState(false);

  const total = +(weekday * 5 + weekend * 2).toFixed(1);

  const addEvent = () => {
    if (!addLabel) return;
    setEvents((p) => [...p, { id: Date.now(), label: addLabel, days: addDays, time: addTime, emoji: addEmoji }]);
    setAddLabel(''); setAddDays([]); setAddTime(''); setAdding(false);
  };

  return (
    <OnboardingLayout step={4}>
      <div className="bg-white rounded-[28px] border border-[#ECE9FF] shadow-lg overflow-hidden">
        <div className="grid grid-cols-1">

          {/* LEFT — preferences form */}
          <div className="px-8 lg:px-10 py-8 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>

            {/* Header */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#534AB7]/10 text-[#534AB7] text-[11px] font-bold px-3.5 py-1.5 mb-4">
                <Sliders className="w-3.5 h-3.5" /> Step 4 of 5
              </span>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-[#14142B] leading-tight mb-2">
                Preferences
              </h1>
              <p className="text-sm text-[#6B6A8A] leading-relaxed">
                Customise how Atlas fits into your day. You can change these any time in Settings.
              </p>
            </div>

            {/* Preferred study time */}
            <div className="bg-[#FAFAFE] border border-[#EEEDFE] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-[#534AB7]" />
                <p className="text-sm font-bold text-[#1A1A2E]">Preferred study time</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {TIME_OPTIONS.map((o) => (
                  <button key={o.id} type="button" onClick={() => setStudyTime(o.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all text-left ${
                      studyTime === o.id
                        ? `${o.ring} bg-white shadow-sm`
                        : 'border-[#EEEDFE] bg-white hover:border-[#534AB7]/30'
                    }`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      studyTime === o.id ? o.activeColor : 'bg-[#f0effe]'
                    }`}>
                      <o.icon className={`w-4 h-4 ${studyTime === o.id ? 'text-white' : 'text-[#534AB7]'}`} />
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${studyTime === o.id ? 'text-[#534AB7]' : 'text-[#1A1A2E]'}`}>
                        {o.label}
                      </p>
                      <p className="text-[10px] text-[#9B9AB5]">{o.sub}</p>
                    </div>
                    {studyTime === o.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#534AB7]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily study hours */}
            <div className="bg-[#FAFAFE] border border-[#EEEDFE] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#534AB7]" />
                  <p className="text-sm font-bold text-[#1A1A2E]">Daily study hours</p>
                </div>
                <span className="text-xs font-bold text-[#534AB7] bg-[#f0effe] px-2.5 py-1 rounded-full">
                  {total}h / week total
                </span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label:'Weekdays', val: weekday, set: setWeekday, color:'#534AB7' },
                  { label:'Weekends', val: weekend, set: setWeekend, color:'#059669' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-[11px] mb-2">
                      <span className="font-bold text-[#6B6A8A]">{s.label}</span>
                      <span className="font-extrabold" style={{ color: s.color }}>{s.val}h</span>
                    </div>
                    <input type="range" min={0.5} max={12} step={0.5} value={s.val}
                      onChange={(e) => s.set(+e.target.value)}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right,${s.color} ${((s.val-0.5)/11.5)*100}%,#e8e7f5 ${((s.val-0.5)/11.5)*100}%)`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Session length */}
            <div className="bg-[#FAFAFE] border border-[#EEEDFE] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-[#534AB7]" />
                <p className="text-sm font-bold text-[#1A1A2E]">Session length</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[{ v:'30 min',e:'⚡' },{ v:'45–60 min',e:'📖' },{ v:'90 min',e:'🎯' },{ v:'2+ hours',e:'🏆' }].map((o) => (
                  <button key={o.v} type="button" onClick={() => setSessionLen(o.v)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                      sessionLen === o.v
                        ? 'border-[#534AB7] bg-[#f5f3ff] text-[#534AB7]'
                        : 'border-[#EEEDFE] bg-white text-[#6B6A8A] hover:border-[#534AB7]/40'
                    }`}>
                    {o.e} {o.v}
                  </button>
                ))}
              </div>
            </div>

            {/* Sleep window */}
            <div className="bg-gradient-to-br from-[#1e1657] to-[#2d1f8a] rounded-2xl p-5 relative overflow-hidden">
              {[...Array(5)].map((_,i) => (
                <div key={i} className="absolute w-1 h-1 bg-white/30 rounded-full"
                  style={{ top:`${10+(i*14)%70}%`, left:`${8+(i*17)%80}%` }} />
              ))}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Moon className="w-4 h-4 text-indigo-300" />
                  <p className="text-sm font-bold text-white">Sleep window</p>
                  <span className="ml-auto text-[10px] text-indigo-300 bg-white/10 px-2 py-0.5 rounded-full">
                    No notifications during this time
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 border border-white/20 rounded-xl p-3.5">
                    <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wide mb-2">🌙 Bedtime</p>
                    <input
                      className="w-full bg-transparent text-white font-extrabold text-xl outline-none text-center border-b border-white/30 pb-1 placeholder:text-white/40"
                      value={sleepStart} onChange={(e) => setSleepStart(e.target.value)} placeholder="11:00 PM" />
                  </div>
                  <div className="bg-white/10 border border-white/20 rounded-xl p-3.5">
                    <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wide mb-2">🌅 Wake up</p>
                    <input
                      className="w-full bg-transparent text-white font-extrabold text-xl outline-none text-center border-b border-white/30 pb-1 placeholder:text-white/40"
                      value={sleepEnd} onChange={(e) => setSleepEnd(e.target.value)} placeholder="7:30 AM" />
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed events */}
            <div className="bg-[#FAFAFE] border border-[#EEEDFE] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-sm font-bold text-[#1A1A2E]">Fixed weekly events</p>
                <span className="text-[10px] text-[#9B9AB5] font-light">Atlas won&apos;t schedule over these</span>
              </div>
              <div className="space-y-2 mb-3">
                {events.map((ev) => (
                  <div key={ev.id} className="flex items-center gap-3 bg-white border border-[#EEEDFE] rounded-xl px-3.5 py-2.5">
                    <span>{ev.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1A1A2E]">{ev.label}</p>
                      <div className="flex gap-0.5 mt-0.5">
                        {ev.days.map((d) => (
                          <span key={d} className="text-[9px] font-bold bg-[#534AB7]/10 text-[#534AB7] px-1.5 py-0.5 rounded-md">{d[0]}</span>
                        ))}
                        {ev.time && <span className="text-[9px] text-[#9B9AB5] ml-1">{ev.time}</span>}
                      </div>
                    </div>
                    <button onClick={() => setEvents((p) => p.filter((e) => e.id !== ev.id))}
                      className="text-[#C5C3E8] hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              {adding ? (
                <div className="border-2 border-dashed border-[#534AB7]/25 rounded-xl p-3.5 space-y-3 bg-[#f5f3ff]/40">
                  <div className="flex items-center gap-2">
                    <select value={addEmoji} onChange={(e) => setAddEmoji(e.target.value)}
                      className="text-xl bg-white border border-[#EEEDFE] rounded-xl px-2 py-1.5 outline-none cursor-pointer w-14 text-center">
                      {['📅','🏃','🚗','🏫','💪','🎵','🍽','🧘','📚','⚽'].map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                    <input className="flex-1 h-10 rounded-xl border border-[#E8E8F3] bg-white px-3 text-sm text-[#1A1A2E] placeholder:text-[#C5C3E8] outline-none focus:border-[#534AB7] transition-all"
                      value={addLabel} onChange={(e) => setAddLabel(e.target.value)} placeholder="Event name" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex gap-1">
                      {DAYS.map((d) => (
                        <DayPill key={d} d={d} active={addDays.includes(d)}
                          onClick={() => setAddDays((p) => p.includes(d) ? p.filter((x) => x !== d) : [...p, d])} />
                      ))}
                    </div>
                    <input className="w-24 h-9 rounded-xl border border-[#E8E8F3] bg-white px-3 text-xs text-[#1A1A2E] placeholder:text-[#C5C3E8] outline-none focus:border-[#534AB7] transition-all"
                      value={addTime} onChange={(e) => setAddTime(e.target.value)} placeholder="9:00 AM" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addEvent}
                      className="bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all">
                      Add event
                    </button>
                    <button onClick={() => setAdding(false)}
                      className="border border-[#EEEDFE] text-[#6B6A8A] text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAdding(true)}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#534AB7]/20 hover:border-[#534AB7]/40 text-[#534AB7] font-semibold text-xs py-3 rounded-xl transition-all hover:bg-[#f5f3ff]/30">
                  <Plus className="w-3.5 h-3.5" /> Add fixed event
                </button>
              )}
            </div>
          </div>


        </div>
      </div>
    </OnboardingLayout>
  );
}
