'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Copy, CalendarDays } from 'lucide-react';
import BackHeader from '../BackHeader';

export default function CalendarSyncPage() {
  const router  = useRouter();
  const [showUrl, setShowUrl] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [freq, setFreq] = useState('Every Day');
  const MOCK_URL = 'https://canvas.instructure.com/feeds/calendars/user_xxx.ics';

  return (
    <div className="">
      <BackHeader title="Calendar Sync" />

      <div className="px-4 py-5 space-y-4">

        {/* Status card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
           <div className="flex items-center gap-3">
  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
    <CalendarDays className="w-6 h-6 text-indigo-600" />
  </div>

  <div>
    <p className="font-extrabold text-gray-900">
      Connected Calendar
    </p>
    <p className="text-xs text-gray-400 mt-0.5">
      Last synced · 2 mins ago 🟢
    </p>
  </div>
</div>
            <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full">Active</span>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 mt-1 rounded-xl text-base transition-all">
            Resync Now
          </button>
        </div>

        {/* Calendar Feed URL */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3">
          <p className="text-[15px] font-bold text-gray-500  mb-3">Calendar Feed URL</p>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
            <span className="flex-1 text-xs text-gray-600 truncate font-mono">
              {showUrl ? MOCK_URL : '•'.repeat(42)}
            </span>
            <button onClick={() => setShowUrl(!showUrl)} className="text-gray-500 hover:text-gray-600 flex-shrink-0">
              {showUrl ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button onClick={() => navigator.clipboard?.writeText(MOCK_URL)}
              className="text-gray-500 hover:text-gray-600 flex-shrink-0">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sync settings */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
             <p className="text-[15px] font-bold text-gray-500  mb-0.5">Sync Frequency</p>
            <select value={freq} onChange={e => setFreq(e.target.value)}
              className="w-full text-sm font-semibold text-gray-900 outline-none bg-transparent">
              {['Every day', 'Every week', 'Every month'].map(f => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
       
        </div>

  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
           <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-800">Auto Sync</p>
              <p className="text-xs text-gray-400">Automatically sync new events and updates.</p>
            </div>
            <button onClick={() => setAutoSync(!autoSync)}
              className={`w-11 h-6 rounded-full transition-all relative ${autoSync ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${autoSync ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          </div>

        {/* Disconnect */}
        <button className="w-full bg-red-50 text-red-600 font-bold py-2.5 rounded-xl text-base border border-red-100 hover:bg-red-100 transition-all">
          Disconnect Calendar
        </button>

        <button onClick={() => router.push('/calendar')}
          className="w-full border-2 border-indigo-200 text-indigo-600 font-bold py-2.5 rounded-xl text-base hover:bg-indigo-50 transition-all">
          Reconnect / Change Calendar
        </button>
      </div>
    </div>
  );
}
