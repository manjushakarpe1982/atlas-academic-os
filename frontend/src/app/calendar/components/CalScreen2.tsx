'use client';
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Phone } from './shared';

interface Props {
  onNext:      (school: string) => void;
  onBack:      () => void;
  onNotSure:   () => void;
  onSelect:    (school: string) => void;
  selected:    string;
}

const SCHOOLS = [
  {
    id: 'arkansas',
    name: 'University of Arkansas',
    lms: 'Blackboard Learn',
    logo: 'UA',
    logoBg: 'bg-red-600',
    statusBadge: {
      text: 'Connected',
      icon: '🔴',
      color: 'text-red-500',
    },
  },
  {
    id: 'tamu',
    name: 'Texas A&M University',
    lms: 'Canvas',
    logo: 'A&M',
    logoBg: 'bg-red-900',
    statusBadge: {
      text: 'Popular',
      icon: '⭐',
      color: 'text-blue-500',
    },
  },
  {
    id: 'other',
    name: 'Other School',
    lms: 'Other LMS',
    logo: '🏢',
    logoBg: 'bg-gray-400',
  },
];

export default function CalScreen2({ onSelect, selected, onNotSure }: Props) {
  return (
    <Phone>
      <div className="flex flex-col ">
        {/* Header Section */}
        <div className="  pb-6 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-2">
            Which school do you
            <br />
            attend?
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            This helps Atlas connect to your school calendar
          
            and import your important dates.
          </p>
        </div>

        {/* Schools Container */}
        <div className="flex-1  pb-6 space-y-3">
          {SCHOOLS.map((school) => {
            const isSelected = selected === school.id;

            return (
              <button
                key={school.id}
                onClick={() => onSelect(school.id)}
                className={`w-full group transition-all duration-200 rounded-xl px-3 py-3 flex items-center justify-between text-left border-2 shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-100 bg-white hover:border-indigo-200'
                }`}
              >
                {/* Logo + School Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Logo Badge */}
                  <div
                    className={`w-14 h-14 ${school.logoBg} rounded-xl flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0 shadow-sm`}
                  >
                    {school.logo}
                  </div>

                  {/* School Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-extrabold text-gray-900 leading-tight">
                      {school.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 mb-2">{school.lms}</p>

                    {/* Status Badge */}
                    {school.statusBadge && (
                      <div className={`inline-flex items-center gap-1.5 ${school.statusBadge.color}`}>
                        <span className="text-xs">{school.statusBadge.icon}</span>
                        <span className="text-xs font-bold">
                          {school.statusBadge.text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chevron Arrow */}
                <ChevronRight
                  className={`w-6 h-6 flex-shrink-0 ml-2 transition-colors ${
                    isSelected ? 'text-indigo-600' : 'text-gray-300 group-hover:text-gray-400'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Not Sure Section */}
        <div className=" p-5 bg-indigo-50 rounded-xl border border-indigo-100">
          <button
            onClick={onNotSure}
            className="w-full flex items-start gap-3 text-left hover:opacity-80 transition-opacity"
          >
            <span className="text-4xl flex-shrink-0">📅</span>
            <div className="flex-1">
              <p className="text-base font-extrabold text-gray-900 mb-1">
                Don't see your school?
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                No worries! You can still add your calendar manually in the next step.
              </p>
            </div>
          </button>
        </div>

       
      </div>
    </Phone>
  );
}
