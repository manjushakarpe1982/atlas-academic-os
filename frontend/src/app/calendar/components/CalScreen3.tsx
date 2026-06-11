'use client';
import { Shield, HelpCircle } from 'lucide-react';
import { Phone } from './shared';

interface Props {
  onNext:   (url: string) => void;
  onBack:   () => void;
  onHowTo:  () => void;
  platform: string;
  url:      string;
  setUrl:   (v: string) => void;
}

export default function CalScreen3({ onHowTo, platform, url, setUrl }: Props) {
  const placeholder = platform === 'canvas'
    ? 'https://your.school.instructure.com/...'
    : 'https://learn.school.edu/...';

  return (
    <Phone>
      <div className="flex flex-col px-5 pt-4 pb-4">
        <h1 className="text-xl font-extrabold text-gray-900 mb-1">Paste your calendar feed URL</h1>
        <p className="text-sm text-gray-400 mb-5">
          Atlas will import your assignments, quizzes, and exam dates.
        </p>

        {/* Security note */}
        <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl p-3 mb-4">
          <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-indigo-800">Your security matters</p>
            <p className="text-xs text-indigo-600">Atlas never asks for your school password.</p>
          </div>
        </div>

        {/* URL input */}
        <div className="mb-3">
          <label className="text-xs font-bold text-gray-600 mb-1.5 block">Calendar Feed URL</label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 rounded-xl outline-none text-xs transition-all"
          />
        </div>

        {/* How to find */}
        <button onClick={onHowTo}
          className="flex items-center gap-2 text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
          <HelpCircle className="w-4 h-4" />
          How to find this? ›
        </button>
      </div>
    </Phone>
  );
}
