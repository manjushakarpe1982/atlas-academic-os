'use client';
import { useState } from 'react';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';
import BackHeader from '../../BackHeader';

const EXPORT_ITEMS = [
  { icon: '👤', label: 'Profile Info', description: 'Your name and profile data' },
  { icon: '📚', label: 'Classes & Grades', description: 'All your classes and grades' },
  { icon: '📅', label: 'Calendar Events', description: 'Calendar and deadlines' },
  { icon: '📝', label: 'Study Plans', description: 'Your personalized study plans' },
  { icon: '⬆️', label: 'Uploaded Files', description: 'All your syllabus files' },
];

export default function ExportDataPage() {
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Export My Data" />

      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <Download className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Export Your Data</h1>
            <p className="text-sm text-gray-600 mt-2">
              Download a copy of all your data from Atlas.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {exported && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-green-900">Export ready!</h3>
              <p className="text-sm text-green-700 mt-1">
                Your data export has been downloaded.
              </p>
            </div>
          </div>
        )}

        {/* What's Included */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3">This will include:</h2>
          <div className="space-y-2">
            {EXPORT_ITEMS.map((item) => (
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

        {/* Format Selection */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3">Format:</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedFormat('json')}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm border-2 transition-all ${
                selectedFormat === 'json'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              JSON
            </button>
            <button
              onClick={() => setSelectedFormat('csv')}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm border-2 transition-all ${
                selectedFormat === 'csv'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              CSV
            </button>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {exporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Export Data
            </>
          )}
        </button>

        {/* Info */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex gap-3">
          <div className="text-sm text-blue-900 leading-relaxed">
            <p className="font-semibold mb-2">💡 Your data will be available for 7 days.</p>
            <p>You can download it anytime during this period.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
