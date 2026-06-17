'use client';
import { useState } from 'react';
import { ChevronRight, AlertCircle, Trash2, X, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BackHeader from '../../BackHeader';

interface ClassData {
  id: string;
  name: string;
  code: string;
  professor: string;
  lastUpdated: string;
  icon: string;
  color: string;
}

const CLASSES: ClassData[] = [
  {
    id: 'math-251',
    name: 'Mathematics 251',
    code: 'MATH 251',
    professor: 'Prof. John Smith',
    lastUpdated: 'May 16, 2024',
    icon: '📐',
    color: 'text-indigo-600 bg-indigo-100',
  },
  {
    id: 'bio-1107',
    name: 'Biology 1107',
    code: 'BIO 1107',
    professor: 'Prof. Sarah Johnson',
    lastUpdated: 'May 15, 2024',
    icon: '🧬',
    color: 'text-green-600 bg-green-100',
  },
  {
    id: 'chem-101',
    name: 'Chemistry 101',
    code: 'CHEM 101',
    professor: 'Prof. Michael Brown',
    lastUpdated: 'May 14, 2024',
    icon: '⚗️',
    color: 'text-orange-600 bg-orange-100',
  },
  {
    id: 'phys-201',
    name: 'Physics 201',
    code: 'PHYS 201',
    professor: 'Prof. David Wilson',
    lastUpdated: 'May 12, 2024',
    icon: '⚛️',
    color: 'text-blue-600 bg-blue-100',
  },
  {
    id: 'eng-201',
    name: 'English 201',
    code: 'ENG 201',
    professor: 'Prof. Emily Davis',
    lastUpdated: 'May 10, 2024',
    icon: '📖',
    color: 'text-pink-600 bg-pink-100',
  },
];

const DELETE_ITEMS = [
  'Syllabus and class notes',
  'Grades and grade history',
  'Exams and assignments',
  'Study plan and progress',
  'Notes and uploaded files',
];

export default function DeleteClassDataPage() {
  const router = useRouter();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const selectedClass = CLASSES.find((c) => c.id === selectedClassId);

  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setDeleted(true);
      setShowConfirm(false);
      setTimeout(() => {
        setDeleted(false);
        setSelectedClassId(null);
      }, 2000);
    }, 1500);
  };

  // Success Screen
  if (deleted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="Delete Class Data" />

        <div className="px-4 py-6 flex flex-col items-center justify-center space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>

          {/* Title & Message */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Class data deleted!</h1>
            <p className="text-sm text-gray-600">
              All data for {selectedClass?.name} has been permanently deleted.
            </p>
          </div>

          {/* Success Message */}
          <div className="w-full bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-900 font-medium">
              {selectedClass?.name} data has been deleted
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Delete Class Data Page + Modal Overlay
  return (
    <div className="">
      <BackHeader title="Delete Class Data" />

      <div className="px-4 py-6 space-y-4">
        {/* Subtitle */}
        <p className="text-lg text-gray-700 font-semibold">Choose a class to delete its data.</p>

        {/* Classes List */}
        <div className="space-y-2">
          {CLASSES.map((cls) => (
            <button
              key={cls.id}
              onClick={() => handleSelectClass(cls.id)}
              className="w-full bg-white border border-gray-200 rounded-lg p-3 hover:border-indigo-300 transition-all flex items-center gap-4 group"
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full flex items-center  justify-center flex-shrink-0 ${cls.color}`}>
              <div className="text-lg">{cls.icon}</div>
                </div>

              {/* Class Info */}
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {cls.name}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">{cls.code}</p>
                <p className="text-xs text-gray-500 mt-1">{cls.professor}</p>
                <p className="text-xs text-gray-400 mt-1">Last updated: {cls.lastUpdated}</p>
              </div>

              {/* Chevron */}
              <ChevronRight className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-indigo-600 transition-colors" />
            </button>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3 mt-6">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-orange-900 leading-relaxed">
            This will delete all data of the selected class, including grades, notes, assignments, and files.
          </p>
        </div>
      </div>

      {/* Confirmation Modal Overlay */}
      {showConfirm && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 max-w-sm w-full space-y-4 animate-in fade-in relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowConfirm(false);
                setSelectedClassId(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Icon */}
            <div className="flex justify-center ">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="text-center space-y-2">
              <h2 className="font-bold text-gray-900 text-lg">Delete {selectedClass.name}?</h2>
              <p className="text-sm text-gray-600">
                This will permanently delete all data related to this class.
              </p>
            </div>

            {/* What will be deleted */}
            <div className="space-y-3 bg-orange-50 border border-orange-200 rounded-xl p-4">
    {DELETE_ITEMS.map((item) => (
      <div key={item} className="flex  items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
        <span className="text-sm text-gray-700">{item}</span>
      </div>
    ))}
  </div>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full bg-red-600 text-white font-bold py-2.5 rounded-lg hover:bg-red-700 transition-all disabled:opacity-70 mt-4"
            >
              {deleting ? 'Deleting...' : 'Delete Class'}
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => {
                setShowConfirm(false);
                setSelectedClassId(null);
              }}
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
