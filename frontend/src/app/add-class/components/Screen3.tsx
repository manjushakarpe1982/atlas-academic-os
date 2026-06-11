'use client';
// Screen 3 → now Step 2 — Upload Syllabus
// Uploads file to POST /api/classes/{id}/upload then advances
import { useState } from 'react';
import { Camera, FileText } from 'lucide-react';
import { Image as PhotoIcon } from 'lucide-react';
import { Phone } from './shared';
import { API_BASE, getToken } from '@/lib/api';

interface Props {
  onNext:  () => void;
  onBack:  () => void;
  classId: string | null;
}

export default function Screen3({ onNext, onBack, classId }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState('');

  const uploadFile = async (file: File) => {
    if (!classId) { setError('No class ID. Go back and try again.'); return; }
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/api/classes/${classId}/upload`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body:    formData,
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || 'Upload failed'); return; }
      onNext(); // go to parsing screen
    } catch { setError('Upload failed. Check your connection.'); }
    finally { setUploading(false); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <Phone step={2} total={10}>
      <div className="flex flex-col min-h-[480px]">
        <div className="px-6 py-5 flex-1">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Upload your syllabus</h1>
          <p className="text-sm text-gray-400 mb-6">
            Take a clear photo or upload a file. PDF, DOCX, JPG, PNG supported.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm">
              ❌ {error}
            </div>
          )}

          {uploading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-gray-500 font-medium">Uploading...</p>
            </div>
          ) : (
            <>
              {/* Drop zone */}
              <label className="block border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-5 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Tap to upload</p>
                <p className="text-xs text-gray-400">PDF, DOCX, JPG, PNG</p>
                <input
                  type="file"
                  accept=".pdf,.docx,image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Camera / Photo / Files buttons */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Camera,    label: 'Camera',        accept: 'image/*',    capture: 'environment' },
                  { icon: PhotoIcon, label: 'Photo Library', accept: 'image/*',    capture: undefined     },
                  { icon: FileText,  label: 'Files',         accept: '.pdf,.docx,image/*', capture: undefined },
                ].map(o => (
                  <label key={o.label}
                    className="flex flex-col items-center gap-2 border-2 border-gray-200 rounded-2xl p-3 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer">
                    <o.icon className="w-6 h-6 text-indigo-600" />
                    <span className="text-xs font-semibold text-gray-700">{o.label}</span>
                    <input
                      type="file"
                      accept={o.accept}
                      capture={o.capture as 'environment' | undefined}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Phone>
  );
}
