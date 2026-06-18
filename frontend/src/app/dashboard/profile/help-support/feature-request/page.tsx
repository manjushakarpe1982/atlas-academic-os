"use client";
import { useState } from "react";
import {
  ChevronDown,
  Upload,
  Info,
  Star,
  CheckCircle2,
  Copy,
  Calendar,
  HelpCircle,
  Bell,
  CalendarDays,
  ClipboardList,
  CircleHelp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import BackHeader from "../../BackHeader";
import Image from "next/image";

export default function FeatureRequestPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [importance, setImportance] = useState(0);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");

  const categories = [
    "Select a category",
    "UI/UX Improvement",
    "New Feature",
    "Performance",
    "Integration",
    "Other",
  ];

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // Generate request ID
    const newRequestId = `FR-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}/${Math.random().toString().slice(2, 7)}`;
    setRequestId(newRequestId);
    setSubmitted(true);
  };

  // Success Screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="Feature Request" />

        <div className="px-4 py-4 ">
          {/* Success Icon with Decorative Elements */}
          <div className="flex justify-center relative py-6">
            {/* Decorative dots */}
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-purple-400 rounded-full"></div>
            <div className="absolute top-2 right-1/4 w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="absolute bottom-0 left-1/3 w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full"></div>

            {/* Checkmark Circle */}
            <CheckCircle2 className="w-20 h-20 text-green-600 relative " />
          </div>

          {/* Thank You Message */}
          <div className="text-center space-y-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Thank you!</h1>
            <p className="text-sm text-gray-600">
              Your ideas have been submitted.
            </p>
            <p className="text-sm text-gray-600">
              We review every suggestion and prioritize features based on
              student needs.
            </p>
          </div>

          {/* Info Cards */}
          <div className="space-y-5 mb-5">
            <div className="bg-white border-2 p-3 border-gray-200 rounded-lg divide-y  divide-gray-200">
              {/* Request ID */}
              <div className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-indigo-600" />
                </div>

                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    Request ID
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
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
                  Stay in the loop
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  We'll notify you if there are any updates about your request.
                </p>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mt-2">
                  View My Requests →
                </button>
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

  // Form Screen
  return (
    <div className="">
      <BackHeader title="Feature Request" />

      <div className="px-4 py-4 ">
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
                onChange={(e) => setTitle(e.target.value.slice(0, 80))}
                placeholder="E.g., Add dark mode"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors placeholder-gray-400"
              />
              <div className="flex justify-end">
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
                onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
                placeholder="Describe your idea in detail. How would it help you and other students?"
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors placeholder-gray-400 resize-none"
              />
              <div className="flex justify-end">
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
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none" />
            </div>
          </div>

          {/* Importance Rating */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">
              How important is this for you?
            </label>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setImportance(star)}
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
            </div>
          </div>

          {/* Screenshot Upload */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-900">
              Attach screenshot (optional)
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
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition-all text-lg"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
}
