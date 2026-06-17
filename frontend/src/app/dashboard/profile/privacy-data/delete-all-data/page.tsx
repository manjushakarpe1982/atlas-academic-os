'use client';
import { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BackHeader from '../../BackHeader';

export default function DeleteAllDataPage() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return;
    
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setDeleted(true);
      setShowConfirm(false);
      setConfirmText('');
    }, 1500);
  };

  const handleGoBack = () => {
    router.push('/dashboard/profile/privacy-data');
  };

  // Success Screen
  if (deleted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="Delete All Data" />

        <div className="px-4 py-6 flex flex-col items-center justify-center space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>

          {/* Title & Message */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">All set!</h1>
            <p className="text-sm text-gray-600">
              Your data has been deleted successfully.
            </p>
          </div>

          {/* Success Message */}
          <div className="w-full bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-900 font-medium">
              All your data has been deleted
            </p>
          </div>

          {/* Info Text */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Your account is still active. You can continue using Atlas.
            </p>
          </div>

          {/* Go Back Button */}
          <button
            onClick={handleGoBack}
            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-2xl hover:bg-indigo-700 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // Main Delete All Data Page + Modal Overlay
  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Delete All Data" />

      <div className="px-4 py-6 space-y-6">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">💾</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Delete All Data</h1>
            <p className="text-sm text-gray-600 mt-2">
              This will permanently delete all your data from Atlas. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* What will be removed */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3">This will remove:</h2>
          <div className="space-y-2">
            {[
              'All classes and syllabus',
              'All grades and progress',
              'All calendar events',
              'All study plans and notes',
              'All uploaded files',
              'All app preferences',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl p-3">
                <div className="w-5 h-5 rounded-full bg-red-600 flex-shrink-0"></div>
                <p className="text-sm font-medium text-gray-900">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-900 leading-relaxed">
            This action cannot be undone. Make sure you have exported any important data you want to keep.
          </p>
        </div>

        {/* Delete Everything Button */}
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full bg-red-600 text-white font-bold py-3.5 rounded-2xl hover:bg-red-700 transition-all"
        >
          Delete Everything
        </button>
      </div>

      {/* Confirmation Modal Overlay */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 max-w-sm w-full space-y-4 text-center animate-in fade-in">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">💾</span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="font-bold text-gray-900 text-lg">Delete all your data?</h2>
              <p className="text-sm text-gray-600">
                This will permanently delete everything from your account. This action cannot be undone.
              </p>
            </div>

            {/* Confirmation Input */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600 font-medium">Type DELETE to confirm</p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder="Type DELETE"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-center font-bold text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={confirmText !== 'DELETE' || deleting}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? 'Deleting...' : 'Yes, Delete Everything'}
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => {
                setShowConfirm(false);
                setConfirmText('');
              }}
              className="w-full bg-gray-200 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
