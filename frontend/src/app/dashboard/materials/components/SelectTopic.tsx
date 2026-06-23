'use client';
import { ChevronRight, ChevronDown, BookOpen } from 'lucide-react';
import { CLASSES, TOPICS, TopicItem } from './shared';

interface Props { onTopicSelect: (t: TopicItem) => void; }

export default function SelectTopic({ onTopicSelect }: Props) {
  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-extrabold text-gray-900">Study Materials</h1>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
        </div>
      </div>

      {/* Select Class */}
      <div className="mb-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Select Class</p>
        <button className="w-full bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between hover:border-indigo-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-lg">🧬</div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900">{CLASSES[0].name}</p>
              <p className="text-xs text-gray-400">{CLASSES[0].term}</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Select Topic */}
      <div className="mb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Select Topic</p>
        <p className="text-xs text-gray-500 mb-3">All Topics ({TOPICS.length})</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {TOPICS.map(t => (
            <button key={t.id} onClick={() => onTopicSelect(t)}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-all text-left">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-indigo-600">{t.title.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">{t.title}</p>
                <p className="text-xs text-gray-400">Last studied: {t.lastStudied}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      <button className="text-xs text-indigo-600 font-bold">View All Topics</button>

      {/* Recent Study */}
      <div className="mt-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Recent Study</p>
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
          <p className="text-sm font-bold text-gray-900">Genetics Summary</p>
          <p className="text-xs text-gray-500 mt-0.5">You struggled with inheritance patterns in quiz. Try Targeted Practice.</p>
          <button className="mt-3 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg">
            Generate Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
