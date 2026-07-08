"use client";
import { useState, useImperativeHandle, forwardRef, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Check, Loader2, Upload, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { api, API_BASE, getToken } from "@/lib/api";
import { Phone } from "./shared";

interface Props {
  onNext: () => void;
  onBack: () => void;
  classId: string | null;
}

type Tab = "manual" | "photo" | "screenshot";

interface Grade {
  id: number;
  assessment: string;
  score: number;
  total: number;
  date: string;
  editing: boolean;
  source?: string;
}

interface ScannedGrade {
  name: string;
  score: number | null;
  total: number | null;
  category: string;
}

let nextId = 10;

export interface Screen7Handle {
  saveAndContinue: () => Promise<void>;
}

const Screen7 = forwardRef<Screen7Handle, Props>(function Screen7(
  { onNext, classId },
  ref,
) {
  const [tab, setTab] = useState<Tab>("manual");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [grades, setGrades] = useState<Grade[]>([]);

  // AI Scan state
  const [scanPreview, setScanPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedGrades, setScannedGrades] = useState<ScannedGrade[]>([]);
  const [scanSelected, setScanSelected] = useState<Set<number>>(new Set());
  const [scanError, setScanError] = useState("");
  const [scanSaving, setScanSaving] = useState(false);
  const [scanSaved, setScanSaved] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setScanPreview(reader.result as string);
    reader.readAsDataURL(file);
    setScanError(""); setScannedGrades([]); setScanSaved(false);
  };

  const doScan = async () => {
    if (!scanPreview) return;
    setScanning(true); setScanError("");
    try {
      const base64 = scanPreview.split(",")[1];
      const mediaType = scanPreview.split(";")[0].split(":")[1] || "image/jpeg";
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/classes/grades/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ image: base64, media_type: mediaType, class_id: classId }),
      });
      const data = await res.json();
      if (data.success && data.grades?.length) {
        setScannedGrades(data.grades);
        setScanSelected(new Set(data.grades.map((_: any, i: number) => i)));
      } else { setScanError("Could not read any grades from image"); }
    } catch { setScanError("Something went wrong"); }
    finally { setScanning(false); }
  };

  const updateScanned = (i: number, field: string, value: any) => {
    setScannedGrades(prev => prev.map((g, idx) => idx === i ? { ...g, [field]: value } : g));
  };

  const toggleScanSelect = (i: number) => {
    setScanSelected(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });
  };

  const [dupResult, setDupResult] = useState<{ added: number; dupes: string[] } | null>(null);

  const saveScannedGrades = async () => {
    const existingNames = new Set(grades.map(g => g.assessment.toLowerCase().trim()));
    const dupes: string[] = [];
    const newGrades: Grade[] = [];
    const gradeSource = tab === "photo" ? "scanned" : "uploaded";

    for (const i of scanSelected) {
      const g = scannedGrades[i];
      const name = (g.name || "Scanned Grade").trim();
      if (existingNames.has(name.toLowerCase())) {
        dupes.push(name);
      } else {
        newGrades.push({
          id: nextId++,
          assessment: name,
          score: g.score ?? 0,
          total: g.total ?? 100,
          date: new Date().toISOString().split("T")[0],
          editing: false,
          source: gradeSource,
        });
        existingNames.add(name.toLowerCase());
      }
    }

    if (newGrades.length > 0) {
      setGrades(prev => [...prev, ...newGrades]);
    }

    if (dupes.length > 0) {
      setDupResult({ added: newGrades.length, dupes });
    } else {
      setSaveMsg(`✅ ${newGrades.length} grade(s) added to list`);
      resetScan();
      setTab("manual");
    }
  };

  const resetScan = () => {
    setScanPreview(null); setScannedGrades([]); setScanError(""); setScanSaved(false); setScanSelected(new Set());
  };

  const update = (id: number, field: keyof Grade, value: any) => {
    setGrades((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [field]: value } : g)),
    );
  };

  const removeGrade = (id: number) => {
    setGrades((prev) => prev.filter((g) => g.id !== id));
  };

  const addGrade = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setGrades((prev) => [
      ...prev,
      {
        id: nextId++,
        assessment: "",
        score: 0,
        total: 100,
        date: dateStr,
        editing: true,
        source: "manual",
      },
    ]);
  };

  const saveEdit = (id: number) => {
    update(id, "editing", false);
  };

  const saveAndContinue = async () => {
    if (!classId) {
      onNext();
      return;
    }
    setSaving(true);
    setSaveMsg("");
    try {
      setGrades((prev) => prev.map((g) => ({ ...g, editing: false })));
      const payload = grades
        .filter((g) => g.assessment.trim() && g.total > 0)
        .map((g) => ({
          assessment: g.assessment,
          category: "Exam",
          score: Math.round(g.score),
          total: Math.round(g.total),
        }));

      if (payload.length === 0) {
        setSaveMsg("ℹ️ No grades to save");
        setTimeout(() => onNext(), 600);
        return;
      }

      const response = await api(`/api/classes/${classId}/grades`, {
        method: "POST",
        body: { grades: payload },
      });
      setSaveMsg(`✅ ${payload.length} grade(s) saved!`);
      setTimeout(() => onNext(), 600);
    } catch (e: unknown) {
      let msg = "Save failed";
      if (e instanceof Error) {
        msg = e.message;
      } else if (typeof e === "object" && e !== null) {
        msg = JSON.stringify(e);
      }
      setSaveMsg(`❌ ${msg}`);
    } finally {
      setSaving(false);
    }
  };
  useImperativeHandle(ref, () => ({ saveAndContinue }));

  return (
    <Phone>
      {/* Duplicate Popup */}
      {dupResult && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-50 p-6 w-[85%] max-w-sm shadow-xl"
            style={{ animation: 'popIn 0.3s ease-out' }}>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-extrabold text-gray-900">Duplicate Grades Found</h3>
              {dupResult.added > 0 && (
                <p className="text-sm text-green-600 font-semibold">✅ {dupResult.added} new grade{dupResult.added > 1 ? 's' : ''} added</p>
              )}
              <p className="text-sm text-gray-500">{dupResult.dupes.length} grade{dupResult.dupes.length > 1 ? 's' : ''} already exist</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {dupResult.dupes.map((n, i) => (
                  <span key={i} className="text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">{n}</span>
                ))}
              </div>
              <button onClick={() => { setDupResult(null); resetScan(); setTab("manual"); }}
                className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-indigo-700 mt-2">
                OK
              </button>
            </div>
          </div>
          <style jsx>{`@keyframes popIn { from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }`}</style>
        </>
      )}
      <div className="flex flex-col  bg-white overflow-hidden">
        {/* HEADER - Fixed */}
        <div className="  flex-shrink-0 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-gray-900">
                Enter Your <span className="text-indigo-600">Grades</span>{" "}
              </h1>
              <p className="text-xs text-gray-600 mt-1">
                Add your current grades to <br /> get smarter study
                recommendations.
              </p>
            </div>
            <Image
              src="https://res.cloudinary.com/mview/image/upload/v1781271805/atlas/addclassreviewpage.png"
              alt="Grade"
              width={100}
              height={100}
              className="object-contain flex-shrink-0"
              priority
            />
          </div>

          {/* TABS */}
          <div className="flex bg-gray-100 p-1.5 rounded w-fit mb-4 shadow-inner">
            {[
              { id: "manual" as Tab, label: "Manual Entry" },
              { id: "photo" as Tab, label: "Scan Grade" },
              { id: "screenshot" as Tab, label: "Upload File" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); resetScan(); }}
                className={`px-3 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-300 flex items-center gap-3
        ${
          tab === t.id
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30" // ← Blue background + White text
            : "text-gray-500 hover:text-gray-800 hover:bg-white/60"
        }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden  py-3">
          <div className="space-y-3">
            {/* MANUAL ENTRY */}
            {tab === "manual" && (
              <div className="space-y-3">
                {/* Empty State or Grades List */}
                {grades.length === 0 ? (
                  <div className="text-center py-10 p-4  bg-indigo-50 border border-indigo-100 rounded-xl shadow-xl shadow-gray-100/80">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                      <span className="text-5xl">📚</span>
                    </div>

                    <p className="text-xl font-semibold text-gray-900 mb-3">
                      No grades added yet
                    </p>
                    <p className="text-gray-500 text-[15px] leading-relaxed">
                      Add your grades manually or upload a photo to get started
                    </p>
                    <button
                      onClick={addGrade}
                      className="w-full flex items-center justify-center mt-3 gap-2 bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700"
                    >
                      <Plus className="w-4 h-4" />{" "}
                      {grades.length > 0 ? "Add Another Grade" : "Add Grade"}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center mb-2 gap-2">
                        <span>📋</span>
                        <p className="text-lg font-bold text-gray-900">
                          Your Grades
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {grades.map((g) => (
                        <div
                          key={g.id}
                          className={`flex items-start gap-3 p-3 rounded border relative ${g.editing ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-200"}`}
                        >
                          {/* X button - top right when editing */}
                          {g.editing && (
                            <button
                              onClick={() =>
                                setGrades((prev) =>
                                  prev.filter((item) => item.id !== g.id),
                                )
                              }
                              className="absolute top-12 right-3 w-6 h-6  bg-red-100 rounded text-red-500 transition-colors text-xl leading-none font-bold"
                            >
                              ✕
                            </button>
                          )}

                          {/* Drag handle icon */}
                          <span className="text-gray-400 flex-shrink-0 text-lg">
                            ≡
                          </span>

                          {/* Left side - Name and Date */}
                          <div className="flex-1 min-w-0">
                            {g.editing ? (
                              <div className="space-y-1">
                                <input
                                  value={g.assessment}
                                  onChange={(e) =>
                                    update(g.id, "assessment", e.target.value)
                                  }
                                  placeholder="Assessment name"
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-bold"
                                />
                                <input
                                  type="text"
                                  value={g.date}
                                  onChange={(e) =>
                                    update(g.id, "date", e.target.value)
                                  }
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs text-gray-500"
                                />
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-gray-900">
                                    {g.assessment}
                                  </p>
                                  {g.source && (
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                      g.source === 'manual' ? 'bg-blue-50 text-blue-600' : g.source === 'scanned' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
                                    }`}>
                                      {g.source === 'manual' ? '✍️ Manual' : g.source === 'scanned' ? '📷 Scanned' : '📄 Uploaded'}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">
                                  {g.date}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Middle - Score input */}
                          {g.editing ? (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <input
                                type="number"
                                value={g.score || ''}
                                onChange={(e) =>
                                  update(g.id, "score", e.target.value === '' ? 0 : Number(e.target.value))
                                }
                                onFocus={(e) => e.target.select()}
                                className="w-10 border border-gray-300 rounded px-1 py-1 text-xs text-center"
                              />
                              <span className="text-gray-400 text-sm">/</span>
                              <input
                                type="number"
                                value={g.total || ''}
                                onChange={(e) =>
                                  update(g.id, "total", e.target.value === '' ? 0 : Number(e.target.value))
                                }
                                onFocus={(e) => e.target.select()}
                                className="w-10 border border-gray-300 rounded px-1 py-1 text-xs text-center"
                              />
                            </div>
                          ) : (
                            <div className="text-right flex-shrink-0 min-w-fit">
                              <p className="text-sm font-bold text-gray-900">
                                {g.score} / {g.total}
                              </p>
                            </div>
                          )}

                          {/* Right side - Action buttons */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {g.editing ? (
                              <button
                                onClick={() => saveEdit(g.id)}
                                className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-white hover:bg-green-600"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => removeGrade(g.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addGrade}
                      className="w-full flex items-center justify-center mt-3 gap-2 bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700"
                    >
                      <Plus className="w-4 h-4" />{" "}
                      {grades.length > 0 ? "Add Another Grade" : "Add Grade"}
                    </button>
                  </div>
                )}

                {grades.length > 0 ? (
                  <div className="bg-gradient-to-br from-violet-50 mt-6 to-fuchsia-50 border border-violet-100 rounded-xl p-3 shadow-sm">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-9 h-9 bg-white shadow flex items-center justify-center rounded-2xl text-xl">
                        ✨
                      </div>
                      <h3 className="text-xl font-bold text-violet-700 mt-1">
                        Tips
                      </h3>
                    </div>

                    <ul className="space-y-2">
                      <li className="flex gap-3">
                        <div className="mt-0.5">
                          <Check className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span className="text-[14px] leading-relaxed text-gray-700">
                          Add quizzes, exams, homework, labs, etc.
                        </span>
                      </li>

                      <li className="flex gap-3">
                        <div className="mt-0.5">
                          <Check className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span className="text-[14px] leading-relaxed text-gray-700">
                          Enter scores as you see them
                        </span>
                      </li>

                      <li className="flex gap-3">
                        <div className="mt-0.5">
                          <Check className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span className="text-[14px] leading-relaxed text-gray-700">
                          You can edit or delete anytime
                        </span>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    <p className="text-base font-bold text-gray-900 mb-2 flex items-center gap-1">
                      <span>❓</span>Why add grades?
                    </p>
                    <p className="text-sm text-gray-700 leading-snug">
                      Your grades help Atlas prioritize what to study and how
                      much time to spend.
                    </p>
                  </div>
                )}
                {/* Add Grade Button */}

                {/* Why Add Grades - YELLOW */}
              </div>
            )}

            {/* SCAN GRADE */}
            {tab === "photo" && (
              <div className="space-y-5">
                <input ref={photoRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
                {scannedGrades.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-2"><CheckCircle2 className="w-6 h-6 text-green-600" /></div>
                      <h3 className="text-base font-extrabold text-gray-900">{scannedGrades.length} Grade{scannedGrades.length > 1 ? "s" : ""} Detected</h3>
                      <p className="text-xs text-gray-400">Edit if needed, then save</p>
                    </div>
                    {scanPreview && <img src={scanPreview} alt="Scanned" className="w-full rounded-xl border max-h-28 object-contain bg-gray-50" />}
                    <div className="space-y-2">
                      {scannedGrades.map((g, i) => (
                        <div key={i} className={`border-2 rounded-xl p-3 transition-all ${scanSelected.has(i) ? "border-indigo-500 bg-indigo-50/30" : "border-gray-200"}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <div onClick={() => toggleScanSelect(i)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 cursor-pointer ${scanSelected.has(i) ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}>
                              {scanSelected.has(i) && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <input value={g.name || ""} onChange={e => updateScanned(i, "name", e.target.value)} className="flex-1 text-sm font-bold text-gray-900 bg-transparent border-b border-gray-200 focus:border-indigo-500 focus:outline-none px-1 py-0.5" />
                          </div>
                          <div className="pl-7 space-y-2">
                            <div className="flex items-center gap-2">
                              <input type="number" value={g.score ?? ""} onChange={e => updateScanned(i, "score", e.target.value ? Number(e.target.value) : null)} className="w-16 text-sm font-bold text-center bg-white border border-gray-200 rounded-lg px-1 py-1" />
                              <span className="text-gray-400 font-bold">/</span>
                              <input type="number" value={g.total ?? ""} onChange={e => updateScanned(i, "total", e.target.value ? Number(e.target.value) : null)} className="w-16 text-sm font-bold text-center bg-white border border-gray-200 rounded-lg px-1 py-1" />
                              <span className="text-xs font-bold text-indigo-600 ml-auto">{g.score != null && g.total ? `${Math.round((g.score / g.total) * 100)}%` : ""}</span>
                            </div>
                            <select value={g.category || "other"} onChange={e => updateScanned(i, "category", e.target.value)} className="text-xs font-semibold bg-gray-100 border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 w-full">
                              <option value="quiz">Quiz</option><option value="exam">Exam</option><option value="homework">Homework</option><option value="assignment">Assignment</option><option value="lab">Lab</option><option value="project">Project</option><option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                    {scanError && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{scanError}</div>}
                    <div className="flex gap-2">
                      <button onClick={resetScan} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" /> Retry</button>
                      <button onClick={() => saveScannedGrades()} disabled={scanSaving || scanSelected.size === 0} className="flex-1 bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                        {scanSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} {scanSaving ? "Saving..." : `Save ${scanSelected.size}`}
                      </button>
                    </div>
                  </div>
                ) : scanPreview ? (
                  <div className="space-y-4">
                    <img src={scanPreview} alt="Preview" className="w-full rounded-xl border max-h-48 object-contain bg-gray-50" />
                    {scanError && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{scanError}</div>}
                    <div className="flex gap-2">
                      <button onClick={resetScan} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm">Retake</button>
                      <button onClick={doScan} disabled={scanning} className="flex-1 bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                        {scanning ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning...</> : "🤖 Scan with AI"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="border-2 border-dashed border-indigo-400 bg-gray-50 rounded-xl text-center flex flex-col items-center justify-center min-h-[300px]">
                      <span className="text-4xl block mb-2">📷</span>
                      <p className="text-lg font-semibold text-gray-900 mb-2">Scan Grade</p>
                      <p className="text-sm text-gray-500 max-w-[260px] mb-5">Take a photo of your graded assignment, quiz or exam</p>
                      <button onClick={() => photoRef.current?.click()} className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200">
                        📷 Scan Grade
                      </button>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                      <p className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <span>ℹ️</span> How it works
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✅</span> <span>Atlas AI will detect your score automatically</span></li>
                        <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✅</span> <span>Make sure all text is clear and readable</span></li>
                        <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✅</span> <span>You can edit the result before saving</span></li>
                        <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✅</span> <span>Supported formats: JPG, PNG, HEIC</span></li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* UPLOAD FILE */}
            {tab === "screenshot" && (
              <div className="space-y-5">
                <input ref={uploadRef} type="file" accept="image/*,.pdf" onChange={handleFileSelect} className="hidden" />
                {scannedGrades.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-2"><CheckCircle2 className="w-6 h-6 text-green-600" /></div>
                      <h3 className="text-base font-extrabold text-gray-900">{scannedGrades.length} Grade{scannedGrades.length > 1 ? "s" : ""} Detected</h3>
                      <p className="text-xs text-gray-400">Edit if needed, then save</p>
                    </div>
                    <div className="space-y-2">
                      {scannedGrades.map((g, i) => (
                        <div key={i} className={`border-2 rounded-xl p-3 transition-all ${scanSelected.has(i) ? "border-indigo-500 bg-indigo-50/30" : "border-gray-200"}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <div onClick={() => toggleScanSelect(i)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 cursor-pointer ${scanSelected.has(i) ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}>
                              {scanSelected.has(i) && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <input value={g.name || ""} onChange={e => updateScanned(i, "name", e.target.value)} className="flex-1 text-sm font-bold text-gray-900 bg-transparent border-b border-gray-200 focus:border-indigo-500 focus:outline-none px-1 py-0.5" />
                          </div>
                          <div className="pl-7 space-y-2">
                            <div className="flex items-center gap-2">
                              <input type="number" value={g.score ?? ""} onChange={e => updateScanned(i, "score", e.target.value ? Number(e.target.value) : null)} className="w-16 text-sm font-bold text-center bg-white border border-gray-200 rounded-lg px-1 py-1" />
                              <span className="text-gray-400 font-bold">/</span>
                              <input type="number" value={g.total ?? ""} onChange={e => updateScanned(i, "total", e.target.value ? Number(e.target.value) : null)} className="w-16 text-sm font-bold text-center bg-white border border-gray-200 rounded-lg px-1 py-1" />
                              <span className="text-xs font-bold text-indigo-600 ml-auto">{g.score != null && g.total ? `${Math.round((g.score / g.total) * 100)}%` : ""}</span>
                            </div>
                            <select value={g.category || "other"} onChange={e => updateScanned(i, "category", e.target.value)} className="text-xs font-semibold bg-gray-100 border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 w-full">
                              <option value="quiz">Quiz</option><option value="exam">Exam</option><option value="homework">Homework</option><option value="assignment">Assignment</option><option value="lab">Lab</option><option value="project">Project</option><option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                    {scanError && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{scanError}</div>}
                    <div className="flex gap-2">
                      <button onClick={resetScan} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" /> Retry</button>
                      <button onClick={() => saveScannedGrades()} disabled={scanSaving || scanSelected.size === 0} className="flex-1 bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                        {scanSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} {scanSaving ? "Saving..." : `Save ${scanSelected.size}`}
                      </button>
                    </div>
                  </div>
                ) : scanPreview ? (
                  <div className="space-y-4">
                    {scanPreview.startsWith("data:image") ? (
                      <img src={scanPreview} alt="Preview" className="w-full rounded-xl border max-h-48 object-contain bg-gray-50" />
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-6 text-center"><p className="text-3xl mb-2">📄</p><p className="text-sm font-bold text-gray-700">File ready</p></div>
                    )}
                    {scanError && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{scanError}</div>}
                    <div className="flex gap-2">
                      <button onClick={resetScan} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm">Change</button>
                      <button onClick={doScan} disabled={scanning} className="flex-1 bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                        {scanning ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning...</> : "🤖 Scan with AI"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-5">
                    <Image
                      src="https://res.cloudinary.com/mview/image/upload/v1781596631/atlas/entergradescrenshot.png"
                      alt="Grade"
                      width={350}
                      height={300}
                      className="object-contain w-full max-w-[280px] rounded-2xl shadow-md"
                      priority
                    />
                    <div>
                      <p className="text-lg font-semibold text-gray-900 mb-1">Upload File</p>
                      <p className="text-sm text-gray-600 max-w-[260px]">Upload a screenshot or photo of your graded work</p>
                    </div>
                    <button onClick={() => uploadRef.current?.click()} className="w-full max-w-[260px] flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-2xl font-semibold text-sm hover:bg-indigo-700 transition-all active:scale-[0.97]">
                      <Upload className="w-5 h-5" />
                      Upload File
                    </button>
                    <p className="text-xs text-blue-700 flex items-center gap-1.5">
                      🔒 Your data is private and secure
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>


        {/* FOOTER - Fixed bottom */}
        <div className="px-5 py-3 flex-shrink-0 border-t border-gray-100 space-y-2">
          {/* SAVE STATUS */}
          {(saving || saveMsg) && (
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                saveMsg.startsWith("✅")
                  ? "bg-green-50 text-green-700"
                  : saveMsg.startsWith("❌")
                    ? "bg-red-50 text-red-700"
                    : "bg-indigo-50 text-indigo-600"
              }`}
            >
              {saving && <Loader2 className="w-3 h-3 animate-spin" />}
              {saveMsg || "Saving..."}
            </div>
          )}
        </div>
      </div>
    </Phone>
  );
});

export default Screen7;
