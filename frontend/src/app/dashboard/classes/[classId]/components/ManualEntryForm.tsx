"use client";
import { useState } from "react";
import { ArrowLeft, ChevronDown, Loader2 } from "lucide-react";
import { CATEGORIES } from "./shared";
import { API_BASE, getToken } from "@/lib/api";

interface Props {
  classId: string;
  onBack: () => void;
  onSaved: () => void;
}

export default function ManualEntryForm({ classId, onBack, onSaved }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Quiz");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    if (!title.trim()) {
      setError("Assessment name is required");
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
    if (Number(score) > Number(maxScore)) {
      setError("Score cannot exceed max score");
      return;
    }

    setSaving(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/classes/${classId}/grades/add`, {
        method: "POST",
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
      });
      if (!res.ok) {
        setError("Failed to save grade");
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
        <h2 className="text-base font-extrabold text-gray-900">Add Grade</h2>
      </div>
      <div className="px-4 py-4 space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-1.5">
            Assessment Name
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Quiz 2"
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
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-600 focus:border-indigo-500 focus:outline-none bg-white appearance-none"
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
              placeholder="85"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-600 focus:border-indigo-500 focus:outline-none"
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
              placeholder="100"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-1.5">
            Date
          </label>
          <input
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-600 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-1.5">
            Notes <span className="font-normal text-gray-400">(Optional)</span>
          </label>
          <textarea
            placeholder="Add any notes about this grade..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-600 focus:border-indigo-500 focus:outline-none resize-none"
          />
        </div>

        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all text-base disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save Grade"
          )}
        </button>
      </div>
    </div>
  );
}
