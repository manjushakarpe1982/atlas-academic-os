'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { ArrowLeft, MoreVertical, Loader2, BookOpen } from 'lucide-react';
import { api } from '@/lib/api';
import OverviewTab from './components/OverviewTab';
import GradesTab from './components/GradesTab';
import TopicsTab from './components/TopicsTab';
import AssignmentsTab from './components/AssignmentsTab';

interface OverviewData {
  classInfo: { name: string; instructor: string | null; term: string | null; credit_hours: number | null };
  currentGrade: number | null;
  totalGrades: number;
}

function gradeColor(g: number | null): string {
  if (g === null) return 'text-gray-400';
  if (g >= 90) return 'text-green-600';
  if (g >= 80) return 'text-blue-600';
  if (g >= 70) return 'text-amber-600';
  return 'text-red-600';
}

const TABS = ['Overview', 'Grades', 'Topics', 'Assignments'] as const;
type Tab = typeof TABS[number];

function PageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const classId = params.classId as string;
  const init = (searchParams.get('tab') as Tab) || 'Overview';
  const [tab, setTab] = useState<Tab>(TABS.includes(init as Tab) ? init as Tab : 'Overview');

  const [className, setClassName] = useState('');
  const [classTerm, setClassTerm] = useState('');
  const [currentGrade, setCurrentGrade] = useState<number | null>(null);
  const [headerLoading, setHeaderLoading] = useState(true);

  useEffect(() => {
    if (!classId) return;
    api<OverviewData>(`/api/classes/${classId}/overview`)
      .then(d => {
        setClassName(d.classInfo.name || '');
        setClassTerm(d.classInfo.term || '');
        setCurrentGrade(d.currentGrade);
      })
      .catch(() => {})
      .finally(() => setHeaderLoading(false));
  }, [classId]);

  const content: Record<Tab, React.ReactNode> = {
    Overview: <OverviewTab classId={classId} />,
    Grades: <GradesTab />,
    Topics: <TopicsTab classId={classId} />,
    Assignments: <AssignmentsTab />,
  };

  return (
    <div className="min-h-screen ">
      <div className="bg-white px-4 pt-3 pb-0 border-b border-gray-100 sticky top-14 z-10">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => router.back()}><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
        
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            {headerLoading ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              <>
                <h1 className="font-extrabold text-gray-900 text-lg">{className || 'Class'}</h1>
                <p className="text-xs text-gray-400">{classTerm}</p>
              </>
            )}
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400">Current Grade</p>
            <p className={`text-2xl font-extrabold ${gradeColor(currentGrade)}`}>
              {headerLoading ? '—' : currentGrade !== null ? `${currentGrade}%` : '—'}
            </p>
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
