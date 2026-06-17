'use client';
import { useState } from 'react';
import { Download, ChevronRight, Globe, Check, FileText, Archive, Code, CheckCircle2, Eye, FileIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BackHeader from '../../BackHeader';

interface ClassOption {
  id: string;
  name: string;
  code: string;
  type: string;
  professor: string;
  icon: string;
}

const CLASSES: ClassOption[] = [
  {
    id: 'math-251',
    name: 'Mathematics 251',
    code: 'MATH 251',
    type: 'Engineering Math II',
    professor: 'Prof. John Smith',
    icon: '📐',
  },
  {
    id: 'bio-1107',
    name: 'Biology 1107',
    code: 'BIO 1107',
    type: 'General Biology',
    professor: 'Prof. Sarah Johnson',
    icon: '🧬',
  },
  {
    id: 'chem-101',
    name: 'Chemistry 101',
    code: 'CHEM 101',
    type: 'Intro to Chemistry',
    professor: 'Prof. Michael Brown',
    icon: '⚗️',
  },
  {
    id: 'phys-201',
    name: 'Physics 201',
    code: 'PHYS 201',
    type: 'Mechanics',
    professor: 'Prof. David Wilson',
    icon: '⚛️',
  },
];

interface ExportOption {
  id: string;
  label: string;
  icon: string;
}

const EXPORT_ITEMS: ExportOption[] = [
  { id: 'course-info', label: 'Course Information', icon: '📋' },
  { id: 'grades', label: 'Grades', icon: '📊' },
  { id: 'assignments', label: 'Assignments', icon: '✓' },
  { id: 'dates', label: 'Important Dates', icon: '📅' },
  { id: 'study-plan', label: 'Study Plan', icon: '⚡' },
  { id: 'notes', label: 'Notes', icon: '📝' },
];

const FORMAT_OPTIONS = [
  { id: 'pdf', label: 'PDF', icon: <FileText className="w-5 h-5" /> },
  { id: 'zip', label: 'ZIP', icon: <Archive className="w-5 h-5" /> },
  { id: 'json', label: 'JSON', icon: <Code className="w-5 h-5" /> },
];

export default function ExportDataPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState('math-251');
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([
    'course-info',
    'grades',
    'assignments',
    'dates',
    'study-plan',
    'notes',
  ]);
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const selectedClassName = CLASSES.find((c) => c.id === selectedClass);
  const formatLabel = FORMAT_OPTIONS.find((f) => f.id === selectedFormat)?.label || 'PDF';

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getFileIcon = () => {
    switch (selectedFormat) {
      case 'zip':
        return '📦';
      case 'json':
        return '📄';
      default:
        return '📄';
    }
  };

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2) {
      setStep(3);
      window.scrollTo(0, 0);
    }
  };

  const handleDone = () => {
    router.push('/dashboard/profile/privacy-data');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Export Data" />

      <div className="px-4 py-6 space-y-6">
        {/* Progress Indicator */}
        {step < 3 && (
          <div className="flex items-center justify-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-8 h-1 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
          </div>
        )}

        {/* STEP 1: Select Class */}
        {step === 1 ? (
          <div className="space-y-6">
            {/* Illustration */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                <Download className="w-10 h-10 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">What would you like to export?</h1>
                <p className="text-sm text-gray-600 mt-2">
                  Choose the class or data you want to export from Atlas.
                </p>
              </div>
            </div>

            {/* All Classes Option */}
            <div className="space-y-4">
              <h2 className="font-bold text-gray-900">Export From</h2>
              <button
                onClick={() => setSelectedClass('all')}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  selectedClass === 'all'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-900">All Classes</p>
                    <p className="text-xs text-gray-600">Export everything from all your classes</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedClass === 'all'
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-gray-300'
                }`}>
                  {selectedClass === 'all' && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>

              {/* Your Classes */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Your Classes</h3>
                <div className="space-y-2">
                  {CLASSES.map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => setSelectedClass(cls.id)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                        selectedClass === cls.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3 text-left flex-1">
                        <span className="text-2xl">{cls.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{cls.name}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{cls.type}</p>
                          <p className="text-xs text-gray-500 mt-1">{cls.professor}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedClass === cls.id
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedClass === cls.id && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : step === 2 ? (
          /* STEP 2: Select Items & Format */
          <div className="space-y-6">
            {/* Selected Class Card */}
            <div className="bg-white border-2 border-indigo-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  {selectedClassName?.icon}
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-gray-900">{selectedClassName?.name}</h2>
                  <p className="text-sm text-gray-600 mt-0.5">{selectedClassName?.type}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedClassName?.professor}</p>
                </div>
              </div>
              <button 
                onClick={() => setStep(1)}
                className="mt-3 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors flex items-center gap-1"
              >
                Change Class <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* What to Include */}
            <div className="space-y-3">
              <div>
                <h2 className="font-bold text-gray-900 mb-3">What do you want to include?</h2>
                <p className="text-sm text-gray-600 mb-3">Select the data you want to export.</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {EXPORT_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`p-4 rounded-2xl border-2 transition-all text-left flex items-start gap-3 ${
                      selectedItems.includes(item.id)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedItems.includes(item.id)
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedItems.includes(item.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Export Format */}
            <div className="space-y-3">
              <div>
                <h2 className="font-bold text-gray-900 mb-1">Export Format</h2>
                <p className="text-sm text-gray-600">Choose the file format for your export.</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {FORMAT_OPTIONS.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                      selectedFormat === format.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={selectedFormat === format.id ? 'text-indigo-600' : 'text-gray-600'}>
                      {format.icon}
                    </div>
                    <p className="text-xs font-semibold text-gray-900">{format.label}</p>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedFormat === format.id
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedFormat === format.id && (
                        <Check className="w-2.5 h-2.5 text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* STEP 3: Export Success */
          <div className="space-y-6">
            {/* Success Checkmark */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Export Ready!</h1>
                <p className="text-sm text-gray-600 mt-2">
                  Your data has been exported successfully.
                </p>
              </div>
            </div>

            {/* File Card */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📄</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">
                    {selectedClassName?.name.replace(/\s+/g, '')}_Export.{selectedFormat}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Created just now • {formatLabel}</p>
                  <p className="text-xs text-gray-500 mt-1">2.4 MB</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button className="flex-1 border-2 border-indigo-200 text-indigo-600 font-bold py-2.5 rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" /> Preview
                </button>
                <button className="flex-1 bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4">
              <h3 className="font-bold text-gray-900 mb-2">What's next?</h3>
              <p className="text-sm text-gray-600 mb-3">
                You can also find this export in Recent Exports.
              </p>
              <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors flex items-center gap-1">
                View Recent Exports <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Continue/Done Button */}
        <button
          onClick={step === 3 ? handleDone : handleContinue}
          className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          {step === 3 ? 'Done' : <>Continue <ChevronRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
}
