'use client';
import { XCircle } from 'lucide-react';
import { Phone } from './shared';

interface Props { onRetry: () => void; onBack: () => void; }

export default function CalScreen8({ onRetry, onBack }: Props) {
  return (
    <Phone>
      <div className="flex flex-col min-h-[520px]">

        {/* Error icon */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <div className="px-6 text-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Couldn&apos;t connect
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            We couldn&apos;t import your calendar. Check the URL and try again.
          </p>
        </div>

        {/* Common issues */}
        <div className="px-5 flex-1">
          <p className="text-xs font-extrabold text-gray-700 mb-3">Common issues:</p>
          <div className="space-y-2">
            {[
              'Incorrect or expired URL',
              'Calendar feed not enabled',
              'School restrictions',
            ].map(issue => (
              <div key={issue} className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                <span className="text-sm text-gray-600">{issue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-6 mt-4 space-y-2">
          <button onClick={onRetry}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-md">
            Try Again
          </button>
          <button onClick={onBack}
            className="w-full border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold py-3 rounded-2xl text-sm transition-all">
            Go Back
          </button>
        </div>

      </div>
    </Phone>
  );
}
