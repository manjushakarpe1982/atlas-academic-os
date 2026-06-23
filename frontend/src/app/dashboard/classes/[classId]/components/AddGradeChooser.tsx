'use client';
import { X, PenLine, Camera, Upload } from 'lucide-react';

interface Props { onClose: () => void; onManual: () => void; onPhoto: () => void; onUpload: () => void; }

export default function AddGradeChooser({ onClose, onManual, onPhoto, onUpload }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl p-5 pb-24 w-full max-w-md space-y-2 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-base font-extrabold text-gray-900 text-center">How do you want to add this grade?</h2>
        <div className="space-y-2 pt-2">
          {[
            { onClick: onManual, Icon: PenLine, title: 'Manual Entry', sub: 'Enter the grade details manually' },
            { onClick: onPhoto,  Icon: Camera,  title: 'Take Photo',   sub: 'Take a photo of your graded work' },
            { onClick: onUpload, Icon: Upload,  title: 'Upload Screenshot', sub: 'Upload grade from LMS or PDF' },
          ].map(opt => (
            <button key={opt.title} onClick={opt.onClick}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <opt.Icon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-gray-900">{opt.title}</p>
                <p className="text-[13px] text-gray-400">{opt.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
