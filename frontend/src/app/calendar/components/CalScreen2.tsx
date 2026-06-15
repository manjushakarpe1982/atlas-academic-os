'use client';
import { useState, useEffect } from 'react';
import { Phone } from './shared';

interface Props {
  onNext:      (platform: string) => void;
  onBack:      () => void;
  onNotSure:   () => void;
  onSelect:    (platform: string) => void;
  selected:    string;
}

const PLATFORMS = [
  { id: 'canvas',     name: 'CANVAS',     sub: 'Connect with Canvas',    color: 'bg-red-600'  },
  { id: 'blackboard', name: 'BLACKBOARD', sub: 'Connect with Blackboard', color: 'bg-gray-900' },
];

export default function CalScreen2({ onSelect, selected, onNotSure }: Props) {
  return (
    <Phone>
      <div className="flex flex-col px-5 pt-4 pb-4">
        <h1 className="text-2xl text-center font-extrabold text-gray-900 mb-1">which school do you <br /> attend?</h1>
        <p className="text-sm text-gray-400 mb-5 text-center">This helps Atlas connect to your school calendar and import your important dates.</p>

        <div className="space-y-3 mb-4">
          {PLATFORMS.map(p => (
            <button key={p.id} onClick={() => onSelect(p.id)}
              className={`w-full flex items-center gap-4 p-4 border-2 rounded-2xl text-left transition-all ${
                selected === p.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}>
              <div className={`w-12 h-12 ${p.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <span className="text-[10px] font-extrabold text-white text-center leading-tight px-1">
                  {p.name}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-800">{p.sub}</span>
              {selected === p.id && (
                <div className="ml-auto w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Not sure */}
        <button onClick={onNotSure}
          className="w-full flex items-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-gray-400 text-xl">?</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-700">Not sure?</p>
            <p className="text-xs text-gray-400">Choose the platform your school uses.</p>
          </div>
        </button>
      </div>
    </Phone>
  );
}
