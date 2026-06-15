'use client';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import BackHeader from '../BackHeader';
import { getUser } from '@/lib/api';

const SCHOOL_MAP: Record<string, { name: string; city: string; lms: string; lmsIcon: string; lmsColor: string }> = {
  arkansas: { name: 'University of Arkansas', city: 'Fayetteville, AR', lms: 'Blackboard Learn', lmsIcon: 'Bb', lmsColor: 'bg-gray-900' },
  tamu:     { name: 'Texas A&M University',   city: 'College Station, TX', lms: 'Canvas', lmsIcon: 'C', lmsColor: 'bg-red-600' },
  other:    { name: 'Other School',            city: 'Unknown',          lms: 'Other LMS', lmsIcon: '?', lmsColor: 'bg-gray-400' },
};

export default function SchoolSettingsPage() {
  const router = useRouter();
  const user   = getUser();
  const school = SCHOOL_MAP[user?.school || 'arkansas'];

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="School Settings" />

      <div className="px-4 py-5 space-y-4">

        {/* Connected school card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">Connected School</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl">🏫</div>
            <div>
              <p className="font-extrabold text-gray-900">{school.name}</p>
              <p className="text-xs text-gray-400">{school.city}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">Connected</span>
        </div>

        {/* LMS section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">Learning Management System (LMS)</p>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 ${school.lmsColor} rounded-2xl flex items-center justify-center text-white font-extrabold text-sm`}>
              {school.lmsIcon}
            </div>
            <div>
              <p className="font-extrabold text-gray-900">{school.lms}</p>
              <p className="text-xs text-gray-500">Your grades and assignments are imported from {school.lms}.</p>
            </div>
          </div>

          <button onClick={() => router.push('/school-selection')}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
            Change School / LMS
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-lg flex-shrink-0">⚠️</span>
          <p className="text-xs text-amber-700 leading-relaxed">
            Changing your school or LMS will reset your current connections and data.
          </p>
        </div>
      </div>
    </div>
  );
}
