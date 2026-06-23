'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MATERIALS, TopicItem } from './shared';

interface Props { topic: TopicItem; onBack: () => void; onSelect: (id: string) => void; }

export default function ChooseMaterial({ topic, onBack, onSelect }: Props) {
  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
        <div>
          <h1 className="text-base font-extrabold text-gray-900">{topic.title}</h1>
          <p className="text-xs text-gray-400">Biology 1107</p>
        </div>
      </div>

      {/* About Topic */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-5">
        <p className="text-xs font-bold text-indigo-700 mb-1">About this topic</p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Learn about genes, DNA, inheritance patterns and genetic variations. 🧬
        </p>
      </div>

      {/* Material Options */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Choose what you want to study</p>
      <div className="space-y-3">
        {MATERIALS.map(m => (
          <button key={m.id} onClick={() => onSelect(m.id)}
            className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:border-indigo-200 transition-all text-left">
            <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{m.icon}</div>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-gray-900">{m.title}</p>
              <p className="text-xs text-gray-400">{m.sub}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
