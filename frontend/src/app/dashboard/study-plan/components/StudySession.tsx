'use client';
import { ChevronLeft, ChevronRight, Flame, Clock, Calendar, CheckCircle2, Target } from 'lucide-react';
import { FocusItem } from './shared';

interface Props { focus: FocusItem; onBack: () => void; onContinue: () => void; }

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

const ACHIEVEMENTS = [
  'Improve your understanding of key concepts',
  'Score better in your upcoming exam',
  'Boost your overall course grade',
];

export default function StudySession({ focus, onBack, onContinue }: Props) {
  return (
    <div className="px-4 py-4 pb-24">

      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
        <span className="text-sm font-bold text-gray-400">Study Session</span>
      </div>

      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-3">
          <Flame className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-xl font-extrabold text-gray-900">{focus.className}</h1>
        <p className="text-sm text-indigo-600 font-semibold mt-0.5">{focus.topic || focus.examTitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-gray-900">90 min</p>
            <p className="text-[10px] text-gray-400">Estimated Time</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-gray-900">{formatDate(focus.examDate)}</p>
            <p className="text-[10px] text-gray-400">Exam Date</p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6">
        <p className="text-xs font-bold text-indigo-700 mb-2">Why Atlas recommended this?</p>
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 bg-indigo-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Target className="w-4 h-4 text-indigo-700" />
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            Your exam is in <span className="font-bold text-indigo-700">{focus.daysLeft} days</span>
            {focus.currentGrade !== null && (
              <> and your current grade is <span className="font-bold text-indigo-700">{focus.currentGrade}%</span></>
            )}. This topic has the <span className="font-bold text-indigo-700">highest impact</span> on your grade.
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">What you&apos;ll achieve</h2>
        <div className="space-y-2.5">
          {ACHIEVEMENTS.map((a, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm text-gray-700">{a}</p>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onContinue}
        className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all text-sm flex items-center justify-center gap-2">
        Continue to Study <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
