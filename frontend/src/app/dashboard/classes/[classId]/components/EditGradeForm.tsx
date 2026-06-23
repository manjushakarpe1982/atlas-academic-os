"use client";
import { useState } from "react";
import { ArrowLeft, ChevronDown, Loader2 } from "lucide-react";
import { GradeItem, CATEGORIES } from "./shared";
import { API_BASE, getToken } from "@/lib/api";

interface Props {
  grade: GradeItem;
  classId: string;
  onBack: () => void;
  onSaved: () => void;
  onDelete: () => void;
}

export default function EditGradeForm({
  grade,
  classId,
  onBack,
  onSaved,
  onDelete,
}: Props) {
  const [title, setTitle] = useState(grade.title);
  const [category, setCategory] = useState(grade.category);
  const [score, setScore] = useState(String(grade.score));
  const [maxScore, setMaxScore] = useState(String(grade.max));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!score || isNaN(Number(score))) {
      setError("Enter a valid score");
      return;
    }
    if (!maxScore || isNaN(Number(maxScore)) || Number(maxScore) <= 0) {
      setError("Enter a valid max score");
      return;
    }

    setSaving(true);
    try {
      const token = getToken();
      const res = await fetch(
        `${API_BASE}/api/classes/${classId}/grades/${grade.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            category,
            score: Number(score),
            max_score: Number(maxScore),
          }),
        },
      );
      if (!res.ok) {
        setError("Failed to update grade");
        setSaving(false);
        return;
      }
      onSaved();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
        <button onClick={onBack}>
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-base font-extrabold text-gray-900">Edit Grade</h2>
      </div>
      <div className="px-4 py-4 space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-1.5">
            Assessment Name
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-1.5">
            Category
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none bg-white appearance-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1.5">
              Score
            </label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1.5">
              Out Of
            </label>
            <input
              type="number"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-1.5">
            Notes <span className="font-normal text-gray-400">(Optional)</span>
          </label>
          <textarea
            placeholder="Add notes..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none resize-none"
          />
        </div>

        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

        <div className="flex gap-3 ">
          <button
            onClick={onDelete}
            className="flex-1 border-2 border-red-200 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-all text-sm"
          >
            Delete Grade
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all text-sm disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
