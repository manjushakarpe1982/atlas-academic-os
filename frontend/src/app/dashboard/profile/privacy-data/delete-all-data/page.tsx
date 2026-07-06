'use client';
import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import BackHeader from '../../BackHeader';
import Image from 'next/image';
import { api } from '@/lib/api';

export default function DeleteAllDataPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return;
    setDeleting(true);
    setError('');
    try {
      await api('/api/profile/delete-all-data', { method: 'DELETE' });
      setDeleted(true);
      setShowConfirm(false);
      setConfirmText('');
    } catch (e: any) {
      setError(e.message || 'Failed to delete data');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="">
      <BackHeader title="Delete All Data" />

      {/* Success Popup */}
      {deleted && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setDeleted(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-50 p-6 w-[85%] max-w-sm shadow-xl"
            style={{ animation: 'popIn 0.3s ease-out' }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1">All Data Deleted!</h3>
              <p className="text-sm text-gray-500 mb-1">Your data has been permanently deleted.</p>
              <p className="text-xs text-gray-400 mb-4">Your account is still active. You can continue using Atlas.</p>
              <button onClick={() => setDeleted(false)}
                className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-indigo-700">
                OK
              </button>
            </div>
          </div>
          <style jsx>{`@keyframes popIn { from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }`}</style>
        </>
      )}

      <div className="px-4 py-4 space-y-6">
        <div className="flex flex-col items-center text-center">
          <Image
            src="https://res.cloudinary.com/mview/image/upload/v1781776004/atlas/deletealldatapage.png"
            alt="Delete All Data"
            width={300}
            height={200}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Delete All Data</h1>
            <p className="text-sm text-gray-600 mt-2">
              This will permanently delete all your data from Atlas. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="space-y-1 bg-white border border-red-200 rounded-lg p-3">
          <h2 className="font-bold text-gray-900 mb-3">This will remove:</h2>
          {[
            'All classes and syllabus',
            'All grades and progress',
            'All calendar events',
            'All study plans and notes',
            'All uploaded files',
            'All app preferences',
          ].map((item) => (
            <div key={item} className="flex items-center gap-1 p-1">
              <CheckCircle2 className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm font-medium text-gray-900">{item}</p>
            </div>
          ))}
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-900 leading-relaxed">
            This action cannot be undone. Make sure you have exported any important data you want to keep.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 font-medium">{error}</div>
        )}

        <button
          onClick={() => setShowConfirm(true)}
          className="w-full bg-red-600 text-white font-bold py-3.5 rounded-2xl hover:bg-red-700 transition-all"
        >
          Delete Everything
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 max-w-sm w-full space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">💾</span>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="font-bold text-gray-900 text-lg">Delete all your data?</h2>
              <p className="text-sm text-gray-600">
                This will permanently delete everything from your account. This action cannot be undone.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 font-medium">Type DELETE to confirm</p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder="Type DELETE"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-center font-bold text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={handleDelete}
              disabled={confirmText !== 'DELETE' || deleting}
              className="w-full bg-red-600 text-white font-bold py-2.5 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : 'Yes, Delete Everything'}
            </button>
            <button
              onClick={() => { setShowConfirm(false); setConfirmText(''); }}
              className="w-full bg-gray-200 text-gray-900 font-bold py-2.5 rounded-xl hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
