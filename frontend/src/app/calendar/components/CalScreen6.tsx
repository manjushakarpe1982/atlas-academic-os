'use client';
import { useEffect, useState } from 'react';
import { CheckCircle2, Calendar, Loader2 } from 'lucide-react';
import { Phone } from './shared';
import { api } from '@/lib/api';

interface Props { onNext: () => void; }

interface CalEvent {
  id:          string;
  title:       string;
  start_date:  string;
  category:    string;
  location?:   string;
}

export default function CalScreen6({ onNext }: Props) {
  const [events,  setEvents]  = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ events: CalEvent[] }>('/api/calendar/events')
      .then(res => setEvents(res.events?.slice(0, 5) || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
      });
    } catch { return iso; }
  };

  const categoryColor = (cat: string) => {
    if (cat === 'exam')       return 'bg-red-100 text-red-700';
    if (cat === 'quiz')       return 'bg-amber-100 text-amber-700';
    if (cat === 'assignment') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <Phone>
      <div className="flex flex-col bg-white min-h-[520px]">
        <div className="flex justify-center pt-6 pb-3">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="px-6 text-center mb-4">
          <h1 className="text-xl font-extrabold text-gray-900 mb-1">Calendar Connected! 🎉</h1>
          <p className="text-sm text-gray-400">We&apos;ve imported your upcoming events.</p>
        </div>

        {/* Events list */}
        <div className="px-5 flex-1">
          <p className="text-xs font-extrabold text-gray-600 uppercase tracking-wide mb-3">
            Upcoming Events
          </p>

          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No upcoming events found.</p>
          ) : (
            <div className="space-y-2">
              {events.map(ev => (
                <div key={ev.id}
                  className="flex items-center gap-3 bg-gray-50 rounded-2xl px-3 py-2.5 border border-gray-100">
                  <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{ev.title}</p>
                    <p className="text-[10px] text-gray-400">{formatDate(ev.start_date)}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${categoryColor(ev.category)}`}>
                    {ev.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

        {/* Footer button */}
        <div className="px-5 pb-5 mt-3">
          <button onClick={onNext}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all">
            Continue to Dashboard
          </button>
        </div>

   
    </Phone>
  );
}
