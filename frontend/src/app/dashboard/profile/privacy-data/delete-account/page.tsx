'use client';
import { useState } from 'react';
import { AlertTriangle, Loader2, CheckCircle2, User } from 'lucide-react';
import BackHeader from '../../BackHeader';

const DELETE_ITEMS = [
  { icon: '👤', label: 'Profile Data', description: 'All your personal information' },
  { icon: '📚', label: 'All Classes & Grades', description: 'All courses and grades' },
  { icon: '📅', label: 'Calendar Events', description: 'Your calendar and deadlines' },
  { icon: '⬆️', label: 'All Uploaded Files', description: 'All syllabus files' },
  { icon: '📊', label: 'Study Plans', description: 'Personalized study plans' },
];

export default function DeleteAccountPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setDeleted(true);
      setShowConfirm(false);
      setTimeout(() => {
        // In real app, redirect to login
      }, 2000);
    }, 1500);
  };

  if (showConfirm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="Delete Account" />

        <div className="px-4 py-6 flex items-center justify-center min-h-[500px]">
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-red-600" />
            </div>

            <div>
              <h2 className="font-bold text-gray-900 text-lg">Delete your account?</h2>
              <p className="text-sm text-gray-600 mt-2">
                This action is permanent and all of your data will be deleted forever. You cannot undo this.
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-900">
                ⚠️ Deleting your account will permanently erase all data. This action cannot be undone.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" /> Yes, Delete Account
                  </>
                )}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full bg-gray-200 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (deleted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="Delete Account" />

        <div className="px-4 py-6 flex items-center justify-center min-h-[500px]">
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>

            <div>
              <h2 className="font-bold text-gray-900 text-lg">All set!</h2>
              <p className="text-sm text-gray-600 mt-2">
                Your data has been deleted successfully. You will be logged out.
              </p>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-900">
                <CheckCircle2 className="w-4 h-4" />
                <span>Your account has been deleted</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-900">
                <CheckCircle2 className="w-4 h-4" />
                <span>All your data has been erased</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-900">
                <CheckCircle2 className="w-4 h-4" />
                <span>You are now logged out</span>
              </div>
            </div>

            <button
              onClick={() => {}}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Delete Account" />

      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Delete Account Permanently</h1>
            <p className="text-sm text-gray-600 mt-2">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* What will be deleted */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3">This will delete:</h2>
          <div className="space-y-2">
            {DELETE_ITEMS.map((item) => (
              <div key={item.label} className="flex items-start gap-3 bg-white rounded-xl border-2 border-gray-200 p-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-900 leading-relaxed">
            ⚠️ This action cannot be undone. Make sure you have exported your data before deleting your account.
          </p>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full bg-red-600 text-white font-bold py-3.5 rounded-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
        >
          <AlertTriangle className="w-4 h-4" /> Yes, Delete Account
        </button>
      </div>
    </div>
  );
}
