'use client';
// Screen 3 — Upload Syllabus
import { useState } from 'react';
import Image from 'next/image';
import { Camera, FileText, Shield, CheckCircle2, Lock } from 'lucide-react';
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
      onNext();
    } catch { setError('Upload failed. Check your connection.'); }
    finally  { setUploading(false); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const UPLOAD_OPTIONS = [
    { icon: Camera,    label: 'Camera',        sub: 'Take a photo of your syllabus',  accept: 'image/*',          capture: 'environment' as const },
    { icon: PhotoIcon, label: 'Photo Library', sub: 'Choose from your photos',        accept: 'image/*',          capture: undefined              },
    { icon: FileText,  label: 'Files',         sub: 'Browse files from device',       accept: '.pdf,.docx,image/*', capture: undefined            },
  ];

  return (
    <Phone>
      <div className="flex flex-col bg-white overflow-y-auto h-screen">

        {/* ── Header row ── */}
        <div className="flex items-start justify-between px-5 ">
          <div className="flex-1 pr-3">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Upload your syllabus</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Take a clear photo or upload a PDF.<br />Multi-page supported.
            </p>
          </div>
         
        </div>

        {/* ── Hero image ── */}
        <div className="relative flex justify-center py-3">
          <span className="absolute top-2 left-10 text-indigo-200 text-sm">✦</span>
          <span className="absolute top-4 right-8 text-purple-200 text-sm">✦</span>
          <Image
            src="https://res.cloudinary.com/mview/image/upload/atlas/addclasspage3.webp"
            alt="Upload illustration"
            width={200}
            height={120}
            className="object-contain"
            priority
          />
        </div>

        {/* ── Drop zone ── */}
        <div className=" mb-3">
          {uploading ? (
            <div className="border-2 border-dashed border-indigo-300 rounded-2xl p-6 text-center bg-indigo-50">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-indigo-600 font-semibold">Uploading...</p>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-indigo-200 rounded-xl p-6 py-12 text-center bg-indigo-50/40 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <FileText className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="text-base font-extrabold text-gray-800 mb-0.5">Drag &amp; drop or tap to upload</p>
              <p className="text-base text-gray-400">PDF, JPG, PNG</p>
              <input type="file" accept=".pdf,.docx,image/jpeg,image/jpg,image/png"
                onChange={handleFileChange} className="hidden" />
            </label>
          )}

          {error && (
            <div className="mt-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-700">
              ❌ {error}
            </div>
          )}
        </div>

        {/* ── Security note ── */}
        {/* <div className="mx-5 mb-3">
          <div className="flex items-center justify-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            <p className="text-xs text-indigo-700 font-medium">Your files are secure and private</p>
          </div>
        </div> */}

        {/* ── Upload options grid ── */}
        <div className=" grid grid-cols-3 gap-3 mb-3">
          {UPLOAD_OPTIONS.map(o => (
            <label key={o.label} className="flex flex-col bg-white border border-indigo-100 rounded-xl px-1 py-3 items-center gap-1 cursor-pointer group">
              <div className="w-12 h-12 bg-indigo-50 group-hover:bg-indigo-100 rounded-2xl flex items-center justify-center transition-all border border-indigo-100">
                <o.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-sm font-bold text-gray-800 text-center">{o.label}</p>
              <p className="text-xs text-gray-400 text-center leading-tight">{o.sub}</p>
              <input type="file" accept={o.accept}
                capture={o.capture}
                onChange={handleFileChange} className="hidden" />
            </label>
          ))}
        </div>

        {/* ── Tips card ── */}
        <div className=" mb-4">
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl px-4 py-3 flex items-start gap-3">
            <Image
              src="https://res.cloudinary.com/mview/image/upload/atlas/addclasspage3_1.webp"
              alt="Tips illustration"
              width={48}
              height={48}
              className="object-contain flex-shrink-0"
            />
            <div>
              <p className="text-xs font-extrabold text-gray-800 mb-1.5">Tips for best results</p>
              {['Use clear, well-lit images', 'Capture all pages', 'PDFs work great too!'].map(t => (
                <div key={t} className="flex items-center gap-1.5 mb-0.5">
                  <CheckCircle2 className="w-3 h-3 text-indigo-600 flex-shrink-0" />
                  <span className="text-[10px] text-gray-600">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Privacy note ── */}
        <div className="flex items-center justify-center gap-1.5 pb-3">
          <Lock className="w-3 h-3 text-gray-400" />
          <p className="text-[10px] text-gray-400">We never share your data with anyone.</p>
        </div>

      </div>
    </Phone>
  );
}
