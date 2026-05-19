'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Check, GraduationCap, BookOpen, Target, Sliders,
  FlaskConical, Briefcase, User, ArrowRight, ArrowLeft,
  Shield, HelpCircle, ChevronDown, Bot, BarChart2,
  FileText, TrendingUp, Plus, X, Clock, Moon,
  Upload, Star,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────── */
type Role = 'student' | 'teacher' | 'researcher' | 'professional' | null;

/* ─── Constants ──────────────────────────────────────────────── */
const STEPS = [
  { n: 1, label: 'Welcome',           sub: "Let's get to know you",        icon: User          },
  { n: 2, label: 'Academic Profile',  sub: 'Tell us about your studies',   icon: GraduationCap },
  { n: 3, label: 'Goals & Interests', sub: 'What do you want to achieve?', icon: Target        },
  { n: 4, label: 'Preferences',       sub: 'Customize your experience',    icon: Sliders       },
  { n: 5, label: 'Complete',          sub: "You're all set!",              icon: Check         },
];

const ROLES = [
  { id: 'student'      as Role, label: 'Student',      icon: GraduationCap, bg: 'bg-indigo-100', iconC: 'text-indigo-600', desc: 'I want to learn better and improve my academic performance.'   },
  { id: 'teacher'      as Role, label: 'Teacher',      icon: BookOpen,      bg: 'bg-green-100',  iconC: 'text-green-600',  desc: 'I want to streamline teaching and support my students.'        },
  { id: 'researcher'   as Role, label: 'Researcher',   icon: FlaskConical,  bg: 'bg-blue-100',   iconC: 'text-blue-600',   desc: 'I want to accelerate my research and discover insights.'       },
  { id: 'professional' as Role, label: 'Professional', icon: Briefcase,     bg: 'bg-orange-100', iconC: 'text-orange-500', desc: 'I want to upskill and advance my career.'                      },
];

const FEATURES = [
  { icon: Bot,        bg: 'bg-indigo-100', color: 'text-indigo-600', label: 'AI Recommendations'   },
  { icon: BarChart2,  bg: 'bg-green-100',  color: 'text-green-600',  label: 'Smart Study Planning'  },
  { icon: FileText,   bg: 'bg-blue-100',   color: 'text-blue-600',   label: 'Document Analysis'     },
  { icon: TrendingUp, bg: 'bg-orange-100', color: 'text-orange-500', label: 'Progress Tracking'     },
];

/* ─── Shared input class ─────────────────────────────────────── */
const INP =
  'w-full bg-white border border-gray-200 hover:border-indigo-300 focus:border-indigo-500 ' +
  'text-gray-900 placeholder:text-gray-300 rounded-xl px-4 py-3 text-sm outline-none ' +
  'transition-all font-medium';

