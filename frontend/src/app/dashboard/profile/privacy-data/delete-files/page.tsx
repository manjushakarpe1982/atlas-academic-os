'use client';
import { useState } from 'react';
import { Trash2, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import BackHeader from '../../BackHeader';

const DELETE_ITEMS = [
  { icon: '📄', label: 'PDF Files', description: 'All uploaded PDF files' },
  { icon: '📷', label: 'Screenshots', description: 'Screenshot images' },
  { icon: '📊', label: 'Documents', description: 'Document files' },
  { icon: '❌', label: 'Other Files', description: 'Any other file types' },
];

export default function DeleteFilesPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setDeleted(true);
      setShowConfirm(false);
      setTimeout(() => setDeleted(false), 3000);
    }, 1500);
  };

  if (showConfirm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="Delete Uploaded Files" />

        <div className="px-4 py-6 flex items-center justify-center min-h-[500px]">
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-8 h-8 text-orange-600" />
            </div>

            <div>
              <h2 className="font-bold text-gray-900 text-lg">Delete uploaded files?</h2>
              <p className="text-sm text-gray-600 mt-2">
                This action cannot be undone. Make sure you have backed up any important files.
              </p>
            </div>

            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-3">
              <p className="text-sm text-orange-900">
                ⚠️ This action cannot be undone. Make sure you have backed up any important files.
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
                    <Trash2 className="w-4 h-4" /> Yes, Delete Files
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

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Delete Uploaded Files" />

      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Delete Uploaded Files</h1>
            <p className="text-sm text-gray-600 mt-2">
              Permanently delete all your uploaded files.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {deleted && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-green-900">Files deleted!</h3>
              <p className="text-sm text-green-700 mt-1">
                All your uploaded files have been permanently deleted.
              </p>
            </div>
          </div>
        )}

        {/* What will be deleted */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3">This includes:</h2>
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
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-orange-900 leading-relaxed">
            This action cannot be undone. Make sure you have backed up any important files.
          </p>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full bg-red-600 text-white font-bold py-3.5 rounded-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" /> Delete Files
        </button>
      </div>
    </div>
  );
}
