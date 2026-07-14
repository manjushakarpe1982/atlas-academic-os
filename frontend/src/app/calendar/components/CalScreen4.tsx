'use client';
import Image from 'next/image';
import { Lock } from 'lucide-react';
import { Phone } from './shared';

interface Props { idx: number; platform: string; }

const CANVAS_STEPS = [
  {
    title: 'Open canvas.tamu.edu and log in.',
    desc: 'Go to canvas.tamu.edu and sign in with your NetID and password.',
    img: 'https://res.cloudinary.com/mview/image/upload/atlas/calendar-c-1.webp',
  },
  {
    title: 'Click Calendar in the left menu.',
    desc: 'The Calendar icon is in the left sidebar navigation.',
    img: 'https://res.cloudinary.com/mview/image/upload/atlas/calendar-c-2.webp',
  },
  {
    title: 'Scroll to the bottom of the right sidebar and click Calendar Feed.',
    desc: 'You will find the "Calendar Feed" link below the small calendars list.',
    img: 'https://res.cloudinary.com/mview/image/upload/atlas/calendar-c-3.webp',
  },
  {
    title: 'Copy the link that appears.',
    desc: 'It starts with https://canvas.tamu.edu/feeds/calendars/.',
    img: 'https://res.cloudinary.com/mview/image/upload/atlas/calendar-c-4.webp',
    note: 'Use this link in any calendar application that supports the iCal format.',
  },
  {
    title: 'Paste it here in Atlas and click Continue.',
    desc: 'Paste the copied Calendar Feed URL into the field on the previous screen.',
    img: 'https://res.cloudinary.com/mview/image/upload/atlas/calendar-c-5.webp',
  },
];

const BLACKBOARD_STEPS = [
  {
    title: 'Open learn.uark.edu and log in.',
    desc: 'Go to learn.uark.edu and sign in with your university credentials.',
    img: 'https://res.cloudinary.com/mview/image/upload/atlas/calendar-b-1.webp',
  },
  {
    title: 'Open the Calendar.',
    desc: 'Find Calendar in the main Blackboard menu.',
    img: 'https://res.cloudinary.com/mview/image/upload/atlas/calendar-b-2.webp',
  },
  {
    title: 'Find the Calendar Settings / "Get External Calendar Link" option.',
    desc: 'It is located inside the calendar settings panel.',
    img: 'https://res.cloudinary.com/mview/image/upload/atlas/calendar-b-3.webp',
  },
  {
    title: 'Copy the iCal link it generates.',
    desc: 'Click Copy Link once the external calendar link appears.',
    img: 'https://res.cloudinary.com/mview/image/upload/atlas/calendar-b-4.webp',
    note: 'This is a private link. Do not share it with others.',
  },
  {
    title: 'Paste it here in Atlas and click Continue.',
    desc: 'Paste the copied iCal link into the field on the previous screen.',
    img: 'https://res.cloudinary.com/mview/image/upload/atlas/calendar-b-5.webp',
  },
];

export default function CalScreen4({ idx, platform }: Props) {
  const isCanvas = platform !== 'blackboard';
  const steps = isCanvas ? CANVAS_STEPS : BLACKBOARD_STEPS;
  const platformLabel = isCanvas ? 'Canvas (Texas A&M)' : 'Blackboard (University of Arkansas)';
  const platformIcon = isCanvas ? '🟥' : '⬛';

  const step = steps[Math.min(idx, steps.length - 1)];

  return (
    <Phone>
      <div className="flex flex-col min-h-[560px] pb-20">

        {/* Header */}
        <div className="flex items-center gap-3 px-5  pb-3">
          <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
            {platformIcon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-extrabold text-gray-900">{platformLabel}</p>
            <p className="text-[11px] text-gray-400">Follow these steps to get your calendar feed URL.</p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center px-6 mb-4">
          {steps.map((_, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold flex-shrink-0 transition-all ${
                i === idx ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : i < idx ? 'bg-indigo-100 text-indigo-600'
                : 'bg-gray-100 text-gray-400'
              }`}>
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${i < idx ? 'bg-indigo-300' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="px-5 flex-1">
          <p className="text-xs font-bold text-indigo-600 mb-1">Step {idx + 1} of {steps.length}</p>
          <h1 className="text-lg font-bold text-gray-900 leading-snug mb-1.5">{step.title}</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">{step.desc}</p>

          {/* Screenshot */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm mb-3">
            <Image
              src={step.img}
              alt={`Step ${idx + 1}`}
              width={340}
              height={220}
              className="w-full object-contain bg-gray-50"
            />
          </div>

          {/* Optional note */}
          {step.note && (
            <div className="flex items-start gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5 mb-3">
              <Lock className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-700 leading-snug">{step.note}</p>
            </div>
          )}
        </div>


      </div>
    </Phone>
  );
}
