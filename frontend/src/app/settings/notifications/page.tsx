'use client';

import { useState } from 'react';
import SettingsLayout from '@/components/layout/SettingsLayout';
import {
  CheckCircle2, Bell, BellOff, Mail, Smartphone,
  Calendar, BookOpen, TrendingUp, Flame,
  BarChart2, Brain, Settings2, Clock,
} from 'lucide-react';

/* ─── Save toast ─────────────────────────────────────────────── */
function SaveToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2.5 bg-gray-900 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl z-50 animate-fade-in">
      <CheckCircle2 className="w-4 h-4 text-green-400" />
      Notification preferences saved
    </div>
  );
}

/* ─── Toggle ─────────────────────────────────────────────────── */
function Toggle({ enabled, onChange, size = 'md' }: {
  enabled: boolean; onChange: (v: boolean) => void; size?: 'sm' | 'md';
}) {
  const w = size === 'sm' ? 32 : 40;
  const h = size === 'sm' ? 18 : 22;
  const ball = size === 'sm' ? 14 : 18;
  const onLeft = size === 'sm' ? 15 : 19;

  return (
   <button
  type="button"
  onClick={() => onChange(!enabled)}
  className={`relative rounded-full transition-all duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 ${
    enabled
      ? "bg-indigo-500 border border-white shadow-sm shadow-indigo-500/30"
      : "bg-gray-200 border border-transparent"
  }`}
  style={{ height: h, width: w }}
>
  <span
    className="absolute top-[3px] rounded-full bg-white shadow-sm transition-all duration-200"
    style={{
      width: ball,
      height: ball,
      left: enabled ? onLeft : 2,
    }}
  />
</button>
  );
}

/* ─── Freq pills ─────────────────────────────────────────────── */
function FreqPills({ value, options, onChange }: {
  value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2.5">
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)}
          className={`px-3 py-1 rounded-lg text-[13px] font-semibold border transition-all ${
            value === o
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
              : 'bg-white border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600'
          }`}>
          {o}
        </button>
      ))}
    </div>
  );
}

