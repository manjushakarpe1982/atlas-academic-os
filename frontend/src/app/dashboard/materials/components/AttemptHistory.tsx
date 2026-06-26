'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, Eye, RefreshCw, Loader2, CheckCircle2, XCircle, Download, RotateCcw } from 'lucide-react';
import { API_BASE, getToken } from '@/lib/api';

interface Row { id: string; attempt_number: number; retake_number?: number; score: number; total: number; content_json: any; completed_at: string; }
interface Group { attempt_number: number; original: Row; retakes: Row[]; retake_count: number; }

interface Props {
  topicId: string; topicTitle: string; classId: string; className: string;
  materialType: 'quiz' | 'flashcards' | 'targeted';
  onBack: () => void;
  onRegenerate: () => void;
  onRetake: (content: any, attemptNumber: number) => void;
}

export default function AttemptHistory({ topicId, topicTitle, classId, className, materialType, onBack, onRegenerate, onRetake }: Props) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewGroup, setPreviewGroup] = useState<Group | null>(null);
  const [previewPill, setPreviewPill] = useState(0); // 0=original, 1=retake1, etc.

  useEffect(() => {
    const load = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/classes/study/attempts/${topicId}/${materialType}`, { headers: { Authorization: `Bearer ${token}` } });
        const d = await res.json();
        setGroups(d.attempts || []);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, [topicId, materialType]);

  const labels: Record<string, string> = { quiz: 'Practice Quiz', flashcards: 'Flashcards', targeted: 'Targeted Practice' };
  const label = labels[materialType] || 'Study';
  const pctOf = (r: Row) => r.total > 0 ? Math.round(r.score / r.total * 100) : 0;
  const pctColor = (p: number) => p >= 70 ? 'text-green-600' : p >= 50 ? 'text-amber-600' : 'text-red-600';
  const dateStr = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // ── PREVIEW with pills ──
  if (previewGroup) {
    const allRows = [previewGroup.original, ...previewGroup.retakes];
    const activeRow = allRows[previewPill] || allRows[0];
    const questions = activeRow.content_json?.questions || activeRow.content_json || [];
    const userAnswers = activeRow.content_json?.userAnswers || [];
    const pct = pctOf(activeRow);

    const downloadDoc = () => {
      const dt = dateStr(activeRow.completed_at);
      const pillLabel = previewPill === 0 ? 'Original' : `Retake_${previewPill}`;
      let html = `<html><head><meta charset="utf-8"><style>body{font-family:Calibri;padding:20px;color:#333}h1{color:#4F46E5;font-size:20px}.q{border:1px solid #E5E7EB;border-radius:8px;padding:12px;margin-bottom:10px}.ok{border-left:4px solid #22C55E}.no{border-left:4px solid #EF4444}.og{background:#DCFCE7;color:#166534;padding:5px 8px;margin:2px 0;border-radius:4px}.ow{background:#FEE2E2;color:#991B1B;padding:5px 8px;margin:2px 0;border-radius:4px}.on{background:#F9FAFB;color:#6B7280;padding:5px 8px;margin:2px 0;border-radius:4px}</style></head><body><h1>${label} — Attempt #${previewGroup.attempt_number} · ${pillLabel}</h1><p>${topicTitle} · ${dt} · Score: ${activeRow.score}/${activeRow.total} (${pct}%)</p>`;
      if (materialType === 'flashcards') { (Array.isArray(questions)?questions:[]).forEach((c:any,i:number)=>{html+=`<div class="q"><b>Card ${i+1}:</b> ${c.question||c.front||''}<div style="background:#EEF2FF;padding:8px;margin-top:6px;border-radius:6px"><b>Answer:</b> ${c.answer||c.back||''}</div></div>`;}); }
      else { (Array.isArray(questions)?questions:[]).forEach((q:any,i:number)=>{const ua=userAnswers[i];const ok=ua===q.correctIndex;html+=`<div class="q ${ok?'ok':'no'}"><b>${ok?'✅':'❌'} Q${i+1}.</b> ${q.question}`;(q.options||[]).forEach((o:string,oi:number)=>{html+=`<div class="${oi===q.correctIndex?'og':oi===ua?'ow':'on'}">${o}${oi===q.correctIndex?' ✅ Correct':''}${oi===ua&&!ok?' ❌ Your Answer':''}</div>`;});if(q.explanation)html+=`<p style="color:#6B7280;font-style:italic;font-size:12px">${q.explanation}</p>`;html+=`</div>`;}); }
      html+=`</body></html>`;
      const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'application/msword'}));a.download=`Attempt_${previewGroup.attempt_number}_${pillLabel}.doc`;a.click();
    };

    return (
      <div className="px-4 py-4 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => { setPreviewGroup(null); setPreviewPill(0); }}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <div className="flex-1">
            <h1 className="text-base font-extrabold text-gray-900">Attempt #{previewGroup.attempt_number}</h1>
            <p className="text-xs text-gray-400">Score: {activeRow.score}/{activeRow.total} ({pct}%) · {dateStr(activeRow.completed_at)}</p>
          </div>
          <button onClick={downloadDoc} className="flex items-center gap-1.5 bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-200"><Download className="w-3.5 h-3.5" /> DOC</button>
        </div>

        {/* Pills */}
        <div className="flex gap-1.5 overflow-x-auto mb-4 pb-1" style={{ scrollbarWidth: 'none' }}>
          {allRows.map((r, i) => (
            <button key={r.id} onClick={() => setPreviewPill(i)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                previewPill === i ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 border border-gray-200'
              }`}>
              {i === 0 ? `Original · ${pctOf(r)}%` : `Retake ${i} · ${pctOf(r)}%`}
            </button>
          ))}
        </div>

        {/* Questions */}
        {materialType === 'flashcards' ? (
          <div className="space-y-3">{(Array.isArray(questions)?questions:[]).map((card:any,i:number)=>(<div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"><p className="text-xs font-bold text-gray-400 mb-1">Card {i+1}</p><p className="text-sm font-bold text-gray-900 mb-2">{card.question||card.front}</p><div className="bg-indigo-50 rounded-lg p-3"><p className="text-xs font-bold text-indigo-600 mb-0.5">Answer</p><p className="text-sm text-gray-800">{card.answer||card.back}</p></div></div>))}</div>
        ) : (
          <div className="space-y-3">{(Array.isArray(questions)?questions:[]).map((q:any,i:number)=>{const ua=userAnswers[i];const ok=ua===q.correctIndex;return(<div key={i} className={`bg-white rounded-2xl border shadow-sm p-4 ${ok?'border-green-200':'border-red-200'}`}><div className="flex items-start gap-2 mb-2">{ok?<CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5"/>:<XCircle className="w-4 h-4 text-red-500 mt-0.5"/>}<p className="text-sm font-bold text-gray-900">Q{i+1}. {q.question}</p></div><div className="space-y-1.5 ml-6">{(q.options||[]).map((opt:string,oi:number)=>(<div key={oi} className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${oi===q.correctIndex?'bg-green-50 text-green-700 font-bold border border-green-200':oi===ua?'bg-red-50 text-red-600 font-bold border border-red-200':'bg-gray-50 text-gray-600'}`}><span>{opt}</span>{oi===q.correctIndex&&<span className="text-[10px]">✅ Correct</span>}{oi===ua&&oi!==q.correctIndex&&<span className="text-[10px]">❌ Your answer</span>}</div>))}</div>{q.explanation&&<p className="text-xs text-gray-500 mt-2 ml-6 italic">{q.explanation}</p>}</div>);})}</div>
        )}
      </div>
    );
  }

  // ── LOADING ──
  if (loading) return (
    <div className="px-4 py-4 pb-24">
      <div className="flex items-center gap-3 mb-5"><button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button><h1 className="text-base font-extrabold text-gray-900">{label}</h1></div>
      <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-indigo-600 animate-spin" /></div>
    </div>
  );

  if (groups.length === 0) { onRegenerate(); return null; }

  // ── CARD LIST ──
  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
        <div><h1 className="text-base font-extrabold text-gray-900">{label}</h1><p className="text-xs text-gray-400">{topicTitle}</p></div>
      </div>

      {/* Attempt Cards */}
      <div className="space-y-3 mb-5">
        {groups.map(g => {
          const pct = pctOf(g.original);
          return (
            <div key={g.attempt_number} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-extrabold text-indigo-600">#{g.attempt_number}</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Attempt #{g.attempt_number}</p>
                  <p className="text-[10px] text-gray-400">{dateStr(g.original.completed_at)}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-extrabold ${pctColor(pct)}`}>{pct}%</p>
                  <p className="text-[10px] text-gray-400">{g.original.score}/{g.original.total}</p>
                </div>
              </div>
              {g.retake_count > 0 && (
                <p className="text-[11px] text-indigo-600 font-semibold ml-13 mb-2 ml-[52px]">{g.retake_count} retake{g.retake_count > 1 ? 's' : ''}</p>
              )}
              <div className="flex gap-2 mt-2">
                <button onClick={() => { setPreviewGroup(g); setPreviewPill(0); }}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-100 py-2.5 rounded-lg hover:bg-indigo-200">
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button onClick={() => onRetake(g.original.content_json, g.attempt_number)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-green-600 bg-green-100 py-2.5 rounded-lg hover:bg-green-200">
                  <RotateCcw className="w-3.5 h-3.5" /> Re-Take
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Regenerate */}
      <button onClick={onRegenerate}
        className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all text-sm flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4" /> Regenerate New Test
      </button>
      <button onClick={onBack} className="w-full text-gray-500 font-semibold py-3 text-sm mt-2">Back</button>
    </div>
  );
}
