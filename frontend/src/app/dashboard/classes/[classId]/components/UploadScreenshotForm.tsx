'use client';
import { useState, useRef } from 'react';
import { ArrowLeft, Upload, Info, Loader2, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { API_BASE, getToken } from '@/lib/api';

interface Grade { name: string; score: number | null; total: number | null; category: string; }
interface Props { classId: string; onBack: () => void; onSaved: () => void; }

export default function UploadScreenshotForm({ classId, onBack, onSaved }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [scanning, setScanning] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
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
      } else { setError('Could not read any grades from file'); }
    } catch { setError('Something went wrong'); }
    finally { setScanning(false); }
  };

  const toggleSelect = (i: number) => {
    setSelected(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });
  };

  const [saveResult, setSaveResult] = useState<any>(null);

  const updateGrade = (i: number, field: string, value: any) => {
    setGrades(prev => prev.map((g, idx) => idx === i ? { ...g, [field]: value } : g));
  };

  const saveGrades = async () => {
    setSaving(true);
    try {
      const token = getToken();
      const batch = [...selected].map(i => {
        const g = grades[i];
        return { title: g.name || 'Uploaded Grade', score: g.score, max_score: g.total, category: g.category || 'other' };
      });
      const res = await fetch(`${API_BASE}/api/classes/${classId}/grades/add-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ grades: batch, source: 'uploaded' }),
      });
      const data = await res.json();
      if (data.duplicates > 0 && data.saved === 0) {
        setSaveResult(data);
      } else if (data.duplicates > 0 && data.saved > 0) {
        setSaveResult(data);
        setTimeout(() => onSaved(), 3000);
      } else {
        onSaved();
      }
    } catch { setError('Failed to save'); }
    finally { setSaving(false); }
  };

  const reset = () => { setPreview(null); setGrades([]); setError(''); setSelected(new Set()); setFileName(''); };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
        <button onClick={onBack}><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
        <h2 className="text-base font-extrabold text-gray-900">Upload File</h2>
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
            <div className="space-y-2">
              {grades.map((g, i) => (
                <div key={i} className={`border-2 rounded-xl p-3 transition-all ${selected.has(i) ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div onClick={() => toggleSelect(i)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 cursor-pointer ${selected.has(i) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                      {selected.has(i) && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <input value={g.name || ''} onChange={e => updateGrade(i, 'name', e.target.value)}
                      className="flex-1 text-sm font-bold text-gray-900 bg-transparent border-b border-gray-200 focus:border-indigo-500 focus:outline-none px-1 py-0.5"
                      placeholder="Grade name" />
                  </div>
                  <div className="pl-7 space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="number" value={g.score ?? ''} onChange={e => updateGrade(i, 'score', e.target.value ? Number(e.target.value) : null)}
                        className="w-16 text-sm font-bold text-center bg-white border border-gray-200 rounded-lg px-1 py-1 focus:border-indigo-500 focus:outline-none" placeholder="Score" />
                      <span className="text-gray-400 font-bold">/</span>
                      <input type="number" value={g.total ?? ''} onChange={e => updateGrade(i, 'total', e.target.value ? Number(e.target.value) : null)}
                        className="w-16 text-sm font-bold text-center bg-white border border-gray-200 rounded-lg px-1 py-1 focus:border-indigo-500 focus:outline-none" placeholder="Total" />
                      <span className="text-xs font-bold text-indigo-600 ml-auto">
                        {g.score != null && g.total ? `${Math.round((g.score / g.total) * 100)}%` : ''}
                      </span>
                    </div>
                    <select value={g.category || 'other'} onChange={e => updateGrade(i, 'category', e.target.value)}
                      className="text-xs font-semibold bg-gray-100 border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none w-full">
                      <option value="quiz">Quiz</option>
                      <option value="exam">Exam</option>
                      <option value="homework">Homework</option>
                      <option value="assignment">Assignment</option>
                      <option value="lab">Lab</option>
                      <option value="project">Project</option>
                      <option value="other">Other</option>
                    </select>
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
            {saveResult && (
              <>
                <div className="fixed inset-0 bg-black/40 z-40" />
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-50 p-6 w-[85%] max-w-sm shadow-xl"
                  style={{ animation: 'popIn 0.3s ease-out' }}>
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-gray-900">Duplicate Grades Found</h3>
                    {saveResult.saved > 0 && (
                      <p className="text-sm text-green-600 font-semibold">✅ {saveResult.saved} new grade{saveResult.saved > 1 ? 's' : ''} added</p>
                    )}
                    <p className="text-sm text-gray-500">{saveResult.duplicates} grade{saveResult.duplicates > 1 ? 's' : ''} already exist</p>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {saveResult.duplicate_names.map((n: string, i: number) => (
                        <span key={i} className="text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">{n}</span>
                      ))}
                    </div>
                    <button onClick={() => { setSaveResult(null); onSaved(); }}
                      className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-indigo-700 mt-2">
                      OK
                    </button>
                  </div>
                </div>
                <style jsx>{`@keyframes popIn { from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }`}</style>
              </>
            )}
          </div>
        ) : preview ? (
          <div className="space-y-4">
            {preview.startsWith('data:image') ? (
              <img src={preview} alt="Preview" className="w-full rounded-xl border border-gray-200 max-h-52 object-contain bg-gray-50" />
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <p className="text-3xl mb-2">📄</p>
                <p className="text-sm font-bold text-gray-700">{fileName}</p>
              </div>
            )}
            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /><p className="text-xs text-red-700">{error}</p></div>}
            <div className="flex gap-2">
              <button onClick={reset} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-all text-sm">Change File</button>
              <button onClick={scanGrade} disabled={scanning}
                className="flex-1 bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                {scanning ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning...</> : '🤖 Scan with AI'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleFile} className="hidden" />
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-indigo-300 rounded-2xl py-12 flex flex-col items-center justify-center gap-4 hover:bg-indigo-50 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center"><Upload className="w-8 h-8 text-indigo-600" /></div>
              <div className="text-center px-6">
                <p className="text-lg font-extrabold text-gray-900">Upload File</p>
                <p className="text-sm text-gray-400 mt-1.5">Upload a screenshot or photo of your graded work.</p>
                <p className="text-xs text-gray-300 mt-1">PNG, JPG or PDF up to 10MB</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500">Supported Sources</p>
              {[{e:'🖥️',t:'LMS Screenshot',s:'Canvas, Blackboard, etc.'},{e:'📄',t:'PDF Grade Report',s:'Exported grade reports'},{e:'📸',t:'Photo of Graded Work',s:'Papers, tests, assignments'}].map(i=>(
                <div key={i.t} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><span className="text-lg">{i.e}</span><div><p className="text-sm font-semibold text-gray-800">{i.t}</p><p className="text-xs text-gray-400">{i.s}</p></div></div>
              ))}
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0"><Info className="w-4 h-4 text-indigo-600" /></div>
              <p className="text-xs text-gray-600 leading-relaxed pt-1">Atlas AI will read the score from your file and update your grade automatically.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
