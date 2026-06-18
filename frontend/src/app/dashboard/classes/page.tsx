'use client';
import { useRouter } from 'next/navigation';
import { ChevronRight, BookOpen } from 'lucide-react';

interface Class {
  id: string;
  name: string;
  code: string;
  professor: string;
  semester: string;
  credits: number;
  color: string;
  icon: string;
}

// Sample class data
const CLASSES: Class[] = [
  {
    id: 'math251',
    name: 'Calculus II',
    code: 'MATH 251',
    professor: 'Dr. Sarah Johnson',
    semester: 'Fall 2024',
    credits: 4,
    color: 'bg-blue-50',
    icon: '📐',
  },
  {
    id: 'bio1107',
    name: 'Biology I',
    code: 'BIO 1107',
    professor: 'Dr. Michael Chen',
    semester: 'Fall 2024',
    credits: 4,
    color: 'bg-green-50',
    icon: '🧬',
  },
  {
    id: 'chem101',
    name: 'General Chemistry',
    code: 'CHEM 101',
    professor: 'Dr. Emily Rodriguez',
    semester: 'Fall 2024',
    credits: 4,
    color: 'bg-purple-50',
    icon: '⚗️',
  },
  {
    id: 'phys201',
    name: 'Physics I',
    code: 'PHYS 201',
    professor: 'Dr. James Wilson',
    semester: 'Fall 2024',
    credits: 4,
    color: 'bg-orange-50',
    icon: '⚛️',
  },
  {
    id: 'english101',
    name: 'English Composition',
    code: 'ENG 101',
    professor: 'Dr. Jessica Miller',
    semester: 'Fall 2024',
    credits: 3,
    color: 'bg-pink-50',
    icon: '📚',
  },
];

export default function ClassesPage() {
  const router = useRouter();

  const handleClassClick = (classId: string) => {
    router.push(`/dashboard/classes/${classId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-gray-900">My Classes</h1>
        <p className="text-sm text-gray-600 mt-1">{CLASSES.length} classes this semester</p>
      </div>

      {/* Classes List */}
      <div className="px-4 py-6 space-y-3">
        {CLASSES.map((classItem) => (
          <button
            key={classItem.id}
            onClick={() => handleClassClick(classItem.id)}
            className={`w-full ${classItem.color} border-2 border-gray-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all text-left`}
          >
            <div className="flex items-start justify-between">
              {/* Left Section - Class Info */}
              <div className="flex items-start gap-4 flex-1">
                {/* Icon */}
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-200">
                  <span className="text-2xl">{classItem.icon}</span>
                </div>

                {/* Class Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    {classItem.code}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    {classItem.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                    <span>👨‍🏫 {classItem.professor}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs bg-white px-2 py-1 rounded-full border border-gray-200">
                      {classItem.semester}
                    </span>
                    <span className="text-xs bg-white px-2 py-1 rounded-full border border-gray-200">
                      {classItem.credits} Credits
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Section - Chevron */}
              <div className="flex items-center justify-center w-6 h-6 flex-shrink-0 ml-2">
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Empty State (if no classes) */}
      {CLASSES.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-lg font-bold text-gray-900 mb-2">No Classes Yet</p>
          <p className="text-sm text-gray-600 text-center">
            Add your first class to get started with Atlas
          </p>
        </div>
      )}
    </div>
  );
}