/* ─── Notif row ──────────────────────────────────────────────── */
function NotifRow({ icon: Icon, iconBg, iconColor, label, desc, enabled, onChange, children }: {
  icon: typeof Bell; iconBg: string; iconColor: string;
  label: string; desc: string;
  enabled: boolean; onChange: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border p-4 transition-all duration-200 ${
      enabled
        ? 'bg-white border-gray-100 shadow-sm'
        : 'bg-gray-50/60 border-gray-100'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl ${enabled ? iconBg : 'bg-gray-100'} flex items-center justify-center flex-shrink-0 transition-all`}>
          <Icon className={`w-4 h-4 ${enabled ? iconColor : 'text-gray-400'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={`text-lg font-semibold ${enabled ? 'text-gray-900' : 'text-gray-500'}`}>{label}</p>
              <p className="text-[12px] text-gray-400 mt-0.5 font-light leading-relaxed">{desc}</p>
            </div>
            <Toggle enabled={enabled} onChange={onChange} />
          </div>
          {enabled && children && (
            <div className="mt-3 pt-3 border-t border-gray-50">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Section header ─────────────────────────────────────────── */
function SectionHeader({ label, icon: Icon, color }: {
  label: string; icon: typeof Bell; color: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <p className={`text-[14px] font-extrabold uppercase tracking-widest ${color}`}>{label}</p>
    </div>
  );
}

/* ─── Time input ─────────────────────────────────────────────── */
function TimeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
      <p className="text-[12px] text-gray-500 font-medium">Send at</p>
      <input
        className="bg-indigo-50 border border-indigo-200 focus:border-indigo-500 text-indigo-700 rounded-lg px-3 py-1.5 text-xs font-bold outline-none transition-all w-24 text-center"
        value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="8:00 AM"
      />
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function NotificationsSettings() {
  const [allEnabled,      setAllEnabled]      = useState(true);
  const [emailEnabled,    setEmailEnabled]    = useState(true);
  const [pushEnabled,     setPushEnabled]     = useState(true);
  const [dailyPlan,       setDailyPlan]       = useState(true);
  const [dailyPlanTime,   setDailyPlanTime]   = useState('8:00 AM');
  const [deadlineAlerts,  setDeadlineAlerts]  = useState(true);
  const [deadlineFreq,    setDeadlineFreq]    = useState('24 hrs before');
  const [examAlerts,      setExamAlerts]      = useState(true);
  const [examFreq,        setExamFreq]        = useState('3 days before');
  const [gradeReminders,  setGradeReminders]  = useState(true);
  const [studyStreak,     setStudyStreak]     = useState(true);
  const [weeklyReport,    setWeeklyReport]    = useState(true);
  const [weeklyDay,       setWeeklyDay]       = useState('Sunday');
  const [flashcardRemind, setFlashcardRemind] = useState(true);
  const [flashcardFreq,   setFlashcardFreq]   = useState('Daily');
  const [systemUpdates,   setSystemUpdates]   = useState(false);
  const [saved,           setSaved]           = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const BLOCKED = !allEnabled ? 'opacity-50 pointer-events-none select-none' : '';

  const activeCount = [dailyPlan, deadlineAlerts, examAlerts, gradeReminders,
    studyStreak, weeklyReport, flashcardRemind, systemUpdates].filter(Boolean).length;

  return (
    <SettingsLayout>
      <div className="space-y-6">

        {/* ── Master switch ────────────────────────────────── */}
        <div className={`rounded-2xl p-5 flex items-center justify-between transition-all ${
          allEnabled
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-500/20'
            : 'bg-gray-100 border border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              allEnabled ? 'bg-white/20' : 'bg-gray-200'
            }`}>
              {allEnabled
                ? <Bell className="w-5 h-5 text-white border border-white" />
                : <BellOff className="w-5 h-5 text-gray-400" />
              }
            </div>
            <div>
              <p className={`text-lg font-bold ${allEnabled ? 'text-white' : 'text-gray-700'}`}>
                {allEnabled ? 'Notifications active' : 'All notifications paused'}
              </p>
              <p className={`text-[13px] font-light ${allEnabled ? 'text-indigo-100' : 'text-gray-400'}`}>
                {allEnabled ? `${activeCount} notification types enabled` : 'Turn on to receive study reminders'}
              </p>
            </div>
          </div>
          <Toggle enabled={allEnabled} onChange={setAllEnabled} />
        </div>

        {/* ── Delivery channels ────────────────────────────── */}
        <div className={BLOCKED}>
          <SectionHeader label="Delivery Channels" icon={Settings2} color="text-gray-500" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Mail,       iconBg: 'bg-blue-50',   iconColor: 'text-blue-600',   label: 'Email',         desc: 'Daily plan, alerts & weekly report', enabled: emailEnabled, onChange: setEmailEnabled },
              { icon: Smartphone, iconBg: 'bg-purple-50', iconColor: 'text-purple-600', label: 'Push',          desc: 'Browser alerts (requires permission)', enabled: pushEnabled,  onChange: setPushEnabled  },
            ].map((c) => (
              <div key={c.label}
                className={`rounded-2xl border p-4 flex items-center gap-3 cursor-pointer transition-all ${
                  c.enabled ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50/60 border-gray-100'
                }`}
                onClick={() => c.onChange(!c.enabled)}>
                <div className={`w-9 h-9 rounded-xl ${c.enabled ? c.iconBg : 'bg-gray-100'} flex items-center justify-center flex-shrink-0`}>
                  <c.icon className={`w-4.5 h-4.5 ${c.enabled ? c.iconColor : 'text-gray-400'}`} style={{width:18,height:18}} />
                </div>
                <div className="flex-1">
                  <p className={`text-base font-bold ${c.enabled ? 'text-gray-900' : 'text-gray-400'}`}>{c.label}</p>
                  <p className="text-[12px] text-gray-400 font-light leading-tight">{c.desc}</p>
                </div>
                <Toggle enabled={c.enabled} onChange={c.onChange} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Study plan ───────────────────────────────────── */}
        <div className={BLOCKED}>
          <SectionHeader label="Study Plan" icon={BookOpen} color="text-indigo-500" />
          <NotifRow
            icon={BookOpen} iconBg="bg-indigo-50" iconColor="text-indigo-600"
            label="Daily plan reminder"
            desc="Morning notification with today's top study tasks and priority order"
            enabled={dailyPlan} onChange={setDailyPlan}>
            <TimeInput value={dailyPlanTime} onChange={setDailyPlanTime} />
          </NotifRow>
        </div>

        {/* ── Deadlines & Exams ────────────────────────────── */}
        <div className={BLOCKED}>
          <SectionHeader label="Deadlines & Exams" icon={Calendar} color="text-red-500" />
          <div className="space-y-3">
            <NotifRow
              icon={Calendar} iconBg="bg-red-50" iconColor="text-red-600"
              label="Assignment deadline alerts"
              desc="Warns you before homework, essays, and problem sets are due"
              enabled={deadlineAlerts} onChange={setDeadlineAlerts}>
              <div>
                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Alert timing</p>
                <FreqPills value={deadlineFreq}
                  options={['6 hrs before','12 hrs before','24 hrs before','48 hrs before']}
                  onChange={setDeadlineFreq} />
              </div>
            </NotifRow>
            <NotifRow
              icon={Calendar} iconBg="bg-orange-50" iconColor="text-orange-600"
              label="Exam countdown alerts"
              desc="Reminds you to start studying several days before each exam"
              enabled={examAlerts} onChange={setExamAlerts}>
              <div>
                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Start alerting</p>
                <FreqPills value={examFreq}
                  options={['1 day before','3 days before','5 days before','1 week before']}
                  onChange={setExamFreq} />
              </div>
            </NotifRow>
          </div>
        </div>

        {/* ── Progress & Streaks ───────────────────────────── */}
        <div className={BLOCKED}>
          <SectionHeader label="Progress & Streaks" icon={TrendingUp} color="text-green-600" />
          <div className="space-y-3">
            <NotifRow
              icon={BarChart2} iconBg="bg-green-50" iconColor="text-green-600"
              label="Grade entry reminders"
              desc="Reminds you to log your grades after quizzes and exams"
              enabled={gradeReminders} onChange={setGradeReminders} />
            <NotifRow
              icon={Flame} iconBg="bg-orange-50" iconColor="text-orange-500"
              label="Study streak alerts"
              desc="Notifies you when your study streak is about to break"
              enabled={studyStreak} onChange={setStudyStreak} />
            <NotifRow
              icon={TrendingUp} iconBg="bg-blue-50" iconColor="text-blue-600"
              label="Weekly progress report"
              desc="Summary of study hours, grades, and plan completion every week"
              enabled={weeklyReport} onChange={setWeeklyReport}>
              <div>
                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Send on</p>
                <FreqPills value={weeklyDay}
                  options={['Friday','Saturday','Sunday']}
                  onChange={setWeeklyDay} />
              </div>
            </NotifRow>
          </div>
        </div>

        {/* ── Flashcards & Tools ───────────────────────────── */}
        <div className={BLOCKED}>
          <SectionHeader label="Flashcards & Study Tools" icon={Brain} color="text-purple-600" />
          <div className="space-y-3">
            <NotifRow
              icon={Brain} iconBg="bg-purple-50" iconColor="text-purple-600"
              label="Flashcard review reminders"
              desc="Reminds you when cards are due for spaced repetition (SM-2)"
              enabled={flashcardRemind} onChange={setFlashcardRemind}>
              <div>
                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Frequency</p>
                <FreqPills value={flashcardFreq}
                  options={['Daily','Every 2 days','Weekly','Minimal']}
                  onChange={setFlashcardFreq} />
              </div>
            </NotifRow>
            <NotifRow
              icon={Settings2} iconBg="bg-gray-100" iconColor="text-gray-500"
              label="System updates & new features"
              desc="Learn when Atlas adds new study tools or improvements"
              enabled={systemUpdates} onChange={setSystemUpdates} />
          </div>
        </div>

        {/* ── Save ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          <p className="text-xs text-gray-400">
            {activeCount} of 8 notification types active
          </p>
          <button onClick={save}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20 active:scale-95">
            <CheckCircle2 className="w-4 h-4" /> Save preferences
          </button>
        </div>
      </div>
      <SaveToast show={saved} />
    </SettingsLayout>
  );
}
