'use client';
// Screen 5 — Review What We Found (MOST IMPORTANT)
import { ArrowLeft, Edit2 } from 'lucide-react';
import { Phone, ConfBadge } from './shared';
import { ScreenProps } from './types';
import { MOCK_COURSE } from './mockData';

export default function Screen5({ onNext, onBack }: ScreenProps) {
  return (
    <Phone step={3} total={5}>
      <div className=" py-2 overflow-y-auto">
      
<span className="text-[12px] font-extrabold bg-indigo-600 text-white px-2 py-1.5  rounded-full">
            MOST IMPORTANT
          </span>
        <div className="flex items-center justify-between mt-2 mb-1">
          <h1 className="text-2xl font-extrabold text-gray-900">Review what we found</h1>
          
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Please check everything and edit if anything looks wrong.
        </p>

        {/* Course Info */}
        <div className="bg-gray-50 rounded-2xl p-3 mb-3 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">Course Information</p>
            <button className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
              <Edit2 className="w-3 h-3" /> Edit All
            </button>
          </div>
          {[
            { label: 'Course Name',  value: MOCK_COURSE.name,            confidence: 'High'   },
            { label: 'Instructor',   value: MOCK_COURSE.instructor,      confidence: 'Medium' },
            { label: 'Credit Hours', value: String(MOCK_COURSE.credits), confidence: 'High'   },
          ].map(f => (
            <div key={f.label} className="flex items-center justify-between py-1.5 border-t border-gray-200 first:border-0">
              <div>
                <p className="text-[10px] text-gray-400">{f.label}</p>
                <p className="text-xs font-semibold text-gray-800">{f.value}</p>
              </div>
              <div className="flex items-center gap-2">
                <ConfBadge level={f.confidence} />
                <Edit2 className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Grading Breakdown */}
        <div className="bg-gray-50 rounded-2xl p-3 mb-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">Grading Breakdown</p>
            <button className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
              <Edit2 className="w-3 h-3" /> Edit All
            </button>
          </div>
          {MOCK_COURSE.weights.map(w => (
            <div key={w.category} className="flex items-center justify-between py-1.5 border-t border-gray-200 first:border-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-indigo-400" />
                <span className="text-xs font-semibold text-gray-800">{w.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-700">{w.pct}%</span>
                <ConfBadge level={w.confidence} />
                <Edit2 className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

       
      </div>
    </Phone>
  );
}
