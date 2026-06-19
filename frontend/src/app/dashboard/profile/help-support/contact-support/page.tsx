"use client";
import { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import BackHeader from "../../BackHeader";
import Image from "next/image";

const ISSUE_CATEGORIES = [
  { id: "bug", label: "Bug", icon: "🐛" },
  { id: "billing", label: "Billing", icon: "💳" },
  { id: "account", label: "Account", icon: "👤" },
  { id: "calendar", label: "Calendar", icon: "📅" },
  { id: "ai-study", label: "AI / Study Plan", icon: "✨" },
  { id: "other", label: "Other", icon: "⭕" },
];

interface ValidationError {
  field: string;
  message: string;
}

export default function ContactSupportPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [serverError, setServerError] = useState("");

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!selectedCategory.trim()) {
      newErrors.push({
        field: "category",
        message: "Please select an issue category",
      });
    }

    if (!subject.trim()) {
      newErrors.push({ field: "subject", message: "Subject is required" });
    } else if (subject.trim().length < 5) {
      newErrors.push({
        field: "subject",
        message: "Subject must be at least 5 characters",
      });
    } else if (subject.length > 255) {
      newErrors.push({
        field: "subject",
        message: "Subject must be less than 255 characters",
      });
    }

    if (!message.trim()) {
      newErrors.push({ field: "message", message: "Message is required" });
    } else if (message.trim().length < 10) {
      newErrors.push({
        field: "message",
        message: "Message must be at least 10 characters",
      });
    } else if (message.length > 5000) {
      newErrors.push({
        field: "message",
        message: "Message must be less than 5000 characters",
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/support/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: selectedCategory,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setServerError(
          errorData.detail || "Failed to submit support request. Please try again."
        );
        setSending(false);
        return;
      }

      const data = await response.json();

      // Success!
      setSent(true);
      setSubject("");
      setMessage("");
      setSelectedCategory("");
      setErrors([]);

      // Reset success message after 5 seconds
      setTimeout(() => setSent(false), 5000);
    } catch (error) {
      console.error("Error submitting support request:", error);
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find((e) => e.field === field)?.message;
  };

  return (
    <div className="">
      <BackHeader title="Contact Support" />

      <div className="px-4 py-4">
        {/* Hero Section with Illustration */}
        <div className="flex flex-col items-center text-center mb-4">
          {/* Illustration */}
          <Image
            src="https://res.cloudinary.com/mview/image/upload/v1781688919/atlas/supportpage3.png"
            alt="Support Illustration"
            width={300}
            height={120}
          />

          {/* Title and Description */}
          <div className="mt-4">
            <h1 className="text-2xl font-extrabold text-gray-900">
              We're here to help!
            </h1>
            <p className="text-gray-600 text-sm mt-2 leading-relaxed max-w-xs">
              Send us a message and our team will get back to you soon.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {sent && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-green-900">Message sent!</h3>
              <p className="text-sm text-green-700 mt-1">
                Thank you for reaching out. We'll get back to you within 24
                hours.
              </p>
            </div>
          </div>
        )}

        {/* Server Error Message */}
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
          {/* Issue Category */}
          <div>
            <label className="text-base font-bold text-gray-800 block mb-3">
              What is your issue about?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ISSUE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setErrors(errors.filter((e) => e.field !== "category"));
                  }}
                  className={`p-2 rounded-lg flex flex-col items-center gap-2 transition-all border ${
                    selectedCategory === cat.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-2xl bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                    {cat.icon}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 text-center">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
            {getFieldError("category") && (
              <p className="text-xs text-red-600 mt-2">{getFieldError("category")}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="text-sm font-bold text-gray-800 block mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setErrors(errors.filter((e) => e.field !== "subject"));
              }}
              placeholder="Enter subject"
              maxLength={255}
              className={`w-full px-4 py-3 border rounded-lg outline-none focus:border-indigo-500 bg-white text-sm placeholder:text-gray-400 transition-colors ${
                getFieldError("subject")
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200"
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {getFieldError("subject") && (
                <p className="text-xs text-red-600">{getFieldError("subject")}</p>
              )}
              <p className="text-xs text-gray-400 ml-auto">
                {subject.length}/255
              </p>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-bold text-gray-800 block mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setErrors(errors.filter((e) => e.field !== "message"));
              }}
              placeholder="Type your message..."
              maxLength={5000}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg outline-none focus:border-indigo-500 bg-white text-sm placeholder:text-gray-400 resize-none transition-colors ${
                getFieldError("message")
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200"
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {getFieldError("message") && (
                <p className="text-xs text-red-600">{getFieldError("message")}</p>
              )}
              <p className="text-xs text-gray-400 ml-auto">
                {message.length}/5000
              </p>
            </div>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                Send Message <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mt-6 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">ℹ️</span>
          <div>
            <p className="text-sm font-bold text-blue-900">
              Your request is securely stored
            </p>
            <p className="text-xs text-blue-700 mt-1">
              All support requests are saved in our system. You can track the
              status of your request in your support history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
