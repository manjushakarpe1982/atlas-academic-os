"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import {
  ChevronRight, Upload, BookOpen, FileText, BarChart2,
  Target, CheckCircle2, Star, TrendingUp, Plus, Search,
  Brain, Zap, GraduationCap, Clock, X, RefreshCw,
  AlertCircle, Trash2, Edit2,
} from "lucide-react";
import { api } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────

interface ClassListItem {
  id:            string;
  name:          string;
  instructor:    string | null;
  credit_hours:  number | null;
  term:          string | null;
  created_at:    string;
  file_count:    number;
  topic_count:   number;
  current_grade: number | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────

function gradeLabel(pct: number | null): string {
  if (pct === null) return "—";
  if (pct >= 93) return "A";
  if (pct >= 90) return "A−";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B−";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  if (pct >= 70) return "C−";
  if (pct >= 60) return "D";
  return "F";
}

function gradeColor(pct: number | null): string {
  if (!pct) return "text-gray-400";
  if (pct >= 90) return "text-emerald-600";
  if (pct >= 80) return "text-indigo-600";
  if (pct >= 70) return "text-amber-600";
  return "text-red-600";
}

const CLASS_COLORS = [
  { accent: "bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
  { accent: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  { accent: "bg-amber-500", light: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  { accent: "bg-purple-500", light: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  { accent: "bg-red-500", light: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  { accent: "bg-blue-500", light: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
];

function colorForClass(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return CLASS_COLORS[Math.abs(hash) % CLASS_COLORS.length];
}

function initials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// ── Add/Edit Class Modal ───────────────────────────────────────────────────

interface ModalProps {
  existing?: ClassListItem;
  onClose:   () => void;
  onSaved:   () => void;
}

function ClassModal({ existing, onClose, onSaved }: ModalProps) {
  const [name,        setName]        = useState(existing?.name || "");
  const [instructor,  setInstructor]  = useState(existing?.instructor || "");
  const [credits,     setCredits]     = useState(String(existing?.credit_hours || "3"));
  const [term,        setTerm]        = useState(existing?.term || "Fall 2026");
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");

  const handleSave = async () => {
    if (!name.trim()) { setError("Class name is required."); return; }
    setSaving(true);
    try {
      const body = {
        name: name.trim(),
        instructor: instructor.trim() || null,
        credit_hours: parseInt(credits) || 3,
        term: term.trim() || "Fall 2026",
      };
      if (existing) {
        await api(`/api/classes/${existing.id}`, { method: "PATCH", body });
      } else {
        await api("/api/classes", { method: "POST", body });
      }
      onSaved();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not save class.");
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all bg-white";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="h-1.5 bg-indigo-600 w-full" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-extrabold text-gray-900">{existing ? "Edit class" : "Add a class"}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Class name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Introduction to Biology" className={inp} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Instructor</label>
              <input value={instructor} onChange={(e) => setInstructor(e.target.value)}
                placeholder="e.g. Dr. Sarah Smith" className={inp} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Credit hours</label>
                <select value={credits} onChange={(e) => setCredits(e.target.value)} className={inp}>
                  {["1","2","3","4","5","6"].map((c) => <option key={c} value={c}>{c} credits</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Term</label>
                <input value={term} onChange={(e) => setTerm(e.target.value)}
                  placeholder="e.g. Fall 2026" className={inp} />
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3.5 py-2.5 mt-4">
            <p className="text-xs text-indigo-700 font-medium">
              💡 After adding, upload your syllabus so Atlas can extract grade weights, deadlines, and topics automatically.
            </p>
          </div>

          <div className="flex gap-2.5 mt-4">
            <button onClick={onClose}
              className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm transition-all hover:border-gray-300">
              Cancel
            </button>
            <button onClick={handleSave} disabled={!name.trim() || saving}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 disabled:opacity-50 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> {existing ? "Save changes" : "Add class"}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Class Card ────────────────────────────────────────────────────────────

function ClassCard({ cls, onEdit, onDelete }: {
  cls: ClassListItem;
  onEdit:   (c: ClassListItem) => void;
  onDelete: (c: ClassListItem) => void;
}) {
  const router = useRouter();
  const col    = colorForClass(cls.id);
  const grade  = gradeLabel(cls.current_grade);
  const gColor = gradeColor(cls.current_grade);

  return (
    <div className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-sm group">
      <div className={`h-1 w-full ${col.accent}`} />
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${col.light} flex items-center justify-center flex-shrink-0 text-lg font-extrabold ${col.text}`}>
              {initials(cls.name)}
            </div>
            <div>
              <p className="text-base font-extrabold text-gray-900 leading-tight">{cls.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {cls.instructor || "No instructor set"} · {cls.credit_hours || "?"} cr
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={`text-2xl font-extrabold leading-none ${gColor}`}>{grade}</p>
            {cls.current_grade !== null && (
              <p className="text-xs text-gray-400 mt-0.5">{cls.current_grade}%</p>
            )}
          </div>
        </div>

        {/* Progress bar — only show if grade exists */}
        {cls.current_grade !== null && (
          <div className="mb-3">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${col.accent} rounded-full`} style={{ width: `${cls.current_grade}%` }} />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {[
            { icon: Brain,    val: `${cls.topic_count} topics` },
            { icon: FileText, val: `${cls.file_count} files`   },
            { icon: Clock,    val: cls.term || "—"             },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
              <s.icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span>{s.val}</span>
            </div>
          ))}
        </div>

        {/* No grades yet notice */}
        {cls.current_grade === null && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-3">
            <p className="text-[11px] text-amber-700 font-medium">
              📊 No grades yet — upload a syllabus to get started
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <button onClick={(e) => { e.stopPropagation(); onEdit(cls); }}
              className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-indigo-600 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-all">
              <Edit2 className="w-3 h-3" /> Edit
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(cls); }}
              className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition-all">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
          <button onClick={() => router.push(`/classes/${cls.id}`)}
            className={`text-xs font-semibold ${col.text} group-hover:opacity-80 flex items-center gap-1 transition-colors`}>
            View class <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirmation ────────────────────────────────────────────────────

function DeleteConfirm({ cls, onCancel, onConfirm, deleting }: {
  cls: ClassListItem; onCancel: () => void;
  onConfirm: () => void; deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="h-1.5 bg-red-500 w-full" />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-base font-extrabold text-gray-900">Delete class?</p>
              <p className="text-xs text-gray-400">This cannot be undone.</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            Deleting <strong>{cls.name}</strong> will remove all linked grade weights, assessments, topics, and file links. Files in storage are kept.
          </p>
          <div className="flex gap-2.5">
            <button onClick={onCancel} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
            <button onClick={onConfirm} disabled={deleting}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
              {deleting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> Delete</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────

export default function ClassesPage() {
  const router = useRouter();
  const [classes,     setClasses]     = useState<ClassListItem[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [search,      setSearch]      = useState("");
  const [showAdd,     setShowAdd]     = useState(false);
  const [editCls,     setEditCls]     = useState<ClassListItem | null>(null);
  const [deleteCls,   setDeleteCls]   = useState<ClassListItem | null>(null);
  const [deleting,    setDeleting]    = useState(false);

  const loadClasses = useCallback(async () => {
    try {
      const res = await api<{ classes: ClassListItem[]; total: number }>("/api/classes");
      setClasses(res.classes);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not load classes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadClasses(); }, [loadClasses]);

  const handleDelete = async () => {
    if (!deleteCls) return;
    setDeleting(true);
    try {
      await api(`/api/classes/${deleteCls.id}`, { method: "DELETE" });
      setClasses((p) => p.filter((c) => c.id !== deleteCls.id));
      setDeleteCls(null);
    } catch { /* ignore */ }
    finally { setDeleting(false); }
  };

  const filtered = classes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.instructor || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalCredits = classes.reduce((s, c) => s + (c.credit_hours || 0), 0);
  const avgGrade     = classes.filter((c) => c.current_grade !== null).length > 0
    ? Math.round(classes.filter((c) => c.current_grade !== null).reduce((s, c) => s + (c.current_grade || 0), 0) / classes.filter((c) => c.current_grade !== null).length)
    : null;

  // ── Empty state — original UI with Cloudinary images ───────────────────
  if (!loading && classes.length === 0) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#F5F5FB] p-4 md:p-4">
          <div className="max-w-[920px] mx-auto">

            <div className="text-center mb-7">
              <h1 className="text-3xl md:text-[34px] font-extrabold text-[#14142B] leading-tight mb-2">
                Add the classes you&apos;re taking
              </h1>
              <p className="text-sm text-[#6B6A8A] max-w-xl mx-auto leading-relaxed">
                Atlas builds a personalised study plan for every class. Add them by
                uploading a syllabus, or enter them manually — your choice.
              </p>
            </div>

            {/* Two big action cards */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-7">
              {/* Option 1 — Upload syllabus */}
              <Link href="/upload"
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all active:scale-[0.99] min-h-[260px]">
                <img
                  src="https://res.cloudinary.com/mview/image/upload/v1780557159/atlas/classpage1.png"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#c5bdf3] via-[#F4F2FF]/95 via-40% to-transparent pointer-events-none" />
                <div className="relative z-10 p-6">
                  <div className="flex items-start justify-between mb-1">
                    <div className="w-11 h-11 rounded-xl bg-white/80 backdrop-blur flex items-center justify-center border border-[#E8E5FD] shadow-sm">
                      <Upload className="w-5 h-5 text-[#534AB7]" />
                    </div>
                  </div>
                  <span className="absolute top-5 right-5 inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-1 uppercase tracking-wider z-10">
                    Recommended
                  </span>
                  <h3 className="text-xl font-extrabold text-[#14142B] mb-1.5">Upload syllabus</h3>
                  <p className="text-[14px] text-[#6B6A8A] leading-relaxed mb-1 max-w-[65%]">
                    Atlas reads your syllabus and creates the class automatically —
                    with topics, deadlines, and grading weights all set up.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-[#534AB7] hover:bg-[#3F3795] text-white font-extrabold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-[#534AB7]/25">
                    <Upload className="w-4 h-4" /> Upload a file
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Option 2 — Add manually */}
              <button onClick={() => setShowAdd(true)}
                className="group text-left relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg hover:border-[#534AB7]/30 transition-all active:scale-[0.99] min-h-[260px]">
                <img
                  src="https://res.cloudinary.com/mview/image/upload/v1780557308/atlas/classpage3.png"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-40% to-transparent pointer-events-none" />
                <div className="relative z-10 p-6 max-w-[60%]">
                  <div className="w-11 h-11 rounded-xl bg-[#F4F2FF] flex items-center justify-center mb-1 shadow-sm">
                    <Plus className="w-5 h-5 text-[#534AB7]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#14142B] mb-1.5">Add manually</h3>
                  <p className="text-[14px] text-[#6B6A8A] leading-relaxed mb-2">
                    Don&apos;t have a syllabus handy? Enter class details one at a
                    time — code, name, professor, schedule.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white border-2 border-[#E8E5FD] text-[#534AB7] font-extrabold text-sm md:text-base px-4 py-1.5 rounded-xl">
                    Enter class details
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </div>

            {/* What Atlas tracks per class */}
            <div className="mb-7">
              <p className="text-[13px] font-extrabold text-[#3a3a3d] uppercase tracking-widest mb-3">
                What Atlas tracks for each class
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { icon: BookOpen,  color: 'bg-[#534AB7]',   label: 'Topics covered',  desc: 'Every concept from lectures, tagged by week and unit.' },
                  { icon: Target,    color: 'bg-emerald-500', label: 'Grading weights', desc: 'Exam, quiz, homework percentages — auto-extracted.' },
                  { icon: BarChart2, color: 'bg-blue-500',    label: 'Your grades',     desc: 'Live grade tracking with projected final score.' },
                  { icon: Brain,     color: 'bg-orange-500',  label: 'Weak areas',      desc: 'Topics you missed, ranked for focused review.' },
                ].map((c) => (
                  <div key={c.label} className="bg-white border border-[#ECE9FF] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                        <c.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-[15px] font-extrabold text-[#1A1A2E] leading-tight">{c.label}</p>
                    </div>
                    <p className="text-[14px] text-[#6B6A8A] leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reassurance band */}
            <div className="relative overflow-hidden bg-[#d3cef3] border border-[#E8E5FD] rounded-2xl shadow-sm min-h-[120px]">
              <img
                src="https://res.cloudinary.com/mview/image/upload/atlas/classpage2.webp"
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#cec8f1] via-[#F4F2FF] via-50% to-transparent pointer-events-none" />
              <div className="relative z-10 px-5 py-5 flex items-start gap-3.5 md:max-w-[65%]">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Zap className="w-6 h-6 text-[#534AB7]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-extrabold text-[#1A1A2E]">Add as many classes as you need</p>
                  <p className="text-[14px] text-[#6B6A8A] leading-relaxed mt-0.5">
                    You can come back any time to add new classes, edit details, or remove old ones.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
        {showAdd && <ClassModal onClose={() => setShowAdd(false)} onSaved={loadClasses} />}
      </AppLayout>
    );
  }

  // ── Classes list ───────────────────────────────────────────────────────
  return (
    <AppLayout>
      <div className="p-3 md:p-4 lg:p-6 max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-50 via-violet-50 to-indigo-50 rounded-3xl overflow-hidden mb-5 shadow-sm border border-indigo-100 px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">My Classes</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  {classes[0]?.term || "Current term"} · {classes.length} class{classes.length !== 1 ? "es" : ""} · {totalCredits} credits
                </p>
              </div>
            </div>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/25">
              <Plus className="w-4 h-4" /> Add class
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: TrendingUp,  bg: "bg-indigo-50",  color: "text-indigo-600",  label: "Classes",      value: String(classes.length)         },
              { icon: Star,        bg: "bg-emerald-50", color: "text-emerald-600", label: "Avg grade",    value: avgGrade !== null ? `${avgGrade}%` : "—" },
              { icon: CheckCircle2,bg: "bg-blue-50",    color: "text-blue-600",    label: "Total credits",value: String(totalCredits)            },
              { icon: Brain,       bg: "bg-purple-50",  color: "text-purple-600",  label: "Total topics", value: String(classes.reduce((s, c) => s + c.topic_count, 0)) },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className={`text-xl font-extrabold ${s.color} leading-none`}>{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center gap-2 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search classes or instructors…"
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-400 shadow-sm" />
          </div>
          {search && <p className="text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No classes match &ldquo;{search}&rdquo;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {filtered.map((cls) => (
              <ClassCard key={cls.id} cls={cls}
                onEdit={(c) => setEditCls(c)}
                onDelete={(c) => setDeleteCls(c)} />
            ))}
          </div>
        )}
      </div>

      {showAdd    && <ClassModal onClose={() => setShowAdd(false)} onSaved={loadClasses} />}
      {editCls    && <ClassModal existing={editCls} onClose={() => setEditCls(null)} onSaved={loadClasses} />}
      {deleteCls  && <DeleteConfirm cls={deleteCls} onCancel={() => setDeleteCls(null)} onConfirm={handleDelete} deleting={deleting} />}
    </AppLayout>
  );
}
