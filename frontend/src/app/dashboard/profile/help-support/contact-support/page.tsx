"use client";
import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
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

export default function ContactSupportPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setSending(true);

    // Simulate sending
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setSubject("");
      setMessage("");
      setSelectedCategory("bug");

      // Reset success message after 3 seconds
      setTimeout(() => setSent(false), 3000);
    }, 1500);
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
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
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
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-2 rounded-xl flex flex-col items-center gap-2 transition-all border ${
                    selectedCategory === cat.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-2xl bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">{cat.icon}</span>
                  <span className="text-sm font-semibold text-gray-900 text-center">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="text-sm font-bold text-gray-800 block mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
            
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-500 bg-white text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-bold text-gray-800 block mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
             
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-500 bg-white text-sm placeholder:text-gray-400 resize-none"
            />
            <p className="text-xs text-gray-400 mt-2 text-right">
              {message.length}/500
            </p>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
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
      </div>
    </div>
  );
}
