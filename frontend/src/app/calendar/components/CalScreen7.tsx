'use client';
import { RefreshCw, BookOpen, BarChart2 } from 'lucide-react';
import { Phone } from './shared';

interface Props { onDashboard: () => void; onConnect: () => void; }

export default function CalScreen7({ onDashboard, onConnect }: Props) {
  return (
    <Phone>
      <div className="flex flex-col min-h-[520px]">

        {/* Illustration */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="relative w-24 h-24">
            <div className="w-24 h-24 bg-amber-100 rounded-3xl flex items-center justify-center">
              <span className="text-5xl">📅</span>
            </div>
            {/* Warning badge */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-white text-sm font-extrabold">!</span>
            </div>
          </div>
        </div>

        <div className="px-6 text-center mb-5">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            No calendar connected
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            You can connect your calendar later to get smarter study plans and never miss a deadline.
          </p>
        </div>

        {/* Why connect */}
        <div className="px-5 mb-6">
          <p className="text-xs font-extrabold text-gray-700 mb-3">Why connect?</p>
          <div className="space-y-2">
            {[
              { icon: RefreshCw, text: 'Auto sync assignments & exams' },
              { icon: BookOpen,  text: 'Get reminders'                 },
              { icon: BarChart2, text: 'Better study recommendations'  },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <f.icon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-6 mt-auto space-y-2">
          <button onClick={onDashboard}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-md">
            Go to Dashboard
          </button>
          <button onClick={onConnect}
            className="w-full border-2 border-indigo-200 hover:border-indigo-400 text-indigo-600 font-bold py-3 rounded-2xl text-sm transition-all">
            Connect Calendar Later
          </button>
        </div>

      </div>
    </Phone>
  );
}
