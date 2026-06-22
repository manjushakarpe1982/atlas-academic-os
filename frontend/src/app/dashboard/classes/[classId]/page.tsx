'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import OverviewTab from './components/OverviewTab';
import GradesTab from './components/GradesTab';
import TopicsTab from './components/TopicsTab';
import AssignmentsTab from './components/AssignmentsTab';

const TABS = ['Overview', 'Grades', 'Topics', 'Assignments'] as const;
type Tab = typeof TABS[number];

function PageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const init = (searchParams.get('tab') as Tab) || 'Overview';
  const [tab, setTab] = useState<Tab>(TABS.includes(init as Tab) ? init as Tab : 'Overview');

  const content: Record<Tab, React.ReactNode> = {
    Overview: <OverviewTab />,
    Grades: <GradesTab />,
    Topics: <TopicsTab />,
    Assignments: <AssignmentsTab />,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 pt-3 pb-0 border-b border-gray-100 sticky top-14 z-10">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => router.back()}><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
          <button><MoreVertical className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white text-xl flex-shrink-0">🌿</div>
          <div className="flex-1">
            <h1 className="font-extrabold text-gray-900 text-lg">Biology 1107</h1>
            <p className="text-xs text-gray-400">Life Sciences</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400">Current Grade</p>
            <p className="text-2xl font-extrabold text-gray-900">84%</p>
          </div>
        </div>
        <div className="flex">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all ${tab === t ? 'text-indigo-600 border-indigo-600' : 'text-gray-400 border-transparent'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 py-4 pb-24">{content[tab]}</div>
    </div>
  );
}

export default function ClassDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <PageContent />
    </Suspense>
  );
}
