'use client';
// Screen 6 — Important Dates & Weekly Topics (Editable)
import { ArrowLeft, Edit2 } from 'lucide-react';
import { Phone, ConfBadge } from './shared';
import { ScreenProps } from './types';
import { MOCK_COURSE } from './mockData';

export default function Screen6({ onNext, onBack }: ScreenProps) {
  return (
    <Phone step={3} total={5}>
      <div className=" py-2 ">
       

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-extrabold text-gray-900">Important Dates</h1>
          <button className="text-xs text-indigo-600 font-semibold">Edit All</button>
        </div>

        {/* Dates list */}
        <div className="space-y-2 mb-5">
          {MOCK_COURSE.dates.map(d => (
            <div key={d.title}
              className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-extrabold text-indigo-600">
                    {d.date.split(' ')[1].replace(',', '')}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{d.title}</p>
                  <p className="text-[10px] text-gray-400">{d.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <ConfBadge level={d.confidence} />
                <Edit2 className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Weekly topics */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">
              Weekly Topics (Preview)
            </p>
            <button className="text-xs text-indigo-600 font-semibold">Edit All</button>
          </div>
          {MOCK_COURSE.topics.map(t => (
            <div key={t.week} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-[10px] text-gray-400">Week {t.week}</p>
                <p className="text-xs font-semibold text-gray-800">{t.title}</p>
              </div>
              <ConfBadge level="High" />
            </div>
          ))}
          <button className="text-xs text-indigo-600 font-semibold mt-2">+ 13 more weeks</button>
        </div>

       
      </div>
    </Phone>
  );
}
