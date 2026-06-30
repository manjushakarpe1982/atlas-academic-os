"use client";
import { useState, useImperativeHandle, forwardRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Check, Loader2, Upload } from "lucide-react";
import { api } from "@/lib/api";
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
              { id: "photo" as Tab, label: "Upload Photo" },
              { id: "screenshot" as Tab, label: "Screenshot" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
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
                                <p className="text-sm font-bold text-gray-900">
                                  {g.assessment}
                                </p>
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

            {/* UPLOAD PHOTO */}
            {tab === "photo" && (
              <div className="space-y-5">
                <div className="border-2 border-dashed border-indigo-400 bg-gray-50 rounded-xl  text-center flex flex-col items-center justify-center min-h-[300px]">
                  <span className="text-4xl block mb-2">📷</span>

                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Upload a photo of your gradebook
                  </p>

                  <p className="text-sm text-gray-500 max-w-[260px] mb-5">
                    Take a clear photo of your grade report and upload it here
                  </p>

                  <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200">
                    📷 Choose Photo
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl  p-3">
                  <p className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span>📷</span> Photo Tips
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✅</span>{" "}
                      <span>Make sure all text is clear and readable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✅</span>{" "}
                      <span>Include all grades if there are multiple</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✅</span>{" "}
                      <span>Supported formats: JPG, PNG, HEIC</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* SCREENSHOT */}
            {tab === "screenshot" && (
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
                  <p className="text-lg font-semibold text-gray-900 mb-1">
                    Upload Gradebook Screenshot
                  </p>
                  <p className="text-sm text-gray-600 max-w-[260px]">
                    Take a screenshot of your online gradebook
                  </p>
                </div>

                <button className="w-full max-w-[260px] flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-2xl font-semibold text-sm hover:bg-indigo-700 transition-all active:scale-[0.97]">
                  <Upload className="w-5 h-5" />
                  Upload Screenshot
                </button>

                <p className="text-xs text-blue-700 flex items-center gap-1.5">
                  🔒 Your data is private and secure
                </p>
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
