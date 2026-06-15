'use client';
import { NOTIFICATIONS } from '../components/mockData';

const TYPE_STYLE: Record<string,string> = {
  warning: 'bg-red-100 text-red-600',
  info:    'bg-blue-100 text-blue-600',
  success: 'bg-green-100 text-green-600',
};
const TYPE_ICON: Record<string,string> = {
  warning: '⚠️', info: '📚', success: '✅',
};

export default function NotificationsPage() {
  const today = NOTIFICATIONS.filter(n => n.when === 'Today');
  const yesterday = NOTIFICATIONS.filter(n => n.when === 'Yesterday');

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-extrabold text-gray-900">Notifications</h1>
        <button className="text-xs font-semibold text-indigo-600">Mark all as read</button>
      </div>

      <p className="text-xs font-extrabold text-gray-400 mb-2">Today</p>
      <div className="space-y-2 mb-5">
        {today.map(n => (
          <div key={n.id} className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${TYPE_STYLE[n.type]}`}>
              {TYPE_ICON[n.type]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">{n.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs font-extrabold text-gray-400 mb-2">Yesterday</p>
      <div className="space-y-2">
        {yesterday.map(n => (
          <div key={n.id} className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 flex items-start gap-3 opacity-70">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${TYPE_STYLE[n.type]}`}>
              {TYPE_ICON[n.type]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600">{n.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
