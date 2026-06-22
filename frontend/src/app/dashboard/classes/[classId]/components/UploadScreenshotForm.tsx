'use client';
import { ArrowLeft, Upload, Info } from 'lucide-react';

export default function UploadScreenshotForm({ onBack }: { onBack: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <button onClick={onBack}><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
        <h2 className="text-base font-extrabold text-gray-900">Upload Screenshot</h2>
      </div>
      <div className="px-5 py-6 space-y-5">
        <div className="border-2 border-dashed border-indigo-300 rounded-2xl py-10 flex flex-col items-center justify-center gap-3 hover:bg-indigo-50 transition-all cursor-pointer">
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center"><Upload className="w-7 h-7 text-indigo-600" /></div>
          <div className="text-center"><p className="text-sm font-bold text-indigo-600">Tap to upload</p><p className="text-xs text-gray-400 mt-0.5">PNG, JPG or PDF up to 10MB</p></div>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 mb-3">Supported Sources</p>
          <div className="space-y-2">
            {[{e:'🖥️',t:'LMS Screenshot',s:'Canvas, Blackboard, etc.'},{e:'📄',t:'PDF Grade Report',s:'Exported grade reports'},{e:'📸',t:'Photo of Graded Work',s:'Papers, tests, assignments'}].map(i=>(
              <div key={i.t} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-lg">{i.e}</span><div><p className="text-sm font-semibold text-gray-800">{i.t}</p><p className="text-xs text-gray-400">{i.s}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0"><Info className="w-4 h-4 text-indigo-500" /></div>
          <p className="text-xs text-gray-500 leading-relaxed pt-1">We&apos;ll use AI to read the score from your screenshot and update your grade automatically.</p>
        </div>
      </div>
    </div>
  );
}
