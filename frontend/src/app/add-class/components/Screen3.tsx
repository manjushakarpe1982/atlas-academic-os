'use client';
// Screen 3 — Upload Syllabus
import { ArrowLeft, Camera, Image, FileText } from 'lucide-react';
import { Phone } from './shared';
import { ScreenProps } from './types';

export default function Screen3({ onNext, onBack }: ScreenProps) {
  return (
    <Phone step={2} total={5}>
      <div className="px-6 py-4">
        <button onClick={onBack} className="mb-4 text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          Upload your<br />syllabus
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Take a clear photo or upload a PDF. Multi-page supported.
        </p>

        {/* Drop zone */}
        <div
          onClick={onNext}
          className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-6 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer">
          <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-gray-500" />
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">Drag &amp; drop or tap to upload</p>
          <p className="text-xs text-gray-400">PDF, JPG, PNG</p>
        </div>

        {/* Upload options */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Camera,   label: 'Camera'        },
            { icon: Image,    label: 'Photo Library' },
            { icon: FileText, label: 'Files'         },
          ].map(o => (
            <button key={o.label} onClick={onNext}
              className="flex flex-col items-center gap-2 border-2 border-gray-200 rounded-2xl p-3 hover:border-indigo-400 hover:bg-indigo-50 transition-all">
              <o.icon className="w-6 h-6 text-indigo-600" />
              <span className="text-xs font-semibold text-gray-700">{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    </Phone>
  );
}
