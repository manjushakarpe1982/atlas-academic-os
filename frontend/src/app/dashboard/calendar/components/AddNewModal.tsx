'use client';
import { X, Calendar, BookOpen } from 'lucide-react';

interface Props { onClose: () => void; onAddEvent: () => void; onAddStudy: () => void; }

export default function AddNewModal({ onClose, onAddEvent, onAddStudy }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-xl p-6 w-full max-w-md space-y-4 relative pb-20">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900">Add New</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <button onClick={onAddEvent}
          className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Add Event</p>
            <p className="text-xs text-gray-400">Add a quiz, exam, assignment or any important event</p>
          </div>
        </button>
        <button onClick={onAddStudy}
          className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all text-left">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Add Study Session</p>
            <p className="text-xs text-gray-400">Plan a focused study session for any topic</p>
          </div>
        </button>
      </div>
    </div>
  );
}
