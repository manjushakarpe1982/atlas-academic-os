'use client';
import { ArrowLeft } from 'lucide-react';
import { Phone } from './shared';

interface Props { onBack: () => void; onDone: () => void; platform: string; }

export default function CalScreen4({ onBack, onDone, platform }: Props) {
  const isPlatformCanvas = platform !== 'blackboard';
  const platformName = isPlatformCanvas ? 'Canvas' : 'Blackboard';

  const steps = isPlatformCanvas ? [
    { num: 1, text: 'Open Canvas and go to Calendar' },
    { num: 2, text: 'Click on "Calendar Feed" in the left menu' },
    { num: 3, text: 'Copy the Calendar Feed URL' },
    { num: 4, text: 'Paste the URL in Atlas and click Continue' },
  ] : [
    { num: 1, text: 'Open Blackboard and log in' },
    { num: 2, text: 'Open the Calendar from the menu' },
    { num: 3, text: 'Find "Get External Calendar Link"' },
    { num: 4, text: 'Copy the iCal link and paste it in Atlas' },
  ];

  return (
    <Phone>
      <div className="flex flex-col min-h-[520px]">
        <div className="flex items-center px-5 pt-2 pb-3">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 flex-1">
          <h1 className="text-xl font-extrabold text-gray-900 mb-1">
            How to find your<br />Calendar Feed URL
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Follow these simple steps for {platformName}:
          </p>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-start gap-4">
                {/* Step connector */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-extrabold">{s.num}</span>
                  </div>
                  {i < steps.length - 1 && <div className="w-0.5 h-6 bg-indigo-200 mt-1" />}
                </div>
                {/* Step text + placeholder screenshot */}
                <div className="flex-1 pb-2">
                  <p className="text-sm font-semibold text-gray-800 mb-2">{s.text}</p>
                  {/* Screenshot placeholder */}
                  <div className="w-full h-10 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-400">Step {s.num} screenshot</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-6 mt-4">
          <button onClick={onDone}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-md">
            I&apos;ve copied the URL
          </button>
        </div>
      </div>
    </Phone>
  );
}
