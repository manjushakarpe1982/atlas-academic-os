"use client";
import { useState } from "react";
import {
  ChevronDown,
  Upload,
  Star,
  CheckCircle2,
  Copy,
  CalendarDays,
  ClipboardList,
  CircleHelp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import BackHeader from "../../BackHeader";
import Image from "next/image";
import { API_BASE, getToken } from "@/lib/api";

const CATEGORIES = [
  { value: "",              label: "Select a category" },
  { value: "ui_ux",        label: "UI/UX Improvement" },
  { value: "new_feature",  label: "New Feature" },
  { value: "performance",  label: "Performance" },
  { value: "integration",  label: "Integration" },
  { value: "other",        label: "Other" },
];

interface ValidationError {
  field: string;
  message: string;
}

export default function FeatureRequestPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [importance, setImportance] = useState(0);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [serverError, setServerError] = useState("");

  // ── Validation ──
  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!title.trim()) {
      newErrors.push({ field: "title", message: "Feature title is required" });
    } else if (title.trim().length < 3) {
      newErrors.push({ field: "title", message: "Title must be at least 3 characters" });
    } else if (title.length > 80) {
      newErrors.push({ field: "title", message: "Title must be less than 80 characters" });
    }

    if (!description.trim()) {
      newErrors.push({ field: "description", message: "Description is required" });
    } else if (description.trim().length < 10) {
      newErrors.push({ field: "description", message: "Description must be at least 10 characters" });
    } else if (description.length > 1000) {
      newErrors.push({ field: "description", message: "Description must be less than 1000 characters" });
    }

    if (!category) {
      newErrors.push({ field: "category", message: "Please select a category" });
    } else if (!CATEGORIES.some((c) => c.value === category && c.value !== "")) {
      newErrors.push({ field: "category", message: "Invalid category selected" });
    }

    if (importance < 1 || importance > 5) {
      newErrors.push({ field: "importance", message: "Please rate the importance (1-5 stars)" });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find((e) => e.field === field)?.message;
  };

  const clearFieldError = (field: string) => {
    setErrors(errors.filter((e) => e.field !== field));
  };

  // ── Screenshot handling ──
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        setErrors([...errors, { field: "screenshot", message: "Please select an image file (PNG, JPG)" }]);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors([...errors, { field: "screenshot", message: "File must be less than 5MB" }]);
        return;
      }
      clearFieldError("screenshot");
      setScreenshot(file);
    }
  };

  // ── Submit to backend API ──
  const handleSubmit = async () => {
    setServerError("");

    if (!validateForm()) return;

    setSending(true);

    try {
      const token = getToken();
      if (!token) {
        setServerError("You must be logged in to submit a request. Please sign in and try again.");
        setSending(false);
        return;
      }

      const response = await fetch(`${API_BASE}/api/support/feature-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category: category,
          importance: importance,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setServerError(errorData.detail || "Failed to submit feature request. Please try again.");
        setSending(false);
        return;
      }

      const data = await response.json();

      // Success
      setRequestId(data.id);
      setSubmitted(true);
      setErrors([]);
    } catch (error) {
      console.error("Error submitting feature request:", error);
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  // ── Category label helper ──
  const getCategoryLabel = (val: string) =>
    CATEGORIES.find((c) => c.value === val)?.label || val;

  // ══════════════════════════════════════════════════════════════
  // SUCCESS SCREEN
  // ══════════════════════════════════════════════════════════════
  if (submitted) {
    return (
      <div className="">
        <BackHeader title="Feature Request" />

        <div className="px-4 py-4">
          {/* Success Icon */}
          <div className="flex justify-center relative py-6">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-purple-400 rounded-full" />
            <div className="absolute top-2 right-1/4 w-2 h-2 bg-yellow-400 rounded-full" />
            <div className="absolute bottom-0 left-1/3 w-2 h-2 bg-blue-400 rounded-full" />
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full" />
            <CheckCircle2 className="w-20 h-20 text-green-600 relative" />
          </div>

          {/* Thank You */}
          <div className="text-center space-y-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Thank you!</h1>
            <p className="text-sm text-gray-600">
              Your idea has been submitted.
            </p>
            <p className="text-sm text-gray-600">
              We review every suggestion and prioritize features based on
              student needs.
            </p>
          </div>

          {/* Info Cards */}
          <div className="space-y-5 mb-5">
            <div className="bg-white border-2 p-3 border-gray-200 rounded-lg divide-y divide-gray-200">
              {/* Request ID */}
              <div className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    Request ID
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1 break-all">
                    {requestId}
                  </p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(requestId)}
                  className="text-gray-400 hover:text-gray-600 shrink-0"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>

              {/* Submitted On */}
              <div className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    Submitted On
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    at{" "}
                    {new Date().toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>

              {/* What's Next */}
              <div className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <CircleHelp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    What's Next?
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    We'll review your idea and may reach out if we need more
                    details.
                  </p>
                </div>
              </div>
            </div>

            {/* Stay in the loop */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg mt-4 p-4 flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🔔</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-bold uppercase">
                  Stored in Supabase
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  Your request is securely saved and visible to the admin team.
                  We'll notify you if there are any updates.
                </p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => router.push("/dashboard/profile/help-support")}
            className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition-all text-base flex items-center justify-center gap-2"
          >
            Back to Help & Support
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // FORM SCREEN
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="">
      <BackHeader title="Feature Request" />

      <div className="px-4 py-4">
        {/* Hero Section */}
        <div className="text-center mb-4">
          <Image
            src="https://res.cloudinary.com/mview/image/upload/v1781769622/atlas/helpsupportpage.png"
            alt="Feature Request Illustration"
            width={300}
            height={120}
            className="mx-auto"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Help us make Atlas better
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Share your ideas and suggestions. We'd love to hear from you!
            </p>
          </div>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-900">Error</h3>
              <p className="text-sm text-red-700 mt-1">{serverError}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-3 mb-4 bg-white rounded-lg p-4 border border-gray-200">
          {/* Feature Title */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-900">
              Feature Title <span className="text-red-500">*</span>
            </label>
            <div className="space-y-1">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value.slice(0, 80));
                  clearFieldError("title");
                }}
                placeholder="E.g., Add dark mode"
                className={`w-full border rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors placeholder-gray-400 ${
                  getFieldError("title")
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200"
                }`}
              />
              <div className="flex items-center justify-between">
                {getFieldError("title") ? (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {getFieldError("title")}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-gray-500">
                  {title.length}/80 characters
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-900">
              Description <span className="text-red-500">*</span>
            </label>
            <div className="space-y-1">
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value.slice(0, 1000));
                  clearFieldError("description");
                }}
                placeholder="Describe your idea in detail. How would it help you and other students?"
                rows={4}
                className={`w-full border rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors placeholder-gray-400 resize-none ${
                  getFieldError("description")
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200"
                }`}
              />
              <div className="flex items-center justify-between">
                {getFieldError("description") ? (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {getFieldError("description")}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-gray-500">
                  {description.length}/1000 characters
                </span>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-900">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  clearFieldError("category");
                }}
                className={`w-full border rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer ${
                  getFieldError("category")
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200"
                }`}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none" />
            </div>
            {getFieldError("category") && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {getFieldError("category")}
              </p>
            )}
          </div>

          {/* Importance Rating */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">
              How important is this for you? <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setImportance(star);
                      clearFieldError("importance");
                    }}
                    className="transition-all"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        importance >= star
                          ? "fill-purple-500 text-purple-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {importance > 0 && (
                <span className="text-xs text-gray-500">
                  {importance === 1
                    ? "Nice to have"
                    : importance === 2
                    ? "Somewhat useful"
                    : importance === 3
                    ? "Important"
                    : importance === 4
                    ? "Very important"
                    : "Critical need"}
                </span>
              )}
            </div>
            {getFieldError("importance") && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {getFieldError("importance")}
              </p>
            )}
          </div>

          {/* Screenshot Upload */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-900">
              Attach screenshot <span className="font-normal text-gray-500">(optional)</span>
            </label>
            <label className="block">
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleScreenshotUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-indigo-300 rounded-xl p-6 hover:bg-indigo-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2">
                <Upload className="w-8 h-8 text-indigo-600" />
                <p className="text-sm font-bold text-indigo-600">
                  Upload image
                </p>
                <p className="text-xs text-gray-600">PNG, JPG up to 5MB</p>
                {screenshot && (
                  <p className="text-xs text-green-600 mt-2">
                    ✓ {screenshot.name}
                  </p>
                )}
              </div>
            </label>
            {getFieldError("screenshot") && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {getFieldError("screenshot")}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={sending}
          className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition-all text-lg disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {sending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
            </>
          ) : (
            "Submit Request"
          )}
        </button>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mt-6 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">ℹ️</span>
          <div>
            <p className="text-sm font-bold text-blue-900">
              Your request is securely stored
            </p>
            <p className="text-xs text-blue-700 mt-1">
              All feature requests are saved in our database. The admin team can view and prioritize every request directly in Supabase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
