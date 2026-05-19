'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import SettingsLayout from '@/components/layout/SettingsLayout';

/* ─── Save toast ─────────────────────────────────────────────── */
function SaveToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2.5 bg-gray-900 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl z-50 animate-fade-in">
      <CheckCircle2 className="w-4 h-4 text-green-400" />
      Preferences saved
    </div>
  );
}

/* ─── Toggle component ───────────────────────────────────────── */
function Toggle({
  enabled, onChange,
}: {
  enabled: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative w-10 h-5.5 rounded-full transition-all duration-200 flex-shrink-0 ${
        enabled ? 'bg-indigo-600' : 'bg-gray-200'
      }`}
      style={{ height: 22, width: 40 }}
    >
      <span className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-all duration-200 ${
        enabled ? 'left-[19px]' : 'left-0.5'
      }`} />
    </button>
  );
}

/* ─── Notification row ───────────────────────────────────────── */
function NotifRow({
  label, desc, enabled, onChange, sub,
}: {
  label: string; desc: string;
  enabled: boolean; onChange: (v: boolean) => void;
  sub?: React.ReactNode;
}) {
  return (
    <div className={`py-4 border-b border-gray-50 last:border-0 ${!enabled ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="text-[11px] text-gray-400 mt-0.5 font-light leading-relaxed">{desc}</p>
        </div>
        <Toggle enabled={enabled} onChange={onChange} />
      </div>
      {enabled && sub && <div className="mt-3 ml-0">{sub}</div>}
    </div>
  );
}

/* ─── Frequency selector ─────────────────────────────────────── */
function FreqSelect({
  value, options, onChange,
}: {
  value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            value === o
              ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
              : 'border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600'
          }`}>
          {o}
        </button>
      ))}
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function NotificationsSettings() {

  // Master switch
  const [allEnabled,       setAllEnabled]       = useState(true);

  // Channels
  const [emailEnabled,     setEmailEnabled]     = useState(true);
  const [pushEnabled,      setPushEnabled]      = useState(true);

  // Study plan
  const [dailyPlan,        setDailyPlan]        = useState(true);
  const [dailyPlanTime,    setDailyPlanTime]    = useState('8:00 AM');

  // Deadlines
  const [deadlineAlerts,   setDeadlineAlerts]   = useState(true);
  const [deadlineFreq,     setDeadlineFreq]     = useState('24 hrs before');

  // Exams
  const [examAlerts,       setExamAlerts]       = useState(true);
  const [examFreq,         setExamFreq]         = useState('3 days before');

  // Grades
  const [gradeReminders,   setGradeReminders]   = useState(true);
  const [studyStreak,      setStudyStreak]      = useState(true);
  const [weeklyReport,     setWeeklyReport]     = useState(true);
  const [weeklyDay,        setWeeklyDay]        = useState('Sunday');
  const [flashcardRemind,  setFlashcardRemind]  = useState(true);
  const [flashcardFreq,    setFlashcardFreq]    = useState('Daily');
  const [systemUpdates,    setSystemUpdates]    = useState(false);

  const [saved, setSaved] = useState(false);

  const INP =
    'bg-[#FAFAFE] border border-gray-200 hover:border-indigo-300 ' +
    'focus:border-indigo-500 focus:bg-white text-gray-900 ' +
    'rounded-xl px-3 py-2 text-xs outline-none transition-all font-medium';

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <SettingsLayout>
      <div className="space-y-5">

        {/* ── Master switch ────────────────────────────────── */}
        <div className={`bg-white border rounded-2xl p-5 shadow-sm flex items-center justify-between ${
          allEnabled ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-100'
        }`}>
          <div>
            <p className="text-sm font-bold text-gray-900">All notifications</p>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              {allEnabled ? 'Atlas will send you study reminders and alerts' : 'All notifications are paused'}
            </p>
          </div>
          <Toggle enabled={allEnabled} onChange={setAllEnabled} />
        </div>

        {/* ── Delivery channels ────────────────────────────── */}
        <div className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm ${!allEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-base font-bold text-gray-900 mb-4">Delivery channels</h2>
          <div>
            <NotifRow
              label="Email notifications"
              desc="Receive daily plan, deadline alerts, and weekly report by email"
              enabled={emailEnabled}
              onChange={setEmailEnabled}
            />
            <NotifRow
              label="Push notifications"
              desc="Browser push alerts for urgent reminders (requires permission)"
              enabled={pushEnabled}
              onChange={setPushEnabled}
            />
          </div>
        </div>

        {/* ── Study plan ───────────────────────────────────── */}
        <div className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm ${!allEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-base font-bold text-gray-900 mb-4">Study plan</h2>
          <NotifRow
            label="Daily plan reminder"
            desc="Morning notification showing today's top study tasks"
            enabled={dailyPlan}
            onChange={setDailyPlan}
            sub={
              <div className="flex items-center gap-3">
                <p className="text-[11px] text-gray-500 font-medium">Send at</p>
                <input className={INP + ' w-28'} value={dailyPlanTime}
                  onChange={(e) => setDailyPlanTime(e.target.value)}
                  placeholder="8:00 AM" />
              </div>
            }
          />
        </div>

        {/* ── Deadlines & exams ────────────────────────────── */}
        <div className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm ${!allEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-base font-bold text-gray-900 mb-4">Deadlines & exams</h2>
          <NotifRow
            label="Assignment deadline alerts"
            desc="Warns you before homework, essays, and problem sets are due"
            enabled={deadlineAlerts}
            onChange={setDeadlineAlerts}
            sub={
              <div className="flex items-center gap-3">
                <p className="text-[11px] text-gray-500 font-medium">Alert me</p>
                <FreqSelect
                  value={deadlineFreq}
                  options={['6 hrs before','12 hrs before','24 hrs before','48 hrs before']}
                  onChange={setDeadlineFreq}
                />
              </div>
            }
          />
          <NotifRow
            label="Exam countdown alerts"
            desc="Reminds you to start studying before each exam"
            enabled={examAlerts}
            onChange={setExamAlerts}
            sub={
              <div className="flex items-center gap-3">
                <p className="text-[11px] text-gray-500 font-medium">Start alerting</p>
                <FreqSelect
                  value={examFreq}
                  options={['1 day before','3 days before','5 days before','1 week before']}
                  onChange={setExamFreq}
                />
              </div>
            }
          />
        </div>

        {/* ── Progress & streaks ───────────────────────────── */}
        <div className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm ${!allEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-base font-bold text-gray-900 mb-4">Progress & streaks</h2>
          <NotifRow
            label="Grade entry reminders"
            desc="Reminds you to log grades after quizzes and exams"
            enabled={gradeReminders}
            onChange={setGradeReminders}
          />
          <NotifRow
            label="Study streak alerts"
            desc="Notifies you when your study streak is about to break"
            enabled={studyStreak}
            onChange={setStudyStreak}
          />
          <NotifRow
            label="Weekly progress report"
            desc="Summary of your study hours, grades, and plan completion"
            enabled={weeklyReport}
            onChange={setWeeklyReport}
            sub={
              <div className="flex items-center gap-3">
                <p className="text-[11px] text-gray-500 font-medium">Send on</p>
                <FreqSelect
                  value={weeklyDay}
                  options={['Friday','Saturday','Sunday']}
                  onChange={setWeeklyDay}
                />
              </div>
            }
          />
        </div>

        {/* ── Flashcards & AI ──────────────────────────────── */}
        <div className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm ${!allEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-base font-bold text-gray-900 mb-4">Flashcards & study tools</h2>
          <NotifRow
            label="Flashcard review reminders"
            desc="Reminds you when cards are due for spaced repetition review"
            enabled={flashcardRemind}
            onChange={setFlashcardRemind}
            sub={
              <FreqSelect
                value={flashcardFreq}
                options={['Daily','Every 2 days','Weekly','Minimal']}
                onChange={setFlashcardFreq}
              />
            }
          />
          <NotifRow
            label="System updates & new features"
            desc="Learn when Atlas adds new study tools or improvements"
            enabled={systemUpdates}
            onChange={setSystemUpdates}
          />
        </div>

        {/* ── Save ─────────────────────────────────────────── */}
        <div className="flex justify-end">
          <button onClick={save}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20">
            Save preferences
          </button>
        </div>
      </div>

      <SaveToast show={saved} />
    </SettingsLayout>
  );
}
