'use client';
import { useState, useEffect } from 'react';
import { BarChart3, CircleHelp, ClipboardList, Clock3, Lightbulb, Target, Loader2, CheckCircle2 } from 'lucide-react';
import BackHeader from '../BackHeader';
import { API_BASE, getToken } from '@/lib/api';



const NOTIFICATIONS = [
  { icon: CircleHelp, color: 'bg-red-100', iconColor: 'text-red-500', title: 'Quiz Reminders', sub: 'Get notified about upcoming quizzes', key: 'quiz_reminder' },
  { icon: ClipboardList, color: 'bg-blue-100', iconColor: 'text-blue-500', title: 'Assignment Alerts', sub: 'Get notified about assignments', key: 'assignment_alert' },
  { icon: Clock3, color: 'bg-amber-100', iconColor: 'text-amber-500', title: 'Study Reminders', sub: 'Daily study reminders', key: 'study_reminder' },
  { icon: BarChart3, color: 'bg-purple-100', iconColor: 'text-purple-500', title: 'Weekly Summary', sub: 'Receive weekly progress summary', key: 'weekly_summary' },
  { icon: Target, color: 'bg-green-100', iconColor: 'text-green-500', title: 'New Grades', sub: 'Notify when new grades are posted', key: 'new_grades' },
  { icon: Lightbulb, color: 'bg-yellow-100', iconColor: 'text-yellow-500', title: 'Tips & Updates', sub: 'Important tips and updates', key: 'tips_updates' },
];

export default function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  const [time, setTime] = useState('7:00 PM');
  const [tempHour, setTempHour] = useState('7');
  const [tempMin, setTempMin] = useState('00');
  const [tempAp, setTempAp] = useState('PM');
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Load preferences
  useEffect(() => {
    const load = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/notifications/preferences`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.preferences) {
          const p = data.preferences;
          setPrefs({
            quiz_reminder: p.quiz_reminder ?? true,
            assignment_alert: p.assignment_alert ?? true,
            study_reminder: p.study_reminder ?? true,
            weekly_summary: p.weekly_summary ?? false,
            new_grades: p.new_grades ?? true,
            tips_updates: p.tips_updates ?? false,
          });
          setTime(p.reminder_time || '7:00 PM');
          const t = p.reminder_time || '7:00 PM';
          const hm = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
          if (hm) { setTempHour(hm[1]); setTempMin(hm[2]); setTempAp(hm[3].toUpperCase()); }
        }
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  // Toggle a preference
  const toggle = async (key: string) => {
    const newVal = !prefs[key];
    setPrefs(p => ({ ...p, [key]: newVal }));
    showSavedToast();
    try {
      const token = getToken();
      await fetch(`${API_BASE}/api/notifications/preferences/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ key, value: newVal }),
      });
    } catch {}
  };

  // Update reminder time
  const updateTime = async (newTime: string) => {
    setTime(newTime);
    showSavedToast();
    try {
      const token = getToken();
      await fetch(`${API_BASE}/api/notifications/preferences/time`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ time: newTime }),
      });
    } catch {}
  };

  const showSavedToast = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  if (loading) {
    return (
      <div><BackHeader title="Notification Settings" />
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-indigo-600 animate-spin" /></div>
      </div>
    );
  }

  return (
    <div className="">
      <BackHeader title="Notification Settings" />

      {/* Saved Toast */}
      {saved && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 z-50 shadow-lg"
          style={{ animation: 'popIn 0.3s ease-out' }}>
          <CheckCircle2 className="w-4 h-4" /> Saved
        </div>
      )}

      <div className="px-4 py-5">
        <h2 className="text-base font-bold text-gray-900 mb-3">Notification Preferences</h2>

        <div className="bg-white mb-5 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {NOTIFICATIONS.map((n, i) => (
            <div key={n.key}
              className={`flex items-center gap-3 px-4 py-3.5 ${i < NOTIFICATIONS.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className={`w-9 h-9 ${n.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <n.icon className={`w-5 h-5 ${n.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800">{n.title}</p>
                <p className="text-xs text-gray-400">{n.sub}</p>
              </div>
              <button onClick={() => toggle(n.key)}
                className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${prefs[n.key] ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${prefs[n.key] ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>

        {/* Reminder Time */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <p className="text-[14px] font-bold text-gray-500 mb-3">Reminder Time</p>
          <div className="flex items-center gap-2">
            <select value={tempHour}
              onChange={(e) => setTempHour(e.target.value)}
              className="flex-1 bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-3 text-center text-lg font-extrabold text-indigo-600 appearance-none focus:outline-none">
              {[12,1,2,3,4,5,6,7,8,9,10,11].map(h => (
                <option key={h} value={String(h)}>{h}</option>
              ))}
            </select>
            <span className="text-2xl font-extrabold text-gray-400">:</span>
            <select value={tempMin}
              onChange={(e) => setTempMin(e.target.value)}
              className="flex-1 bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-3 text-center text-lg font-extrabold text-indigo-600 appearance-none focus:outline-none">
              {['00','05','10','15','20','25','30','35','40','45','50','55'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <div className="flex rounded-xl overflow-hidden border border-indigo-200">
              {['AM', 'PM'].map(ap => (
                <button key={ap} onClick={() => setTempAp(ap)}
                  className={`px-3 py-3 text-sm font-extrabold transition-all ${
                    tempAp === ap ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400'
                  }`}>
                  {ap}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => updateTime(`${tempHour}:${tempMin} ${tempAp}`)}
            className="w-full mt-3 bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-indigo-700 transition-all">
            Set Reminder
          </button>
          <p className="text-xs text-gray-400 mt-2 text-center">Set when you want to receive daily reminders</p>
        </div>
      </div>

      <style jsx>{`@keyframes popIn { from { transform: translateX(-50%) translateY(-10px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}
