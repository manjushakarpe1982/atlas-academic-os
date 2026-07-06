'use client';
import { useState, useRef } from 'react';
import { ArrowLeft, Camera, Info, Loader2, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { API_BASE, getToken } from '@/lib/api';

interface Grade { name: string; score: number | null; total: number | null; category: string; }
interface Props { classId: string; onBack: () => void; onSaved: () => void; }

export default function TakePhotoForm({ classId, onBack, onSaved }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const scanGrade = async () => {
    if (!preview) return;
    setScanning(true); setError('');
    try {
      const base64 = preview.split(',')[1];
      const mediaType = preview.split(';')[0].split(':')[1] || 'image/jpeg';
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/classes/grades/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ image: base64, media_type: mediaType, class_id: classId }),
      });
      const data = await res.json();
      if (data.success && data.grades?.length) {
        setGrades(data.grades);
        setSelected(new Set(data.grades.map((_: any, i: number) => i)));
      } else { setError('Could not read any grades from image'); }
    } catch { setError('Something went wrong'); }
    finally { setScanning(false); }
  };

  const toggleSelect = (i: number) => {
    setSelected(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });
  };

  const saveGrades = async () => {
    setSaving(true);
    try {
      const token = getToken();
      const batch = [...selected].map(i => {
        const g = grades[i];
        return { title: g.name || 'Scanned Grade', score: g.score, max_score: g.total, category: g.category || 'other' };
      });
      await fetch(`${API_BASE}/api/classes/${classId}/grades/add-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ grades: batch }),
      });
      onSaved();
    } catch { setError('Failed to save'); }
    finally { setSaving(false); }
  };

  const reset = () => { setPreview(null); setGrades([]); setError(''); setSelected(new Set()); };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
        <button onClick={onBack}><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
        <h2 className="text-base font-extrabold text-gray-900">Scan Grade</h2>
      </div>
      <div className="px-5 py-6 space-y-5">
        {grades.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-3">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900">{grades.length} Grade{grades.length > 1 ? 's' : ''} Detected!</h3>
              <p className="text-sm text-gray-400 mt-1">Select which to save</p>
            </div>
            {preview && <img src={preview} alt="Scanned" className="w-full rounded-xl border border-gray-200 max-h-32 object-contain bg-gray-50" />}
            <div className="space-y-2">
              {grades.map((g, i) => (
                <div key={i} onClick={() => toggleSelect(i)}
                  className={`border-2 rounded-xl p-3 cursor-pointer transition-all flex items-center gap-3 ${selected.has(i) ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-200'}`}>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${selected.has(i) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                    {selected.has(i) && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{g.name || 'Untitled'}</p>
                    <p className="text-xs text-gray-500 capitalize">{g.category || 'other'}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-extrabold text-gray-900">{g.score ?? '—'}/{g.total ?? '—'}</p>
                    <p className="text-xs font-bold text-indigo-600">
                      {g.score != null && g.total ? `${Math.round((g.score / g.total) * 100)}%` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /><p className="text-xs text-red-700">{error}</p></div>}
            <div className="flex gap-2">
              <button onClick={reset} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm">
                <RotateCcw className="w-4 h-4" /> Retry
              </button>
              <button onClick={saveGrades} disabled={saving || selected.size === 0}
                className="flex-1 bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {saving ? 'Saving...' : `Save ${selected.size} Grade${selected.size > 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        ) : preview ? (
          <div className="space-y-4">
            <img src={preview} alt="Preview" className="w-full rounded-xl border border-gray-200 max-h-52 object-contain bg-gray-50" />
            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /><p className="text-xs text-red-700">{error}</p></div>}
            <div className="flex gap-2">
              <button onClick={reset} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-all text-sm">Retake</button>
              <button onClick={scanGrade} disabled={scanning}
                className="flex-1 bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                {scanning ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning...</> : '🤖 Scan with AI'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleCapture} className="hidden" />
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-indigo-300 rounded-2xl py-12 flex flex-col items-center justify-center gap-4 hover:bg-indigo-50 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center"><Camera className="w-8 h-8 text-indigo-600" /></div>
              <div className="text-center px-6">
                <p className="text-lg font-extrabold text-gray-900">Scan Grade</p>
                <p className="text-sm text-gray-400 mt-1.5">Take a photo of your graded assignment, quiz or exam.</p>
              </div>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0"><Info className="w-4 h-4 text-indigo-600" /></div>
              <p className="text-xs text-gray-600 leading-relaxed pt-1">Atlas AI will detect your score and update your grade automatically.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
