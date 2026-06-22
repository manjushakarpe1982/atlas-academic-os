'use client';
import { useState, useEffect } from 'react';
import { ChevronRight, AlertCircle, Trash2, X, CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BackHeader from '../../BackHeader';
import Image from 'next/image';
import { api, API_BASE, getToken } from '@/lib/api';

// ── Types ──
interface ClassData {
  id: string;
  name: string;
  instructor: string | null;
  term: string | null;
  updated_at: string;
}

// ── Icon / color helpers ──
const CLASS_STYLES: { pattern: RegExp; icon: string; color: string }[] = [
  { pattern: /math|calculus|algebra|geometry/i, icon: '📐', color: 'text-indigo-600 bg-indigo-100' },
  { pattern: /bio|anatomy|genetics/i,          icon: '🧬', color: 'text-green-600 bg-green-100' },
  { pattern: /chem/i,                          icon: '⚗️', color: 'text-orange-600 bg-orange-100' },
  { pattern: /phys/i,                          icon: '⚛️', color: 'text-blue-600 bg-blue-100' },
  { pattern: /eng|english|lit|writing/i,       icon: '📖', color: 'text-pink-600 bg-pink-100' },
  { pattern: /hist|history/i,                  icon: '📜', color: 'text-amber-600 bg-amber-100' },
  { pattern: /comp|cs|programming|code/i,      icon: '💻', color: 'text-purple-600 bg-purple-100' },
  { pattern: /art|music|design/i,              icon: '🎨', color: 'text-rose-600 bg-rose-100' },
];

function getClassStyle(name: string) {
  const match = CLASS_STYLES.find((s) => s.pattern.test(name));
  return match || { icon: '📖', color: 'text-gray-600 bg-gray-100' };
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch { return iso; }
}

const DELETE_ITEMS = [
  'Syllabus and class notes',
  'Grades and grade history',
  'Exams and assignments',
  'Study plan and progress',
  'Notes and uploaded files',
];

export default function DeleteClassDataPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deletedClassName, setDeletedClassName] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // ── Fetch classes on mount ──
  useEffect(() => {
    api<{ classes: ClassData[] }>('/api/classes')
      .then((data) => setClasses(data.classes || []))
      .catch((e) => setFetchError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId);
    setShowConfirm(true);
    setDeleteError('');
  };

  // ── Delete class via API ──
  const handleDelete = async () => {
    if (!selectedClassId) return;
    setDeleting(true);
    setDeleteError('');

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/classes/${selectedClassId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const err = await response.json();
        setDeleteError(err.detail || 'Failed to delete class');
        setDeleting(false);
        return;
      }

      // Success — remove from local list
      setDeletedClassName(selectedClass?.name || 'Class');
      setClasses(classes.filter((c) => c.id !== selectedClassId));
      setDeleted(true);
      setShowConfirm(false);
    } catch (e) {
      setDeleteError('Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // ── Success Screen ──
  if (deleted) {
    return (
      <div className="">
        <BackHeader title="Delete Class Data" />

        <div className="px-4 py-6 flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Class data deleted!</h1>
            <p className="text-sm text-gray-600">
              All data for {deletedClassName} has been permanently deleted.
            </p>
          </div>

          <div className="w-full bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-900 font-medium">
              {deletedClassName} and all associated data has been deleted
            </p>
          </div>

          {/* Back / Delete Another */}
          <div className="w-full space-y-3">
            {classes.length > 0 && (
              <button
                onClick={() => { setDeleted(false); setSelectedClassId(null); }}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all"
              >
                Delete Another Class
              </button>
            )}
            <button
              onClick={() => router.push('/dashboard/profile/privacy-data')}
              className="w-full border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition-all"
            >
              Back to Privacy & Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Page ──
  return (
    <div className="">
      <BackHeader title="Delete Class Data" />

      <div className="px-4 py-4 space-y-4">
        <Image
          src="https://res.cloudinary.com/mview/image/upload/v1781775690/atlas/classdetelepage.png"
          alt="Delete Class Data"
          width={400}
          height={400}
          className=""
        />
        <p className="text-lg text-center text-gray-700 font-semibold">Choose a class to delete its data.</p>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Loading classes...</span>
          </div>
        )}

        {/* Fetch Error */}
        {!loading && fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-900">Failed to load classes</p>
              <p className="text-xs text-red-700 mt-1">{fetchError}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !fetchError && classes.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500 font-medium">No classes found</p>
            <p className="text-xs text-gray-400 mt-1">Add a class first to manage class data.</p>
          </div>
        )}

        {/* Classes List */}
        {!loading && !fetchError && classes.length > 0 && (
          <div className="space-y-2">
            {classes.map((cls) => {
              const style = getClassStyle(cls.name);
              return (
                <button
                  key={cls.id}
                  onClick={() => handleSelectClass(cls.id)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 hover:border-indigo-300 transition-all flex items-center gap-4 group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${style.color}`}>
                    <div className="text-lg">{style.icon}</div>
                  </div>

                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {cls.name}
                    </h3>
                    {cls.term && (
                      <p className="text-xs text-gray-600 mt-0.5">{cls.term}</p>
                    )}
                    {cls.instructor && (
                      <p className="text-xs text-gray-500 mt-1">{cls.instructor}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Last updated: {formatDate(cls.updated_at)}</p>
                  </div>

                  <ChevronRight className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-indigo-600 transition-colors" />
                </button>
              );
            })}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3 mt-6">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-orange-900 leading-relaxed">
            This will delete all data of the selected class, including grades, notes, assignments, and files.
          </p>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      {showConfirm && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 max-w-sm w-full space-y-4 relative">
            {/* Close */}
            <button
              onClick={() => { setShowConfirm(false); setSelectedClassId(null); setDeleteError(''); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h2 className="font-bold text-gray-900 text-lg">Delete {selectedClass.name}?</h2>
              <p className="text-sm text-gray-600">
                This will permanently delete all data related to this class.
              </p>
            </div>

            {/* What will be deleted */}
            <div className="space-y-3 bg-orange-50 border border-orange-200 rounded-xl p-4">
              {DELETE_ITEMS.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            {/* Delete Error */}
            {deleteError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{deleteError}</p>
              </div>
            )}

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full bg-red-600 text-white font-bold py-2.5 rounded-lg hover:bg-red-700 transition-all disabled:opacity-70 mt-4 flex items-center justify-center gap-2"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                </>
              ) : (
                'Delete Class'
              )}
            </button>

            {/* Cancel */}
            <button
              onClick={() => { setShowConfirm(false); setSelectedClassId(null); setDeleteError(''); }}
              className="w-full bg-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
