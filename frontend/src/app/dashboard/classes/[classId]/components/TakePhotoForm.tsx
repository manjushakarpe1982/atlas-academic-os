'use client';
import { ArrowLeft, Camera, ImagePlus, Info } from 'lucide-react';

export default function TakePhotoForm({ onBack }: { onBack: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <button onClick={onBack}><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
        <h2 className="text-base font-extrabold text-gray-900">Add Grade</h2>
      </div>
      <div className="px-5 py-6 space-y-5">
        <div className="border-2 border-dashed border-indigo-300 rounded-2xl py-10 flex flex-col items-center justify-center gap-3 hover:bg-indigo-50 transition-all cursor-pointer">
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <Camera className="w-7 h-7 text-indigo-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">Take Photo</p>
            <p className="text-xs text-gray-400 mt-0.5">Capture your quiz/test</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" /><span className="text-xs font-bold text-gray-400">OR</span><div className="flex-1 h-px bg-gray-200" />
        </div>
        <button className="w-full border-2 border-indigo-200 text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-sm">
          <ImagePlus className="w-4 h-4" /> Upload from Gallery
        </button>
        <div className="flex items-start gap-3 pt-2">
          <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0"><Info className="w-4 h-4 text-indigo-500" /></div>
          <p className="text-xs text-gray-500 leading-relaxed pt-1">We&apos;ll read the score and update your grade for you.</p>
        </div>
      </div>
    </div>
  );
}
