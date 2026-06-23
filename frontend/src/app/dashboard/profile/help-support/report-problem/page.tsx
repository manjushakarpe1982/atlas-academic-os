"use client";
import { useState, useRef } from "react";
import { Cloud, Loader2, CheckCircle2, AlertCircle, Copy, CalendarDays, ClipboardList, CircleHelp } from "lucide-react";
import { useRouter } from "next/navigation";
import BackHeader from "../../BackHeader";
import Image from "next/image";
import { API_BASE, getToken } from "@/lib/api";

const SEVERITY_OPTIONS = [
  {
    id: "low",
    label: "Low",
    description: "Minor issue, not blocking",
    color: "text-green-600 border-green-300 bg-green-50",
    activeColor: "text-green-700 border-green-500 bg-green-100 ring-2 ring-green-200",
  },
  {
    id: "medium",
    label: "Medium",
    description: "Affects workflow",
    color: "text-yellow-600 border-yellow-300 bg-yellow-50",
    activeColor: "text-yellow-700 border-yellow-500 bg-yellow-100 ring-2 ring-yellow-200",
  },
  {
    id: "high",
    label: "High",
    description: "Blocking issue",
    color: "text-red-600 border-red-300 bg-red-50",
    activeColor: "text-red-700 border-red-500 bg-red-100 ring-2 ring-red-200",
  },
];

interface ValidationError {
  field: string;
  message: string;
}

export default function ReportProblemPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [reportId, setReportId] = useState("");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [serverError, setServerError] = useState("");

  // ── Validation ──
  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!description.trim()) {
      newErrors.push({ field: "description", message: "Please describe the issue" });
    } else if (description.trim().length < 10) {
      newErrors.push({ field: "description", message: "Description must be at least 10 characters" });
    } else if (description.length > 2000) {
      newErrors.push({ field: "description", message: "Description must be less than 2000 characters" });
    }

    if (!severity) {
      newErrors.push({ field: "severity", message: "Please select a severity level" });
    } else if (!["low", "medium", "high"].includes(severity)) {
      newErrors.push({ field: "severity", message: "Invalid severity level" });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find((e) => e.field === field)?.message;
  };

  // ── Screenshot handling ──
  const handleScreenshotSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors([{ field: "screenshot", message: "Please select an image file (PNG, JPG, WebP)" }]);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors([{ field: "screenshot", message: "File must be less than 10MB" }]);
      return;
    }

    setErrors(errors.filter((e) => e.field !== "screenshot"));
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
      fileInputRef.current.value = "";
    }
  };

  // ── Submit to backend API ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    setSending(true);

    try {
      const token = getToken();
      if (!token) {
        setServerError("You must be logged in to submit a report. Please sign in and try again.");
        setSending(false);
        return;
      }

      const response = await fetch(`${API_BASE}/api/support/report-problem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: description.trim(),
          severity: severity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setServerError(errorData.detail || "Failed to submit report. Please try again.");
        setSending(false);
        return;
      }

      const data = await response.json();

      // Success
      setReportId(data.id);
      setSent(true);
      setErrors([]);
    } catch (error) {
      console.error("Error submitting problem report:", error);
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  // ── Success Screen ──
  if (sent) {
    return (
      <div className="">
        <BackHeader title="Report a Problem" />

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
            <h1 className="text-3xl font-bold text-gray-900">Report Submitted!</h1>
            <p className="text-sm text-gray-600">
              Thank you for letting us know. Our team will investigate and work on a fix.
            </p>
          </div>

          {/* Info Cards */}
          <div className="space-y-5 mb-5">
            <div className="bg-white border-2 p-3 border-gray-200 rounded-lg divide-y divide-gray-200">
              {/* Report ID */}
              <div className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-bold uppercase">Report ID</p>
                  <p className="text-sm font-bold text-gray-900 mt-1 break-all">{reportId}</p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(reportId)}
                  className="text-gray-400 hover:text-gray-600 shrink-0"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>

              {/* Severity */}
              <div className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Severity</p>
                  <p className="text-sm font-bold text-gray-900 mt-1 capitalize">{severity}</p>
                </div>
              </div>

              {/* Submitted On */}
              <div className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Submitted On</p>
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
                  <p className="text-xs text-gray-500 font-bold uppercase">What's Next?</p>
                  <p className="text-sm text-gray-700 mt-1">
                    Our team will review this report and work on a fix. We'll notify you when it's resolved.
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
                <p className="text-sm text-gray-500 font-bold uppercase">Stored in Supabase</p>
                <p className="text-sm text-gray-700 mt-1">
                  Your report is securely saved and visible to the admin team. We'll notify you if there are any updates.
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

  // ── Form Screen ──
  return (
    <div className="">
      <BackHeader title="Report a Problem" />

      <div className="px-4 py-3">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Image
            src="https://res.cloudinary.com/mview/image/upload/v1781689309/atlas/supportpage4.png"
            alt="Report Problem"
            width={300}
            height={100}
            className="mb-2"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Something not working?
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Let us know what happened so we can fix it as soon as possible.
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
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Description */}
          <div>
            <label className="text-base font-bold text-gray-800 block mb-2">
              What went wrong? <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors(errors.filter((err) => err.field !== "description"));
                }}
                placeholder="Please describe the issue in detail. What were you doing? What happened? What did you expect to happen?"
                rows={4}
                maxLength={2000}
                className={`w-full px-4 py-3 text-sm border rounded-lg outline-none focus:border-indigo-500 bg-white resize-none placeholder:text-gray-400 pr-20 transition-colors ${
                  getFieldError("description")
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200"
                }`}
              />
              <p className="absolute bottom-3 right-4 text-xs text-gray-400 pointer-events-none">
                {description.length}/2000
              </p>
            </div>

            {getFieldError("description") && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {getFieldError("description")}
              </p>
            )}
          </div>

          {/* Screenshot Upload */}
          <div>
            <label className="text-base font-bold text-gray-800 block mb-2">
              Upload Screenshot{" "}
              <span className="font-normal text-gray-500">(optional)</span>
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
                <p className="text-base font-semibold text-purple-600">
                  Tap to upload
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  PNG, JPG up to 10MB
                </p>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleScreenshotSelect}
              className="hidden"
            />

            {getFieldError("screenshot") && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {getFieldError("screenshot")}
              </p>
            )}
          </div>

          {/* Severity */}
          <div>
            <label className="text-base font-bold text-gray-900 block mb-2">
              Severity <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {SEVERITY_OPTIONS.map((sev) => (
                <button
                  key={sev.id}
                  type="button"
                  onClick={() => {
                    setSeverity(sev.id);
                    setErrors(errors.filter((err) => err.field !== "severity"));
                  }}
                  className={`flex-1 py-2 rounded-lg font-semibold text-[13px] border transition-all ${
                    severity === sev.id ? sev.activeColor : sev.color
                  }`}
                >
                  <span className="block">{sev.label}</span>
                  <span className="block text-[10px] font-normal mt-0.5 opacity-70">
                    {sev.description}
                  </span>
                </button>
              ))}
            </div>
            {getFieldError("severity") && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {getFieldError("severity")}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-indigo-600 text-white text-base font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>Submit Report 🔔</>
            )}
          </button>
        </form>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mt-6 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">ℹ️</span>
          <div>
            <p className="text-sm font-bold text-blue-900">
              Your report is securely stored
            </p>
            <p className="text-xs text-blue-700 mt-1">
              All problem reports are saved in our database. The admin team can view and track every report directly in Supabase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
