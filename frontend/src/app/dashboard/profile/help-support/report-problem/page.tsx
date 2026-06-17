'use client';
import { useState, useRef } from 'react';
import { Cloud, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import BackHeader from '../../BackHeader';
import Image from 'next/image';

const SEVERITY_OPTIONS = [
  { id: 'low', label: 'Low', color: 'text-green-600 border-green-300 bg-green-50' },
  { id: 'medium', label: 'Medium', color: 'text-yellow-600 border-yellow-300 bg-yellow-50' },
  { id: 'high', label: 'High', color: 'text-red-600 border-red-300 bg-red-50' },
];

export default function ReportProblemPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleScreenshotSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File must be less than 10MB');
      return;
    }

    setScreenshot(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please describe the issue');
      return;
    }

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setDescription('');
      setSeverity('medium');
      handleRemoveScreenshot();
      setTimeout(() => setSent(false), 3000);
    }, 1500);
  };

  return (
    <div className="">
      <BackHeader title="Report a Problem" />

      <div className="px-4 py-3 ">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Image src="https://res.cloudinary.com/mview/image/upload/v1781689309/atlas/supportpage4.png" alt="Report Problem" width={300} height={100} className="mb-2" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Something not working?</h1>
            <p className="text-sm text-gray-600 mt-1">
              Let us know what happened so we can fix it as soon as possible.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {sent && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-green-900">Report submitted!</h3>
              <p className="text-sm text-green-700 mt-1">
                Thank you for reporting. Our team will investigate soon.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Description */}
          <div>
            <label className="text-base font-bold text-gray-800 block mb-2">
              What went wrong?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the issue in detail..."
            
              rows={4}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-indigo-500 bg-white resize-none placeholder:text-gray-400"
            />
            <p className="text-sm text-gray-400 mt-2 text-right">{description.length}/500</p>
          </div>

          {/* Screenshot Upload */}
          <div>
            <label className="text-base font-bold text-gray-800 block mb-2">
              Upload Screenshot <span className="font-normal text-gray-500">(optional)</span>
            </label>
            
            {screenshotPreview ? (
              <div className="relative rounded-xl border-2 border-gray-200 overflow-hidden">
                <img
                  src={screenshotPreview}
                  alt="Screenshot preview"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveScreenshot}
                  className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-xl text-xs font-semibold hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-purple-300 rounded-xl py-10 p-6 flex flex-col items-center justify-center hover:bg-purple-50 transition-all"
              >
                <Cloud className="w-10 h-10 text-purple-400 mb-2" />
                <p className="text-base font-semibold text-purple-600">Tap to upload</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              </button>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleScreenshotSelect}
              className="hidden"
            />
          </div>

          {/* Severity */}
          <div>
            <label className="text-base font-bold text-gray-900 block mb-2">Severity</label>
            <div className="flex gap-2">
              {SEVERITY_OPTIONS.map((sev) => (
                <button
                  key={sev.id}
                  type="button"
                  onClick={() => setSeverity(sev.id)}
                  className={`flex-1 py-2 rounded-xl font-semibold text-[15px] border-2 transition-all ${
                    severity === sev.id
                      ? `${sev.color} border-current`
                      : `${sev.color} border-transparent`
                  }`}
                >
                  {sev.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-indigo-600 text-white text-base font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                Submit Report 🔔
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