/* ════════════════════════════════════════════════════════════════
   STEP 1 — Welcome / role picker
════════════════════════════════════════════════════════════════ */
function Step1({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  return (
    <div className="flex-1 flex flex-col">

      {/* Title + hero image row */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to ATLAS! 👋</h1>
          <p className="text-gray-500 max-w-md leading-relaxed">
            Your AI-powered academic companion is ready to help you learn smarter, not harder.
          </p>
        </div>

        {/* Floating feature cards — top right (hidden on smaller screens) */}
        <div className="hidden xl:flex flex-col gap-2.5 flex-shrink-0 mr-4">
          {[
            { icon: Star,      bg: 'bg-indigo-50', ic: 'text-indigo-600', label: 'AI Study Assistant',  bars: ['w-20 bg-indigo-400', 'w-14 bg-indigo-200'] },
            { icon: BarChart2, bg: 'bg-green-50',  ic: 'text-green-600',  label: 'Smart Insights',      bars: ['w-16 bg-green-400',  'w-10 bg-green-200']  },
            { icon: Target,    bg: 'bg-blue-50',   ic: 'text-blue-600',   label: 'Personalized Plan',   bars: ['w-14 bg-blue-400',   'w-8 bg-blue-200', 'w-5 bg-blue-100'] },
          ].map((c) => (
            <div key={c.label}
              className="bg-white rounded-2xl shadow-md border border-gray-100 px-3.5 py-2.5 flex items-center gap-2.5 min-w-[200px]">
              <div className={`w-8 h-8 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                <c.icon className={`w-4 h-4 ${c.ic}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">{c.label}</p>
                <div className="flex gap-1 mt-1 items-center">
                  {c.bars.map((b, i) => (
                    <div key={i} className={`h-1.5 rounded-full ${b}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role picker */}
      <h2 className="text-lg font-semibold text-indigo-600 mb-1">Let&apos;s get started</h2>
      <p className="text-sm text-gray-500 mb-5">What best describes you?</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {ROLES.map((r) => (
          <div
            key={r.id}
            onClick={() => setRole(r.id)}
            className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all hover:shadow-md ${
              role === r.id
                ? 'border-indigo-500 bg-indigo-50/50 shadow-md'
                : 'border-gray-200 bg-white hover:border-indigo-300'
            }`}
          >
            {/* Radio dot */}
            <div className="absolute top-3 right-3">
              <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                role === r.id ? 'border-indigo-500' : 'border-gray-300'
              }`}>
                {role === r.id && <div className="h-2 w-2 rounded-full bg-indigo-500" />}
              </div>
            </div>

            <div className={`h-14 w-14 rounded-2xl ${r.bg} flex items-center justify-center mb-3 mx-auto`}>
              <r.icon className={`w-7 h-7 ${r.iconC}`} />
            </div>
            <p className="font-semibold text-gray-900 text-sm mb-1 text-center">{r.label}</p>
            <p className="text-xs text-gray-500 text-center leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Feature strip */}
      <div className="mt-auto">
        <p className="text-sm font-semibold text-gray-800 mb-3">What you&apos;ll get with ATLAS</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FEATURES.map((f) => (
            <div key={f.label} className="p-3 bg-white rounded-xl border border-gray-100 flex items-center gap-2.5 shadow-sm">
              <div className={`w-7 h-7 rounded-lg ${f.bg} flex items-center justify-center flex-shrink-0`}>
                <f.icon className={`w-3.5 h-3.5 ${f.color}`} />
              </div>
              <span className="text-xs font-semibold text-gray-700">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   STEP 2 — Academic Profile
════════════════════════════════════════════════════════════════ */
function Step2() {
  const [institution,  setInstitution]  = useState('');
  const [fieldStudy,   setFieldStudy]   = useState('');
  const [yearLevel,    setYearLevel]    = useState('');
  const [studentId,    setStudentId]    = useState('');

  return (
    <div className="flex-1 flex gap-10">
      {/* Form */}
      <div className="flex-1 max-w-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-1.5">Academic Profile</h1>
        <p className="text-gray-500 text-sm font-light mb-7 leading-relaxed">
          Tell us about your studies so Atlas can personalise everything — your plan, study guides, and recommendations.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
              Institution / University *
            </label>
            <input
              className={INP} value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. MIT, Stanford, Local Community College"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
              Field of Study / Major *
            </label>
            <input
              className={INP} value={fieldStudy}
              onChange={(e) => setFieldStudy(e.target.value)}
              placeholder="e.g. Computer Science, Biology, Business"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                Current Year / Level *
              </label>
              <select
                className={INP + ' appearance-none bg-white'}
                value={yearLevel}
                onChange={(e) => setYearLevel(e.target.value)}
              >
                <option value="">Select year…</option>
                {['Freshman (Year 1)','Sophomore (Year 2)','Junior (Year 3)','Senior (Year 4)','Graduate Year 1','Graduate Year 2','PhD Year 1','PhD Year 2+'].map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                Student ID (optional)
              </label>
              <input
                className={INP} value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Your student ID"
              />
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <p className="text-xs font-bold text-indigo-700 mb-1">Why we ask this</p>
          <p className="text-xs text-indigo-600 font-light leading-relaxed">
            Atlas uses your institution and field to calibrate the difficulty of study guides, prioritise topics,
            and match you with the most relevant academic resources.
          </p>
        </div>
      </div>

      {/* Right preview */}
      <div className="hidden lg:flex flex-col w-56 flex-shrink-0 gap-3">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Your Profile</p>
          {[
            { k: 'Institution',  v: institution  || '—' },
            { k: 'Field',        v: fieldStudy   || '—' },
            { k: 'Year',         v: yearLevel    || '—' },
          ].map((r) => (
            <div key={r.k} className="flex justify-between text-xs py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-gray-400 font-medium">{r.k}</span>
              <span className="font-semibold text-gray-800 truncate max-w-[100px]">{r.v}</span>
            </div>
          ))}
        </div>
        <div className="bg-indigo-600 rounded-2xl p-4 text-white">
          <p className="text-xs font-bold mb-1">🎯 Atlas will</p>
          <ul className="space-y-1.5">
            {['Calibrate study difficulty','Suggest relevant resources','Match your academic schedule'].map((t) => (
              <li key={t} className="flex items-start gap-1.5 text-[11px] text-indigo-100">
                <Check className="w-3 h-3 mt-0.5 flex-shrink-0 text-indigo-300" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   STEP 3 — Goals & Interests
════════════════════════════════════════════════════════════════ */
const ALL_GOALS = [
  'Improve grades',
  'Better time management',
  'Exam preparation',
  'Research skills',
  'Career preparation',
  'Learn new skills',
  'Build study habits',
  'Reduce study stress',
  'Understand concepts deeper',
  'Complete assignments faster',
  'Prepare for graduate school',
  'Professional certification',
];

function Step3() {
  const [selected, setSelected] = useState<string[]>(['Improve grades', 'Exam preparation']);
  const [priority, setPriority] = useState('Improve grades');

  const toggle = (g: string) =>
    setSelected((p) => p.includes(g) ? p.filter((x) => x !== g) : [...p, g]);

  return (
    <div className="flex-1 flex gap-10">
      {/* Left */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-1.5">Goals & Interests</h1>
        <p className="text-gray-500 text-sm font-light mb-6 leading-relaxed">
          Select everything that applies. Atlas builds your daily plan and study recommendations around your goals.
        </p>

        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
          What do you want to achieve? <span className="text-gray-400 font-normal normal-case">(select all that apply)</span>
        </p>

        <div className="flex flex-wrap gap-2.5 mb-8">
          {ALL_GOALS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => toggle(g)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                selected.includes(g)
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {selected.includes(g) && <span className="mr-1.5">✓</span>}
              {g}
            </button>
          ))}
        </div>

        {/* Top priority */}
        {selected.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Which is your top priority?
            </p>
            <div className="flex flex-wrap gap-2">
              {selected.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setPriority(g)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                    priority === g
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'
                  }`}
                >
                  {priority === g && '⭐ '}
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right */}
      <div className="hidden lg:flex flex-col w-56 flex-shrink-0 gap-3">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">
            Selected goals ({selected.length})
          </p>
          {selected.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No goals selected yet</p>
          ) : (
            <div className="space-y-1.5">
              {selected.map((g) => (
                <div key={g} className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${g === priority ? 'bg-indigo-600' : 'bg-indigo-300'}`} />
                  <span className={`text-xs ${g === priority ? 'font-bold text-indigo-700' : 'text-gray-600'}`}>
                    {g === priority && '⭐ '}{g}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-4 text-white">
          <p className="text-xs font-bold mb-2">Atlas will focus on</p>
          <p className="text-sm font-bold">{priority || '—'}</p>
          <p className="text-[11px] text-indigo-200 mt-1 font-light">
            Your daily plan will prioritise tasks that move this goal forward most.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   STEP 4 — Preferences
════════════════════════════════════════════════════════════════ */
function Step4() {
  const [studyTime,    setStudyTime]    = useState('Evening');
  const [sessionLen,   setSessionLen]   = useState('45–60 min');
  const [weekday,      setWeekday]      = useState(2.5);
  const [weekend,      setWeekend]      = useState(4.0);
  const [sleepStart,   setSleepStart]   = useState('11:00 PM');
  const [sleepEnd,     setSleepEnd]     = useState('7:30 AM');
  const [notifFreq,    setNotifFreq]    = useState('Daily');
  const [events,       setEvents]       = useState(['🏃 Gym · Mon/Thu', '🚗 Commute · 30 min']);

  const totalWeekly = +(weekday * 5 + weekend * 2).toFixed(1);

  return (
    <div className="flex-1 flex gap-10">
      {/* Left */}
      <div className="flex-1 space-y-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1.5">Preferences</h1>
          <p className="text-gray-500 text-sm font-light leading-relaxed">
            Customise how Atlas fits into your day. These can be changed any time from Settings.
          </p>
        </div>

        {/* Study time */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <p className="text-sm font-bold text-gray-900">Preferred study time</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Morning', 'Afternoon', 'Evening', 'Late night'].map((o) => (
              <button key={o} type="button" onClick={() => setStudyTime(o)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                  studyTime === o
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'
                }`}>{o}</button>
            ))}
          </div>
        </div>

        {/* Session length */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-indigo-500" />
            <p className="text-sm font-bold text-gray-900">Preferred session length</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['30 min', '45–60 min', '90 min', '2+ hours'].map((o) => (
              <button key={o} type="button" onClick={() => setSessionLen(o)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                  sessionLen === o
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'
                }`}>{o}</button>
            ))}
          </div>
        </div>

        {/* Daily hours */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-indigo-500" />
            <p className="text-sm font-bold text-gray-900">Daily study hours</p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[
              { label: 'Weekdays', val: weekday, set: setWeekday },
              { label: 'Weekends', val: weekend, set: setWeekend },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wide">{s.label}</p>
                <div className="flex items-center gap-3">
                  <button type="button"
                    onClick={() => s.set(Math.max(0.5, +(s.val - 0.5).toFixed(1)))}
                    className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-base hover:bg-indigo-100 transition-all border border-indigo-200">−</button>
                  <span className="text-lg font-bold text-indigo-600 min-w-[2.5rem] text-center">{s.val}</span>
                  <button type="button"
                    onClick={() => s.set(Math.min(12, +(s.val + 0.5).toFixed(1)))}
                    className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-base hover:bg-indigo-100 transition-all border border-indigo-200">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sleep window */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Moon className="w-4 h-4 text-indigo-500" />
            <p className="text-sm font-bold text-gray-900">Sleep window</p>
            <span className="text-xs text-gray-400 ml-1">— no notifications during this time</span>
          </div>
          <div className="flex items-center gap-3">
            <input className={INP + ' py-2 text-xs max-w-[120px]'} value={sleepStart}
              onChange={(e) => setSleepStart(e.target.value)} placeholder="11:00 PM" />
            <span className="text-sm text-gray-400 font-medium">to</span>
            <input className={INP + ' py-2 text-xs max-w-[120px]'} value={sleepEnd}
              onChange={(e) => setSleepEnd(e.target.value)} placeholder="7:30 AM" />
          </div>
        </div>

        {/* Fixed events */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="w-4 h-4 text-indigo-500" />
            <p className="text-sm font-bold text-gray-900">Fixed weekly events</p>
            <span className="text-xs text-gray-400 ml-1">— Atlas won&apos;t schedule over these</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {events.map((ev) => (
              <div key={ev}
                className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700">
                {ev}
                <button type="button"
                  onClick={() => setEvents((p) => p.filter((e) => e !== ev))}
                  className="text-gray-400 hover:text-red-400 transition-colors ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button type="button"
              onClick={() => setEvents((p) => [...p, '📚 Study group'])}
              className="flex items-center gap-1 border border-dashed border-indigo-300 rounded-full px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-all">
              <Plus className="w-3 h-3" /> Add event
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-bold text-gray-900 mb-2">Notification frequency</p>
          <div className="flex flex-wrap gap-2">
            {['Daily', 'Every few days', 'Weekly', 'Minimal'].map((o) => (
              <button key={o} type="button" onClick={() => setNotifFreq(o)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                  notifFreq === o
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'
                }`}>{o}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Right summary */}
      <div className="hidden lg:flex flex-col w-56 flex-shrink-0 gap-3">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Your Schedule</p>
          {[
            { k: 'Study time',    v: studyTime   },
            { k: 'Session',       v: sessionLen  },
            { k: 'Weekdays',      v: `${weekday} hrs` },
            { k: 'Weekends',      v: `${weekend} hrs` },
            { k: 'Weekly total',  v: `${totalWeekly} hrs`, highlight: true },
            { k: 'Quiet hours',   v: `${sleepStart}–${sleepEnd}` },
            { k: 'Notifications', v: notifFreq   },
          ].map((r) => (
            <div key={r.k} className="flex justify-between text-xs py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-gray-400">{r.k}</span>
              <span className={`font-bold truncate max-w-[90px] ${r.highlight ? 'text-indigo-600' : 'text-gray-800'}`}>{r.v}</span>
            </div>
          ))}
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-3">
          <p className="text-[11px] text-green-700 font-medium leading-relaxed">
            ✅ Atlas will never schedule study sessions during your sleep window or fixed events.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   STEP 5 — Complete / Ready
════════════════════════════════════════════════════════════════ */
function Step5() {
  const router = useRouter();
  const [name, setName] = useState('Jordan');

  useEffect(() => {
    const n = localStorage.getItem('atlas_full_name');
    if (n) setName(n.split(' ')[0]);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
      {/* Success checkmark */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/30">
        <Check className="w-10 h-10 text-white" strokeWidth={3} />
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        You&apos;re all set, {name}! 🎉
      </h1>
      <p className="text-gray-500 max-w-md font-light mb-8 leading-relaxed">
        Your personalised ATLAS workspace is ready. Atlas has mapped your goals, calibrated your schedule,
        and built your first study plan.
      </p>

      {/* Stats */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {[
          { n: '4',  l: 'Classes ready',    bg: 'bg-indigo-50',  text: 'text-indigo-600' },
          { n: '47', l: 'Deadlines mapped', bg: 'bg-green-50',   text: 'text-green-600'  },
          { n: '18', l: 'Topics detected',  bg: 'bg-blue-50',    text: 'text-blue-600'   },
          { n: '2',  l: 'Exams this month', bg: 'bg-orange-50',  text: 'text-orange-500' },
        ].map((s) => (
          <div key={s.l}
            className={`${s.bg} rounded-2xl px-5 py-4 text-center border border-white shadow-sm min-w-[120px]`}>
            <p className={`text-2xl font-extrabold ${s.text}`}>{s.n}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>

      {/* First plan preview */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 max-w-sm w-full mb-8 text-left shadow-md">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">
          Your first study plan — today
        </p>
        {/* Hero task */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 mb-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Biology 101</span>
            <span className="text-[10px] text-gray-400">45 min</span>
          </div>
          <p className="text-sm font-bold text-gray-900">Review Mitosis</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Exam Thursday · weakest topic · on review sheet</p>
        </div>
        {/* Secondary tasks */}
        {[
          { c: 'Statistics', t: 'Problem set #4', m: '40m' },
          { c: 'English',    t: 'Essay 2 outline', m: '20m' },
          { c: 'History',    t: 'Skim chapter 7',  m: '15m' },
        ].map((r, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-t border-gray-50">
            <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-bold flex-shrink-0">
              {i + 2}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{r.c} — {r.t}</p>
            </div>
            <span className="text-[10px] text-gray-400 flex-shrink-0">{r.m}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button
        onClick={() => router.push('/home')}
        className="px-10 py-6 text-base rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/25 gap-2.5"
      >
        Go to my Dashboard <ArrowRight className="w-5 h-5" />
      </Button>
      <p className="text-xs text-gray-400 mt-4 font-light">
        You can upload files, add grades, and adjust your schedule any time from the app.
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════════ */
export default function AtlasOnboarding() {
  const [step, setStep]   = useState(1);
  const [role, setRole]   = useState<Role>(null);
  const [userName, setUserName] = useState('Pooja');

  useEffect(() => {
    const n = localStorage.getItem('atlas_full_name');
    if (n) setUserName(n.split(' ')[0]);
  }, []);

  const next = () => setStep((s) => Math.min(5, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));
  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-[#f7f7ff] via-white to-[#f2f0ff] overflow-hidden">

      {/* ── LEFT SIDEBAR ─────────────────────────────────────── */}
      <div className="w-[300px] border-r bg-white/70 backdrop-blur-xl p-6 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/25">
              A
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">ATLAS</h1>
              <p className="text-xs text-gray-500">Academic OS</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-gray-700">Onboarding Progress</p>
              <p className="text-xs font-medium text-gray-400">{step} of 5</p>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-2 bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-1.5">
            {STEPS.map((s) => {
              const done   = step > s.n;
              const active = step === s.n;
              return (
                <div
                  key={s.n}
                  onClick={() => done && setStep(s.n)}
                  className={`p-3 rounded-xl flex items-center gap-3 transition-all ${
                    active ? 'bg-indigo-600 shadow-md shadow-indigo-500/20 cursor-default'
                    : done  ? 'bg-indigo-50 cursor-pointer hover:bg-indigo-100'
                    :         'hover:bg-gray-50 cursor-default'
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    active ? 'bg-white/20'
                    : done  ? 'bg-indigo-600'
                    :         'bg-gray-100 border-2 border-gray-200'
                  }`}>
                    {done
                      ? <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                      : <s.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-400'}`} />
                    }
                  </div>
                  <div>
                    <p className={`text-sm font-semibold leading-none mb-0.5 ${active ? 'text-white' : 'text-gray-800'}`}>
                      {s.n}. {s.label}
                    </p>
                    <p className={`text-[11px] font-light ${active ? 'text-white/70' : 'text-gray-400'}`}>
                      {s.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security badge */}
        <div className="p-4 rounded-xl bg-gray-50 border text-xs text-gray-500">
          <div className="flex items-center gap-1.5 mb-1">
            <Shield className="w-3.5 h-3.5 text-gray-500" />
            <p className="font-semibold text-gray-700">Your Data is Safe</p>
          </div>
          We use enterprise-grade security to protect your data and privacy.
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top header */}
        <div className="flex items-center justify-between px-10 py-4 border-b bg-white/50 flex-shrink-0">
          <div />
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
              <HelpCircle className="w-4 h-4" /> Need help?
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                {userName[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-gray-700">{userName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-10 py-8 flex flex-col">

          {/* Render current step */}
          {step === 1 && <Step1 role={role} setRole={setRole} />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
          {step === 5 && <Step5 />}

          {/* Bottom action row */}
          {step < 5 && (
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100 flex-shrink-0">
              {/* Left side */}
              {step > 1 ? (
                <Button variant="outline" onClick={prev} className="gap-1.5">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Skip setup? You can complete it later from Settings.')) {
                      window.location.href = '/home';
                    }
                  }}
                  className="text-sm text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  Skip setup
                </button>
              )}

              {/* Right side */}
              <Button
                onClick={next}
                disabled={step === 1 && !role}
                className="px-8 py-6 text-base rounded-xl bg-indigo-600 hover:bg-indigo-700 gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT ILLUSTRATION (Step 1 only) ─────────────────── */}
      {step === 1 && (
        <div className="w-[380px] hidden xl:flex items-center justify-center relative flex-shrink-0">
          <div className="absolute w-[300px] h-[300px] bg-indigo-200/30 blur-3xl rounded-full" />
          <div className="absolute w-[200px] h-[200px] bg-purple-200/30 blur-3xl rounded-full bottom-10 right-10" />
          <div className="relative z-10">
            <Image
              src="https://res.cloudinary.com/mview/image/upload/atlas/desktop-hero.webp"
              alt="ATLAS Hero"
              width={380}
              height={480}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
