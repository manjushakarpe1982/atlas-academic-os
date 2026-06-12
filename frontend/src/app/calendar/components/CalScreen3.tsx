'use client';
import Image from 'next/image';
import { Shield, HelpCircle, Link2 } from 'lucide-react';
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
      <div className="flex flex-col bg-white min-h-[560px]">

        {/* ── Hero row: headline left + image right ── */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3">
          <div className="flex-1">
            <h1 className="text-[20px] font-extrabold text-gray-900 leading-tight mb-1">
              Paste your calendar
            </h1>
            <h1 className="text-2xl font-extrabold text-indigo-600 leading-tight mb-2">
              feed URL
            </h1>
            <p className="text-xs text-gray-500 leading-relaxed">
              Atlas will import your assignments, quizzes, and exam dates.
            </p>
          </div>

          {/* Cloudinary image — calenderpage1 */}
          <div className="flex-shrink-0 relative">
            {/* Sparkle */}
            <Image
              src="https://res.cloudinary.com/mview/image/upload/atlas/calenderpage1.webp"
              alt="Calendar feed illustration"
              width={120}
              height={120}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* ── Security note ── */}
        <div className="mx-5 mb-4">
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
            <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-indigo-800">Your security matters</p>
              <p className="text-xs text-indigo-500">Atlas never asks for your school password.</p>
            </div>
          </div>
        </div>

        {/* ── URL input ── */}
        <div className="px-5 mb-3">
          <label className="text-base font-bold text-gray-700 mb-2 block">Calendar Feed URL</label>
          <div className="flex items-center gap-2 border-2 border-gray-300 focus-within:border-indigo-500 rounded-xl px-3 py-3 transition-all bg-white">
            <Link2 className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder={placeholder}
              className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* ── How to find link ── */}
        <button onClick={onHowTo}
          className="flex items-center gap-1.5 px-5 mb-4 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
          <HelpCircle className="w-4 h-4" />
          How to find this? ›
        </button>

        {/* ── Browser preview card ── */}
        <div className="mx-5">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl overflow-hidden">
            {/* Browser chrome */}
            <div className="bg-white border-b border-gray-100 px-3 py-2 flex items-center gap-1.5">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-gray-100 rounded-md px-2 py-0.5 mx-2">
                <p className="text-[9px] text-gray-400 truncate">https://your.schoolinstructure.com/...</p>
              </div>
            </div>

            {/* Page content preview */}
            <div className="p-4 relative">
              {/* Sparkle */}
              <span className="absolute top-2 right-3 text-indigo-300 text-xs">✦</span>
              {/* Skeleton lines */}
              <div className="space-y-2 mb-3">
                <div className="h-2 bg-indigo-200/60 rounded-full w-3/4" />
                <div className="h-2 bg-indigo-200/40 rounded-full w-1/2" />
                {/* <div className="h-2 bg-indigo-200/40 rounded-full w-2/3" /> */}
              </div>

              {/* Calenderpage2 image */}
              <div className="flex justify-center">
                <Image
                  src="https://res.cloudinary.com/mview/image/upload/atlas/calenderpage2.webp"
                  alt="Calendar settings preview"
                  width={220}
                  height={80}
                  className="object-contain rounded-xl"
                />
              </div>
            </div>

            {/* Caption */}
            <div className="px-4 pb-3 text-center">
              <p className="text-xs text-gray-500">
                Usually found in your school portal or<br />LMS calendar settings.
              </p>
            </div>
          </div>
        </div>

      </div>
    </Phone>
  );
}
