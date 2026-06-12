'use client';
import { useState } from 'react';
import { Filter } from 'lucide-react';
import { QUIZZES } from '../components/mockData';

const TABS = ['Upcoming','Past','Practice'];

export default function QuizzesPage() {
  const [tab, setTab] = useState('Upcoming');

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-extrabold text-gray-900">Quizzes</h1>
        <button className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <Filter className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-5">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
            }`}>{t}</button>
        ))}
      </div>

      <div className="space-y-3">
        {QUIZZES.map(q => (
          <div key={q.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 ${q.color} rounded-xl flex items-center justify-center text-white font-extrabold text-xs`}>
                Q{q.id}
              </div>
              <div className="flex-1">
                <p className="text-sm font-extrabold text-gray-900">{q.title}</p>
                <p className="text-xs text-gray-400">{q.sub}</p>
                <p className="text-xs text-gray-400 mt-0.5">{q.date}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold text-red-500">{q.score}%</span>
              </div>
            </div>
          </div>
        ))}

        {/* AI Quiz Prep card */}
        <div className="bg-indigo-600 rounded-2xl p-4 text-white">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-lg">🤖</span>
            <div>
              <p className="font-extrabold text-sm">AI Quiz Prep</p>
              <p className="text-xs text-indigo-200">Prepare smarter with AI</p>
            </div>
          </div>
          <div className="space-y-1.5 mb-3">
            {['20 MCQs Practice', 'Flashcards', 'Quick Summary'].map(i => (
              <div key={i} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
                <span className="text-xs font-semibold">{i}</span>
              </div>
            ))}
          </div>
          <button className="w-full bg-white text-indigo-600 font-bold py-2.5 rounded-xl text-sm">
            Start Quiz Prep →
          </button>
        </div>
      </div>
    </div>
  );
}
